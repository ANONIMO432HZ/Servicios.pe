import { useState } from 'react';
import { VehicleReport, mockReports } from '@/lib/mock-data';

export type SearchState = 'idle' | 'loading' | 'success' | 'error';

export function useVehicleSearch() {
  const [state, setState] = useState<SearchState>('idle');
  const [data, setData] = useState<VehicleReport | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const search = async (identifier: string) => {
    if (!identifier.trim()) return;
    
    setState('loading');
    setData(null);
    setErrorMsg('');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate 503 error
    if (identifier.toUpperCase().includes('ERR-503')) {
      setState('error');
      setErrorMsg('No se pudo generar el reporte detallado para este vehículo debido a un problema técnico temporal o falta de conexión con el registro central.');
      return;
    }

    const report = mockReports.find(
      r => r.plate === identifier.toUpperCase() || r.vin === identifier.toUpperCase()
    );

    if (report) {
      setData(report);
      setState('success');
    } else {
      // Mock randomly for valid-looking plates that aren't in mock data
      setData({
        plate: identifier.toUpperCase(),
        vin: 'WBA3A5C549F' + Math.floor(Math.random() * 10000),
        make: 'Generico',
        model: 'ModeloX',
        year: 2018 + Math.floor(Math.random() * 5),
        color: 'Gris Mettalic',
        engineNumber: 'ENG-' + Math.floor(Math.random() * 999999),
        owner: {
          name: 'Ciudadano Ejemplo',
          dni: '00000000',
          address: 'Av. General 999, Distrito, Provincia'
        },
        status: 'Clear',
        fines: [],
        revisions: [{
          id: 'REV-GEN',
          date: '2023-08-15',
          result: 'APROBADO',
          entity: 'CITV Genérico',
          expiry: '2024-08-15'
        }],
        theftReport: { reported: false },
        soat: { active: true, expiry: '2025-01-01', company: 'Interseguro' }
      });
      setState('success');
    }
  };

  return { state, data, search, errorMsg };
}
