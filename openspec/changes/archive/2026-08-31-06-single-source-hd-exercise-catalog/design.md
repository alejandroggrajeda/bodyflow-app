# Design: Single Source of Truth HD Exercise Catalog

## Technical Approach

Ingest the entire bodyweight exercise library from `yuhonas/free-exercise-db` (`equipment === 'body only' || equipment === 'other'`), normalize each record into the strict `Exercise` domain model, and replace `src/infrastructure/data/exercises.json`.

## Data Normalization Rules

### Muscle Group Taxonomy

| Yuhonas primaryMuscles | BodyFlow category | BodyFlow bodyPart |
|---|---|---|
| `abdominals` | `waist` | `waist` |
| `chest` | `chest` | `chest` |
| `lats`, `middle back`, `lower back`, `traps` | `back` | `back` |
| `biceps`, `triceps`, `forearms` | `arms` | `arms` |
| `quadriceps`, `hamstrings`, `calves`, `glutes`, `adductors`, `abductors` | `legs` | `legs` |
| `shoulders`, `neck` | `shoulders` | `shoulders` |

### Visual Asset URLs

- Base URL: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/`
- `thumbnailUrl`: `${BaseUrl}${images[0]}`
- `images`: `${BaseUrl}${img}` for all frames in `images` array
- `gifUrl`: Fallback to `${BaseUrl}${images[0]}` (no 3D GIF dependencies)

## File Changes

| File | Action | Description |
|---|---|---|
| `src/infrastructure/data/exercises.json` | Overwrite | 100% canonical HD bodyweight dataset |
| `test/infrastructure/static-exercise-repository.test.ts` | Modify | Update test assertions to match canonical dataset |

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Infrastructure | Repository loads canonical dataset, every item has HD `images` and valid categories | `test/infrastructure/static-exercise-repository.test.ts` |
| End-to-End Test Suite | 72+ tests pass with new dataset | `pnpm test` |

## Threat Matrix

`N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.`
