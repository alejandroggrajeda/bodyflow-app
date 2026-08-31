import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RoutineDetailPage } from '../../src/ui/pages/RoutineDetailPage.tsx';
import { useSavedRoutineStore } from '../../src/application/store/saved-routine-store.ts';
import { Routine } from '../../src/domain/entities/routine.ts';

describe('RoutineDetailPage TimelineCard Integration (Strict TDD)', () => {
  const sampleRoutineWithTarget: Routine = {
    id: 'test-timeline-routine',
    name: 'Plan de Definición',
    createdAt: new Date().toISOString(),
    profileSnapshot: {
      age: 28,
      weight: 180,
      targetWeight: 160,
      weightUnit: 'lbs',
      height: 178,
      sex: 'male',
      experience: 'intermediate',
    },
    days: [
      {
        dayIndex: 1,
        label: 'Día 1 – Tren Superior',
        muscleGroups: ['chest', 'back'],
        exercises: [
          { exerciseId: '0001', sets: 3, reps: [10, 12], restSeconds: 60 },
        ],
      },
    ],
  };

  beforeEach(() => {
    localStorage.clear();
    useSavedRoutineStore.getState().reset();
  });

  it('renders the projection timeline card with estimated weeks and safe rate', () => {
    useSavedRoutineStore.getState().setActiveRoutine(sampleRoutineWithTarget);

    render(
      <MemoryRouter>
        <RoutineDetailPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText('Proyección de Meta Física')
    ).toBeInTheDocument();
    expect(screen.getByText('180 lbs')).toBeInTheDocument();
    expect(screen.getByText('160 lbs')).toBeInTheDocument();
    expect(screen.getByText('Reducción')).toBeInTheDocument();
    expect(screen.getByText('16')).toBeInTheDocument();
    expect(screen.getByText('semanas')).toBeInTheDocument();
    expect(screen.getByText(/ritmo seguro:/i)).toBeInTheDocument();
  });
});
