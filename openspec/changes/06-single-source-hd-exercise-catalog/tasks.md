# Tasks: Single Source of Truth HD Exercise Catalog

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | ~120 lines (code & tests) |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: stacked-to-main
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Canonical dataset ingestion, normalization, repository tests update | PR 1 | `pnpm test` | `pnpm test && pnpm run build` | Revert commit |

## Phase 1: Canonical Data Ingestion & Normalization

- [x] 1.1 Ingest bodyweight exercises from `yuhonas/free-exercise-db` and normalize into `src/infrastructure/data/exercises.json`
- [x] 1.2 Verify all exercises contain valid HD `thumbnailUrl`, `images` `[0.jpg, 1.jpg]`, category, and instructions

## Phase 2: Repository & Test Verification

- [x] 2.1 Update `test/infrastructure/static-exercise-repository.test.ts` to test canonical exercise count and HD assets
- [x] 2.2 Run `pnpm test` and `pnpm run build` to verify 100% test pass rate across all 13 suites
