# Exploration: Migration from Next.js 15 to Astro

## Project Overview

- **Source Stack:** Next.js 15 (App Router), React 19, Tailwind CSS 4, Framer Motion (Motion).
- **Target Stack:** Astro, React Islands, Tailwind CSS 4, Vite.

## Current Architecture

### 1. Components (To be migrated as Islands)

- `components/dashboard/AdvancedSearch.tsx`: Complex logic, handles search execution and results. Needs `client:load`.
- `components/dashboard/ServiceDirectory.tsx`: Handles real-time filtering of 60+ links. Needs `client:load`.
- `components/dashboard/ServiceCard.tsx`: UI component with animations.
- `components/layout/Navbar.tsx`: Search bar and navigation.
- `components/layout/Sidebar.tsx`: Dashboard navigation.

### 2. Routes (To be migrated to `src/pages`)

- `app/(dashboard)/page.tsx` -> `src/pages/index.astro`
- `app/login/page.tsx` -> `src/pages/login.astro` (if exists)
- `app/(dashboard)/layout.tsx` -> `src/layouts/DashboardLayout.astro`

### 3. API Routes (To be migrated to `src/pages/api`)

- `app/api/search/plate/route.ts`
- `app/api/search/soat/route.ts`
- `app/api/search/dni/route.ts`
- `app/api/search/ruc/route.ts`
- `app/api/search/ruc-debt/route.ts`

### 4. Assets

- `public/ASSETS/*`: Contains logos and links file. Must be preserved.

## Technical Risks

- **Tailwind 4 Integration:** Astro needs to be configured correctly for `@tailwindcss/vite` and CSS imports.
- **Middleware:** Next.js middleware needs to be replaced by Astro middleware if auth logic exists.
- **React 19 Compatibility:** Ensure Astro's React integration supports React 19 features if used.

## Recommendations

- Use `client:load` for the main search components to ensure hydration.
- Keep `lib/services-data.ts` and `lib/mock-data.ts` as shared logic files.
- Move `globals.css` (Tailwind 4) to `src/styles/globals.css`.
