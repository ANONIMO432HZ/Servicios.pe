# Dashboard Overview Specification

## Purpose

Establecer la estructura general del panel de control institucional, equilibrando métricas clave con accesos directos.

## Requirements

### Requirement: Unified Header
El sistema DEBE poseer un header persistente que incluya el buscador rápido, estado de conexión a las APIs, perfil de usuario y un activador de menú lateral para dispositivos móviles.

#### Scenario: Visualizar header con menú móvil
- GIVEN un dispositivo móvil (< 768px)
- WHEN se carga el dashboard
- THEN el header DEBE mostrar un botón de menú (hamburger) a la izquierda del logo.

#### Scenario: Alternar Sidebar
- GIVEN un dispositivo móvil
- WHEN el usuario presiona el botón de menú
- THEN el Sidebar DEBE aparecer desde la izquierda con una transición suave.

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
 la izquierda.
- AND el contenido principal DEBE ajustarse al espacio restante.
