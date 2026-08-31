# Design: Interactive Bodyweight Exercise Catalog

## Technical Approach

Build a high-performance, mobile-first single-page application using Vite, React 19, TypeScript, Tailwind CSS, and Zustand. The architecture strictly follows Clean Architecture and the Container/Presentational component pattern.

## Architecture Decisions

| Decision | Choice | Alternatives Considered | Rationale |
|----------|--------|-------------------------|-----------|
| **Data Ingestion** | Embedded Static JSON bundle | Dynamic REST API / SQLite WASM | 325 bodyweight exercises represent ~120KB uncompressed (gzip ~25KB), allowing zero-latency instant offline queries. |
| **Media Delivery** | CDN / GitHub Raw URLs with lazy loading | Full local bundling of ~500MB GIFs | Keeping repository lightweight while serving fast CDN media. Thumbnails load first, full GIFs load only on detail modal mount. |
| **State Management** | Zustand | Redux Toolkit / React Context | Minimal boilerplate, atomic selectors prevent unnecessary re-renders during rapid filter/search typing. |
| **Component Architecture** | Container / Presentational | Monolithic page components | Clear separation between UI rendering and application use-cases / stores. |

## Data Flow

```
[Static JSON Data] ──→ [StaticExerciseRepository]
                               │
                               ▼
                       [ExerciseStore (Zustand)]
                               │ (state: search, filter, selectedId)
                               ▼
     ┌─────────────────────────┴─────────────────────────┐
     ▼                                                   ▼
[ExerciseCatalogContainer]                     [ExerciseDetailContainer]
     │                                                   │
     ▼                                                   ▼
[FilterBar / Grid / Cards]                     [Modal / GifPlayer / Steps]
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Create | Project dependencies and Vitest scripts |
| `vite.config.ts` | Create | Vite build and test configuration |
| `tsconfig.json` | Create | Strict TypeScript configuration |
| `src/domain/entities/exercise.ts` | Create | Core domain types and interfaces |
| `src/domain/repositories/exercise-repository.ts` | Create | Domain port for querying exercises |
| `src/infrastructure/data/exercises.json` | Create | 325 normalized bodyweight exercises |
| `src/infrastructure/repositories/static-exercise-repository.ts` | Create | In-memory implementation of ExerciseRepository |
| `src/application/store/exercise-store.ts` | Create | Zustand store for search, filters, and active modal |
| `src/ui/components/catalog/ExerciseGrid.tsx` | Create | Responsive grid displaying exercise cards |
| `src/ui/components/catalog/ExerciseCard.tsx` | Create | Card with thumbnail, title, and muscle pills |
| `src/ui/components/catalog/FilterBar.tsx` | Create | Muscle group pills & search input |
| `src/ui/components/detail/ExerciseModal.tsx` | Create | Accessible modal displaying animated GIF and steps |
| `src/ui/components/detail/LanguageToggle.tsx` | Create | Toggle for ES / EN instructions |

## Interfaces / Contracts

```typescript
export interface Exercise {
  id: string;
  name: string;
  category: string;
  bodyPart: string;
  equipment: string;
  targetMuscle: string;
  secondaryMuscles: string[];
  thumbnailUrl: string;
  gifUrl: string;
  instructions: {
    en: string[];
    es: string[];
  };
}

export interface ExerciseRepository {
  getAll(): Promise<Exercise[]>;
  getById(id: string): Promise<Exercise | null>;
  getCategories(): Promise<string[]>;
  getBodyParts(): Promise<string[]>;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| **Unit** | `StaticExerciseRepository` filtering, search normalization, store state transitions | Vitest |
| **Component** | `ExerciseCard`, `FilterBar`, `ExerciseModal` rendering and interactions | React Testing Library + jsdom |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration required. Fresh project initialization.
