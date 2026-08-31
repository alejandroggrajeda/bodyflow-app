import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CinemagraphViewer } from '../../src/ui/components/detail/CinemagraphViewer.tsx';

describe('CinemagraphViewer (Strict TDD)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders dual-phase cinemagraph player with Zero Layout Shift aspect ratio', () => {
    const { container } = render(
      <CinemagraphViewer
        images={['https://example.com/0.jpg', 'https://example.com/1.jpg']}
        fallbackUrl="https://example.com/fallback.gif"
        alt="Push up demo"
      />
    );

    const aspectBox = container.querySelector('.aspect-\\[4\\/3\\]');
    expect(aspectBox).not.toBeNull();
    expect(screen.getByText('Paso 1: Inicio')).toBeInTheDocument();
    expect(screen.getByText('Paso 2: Ejecución')).toBeInTheDocument();
  });

  it('alternates between frames automatically over 900ms interval', () => {
    render(
      <CinemagraphViewer
        images={['https://example.com/0.jpg', 'https://example.com/1.jpg']}
        fallbackUrl="https://example.com/fallback.gif"
        alt="Push up demo"
      />
    );

    const step1Btn = screen.getByText('Paso 1: Inicio');
    const step2Btn = screen.getByText('Paso 2: Ejecución');

    expect(step1Btn.closest('button')).toHaveAttribute('data-active', 'true');
    expect(step2Btn.closest('button')).toHaveAttribute('data-active', 'false');

    act(() => {
      vi.advanceTimersByTime(950);
    });

    expect(step1Btn.closest('button')).toHaveAttribute('data-active', 'false');
    expect(step2Btn.closest('button')).toHaveAttribute('data-active', 'true');
  });

  it('allows manual phase scrubbing when user clicks a step button', () => {
    render(
      <CinemagraphViewer
        images={['https://example.com/0.jpg', 'https://example.com/1.jpg']}
        fallbackUrl="https://example.com/fallback.gif"
        alt="Push up demo"
      />
    );

    const step2Btn = screen.getByText('Paso 2: Ejecución');
    fireEvent.click(step2Btn);

    expect(step2Btn.closest('button')).toHaveAttribute('data-active', 'true');
  });

  it('allows pausing and resuming the animation loop', () => {
    render(
      <CinemagraphViewer
        images={['https://example.com/0.jpg', 'https://example.com/1.jpg']}
        fallbackUrl="https://example.com/fallback.gif"
        alt="Push up demo"
      />
    );

    const playPauseBtn = screen.getByLabelText(/pausar animación|reproducir animación/i);
    fireEvent.click(playPauseBtn);

    // Paused at step 1
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    const step1Btn = screen.getByText('Paso 1: Inicio');
    expect(step1Btn.closest('button')).toHaveAttribute('data-active', 'true');
  });

  it('falls back gracefully to single fallback URL when images array is not provided or empty', () => {
    render(
      <CinemagraphViewer
        fallbackUrl="https://example.com/fallback.gif"
        alt="Fallback exercise"
      />
    );

    const img = screen.getByAltText('Fallback exercise');
    expect(img).toHaveAttribute('src', 'https://example.com/fallback.gif');
    expect(screen.queryByText('Paso 1: Inicio')).not.toBeInTheDocument();
  });
});
