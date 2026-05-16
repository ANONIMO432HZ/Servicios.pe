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
          <img 
            src={service.logoPath} 
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={() => setImgError(true)}
          />
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
