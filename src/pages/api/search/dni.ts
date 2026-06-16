import type { APIRoute } from 'astro';
import { fetchGovData } from '../../../lib/api-client';
import { ApiDniperu } from '../../../lib/api-dniperu';
import { validateAndDeductSearch } from '../../../lib/api-auth';
import { cleanIdentifier } from '../../../lib/utils';

export const GET: APIRoute = async (context) => {
  const dni = context.url.searchParams.get('dni');
  const provider = context.url.searchParams.get('provider');

  const cleanDni = cleanIdentifier(dni || '', 'dni');

  if (!cleanDni) {
    return new Response(JSON.stringify({ success: false, message: 'DNI invalido o requerido (debe ser numerico de 8 digitos)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const validation = validateAndDeductSearch(context.cookies, 'dni', provider);
  if (!validation.allowed) {
    return new Response(JSON.stringify({ success: false, message: validation.message }), {
      status: validation.statusCode || 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const resolvedProvider = provider || validation.provider;

  if (resolvedProvider === 'json_pe') {
    const result = await fetchGovData('dni', cleanDni, 'json_pe');
    return new Response(JSON.stringify({ ...result, newCredits: validation.newCredits }), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const result = await ApiDniperu.consultarNombres(cleanDni);
    const mapped = result.success && result.data
      ? {
          success: true,
          data: {
            ...result.data,
            numero: result.data.numero,
            nombre_completo: result.data.nombre_completo,
            nombres: result.data.nombres,
            apellido_paterno: result.data.apellido_paterno,
            apellido_materno: result.data.apellido_materno,
            codigo_verificacion: result.data.codigo_verificacion,
            direccion: result.data.direccion,
            proveedor: 'dniperu.com',
          },
          provider: 'dniperu',
          newCredits: validation.newCredits,
        }
      : { ...result, provider: 'dniperu', newCredits: validation.newCredits };

    return new Response(JSON.stringify(mapped), {
      status: mapped.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    const fallback = await fetchGovData('dni', cleanDni, 'eldni');
    return new Response(JSON.stringify({ ...fallback, newCredits: validation.newCredits }), {
      status: fallback.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
