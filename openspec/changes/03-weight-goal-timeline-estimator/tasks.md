# Tasks: Weight Goal & Timeline Estimator

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 180–260 lines |
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
| 1 | Domain service, profile form target weight & timeline UI card | PR 1 | `pnpm test` | `pnpm test && pnpm run build` | Revert commit |

## Phase 1: Domain & Service

- [x] 1.1 Update `src/domain/entities/user-profile.ts` with mandatory `targetWeight: number`
- [x] 1.2 Create `src/domain/services/weight-timeline-estimator.ts` with `estimateWeightTimeline`
- [x] 1.3 Create `test/domain/weight-timeline-estimator.test.ts` (RED → GREEN)

## Phase 2: UI Components & Integration

- [x] 2.1 Update `src/ui/components/profile/ProfileForm.tsx` to add mandatory `targetWeight` input field, validation, and auto-conversion on unit toggle
- [x] 2.2 Create `src/ui/components/routine/TimelineCard.tsx` displaying estimated weeks, completion date, and safe rate
- [x] 2.3 Update `src/ui/pages/RoutineDetailPage.tsx` to render `TimelineCard` when `profileSnapshot.targetWeight` is present

## Phase 3: Testing & Build Verification

- [x] 3.1 Update `test/ui/profile-page.test.tsx` to verify targetWeight validation and submission
- [x] 3.2 Create `test/ui/routine-detail-timeline.test.tsx` to verify TimelineCard rendering in routine detail
- [x] 3.3 Run `pnpm test` and `pnpm run build` to ensure 100% test pass rate and zero TypeScript errors
