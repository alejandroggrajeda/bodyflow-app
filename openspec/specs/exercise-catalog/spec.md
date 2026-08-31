# Exercise Catalog Specification

## Purpose

Provides a responsive, searchable, and filterable catalog of bodyweight calisthenics exercises with zero layout shifts, instant offline access, and 100% canonical high-definition studio photography.

## Requirements

### Requirement: Canonical Exercise Dataset

The system MUST load a canonical, single-source dataset of 233 calisthenics exercises backed exclusively by HD studio photography (`images: [0.jpg, 1.jpg]`).

#### Scenario: All exercises possess HD dual-phase photography
- GIVEN the initialized exercise repository
- WHEN all exercises are inspected
- THEN every exercise MUST contain valid `images` with at least 2 high-resolution photography URLs
- AND `thumbnailUrl` MUST point to the first HD phase image

### Requirement: Filter and Search Exercises

The system MUST allow users to filter exercises by target body part/muscle, equipment requirement (`all` | `floor-only` | `with-apparatus`), and search exercises by text query in real-time.

#### Scenario: Filter by muscle group
- GIVEN a catalog with 233 bodyweight exercises
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

#### Scenario: Exercise card rendering
- GIVEN an exercise in the catalog
- WHEN the exercise card is rendered
- THEN it MUST display the thumbnail image, title, target muscle pill, and equipment badge ("Sin Equipo" or "Barra/Apoyo")
- AND clicking anywhere on the card MUST trigger opening the exercise detail view

### Requirement: Exercise Modal Detail View

The system MUST display an interactive modal when an exercise is selected, featuring an HD dual-phase Cinemagraph motion viewer, target and secondary muscle groups, equipment badge, and step-by-step instructions with language toggle.

#### Scenario: Open modal with dual-phase motion viewer
- GIVEN a user clicks an exercise in the catalog or routine detail
- WHEN the modal opens
- THEN the system MUST render the `CinemagraphViewer` in an aspect-ratio container
- AND start playing the alternating loop between Starting Phase and Peak Contraction Phase
- AND provide interactive controls to pause/play and manually switch phases

#### Scenario: Close modal
- GIVEN the modal is currently open
- WHEN the user clicks the close button, backdrop, or presses Escape
- THEN the modal MUST close and stop any active animation interval
