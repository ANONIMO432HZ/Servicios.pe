export type ServiceCategory = 'Identidad' | 'Finanzas' | 'Salud' | 'Transporte' | 'Pago';

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
  // ==========================================
  // CATEGORIA: IDENTIDAD
  // ==========================================
  {
    id: 'onpe-multas-electorales',
    name: 'JNE Multas Electorales',
    description: 'Consulta oficial de multas electorales pendientes por omisión al sufragio o inasistencia a miembro de mesa.',
    url: 'https://multas.jne.gob.pe/login',
    category: 'Identidad',
    logoPath: '/assets/img/logo-jne.png',
    status: 'Operativo'
  },
  {
    id: 'migraciones-citas-pasaporte',
    name: 'Citas Pasaporte Electrónico',
    description: 'Sistema oficial de programación y consulta de citas para la obtención del Pasaporte Electrónico.',
    url: 'https://citaspasaporte.migraciones.gob.pe/citas-pasaporte-v2/pasaporte',
    category: 'Identidad',
    logoPath: '/assets/img/logo-migraciones.png',
    status: 'Operativo'
  },
  {
    id: 'reniec-tramite-dni',
    name: 'RENIEC Estado de Trámite',
    description: 'Consulta gratuita del estado de emisión de tu DNI o DNI electrónico.',
    url: 'https://serviciosportal.reniec.gob.pe/cetdnice/index.htm',
    category: 'Identidad',
    logoPath: '/assets/img/logo-reniec.png',
    status: 'Operativo'
  },
  {
    id: 'eldni-consulta-identidad',
    name: 'Consulta DNI Ciudadano',
    description: 'Buscador alternativo de datos públicos para consulta rápida de identidad.',
    url: 'https://eldni.com/',
    category: 'Identidad',
    logoPath: '/assets/img/logo-eldni.png',
    status: 'Operativo'
  },
  {
    id: 'dniperu-consulta-identidad',
    name: 'Consulta DNI Ciudadano 2',
    description: 'Buscador alternativo de datos públicos para consulta rápida de identidad.',
    url: 'https://dniperu.com/',
    category: 'Identidad',
    logoPath: '/assets/img/logo-dniperu.png',
    status: 'Operativo'
  },

  // ==========================================
  // CATEGORIA: FINANZAS
  // ==========================================
  {
    id: 'sunat-reporte-pagos',
    name: 'SUNAT Reporte de Pagos',
    description: 'Menú Sol de SUNAT para consultar reportes oficiales de pagos pendientes y tributos obligatorios.',
    url: 'https://e-menu.sunat.gob.pe/cl-ti-itmenu/MenuInternet.htm',
    category: 'Finanzas',
    logoPath: '/assets/img/logo-sunat.jpg',
    status: 'Operativo'
  },
  {
    id: 'sbs-afp-consulta',
    name: 'SBS Afiliación AFP o Seguro',
    description: 'Redirección directa del portal SBS para consultar tu AFP afiliada, aportes previsionales o vigencia de seguro.',
    url: 'https://servicios.sbs.gob.pe/serviciosenlinea/Home/PortalRedirect?idOption=10',
    category: 'Finanzas',
    logoPath: '/assets/img/sbs_logo.png',
    status: 'Operativo'
  },
  {
    id: 'sbs-servicios-linea',
    name: 'SBS Servicios en Línea',
    description: 'Acceso unificado a los servicios virtuales de la SBS, Reporte de Deudas y Central de Alertas.',
    url: 'https://servicios.sbs.gob.pe/serviciosenlinea',
    category: 'Finanzas',
    logoPath: '/assets/img/sbs_logo.png',
    status: 'Operativo'
  },
  {
    id: 'sunat-consulta-ruc',
    name: 'SUNAT Consulta RUC',
    description: 'Verifica el estado de contribuyente, domicilio fiscal y datos registrales de personas y empresas en Perú.',
    url: 'https://e-consultaruc.sunat.gob.pe/cl-ti-itconsruc/FrameCriterioBusquedaWeb.jsp',
    category: 'Finanzas',
    logoPath: '/assets/img/logo-sunat.jpg',
    status: 'Operativo'
  },

  // ==========================================
  // CATEGORIA: SALUD
  // ==========================================
  {
    id: 'sis-afiliacion-consulta',
    name: 'SIS Consulta de Asegurado',
    description: 'Plataforma oficial del Seguro Integral de Salud para verificar vigencia y tipo de afiliación.',
    url: 'https://cel.sis.gob.pe/SisConsultaEnLinea',
    category: 'Salud',
    logoPath: '/assets/img/sis_logo.png',
    status: 'Operativo'
  },
  {
    id: 'essalud-donde-atiendo',
    name: 'EsSalud Dónde me Atiendo',
    description: 'Verifica la vigencia de tu acreditación en EsSalud y ubica el centro asistencial que te corresponde.',
    url: 'https://dondemeatiendo.essalud.gob.pe/#/consulta',
    category: 'Salud',
    logoPath: '/assets/img/logo-essalud.png',
    status: 'Operativo'
  },
  {
    id: 'essalud-viva-login',
    name: 'EsSalud VIVA Acceso',
    description: 'Oficina de Aseguramiento Virtual VIVA para consultar si tu seguro EsSalud está activo y al día.',
    url: 'https://viva.essalud.gob.pe/viva/login',
    category: 'Salud',
    logoPath: '/assets/img/logo-essalud.png',
    status: 'Operativo'
  },
  {
    id: 'essalud-viva-consultas',
    name: 'EsSalud Trámites y Seguros',
    description: 'Consulta de trámites iniciados, solicitudes de lactancia, maternidad y prestaciones económicas.',
    url: 'https://apps.essalud.gob.pe/viva-consultas/',
    category: 'Salud',
    logoPath: '/assets/img/logo-essalud.png',
    status: 'Operativo'
  },

  // ==========================================
  // CATEGORIA: TRANSPORTE
  // ==========================================
  {
    id: 'sunarp-consulta',
    name: 'SUNARP Consulta Vehicular',
    description: 'Consulta datos básicos del vehículo por placa de forma gratuita.',
    url: 'https://www.gob.pe/358-consultar-los-datos-de-un-vehiculo-consulta-vehiculara',
    category: 'Transporte',
    logoPath: '/assets/img/sunarp_consulta_vehicular.png',
    status: 'Operativo'
  },
  {
    id: 'sunarp-dueños-deudas',
    name: 'SUNARP Dueños y Deudas',
    description: 'Accede al historial de propietarios y gravámenes del vehículo.',
    url: 'https://sprl.sunarp.gob.pe/sprl/ingreso',
    category: 'Transporte',
    logoPath: '/assets/img/sunarp_duenos_deudas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-multas-lima',
    name: 'SAT Lima Multas',
    description: 'Consulta papeletas y multas de tránsito en Lima Metropolitana.',
    url: 'https://www.sat.gob.pe/pagosenlinea/',
    category: 'Transporte',
    logoPath: '/assets/img/sat_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sunarp-conoce-aqui',
    name: 'SUNARP Conoce Aquí',
    description: 'Servicio gratuito para visualizar partidas registrales.',
    url: 'https://conoce-aqui.sunarp.gob.pe/conoce-aqui/inicio',
    category: 'Transporte',
    logoPath: '/assets/img/sunarp_consulta_vehicular.png',
    status: 'Operativo'
  },
  {
    id: 'sutran-record-infracciones',
    name: 'SUTRAN Récord de Infracciones',
    description: 'Consulta el historial de infracciones en carreteras nacionales.',
    url: 'https://www.sutran.gob.pe/consultas/record-de-infracciones/record-de-infracciones/',
    category: 'Transporte',
    logoPath: '/assets/img/sutran_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sutran-verifica-infraccion',
    name: 'SUTRAN Verifica tu Infracción',
    description: 'Valida si tienes infracciones pendientes de pago o notificación.',
    url: 'https://www.sutran.gob.pe/consultas/record-de-infracciones/verifica-tu-infraccion/',
    category: 'Transporte',
    logoPath: '/assets/img/sutran_multas_verificacion.png',
    status: 'Operativo'
  },
  {
    id: 'mtc-revision-tecnica',
    name: 'CITV Revisión Técnica',
    description: 'Consulta la vigencia y el historial de revisiones técnicas del vehículo.',
    url: 'https://rec.mtc.gob.pe/Citv/ArConsultaCitv',
    category: 'Transporte',
    logoPath: '/assets/img/revision_tecnica.png',
    status: 'Operativo'
  },
  {
    id: 'atu-multas',
    name: 'ATU Multas',
    description: 'Consulta sanciones impuestas por la Autoridad de Transporte Urbano.',
    url: 'https://pasarela.atu.gob.pe/',
    category: 'Transporte',
    logoPath: '/assets/img/atu_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-capturas-rq',
    name: 'SAT Capturas y RQ',
    description: 'Verifica si el vehículo tiene orden de captura o requisitoria.',
    url: 'https://www.sat.gob.pe/VirtualSAT/modulos/Capturas.aspx?mysession=',
    category: 'Transporte',
    logoPath: '/assets/img/sat_rq_infracciones.png',
    status: 'Operativo'
  },
  {
    id: 'sunarp-siguelo-plus',
    name: 'SUNARP Síguelo Plus',
    description: 'Seguimiento en línea de títulos y solicitudes registrales.',
    url: 'https://sigueloplus.sunarp.gob.pe/siguelo/',
    category: 'Transporte',
    logoPath: '/assets/img/sigueloplus_seguimiento_titulos.png',
    status: 'Operativo'
  },
  {
    id: 'pnp-lunas-oscurecidas',
    name: 'PNP Lunas Oscurecidas',
    description: 'Consulta el estado de lunas polarizadas ante la Policía Nacional.',
    url: 'https://sistemas.policia.gob.pe/consultalunas/ConsultarServicioLunas',
    category: 'Transporte',
    logoPath: '/assets/img/pnp_lunas_polarizadas.png',
    status: 'Operativo'
  },
  {
    id: 'mtc-licencias',
    name: 'MTC Récord del Conductor',
    description: 'Consulta el historial de puntos y licencias del conductor.',
    url: 'https://slcp.mtc.gob.pe/',
    category: 'Transporte',
    logoPath: '/assets/img/mtc_consulta_licencias.png',
    status: 'Operativo'
  },
  {id: 'sunarp-servicios-online',
    name: 'SUNARP Servicios Online',
    description: 'Servicios gratuitos de la SUNARP.',
    url: 'https://www.sunarp.gob.pe/serviciosenlinea/portal/servicios-gratuitos.html',
    category: 'Transporte',
    logoPath: '/assets/img/logo-sunarp.png',
    status: 'Operativo'

  },
  {
    id: 'pnp-rq-vehicular',
    name: 'PNP Requisitorias Vehiculares',
    description: 'Consulta si el vehículo cuenta con denuncias por robo o hurto.',
    url: 'https://sistemas1.policia.gob.pe/ConsultaPVR/ConsultarServicio',
    category: 'Transporte',
    logoPath: '/assets/img/rq_vehicular.png',
    status: 'Operativo'
  },
  {
    id: 'pit-fotopapeletas',
    name: 'PIT Fotopapeletas',
    description: 'Consulta de infracciones de tránsito detectadas por cámaras.',
    url: 'http://www.pit.gob.pe/pit2007/EstadoCuentaVelocidad.aspx',
    category: 'Transporte',
    logoPath: '/assets/img/pit_fotopapeletas.png',
    status: 'Operativo'
  },
  {
    id: 'fise-taller-gnv',
    name: 'FISE Consulta Taller GNV',
    description: 'Busca talleres autorizados para conversión a gas natural.',
    url: 'https://fise.minem.gob.pe:23308/consulta-taller/pages/consultaTaller/inicio',
    category: 'Transporte',
    logoPath: '/assets/img/revision_tecnica.png',
    status: 'Operativo'
  },

  // REGIONALES DE TRANSPORTE
  {
    id: 'sat-piura',
    name: 'SAT Piura',
    description: 'Consulta de papeletas and tributos en la ciudad de Piura.',
    url: 'https://satp.gob.pe/sistema-pagos/pasarela',
    category: 'Transporte',
    logoPath: '/assets/img/sat_piura_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-chiclayo',
    name: 'SAT Chiclayo (SATCH)',
    description: 'Consulta de infracciones y deudas en Chiclayo.',
    url: 'https://virtualsatch.satch.gob.pe/virtualsatch/record_infracciones/buscar_placa_',
    category: 'Transporte',
    logoPath: '/assets/img/sat_chiclayo_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-tacna',
    name: 'SAT Tacna',
    description: 'Consulta de papeletas de tránsito en la ciudad de Tacna.',
    url: 'https://www.munitacna.gob.pe/pagina/sf/servicios/papeletas',
    category: 'Transporte',
    logoPath: '/assets/img/sat_tacna_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-chachapoyas',
    name: 'SAT Chachapoyas',
    description: 'Consulta de infracciones en la Municipalidad de Chachapoyas.',
    url: 'https://app.munichachapoyas.gob.pe/servicios/consulta_papeletas/app/papeletas.php',
    category: 'Transporte',
    logoPath: '/assets/img/sat_chachapoyas_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-ica',
    name: 'SAT Ica',
    description: 'Consulta virtual de tributos y multas en el SAT de Ica.',
    url: 'https://m.satica.gob.pe/index.html',
    category: 'Transporte',
    logoPath: '/assets/img/sat_ica_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-andahuaylas',
    name: 'SAT Andahuaylas',
    description: 'Consulta de papeletas de tránsito en Andahuaylas.',
    url: 'https://muniandahuaylas.gob.pe/consultar-papeleta/',
    category: 'Transporte',
    logoPath: '/assets/img/sat_andahuaylas_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-huancayo',
    name: 'SAT Huancayo',
    description: 'Consulta de infracciones y papeletas en el SAT Huancayo.',
    url: 'http://sathuancayo.fortiddns.com:888/VentanillaVirtual/ConsultaPIT.aspx',
    category: 'Transporte',
    logoPath: '/assets/img/sat_huancayo_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-arequipa',
    name: 'SAT Arequipa',
    description: 'Consulta de multas y trámites en la Municipalidad de Arequipa.',
    url: 'https://www.muniarequipa.gob.pe/muni-virtual-4/',
    category: 'Transporte',
    logoPath: '/assets/img/sat_arequipa_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-cajamarca',
    name: 'SAT Cajamarca',
    description: 'Consulta de tributos y papeletas en el SAT de Cajamarca.',
    url: 'https://www.satcajamarca.gob.pe/#/consultas',
    category: 'Transporte',
    logoPath: '/assets/img/sat_cajamarca_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-trujillo',
    name: 'SAT Trujillo (SATT)',
    description: 'Pagos y consultas en línea en el SAT de Trujillo.',
    url: 'https://digital.satt.gob.pe/pagos/account/login',
    category: 'Transporte',
    logoPath: '/assets/img/sat_trujillo_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-tarapoto',
    name: 'SAT Tarapoto',
    description: 'Consulta de papeletas y multas en la ciudad de Tarapoto.',
    url: 'https://www.sat-t.gob.pe/#consulta-papeletas',
    category: 'Transporte',
    logoPath: '/assets/img/sat_tarapoto_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-huanuco',
    name: 'SAT Huánuco',
    description: 'Consulta de infracciones en la Municipalidad de Huánuco.',
    url: 'https://www.munihuanuco.gob.pe/wp-content/servicios/transportes/gt_papeletas.php',
    category: 'Transporte',
    logoPath: '/assets/img/sat_huanuco_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-pucallpa',
    name: 'SAT Pucallpa',
    description: 'Consulta vehicular y de multas en Coronel Portillo (Pucallpa).',
    url: 'http://consultas.municportillo.gob.pe:85/consultaVehiculo/consulta/',
    category: 'Transporte',
    logoPath: '/assets/img/sat_pucallpa.png',
    status: 'Operativo'
  },
  {
    id: 'sat-cusco',
    name: 'SAT Cusco',
    description: 'Consulta de infracciones de tránsito en la Municipalidad del Cusco.',
    url: 'https://cusco.gob.pe/informatica/infracciones',
    category: 'Transporte',
    logoPath: '/assets/img/sat_cusco_multas.png',
    status: 'Operativo'
  },
  {
    id: 'sat-callao',
    name: 'Municipalidad del Callao',
    description: 'Consulta y pago de papeletas en la Provincia Constitucional del Callao.',
    url: 'https://pagopapeletascallao.pe/',
    category: 'Transporte',
    logoPath: '/assets/img/muni_callao_multas.png',
    status: 'Operativo'
  },

  // SEGUROS Y OTROS DE TRANSPORTE
  {
    id: 'sbs-consulta-soat',
    name: 'SBS Consulta SOAT',
    description: 'Verifica la vigencia del SOAT a través de la SBS.',
    url: 'https://servicios.sbs.gob.pe/reportesoat/BusquedaPlaca',
    category: 'Transporte',
    logoPath: '/assets/img/sbs_choques_siniestros.png',
    status: 'Operativo'
  },
  {
    id: 'apeseg-soat',
    name: 'APESEG Consulta SOAT',
    description: 'Consulta rápida de vigencia de SOAT electrónico y físico.',
    url: 'https://www.apeseg.org.pe/consultas-soat/',
    category: 'Transporte',
    logoPath: '/assets/img/logo-soat.jpg',
    status: 'Operativo'
  },
  {
    id: 'aap-placas',
    name: 'AAP Placas',
    description: 'Consulta el estado de entrega y trámite de tu placa en la AAP.',
    url: 'https://www.placas.pe/Public/CheckPlateStatus.aspx',
    category: 'Transporte',
    logoPath: '/assets/img/logo-aap.jpg',
    status: 'Operativo'
  },
  {
    id: 'infogas-deuda',
    name: 'INFOGAS Deuda Placa',
    description: 'Consulta deudas y financiamientos de conversiones GNV.',
    url: 'https://infogas.com.pe/',
    category: 'Transporte',
    logoPath: '/assets/img/infogas_deuda_placa.png',
    status: 'Operativo'
  },
  {
    id: 'aap-oficinas',
    name: 'AAP Placas',
    description: 'Consulta el estado de entrega y trámite de tu placa en la AAP.',
    url: 'https://www.placas.pe/#/home',
    category: 'Transporte',
    logoPath: '/assets/img/logo-aap.jpg',
    status: 'Operativo'
  },
  //SERVICIOS Y TRÁMITES PAGADOS
  {
    id: 'sunarp-tive',
    name: 'TIVE Solicita',
    description: 'Solicita tu Tarjeta de Identificación Vehicular Electrónica.',
    url: 'https://api.whatsapp.com/send?phone=51932477857&text=TIVE.%20Quiero%20tramitar%20la%20TIVE%20(Tarjeta%20de%20Propiedad%20Vehicular)',
    category: 'Pago',
    logoPath: '/assets/img/tive.png',
    status: 'Operativo'
  },
  {
    id: 'reporte-infocorp',
    name: 'Reporte Infocorp Equifax',
    description: 'Obtén tu reporte crediticio consolidado de Infocorp Equifax.',
    url: 'https://api.whatsapp.com/send?phone=51932477857&text=INFOCORP.%20Quiero%20mi%20reporte%20crediticio%20Infocorp%20Equifax',
    category: 'Pago',
    logoPath: '/assets/img/infocorp_reporte.png',
    status: 'Operativo'
  },
  {
    id: 'informe-vehicular',
    name: 'Informe Vehicular',
    description: 'Historial completo de antecedentes, propietarios, multas y gravámenes del vehículo.',
    url: 'https://api.whatsapp.com/send?phone=51932477857&text=Voy%20a%20comprar%20un%20veh%C3%ADculo%20y%20quiero%20que%20Uds.%20Me%20lo%20filtren%20para%20ver%20si%20me%20conviene%20o%20no',
    category: 'Pago',
    logoPath: '/assets/img/informe_vehicular.png',
    status: 'Operativo'
  },
  {
    id: 'copia-certificado-nacimiento',
    name: 'Copia Certificado de Nacimiento',
    description: 'Obtén una copia certificada de tu partida o acta de nacimiento.',
    url: 'https://api.whatsapp.com/send?phone=51992621768&text=Quiero%20obtener%20una%20copia%20de%20mi%20partida%20de%20nacimiento',
    category: 'Pago',
    logoPath: '/assets/img/reniec_cert.jpg',
    status: 'Operativo'
  },
  {
    id: 'copia-certificado-matrimonio',
    name: 'Copia Certificado de Matrimonio',
    description: 'Solicita una copia certificada de tu acta de matrimonio.',
    url: 'https://api.whatsapp.com/send?phone=51992621768&text=Quiero%20obtener%20una%20copia%20certificada%20de%20mi%20acta%20de%20matrimonio',
    category: 'Pago',
    logoPath: '/assets/img/reniec_cert.jpg',
    status: 'Operativo'
  },
  {
    id: 'copia-certificado-defuncion',
    name: 'Copia Certificado de Defunción',
    description: 'Obtén una copia certificada del certificado de defunción.',
    url: 'https://api.whatsapp.com/send?phone=51992621768&text=Solicito%20copia%20certificada%20de%20un%20acta%20de%20defunci%C3%B3n',
    category: 'Pago',
    logoPath: '/assets/img/reniec_cert.jpg',
    status: 'Operativo'
  },
  

];
