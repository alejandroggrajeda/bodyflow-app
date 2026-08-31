import { Exercise, ExerciseFilterCriteria } from '../entities/exercise.ts';

export interface ExerciseRepository {
  getAll(): Promise<Exercise[]>;
  getById(id: string): Promise<Exercise | null>;
  search(criteria: ExerciseFilterCriteria): Promise<Exercise[]>;
  getBodyParts(): Promise<string[]>;
  getTargetMuscles(): Promise<string[]>;
}
