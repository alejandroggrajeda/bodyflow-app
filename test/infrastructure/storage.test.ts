import { describe, it, expect, beforeEach } from 'vitest';
import { ProfileStorage } from '../../src/infrastructure/storage/profile-storage.ts';
import { RoutineStorage } from '../../src/infrastructure/storage/routine-storage.ts';
import { UserProfile } from '../../src/domain/entities/user-profile.ts';
import { Routine } from '../../src/domain/entities/routine.ts';

describe('Storage Infrastructure (Strict TDD)', () => {
  const mockProfile: UserProfile = {
    age: 28,
    weight: 75,
    height: 178,
    sex: 'male',
    experience: 'intermediate',
  };

  const mockRoutine: Routine = {
    id: 'routine-1',
    name: 'Rutina Intermedia Full Body',
    createdAt: new Date().toISOString(),
    profileSnapshot: mockProfile,
    days: [
      {
        dayIndex: 1,
        label: 'Día 1 – Full Body',
        muscleGroups: ['chest', 'back', 'legs'],
        exercises: [
          { exerciseId: '0001', sets: 3, reps: [10, 12], restSeconds: 60 },
        ],
      },
    ],
  };

  beforeEach(() => {
    localStorage.clear();
  });

  describe('ProfileStorage', () => {
    it('returns null when no profile is saved', () => {
      const storage = new ProfileStorage();
      expect(storage.getProfile()).toBeNull();
    });

    it('saves and retrieves user profile correctly', () => {
      const storage = new ProfileStorage();
      storage.saveProfile(mockProfile);
      const retrieved = storage.getProfile();
      expect(retrieved).toEqual(mockProfile);
    });

    it('clears stored profile', () => {
      const storage = new ProfileStorage();
      storage.saveProfile(mockProfile);
      storage.clearProfile();
      expect(storage.getProfile()).toBeNull();
    });
  });

  describe('RoutineStorage', () => {
    it('returns empty array when no routines are saved', () => {
      const storage = new RoutineStorage();
      expect(storage.getRoutines()).toEqual([]);
    });

    it('saves a routine and retrieves it', () => {
      const storage = new RoutineStorage();
      storage.saveRoutine(mockRoutine);
      const list = storage.getRoutines();
      expect(list).toHaveLength(1);
      expect(list[0].id).toBe('routine-1');
      expect(list[0].name).toBe('Rutina Intermedia Full Body');
    });

    it('enforces maximum 10 routines limit', () => {
      const storage = new RoutineStorage();
      for (let i = 1; i <= 10; i++) {
        storage.saveRoutine({
          ...mockRoutine,
          id: `routine-${i}`,
          name: `Routine ${i}`,
        });
      }
      expect(storage.getRoutines()).toHaveLength(10);
      expect(() =>
        storage.saveRoutine({
          ...mockRoutine,
          id: 'routine-11',
          name: 'Routine 11',
        })
      ).toThrowError(/limit/i);
    });

    it('deletes a routine by id', () => {
      const storage = new RoutineStorage();
      storage.saveRoutine(mockRoutine);
      expect(storage.getRoutines()).toHaveLength(1);
      storage.deleteRoutine('routine-1');
      expect(storage.getRoutines()).toHaveLength(0);
    });
  });
});
