import { Activity, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const metrics = [
    { label: 'Consultas Hoy', value: '142', icon: Activity, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Alertas Activas', value: '12', icon: AlertTriangle, color: 'text-error', bg: 'bg-error-container text-on-error-container' },
    { label: 'Vehículos Limpios', value: '118', icon: CheckCircle, color: 'text-status-success', bg: 'bg-status-success/10' },
    { label: 'Reportes Generados', value: '38', icon: FileText, color: 'text-status-info', bg: 'bg-status-info/10' },
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col space-y-8">
      <div>
        <h1 className="font-headline-lg text-on-surface tracking-tight">Panel de Control</h1>
        <p className="font-body-md text-on-surface-variant mt-1">Resumen de actividad institucional y métricas clave.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-surface rounded-xl p-6 border border-outline-variant shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-lg ${metric.bg}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
            <div className="mt-4">
              <p className="font-label-md text-on-surface-variant mb-1">{metric.label}</p>
              <p className="font-display-lg text-on-surface font-semibold">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
            <h3 className="font-headline-md text-on-surface text-lg font-semibold">Consultas Recientes</h3>
            <Link href="/history" className="font-label-md text-primary hover:underline">Ver todas</Link>
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low text-on-surface-variant font-label-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Placa/VIN</th>
                  <th className="px-6 py-4 font-medium">Fecha</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-body-md">
                <tr className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-on-surface font-medium">ABC-1234</td>
                  <td className="px-6 py-4 text-on-surface-variant text-sm">Hace 10 min</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-container text-on-error-container">
                      Alerta
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-on-surface font-medium">XYZ-9876</td>
                  <td className="px-6 py-4 text-on-surface-variant text-sm">Hace 45 min</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-status-success/10 text-status-success">
                      Limpio
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-on-surface font-medium">1HGCM82...</td>
                  <td className="px-6 py-4 text-on-surface-variant text-sm">Hace 2 horas</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-status-success/10 text-status-success">
                      Limpio
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant bg-surface-container-lowest">
            <h3 className="font-headline-md text-on-surface text-lg font-semibold">Fuentes de Datos (Estado)</h3>
          </div>
          <div className="p-6 flex-1 flex flex-col space-y-6 justify-center">
            {[
              { name: 'SUNARP', desc: 'Registro de Propiedad', status: 'Operativo', color: 'bg-status-success' },
              { name: 'SUTRAN', desc: 'Infracciones de Tránsito', status: 'Operativo', color: 'bg-status-success' },
              { name: 'SAT', desc: 'Papeletas y Capturas', status: 'Mantenimiento', color: 'bg-status-warning' },
              { name: 'PNP', desc: 'Requisitorias', status: 'Operativo', color: 'bg-status-success' },
            ].map((source, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <p className="font-label-md font-medium text-on-surface">{source.name}</p>
                  <p className="font-label-sm text-on-surface-variant text-xs">{source.desc}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${source.color}`}></span>
                  <span className="font-label-sm text-on-surface-variant text-sm">{source.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
