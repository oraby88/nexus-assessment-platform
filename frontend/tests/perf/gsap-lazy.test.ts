import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

// Spec 011 / FR-SSP-012 (SC-005). GSAP MUST be lazy-loaded so it never enters the initial eager
// chunk: no source file may statically `import ... from 'gsap'` — only the dynamic `import('gsap')`
// inside src/lib/gsap.ts is allowed. (The post-build separate-chunk assertion lives in the build
// guard; this is the fast static guard.)
const here = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(here, '../../src');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(name)) out.push(full);
  }
  return out;
}

// A top-level static import of gsap (NOT the dynamic import('gsap') call form).
const STATIC_GSAP = /^\s*import\s+[^;]*\bfrom\s+['"]gsap['"]/m;

describe('GSAP is lazy-loaded (Spec 011 / FR-SSP-012)', () => {
  it('no source file statically imports gsap (only the dynamic import in lib/gsap.ts)', () => {
    const offenders: string[] = [];
    for (const file of walk(SRC)) {
      if (STATIC_GSAP.test(readFileSync(file, 'utf8'))) offenders.push(file);
    }
    expect(offenders, `Static gsap imports found in: ${offenders.join(', ')}`).toEqual([]);
  });

  it('the lazy loader uses a dynamic import', () => {
    const loader = readFileSync(resolve(SRC, 'lib/gsap.ts'), 'utf8');
    expect(loader).toMatch(/import\(\s*['"]gsap['"]\s*\)/);
  });
});
