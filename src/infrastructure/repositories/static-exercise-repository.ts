import {
  Exercise,
  ExerciseFilterCriteria,
  classifyEquipment,
} from '../../domain/entities/exercise.ts';
import { ExerciseRepository } from '../../domain/repositories/exercise-repository.ts';
import rawExercises from '../data/exercises.json';

export class StaticExerciseRepository implements ExerciseRepository {
  private readonly exercises: Exercise[];

  constructor(exercises: Exercise[] = rawExercises as Exercise[]) {
    this.exercises = exercises.map((ex) => ({
      ...ex,
      equipmentRequirement: ex.equipmentRequirement || classifyEquipment(ex),
    }));
  }

  async getAll(): Promise<Exercise[]> {
    return this.exercises;
  }

  async getById(id: string): Promise<Exercise | null> {
    const exercise = this.exercises.find((ex) => ex.id === id);
    return exercise || null;
  }

  async search(criteria: ExerciseFilterCriteria): Promise<Exercise[]> {
    return this.exercises.filter((exercise) => {
      if (criteria.searchQuery) {
        const query = criteria.searchQuery.trim().toLowerCase();
        const matchesName = exercise.name.toLowerCase().includes(query);
        const matchesTarget = exercise.targetMuscle.toLowerCase().includes(query);
        if (!matchesName && !matchesTarget) {
          return false;
        }
      }

      if (criteria.bodyPart && criteria.bodyPart !== 'all') {
        const targetPart = criteria.bodyPart.toLowerCase();
        const matchesBodyPart = exercise.bodyPart.toLowerCase() === targetPart;
        const matchesCategory = exercise.category.toLowerCase() === targetPart;
        if (!matchesBodyPart && !matchesCategory) {
          return false;
        }
      }

      if (criteria.targetMuscle && criteria.targetMuscle !== 'all') {
        const target = criteria.targetMuscle.toLowerCase();
        if (exercise.targetMuscle.toLowerCase() !== target) {
          return false;
        }
      }

      if (criteria.equipmentFilter && criteria.equipmentFilter !== 'all') {
        const req = exercise.equipmentRequirement || 'none';
        if (criteria.equipmentFilter === 'floor-only') {
          if (req !== 'none') return false;
        } else if (criteria.equipmentFilter === 'apparatus') {
          if (req === 'none') return false;
        }
      }

      return true;
    });
  }

  async getBodyParts(): Promise<string[]> {
    const parts = new Set<string>();
    for (const ex of this.exercises) {
      if (ex.bodyPart) {
        parts.add(ex.bodyPart.toLowerCase());
      }
    }
    return Array.from(parts).sort();
  }

  async getTargetMuscles(): Promise<string[]> {
    const targets = new Set<string>();
    for (const ex of this.exercises) {
      if (ex.targetMuscle) {
        targets.add(ex.targetMuscle.toLowerCase());
      }
    }
    return Array.from(targets).sort();
  }
}
