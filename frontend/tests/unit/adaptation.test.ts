import { describe, it, expect, beforeEach } from 'vitest';
import { adaptationService } from '@/services/adaptation/adaptationService';
import { diffWords } from '@/lib/diffWords';
import { setMockFailRate } from '@/services/http';
import type { ItemBankItem, MethodFamily } from '@/models';

function item(methodFamily: MethodFamily, text = 'I keep my commitments at work.'): ItemBankItem {
  return {
    itemId: 'NEX-T',
    domainId: 'D1',
    domainName: 'Character & Work Style',
    dimensionId: 'D1-CE',
    dimensionName: 'Conscientious Execution',
    facetId: 'D1-CE-DEP',
    facetName: 'Dependability',
    methodFamily,
    itemFormat: 'statement',
    itemText: text,
    options: {},
    keyedAnswer: null,
    responseScale: '1-5 Agreement',
    bankState: 'production',
    useStatus: 'operational_allowed',
    reviewStatus: 'draft',
    jobLevelOverlay: 'all_levels',
    reverseScored: false,
  };
}

describe('diffWords (FR-CA-011)', () => {
  it('marks inserted/changed words as changed', () => {
    const spans = diffWords('I keep commitments', 'I always keep commitments');
    expect(spans.some((s) => s.changed && s.text.includes('always'))).toBe(true);
  });
});

describe('adaptationService method safeguards (FR-CA-012, research D2)', () => {
  beforeEach(() => setMockFailRate(0));

  it('allows Likert rephrase (display text changes, with diff)', async () => {
    const a = await adaptationService.adapt({
      itemId: 'NEX-T',
      adaptedText: 'I reliably keep my commitments at work.',
      item: item('likert'),
    });
    expect(a.adaptedText).toContain('reliably');
    expect(a.diff.some((s) => s.changed)).toBe(true);
  });

  it('keeps SJT verbatim (no template in V1)', async () => {
    const it = item('sjt', 'You discover a billing error. What do you do first?');
    const a = await adaptationService.adapt({
      itemId: it.itemId,
      adaptedText: 'totally different text',
      item: it,
    });
    expect(a.adaptedText).toBe(it.itemText);
    expect(adaptationService.canAdapt('sjt')).toBe(false);
  });

  it('keeps cognitive MCQ verbatim', async () => {
    expect(adaptationService.canAdapt('cognitive_multiple_choice')).toBe(false);
  });
});
