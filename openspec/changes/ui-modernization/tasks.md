# Tasks: Modernización UI y Portal de Inteligencia Vehicular

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~350 - 450 lines |
| 400-line budget risk | Medium |
| Chained PRs recommended | No (Single cohesive UI change) |
| Suggested split | Single PR |
| Delivery strategy | exception-ok |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Medium

## Phase 1: Foundation (CSS & Data)
- [ ] 1.1 Update `app/globals.css` with the new Dark Mode color palette and Glassmorphism utilities.
- [ ] 1.2 Create `lib/services-data.ts` and map all links from `ASSETS/Enlaces.txt` to the `ServiceLink` interface, assigning appropriate local logos.
- [ ] 1.3 Update `tailwind.config.ts` if necessary to support custom blur/colors.

## Phase 2: Components Implementation
- [ ] 2.1 Create `components/layout/Navbar.tsx` (Topnav) with the new global search bar.
- [ ] 2.2 Create `components/dashboard/ServiceCard.tsx` (Client component) with Framer Motion hover effects.
- [ ] 2.3 Create `components/dashboard/ServiceDirectory.tsx` (Client component) with real-time text filtering logic.
- [ ] 2.4 Create `components/dashboard/AdvancedSearch.tsx` to handle the search execution and progressive report rendering.

## Phase 3: Assembly & Layout
- [ ] 3.1 Modify `app/(dashboard)/layout.tsx` to include the new `Navbar` and adjust the main container background.
- [ ] 3.2 Refactor `app/(dashboard)/page.tsx` to compose `AdvancedSearch` and `ServiceDirectory` within the new grid layout.

## Phase 4: Testing & Verification
- [ ] 4.1 Verify `ServiceDirectory` filtering correctly hides non-matching cards.
- [ ] 4.2 Verify Dark Mode/Glassmorphism renders correctly across components.
- [ ] 4.3 Verify `AdvancedSearch` triggers the loading animations and handles the mock data successfully.
