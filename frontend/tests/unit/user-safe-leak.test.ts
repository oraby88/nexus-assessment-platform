import { describe, it, expect, beforeEach } from 'vitest';
import { reportService } from '@/services/report/reportService';
import { setMockFailRate } from '@/services/http';

// Spec 006 / US4 / SC-007/008 — the User report (Spec 005 projection) leaks no Admin-only/internal field.
const RESTRICTED = [
  'domains',
  'domain6',
  'scoringVersion',
  'synthesisWeightVersion',
  'omittedSections',
  'interviewPrompts',
  'blueprintVersion',
  'contextVersion',
  'participantId',
  'organizationId',
];

describe('User report leak guard (Spec 006 / US4)', () => {
  beforeEach(() => setMockFailRate(0));

  it('exposes no restricted/internal keys, keeps supportive content', async () => {
    for (const id of ['RPT-001', 'RPT-002', 'RPT-003']) {
      const safe = (await reportService.getUserSafe(id)) as Record<string, unknown> | undefined;
      if (!safe) continue;
      for (const key of RESTRICTED) expect(key in safe).toBe(false);
      expect(Array.isArray((safe as { strengths: unknown }).strengths)).toBe(true);
      expect(Array.isArray((safe as { limitations: unknown }).limitations)).toBe(true);
    }
  });

  it('contains no scoring-version field and no automatic hire/reject language', async () => {
    const safe = await reportService.getUserSafe('RPT-001');
    const json = JSON.stringify(safe).toLowerCase();
    expect(json).not.toContain('scoringversion');
    expect(json).not.toContain('do not hire');
    expect(json).not.toContain('recommend reject');
  });
});
