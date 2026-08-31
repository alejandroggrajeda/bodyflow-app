# Delta for routine-generator

## MODIFIED Requirements

### Requirement: Exercise Selection Per Day

The system MUST select exercises from the existing dataset filtered by the day's assigned muscle groups AND the user's available equipment.
(Previously: only filtered by muscle group)

Each day MUST include a minimum of 3 exercises and a maximum of 8 exercises.

#### Scenario: User with full equipment access
- GIVEN a profile with `equipmentAccess = all`
- WHEN exercises are selected for a day
- THEN the day MAY include bar, furniture, and floor exercises

#### Scenario: User with floor-only preference (zero equipment)
- GIVEN a profile with `equipmentAccess = floor-only`
- WHEN exercises are selected for a day
- THEN the day MUST contain strictly exercises with `equipmentRequirement = none`
- AND MUST NOT contain any exercise requiring pull-up bars, dip bars, or benches

#### Scenario: Backfill when floor-only pulling exercises are sparse
- GIVEN a floor-only profile where a muscle category has fewer than 3 exercises
- WHEN exercises are selected for that day
- THEN the engine MUST backfill with core or full-body floor-only exercises to reach the minimum of 3
