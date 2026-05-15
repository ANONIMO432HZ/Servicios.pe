'use client'

import { useState } from 'react';
import { useVehicleSearch } from '@/hooks/useVehicleSearch';
import { Search, Loader2, AlertCircle, ShieldCheck, FileWarning, Car, Building, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { state, data, search, errorMsg } = useVehicleSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col space-y-8">
      <div className="bg-surface rounded-xl p-8 border border-outline-variant shadow-sm text-center max-w-3xl mx-auto w-full">
         <div className="mb-6 inline-flex p-4 bg-primary/10 text-primary rounded-full">
            <Search className="w-8 h-8" />
         </div>
         <h1 className="font-headline-lg text-on-surface tracking-tight mb-2">Búsqueda Centralizada</h1>
         <p className="font-body-md text-on-surface-variant mb-8">Ingrese el número de placa o VIN para buscar en las bases de datos de SUNARP, SUTRAN, SAT y PNP integradas.</p>
         
         <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej. ABC-1234 o 1HGCM..."
                className="w-full px-5 py-4 bg-surface-light border-2 border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 text-on-surface placeholder:text-on-surface-variant text-lg font-mono tracking-wider shadow-sm transition-all uppercase"
                disabled={state === 'loading'}
                autoFocus
              />
            </div>
            <button 
              type="submit"
              disabled={state === 'loading' || !query.trim()}
              className="px-8 py-4 bg-primary text-on-primary font-label-md font-medium rounded-xl hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center min-w-[160px]"
            >
              {state === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Buscando
                </>
              ) : (
                'Consultar'
              )}
            </button>
         </form>

         {/* Helper texts below search */}
         <div className="mt-8 flex flex-wrap justify-center gap-4 font-label-sm text-on-surface-variant">
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1 text-primary"/> Conexión Segura MTC</span>
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1 text-primary"/> Encriptación E2E</span>
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1 text-primary"/> Autenticado</span>
         </div>
      </div>

      {state === 'loading' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
           <div className="bg-surface rounded-xl h-64 border border-outline-variant"></div>
           <div className="bg-surface rounded-xl h-64 border border-outline-variant"></div>
           <div className="bg-surface rounded-xl h-64 border border-outline-variant"></div>
        </div>
      )}

      {state === 'error' && (
        <div className="bg-error-container border-l-4 border-error p-6 rounded-lg flex items-start space-x-4 max-w-4xl mx-auto w-full">
           <AlertCircle className="w-6 h-6 text-error shrink-0 mt-0.5" />
           <div>
             <h3 className="font-headline-md text-error text-lg font-semibold mb-1">Error de Conexión</h3>
             <p className="font-body-md text-on-error-container">{errorMsg}</p>
           </div>
        </div>
      )}

      {state === 'success' && data && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {/* Header Banner that shows immediate status */}
           <div className={`p-6 rounded-xl border flex items-center justify-between ${
             data.status === 'Clear' 
              ? 'bg-status-success/10 border-status-success/30 text-status-success' 
              : 'bg-error-container border-error/30 text-on-error-container'
           }`}>
              <div className="flex items-center space-x-4">
                 {data.status === 'Clear' ? <ShieldCheck className="w-8 h-8" /> : <FileWarning className="w-8 h-8 text-error" />}
                 <div>
                   <h2 className="font-headline-md font-semibold text-xl">
                     {data.status === 'Clear' ? 'Vehículo sin alertas activas' : 'Atención: Existen alertas vigentes'}
                   </h2>
                   <p className="font-body-md opacity-90">Reporte oficial GovCheck generado el {format(new Date(), "d 'de' MMMM, yyyy - HH:mm", { locale: es })}</p>
                 </div>
              </div>
              <div className="font-mono text-xl font-bold px-4 py-2 bg-surface/50 rounded-lg shadow-sm">
                PLACA: {data.plate}
              </div>
           </div>

           {/* 3 Column Layout */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Col 1: Datos del Vehículo y Propietario */}
              <div className="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
                 <div className="px-6 py-4 border-b border-outline-variant flex items-center bg-surface-container-lowest">
                    <Car className="w-5 h-5 mr-2 text-primary" />
                    <h3 className="font-headline-md text-lg font-semibold text-on-surface">Identificación</h3>
                 </div>
                 <div className="p-6 flex-1 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-label-sm text-on-surface-variant uppercase">Marca</p>
                        <p className="font-body-md text-on-surface font-medium">{data.make}</p>
                      </div>
                      <div>
                        <p className="font-label-sm text-on-surface-variant uppercase">Modelo</p>
                        <p className="font-body-md text-on-surface font-medium">{data.model}</p>
                      </div>
                      <div>
                        <p className="font-label-sm text-on-surface-variant uppercase">Año</p>
                        <p className="font-body-md text-on-surface font-medium">{data.year}</p>
                      </div>
                      <div>
                        <p className="font-label-sm text-on-surface-variant uppercase">Color</p>
                        <p className="font-body-md text-on-surface font-medium">{data.color}</p>
                      </div>
                    </div>
                    <div className="border-t border-outline-variant pt-4">
                       <p className="font-label-sm text-on-surface-variant uppercase mb-1">VIN / Nro. Serie</p>
                       <p className="font-mono text-sm text-on-surface bg-surface-container-low p-2 rounded-md">{data.vin}</p>
                    </div>
                    <div className="border-t border-outline-variant pt-4">
                       <h4 className="font-label-md font-semibold text-on-surface mb-2 flex items-center">
                         <Building className="w-4 h-4 mr-1" /> Datos del Propietario (SUNARP)
                       </h4>
                       <p className="font-body-md text-on-surface">{data.owner.name}</p>
                       <p className="font-label-sm text-on-surface-variant">DNI/RUC: {data.owner.dni}</p>
                       <p className="font-label-sm text-on-surface-variant mt-1 line-clamp-2">{data.owner.address}</p>
                    </div>
                 </div>
              </div>

              {/* Col 2: Estado Legal y Papeletas */}
              <div className="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col md:col-span-2 lg:col-span-1">
                 <div className="px-6 py-4 border-b border-outline-variant flex items-center bg-surface-container-lowest">
                    <AlertTriangle className="w-5 h-5 mr-2 text-error" />
                    <h3 className="font-headline-md text-lg font-semibold text-on-surface">Legal y Multas</h3>
                 </div>
                 <div className="p-0 flex-1 flex flex-col">
                     {data.theftReport?.reported && (
                        <div className="bg-error px-6 py-3 text-on-error font-medium flex items-center justify-between">
                           ROBO REPORTADO (PNP)
                           <span className="font-mono text-sm">{data.theftReport.date}</span>
                        </div>
                     )}
                     
                     <div className="p-6 space-y-4 flex-1">
                       <h4 className="font-label-md text-on-surface-variant uppercase tracking-wider mb-2">Infracciones (SUTRAN/SAT)</h4>
                       {data.fines.length === 0 ? (
                         <div className="bg-surface-container-low rounded-lg p-8 text-center text-on-surface-variant border border-dashed border-outline-variant flex-1 flex flex-col items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-status-success mb-2" />
                            <p className="font-body-md">No se registran papeletas pendientes.</p>
                         </div>
                       ) : (
                         <div className="space-y-3">
                           {data.fines.map(fine => (
                             <div key={fine.id} className="p-4 border border-error-container bg-error-container/20 rounded-lg relative overflow-hidden">
                               <div className="flex justify-between items-start mb-2">
                                  <span className="font-label-sm font-bold text-error bg-error/10 px-2 py-0.5 rounded uppercase">{fine.entity}</span>
                                  <span className="font-mono text-sm font-medium text-on-surface">S/ {fine.amount.toFixed(2)}</span>
                               </div>
                               <p className="font-body-md text-on-surface mb-1">{fine.description}</p>
                               <div className="flex justify-between items-center mt-2 font-label-sm text-on-surface-variant">
                                  <span>Fecha: {fine.date}</span>
                                  <span className="text-error font-medium">{fine.status}</span>
                               </div>
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                 </div>
              </div>

              {/* Col 3: Historial RT y SOAT */}
              <div className="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col md:col-span-3 lg:col-span-1">
                 <div className="px-6 py-4 border-b border-outline-variant flex items-center bg-surface-container-lowest">
                    <FileText className="w-5 h-5 mr-2 text-status-info" />
                    <h3 className="font-headline-md text-lg font-semibold text-on-surface">Seguro y RT</h3>
                 </div>
                 <div className="p-6 flex-1 space-y-6">
                    <div>
                      <h4 className="font-label-md text-on-surface-variant uppercase tracking-wider mb-3">Seguro Obligatorio (SOAT)</h4>
                      <div className={`p-4 rounded-lg border ${data.soat.active ? 'bg-status-success/10 border-status-success/30' : 'bg-error-container border-error-container'}`}>
                         <div className="flex justify-between items-center mb-1">
                            <span className="font-body-md font-semibold text-on-surface">{data.soat.company}</span>
                            <span className={`font-label-sm font-bold ${data.soat.active ? 'text-status-success' : 'text-error'}`}>
                              {data.soat.active ? 'VIGENTE' : 'VENCIDO'}
                            </span>
                         </div>
                         <p className="font-label-sm text-on-surface-variant">Vencimiento: <span className="font-mono text-on-surface">{data.soat.expiry}</span></p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-label-md text-on-surface-variant uppercase tracking-wider mb-3">Revisión Técnica</h4>
                      <div className="space-y-3">
                         {data.revisions.length === 0 && <p className="text-on-surface-variant font-label-sm">No registra historial</p>}
                         {data.revisions.map(rev => (
                           <div key={rev.id} className="p-3 bg-surface-container-low border border-outline-variant rounded-lg">
                              <div className="flex justify-between">
                                 <span className="font-label-sm text-on-surface font-medium truncate max-w-[150px]">{rev.entity}</span>
                                 <span className={`font-label-sm font-bold ${rev.result === 'APROBADO' ? 'text-status-success' : 'text-error'}`}>
                                   {rev.result}
                                 </span>
                              </div>
                              <div className="flex justify-between mt-2 font-mono text-xs text-on-surface-variant">
                                 <span>Emisión: {rev.date}</span>
                                 <span>Vence: {rev.expiry}</span>
                              </div>
                           </div>
                         ))}
                      </div>
                    </div>
                 </div>
              </div>
              
           </div>
        </div>
      )}
    </div>
  );
}
