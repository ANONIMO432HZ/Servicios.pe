# Tasks: UI Responsiveness Modernization

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 250 - 350 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

## Phase 1: Foundation & Global Styles

- [ ] 1.1 Update `src/styles/globals.css` with standard z-index scale and mobile typography.
- [ ] 1.2 Define standard breakpoints in Tailwind theme if not already optimal.

## Phase 2: Layout & Navigation Integration

- [ ] 2.1 Refactor `src/components/layout/Navbar.tsx` to add a hamburger menu button (visible only on `lg:hidden`).
- [ ] 2.2 Implement custom event dispatch `govcheck:toggle-sidebar` in `Navbar`.
- [ ] 2.3 Refactor `src/components/layout/Sidebar.tsx` to listen for `govcheck:toggle-sidebar` and manage internal `isOpen` state.
- [ ] 2.4 Synchronize `Sidebar` links with `Navbar` items (Portal, API Console, Historial).
- [ ] 2.5 Update `src/layouts/DashboardLayout.astro` to include `Sidebar` and use a `flex` layout for the main content area.

## Phase 3: Component Responsiveness

- [ ] 3.1 Refactor `src/components/dashboard/AdvancedSearch.tsx` grid systems for mobile-first compatibility (1 column mobile, 2 columns tablet, 3 columns desktop).
- [ ] 3.2 Fix overflow issues in `VehicleReportView`, `IdentityReportView`, and `CompanyReportView`.
- [ ] 3.3 Ensure `CopyButton` does not cause layout shifts on small screens.

## Phase 4: Modal & UX Refinement

- [ ] 4.1 Update `SettingsModal` and `GuestModal` in `Navbar.tsx` to use `max-w-md w-full` and `m-4` for better mobile display.
- [ ] 4.2 Ensure modals have `overflow-y-auto` for small screen heights.
- [ ] 4.3 Test Sidebar auto-close on link click for mobile users.

## Phase 5: Verification

- [ ] 5.1 Verify mobile navigation at 375px.
- [ ] 5.2 Verify tablet navigation at 768px.
- [ ] 5.3 Ensure no regression on desktop layout (1024px+).
