import { Routine } from '../../domain/entities/routine.ts';

const ROUTINES_KEY = 'bodyflow:routines';
const MAX_ROUTINES = 10;

export class RoutineStorage {
  getRoutines(): Routine[] {
    try {
      const raw = localStorage.getItem(ROUTINES_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Routine[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  saveRoutine(routine: Routine): void {
    const existing = this.getRoutines();
    const index = existing.findIndex((r) => r.id === routine.id);

    if (index >= 0) {
      existing[index] = routine;
    } else {
      if (existing.length >= MAX_ROUTINES) {
        throw new Error(
          `Storage limit reached: Maximum of ${MAX_ROUTINES} routines can be saved.`
        );
      }
      existing.unshift(routine);
    }

    localStorage.setItem(ROUTINES_KEY, JSON.stringify(existing));
  }

  deleteRoutine(id: string): void {
    const existing = this.getRoutines();
    const filtered = existing.filter((r) => r.id !== id);
    localStorage.setItem(ROUTINES_KEY, JSON.stringify(filtered));
  }
}
