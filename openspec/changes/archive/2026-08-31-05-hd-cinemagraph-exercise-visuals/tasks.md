# Tasks: HD Cinemagraph Visuals & Dual-Frame Exercise Motion

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 160–240 lines |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: stacked-to-main
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | CinemagraphViewer component, ExerciseModal integration, and unit tests | PR 1 | `pnpm test` | `pnpm test && pnpm run build` | Revert commit |

## Phase 1: Domain & Infrastructure Extension

- [x] 1.1 Update `src/domain/entities/exercise.ts` to include optional `images?: string[]`
- [x] 1.2 Update `src/infrastructure/repositories/static-exercise-repository.ts` to populate/normalize `images` property

## Phase 2: Cinemagraph Component & UI Integration

- [x] 2.1 Create `src/ui/components/detail/CinemagraphViewer.tsx` with smooth dual-phase loop, play/pause, and manual step controls
- [x] 2.2 Create `test/ui/cinemagraph-viewer.test.tsx` (RED → GREEN)
- [x] 2.3 Update `src/ui/components/detail/ExerciseModal.tsx` to use `CinemagraphViewer`

## Phase 3: Testing & Build Verification

- [x] 3.1 Update `test/ui/components.test.tsx` to verify modal rendering with `CinemagraphViewer`
- [x] 3.2 Run `pnpm test` and `pnpm run build` to verify 100% pass rate and 0 build errors
