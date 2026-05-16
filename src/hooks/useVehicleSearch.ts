import { useState } from 'react';
import { mockReports } from '../lib/mock-data';
import type { VehicleReport } from '../lib/mock-data';

export type SearchState = 'idle' | 'loading' | 'success' | 'error';

export function useVehicleSearch() {
  const [state, setState] = useState<SearchState>('idle');
  const [data, setData] = useState<VehicleReport | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const search = async (identifier: string) => {
    const cleanId = identifier.trim().toUpperCase();
    if (!cleanId) return;
    
    setState('loading');
    setData(null);
    setErrorMsg('');

    // Detección de Tipo de Búsqueda
    const isDni = /^\d{8}$/.test(cleanId);
    const isRuc = /^\d{11}$/.test(cleanId);

    // 1. Búsqueda por DNI (Identidad + Licencia)
    if (isDni) {
      try {
        const dniRes = await fetch(`/api/search/dni?dni=${cleanId}`);
        const dniResult = await dniRes.json();

        if (dniResult.success && dniResult.data) {
          let licenseData: { success: boolean; data: any } = { success: false, data: null };
          try {
            const licenseRes = await fetch(`/api/search/license?dni=${cleanId}`, { signal: AbortSignal.timeout(4000) });
            if (licenseRes.ok) licenseData = await licenseRes.json();
          } catch (e) {
            console.log("Licencia no disponible");
          }

          setData({
            plate: 'N/A',
            vin: 'PERSONA NATURAL',
            make: (licenseData.success && licenseData.data?.licencia) 
              ? `Licencia: ${licenseData.data.licencia.categoria}` 
              : 'Sin Registro de Licencia',
            model: (licenseData.success && licenseData.data?.licencia) 
              ? licenseData.data.licencia.estado 
              : 'N/A',
            year: 0,
            color: 'Habilitado', // Condición para DNI
            engineNumber: dniResult.data.ubigeo_reniec || 'N/A', // Referencia para DNI
            owner: {
              name: dniResult.data.nombre_completo || `${dniResult.data.apellido_paterno} ${dniResult.data.apellido_materno}, ${dniResult.data.nombres}`,
              dni: dniResult.data.numero || cleanId,
              address: dniResult.data.direccion || 'Dirección protegida'
            },
            status: 'Clear',
            fines: [],
            revisions: [],
            theftReport: { reported: false },
            soat: { active: false, expiry: 'No Aplica', company: 'Persona Natural' }
          });
          setState('success');
        } else {
          setState('error');
          setErrorMsg(dniResult.message || 'DNI no encontrado.');
        }
      } catch (error) {
        setState('error');
        setErrorMsg('Error al conectar con el servicio de identidad.');
      }
      return;
    }

    // 2. Búsqueda por RUC (Empresa + Deuda Coactiva)
    if (isRuc) {
      try {
        const rucRes = await fetch(`/api/search/ruc?ruc=${cleanId}`);
        const rucResult = await rucRes.json();

        if (rucResult.success && rucResult.data) {
          let debtData: { success: boolean; data: any[] } = { success: false, data: [] };
          try {
             const debtRes = await fetch(`/api/search/ruc-debt?ruc=${cleanId}`, { signal: AbortSignal.timeout(4000) });
             if (debtRes.ok) debtData = await debtRes.json();
          } catch (e) {}

          setData({
            plate: 'N/A',
            vin: rucResult.data.tipo || 'PERSONA JURÍDICA',
            make: 'EMPRESA REGISTRADA',
            model: rucResult.data.estado || 'ACTIVO',
            year: 0,
            color: rucResult.data.condicion || 'HABIDO', // Condición
            engineNumber: rucResult.data.actividad_economica?.[0] || 'Actividad Comercial', // Referencia
            owner: {
              name: rucResult.data.nombre_o_razon_social,
              dni: rucResult.data.ruc || cleanId,
              address: rucResult.data.direccion_completa || 'Dirección SUNAT'
            },
            status: rucResult.data.estado === 'ACTIVO' ? 'Clear' : 'Flagged',
            fines: debtData.success && Array.isArray(debtData.data) ? debtData.data.map((d: any, i: number) => ({
              id: `DEBT-${i}`,
              entity: 'SUNAT' as const,
              date: d.fecha_inicio || 'N/A',
              amount: parseFloat(d.monto) || 0,
              status: 'PENDING' as const,
              description: `Deuda Coactiva: ${d.documento || 'Referencia N/A'}`
            })) : [],
            revisions: [],
            theftReport: { reported: false },
            soat: { active: false, expiry: 'No Aplica', company: 'Persona Jurídica' }
          });
          setState('success');
        } else {
          setState('error');
          setErrorMsg(rucResult.message || 'RUC no encontrado.');
        }
      } catch (error) {
        setState('error');
        setErrorMsg('Error al conectar con el servicio de empresas.');
      }
      return;
    }


    // Lógica para placas (Integración de múltiples fuentes: Placa + SOAT)
    try {
      const [plateRes, soatRes] = await Promise.all([
        fetch(`/api/search/plate?plate=${cleanId}`),
        fetch(`/api/search/soat?plate=${cleanId}`)
      ]);

      const plateResult = await plateRes.json();
      const soatResult = await soatRes.json();

      if (plateResult.success && plateResult.data) {
        setData({
          plate: plateResult.data.placa,
          vin: plateResult.data.vin || plateResult.data.serie || 'N/A',
          make: plateResult.data.marca,
          model: plateResult.data.modelo,
          year: 2020, 
          color: plateResult.data.color,
          engineNumber: plateResult.data.motor,
          owner: {
            name: 'PROPIETARIO REGISTRADO',
            dni: '********',
            address: 'Dirección en registros SUNARP'
          },
          status: 'Clear',
          fines: [], 
          revisions: [],
          theftReport: { reported: false },
          soat: soatResult.success ? {
            active: soatResult.data.estado === 'VIGENTE',
            expiry: soatResult.data.fecha_fin,
            company: soatResult.data.nombre_compania
          } : { active: false, expiry: 'No Registra / Vencido', company: 'S/D' }
        });
        setState('success');
      } else {
        // Fallback al mock si la API falla o no encuentra la placa
        const report = mockReports.find(r => r.plate === cleanId);
        if (report) {
          setData(report);
          setState('success');
        } else {
          setState('error');
          setErrorMsg(plateResult.message || 'No se encontró información para esta placa.');
        }
      }
    } catch (error) {
      setState('error');
      setErrorMsg('Error de conexión con el servicio vehicular.');
    }

  };

  return { state, data, search, errorMsg };
}

