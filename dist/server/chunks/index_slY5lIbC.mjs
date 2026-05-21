import { c as createComponent } from './astro-component_DNiUXFEw.mjs';
import 'piccolore';
import { ba as renderTemplate, aW as maybeRenderHead } from './params-and-props_CvnwIJai.mjs';
import { r as renderComponent } from './server_Uic00SnP.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_Bu4cbNIG.mjs';
import { A as AdvancedSearch } from './AdvancedSearch_C3GCPH3A.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useMemo } from 'react';
import { ShieldCheck, Info, ExternalLink, AlertTriangle, Search, Grid, UserCheck, DollarSign, Activity, Car, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SERVICES = [
  // ==========================================
  // CATEGORIA: IDENTIDAD
  // ==========================================
  {
    id: "onpe-multas-electorales",
    name: "JNE Multas Electorales",
    description: "Consulta oficial de multas electorales pendientes por omisión al sufragio o inasistencia a miembro de mesa.",
    url: "https://multas.jne.gob.pe/login",
    category: "Identidad",
    logoPath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg9fcqMrhWV6rTG2Ug2vQqoRQp6UXw2pLDmQ&s",
    status: "Operativo"
  },
  {
    id: "migraciones-citas-pasaporte",
    name: "Citas Pasaporte Electrónico",
    description: "Sistema oficial de programación y consulta de citas para la obtención del Pasaporte Electrónico.",
    url: "https://citaspasaporte.migraciones.gob.pe/citas-pasaporte-v2/pasaporte",
    category: "Identidad",
    logoPath: "https://rrd.migraciones.gob.pe/TramitesAgencia/images/logomigraciones.png",
    status: "Operativo"
  },
  {
    id: "reniec-tramite-dni",
    name: "RENIEC Estado de Trámite",
    description: "Consulta gratuita del estado de emisión de tu DNI o DNI electrónico.",
    url: "https://serviciosportal.reniec.gob.pe/cetdnice/index.htm",
    category: "Identidad",
    logoPath: "https://yt3.googleusercontent.com/SSIV1mUgZFrgz8x-kHIhs0bgJCeoqlg8h8RPgBnX2FzxM2wgSf76NdfXR1Bi727fyMiAes6EHw=s900-c-k-c0x00ffffff-no-rj",
    status: "Operativo"
  },
  {
    id: "eldni-consulta-identidad",
    name: "Consulta DNI Ciudadano",
    description: "Buscador alternativo de datos públicos para verificación rápida de identidad y antecedentes.",
    url: "https://eldni.com/",
    category: "Identidad",
    logoPath: "https://dnipornombres.com/wp-content/uploads/2026/03/cropped-DNI-Peru-Logo.png",
    status: "Operativo"
  },
  // ==========================================
  // CATEGORIA: FINANZAS
  // ==========================================
  {
    id: "sunat-reporte-pagos",
    name: "SUNAT Reporte de Pagos",
    description: "Menú Sol de SUNAT para consultar reportes oficiales de pagos pendientes y tributos obligatorios.",
    url: "https://e-menu.sunat.gob.pe/cl-ti-itmenu/MenuInternet.htm",
    category: "Finanzas",
    logoPath: "https://f.rpp-noticias.io/2015/02/02/1466486.jpg?width=1020&quality=80",
    status: "Operativo"
  },
  {
    id: "sbs-afp-consulta",
    name: "SBS Afiliación AFP o Seguro",
    description: "Redirección directa del portal SBS para consultar tu AFP afiliada, aportes previsionales o vigencia de seguro.",
    url: "https://servicios.sbs.gob.pe/serviciosenlinea/Home/PortalRedirect?idOption=10",
    category: "Finanzas",
    logoPath: "/assets/img/sbs_logo.png",
    status: "Operativo"
  },
  {
    id: "sbs-servicios-linea",
    name: "SBS Servicios en Línea",
    description: "Acceso unificado a los servicios virtuales de la SBS, Reporte de Deudas y Central de Alertas.",
    url: "https://servicios.sbs.gob.pe/serviciosenlinea",
    category: "Finanzas",
    logoPath: "/assets/img/sbs_logo.png",
    status: "Operativo"
  },
  {
    id: "sunat-consulta-ruc",
    name: "SUNAT Consulta RUC",
    description: "Verifica el estado de contribuyente, domicilio fiscal y datos registrales de personas y empresas en Perú.",
    url: "https://e-consultaruc.sunat.gob.pe/cl-ti-itconsruc/FrameCriterioBusquedaWeb.jsp",
    category: "Finanzas",
    logoPath: "https://f.rpp-noticias.io/2015/02/02/1466486.jpg?width=1020&quality=80",
    status: "Operativo"
  },
  // ==========================================
  // CATEGORIA: SALUD
  // ==========================================
  {
    id: "sis-afiliacion-consulta",
    name: "SIS Consulta de Asegurado",
    description: "Plataforma oficial del Seguro Integral de Salud para verificar vigencia y tipo de afiliación.",
    url: "https://cel.sis.gob.pe/SisConsultaEnLinea",
    category: "Salud",
    logoPath: "assets/img/sis_logo.png",
    status: "Operativo"
  },
  {
    id: "essalud-donde-atiendo",
    name: "EsSalud Dónde me Atiendo",
    description: "Verifica la vigencia de tu acreditación en EsSalud y ubica el centro asistencial que te corresponde.",
    url: "https://dondemeatiendo.essalud.gob.pe/#/consulta",
    category: "Salud",
    logoPath: "https://images.seeklogo.com/logo-png/61/1/essalud-actualizado-logo-png_seeklogo-613305.png",
    status: "Operativo"
  },
  {
    id: "essalud-viva-login",
    name: "EsSalud VIVA Acceso",
    description: "Oficina de Aseguramiento Virtual VIVA para consultar si tu seguro EsSalud está activo y al día.",
    url: "https://viva.essalud.gob.pe/viva/login",
    category: "Salud",
    logoPath: "https://images.seeklogo.com/logo-png/61/1/essalud-actualizado-logo-png_seeklogo-613305.png",
    status: "Operativo"
  },
  {
    id: "essalud-viva-consultas",
    name: "EsSalud Trámites y Seguros",
    description: "Consulta de trámites iniciados, solicitudes de lactancia, maternidad y prestaciones económicas.",
    url: "https://apps.essalud.gob.pe/viva-consultas/",
    category: "Salud",
    logoPath: "https://images.seeklogo.com/logo-png/61/1/essalud-actualizado-logo-png_seeklogo-613305.png",
    status: "Operativo"
  },
  // ==========================================
  // CATEGORIA: TRANSPORTE
  // ==========================================
  {
    id: "sunarp-consulta",
    name: "SUNARP Consulta Vehicular",
    description: "Consulta datos básicos del vehículo por placa de forma gratuita.",
    url: "https://www.gob.pe/358-consultar-los-datos-de-un-vehiculo-consulta-vehiculara",
    category: "Transporte",
    logoPath: "/assets/img/sunarp_consulta_vehicular.png",
    status: "Operativo"
  },
  {
    id: "sunarp-dueños-deudas",
    name: "SUNARP Dueños y Deudas",
    description: "Accede al historial de propietarios y gravámenes del vehículo.",
    url: "https://sprl.sunarp.gob.pe/sprl/ingreso",
    category: "Transporte",
    logoPath: "/assets/img/sunarp_dueños_deudas.png",
    status: "Operativo"
  },
  {
    id: "sat-multas-lima",
    name: "SAT Lima Multas",
    description: "Consulta papeletas y multas de tránsito en Lima Metropolitana.",
    url: "https://www.sat.gob.pe/pagosenlinea/",
    category: "Transporte",
    logoPath: "/assets/img/sat_multas.png",
    status: "Operativo"
  },
  {
    id: "sunarp-conoce-aqui",
    name: "SUNARP Conoce Aquí",
    description: "Servicio gratuito para visualizar partidas registrales.",
    url: "https://conoce-aqui.sunarp.gob.pe/conoce-aqui/inicio",
    category: "Transporte",
    logoPath: "/assets/img/sunarp_consulta_vehicular.png",
    status: "Operativo"
  },
  {
    id: "sutran-record-infracciones",
    name: "SUTRAN Récord de Infracciones",
    description: "Consulta el historial de infracciones en carreteras nacionales.",
    url: "https://www.sutran.gob.pe/consultas/record-de-infracciones/record-de-infracciones/",
    category: "Transporte",
    logoPath: "/assets/img/sutran_multas.png",
    status: "Operativo"
  },
  {
    id: "sutran-verifica-infraccion",
    name: "SUTRAN Verifica tu Infracción",
    description: "Valida si tienes infracciones pendientes de pago o notificación.",
    url: "https://www.sutran.gob.pe/consultas/record-de-infracciones/verifica-tu-infraccion/",
    category: "Transporte",
    logoPath: "/assets/img/sutran__multas_verificacion.png",
    status: "Operativo"
  },
  {
    id: "mtc-revision-tecnica",
    name: "CITV Revisión Técnica",
    description: "Consulta la vigencia y el historial de revisiones técnicas del vehículo.",
    url: "https://rec.mtc.gob.pe/Citv/ArConsultaCitv",
    category: "Transporte",
    logoPath: "/assets/img/revision_tecnica.png",
    status: "Operativo"
  },
  {
    id: "atu-multas",
    name: "ATU Multas",
    description: "Consulta sanciones impuestas por la Autoridad de Transporte Urbano.",
    url: "https://pasarela.atu.gob.pe/",
    category: "Transporte",
    logoPath: "/assets/img/atu_multas.png",
    status: "Operativo"
  },
  {
    id: "sat-capturas-rq",
    name: "SAT Capturas y RQ",
    description: "Verifica si el vehículo tiene orden de captura o requisitoria.",
    url: "https://www.sat.gob.pe/VirtualSAT/modulos/Capturas.aspx?mysession=",
    category: "Transporte",
    logoPath: "/assets/img/sat_rq_infracciones.png",
    status: "Operativo"
  },
  {
    id: "sunarp-siguelo-plus",
    name: "SUNARP Síguelo Plus",
    description: "Seguimiento en línea de títulos y solicitudes registrales.",
    url: "https://sigueloplus.sunarp.gob.pe/siguelo/",
    category: "Transporte",
    logoPath: "/assets/img/sigueloPlus_seguimiento_titulos.png",
    status: "Operativo"
  },
  {
    id: "pnp-lunas-oscurecidas",
    name: "PNP Lunas Oscurecidas",
    description: "Consulta el estado de lunas polarizadas ante la Policía Nacional.",
    url: "https://sistemas.policia.gob.pe/consultalunas/ConsultarServicioLunas",
    category: "Transporte",
    logoPath: "/assets/img/pnp_lunas_polarisadas.png",
    status: "Operativo"
  },
  {
    id: "mtc-licencias",
    name: "MTC Récord del Conductor",
    description: "Consulta el historial de puntos y licencias del conductor.",
    url: "https://slcp.mtc.gob.pe/",
    category: "Transporte",
    logoPath: "/assets/img/mtc_consulta_licencias.png",
    status: "Operativo"
  },
  {
    id: "sunarp-servicios-online",
    name: "SUNARP Servicios Online",
    description: "Servicios gratuitos de la SUNARP.",
    url: "https://www.sunarp.gob.pe/serviciosenlinea/portal/servicios-gratuitos.html",
    category: "Transporte",
    logoPath: "https://sprl.sunarp.gob.pe/sprl/assets/img/logo-sunarp0.png",
    status: "Operativo"
  },
  {
    id: "pnp-rq-vehicular",
    name: "PNP Requisitorias Vehiculares",
    description: "Consulta si el vehículo cuenta con denuncias por robo o hurto.",
    url: "https://sistemas1.policia.gob.pe/ConsultaPVR/ConsultarServicio",
    category: "Transporte",
    logoPath: "/assets/img/rq_vehicular.png",
    status: "Operativo"
  },
  {
    id: "pit-fotopapeletas",
    name: "PIT Fotopapeletas",
    description: "Consulta de infracciones de tránsito detectadas por cámaras.",
    url: "http://www.pit.gob.pe/pit2007/EstadoCuentaVelocidad.aspx",
    category: "Transporte",
    logoPath: "/assets/img/pit_fotopapeletas.png",
    status: "Operativo"
  },
  {
    id: "fise-taller-gnv",
    name: "FISE Consulta Taller GNV",
    description: "Busca talleres autorizados para conversión a gas natural.",
    url: "https://fise.minem.gob.pe:23308/consulta-taller/pages/consultaTaller/inicio",
    category: "Transporte",
    logoPath: "/assets/img/revision_tecnica.png",
    status: "Operativo"
  },
  // REGIONALES DE TRANSPORTE
  {
    id: "sat-piura",
    name: "SAT Piura",
    description: "Consulta de papeletas and tributos en la ciudad de Piura.",
    url: "https://satp.gob.pe/sistema-pagos/pasarela",
    category: "Transporte",
    logoPath: "/assets/img/sat_piura_multas.png",
    status: "Operativo"
  },
  {
    id: "sat-chiclayo",
    name: "SAT Chiclayo (SATCH)",
    description: "Consulta de infracciones y deudas en Chiclayo.",
    url: "https://virtualsatch.satch.gob.pe/virtualsatch/record_infracciones/buscar_placa_",
    category: "Transporte",
    logoPath: "/assets/img/sat_chiclayo_multas.png",
    status: "Operativo"
  },
  {
    id: "sat-tacna",
    name: "SAT Tacna",
    description: "Consulta de papeletas de tránsito en la ciudad de Tacna.",
    url: "https://www.munitacna.gob.pe/pagina/sf/servicios/papeletas",
    category: "Transporte",
    logoPath: "/assets/img/sat_tacna_multas.png",
    status: "Operativo"
  },
  {
    id: "sat-chachapoyas",
    name: "SAT Chachapoyas",
    description: "Consulta de infracciones en la Municipalidad de Chachapoyas.",
    url: "https://app.munichachapoyas.gob.pe/servicios/consulta_papeletas/app/papeletas.php",
    category: "Transporte",
    logoPath: "/assets/img/sat_chachapoyas_multas.png",
    status: "Operativo"
  },
  {
    id: "sat-ica",
    name: "SAT Ica",
    description: "Consulta virtual de tributos y multas en el SAT de Ica.",
    url: "https://m.satica.gob.pe/index.html",
    category: "Transporte",
    logoPath: "/assets/img/sat_ica_multas.png",
    status: "Operativo"
  },
  {
    id: "sat-andahuaylas",
    name: "SAT Andahuaylas",
    description: "Consulta de papeletas de tránsito en Andahuaylas.",
    url: "https://muniandahuaylas.gob.pe/consultar-papeleta/",
    category: "Transporte",
    logoPath: "/assets/img/sat_andahuaylas_multas.png",
    status: "Operativo"
  },
  {
    id: "sat-huancayo",
    name: "SAT Huancayo",
    description: "Consulta de infracciones y papeletas en el SAT Huancayo.",
    url: "http://sathuancayo.fortiddns.com:888/VentanillaVirtual/ConsultaPIT.aspx",
    category: "Transporte",
    logoPath: "/assets/img/sat_huancayo_multas.png",
    status: "Operativo"
  },
  {
    id: "sat-arequipa",
    name: "SAT Arequipa",
    description: "Consulta de multas y trámites en la Municipalidad de Arequipa.",
    url: "https://www.muniarequipa.gob.pe/muni-virtual-4/",
    category: "Transporte",
    logoPath: "/assets/img/sat_arequipa_multas.png",
    status: "Operativo"
  },
  {
    id: "sat-cajamarca",
    name: "SAT Cajamarca",
    description: "Consulta de tributos y papeletas en el SAT de Cajamarca.",
    url: "https://www.satcajamarca.gob.pe/#/consultas",
    category: "Transporte",
    logoPath: "/assets/img/sat_cajamarca_multas.png",
    status: "Operativo"
  },
  {
    id: "sat-trujillo",
    name: "SAT Trujillo (SATT)",
    description: "Pagos y consultas en línea en el SAT de Trujillo.",
    url: "https://digital.satt.gob.pe/pagos/account/login",
    category: "Transporte",
    logoPath: "/assets/img/sat_trujillo_multas.png",
    status: "Operativo"
  },
  {
    id: "sat-tarapoto",
    name: "SAT Tarapoto",
    description: "Consulta de papeletas y multas en la ciudad de Tarapoto.",
    url: "https://www.sat-t.gob.pe/#consulta-papeletas",
    category: "Transporte",
    logoPath: "/assets/img/sat_tarapoto_multas.png",
    status: "Operativo"
  },
  {
    id: "sat-huanuco",
    name: "SAT Huánuco",
    description: "Consulta de infracciones en la Municipalidad de Huánuco.",
    url: "https://www.munihuanuco.gob.pe/wp-content/servicios/transportes/gt_papeletas.php",
    category: "Transporte",
    logoPath: "/assets/img/sat_huanuco_multas.png",
    status: "Operativo"
  },
  {
    id: "sat-pucallpa",
    name: "SAT Pucallpa",
    description: "Consulta vehicular y de multas en Coronel Portillo (Pucallpa).",
    url: "http://consultas.municportillo.gob.pe:85/consultaVehiculo/consulta/",
    category: "Transporte",
    logoPath: "/assets/img/sat_pucallpa.png",
    status: "Operativo"
  },
  {
    id: "sat-cusco",
    name: "SAT Cusco",
    description: "Consulta de infracciones de tránsito en la Municipalidad del Cusco.",
    url: "https://cusco.gob.pe/informatica/infracciones",
    category: "Transporte",
    logoPath: "/assets/img/sat_cusco_multas.png",
    status: "Operativo"
  },
  {
    id: "sat-callao",
    name: "Municipalidad del Callao",
    description: "Consulta y pago de papeletas en la Provincia Constitucional del Callao.",
    url: "https://pagopapeletascallao.pe/",
    category: "Transporte",
    logoPath: "/assets/img/muni_callao_multas.png",
    status: "Operativo"
  },
  // SEGUROS Y OTROS DE TRANSPORTE
  {
    id: "sbs-consulta-soat",
    name: "SBS Consulta SOAT",
    description: "Verifica la vigencia del SOAT a través de la SBS.",
    url: "https://servicios.sbs.gob.pe/reportesoat/BusquedaPlaca",
    category: "Transporte",
    logoPath: "/assets/img/sbs_choques_siniestros.png",
    status: "Operativo"
  },
  {
    id: "apeseg-soat",
    name: "APESEG Consulta SOAT",
    description: "Consulta rápida de vigencia de SOAT electrónico y físico.",
    url: "https://www.apeseg.org.pe/consultas-soat/",
    category: "Transporte",
    logoPath: "https://cdacanguro.com/wp-content/uploads/2024/12/SOAT.jpg",
    status: "Operativo"
  },
  {
    id: "aap-placas",
    name: "AAP Placas",
    description: "Consulta el estado de entrega y trámite de tu placa en la AAP.",
    url: "https://www.placas.pe/Public/CheckPlateStatus.aspx",
    category: "Transporte",
    logoPath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_apapSyg0w7Au65ZWyH_c3Ba95Ct3X1Rlwg&s",
    status: "Operativo"
  },
  {
    id: "infogas-deuda",
    name: "INFOGAS Deuda Placa",
    description: "Consulta deudas y financiamientos de conversiones GNV.",
    url: "https://infogas.com.pe/",
    category: "Transporte",
    logoPath: "/assets/img/infogas_deuda_placa.png",
    status: "Operativo"
  },
  {
    id: "aap-oficinas",
    name: "AAP Placas",
    description: "Consulta el estado de entrega y trámite de tu placa en la AAP.",
    url: "https://www.placas.pe/#/home",
    category: "Transporte",
    logoPath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_apapSyg0w7Au65ZWyH_c3Ba95Ct3X1Rlwg&s",
    status: "Operativo"
  },
  //SERVICIOS Y TRÁMITES PAGADOS
  {
    id: "sunarp-tive",
    name: "TIVE Solicita",
    description: "Solicita tu Tarjeta de Identificación Vehicular Electrónica.",
    url: "https://api.whatsapp.com/send?phone=51932477857&text=TIVE.%20Quiero%20tramitar%20la%20TIVE%20(Tarjeta%20de%20Propiedad%20Vehicular)",
    category: "Pago",
    logoPath: "/assets/img/tive.png",
    status: "Operativo"
  },
  {
    id: "reporte-infocorp",
    name: "Reporte Infocorp Equifax",
    description: "Obtén tu reporte crediticio consolidado de Infocorp Equifax.",
    url: "https://api.whatsapp.com/send?phone=51932477857&text=INFOCORP.%20Quiero%20mi%20reporte%20crediticio%20Infocorp%20Equifax",
    category: "Pago",
    logoPath: "/assets/img/infocorp_reporte.png",
    status: "Operativo"
  },
  {
    id: "informe-vehicular",
    name: "Informe Vehicular",
    description: "Historial completo de antecedentes, propietarios, multas y gravámenes del vehículo.",
    url: "https://api.whatsapp.com/send?phone=51932477857&text=Voy%20a%20comprar%20un%20veh%C3%ADculo%20y%20quiero%20que%20Uds.%20Me%20lo%20filtren%20para%20ver%20si%20me%20conviene%20o%20no",
    category: "Pago",
    logoPath: "/assets/img/informe_vehicular.png",
    status: "Operativo"
  },
  {
    id: "copia-certificado-nacimiento",
    name: "Copia Certificado de Nacimiento",
    description: "Obtén una copia certificada de tu partida o acta de nacimiento.",
    url: "https://api.whatsapp.com/send?phone=51992621768&text=Quiero%20obtener%20una%20copia%20de%20mi%20partida%20de%20nacimiento",
    category: "Pago",
    logoPath: "/assets/img/reniec_cert.jpg",
    status: "Operativo"
  },
  {
    id: "copia-certificado-matrimonio",
    name: "Copia Certificado de Matrimonio",
    description: "Solicita una copia certificada de tu acta de matrimonio.",
    url: "https://api.whatsapp.com/send?phone=51992621768&text=Quiero%20obtener%20una%20copia%20certificada%20de%20mi%20acta%20de%20matrimonio",
    category: "Pago",
    logoPath: "/assets/img/reniec_cert.jpg",
    status: "Operativo"
  },
  {
    id: "copia-certificado-defuncion",
    name: "Copia Certificado de Defunción",
    description: "Obtén una copia certificada del certificado de defunción.",
    url: "https://api.whatsapp.com/send?phone=51992621768&text=Solicito%20copia%20certificada%20de%20un%20acta%20de%20defunci%C3%B3n",
    category: "Pago",
    logoPath: "/assets/img/reniec_cert.jpg",
    status: "Operativo"
  }
];

function ServiceCard({ service }) {
  const [imgError, setImgError] = useState(false);
  return /* @__PURE__ */ jsxs(
    motion.a,
    {
      href: service.url,
      target: "_blank",
      rel: "noopener noreferrer",
      layout: true,
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      whileHover: { y: -8 },
      className: "flex flex-col group cursor-pointer",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative aspect-video w-full glass-panel rounded-3xl overflow-hidden border border-white/10 group-hover:border-primary/50 transition-all duration-500 shadow-2xl", children: [
          !imgError ? service.id.includes("migraciones") || service.id.includes("eldni") || service.id === "sunarp-servicios-online" || service.id === "sunarp-tive" || service.id === "sat-callao" || service.id === "reporte-infocorp" || service.id === "infogas-deuda" || service.id === "informe-vehicular" ? (
            // Centered and fit (Migraciones gets transparent, Infocorp gets red, Infogas gets #003F72 blue, others get white)
            /* @__PURE__ */ jsx("div", { className: `w-full h-full flex items-center justify-center p-4 relative ${service.id.includes("migraciones") ? "" : service.id === "reporte-infocorp" ? "bg-red-600" : service.id === "infogas-deuda" ? "bg-[#003F72]" : "bg-white"}`, children: /* @__PURE__ */ jsx(
              "img",
              {
                src: service.logoPath,
                alt: service.name,
                className: "max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500",
                onError: () => setImgError(true)
              }
            ) })
          ) : (
            // Full-bleed cover (SBS except SBS Consulta SOAT gets bg-white, SATs, SUNARPs, FISE, ATU, CITV, SUTRAN get #003F72 blue, all others transparent)
            /* @__PURE__ */ jsx(
              "img",
              {
                src: service.logoPath,
                alt: service.name,
                className: `w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${service.id.includes("sbs") && service.id !== "sbs-consulta-soat" ? "bg-white" : service.id.startsWith("sat-") || service.id.includes("sunarp") || service.id.includes("fise") || service.id.includes("gnv") || service.id.includes("atu") || service.id.includes("citv") || service.id.includes("revision-tecnica") || service.id.includes("sutran") ? "bg-[#003F72]" : ""}`,
                onError: () => setImgError(true)
              }
            )
          ) : /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center h-full text-zinc-800", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-12 h-12 opacity-10" }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5", children: /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { y: 20, opacity: 0 },
              whileHover: { y: 0, opacity: 1 },
              transition: { duration: 0.3 },
              className: "space-y-2",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest", children: [
                  /* @__PURE__ */ jsx(Info, { className: "w-3 h-3" }),
                  "Información"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-white text-xs leading-relaxed font-medium line-clamp-3", children: service.description }),
                /* @__PURE__ */ jsxs("div", { className: "pt-2 flex items-center gap-2 text-[10px] font-bold text-zinc-400", children: [
                  /* @__PURE__ */ jsx("span", { children: "Click para ir al portal" }),
                  /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" })
                ] })
              ]
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-3 right-3 z-10", children: service.status === "Mantenimiento" && /* @__PURE__ */ jsx("div", { className: "bg-yellow-500/90 backdrop-blur-md text-black p-1.5 rounded-lg shadow-xl", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4" }) }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-3 left-3 z-10 group-hover:opacity-0 transition-opacity", children: /* @__PURE__ */ jsx("span", { className: "px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-bold uppercase tracking-widest text-zinc-300", children: service.category }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 px-2 text-center", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-[11px] font-black text-zinc-400 group-hover:text-white transition-colors uppercase tracking-widest leading-tight", children: service.name }),
          /* @__PURE__ */ jsx("div", { className: "w-0 h-0.5 bg-primary mx-auto mt-2 group-hover:w-12 transition-all duration-300 rounded-full" })
        ] })
      ]
    }
  );
}

function ServiceDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const filteredServices = useMemo(() => {
    return SERVICES.filter((service) => {
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || service.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);
  const categories = [
    { id: "All", name: "Todos los Servicios", icon: Grid },
    { id: "Identidad", name: "Identidad y Ciudadanía", icon: UserCheck },
    { id: "Finanzas", name: "Finanzas e Impuestos", icon: DollarSign },
    { id: "Salud", name: "Salud y Seguro", icon: Activity },
    { id: "Transporte", name: "Transporte y Vehículos", icon: Car },
    { id: "Pago", name: "Servicios de Pago", icon: CreditCard }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-zinc-100 flex items-center gap-2", children: [
          "Directorio Unificado",
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-widest", children: [
            SERVICES.length,
            " Servicios"
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500 font-body-md", children: "Acceso directo y simplificado a consultas oficiales del Estado Peruano." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxs("div", { className: "relative flex-1 md:w-64 group", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Buscar servicio o entidad...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide", children: categories.map((cat) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setActiveCategory(cat.id),
        className: `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${activeCategory === cat.id ? "bg-primary text-white shadow-lg shadow-primary/20 border-primary" : "bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-zinc-200 border-white/5"}`,
        children: [
          /* @__PURE__ */ jsx(cat.icon, { className: "w-4.5 h-4.5" }),
          cat.name
        ]
      },
      cat.id
    )) }),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        layout: true,
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
        children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "popLayout", children: filteredServices.map((service) => /* @__PURE__ */ jsx(ServiceCard, { service }, service.id)) })
      }
    ),
    filteredServices.length === 0 && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "py-20 text-center glass-panel rounded-3xl",
        children: [
          /* @__PURE__ */ jsx(Search, { className: "w-12 h-12 text-zinc-800 mx-auto mb-4" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-zinc-400", children: "No se encontraron servicios" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-600 font-body-md", children: "Intenta con otros términos o cambia de categoría." }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setSearchQuery("");
                setActiveCategory("All");
              },
              className: "mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-primary text-sm font-bold rounded-xl transition-all border border-white/5",
              children: "Limpiar filtros"
            }
          )
        ]
      }
    )
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Portal de Inteligencia" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-12 pb-20"> <!-- Welcome Header --> <header class="flex flex-col md:flex-row md:items-end justify-between gap-6"> <div> <h1 class="text-3xl font-black text-white tracking-tight sm:text-4xl">
Portal de <span class="text-primary">Servicios</span> Perú
</h1> <p class="text-zinc-500 mt-2 font-medium max-w-2xl">
Bienvenido al centro de consultas ciudadanas unificado. Centralizamos accesos rápidos a consultas de identidad, impuestos, salud y transporte en un solo lugar.
</p> </div> </header> <!-- Main Search Section --> <section> ${renderComponent($$result2, "AdvancedSearch", AdvancedSearch, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/PROYECTOS/govcheck/src/components/dashboard/AdvancedSearch", "client:component-export": "AdvancedSearch" })} </section> <!-- Service Directory Section --> <section> ${renderComponent($$result2, "ServiceDirectory", ServiceDirectory, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/PROYECTOS/govcheck/src/components/dashboard/ServiceDirectory", "client:component-export": "ServiceDirectory" })} </section> </div> ` })}`;
}, "C:/PROYECTOS/govcheck/src/pages/index.astro", void 0);

const $$file = "C:/PROYECTOS/govcheck/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
