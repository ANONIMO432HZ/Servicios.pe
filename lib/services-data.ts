export type ServiceCategory = 'Nacional' | 'Regional' | 'Seguros' | 'Otros';

export interface ServiceLink {
  id: string;
  name: string;
  description: string;
  url: string;
  category: ServiceCategory;
  logoPath: string; // Relative path to /assets/img/
  status?: 'Operativo' | 'Mantenimiento';
}

export const SERVICES: ServiceLink[] = [
  // CATEGORIA: NACIONAL
  {
    id: 'sunarp-consulta',
    name: 'SUNARP Consulta Vehicular',
    description: 'Consulta datos básicos del vehículo por placa de forma gratuita.',
    url: 'https://www.gob.pe/358-consultar-los-datos-de-un-vehiculo-consulta-vehiculara',
    category: 'Nacional',
    logoPath: '/assets/img/sunarp_consulta_vehicular.png',
    status: 'Operativo'
  },
  {
    id: 'sunarp-dueños-deudas',
    name: 'SUNARP Dueños y Deudas',
    description: 'Accede al historial de propietarios y gravámenes del vehículo.',
    url: 'https://sprl.sunarp.gob.pe/sprl/ingreso',
    category: 'Nacional',
    logoPath: '/assets/img/sunarp_dueños_deudas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-multas-lima',
    name: 'SAT Lima Multas',
    description: 'Consulta papeletas y multas de tránsito en Lima Metropolitana.',
    url: 'https://www.sat.gob.pe/pagosenlinea/',
    category: 'Nacional',
    logoPath: '/assets/img/sat_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sunarp-conoce-aqui',
    name: 'SUNARP Conoce Aquí',
    description: 'Servicio gratuito para visualizar partidas registrales.',
    url: 'https://conoce-aqui.sunarp.gob.pe/conoce-aqui/inicio',
    category: 'Nacional',
    logoPath: '/assets/img/sunarp_consulta_vehicular.png',
    status: 'Operativo'
  },
  {
    id: 'sutran-record-infracciones',
    name: 'SUTRAN Récord de Infracciones',
    description: 'Consulta el historial de infracciones en carreteras nacionales.',
    url: 'https://www.sutran.gob.pe/consultas/record-de-infracciones/record-de-infracciones/',
    category: 'Nacional',
    logoPath: '/assets/img/sutran_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sutran-verifica-infraccion',
    name: 'SUTRAN Verifica tu Infracción',
    description: 'Valida si tienes infracciones pendientes de pago o notificación.',
    url: 'https://www.sutran.gob.pe/consultas/record-de-infracciones/verifica-tu-infraccion/',
    category: 'Nacional',
    logoPath: '/assets/img/sutran__multas_verificacion.png',
    status: 'Operativo'
  },
  {
    id: 'mtc-revision-tecnica',
    name: 'CITV Revisión Técnica',
    description: 'Consulta la vigencia y el historial de revisiones técnicas del vehículo.',
    url: 'https://rec.mtc.gob.pe/Citv/ArConsultaCitv',
    category: 'Nacional',
    logoPath: '/assets/img/revision_tecnica.png',
    status: 'Operativo'
  },
  {
    id: 'atu-multas',
    name: 'ATU Multas',
    description: 'Consulta sanciones impuestas por la Autoridad de Transporte Urbano.',
    url: 'https://pasarela.atu.gob.pe/',
    category: 'Nacional',
    logoPath: '/assets/img/atu_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-capturas-rq',
    name: 'SAT Capturas y RQ',
    description: 'Verifica si el vehículo tiene orden de captura o requisitoria.',
    url: 'https://www.sat.gob.pe/VirtualSAT/modulos/Capturas.aspx?mysession=',
    category: 'Nacional',
    logoPath: '/assets/img/sat_rq_infracciones.png',
    status: 'Operativo'
  },
  {
    id: 'sunarp-siguelo-plus',
    name: 'SUNARP Síguelo Plus',
    description: 'Seguimiento en línea de títulos y solicitudes registrales.',
    url: 'https://sigueloplus.sunarp.gob.pe/siguelo/',
    category: 'Nacional',
    logoPath: '/assets/img/sigueloPlus_seguimiento_titulos.png',
    status: 'Operativo'
  },
  {
    id: 'pnp-lunas-oscurecidas',
    name: 'PNP Lunas Oscurecidas',
    description: 'Consulta el estado de lunas polarizadas ante la Policía Nacional.',
    url: 'https://sistemas.policia.gob.pe/consultalunas/ConsultarServicioLunas',
    category: 'Nacional',
    logoPath: '/assets/img/pnp_lunas_polarisadas.png',
    status: 'Operativo'
  },
  {
    id: 'mtc-licencias',
    name: 'MTC Récord del Conductor',
    description: 'Consulta el historial de puntos y licencias del conductor.',
    url: 'https://slcp.mtc.gob.pe/',
    category: 'Nacional',
    logoPath: '/assets/img/mtc_consulta_licencias.png',
    status: 'Operativo'
  },
  {
    id: 'sunarp-tive',
    name: 'TIVE Consulta',
    description: 'Consulta tu Tarjeta de Identificación Vehicular Electrónica.',
    url: 'https://www.sunarp.gob.pe/consultas-en-linea.html',
    category: 'Nacional',
    logoPath: '/assets/img/tive.png',
    status: 'Operativo'
  },
  {
    id: 'pnp-rq-vehicular',
    name: 'PNP Requisitorias Vehiculares',
    description: 'Consulta si el vehículo cuenta con denuncias por robo o hurto.',
    url: 'https://sistemas1.policia.gob.pe/ConsultaPVR/ConsultarServicio',
    category: 'Nacional',
    logoPath: '/assets/img/rq_vehicular.png',
    status: 'Operativo'
  },
  {
    id: 'pit-fotopapeletas',
    name: 'PIT Fotopapeletas',
    description: 'Consulta de infracciones de tránsito detectadas por cámaras.',
    url: 'http://www.pit.gob.pe/pit2007/EstadoCuentaVelocidad.aspx',
    category: 'Nacional',
    logoPath: '/assets/img/pit_fotopapeletas.png',
    status: 'Operativo'
  },
  {
    id: 'fise-taller-gnv',
    name: 'FISE Consulta Taller GNV',
    description: 'Busca talleres autorizados para conversión a gas natural.',
    url: 'https://fise.minem.gob.pe:23308/consulta-taller/pages/consultaTaller/inicio',
    category: 'Nacional',
    logoPath: '/assets/img/revision_tecnica.png',
    status: 'Operativo'
  },

  // CATEGORIA: REGIONAL
  {
    id: 'sat-piura',
    name: 'SAT Piura',
    description: 'Consulta de papeletas y tributos en la ciudad de Piura.',
    url: 'https://satp.gob.pe/sistema-pagos/pasarela',
    category: 'Regional',
    logoPath: '/assets/img/sat_piura_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-chiclayo',
    name: 'SAT Chiclayo (SATCH)',
    description: 'Consulta de infracciones y deudas en Chiclayo.',
    url: 'https://virtualsatch.satch.gob.pe/virtualsatch/record_infracciones/buscar_placa_',
    category: 'Regional',
    logoPath: '/assets/img/sat_chiclayo_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-tacna',
    name: 'SAT Tacna',
    description: 'Consulta de papeletas de tránsito en la ciudad de Tacna.',
    url: 'https://www.munitacna.gob.pe/pagina/sf/servicios/papeletas',
    category: 'Regional',
    logoPath: '/assets/img/sat_tacna_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-chachapoyas',
    name: 'SAT Chachapoyas',
    description: 'Consulta de infracciones en la Municipalidad de Chachapoyas.',
    url: 'https://app.munichachapoyas.gob.pe/servicios/consulta_papeletas/app/papeletas.php',
    category: 'Regional',
    logoPath: '/assets/img/sat_chachapoyas_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-ica',
    name: 'SAT Ica',
    description: 'Consulta virtual de tributos y multas en el SAT de Ica.',
    url: 'https://m.satica.gob.pe/index.html',
    category: 'Regional',
    logoPath: '/assets/img/sat_ica_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-andahuaylas',
    name: 'SAT Andahuaylas',
    description: 'Consulta de papeletas de tránsito en Andahuaylas.',
    url: 'https://muniandahuaylas.gob.pe/consultar-papeleta/',
    category: 'Regional',
    logoPath: '/assets/img/sat_andahuaylas_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-huancayo',
    name: 'SAT Huancayo',
    description: 'Consulta de infracciones y papeletas en el SAT Huancayo.',
    url: 'http://sathuancayo.fortiddns.com:888/VentanillaVirtual/ConsultaPIT.aspx',
    category: 'Regional',
    logoPath: '/assets/img/sat_huancayo_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-arequipa',
    name: 'SAT Arequipa',
    description: 'Consulta de multas y trámites en la Municipalidad de Arequipa.',
    url: 'https://www.muniarequipa.gob.pe/muni-virtual-4/',
    category: 'Regional',
    logoPath: '/assets/img/sat_arequipa_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-cajamarca',
    name: 'SAT Cajamarca',
    description: 'Consulta de tributos y papeletas en el SAT de Cajamarca.',
    url: 'https://www.satcajamarca.gob.pe/#/consultas',
    category: 'Regional',
    logoPath: '/assets/img/sat_cajamarca_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-trujillo',
    name: 'SAT Trujillo (SATT)',
    description: 'Pagos y consultas en línea en el SAT de Trujillo.',
    url: 'https://digital.satt.gob.pe/pagos/account/login',
    category: 'Regional',
    logoPath: '/assets/img/sat_trujillo_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-tarapoto',
    name: 'SAT Tarapoto',
    description: 'Consulta de papeletas y multas en la ciudad de Tarapoto.',
    url: 'https://www.sat-t.gob.pe/#consulta-papeletas',
    category: 'Regional',
    logoPath: '/assets/img/sat_tarapoto_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-huanuco',
    name: 'SAT Huánuco',
    description: 'Consulta de infracciones en la Municipalidad de Huánuco.',
    url: 'https://www.munihuanuco.gob.pe/wp-content/servicios/transportes/gt_papeletas.php',
    category: 'Regional',
    logoPath: '/assets/img/sat_huanuco_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-pucallpa',
    name: 'SAT Pucallpa',
    description: 'Consulta vehicular y de multas en Coronel Portillo (Pucallpa).',
    url: 'http://servicios.municportillo.gob.pe:85/consultaVehiculo/consulta/',
    category: 'Regional',
    logoPath: '/assets/img/sat_pucallpa.png',
    status: 'Operativo'
  },
  {
    id: 'sat-cusco',
    name: 'SAT Cusco',
    description: 'Consulta de infracciones de tránsito en la Municipalidad del Cusco.',
    url: 'https://cusco.gob.pe/informatica/infracciones',
    category: 'Regional',
    logoPath: '/assets/img/sat_cusco_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-callao',
    name: 'Municipalidad del Callao',
    description: 'Consulta y pago de papeletas en la Provincia Constitucional del Callao.',
    url: 'https://pagopapeletascallao.pe/',
    category: 'Regional',
    logoPath: '/assets/img/muni_callao_multas.png',
    status: 'Operativo'
  },

  // CATEGORIA: SEGUROS
  {
    id: 'sbs-consulta-soat',
    name: 'SBS Consulta SOAT',
    description: 'Verifica la vigencia del SOAT a través de la SBS.',
    url: 'https://servicios.sbs.gob.pe/reportesoat/BusquedaPlaca',
    category: 'Seguros',
    logoPath: '/assets/img/sbs_choques_siniestros.png',
    status: 'Operativo'
  },
  {
    id: 'apeseg-soat',
    name: 'APESEG Consulta SOAT',
    description: 'Consulta rápida de vigencia de SOAT electrónico y físico.',
    url: 'https://www.apeseg.org.pe/consultas-soat/',
    category: 'Seguros',
    logoPath: '/assets/img/soat_consulta.png',
    status: 'Operativo'
  },
  {
    id: 'soat-vigencia',
    name: 'Vigencia de SOAT',
    description: 'Acceso directo a la consulta de seguros vehiculares obligatorios.',
    url: 'https://www.apeseg.org.pe/consultas-soat/',
    category: 'Seguros',
    logoPath: '/assets/img/soat_consulta.png',
    status: 'Operativo'
  },

  // CATEGORIA: OTROS
  {
    id: 'aap-placas',
    name: 'AAP Placas',
    description: 'Consulta el estado de entrega y trámite de tu placa en la AAP.',
    url: 'https://www.placas.pe/Public/CheckPlateStatus.aspx',
    category: 'Otros',
    logoPath: '/assets/img/aap_cambio_placa.png',
    status: 'Operativo'
  },
  {
    id: 'infogas-deuda',
    name: 'INFOGAS Deuda Placa',
    description: 'Consulta deudas y financiamientos de conversiones GNV.',
    url: 'https://infogas.com.pe/',
    category: 'Otros',
    logoPath: '/assets/img/infogas_deuda_placa.png',
    status: 'Operativo'
  },
  {
    id: 'aap-oficinas',
    name: 'AAP Oficinas Registrales',
    description: 'Ubicación de centros de entrega de placas a nivel nacional.',
    url: 'https://aap.org.pe/placas/tipos/ordinarias/oficinas-registrales/',
    category: 'Otros',
    logoPath: '/assets/img/aap_asociacion_automotriz_del_peru.png',
    status: 'Operativo'
  }
];

