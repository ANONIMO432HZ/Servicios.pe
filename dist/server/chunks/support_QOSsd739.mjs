import { c as createComponent } from './astro-component_DNiUXFEw.mjs';
import 'piccolore';
import { ba as renderTemplate, aW as maybeRenderHead } from './params-and-props_CvnwIJai.mjs';
import { r as renderComponent } from './server_Uic00SnP.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_Bu4cbNIG.mjs';
import { HelpCircle, MessageSquare, Mail, Info } from 'lucide-react';

const $$Support = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Centro de Soporte" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-8 max-w-4xl mx-auto"> <header className="space-y-4"> <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider"> ${renderComponent($$result2, "HelpCircle", HelpCircle, { "className": "w-3.5 h-3.5" })} <span>Centro de Ayuda</span> </div> <h1 class="text-3xl font-black text-white tracking-tight sm:text-4xl">
Canales de <span class="text-primary">Soporte y Contacto</span> </h1> <p class="text-zinc-500 font-medium leading-relaxed">
Comprendé el modelo de asistencia y los fines con los que fue concebido este portal demostrativo experimental.
</p> </header> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <!-- Soporte Fines didácticos --> <div class="glass-panel p-6 rounded-3xl space-y-4 relative overflow-hidden flex flex-col justify-between"> <div class="space-y-4"> <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20"> ${renderComponent($$result2, "MessageSquare", MessageSquare, { "className": "w-5 h-5 text-primary" })} </div> <h3 class="text-sm font-bold text-white uppercase tracking-wider">Proyecto Didáctico Personal</h3> <p class="text-xs text-zinc-400 leading-relaxed">
Dado que este portal se diseñó de manera enteramente experimental para simplificar y consolidar consultas públicas útiles a la ciudadanía, <strong>no existe un equipo de soporte técnico dedicado</strong> ni se garantizan tiempos de respuesta o corrección de fallas ajenas a la interfaz.
</p> </div> <div class="pt-4 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
Fines de Aprendizaje
</div> </div> <!-- Formas de Reportar --> <div class="glass-panel p-6 rounded-3xl space-y-4 relative overflow-hidden flex flex-col justify-between"> <div class="space-y-4"> <div class="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20"> ${renderComponent($$result2, "Mail", Mail, { "className": "w-5 h-5 text-purple-400" })} </div> <h3 class="text-sm font-bold text-white uppercase tracking-wider">Consultas Didácticas</h3> <p class="text-xs text-zinc-400 leading-relaxed">
Si tenés consultas académicas respecto al funcionamiento técnico de la interfaz de usuario, la persistencia en \`localStorage\`, la gestión del estado interactivo, o deseas reportar alguna falla visual en el renderizado local, podés ponerte en contacto.
</p> </div> <div class="pt-4"> <a href="#" class="inline-block text-[10px] text-primary hover:text-white font-black uppercase tracking-wider transition-colors">
[EMAIL_ADDRESS]
</a> </div> </div> </div> <!-- FAQs Box --> <div class="glass-panel p-6 rounded-3xl space-y-6"> <h3 class="text-sm font-bold text-white uppercase tracking-wider">Preguntas Frecuentes Rápidas</h3> <div class="space-y-4 text-xs"> <div class="space-y-1"> <p class="font-bold text-zinc-200">¿Por qué mi historial o créditos ficticios desaparecieron?</p> <p class="text-zinc-400 leading-relaxed">Los datos se almacenan de manera local únicamente en tu propio navegador. Si limpiaste la memoria caché de tu explorador, borraste tus cookies, o iniciaste sesión en modo incógnito, la información se reinicia por completo a sus valores iniciales.</p> </div> <div class="border-t border-white/5 my-2"></div> <div class="space-y-1"> <p class="font-bold text-zinc-200">¿Esta web cobra algo o vende consultas?</p> <p class="text-zinc-400 leading-relaxed"><strong>De ninguna manera.</strong> Esta web es 100% gratuita pero incluye enlaces a servicios de pago externos. Fue creada meramente para agilizar y facilitar de forma consolidada el acceso a servicios oficiales que a veces tienen interfaces complejas o fragmentadas.</p> </div> </div> </div> <div class="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5"> <div class="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider"> ${renderComponent($$result2, "Info", Info, { "className": "w-4 h-4 text-zinc-500" })} <span>Asistencia no contractual</span> </div> <a href="/" class="bg-primary hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md">
Volver al Inicio
</a> </div> </div> ` })}`;
}, "C:/PROYECTOS/govcheck/src/pages/support.astro", void 0);

const $$file = "C:/PROYECTOS/govcheck/src/pages/support.astro";
const $$url = "/support";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Support,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
