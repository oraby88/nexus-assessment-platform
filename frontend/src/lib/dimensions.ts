// Dimension catalog (Spec 004 / FR-BC-003, research D2). Derives the distinct construct dimensions
// from the governed item_bank so blueprints reference real dimension IDs that align with Spec 003
// selection — no fabricated dimensions (constitution V). The bank stays code-split via dynamic import.
import type { DimensionCatalogEntry } from '@/models';

export async function dimensionCatalog(): Promise<DimensionCatalogEntry[]> {
  const mod = await import('@/mocks/governed-bank');
  const map = new Map<string, DimensionCatalogEntry>();
  for (const item of mod.governedBank) {
    if (!map.has(item.dimensionId)) {
      map.set(item.dimensionId, {
        dimensionId: item.dimensionId,
        dimensionName: item.dimensionName,
        domainId: item.domainId,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.dimensionId.localeCompare(b.dimensionId));
}
