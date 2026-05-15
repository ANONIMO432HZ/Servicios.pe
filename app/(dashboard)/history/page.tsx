'use client'

import { Search, Filter, FileDown } from 'lucide-react';
import { useState } from 'react';

// Generemos historial falso para demostración
const mockHistory = Array.from({ length: 15 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(i / 3)); // Restar días 
  date.setHours(date.getHours() - Math.floor(Math.random() * 8));

  return {
    id: `REQ-${1000 - i}`,
    plate: `A${Math.floor(Math.random()*9)}C-${Math.floor(Math.random()*999)}`,
    date: date.toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' }),
    agent: 'Agente A. Vargas',
    status: Math.random() > 0.7 ? 'Flagged' : 'Clear',
    reason: 'Control Aleatorio'
  };
});

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredHistory = mockHistory.filter(h => {
    const matchSearch = h.plate.toLowerCase().includes(searchTerm.toLowerCase()) || h.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || h.status.toUpperCase() === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="font-headline-lg text-on-surface tracking-tight">Historial de Consultas</h1>
          <p className="font-body-md text-on-surface-variant mt-1">Registro auditable de todas las búsquedas vehiculares en la institución.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md border border-outline-variant rounded-lg transition-colors shadow-sm">
          <FileDown className="w-4 h-4 mr-2" />
          Exportar CSV
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant shadow-sm flex flex-col flex-1 overflow-hidden">
         {/* Filters bar */}
         <div className="p-4 border-b border-outline-variant bg-surface-container-lowest flex flex-wrap gap-4 items-center">
            <div className="relative w-full max-w-sm">
               <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
               <input 
                 type="text" 
                 placeholder="Buscar por placa o ID de solicitud..."
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-2 bg-surface-light border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm font-body-md placeholder:text-on-surface-variant"
               />
            </div>
            
            <div className="flex items-center space-x-2 border border-outline-variant rounded-lg p-1 bg-surface-light">
               <Filter className="w-4 h-4 text-outline ml-2" />
               <select 
                 value={filterStatus}
                 onChange={e => setFilterStatus(e.target.value)}
                 className="bg-transparent border-none text-sm focus:outline-none focus:ring-0 py-1.5 pr-8 pl-2 font-label-md text-on-surface cursor-pointer"
               >
                  <option value="ALL">Todos los Estados</option>
                  <option value="CLEAR">Limpio</option>
                  <option value="FLAGGED">Con Alertas</option>
               </select>
            </div>
         </div>

         {/* Table container */}
         <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-surface-container-low text-on-surface-variant font-label-sm uppercase tracking-wider sticky top-0 z-10 shadow-sm shadow-outline-variant/10">
                <tr>
                  <th className="px-6 py-4 font-medium">ID Req.</th>
                  <th className="px-6 py-4 font-medium">Placa</th>
                  <th className="px-6 py-4 font-medium">Fecha y Hora</th>
                  <th className="px-6 py-4 font-medium">Agente</th>
                  <th className="px-6 py-4 font-medium">Motivo</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4 font-medium text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant bg-surface font-body-md">
                {filteredHistory.map(row => (
                  <tr key={row.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-on-surface-variant">{row.id}</td>
                    <td className="px-6 py-4 font-mono text-sm text-on-surface font-semibold">{row.plate}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{row.date}</td>
                    <td className="px-6 py-4 text-sm text-on-surface">{row.agent}</td>
                    <td className="px-6 py-4 text-sm text-on-surface">{row.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.status === 'Clear' 
                        ? 'bg-status-success/10 text-status-success' 
                        : 'bg-error-container text-on-error-container'
                      }`}>
                        {row.status === 'Clear' ? 'Limpio' : 'Alerta'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-primary hover:text-primary-container font-label-sm font-medium transition-colors">
                         Ver Reporte
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredHistory.length === 0 && (
               <div className="flex flex-col items-center justify-center p-12 text-on-surface-variant">
                  <Search className="w-12 h-12 mb-4 text-outline-variant" />
                  <p className="font-body-md">No se encontraron registros que coincidan con la búsqueda.</p>
               </div>
            )}
         </div>

         {/* Pagination footer */}
         <div className="p-4 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between font-label-sm text-on-surface-variant">
            <span>Mostrando {filteredHistory.length} de 1500 registros</span>
            <div className="flex space-x-2">
               <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface disabled:opacity-50" disabled>Anterior</button>
               <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface bg-surface-container-low text-on-surface font-medium">1</button>
               <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface">2</button>
               <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface">3</button>
               <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface">Siguiente</button>
            </div>
         </div>
      </div>
    </div>
  );
}
