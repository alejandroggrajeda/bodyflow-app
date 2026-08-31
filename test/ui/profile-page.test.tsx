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

  it('renders profile form with age, weight, height inputs', () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/edad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/peso/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/altura/i)).toBeInTheDocument();
    expect(screen.getByText('Principiante')).toBeInTheDocument();
    expect(screen.getByText('Intermedio')).toBeInTheDocument();
    expect(screen.getByText('Avanzado')).toBeInTheDocument();
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

  it('enables buttons and saves profile on valid submission', () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    const ageInput = screen.getByLabelText(/edad/i);
    const weightInput = screen.getByLabelText(/peso/i);
    const heightInput = screen.getByLabelText(/altura/i);

    fireEvent.change(ageInput, { target: { value: '28' } });
    fireEvent.change(weightInput, { target: { value: '75' } });
    fireEvent.change(heightInput, { target: { value: '178' } });

    const saveButton = screen.getByRole('button', { name: /guardar perfil/i });
    expect(saveButton).not.toBeDisabled();

    fireEvent.click(saveButton);

    const storedProfile = useProfileStore.getState().profile;
    expect(storedProfile).toEqual({
      age: 28,
      weight: 75,
      height: 178,
      sex: 'male',
      experience: 'beginner',
    });
  });
});
