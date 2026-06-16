"use client"
import { useState } from 'react';
import { ExternalLink, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'motion/react';
import type { ServiceLink } from '../../lib/services-data';

interface ServiceCardProps {
  service: ServiceLink;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="flex flex-col group cursor-pointer"
    >
      <div className="relative aspect-video w-full glass-panel rounded-3xl overflow-hidden border border-white/10 group-hover:border-primary/50 transition-all duration-500 shadow-2xl">
        {/* Main Image */}
        {!imgError ? (
          service.id.includes('migraciones') || service.id.includes('eldni') || service.id.includes('dniperu') || service.id === 'sunarp-dueños-deudas' || service.id === 'mtc-revision-tecnica' || service.id === 'sunarp-servicios-online' || service.id === 'sunarp-tive' || service.id === 'sat-callao' || service.id === 'reporte-infocorp' || service.id === 'infogas-deuda' || service.id === 'informe-vehicular' ? (
            // Centered and fit (Migraciones gets transparent, Infocorp gets red, Infogas, dniperu, sunarp-dueños-deudas, and mtc-revision-tecnica get #003F72 blue, others get white)
            <div className={`w-full h-full flex items-center justify-center p-4 relative ${
              service.id.includes('migraciones') 
                ? '' 
                : service.id === 'reporte-infocorp' 
                  ? 'bg-red-600' 
                  : (service.id === 'infogas-deuda' || service.id.includes('dniperu') || service.id === 'sunarp-dueños-deudas' || service.id === 'mtc-revision-tecnica')
                    ? 'bg-[#003F72]'
                    : 'bg-white'
            }`}>
              <img 
                src={service.logoPath} 
                alt={service.name}
                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black/10">
              {/* Blurred Ambient Backdrop */}
              <img 
                src={service.logoPath} 
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-xl opacity-75 brightness-150 scale-125 select-none pointer-events-none"
              />
              {/* Main Foreground Image */}
              <img 
                src={service.logoPath} 
                alt={service.name}
                className={`relative z-10 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                  (service.id.includes('sbs') && service.id !== 'sbs-consulta-soat') 
                    ? 'bg-white' 
                    : (service.id.startsWith('sat-') || 
                       service.id.includes('sunarp') || 
                       service.id.includes('fise') || 
                       service.id.includes('gnv') || 
                       service.id.includes('atu') || 
                       service.id.includes('citv') || 
                       service.id.includes('revision-tecnica') ||
                       service.id.includes('sutran'))
                      ? 'bg-[#003F72]'
                      : ''
                }`}
                onError={() => setImgError(true)}
              />
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-800">
            <ShieldCheck className="w-12 h-12 opacity-10" />
          </div>
        )}

        {/* Dynamic Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
              <Info className="w-3 h-3" />
              Información
            </div>
            <p className="text-white text-xs leading-relaxed font-medium line-clamp-3">
              {service.description}
            </p>
            <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-zinc-400">
              <span>Click para ir al portal</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </motion.div>
        </div>

        {/* Status Badge (Always Visible) */}
        <div className="absolute top-3 right-3 z-10">
          {service.status === 'Mantenimiento' && (
            <div className="bg-yellow-500/90 backdrop-blur-md text-black p-1.5 rounded-lg shadow-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Category Tag (Always Visible) */}
        <div className="absolute bottom-3 left-3 z-10 group-hover:opacity-0 transition-opacity">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-bold uppercase tracking-widest text-zinc-300">
            {service.category}
          </span>
        </div>
      </div>
      
      <div className="mt-4 px-2 text-center">
        <h3 className="text-[11px] font-black text-zinc-400 group-hover:text-white transition-colors uppercase tracking-widest leading-tight">
          {service.name}
        </h3>
        <div className="w-0 h-0.5 bg-primary mx-auto mt-2 group-hover:w-12 transition-all duration-300 rounded-full" />
      </div>
    </motion.a>
  );
}
