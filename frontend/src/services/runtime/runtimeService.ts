// Runtime service (Spec 006). Serves a fixed pre-resolved item set (selected/adapted upstream by
// Spec 003) and persists RuntimeState locally for pause/resume/reload. Responses are keyed by the
// immutable source Question ID (constitution VIII). The frontend performs NO production scoring and
// NEVER returns or computes a score.
import type { RuntimeItem, RuntimeSession, RuntimeState, UserAssessmentSummary } from '@/models';
import { mockRequest } from '@/services/http';
import { getVersioned, setVersioned, StorageKeys, SchemaVersions } from '@/services/persistence';
import { runtimeAssessments, userAssessmentSummaries } from '@/mocks';
import type { RuntimeServiceContract } from '@/services/contracts';

type RuntimeMap = Record<string, RuntimeState>;

function loadMap(): RuntimeMap {
  return getVersioned<RuntimeMap>(StorageKeys.runtime, SchemaVersions.runtime, {});
}
function saveMap(map: RuntimeMap): void {
  setVersioned(StorageKeys.runtime, SchemaVersions.runtime, map);
}
function nowIso(): string {
  return new Date().toISOString();
}

function fixture(assessmentId: string) {
  return runtimeAssessments.find((a) => a.assessmentId === assessmentId);
}

function initialState(assessmentId: string, participantId: string): RuntimeState {
  return {
    assessmentId,
    participantId,
    questionIndex: 0,
    answers: {},
    progressPercent: 0,
    paused: false,
    startedAt: nowIso(),
  };
}

function progressOf(answers: Record<string, number | string>, items: RuntimeItem[]): number {
  if (items.length === 0) return 0;
  const answered = items.filter((i) => answers[i.sourceQuestionId] != null).length;
  return Math.round((answered / items.length) * 100);
}

/** Read-or-init the persisted state for an assessment, recomputing progress against its item set. */
function ensureState(assessmentId: string): { map: RuntimeMap; state: RuntimeState } {
  const fx = fixture(assessmentId);
  if (!fx) throw new Error(`Unknown assessment: ${assessmentId}`);
  const map = loadMap();
  const state = map[assessmentId] ?? initialState(assessmentId, fx.participantId);
  return { map, state };
}

function commit(map: RuntimeMap, state: RuntimeState): RuntimeState {
  state.lastSavedAt = nowIso();
  map[state.assessmentId] = state;
  saveMap(map);
  return state;
}

export const runtimeService = {
  /** Load the fixed item set + rehydrated progress (research D3/D1). */
  load(assessmentId: string): Promise<RuntimeSession> {
    return mockRequest(() => {
      const fx = fixture(assessmentId);
      if (!fx) throw new Error(`Unknown assessment: ${assessmentId}`);
      const map = loadMap();
      const state = map[assessmentId] ?? initialState(assessmentId, fx.participantId);
      return {
        assessmentId,
        items: fx.items.map((i) => ({ ...i })),
        state,
        meta: {
          targetRole: fx.targetRole,
          useCase: fx.useCase,
          organizationName: fx.organizationName,
          estimatedMinutes: fx.estimatedMinutes,
          deadline: fx.deadline,
        },
      };
    });
  },

  /** Persist an answer keyed by source Question ID; recompute progress; stamp lastSavedAt. */
  answer(
    assessmentId: string,
    sourceQuestionId: string,
    value: number | string,
  ): Promise<RuntimeState> {
    return mockRequest(() => {
      const fx = fixture(assessmentId);
      if (!fx) throw new Error(`Unknown assessment: ${assessmentId}`);
      const { map, state } = ensureState(assessmentId);
      state.answers = { ...state.answers, [sourceQuestionId]: value };
      state.progressPercent = progressOf(state.answers, fx.items);
      return commit(map, state);
    });
  },

  /** Advance only when the current item is answered (forward gating). Allows reaching the review step. */
  next(assessmentId: string): Promise<RuntimeState> {
    return mockRequest(() => {
      const fx = fixture(assessmentId);
      if (!fx) throw new Error(`Unknown assessment: ${assessmentId}`);
      const { map, state } = ensureState(assessmentId);
      const current = fx.items[state.questionIndex];
      const answered = !current || state.answers[current.sourceQuestionId] != null;
      if (answered) state.questionIndex = Math.min(state.questionIndex + 1, fx.items.length);
      return commit(map, state);
    });
  },

  back(assessmentId: string): Promise<RuntimeState> {
    return mockRequest(() => {
      const { map, state } = ensureState(assessmentId);
      state.questionIndex = Math.max(0, state.questionIndex - 1);
      return commit(map, state);
    });
  },

  /** Free back-navigation to any already-answered (or current) index (research D2). */
  goTo(assessmentId: string, index: number): Promise<RuntimeState> {
    return mockRequest(() => {
      const fx = fixture(assessmentId);
      if (!fx) throw new Error(`Unknown assessment: ${assessmentId}`);
      const { map, state } = ensureState(assessmentId);
      state.questionIndex = Math.max(0, Math.min(index, fx.items.length));
      return commit(map, state);
    });
  },

  pause(assessmentId: string): Promise<RuntimeState> {
    return mockRequest(() => {
      const { map, state } = ensureState(assessmentId);
      state.paused = true;
      return commit(map, state);
    });
  },

  resume(assessmentId: string): Promise<RuntimeState> {
    return mockRequest(() => {
      const { map, state } = ensureState(assessmentId);
      state.paused = false;
      return commit(map, state);
    });
  },

  /** Submit → records submittedAt and the completion state. No score returned. */
  submit(assessmentId: string): Promise<{ ok: true; submittedAt: string }> {
    return mockRequest(() => {
      const { map, state } = ensureState(assessmentId);
      const submittedAt = nowIso();
      state.submittedAt = submittedAt;
      commit(map, state);
      return { ok: true as const, submittedAt };
    });
  },

  /** Current persisted progress without reloading the item set (dashboard hero / resume cards). */
  getProgress(assessmentId: string): Promise<RuntimeState | null> {
    return mockRequest(() => loadMap()[assessmentId] ?? null);
  },

  /** Own-data assessment summaries (dashboard, My Assessments, History), merged with live progress. */
  myAssessments(): Promise<UserAssessmentSummary[]> {
    return mockRequest(() => {
      const map = loadMap();
      return userAssessmentSummaries.map((s) => {
        const st = map[s.assessmentId];
        if (!st) return { ...s };
        const lifecycle = st.submittedAt
          ? ('submitted' as const)
          : st.progressPercent > 0
            ? ('in_progress' as const)
            : s.lifecycle;
        return { ...s, progressPercent: st.progressPercent, lifecycle };
      });
    });
  },
} satisfies RuntimeServiceContract;
