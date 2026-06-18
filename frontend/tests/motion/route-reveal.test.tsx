import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RouteReveal } from '@/components/motion';
import { resetState } from '../_helpers/reset';

// Spec 010 / US2 (FR-009/010, SC-003). RouteReveal applies an entrance on mount and degrades to no
// animation under reduced-motion. (Re-fire on navigation is provided by keying on pathname.)
const original = window.matchMedia;
function setReduced(v: boolean) {
  window.matchMedia = (q: string) =>
    ({
      matches: v && /reduced-motion/.test(q),
      media: q,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

describe('RouteReveal (Spec 010 / US2)', () => {
  beforeEach(resetState);
  afterEach(() => {
    window.matchMedia = original;
  });

  it('wraps content in an entrance animation when motion is allowed', () => {
    setReduced(false);
    const { container } = render(
      <MemoryRouter initialEntries={['/a']}>
        <RouteReveal>
          <p>hello</p>
        </RouteReveal>
      </MemoryRouter>,
    );
    const animated = Array.from(container.querySelectorAll('div')).some((d) =>
      (d.getAttribute('style') ?? '').includes('nx-fade-up'),
    );
    expect(animated).toBe(true);
  });

  it('applies no animation wrapper under reduced motion', () => {
    setReduced(true);
    const { container } = render(
      <MemoryRouter initialEntries={['/a']}>
        <RouteReveal>
          <p data-testid="c">hello</p>
        </RouteReveal>
      </MemoryRouter>,
    );
    const animated = Array.from(container.querySelectorAll('div')).some((d) =>
      (d.getAttribute('style') ?? '').includes('nx-fade-up'),
    );
    expect(animated).toBe(false);
    expect(screen.getByTestId('c')).toBeInTheDocument();
  });
});
