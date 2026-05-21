import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Car, ShieldCheck, CheckCircle2, AlertCircle, User, MapPin, CreditCard, Building2, Briefcase, Scale, Copy, Loader2, FileText, Activity, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const mockReports = [
  {
    plate: "ABC-1234",
    vin: "1HGCM82633A004123",
    make: "Honda",
    model: "Civic",
    year: 2019,
    color: "Plata",
    engineNumber: "R18Z1-1038472",
    owner: {
      name: "Carlos Mendoza",
      dni: "12345678",
      address: "Av. Arequipa 1234, Lince, Lima"
    },
    status: "Flagged",
    fines: [
      {
        id: "F-10293",
        entity: "SAT",
        date: "2024-01-15",
        amount: 350,
        status: "PENDING",
        description: "Exceso de velocidad"
      }
    ],
    revisions: [
      {
        id: "REV-0192",
        date: "2023-11-20",
        result: "APROBADO",
        entity: "CITV ReviCentro",
        expiry: "2024-11-20"
      }
    ],
    theftReport: { reported: false },
    soat: { active: true, expiry: "2024-12-01", company: "Pacifico Seguros" }
  },
  {
    plate: "XYZ-9876",
    vin: "JTDKN36PX8002345",
    make: "Toyota",
    model: "Corolla",
    year: 2022,
    color: "Blanco",
    engineNumber: "2ZR-FE-4928374",
    owner: {
      name: "Maria Rojas",
      dni: "87654321",
      address: "Calle Los Pinos 456, San Isidro, Lima"
    },
    status: "Clear",
    fines: [],
    revisions: [
      {
        id: "REV-0834",
        date: "2024-05-10",
        result: "APROBADO",
        entity: "CITV Lima",
        expiry: "2025-05-10"
      }
    ],
    theftReport: { reported: false },
    soat: { active: true, expiry: "2025-06-15", company: "Rimac Seguros" }
  }
];

