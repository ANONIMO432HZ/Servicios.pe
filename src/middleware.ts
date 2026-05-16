import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const { url, cookies, redirect } = context;
  
  const isLoginPage = url.pathname === '/login';
  const hasToken = cookies.has('auth_token');

  // Ignorar rutas estáticas y de API
  if (url.pathname.startsWith('/api') || url.pathname.includes('.') || url.pathname.startsWith('/ASSETS')) {
    return next();
  }

  // Si no está autenticado y no está en la página de login, redirigir a login
  if (!hasToken && !isLoginPage) {
    return redirect('/login');
  }

  // Si está autenticado y trata de ir al login, redirigir al dashboard
  if (hasToken && isLoginPage) {
    return redirect('/');
  }

  return next();
});
