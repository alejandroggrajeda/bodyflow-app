# Delta for exercise-catalog

## MODIFIED Requirements

### Requirement: Filter and Search Exercises

The system MUST allow users to filter exercises by target body part/muscle, equipment requirement (`all` | `floor-only` | `with-apparatus`), and search exercises by text query in real-time.
(Previously: only filtered by muscle and query, no equipment filter)

#### Scenario: Filter by muscle group
- GIVEN a catalog with 325 bodyweight exercises
- WHEN the user selects the "chest" filter
- THEN the system MUST display only exercises targeting the chest
- AND the exercise count counter MUST update to reflect the filtered results

#### Scenario: Filter by floor-only (zero equipment)
- GIVEN the exercise catalog
- WHEN the user activates the "Solo Suelo" filter
- THEN the system MUST display only exercises that require no apparatus or furniture
- AND MUST NOT display any exercise requiring pull-up bars, dip bars, or benches

#### Scenario: Search by keyword
- GIVEN the exercise catalog view
- WHEN the user types "push-up" in the search input
- THEN the catalog MUST show exercises whose name matches "push-up" case-insensitively

#### Scenario: No matching results
- GIVEN active filter or search query
- WHEN no exercises match the criteria
- THEN the system MUST display an informative empty state with a "Clear filters" action

### Requirement: Responsive Exercise Grid

The catalog MUST render exercise cards in a mobile-responsive grid with thumbnail image, exercise title, target muscle tag, and equipment requirement badge.
(Previously: no equipment requirement badge)

#### Scenario: Exercise card rendering
- GIVEN an exercise in the catalog
- WHEN the exercise card is rendered
- THEN it MUST display the thumbnail image, title, target muscle pill, and equipment badge ("Sin Equipo" or "Barra/Apoyo")
- AND clicking anywhere on the card MUST trigger opening the exercise detail view
