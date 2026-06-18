import { describe, it, expect, beforeEach } from 'vitest';
import { consentService } from '@/services/consent/consentService';
import { consentStore } from '@/services/consentStore';
import { setMockFailRate } from '@/services/http';

// Spec 007 / US1 — deletion-request resolution (status-only) + reflection in the User view.
describe('consentService deletion resolution (Spec 007 / US1)', () => {
  beforeEach(() => {
    setMockFailRate(0);
    localStorage.clear();
    consentStore.__resetForTest();
  });

  it('lists seeded deletion requests for the Admin inbox', async () => {
    const all = await consentService.allDeletionRequests();
    expect(all.length).toBeGreaterThanOrEqual(2);
    expect(all.some((d) => d.id === 'DEL-1' && d.status === 'Submitted')).toBe(true);
  });

  it('moves Submitted → In Review → Completed and reflects in the User view (SC-001)', async () => {
    await consentService.resolveDeletion('DEL-1', 'In Review');
    const done = await consentService.resolveDeletion('DEL-1', 'Completed');
    expect(done.status).toBe('Completed');
    expect(done.resolvedAt).toBeTruthy();
    // DEL-1 belongs to the current User (CND-2041) → visible via the User-scoped view.
    const userView = await consentService.deletionRequests();
    expect(userView.find((d) => d.id === 'DEL-1')?.status).toBe('Completed');
  });

  it('requires a reason to reject', async () => {
    await expect(consentService.resolveDeletion('DEL-2', 'Rejected')).rejects.toBeTruthy();
    const rejected = await consentService.resolveDeletion('DEL-2', 'Rejected', 'Out of scope');
    expect(rejected.status).toBe('Rejected');
    expect(rejected.reason).toBe('Out of scope');
  });

  it('does not re-resolve a terminal request', async () => {
    await consentService.resolveDeletion('DEL-1', 'Completed');
    await expect(consentService.resolveDeletion('DEL-1', 'In Review')).rejects.toBeTruthy();
  });
});
