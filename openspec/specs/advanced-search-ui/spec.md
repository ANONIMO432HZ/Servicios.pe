# Advanced Search UI Specification

## Purpose

Definir la interfaz de búsqueda de vehículos (Placa/VIN) priorizando la velocidad, claridad y una estética premium.

## Requirements

### Requirement: Global Search Bar
El sistema DEBE presentar una barra de búsqueda prominente capaz de procesar números de placa (formato Peruano) y números VIN.

#### Scenario: Búsqueda por placa
- GIVEN el usuario está en el dashboard
- WHEN ingresa una placa válida (ej. ABC-123) y presiona Enter
- THEN el sistema DEBE iniciar el proceso de búsqueda con una animación de carga.

### Requirement: Progressive Result Loading
El sistema DEBE mostrar el progreso de la consulta a las diferentes fuentes de datos de manera secuencial y animada.

#### Scenario: Visualizar progreso de fuentes
- GIVEN una búsqueda en curso
- WHEN el sistema consulta a SUNARP, SAT y SUTRAN
- THEN el usuario DEBE ver indicadores de estado (Loading, Success, Error) para cada fuente individualmente.

### Requirement: Premium Report Layout
El resultado final DEBE presentarse como un reporte estructurado con estética Glassmorphism, destacando alertas críticas en rojo.

#### Scenario: Ver reporte con alerta
- GIVEN una búsqueda que retorna una requisitoria de la PNP
- WHEN se completa la carga del reporte
- THEN el sistema DEBE resaltar la sección de la PNP con un fondo rojo translúcido y un icono de advertencia.
