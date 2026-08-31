export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type Sex = 'male' | 'female' | 'other';
export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';
export type WeightUnit = 'lbs' | 'kg';
export type EquipmentAccess = 'all' | 'floor-only';

export interface UserProfile {
  age: number; // 10–99
  weight: number; // in weightUnit (lbs: 44–660, kg: 20–300)
  targetWeight: number; // in weightUnit (lbs: 44–660, kg: 20–300)
  weightUnit?: WeightUnit; // default 'lbs'
  equipmentAccess?: EquipmentAccess; // default 'all'
  height: number; // cm, 100–250
  sex: Sex;
  experience: ExperienceLevel;
}

export function toKg(weight: number, unit: WeightUnit = 'lbs'): number {
  if (unit === 'kg') return weight;
  return Number((weight * 0.45359237).toFixed(2));
}

export function toLbs(weightKg: number): number {
  return Number((weightKg / 0.45359237).toFixed(1));
}

export function convertWeight(
  val: number,
  fromUnit: WeightUnit,
  toUnit: WeightUnit
): number {
  if (fromUnit === toUnit) return val;
  if (toUnit === 'kg') return toKg(val, 'lbs');
  return toLbs(val);
}

export function calculateBMI(
  weight: number,
  heightCm: number,
  unit: WeightUnit = 'kg'
): number {
  if (heightCm <= 0 || weight <= 0) return 0;
  const weightKg = toKg(weight, unit);
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(2));
}

export function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}
