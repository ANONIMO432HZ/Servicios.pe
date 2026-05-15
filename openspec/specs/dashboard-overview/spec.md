# Dashboard Overview Specification

## Purpose

Establecer la estructura general del panel de control institucional, equilibrando métricas clave con accesos directos.

## Requirements

### Requirement: Unified Header
El sistema DEBE poseer un header persistente que incluya el buscador rápido, estado de conexión a las APIs y perfil de usuario.

#### Scenario: Visualizar header
- GIVEN cualquier página del dashboard
- WHEN el usuario navega
- THEN el header DEBE permanecer visible con el buscador siempre listo.

### Requirement: Key Performance Metrics
El sistema DEBE mostrar tarjetas de métricas (Consultas, Alertas, Reportes) con animaciones de entrada.

#### Scenario: Carga inicial de métricas
- GIVEN el dashboard se carga por primera vez
- WHEN la página se renderiza
- THEN las tarjetas de métricas DEBEN aparecer con un efecto de "fade-in" y "slide-up".

### Requirement: Responsive Grid Layout
La interfaz DEBE ser completamente responsiva, adaptando el número de columnas del directorio y métricas según el dispositivo.

#### Scenario: Ver en dispositivo móvil
- GIVEN un ancho de pantalla < 640px
- WHEN se visualiza el dashboard
- THEN el directorio de servicios DEBE mostrarse en una sola columna con desplazamiento vertical.
