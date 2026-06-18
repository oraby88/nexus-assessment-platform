import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Spec 009 / US4 (FR-PVR-013, SC-007). Heavy assets are kept out of the initial chunk: the governed
// bank is loaded via a dynamic import and feature routes are React.lazy code-split (extends the
// Spec 008 static lazy-seam check). The ≤260 KB raw ceiling is enforced post-build by
// scripts/check-bundle.mjs (wired into release-gate).
const here = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(here, '../../src');

describe('lazy-chunk seam (Spec 009 / US4)', () => {
  it('the governed bank is loaded via a dynamic import (not a static top-level import)', () => {
    const svc = readFileSync(resolve(SRC, 'services/questionBank/questionBankService.ts'), 'utf8');
    expect(svc).toMatch(/import\(\s*['"]@\/mocks\/governed-bank['"]\s*\)/);
    expect(svc).not.toMatch(/^\s*import\s+[^()]*from\s+['"]@\/mocks\/governed-bank['"]/m);
  });

  it('the router code-splits feature screens via React.lazy', () => {
    const router = readFileSync(resolve(SRC, 'router.tsx'), 'utf8');
    const lazyCount = (router.match(/lazy\(/g) ?? []).length;
    expect(lazyCount).toBeGreaterThan(10);
  });

  it('the bundle-budget script exists and is wired into the release gate', () => {
    const script = readFileSync(resolve(SRC, '../scripts/check-bundle.mjs'), 'utf8');
    expect(script).toMatch(/266_240|266240/); // 260 KB raw ceiling
    const pkg = JSON.parse(readFileSync(resolve(SRC, '../package.json'), 'utf8'));
    expect(pkg.scripts['check:bundle']).toContain('check-bundle.mjs');
    expect(pkg.scripts['release-gate']).toContain('check:bundle');
  });
});
