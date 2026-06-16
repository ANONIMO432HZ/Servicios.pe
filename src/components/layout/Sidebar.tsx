"use client"
import { History, LayoutDashboard, LogOut, ChevronRight, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

interface SidebarProps {
  initialOpen?: boolean;
}

export function Sidebar({ initialOpen = false }: SidebarProps) {
  const [pathname, setPathname] = useState('');
  const [isOpen, setIsOpen] = useState(initialOpen);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('govcheck:toggle-sidebar', handleToggle);
    return () => window.removeEventListener('govcheck:toggle-sidebar', handleToggle);
  }, []);

  const navItems: { name: string; href: string; icon: any; badge?: string }[] = [
    { name: 'Portal Principal', href: '/', icon: LayoutDashboard },
    // { name: 'Consola API', href: '/console', icon: Key, badge: 'Beta' },
    // { name: 'Consultas CSV', href: '/bulk-dni', icon: Database, badge: 'Nuevo' },
    { name: 'Historial', href: '/history', icon: History },
  ];

  const handleLogout = () => {
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/login';
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-(--z-overlay) lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside 
        className={`fixed inset-y-0 left-0 z-(--z-sidebar) w-72 glass-panel transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:shrink-0`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tighter">Servicios<span className="text-primary">.pe</span></h2>
              <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest leading-none mt-0.5">Navegación</p>
            </div>
          </div>
          <button 
            onClick={closeSidebar}
            className="lg:hidden p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a 
                key={item.href} 
                href={item.href}
                onClick={closeSidebar}
                className={`group flex items-center px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 relative overflow-hidden ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 border border-primary/50' 
                    : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-200 border border-transparent hover:border-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                <span className="flex-1">{item.name}</span>
                {item.badge && !isActive && (
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 tracking-wider uppercase">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div layoutId="activeNav" className="ml-auto">
                    <ChevronRight className="w-4 h-4 text-white/70" />
                  </motion.div>
                )}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-12 h-12 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all"></div>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
              Nivel de Acceso
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-zinc-300">Gubernamental</p>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => <div key={i} className="w-1 h-3.5 bg-primary rounded-full opacity-80 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>)}
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3.5 rounded-2xl text-zinc-500 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-sm border border-transparent hover:border-red-500/10 active:scale-[0.98]"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
