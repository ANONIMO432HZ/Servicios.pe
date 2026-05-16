import { fetchGovData } from '../../../lib/api-client';

export const GET: APIRoute = async (context) => {
  const dni = context.url.searchParams.get('dni');

  if (!dni) {
    return new Response(JSON.stringify({ success: false, message: 'DNI requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const result = await fetchGovData('license', dni);
  return new Response(JSON.stringify(result), {
    status: result.success ? 200 : 404,
    headers: { 'Content-Type': 'application/json' }
  });
}
