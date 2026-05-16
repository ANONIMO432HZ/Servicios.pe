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
      </header>

      {/* Main Search Section */}
      <section>
        <AdvancedSearch />
      </section>

      {/* Service Directory Section */}
      <section>
        <ServiceDirectory />
      </section>
    </div>
  );
}
