# Proposal: Single Source of Truth HD Exercise Catalog

## Intent

Replace the fragmented, mixed-dataset approach with a unified, single source of truth for all exercises and visual assets using `yuhonas/free-exercise-db`. This eliminates Frankenstein name-matching, guarantees 100% consistent high-resolution studio photography across every single exercise, and provides a clean, maintainable dataset architecture.

## Scope

### In Scope
- Adopt `yuhonas/free-exercise-db` as the sole canonical dataset for all bodyweight calisthenics exercises (~230+ exercises).
- Ingest and normalize all exercise entities to the standard `Exercise` interface with high-resolution photography (`[0.jpg, 1.jpg]`), target muscles, equipment requirement classification (`none` vs `bar` vs `furniture`), and dual-language instruction support.
- Update `src/infrastructure/data/exercises.json` with the canonical data.
- Update repository, tests, and specs to reflect the unified single-source catalog.

### Out of Scope
- Adding non-bodyweight equipment (dumbbells, barbells, machines).

## Capabilities

### Modified Capabilities
- `exercise-catalog`: Canonical dataset migrated to single-source HD studio photography.
- `routine-generator`: Exercise pool backed by canonical HD catalog.

## Approach

1. Fetch and process the complete bodyweight dataset from `yuhonas/free-exercise-db`.
2. Normalize all fields (mapping primary muscles to our category taxonomy: `chest`, `back`, `arms`, `legs`, `waist`, `shoulders`, `cardio`).
3. Set `thumbnailUrl` to Phase 1 HD image and `images` to `[Phase 1 HD, Phase 2 HD]`.
4. Overwrite `src/infrastructure/data/exercises.json` with the verified single-source data.
5. Verify that all 13 test suites pass cleanly with 100% coverage.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/infrastructure/data/exercises.json` | Modified | Overwritten with canonical Yuhonas bodyweight dataset |
| `src/infrastructure/repositories/static-exercise-repository.ts` | Modified | Data ingestion and search indexing |
| `test/infrastructure/static-exercise-repository.test.ts` | Modified | Tests updated for canonical dataset count |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Exercise count changes from 325 to ~233 | Low | 233 is a massive, clean bodyweight library with zero duplicates or weird entries |

## Rollback Plan

Revert git commit.

## Success Criteria

- [ ] 100% of exercises in the catalog have verified, working HD studio photography (Phase 1 & Phase 2).
- [ ] 0% legacy 3D avatar GIFs or fallback artifacts.
- [ ] 100% tests passing in Vitest with clean TypeScript build.
