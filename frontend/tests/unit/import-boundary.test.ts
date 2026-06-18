import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

// SC-004 / Spec 009 SC-001 / constitution IV: UI components AND feature modules MUST consume typed
// services only — they MUST NOT import fixtures (@/mocks) or read persistence (@/services/persistence)
// directly. Spec 009 extends the guard to src/features/ (regression guard for the swap-ready seam).
const here = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = resolve(here, '../../src/components');
const FEATURES_DIR = resolve(here, '../../src/features');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(name)) out.push(full);
  }
  return out;
}

const FORBIDDEN = [/from\s+['"]@\/mocks(\/[^'"]*)?['"]/, /from\s+['"]@\/services\/persistence['"]/];

function findOffenders(dir: string): string[] {
  const offenders: string[] = [];
  for (const file of walk(dir)) {
    const src = readFileSync(file, 'utf8');
    if (FORBIDDEN.some((re) => re.test(src))) offenders.push(file);
  }
  return offenders;
}

describe('UI/data separation (SC-004 / Spec 009 SC-001, constitution IV)', () => {
  it('no component imports fixtures or persistence directly', () => {
    const offenders = findOffenders(COMPONENTS_DIR);
    expect(
      offenders,
      `Direct fixture/persistence imports found in: ${offenders.join(', ')}`,
    ).toEqual([]);
  });

  it('no feature module imports fixtures or persistence directly', () => {
    const offenders = findOffenders(FEATURES_DIR);
    expect(
      offenders,
      `Direct fixture/persistence imports found in: ${offenders.join(', ')}`,
    ).toEqual([]);
  });
});
