import { AdvancedSearch } from '@/components/dashboard/AdvancedSearch';
import { ServiceDirectory } from '@/components/dashboard/ServiceDirectory';
import { Activity, ShieldAlert, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-12 pb-20">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
            Portal de <span className="text-primary">Inteligencia</span> Vehicular
          </h1>
          <p className="text-zinc-500 mt-2 font-body-md max-w-2xl">
            Bienvenido al centro de mando GovCheck. Centralizamos datos críticos de múltiples entidades para facilitar su labor institucional.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Sistemas: Operativos</span>
          </div>
          <div className="w-px h-4 bg-white/10"></div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 uppercase font-medium">Latencia: 14ms</span>
          </div>
        </div>
      </header>

      {/* Main Search Section */}
      <section>
        <AdvancedSearch />
      </section>

      {/* Service Directory Section */}
      <section>
        <ServiceDirectory />
      </section>

      {/* Quick Footer Stats */}
      <footer className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">1,420</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Consultas Totales</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-xl">
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">12</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Alertas Pendientes</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">98.2%</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Disponibilidad</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
