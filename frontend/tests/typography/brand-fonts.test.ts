import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Spec 010 / US1 (FR-001/002/003/004, SC-001/002). Brand typography is self-hosted, offline, and the
// families/weights match the design source. jsdom cannot load fonts or resolve var() in
// getComputedStyle, so this is a deterministic source-contract test (same pattern as tests/perf).
const here = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(here, '../../src');
const tokens = readFileSync(resolve(SRC, 'styles/tokens.css'), 'utf8');
const fonts = readFileSync(resolve(SRC, 'styles/fonts.css'), 'utf8');
const main = readFileSync(resolve(SRC, 'main.tsx'), 'utf8');

describe('brand typography (Spec 010 / US1)', () => {
  it('tokens name the three brand families with a system fallback (FR-001/003)', () => {
    expect(tokens).toMatch(/--font-display:\s*'Schibsted Grotesk'[^;]*system-ui/);
    expect(tokens).toMatch(/--font-ui:\s*'Hanken Grotesk'[^;]*system-ui/);
    expect(tokens).toMatch(/--font-mono:\s*'JetBrains Mono'[^;]*(ui-)?monospace/);
  });

  it('fonts are self-hosted via @fontsource at the design weights — no CDN/network (FR-002)', () => {
    // Schibsted Grotesk 400–800
    for (const w of [400, 500, 600, 700, 800]) {
      expect(fonts).toContain(`@fontsource/schibsted-grotesk/${w}.css`);
    }
    // Hanken Grotesk 400–700
    for (const w of [400, 500, 600, 700]) {
      expect(fonts).toContain(`@fontsource/hanken-grotesk/${w}.css`);
    }
    // JetBrains Mono 400–600
    for (const w of [400, 500, 600]) {
      expect(fonts).toContain(`@fontsource/jetbrains-mono/${w}.css`);
    }
    // No external font network dependency (offline).
    expect(fonts).not.toMatch(/https?:\/\//);
    expect(fonts).not.toMatch(/fonts\.googleapis|fonts\.gstatic/);
  });

  it('font CSS is imported app-wide before globals (FR-001)', () => {
    const fontsIdx = main.indexOf('./styles/fonts.css');
    const globalsIdx = main.indexOf('./styles/globals.css');
    expect(fontsIdx).toBeGreaterThan(-1);
    expect(globalsIdx).toBeGreaterThan(-1);
    expect(fontsIdx).toBeLessThan(globalsIdx);
  });

  it('font families are theme-independent — not redefined under dark (FR-004)', () => {
    const darkBlock = tokens.slice(tokens.indexOf("[data-theme='dark']"));
    expect(darkBlock).not.toMatch(/--font-(display|ui|mono):/);
  });
});
