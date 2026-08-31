# Delta for exercise-catalog

## MODIFIED Requirements

### Requirement: Exercise Modal Detail View

The system MUST display an interactive modal when an exercise is selected, featuring an HD dual-phase Cinemagraph motion viewer, target and secondary muscle groups, equipment badge, and step-by-step instructions with language toggle.
(Previously: used single animated GIF)

#### Scenario: Open modal with dual-phase motion viewer
- GIVEN a user clicks an exercise in the catalog or routine detail
- WHEN the modal opens
- THEN the system MUST render the `CinemagraphViewer` in an aspect-ratio container
- AND start playing the alternating loop between Starting Phase and Peak Contraction Phase
- AND provide interactive controls to pause/play and manually switch phases

#### Scenario: Graceful fallback when single image available
- GIVEN an exercise with only one image frame or fallback GIF
- WHEN the modal opens
- THEN the system MUST display the available visual asset without breaking layout or throwing errors
- AND disable multi-phase scrubbing controls gracefully

#### Scenario: Close modal
- GIVEN the modal is currently open
- WHEN the user clicks the close button, backdrop, or presses Escape
- THEN the modal MUST close and stop any active animation interval
