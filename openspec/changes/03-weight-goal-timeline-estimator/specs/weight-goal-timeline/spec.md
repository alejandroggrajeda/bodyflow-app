# Weight Goal Timeline Specification

## Purpose

Calculates safe, realistic weekly duration estimates to reach a desired target weight via bodyweight training and conservative metabolic heuristics.

## Requirements

### Requirement: Timeline Estimation Calculation

The system MUST compute estimated weeks to reach the target weight based on current weight, target weight, experience level, and unit.

Rates:
- **Weight Loss**: 0.4 kg/week (beginner), 0.6 kg/week (intermediate/advanced)
- **Weight Gain**: 0.2 kg/week (beginner), 0.25 kg/week (intermediate/advanced)
- **Maintenance**: 0 weeks when current weight equals target weight

#### Scenario: Weight loss estimation
- GIVEN current weight 80 kg and target weight 74 kg (delta = -6 kg) for an intermediate user
- WHEN `estimateWeightTimeline` is evaluated
- THEN estimated weeks MUST equal `Math.ceil(6 / 0.6) = 10` weeks
- AND direction MUST be `lose`

#### Scenario: Weight gain estimation
- GIVEN current weight 65 kg and target weight 70 kg (delta = +5 kg) for a beginner user
- WHEN `estimateWeightTimeline` is evaluated
- THEN estimated weeks MUST equal `Math.ceil(5 / 0.2) = 25` weeks
- AND direction MUST be `gain`

#### Scenario: Maintenance estimation
- GIVEN current weight 70 kg and target weight 70 kg (delta = 0)
- WHEN `estimateWeightTimeline` is evaluated
- THEN estimated weeks MUST be `0`
- AND direction MUST be `maintain`

### Requirement: Timeline UI Presentation

The system MUST render a timeline estimate card on `RoutineDetailPage` when a routine profile contains `targetWeight`.

#### Scenario: Display timeline card
- GIVEN an active routine with `profileSnapshot.targetWeight` set
- WHEN the user views `RoutineDetailPage`
- THEN the system MUST render the estimated weeks, target date, weekly progress rate, and non-medical disclaimer
