// Assessment draft orchestration (Spec 003 / FR-CA-001/014/016). Persists the in-progress 12-step
// draft via the versioned store (discard-on-mismatch); send requires explicit approval and creates
// the assignment + invitation + timeline + notification via the Spec 002 assessment store (research D6/D7).
import type { AssessmentAssignment, AssessmentDraft, AssessmentInvitation } from '@/models';
import { mockRequest } from '@/services/http';
import { getVersioned, setVersioned, SchemaVersions } from '@/services/persistence';
import { assessmentService } from '@/services/assessment/assessmentService';
import type { AssessmentDraftServiceContract } from '@/services/contracts';

const KEY = 'nexus_drafts_v1';
let seq = 0;

type DraftMap = Record<string, AssessmentDraft>;

function loadAll(): DraftMap {
  return getVersioned<DraftMap>(KEY, SchemaVersions.drafts, {});
}
function saveAll(map: DraftMap): void {
  setVersioned(KEY, SchemaVersions.drafts, map);
}

export const assessmentDraftService = {
  create(participantId: string): Promise<AssessmentDraft> {
    return mockRequest(() => {
      seq += 1;
      const draft: AssessmentDraft = {
        id: `DRAFT-${seq}`,
        participantId,
        useCase: 'developmental',
        targetRole: '',
        jobLevel: 'Professional',
        selected: [],
        reminderSchedule: [],
        approved: false,
        currentStep: 1,
        createdAt: '2026-06-15',
        updatedAt: '2026-06-15',
      };
      const all = loadAll();
      all[draft.id] = draft;
      saveAll(all);
      return draft;
    });
  },

  save(draft: AssessmentDraft): Promise<AssessmentDraft> {
    return mockRequest(() => {
      const all = loadAll();
      all[draft.id] = { ...draft, updatedAt: '2026-06-15' };
      saveAll(all);
      return all[draft.id];
    });
  },

  get(id: string): Promise<AssessmentDraft | undefined> {
    return mockRequest(() => loadAll()[id]);
  },

  approve(id: string): Promise<AssessmentDraft> {
    return mockRequest(() => {
      const all = loadAll();
      const d = all[id];
      if (!d) throw new Error('Draft not found');
      d.approved = true;
      saveAll(all);
      return d;
    });
  },

  /** Send requires explicit approval; creates the assignment + invitation via the 002 store (FR-CA-014/016). */
  async send(
    draft: AssessmentDraft,
  ): Promise<{ assignment: AssessmentAssignment; invitation: AssessmentInvitation }> {
    if (!draft.approved) throw new Error('Assessment must be approved before sending');
    const res = await assessmentService.create({
      participantId: draft.participantId,
      useCase: draft.useCase,
      targetRole: draft.targetRole || 'Untitled role',
      jobLevel: draft.jobLevel,
      deadline: draft.deadline,
    });
    const all = loadAll();
    delete all[draft.id];
    saveAll(all);
    return res;
  },
} satisfies AssessmentDraftServiceContract;
