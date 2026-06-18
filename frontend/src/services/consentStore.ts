// Shared, versioned consent + privacy store (Spec 006, research D6). Mirrors the blueprintContextStore
// pattern: a single source of truth the User portal writes (consentService) and the Admin User-Detail
// Consent tab reads (via consentService.forParticipant) — no circular service imports.
import type { ConsentRecord, DataDeletionRequest } from '@/models';
import { consentSeed, deletionRequestSeed } from '@/mocks';
import { getVersioned, setVersioned } from '@/services/persistence';

const KEY = 'nexus_consent_v1';
const VERSION = 1;

interface ConsentStoreState {
  consents: ConsentRecord[];
  deletions: DataDeletionRequest[];
}

function seed(): ConsentStoreState {
  return {
    consents: consentSeed.map((c) => ({ ...c })),
    deletions: deletionRequestSeed.map((d) => ({ ...d })),
  };
}

let state: ConsentStoreState = getVersioned<ConsentStoreState>(KEY, VERSION, seed());

function persist(): void {
  setVersioned(KEY, VERSION, state);
}

export const consentStore = {
  all(): ConsentRecord[] {
    return state.consents;
  },
  byParticipant(participantId: string): ConsentRecord[] {
    return state.consents.filter((c) => c.participantId === participantId);
  },
  byAssessment(assessmentId: string): ConsentRecord[] {
    return state.consents.filter((c) => c.assessmentId === assessmentId);
  },
  find(id: string): ConsentRecord | undefined {
    return state.consents.find((c) => c.id === id);
  },
  upsert(record: ConsentRecord): void {
    const i = state.consents.findIndex((c) => c.id === record.id);
    if (i >= 0) state.consents[i] = record;
    else state.consents.push(record);
    persist();
  },
  deletionRequests(): DataDeletionRequest[] {
    return state.deletions;
  },
  addDeletionRequest(req: DataDeletionRequest): void {
    state.deletions.push(req);
    persist();
  },
  updateDeletionRequest(req: DataDeletionRequest): void {
    const i = state.deletions.findIndex((d) => d.id === req.id);
    if (i >= 0) state.deletions[i] = req;
    else state.deletions.push(req);
    persist();
  },
  /** Test-only reset to the fixture seed (keeps unit tests order-independent). */
  __resetForTest(): void {
    state = seed();
    persist();
  },
};
