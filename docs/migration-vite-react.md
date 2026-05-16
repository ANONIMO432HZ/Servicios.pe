# Plan de Migración: Vite + React (Fluidez Inmediata)

Este es el camino de **menor resistencia**. Eliminamos la pesadez de Next.js pero nos quedamos con todo nuestro ecosistema React.

## Ventajas

- **Costo Cero:** Es básicamente copiar y pegar tus archivos actuales.
- **DX Instantánea:** El servidor de desarrollo levanta en menos de 1 segundo.
- **Control Total:** Sin las restricciones de archivos y convenciones de Next.js.
- **Liviano:** Ideal para dashboards privados o herramientas internas.

## Desventajas

- **SEO Manual:** Al ser una SPA (Single Page Application), el SEO requiere más mimos (como usar `react-helmet` y pre-renderizado si es necesario).
- **Sin SSR nativo:** Pierdes los Server Components de Next.js (aunque para este proyecto no los estamos exprimiendo al máximo).

## Plan de Ejecución

1. **Inicialización:** `npm create vite@latest . -- --template react-ts`.
2. **Migración Directa:**
   - Mover `components/`, `hooks/`, `lib/` y `public/`.
   - Instalar dependencias: Tailwind 4, Framer Motion, Lucide.
3. **Ruteo:** Instalar `react-router-dom` para manejar la navegación que antes hacía Next.js.
4. **APIs:** Como Vite no tiene servidor de API integrado, deberás usar un Proxy en desarrollo o levantar un pequeño servidor Express/Fastify para los endpoints de búsqueda.
