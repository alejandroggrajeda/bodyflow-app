import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RoutinesPage } from '../../src/ui/pages/RoutinesPage.tsx';
import { useSavedRoutineStore } from '../../src/application/store/saved-routine-store.ts';
import { Routine } from '../../src/domain/entities/routine.ts';

describe('RoutinesPage Integration (Strict TDD)', () => {
  const sampleRoutine: Routine = {
    id: 'test-123',
    name: 'Rutina Full Body 3 Días',
    createdAt: new Date().toISOString(),
    profileSnapshot: {
      age: 30,
      weight: 70,
      targetWeight: 68,
      weightUnit: 'kg',
      height: 175,
      sex: 'male',
      experience: 'beginner',
    },
    days: [
      {
        dayIndex: 1,
        label: 'Día 1 – Full Body',
        muscleGroups: ['chest', 'back', 'legs'],
        exercises: [
          { exerciseId: '0001', sets: 2, reps: [8, 10], restSeconds: 90 },
        ],
      },
    ],
  };

  beforeEach(() => {
    localStorage.clear();
    useSavedRoutineStore.getState().reset();
  });

  it('renders empty state CTA when no routines exist', () => {
    render(
      <MemoryRouter>
        <RoutinesPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/no tienes ninguna rutina guardada todavía/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /configurar perfil y generar/i })
    ).toBeInTheDocument();
  });

  it('renders saved routine cards when routines exist', () => {
    useSavedRoutineStore.getState().saveRoutine(sampleRoutine);

    render(
      <MemoryRouter>
        <RoutinesPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Rutina Full Body 3 Días')).toBeInTheDocument();
    expect(screen.getByText(/1 días \/ sem/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /ver plan completo/i })
    ).toBeInTheDocument();
  });

  it('shows confirmation when delete button is pressed and removes routine on confirm', () => {
    useSavedRoutineStore.getState().saveRoutine(sampleRoutine);

    render(
      <MemoryRouter>
        <RoutinesPage />
      </MemoryRouter>
    );

    const deleteBtn = screen.getByLabelText(/eliminar rutina/i);
    fireEvent.click(deleteBtn);

    const confirmBtn = screen.getByRole('button', { name: /confirmar/i });
    expect(confirmBtn).toBeInTheDocument();

    fireEvent.click(confirmBtn);
    expect(
      screen.getByText(/no tienes ninguna rutina guardada todavía/i)
    ).toBeInTheDocument();
  });
});
