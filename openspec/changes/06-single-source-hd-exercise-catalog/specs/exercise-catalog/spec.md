# Delta for exercise-catalog

## MODIFIED Requirements

### Requirement: Canonical Exercise Dataset

The system MUST load a canonical, single-source dataset of calisthenics exercises backed exclusively by HD studio photography (`images: [0.jpg, 1.jpg]`).
(Previously: used 325-item legacy 3D GIF dataset)

#### Scenario: All exercises possess HD dual-phase photography
- GIVEN the initialized exercise repository
- WHEN all exercises are inspected
- THEN every exercise MUST contain valid `images` with at least 2 high-resolution photography URLs
- AND `thumbnailUrl` MUST point to the first HD phase image

#### Scenario: Muscle categorization and search indexing
- GIVEN the canonical dataset
- WHEN searching or filtering by muscle category (`chest`, `back`, `arms`, `legs`, `waist`, `shoulders`, `cardio`)
- THEN exercises MUST be properly indexed according to their primary targeted anatomy
