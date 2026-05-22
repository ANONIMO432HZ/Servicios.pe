# Proposal: UI Responsiveness Modernization

## Intent

The current application lacks a cohesive mobile experience. Key navigation elements are hidden or inaccessible on small screens, and some UI components (modals and grids) cause layout overflows. This change aims to implement a mobile-first responsive design across the entire application, ensuring usability on all device sizes.

## Scope

### In Scope
- Integrate `Sidebar` into `DashboardLayout` for a unified layout.
- Add a hamburger menu toggle in `Navbar` to control `Sidebar` on mobile.
- Synchronize navigation links between `Navbar` (desktop) and `Sidebar` (mobile/tablet).
- Fix layout overflows in `AdvancedSearch` components and nested grids.
- Refactor modals to be fully responsive using CSS primitives (flex/grid) instead of hardcoded viewport units.
- Standardize global typography and spacing for mobile devices.

### Out of Scope
- Redesigning the core brand identity or color palette.
- Implementing complex desktop-only features on mobile (e.g., advanced data exports).
- Adding new search capabilities.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- dashboard-overview: Update layout to support responsive sidebar and unified navigation.
- advanced-search-ui: Adjust grid structures and report views for small screens.

## Approach

We will adopt a **Mobile-First** approach using Tailwind CSS. 
1. **Layout**: Move `Sidebar` into `DashboardLayout` and use a shared state (provided by a simple store or custom event) to toggle its visibility on mobile.
2. **Navigation**: Standardize the links in both components.
3. **Components**: Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` patterns in `AdvancedSearch`.
4. **Modals**: Use `max-w-md w-full` and `m-4` instead of `100vw/100vh` to allow natural margins on mobile.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/layouts/DashboardLayout.astro` | Modified | Integration of Sidebar and layout adjustments. |
| `src/components/layout/Navbar.tsx` | Modified | Addition of menu toggle and modal refactoring. |
| `src/components/layout/Sidebar.tsx` | Modified | Navigation link sync and styling tweaks. |
| `src/components/dashboard/AdvancedSearch.tsx` | Modified | Responsive grid adjustments for report views. |
| `src/styles/globals.css` | Modified | Global mobile typography and spacing. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Z-index conflicts between Sidebar and Modals | Low | Standardize z-index scale in `globals.css`. |
| Hydration mismatches in Astro | Low | Ensure client-side state is handled within React components. |
| Breaking existing desktop layout | Low | Use `min-width` media queries (mobile-first). |

## Rollback Plan

Revert to the previous git commit. The changes are purely UI/Frontend and do not affect data persistence or API logic.

## Dependencies

- None

## Success Criteria

- [ ] Sidebar is togglable via hamburger menu on mobile (< 768px).
- [ ] No horizontal scrolling on mobile devices (375px+).
- [ ] Modals display with margins on mobile and don't overflow vertically.
- [ ] Navigation is consistent between desktop and mobile.
