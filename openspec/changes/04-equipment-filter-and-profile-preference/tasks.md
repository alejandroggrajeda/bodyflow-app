# Tasks: Equipment Filter & Calisthenics Profile Preference

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 220–320 lines |
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
| 1 | Equipment classification, catalog filter, profile preference & generator filtering | PR 1 | `pnpm test` | `pnpm test && pnpm run build` | Revert commit |

## Phase 1: Domain & Infrastructure Foundation

- [x] 1.1 Update `src/domain/entities/exercise.ts` with `EquipmentRequirement`, `EquipmentFilterOption`, and `classifyEquipment` helper
- [x] 1.2 Update `src/domain/entities/user-profile.ts` with `EquipmentAccess` and `equipmentAccess` property
- [x] 1.3 Update `src/infrastructure/repositories/static-exercise-repository.ts` to attach classified requirement and filter by `equipmentFilter`
- [x] 1.4 Create `test/domain/exercise-classification.test.ts` (RED → GREEN)
- [x] 1.5 Update `test/infrastructure/static-exercise-repository.test.ts` to test equipment filtering

## Phase 2: Routine Generator & Stores

- [x] 2.1 Update `src/application/store/exercise-store.ts` to support `setEquipmentFilter` action and state
- [x] 2.2 Update `src/domain/services/routine-generator.ts` to strictly filter by `equipmentAccess` when `floor-only`
- [x] 2.3 Update `test/domain/routine-generator.test.ts` to verify 100% floor-only exercises for `equipmentAccess: 'floor-only'`

## Phase 3: UI Components & Integration

- [x] 3.1 Update `src/ui/components/catalog/FilterBar.tsx` with equipment toggle selector (`Todos` | `Solo Suelo` | `Con Barra/Apoyo`)
- [x] 3.2 Update `src/ui/components/catalog/ExerciseCard.tsx` with equipment badge
- [x] 3.3 Update `src/ui/components/profile/ProfileForm.tsx` with equipment access preference toggle
- [x] 3.4 Update `test/ui/components.test.tsx` and `test/ui/profile-page.test.tsx`

## Phase 4: Verification & Build

- [x] 4.1 Run `pnpm test` — all tests must pass
- [x] 4.2 Run `pnpm run build` — zero TypeScript errors, clean bundle
