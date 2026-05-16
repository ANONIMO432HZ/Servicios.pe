# Plan de Migración: SvelteKit (Performance Pura)

Este plan busca la **excelencia técnica absoluta** sacrificando la compatibilidad con el código actual para ganar velocidad y peso mínimo.

## Ventajas

- **Sin Virtual DOM:** Cambios quirúrgicos en el DOM que hacen que la web sea un rayo.
- **Peso Pluma:** El bundle final es significativamente más chico que el de React.
- **Sintaxis limpia:** Menos boilerplate que React; más parecido al HTML/JS estándar.
- **SEO Nativo:** SSR y generación estática de primer nivel.

## Desventajas

- **REESCRITURA TOTAL:** No podemos reusar nada del JSX. Hay que traducir todo a `.svelte`.
- **Ecosistema menor:** Si necesitás una librería muy específica de React, tendrás que buscar una alternativa en Svelte.

## Plan de Ejecución

1. **Inicialización:** `npm create svelte@latest`.
2. **Traducción de Estilos:** Copiar la configuración de Tailwind 4 (ahora mucho más simple en SvelteKit).
3. **Reescritura de Lógica:**
   - Traducir `useVehicleSearch.ts` a un `store` de Svelte o lógica reactiva nativa (`$state` en Svelte 5).
   - Traducir componentes de UI (Navbar, Cards, etc.).
4. **Migración de APIs:** Usar los `+server.ts` de SvelteKit para las consultas de SOAT/Placa.
5. **Animaciones:** Reemplazar Framer Motion por las transiciones nativas de Svelte (que son hermosas y livianas).
