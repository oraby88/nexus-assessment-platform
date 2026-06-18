import { describe, it, expect, beforeEach } from 'vitest';
import { roleBlueprintService } from '@/services/roleBlueprint/roleBlueprintService';
import { contextProfileService } from '@/services/contextProfile/contextProfileService';
import { setMockFailRate } from '@/services/http';
import { DEFAULT_CONTEXT_VALUES } from '@/features/contexts/contextSignature';

// FR-BC-013 / SC-007: created blueprints/contexts are listable + eligibility respected (Spec 003 seam).
describe('Create-Assessment picker seam (FR-BC-013)', () => {
  beforeEach(() => setMockFailRate(0));

  it('a created Validated blueprint is listed and eligible for hiring; Deprecated is excluded', async () => {
    const v = await roleBlueprintService.create({
      organizationId: 'org-meridian',
      name: 'Eligible',
      roleTitle: 'R',
      jobFamily: 'Operations',
      jobLevel: 'Manager',
      status: 'Validated',
    });
    const d = await roleBlueprintService.create({
      organizationId: 'org-meridian',
      name: 'Deprecated',
      roleTitle: 'R',
      jobFamily: 'Operations',
      jobLevel: 'Manager',
      status: 'Deprecated',
    });
    const list = await roleBlueprintService.list();
    expect(list.some((b) => b.id === v.id)).toBe(true);
    expect(roleBlueprintService.isEligible(v, { useCase: 'hiring_support' })).toBe(true);
    expect(roleBlueprintService.isEligible(d, { useCase: 'hiring_support' })).toBe(false);
  });

  it('a created context appears in the list', async () => {
    const c = await contextProfileService.create({
      organizationId: 'org-meridian',
      name: 'Pickable',
      roleTitle: 'R',
      jobFamily: 'Operations',
      jobLevel: 'Manager',
      status: 'Active',
      values: { ...DEFAULT_CONTEXT_VALUES },
    });
    const list = await contextProfileService.list();
    expect(list.some((x) => x.id === c.id)).toBe(true);
  });
});
