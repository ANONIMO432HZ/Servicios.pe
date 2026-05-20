"use client"
import { Menu, Search, UserCircle, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface NavbarProps {
  onMenuClick: () => void;
  role?: 'admin' | 'guest';
}

export function Navbar({ onMenuClick, role = 'admin' }: NavbarProps) {
  const [pathname, setPathname] = useState('');
  const isGuest = role === 'guest';

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  return (
    <header className="h-20 glass-panel flex items-center justify-between px-4 lg:px-12 z-30 sticky top-0 border-b border-white/5">
      <div className="flex items-center gap-8">
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-12 h-12 relative flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <img 
              src="/govcheck-logo.png" 
              alt="Servicios.pe Logo" 
              width={48} 
              height={48} 
              className="relative z-10 drop-shadow-2xl"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black text-white tracking-tighter leading-none">Servicios<span className="text-primary">.pe</span></h1>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1">Consultas y Trámites</p>
          </div>
        </a>


        <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
          {[
            { name: 'Portal', href: '/' },
            { name: 'Consola API', href: '/console' },
            { name: 'Historial', href: '/history' },
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <a 
                key={item.href}
                href={item.href} 
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                {item.name}
              </a>
            );
          })}
        </nav>
      </div>
      
      <div className="flex items-center gap-6">
        {/*
        <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all w-64 group">
           <Search className="w-4 h-4 text-zinc-500 mr-2 group-focus-within:text-primary transition-colors" />
           <input 
             type="text" 
             placeholder="Buscar placa..." 
             className="bg-transparent border-none outline-none text-xs text-zinc-100 w-full placeholder:text-zinc-600"
           />
        </div>
        */}

        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 text-zinc-500 hover:bg-white/10 hover:text-white rounded-xl transition-all relative border border-white/5"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-black"></span>
          </motion.button>
          
          <a 
            href="/logout" 
            title="Cerrar sesión"
            className="flex items-center gap-3 group cursor-pointer pl-4 border-l border-white/10"
          >
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-zinc-100 group-hover:text-red-400 transition-colors">
                 {isGuest ? 'Invitado' : 'A. Vargas'}
               </p>
               <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest group-hover:text-red-400/70 transition-colors">
                 {isGuest ? 'Acceso Limitado' : 'Administrador'}
               </p>
             </div>
             <UserCircle className={`w-10 h-10 transition-colors ${isGuest ? 'text-zinc-600 group-hover:text-red-400' : 'text-zinc-500 group-hover:text-primary'}`} />
          </a>
        </div>
      </div>
    </header>
  );
}
