import { c as createComponent } from './astro-component_DNiUXFEw.mjs';
import 'piccolore';
import './params-and-props_CvnwIJai.mjs';
import 'clsx';

const $$Logout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Logout;
  Astro2.cookies.delete("auth_token", { path: "/" });
  return Astro2.redirect("/login");
}, "C:/PROYECTOS/govcheck/src/pages/logout.astro", void 0);

const $$file = "C:/PROYECTOS/govcheck/src/pages/logout.astro";
const $$url = "/logout";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Logout,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
