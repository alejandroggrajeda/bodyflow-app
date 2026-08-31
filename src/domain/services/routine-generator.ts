import { UserProfile, ExperienceLevel } from '../entities/user-profile.ts';
import { Routine, RoutineDay, RoutineExercise } from '../entities/routine.ts';
import { Exercise } from '../entities/exercise.ts';

// Deterministic pseudo-random number generator (Mulberry32)
function createPRNG(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Seed derivation from user profile fields
function deriveProfileSeed(profile: UserProfile): number {
  let hash = profile.age * 31 + Math.round(profile.weight * 17) + Math.round(profile.height * 13);
  for (let i = 0; i < profile.sex.length; i++) {
    hash = (hash * 33 + profile.sex.charCodeAt(i)) >>> 0;
  }
  for (let i = 0; i < profile.experience.length; i++) {
    hash = (hash * 33 + profile.experience.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// Fisher-Yates shuffle with seeded PRNG
function seededShuffle<T>(array: T[], prng: () => number): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface SplitConfig {
  daysCount: number;
  days: {
    label: string;
    targetParts: string[];
    minExercises: number;
    maxExercises: number;
  }[];
}

const SPLIT_CONFIGS: Record<ExperienceLevel, SplitConfig> = {
  beginner: {
    daysCount: 3,
    days: [
      {
        label: 'Día 1 – Full Body (A)',
        targetParts: ['chest', 'back', 'legs', 'waist'],
        minExercises: 4,
        maxExercises: 5,
      },
      {
        label: 'Día 2 – Full Body (B)',
        targetParts: ['shoulders', 'arms', 'legs', 'waist'],
        minExercises: 4,
        maxExercises: 5,
      },
      {
        label: 'Día 3 – Full Body (C)',
        targetParts: ['chest', 'back', 'legs', 'cardio'],
        minExercises: 4,
        maxExercises: 5,
      },
    ],
  },
  intermediate: {
    daysCount: 4,
    days: [
      {
        label: 'Día 1 – Tren Superior (Empuje / Pecho & Hombro)',
        targetParts: ['chest', 'shoulders', 'arms'],
        minExercises: 5,
        maxExercises: 6,
      },
      {
        label: 'Día 2 – Tren Inferior & Core',
        targetParts: ['legs', 'waist'],
        minExercises: 5,
        maxExercises: 6,
      },
      {
        label: 'Día 3 – Tren Superior (Tracción / Espalda & Brazos)',
        targetParts: ['back', 'arms', 'waist'],
        minExercises: 5,
        maxExercises: 6,
      },
      {
        label: 'Día 4 – Tren Inferior & Cardio Funcional',
        targetParts: ['legs', 'cardio', 'waist'],
        minExercises: 5,
        maxExercises: 6,
      },
    ],
  },
  advanced: {
    daysCount: 5,
    days: [
      {
        label: 'Día 1 – Empuje (Push: Pecho, Hombro, Tríceps)',
        targetParts: ['chest', 'shoulders', 'arms'],
        minExercises: 5,
        maxExercises: 7,
      },
      {
        label: 'Día 2 – Tracción (Pull: Espalda, Bíceps, Core)',
        targetParts: ['back', 'arms', 'waist'],
        minExercises: 5,
        maxExercises: 7,
      },
      {
        label: 'Día 3 – Pierna & Explosividad',
        targetParts: ['legs', 'cardio'],
        minExercises: 5,
        maxExercises: 7,
      },
      {
        label: 'Día 4 – Empuje & Core Avanzado',
        targetParts: ['chest', 'shoulders', 'waist'],
        minExercises: 5,
        maxExercises: 7,
      },
      {
        label: 'Día 5 – Tracción & Pierna Posterior',
        targetParts: ['back', 'legs', 'arms'],
        minExercises: 5,
        maxExercises: 7,
      },
    ],
  },
};

const VOLUME_CONFIG: Record<
  ExperienceLevel,
  { sets: number; reps: [number, number]; restSeconds: number }
> = {
  beginner: { sets: 2, reps: [8, 10], restSeconds: 90 },
  intermediate: { sets: 3, reps: [10, 12], restSeconds: 60 },
  advanced: { sets: 4, reps: [12, 15], restSeconds: 45 },
};

export function generateRoutine(
  profile: UserProfile,
  allExercises: Exercise[],
  customName?: string
): Routine {
  const seed = deriveProfileSeed(profile);
  const prng = createPRNG(seed);
  const split = SPLIT_CONFIGS[profile.experience];
  const volume = VOLUME_CONFIG[profile.experience];

  const routineDays: RoutineDay[] = split.days.map((dayPlan, index) => {
    // Collect exercises matching this day's target body parts / categories
    const matching = allExercises.filter((ex) => {
      const part = ex.bodyPart.toLowerCase();
      const cat = ex.category.toLowerCase();
      return (
        dayPlan.targetParts.includes(part) || dayPlan.targetParts.includes(cat)
      );
    });

    let selectedList = seededShuffle(matching, prng);

    // If we have fewer than minimum (e.g. 3), backfill from other exercises
    if (selectedList.length < 3) {
      const remaining = allExercises.filter((ex) => !selectedList.some((s) => s.id === ex.id));
      const backfill = seededShuffle(remaining, prng);
      selectedList = [...selectedList, ...backfill].slice(0, Math.max(3, dayPlan.minExercises));
    } else {
      const targetCount = Math.min(
        dayPlan.maxExercises,
        Math.max(dayPlan.minExercises, selectedList.length)
      );
      selectedList = selectedList.slice(0, targetCount);
    }

    const routineExercises: RoutineExercise[] = selectedList.map((ex) => ({
      exerciseId: ex.id,
      sets: volume.sets,
      reps: [...volume.reps] as [number, number],
      restSeconds: volume.restSeconds,
    }));

    return {
      dayIndex: index + 1,
      label: dayPlan.label,
      muscleGroups: dayPlan.targetParts,
      exercises: routineExercises,
    };
  });

  const levelName =
    profile.experience === 'beginner'
      ? 'Principiante'
      : profile.experience === 'intermediate'
      ? 'Intermedia'
      : 'Avanzada';

  const defaultName = `Rutina ${levelName} (${split.daysCount} días)`;

  return {
    id: `routine-${seed}-${Date.now().toString(36)}`,
    name: customName || defaultName,
    createdAt: new Date().toISOString(),
    profileSnapshot: profile,
    days: routineDays,
  };
}
