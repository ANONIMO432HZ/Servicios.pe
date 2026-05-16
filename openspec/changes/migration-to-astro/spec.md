# Specification: Astro Migration

## Requirements

### R1: UI Fidelity

- Maintain the premium Dark Mode and Glassmorphism aesthetic.
- Preserve all animations built with Framer Motion (Motion).
- Ensure responsiveness across mobile and desktop.

### R2: Functional Parity

- **Vehicular Search:** Multi-source lookup (Plate + SOAT) must work concurrently.
- **Service Directory:** Real-time filtering of 60+ links must remain instant.
- **Integrations:** API connections to `api.json.pe` must be preserved.

### R3: Performance (Target)

- **Lighthouse Performance:** > 95/100.
- **Lighthouse SEO:** 100/100.
- **TBT (Total Blocking Time):** < 100ms.

## User Scenarios

### S1: Quick Vehicle Lookup

- **Input:** User enters a plate number.
- **Process:** System triggers concurrent requests to Plate and SOAT APIs.
- **Output:** Detailed report rendered with loading states and animations.

### S2: Service Discovery

- **Input:** User types "Lima" in the directory search.
- **Output:** Directory filters in real-time to show only Lima-related services.

## Technical Constraints

- Must use **React 19** and **Tailwind 4**.
- All interactive components MUST be identified with `client:load` or `client:visible`.
- API endpoints must be accessible via `/api/search/*`.
