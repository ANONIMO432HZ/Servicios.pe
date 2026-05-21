import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const { url, cookies, redirect } = context;
  
  const isLoginPage = url.pathname === '/login';
  const hasToken = cookies.has('auth_token');

  // Ignorar rutas estáticas y de API
  if (url.pathname.startsWith('/api') || url.pathname.includes('.') || url.pathname.startsWith('/ASSETS')) {
    return next();
  }

  // Si no está autenticado y no está en la página de login, por defecto inicializamos como invitado
  if (!hasToken && !isLoginPage) {
    cookies.set('auth_token', 'guest-session-token', {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      maxAge: 60 * 60 * 24, // 1 día
    });
    return next();
  }

  // Si está autenticado con una cuenta real (admin) y trata de ir al login, redirigir al dashboard
  if (hasToken && isLoginPage) {
    const token = cookies.get('auth_token')?.value;
    if (token !== 'guest-session-token') {
      return redirect('/');
    }
  }

  return next();
});
