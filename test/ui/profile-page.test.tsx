import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProfilePage } from '../../src/ui/pages/ProfilePage.tsx';
import { useProfileStore } from '../../src/application/store/profile-store.ts';
import { useSavedRoutineStore } from '../../src/application/store/saved-routine-store.ts';

describe('ProfilePage Integration (Strict TDD)', () => {
  beforeEach(() => {
    localStorage.clear();
    useProfileStore.getState().reset();
    useSavedRoutineStore.getState().reset();
  });

  it('renders profile form with age, weight, height inputs and default lbs unit', () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/edad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/peso \(lbs\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/altura/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'lbs' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'kg' })).toBeInTheDocument();
  });

  it('disables submit and generate buttons when fields are empty', () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    const saveButton = screen.getByRole('button', { name: /guardar perfil/i });
    const generateButton = screen.getByRole('button', {
      name: /generar rutina/i,
    });

    expect(saveButton).toBeDisabled();
    expect(generateButton).toBeDisabled();
  });

  it('allows entering weight in lbs by default and converts value when toggled to kg', () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    const weightInput = screen.getByLabelText(/peso \(lbs\)/i) as HTMLInputElement;
    fireEvent.change(weightInput, { target: { value: '165' } });

    // Toggle unit to kg
    const kgButton = screen.getByRole('button', { name: 'kg' });
    fireEvent.click(kgButton);

    // Converted to kg (165 * 0.45359237 ≈ 74.84)
    expect(screen.getByLabelText(/peso \(kg\)/i)).toBeInTheDocument();
    expect(parseFloat(weightInput.value)).toBeCloseTo(74.84, 1);
  });

  it('enables buttons and saves profile with weightUnit on valid submission', () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    const ageInput = screen.getByLabelText(/edad/i);
    const weightInput = screen.getByLabelText(/peso \(lbs\)/i);
    const heightInput = screen.getByLabelText(/altura/i);

    fireEvent.change(ageInput, { target: { value: '28' } });
    fireEvent.change(weightInput, { target: { value: '165' } });
    fireEvent.change(heightInput, { target: { value: '178' } });

    const saveButton = screen.getByRole('button', { name: /guardar perfil/i });
    expect(saveButton).not.toBeDisabled();

    fireEvent.click(saveButton);

    const storedProfile = useProfileStore.getState().profile;
    expect(storedProfile).toEqual({
      age: 28,
      weight: 165,
      weightUnit: 'lbs',
      height: 178,
      sex: 'male',
      experience: 'beginner',
    });
  });
});
