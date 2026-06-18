import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TransformSequence } from '@/features/create-assessment/TransformSequence';
import { resetState } from '../_helpers/reset';

// Spec 011 / US3 (FR-SSP-008/009/010/011, SC-003). Plays + onDone (reaches review), skippable in one
// action, reduced-motion fallback reaches review, governed copy, no restricted leak. Reduced-motion is
// forced so the path is deterministic and never loads GSAP.
const original = window.matchMedia;
const FORBIDDEN = [/\bscore\b/i, /scoring/i, /derailment/i, /standard error/i, /\bweight\b/i];

describe('Transform Sequence (Spec 011 / US3)', () => {
  beforeEach(() => {
    resetState();
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

  it('shows governed-assembly copy with no restricted content', () => {
    render(<TransformSequence onDone={() => {}} />);
    expect(screen.getByText(/validated bank — never invented/i)).toBeInTheDocument();
    const text = document.body.textContent ?? '';
    for (const re of FORBIDDEN) expect(text).not.toMatch(re);
  });

  it('is skippable in one action (reaches review immediately)', () => {
    const onDone = vi.fn();
    render(<TransformSequence onDone={onDone} />);
    fireEvent.click(screen.getByRole('button', { name: 'Skip' }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('reduced-motion fallback reaches review without skipping', async () => {
    const onDone = vi.fn();
    render(<TransformSequence onDone={onDone} />);
    await waitFor(() => expect(onDone).toHaveBeenCalledTimes(1));
  });
});
