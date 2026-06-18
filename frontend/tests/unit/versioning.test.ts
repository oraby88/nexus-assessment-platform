import { describe, it, expect, beforeEach } from 'vitest';
import { roleBlueprintService } from '@/services/roleBlueprint/roleBlueprintService';
import { contextProfileService } from '@/services/contextProfile/contextProfileService';
import { setMockFailRate } from '@/services/http';
import { DEFAULT_CONTEXT_VALUES } from '@/features/contexts/contextSignature';

// FR-BC-012 / SC-006
describe('version history newest-first', () => {
  beforeEach(() => setMockFailRate(0));

  it('blueprint update prepends the new version entry', async () => {
    const b = await roleBlueprintService.create({
      organizationId: 'org-meridian',
      name: 'V',
      roleTitle: 'R',
      jobFamily: 'Operations',
      jobLevel: 'Manager',
      status: 'Draft',
    });
    const u = await roleBlueprintService.update({ ...b, purpose: 'x' });
    const history = await roleBlueprintService.versions(u.id);
    expect(history[0].summary).toBe('Updated'); // newest first
    expect(history[history.length - 1].summary).toBe('Created');
  });

  it('context update prepends the new version entry', async () => {
    const c = await contextProfileService.create({
      organizationId: 'org-meridian',
      name: 'V',
      roleTitle: 'R',
      jobFamily: 'Operations',
      jobLevel: 'Manager',
      status: 'Active',
      values: { ...DEFAULT_CONTEXT_VALUES },
    });
    const u = await contextProfileService.update({ ...c, successProfileNotes: 'x' });
    const history = await contextProfileService.versions(u.id);
    expect(history[0].summary).toBe('Updated');
  });
});
