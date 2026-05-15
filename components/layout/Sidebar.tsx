import { Search, History, LayoutDashboard, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth';

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Panel de Control', href: '/', icon: LayoutDashboard },
    { name: 'Consulta Vehicular', href: '/search', icon: Search },
    { name: 'Historial', href: '/history', icon: History },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-outline-variant transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex-shrink-0`}>
      <div className="h-16 flex items-center px-6 border-b border-outline-variant">
        <h2 className="font-headline-md font-semibold text-primary tracking-tight">GovCheck</h2>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg font-label-md transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary' : 'text-outline'}`} />
              {item.name}
              {isActive && <ChevronRight className="w-4 h-4 ml-auto text-primary" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-outline-variant">
         <form action={logout}>
           <button type="submit" className="flex items-center w-full px-4 py-3 rounded-lg text-error hover:bg-error-container hover:text-on-error-container transition-colors font-label-md">
             <LogOut className="w-5 h-5 mr-3" />
             Cerrar Sesión
           </button>
         </form>
      </div>
    </aside>
  );
}
