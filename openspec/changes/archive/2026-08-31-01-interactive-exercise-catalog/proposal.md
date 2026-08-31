# Proposal: Interactive Bodyweight Exercise Catalog

## Intent

Provide users with an interactive, mobile-first web catalog of equipment-free bodyweight exercises featuring animated GIFs, muscle targeting, and step-by-step execution instructions.

## Scope

### In Scope
- Setup Vite + React 19 + TypeScript + Tailwind CSS project skeleton.
- Ingestion and normalization of 325 bodyweight exercises from `hasaneyldrm/exercises-dataset`.
- Exercise catalog UI with real-time text search and category/muscle filters.
- Exercise detail modal/view displaying animated GIFs, anatomy metadata, and localized instructions.
- Responsive mobile-first design with clean container/presentational architecture.

### Out of Scope
- Custom routine builder and active workout timer (deferred to next change).
- User authentication and cloud persistence.

## Capabilities

### New Capabilities
- `exercise-catalog`: Search and filter bodyweight exercises by muscle group, category, and keywords.
- `exercise-detail`: Inspect exercise execution with animated GIF, thumbnail, target muscle groups, and step-by-step instructions.

### Modified Capabilities
- None

## Approach

1. Scaffold Vite + React + TS + Tailwind with Clean Architecture layers (`domain/`, `application/`, `infrastructure/`, `ui/`).
2. Include pre-filtered bodyweight exercise dataset as static/embedded JSON asset.
3. Implement Zustand store for filter/search criteria and active exercise selection.
4. Build accessible, performant UI components with lazy loading for animated GIFs.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `package.json` | New | Dependencies (React, Zustand, Lucide icons, Tailwind, Vitest) |
| `src/domain/` | New | Exercise entity, muscle groups, and filter domain contracts |
| `src/infrastructure/` | New | Data repository and exercise dataset adapter |
| `src/application/` | New | Exercise search and filtering use cases / Zustand store |
| `src/ui/` | New | Catalog grid, filter bars, search input, and detail modal |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Heavy GIF loading performance | Med | Lazy-load media, display 180x180 thumbnails first, load full GIF on detail view |
| Mobile layout overflow | Low | Mobile-first Flex/Grid responsive testing |

## Rollback Plan

Revert git commit or delete `src/` and `package.json` scaffolding to restore clean repo state.

## Success Criteria

- [ ] Web application builds and runs cleanly via Vite.
- [ ] Users can browse 300+ bodyweight exercises with thumbnail previews.
- [ ] Users can filter by muscle group (e.g. chest, legs, abs) and search by name.
- [ ] Clicking an exercise opens detail view with animated GIF and step-by-step instructions.
