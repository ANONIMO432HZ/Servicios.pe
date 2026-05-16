export interface Fine {
  id: string;
  entity: 'SAT' | 'SUTRAN' | 'MUNICIPALIDAD' | 'SUNAT';
  date: string;
  amount: number;
  status: 'PENDING' | 'PAID';
  description: string;
}

export interface Revision {
  id: string;
  date: string;
  result: 'APROBADO' | 'RECHAZADO';
  entity: string;
  expiry: string;
}

export interface VehicleReport {
  plate: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  engineNumber: string;
  owner: {
    name: string;
    dni: string;
    address: string;
  };
  status: 'Clear' | 'Flagged' | 'Pending';
  fines: Fine[];
  revisions: Revision[];
  theftReport?: {
    reported: boolean;
    date?: string;
    details?: string;
  };
  soat: {
    active: boolean;
    expiry: string;
    company: string;
  };
}

export const mockReports: VehicleReport[] = [
  {
    plate: 'ABC-1234',
    vin: '1HGCM82633A004123',
    make: 'Honda',
    model: 'Civic',
    year: 2019,
    color: 'Plata',
    engineNumber: 'R18Z1-1038472',
    owner: {
      name: 'Carlos Mendoza',
      dni: '12345678',
      address: 'Av. Arequipa 1234, Lince, Lima'
    },
    status: 'Flagged',
    fines: [
      {
        id: 'F-10293',
        entity: 'SAT',
        date: '2024-01-15',
        amount: 350.00,
        status: 'PENDING',
        description: 'Exceso de velocidad'
      }
    ],
    revisions: [
      {
        id: 'REV-0192',
        date: '2023-11-20',
        result: 'APROBADO',
        entity: 'CITV ReviCentro',
        expiry: '2024-11-20'
      }
    ],
    theftReport: { reported: false },
    soat: { active: true, expiry: '2024-12-01', company: 'Pacifico Seguros' }
  },
  {
    plate: 'XYZ-9876',
    vin: 'JTDKN36PX8002345',
    make: 'Toyota',
    model: 'Corolla',
    year: 2022,
    color: 'Blanco',
    engineNumber: '2ZR-FE-4928374',
    owner: {
      name: 'Maria Rojas',
      dni: '87654321',
      address: 'Calle Los Pinos 456, San Isidro, Lima'
    },
    status: 'Clear',
    fines: [],
    revisions: [
      {
        id: 'REV-0834',
        date: '2024-05-10',
        result: 'APROBADO',
        entity: 'CITV Lima',
        expiry: '2025-05-10'
      }
    ],
    theftReport: { reported: false },
    soat: { active: true, expiry: '2025-06-15', company: 'Rimac Seguros' }
  }
];
