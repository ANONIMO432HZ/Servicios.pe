import type { APIRoute } from 'astro';
import { ApiDniperu } from '../../../../lib/api-dniperu';

export const GET: APIRoute = async ({ url, cookies }) => {
  const dni = url.searchParams.get('dni');
  if (!dni || !/^\d{8}$/.test(dni)) {
    return new Response(JSON.stringify({ success: false, message: 'DNI inválido (debe ser numérico de 8 dígitos)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const authCookie = cookies.get('auth_token')?.value;
  if (!authCookie) {
    return new Response(JSON.stringify({ success: false, message: 'Sesión Requerida: iniciá sesión o accedé como invitado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const isGuest = authCookie === 'guest-session-token';
  if (isGuest) {
    const now = Date.now();
    const rl = cookies.get('dniperu_rate')?.value;
    let last = 0;
    if (rl) {
      try { last = parseInt(rl, 10); } catch { /* ignore */ }
    }
    if (now - last < 10000) {
      return new Response(JSON.stringify({ success: false, message: 'Esperá 10 segundos entre consultas' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    cookies.set('dniperu_rate', String(now), { path: '/', httpOnly: false, secure: import.meta.env.PROD, maxAge: 86400 });
  }

  try {
    const result = await ApiDniperu.consultarFechaNacimiento(dni);
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Error al conectar con dniperu.com' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
