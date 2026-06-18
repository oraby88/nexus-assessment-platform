import { describe, it, expect } from 'vitest';
import { governedBank } from '@/mocks/governed-bank';
import type { ItemBankItem } from '@/models';

// SC-006 / constitution VI: converted items preserve source metadata exactly and never
// fabricate fields absent from the source workbook (e.g. weight/difficulty).
const REQUIRED_KEYS: (keyof ItemBankItem)[] = [
  'itemId',
  'domainId',
  'dimensionId',
  'facetId',
  'methodFamily',
  'itemFormat',
  'itemText',
  'responseScale',
  'bankState',
  'useStatus',
  'reviewStatus',
  'jobLevelOverlay',
  'reverseScored',
];

const FABRICATED = ['weight', 'difficulty'];

describe('item_bank provenance (SC-006)', () => {
  it('the bank is non-empty', () => {
    expect(governedBank.length).toBeGreaterThan(0);
  });

  it('every item preserves required source metadata', () => {
    for (const item of governedBank) {
      for (const key of REQUIRED_KEYS) {
        expect(item[key], `${item.itemId ?? '?'} missing ${String(key)}`).not.toBeUndefined();
      }
      expect(typeof item.itemId).toBe('string');
      expect(item.itemId.length).toBeGreaterThan(0);
    }
  });

  it('no item fabricates fields absent from the source (weight/difficulty)', () => {
    for (const item of governedBank) {
      for (const f of FABRICATED) {
        expect(f in (item as unknown as Record<string, unknown>)).toBe(false);
      }
    }
  });

  it('includes governance edge-case items (blocked or quarantine) for filter testing', () => {
    const hasEdge = governedBank.some(
      (i) =>
        i.useStatus === 'operational_blocked' ||
        i.reviewStatus === 'quarantine_pending_dif_review' ||
        i.bankState === 'pilot' ||
        i.bankState === 'research',
    );
    expect(hasEdge).toBe(true);
  });
});
