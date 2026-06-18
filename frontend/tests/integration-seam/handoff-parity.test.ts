import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { CONTRACT_SERVICE_NAMES } from '@/services/contracts';

// Spec 009 / US1 (FR-PVR-003, SC-003, constitution XIV). Traceability guard: every contract-backed
// service has a row in the shared handoff map, so the future-API mapping cannot silently drift from
// the contracts. (Method-level signatures are enforced by `satisfies` + `tsc`.)
const here = dirname(fileURLToPath(import.meta.url));
const HANDOFF_MAP = resolve(here, '../../../specs/000-shared/handoff-map.md');

describe('handoff-map parity (Spec 009 / US1)', () => {
  it('every contract service is documented in specs/000-shared/handoff-map.md', () => {
    const map = readFileSync(HANDOFF_MAP, 'utf8');
    const undocumented = CONTRACT_SERVICE_NAMES.filter((name) => !map.includes(`\`${name}\``));
    expect(undocumented, `Services missing a handoff-map row: ${undocumented.join(', ')}`).toEqual(
      [],
    );
  });
});
