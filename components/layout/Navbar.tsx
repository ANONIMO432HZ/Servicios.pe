import { Menu, Search, UserCircle, Bell } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="h-16 bg-surface border-b border-outline-variant flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="p-2 md:hidden mr-2 text-on-surface-variant hover:bg-surface-container rounded-md transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden sm:flex items-center bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-shadow">
           <Search className="w-4 h-4 text-outline mr-2" />
           <input 
             type="text" 
             placeholder="Búsqueda rápida (Placa/VIN)" 
             className="bg-transparent border-none outline-none text-sm text-on-surface w-full placeholder:text-on-surface-variant font-label-md"
           />
        </div>
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2 pl-2 border-l border-outline-variant">
           <div className="text-right hidden md:block">
             <p className="font-label-md font-medium text-on-surface leading-tight">Agente A. Vargas</p>
             <p className="font-label-sm text-on-surface-variant text-xs">Unidad de Tránsito</p>
           </div>
           <UserCircle className="w-8 h-8 text-primary" />
        </div>
      </div>
    </header>
  );
}
