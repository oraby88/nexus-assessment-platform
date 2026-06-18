import { describe, it, expect, beforeEach } from 'vitest';
import { questionBankService } from '@/services/questionBank/questionBankService';
import { setMockFailRate } from '@/services/http';
import type { JobRequirementsProfile } from '@/models';

// FR-CA-009 / SC-002
const PROFILE: JobRequirementsProfile = {
  role: 'Finance Manager',
  jobLevel: 'Manager',
  useCase: 'hiring_support',
  responsibilities: [],
  skills: [],
  behaviors: [],
  contextFactors: [],
  criticalDimensionIds: ['D1-CE', 'D2-AR', 'D4-SR'],
  successIndicators: [],
  failureRisks: [],
  nonNegotiables: [],
  recommendedFocus: [],
  estimatedDurationMinutes: 25,
};

describe('questionBankService.propose (governed selection)', () => {
  beforeEach(() => setMockFailRate(0));

  it('proposes only governed-eligible items', async () => {
    const picked = await questionBankService.propose(PROFILE, 'Manager', 'hiring_support');
    expect(picked.length).toBeGreaterThan(0);
    for (const s of picked) {
      expect(s.item.bankState).toBe('production');
      expect(s.item.useStatus).not.toBe('operational_blocked');
      expect(s.item.reviewStatus).not.toBe('quarantine_pending_dif_review');
    }
  });

  it('never includes the blocked/quarantine/pilot item (NEX-GMB-200)', async () => {
    const picked = await questionBankService.propose(PROFILE, 'Manager', 'hiring_support');
    expect(picked.some((s) => s.item.itemId === 'NEX-GMB-200')).toBe(false);
  });

  it('preserves source item_id for attribution', async () => {
    const picked = await questionBankService.propose(PROFILE, 'Manager', 'hiring_support');
    for (const s of picked) {
      expect(typeof s.item.itemId).toBe('string');
      expect(s.item.itemId.length).toBeGreaterThan(0);
    }
  });
});
