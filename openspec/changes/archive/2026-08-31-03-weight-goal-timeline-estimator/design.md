# Design: Weight Goal & Timeline Estimator

## Technical Approach

Implement a pure domain service `estimateWeightTimeline` in `src/domain/services/weight-timeline-estimator.ts` that calculates the timeline from current weight, target weight, experience level, and unit.
Extend `UserProfile` with `targetWeight: number`.
Update `ProfileForm` to include a mandatory `targetWeight` input with automatic sync to the active unit toggle (`lbs` or `kg`).
Update `RoutineDetailPage` to render a `TimelineCard` component displaying the projection.

## Architecture Decisions

### Decision: Separate Domain Service vs Embedded in Routine Generator

| Option | Tradeoffs | Decision |
|---|---|---|
| A. Separate Pure Function `estimateWeightTimeline` | Decoupled, testable without routine generation dependencies, Single Responsibility Principle | **Chosen** |
| B. Embedded inside `generateRoutine` | Simpler signature, but couples timeline math to exercise catalog shuffle | Rejected |

### Decision: Estimation Rates

| Goal | Beginner | Intermediate/Advanced | Rationale |
|---|---|---|---|
| Loss | 0.40 kg/wk (~0.9 lbs/wk) | 0.60 kg/wk (~1.3 lbs/wk) | Safe, realistic bodyweight training without aggressive caloric restriction |
| Gain | 0.20 kg/wk (~0.45 lbs/wk) | 0.25 kg/wk (~0.55 lbs/wk) | Realistic lean hypertrophy rate for calisthenics |

## Interfaces / Contracts

```typescript
export type GoalDirection = 'lose' | 'gain' | 'maintain';

export interface WeightTimelineEstimate {
  currentWeight: number;
  targetWeight: number;
  weightUnit: WeightUnit;
  deltaKg: number;
  direction: GoalDirection;
  estimatedWeeks: number;
  weeklyRate: number; // in current unit per week
  estimatedCompletionDate: string; // ISO date string or formatted date
}

export function estimateWeightTimeline(
  currentWeight: number,
  targetWeight: number,
  experience: ExperienceLevel,
  unit: WeightUnit = 'lbs'
): WeightTimelineEstimate;
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/domain/entities/user-profile.ts` | Modify | Add `targetWeight: number` to `UserProfile` |
| `src/domain/services/weight-timeline-estimator.ts` | Create | Pure timeline estimation function |
| `src/ui/components/profile/ProfileForm.tsx` | Modify | Add required target weight field and validation |
| `src/ui/components/routine/TimelineCard.tsx` | Create | Presentational projection timeline card |
| `src/ui/pages/RoutineDetailPage.tsx` | Modify | Render `TimelineCard` if routine contains targetWeight |

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit (Domain) | Loss, gain, maintain calculations in kg and lbs; boundary rounding | `test/domain/weight-timeline-estimator.test.ts` |
| Integration (UI) | Form requires targetWeight; switching units converts both weights; detail page shows timeline card | `test/ui/profile-page.test.tsx`, `test/ui/routine-detail-timeline.test.tsx` |

## Threat Matrix

`N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.`
