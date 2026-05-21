import { v as validateAndDeductSearch, f as fetchGovData } from './api-auth_UK6MJv7_.mjs';

const GET = async (context) => {
  const plate = context.url.searchParams.get("plate");
  const provider = context.url.searchParams.get("provider");
  if (!plate) {
    return new Response(JSON.stringify({ success: false, message: "Placa requerida" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const validation = validateAndDeductSearch(context.cookies, "soat", provider);
  if (!validation.allowed) {
    return new Response(JSON.stringify({ success: false, message: validation.message }), {
      status: validation.statusCode || 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const result = await fetchGovData("soat", plate, validation.provider);
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
