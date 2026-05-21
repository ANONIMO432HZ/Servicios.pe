import { c as createComponent } from './astro-component_DNiUXFEw.mjs';
import 'piccolore';
import { ba as renderTemplate, aW as maybeRenderHead } from './params-and-props_CvnwIJai.mjs';
import { r as renderComponent } from './server_Uic00SnP.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_Bu4cbNIG.mjs';
import { A as AdvancedSearch } from './AdvancedSearch_C3GCPH3A.mjs';

const $$Search = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Búsqueda Avanzada" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-12 pb-20"> <header> <h1 class="text-3xl font-black text-white tracking-tight sm:text-4xl">
Consulta <span class="text-primary">Detallada</span> </h1> <p class="text-zinc-500 mt-2 font-medium max-w-2xl">
Realiza búsquedas por Placa o VIN para obtener reportes técnicos completos.
</p> </header> <section> ${renderComponent($$result2, "AdvancedSearch", AdvancedSearch, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/PROYECTOS/govcheck/src/components/dashboard/AdvancedSearch", "client:component-export": "AdvancedSearch" })} </section> </div> ` })}`;
}, "C:/PROYECTOS/govcheck/src/pages/search.astro", void 0);

const $$file = "C:/PROYECTOS/govcheck/src/pages/search.astro";
const $$url = "/search";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Search,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
