import { c as createComponent } from './astro-component_DNiUXFEw.mjs';
import 'piccolore';
import { ba as renderTemplate, aW as maybeRenderHead } from './params-and-props_CvnwIJai.mjs';
import { r as renderComponent } from './server_Uic00SnP.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_Bu4cbNIG.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Coins, Loader2, RefreshCw, Clock, Lock, Search, ArrowRight, ShieldAlert, Eye, Code, Cpu, CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
function ApiConsole() {
  const [role, setRole] = useState("guest");
  const [credits, setCredits] = useState(50);
  const [recharging, setRecharging] = useState(false);
  const [rateLimitData, setRateLimitData] = useState({ count: 0, lastQuery: 0 });
  const [category, setCategory] = useState("free");
  const [queryType, setQueryType] = useState("dni");
  const [inputValue, setInputValue] = useState("");
  const [searchState, setSearchState] = useState("idle");
  const [resultData, setResultData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("visual");
  useEffect(() => {
    const token = getCookie("auth_token");
    const isGuestUser = token === "guest-session-token";
    setRole(isGuestUser ? "guest" : "admin");
    setCategory("free");
    const userCredits = getCookie("user_credits");
    if (userCredits) {
      setCredits(parseInt(userCredits, 10));
    }
    const limitCookie = getCookie("guest_rate_limit");
    if (limitCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(limitCookie));
        setRateLimitData({ count: parsed.count, lastQuery: parsed.lastQuery });
      } catch (e) {
      }
    }
  }, []);
  const refreshUserData = () => {
    const userCredits = getCookie("user_credits");
    if (userCredits) {
      setCredits(parseInt(userCredits, 10));
    }
    const limitCookie = getCookie("guest_rate_limit");
    if (limitCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(limitCookie));
        setRateLimitData({ count: parsed.count, lastQuery: parsed.lastQuery });
      } catch (e) {
      }
    }
  };
  const handleRecharge = async () => {
    setRecharging(true);
    try {
      const res = await fetch("/api/credits/recharge", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setCredits(data.credits);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("govcheck-notification", {
            detail: {
              title: "Créditos Recargados (Consola)",
              desc: `Se acreditaron 50 créditos en tu cuenta. Nuevo saldo: ${data.credits} créditos.`,
              type: "credits"
            }
          }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRecharging(false);
    }
  };
  const handleQuery = async (e) => {
    e.preventDefault();
    if (role !== "admin") {
      window.dispatchEvent(new CustomEvent("show-guest-modal"));
      return;
    }
    const cleanedVal = inputValue.trim().toUpperCase();
    if (!cleanedVal) return;
    setSearchState("loading");
    setResultData(null);
    setErrorMessage("");
    if (category === "free") {
      const freeTypes = ["dni", "ruc", "ruc10-names", "ruc10-by-dni", "dni-verification-digit", "how-many-same-name"];
      if (!freeTypes.includes(queryType)) {
        setSearchState("error");
        setErrorMessage("La categoría gratuita (eldni.com) no soporta esta consulta.");
        return;
      }
      if (queryType === "dni" && !/^\d{8}$/.test(cleanedVal)) {
        setSearchState("error");
        setErrorMessage("Formato inválido: El DNI debe contener exactamente 8 dígitos.");
        return;
      }
      if (queryType === "ruc" && !/^\d{11}$/.test(cleanedVal)) {
        setSearchState("error");
        setErrorMessage("Formato inválido: El RUC debe contener exactamente 11 dígitos.");
        return;
      }
      if (queryType === "ruc10-names" && !/^10\d{9}$/.test(cleanedVal)) {
        setSearchState("error");
        setErrorMessage("Formato inválido: El RUC 10 debe comenzar con 10 y tener exactamente 11 dígitos.");
        return;
      }
      if (queryType === "ruc10-by-dni" && !/^\d{8}$/.test(cleanedVal)) {
        setSearchState("error");
        setErrorMessage("Formato inválido: El DNI debe contener exactamente 8 dígitos.");
        return;
      }
      if (queryType === "dni-verification-digit" && !/^\d{8}$/.test(cleanedVal)) {
        setSearchState("error");
        setErrorMessage("Formato inválido: El DNI debe contener exactamente 8 dígitos.");
        return;
      }
      if (queryType === "how-many-same-name" && cleanedVal.length < 2) {
        setSearchState("error");
        setErrorMessage("Formato inválido: Ingrese un nombre de al menos 2 letras.");
        return;
      }
    } else {
      if (queryType === "dni" || queryType === "license" || queryType === "ruc10-by-dni" || queryType === "dni-verification-digit") {
        if (!/^\d{8}$/.test(cleanedVal)) {
          setSearchState("error");
          setErrorMessage("Formato inválido: El DNI debe contener exactamente 8 dígitos.");
          return;
        }
      } else if (queryType === "ruc" || queryType === "ruc-debt" || queryType === "ruc10-names") {
        if (!/^\d{11}$/.test(cleanedVal)) {
          setSearchState("error");
          setErrorMessage("Formato inválido: El RUC debe contener exactamente 11 dígitos.");
          return;
        }
      } else if (queryType === "plate" || queryType === "soat") {
        if (cleanedVal.length < 5) {
          setSearchState("error");
          setErrorMessage("Formato inválido: Ingrese una placa vehicular válida.");
          return;
        }
      } else if (queryType === "how-many-same-name") {
        if (cleanedVal.length < 2) {
          setSearchState("error");
          setErrorMessage("Formato inválido: Ingrese un nombre de al menos 2 letras.");
          return;
        }
      }
    }
    try {
      const providerParam = category === "free" ? "eldni" : "json_pe";
      let endpoint = queryType;
      let queryParam = "";
      if (queryType === "dni" || queryType === "license" || queryType === "ruc10-by-dni" || queryType === "dni-verification-digit") {
        queryParam = `dni=${cleanedVal}`;
      } else if (queryType === "ruc" || queryType === "ruc-debt" || queryType === "ruc10-names") {
        queryParam = `ruc=${cleanedVal}`;
      } else if (queryType === "plate" || queryType === "soat") {
        queryParam = `plate=${cleanedVal}`;
      } else if (queryType === "how-many-same-name") {
        queryParam = `name=${cleanedVal}`;
      }
      const res = await fetch(`/api/search/${endpoint}?${queryParam}&provider=${providerParam}`);
      const data = await res.json();
      refreshUserData();
      if (res.ok && data.success) {
        setResultData(data);
        setSearchState("success");
        if (typeof window !== "undefined") {
          let queryName = queryType.toUpperCase();
          if (queryType === "dni-verification-digit") queryName = "DÍGITO VERIFICADOR";
          else if (queryType === "ruc10-names") queryName = "NOMBRES POR RUC 10";
          else if (queryType === "ruc10-by-dni") queryName = "RUC 10 POR DNI";
          else if (queryType === "how-many-same-name") queryName = "¿CUÁNTOS SE LLAMAN COMO YO?";
          else if (queryType === "ruc-debt") queryName = "DEUDA COACTIVA";
          window.dispatchEvent(new CustomEvent("govcheck-notification", {
            detail: {
              title: `Consola API: ${queryName} Exitosa`,
              desc: `Consulta sobre "${cleanedVal}" realizada con éxito usando el proveedor ${category === "free" ? "eldni.com" : "json.pe"}.`,
              type: "success"
            }
          }));
        }
      } else {
        setSearchState("error");
        const errorMsg = data.message || "Error desconocido al procesar la consulta.";
        setErrorMessage(errorMsg);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("govcheck-notification", {
            detail: {
              title: `Consola API: Error en Consulta`,
              desc: `Fallo al consultar "${cleanedVal}": ${errorMsg}`,
              type: "error"
            }
          }));
        }
      }
    } catch (err) {
      setSearchState("error");
      setErrorMessage("Error crítico al conectar con el servidor.");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("govcheck-notification", {
          detail: {
            title: `Consola API: Fallo de Red`,
            desc: `Error crítico de red al consultar "${cleanedVal}".`,
            type: "error"
          }
        }));
      }
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-3xl relative overflow-hidden group", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" }),
        role === "admin" ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-zinc-500", children: [
            /* @__PURE__ */ jsx(Coins, { className: "w-5 h-5 text-amber-500" }),
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold uppercase tracking-widest", children: "Saldo de Créditos" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-4xl font-black text-white", children: credits }),
            /* @__PURE__ */ jsx("span", { className: "text-zinc-500 text-sm font-bold", children: "créditos" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleRecharge,
              disabled: recharging,
              className: "w-full bg-white/5 hover:bg-white/10 disabled:bg-zinc-800 text-zinc-200 hover:text-white font-bold py-3 px-4 rounded-xl border border-white/5 transition-all text-xs flex items-center justify-center gap-2",
              children: recharging ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4" }),
                "Recargar Créditos"
              ] })
            }
          )
        ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-zinc-500", children: [
            /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5 text-primary" }),
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold uppercase tracking-widest", children: "Límites de Invitado" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-zinc-400 font-semibold", children: "Rate Limit:" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-primary font-bold", children: "10 seg entre consultas" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-zinc-400 font-semibold", children: "Consumo por hora:" }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-primary font-bold", children: [
                rateLimitData.count,
                " / 5 consultas"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-zinc-500 font-medium leading-relaxed", children: "Consultando el servicio público para evitar bloqueos temporales del API del estado, se aplica restricción de consultas." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-3xl space-y-4", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-zinc-400 uppercase tracking-widest", children: "Proveedor de Servicio" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-2xl border border-white/5", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                if (role !== "admin") {
                  window.dispatchEvent(new CustomEvent("show-guest-modal"));
                  return;
                }
                setCategory("free");
                const freeTypes = ["dni", "ruc", "ruc10-names", "ruc10-by-dni", "dni-verification-digit", "how-many-same-name"];
                if (!freeTypes.includes(queryType)) {
                  setQueryType("dni");
                }
              },
              className: `py-3 px-4 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${category === "free" ? "bg-white/10 text-white border border-white/5" : "text-zinc-500 hover:text-zinc-300"}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Gratuito" }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] uppercase tracking-widest text-primary font-semibold", children: "SIN COSTO" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                if (role !== "admin") {
                  window.dispatchEvent(new CustomEvent("show-guest-modal"));
                  return;
                }
                setCategory("paid");
              },
              className: `py-3 px-4 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 relative ${category === "paid" ? "bg-white/10 text-white border border-white/5" : "text-zinc-500 hover:text-zinc-300"} ${role !== "admin" ? "opacity-50 cursor-not-allowed" : ""}`,
              children: [
                /* @__PURE__ */ jsxs("span", { className: "font-bold flex items-center gap-1", children: [
                  "Premium",
                  role !== "admin" && /* @__PURE__ */ jsx(Lock, { className: "w-3 h-3 text-zinc-500" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] uppercase tracking-widest text-amber-500 font-semibold", children: "CON COSTO" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-3xl space-y-4", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-zinc-400 uppercase tracking-widest", children: "Tipo de Consulta" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: [
          { id: "dni", name: "DNI (Identidad)", cost: 1, freeAllowed: true },
          { id: "ruc", name: "RUC (Empresas)", cost: 1, freeAllowed: true },
          { id: "ruc10-names", name: "Nombres por RUC 10", cost: 1, freeAllowed: true },
          { id: "ruc10-by-dni", name: "RUC 10 por DNI", cost: 1, freeAllowed: true },
          { id: "dni-verification-digit", name: "Dígito Verificador DNI", cost: 1, freeAllowed: true },
          { id: "how-many-same-name", name: "¿Cuántos se llaman como yo?", cost: 1, freeAllowed: true },
          { id: "license", name: "Licencia MTC", cost: 1, freeAllowed: false },
          { id: "ruc-debt", name: "Deuda Coactiva", cost: 1, freeAllowed: false },
          { id: "plate", name: "SUNARP (Placa)", cost: 2, freeAllowed: false },
          { id: "soat", name: "SOAT Vehicular", cost: 1, freeAllowed: false }
        ].map((item) => {
          const isSelected = queryType === item.id;
          const isAllowed = category === "paid" || item.freeAllowed;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              disabled: !isAllowed,
              onClick: () => {
                if (role !== "admin") {
                  window.dispatchEvent(new CustomEvent("show-guest-modal"));
                  return;
                }
                setQueryType(item.id);
              },
              className: `w-full py-3 px-4 rounded-xl text-xs font-semibold text-left transition-all flex items-center justify-between border ${isSelected ? "bg-primary/20 text-white border-primary/40 shadow-sm" : isAllowed ? "bg-white/5 text-zinc-300 border-transparent hover:bg-white/10" : "bg-zinc-900/50 text-zinc-700 border-transparent opacity-40 cursor-not-allowed"}`,
              children: [
                /* @__PURE__ */ jsx("span", { children: item.name }),
                /* @__PURE__ */ jsx("span", { className: "flex items-center gap-1", children: category === "free" ? item.freeAllowed ? /* @__PURE__ */ jsx("span", { className: "text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md font-bold uppercase", children: "Gratis" }) : /* @__PURE__ */ jsx("span", { className: "text-[9px] bg-zinc-800 text-zinc-600 px-2 py-0.5 rounded-md font-bold uppercase", children: "Bloqueado" }) : /* @__PURE__ */ jsxs("span", { className: "text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-md font-bold uppercase", children: [
                  "-",
                  item.cost,
                  " ",
                  item.cost === 1 ? "crédito" : "créditos"
                ] }) })
              ]
            },
            item.id
          );
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8 space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "glass-panel p-6 rounded-3xl", children: /* @__PURE__ */ jsx("form", { onSubmit: handleQuery, className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-zinc-400 uppercase tracking-widest", children: "Ingresá el identificador para la consulta" }),
        /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col sm:flex-row gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                required: true,
                placeholder: queryType === "dni" || queryType === "ruc10-by-dni" || queryType === "dni-verification-digit" ? "Ingresá DNI (ej. 43234567)" : queryType === "ruc" || queryType === "ruc-debt" || queryType === "ruc10-names" ? "Ingresá RUC (ej. 20123456789)" : queryType === "how-many-same-name" ? "Ingresá solo nombres de pila, sin apellidos (ej. CARLOS o JUAN CARLOS)" : "Ingresá Placa (ej. ABC-1234)",
                value: inputValue,
                onChange: (e) => setInputValue(e.target.value),
                className: "w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: searchState === "loading",
              className: "bg-primary hover:bg-blue-600 disabled:bg-zinc-800 text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 min-w-[140px]",
              children: searchState === "loading" ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                "Consultar API",
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
              ] })
            }
          )
        ] }),
        queryType === "how-many-same-name" && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 mt-2 px-1 text-[11px] text-amber-500/80 font-medium", children: [
          /* @__PURE__ */ jsx(ShieldAlert, { className: "w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsx("p", { children: "Recuerda: Ingresa únicamente nombres de pila. No debes incluir apellidos para esta consulta para evitar errores." })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-3xl overflow-hidden border border-white/5 flex flex-col min-h-[480px]", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-black/30 px-6 py-4 border-b border-white/5 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5", children: [
              /* @__PURE__ */ jsx("span", { className: "w-3 h-3 rounded-full bg-red-500/50" }),
              /* @__PURE__ */ jsx("span", { className: "w-3 h-3 rounded-full bg-yellow-500/50" }),
              /* @__PURE__ */ jsx("span", { className: "w-3 h-3 rounded-full bg-green-500/50" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-zinc-500 font-mono tracking-widest", children: "CONSOLE://API_RESPONSE" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setActiveTab("visual"),
                className: `px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${activeTab === "visual" ? "bg-primary/20 text-primary border border-primary/30" : "text-zinc-500 hover:text-zinc-300"}`,
                children: [
                  /* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }),
                  "Resumen"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setActiveTab("json"),
                className: `px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${activeTab === "json" ? "bg-primary/20 text-primary border border-primary/30" : "text-zinc-500 hover:text-zinc-300"}`,
                children: [
                  /* @__PURE__ */ jsx(Code, { className: "w-3.5 h-3.5" }),
                  "Raw JSON"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 p-6 flex flex-col justify-center", children: /* @__PURE__ */ jsxs(AnimatePresence, { mode: "wait", children: [
          searchState === "idle" && /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "text-center py-20 space-y-4",
              children: [
                /* @__PURE__ */ jsx(Cpu, { className: "w-12 h-12 text-zinc-800 mx-auto" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-zinc-400 font-bold", children: "Consola Lista" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-600 max-w-sm mx-auto mt-1 font-medium", children: "Elegí un proveedor, seleccioná el tipo de consulta, colocá el identificador y ejecutá tu llamada." })
                ] })
              ]
            },
            "idle"
          ),
          searchState === "loading" && /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "text-center py-20 space-y-4",
              children: [
                /* @__PURE__ */ jsx(Loader2, { className: "w-12 h-12 text-primary animate-spin mx-auto" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h4", { className: "text-zinc-200 font-bold", children: [
                    "Conectando con ",
                    category === "free" ? "eldni.com" : "json.pe",
                    "..."
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500 mt-1 font-medium animate-pulse", children: "Consultando base de datos oficial..." })
                ] })
              ]
            },
            "loading"
          ),
          searchState === "error" && /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex gap-4",
              children: [
                /* @__PURE__ */ jsx(ShieldAlert, { className: "w-6 h-6 text-red-500 shrink-0" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-bold text-red-500 text-sm", children: "Error al Consultar API" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-red-400/80 mt-1 leading-relaxed", children: errorMessage })
                ] })
              ]
            },
            "error"
          ),
          searchState === "success" && resultData && /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "h-full flex flex-col justify-between",
              children: activeTab === "visual" ? /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-green-500" }) }),
                  /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-zinc-400 uppercase tracking-widest", children: "Consulta Exitosa" }) })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4 bg-black/20 p-5 rounded-2xl border border-white/5", children: Object.entries(resultData.data).filter(([key]) => key !== "proveedor").map(([key, val]) => /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[9px] text-zinc-500 uppercase font-bold tracking-widest", children: key.replace("_", " ") }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-200 font-semibold font-mono", children: typeof val === "object" ? JSON.stringify(val) : String(val) })
                ] }, key)) }),
                resultData.newCredits !== void 0 && /* @__PURE__ */ jsxs("div", { className: "bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-amber-500 font-semibold", children: "Créditos remanentes en cuenta:" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-white font-bold bg-amber-500/20 px-3 py-1 rounded-lg", children: [
                    resultData.newCredits,
                    " créditos"
                  ] })
                ] })
              ] }) : /* @__PURE__ */ jsx("div", { className: "flex-1 flex flex-col", children: /* @__PURE__ */ jsx("pre", { className: "flex-1 bg-black/50 p-4 rounded-2xl text-xs text-green-400 font-mono overflow-auto border border-white/5 max-h-[360px] scrollbar-thin", children: JSON.stringify(resultData, null, 2) }) })
            },
            "success"
          )
        ] }) })
      ] })
    ] })
  ] });
}

const $$Console = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Consola de Consultas API" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-12 pb-20"> <header> <h1 class="text-3xl font-black text-white tracking-tight sm:text-4xl flex items-center gap-3"> <span>Consola de <span class="text-primary">Consultas API</span></span> <span class="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-black border border-amber-500/20 animate-pulse tracking-widest uppercase">
Beta
</span> </h1> <p class="text-zinc-500 mt-2 font-medium max-w-2xl">
Interactúa con los servicios de consulta directa mediante API pública (eldni) y premium (json.pe).
</p> </header> <section> ${renderComponent($$result2, "ApiConsole", ApiConsole, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/PROYECTOS/govcheck/src/components/dashboard/ApiConsole", "client:component-export": "ApiConsole" })} </section> </div> ` })}`;
}, "C:/PROYECTOS/govcheck/src/pages/console.astro", void 0);

const $$file = "C:/PROYECTOS/govcheck/src/pages/console.astro";
const $$url = "/console";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Console,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
