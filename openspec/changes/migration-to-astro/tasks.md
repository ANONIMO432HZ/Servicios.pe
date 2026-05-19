# Tasks: Astro Migration

## Review Workload Forecast

| Field | Value |
| ------- | ------- |
| Estimated changed lines | ~600 lines |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Delivery strategy | auto-chain |

## Phase 1: Environment Setup

- [x] 1.1 Install Astro dependencies and React/Tailwind integrations.
- [x] 1.2 Configure `astro.config.mjs` for Tailwind 4 and React 19.
- [x] 1.3 Setup `src/styles/globals.css` with the existing color palette.

## Phase 2: Logic & Component Migration

- [x] 2.1 Migrate `lib/` and `hooks/` to `src/lib/` and `src/hooks/`.
- [x] 2.2 Migrate UI components to `src/components/`.
- [x] 2.3 Update asset paths in `src/lib/services-data.ts` to reflect the new structure if needed.

## Phase 3: Page & Layout Assembly

- [x] 3.1 Create `src/layouts/DashboardLayout.astro`.
- [x] 3.2 Create `src/pages/index.astro` and mount React islands.
- [x] 3.3 Recreate the Login page if applicable.

## Phase 4: API Porting

- [x] 4.1 Port Plate and SOAT API routes.
- [x] 4.2 Port Identity (DNI) and Company (RUC) API routes.

## Phase 5: Cleanup & Verification

- [ ] 5.1 Remove `app/`, `next.config.ts`, and Next.js dependencies.
- [ ] 5.2 Verify all search flows and animations.
- [ ] 5.3 Run Lighthouse audit.
