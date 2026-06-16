import { useState } from 'react';
import { mockReports } from '../lib/mock-data';
import type { VehicleReport } from '../lib/mock-data';

export type SearchState = 'idle' | 'loading' | 'success' | 'error';
export type AdaptiveSearchType = 'VEHICULAR' | 'IDENTIDAD' | 'EMPRESA';

export interface IdentityReport {
  dni: string;
  fullName: string;
  address: string;
  ubigeo: string;
  status: 'Clear' | 'Flagged' | 'Pending';
  license?: {
    categoria: string;
    estado: string;
  } | null;
}

export interface SUNATDebt {
  id: string;
  document: string;
  amount: number;
  startDate: string;
}

export interface CompanyReport {
  ruc: string;
  companyName: string;
  address: string;
  status: string;
  condition: string;
  economicActivity: string;
  systemStatus: 'Clear' | 'Flagged' | 'Pending';
  debts: SUNATDebt[];
}

export type AdaptiveReport =
  | { searchType: 'VEHICULAR'; data: VehicleReport }
  | { searchType: 'IDENTIDAD'; data: IdentityReport }
  | { searchType: 'EMPRESA'; data: CompanyReport };

// Convierte datos antiguos de localStorage (si los hay) al nuevo formato AdaptiveReport
export const ensureAdaptiveReport = (item: any): AdaptiveReport => {
  if (item && item.searchType) return item;
  
  const rawData = item?.data || item;
  if (!rawData) {
    return {
      searchType: 'VEHICULAR',
      data: {
        plate: 'N/A',
        vin: 'N/A',
        make: 'N/A',
        model: 'N/A',
        year: 0,
        color: 'N/A',
        engineNumber: 'N/A',
        owner: { name: 'S/D', dni: 'S/D', address: 'S/D' },
        status: 'Clear',
        fines: [],
        revisions: [],
        soat: { active: false, expiry: 'No Aplica', company: 'S/D' }
      }
    };
  }

  // Detectar por campos específicos si es DNI o RUC
  const isPersona = rawData.vin === 'PERSONA NATURAL' || item?.type === 'IDENTIDAD';
  const isEmpresa = rawData.vin === 'PERSONA JURÍDICA' || item?.type === 'EMPRESA' || rawData.make === 'EMPRESA REGISTRADA';

  if (isPersona) {
    return {
      searchType: 'IDENTIDAD',
      data: {
        dni: rawData.owner?.dni || '********',
        fullName: rawData.owner?.name || 'S/D',
        address: rawData.owner?.address || 'Dirección protegida',
        ubigeo: rawData.engineNumber || 'N/A',
        status: rawData.status || 'Clear',
        license: rawData.make && rawData.make.startsWith('Licencia:') ? {
          categoria: rawData.make.replace('Licencia: ', ''),
          estado: rawData.model || 'Vigente'
        } : null
      }
    };
  }

  if (isEmpresa) {
    return {
      searchType: 'EMPRESA',
      data: {
        ruc: rawData.owner?.dni || '********',
        companyName: rawData.owner?.name || 'S/D',
        address: rawData.owner?.address || 'Dirección SUNAT',
        status: rawData.model || 'ACTIVO',
        condition: rawData.color || 'HABIDO',
        economicActivity: rawData.engineNumber || 'Actividad Comercial',
        systemStatus: rawData.status || 'Clear',
        debts: rawData.fines ? rawData.fines.map((f: any) => ({
          id: f.id,
          document: f.description?.replace('Deuda Coactiva: ', '') || 'N/A',
          amount: f.amount || 0,
          startDate: f.date || 'N/A'
        })) : []
      }
    };
  }

  return {
    searchType: 'VEHICULAR',
    data: rawData as VehicleReport
  };
};

const saveToHistory = (query: string, report: AdaptiveReport) => {
  if (typeof window === 'undefined') return;
  try {
    const existing = localStorage.getItem('govcheck_search_history');
    let historyList = existing ? JSON.parse(existing) : [];
    
    // Evitar duplicados (eliminar anterior si existe el mismo query)
    historyList = historyList.filter((item: any) => item.query.trim().toUpperCase() !== query.trim().toUpperCase());
    
    const subtitleText = report.searchType === 'VEHICULAR' 
      ? `${report.data.make} ${report.data.model}` 
      : report.searchType === 'IDENTIDAD' 
        ? report.data.fullName 
        : report.data.companyName;

    const newItem = {
      id: Date.now().toString(),
      query,
      type: report.searchType,
      title: report.searchType === 'VEHICULAR' ? `Placa ${query}` : report.searchType === 'IDENTIDAD' ? `DNI ${query}` : `RUC ${query}`,
      subtitle: subtitleText,
      timestamp: new Date().toLocaleString('es-PE'),
      data: report // Guardamos en el nuevo formato AdaptiveReport
    };
    
    // Agregar al principio y limitar a 25 elementos
    historyList = [newItem, ...historyList].slice(0, 25);
    localStorage.setItem('govcheck_search_history', JSON.stringify(historyList));
  } catch (e) {
    console.error('Error saving search history to localStorage:', e);
  }
};

