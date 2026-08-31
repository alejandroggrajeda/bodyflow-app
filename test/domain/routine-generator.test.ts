import { describe, it, expect } from 'vitest';
import { generateRoutine } from '../../src/domain/services/routine-generator.ts';
import { UserProfile } from '../../src/domain/entities/user-profile.ts';
import { Exercise } from '../../src/domain/entities/exercise.ts';
import exercisesData from '../../src/infrastructure/data/exercises.json';

describe('RoutineGeneratorService (Strict TDD & Spec Compliance)', () => {
  const allExercises = exercisesData as Exercise[];

  const beginnerProfile: UserProfile = {
    age: 30,
    weight: 70,
    targetWeight: 68,
    weightUnit: 'kg',
    height: 175,
    sex: 'male',
    experience: 'beginner',
  };

  const intermediateProfile: UserProfile = {
    age: 25,
    weight: 80,
    targetWeight: 75,
    weightUnit: 'kg',
    height: 180,
    sex: 'female',
    experience: 'intermediate',
  };

  const advancedProfile: UserProfile = {
    age: 35,
    weight: 85,
    targetWeight: 82,
    weightUnit: 'kg',
    height: 185,
    sex: 'other',
    experience: 'advanced',
  };

  describe('Training Frequency & Split Mapping', () => {
    it('generates a 3-day full-body split for beginner', () => {
      const routine = generateRoutine(beginnerProfile, allExercises);
      expect(routine.days).toHaveLength(3);
      expect(routine.days[0].label).toContain('Full Body');
      expect(routine.days[1].label).toContain('Full Body');
      expect(routine.days[2].label).toContain('Full Body');
    });

    it('generates a 4-day upper/lower split for intermediate', () => {
      const routine = generateRoutine(intermediateProfile, allExercises);
      expect(routine.days).toHaveLength(4);
      expect(routine.days[0].label).toContain('Superior');
      expect(routine.days[1].label).toContain('Inferior');
      expect(routine.days[2].label).toContain('Superior');
      expect(routine.days[3].label).toContain('Inferior');
    });

    it('generates a 5-day push/pull/legs split for advanced', () => {
      const routine = generateRoutine(advancedProfile, allExercises);
      expect(routine.days).toHaveLength(5);
      expect(routine.days[0].label).toContain('Empuje');
      expect(routine.days[1].label).toContain('Tracción');
      expect(routine.days[2].label).toContain('Pierna');
    });
  });

  describe('Volume & Rest Calibration', () => {
    it('calibrates beginner volume to 2 sets, 8-10 reps, 90s rest', () => {
      const routine = generateRoutine(beginnerProfile, allExercises);
      for (const day of routine.days) {
        for (const ex of day.exercises) {
          expect(ex.sets).toBe(2);
          expect(ex.reps).toEqual([8, 10]);
          expect(ex.restSeconds).toBe(90);
        }
      }
    });

    it('calibrates intermediate volume to 3 sets, 10-12 reps, 60s rest', () => {
      const routine = generateRoutine(intermediateProfile, allExercises);
      for (const day of routine.days) {
        for (const ex of day.exercises) {
          expect(ex.sets).toBe(3);
          expect(ex.reps).toEqual([10, 12]);
          expect(ex.restSeconds).toBe(60);
        }
      }
    });

    it('calibrates advanced volume to 4 sets, 12-15 reps, 45s rest', () => {
      const routine = generateRoutine(advancedProfile, allExercises);
      for (const day of routine.days) {
        for (const ex of day.exercises) {
          expect(ex.sets).toBe(4);
          expect(ex.reps).toEqual([12, 15]);
          expect(ex.restSeconds).toBe(45);
        }
      }
    });
  });

  describe('Exercise Selection and Constraints', () => {
    it('selects between 3 and 8 exercises for each day', () => {
      const routine = generateRoutine(beginnerProfile, allExercises);
      for (const day of routine.days) {
        expect(day.exercises.length).toBeGreaterThanOrEqual(3);
        expect(day.exercises.length).toBeLessThanOrEqual(8);
      }
    });

    it('backfills with core or general exercises if a muscle group has fewer than 3 exercises', () => {
      const sparseExercises: Exercise[] = [
        {
          id: 'test-1',
          name: 'Rare Exercise',
          category: 'chest',
          bodyPart: 'chest',
          equipment: 'body weight',
          targetMuscle: 'pectorals',
          secondaryMuscles: [],
          thumbnailUrl: '',
          gifUrl: '',
          instructions: { en: [], es: [] },
        },
        {
          id: 'test-2',
          name: 'Rare Core 1',
          category: 'waist',
          bodyPart: 'waist',
          equipment: 'body weight',
          targetMuscle: 'abs',
          secondaryMuscles: [],
          thumbnailUrl: '',
          gifUrl: '',
          instructions: { en: [], es: [] },
        },
        {
          id: 'test-3',
          name: 'Rare Core 2',
          category: 'waist',
          bodyPart: 'waist',
          equipment: 'body weight',
          targetMuscle: 'abs',
          secondaryMuscles: [],
          thumbnailUrl: '',
          gifUrl: '',
          instructions: { en: [], es: [] },
        },
      ];

      const routine = generateRoutine(beginnerProfile, sparseExercises);
      expect(routine.days[0].exercises.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Determinism', () => {
    it('produces the exact same routine given the same profile inputs twice', () => {
      const routine1 = generateRoutine(intermediateProfile, allExercises);
      const routine2 = generateRoutine(intermediateProfile, allExercises);

      expect(routine1.days.length).toBe(routine2.days.length);
      for (let d = 0; d < routine1.days.length; d++) {
        expect(routine1.days[d].exercises).toEqual(routine2.days[d].exercises);
      }
    });
  });
});
