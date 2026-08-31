# Delta for exercise-catalog

## ADDED Requirements

### Requirement: Filter and Search Exercises

The system MUST allow users to filter exercises by target body part/muscle and search exercises by text query in real-time.

#### Scenario: Filter by muscle group
- GIVEN a catalog with 325 bodyweight exercises
- WHEN the user selects the "chest" filter
- THEN the system MUST display only exercises targeting the chest
- AND the exercise count counter MUST update to reflect the filtered results

#### Scenario: Search by keyword
- GIVEN the exercise catalog view
- WHEN the user types "push-up" in the search input
- THEN the catalog MUST show exercises whose name matches "push-up" case-insensitively

#### Scenario: No matching results
- GIVEN active filter or search query
- WHEN no exercises match the criteria
- THEN the system MUST display an informative empty state with a "Clear filters" action

### Requirement: Responsive Exercise Grid

The catalog MUST render exercise cards in a mobile-responsive grid with thumbnail image, exercise title, and target muscle tag.

#### Scenario: Exercise card rendering
- GIVEN an exercise in the catalog
- WHEN the exercise card is rendered
- THEN it MUST display the 180x180 thumbnail image, title, and target muscle pill
- AND clicking anywhere on the card MUST trigger opening the exercise detail view
