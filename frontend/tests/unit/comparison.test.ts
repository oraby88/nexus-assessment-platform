import { describe, it, expect, beforeEach } from 'vitest';
import { comparisonService } from '@/services/comparison/comparisonService';
import { setMockFailRate } from '@/services/http';

// FR-RPT-006/007 / SC-005
describe('comparisonService.build (no ranking; eligibility; order preserved)', () => {
  beforeEach(() => setMockFailRate(0));

  it('includes only participants with released reports; flags the rest ineligible', async () => {
    const { comparison, eligibility } = await comparisonService.build({
      roleTitle: 'Finance Manager',
      participantIds: ['CND-2041', 'CND-2043'], // 2041 has RPT-001 released; 2043 has none
      dimensionIds: ['D1-CE', 'D2-AR', 'D4-SR'],
    });
    expect(comparison.participants.map((p) => p.participantId)).toEqual(['CND-2041']);
    expect(eligibility.find((e) => e.participantId === 'CND-2043')?.eligible).toBe(false);
  });

  it('preserves selection order (never reorders by fit)', async () => {
    const { comparison } = await comparisonService.build({
      roleTitle: 'Finance Manager',
      participantIds: ['CND-2049', 'CND-2041'],
      dimensionIds: ['D1-CE'],
    });
    expect(comparison.participants.map((p) => p.participantId)).toEqual(['CND-2049', 'CND-2041']);
  });

  it('returns no ranking/order field on the comparison', async () => {
    const { comparison } = await comparisonService.build({
      roleTitle: 'Finance Manager',
      participantIds: ['CND-2041', 'CND-2049'],
      dimensionIds: ['D1-CE'],
    });
    expect('rank' in (comparison as unknown as Record<string, unknown>)).toBe(false);
    expect('order' in (comparison as unknown as Record<string, unknown>)).toBe(false);
  });
});
