import { describe, it, expect, beforeEach } from 'vitest';
import { useExerciseStore } from '../../src/application/store/exercise-store.ts';

describe('ExerciseStore (Zustand)', () => {
  beforeEach(async () => {
    const store = useExerciseStore.getState();
    store.reset();
    await store.initialize();
  });

  it('should initialize with all exercises', () => {
    const state = useExerciseStore.getState();
    expect(state.exercises.length).toBe(325);
    expect(state.filteredExercises.length).toBe(325);
    expect(state.isLoading).toBe(false);
  });

  it('should filter exercises when setSearchQuery is called', () => {
    const store = useExerciseStore.getState();
    store.setSearchQuery('push-up');
    
    const state = useExerciseStore.getState();
    expect(state.searchQuery).toBe('push-up');
    expect(state.filteredExercises.length).toBeGreaterThan(0);
    state.filteredExercises.forEach((ex) => {
      expect(ex.name.toLowerCase()).toContain('push-up');
    });
  });

  it('should filter exercises when setSelectedBodyPart is called', () => {
    const store = useExerciseStore.getState();
    store.setSelectedBodyPart('chest');
    
    const state = useExerciseStore.getState();
    expect(state.selectedBodyPart).toBe('chest');
    expect(state.filteredExercises.length).toBeGreaterThan(0);
    state.filteredExercises.forEach((ex) => {
      expect(ex.bodyPart.toLowerCase()).toBe('chest');
    });
  });

  it('should reset filters when resetFilters is called', () => {
    const store = useExerciseStore.getState();
    store.setSearchQuery('squat');
    store.setSelectedBodyPart('legs');
    expect(useExerciseStore.getState().filteredExercises.length).toBeLessThan(325);

    store.resetFilters();
    const state = useExerciseStore.getState();
    expect(state.searchQuery).toBe('');
    expect(state.selectedBodyPart).toBe('all');
    expect(state.filteredExercises.length).toBe(325);
  });

  it('should open and close exercise detail modal with selected exercise', () => {
    const store = useExerciseStore.getState();
    store.openExerciseDetail('0001');

    let state = useExerciseStore.getState();
    expect(state.selectedExerciseId).toBe('0001');
    expect(state.selectedExercise?.id).toBe('0001');
    expect(state.isDetailOpen).toBe(true);

    store.closeExerciseDetail();
    state = useExerciseStore.getState();
    expect(state.selectedExerciseId).toBeNull();
    expect(state.selectedExercise).toBeNull();
    expect(state.isDetailOpen).toBe(false);
  });

  it('should toggle instruction language between es and en', () => {
    const store = useExerciseStore.getState();
    expect(store.language).toBe('es');

    store.setLanguage('en');
    expect(useExerciseStore.getState().language).toBe('en');

    store.setLanguage('es');
    expect(useExerciseStore.getState().language).toBe('es');
  });
});
