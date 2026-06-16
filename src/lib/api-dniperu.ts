const AJAX_URL = 'https://dniperu.com/wp-admin/admin-ajax.php';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

interface TokenData {
  cc_token: string;
  cc_sig: string;
}

const TOKEN_HEADERS = {
  'User-Agent': USER_AGENT,
  'Accept': 'application/json',
  'Origin': 'https://dniperu.com',
  'X-Requested-With': 'XMLHttpRequest',
};

export type TokenMeta = {
  cc_token: string;
  cc_sig: string;
  expires_at: number;
  ttl: number;
};

export const DNIPERU_TOKEN_CONFIG = {
  tokenAction: 'cc_get_tokens',
  maxPool: 1,
  initialPool: 0,
  minValidSeconds: 15,
  fallbackTtlSeconds: 120,
  requiredHeaders: ['Origin', 'X-Requested-With', 'User-Agent'],
  ipBound: false,
  crossContext: false,
  fields: {
    buscar_nombres: { field: 'dni4', needsToken: false, status: 'operational' as const },
    buscar_fecha: { field: 'dni', needsToken: true, status: 'server_error' as const },
    buscar_ubigeo: { field: 'dni', needsToken: true, status: 'server_error' as const },
    buscar_dni: { field: 'nombres+apellidos', needsToken: true, status: 'unknown' as const },
  },
};

async function getToken(context: string): Promise<TokenMeta> {
  const body = new URLSearchParams();
  body.append('action', 'cc_get_tokens');
  body.append('context', context);
  body.append('company', '');
  body.append('count', '1');

  const res = await fetch(AJAX_URL, {
    method: 'POST',
    headers: TOKEN_HEADERS,
    body,
  });

  const json = await res.json();

  if (!json.success || !json.data) {
    throw new Error(json.data?.message || 'No se pudo obtener token de consulta');
  }

  const raw = Array.isArray(json.data.tokens) && json.data.tokens.length > 0
    ? json.data.tokens[0]
    : json.data;

  if (!raw.cc_token || !raw.cc_sig) {
    throw new Error('Token inválido recibido del servidor');
  }

  return {
    cc_token: raw.cc_token,
    cc_sig: raw.cc_sig,
    expires_at: json.data.expires_at ?? raw.expires_at ?? 0,
    ttl: json.data.ttl ?? 120,
  };
}

async function executeSearch(
  action: string,
  fields: Record<string, string>,
  tokenContext: string,
): Promise<any> {
  const buildBody = (token?: TokenData) => {
    const fd = new URLSearchParams();
    fd.append('action', action);
    for (const [k, v] of Object.entries(fields)) {
      fd.append(k, v);
    }
    fd.append('company', '');
    if (token) {
      fd.append('cc_token', token.cc_token);
      fd.append('cc_sig', token.cc_sig);
    }
    return fd;
  };

  const first = await fetch(AJAX_URL, {
    method: 'POST',
    headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json' },
    body: buildBody(),
  });

  const json = await first.json();

  if (json?.data?.code === 'token_required') {
    const token = await getToken(tokenContext);

    const retry = await fetch(AJAX_URL, {
      method: 'POST',
      headers: TOKEN_HEADERS,
      body: buildBody(token),
    });

    return await retry.json();
  }

  return json;
}

function parseNombresMessage(dni: string, rawMessage: string) {
  const lines = rawMessage.split('\n').filter(Boolean);

  const extract = (label: string) => {
    const line = lines.find((l: string) =>
      l.toLowerCase().startsWith(label.toLowerCase()),
    );
    return line ? line.replace(new RegExp(`^${label}:?\\s*`, 'i'), '').trim() : '';
  };

  const nombres = extract('Nombres');
  const apellido_paterno = extract('Apellido Paterno');
  const apellido_materno = extract('Apellido Materno');

  return {
    numero: dni,
    nombre_completo: `${apellido_paterno} ${apellido_materno}, ${nombres}`.replace(/\s+,/, ',').trim(),
    nombres,
    apellido_paterno,
    apellido_materno,
    codigo_verificacion: extract('Codigo de Verificacion'),
    direccion: extract('Dirección'),
    proveedor: 'dniperu.com' as const,
  };
}

export const ApiDniperu = {
  async consultarNombres(dni: string) {
    const resp = await executeSearch('buscar_nombres', { dni4: dni }, 'buscar_nombres');

    if (resp.success && resp.data?.message) {
      return {
        success: true,
        data: parseNombresMessage(dni, resp.data.message),
      };
    }

    return {
      success: false,
      data: null,
      message: resp.data?.message || 'No se encontraron resultados',
    };
  },

  async consultarFechaNacimiento(dni: string) {
    const resp = await executeSearch('buscar_fecha', { dni }, 'buscar_fecha');

    if (resp.success && resp.data?.fechaNacimiento) {
      return {
        success: true,
        data: {
          dni: resp.data.dni,
          fecha_nacimiento: resp.data.fechaNacimiento,
          nombres: resp.data.nombres,
          proveedor: 'dniperu.com' as const,
        },
      };
    }

    const mensaje = resp.success === false && resp.data?.message
      ? resp.data.message
      : resp?.message || 'No se encontraron resultados';

    return {
      success: false,
      data: null,
      message: mensaje === 'Error interno'
        ? 'El endpoint buscar_fecha no está disponible actualmente (error interno del servidor)'
        : mensaje,
    };
  },

  async consultarUbigeo(dni: string) {
    const resp = await executeSearch('buscar_ubigeo', { dni }, 'buscar_ubigeo');

    if (resp.success && resp.data?.ubigeo) {
      return {
        success: true,
        data: {
          dni: resp.data.dni,
          ubigeo: resp.data.ubigeo,
          nombres: resp.data.nombres,
          proveedor: 'dniperu.com' as const,
        },
      };
    }

    const mensaje = resp.success === false && resp.data?.message
      ? resp.data.message
      : resp?.message || 'No se encontraron resultados';

    return {
      success: false,
      data: null,
      message: mensaje === 'Error interno'
        ? 'El endpoint buscar_ubigeo no está disponible actualmente (error interno del servidor)'
        : mensaje,
    };
  },

  async consultarDniPorNombre(nombres: string, apellidoPaterno: string, apellidoMaterno: string) {
    const resp = await executeSearch(
      'buscar_dni',
      { nombres, apellido_paterno: apellidoPaterno, apellido_materno: apellidoMaterno },
      'buscar_dni',
    );

    if (resp.success && resp.data?.resultados) {
      return {
        success: true,
        data: {
          resultados: resp.data.resultados.map((r: any) => ({
            numero: r.numero,
            nombres: r.nombres,
            apellido_paterno: r.apellido_paterno,
            apellido_materno: r.apellido_materno,
          })),
          proveedor: 'dniperu.com' as const,
        },
      };
    }

    return {
      success: false,
      data: null,
      message: resp.data?.message || resp?.message || 'No se encontraron resultados',
    };
  },
};
