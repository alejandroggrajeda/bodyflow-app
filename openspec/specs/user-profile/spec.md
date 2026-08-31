# User Profile Specification

## Purpose

Captures and persists the user's physical data and fitness experience level.
This profile is the sole input to the routine generation engine.

## Requirements

### Requirement: Profile Fields

The system MUST collect the following fields from the user:
- `age` (integer, years, range 10–99)
- `weight` (number, kilograms, range 20–300)
- `height` (number, centimetres, range 100–250)
- `sex` (enum: `male` | `female` | `other`)
- `experience` (enum: `beginner` | `intermediate` | `advanced`)

#### Scenario: Valid profile submission

- GIVEN the user has filled all fields with valid values
- WHEN the user submits the profile form
- THEN the system MUST persist the profile to localStorage under the key `bodyflow:profile`
- AND display a confirmation that the profile was saved

#### Scenario: Invalid field value

- GIVEN the user enters an out-of-range value (e.g. age = 0)
- WHEN the user attempts to submit
- THEN the system MUST prevent submission and display a field-level validation error
- AND MUST NOT overwrite any previously saved profile

### Requirement: Profile Persistence

The profile MUST survive browser page reloads.

#### Scenario: Reload with existing profile

- GIVEN a profile has been saved to localStorage
- WHEN the user navigates to the profile page after a reload
- THEN all fields MUST be pre-filled with the previously saved values

#### Scenario: No profile saved yet

- GIVEN localStorage has no `bodyflow:profile` key
- WHEN the user opens the profile page for the first time
- THEN all fields MUST be empty and the generate button MUST be disabled

### Requirement: Profile Editability

The user MUST be able to update any profile field at any time.

#### Scenario: Edit and save

- GIVEN an existing profile is loaded in the form
- WHEN the user changes one or more fields and submits
- THEN the system MUST overwrite `bodyflow:profile` with the updated values
- AND any subsequently generated routine MUST use the new values

### Requirement: BMI Derivation

The system MUST compute BMI from weight and height as a derived value (not stored).

#### Scenario: BMI calculation

- GIVEN `weight = 70 kg` and `height = 175 cm`
- WHEN the routine engine consumes the profile
- THEN BMI MUST equal `70 / (1.75)^2 = 22.86` (normal range)
