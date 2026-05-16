# Plan de Migración: Astro (SEO + React)

Este plan se enfoca en obtener el **máximo rendimiento en SEO** manteniendo la base de componentes React que ya construimos.

## Ventajas

- **SEO Imbatible:** Generación de HTML estático por defecto.
- **Arquitectura de Islas:** Solo enviamos el JS necesario para las partes interactivas (como el buscador).
- **Compatibilidad:** Podemos reutilizar los componentes de `Dashboard`, `ServiceCard`, etc.
- **Velocidad de Desarrollo:** Usa Vite, por lo que el arranque es instantáneo.

## Desventajas

- **Mezcla de sintaxis:** Tendrás archivos `.astro` (para la estructura) y `.tsx` (para la lógica).
- **Curva de aprendizaje:** Entender cómo pasar datos entre islas de React.

## Plan de Ejecución

1. **Inicialización:** `npm create astro@latest`.
2. **Integración:** Añadir el adapter de React `npx astro add react`.
3. **Migración de Assets:** Mover la carpeta `public/ASSETS` tal cual.
4. **Migración de Componentes:**
   - Copiar `components/*` y `lib/services-data.ts`.
   - Crear el layout principal en `src/layouts/Layout.astro`.
5. **Implementación de Islas:** Usar la directiva `client:load` en el componente `AdvancedSearch` para mantener su funcionalidad reactiva.
6. **Rutas de API:** Migrar los endpoints de `app/api/` a `src/pages/api/` (Astro soporta API routes nativas).
