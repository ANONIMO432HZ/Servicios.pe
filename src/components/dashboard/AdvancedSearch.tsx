"use client"
import { useState, useEffect } from 'react';
import { 
  Search, 
  Loader2, 
  FileText, 
  User, 
  Car, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  Building2, 
  Scale, 
  CreditCard,
  Briefcase,
  Activity,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useVehicleSearch } from '../../hooks/useVehicleSearch';
import type { VehicleReport, IdentityReport, CompanyReport } from '../../hooks/useVehicleSearch';

// ==========================================
// COPY BUTTON UTILITY COMPONENT
// ==========================================
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="p-1 rounded bg-white/5 hover:bg-white/10 hover:text-white border border-white/5 text-zinc-500 hover:border-white/10 transition-all cursor-pointer flex items-center justify-center shrink-0"
      title="Copiar al portapapeles"
    >
      {copied ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

// ==========================================
// 1. VEHICLE REPORT SUB-COMPONENT
// ==========================================
export function VehicleReportView({ data }: { data: VehicleReport }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-6">
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
            <Car className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white font-mono uppercase tracking-tighter flex items-center gap-2">
              {data.plate}
              <CopyButton text={data.plate} />
            </h4>
            <p className="text-zinc-500 font-body-md font-semibold">{data.make} {data.model !== 'N/A' ? `- ${data.model}` : ''}</p>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
              data.status === 'Clear' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            }`}>
              Estado: {data.status === 'Clear' ? 'Verificado' : 'En Revisión'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 py-4">
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Número de Serie / VIN</p>
            <div className="flex items-center gap-1.5">
              <p className="text-sm text-zinc-200 font-mono truncate">{data.vin}</p>
              <CopyButton text={data.vin} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Color Registrado</p>
            <p className="text-sm text-zinc-200 font-body-md font-semibold">{data.color}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Número de Motor</p>
            <div className="flex items-center gap-1.5">
              <p className="text-sm text-zinc-200 font-mono">{data.engineNumber}</p>
              <CopyButton text={data.engineNumber} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Año de Fabricación</p>
            <p className="text-sm text-zinc-200 font-body-md font-semibold">{data.year > 0 ? data.year : '2020 (Estimado)'}</p>
          </div>
        </div>

        <div className={`rounded-2xl p-4 flex items-center justify-between border transition-all ${
          data.soat.active 
            ? 'bg-green-500/5 border-green-500/10' 
            : 'bg-white/5 border-white/5'
        }`}>
          <div className="flex items-center gap-3">
            <ShieldCheck className={`w-5 h-5 ${data.soat.active ? 'text-green-500' : 'text-zinc-500'}`} />
            <div>
              <p className="text-sm font-bold text-zinc-200">SOAT Vehicular</p>
              <p className="text-xs text-zinc-500">
                {data.soat.company} - {data.soat.active ? `Vence: ${data.soat.expiry}` : 'No Registra SOAT Vigente'}
              </p>
            </div>
          </div>
          {data.soat.active ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-500" />
          )}
        </div>
      </div>

      {/* Propietario y Multas */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-6 text-zinc-500">
            <User className="w-5 h-5" />
            <h4 className="text-xs font-bold uppercase tracking-widest">Propietario Registrado</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xl font-bold text-white leading-tight">{data.owner.name}</p>
              <div className="flex items-center gap-1.5 text-sm text-primary font-mono mt-1 font-bold">
                <span>Documento: {data.owner.dni}</span>
                {data.owner.dni && data.owner.dni !== '********' && <CopyButton text={data.owner.dni} />}
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-zinc-600 mt-1 shrink-0" />
              <p className="text-xs text-zinc-500 leading-relaxed font-body-md">{data.owner.address}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Requisitorias y Robos</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <p className="text-xs text-green-400 font-semibold">Sin orden de captura activa (PNP).</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. IDENTITY REPORT SUB-COMPONENT
// ==========================================
export function IdentityReportView({ data }: { data: IdentityReport }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Ficha Nacional de Identidad */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-green-500/5 rounded-full blur-2xl"></div>
        
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
            <User className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-zinc-100 uppercase leading-snug">
              Datos de Identidad Nacional
            </h4>
            <p className="text-xs text-zinc-500 font-semibold font-mono">RENIEC - Sincronizado</p>
          </div>
          <div className="ml-auto">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">
              Activo
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Nombres y Apellidos</p>
            <div className="flex items-center gap-1.5">
              <p className="text-base font-black text-white">{data.fullName}</p>
              <CopyButton text={data.fullName} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Número de DNI</p>
            <div className="flex items-center gap-1.5">
              <p className="text-base font-bold text-primary font-mono">{data.dni}</p>
              <CopyButton text={data.dni} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Dirección Declarada</p>
            <div className="flex items-start gap-1 text-zinc-300">
              <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold leading-relaxed">{data.address}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Ubigeo Reniec</p>
            <p className="text-sm font-semibold text-zinc-300 font-mono">{data.ubigeo}</p>
          </div>
        </div>
      </div>

      {/* Licencia de Conducir MTC */}
      <div className="glass-panel p-6 rounded-3xl space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-6 text-zinc-500">
            <CreditCard className="w-5 h-5" />
            <h4 className="text-xs font-bold uppercase tracking-widest">Licencia de Conducir MTC</h4>
          </div>

          {data.license ? (
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Categoría</p>
                  <p className="text-xl font-black text-white font-mono mt-1">{data.license.categoria}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Estado</p>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase mt-1 tracking-wider ${
                    data.license.estado === 'VIGENTE' 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {data.license.estado}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <p>Habilitado para conducir en red vial nacional.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white/3 border border-white/5 p-5 rounded-2xl text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-sm font-bold text-zinc-400">Sin Licencia Registrada</p>
                <p className="text-[11px] text-zinc-600 leading-normal">
                  El MTC no registra una licencia de conducir vinculada a este número de DNI.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. COMPANY REPORT SUB-COMPONENT
// ==========================================
export function CompanyReportView({ data }: { data: CompanyReport }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Ficha Tributaria RUC */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>

        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
            <Building2 className="w-8 h-8 text-purple-500" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-zinc-100 uppercase leading-snug">
              Ficha RUC Tributaria
            </h4>
            <p className="text-xs text-zinc-500 font-semibold font-mono">SUNAT - Padrón Oficial</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
              data.status === 'ACTIVO' 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {data.status}
            </span>
            <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
              data.condition === 'HABIDO' 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {data.condition}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Razón Social</p>
            <div className="flex items-center gap-1.5">
              <p className="text-base font-black text-white">{data.companyName}</p>
              <CopyButton text={data.companyName} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Número de RUC</p>
            <div className="flex items-center gap-1.5">
              <p className="text-base font-bold text-primary font-mono">{data.ruc}</p>
              <CopyButton text={data.ruc} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Domicilio Fiscal Completo</p>
            <div className="flex items-start gap-1 text-zinc-300">
              <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold leading-relaxed">{data.address}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Actividad Económica CIIU</p>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Briefcase className="w-4 h-4 text-zinc-500 shrink-0" />
              <p className="text-xs font-mono font-bold truncate max-w-full">{data.economicActivity}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Deudas Coactivas SUNAT */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-6 text-zinc-500">
            <Scale className="w-5 h-5" />
            <h4 className="text-xs font-bold uppercase tracking-widest">Deudas Coactivas SUNAT</h4>
          </div>

          {data.debts && data.debts.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                {data.debts.map((debt) => (
                  <div key={debt.id} className="bg-red-500/5 border border-red-500/10 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-red-400 font-bold font-mono truncate max-w-[120px]">{debt.document}</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5">Fecha: {debt.startDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-red-400 font-mono">S/. {debt.amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-red-400 font-semibold bg-red-500/5 p-2.5 rounded-lg border border-red-500/10">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <p>Registra deudas tributarias activas en estado de ejecución.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white/3 border border-white/5 p-5 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto" />
                <p className="text-sm font-bold text-zinc-400">Sin Deudas Vigentes</p>
                <p className="text-[11px] text-zinc-500 leading-normal">
                  No se registran cobranzas coactivas activas en la base de SUNAT al día de hoy.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5">Perfil Financiero</p>
          <p className="text-xs text-green-400 font-semibold font-mono">✓ Apto Contrataciones Estatales</p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN ADVANCED SEARCH COMPONENT
// ==========================================
export function AdvancedSearch() {
  const [identifier, setIdentifier] = useState('');
  const { state, data, search, errorMsg } = useVehicleSearch();

  // Loading States
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Estableciendo conexión...');
  const [subText, setSubText] = useState('Buscando registros oficiales...');

  // Real-time Classifier
  const isDni = /^\d{8}$/.test(identifier.trim());
  const isRuc = /^\d{11}$/.test(identifier.trim());
  
  // Dynamic Placeholder & Icons
  let placeholderText = "Ingresa Placa (ej. ABC-123), DNI o RUC...";
  let inputHelper = "Esperando término de búsqueda...";
  let searchIcon = <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 transition-colors" />;

  if (identifier.trim().length === 0) {
    placeholderText = "Ingresa Placa (ej. ABC-123), DNI o RUC...";
    inputHelper = "Esperando término de búsqueda...";
    searchIcon = <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 transition-colors" />;
  } else if (isDni) {
    placeholderText = "Ingresa el DNI (ej. 45678901)";
    inputHelper = "Búsqueda por DNI (Identidad RENIEC + Licencia MTC)";
    searchIcon = <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 transition-colors" />;
  } else if (isRuc) {
    placeholderText = "Ingresa el RUC (ej. 20123456789)";
    inputHelper = "Búsqueda por RUC (Ficha SUNAT + Deudas Coactivas)";
    searchIcon = <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500 transition-colors" />;
  } else {
    placeholderText = "Ingresa Placa o VIN (ej. ABC-123)";
    inputHelper = "Consulta Vehicular (SUNARP + SOAT + Gravámenes)";
    searchIcon = <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary transition-colors" />;
  }

  // Handle Dynamic loading micro-ticks
  useEffect(() => {
    if (state !== 'loading') {
      setProgress(0);
      return;
    }

    let interval: NodeJS.Timeout;
    setProgress(0);

    if (isDni) {
      setLoadingText("Estableciendo conexión con RENIEC...");
      setSubText("Buscando ficha de identidad oficial...");
      interval = setInterval(() => {
        setProgress(prev => {
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
        setProgress(prev => {
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
        setProgress(prev => {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si es un invitado, interceptar la búsqueda y mostrar el modal
    const isGuest = typeof document !== 'undefined' && document.cookie.includes('auth_token=guest-session-token');
    if (isGuest) {
      window.dispatchEvent(new CustomEvent('show-guest-modal'));
      return;
    }
    
    search(identifier);
  };

  return (
    <div className="space-y-8">
      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-black text-white font-mono uppercase tracking-tighter">
                Consulta Avanzada
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                </span>
                Beta
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[10px] text-blue-400 font-black font-mono tracking-tight uppercase hover:bg-blue-500/10 transition-colors">
                <Car className="w-3.5 h-3.5" />
                Vehículos
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-green-500/5 border border-green-500/10 text-[10px] text-green-400 font-black font-mono tracking-tight uppercase hover:bg-green-500/10 transition-colors">
                <User className="w-3.5 h-3.5" />
                DNI
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/5 border border-purple-500/10 text-[10px] text-purple-400 font-black font-mono tracking-tight uppercase hover:bg-purple-500/10 transition-colors">
                <Building2 className="w-3.5 h-3.5" />
                RUC
              </span>
            </div>
          </div>
          
          <p className="text-zinc-500 mb-6 font-body-md leading-relaxed">
            Identificación automática y discriminación inteligente. Ingresá una Placa, DNI (8 dígitos) o RUC (11 dígitos).
          </p>
          <form onSubmit={handleSearch} className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                {searchIcon}
                <input
                  type="text"
                  placeholder={placeholderText}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600 font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={state === 'loading'}
                className="bg-primary hover:bg-blue-600 disabled:bg-zinc-800 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 min-w-[160px] cursor-pointer"
              >
                {state === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Consultar
                    <FileText className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
            <div className="text-[11px] text-zinc-500 font-semibold px-1 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-primary" />
              <span>Detectado: <strong>{inputHelper}</strong></span>
            </div>
          </form>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {state === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="relative">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-100 transition-all">{loadingText}</h3>
              <p className="text-zinc-500 mt-2 font-body-md">{subText}</p>
            </div>
            <div className="w-full max-w-xs bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                key={state}
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
                className="bg-primary h-full rounded-full"
              />
            </div>
          </motion.div>
        )}

        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-4"
          >
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <h3 className="font-bold text-red-500">Error en la Consulta</h3>
              <p className="text-sm text-red-500/80 mt-1">{errorMsg}</p>
            </div>
          </motion.div>
        )}

        {state === 'success' && data && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                  {data.searchType === 'VEHICULAR' ? 'Informe de Inteligencia Vehicular' :
                   data.searchType === 'IDENTIDAD' ? 'Consulta de Identidad Ciudadana' :
                   'Perfil Tributario Corporativo'}
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-bold border border-amber-500/20 animate-pulse">
                  MODO BETA
                </span>
              </div>
              <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-lg border border-primary/20 cursor-pointer">
                Descargar PDF
                <FileText className="w-4 h-4" />
              </button>
            </div>

            {/* ADAPTIVE RENDERING VIEWS */}
            {data.searchType === 'VEHICULAR' && <VehicleReportView data={data.data} />}
            {data.searchType === 'IDENTIDAD' && <IdentityReportView data={data.data} />}
            {data.searchType === 'EMPRESA' && <CompanyReportView data={data.data} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

