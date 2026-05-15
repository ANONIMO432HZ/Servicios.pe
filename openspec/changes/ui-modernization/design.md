# Design: Modernización UI y Portal de Inteligencia Vehicular

## Technical Approach

La modernización se basará en implementar un diseño *Dark Mode* profundo con efectos de *Glassmorphism* usando Tailwind CSS 4. Reemplazaremos el Dashboard estándar por un Layout tipo "Portal" que centralice los más de 40 enlaces institucionales en un directorio interactivo.

Utilizaremos Framer Motion para asegurar que las interacciones (como la búsqueda y el filtrado del directorio) se sientan fluidas y de alta gama.

## Architecture Decisions

### Decision: Adopción nativa de Dark Mode con Tailwind 4
**Choice**: Convertir el esquema de colores a Dark Mode profundo (fondos `#0a0a0a` a `#121212`) e implementar utilidades `backdrop-blur-*` para las tarjetas.
**Alternatives considered**: Mantener el Light Mode actual o forzar modo dual (Light/Dark).
**Rationale**: El usuario solicitó explícitamente una estética "premium". El dark mode con transparencias (glassmorphism) es el estándar actual para dashboards de alto nivel (como Vercel, Linear). Un modo único simplifica el desarrollo y garantiza la máxima calidad visual.

### Decision: Gestión del Directorio de Servicios
**Choice**: Crear un archivo de configuración estático (`lib/services-directory.ts`) con la metadata de los +40 enlaces y usar `next/image` para los logos de `/ASSETS`.
**Alternatives considered**: Cargar desde una API remota o base de datos.
**Rationale**: Los enlaces (como los de SUNARP, SUTRAN, Municipalidades) son estáticos y cambian rara vez. Definirlos en el código cliente mejora drásticamente el rendimiento y permite un filtrado instantáneo sin latencia de red.

### Decision: Componentización del UI
**Choice**: Extraer el directorio y el buscador avanzado a componentes de cliente (`"use client"`) dentro de `components/dashboard/`.
**Alternatives considered**: Mantener todo en `app/(dashboard)/page.tsx` como Server Components.
**Rationale**: El filtrado en tiempo real y las animaciones de Framer Motion requieren estado y ciclo de vida de React en el cliente.

## Data Flow

```ascii
Usuario ──> Header (Buscador Global) ──> Ejecuta useVehicleSearch()
  │                                           │
  └───> Filtra Directorio (Input)             v
  │        │                             Reporte Animado
  │        v
  └───> Visualiza ServiceDirectory ──> Click en Tarjeta ──> Abre Link Externo
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `app/globals.css` | Modify | Reemplazar variables `--color-*` por la paleta Dark Mode Premium y utilidades Glassmorphism. |
| `tailwind.config.ts` | Modify | (Si es necesario) Configurar paths de assets o extender colores. |
| `app/(dashboard)/page.tsx` | Modify | Reestructurar como contenedor principal (Server Component) para el nuevo diseño. |
| `app/(dashboard)/layout.tsx` | Modify | Actualizar color de fondo y diseño del header. |
| `components/layout/Navbar.tsx`| Modify | Integrar barra de búsqueda prominente en el header. |
| `components/dashboard/ServiceDirectory.tsx` | Create | Componente de cliente con input de filtrado y grid interactivo. |
| `components/dashboard/ServiceCard.tsx` | Create | Componente para cada enlace externo con animación hover (Motion). |
| `components/dashboard/AdvancedSearch.tsx` | Create | Interfaz de resultados con carga progresiva. |
| `lib/services-data.ts` | Create | Estructura de datos categorizada de los enlaces en `Enlaces.txt`. |

## Interfaces / Contracts

```typescript
export type ServiceCategory = 'Nacional' | 'Regional' | 'Seguros' | 'Otros';

export interface ServiceLink {
  id: string;
  name: string;
  description: string;
  url: string;
  category: ServiceCategory;
  logoPath: string; // Ruta relativa a /ASSETS/
  status?: 'Operativo' | 'Mantenimiento';
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Filtrado de `ServiceDirectory` | Verificar que el input de búsqueda filtra correctamente el array estático. |
| UI/UX | Componente `ServiceCard` | Visualización correcta de la imagen fallback si `logoPath` falla. |
| E2E | Flujo de Búsqueda | Simular búsqueda de placa y verificar renderizado del `AdvancedSearch` report. |

## Migration / Rollout

No migration required. Los datos son estáticos (hardcoded) o simulados mediante hooks.

## Open Questions

- [ ] ¿Los assets (imágenes) en `ASSETS` tienen nombres consistentes para poder mapearlos fácilmente en `services-data.ts` o debo renombrarlos manualmente?
- [ ] ¿Mantenemos la barra lateral (Sidebar) actual o pasamos a una navegación puramente superior (Topnav) para maximizar el espacio del dashboard?
