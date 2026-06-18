import { describe, it, expect, beforeEach } from 'vitest';
import { roleBlueprintService } from '@/services/roleBlueprint/roleBlueprintService';
import { setMockFailRate } from '@/services/http';
import type { RoleBlueprint } from '@/models';

// FR-BC-002/004/007 / SC-001/002/003
function input(over: Partial<RoleBlueprint> = {}) {
  return {
    organizationId: 'org-meridian',
    name: 'Test Blueprint',
    roleTitle: 'Tester',
    jobFamily: 'Operations' as const,
    jobLevel: 'Manager' as const,
    status: 'Draft' as const,
    ...over,
  };
}

describe('roleBlueprintService (FR-BC-007)', () => {
  beforeEach(() => setMockFailRate(0));

  it('creates with v1.0 and an initial version entry', async () => {
    const b = await roleBlueprintService.create(input());
    expect(b.id).toMatch(/^BP-/);
    expect(b.version).toBe('1.0');
    expect(b.versionHistory).toHaveLength(1);
  });

  it('update appends a version entry and bumps version', async () => {
    const b = await roleBlueprintService.create(input());
    const updated = await roleBlueprintService.update({ ...b, purpose: 'Lead the team' });
    expect(updated.version).not.toBe('1.0');
    expect((updated.versionHistory ?? []).length).toBe(2);
  });

  it('setStatus is free-form but Archived is terminal', async () => {
    const b = await roleBlueprintService.create(input());
    await roleBlueprintService.setStatus(b.id, 'Validated');
    const v = await roleBlueprintService.get(b.id);
    expect(v?.status).toBe('Validated');
    await roleBlueprintService.setStatus(b.id, 'Archived');
    await expect(roleBlueprintService.setStatus(b.id, 'Active')).rejects.toThrow(/terminal/i);
  });

  it('isEligible: Validated required for hiring; Deprecated/Archived excluded', async () => {
    expect(
      roleBlueprintService.isEligible(input({ status: 'Validated' }) as RoleBlueprint, {
        useCase: 'hiring_support',
      }),
    ).toBe(true);
    expect(
      roleBlueprintService.isEligible(input({ status: 'Active' }) as RoleBlueprint, {
        useCase: 'hiring_support',
      }),
    ).toBe(false);
    expect(roleBlueprintService.isEligible(input({ status: 'Active' }) as RoleBlueprint)).toBe(
      true,
    );
    expect(roleBlueprintService.isEligible(input({ status: 'Deprecated' }) as RoleBlueprint)).toBe(
      false,
    );
  });

  it('duplicate creates a Draft copy with a new id', async () => {
    const b = await roleBlueprintService.create(input({ status: 'Validated' }));
    const copy = await roleBlueprintService.duplicate(b.id);
    expect(copy.id).not.toBe(b.id);
    expect(copy.status).toBe('Draft');
  });
});
