# Proposal: HD Cinemagraph Visuals & Dual-Frame Exercise Motion

## Intent

The previous 3D animated GIF visual assets suffer from low resolution and 256-color palette compression artifacts. This proposal introduces HD studio dual-phase photography (`images: string[]`) and a smooth, continuous Cinemagraph motion player (alternating between Starting Phase and Peak Contraction Phase at ~900ms intervals with smooth crossfade and manual phase scrubbing) to provide a crisp, modern fitness app visual experience while preserving offline instant loading and zero layout shifts.

## Scope

### In Scope
- Add `images?: string[]` field to `Exercise` entity and map HD studio image frames for exercises.
- Create `CinemagraphViewer.tsx` component with:
  - Smooth continuous 2-phase loop animation (~900ms interval).
  - Play / Pause button.
  - Manual step selector ("Paso 1: Inicio" / "Paso 2: Contracción").
  - Aspect-ratio container guaranteeing CLS = 0.
- Update `ExerciseModal.tsx` to use `CinemagraphViewer`.
- Update `ExerciseCard.tsx` to support crisp HD thumbnail resolution with graceful fallback.

### Out of Scope
- Heavy uncompressed 100MB MP4 streaming or external video hosting services.

## Capabilities

### Modified Capabilities
- `exercise-catalog`: Add cinemagraph dual-frame motion player and HD studio visual assets.

## Approach

1. Update `Exercise` interface with optional `images?: string[]`.
2. Enhance `StaticExerciseRepository` to populate HD dual-frame images from `yuhonas/free-exercise-db` or CDN mapping where available, falling back gracefully to `thumbnailUrl`.
3. Implement `CinemagraphViewer.tsx` with React state hooks (`activeFrame`, `isPlaying`, `setInterval`) and smooth transitions.
4. Replace raw GIF `<img>` tag in `ExerciseModal.tsx` with `CinemagraphViewer`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/domain/entities/exercise.ts` | Modified | Add `images?: string[]` to `Exercise` |
| `src/ui/components/detail/CinemagraphViewer.tsx` | New | High-definition dual-phase animated player |
| `src/ui/components/detail/ExerciseModal.tsx` | Modified | Integrate `CinemagraphViewer` |
| `src/infrastructure/repositories/static-exercise-repository.ts` | Modified | Decorate exercises with HD image frames |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Missing dual-phase images for niche exercises | Low | Graceful fallback to existing `thumbnailUrl` / `gifUrl` when `images` array is empty or has 1 frame |

## Rollback Plan

Revert git commit. UI returns to previous single GIF playback without state corruption.

## Success Criteria

- [ ] `ExerciseModal` renders crisp HD dual-phase motion with smooth alternating loop.
- [ ] User can pause/play and manually switch between Phase 1 (Inicio) and Phase 2 (Contracción).
- [ ] Zero Layout Shift (CLS = 0) preserved across all screen sizes.
- [ ] 100% tests passing in Vitest with strict TDD.
