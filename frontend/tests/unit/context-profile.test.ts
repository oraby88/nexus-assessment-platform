import { describe, it, expect, beforeEach } from 'vitest';
import { contextProfileService } from '@/services/contextProfile/contextProfileService';
import { setMockFailRate } from '@/services/http';
import { DEFAULT_CONTEXT_VALUES } from '@/features/contexts/contextSignature';

// FR-BC-008..012
function input() {
  return {
    organizationId: 'org-meridian',
    name: 'Test Context',
    roleTitle: 'Tester',
    jobFamily: 'Operations' as const,
    jobLevel: 'Manager' as const,
    status: 'Active' as const,
    values: { ...DEFAULT_CONTEXT_VALUES },
  };
}

describe('contextProfileService', () => {
  beforeEach(() => setMockFailRate(0));

  it('creates with v1.0 and a version entry', async () => {
    const c = await contextProfileService.create(input());
    expect(c.id).toMatch(/^CX-/);
    expect(c.version).toBe('1.0');
    expect(c.versionHistory).toHaveLength(1);
  });

  it('update appends a version entry', async () => {
    const c = await contextProfileService.create(input());
    const updated = await contextProfileService.update({ ...c, successProfileNotes: 'note' });
    expect((updated.versionHistory ?? []).length).toBe(2);
  });

  it('setStatus moves to Archived (terminal)', async () => {
    const c = await contextProfileService.create(input());
    await contextProfileService.setStatus(c.id, 'Archived');
    await expect(contextProfileService.setStatus(c.id, 'Active')).rejects.toThrow(/terminal/i);
  });
});
