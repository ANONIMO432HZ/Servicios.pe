import { c as createComponent } from './astro-component_DNiUXFEw.mjs';
import 'piccolore';
import { ba as renderTemplate, aW as maybeRenderHead } from './params-and-props_CvnwIJai.mjs';
import { r as renderComponent } from './server_Uic00SnP.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_Bu4cbNIG.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Trash2, Search, Calendar, Eye, X, CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { V as VehicleReportView, I as IdentityReportView, C as CompanyReportView, e as ensureAdaptiveReport } from './AdvancedSearch_C3GCPH3A.mjs';

function SearchHistory() {
  const [history, setHistory] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  useEffect(() => {
    const loadHistory = () => {
      const stored = localStorage.getItem("govcheck_search_history");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const mapped = parsed.map((item) => ({
            ...item,
            data: ensureAdaptiveReport(item.data)
          }));
          setHistory(mapped);
        } catch (e) {
          console.error("Error parsing history:", e);
        }
      }
    };
    loadHistory();
  }, []);
  const deleteItem = (id, e) => {
    e.stopPropagation();
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("govcheck_search_history", JSON.stringify(updated));
  };
  const clearAll = () => {
    if (confirm("¿Estás seguro de que querés borrar todo tu historial de consultas?")) {
      setHistory([]);
      localStorage.removeItem("govcheck_search_history");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    history.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-zinc-500 font-medium text-sm", children: [
        "Mostrando las últimas ",
        history.length,
        " consultas almacenadas localmente."
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: clearAll,
          className: "flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-red-500/20 cursor-pointer",
          children: [
            /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }),
            "Limpiar Historial"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { mode: "popLayout", children: history.length === 0 ? /* @__PURE__ */ jsxs(
      motion.section,
      {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.98 },
        className: "glass-panel p-20 rounded-3xl flex flex-col items-center justify-center text-center border border-white/5",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "relative mb-6", children: [
            /* @__PURE__ */ jsx(Search, { className: "w-16 h-16 text-zinc-800" }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-primary/5 blur-2xl rounded-full" })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-zinc-400", children: "Sin historial reciente" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-600 font-medium max-w-xs mt-2 leading-relaxed", children: "Las consultas vehiculares, de DNI y RUC que realices en el portal se guardarán de forma local en tu navegador." }),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "/",
              className: "mt-8 flex items-center gap-2 bg-white/5 hover:bg-white/10 text-primary px-6 py-3 rounded-xl font-bold border border-white/5 transition-all active:scale-[0.98]",
              children: [
                "Realizar mi primera búsqueda",
                /* @__PURE__ */ jsx(Search, { className: "w-4 h-4" })
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: history.map((item) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        layout: true,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95 },
        transition: { duration: 0.2 },
        onClick: () => setSelectedReport(item.data),
        className: "glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden",
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute -right-10 -top-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("span", { className: `px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${item.type === "VEHICULAR" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : item.type === "IDENTIDAD" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-purple-500/10 text-purple-400 border-purple-500/20"}`, children: item.type }),
              /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-zinc-600 font-bold flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3" }),
                item.timestamp.split(" ")[0]
              ] })
            ] }),
            /* @__PURE__ */ jsx("h4", { className: "text-xl font-black text-white font-mono tracking-tight uppercase mb-1", children: item.query }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-400 font-bold truncate pr-6 mb-2", children: item.subtitle })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-6 pt-4 border-t border-white/5", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-zinc-500 font-medium group-hover:text-primary transition-colors flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }),
              "Ver informe completo"
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => deleteItem(item.id, e),
                className: "p-1.5 hover:bg-red-500/10 text-zinc-600 hover:text-red-400 rounded-lg transition-all cursor-pointer border border-transparent hover:border-red-500/20",
                title: "Eliminar de historial",
                children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
              }
            )
          ] })
        ]
      },
      item.id
    )) }) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: selectedReport && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto",
        onClick: () => setSelectedReport(null),
        children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { scale: 0.95, y: 20 },
            animate: { scale: 1, y: 0 },
            exit: { scale: 0.95, y: 20 },
            transition: { type: "spring", damping: 25, stiffness: 350 },
            onClick: (e) => e.stopPropagation(),
            className: "w-full max-w-4xl glass-panel border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto",
            children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setSelectedReport(null),
                  className: "absolute top-6 right-6 p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-white/5 cursor-pointer z-10",
                  children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between border-b border-white/5 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-xl font-bold text-zinc-100 flex items-center gap-2", children: [
                  selectedReport.searchType === "VEHICULAR" ? "Informe de Inteligencia Vehicular" : selectedReport.searchType === "IDENTIDAD" ? "Consulta de Identidad Ciudadana" : "Perfil Tributario Corporativo",
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-green-500" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold", children: "HISTORIAL" })
              ] }) }),
              selectedReport.searchType === "VEHICULAR" && /* @__PURE__ */ jsx(VehicleReportView, { data: selectedReport.data }),
              selectedReport.searchType === "IDENTIDAD" && /* @__PURE__ */ jsx(IdentityReportView, { data: selectedReport.data }),
              selectedReport.searchType === "EMPRESA" && /* @__PURE__ */ jsx(CompanyReportView, { data: selectedReport.data })
            ]
          }
        )
      }
    ) })
  ] });
}

const $$History = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Historial de Consultas" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-12 pb-20"> <header> <h1 class="text-3xl font-black text-white tracking-tight sm:text-4xl">
Historial de <span class="text-primary">Consultas</span> </h1> <p class="text-zinc-500 mt-2 font-medium max-w-2xl">
Revisa las búsquedas de Placa, DNI o RUC realizadas recientemente de forma local en tu navegador.
</p> </header> ${renderComponent($$result2, "SearchHistory", SearchHistory, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/PROYECTOS/govcheck/src/components/dashboard/SearchHistory", "client:component-export": "SearchHistory" })} </div> ` })}`;
}, "C:/PROYECTOS/govcheck/src/pages/history.astro", void 0);

const $$file = "C:/PROYECTOS/govcheck/src/pages/history.astro";
const $$url = "/history";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$History,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
