import { create } from 'zustand';
import { Routine } from '../../domain/entities/routine.ts';
import { RoutineStorage } from '../../infrastructure/storage/routine-storage.ts';

const storage = new RoutineStorage();

export interface SaveRoutineResult {
  success: boolean;
  error?: string;
}

export interface SavedRoutineState {
  routines: Routine[];
  activeRoutine: Routine | null;
  loadRoutines: () => void;
  saveRoutine: (routine: Routine) => SaveRoutineResult;
  deleteRoutine: (id: string) => void;
  setActiveRoutine: (routine: Routine | null) => void;
  reset: () => void;
}

export const useSavedRoutineStore = create<SavedRoutineState>((set, get) => ({
  routines: storage.getRoutines(),
  activeRoutine: null,

  loadRoutines: () => {
    set({ routines: storage.getRoutines() });
  },

  saveRoutine: (routine: Routine): SaveRoutineResult => {
    const existing = storage.getRoutines();
    const duplicate = existing.find(
      (r) => r.name.trim().toLowerCase() === routine.name.trim().toLowerCase() && r.id !== routine.id
    );

    if (duplicate) {
      return {
        success: false,
        error: `Ya existe una rutina guardada con el nombre "${routine.name}". Elige otro nombre.`,
      };
    }

    try {
      storage.saveRoutine(routine);
      set({ routines: storage.getRoutines(), activeRoutine: routine });
      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error al guardar la rutina',
      };
    }
  },

  deleteRoutine: (id: string) => {
    storage.deleteRoutine(id);
    const { activeRoutine } = get();
    set({
      routines: storage.getRoutines(),
      activeRoutine: activeRoutine?.id === id ? null : activeRoutine,
    });
  },

  setActiveRoutine: (routine: Routine | null) => {
    set({ activeRoutine: routine });
  },

  reset: () => {
    set({
      routines: [],
      activeRoutine: null,
    });
  },
}));
