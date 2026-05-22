# Delta for Dashboard Overview

## MODIFIED Requirements

### Requirement: Unified Header
El sistema DEBE poseer un header persistente que incluya el buscador rápido, estado de conexión a las APIs, perfil de usuario y un activador de menú lateral para dispositivos móviles.
(Previously: El sistema DEBE poseer un header persistente que incluya el buscador rápido, estado de conexión a las APIs y perfil de usuario.)

#### Scenario: Visualizar header con menú móvil
- GIVEN un dispositivo móvil (< 768px)
- WHEN se carga el dashboard
- THEN el header DEBE mostrar un botón de menú (hamburger) a la izquierda del logo.

#### Scenario: Alternar Sidebar
- GIVEN un dispositivo móvil
- WHEN el usuario presiona el botón de menú
- THEN el Sidebar DEBE aparecer desde la izquierda con una transición suave.

### Requirement: Responsive Grid Layout
La interfaz DEBE ser completamente responsiva, adaptando el número de columnas del directorio, métricas y el comportamiento del Sidebar según el dispositivo.
(Previously: La interfaz DEBE ser completamente responsiva, adaptando el número de columnas del directorio y métricas según el dispositivo.)

#### Scenario: Ver en dispositivo móvil
- GIVEN un ancho de pantalla < 768px
- WHEN se visualiza el dashboard
- THEN el Sidebar DEBE ocultarse por defecto y superponerse al contenido cuando se activa.
- AND el directorio de servicios DEBE mostrarse en una sola columna con desplazamiento vertical.

#### Scenario: Ver en tablet/desktop
- GIVEN un ancho de pantalla >= 768px
- WHEN se visualiza el dashboard
- THEN el Sidebar DEBE permanecer visible y fijo a la izquierda.
- AND el contenido principal DEBE ajustarse al espacio restante.
