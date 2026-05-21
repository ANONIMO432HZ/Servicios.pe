"use client"
import { useEffect, useState } from 'react';
import { 
  Search, 
  Trash2, 
  X,
  Calendar,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ensureAdaptiveReport, 
  type AdaptiveReport 
} from '../../hooks/useVehicleSearch';
import { 
  VehicleReportView, 
  IdentityReportView, 
  CompanyReportView 
} from './AdvancedSearch';

interface HistoryItem {
  id: string;
  query: string;
  type: 'VEHICULAR' | 'IDENTIDAD' | 'EMPRESA';
  title: string;
  subtitle: string;
  timestamp: string;
  data: AdaptiveReport;
}

export function SearchHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<AdaptiveReport | null>(null);

  // Load history from localStorage and ensure correct schema mapping
  useEffect(() => {
    const loadHistory = () => {
      const stored = localStorage.getItem('govcheck_search_history');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const mapped = parsed.map((item: any) => ({
            ...item,
            data: ensureAdaptiveReport(item.data)
          }));
          setHistory(mapped);
        } catch (e) {
          console.error('Error parsing history:', e);
        }
      }
    };
    loadHistory();
  }, []);

  const deleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('govcheck_search_history', JSON.stringify(updated));
  };

  const clearAll = () => {
    if (confirm('¿Estás seguro de que querés borrar todo tu historial de consultas?')) {
      setHistory([]);
      localStorage.removeItem('govcheck_search_history');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and actions */}
      {history.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-zinc-500 font-medium text-sm">
            Mostrando las últimas {history.length} consultas almacenadas localmente.
          </p>
          <button 
            onClick={clearAll}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-red-500/20 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Limpiar Historial
          </button>
        </div>
      )}

      {/* Main List */}
      <AnimatePresence mode="popLayout">
        {history.length === 0 ? (
          <motion.section 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="glass-panel p-20 rounded-3xl flex flex-col items-center justify-center text-center border border-white/5"
          >
            <div className="relative mb-6">
              <Search className="w-16 h-16 text-zinc-800" />
              <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full"></div>
            </div>
            <h3 className="text-xl font-bold text-zinc-400">Sin historial reciente</h3>
            <p className="text-sm text-zinc-600 font-medium max-w-xs mt-2 leading-relaxed">
              Las consultas vehiculares, de DNI y RUC que realices en el portal se guardarán de forma local en tu navegador.
            </p>
            <a 
              href="/" 
              className="mt-8 flex items-center gap-2 bg-white/5 hover:bg-white/10 text-primary px-6 py-3 rounded-xl font-bold border border-white/5 transition-all active:scale-[0.98]"
            >
              Realizar mi primera búsqueda
              <Search className="w-4 h-4" />
            </a>
          </motion.section>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedReport(item.data)}
                className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Background glow on hover */}
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                      item.type === 'VEHICULAR' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      item.type === 'IDENTIDAD' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      {item.type}
                    </span>
                    <span className="text-[10px] text-zinc-600 font-bold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.timestamp.split(' ')[0]}
                    </span>
                  </div>

                  <h4 className="text-xl font-black text-white font-mono tracking-tight uppercase mb-1">
                    {item.query}
                  </h4>
                  <p className="text-xs text-zinc-400 font-bold truncate pr-6 mb-2">
                    {item.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                  <span className="text-[10px] text-zinc-500 font-medium group-hover:text-primary transition-colors flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    Ver informe completo
                  </span>
                  
                  <button 
                    onClick={(e) => deleteItem(item.id, e)}
                    className="p-1.5 hover:bg-red-500/10 text-zinc-600 hover:text-red-400 rounded-lg transition-all cursor-pointer border border-transparent hover:border-red-500/20"
                    title="Eliminar de historial"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Modal Report Viewer */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedReport(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl glass-panel border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedReport(null)}
                className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-white/5 cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                    {selectedReport.searchType === 'VEHICULAR' ? 'Informe de Inteligencia Vehicular' :
                     selectedReport.searchType === 'IDENTIDAD' ? 'Consulta de Identidad Ciudadana' :
                     'Perfil Tributario Corporativo'}
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold">
                    HISTORIAL
                  </span>
                </div>
              </div>

              {/* Modular Adaptive Report Layouts */}
              {selectedReport.searchType === 'VEHICULAR' && <VehicleReportView data={selectedReport.data} />}
              {selectedReport.searchType === 'IDENTIDAD' && <IdentityReportView data={selectedReport.data} />}
              {selectedReport.searchType === 'EMPRESA' && <CompanyReportView data={selectedReport.data} />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
