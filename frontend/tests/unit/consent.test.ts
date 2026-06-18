import { describe, it, expect, beforeEach } from 'vitest';
import { consentService } from '@/services/consent/consentService';
import { consentStore } from '@/services/consentStore';
import { setMockFailRate } from '@/services/http';

// Spec 006 / US3 — consent gating, applicable filtering, revocation eligibility + propagation.
describe('consentService (Spec 006 / US3)', () => {
  beforeEach(() => {
    setMockFailRate(0);
    localStorage.clear();
    consentStore.__resetForTest();
  });

  it('returns the required consent + only applicable optional consents (FR-USR-005/006)', async () => {
    const list = await consentService.forAssessment('AS-RUNTIME');
    expect(list.some((c) => c.required && c.useCase === 'pre_hire_screening')).toBe(true);
    expect(list.some((c) => !c.required && c.useCase === 'research')).toBe(true);
    // third_party_sharing was not seeded as applicable → not offered
    expect(list.some((c) => c.useCase === 'third_party_sharing')).toBe(false);
  });

  it('accept and decline transition the status', async () => {
    const [req] = await consentService.forAssessment('AS-RUNTIME');
    expect((await consentService.accept(req.id)).status).toBe('Granted');
    expect((await consentService.decline(req.id)).status).toBe('Declined');
  });

  it('revokes an eligible consent and reflects it in the participant view (SC-006)', async () => {
    const list = await consentService.forAssessment('AS-RUNTIME');
    const optional = list.find((c) => !c.required)!;
    await consentService.accept(optional.id);
    expect((await consentService.revoke(optional.id)).status).toBe('Revoked');
    const forParticipant = await consentService.forParticipant('CND-2041');
    expect(forParticipant.find((c) => c.id === optional.id)?.status).toBe('Revoked');
  });

  it('does not revoke a locked (non-revocable) required consent (D5)', async () => {
    const before = consentStore.find('CNS-DONE-REQ');
    expect(before?.revocable).toBe(false);
    const r = await consentService.revoke('CNS-DONE-REQ');
    expect(r.status).toBe('Granted'); // unchanged
  });
});
