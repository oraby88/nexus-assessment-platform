import { describe, it, expect } from 'vitest';
import { dimensionCatalog } from '@/lib/dimensions';

// FR-BC-003 / SC-002
describe('dimensionCatalog (research D2)', () => {
  it('derives distinct, sorted dimensions from the governed bank', async () => {
    const cat = await dimensionCatalog();
    expect(cat.length).toBeGreaterThan(0);
    // deduped
    const ids = cat.map((d) => d.dimensionId);
    expect(new Set(ids).size).toBe(ids.length);
    // sorted
    expect([...ids].sort()).toEqual(ids);
    // real IDs/names + domain present
    for (const d of cat) {
      expect(d.dimensionId).toMatch(/^D\d/);
      expect(d.dimensionName.length).toBeGreaterThan(0);
      expect(d.domainId).toMatch(/^D\d$/);
    }
  });
});
