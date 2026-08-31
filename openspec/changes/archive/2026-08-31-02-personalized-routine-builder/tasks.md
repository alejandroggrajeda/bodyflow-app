# Tasks: Personalized Routine Builder

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 700–900 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: Domain + Infra + Stores → PR 2: UI Pages + Routing + BottomNav → PR 3: Tests |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Domain entities, generator service, infra adapters, Zustand stores | PR 1 | `pnpm test test/domain test/application` | N/A — pure logic, no server needed | Delete new domain/infra/store files; no existing files modified |
| 2 | UI pages, BottomNav, routing wiring in App.tsx | PR 2 | `pnpm test test/ui` | `pnpm dev` → navigate tabs | Revert `App.tsx`; delete new page and component files |
| 3 | Full test suite + build verification | PR 3 | `pnpm test && pnpm run build` | `pnpm dev` → full E2E flow | No new production files; test-only changes |

## Phase 1: Foundation — Domain Entities & Infra

- [x] 1.1 Create `src/domain/entities/user-profile.ts` — `UserProfile`, `ExperienceLevel`, `Sex`, `BMICategory` types
- [x] 1.2 Create `src/domain/entities/routine.ts` — `Routine`, `RoutineDay`, `RoutineExercise` types
- [x] 1.3 Create `src/infrastructure/storage/profile-storage.ts` — read/write `bodyflow:profile` in localStorage
- [x] 1.4 Create `src/infrastructure/storage/routine-storage.ts` — read/write `bodyflow:routines` (JSON array, cap 10)

## Phase 2: Core Implementation — Generator Service & Stores

- [x] 2.1 Create `src/domain/services/routine-generator.ts` — pure `generateRoutine(profile, exercises)` function
  - Compute BMI; classify `BMICategory`
  - Map `experience` → training frequency (3 | 4 | 5 days)
  - Map frequency → day split (full-body | upper-lower | push-pull-legs)
  - Assign muscle groups per day; filter exercises from dataset by group
  - Seeded Fisher-Yates shuffle (seed = sum of numeric profile fields) for determinism
  - Pick 3–8 exercises/day; backfill with core/full-body if < 3 available
  - Attach sets/reps/rest by experience: beginner 2×[8-10]/90s, intermediate 3×[10-12]/60s, advanced 4×[12-15]/45s
- [x] 2.2 Create `src/application/store/profile-store.ts` — `loadProfile`, `saveProfile`, `clearProfile` backed by `profile-storage`
- [x] 2.3 Create `src/application/store/saved-routine-store.ts` — `loadRoutines`, `saveRoutine` (cap+duplicate check), `deleteRoutine` backed by `routine-storage`

## Phase 3: UI Integration — Pages, Components & Routing

- [x] 3.1 Install `react-router-dom` via `pnpm add react-router-dom`
- [x] 3.2 Create `src/ui/components/navigation/BottomNav.tsx` — 3 tabs (Catalog / Routines / Profile), 44px touch target, fixed bottom, `pb-safe` padding
- [x] 3.3 Create `src/ui/components/profile/ProfileForm.tsx` — presentational form: age, weight, height, sex select, experience select; field-level validation; disabled submit when profile incomplete
- [x] 3.4 Create `src/ui/pages/ProfilePage.tsx` — container: loads profile-store, renders ProfileForm, "Generate Routine" button calling `generateRoutine` + navigate to detail
- [x] 3.5 Create `src/ui/components/routine/RoutineCard.tsx` — presentational: routine name, creation date, day count, delete button with confirm dialog
- [x] 3.6 Create `src/ui/components/routine/RoutineDaySection.tsx` — presentational: collapsible day with exercise list; each exercise taps → `exercise-store.openExerciseDetail(id)` (reuses existing modal)
- [x] 3.7 Create `src/ui/pages/RoutinesPage.tsx` — container: saved routines list with empty state CTA
- [x] 3.8 Create `src/ui/pages/RoutineDetailPage.tsx` — container: renders `RoutineDaySection` per day; "Save Routine" button with name input + duplicate guard
- [x] 3.9 Modify `src/App.tsx` — wrap with `<BrowserRouter>`, add `<Routes>` for `/` (catalog), `/routines`, `/profile`, `/routines/:id`; render `<BottomNav>` and `<ExerciseModal>` outside routes

## Phase 4: Testing

- [x] 4.1 Create `test/domain/routine-generator.test.ts` — test: beginner→3 days, intermediate→4, advanced→5; correct split assignment; min 3 exercises/day; backfill on sparse group; volume per level; determinism (same profile called twice)
- [x] 4.2 Create `test/application/profile-store.test.ts` & `routine-stores.test.ts` — test: save persists to localStorage, load restores, clear removes key, reload after save returns saved values
- [x] 4.3 Create `test/application/saved-routine-store.test.ts` & `routine-stores.test.ts` — test: save adds entry, cap at 10 throws/warns, duplicate name triggers confirm, delete removes entry, list ordered by createdAt desc
- [x] 4.4 Create `test/ui/profile-page.test.tsx` — test: invalid field shows error, valid submit calls saveProfile, generate button disabled without profile
- [x] 4.5 Create `test/ui/routines-page.test.tsx` — test: empty state renders CTA, list renders routine cards, delete confirm flow
- [x] 4.6 Run `pnpm test` — all tests must pass (coverage ≥ 80%)
- [x] 4.7 Run `pnpm run build` — zero TypeScript errors, clean production bundle
