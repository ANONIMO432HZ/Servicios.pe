"use client"
import { Search, History, LayoutDashboard, LogOut, ChevronRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import { motion } from 'motion/react';

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Portal Principal', href: '/', icon: LayoutDashboard },
    { name: 'Consulta Detallada', href: '/search', icon: Search },
    { name: 'Historial', href: '/history', icon: History },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 glass-panel transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex-shrink-0`}>
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">GovCheck</h2>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`group flex items-center px-4 py-3 rounded-xl font-label-md transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/20 text-white shadow-lg shadow-primary/5' 
                  : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-200'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-primary' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              {item.name}
              {isActive && (
                <motion.div layoutId="activeNav" className="ml-auto">
                  <ChevronRight className="w-4 h-4 text-primary" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/5">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Nivel de Acceso</p>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-zinc-300">Gubernamental</p>
            <div className="flex gap-0.5">
              {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-primary rounded-full"></div>)}
            </div>
          </div>
        </div>

        <form action={logout}>
          <button type="submit" className="flex items-center w-full px-4 py-3 rounded-xl text-zinc-500 hover:bg-red-500/10 hover:text-red-500 transition-all font-label-md">
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar Sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
