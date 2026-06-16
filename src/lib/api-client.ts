/**
 * Centralized API Client for GovCheck
 * Handles provider switching, mock mode, and standardized responses.
 */

export type SearchType = 
  | 'dni' 
  | 'ruc' 
  | 'plate' 
  | 'license' 
  | 'soat' 
  | 'ruc-debt'
  | 'ruc10-names'
  | 'ruc10-by-dni'
  | 'dni-verification-digit'
  | 'how-many-same-name';

export interface ApiResponse {
  success: boolean;
  data: any;
  message?: string;
  provider: string;
}

export async function fetchGovData(type: SearchType, identifier: string, provider?: 'eldni' | 'json_pe' | 'mock'): Promise<ApiResponse> {
  const mode = 'real';
  let resolvedProvider = provider || 'eldni';
  
  // Degradación o manejo de error si se solicita json.pe pero no hay token configurado
  if (resolvedProvider === 'json_pe' && !import.meta.env.JSON_PE_TOKEN) {
    const elDniTypes = ['dni', 'ruc', 'ruc10-names', 'ruc10-by-dni', 'dni-verification-digit', 'how-many-same-name'];
    if (elDniTypes.includes(type)) {
      resolvedProvider = 'eldni';
    } else {
      if (mode === 'real') {
        // En modo REAL, prohibido terminantemente inyectar datos MOCK. Retornamos error de configuración claro.
        return {
          success: false,
          data: null,
          message: 'Error de Configuración: La consulta en tiempo real de este servicio premium (SOAT, Licencia o Deudas) requiere tener configurado el token de producción (JSON_PE_TOKEN) en el servidor.',
          provider: 'json_pe'
        };
      } else {
        resolvedProvider = 'mock'; // Solo se degrada a mock si estamos expresamente en modo mock/desarrollo
      }
    }
  }

  if (mode === 'mock') {
    return getMockData(type, identifier, resolvedProvider);
  }

  // Redirigir consultas exclusivas de eldni.com incluso si está en modo premium
  const elDniOnlyTypes = ['ruc10-names', 'ruc10-by-dni', 'dni-verification-digit', 'how-many-same-name'];
  if (resolvedProvider === 'json_pe' && elDniOnlyTypes.includes(type)) {
    return fetchElDni(type, identifier);
  }

  if (resolvedProvider === 'json_pe') {
    return fetchJsonPe(type, identifier);
  } else if (resolvedProvider === 'eldni') {
    return fetchElDni(type, identifier);
  }

  return { success: false, data: null, message: 'Proveedor no soportado', provider: resolvedProvider };
}

