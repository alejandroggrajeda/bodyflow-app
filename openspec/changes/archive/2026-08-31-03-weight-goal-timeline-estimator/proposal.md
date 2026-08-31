# Proposal: Weight Goal & Timeline Estimator

## Intent

Allow users to specify a mandatory target/desired weight when configuring their profile, and dynamically compute a realistic, safe weekly timeline estimate (weeks, target completion, weekly progress rate) for reaching that goal with bodyweight training.

## Scope

### In Scope
- Add mandatory `targetWeight` field to `UserProfile` entity and `ProfileForm` UI with dynamic `[lbs | kg]` support.
- Add pure domain service `estimateWeightTimeline` calculating weeks, rate (kg/week or lbs/week), direction (`lose` | `gain` | `maintain`), and health disclaimer.
- Display an interactive timeline projection card in `RoutineDetailPage` showing projected weeks and estimated target date.
- Persist `targetWeight` in `bodyflow:profile` localStorage.

### Out of Scope
- Caloric/nutrition tracking or macro meal plans.
- Dynamic workout replanning based on daily weight weigh-ins (deferred to a tracker change).

## Capabilities

### Modified Capabilities
- `user-profile`: Add required `targetWeight` field and validation.

### New Capabilities
- `weight-goal-timeline`: Pure calculation and UI presentation of the estimated weight goal timeline.

## Approach

Create pure domain service `src/domain/services/weight-timeline-estimator.ts`.
Extend `UserProfile` with `targetWeight: number`.
Update `ProfileForm` to collect `targetWeight` with the same `[lbs | kg]` toggle as current weight.
Render a timeline card on `RoutineDetailPage` with clear progress metrics and an honest non-medical disclaimer.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/domain/entities/user-profile.ts` | Modified | Add `targetWeight: number` to `UserProfile` |
| `src/domain/services/weight-timeline-estimator.ts` | New | Pure timeline estimation algorithm |
| `src/ui/components/profile/ProfileForm.tsx` | Modified | Add required target weight field and validation |
| `src/ui/pages/RoutineDetailPage.tsx` | Modified | Render weight timeline projection card |
| `openspec/specs/user-profile/spec.md` | Modified | Delta spec for targetWeight field |
| `openspec/specs/weight-goal-timeline/spec.md` | New | Full spec for timeline calculation |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Unrealistic expectations for bodyweight only | Medium | Explicitly label as estimated projection and safe weekly rate (0.25–0.75 kg/wk) |
| Invalid goal weight entered (e.g. <= 0) | Low | Form validation and boundary limits |

## Rollback Plan

Revert git commit for change 03. `UserProfile` schema remains backwards-compatible if `targetWeight` is omitted.

## Success Criteria

- [ ] `targetWeight` is required in profile form before submitting or generating routines.
- [ ] Timeline estimator outputs correct weeks and rate across lose/gain/maintain scenarios.
- [ ] 100% test coverage with strict TDD pass rate.
