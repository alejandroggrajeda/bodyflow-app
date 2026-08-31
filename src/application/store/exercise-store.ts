import { create } from 'zustand';
import {
  Exercise,
  EquipmentFilterOption,
} from '../../domain/entities/exercise.ts';
import { StaticExerciseRepository } from '../../infrastructure/repositories/static-exercise-repository.ts';

const repository = new StaticExerciseRepository();

export type SupportedLanguage = 'es' | 'en';

export interface ExerciseState {
  exercises: Exercise[];
  filteredExercises: Exercise[];
  availableBodyParts: string[];
  searchQuery: string;
  selectedBodyPart: string;
  equipmentFilter: EquipmentFilterOption;
  selectedExerciseId: string | null;
  selectedExercise: Exercise | null;
  isDetailOpen: boolean;
  language: SupportedLanguage;
  isLoading: boolean;

  initialize: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedBodyPart: (bodyPart: string) => void;
  setEquipmentFilter: (filter: EquipmentFilterOption) => void;
  resetFilters: () => void;
  openExerciseDetail: (id: string) => void;
  closeExerciseDetail: () => void;
  setLanguage: (lang: SupportedLanguage) => void;
  reset: () => void;
}

const applyFilters = (
  exercises: Exercise[],
  query: string,
  bodyPart: string,
  equipmentFilter: EquipmentFilterOption
): Exercise[] => {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedPart = bodyPart.toLowerCase();

  return exercises.filter((ex) => {
    if (normalizedQuery) {
      const matchName = ex.name.toLowerCase().includes(normalizedQuery);
      const matchTarget = ex.targetMuscle.toLowerCase().includes(normalizedQuery);
      if (!matchName && !matchTarget) return false;
    }

    if (normalizedPart && normalizedPart !== 'all') {
      const matchPart = ex.bodyPart.toLowerCase() === normalizedPart;
      const matchCategory = ex.category.toLowerCase() === normalizedPart;
      if (!matchPart && !matchCategory) return false;
    }

    if (equipmentFilter && equipmentFilter !== 'all') {
      const req = ex.equipmentRequirement || 'none';
      if (equipmentFilter === 'floor-only' && req !== 'none') return false;
      if (equipmentFilter === 'apparatus' && req === 'none') return false;
    }

    return true;
  });
};

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  exercises: [],
  filteredExercises: [],
  availableBodyParts: [],
  searchQuery: '',
  selectedBodyPart: 'all',
  equipmentFilter: 'all',
  selectedExerciseId: null,
  selectedExercise: null,
  isDetailOpen: false,
  language: 'es',
  isLoading: false,

  initialize: async () => {
    set({ isLoading: true });
    const all = await repository.getAll();
    const bodyParts = await repository.getBodyParts();
    set({
      exercises: all,
      filteredExercises: all,
      availableBodyParts: ['all', ...bodyParts],
      isLoading: false,
    });
  },

  setSearchQuery: (query: string) => {
    const { exercises, selectedBodyPart, equipmentFilter } = get();
    set({
      searchQuery: query,
      filteredExercises: applyFilters(
        exercises,
        query,
        selectedBodyPart,
        equipmentFilter
      ),
    });
  },

  setSelectedBodyPart: (bodyPart: string) => {
    const { exercises, searchQuery, equipmentFilter } = get();
    set({
      selectedBodyPart: bodyPart,
      filteredExercises: applyFilters(
        exercises,
        searchQuery,
        bodyPart,
        equipmentFilter
      ),
    });
  },

  setEquipmentFilter: (filter: EquipmentFilterOption) => {
    const { exercises, searchQuery, selectedBodyPart } = get();
    set({
      equipmentFilter: filter,
      filteredExercises: applyFilters(
        exercises,
        searchQuery,
        selectedBodyPart,
        filter
      ),
    });
  },

  resetFilters: () => {
    const { exercises } = get();
    set({
      searchQuery: '',
      selectedBodyPart: 'all',
      equipmentFilter: 'all',
      filteredExercises: exercises,
    });
  },

  openExerciseDetail: (id: string) => {
    const { exercises } = get();
    const found = exercises.find((ex) => ex.id === id) || null;
    set({
      selectedExerciseId: id,
      selectedExercise: found,
      isDetailOpen: true,
    });
  },

  closeExerciseDetail: () => {
    set({
      selectedExerciseId: null,
      selectedExercise: null,
      isDetailOpen: false,
    });
  },

  setLanguage: (lang: SupportedLanguage) => {
    set({ language: lang });
  },

  reset: () => {
    set({
      exercises: [],
      filteredExercises: [],
      availableBodyParts: [],
      searchQuery: '',
      selectedBodyPart: 'all',
      equipmentFilter: 'all',
      selectedExerciseId: null,
      selectedExercise: null,
      isDetailOpen: false,
      language: 'es',
      isLoading: false,
    });
  },
}));
