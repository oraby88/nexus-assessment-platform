import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Gauge,
  DimensionBars,
  CoverageBars,
  ContextRadar,
  ContextSignature,
} from '@/components/charts';
import { resetState } from '../_helpers/reset';

// Spec 010 / US3 (FR-013/016/017, SC-004/005). Under reduced-motion, charts render their final
// shape/value instantly (no zero/blank frame) and keep their aria-label text alternatives; edge
// values (0/100/missing) resolve correctly. (Animations are CSS — the global reduced-motion rule
// zeroes them; resting state equals the final state.)
const original = window.matchMedia;

describe('chart motion (Spec 010 / US3)', () => {
  beforeEach(() => {
    resetState();
    // Force reduced-motion so CountUp shows the final value immediately (deterministic).
    window.matchMedia = (q: string) =>
      ({
        matches: /reduced-motion/.test(q),
        media: q,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
  });
  afterEach(() => {
    window.matchMedia = original;
  });

  it('Gauge shows the final value (not a zero start frame) and keeps its aria-label', () => {
    render(<Gauge value={75} label="Score" />);
    const svg = screen.getByRole('img', { name: 'Score: 75 of 100' });
    expect(svg.textContent).toContain('75');
  });

  it('Gauge resolves edge values 0 and 100 correctly', () => {
    const { rerender } = render(<Gauge value={0} label="Score" />);
    expect(screen.getByRole('img', { name: 'Score: 0 of 100' })).toBeInTheDocument();
    rerender(<Gauge value={100} label="Score" />);
    expect(screen.getByRole('img', { name: 'Score: 100 of 100' })).toBeInTheDocument();
  });

  it('bar/radar/signature charts render with accessible labels (final shapes)', () => {
    const bars = [
      { label: 'D1', value: 0 },
      { label: 'D2', value: 100 },
    ];
    const { unmount } = render(<DimensionBars data={bars} />);
    expect(screen.getByRole('img', { name: /Dimension scores: D1 0, D2 100/ })).toBeInTheDocument();
    unmount();

    render(<CoverageBars data={bars} />);
    expect(screen.getByRole('img', { name: /Coverage:/ })).toBeInTheDocument();

    render(
      <ContextRadar
        axes={[
          { axis: 'A', person: 50 },
          { axis: 'B', person: 0 },
        ]}
      />,
    );
    expect(screen.getByRole('img', { name: /Context radar:/ })).toBeInTheDocument();

    render(<ContextSignature values={[10, 90, 50]} />);
    expect(
      screen.getByRole('img', { name: /Context signature across 3 factors/ }),
    ).toBeInTheDocument();
  });
});
