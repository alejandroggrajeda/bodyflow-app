import { UserProfile } from './user-profile.ts';

export interface RoutineExercise {
  exerciseId: string;
  sets: number;
  reps: [number, number]; // [min, max]
  restSeconds: number;
}

export interface RoutineDay {
  dayIndex: number; // 1-based (Day 1, Day 2...)
  label: string; // e.g. "Día 1 – Full Body"
  muscleGroups: string[];
  exercises: RoutineExercise[];
}

export interface Routine {
  id: string;
  name: string;
  createdAt: string; // ISO 8601 string
  profileSnapshot: UserProfile;
  days: RoutineDay[];
}
