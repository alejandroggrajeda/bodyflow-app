import { describe, it, expect, beforeEach } from 'vitest';
import { useProfileStore } from '../../src/application/store/profile-store.ts';
import { useSavedRoutineStore } from '../../src/application/store/saved-routine-store.ts';
import { UserProfile } from '../../src/domain/entities/user-profile.ts';
import { Routine } from '../../src/domain/entities/routine.ts';

describe('Application Stores (Profile & Routine) — Strict TDD', () => {
  const sampleProfile: UserProfile = {
    age: 29,
    weight: 72,
    targetWeight: 68,
    weightUnit: 'kg',
    height: 174,
    sex: 'female',
    experience: 'intermediate',
  };

  const sampleRoutine: Routine = {
    id: 'test-routine-1',
    name: 'Fuerza Intermedia',
    createdAt: new Date().toISOString(),
    profileSnapshot: sampleProfile,
    days: [
      {
        dayIndex: 1,
        label: 'Día 1 – Tren Superior',
        muscleGroups: ['chest', 'back'],
        exercises: [{ exerciseId: '0001', sets: 3, reps: [10, 12], restSeconds: 60 }],
      },
    ],
  };

  beforeEach(() => {
    localStorage.clear();
    useProfileStore.getState().reset();
    useSavedRoutineStore.getState().reset();
  });

  describe('Profile Store', () => {
    it('initializes with null profile', () => {
      const state = useProfileStore.getState();
      expect(state.profile).toBeNull();
      expect(state.isComplete).toBe(false);
    });

    it('saves profile and updates state and localStorage', () => {
      useProfileStore.getState().saveProfile(sampleProfile);
      const state = useProfileStore.getState();
      expect(state.profile).toEqual(sampleProfile);
      expect(state.isComplete).toBe(true);

      // Verify persistence via fresh store initialization
      useProfileStore.getState().loadProfile();
      expect(useProfileStore.getState().profile).toEqual(sampleProfile);
    });

    it('clears profile and resets state', () => {
      useProfileStore.getState().saveProfile(sampleProfile);
      expect(useProfileStore.getState().isComplete).toBe(true);

      useProfileStore.getState().clearProfile();
      expect(useProfileStore.getState().profile).toBeNull();
      expect(useProfileStore.getState().isComplete).toBe(false);
    });
  });

  describe('Saved Routine Store', () => {
    it('initializes with empty routines list', () => {
      const state = useSavedRoutineStore.getState();
      expect(state.routines).toEqual([]);
      expect(state.activeRoutine).toBeNull();
    });

    it('saves a routine and retrieves it in the list', () => {
      const { saveRoutine } = useSavedRoutineStore.getState();
      const result = saveRoutine(sampleRoutine);
      expect(result.success).toBe(true);

      const updated = useSavedRoutineStore.getState().routines;
      expect(updated).toHaveLength(1);
      expect(updated[0].id).toBe('test-routine-1');
    });

    it('detects duplicate routine names and alerts', () => {
      useSavedRoutineStore.getState().saveRoutine(sampleRoutine);
      const duplicateAttempt = useSavedRoutineStore.getState().saveRoutine({
        ...sampleRoutine,
        id: 'different-id',
        name: 'Fuerza Intermedia', // same name
      });

      expect(duplicateAttempt.success).toBe(false);
      expect(duplicateAttempt.error).toContain('existe');
    });

    it('deletes routine by id', () => {
      useSavedRoutineStore.getState().saveRoutine(sampleRoutine);
      expect(useSavedRoutineStore.getState().routines).toHaveLength(1);

      useSavedRoutineStore.getState().deleteRoutine('test-routine-1');
      expect(useSavedRoutineStore.getState().routines).toHaveLength(0);
    });

    it('sets and gets active routine', () => {
      useSavedRoutineStore.getState().setActiveRoutine(sampleRoutine);
      expect(useSavedRoutineStore.getState().activeRoutine).toEqual(sampleRoutine);

      useSavedRoutineStore.getState().setActiveRoutine(null);
      expect(useSavedRoutineStore.getState().activeRoutine).toBeNull();
    });
  });
});
