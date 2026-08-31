# Delta for user-profile

## MODIFIED Requirements

### Requirement: Profile Fields

The system MUST collect the following fields from the user:
- `age` (integer, years, range 10–99)
- `weight` (number, range in selected unit: 44–660 lbs, 20–300 kg)
- `weightUnit` (enum: `lbs` | `kg`, default `lbs`)
- `targetWeight` (number, range in selected unit: 44–660 lbs, 20–300 kg)
- `height` (number, centimetres, range 100–250)
- `sex` (enum: `male` | `female` | `other`)
- `experience` (enum: `beginner` | `intermediate` | `advanced`)

(Previously: targetWeight was not collected; weight was solely in kg)

#### Scenario: Valid profile submission with target weight

- GIVEN the user has filled all fields including targetWeight with valid values
- WHEN the user submits the profile form
- THEN the system MUST persist the profile to localStorage under the key `bodyflow:profile`
- AND display a confirmation that the profile was saved

#### Scenario: Missing or invalid target weight

- GIVEN the user enters a current weight but leaves targetWeight empty or out of range
- WHEN the user attempts to submit
- THEN the system MUST prevent submission and display a field-level validation error
- AND MUST NOT overwrite any previously saved profile
