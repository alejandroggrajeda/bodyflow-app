import {
  ExperienceLevel,
  WeightUnit,
  toKg,
  toLbs,
} from '../entities/user-profile.ts';

export type GoalDirection = 'lose' | 'gain' | 'maintain';

export interface WeightTimelineEstimate {
  currentWeight: number;
  targetWeight: number;
  weightUnit: WeightUnit;
  deltaKg: number;
  direction: GoalDirection;
  estimatedWeeks: number;
  weeklyRate: number; // In the specified weightUnit
  estimatedCompletionDate: string; // Formatted date string
}

// Conservative safe rates per week in kg
const LOSS_RATES_KG: Record<ExperienceLevel, number> = {
  beginner: 0.4,
  intermediate: 0.6,
  advanced: 0.6,
};

const GAIN_RATES_KG: Record<ExperienceLevel, number> = {
  beginner: 0.2,
  intermediate: 0.25,
  advanced: 0.25,
};

export function estimateWeightTimeline(
  currentWeight: number,
  targetWeight: number,
  experience: ExperienceLevel,
  unit: WeightUnit = 'lbs'
): WeightTimelineEstimate {
  const currentKg = toKg(currentWeight, unit);
  const targetKg = toKg(targetWeight, unit);
  const deltaKg = Number((targetKg - currentKg).toFixed(2));

  if (Math.abs(deltaKg) < 0.1) {
    const today = new Date();
    return {
      currentWeight,
      targetWeight,
      weightUnit: unit,
      deltaKg: 0,
      direction: 'maintain',
      estimatedWeeks: 0,
      weeklyRate: 0,
      estimatedCompletionDate: today.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };
  }

  const isLoss = deltaKg < 0;
  const direction: GoalDirection = isLoss ? 'lose' : 'gain';
  const rateKg = isLoss
    ? LOSS_RATES_KG[experience]
    : GAIN_RATES_KG[experience];

  const weeks = Math.ceil(Math.abs(deltaKg) / rateKg);

  // Rate in selected unit
  const weeklyRate =
    unit === 'kg' ? rateKg : Number(toLbs(rateKg).toFixed(2));

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + weeks * 7);

  const formattedDate = targetDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return {
    currentWeight,
    targetWeight,
    weightUnit: unit,
    deltaKg,
    direction,
    estimatedWeeks: weeks,
    weeklyRate,
    estimatedCompletionDate: formattedDate,
  };
}
