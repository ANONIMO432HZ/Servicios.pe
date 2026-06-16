import { useState } from 'react';
import { mockReports } from '../lib/mock-data';
import type { VehicleReport } from '../lib/mock-data';

export type SearchState = 'idle' | 'loading' | 'success' | 'error';
export type AdaptiveSearchType = 'VEHICULAR' | 'IDENTIDAD' | 'EMPRESA';

export type SearchTabType = 'identidad' | 'ruc' | 'vehiculo';

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
      data: report
    };

    historyList = [newItem, ...historyList].slice(0, 25);
    localStorage.setItem('govcheck_search_history', JSON.stringify(historyList));
  } catch (e) {
    console.error('Error saving search history to localStorage:', e);
  }
};

function parseNameInput(input: string): { nombres: string; apellido_paterno: string; apellido_materno: string } | null {
  const parts = input.split(',').map(s => s.trim());
  if (parts.length === 2 && parts[0].split(/\s+/).length >= 2) {
    const surnames = parts[0].split(/\s+/);
    return {
      apellido_paterno: surnames[0],
      apellido_materno: surnames.slice(1).join(' '),
      nombres: parts[1],
    };
  }
  const words = input.split(/\s+/);
  if (words.length < 3) return null;
  return {
    nombres: words.slice(0, -2).join(' '),
    apellido_paterno: words[words.length - 2],
    apellido_materno: words[words.length - 1],
  };
}

async function searchByIdentity(cleanId: string): Promise<AdaptiveReport> {
  const isDni = /^\d{8}$/.test(cleanId);
  let dni: string;
  let fullName: string;

  if (isDni) {
    dni = cleanId;
    const dniRes = await fetch(`/api/search/dni?dni=${dni}`);
    const dniResult = await dniRes.json();
    if (!dniResult.success || !dniResult.data) {
      throw new Error(dniResult.message || 'DNI no encontrado');
    }
    fullName = dniResult.data.nombre_completo || `${dniResult.data.apellido_paterno} ${dniResult.data.apellido_materno}, ${dniResult.data.nombres}`;
  } else {
    const parsed = parseNameInput(cleanId);
    if (!parsed) throw new Error('Formato de nombre invalido. Usa: Nombres ApellidoPaterno ApellidoMaterno o Apellidos, Nombres');
    const nameRes = await fetch(`/api/search/dniperu/by-name?nombres=${encodeURIComponent(parsed.nombres)}&apellido_paterno=${encodeURIComponent(parsed.apellido_paterno)}&apellido_materno=${encodeURIComponent(parsed.apellido_materno)}`);
    const nameResult = await nameRes.json();
    if (!nameResult.success || !nameResult.data?.resultados?.length) {
      throw new Error(nameResult.message || 'No se encontraron resultados para ese nombre');
    }
    const first = nameResult.data.resultados[0];
    dni = first.numero;
    fullName = `${first.apellido_paterno} ${first.apellido_materno}, ${first.nombres}`;

    const dniRes = await fetch(`/api/search/dni?dni=${dni}`);
    const dniResult = await dniRes.json();
    if (dniResult.success && dniResult.data) {
      fullName = dniResult.data.nombre_completo || fullName;
    }
  }

  let licenseData: { success: boolean; data: any; message?: string } = { success: false, data: null };
  try {
    const licenseRes = await fetch(`/api/search/license?dni=${dni}`, { signal: AbortSignal.timeout(4000) });
    if (licenseRes.ok) licenseData = await licenseRes.json();
    else licenseData = await licenseRes.json().catch(() => ({ success: false, data: null, message: 'Error del servidor' }));
  } catch {
  }

  const hasLicenseSupport = licenseData.success;
  const isUnavailable = !licenseData.success && (
    licenseData.message?.toLowerCase().includes('no soportada') ||
    licenseData.message?.toLowerCase().includes('configuracion') ||
    licenseData.message?.toLowerCase().includes('token') ||
    licenseData.message?.toLowerCase().includes('premium')
  );

  return {
    searchType: 'IDENTIDAD',
    data: {
      dni,
      fullName,
      address: 'Dirección protegida',
      ubigeo: 'N/A',
      status: 'Clear',
      license: hasLicenseSupport
        ? { categoria: licenseData.data.licencia.categoria, estado: licenseData.data.licencia.estado }
        : isUnavailable ? undefined : null,
    }
  };
}

async function searchByRuc(cleanId: string): Promise<AdaptiveReport> {
  const rucRes = await fetch(`/api/search/ruc?ruc=${cleanId}`);
  const rucResult = await rucRes.json();
  if (!rucResult.success || !rucResult.data) {
    throw new Error(rucResult.message || 'RUC no encontrado');
  }

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

  return {
    searchType: 'EMPRESA',
    data: {
      ruc: rucResult.data.ruc || cleanId,
      companyName: rucResult.data.nombre_o_razon_social,
      address: rucResult.data.direccion_completa || 'Dirección SUNAT',
      status: rucResult.data.estado || 'ACTIVO',
      condition: rucResult.data.condicion || 'HABIDO',
      economicActivity: rucResult.data.actividad_economica?.[0] || 'Actividad Comercial',
      systemStatus: rucResult.data.estado === 'ACTIVO' ? 'Clear' : 'Flagged',
      debts
    }
  };
}

async function searchByPlate(cleanId: string): Promise<AdaptiveReport> {
  const [plateRes, soatRes] = await Promise.all([
    fetch(`/api/search/plate?plate=${cleanId}`),
    fetch(`/api/search/soat?plate=${cleanId}`)
  ]);

  const plateResult = await plateRes.json();
  const soatResult = await soatRes.json();

  if (!plateResult.success || !plateResult.data) {
    const report = mockReports.find(r => r.plate === cleanId);
    if (report) {
      return { searchType: 'VEHICULAR', data: report };
    }
    throw new Error(plateResult.message || 'No se encontro informacion para esta placa');
  }

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

  return { searchType: 'VEHICULAR', data: vehicularReport };
}

export function useVehicleSearch() {
  const [state, setState] = useState<SearchState>('idle');
  const [data, setData] = useState<AdaptiveReport | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const search = async (identifier: string, searchType: SearchTabType) => {
    const cleanId = identifier.trim().toUpperCase();
    if (!cleanId) return;

    setState('loading');
    setData(null);
    setErrorMsg('');

    try {
      let report: AdaptiveReport;

      if (searchType === 'identidad') {
        report = await searchByIdentity(cleanId);
      } else if (searchType === 'ruc') {
        if (!/^\d{11}$/.test(cleanId)) {
          throw new Error('RUC invalido: debe tener 11 digitos numericos');
        }
        report = await searchByRuc(cleanId);
      } else {
        report = await searchByPlate(cleanId);
      }

      setData(report);
      saveToHistory(cleanId, report);
      setState('success');

      const label = searchType === 'identidad' ? 'Identidad' : searchType === 'ruc' ? 'RUC' : 'Vehicular';
      const desc = searchType === 'identidad'
        ? `Identidad verificada para ${report.data.fullName}.`
        : searchType === 'ruc'
          ? `Empresa consultada: ${report.data.companyName}.`
          : `Historial obtenido para ${report.data.plate}.`;

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('govcheck-notification', {
          detail: { title: `Busqueda Exitosa (${label})`, desc, type: 'success' }
        }));
      }
    } catch (e: any) {
      setState('error');
      setErrorMsg(e.message || 'Error al realizar la consulta');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('govcheck-notification', {
          detail: { title: 'Error de Busqueda', desc: e.message || 'Error desconocido', type: 'error' }
        }));
      }
    }
  };

  return { state, data, search, errorMsg };
}
