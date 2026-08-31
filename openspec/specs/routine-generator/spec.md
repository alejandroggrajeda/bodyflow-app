# Routine Generator Specification

## Purpose

Pure local rule engine that maps a `UserProfile` to a structured weekly workout plan.
No external API calls. Output is deterministic given the same profile inputs.

## Requirements

### Requirement: Weekly Plan Generation

The system MUST generate a weekly plan when given a valid `UserProfile`.

Training frequency by experience:
| Experience | Days/week |
|------------|-----------|
| beginner | 3 |
| intermediate | 4 |
| advanced | 5 |

#### Scenario: Beginner profile generates 3-day plan

- GIVEN a profile with `experience = beginner`
- WHEN `generateRoutine(profile)` is called
- THEN the returned plan MUST contain exactly 3 `RoutineDay` entries

#### Scenario: Advanced profile generates 5-day plan

- GIVEN a profile with `experience = advanced`
- WHEN `generateRoutine(profile)` is called
- THEN the returned plan MUST contain exactly 5 `RoutineDay` entries

### Requirement: Muscle Group Day Assignment

The system MUST assign muscle groups to each day using a deterministic split:

| Days | Split type |
|------|-----------|
| 3 | Full-body (all major groups each session) |
| 4 | Upper / Lower / Upper / Lower |
| 5 | Push / Pull / Legs / Push / Pull |

#### Scenario: 3-day full-body split

- GIVEN `experience = beginner` (3 days)
- WHEN the plan is generated
- THEN each day MUST target all major muscle groups (chest, back, legs, core, shoulders)

#### Scenario: 5-day push/pull/legs split

- GIVEN `experience = advanced` (5 days)
- WHEN the plan is generated
- THEN Day 1 MUST target push muscles, Day 2 pull muscles, Day 3 legs/core

### Requirement: Exercise Selection Per Day

The system MUST select exercises from the existing dataset filtered by the day's assigned muscle groups.

Each day MUST include a minimum of 3 exercises and a maximum of 8 exercises.

#### Scenario: Sufficient exercises exist for the muscle group

- GIVEN the dataset has ≥ 3 exercises for the assigned muscle groups
- WHEN exercises are selected for a day
- THEN the day MUST contain between 3 and 8 exercises drawn from those groups

#### Scenario: Insufficient exercises in dataset (edge case)

- GIVEN fewer than 3 exercises exist for a specific muscle group
- WHEN exercises are selected for that day
- THEN the engine MUST backfill with full-body or core exercises to reach the minimum of 3

### Requirement: Volume Calibration

Sets, reps, and rest MUST be calibrated by experience level:

| Experience | Sets | Reps | Rest (s) |
|------------|------|------|----------|
| beginner | 2 | 8–10 | 90 |
| intermediate | 3 | 10–12 | 60 |
| advanced | 4 | 12–15 | 45 |

#### Scenario: Beginner volume

- GIVEN `experience = beginner`
- WHEN the plan is generated
- THEN every exercise in the plan MUST have `sets = 2`, `reps` in range `[8, 10]`, `rest = 90`

### Requirement: Deterministic Output

Given identical profile inputs, the engine MUST always return the same plan.

#### Scenario: Same profile, same result

- GIVEN the same `UserProfile` object is passed twice
- WHEN `generateRoutine` is called both times
- THEN the exercise order and selection MUST be identical in both results
