# Delta for exercise-detail

## ADDED Requirements

### Requirement: Animated Exercise Execution View

The system MUST display an interactive modal with the full animated execution GIF, muscle engagement details, and step-by-step instructions upon selecting an exercise.

#### Scenario: Open exercise detail modal
- GIVEN the user is browsing the catalog
- WHEN the user clicks on an exercise card
- THEN a modal MUST open displaying the animated GIF execution
- AND it MUST display target muscles, secondary muscles, and step-by-step instructions

#### Scenario: Language toggle for instructions
- GIVEN the exercise detail modal is open
- WHEN the user switches the language selector between Spanish and English
- THEN the instruction steps MUST immediately update to the selected language without reloading

#### Scenario: Close exercise detail
- GIVEN the exercise detail modal is open
- WHEN the user clicks the close button, clicks the backdrop, or presses the ESC key
- THEN the modal MUST close and restore focus to the catalog view
