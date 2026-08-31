import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BottomNav } from '../../src/ui/components/navigation/BottomNav.tsx';

describe('BottomNav Navigation (Strict TDD & Accessibility)', () => {
  it('renders all 3 navigation tabs with proper accessible names', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <BottomNav />
      </MemoryRouter>
    );

    const nav = screen.getByRole('navigation', { name: /navegación principal/i });
    expect(nav).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /catálogo/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /mis rutinas/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /mi perfil/i })).toBeInTheDocument();
  });
});
