# Proposal: Modernización UI y Portal de Inteligencia Vehicular

## Intent

Transformar el dashboard básico de GovCheck en un portal premium y centralizado que integre visualmente todos los accesos gubernamentales (SUNARP, SUTRAN, SAT, etc.) bajo una estética de alta gama (Glassmorphism + Dark Mode), superando la experiencia actual de Google Sites.

## Scope

### In Scope
- Implementación de un nuevo Layout con estética Glassmorphism.
- Creación de un Directorio Inteligente de Servicios categorizado (Nacional, Regional, Seguros).
- Integración de los 40+ enlaces de `Enlaces.txt` con sus respectivos iconos de `ASSETS`.
- Animaciones fluidas con Motion para la interacción con las tarjetas de servicio.
- Buscador omnipotente persistente en el header.

### Out of Scope
- Implementación de web scraping real para automatizar las consultas externas (se mantiene el redireccionamiento).
- Sistema de gestión de usuarios complejo (se mantiene el mock actual).

## Capabilities

### New Capabilities
- `service-directory`: Directorio categorizado de servicios externos con filtrado rápido.
- `advanced-search-ui`: UI de búsqueda avanzada con estados de carga animados y visualización de resultados tipo "Reporte Premium".

### Modified Capabilities
- `dashboard-overview`: El dashboard principal ahora prioriza el acceso a servicios y métricas clave en un solo vistazo.

## Approach

Se implementará un sistema de diseño basado en Tailwind CSS 4 con utilidades personalizadas para efectos de desenfoque (backdrop-blur) y gradientes profundos. Se utilizarán los componentes de `lucide-react` combinados con los assets locales para crear tarjetas de servicio interactivas. La arquitectura se mantendrá en Next.js App Router, optimizando la carga de imágenes con `next/image`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/(dashboard)/page.tsx` | Modified | Reestructuración total del dashboard. |
| `app/globals.css` | Modified | Nuevas variables de diseño y clases utilitarias de Glassmorphism. |
| `components/layout/Navbar.tsx` | Modified | Inclusión del buscador rápido y rediseño visual. |
| `components/dashboard/` | New | Nuevos componentes de tarjetas de servicio y grids. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Carga lenta por exceso de imágenes | Medium | Usar `next/image` con optimización y placeholders. |
| Saturación visual | High | Uso de espacios en blanco (aire) y categorización clara. |

## Rollback Plan

Revertir cambios vía Git (`git checkout main`) o restaurar los componentes originales desde el historial de commits.

## Success Criteria

- [ ] Integración completa de todos los enlaces de `Enlaces.txt`.
- [ ] UI consistente con el estilo Glassmorphism (verificado por captura).
- [ ] Navegación fluida entre categorías de servicios ( < 100ms de latencia visual).
