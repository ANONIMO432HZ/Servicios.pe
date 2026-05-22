# Delta for Advanced Search UI

## ADDED Requirements

### Requirement: Responsive Report Views
El sistema MUST adaptar la visualización de los reportes (Vehicular, Identidad, Empresa) para evitar desbordamientos en pantallas pequeñas, priorizando la legibilidad.

#### Scenario: Reporte Vehicular en móvil
- GIVEN un reporte vehicular cargado exitosamente
- WHEN el ancho de pantalla es < 640px
- THEN el grid de información principal DEBE colapsar a una sola columna.
- AND los botones de copiado DEBEN ser accesibles y no desbordar el contenedor.

#### Scenario: Modales responsivos
- GIVEN la apertura de un modal (Configuración, Invitado)
- WHEN se visualiza en cualquier dispositivo
- THEN el modal DEBE ocupar un máximo del 100% del ancho menos márgenes de seguridad (p. ej., max-w-md y mx-4).
- AND el contenido DEBE ser desplazable verticalmente si excede la altura de la pantalla.