export function useVehicleSearch() {
  const [state, setState] = useState<SearchState>('idle');
  const [data, setData] = useState<AdaptiveReport | null>(null);
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
          } catch {
          }

          const fullName = dniResult.data.nombre_completo || `${dniResult.data.apellido_paterno} ${dniResult.data.apellido_materno}, ${dniResult.data.nombres}`;
          const adaptiveData: AdaptiveReport = {
            searchType: 'IDENTIDAD',
            data: {
              dni: dniResult.data.numero || cleanId,
              fullName,
              address: dniResult.data.direccion || 'Dirección protegida',
              ubigeo: dniResult.data.ubigeo_reniec || 'N/A',
              status: 'Clear',
              license: (licenseData.success && licenseData.data?.licencia) ? {
                categoria: licenseData.data.licencia.categoria,
                estado: licenseData.data.licencia.estado
              } : null
            }
          };

          setData(adaptiveData);
          saveToHistory(cleanId, adaptiveData);
          setState('success');

          // Disparar evento de éxito
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('govcheck-notification', {
              detail: {
                title: 'Búsqueda Exitosa (DNI)',
                desc: `Identidad verificada para ${fullName}.`,
                type: 'success'
              }
            }));
          }
        } else {
          setState('error');
          const errorText = dniResult.message || 'DNI no encontrado.';
          setErrorMsg(errorText);

          // Disparar evento de error
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('govcheck-notification', {
              detail: {
                title: 'Error de Búsqueda (DNI)',
                desc: `DNI ${cleanId}: ${errorText}`,
                type: 'error'
              }
            }));
          }
        }
      } catch {
        setState('error');
        setErrorMsg('Error al conectar con el servicio de identidad.');

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('govcheck-notification', {
            detail: {
              title: 'Fallo de Red (DNI)',
              desc: `Error al conectar con RENIEC para el DNI ${cleanId}.`,
              type: 'error'
            }
          }));
        }
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
           } catch {}

          const debts: SUNATDebt[] = debtData.success && Array.isArray(debtData.data) 
            ? debtData.data.map((d: any, i: number) => ({
                id: `DEBT-${i}`,
                document: d.documento || 'N/A',
                amount: parseFloat(d.monto) || 0,
                startDate: d.fecha_inicio || 'N/A'
              }))
            : [];

          const companyName = rucResult.data.nombre_o_razon_social;
          const adaptiveData: AdaptiveReport = {
            searchType: 'EMPRESA',
            data: {
              ruc: rucResult.data.ruc || cleanId,
              companyName,
              address: rucResult.data.direccion_completa || 'Dirección SUNAT',
              status: rucResult.data.estado || 'ACTIVO',
              condition: rucResult.data.condicion || 'HABIDO',
              economicActivity: rucResult.data.actividad_economica?.[0] || 'Actividad Comercial',
              systemStatus: rucResult.data.estado === 'ACTIVO' ? 'Clear' : 'Flagged',
              debts
            }
          };

          setData(adaptiveData);
          saveToHistory(cleanId, adaptiveData);
          setState('success');

          // Disparar evento de éxito
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('govcheck-notification', {
              detail: {
                title: 'Búsqueda Exitosa (RUC)',
                desc: `Empresa consultada: ${companyName}.`,
                type: 'success'
              }
            }));
          }
        } else {
          setState('error');
          const errorText = rucResult.message || 'RUC no encontrado.';
          setErrorMsg(errorText);

          // Disparar evento de error
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('govcheck-notification', {
              detail: {
                title: 'Error de Búsqueda (RUC)',
                desc: `RUC ${cleanId}: ${errorText}`,
                type: 'error'
              }
            }));
          }
        }
      } catch {
        setState('error');
        setErrorMsg('Error al conectar con el servicio de empresas.');

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('govcheck-notification', {
            detail: {
              title: 'Fallo de Red (RUC)',
              desc: `Error de conexión con SUNAT para el RUC ${cleanId}.`,
              type: 'error'
            }
          }));
        }
      }
      return;
    }

    // 3. Búsqueda por Placa (Vehicular)
    try {
      const [plateRes, soatRes] = await Promise.all([
        fetch(`/api/search/plate?plate=${cleanId}`),
        fetch(`/api/search/soat?plate=${cleanId}`)
      ]);

      const plateResult = await plateRes.json();
      const soatResult = await soatRes.json();

      if (plateResult.success && plateResult.data) {
        const vehicularReport: VehicleReport = {
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
        };

        const adaptiveData: AdaptiveReport = {
          searchType: 'VEHICULAR',
          data: vehicularReport
        };

        setData(adaptiveData);
        saveToHistory(cleanId, adaptiveData);
        setState('success');

        // Disparar evento de éxito
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('govcheck-notification', {
            detail: {
              title: 'Búsqueda Exitosa (Placa)',
              desc: `Historial de SUNARP y SOAT obtenido para ${cleanId}.`,
              type: 'success'
            }
          }));
        }
      } else {
        // Fallback al mock si la API falla o no encuentra la placa
        const report = mockReports.find(r => r.plate === cleanId);
        if (report) {
          const adaptiveData: AdaptiveReport = {
            searchType: 'VEHICULAR',
            data: report
          };
          setData(adaptiveData);
          saveToHistory(cleanId, adaptiveData);
          setState('success');

          // Disparar éxito con Mock
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('govcheck-notification', {
              detail: {
                title: 'Búsqueda Exitosa (Placa Local)',
                desc: `Se obtuvieron datos locales de respaldo para la placa ${cleanId}.`,
                type: 'success'
              }
            }));
          }
        } else {
          setState('error');
          const errorText = plateResult.message || 'No se encontró información para esta placa.';
          setErrorMsg(errorText);

          // Disparar evento de error
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('govcheck-notification', {
              detail: {
                title: 'Error de Búsqueda (Placa)',
                desc: `Placa ${cleanId}: ${errorText}`,
                type: 'error'
              }
            }));
          }
        }
      }
    } catch {
      setState('error');
      setErrorMsg('Error de conexión con el servicio vehicular.');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('govcheck-notification', {
          detail: {
            title: 'Fallo de Red (Vehicular)',
            desc: `Error de conexión de red al consultar la placa ${cleanId}.`,
            type: 'error'
          }
        }));
      }
    }
  };

  return { state, data, search, errorMsg };
}

