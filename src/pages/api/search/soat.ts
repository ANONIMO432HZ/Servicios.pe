import type { APIRoute } from 'astro';
import { fetchGovData } from '../../../lib/api-client';

export const GET: APIRoute = async (context) => {
  const plate = context.url.searchParams.get('plate');

  if (!plate) {
    return new Response(JSON.stringify({ success: false, message: 'Placa requerida' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const result = await fetchGovData('soat', plate);
  return new Response(JSON.stringify(result), {
    status: result.success ? 200 : 404,
    headers: { 'Content-Type': 'application/json' }
  });
}
