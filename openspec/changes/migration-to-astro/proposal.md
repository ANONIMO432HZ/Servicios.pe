# Proposal: Migration to Astro

## Intent

Migrate the GovCheck platform from Next.js 15 to Astro to resolve performance bottlenecks in development and optimize production SEO/Speed while maintaining the existing React component library.

## Scope

- **Foundation:** Setup Astro with React and Tailwind 4.
- **Components:** Migrate and adapt all dashboard and layout components as React Islands.
- **Pages:** Recreate dashboard and login pages using Astro templates.
- **APIs:** Port all vehicular search API routes to Astro API endpoints.
- **Cleanup:** Remove Next.js specific files and dependencies.

## Approach

1. **Bootstrap:** Initialize Astro in the project root, keeping existing files in a separate folder (or migrating them one by one).
2. **Hybrid State:** During migration, we will move files from `app/` and `components/` to `src/`.
3. **Island Integration:** Focus on `AdvancedSearch` and `ServiceDirectory` as the primary interactive islands.
4. **Verification:** Ensure all vehicular lookup services (Plate, SOAT, DNI) are fully functional in the new environment.

## Expected Outcomes

- Instantaneous dev server startup (< 1s).
- 100/100 Lighthouse SEO score.
- Significantly reduced bundle size.
- Improved "fluidity" in dashboard interactions.
