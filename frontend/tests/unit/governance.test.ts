import { describe, it, expect } from 'vitest';
import {
  confidenceBand,
  isOperationallyEligible,
  selectEligible,
  toUserSafe,
  visibility,
} from '@/services/governance';
import type { ItemBankItem } from '@/models';

function item(overrides: Partial<ItemBankItem>): ItemBankItem {
  return {
    itemId: 'NEX-GMB-001',
    domainId: 'D1',
    domainName: 'Character & Work Style',
    dimensionId: 'D1-CE',
    dimensionName: 'Conscientious Execution',
    facetId: 'D1-CE-DEP',
    facetName: 'Dependability',
    methodFamily: 'likert',
    itemFormat: 'statement',
    itemText: 'I keep my commitments.',
    options: {},
    keyedAnswer: null,
    responseScale: '1-5 Agreement',
    bankState: 'production',
    useStatus: 'operational_allowed',
    reviewStatus: 'draft',
    jobLevelOverlay: 'all_levels',
    reverseScored: false,
    ...overrides,
  };
}

describe('governance: eligibility (constitution V/VI)', () => {
  it('accepts a clean production/operational item', () => {
    expect(isOperationallyEligible(item({}))).toBe(true);
  });

  it('excludes blocked, quarantined, and non-production items', () => {
    expect(isOperationallyEligible(item({ useStatus: 'operational_blocked' }))).toBe(false);
    expect(isOperationallyEligible(item({ reviewStatus: 'quarantine_pending_dif_review' }))).toBe(
      false,
    );
    expect(isOperationallyEligible(item({ bankState: 'pilot' }))).toBe(false);
    expect(isOperationallyEligible(item({ bankState: 'research' }))).toBe(false);
  });

  it('enforces job-level overlay', () => {
    const mgrPlus = item({ jobLevelOverlay: 'manager_plus' });
    expect(isOperationallyEligible(mgrPlus, { jobLevel: 'Professional' })).toBe(false);
    expect(isOperationallyEligible(mgrPlus, { jobLevel: 'Director' })).toBe(true);
  });

  it('selectEligible filters out non-operational items', () => {
    const bank = [item({}), item({ itemId: 'X', useStatus: 'operational_blocked' })];
    const out = selectEligible(bank);
    expect(out).toHaveLength(1);
    expect(out[0].itemId).toBe('NEX-GMB-001');
  });
});

describe('governance: confidence bands (SE thresholds)', () => {
  it('maps SE to bands', () => {
    expect(confidenceBand(0.2)).toBe('High');
    expect(confidenceBand(0.3)).toBe('Moderate');
    expect(confidenceBand(0.4)).toBe('Low');
    expect(confidenceBand(0.6)).toBe('Unacceptable');
  });
});

describe('governance: visibility & user-safe (constitution IX/X/XI)', () => {
  it('hides unacceptable and shows high', () => {
    expect(visibility('Unacceptable', 'developmental', 'admin')).toBe('hidden');
    expect(visibility('High', 'hiring_support', 'admin')).toBe('visible');
  });

  it('user-safe projection strips restricted/internal fields', () => {
    const admin = {
      id: 'r1',
      scoringVersion: 'v2',
      synthVersion: 'sw1',
      omitted: [{}],
      d6: {},
      strengths: [],
    };
    const safe = toUserSafe(admin) as Record<string, unknown>;
    expect(safe.scoringVersion).toBeUndefined();
    expect(safe.synthVersion).toBeUndefined();
    expect(safe.omitted).toBeUndefined();
    expect(safe.d6).toBeUndefined();
    expect((safe as { strengths: unknown[] }).strengths).toBeDefined();
  });
});
