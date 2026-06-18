import { describe, it, expect, beforeEach } from 'vitest';
import { reportService } from '@/services/report/reportService';
import { setMockFailRate } from '@/services/http';

// FR-RPT-004 / SC-004
describe('reportService.getUserSafe stripping', () => {
  beforeEach(() => setMockFailRate(0));

  it('strips restricted/internal/blocked fields, keeps supportive content', async () => {
    const safe = (await reportService.getUserSafe('RPT-003')) as
      | Record<string, unknown>
      | undefined;
    expect(safe).toBeTruthy();
    // Restricted/internal fields must be absent:
    expect('domains' in safe!).toBe(false);
    expect('domain6' in safe!).toBe(false);
    expect('scoringVersion' in safe!).toBe(false);
    expect('synthesisWeightVersion' in safe!).toBe(false);
    expect('omittedSections' in safe!).toBe(false);
    expect('interviewPrompts' in safe!).toBe(false);
    // Supportive content retained:
    expect(Array.isArray((safe as { strengths: unknown }).strengths)).toBe(true);
    expect(Array.isArray((safe as { limitations: unknown }).limitations)).toBe(true);
  });

  it('exposes only a high-level Domain 6 summary (no indices/radar internals)', async () => {
    const safe = await reportService.getUserSafe('RPT-001');
    const summary = safe?.domain6Summary as Record<string, unknown> | undefined;
    expect(summary).toBeTruthy();
    expect('secondaryIndices' in (summary ?? {})).toBe(false);
    expect('radar' in (summary ?? {})).toBe(false);
  });
});
