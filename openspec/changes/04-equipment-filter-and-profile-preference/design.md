# Design: Equipment Filter & Calisthenics Profile Preference

## Technical Approach

Introduce an explicit equipment classification for all calisthenics exercises:
- `none`: 100% Floor / Body-only movements requiring zero apparatus or furniture.
- `bar`: Exercises requiring a pull-up bar, chin-up bar, dip bar, or horizontal bar.
- `furniture`: Exercises requiring a bench, chair, box, or household furniture.

Implement deterministic classification in `src/domain/entities/exercise.ts` / repository layer.
Expose equipment filter in Catalog `FilterBar.tsx` and add an equipment preference switch in `ProfileForm.tsx`.
Enforce equipment constraint in `generateRoutine()` to guarantee zero apparatus movements for users with `equipmentAccess: 'floor-only'`.

## Architecture Decisions

### Decision: Dynamic Classification Helper vs Manual Dataset Rewriting

| Option | Tradeoffs | Decision |
|---|---|---|
| A. Pure Classification Helper `classifyEquipment(exercise)` in Domain/Infra | Deterministic, testable, handles any dataset updates automatically without rewriting raw JSON | **Chosen** |
| B. Manually edit 325 JSON objects in `exercises.json` | Static, but high maintenance and error-prone if data is refreshed | Rejected |

### Decision: Filter Granularity in Catalog and Profile

| Component | Options | Rationale |
|---|---|---|
| Catalog `FilterBar` | `[Todos | Solo Suelo (Sin Equipo) | Con Barra / Apoyo]` | Quick toggling for users browsing the catalog |
| Profile `ProfileForm` | `[Todo Equipo / Barras | Solo Suelo / 100% Sin Equipo]` | Binary setting for routine generation |

## Interfaces / Contracts

```typescript
export type EquipmentRequirement = 'none' | 'bar' | 'furniture';

export interface Exercise {
  id: string;
  name: string;
  category: MuscleCategory;
  bodyPart: string;
  equipment: string;
  equipmentRequirement?: EquipmentRequirement;
  targetMuscle: string;
  secondaryMuscles: string[];
  thumbnailUrl: string;
  gifUrl: string;
  instructions: { en: string[]; es: string[] };
}

export type EquipmentFilterOption = 'all' | 'floor-only' | 'apparatus';

export interface ExerciseFilterCriteria {
  searchQuery?: string;
  bodyPart?: MuscleCategory;
  targetMuscle?: string;
  equipmentFilter?: EquipmentFilterOption;
}

export type EquipmentAccess = 'all' | 'floor-only';

export interface UserProfile {
  age: number;
  weight: number;
  targetWeight: number;
  weightUnit?: WeightUnit;
  equipmentAccess?: EquipmentAccess;
  height: number;
  sex: Sex;
  experience: ExperienceLevel;
}
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/domain/entities/exercise.ts` | Modify | Add `EquipmentRequirement`, `EquipmentFilterOption`, and `classifyEquipment` |
| `src/domain/entities/user-profile.ts` | Modify | Add `EquipmentAccess` type and `equipmentAccess` field to `UserProfile` |
| `src/infrastructure/repositories/static-exercise-repository.ts` | Modify | Integrate `classifyEquipment` and filter by `equipmentFilter` |
| `src/application/store/exercise-store.ts` | Modify | Add `equipmentFilter` state and setter |
| `src/domain/services/routine-generator.ts` | Modify | Filter by `equipmentAccess` during candidate selection |
| `src/ui/components/catalog/FilterBar.tsx` | Modify | Add equipment filter pill buttons |
| `src/ui/components/catalog/ExerciseCard.tsx` | Modify | Render equipment badge (e.g. "Sin Equipo" / "Barra") |
| `src/ui/components/profile/ProfileForm.tsx` | Modify | Add equipment access preference toggle |

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit (Domain) | `classifyEquipment` categorizes pull-ups as `bar`, dips as `furniture`/`bar`, and push-ups/squats as `none` | `test/domain/exercise-classification.test.ts` |
| Unit (Domain) | `generateRoutine` with `floor-only` returns 100% floor exercises | `test/domain/routine-generator.test.ts` |
| Unit (Infra) | `StaticExerciseRepository.search({ equipmentFilter: 'floor-only' })` | `test/infrastructure/static-exercise-repository.test.ts` |
| Integration (UI) | Catalog FilterBar switches equipment filter; ProfileForm collects equipment preference | `test/ui/components.test.tsx`, `test/ui/profile-page.test.tsx` |

## Threat Matrix

`N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.`
