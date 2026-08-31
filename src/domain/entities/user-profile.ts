export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type Sex = 'male' | 'female' | 'other';
export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export interface UserProfile {
  age: number; // 10–99
  weight: number; // kg, 20–300
  height: number; // cm, 100–250
  sex: Sex;
  experience: ExperienceLevel;
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(2));
}

export function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}
