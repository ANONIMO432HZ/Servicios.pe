import type { APIRoute } from 'astro';
import { fetchGovData } from '../../../lib/api-client';
import { validateAndDeductSearch } from '../../../lib/api-auth';

export const GET: APIRoute = async (context) => {
  const plate = context.url.searchParams.get('plate');
  const provider = context.url.searchParams.get('provider');

  if (!plate) {
    return new Response(JSON.stringify({ success: false, message: 'Placa requerida' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const validation = validateAndDeductSearch(context.cookies, 'plate', provider);
  if (!validation.allowed) {
    return new Response(JSON.stringify({ success: false, message: validation.message }), {
      status: validation.statusCode || 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const result = await fetchGovData('plate', plate, validation.provider);
  return new Response(JSON.stringify({ ...result, newCredits: validation.newCredits }), {
    status: result.success ? 200 : 400,
    headers: { 'Content-Type': 'application/json' }
  });
}
