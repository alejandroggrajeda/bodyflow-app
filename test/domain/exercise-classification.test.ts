import { describe, it, expect } from 'vitest';
import { classifyEquipment, Exercise } from '../../src/domain/entities/exercise.ts';

describe('Exercise Equipment Classification (Strict TDD)', () => {
  const createMockExercise = (name: string, enInstructions: string[] = []): Exercise => ({
    id: 'mock-1',
    name,
    category: 'chest',
    bodyPart: 'chest',
    equipment: 'body weight',
    targetMuscle: 'pectorals',
    secondaryMuscles: [],
    thumbnailUrl: '',
    gifUrl: '',
    instructions: { en: enInstructions, es: [] },
  });

  it('classifies floor-only calisthenics (pushups, planks, squats) as none', () => {
    expect(classifyEquipment(createMockExercise('standard push-up'))).toBe('none');
    expect(classifyEquipment(createMockExercise('bodyweight squat'))).toBe('none');
    expect(classifyEquipment(createMockExercise('plank'))).toBe('none');
    expect(classifyEquipment(createMockExercise('jumping jacks'))).toBe('none');
    expect(classifyEquipment(createMockExercise('burpee'))).toBe('none');
  });

  it('classifies bar movements (pull-ups, chin-ups, bar dips, muscle-ups) as bar', () => {
    expect(classifyEquipment(createMockExercise('pull-up'))).toBe('bar');
    expect(classifyEquipment(createMockExercise('chin-up'))).toBe('bar');
    expect(classifyEquipment(createMockExercise('muscle-up (on vertical bar)'))).toBe('bar');
    expect(classifyEquipment(createMockExercise('chest dip on straight bar'))).toBe('bar');
    expect(classifyEquipment(createMockExercise('hanging leg raise'))).toBe('bar');
  });

  it('classifies furniture movements (bench dips, chair step-ups, box jumps) as furniture', () => {
    expect(classifyEquipment(createMockExercise('bench dip (knees bent)'))).toBe('furniture');
    expect(classifyEquipment(createMockExercise('chair leg extended stretch'))).toBe('furniture');
    expect(classifyEquipment(createMockExercise('box jump'))).toBe('furniture');
    expect(classifyEquipment(createMockExercise('bodyweight squatting row (with towel)'))).toBe('furniture');
  });
});
