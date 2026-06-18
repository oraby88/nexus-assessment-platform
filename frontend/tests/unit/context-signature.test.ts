import { describe, it, expect } from 'vitest';
import { contextSignature, DEFAULT_CONTEXT_VALUES } from '@/features/contexts/contextSignature';

// FR-BC-009 / SC-004
describe('contextSignature (research D4)', () => {
  it('produces radar axes scaled from the values', () => {
    const sig = contextSignature({ ...DEFAULT_CONTEXT_VALUES, ambiguityLevel: 5 });
    const ambiguity = sig.axes.find((a) => a.axis === 'Ambiguity');
    expect(ambiguity?.value).toBe(100); // 5 * 20
    expect(sig.axes.length).toBeGreaterThan(0);
  });

  it('summary reflects the highest factor', () => {
    const sig = contextSignature({ ...DEFAULT_CONTEXT_VALUES, ambiguityLevel: 1, timePressure: 5 });
    expect(sig.summary.toLowerCase()).toContain('time pressure');
  });

  it('recomputes deterministically for the same values', () => {
    const a = contextSignature(DEFAULT_CONTEXT_VALUES);
    const b = contextSignature(DEFAULT_CONTEXT_VALUES);
    expect(a).toEqual(b);
  });
});
