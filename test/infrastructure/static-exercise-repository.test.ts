import { describe, it, expect, beforeEach } from 'vitest';
import { StaticExerciseRepository } from '../../src/infrastructure/repositories/static-exercise-repository.ts';

describe('StaticExerciseRepository', () => {
  let repository: StaticExerciseRepository;

  beforeEach(() => {
    repository = new StaticExerciseRepository();
  });

  it('should load all 325 bodyweight exercises', async () => {
    const exercises = await repository.getAll();
    expect(exercises.length).toBe(325);
  });

  it('should find exercise by ID', async () => {
    const exercise = await repository.getById('0001');
    expect(exercise).not.toBeNull();
    expect(exercise?.id).toBe('0001');
    expect(exercise?.name).toBe('3/4 sit-up');
    expect(exercise?.bodyPart).toBe('waist');
  });

  it('should return null for non-existent ID', async () => {
    const exercise = await repository.getById('non-existent-id');
    expect(exercise).toBeNull();
  });

  it('should filter exercises by search query', async () => {
    const results = await repository.search({ searchQuery: 'push-up' });
    expect(results.length).toBeGreaterThan(0);
    results.forEach((ex) => {
      expect(ex.name.toLowerCase()).toContain('push-up');
    });
  });

  it('should filter exercises by body part', async () => {
    const results = await repository.search({ bodyPart: 'chest' });
    expect(results.length).toBeGreaterThan(0);
    results.forEach((ex) => {
      expect(ex.bodyPart.toLowerCase()).toBe('chest');
    });
  });

  it('should combine search query and body part filters', async () => {
    const results = await repository.search({ searchQuery: 'push', bodyPart: 'chest' });
    expect(results.length).toBeGreaterThan(0);
    results.forEach((ex) => {
      expect(ex.name.toLowerCase()).toContain('push');
      expect(ex.bodyPart.toLowerCase()).toBe('chest');
    });
  });

  it('should return unique list of body parts', async () => {
    const bodyParts = await repository.getBodyParts();
    expect(bodyParts).toContain('chest');
    expect(bodyParts).toContain('waist');
    expect(new Set(bodyParts).size).toBe(bodyParts.length);
  });
});
