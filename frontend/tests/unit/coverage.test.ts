import { describe, it, expect } from 'vitest';
import { computeCoverage } from '@/features/create-assessment/coverage';
import type { ItemBankItem, JobRequirementsProfile, SelectedQuestion } from '@/models';

function sel(dimensionId: string): SelectedQuestion {
  const item = {
    itemId: `I-${dimensionId}-${Math.round(Math.abs(Math.sin(dimensionId.length)) * 1000)}`,
    domainId: 'D1',
    domainName: 'D1',
    dimensionId,
    dimensionName: dimensionId,
    facetId: 'f',
    facetName: 'f',
    methodFamily: 'likert',
    itemFormat: 'statement',
    itemText: 't',
    options: {},
    keyedAnswer: null,
    responseScale: '1-5 Agreement',
    bankState: 'production',
    useStatus: 'operational_allowed',
    reviewStatus: 'draft',
    jobLevelOverlay: 'all_levels',
    reverseScored: false,
  } as ItemBankItem;
  return { item, requirementCovered: dimensionId, selectionReason: 'x', approved: false };
}

const profile = { criticalDimensionIds: ['D1-CE', 'D2-AR'] } as JobRequirementsProfile;

describe('computeCoverage (FR-CA-013, research D4)', () => {
  it('warns when a required dimension has 0 items', () => {
    const r = computeCoverage([], profile);
    expect(r.warnings.filter((w) => w.level === 'warning')).toHaveLength(2);
  });

  it('notes when a required dimension has exactly 1 item', () => {
    const r = computeCoverage([sel('D1-CE')], profile);
    const d1 = r.warnings.find((w) => w.dimensionId === 'D1-CE');
    expect(d1?.level).toBe('note');
    expect(r.warnings.find((w) => w.dimensionId === 'D2-AR')?.level).toBe('warning');
  });

  it('counts totals and recomputes on change', () => {
    const r = computeCoverage([sel('D1-CE'), sel('D2-AR')], profile);
    expect(r.totalQuestions).toBe(2);
    expect(r.warnings.filter((w) => w.level === 'warning')).toHaveLength(0);
  });
});
