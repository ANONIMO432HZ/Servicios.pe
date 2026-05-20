import type { APIRoute } from 'astro';
import { fetchGovData } from '../../../lib/api-client';
import { validateAndDeductSearch } from '../../../lib/api-auth';

export const GET: APIRoute = async (context) => {
  const ruc = context.url.searchParams.get('ruc');
  const provider = context.url.searchParams.get('provider');

  if (!ruc) {
    return new Response(JSON.stringify({ success: false, message: 'RUC requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const validation = validateAndDeductSearch(context.cookies, 'ruc-debt', provider);
  if (!validation.allowed) {
    return new Response(JSON.stringify({ success: false, message: validation.message }), {
      status: validation.statusCode || 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const result = await fetchGovData('ruc-debt', ruc, validation.provider);
  return new Response(JSON.stringify({ ...result, newCredits: validation.newCredits }), {
    status: result.success ? 200 : 400,
    headers: { 'Content-Type': 'application/json' }
  });
}
