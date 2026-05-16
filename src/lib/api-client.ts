/**
 * Centralized API Client for GovCheck
 * Handles provider switching, mock mode, and standardized responses.
 */

export type SearchType = 'dni' | 'ruc' | 'plate' | 'license' | 'soat' | 'ruc-debt';

export interface ApiResponse {
  success: boolean;
  data: any;
  message?: string;
  provider: string;
}

export async function fetchGovData(type: SearchType, identifier: string): Promise<ApiResponse> {
  const mode = import.meta.env.API_MODE || 'mock';
  const provider = import.meta.env.API_PROVIDER || 'json_pe';
  
  if (mode === 'mock') {
    return getMockData(type, identifier);
  }

  if (provider === 'json_pe') {
    return fetchJsonPe(type, identifier);
  } else if (provider === 'eldni') {
    return fetchElDni(type, identifier);
  }

  return { success: false, data: null, message: 'Proveedor no soportado', provider };
}

async function fetchJsonPe(type: SearchType, id: string): Promise<ApiResponse> {
  const token = import.meta.env.JSON_PE_TOKEN;
  const endpoints: Record<SearchType, string> = {
    dni: 'dni',
    ruc: 'ruc',
    plate: 'placa',
    license: 'licencia',
    soat: 'soat',
    'ruc-debt': 'deuda-coactiva' // Ajustar si el nombre es diferente en json.pe
  };

  try {
    const response = await fetch(`https://api.json.pe/api/${endpoints[type]}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ [type === 'plate' || type === 'soat' ? 'placa' : type]: id })
    });

    const result = await response.json();
    return {
      success: result.success,
      data: result.data,
      message: result.message,
      provider: 'json_pe'
    };
  } catch (error) {
    return { success: false, data: null, message: 'Error en json.pe', provider: 'json_pe' };
  }
}

async function fetchElDni(type: SearchType, id: string): Promise<ApiResponse> {
  // ElDni solo soporta DNI en este flujo gratuito
  if (type !== 'dni') {
    return fetchJsonPe(type, id); // Fallback a json.pe para otros tipos
  }

  const url = 'https://eldni.com/pe/buscar-datos-por-dni';
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  try {
    // 1. Obtener Token y Cookies
    const initialRes = await fetch(url, { headers: { 'User-Agent': userAgent } });
    const html = await initialRes.text();
    const cookies = initialRes.headers.getSetCookie?.().map(c => c.split(';')[0]).join('; ') || '';
    
    const tokenMatch = html.match(/name="_token" value="([^"]+)"/);
    if (!tokenMatch) throw new Error("No se pudo obtener el token de sesión de eldni");
    const token = tokenMatch[1];

    // 2. Ejecutar POST con los datos
    const formData = new URLSearchParams();
    formData.append('_token', token);
    formData.append('dni', id);

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

    // 3. Extraer Datos con Regex
    const nombres = resultHtml.match(/id="nombres" value="([^"]+)"/)?.[1];
    const apPaterno = resultHtml.match(/id="apellidop" value="([^"]+)"/)?.[1];
    const apMaterno = resultHtml.match(/id="apellidom" value="([^"]+)"/)?.[1];

    if (!nombres) {
      return { success: false, data: null, message: 'No se encontraron resultados en eldni', provider: 'eldni' };
    }

    return {
      success: true,
      data: {
        numero: id,
        nombre_completo: `${apPaterno} ${apMaterno}, ${nombres}`,
        nombres: nombres,
        apellido_paterno: apPaterno,
        apellido_materno: apMaterno,
        proveedor: 'eldni.com (Public)'
      },
      provider: 'eldni'
    };

  } catch (error) {
    console.error('ElDni Scraper Error:', error);
    return { success: false, data: null, message: 'Error al conectar con eldni.com', provider: 'eldni' };
  }
}

function getMockData(type: SearchType, id: string): ApiResponse {
  console.log(`[MOCK] Fetching ${type} for ${id}`);
  
  const mocks: Record<SearchType, any> = {
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
    'ruc-debt': []
  };

  return {
    success: true,
    data: mocks[type],
    provider: 'mock'
  };
}
