# Phase 1 Data Model: User Portal & Assessment Runtime

All canonical shapes are the shared-canon types in `specs/000-shared/data-model.md` (§3 Consent and Privacy, §10 User Runtime and Question-Level Scoring Attribution). This feature adds the missing types to `frontend/src/models` as **NEW** exports (no edits to existing required fields — constitution-safe; recurring F1 rule: extend only with new/optional types). Render-only view types live alongside.

## Reused canonical types (add to `models` verbatim from shared §3/§10)

```ts
// §10 — runtime + attribution (the frontend captures; it never scores)
interface QuestionResponse {
  assessmentId: string;
  sourceQuestionId: string;       // immutable source Question ID (ItemBankItem.itemId) — constitution VIII
  value: number | string;
  answeredAt: string;
}

interface RuntimeState {
  assessmentId: string;
  participantId: string;
  questionIndex: number;          // current position; back-nav may set it to any answered index
  answers: Record<string, number | string>;  // keyed by sourceQuestionId, NOT array index
  progressPercent: number;
  paused: boolean;
  startedAt?: string;
  lastSavedAt?: string;           // drives the save indicator
  submittedAt?: string;           // set on submit → completion state
}

// §3 — consent + privacy
type ConsentUseCase =
  | 'pre_hire_screening'
  | 'developmental_feedback'
  | 'research'
  | 'third_party_sharing';

type ConsentStatus = 'Pending' | 'Granted' | 'Declined' | 'Revoked';

interface ConsentRecord {
  id: string;
  participantId: string;
  assessmentId?: string;
  useCase: ConsentUseCase;
  label: string;
  informedText: string;
  status: ConsentStatus;
  required: boolean;
  revocable: boolean;             // optional: true always; required: true until report released, then false (D5)
  grantedAt?: string;
  declinedAt?: string;
  revokedAt?: string;
  organizationId: string;
}

interface DataDeletionRequest {
  id: string;
  participantId: string;
  submittedAt: string;
  status: 'Submitted' | 'In Review' | 'Completed' | 'Rejected';  // created as 'Submitted' (pending) — D7
  note?: string;
}
```

## New render-only view types (this feature)

```ts
// The pre-resolved item set the runtime renders verbatim (D3). Display fields only.
interface RuntimeItem {
  sourceQuestionId: string;        // = ItemBankItem.itemId
  methodFamily: MethodFamily;      // selects the renderer
  itemText: string;                // adapted display wording (verbatim from Spec 003) — no diffs shown
  options: Partial<Record<'a' | 'b' | 'c' | 'd' | 'e', string>>;
  responseScale: ResponseScale;
  sectionId?: string;              // for display-only section timer grouping (D8)
}

// What runtimeService.load returns: the fixed set + rehydrated progress.
interface RuntimeSession {
  assessmentId: string;
  items: ReadonlyArray<RuntimeItem>;   // ordered, pre-resolved; NEVER mutated
  state: RuntimeState;                  // rehydrated from localStorage or freshly initialized
  meta: { targetRole: string; useCase: ConsentUseCase; estimatedMinutes?: number; deadline?: string };
}

// User-facing assessment summary (own-data) for dashboard hero / My Assessments / History.
interface UserAssessmentSummary {
  assessmentId: string;
  targetRole: string;
  useCase: ConsentUseCase;
  organizationName: string;
  deadline?: string;
  progressPercent: number;
  lifecycle: 'active' | 'in_progress' | 'submitted' | 'completed' | 'expired';
  reportId?: string;               // present once a user-safe report is available
}
```

`UserSafeReport` is reused **unchanged** from Spec 005 (`models` already exports it; `reportService.getUserSafe` is the only producer).

## Relationships

- `RuntimeSession.items[i].sourceQuestionId` → key in `RuntimeState.answers` and in each `QuestionResponse`. One-to-one; index is presentation order only.
- `ConsentRecord.assessmentId` links a consent to the assessment that requires it; `forAssessment(assessmentId)` filters by it. `participantId`/`organizationId` scope it to the current User and org (constitution III).
- `DataDeletionRequest.participantId` scopes to the current User; consumed later by the Spec 007 Admin privacy inbox.
- `UserAssessmentSummary.reportId` → `UserSafeReport.id` via `reportService.getUserSafe`.

## State transitions

**Runtime** (`RuntimeState`):
`(none)` → **load** → `{ questionIndex: restored|0, answers: restored|{}, paused: false }`
→ **answer(qid, value)** → updates `answers[qid]`, recomputes `progressPercent`, sets `lastSavedAt` (auto-save)
→ **next/back** → adjusts `questionIndex` (next gated on current answered; back free to any answered index)
→ **pause** → `paused: true` (persisted); **resume** → `paused: false`
→ **reload** → rehydrate from `localStorage` (current question + all answers restored — SC-002)
→ **submit** → `submittedAt` set → Completion state (no score shown).

**Consent** (`ConsentRecord.status`):
`Pending` → **accept** → `Granted (grantedAt)` → **revoke** (if `revocable`) → `Revoked (revokedAt)`
`Pending` → **decline** → `Declined (declinedAt)` (neutral return to dashboard).
Required consent: `revocable` flips to `false` once the assessment's report is released (locked/historical — D5).

**Deletion request** (`DataDeletionRequest.status`): created `Submitted` (pending); later transitions (`In Review`/`Completed`/`Rejected`) are owned by the Spec 007 Admin inbox.

## Validation & invariants

- **VIII** — every stored answer/`QuestionResponse` is keyed by `sourceQuestionId`; no array-index keying; **no score field exists** in any runtime/report payload reaching the User.
- **VI/VII** — `RuntimeItem` exposes display fields only; no `ItemBankItem` governance metadata is surfaced; adapted wording shown verbatim (no diff).
- **IX/III** — User report payload contains **zero** restricted/internal keys (`domains`, `domain6`, `scoringVersion`, `synthesisWeightVersion`, `omittedSections`, `interviewPrompts`, Admin notes, blocked values); enforced by the user-safe guard test.
- **Consent** — `Accept and Continue` requires the required consent `Granted`; optional consents only present when `applicable`; revocation honored only when `revocable`.
- **Scope** — all queries filter by the current `participantId`/`organizationId`; a User never receives another User's data.
