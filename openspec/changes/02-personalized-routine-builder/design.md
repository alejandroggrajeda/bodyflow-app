# Design: Personalized Routine Builder

## Technical Approach

Introduce three new Clean Architecture layers on top of the existing exercise catalog:
1. **Domain** — new entities (`UserProfile`, `Routine`, `RoutineDay`) and a pure domain service (`RoutineGeneratorService`).
2. **Application** — two Zustand stores (`profile-store`, `saved-routine-store`) backed by localStorage adapters.
3. **UI** — three new pages (`ProfilePage`, `RoutinesPage`, `RoutineDetailPage`) + `BottomNav` tab bar, wired via `react-router-dom` v7.

The existing `exercise-store` and all catalog components are UNTOUCHED. The new routine domain calls `StaticExerciseRepository` directly (no store coupling).

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|---|---|---|---|
| Routing | `react-router-dom` v7 `<BrowserRouter>` | hash router, no router | SPA pattern; Vite already handles fallback. Hash router pollutes URLs. |
| Profile persistence | Raw `localStorage` JSON in infrastructure adapters | Zustand `persist` middleware | Keeps domain/application layers free of middleware coupling; easier to unit-test with mock adapters |
| Routine generation | Pure function `generateRoutine(profile, exercises)` in `domain/services` | Class-based service | Pure function = zero dependencies, trivially testable, deterministic |
| Exercise selection seed | Profile hash (sum of numeric fields) → seeded Fisher-Yates shuffle | Random shuffle | Guarantees same profile → same routine (spec requirement) |
| Navigation | Fixed bottom tab bar (44px touch target, `h-dvh` safe area) | Top nav, sidebar | Mobile-first; thumb-zone navigation; matches fitness app conventions |
| Saved routines cap | 10 routines max, enforced at save time | No cap, oldest-eviction | Simple UX; no silent data loss |

## Data Flow

```
User fills ProfilePage form
    └─→ profile-store.saveProfile()
            └─→ localStorage["bodyflow:profile"]

User taps "Generate Routine"
    └─→ StaticExerciseRepository.getAll()          (all 325 exercises)
    └─→ RoutineGeneratorService.generateRoutine(profile, exercises)
            ├─ calcBMI(weight, height)
            ├─ getTrainingFrequency(experience)     → 3 | 4 | 5 days
            ├─ getDaySplit(frequency)               → muscle group arrays per day
            ├─ seededShuffle(filteredExercises, seed)
            └─→ Routine { id, name, days: RoutineDay[] }
    └─→ Display in RoutineDetailPage (unsaved)

User taps "Save"
    └─→ saved-routine-store.saveRoutine(routine)
            └─→ localStorage["bodyflow:routines"]  (JSON array, max 10)

User opens RoutinesPage
    └─→ saved-routine-store.loadRoutines()
            └─→ render RoutineCard list

Tap exercise inside RoutineDay
    └─→ exercise-store.openExerciseDetail(id)      (reuses existing modal)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/domain/entities/user-profile.ts` | Create | `UserProfile`, `BMICategory`, `ExperienceLevel` types |
| `src/domain/entities/routine.ts` | Create | `Routine`, `RoutineDay`, `RoutineExercise` types |
| `src/domain/services/routine-generator.ts` | Create | Pure function: profile + exercises → `Routine` |
| `src/infrastructure/storage/profile-storage.ts` | Create | localStorage read/write adapter for `UserProfile` |
| `src/infrastructure/storage/routine-storage.ts` | Create | localStorage read/write adapter for `Routine[]` |
| `src/application/store/profile-store.ts` | Create | Zustand store for profile CRUD |
| `src/application/store/saved-routine-store.ts` | Create | Zustand store for saved routines CRUD |
| `src/ui/pages/ProfilePage.tsx` | Create | Editable profile form (container) |
| `src/ui/pages/RoutinesPage.tsx` | Create | Saved routines list (container) |
| `src/ui/pages/RoutineDetailPage.tsx` | Create | Day-by-day exercise list (container) |
| `src/ui/components/navigation/BottomNav.tsx` | Create | Fixed bottom tab bar (3 tabs) |
| `src/ui/components/routine/RoutineCard.tsx` | Create | Saved routine card (presentational) |
| `src/ui/components/routine/RoutineDaySection.tsx` | Create | Collapsible day section (presentational) |
| `src/ui/components/profile/ProfileForm.tsx` | Create | Form fields component (presentational) |
| `src/App.tsx` | Modify | Add `<BrowserRouter>` + routes for 3 new pages + `<BottomNav>` |
| `package.json` | Modify | Add `react-router-dom` |
| `test/domain/routine-generator.test.ts` | Create | Unit tests for generator service (pure function) |
| `test/application/profile-store.test.ts` | Create | Unit tests for profile store |
| `test/application/saved-routine-store.test.ts` | Create | Unit tests for saved routine store |
| `test/ui/profile-page.test.tsx` | Create | Component integration tests |
| `test/ui/routines-page.test.tsx` | Create | Component integration tests |

## Interfaces / Contracts

```typescript
// domain/entities/user-profile.ts
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type Sex = 'male' | 'female' | 'other';
export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export interface UserProfile {
  age: number;       // 10–99
  weight: number;    // kg, 20–300
  height: number;    // cm, 100–250
  sex: Sex;
  experience: ExperienceLevel;
}

// domain/entities/routine.ts
export interface RoutineExercise {
  exerciseId: string;
  sets: number;
  reps: [number, number];  // [min, max]
  restSeconds: number;
}

export interface RoutineDay {
  dayIndex: number;        // 1-based
  label: string;           // e.g. "Day 1 – Full Body"
  muscleGroups: string[];
  exercises: RoutineExercise[];
}

export interface Routine {
  id: string;
  name: string;
  createdAt: string;       // ISO 8601
  profileSnapshot: UserProfile;
  days: RoutineDay[];
}

// domain/services/routine-generator.ts
export function generateRoutine(
  profile: UserProfile,
  exercises: Exercise[],
  name?: string
): Routine;
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `generateRoutine` — all experience levels, BMI edge cases, minimum exercise backfill, determinism | Vitest pure function tests, no mocks |
| Unit | `profile-store`, `saved-routine-store` — CRUD, cap enforcement, duplicate name | Vitest + localStorage mock via `vi.stubGlobal` |
| Component | `ProfilePage` form validation, save confirmation | RTL + `userEvent` |
| Component | `RoutinesPage` empty state, list render, delete confirmation | RTL |
| Component | `BottomNav` active tab highlight, navigation | RTL |

## Threat Matrix

N/A — no routing shell commands, subprocess execution, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration required. New localStorage keys (`bodyflow:profile`, `bodyflow:routines`) are additive. Existing `bodyflow` catalog state is unaffected. Rollback: remove new routes from `App.tsx` and delete new files.

## Open Questions

- None — design is unblocked.
