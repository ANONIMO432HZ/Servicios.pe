"use client"
import { Menu, Search, UserCircle, Bell, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="h-16 glass-panel flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
      <div className="flex items-center flex-1 max-w-2xl">
        <button 
          onClick={onMenuClick}
          className="p-2 md:hidden mr-4 text-zinc-400 hover:bg-white/10 rounded-xl transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden sm:flex items-center flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all duration-300 group"
        >
           <Search className="w-4 h-4 text-zinc-500 mr-3 group-focus-within:text-primary transition-colors" />
           <input 
             type="text" 
             placeholder="Búsqueda omnipotente (Placa, VIN o DNI)" 
             className="bg-transparent border-none outline-none text-sm text-zinc-100 w-full placeholder:text-zinc-500 font-label-md"
           />
           <div className="flex items-center space-x-1 ml-2">
             <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-zinc-500 opacity-100">
               <span className="text-xs">⌘</span>K
             </kbd>
           </div>
        </motion.div>
      </div>
      
      <div className="flex items-center space-x-3 ml-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 text-zinc-400 hover:bg-white/10 hover:text-white rounded-xl transition-all relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-black"></span>
        </motion.button>
        
        <div className="h-8 w-[1px] bg-white/10 mx-2 hidden sm:block"></div>
        
        <div className="flex items-center space-x-3 group cursor-pointer">
           <div className="text-right hidden md:block">
             <p className="font-label-md font-medium text-zinc-100 leading-tight group-hover:text-primary transition-colors">Agente A. Vargas</p>
             <div className="flex items-center justify-end space-x-1">
               <ShieldCheck className="w-3 h-3 text-primary" />
               <p className="font-label-sm text-zinc-500 text-[10px] uppercase tracking-wider">Unidad de Tránsito</p>
             </div>
           </div>
           <div className="relative">
             <UserCircle className="w-9 h-9 text-zinc-400 group-hover:text-primary transition-colors" />
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></div>
           </div>
        </div>
      </div>
    </header>
  );
}
