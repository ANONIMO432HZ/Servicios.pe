import type { APIRoute } from 'astro';
import { fetchGovData } from '../../../lib/api-client';
import { validateAndDeductSearch } from '../../../lib/api-auth';
import { cleanIdentifier } from '../../../lib/utils';

export const GET: APIRoute = async (context) => {
  const dni = context.url.searchParams.get('dni');
  const provider = context.url.searchParams.get('provider');

  const cleanDni = cleanIdentifier(dni || '', 'ruc10-by-dni');

  if (!cleanDni) {
    return new Response(JSON.stringify({ success: false, message: 'DNI inválido o requerido (debe ser numérico de 8 dígitos)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const validation = validateAndDeductSearch(context.cookies, 'ruc10-by-dni', provider);
  if (!validation.allowed) {
    return new Response(JSON.stringify({ success: false, message: validation.message }), {
      status: validation.statusCode || 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const result = await fetchGovData('ruc10-by-dni', cleanDni, validation.provider);
  return new Response(JSON.stringify({ ...result, newCredits: validation.newCredits }), {
    status: result.success ? 200 : 400,
    headers: { 'Content-Type': 'application/json' }
  });
}
