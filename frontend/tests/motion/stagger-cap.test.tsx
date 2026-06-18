import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { StaggerRows } from '@/components/motion';
import { resetState } from '../_helpers/reset';

// Spec 010 / US2 (FR-012, clarify Q1). Only the first 10 rows stagger; the 11th+ have zero delay so
// large lists stay usable immediately.
describe('StaggerRows cap (Spec 010 / US2)', () => {
  beforeEach(resetState); // matchMedia default → motion allowed

  it('staggers the first 10 rows and zeroes the delay for the rest', () => {
    const rows = Array.from({ length: 13 }, (_, i) => <span key={i}>r{i}</span>);
    const { container } = render(<StaggerRows stepMs={50}>{rows}</StaggerRows>);
    const wrappers = Array.from(container.children) as HTMLElement[];

    expect(wrappers.length).toBe(13);
    expect(wrappers[0].style.animationDelay).toBe('0ms'); // index 0 → 0
    expect(wrappers[5].style.animationDelay).toBe('250ms'); // 5 * 50
    expect(wrappers[9].style.animationDelay).toBe('450ms'); // 9 * 50 (last staggered)
    expect(wrappers[10].style.animationDelay).toBe('0ms'); // capped → appears together
    expect(wrappers[12].style.animationDelay).toBe('0ms');
  });
});
