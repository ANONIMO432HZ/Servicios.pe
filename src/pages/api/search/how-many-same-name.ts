import type { APIRoute } from 'astro';
import { fetchGovData } from '../../../lib/api-client';
import { validateAndDeductSearch } from '../../../lib/api-auth';

export const GET: APIRoute = async (context) => {
  const name = context.url.searchParams.get('name') || context.url.searchParams.get('nombre');
  const provider = context.url.searchParams.get('provider');

  if (!name) {
    return new Response(JSON.stringify({ success: false, message: 'Nombre requerido' }), {
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

  const result = await fetchGovData('how-many-same-name', name, validation.provider);
  return new Response(JSON.stringify({ ...result, newCredits: validation.newCredits }), {
    status: result.success ? 200 : 400,
    headers: { 'Content-Type': 'application/json' }
  });
}
