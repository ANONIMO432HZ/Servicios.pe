import type { APIRoute } from 'astro';
import { fetchGovData } from '../../../lib/api-client';

export const GET: APIRoute = async (context) => {
  const ruc = context.url.searchParams.get('ruc');

  if (!ruc) {
    return new Response(JSON.stringify({ success: false, message: 'RUC requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const result = await fetchGovData('ruc', ruc);
  return new Response(JSON.stringify(result), {
    status: result.success ? 200 : 404,
    headers: { 'Content-Type': 'application/json' }
  });
}
