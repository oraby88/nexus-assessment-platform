import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

// Spec 009 / US3 (FR-PVR-011, constitution XII). The shell uses no parallax: no fixed-attachment
// backgrounds and no scroll-linked transforms. Static guard over the source tree.
const here = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(here, '../../src');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx|css)$/.test(name)) out.push(full);
  }
  return out;
}

describe('no shell parallax (Spec 009 / US3)', () => {
  it('no source uses fixed-attachment backgrounds or scroll-linked parallax', () => {
    // Technical indicators of parallax (not documentation mentions of the word).
    const offenders: string[] = [];
    for (const file of walk(SRC)) {
      const src = readFileSync(file, 'utf8');
      if (/background-attachment\s*:\s*fixed/i.test(src)) offenders.push(`${file} (fixed bg)`);
      // scroll-linked transform: a scroll handler that drives translate/transform.
      if (/addEventListener\(\s*['"]scroll['"]/.test(src) && /transform|translate/i.test(src)) {
        offenders.push(`${file} (scroll-linked transform)`);
      }
    }
    expect(offenders, `Parallax indicators found in: ${offenders.join(', ')}`).toEqual([]);
  });
});
