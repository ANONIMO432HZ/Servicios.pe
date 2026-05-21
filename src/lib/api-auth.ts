import type { AstroCookies } from 'astro';

export interface AuthValidationResult {
  allowed: boolean;
  message?: string;
  statusCode?: number;
  provider: 'eldni' | 'json_pe' | 'mock';
  newCredits?: number;
}

export function validateAndDeductSearch(
  cookies: AstroCookies,
  type: string,
  requestedProvider: string | null
): AuthValidationResult {
  const authCookie = cookies.get('auth_token')?.value;
  const isGuest = authCookie === 'guest-session-token';
  const isLoggedIn = authCookie === 'valid-session-token';

  // 1. Resolver proveedor (por default el proveedor es gratuito/free)
  let provider: 'eldni' | 'json_pe' | 'mock' = 'eldni';
  if (requestedProvider === 'json_pe') {
    provider = 'json_pe';
  } else if (requestedProvider === 'mock') {
    provider = 'mock';
  } else if (requestedProvider === 'eldni') {
    provider = 'eldni';
  } else {
    provider = 'eldni';
  }

  // 2. Reglas para Invitado (Guest)
  if (isGuest) {
    if (provider === 'json_pe') {
      return {
        allowed: false,
        statusCode: 403,
        message: 'Acceso Denegado: Las consultas premium a json.pe requieren iniciar sesión y créditos.',
        provider
      };
    }

    const freeTypes = ['dni', 'ruc', 'ruc10-names', 'ruc10-by-dni', 'dni-verification-digit', 'how-many-same-name'];
    if (!freeTypes.includes(type)) {
      return {
        allowed: false,
        statusCode: 400,
        message: 'Límite de Invitado: Esta consulta requiere iniciar sesión y créditos premium.',
        provider
      };
    }

    // Rate Limit para Invitados (10s entre consultas + max 5 consultas por hora)
    const now = Date.now();
    const rateLimitCookie = cookies.get('guest_rate_limit')?.value;
    let limitData = { lastQuery: 0, count: 0, resetTime: now + 3600000 };

    if (rateLimitCookie) {
      try {
        limitData = JSON.parse(rateLimitCookie);
      } catch (e) {}
    }

    // a. Rate limit de 10 segundos
    const secondsPassed = (now - limitData.lastQuery) / 1000;
    if (secondsPassed < 10) {
      const waitTime = Math.ceil(10 - secondsPassed);
      return {
        allowed: false,
        statusCode: 429,
        message: `Rate Limit: Por favor, esperá ${waitTime} segundos antes de realizar otra consulta.`,
        provider
      };
    }

    // b. Límite de 5 consultas por hora
    if (now > limitData.resetTime) {
      limitData.count = 0;
      limitData.resetTime = now + 3600000; // Resetear la hora
    }

    if (limitData.count >= 5) {
      const minutesLeft = Math.ceil((limitData.resetTime - now) / 60000);
      return {
        allowed: false,
        statusCode: 429,
        message: `Límite Excedido: Has alcanzado el límite de 5 consultas por hora para invitados. Intentá de nuevo en ${minutesLeft} minutos o iniciá sesión para consultas ilimitadas.`,
        provider
      };
    }

    // Actualizar cookie de rate limit
    limitData.lastQuery = now;
    limitData.count += 1;
    cookies.set('guest_rate_limit', JSON.stringify(limitData), {
      path: '/',
      httpOnly: false, // Permitir que el cliente JavaScript lea el estado del rate limit
      secure: import.meta.env.PROD,
      maxAge: 60 * 60 * 24
    });

    return { allowed: true, provider };
  }

  // 3. Reglas para Usuario Registrado / Admin (Créditos)
  if (isLoggedIn) {
    // Inicializar créditos si no existen
    let credits = 50;
    const creditsCookie = cookies.get('user_credits')?.value;
    if (creditsCookie !== undefined) {
      credits = parseInt(creditsCookie, 10);
    } else {
      cookies.set('user_credits', '50', {
        path: '/',
        httpOnly: false, // Permitir leer en cliente
        secure: import.meta.env.PROD,
        maxAge: 60 * 60 * 24 * 30
      });
    }

    // Definir costos por tipo de búsqueda
    const costs: Record<string, number> = {
      dni: 1,
      license: 1,
      ruc: 1,
      'ruc-debt': 1,
      plate: 2,
      soat: 1,
      'ruc10-names': 1,
      'ruc10-by-dni': 1,
      'dni-verification-digit': 1,
      'how-many-same-name': 1
    };
    const cost = costs[type] || 1;

    if (credits < cost) {
      return {
        allowed: false,
        statusCode: 402,
        message: `Créditos Insuficientes: Esta consulta requiere ${cost} créditos. Tu saldo actual es de ${credits} créditos. ¡Recargá saldo desde tu consola!`,
        provider
      };
    }

    // Deducción de créditos
    const newCredits = credits - cost;
    cookies.set('user_credits', newCredits.toString(), {
      path: '/',
      httpOnly: false,
      secure: import.meta.env.PROD,
      maxAge: 60 * 60 * 24 * 30
    });

    return { allowed: true, provider, newCredits };
  }

  // 4. Sin sesión (Redirigir o Denegar)
  return {
    allowed: false,
    statusCode: 401,
    message: 'Sesión Requerida: Por favor, iniciá sesión o accedé como invitado para usar esta API.',
    provider: 'mock'
  };
}
