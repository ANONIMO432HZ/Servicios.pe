<div align="center">

# 🛡️ GovCheck

  **Plataforma Centralizada de Consulta Ciudadana e Institucional del Perú**

  [![Astro](https://img.shields.io/badge/Astro-6.3-FF5D01?style=flat-square&logo=astro)](https://astro.build/)
  [![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
</div>

---

## 📋 Resumen

**GovCheck** es una aplicación web experimental y didáctica diseñada para la demostración de integraciones avanzadas de interfaces interactivas y consumo de servicios públicos de consulta peruanos en tiempo real.

Permite centralizar en una única y atractiva interfaz de usuario la búsqueda avanzada y consolidada de personas y vehículos mediante **DNI**, **RUC** o **Placa Vehicular**, integrando proveedores públicos de API (como eldni.com) y simulando la deducción de créditos en un plan premium de demostración.

### Entidades y Consultas Soportadas

| Entidad | Consulta | Proveedor |
| :--- | :--- | :--- |
| **RENIEC (Identidad)** | Consulta de DNI Ciudadano y Ubigeo | eldni/json.pe |
| **SUNAT (Tributario)** | Consulta RUC, Nombres por RUC 10 y Deuda Coactiva | json.pe |
| **MTC (Transporte)** | Consulta de Licencia de Conducir por DNI | json.pe |
| **SUNARP (Vehicular)** | Datos de propiedad y especificaciones por Placa | json.pe |
| **SOAT (Seguridad)** | Vigencia de SOAT y aseguradora por Placa | json.pe |
| **RUC (Tributario)** | Consulta de RUC y Razón Social | json.pe |

---

## 🚀 Inicio Rápido en Desarrollo

Levantá el entorno de desarrollo local de manera rápida siguiendo estos pasos:

### Prerrequisitos

- **Node.js** (v20 o superior recomendado)
- **npm** o tu gestor de paquetes favorito

### Instalación y Ejecución

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/TU_USUARIO/govcheck.git
   cd govcheck
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar el entorno:**
   Crea tu archivo local de variables de entorno copiando la plantilla:

   ```bash
   cp .env.example .env.local
   ```

   *Nota: Asegurate de ingresar tu `GEMINI_API_KEY` para habilitar el análisis cognitivo por IA.*

4. **Iniciar el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

El servidor local se iniciará y estará disponible en [http://localhost:4321](http://localhost:4321).

---

## 🔐 Modelos de Acceso y Límites (Rate Limiting)

La aplicación soporta dos tipos de sesiones independientes administradas mediante cookies HTTP-Only:

### 👤 1. Modo Invitado (Guest)

- **Acceso:** Por defecto al ingresar al portal sin credenciales.

- **Permisos:** Navegación libre en modo lectura a través del Portal (`/`) y del Historial de Búsquedas (`/history`).
- **Restricción:** La Consola de API (`/console`) y las búsquedas globales están restringidas estructuralmente. Realizar una búsqueda disparará un modal dinámico invitando a probar la demo premium.
- **Rate Limit del Servidor:** Limitado estrictamente a **5 consultas por hora** con un intervalo mínimo de **10 segundos** entre consultas consecutivas para resguardar la API pública.

### 🔑 2. Modo Administrador (Demo Premium)

- **Acceso:** Autologueo instantáneo mediante el botón *"Iniciar Sesión con Demo"* (o yendo a `/login?autologin=true`), el cual configura el token de sesión de manera automática.

- **Permisos:** Acceso completo e ilimitado a todas las herramientas interactivas, incluyendo la Consola API interactiva, selección de proveedores (Eldni / JSON.pe), historial detallado y recarga simulada de créditos.
- **Credenciales de Prueba:**
  - **Usuario:** `admin`
  - **Contraseña:** `admin123`

---

## 🛠️ Stack Tecnológico

- **Core & Routing:** [Astro 6 (SSR)](https://astro.build/) con adaptador standalone para Node.
- **Componentes de UI e Interacción:** [React 19](https://react.dev/) hidratado del lado del cliente (`client:load`).
- **Estilos y Layout:** [Tailwind CSS 4](https://tailwindcss.com/) + Vanilla CSS moderno con glassmorphism, gradientes HSL curados y transiciones fluidas.
- **Animaciones:** [Motion](https://motion.dev/) para transiciones e hidratación de modales fluidos.
- **Iconografía:** [Lucide React](https://lucide.dev/) para iconos de alta definición y consistencia visual.

---

## 📁 Estructura del Proyecto

```text
govcheck/
├── src/
│   ├── components/      # Componentes interactivos de React (Navbar, Consola, AdvancedSearch)
│   ├── hooks/           # Hooks de React para el ciclo de vida de búsquedas de la API
│   ├── layouts/         # Layouts base de Astro (.astro)
│   ├── lib/             # Lógica de negocio (api-client, api-auth, servicios)
│   ├── pages/           # Rutas del sitio y endpoints de la API en Astro (.astro, .ts)
│   └── styles/          # Hojas de estilo y personalización global (Tailwind v4)
├── public/              # Activos y recursos estáticos (imágenes, logos)
├── astro.config.mjs     # Configuración del motor Astro 6
└── tsconfig.json        # Configuración de compilación TypeScript
```

---

## 📜 Términos y Responsabilidad

Esta aplicación web es un **proyecto experimental y didáctico** desarrollado enteramente de forma altruista y educativa para facilitar el acceso unificado a herramientas públicas útiles.

- El desarrollador **no recopila, almacena ni transmite** datos personales de las consultas (las cookies y el historial se gestionan exclusivamente en el almacenamiento local del dispositivo del usuario).
- El autor **no se responsabiliza** por la exactitud de los datos recuperados a través de las APIs externas de eldni.com o de los comportamientos de la interfaz en red.

---
