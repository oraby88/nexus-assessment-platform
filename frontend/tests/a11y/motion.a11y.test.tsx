import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, renderHook } from '@testing-library/react';
import { CountUp } from '@/components/ui';
import { useReducedMotion } from '@/hooks';

// Spec 008 / US3 — motion honors prefers-reduced-motion (degrades to instant; never blocks).
const realMatchMedia = window.matchMedia;
afterEach(() => {
  window.matchMedia = realMatchMedia;
});

function mockReducedMotion(reduce: boolean) {
  window.matchMedia = ((query: string) =>
    ({
      matches: query.includes('reduced-motion') ? reduce : false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList) as typeof window.matchMedia;
}

describe('A11y: reduced motion (Spec 008 / US3)', () => {
  it('useReducedMotion reflects the user preference', () => {
    mockReducedMotion(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('CountUp renders the final value instantly under reduced motion (no animation gate)', () => {
    mockReducedMotion(true);
    render(<CountUp to={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});
