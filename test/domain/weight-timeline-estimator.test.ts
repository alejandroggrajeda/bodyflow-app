import { describe, it, expect } from 'vitest';
import { estimateWeightTimeline } from '../../src/domain/services/weight-timeline-estimator.ts';

describe('WeightTimelineEstimator (Strict TDD)', () => {
  describe('Weight Loss Scenarios', () => {
    it('estimates 10 weeks to lose 6 kg for intermediate user', () => {
      // 80 kg to 74 kg -> delta 6 kg, rate 0.6 kg/wk -> 10 weeks
      const result = estimateWeightTimeline(80, 74, 'intermediate', 'kg');

      expect(result.direction).toBe('lose');
      expect(result.deltaKg).toBeCloseTo(-6, 2);
      expect(result.estimatedWeeks).toBe(10);
      expect(result.weeklyRate).toBe(0.6);
      expect(result.estimatedCompletionDate).toBeDefined();
    });

    it('estimates 15 weeks to lose 6 kg for beginner user', () => {
      // 80 kg to 74 kg -> delta 6 kg, rate 0.4 kg/wk -> 15 weeks
      const result = estimateWeightTimeline(80, 74, 'beginner', 'kg');

      expect(result.direction).toBe('lose');
      expect(result.estimatedWeeks).toBe(15);
      expect(result.weeklyRate).toBe(0.4);
    });

    it('handles calculation in pounds (lbs) correctly', () => {
      // 180 lbs to 160 lbs -> delta -20 lbs (~-9.07 kg)
      // intermediate rate: 0.6 kg/wk (~1.32 lbs/wk) -> Math.ceil(9.07 / 0.6) = 16 weeks
      const result = estimateWeightTimeline(180, 160, 'intermediate', 'lbs');

      expect(result.direction).toBe('lose');
      expect(result.weightUnit).toBe('lbs');
      expect(result.estimatedWeeks).toBe(16);
      expect(result.weeklyRate).toBeCloseTo(1.32, 1);
    });
  });

  describe('Weight Gain Scenarios', () => {
    it('estimates 25 weeks to gain 5 kg for beginner user', () => {
      // 65 kg to 70 kg -> delta +5 kg, rate 0.2 kg/wk -> 25 weeks
      const result = estimateWeightTimeline(65, 70, 'beginner', 'kg');

      expect(result.direction).toBe('gain');
      expect(result.deltaKg).toBeCloseTo(5, 2);
      expect(result.estimatedWeeks).toBe(25);
      expect(result.weeklyRate).toBe(0.2);
    });

    it('estimates 20 weeks to gain 5 kg for advanced user', () => {
      // 65 kg to 70 kg -> delta +5 kg, rate 0.25 kg/wk -> 20 weeks
      const result = estimateWeightTimeline(65, 70, 'advanced', 'kg');

      expect(result.direction).toBe('gain');
      expect(result.estimatedWeeks).toBe(20);
      expect(result.weeklyRate).toBe(0.25);
    });
  });

  describe('Maintenance Scenarios', () => {
    it('returns 0 weeks when current weight equals target weight', () => {
      const result = estimateWeightTimeline(75, 75, 'intermediate', 'kg');

      expect(result.direction).toBe('maintain');
      expect(result.estimatedWeeks).toBe(0);
      expect(result.deltaKg).toBe(0);
    });
  });
});
