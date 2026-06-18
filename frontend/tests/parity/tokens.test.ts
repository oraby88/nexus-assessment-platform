import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Spec 012 / Foundational (FR-PAR-012, T003). The design's extended token set (project/app/styles.css)
// is reconciled into the app tokens — so every screen can match the design's specified color/elevation
// values. Deterministic source-level assertion (parity is otherwise review-signed-off; no pixel-diff).
const here = dirname(fileURLToPath(import.meta.url));
const tokens = readFileSync(resolve(here, '../../src/styles/tokens.css'), 'utf8');

// Tokens that exist in the design and must now exist in the app (in :root).
const REQUIRED_TOKENS = [
  '--indigo-300',
  '--violet-100',
  '--teal-50',
  '--teal-700',
  '--amber-50',
  '--amber-700',
  '--rose-50',
  '--rose-700',
  '--ink-200',
  '--ink-400',
  '--ink-600',
  '--ink-800',
  '--shell-600',
  '--shell-850',
  '--border-soft',
  '--grid-line',
  '--grid-line-2',
  '--skel-1',
  '--skel-2',
  '--topbar-bg',
  '--tone-violet-bg',
  '--tone-violet-fg',
  '--sh-xs',
  '--sh-xl',
  '--sh-indigo',
];

// Theme-dependent tokens that must also have a [data-theme="dark"] override.
const DARK_OVERRIDES = [
  '--violet-100',
  '--teal-50',
  '--amber-50',
  '--rose-50',
  '--shell-850',
  '--border-soft',
  '--grid-line',
  '--grid-line-2',
  '--skel-1',
  '--skel-2',
  '--topbar-bg',
  '--tone-violet-bg',
  '--tone-violet-fg',
  '--sh-xs',
  '--sh-xl',
];

describe('design-token reconciliation (Spec 012 / T003)', () => {
  it('defines every reconciled design token', () => {
    const missing = REQUIRED_TOKENS.filter((t) => !tokens.includes(`${t}:`));
    expect(missing, `Missing tokens: ${missing.join(', ')}`).toEqual([]);
  });

  it('provides dark-theme overrides for the theme-dependent tokens', () => {
    const darkBlock = tokens.slice(tokens.indexOf("[data-theme='dark']"));
    const missing = DARK_OVERRIDES.filter((t) => !darkBlock.includes(`${t}:`));
    expect(missing, `Missing dark overrides: ${missing.join(', ')}`).toEqual([]);
  });
});
