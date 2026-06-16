import type { APIRoute } from 'astro';
import { fetchGovData } from '../../../lib/api-client';
import { validateAndDeductSearch } from '../../../lib/api-auth';
import { cleanIdentifier } from '../../../lib/utils';

const LICENSE_PROVIDERS = ['json_pe'] as const;

export const GET: APIRoute = async (context) => {
  const dni = context.url.searchParams.get('dni');
  const requestedProvider = context.url.searchParams.get('provider');

  const cleanDni = cleanIdentifier(dni || '', 'dni');

  if (!cleanDni) {
    return new Response(JSON.stringify({ success: false, message: 'DNI invalido o requerido (debe ser numerico de 8 digitos)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const resolvedProvider = (requestedProvider === 'json_pe') ? 'json_pe' : 'eldni';

  if (!LICENSE_PROVIDERS.includes(resolvedProvider as any)) {
    return new Response(JSON.stringify({
      success: false,
      data: null,
      message: 'Consulta de licencias no soportada por el proveedor gratuito. Se requiere json.pe con token configurado.',
      provider: resolvedProvider,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const validation = validateAndDeductSearch(context.cookies, 'license', requestedProvider);
  if (!validation.allowed) {
    return new Response(JSON.stringify({ success: false, message: validation.message }), {
      status: validation.statusCode || 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const result = await fetchGovData('license', cleanDni, 'json_pe');
  return new Response(JSON.stringify({ ...result, newCredits: validation.newCredits }), {
    status: result.success ? 200 : 400,
    headers: { 'Content-Type': 'application/json' }
  });
};
