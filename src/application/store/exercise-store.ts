import { create } from 'zustand';
import { Exercise } from '../../domain/entities/exercise.ts';
import { StaticExerciseRepository } from '../../infrastructure/repositories/static-exercise-repository.ts';

const repository = new StaticExerciseRepository();

export type SupportedLanguage = 'es' | 'en';

export interface ExerciseState {
  exercises: Exercise[];
  filteredExercises: Exercise[];
  availableBodyParts: string[];
  searchQuery: string;
  selectedBodyPart: string;
  selectedExerciseId: string | null;
  selectedExercise: Exercise | null;
  isDetailOpen: boolean;
  language: SupportedLanguage;
  isLoading: boolean;

  initialize: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedBodyPart: (bodyPart: string) => void;
  resetFilters: () => void;
  openExerciseDetail: (id: string) => void;
  closeExerciseDetail: () => void;
  setLanguage: (lang: SupportedLanguage) => void;
  reset: () => void;
}

const applyFilters = (
  exercises: Exercise[],
  query: string,
  bodyPart: string
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

    return true;
  });
};

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  exercises: [],
  filteredExercises: [],
  availableBodyParts: [],
  searchQuery: '',
  selectedBodyPart: 'all',
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
    const { exercises, selectedBodyPart } = get();
    set({
      searchQuery: query,
      filteredExercises: applyFilters(exercises, query, selectedBodyPart),
    });
  },

  setSelectedBodyPart: (bodyPart: string) => {
    const { exercises, searchQuery } = get();
    set({
      selectedBodyPart: bodyPart,
      filteredExercises: applyFilters(exercises, searchQuery, bodyPart),
    });
  },

  resetFilters: () => {
    const { exercises } = get();
    set({
      searchQuery: '',
      selectedBodyPart: 'all',
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
      selectedExerciseId: null,
      selectedExercise: null,
      isDetailOpen: false,
      language: 'es',
      isLoading: false,
    });
  },
}));