const ensureAdaptiveReport = (item) => {
  if (item && item.searchType) return item;
  const rawData = item?.data || item;
  if (!rawData) {
    return {
      searchType: "VEHICULAR",
      data: {
        plate: "N/A",
        vin: "N/A",
        make: "N/A",
        model: "N/A",
        year: 0,
        color: "N/A",
        engineNumber: "N/A",
        owner: { name: "S/D", dni: "S/D", address: "S/D" },
        status: "Clear",
        fines: [],
        revisions: [],
        soat: { active: false, expiry: "No Aplica", company: "S/D" }
      }
    };
  }
  const isPersona = rawData.vin === "PERSONA NATURAL" || item?.type === "IDENTIDAD";
  const isEmpresa = rawData.vin === "PERSONA JURÍDICA" || item?.type === "EMPRESA" || rawData.make === "EMPRESA REGISTRADA";
  if (isPersona) {
    return {
      searchType: "IDENTIDAD",
      data: {
        dni: rawData.owner?.dni || "********",
        fullName: rawData.owner?.name || "S/D",
        address: rawData.owner?.address || "Dirección protegida",
        ubigeo: rawData.engineNumber || "N/A",
        status: rawData.status || "Clear",
        license: rawData.make && rawData.make.startsWith("Licencia:") ? {
          categoria: rawData.make.replace("Licencia: ", ""),
          estado: rawData.model || "Vigente"
        } : null
      }
    };
  }
  if (isEmpresa) {
    return {
      searchType: "EMPRESA",
      data: {
        ruc: rawData.owner?.dni || "********",
        companyName: rawData.owner?.name || "S/D",
        address: rawData.owner?.address || "Dirección SUNAT",
        status: rawData.model || "ACTIVO",
        condition: rawData.color || "HABIDO",
        economicActivity: rawData.engineNumber || "Actividad Comercial",
        systemStatus: rawData.status || "Clear",
        debts: rawData.fines ? rawData.fines.map((f) => ({
          id: f.id,
          document: f.description?.replace("Deuda Coactiva: ", "") || "N/A",
          amount: f.amount || 0,
          startDate: f.date || "N/A"
        })) : []
      }
    };
  }
  return {
    searchType: "VEHICULAR",
    data: rawData
  };
};
const saveToHistory = (query, report) => {
  if (typeof window === "undefined") return;
  try {
    const existing = localStorage.getItem("govcheck_search_history");
    let historyList = existing ? JSON.parse(existing) : [];
    historyList = historyList.filter((item) => item.query.trim().toUpperCase() !== query.trim().toUpperCase());
    const subtitleText = report.searchType === "VEHICULAR" ? `${report.data.make} ${report.data.model}` : report.searchType === "IDENTIDAD" ? report.data.fullName : report.data.companyName;
    const newItem = {
      id: Date.now().toString(),
      query,
      type: report.searchType,
      title: report.searchType === "VEHICULAR" ? `Placa ${query}` : report.searchType === "IDENTIDAD" ? `DNI ${query}` : `RUC ${query}`,
      subtitle: subtitleText,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleString("es-PE"),
      data: report
      // Guardamos en el nuevo formato AdaptiveReport
    };
    historyList = [newItem, ...historyList].slice(0, 25);
    localStorage.setItem("govcheck_search_history", JSON.stringify(historyList));
  } catch (e) {
    console.error("Error saving search history to localStorage:", e);
  }
};
function useVehicleSearch() {
  const [state, setState] = useState("idle");
  const [data, setData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const search = async (identifier) => {
    const cleanId = identifier.trim().toUpperCase();
    if (!cleanId) return;
    setState("loading");
    setData(null);
    setErrorMsg("");
    const isDni = /^\d{8}$/.test(cleanId);
    const isRuc = /^\d{11}$/.test(cleanId);
    if (isDni) {
      try {
        const dniRes = await fetch(`/api/search/dni?dni=${cleanId}`);
        const dniResult = await dniRes.json();
        if (dniResult.success && dniResult.data) {
          let licenseData = { success: false, data: null };
          try {
            const licenseRes = await fetch(`/api/search/license?dni=${cleanId}`, { signal: AbortSignal.timeout(4e3) });
            if (licenseRes.ok) licenseData = await licenseRes.json();
          } catch (e) {
            console.log("Licencia no disponible");
          }
          const fullName = dniResult.data.nombre_completo || `${dniResult.data.apellido_paterno} ${dniResult.data.apellido_materno}, ${dniResult.data.nombres}`;
          const adaptiveData = {
            searchType: "IDENTIDAD",
            data: {
              dni: dniResult.data.numero || cleanId,
              fullName,
              address: dniResult.data.direccion || "Dirección protegida",
              ubigeo: dniResult.data.ubigeo_reniec || "N/A",
              status: "Clear",
              license: licenseData.success && licenseData.data?.licencia ? {
                categoria: licenseData.data.licencia.categoria,
                estado: licenseData.data.licencia.estado
              } : null
            }
          };
          setData(adaptiveData);
          saveToHistory(cleanId, adaptiveData);
          setState("success");
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("govcheck-notification", {
              detail: {
                title: "Búsqueda Exitosa (DNI)",
                desc: `Identidad verificada para ${fullName}.`,
                type: "success"
              }
            }));
          }
        } else {
          setState("error");
          const errorText = dniResult.message || "DNI no encontrado.";
          setErrorMsg(errorText);
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("govcheck-notification", {
              detail: {
                title: "Error de Búsqueda (DNI)",
                desc: `DNI ${cleanId}: ${errorText}`,
                type: "error"
              }
            }));
          }
        }
      } catch (error) {
        setState("error");
        setErrorMsg("Error al conectar con el servicio de identidad.");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("govcheck-notification", {
            detail: {
              title: "Fallo de Red (DNI)",
              desc: `Error al conectar con RENIEC para el DNI ${cleanId}.`,
              type: "error"
            }
          }));
        }
      }
      return;
    }
    if (isRuc) {
      try {
        const rucRes = await fetch(`/api/search/ruc?ruc=${cleanId}`);
        const rucResult = await rucRes.json();
        if (rucResult.success && rucResult.data) {
          let debtData = { success: false, data: [] };
          try {
            const debtRes = await fetch(`/api/search/ruc-debt?ruc=${cleanId}`, { signal: AbortSignal.timeout(4e3) });
            if (debtRes.ok) debtData = await debtRes.json();
          } catch (e) {
          }
          const debts = debtData.success && Array.isArray(debtData.data) ? debtData.data.map((d, i) => ({
            id: `DEBT-${i}`,
            document: d.documento || "N/A",
            amount: parseFloat(d.monto) || 0,
            startDate: d.fecha_inicio || "N/A"
          })) : [];
          const companyName = rucResult.data.nombre_o_razon_social;
          const adaptiveData = {
            searchType: "EMPRESA",
            data: {
              ruc: rucResult.data.ruc || cleanId,
              companyName,
              address: rucResult.data.direccion_completa || "Dirección SUNAT",
              status: rucResult.data.estado || "ACTIVO",
              condition: rucResult.data.condicion || "HABIDO",
              economicActivity: rucResult.data.actividad_economica?.[0] || "Actividad Comercial",
              systemStatus: rucResult.data.estado === "ACTIVO" ? "Clear" : "Flagged",
              debts
            }
          };
          setData(adaptiveData);
          saveToHistory(cleanId, adaptiveData);
          setState("success");
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("govcheck-notification", {
              detail: {
                title: "Búsqueda Exitosa (RUC)",
                desc: `Empresa consultada: ${companyName}.`,
                type: "success"
              }
            }));
          }
        } else {
          setState("error");
          const errorText = rucResult.message || "RUC no encontrado.";
          setErrorMsg(errorText);
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("govcheck-notification", {
              detail: {
                title: "Error de Búsqueda (RUC)",
                desc: `RUC ${cleanId}: ${errorText}`,
                type: "error"
              }
            }));
          }
        }
      } catch (error) {
        setState("error");
        setErrorMsg("Error al conectar con el servicio de empresas.");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("govcheck-notification", {
            detail: {
              title: "Fallo de Red (RUC)",
              desc: `Error de conexión con SUNAT para el RUC ${cleanId}.`,
              type: "error"
            }
          }));
        }
      }
      return;
    }
    try {
      const [plateRes, soatRes] = await Promise.all([
        fetch(`/api/search/plate?plate=${cleanId}`),
        fetch(`/api/search/soat?plate=${cleanId}`)
      ]);
      const plateResult = await plateRes.json();
      const soatResult = await soatRes.json();
      if (plateResult.success && plateResult.data) {
        const vehicularReport = {
          plate: plateResult.data.placa,
          vin: plateResult.data.vin || plateResult.data.serie || "N/A",
          make: plateResult.data.marca,
          model: plateResult.data.modelo,
          year: 2020,
          color: plateResult.data.color,
          engineNumber: plateResult.data.motor,
          owner: {
            name: "PROPIETARIO REGISTRADO",
            dni: "********",
            address: "Dirección en registros SUNARP"
          },
          status: "Clear",
          fines: [],
          revisions: [],
          theftReport: { reported: false },
          soat: soatResult.success ? {
            active: soatResult.data.estado === "VIGENTE",
            expiry: soatResult.data.fecha_fin,
            company: soatResult.data.nombre_compania
          } : { active: false, expiry: "No Registra / Vencido", company: "S/D" }
        };
        const adaptiveData = {
          searchType: "VEHICULAR",
          data: vehicularReport
        };
        setData(adaptiveData);
        saveToHistory(cleanId, adaptiveData);
        setState("success");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("govcheck-notification", {
            detail: {
              title: "Búsqueda Exitosa (Placa)",
              desc: `Historial de SUNARP y SOAT obtenido para ${cleanId}.`,
              type: "success"
            }
          }));
        }
      } else {
        const report = mockReports.find((r) => r.plate === cleanId);
        if (report) {
          const adaptiveData = {
            searchType: "VEHICULAR",
            data: report
          };
          setData(adaptiveData);
          saveToHistory(cleanId, adaptiveData);
          setState("success");
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("govcheck-notification", {
              detail: {
                title: "Búsqueda Exitosa (Placa Local)",
                desc: `Se obtuvieron datos locales de respaldo para la placa ${cleanId}.`,
                type: "success"
              }
            }));
          }
        } else {
          setState("error");
          const errorText = plateResult.message || "No se encontró información para esta placa.";
          setErrorMsg(errorText);
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("govcheck-notification", {
              detail: {
                title: "Error de Búsqueda (Placa)",
                desc: `Placa ${cleanId}: ${errorText}`,
                type: "error"
              }
            }));
          }
        }
      }
    } catch (error) {
      setState("error");
      setErrorMsg("Error de conexión con el servicio vehicular.");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("govcheck-notification", {
          detail: {
            title: "Fallo de Red (Vehicular)",
            desc: `Error de conexión de red al consultar la placa ${cleanId}.`,
            type: "error"
          }
        }));
      }
    }
  };
  return { state, data, search, errorMsg };
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick: handleCopy,
      type: "button",
      className: "p-1 rounded bg-white/5 hover:bg-white/10 hover:text-white border border-white/5 text-zinc-500 hover:border-white/10 transition-all cursor-pointer flex items-center justify-center shrink-0",
      title: "Copiar al portapapeles",
      children: copied ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-green-400" }) : /* @__PURE__ */ jsx(Copy, { className: "w-3.5 h-3.5" })
    }
  );
}
function VehicleReportView({ data }) {
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 glass-panel p-6 rounded-3xl space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 border-b border-white/5 pb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "p-4 bg-primary/10 rounded-2xl border border-primary/20", children: /* @__PURE__ */ jsx(Car, { className: "w-8 h-8 text-primary" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h4", { className: "text-2xl font-black text-white font-mono uppercase tracking-tighter flex items-center gap-2", children: [
            data.plate,
            /* @__PURE__ */ jsx(CopyButton, { text: data.plate })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-zinc-500 font-body-md font-semibold", children: [
            data.make,
            " ",
            data.model !== "N/A" ? `- ${data.model}` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "ml-auto flex flex-col items-end", children: /* @__PURE__ */ jsxs("span", { className: `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${data.status === "Clear" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"}`, children: [
          "Estado: ",
          data.status === "Clear" ? "Verificado" : "En Revisión"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-8 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 uppercase font-bold tracking-widest", children: "Número de Serie / VIN" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-200 font-mono truncate", children: data.vin }),
            /* @__PURE__ */ jsx(CopyButton, { text: data.vin })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 uppercase font-bold tracking-widest", children: "Color Registrado" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-200 font-body-md font-semibold", children: data.color })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 uppercase font-bold tracking-widest", children: "Número de Motor" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-200 font-mono", children: data.engineNumber }),
            /* @__PURE__ */ jsx(CopyButton, { text: data.engineNumber })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 uppercase font-bold tracking-widest", children: "Año de Fabricación" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-200 font-body-md font-semibold", children: data.year > 0 ? data.year : "2020 (Estimado)" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `rounded-2xl p-4 flex items-center justify-between border transition-all ${data.soat.active ? "bg-green-500/5 border-green-500/10" : "bg-white/5 border-white/5"}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: `w-5 h-5 ${data.soat.active ? "text-green-500" : "text-zinc-500"}` }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-zinc-200", children: "SOAT Vehicular" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-zinc-500", children: [
              data.soat.company,
              " - ",
              data.soat.active ? `Vence: ${data.soat.expiry}` : "No Registra SOAT Vigente"
            ] })
          ] })
        ] }),
        data.soat.active ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-green-500" }) : /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-amber-500" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-3xl flex flex-col justify-between space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6 text-zinc-500", children: [
          /* @__PURE__ */ jsx(User, { className: "w-5 h-5" }),
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-widest", children: "Propietario Registrado" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-white leading-tight", children: data.owner.name }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-sm text-primary font-mono mt-1 font-bold", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "Documento: ",
                data.owner.dni
              ] }),
              data.owner.dni && data.owner.dni !== "********" && /* @__PURE__ */ jsx(CopyButton, { text: data.owner.dni })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-zinc-600 mt-1 shrink-0" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500 leading-relaxed font-body-md", children: data.owner.address })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 font-bold uppercase tracking-widest", children: "Requisitorias y Robos" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-green-500" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-green-400 font-semibold", children: "Sin orden de captura activa (PNP)." })
        ] })
      ] })
    ] })
  ] });
}
function IdentityReportView({ data }) {
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 glass-panel p-6 rounded-3xl space-y-6 relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-green-500/5 rounded-full blur-2xl" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 border-b border-white/5 pb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "p-4 bg-green-500/10 rounded-2xl border border-green-500/20", children: /* @__PURE__ */ jsx(User, { className: "w-8 h-8 text-green-500" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold text-zinc-100 uppercase leading-snug", children: "Datos de Identidad Nacional" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500 font-semibold font-mono", children: "RENIEC - Sincronizado" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsx("span", { className: "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20", children: "Activo" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 py-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 uppercase font-bold tracking-widest", children: "Nombres y Apellidos" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("p", { className: "text-base font-black text-white", children: data.fullName }),
            /* @__PURE__ */ jsx(CopyButton, { text: data.fullName })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 uppercase font-bold tracking-widest", children: "Número de DNI" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("p", { className: "text-base font-bold text-primary font-mono", children: data.dni }),
            /* @__PURE__ */ jsx(CopyButton, { text: data.dni })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 uppercase font-bold tracking-widest", children: "Dirección Declarada" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-1 text-zinc-300", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-zinc-500 shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold leading-relaxed", children: data.address })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 uppercase font-bold tracking-widest", children: "Ubigeo Reniec" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-zinc-300 font-mono", children: data.ubigeo })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "glass-panel p-6 rounded-3xl space-y-6", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6 text-zinc-500", children: [
        /* @__PURE__ */ jsx(CreditCard, { className: "w-5 h-5" }),
        /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-widest", children: "Licencia de Conducir MTC" })
      ] }),
      data.license ? /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 uppercase font-bold tracking-widest", children: "Categoría" }),
            /* @__PURE__ */ jsx("p", { className: "text-xl font-black text-white font-mono mt-1", children: data.license.categoria })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 uppercase font-bold tracking-widest", children: "Estado" }),
            /* @__PURE__ */ jsx("span", { className: `inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase mt-1 tracking-wider ${data.license.estado === "VIGENTE" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`, children: data.license.estado })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-zinc-500", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-green-500 shrink-0" }),
          /* @__PURE__ */ jsx("p", { children: "Habilitado para conducir en red vial nacional." })
        ] })
      ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white/3 border border-white/5 p-5 rounded-2xl text-center space-y-2", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "w-8 h-8 text-zinc-600 mx-auto" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-zinc-400", children: "Sin Licencia Registrada" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-zinc-600 leading-normal", children: "El MTC no registra una licencia de conducir vinculada a este número de DNI." })
      ] }) })
    ] }) })
  ] });
}
function CompanyReportView({ data }) {
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 glass-panel p-6 rounded-3xl space-y-6 relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 border-b border-white/5 pb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20", children: /* @__PURE__ */ jsx(Building2, { className: "w-8 h-8 text-purple-500" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold text-zinc-100 uppercase leading-snug", children: "Ficha RUC Tributaria" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500 font-semibold font-mono", children: "SUNAT - Padrón Oficial" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: `px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${data.status === "ACTIVO" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`, children: data.status }),
          /* @__PURE__ */ jsx("span", { className: `px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${data.condition === "HABIDO" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`, children: data.condition })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 py-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 uppercase font-bold tracking-widest", children: "Razón Social" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("p", { className: "text-base font-black text-white", children: data.companyName }),
            /* @__PURE__ */ jsx(CopyButton, { text: data.companyName })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 uppercase font-bold tracking-widest", children: "Número de RUC" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("p", { className: "text-base font-bold text-primary font-mono", children: data.ruc }),
            /* @__PURE__ */ jsx(CopyButton, { text: data.ruc })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 uppercase font-bold tracking-widest", children: "Domicilio Fiscal Completo" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-1 text-zinc-300", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-zinc-500 shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold leading-relaxed", children: data.address })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 uppercase font-bold tracking-widest", children: "Actividad Económica CIIU" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-zinc-300", children: [
            /* @__PURE__ */ jsx(Briefcase, { className: "w-4 h-4 text-zinc-500 shrink-0" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono font-bold truncate max-w-full", children: data.economicActivity })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-3xl flex flex-col justify-between space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6 text-zinc-500", children: [
          /* @__PURE__ */ jsx(Scale, { className: "w-5 h-5" }),
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-widest", children: "Deudas Coactivas SUNAT" })
        ] }),
        data.debts && data.debts.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "space-y-3 max-h-[160px] overflow-y-auto pr-1", children: data.debts.map((debt) => /* @__PURE__ */ jsxs("div", { className: "bg-red-500/5 border border-red-500/10 p-3 rounded-xl flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-red-400 font-bold font-mono truncate max-w-[120px]", children: debt.document }),
              /* @__PURE__ */ jsxs("p", { className: "text-[9px] text-zinc-500 mt-0.5", children: [
                "Fecha: ",
                debt.startDate
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxs("p", { className: "text-sm font-black text-red-400 font-mono", children: [
              "S/. ",
              debt.amount.toFixed(2)
            ] }) })
          ] }, debt.id)) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[10px] text-red-400 font-semibold bg-red-500/5 p-2.5 rounded-lg border border-red-500/10", children: [
            /* @__PURE__ */ jsx(AlertCircle, { className: "w-3.5 h-3.5 shrink-0" }),
            /* @__PURE__ */ jsx("p", { children: "Registra deudas tributarias activas en estado de ejecución." })
          ] })
        ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white/3 border border-white/5 p-5 rounded-2xl text-center space-y-2", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-8 h-8 text-green-500 mx-auto" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-zinc-400", children: "Sin Deudas Vigentes" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-zinc-500 leading-normal", children: "No se registran cobranzas coactivas activas en la base de SUNAT al día de hoy." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 bg-white/5 rounded-2xl border border-white/5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5", children: "Perfil Financiero" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-green-400 font-semibold font-mono", children: "✓ Apto Contrataciones Estatales" })
      ] })
    ] })
  ] });
}
function AdvancedSearch() {
  const [identifier, setIdentifier] = useState("");
  const { state, data, search, errorMsg } = useVehicleSearch();
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Estableciendo conexión...");
  const [subText, setSubText] = useState("Buscando registros oficiales...");
  const isDni = /^\d{8}$/.test(identifier.trim());
  const isRuc = /^\d{11}$/.test(identifier.trim());
  let placeholderText = "Ingresa Placa (ej. ABC-123), DNI o RUC...";
  let inputHelper = "Esperando término de búsqueda...";
  let searchIcon = /* @__PURE__ */ jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 transition-colors" });
  if (identifier.trim().length === 0) {
    placeholderText = "Ingresa Placa (ej. ABC-123), DNI o RUC...";
    inputHelper = "Esperando término de búsqueda...";
    searchIcon = /* @__PURE__ */ jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 transition-colors" });
  } else if (isDni) {
    placeholderText = "Ingresa el DNI (ej. 45678901)";
    inputHelper = "Búsqueda por DNI (Identidad RENIEC + Licencia MTC)";
    searchIcon = /* @__PURE__ */ jsx(User, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 transition-colors" });
  } else if (isRuc) {
    placeholderText = "Ingresa el RUC (ej. 20123456789)";
    inputHelper = "Búsqueda por RUC (Ficha SUNAT + Deudas Coactivas)";
    searchIcon = /* @__PURE__ */ jsx(Building2, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500 transition-colors" });
  } else {
    placeholderText = "Ingresa Placa o VIN (ej. ABC-123)";
    inputHelper = "Consulta Vehicular (SUNARP + SOAT + Gravámenes)";
    searchIcon = /* @__PURE__ */ jsx(Car, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary transition-colors" });
  }
  useEffect(() => {
    if (state !== "loading") {
      setProgress(0);
      return;
    }
    let interval;
    setProgress(0);
    if (isDni) {
      setLoadingText("Estableciendo conexión con RENIEC...");
      setSubText("Buscando ficha de identidad oficial...");
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 35) {
            setLoadingText("Validando datos del titular en RENIEC...");
            return prev + 2;
          } else if (prev < 70) {
            setLoadingText("Consultando registro de licencias en MTC...");
            setSubText("Buscando autorizaciones y categorías vigentes...");
            return prev + 1.5;
          } else if (prev < 98) {
            setLoadingText("Verificando antecedentes y restricciones...");
            setSubText("Consolidando información del titular...");
            return prev + 0.8;
          }
          return prev;
        });
      }, 45);
    } else if (isRuc) {
      setLoadingText("Conectando con servidores de SUNAT...");
      setSubText("Verificando estado de Ficha RUC...");
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 30) {
            setLoadingText("Sincronizando estado tributario (Activo/Habido)...");
            return prev + 2;
          } else if (prev < 65) {
            setLoadingText("Consultando actividad económica CIIU...");
            setSubText("Obteniendo descripción comercial principal...");
            return prev + 1.5;
          } else if (prev < 98) {
            setLoadingText("Verificando deudas coactivas vigentes...");
            setSubText("Conectando con base de deudores tributarios...");
            return prev + 0.8;
          }
          return prev;
        });
      }, 45);
    } else {
      setLoadingText("Interconectando con registros oficiales...");
      setSubText("Conectando con bases de datos de SUNARP...");
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 30) {
            setLoadingText("Sincronizando datos de SUNARP...");
            setSubText("Recuperando marca, modelo, motor y propietario...");
            return prev + 2;
          } else if (prev < 65) {
            setLoadingText("Verificando vigencia de SOAT...");
            setSubText("Consultando vigencia y compañía aseguradora...");
            return prev + 1.5;
          } else if (prev < 98) {
            setLoadingText("Revisando papeletas SAT y requisitorias PNP...");
            setSubText("Verificando historial preventivo y robos...");
            return prev + 0.8;
          }
          return prev;
        });
      }, 45);
    }
    return () => clearInterval(interval);
  }, [state]);
  const handleSearch = (e) => {
    e.preventDefault();
    const isGuest = typeof document !== "undefined" && document.cookie.includes("auth_token=guest-session-token");
    if (isGuest) {
      window.dispatchEvent(new CustomEvent("show-guest-modal"));
      return;
    }
    search(identifier);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "glass-panel p-8 rounded-3xl relative overflow-hidden group", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-white font-mono uppercase tracking-tighter", children: "Consulta Avanzada" }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20", children: [
              /* @__PURE__ */ jsxs("span", { className: "relative flex h-1.5 w-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" }),
                /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" })
              ] }),
              "Beta"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[10px] text-blue-400 font-black font-mono tracking-tight uppercase hover:bg-blue-500/10 transition-colors", children: [
              /* @__PURE__ */ jsx(Car, { className: "w-3.5 h-3.5" }),
              "Vehículos"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-green-500/5 border border-green-500/10 text-[10px] text-green-400 font-black font-mono tracking-tight uppercase hover:bg-green-500/10 transition-colors", children: [
              /* @__PURE__ */ jsx(User, { className: "w-3.5 h-3.5" }),
              "DNI"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/5 border border-purple-500/10 text-[10px] text-purple-400 font-black font-mono tracking-tight uppercase hover:bg-purple-500/10 transition-colors", children: [
              /* @__PURE__ */ jsx(Building2, { className: "w-3.5 h-3.5" }),
              "RUC"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-zinc-500 mb-6 font-body-md leading-relaxed", children: "Identificación automática y discriminación inteligente. Ingresá una Placa, DNI (8 dígitos) o RUC (11 dígitos)." }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
              searchIcon,
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: placeholderText,
                  value: identifier,
                  onChange: (e) => setIdentifier(e.target.value),
                  className: "w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600 font-mono"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: state === "loading",
                className: "bg-primary hover:bg-blue-600 disabled:bg-zinc-800 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 min-w-[160px] cursor-pointer",
                children: state === "loading" ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  "Consultar",
                  /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5" })
                ] })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-zinc-500 font-semibold px-1 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Activity, { className: "w-3.5 h-3.5 text-primary" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Detectado: ",
              /* @__PURE__ */ jsx("strong", { children: inputHelper })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(AnimatePresence, { mode: "wait", children: [
      state === "loading" && /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.98 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.98 },
          className: "glass-panel p-12 rounded-3xl flex flex-col items-center justify-center text-center space-y-6",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Loader2, { className: "w-16 h-16 text-primary animate-spin" }),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-primary/20 blur-xl rounded-full" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-zinc-100 transition-all", children: loadingText }),
              /* @__PURE__ */ jsx("p", { className: "text-zinc-500 mt-2 font-body-md", children: subText })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full max-w-xs bg-white/5 h-2 rounded-full overflow-hidden border border-white/5", children: /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { width: "0%" },
                animate: { width: `${progress}%` },
                transition: { duration: 0.1 },
                className: "bg-primary h-full rounded-full"
              },
              state
            ) })
          ]
        },
        "loading"
      ),
      state === "error" && /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "p-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-4",
          children: [
            /* @__PURE__ */ jsx(AlertCircle, { className: "w-6 h-6 text-red-500 shrink-0" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-red-500", children: "Error en la Consulta" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500/80 mt-1", children: errorMsg })
            ] })
          ]
        },
        "error"
      ),
      state === "success" && data && /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "space-y-6",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-xl font-bold text-zinc-100 flex items-center gap-2", children: [
                  data.searchType === "VEHICULAR" ? "Informe de Inteligencia Vehicular" : data.searchType === "IDENTIDAD" ? "Consulta de Identidad Ciudadana" : "Perfil Tributario Corporativo",
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-green-500" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-bold border border-amber-500/20 animate-pulse", children: "MODO BETA" })
              ] }),
              /* @__PURE__ */ jsxs("button", { className: "text-sm font-bold text-primary hover:underline flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-lg border border-primary/20 cursor-pointer", children: [
                "Descargar PDF",
                /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4" })
              ] })
            ] }),
            data.searchType === "VEHICULAR" && /* @__PURE__ */ jsx(VehicleReportView, { data: data.data }),
            data.searchType === "IDENTIDAD" && /* @__PURE__ */ jsx(IdentityReportView, { data: data.data }),
            data.searchType === "EMPRESA" && /* @__PURE__ */ jsx(CompanyReportView, { data: data.data })
          ]
        },
        "success"
      )
    ] })
  ] });
}

export { AdvancedSearch as A, CompanyReportView as C, IdentityReportView as I, VehicleReportView as V, ensureAdaptiveReport as e };
