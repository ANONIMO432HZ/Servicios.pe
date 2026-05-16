"use client"
import { useState } from 'react';
import { ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { ServiceLink } from '@/lib/services-data';

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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-5 flex flex-col h-full group cursor-pointer overflow-hidden relative"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="relative w-28 h-14 rounded-xl overflow-hidden bg-white/5 p-1.5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-all duration-300">
          {!imgError ? (
            <Image 
              src={service.logoPath} 
              alt={service.name}
              fill
              className="object-contain p-2"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
          )}
        </div>
        <div className="p-2 rounded-xl bg-white/5 text-zinc-500 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300">
          <ExternalLink className="w-4 h-4" />
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className="font-bold text-zinc-100 group-hover:text-primary transition-colors mb-1 line-clamp-1">
          {service.name}
        </h3>
        <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">
          {service.description}
        </p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors">
          {service.category}
        </span>
        {service.status === 'Mantenimiento' && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
            <AlertTriangle className="w-3 h-3 text-yellow-500" />
            <span className="text-[9px] text-yellow-500 font-bold uppercase tracking-tighter">Mantenimiento</span>
          </span>
        )}
      </div>
    </motion.a>
  );
}