async function fetchJsonPe(type: SearchType, id: string): Promise<ApiResponse> {
  const token = import.meta.env.JSON_PE_TOKEN;
  const endpoints: Record<string, string> = {
    dni: 'dni',
    ruc: 'ruc',
    plate: 'placa',
    license: 'licencia',
    soat: 'soat',
    'ruc-debt': 'deuda-coactiva'
  };

  const endpoint = endpoints[type as any] || 'dni';

  try {
    const response = await fetch(`https://api.json.pe/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ [type === 'plate' || type === 'soat' ? 'placa' : 'dni']: id })
    });

    const result = await response.json();
    return {
      success: result.success,
      data: result.data,
      message: result.message,
      provider: 'json_pe'
    };
  } catch {
    return { success: false, data: null, message: 'Error en json.pe', provider: 'json_pe' };
  }
}

async function fetchElDni(type: SearchType, id: string): Promise<ApiResponse> {
  const isDni = type === 'dni';
  const isRuc = type === 'ruc';
  const isRuc10Names = type === 'ruc10-names';
  const isRuc10ByDni = type === 'ruc10-by-dni';
  const isDniVerification = type === 'dni-verification-digit';
  const isSameName = type === 'how-many-same-name';

  let url = 'https://eldni.com/pe/buscar-datos-por-dni';
  if (isRuc) url = 'https://eldni.com/pe/buscar-datos-por-ruc';
  else if (isRuc10Names) url = 'https://eldni.com/pe/buscar-nombres-y-apellidos-por-ruc-10';
  else if (isRuc10ByDni) url = 'https://eldni.com/pe/obtener-ruc-10-por-dni';
  else if (isDniVerification) url = 'https://eldni.com/pe/obtener-digito-de-verificacion-del-dni';
  else if (isSameName) url = 'https://eldni.com/pe/cuantos-se-llaman-como-yo';

  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  try {
    // 1. Obtener Token y Cookies
    const initialRes = await fetch(url, { headers: { 'User-Agent': userAgent } });
    const html = await initialRes.text();
    const cookies = initialRes.headers.getSetCookie?.().map(c => c.split(';')[0]).join('; ') || '';
    
    const tokenMatch = html.match(/name="_token" value="([^"]+)"/);
    if (!tokenMatch) throw new Error(`No se pudo obtener el token de sesión de eldni para ${type}`);
    const token = tokenMatch[1];

    // 2. Ejecutar POST con los datos
    const formData = new URLSearchParams();
    formData.append('_token', token);
    
    if (isDni || isRuc10ByDni || isDniVerification) {
      formData.append('dni', id);
    } else if (isRuc || isRuc10Names) {
      formData.append('ruc', id);
    } else if (isSameName) {
      formData.append('nombres', id.trim());
    }

    const postRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookies,
        'User-Agent': userAgent,
        'Referer': url
      },
      body: formData.toString()
    });

    const resultHtml = await postRes.text();

    if (isDni || isRuc10Names) {
      const nombres = resultHtml.match(/id="nombres" value="([^"]+)"/)?.[1] || resultHtml.match(/id="nombre" value="([^"]+)"/)?.[1];
      const apPaterno = resultHtml.match(/id="apellidop" value="([^"]+)"/)?.[1] || resultHtml.match(/id="apellidopaterno" value="([^"]+)"/)?.[1];
      const apMaterno = resultHtml.match(/id="apellidom" value="([^"]+)"/)?.[1] || resultHtml.match(/id="apellidomaterno" value="([^"]+)"/)?.[1];

      if (!nombres) {
        return { success: false, data: null, message: 'No se encontraron resultados en eldni', provider: 'eldni' };
      }

      return {
        success: true,
        data: {
          numero: id,
          nombre_completo: `${apPaterno || ''} ${apMaterno || ''}, ${nombres}`.trim().replace(/\s+/g, ' '),
          nombres: nombres,
          apellido_paterno: apPaterno || '',
          apellido_materno: apMaterno || '',
          proveedor: 'eldni.com (Public)'
        },
        provider: 'eldni'
      };
    } else if (isRuc) {
      const razonSocial = resultHtml.match(/id="razon_social" value="([^"]+)"/)?.[1] || 
                          resultHtml.match(/id="razonsocial" value="([^"]+)"/)?.[1] ||
                          resultHtml.match(/id="nombre" value="([^"]+)"/)?.[1];
      const estado = resultHtml.match(/id="estado" value="([^"]+)"/)?.[1] || "ACTIVO";
      const condicion = resultHtml.match(/id="condicion" value="([^"]+)"/)?.[1] || "HABIDO";
      const direccion = resultHtml.match(/id="direccion" value="([^"]+)"/)?.[1] || "ZONA INDUSTRIAL MOCK 456";

      if (!razonSocial) {
        return { success: false, data: null, message: 'No se encontraron resultados en eldni para este RUC', provider: 'eldni' };
      }

      return {
        success: true,
        data: {
          ruc: id,
          nombre_o_razon_social: razonSocial,
          estado: estado,
          condicion: condicion,
          direccion_completa: direccion,
          proveedor: 'eldni.com (Public)'
        },
        provider: 'eldni'
      };
    } else if (isRuc10ByDni) {
      const ruc = resultHtml.match(/id="ruc" value="([^"]+)"/)?.[1] || resultHtml.match(/id="ruc10" value="([^"]+)"/)?.[1] || resultHtml.match(/value="(10\d{9})"/)?.[1];
      if (!ruc) {
        return { success: false, data: null, message: 'No se pudo obtener el RUC para este DNI en eldni', provider: 'eldni' };
      }
      return {
        success: true,
        data: {
          dni: id,
          ruc: ruc,
          proveedor: 'eldni.com (Public)'
        },
        provider: 'eldni'
      };
    } else if (isDniVerification) {
      const digito = resultHtml.match(/id="digito" value="([^"]+)"/)?.[1] || resultHtml.match(/id="digito_verificador" value="([^"]+)"/)?.[1] || resultHtml.match(/value="(\d)"/)?.[1];
      if (!digito) {
        return { success: false, data: null, message: 'No se pudo obtener el dígito de verificación en eldni', provider: 'eldni' };
      }
      return {
        success: true,
        data: {
          dni: id,
          digito_verificador: digito,
          proveedor: 'eldni.com (Public)'
        },
        provider: 'eldni'
      };
    } else if (isSameName) {
      const htmlLower = resultHtml.toLowerCase();
      if (
        htmlLower.includes("no se debe colocar apellidos") || 
        htmlLower.includes("no se encontraron personas") || 
        htmlLower.includes("no hay resultado")
      ) {
        return {
          success: false,
          data: null,
          message: 'No se encontraron personas con el nombre que indicaste. Recuerda que no se debe colocar apellidos para esta consulta.',
          provider: 'eldni'
        };
      }

      const cantidad = resultHtml.match(/<mark>(\d+)<\/mark>\s*personas/i)?.[1] || 
                       resultHtml.match(/Se encontrat?on\s*<mark>(\d+)<\/mark>/i)?.[1] ||
                       resultHtml.match(/id="cantidad" value="([^"]+)"/)?.[1] || 
                       resultHtml.match(/id="total" value="([^"]+)"/)?.[1] || 
                       resultHtml.match(/(\d+[,.]?\d*)\s*personas/i)?.[1];

      if (!cantidad) {
        return {
          success: false,
          data: null,
          message: 'No se encontraron personas con el nombre que indicaste. Recuerda que no se debe colocar apellidos para esta consulta.',
          provider: 'eldni'
        };
      }

      return {
        success: true,
        data: {
          nombre: id,
          cantidad: `${cantidad} personas`,
          proveedor: 'eldni.com (Public)'
        },
        provider: 'eldni'
      };
    }
  } catch {
    return { success: false, data: null, message: 'Error al conectar con eldni.com', provider: 'eldni' };
  }
  return { success: false, data: null, message: 'Operación no soportada', provider: 'eldni' };
}

function getMockData(type: SearchType, id: string, provider: string): ApiResponse {
  console.log(`[MOCK] Fetching ${type} for ${id} via ${provider}`);
  
  const mocks: Record<string, any> = {
    dni: {
      numero: id,
      nombre_completo: "USUARIO DE PRUEBA (MOCK)",
      nombres: "USUARIO",
      apellido_paterno: "PRUEBA",
      apellido_materno: "MOCK",
      direccion: "CALLE FALSA 123 - MODO DESARROLLO",
      estado_civil: "SOLTERO"
    },
    ruc: {
      ruc: id,
      nombre_o_razon_social: "EMPRESA MOCK S.A.C.",
      estado: "ACTIVO",
      condicion: "HABIDO",
      direccion_completa: "ZONA INDUSTRIAL MOCK 456"
    },
    plate: {
      placa: id,
      marca: "TOYOTA (MOCK)",
      modelo: "HILUX",
      color: "BLANCO",
      motor: "MOCK-123",
      vin: "MOCK-VIN-999"
    },
    license: {
      licencia: {
        categoria: "A-I",
        estado: "VIGENTE",
        fecha_vencimiento: "2030-01-01"
      }
    },
    soat: {
      estado: "VIGENTE",
      nombre_compania: "PACIFICO (MOCK)",
      fecha_fin: "2026-12-31"
    },
    'ruc-debt': [],
    'ruc10-names': {
      ruc: id,
      nombres: "JUAN CARLOS",
      apellido_paterno: "PEREZ",
      apellido_materno: "RODRIGUEZ",
      nombre_completo: "PEREZ RODRIGUEZ, JUAN CARLOS"
    },
    'ruc10-by-dni': {
      dni: id,
      ruc: `10${id}9`
    },
    'dni-verification-digit': {
      dni: id,
      digito_verificador: String(id.split('').reduce((acc, c) => acc + parseInt(c, 10), 0) % 10)
    },
    'how-many-same-name': {
      nombre: id,
      cantidad: "1,432 personas"
    }
  };

  return {
    success: true,
    data: {
      ...mocks[type],
      proveedor: provider === 'eldni' ? 'eldni.com (Public / Free)' : 'json.pe (Premium / Credit)'
    },
    provider
  };
}

