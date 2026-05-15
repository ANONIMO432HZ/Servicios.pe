# Tasks: Modernización UI y Portal de Inteligencia Vehicular (COMPLETADO)

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~450 lines |
| 400-line budget risk | High (Executed) |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | exception-ok |
| Chain strategy | size-exception |

## Phase 1: Foundation (CSS & Data)
- [x] 1.1 Update `app/globals.css` with the new Dark Mode color palette and Glassmorphism utilities.
- [x] 1.2 Create `lib/services-data.ts` and map all links from `ASSETS/Enlaces.txt` to the `ServiceLink` interface, assigning appropriate local logos.
- [x] 1.3 Update `tailwind.config.ts` (Integrated into globals.css for Tailwind 4).

## Phase 2: Components Implementation
- [x] 2.1 Create `components/layout/Navbar.tsx` (Topnav) with the new global search bar.
- [x] 2.2 Create `components/dashboard/ServiceCard.tsx` (Client component) with Framer Motion hover effects.
- [x] 2.3 Create `components/dashboard/ServiceDirectory.tsx` (Client component) with real-time text filtering logic.
- [x] 2.4 Create `components/dashboard/AdvancedSearch.tsx` to handle the search execution and progressive report rendering.

## Phase 3: Assembly & Layout
- [x] 3.1 Modify `app/(dashboard)/layout.tsx` to include the new `Navbar` and adjust the main container background. (Sidebar also updated).
- [x] 3.2 Refactor `app/(dashboard)/page.tsx` to compose `AdvancedSearch` and `ServiceDirectory` within the new grid layout.

## Phase 4: Testing & Verification
- [x] 4.1 Verify `ServiceDirectory` filtering correctly hides non-matching cards.
- [x] 4.2 Verify Dark Mode/Glassmorphism renders correctly across components.
- [x] 4.3 Verify `AdvancedSearch` triggers the loading animations and handles the mock data successfully.
- [x] 4.4 Clean linting and optimized asset serving (moved to public/ASSETS).
