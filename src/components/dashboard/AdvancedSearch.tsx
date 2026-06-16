"use client"
import { useState, useEffect } from 'react';
import { 
  Search, 
  Loader2, 
  Lock,
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
  Copy,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useVehicleSearch } from '../../hooks/useVehicleSearch';
import type { VehicleReport, IdentityReport, CompanyReport, AdaptiveReport, SearchTabType } from '../../hooks/useVehicleSearch';

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
// CSV DOWNLOAD UTILITY
// ==========================================
function downloadCSV(report: AdaptiveReport, query: string) {
  const esc = (v: string | number | boolean | null | undefined) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
  };

  let rows: string[][] = [];

  if (report.searchType === 'VEHICULAR') {
    const d = report.data;
    rows.push(['Campo', 'Valor']);
    rows.push(['Placa', esc(d.plate)]);
    rows.push(['VIN', esc(d.vin)]);
    rows.push(['Marca', esc(d.make)]);
    rows.push(['Modelo', esc(d.model)]);
    rows.push(['Año', esc(d.year)]);
    rows.push(['Color', esc(d.color)]);
    rows.push(['Motor', esc(d.engineNumber)]);
    rows.push(['Propietario', esc(d.owner.name)]);
    rows.push(['DNI Prop.', esc(d.owner.dni)]);
    rows.push(['Dirección', esc(d.owner.address)]);
    rows.push(['Estado', esc(d.status)]);
    rows.push(['SOAT Activo', esc(d.soat.active ? 'Sí' : 'No')]);
    rows.push(['SOAT Vencimiento', esc(d.soat.expiry)]);
    rows.push(['SOAT Compañía', esc(d.soat.company)]);
    if (d.theftReport) {
      rows.push(['Robo Reportado', esc(d.theftReport.reported ? 'Sí' : 'No')]);
      if (d.theftReport.date) rows.push(['Fecha Robo', esc(d.theftReport.date)]);
      if (d.theftReport.details) rows.push(['Detalle Robo', esc(d.theftReport.details)]);
    }

    if (d.fines.length > 0) {
      rows.push([]);
      rows.push(['=== MULTAS ===']);
      rows.push(['ID', 'Entidad', 'Fecha', 'Monto', 'Estado', 'Descripción']);
      d.fines.forEach(f => rows.push([esc(f.id), esc(f.entity), esc(f.date), esc(f.amount), esc(f.status), esc(f.description)]));
    }

    if (d.revisions.length > 0) {
      rows.push([]);
      rows.push(['=== REVISIONES TÉCNICAS ===']);
      rows.push(['ID', 'Fecha', 'Resultado', 'Entidad', 'Vencimiento']);
      d.revisions.forEach(r => rows.push([esc(r.id), esc(r.date), esc(r.result), esc(r.entity), esc(r.expiry)]));
    }
  } else if (report.searchType === 'IDENTIDAD') {
    const d = report.data;
    rows.push(['Campo', 'Valor']);
    rows.push(['DNI', esc(d.dni)]);
    rows.push(['Nombre', esc(d.fullName)]);
    rows.push(['Dirección', esc(d.address)]);
    rows.push(['Ubigeo', esc(d.ubigeo)]);
    rows.push(['Estado', esc(d.status)]);
    if (d.license) {
      rows.push([]);
      rows.push(['=== LICENCIA DE CONDUCIR ===']);
      rows.push(['Categoría', esc(d.license.categoria)]);
      rows.push(['Estado', esc(d.license.estado)]);
    }
  } else if (report.searchType === 'EMPRESA') {
    const d = report.data;
    rows.push(['Campo', 'Valor']);
    rows.push(['RUC', esc(d.ruc)]);
    rows.push(['Razón Social', esc(d.companyName)]);
    rows.push(['Dirección', esc(d.address)]);
    rows.push(['Estado', esc(d.status)]);
    rows.push(['Condición', esc(d.condition)]);
    rows.push(['Actividad', esc(d.economicActivity)]);
    rows.push(['Situación', esc(d.systemStatus)]);

    if (d.debts.length > 0) {
      rows.push([]);
      rows.push(['=== DEUDAS COACTIVAS ===']);
      rows.push(['ID', 'Documento', 'Monto', 'Fecha Inicio']);
      d.debts.forEach(dt => rows.push([esc(dt.id), esc(dt.document), esc(dt.amount), esc(dt.startDate)]));
    }
  }

  const bom = '\uFEFF';
  const csv = bom + rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `govcheck-${query}-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ==========================================
// 1. VEHICLE REPORT SUB-COMPONENT
// ==========================================
export function VehicleReportView({ data }: { data: VehicleReport }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 glass-panel p-5 sm:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-white/5 pb-6">
          <div className="p-3.5 bg-primary/10 rounded-2xl border border-primary/20 w-fit">
            <Car className="w-7 h-7 lg:w-8 lg:h-8 text-primary" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xl lg:text-2xl font-black text-white font-mono uppercase tracking-tighter flex items-center gap-2">
              <span className="truncate">{data.plate}</span>
              <CopyButton text={data.plate} />
            </h4>
            <p className="text-xs lg:text-sm text-zinc-500 font-semibold truncate">{data.make} {data.model !== 'N/A' ? `- ${data.model}` : ''}</p>
          </div>
          <div className="sm:ml-auto flex flex-col items-start sm:items-end">
            <span className={`px-2.5 py-1 rounded-full text-[9px] lg:text-[10px] font-black uppercase tracking-wider border ${
              data.status === 'Clear' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            }`}>
              Estado: {data.status === 'Clear' ? 'Verificado' : 'En Revisión'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 py-2">
          <div className="space-y-1 min-w-0">
            <p className="text-[9px] lg:text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Número de Serie / VIN</p>
            <div className="flex items-center gap-1.5 overflow-hidden">
              <p className="text-xs lg:text-sm text-zinc-200 font-mono truncate">{data.vin}</p>
              <CopyButton text={data.vin} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] lg:text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Color Registrado</p>
            <p className="text-xs lg:text-sm text-zinc-200 font-semibold truncate">{data.color}</p>
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-[9px] lg:text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Número de Motor</p>
            <div className="flex items-center gap-1.5 overflow-hidden">
              <p className="text-xs lg:text-sm text-zinc-200 font-mono truncate">{data.engineNumber}</p>
              <CopyButton text={data.engineNumber} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] lg:text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Año de Fabricación</p>
            <p className="text-xs lg:text-sm text-zinc-200 font-semibold">{data.year > 0 ? data.year : '2020 (Estimado)'}</p>
          </div>
        </div>

        <div className={`rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border transition-all ${
          data.soat.active 
            ? 'bg-green-500/5 border-green-500/10' 
            : 'bg-white/5 border-white/5'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <ShieldCheck className={`w-5 h-5 shrink-0 ${data.soat.active ? 'text-green-500' : 'text-zinc-500'}`} />
            <div className="min-w-0">
              <p className="text-sm font-bold text-zinc-200 truncate">SOAT Vehicular</p>
              <p className="text-[11px] lg:text-xs text-zinc-500 truncate">
                {data.soat.company} - {data.soat.active ? `Vence: ${data.soat.expiry}` : 'No Registra SOAT Vigente'}
              </p>
            </div>
          </div>
          <div className="shrink-0 ml-auto sm:ml-0">
            {data.soat.active ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500" />
            )}
          </div>
        </div>
      </div>

      {/* Propietario y Multas */}
      <div className="glass-panel p-5 sm:p-8 rounded-3xl flex flex-col justify-between space-y-8 lg:space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-6 text-zinc-500">
            <User className="w-5 h-5" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest">Propietario Registrado</h4>
          </div>
          
          <div className="space-y-4">
            <div className="min-w-0">
              <p className="text-lg lg:text-xl font-bold text-white leading-tight truncate">{data.owner.name}</p>
              <div className="flex items-center gap-1.5 text-xs lg:text-sm text-primary font-mono mt-1 font-bold">
                <span className="truncate">DNI: {data.owner.dni}</span>
                {data.owner.dni && data.owner.dni !== '********' && <CopyButton text={data.owner.dni} />}
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-zinc-600 mt-1 shrink-0" />
              <p className="text-[11px] lg:text-xs text-zinc-500 leading-relaxed font-semibold">{data.owner.address}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Seguridad Ciudadana</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
            <p className="text-[11px] text-green-400 font-bold leading-tight">Sin requisitorias ni órdenes de captura.</p>
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
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Ficha Nacional de Identidad */}
      <div className="xl:col-span-2 glass-panel p-5 sm:p-8 rounded-3xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-green-500/5 rounded-full blur-2xl"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-white/5 pb-6">
          <div className="p-3.5 bg-green-500/10 rounded-2xl border border-green-500/20 w-fit">
            <User className="w-7 h-7 lg:w-8 lg:h-8 text-green-500" />
          </div>
          <div>
            <h4 className="text-base lg:text-lg font-bold text-zinc-100 uppercase leading-snug">
              Identidad Nacional
            </h4>
            <p className="text-[10px] lg:text-xs text-zinc-500 font-semibold font-mono">RENIEC - Verificado</p>
          </div>
          <div className="sm:ml-auto">
            <span className="px-3 py-1 rounded-full text-[9px] lg:text-[10px] font-black uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">
              Activo
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 py-2">
          <div className="space-y-1 min-w-0">
            <p className="text-[9px] lg:text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Nombres y Apellidos</p>
            <div className="flex items-center gap-1.5 overflow-hidden">
              <p className="text-sm lg:text-base font-black text-white truncate">{data.fullName}</p>
              <CopyButton text={data.fullName} />
            </div>
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-[9px] lg:text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Número de DNI</p>
            <div className="flex items-center gap-1.5 overflow-hidden">
              <p className="text-sm lg:text-base font-bold text-primary font-mono">{data.dni}</p>
              <CopyButton text={data.dni} />
            </div>
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-[9px] lg:text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Dirección Declarada</p>
            <div className="flex items-start gap-1 text-zinc-300">
              <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
              <p className="text-[11px] lg:text-xs font-semibold leading-relaxed truncate lg:whitespace-normal">{data.address}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] lg:text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Ubigeo Reniec</p>
            <p className="text-xs lg:text-sm font-semibold text-zinc-300 font-mono">{data.ubigeo}</p>
          </div>
        </div>
      </div>

      {/* Licencia de Conducir MTC */}
      <div className="glass-panel p-5 sm:p-8 rounded-3xl space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-6 text-zinc-500">
            <CreditCard className="w-5 h-5" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest">Licencia MTC</h4>
          </div>

          {data.license ? (
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[9px] lg:text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Categoría</p>
                  <p className="text-lg lg:text-xl font-black text-white font-mono mt-1 truncate">{data.license.categoria}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[9px] lg:text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Estado</p>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-black uppercase mt-1 tracking-wider ${
                    data.license.estado === 'VIGENTE' 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {data.license.estado}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-zinc-500 leading-snug">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <p>Habilitado para conducir en red vial nacional.</p>
              </div>
            </div>
          ) : data.license === undefined ? (
            <div className="space-y-4">
              <div className="bg-white/3 border border-amber-500/10 p-5 rounded-2xl text-center space-y-2">
                <Lock className="w-8 h-8 text-amber-600 mx-auto" />
                <p className="text-xs font-bold text-amber-400">Licencia No Disponible</p>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  La consulta de licencias requiere un proveedor premium.{' '}
                  <span className="text-zinc-400">Consultá con tu administrador para habilitar este servicio.</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white/3 border border-white/5 p-5 rounded-2xl text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-xs font-bold text-zinc-400">Sin Licencia Registrada</p>
                <p className="text-[10px] text-zinc-600 leading-normal">
                  No se registra licencia de conducir vinculada a este DNI.
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
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Ficha Tributaria RUC */}
      <div className="xl:col-span-2 glass-panel p-5 sm:p-8 rounded-3xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-white/5 pb-6">
          <div className="p-3.5 bg-purple-500/10 rounded-2xl border border-purple-500/20 w-fit">
            <Building2 className="w-7 h-7 lg:w-8 lg:h-8 text-purple-500" />
          </div>
          <div>
            <h4 className="text-base lg:text-lg font-bold text-zinc-100 uppercase leading-snug">
              Ficha RUC Tributaria
            </h4>
            <p className="text-[10px] lg:text-xs text-zinc-500 font-semibold font-mono">SUNAT - Oficial</p>
          </div>
          <div className="sm:ml-auto flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
              data.status === 'ACTIVO' 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {data.status}
            </span>
            <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
              data.condition === 'HABIDO' 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {data.condition}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 py-2">
          <div className="space-y-1 min-w-0">
            <p className="text-[9px] lg:text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Razón Social</p>
            <div className="flex items-center gap-1.5 overflow-hidden">
              <p className="text-sm lg:text-base font-black text-white truncate">{data.companyName}</p>
              <CopyButton text={data.companyName} />
            </div>
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-[9px] lg:text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Número de RUC</p>
            <div className="flex items-center gap-1.5 overflow-hidden">
              <p className="text-sm lg:text-base font-bold text-primary font-mono">{data.ruc}</p>
              <CopyButton text={data.ruc} />
            </div>
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-[9px] lg:text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Domicilio Fiscal</p>
            <div className="flex items-start gap-1 text-zinc-300">
              <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
              <p className="text-[11px] lg:text-xs font-semibold leading-relaxed truncate lg:whitespace-normal">{data.address}</p>
            </div>
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-[9px] lg:text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Actividad Económica</p>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Briefcase className="w-4 h-4 text-zinc-500 shrink-0" />
              <p className="text-[11px] font-mono font-bold truncate">{data.economicActivity}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Deudas Coactivas SUNAT */}
      <div className="glass-panel p-5 sm:p-8 rounded-3xl flex flex-col justify-between space-y-8 lg:space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-6 text-zinc-500">
            <Scale className="w-5 h-5" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest">Deudas SUNAT</h4>
          </div>

          {data.debts && data.debts.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                {data.debts.map((debt) => (
                  <div key={debt.id} className="bg-red-500/5 border border-red-500/10 p-3 rounded-xl flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] text-red-400 font-bold font-mono truncate">{debt.document}</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5">Fecha: {debt.startDate}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-red-400 font-mono">S/. {debt.amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-red-400 font-bold bg-red-500/5 p-3 rounded-xl border border-red-500/10 leading-tight">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <p>Registra cobranzas coactivas vigentes.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white/3 border border-white/5 p-5 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto" />
                <p className="text-sm font-bold text-zinc-400">Sin Deudas Vigentes</p>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  No registra cobranzas coactivas activas al día de hoy.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5">Perfil Financiero</p>
          <p className="text-[11px] text-green-400 font-bold font-mono">✓ Apto Contrataciones Estatales</p>
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
  const [searchType, setSearchType] = useState<SearchTabType>('identidad');
  const { state, data, search, errorMsg } = useVehicleSearch();

  // Loading States
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Estableciendo conexión...');
  const [subText, setSubText] = useState('Buscando registros oficiales...');

  // Tab config
  const tabs: { id: SearchTabType; label: string; icon: React.ReactNode }[] = [
    { id: 'identidad', label: 'Identidad', icon: <User className="w-4 h-4" /> },
    { id: 'ruc', label: 'RUC', icon: <Building2 className="w-4 h-4" /> },
    { id: 'vehiculo', label: 'Vehículo', icon: <Car className="w-4 h-4" /> },
  ];

  // Dynamic Placeholder & Icons based on tab
  let placeholderText = "Ingresa DNI (8 dígitos) o Nombre...";
  let inputHelper = "Busca por DNI o nombres y apellidos";
  let searchIcon = <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 transition-colors" />;

  if (searchType === 'ruc') {
    if (/^\d{0,11}$/.test(identifier.trim())) {
      placeholderText = "Ingresa el RUC (11 dígitos)";
    }
    inputHelper = "Ficha SUNAT + Deudas Coactivas";
    searchIcon = <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500 transition-colors" />;
  } else if (searchType === 'vehiculo') {
    placeholderText = "Ingresa Placa o VIN...";
    inputHelper = "SUNARP + SOAT + Gravámenes";
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

    if (searchType === 'identidad') {
      setLoadingText("Conectando con RENIEC...");
      setSubText("Buscando ficha de identidad...");
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 35) {
            setLoadingText("Validando datos...");
            return prev + 2;
          } else if (prev < 70) {
            setLoadingText("Consultando MTC...");
            setSubText("Buscando licencias vigentes...");
            return prev + 1.5;
          } else if (prev < 98) {
            setLoadingText("Verificando restricciones...");
            return prev + 0.8;
          }
          return prev;
        });
      }, 45);
    } else if (searchType === 'ruc') {
      setLoadingText("Conectando con SUNAT...");
      setSubText("Verificando estado de Ficha...");
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 30) {
            setLoadingText("Sincronizando estado...");
            return prev + 2;
          } else if (prev < 65) {
            setLoadingText("Consultando CIIU...");
            return prev + 1.5;
          } else if (prev < 98) {
            setLoadingText("Verificando deudas...");
            return prev + 0.8;
          }
          return prev;
        });
      }, 45);
    } else {
      setLoadingText("Interconectando...");
      setSubText("Conectando con SUNARP...");
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 30) {
            setLoadingText("Sincronizando SUNARP...");
            setSubText("Recuperando marca, modelo, motor y propietario...");
            return prev + 2;
          } else if (prev < 65) {
            setLoadingText("Verificando SOAT...");
            return prev + 1.5;
          } else if (prev < 98) {
            setLoadingText("Revisando SAT y PNP...");
            return prev + 0.8;
          }
          return prev;
        });
      }, 45);
    }

    return () => clearInterval(interval);
  }, [state, searchType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const isGuest = typeof document !== 'undefined' && document.cookie.includes('auth_token=guest-session-token');
    if (isGuest) {
      window.dispatchEvent(new CustomEvent('show-guest-modal'));
      return;
    }
    search(identifier, searchType);
  };

  return (
    <div className="space-y-8">
      <div className="glass-panel p-5 sm:p-10 rounded-[2.5rem] relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-white font-mono uppercase tracking-tighter">
                Consulta Avanzada
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                </span>
                Experimental
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1.5 p-1 bg-black/30 rounded-2xl border border-white/5 w-fit"
              role="tablist"
              aria-label="Tipo de consulta"
            >
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={searchType === tab.id}
                  onClick={() => setSearchType(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                    searchType === tab.id
                      ? 'bg-primary/15 text-white border border-primary/30 shadow-lg shadow-primary/10'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                {searchIcon}
                <input
                  type="text"
                  placeholder={placeholderText}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm sm:text-base text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600 font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={state === 'loading'}
                className="bg-primary hover:bg-blue-600 disabled:bg-zinc-800 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 md:min-w-[180px] cursor-pointer text-sm sm:text-base active:scale-[0.98]"
              >
                {state === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Consultar
                    <Search className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
            <div className="text-[10px] sm:text-[11px] text-zinc-500 font-bold px-1 flex items-center gap-2 uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span>{inputHelper}</span>
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
            className="glass-panel p-10 sm:p-16 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="relative">
              <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-primary animate-spin" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-zinc-100">{loadingText}</h3>
              <p className="text-xs sm:text-sm text-zinc-500 mt-2 font-semibold">{subText}</p>
            </div>
            <div className="w-full max-w-[240px] bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                key={state}
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                className="bg-primary h-full rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              />
            </div>
          </motion.div>
        )}

        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-red-500/5 border border-red-500/15 flex items-start gap-4"
          >
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h3 className="font-bold text-red-500 text-sm sm:text-base">Error en la Consulta</h3>
              <p className="text-[11px] sm:text-xs text-red-500/70 mt-1 leading-relaxed">
                {errorMsg}
              </p>
            </div>
          </motion.div>
        )}

        {state === 'success' && data && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg sm:text-xl font-bold text-zinc-100 flex items-center gap-2">
                  {data.searchType === 'VEHICULAR' ? 'Informe Vehicular' :
                   data.searchType === 'IDENTIDAD' ? 'Consulta Identidad' :
                   'Perfil Tributario'}
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </h3>
              </div>
              <button
                onClick={() => downloadCSV(data, identifier)}
                className="text-xs font-black text-primary hover:text-white flex items-center justify-center gap-2 bg-primary/5 px-4 py-2.5 rounded-xl border border-primary/20 cursor-pointer transition-all uppercase tracking-widest active:scale-95"
              >
                Descargar CSV
                <Download className="w-4 h-4" />
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
