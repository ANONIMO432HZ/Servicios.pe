import type { APIRoute } from 'astro';

export const POST: APIRoute = async (context) => {
  const authCookie = context.cookies.get('auth_token')?.value;
  if (authCookie !== 'valid-session-token') {
    return new Response(JSON.stringify({ success: false, message: 'No autorizado. Iniciá sesión para recargar créditos.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Recargar a 50 créditos
  const newCredits = 50;
  context.cookies.set('user_credits', newCredits.toString(), {
    path: '/',
    httpOnly: false,
    secure: import.meta.env.PROD,
    maxAge: 60 * 60 * 24 * 30
  });

  return new Response(JSON.stringify({ success: true, credits: newCredits, message: 'Créditos recargados con éxito.' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
