# Proposal: Personalized Routine Builder

## Intent

Users need a structured weekly workout plan generated automatically from their physical profile and experience level, without relying on external APIs. The app has 325 bodyweight exercises but no way to organize them into a progressive, personalized program.

## Scope

### In Scope
- User profile screen (age, weight, height, sex, experience level) stored in localStorage
- Local rule-based algorithm that generates a weekly plan (N days/week) split by muscle group
- Generated routines include sets, reps, and rest times calibrated to profile
- Ability to save named routines to localStorage and reload them later
- Routine detail view: list of exercises per day linking back to the exercise catalog (GIF + instructions)

### Out of Scope
- Active workout execution / rest timers (deferred to Change 03)
- Progress tracking / history logging (deferred to Change 04)
- Social sharing or export to PDF
- Server-side persistence

## Capabilities

### New Capabilities
- `user-profile`: Editable profile form with physical and fitness data, persisted to localStorage
- `routine-generator`: Local rule-based engine that maps profile → weekly exercise plan
- `routine-management`: Save, list, load, and delete named user-generated routines from localStorage

### Modified Capabilities
- `exercise-detail`: Exercise cards inside a routine day must deep-link to the catalog modal (no spec behavior change, implementation touch only)

## Approach

**Profile → Algorithm → Plan:**

1. **Profile collection**: Single editable screen with fields: age (number), weight (kg), height (cm), sex (male/female/other), experience (beginner/intermediate/advanced). Stored as JSON in localStorage under `bodyflow:profile`.
2. **Rule engine** (`src/domain/services/routine-generator.ts`):
   - Calculate BMI; classify underweight/normal/overweight.
   - Map experience → training frequency (beginner: 3 days, intermediate: 4 days, advanced: 5 days).
   - Map experience + BMI → volume (sets × reps ranges) and rest (seconds).
   - Assign muscle groups to days using a push/pull/legs or full-body split depending on frequency.
   - Filter the 325-exercise dataset by assigned muscle groups; pick N exercises per day using a deterministic seed (profile hash) for reproducibility.
3. **Routine persistence**: Zustand slice (`saved-routine-store.ts`) backed by localStorage under `bodyflow:routines`.
4. **UI**: New `/profile` page and `/routines` page. Bottom navigation bar added for catalog ↔ routines ↔ profile tabs.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/domain/services/` | New | `routine-generator.ts` — pure rule engine |
| `src/domain/entities/` | New | `UserProfile`, `Routine`, `RoutineDay` entities |
| `src/application/store/` | New | `profile-store.ts`, `saved-routine-store.ts` |
| `src/ui/pages/` | New | `ProfilePage.tsx`, `RoutinesPage.tsx`, `RoutineDetailPage.tsx` |
| `src/ui/components/navigation/` | New | `BottomNav.tsx` |
| `src/App.tsx` | Modified | Add React Router routes for new pages |
| `package.json` | Modified | Add `react-router-dom` dependency |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Algorithm produces unbalanced or empty routines for edge-case profiles | Med | Unit-test generator with boundary profiles; fallback to full-body split |
| localStorage full (5MB cap) with many saved routines | Low | Cap saved routines at 10; warn user when near limit |
| React Router conflicts with current SPA routing | Low | Vite already serves SPA; `BrowserRouter` drop-in is sufficient |

## Rollback Plan

All changes are additive. The existing `CatalogPage` is untouched as a standalone route. Remove new routes from `App.tsx` and delete new store/service files. No data migration needed; localStorage keys are namespaced (`bodyflow:profile`, `bodyflow:routines`).

## Dependencies

- `react-router-dom` v7 (new package, compatible with React 19 and Vite 6)

## Success Criteria

- [ ] Profile form persists values across page reloads
- [ ] Rule engine generates a valid weekly plan for all combinations of sex × experience × BMI category
- [ ] Each routine day lists ≥ 3 exercises from the correct muscle group
- [ ] Generated routine is saveable, listable, and reloadable by name
- [ ] No CLS on routine and profile pages (aspect-ratio containers on all exercise thumbnails)
- [ ] All new domain logic covered by unit tests; overall coverage ≥ 80%
- [ ] `pnpm run build` exits 0 with zero TypeScript errors
