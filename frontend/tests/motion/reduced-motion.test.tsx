import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CountUp } from '@/components/ui';
import { PageFX, SectionReveal } from '@/components/motion';
import { resetState } from '../_helpers/reset';

// Spec 009 / US3 (FR-PVR-011, SC-006). With prefers-reduced-motion: reduce, signature motion on the
// priority surfaces degrades to instant: CountUp renders its final value immediately and reveal
// wrappers carry no animation (degrade to opacity/none via the global reduced-motion rule).
const original = window.matchMedia;

describe('reduced-motion degradation (Spec 009 / US3)', () => {
  beforeEach(() => {
    resetState();
    window.matchMedia = (query: string) =>
      ({
        matches: /prefers-reduced-motion/.test(query),
        media: query,
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

  it('CountUp shows its final value instantly under reduced motion', () => {
    render(<CountUp to={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('reveal wrappers apply no JS animation under reduced motion', () => {
    const { container } = render(
      <PageFX>
        <SectionReveal>
          <span>content</span>
        </SectionReveal>
      </PageFX>,
    );
    const pageFx = container.firstChild as HTMLElement;
    const sectionReveal = pageFx.firstChild as HTMLElement;
    expect(pageFx.style.animation).toBe('');
    expect(sectionReveal.style.animation).toBe('');
  });
});
