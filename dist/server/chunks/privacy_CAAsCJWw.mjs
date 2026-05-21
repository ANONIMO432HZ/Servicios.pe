import { c as createComponent } from './astro-component_DNiUXFEw.mjs';
import 'piccolore';
import { ba as renderTemplate, aW as maybeRenderHead } from './params-and-props_CvnwIJai.mjs';
import { r as renderComponent } from './server_Uic00SnP.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_Bu4cbNIG.mjs';
import { Shield, EyeOff, Info } from 'lucide-react';

const $$Privacy = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Política de Privacidad" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-8 max-w-4xl mx-auto"> <header className="space-y-4"> <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider"> ${renderComponent($$result2, "Shield", Shield, { "className": "w-3.5 h-3.5" })} <span>Protección de Datos</span> </div> <h1 class="text-3xl font-black text-white tracking-tight sm:text-4xl">
Política de <span class="text-primary">Privacidad y Datos</span> </h1> <p class="text-zinc-500 font-medium leading-relaxed">
Esta web prioriza tu privacidad por encima de todo. Leé cómo gestionamos el portal experimental de manera 100% transparente.
</p> </header> <div class="glass-panel p-6 rounded-3xl space-y-6 relative overflow-hidden"> <!-- Decorative glow --> <div class="absolute top-0 right-0 -mt-12 -mr-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div> <div class="flex gap-4 items-start"> ${renderComponent($$result2, "EyeOff", EyeOff, { "className": "w-6 h-6 text-green-400 shrink-0 mt-1" })} <div class="space-y-2"> <h3 class="text-sm font-bold text-white uppercase tracking-wider">Compromiso de No Recolección</h3> <p class="text-xs text-zinc-400 leading-relaxed"> <strong>No recopilamos, no registramos, no almacenamos ni transmitimos</strong> tus datos personales a servidores externos propiedad del desarrollador de este portal. Las consultas viajan directamente a los proveedores de API autorizados para su resolución inmediata.
</p> </div> </div> <div class="border-t border-white/5 my-6"></div> <div class="space-y-6 text-zinc-300 text-xs leading-relaxed"> <div class="space-y-2"> <h4 class="text-sm font-bold text-white uppercase tracking-wider">1. Almacenamiento Estrictamente Local</h4> <p>
Toda la información y configuraciones interactivas de tu sesión (tales como tu historial de búsquedas, tus saldos de créditos ficticios para demostración, tus notificaciones recibidas, y tu identificador dinámico de Invitado) se guardan de forma exclusiva en el <strong>almacenamiento local de tu navegador (localStorage) y cookies locales de tu computadora</strong>. Ningún tercero ni el creador del portal tiene acceso a esos datos de almacenamiento.
</p> </div> <div class="space-y-2"> <h4 class="text-sm font-bold text-white uppercase tracking-wider">2. Limpieza de Datos a Voluntad</h4> <p>
En cualquier momento podés eliminar la totalidad de tus datos e historial de consultas de manera inmediata. Simplemente hacé clic en la opción <strong>Configuración de Cuenta</strong> en tu menú de perfil en la parte superior y presioná el botón "Limpiar Historial" o "Resetear Notificaciones". Esto vaciará permanentemente tu almacenamiento local.
</p> </div> <div class="space-y-2"> <h4 class="text-sm font-bold text-white uppercase tracking-wider">3. Ausencia de Formularios y Registros de Terceros</h4> <p>
No solicitamos correos electrónicos, contraseñas, teléfonos ni métodos de pago reales. Las credenciales de administrador proporcionadas son parte de una simulación interactiva local para poder habilitar la consola de API de forma demostrativa.
</p> </div> <div class="space-y-2"> <h4 class="text-sm font-bold text-white uppercase tracking-wider">4. Tráfico hacia APIs Externas</h4> <p>
Al interactuar con la plataforma y realizar consultas de DNI, RUC o placa, las peticiones HTTP se derivan a través del servidor local hacia las pasarelas públicas de eldni o json.pe para procesar la información. El desarrollador no almacena copias de las respuestas recibidas en ninguna base de datos interna.
</p> </div> </div> </div> <div class="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5"> <div class="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider"> ${renderComponent($$result2, "Info", Info, { "className": "w-4 h-4 text-zinc-500" })} <span>Transparencia y Seguridad</span> </div> <a href="/" class="bg-primary hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md">
Volver al Inicio
</a> </div> </div> ` })}`;
}, "C:/PROYECTOS/govcheck/src/pages/privacy.astro", void 0);

const $$file = "C:/PROYECTOS/govcheck/src/pages/privacy.astro";
const $$url = "/privacy";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Privacy,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
