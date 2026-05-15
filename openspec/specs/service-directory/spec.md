# Service Directory Specification

## Purpose

Proporcionar un acceso centralizado y categorizado a servicios externos gubernamentales y privados relacionados con la verificación vehicular.

## Requirements

### Requirement: Categorized Layout
El sistema DEBE organizar los servicios en al menos tres categorías: Nacional, Regional/Local y Seguros/Otros.

#### Scenario: Visualizar categorías
- GIVEN el usuario está en el dashboard
- WHEN el sistema carga el directorio de servicios
- THEN el usuario DEBE ver secciones claramente diferenciadas por categoría.

### Requirement: Service Cards
Cada servicio DEBE representarse mediante una tarjeta interactiva que incluya el logo institucional, nombre del servicio y una breve descripción.

#### Scenario: Interactuar con una tarjeta
- GIVEN el usuario ve una tarjeta de servicio (ej. SUNARP)
- WHEN el usuario hace clic en la tarjeta
- THEN el sistema DEBE abrir el enlace correspondiente en una nueva pestaña
- AND DEBE mostrar una animación de "hover" reactiva.

### Requirement: Service Filtering
El sistema DEBE permitir filtrar o buscar servicios dentro del directorio en tiempo real.

#### Scenario: Filtrar por nombre
- GIVEN el usuario está en el directorio
- WHEN el usuario escribe "SAT" en el buscador del directorio
- THEN el sistema DEBE ocultar las tarjetas que no coincidan con el término.
