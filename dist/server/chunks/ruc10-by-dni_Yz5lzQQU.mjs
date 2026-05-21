import { v as validateAndDeductSearch, f as fetchGovData } from './api-auth_UK6MJv7_.mjs';

const GET = async (context) => {
  const dni = context.url.searchParams.get("dni");
  const provider = context.url.searchParams.get("provider");
  if (!dni) {
    return new Response(JSON.stringify({ success: false, message: "DNI requerido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const validation = validateAndDeductSearch(context.cookies, "ruc10-by-dni", provider);
  if (!validation.allowed) {
    return new Response(JSON.stringify({ success: false, message: validation.message }), {
      status: validation.statusCode || 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const result = await fetchGovData("ruc10-by-dni", dni, validation.provider);
  return new Response(JSON.stringify({ ...result, newCredits: validation.newCredits }), {
    status: result.success ? 200 : 400,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
