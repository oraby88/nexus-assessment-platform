import { describe, it, expect, beforeEach } from 'vitest';
import { roleBlueprintService } from '@/services/roleBlueprint/roleBlueprintService';
import { contextProfileService } from '@/services/contextProfile/contextProfileService';
import { setMockFailRate } from '@/services/http';

// FR-BC-011 / SC-005
describe('two-way Blueprint↔Context link (research D6)', () => {
  beforeEach(() => setMockFailRate(0));

  it('linking from the blueprint updates both records', async () => {
    const bp = await roleBlueprintService.create({
      organizationId: 'org-meridian',
      name: 'BP',
      roleTitle: 'R',
      jobFamily: 'Operations',
      jobLevel: 'Manager',
      status: 'Draft',
    });
    const cx = await contextProfileService.create({
      organizationId: 'org-meridian',
      name: 'CX',
      roleTitle: 'R',
      jobFamily: 'Operations',
      jobLevel: 'Manager',
      status: 'Active',
    });
    await roleBlueprintService.link(bp.id, cx.id);
    expect((await roleBlueprintService.get(bp.id))?.linkedContextProfileId).toBe(cx.id);
    expect((await contextProfileService.get(cx.id))?.linkedBlueprintId).toBe(bp.id);
  });

  it('linking from the context mirrors to the blueprint', async () => {
    const bp = await roleBlueprintService.create({
      organizationId: 'org-meridian',
      name: 'BP2',
      roleTitle: 'R',
      jobFamily: 'Operations',
      jobLevel: 'Manager',
      status: 'Draft',
    });
    const cx = await contextProfileService.create({
      organizationId: 'org-meridian',
      name: 'CX2',
      roleTitle: 'R',
      jobFamily: 'Operations',
      jobLevel: 'Manager',
      status: 'Active',
    });
    await contextProfileService.link(cx.id, bp.id);
    expect((await roleBlueprintService.get(bp.id))?.linkedContextProfileId).toBe(cx.id);
  });
});
