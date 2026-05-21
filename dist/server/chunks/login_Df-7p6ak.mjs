import { c as createComponent } from './astro-component_DNiUXFEw.mjs';
import 'piccolore';
import { aj as createRenderInstruction, b6 as renderHead, ba as renderTemplate } from './params-and-props_CvnwIJai.mjs';
import 'clsx';
/* empty css                  */

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Login;
  let errorMessage = "";
  if (Astro2.cookies.has("auth_token")) {
    return Astro2.redirect("/");
  }
  const url = new URL(Astro2.request.url);
  if (url.searchParams.get("autologin") === "true") {
    Astro2.cookies.set("auth_token", "valid-session-token", {
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24
      // 1 día
    });
    return Astro2.redirect("/");
  }
  if (Astro2.request.method === "POST") {
    try {
      const formData = await Astro2.request.formData();
      const action = formData.get("action")?.toString();
      if (action === "guest") {
        Astro2.cookies.set("auth_token", "guest-session-token", {
          path: "/",
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60 * 24
          // 1 día
        });
        return Astro2.redirect("/");
      }
      const username = formData.get("username")?.toString().trim();
      const password = formData.get("password")?.toString().trim();
      if (!username || !password) {
        errorMessage = "Por favor, ingresá tu usuario y contraseña.";
      } else {
        Astro2.cookies.set("auth_token", "valid-session-token", {
          path: "/",
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60 * 24
          // 1 día
        });
        return Astro2.redirect("/");
      }
    } catch (error) {
      errorMessage = "Ocurrió un error inesperado al procesar la solicitud.";
    }
  }
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="description" content="Portal unificado de servicios y consultas ciudadanas del Perú"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/png" href="/govcheck-logo.png"><title>Iniciar Sesión | Servicios.pe</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Public+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">${renderHead()}</head> <body class="antialiased min-h-screen bg-background text-foreground flex items-center justify-center p-4"> <div class="relative w-full max-w-md z-10"> <!-- Decorative Background Elements --> <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden"> <div class="absolute top-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[130px] animate-pulse"></div> <div class="absolute bottom-[20%] right-[20%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[130px] animate-pulse" style="animation-delay: 2s;"></div> </div> <!-- Main Glass Card --> <div class="relative z-10 glass-panel rounded-3xl p-8 lg:p-10 border border-white/10 shadow-2xl overflow-hidden"> <!-- Brand Header --> <div class="flex flex-col items-center text-center mb-8"> <div class="w-16 h-16 relative flex items-center justify-center mb-4 transition-transform duration-500 hover:scale-110"> <div class="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div> <img src="/govcheck-logo.png" alt="Servicios.pe Logo" width="64" height="64" class="relative z-10 drop-shadow-2xl"> </div> <h1 class="text-3xl font-black text-white tracking-tighter sm:text-4xl">
Servicios<span class="text-primary">.pe</span> </h1> <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">
Portal de Servicios y Consultas Perú
</p> </div> ${errorMessage && renderTemplate`<div class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-fade-in"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path> </svg> <p class="font-medium">${errorMessage}</p> </div>`} <!-- Demo Credentials Card --> <div class="mb-6 bg-primary/5 border border-primary/20 rounded-2xl p-4 text-left relative overflow-hidden group"> <div class="absolute top-0 right-0 -mt-6 -mr-6 w-16 h-16 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all"></div> <div class="flex items-center gap-2 mb-2 text-primary font-bold text-[10px] uppercase tracking-wider"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path> </svg> <span>Acceso de Prueba Experimental</span> </div> <p class="text-[11px] text-zinc-400 leading-relaxed mb-3">
Probá el sistema completo con consultas en tiempo real de forma gratuita y sin requerir tarjetas ni datos de pago.
</p> <div class="grid grid-cols-2 gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5 font-mono text-[10px] text-zinc-300 mb-3"> <div> <span class="text-[8px] text-zinc-500 font-bold block uppercase tracking-wider mb-0.5">Usuario Demo</span> <span class="text-white font-bold select-all">admin</span> </div> <div> <span class="text-[8px] text-zinc-500 font-bold block uppercase tracking-wider mb-0.5">Contraseña</span> <span class="text-white font-bold select-all">admin123</span> </div> </div> <button type="button" id="fill-demo-btn" class="w-full bg-primary/20 hover:bg-primary/30 text-primary hover:text-white border border-primary/30 hover:border-primary/50 text-xs font-bold py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"> <span>Usar Credenciales de Prueba</span> <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </button> </div> <!-- Login Form --> <form method="POST" class="space-y-6"> <div> <label for="username" class="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Usuario</label> <input type="text" id="username" name="username" placeholder="admin" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:bg-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"> </div> <div> <label for="password" class="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Contraseña</label> <input type="password" id="password" name="password" placeholder="••••••••" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:bg-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"> </div> <button type="submit" name="action" value="login" class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-[0.98] border border-primary/20 flex items-center justify-center gap-2 group cursor-pointer"> <span>Acceder al Portal</span> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path> </svg> </button> <div class="relative flex py-2 items-center"> <div class="flex-grow border-t border-white/5"></div> <span class="flex-shrink mx-4 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">o</span> <div class="flex-grow border-t border-white/5"></div> </div> <button type="submit" name="action" value="guest" class="w-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 active:scale-[0.98] border border-white/10 flex items-center justify-center gap-2 group cursor-pointer"> <span>Ingresar como Invitado</span> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path> </svg> </button> </form> <div class="mt-8 text-center text-zinc-500 text-[10px] uppercase font-bold tracking-widest"> <p>Copyright © 2026 Servicios.pe. Todos los derechos reservados.</p> </div> </div> </div> ${renderScript($$result, "C:/PROYECTOS/govcheck/src/pages/login.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "C:/PROYECTOS/govcheck/src/pages/login.astro", void 0);
const $$file = "C:/PROYECTOS/govcheck/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
