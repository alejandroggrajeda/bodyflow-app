# Proposal: Equipment Filter & Calisthenics Profile Preference

## Intent

The exercise dataset contains bodyweight calisthenics exercises, but some require apparatus (pull-up bars, dip bars, benches, chairs). Users who train at home, outdoors, or in hotel rooms with zero equipment need a guaranteed way to filter catalog exercises and generate workout routines composed exclusively of 100% floor/body-only movements.

## Scope

### In Scope
- Categorize all 325 exercises by apparatus requirement: `none` (floor/body only), `bar` (pull-up / straight bar), and `furniture` (bench / chair / wall).
- Add equipment filter to `ExerciseFilterCriteria` and Catalog `FilterBar.tsx` (`Todos` | `Solo Suelo / Sin Equipo` | `Con Barra/Apoyo`).
- Add visual equipment badge to `ExerciseCard.tsx` and `ExerciseModal.tsx`.
- Add `hasPullUpBar` / `hasBench` (or `equipmentAccess: 'none' | 'full' | 'furniture-only'`) preference to `UserProfile` and `ProfileForm.tsx`.
- Update `generateRoutine` to strictly exclude bar/furniture exercises when user profile specifies `none`.

### Out of Scope
- Adding free weights (dumbbells, barbells, kettlebells) or gym machines.

## Capabilities

### Modified Capabilities
- `exercise-catalog`: Add apparatus filter and equipment badge on cards/modals.
- `user-profile`: Add equipment access preference to user profile.
- `routine-generator`: Enforce strict equipment boundary during routine exercise selection.

## Approach

1. Extend `Exercise` interface with `equipmentRequirement: 'none' | 'bar' | 'furniture'`.
2. Enrich dataset / repository with deterministic classification heuristics (name & instruction scanning for apparatus).
3. Update `StaticExerciseRepository.search()` to filter by equipment requirement.
4. Add equipment access field to `UserProfile` and `ProfileForm`.
5. Update `generateRoutine` filter step to filter dataset by user's available equipment before shuffling.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/domain/entities/exercise.ts` | Modified | Add `EquipmentRequirement` enum & field |
| `src/domain/entities/user-profile.ts` | Modified | Add `equipmentAccess` preference |
| `src/infrastructure/repositories/static-exercise-repository.ts` | Modified | Filter by equipment requirement |
| `src/domain/services/routine-generator.ts` | Modified | Filter exercises by available equipment |
| `src/ui/components/catalog/FilterBar.tsx` | Modified | Add equipment filter selector |
| `src/ui/components/catalog/ExerciseCard.tsx` | Modified | Equipment badge |
| `src/ui/components/profile/ProfileForm.tsx` | Modified | Equipment toggle |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Insufficient pulling exercises when `none` selected | Low | Dataset contains floor pulling exercises (back extensions, prone rows, swimmers, reverse snow angels); backfill logic ensures minimum 3-4 exercises per day |

## Rollback Plan

Revert git commit. Living specs and domain models remain backwards compatible.

## Success Criteria

- [ ] Catalog filter allows viewing "Solo Suelo" (zero equipment) vs "Con Barra/Apoyo".
- [ ] Profile form collects equipment access preference.
- [ ] Routine generator mathematically guarantees zero bar/furniture exercises when user has no equipment.
- [ ] 100% tests passing in Vitest with strict TDD.
