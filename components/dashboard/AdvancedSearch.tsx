"use client"
import { useState } from 'react';
import { Search, Loader2, FileText, User, Car, ShieldCheck, AlertCircle, CheckCircle2, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useVehicleSearch } from '@/hooks/useVehicleSearch';

export function AdvancedSearch() {
  const [identifier, setIdentifier] = useState('');
  const { state, data, search, errorMsg } = useVehicleSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search(identifier);
  };

  return (
    <div className="space-y-8">
      <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">Consulta Avanzada</h2>
          <p className="text-zinc-500 mb-6 font-body-md">Genera un informe detallado de gravámenes, propietarios e historial técnico.</p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Ingresa Placa o VIN (ej. ABC-123)"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={state === 'loading'}
              className="bg-primary hover:bg-blue-600 disabled:bg-zinc-800 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 min-w-[160px]"
            >
              {state === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Generar Reporte
                  <FileText className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {state === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass p-12 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="relative">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-100">Interconectando con registros oficiales...</h3>
              <p className="text-zinc-500 mt-2 font-body-md">Estamos recuperando datos de SUNARP, SUTRAN y PNP.</p>
            </div>
            <div className="w-full max-w-xs bg-white/5 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="bg-primary h-full"
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
              <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                Informe de Inteligencia Vehicular
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </h3>
              <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                Descargar PDF
                <FileText className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Información General */}
              <div className="lg:col-span-2 glass p-6 rounded-3xl border border-white/10 space-y-6">
                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                  <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                    <Car className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white font-mono uppercase tracking-tighter">{data.plate}</h4>
                    <p className="text-zinc-500 font-body-md">{data.make} {data.model} ({data.year})</p>
                  </div>
                  <div className="ml-auto flex flex-col items-end">
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
                      Estado: {data.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 py-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">VIN / Serie</p>
                    <p className="text-sm text-zinc-200 font-mono truncate">{data.vin}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Color</p>
                    <p className="text-sm text-zinc-200 font-body-md">{data.color}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Motor</p>
                    <p className="text-sm text-zinc-200 font-mono">{data.engineNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Última Revisión</p>
                    <p className="text-sm text-zinc-200 font-body-md">{data.revisions[0]?.date || 'N/A'}</p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-zinc-200">SOAT Vigente</p>
                      <p className="text-xs text-zinc-500">{data.soat.company} - Expira: {data.soat.expiry}</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
              </div>

              {/* Propietario */}
              <div className="glass p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <User className="w-5 h-5 text-zinc-500" />
                    <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Titular Actual</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-lg font-bold text-white leading-tight">{data.owner.name}</p>
                      <p className="text-sm text-primary font-mono mt-1">DNI: {data.owner.dni}</p>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-zinc-600 mt-1 shrink-0" />
                      <p className="text-xs text-zinc-500 leading-relaxed font-body-md">{data.owner.address}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2">Historial Preventivo</p>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-zinc-600" />
                    <p className="text-xs text-zinc-400">Sin órdenes de captura activas.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
