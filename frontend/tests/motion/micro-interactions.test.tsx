import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import { Button, Card } from '@/components/ui';

// Spec 010 / US4 (FR-018/019/020). Interactive primitives provide hover/press feedback, and the
// keyboard focus indicator is independent of motion settings (lives outside the reduced-motion media
// query). Hover/press states can't be computed in jsdom, so feedback is asserted via class presence;
// focus-visible independence is asserted from globals.css structure.
const here = dirname(fileURLToPath(import.meta.url));
const globals = readFileSync(resolve(here, '../../src/styles/globals.css'), 'utf8');

describe('micro-interactions (Spec 010 / US4)', () => {
  it('Button exposes hover/press feedback and a motion-aware transition', () => {
    render(<Button>Go</Button>);
    const cls = screen.getByRole('button', { name: 'Go' }).className;
    expect(cls).toMatch(/hover:/); // hover feedback
    expect(cls).toMatch(/active:/); // press feedback
    expect(cls).toMatch(/transition/); // transitioned (zeroed under reduced-motion globally)
  });

  it('Card exposes a gentle hover elevation', () => {
    const { container } = render(<Card>content</Card>);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toMatch(/hover:shadow/);
    expect(cls).toMatch(/transition/);
  });

  it('the focus-visible indicator is defined independently of motion settings (FR-020)', () => {
    // :focus-visible rule exists...
    expect(globals).toMatch(/:focus-visible\s*\{[^}]*outline/);
    // ...and is NOT inside the prefers-reduced-motion block (focus stays regardless of motion).
    const reducedBlock = globals.slice(
      globals.indexOf('@media (prefers-reduced-motion: reduce)'),
      globals.indexOf('@keyframes'),
    );
    expect(reducedBlock).not.toMatch(/:focus-visible/);
  });
});
