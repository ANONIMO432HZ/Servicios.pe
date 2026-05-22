# Design: UI Responsiveness Modernization

## Technical Approach

We will implement a mobile-first responsive design using Tailwind CSS v4. The strategy involves integrating the existing `Sidebar` into the `DashboardLayout`, adding a toggle mechanism for mobile views, and refactoring specific components to handle smaller viewports gracefully.

## Architecture Decisions

### Decision: Sidebar State Management

**Choice**: Use a custom browser event `govcheck:toggle-sidebar` to communicate between `Navbar` and `Sidebar`.
**Alternatives considered**: React Context (requires wrapping everything in a single React root, which complicates Astro's island architecture), NanoStores (requires adding a new dependency).
**Rationale**: Custom events are native, lightweight, and work perfectly between independent React islands in Astro.

### Decision: Layout Structure

**Choice**: Flex container in `DashboardLayout` with `Sidebar` as a fixed/static child.
**Alternatives considered**: Grid layout.
**Rationale**: Flexbox is simpler for a sidebar-main-content relationship where the sidebar might be removed or hidden.

## Data Flow

```
Navbar (Hamburger Button) ───[Dispatch: govcheck:toggle-sidebar]──→ Sidebar (Listen & Toggle)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/layouts/DashboardLayout.astro` | Modify | Add `Sidebar` component. Wrap `main` in a `flex` container. |
| `src/components/layout/Navbar.tsx` | Modify | Add Hamburger menu button (hidden on desktop). Dispatch toggle event. |
| `src/components/layout/Sidebar.tsx` | Modify | Add event listener for toggle. Ensure links match Navbar. Adjust CSS for mobile overlay. |
| `src/components/dashboard/AdvancedSearch.tsx` | Modify | Update grid classes from `lg:grid-cols-3` to `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. |
| `src/styles/globals.css` | Modify | Add z-index scale and ensure base font sizes are appropriate for mobile. |

## Interfaces / Contracts

### Custom Event: `govcheck:toggle-sidebar`
- **Detail**: None required.
- **Trigger**: Click on Hamburger button in `Navbar`.
- **Listener**: `Sidebar` component.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Manual | Mobile Viewport | Test at 375px (iPhone SE) and 390px (iPhone 12/13). |
| Manual | Tablet Viewport | Test at 768px (iPad). |
| Manual | Interaction | Verify Sidebar opens/closes and doesn't block content. |
| Manual | Modals | Verify no horizontal scroll and correct vertical centering. |

## Migration / Rollout

No data migration required. The change will be deployed as a single UI update.

## Open Questions

- [ ] Should the Sidebar close automatically when a link is clicked on mobile? (Proposed: Yes, for better UX).
