import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useExerciseStore } from '../../src/application/store/exercise-store.ts';
import { FilterBar } from '../../src/ui/components/catalog/FilterBar.tsx';
import { ExerciseCard } from '../../src/ui/components/catalog/ExerciseCard.tsx';
import { ExerciseModal } from '../../src/ui/components/detail/ExerciseModal.tsx';
import { Exercise } from '../../src/domain/entities/exercise.ts';

const mockExercise: Exercise = {
  id: '0001',
  name: '3/4 sit-up',
  category: 'waist',
  bodyPart: 'waist',
  equipment: 'body weight',
  equipmentRequirement: 'none',
  targetMuscle: 'abs',
  secondaryMuscles: ['hip flexors', 'lower back'],
  thumbnailUrl: 'https://example.com/thumb.jpg',
  gifUrl: 'https://example.com/video.gif',
  instructions: {
    en: ['Step 1 English', 'Step 2 English'],
    es: ['Paso 1 Español', 'Paso 2 Español'],
  },
};

describe('UI Components & Layout Verification', () => {
  beforeEach(async () => {
    useExerciseStore.getState().reset();
    await useExerciseStore.getState().initialize();
  });

  describe('FilterBar', () => {
    it('should render search input, category filters, and equipment filter buttons', () => {
      render(<FilterBar />);
      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toBeInTheDocument();
      expect(screen.getByText('Todos')).toBeInTheDocument();
      expect(screen.getByText('Solo Suelo (Sin Equipo)')).toBeInTheDocument();
      expect(screen.getByText('Con Barra / Apoyo')).toBeInTheDocument();
    });

    it('should update search query on input change', () => {
      render(<FilterBar />);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'push-up' } });
      expect(useExerciseStore.getState().searchQuery).toBe('push-up');
    });

    it('should select body part when category pill is clicked', () => {
      render(<FilterBar />);
      const chestBtn = screen.getByText('Pectorales');
      fireEvent.click(chestBtn);
      expect(useExerciseStore.getState().selectedBodyPart).toBe('chest');
    });

    it('should update equipment filter when equipment pill is clicked', () => {
      render(<FilterBar />);
      const floorBtn = screen.getByText('Solo Suelo (Sin Equipo)');
      fireEvent.click(floorBtn);
      expect(useExerciseStore.getState().equipmentFilter).toBe('floor-only');
    });
  });

  describe('ExerciseCard (Zero Layout Shift)', () => {
    it('should render exercise card with aspect-square container, muscle tag, and equipment badge', () => {
      const { container } = render(<ExerciseCard exercise={mockExercise} />);
      expect(screen.getByText('3/4 sit-up')).toBeInTheDocument();
      expect(screen.getByText('abs')).toBeInTheDocument();
      expect(screen.getByText('Sin Equipo')).toBeInTheDocument();

      // Zero Layout Shift container check
      const aspectBox = container.querySelector('.aspect-square');
      expect(aspectBox).not.toBeNull();
    });

    it('should open modal when card is clicked', () => {
      render(<ExerciseCard exercise={mockExercise} />);
      const card = screen.getByRole('button');
      fireEvent.click(card);

      const state = useExerciseStore.getState();
      expect(state.isDetailOpen).toBe(true);
      expect(state.selectedExerciseId).toBe('0001');
    });
  });

  describe('ExerciseModal (Detail View & Language Toggle)', () => {
    it('should render modal with animated gif container and instructions when open', () => {
      useExerciseStore.getState().openExerciseDetail('0001');
      const { container } = render(<ExerciseModal />);

      expect(screen.getByText('3/4 sit-up')).toBeInTheDocument();
      expect(screen.getByText(/Instrucciones paso a paso/i)).toBeInTheDocument();

      // Zero Layout Shift container check
      const gifBox = container.querySelector('.aspect-\\[4\\/3\\]');
      expect(gifBox).not.toBeNull();
    });

    it('should switch instructions when language is toggled', () => {
      useExerciseStore.getState().openExerciseDetail('0001');
      render(<ExerciseModal />);

      expect(screen.getByText(/Instrucciones paso a paso/i)).toBeInTheDocument();

      const enBtn = screen.getByText('English');
      fireEvent.click(enBtn);

      expect(screen.getByText(/Step-by-step instructions/i)).toBeInTheDocument();
    });

    it('should close modal when close button is clicked', () => {
      useExerciseStore.getState().openExerciseDetail('0001');
      render(<ExerciseModal />);

      const closeBtn = screen.getByLabelText('Cerrar modal');
      fireEvent.click(closeBtn);

      expect(useExerciseStore.getState().isDetailOpen).toBe(false);
    });
  });
});
