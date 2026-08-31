# Routine Management Specification

## Purpose

Allows users to save generated routines, browse saved routines, load a routine for review,
and delete routines they no longer need. All persistence is localStorage-based.

## Requirements

### Requirement: Save Routine

The system MUST allow the user to save a generated routine with a user-provided name.

#### Scenario: Save new routine

- GIVEN a routine has been generated and is displayed
- WHEN the user provides a name and taps "Save"
- THEN the routine MUST be persisted to localStorage under `bodyflow:routines` as a JSON array entry
- AND the saved routines list MUST immediately reflect the new entry

#### Scenario: Duplicate name

- GIVEN a routine named "Morning Power" already exists in localStorage
- WHEN the user saves a new routine with the same name
- THEN the system MUST prompt the user to confirm overwrite or choose a different name
- AND MUST NOT silently replace the existing routine

#### Scenario: Storage limit reached

- GIVEN 10 routines are already saved
- WHEN the user attempts to save an 11th routine
- THEN the system MUST display a warning explaining the 10-routine limit
- AND MUST NOT save the new routine until the user deletes an existing one

### Requirement: List Saved Routines

The system MUST display all saved routines on the Routines page, ordered by most recently saved first.

#### Scenario: Routines exist

- GIVEN at least one routine is saved in localStorage
- WHEN the user navigates to the Routines page
- THEN each saved routine MUST be shown as a card with its name, creation date, and number of days

#### Scenario: No routines saved

- GIVEN `bodyflow:routines` is empty or absent
- WHEN the user navigates to the Routines page
- THEN the system MUST display an empty state with a call-to-action to generate a routine

### Requirement: Load Routine

The user MUST be able to tap a saved routine to view its full day-by-day exercise list.

#### Scenario: Load routine detail

- GIVEN a saved routine is listed on the Routines page
- WHEN the user taps it
- THEN the system MUST navigate to the Routine Detail page and display all days and exercises
- AND each exercise MUST be tappable to open the catalog detail modal (GIF + instructions)

### Requirement: Delete Routine

The user MUST be able to delete any saved routine.

#### Scenario: Delete with confirmation

- GIVEN a saved routine card is displayed
- WHEN the user triggers the delete action
- THEN the system MUST ask for confirmation before deleting
- AND upon confirmation MUST remove the entry from localStorage and from the list immediately

#### Scenario: Delete cancellation

- GIVEN the delete confirmation dialog is open
- WHEN the user cancels
- THEN the routine MUST remain in localStorage unchanged

### Requirement: Routine Data Integrity

Saved routines MUST reference exercise IDs from the static dataset.

#### Scenario: Exercise ID resolution

- GIVEN a saved routine contains exercise IDs
- WHEN the detail page loads those exercises
- THEN each ID MUST resolve to an exercise in the local dataset
- AND unresolvable IDs MUST be silently skipped with a visible "exercise unavailable" placeholder
