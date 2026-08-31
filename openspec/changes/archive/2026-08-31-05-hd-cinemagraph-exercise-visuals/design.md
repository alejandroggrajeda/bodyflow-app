# Design: HD Cinemagraph Visuals & Dual-Frame Exercise Motion

## Technical Approach

Build a dedicated presentational component `CinemagraphViewer.tsx` that manages dual-frame image rendering:
- Preloads both image frames simultaneously in absolute-positioned stacked containers.
- Transitions smoothly between Frame 0 (Starting position) and Frame 1 (Peak contraction) via CSS opacity transitions (`transition-opacity duration-300`).
- Provides interactive playback controls: Play/Pause button and manual Phase 1 / Phase 2 tabs.
- Falls back seamlessly to single image / GIF if only 1 image URL is provided.
- Guarantees Zero Layout Shift with `aspect-[4/3]` container.

## Architecture Decisions

### Decision: Stacked Preloaded Image Frames vs Dynamic Source Swapping

| Option | Tradeoffs | Decision |
|---|---|---|
| A. Stacked Preloaded `<img>` tags with CSS Opacity Crossfade | Zero flicker, smooth crossfade, instant frame toggling without network roundtrips | **Chosen** |
| B. Single `<img>` changing `src` on interval | White flash / flicker between frame switches while image is decoding | Rejected |

### Decision: Loop Interval Duration

Chosen: **900ms**.
Rationale: Perfectly matches typical human calisthenics cadence (concentric and eccentric phases) without feeling rushed or sluggish.

## Interfaces / Contracts

```typescript
export interface CinemagraphViewerProps {
  images?: string[];
  fallbackUrl: string;
  alt: string;
}
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/domain/entities/exercise.ts` | Modify | Add optional `images?: string[]` to `Exercise` |
| `src/infrastructure/repositories/static-exercise-repository.ts` | Modify | Attach HD dual-frame images |
| `src/ui/components/detail/CinemagraphViewer.tsx` | Create | Dual-frame cinemagraph motion player component |
| `src/ui/components/detail/ExerciseModal.tsx` | Modify | Embed `CinemagraphViewer` |

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit (UI) | `CinemagraphViewer` renders both frames, handles play/pause toggle, and switches frames on click | `test/ui/cinemagraph-viewer.test.tsx` |
| Integration (UI) | `ExerciseModal` integrates `CinemagraphViewer` without layout shift | `test/ui/components.test.tsx` |

## Threat Matrix

`N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.`
