import type { APIRoute } from 'astro';
import { fetchGovData } from '../../../lib/api-client';
import { validateAndDeductSearch } from '../../../lib/api-auth';
import { cleanIdentifier } from '../../../lib/utils';

export const GET: APIRoute = async (context) => {
  const name = context.url.searchParams.get('name') || context.url.searchParams.get('nombre');
  const provider = context.url.searchParams.get('provider');

  const cleanName = cleanIdentifier(name || '', 'how-many-same-name');

  if (!cleanName) {
    return new Response(JSON.stringify({ success: false, message: 'Nombre inválido o requerido (solo letras y espacios)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const validation = validateAndDeductSearch(context.cookies, 'how-many-same-name', provider);
  if (!validation.allowed) {
    return new Response(JSON.stringify({ success: false, message: validation.message }), {
      status: validation.statusCode || 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const result = await fetchGovData('how-many-same-name', cleanName, validation.provider);
  return new Response(JSON.stringify({ ...result, newCredits: validation.newCredits }), {
    status: result.success ? 200 : 400,
    headers: { 'Content-Type': 'application/json' }
  });
}
