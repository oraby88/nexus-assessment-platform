// Consent service (Spec 006). Per-use-case consent gating + revocation, plus data-deletion intake.
// Writes through the shared consentStore so revocation reflects in the Admin User-Detail Consent tab
// (research D6/SC-006). Optional consents are always revocable; the required consent is revocable until
// the report is released, then locked (research D5). A deletion request is created pending (research D7).
import type { ConsentRecord, DataDeletionRequest } from '@/models';
import { mockRequest } from '@/services/http';
import { consentStore } from '@/services/consentStore';
import { CURRENT_USER_PARTICIPANT } from '@/mocks';
import type { ConsentServiceContract } from '@/services/contracts';

function nowIso(): string {
  return new Date().toISOString();
}

export const consentService = {
  /** Consents for an assessment (only applicable consents are seeded, so all are returned). */
  forAssessment(assessmentId: string): Promise<ConsentRecord[]> {
    return mockRequest(() => consentStore.byAssessment(assessmentId).map((c) => ({ ...c })));
  },

  /** Consents for a participant — used by Profile & Privacy and the Admin Consent tab. */
  forParticipant(participantId: string): Promise<ConsentRecord[]> {
    return mockRequest(() => consentStore.byParticipant(participantId).map((c) => ({ ...c })));
  },

  /** The current User's consent history (own-data). */
  history(): Promise<ConsentRecord[]> {
    return mockRequest(() =>
      consentStore.byParticipant(CURRENT_USER_PARTICIPANT).map((c) => ({ ...c })),
    );
  },

  accept(consentId: string): Promise<ConsentRecord> {
    return mockRequest(() => {
      const c = consentStore.find(consentId);
      if (!c) throw new Error(`Unknown consent: ${consentId}`);
      const updated: ConsentRecord = { ...c, status: 'Granted', grantedAt: nowIso() };
      consentStore.upsert(updated);
      return { ...updated };
    });
  },

  decline(consentId: string): Promise<ConsentRecord> {
    return mockRequest(() => {
      const c = consentStore.find(consentId);
      if (!c) throw new Error(`Unknown consent: ${consentId}`);
      const updated: ConsentRecord = { ...c, status: 'Declined', declinedAt: nowIso() };
      consentStore.upsert(updated);
      return { ...updated };
    });
  },

  /** Revocation honored only when eligible (revocable). Locked records are returned unchanged. */
  revoke(consentId: string): Promise<ConsentRecord> {
    return mockRequest(() => {
      const c = consentStore.find(consentId);
      if (!c) throw new Error(`Unknown consent: ${consentId}`);
      if (!c.revocable) return { ...c };
      const updated: ConsentRecord = { ...c, status: 'Revoked', revokedAt: nowIso() };
      consentStore.upsert(updated);
      return { ...updated };
    });
  },

  /** Create a pending ('Submitted') deletion request queued for the Spec 007 Admin privacy inbox. */
  requestDeletion(note?: string): Promise<DataDeletionRequest> {
    return mockRequest(() => {
      const req: DataDeletionRequest = {
        id: `DEL-${consentStore.deletionRequests().length + 1}`,
        participantId: CURRENT_USER_PARTICIPANT,
        submittedAt: nowIso(),
        status: 'Submitted',
        note,
      };
      consentStore.addDeletionRequest(req);
      return { ...req };
    });
  },

  /** Own deletion requests (Profile & Privacy acknowledgement view). */
  deletionRequests(): Promise<DataDeletionRequest[]> {
    return mockRequest(() =>
      consentStore
        .deletionRequests()
        .filter((d) => d.participantId === CURRENT_USER_PARTICIPANT)
        .map((d) => ({ ...d })),
    );
  },

  /** All deletion requests for the Admin privacy inbox (organization-scoped — single org in V1). */
  allDeletionRequests(): Promise<DataDeletionRequest[]> {
    return mockRequest(() => consentStore.deletionRequests().map((d) => ({ ...d })));
  },

  /** Status-only resolution (Spec 007 / D3). Rejection requires a reason; terminal requests are final.
   * No User data is removed or altered — real erasure is a future backend responsibility. */
  resolveDeletion(
    id: string,
    status: 'In Review' | 'Completed' | 'Rejected',
    reason?: string,
  ): Promise<DataDeletionRequest> {
    return mockRequest(() => {
      const d = consentStore.deletionRequests().find((x) => x.id === id);
      if (!d) throw new Error(`Unknown deletion request: ${id}`);
      if (d.status === 'Completed' || d.status === 'Rejected') {
        throw new Error('Request already resolved');
      }
      if (status === 'Rejected' && !reason) {
        throw new Error('A reason is required to reject a request');
      }
      const terminal = status === 'Completed' || status === 'Rejected';
      const updated: DataDeletionRequest = {
        ...d,
        status,
        reason: status === 'Rejected' ? reason : d.reason,
        resolvedAt: terminal ? nowIso() : d.resolvedAt,
      };
      consentStore.updateDeletionRequest(updated);
      return { ...updated };
    });
  },
} satisfies ConsentServiceContract;
