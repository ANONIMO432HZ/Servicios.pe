"use client"
import { useState, useMemo } from 'react';
import { Search, Grid, UserCheck, DollarSign, Activity, Car, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICES } from '../../lib/services-data';
import type { ServiceCategory } from '../../lib/services-data';
import { ServiceCard } from './ServiceCard';

export function ServiceDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'All'>('All');

  const filteredServices = useMemo(() => {
    return SERVICES.filter(service => {
      const matchesSearch = 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === 'All' || service.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const categories = [
    { id: 'All', name: 'Todos los Servicios', icon: Grid },
    { id: 'Identidad', name: 'Identidad y Ciudadanía', icon: UserCheck },
    { id: 'Finanzas', name: 'Finanzas e Impuestos', icon: DollarSign },
    { id: 'Salud', name: 'Salud y Seguro', icon: Activity },
    { id: 'Transporte', name: 'Transporte y Vehículos', icon: Car },
    { id: 'Pago', name: 'Servicios de Pago', icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            Directorio Unificado
            <span className="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
              {SERVICES.length} Servicios
            </span>
          </h2>
          <p className="text-sm text-zinc-500 font-body-md">Acceso directo y simplificado a consultas oficiales del Estado Peruano.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Buscar servicio o entidad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
              activeCategory === cat.id 
                ? 'bg-primary text-white shadow-lg shadow-primary/20 border-primary' 
                : 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-zinc-200 border-white/5'
            }`}
          >
            <cat.icon className="w-4.5 h-4.5" />
            {cat.name}
          </button>
        ))}
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredServices.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 text-center glass-panel rounded-3xl"
        >
          <Search className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-zinc-400">No se encontraron servicios</h3>
          <p className="text-sm text-zinc-600 font-body-md">Intenta con otros términos o cambia de categoría.</p>
          <button 
            onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
            className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-primary text-sm font-bold rounded-xl transition-all border border-white/5"
          >
            Limpiar filtros
          </button>
        </motion.div>
      )}
    </div>
  );
}
