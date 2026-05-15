"use client"
import { ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { ServiceLink } from '@/lib/services-data';

interface ServiceCardProps {
  service: ServiceLink;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <motion.a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="glass-card p-5 flex flex-col h-full group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="relative w-28 h-14 rounded-lg overflow-hidden bg-white/5 p-1.5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
          <Image 
            src={service.logoPath} 
            alt={service.name}
            fill
            className="object-contain p-1"
          />
        </div>
        <div className="p-1.5 rounded-lg bg-white/5 text-zinc-500 group-hover:text-primary transition-colors">
          <ExternalLink className="w-4 h-4" />
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className="font-label-md font-bold text-zinc-100 group-hover:text-primary transition-colors mb-1 line-clamp-1">
          {service.name}
        </h3>
        <p className="font-label-sm text-zinc-500 text-xs leading-relaxed line-clamp-2">
          {service.description}
        </p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
          {service.category}
        </span>
        {service.status === 'Mantenimiento' && (
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] text-yellow-500/80 font-medium uppercase">Mantenimiento</span>
          </span>
        )}
      </div>
    </motion.a>
  );
}
