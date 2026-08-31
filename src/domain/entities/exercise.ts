export interface ExerciseInstructions {
  en: string[];
  es: string[];
}

export type EquipmentRequirement = 'none' | 'bar' | 'furniture';

export interface Exercise {
  id: string;
  name: string;
  category: string;
  bodyPart: string;
  equipment: string;
  equipmentRequirement?: EquipmentRequirement;
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

export type EquipmentFilterOption = 'all' | 'floor-only' | 'apparatus';

export interface ExerciseFilterCriteria {
  searchQuery?: string;
  bodyPart?: string;
  targetMuscle?: string;
  equipmentFilter?: EquipmentFilterOption;
}

const BAR_PATTERNS = [
  'pull-up',
  'pull up',
  'chin-up',
  'chin up',
  'muscle-up',
  'muscle up',
  'hanging',
  'straight bar',
  'vertical bar',
  'horizontal bar',
  'dip bar',
  'parallel bar',
  'back lever',
  'front lever',
];

const FURNITURE_PATTERNS = [
  'bench',
  'chair',
  'box jump',
  'table',
  'towel',
  'suspension',
  'band',
  'ball',
];

export function classifyEquipment(exercise: {
  name: string;
  instructions?: { en?: string[] };
}): EquipmentRequirement {
  const text = (
    exercise.name +
    ' ' +
    (exercise.instructions?.en || []).join(' ')
  ).toLowerCase();

  for (const pattern of BAR_PATTERNS) {
    if (text.includes(pattern)) {
      return 'bar';
    }
  }

  for (const pattern of FURNITURE_PATTERNS) {
    if (text.includes(pattern)) {
      return 'furniture';
    }
  }

  return 'none';
}
