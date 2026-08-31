# Tasks: Interactive Bodyweight Exercise Catalog

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~450 lines (code + config) |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR (MVP scaffolding + catalog) |
| Delivery strategy | exception-ok |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Complete interactive bodyweight exercise catalog | PR 1 | `pnpm test` | `pnpm run build` | Revert branch / commit |

## Phase 1: Foundation & Data Ingestion

- [x] 1.1 Create `package.json`, `vite.config.ts`, `tsconfig.json`, and Tailwind CSS configuration with Vitest setup.
- [x] 1.2 Fetch and normalize 325 bodyweight exercises into `src/infrastructure/data/exercises.json`.
- [x] 1.3 Define domain models in `src/domain/entities/exercise.ts` and repository port in `src/domain/repositories/exercise-repository.ts`.
- [x] 1.4 Implement `StaticExerciseRepository` in `src/infrastructure/repositories/static-exercise-repository.ts`.
- [x] 1.5 Write unit tests for `StaticExerciseRepository` in `test/infrastructure/static-exercise-repository.test.ts`.

## Phase 2: State Management & Application Layer

- [x] 2.1 Implement Zustand store in `src/application/store/exercise-store.ts` for search query, active muscle filter, selected exercise, and language.
- [x] 2.2 Write unit tests for store actions and filtering logic in `test/application/exercise-store.test.ts`.

## Phase 3: UI Components & Experience

- [x] 3.1 Build `FilterBar` (`src/ui/components/catalog/FilterBar.tsx`) with search input, muscle category pills, and counter.
- [x] 3.2 Build `ExerciseCard` (`src/ui/components/catalog/ExerciseCard.tsx`) and `ExerciseGrid` (`src/ui/components/catalog/ExerciseGrid.tsx`).
- [x] 3.3 Build `ExerciseModal` (`src/ui/components/detail/ExerciseModal.tsx`) with GIF player, muscle badges, and ES/EN instructions.
- [x] 3.4 Assemble root application in `src/App.tsx` and entry point `src/main.tsx` with modern dark theme.

## Phase 4: Verification & Build

- [x] 4.1 Execute full test suite with `pnpm test` and ensure all tests pass.
- [x] 4.2 Execute production build with `pnpm run build` and ensure zero type or bundling errors.
