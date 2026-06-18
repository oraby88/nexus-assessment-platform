import { describe, it, expect, beforeEach } from 'vitest';
import { consentService } from '@/services/consent/consentService';
import { consentStore } from '@/services/consentStore';
import { setMockFailRate } from '@/services/http';

// Spec 006 / US6 / research D7 — a deletion request is created pending ('Submitted').
describe('data-deletion request (Spec 006 / US6)', () => {
  beforeEach(() => {
    setMockFailRate(0);
    localStorage.clear();
    consentStore.__resetForTest();
  });

  it('creates a pending Submitted request queued for the Admin privacy inbox', async () => {
    const req = await consentService.requestDeletion('please remove my data');
    expect(req.status).toBe('Submitted');
    expect(req.participantId).toBe('CND-2041');
    const all = await consentService.deletionRequests();
    expect(all.some((d) => d.id === req.id && d.status === 'Submitted')).toBe(true);
  });
});
