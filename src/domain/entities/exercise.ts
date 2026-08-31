export interface ExerciseInstructions {
  en: string[];
  es: string[];
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  bodyPart: string;
  equipment: string;
  targetMuscle: string;
  secondaryMuscles: string[];
  thumbnailUrl: string;
  gifUrl: string;
  instructions: ExerciseInstructions;
}

export type MuscleCategory = 
  | 'all'
  | 'chest'
  | 'back'
  | 'arms'
  | 'legs'
  | 'waist'
  | 'shoulders'
  | 'cardio';

export interface ExerciseFilterCriteria {
  searchQuery?: string;
  bodyPart?: string;
  targetMuscle?: string;
}
