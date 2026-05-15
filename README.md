<div align="center">
  <img width="1200" height="475" alt="GovCheck Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  # 🛡️ GovCheck
  **Plataforma Centralizada de Consulta Vehicular Institucional**

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
</div>

---

## 📋 Resumen

GovCheck es una herramienta diseñada para personal autorizado que permite realizar búsquedas rápidas y centralizadas de vehículos mediante **Placa** o **VIN**. Integra datos en tiempo real de múltiples entidades gubernamentales para proporcionar un reporte unificado de seguridad y estado legal.

### Entidades Integradas
| Entidad | Información Proporcionada | Estado |
| :--- | :--- | :--- |
| **SUNARP** | Registro de propiedad y datos del propietario | ✅ Operativo |
| **SUTRAN** | Infracciones de tránsito y transporte | ✅ Operativo |
| **SAT** | Papeletas de infracción y órdenes de captura | ⚠️ Mantenimiento |
| **PNP** | Requisitorias y denuncias por robo | ✅ Operativo |

---

## 🚀 Inicio Rápido

Sigue estos pasos para levantar el entorno de desarrollo localmente:

### Prerrequisitos
- **Node.js** (v18 o superior)
- **npm** o **pnpm**

### Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/TU_USUARIO/govcheck.git
    cd govcheck
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto y añade tus credenciales:
    ```bash
    cp .env.example .env.local
    ```
    *Nota: Asegúrate de configurar la `GEMINI_API_KEY` si planeas usar las funciones de análisis por IA.*

4.  **Iniciar servidor de desarrollo:**
    ```bash
    npm run dev
    ```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Tecnologías

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Animaciones:** [Motion (Framer Motion)](https://motion.dev/)
- **IA:** [Google Gemini API](https://ai.google.dev/)

---

## 📁 Estructura del Proyecto

```text
govcheck/
├── app/             # Rutas y lógica de la aplicación (App Router)
├── components/      # Componentes de UI reutilizables
├── hooks/           # Hooks personalizados para lógica de búsqueda
├── lib/             # Utilidades y configuración de datos
├── public/          # Activos estáticos (imágenes, logos)
└── styles/          # Configuraciones globales de CSS
```

---

## 🔐 Seguridad y Privacidad

Esta plataforma está destinada exclusivamente para uso institucional. Los datos consultados son procesados de acuerdo a las normativas vigentes de protección de datos personales.

---

<div align="center">
  <p>Desarrollado con ❤️ para la eficiencia en el sector público.</p>
</div>
