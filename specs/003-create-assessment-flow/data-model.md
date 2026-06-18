# Phase 1 — Data Model (Create Assessment Flow slice)

**Source of truth**: `../000-shared/data-model.md` (§5 item bank, §6 adaptation, §7 discovery, §9 draft) and the types in Spec 001 (`frontend/src/models/`). This file records what the flow uses and the additions its steps need.

## 1. Entities consumed (from shared model / 001)

| Entity | Used by | Notes |
|---|---|---|
| `Participant` | Step 1 select/add user | reuse `participantService` (002) |
| `ItemBankItem` (`Readonly`) | Step 7 selection, Step 8 rephrase | immutable source metadata; no `weight`/`difficulty` |
| `RoleBlueprint` / `ContextProfile` | Steps 5–6 pick/link | from Spec 004 (fixtures until 004) |
| `AssessmentAssignment` / `AssessmentInvitation` / `AssessmentReminder` | Step 12 send artifacts | created via assessment store (002) |
| `AppNotification` / `TimelineEvent` | Step 12 send side effects | emitted on send |

## 2. Additions for the flow

| Type | Shape (summary) | Notes |
|---|---|---|
| `AssessmentDraft` | `{ id; participantId; useCase; targetRole; jobLevel; sector?; description?; requirements?; blueprintId?; contextProfileId?; selected: SelectedQuestion[]; deadline?; reminderSchedule[]; invitationMessage?; approved: boolean; currentStep: number; createdAt; updatedAt }` | persisted (`nexus_drafts_v1`, versioned) |
| `JobRequirementsProfile` | role, level, responsibilities[], skills[], behaviors[], contextFactors[], criticalDimensionIds[], successIndicators[], failureRisks[], nonNegotiables[], recommendedFocus[], estimatedDurationMinutes | built from discovery answers (D1) |
| `AgentTurn` | `{ id; sender: 'agent'\|'admin'; kind: 'question'\|'answer'\|'summary'; text; topic?; createdAt }` | scripted chat transcript |
| `DiscoveryAnswer` | `{ questionId; topic; answer: string\|string[]; answeredAt; editedAt? }` | maps to requirements fields |
| `SelectedQuestion` | `{ item: Readonly<ItemBankItem>; requirementCovered; selectionReason; adaptation?: AdaptedQuestionText; approved: boolean }` | source `item_id` preserved (attribution) |
| `AdaptedQuestionText` | `{ itemId; originalText; adaptedText; diff: DiffSpan[]; mode: AdaptationMode; reason; generatedAt }` | display-only; from `adaptationService` |
| `DiffSpan` | `{ text: string; changed: boolean }` | word-level diff (D5) |
| `CoverageReport` | `{ totalQuestions; estimatedDurationMinutes; byDomain; byDimension; requirementCoverage; methodDistribution; warnings: CoverageWarning[] }` | recomputed on change (D4) |
| `CoverageWarning` | `{ dimensionId; level: 'warning'\|'note'; message }` | 0 items → warning; 1 item → note |

## 3. Validation & governance rules

- **Single user** (FR-CA-002): a draft references exactly one `participantId`.
- **Eligibility** (FR-CA-009, D8): only items passing `selectEligible` (production; not blocked; not quarantine-pending; job-level overlay; use-case) may be added; pilot/research excluded.
- **Immutable metadata** (FR-CA-010): `SelectedQuestion.item` is `Readonly`; UI never writes item fields; never renders `weight`/`difficulty`.
- **Adaptation** (FR-CA-011/012, D2): `adaptationService` accepts `{itemId, adaptedText}` only; Likert/contextual rephrase allowed; forced-choice light terminology; `sjt` + `cognitive_multiple_choice` blocked (verbatim) in V1.
- **Approval gate** (FR-CA-014): `draft.approved` must be `true` before `send`.
- **Attribution** (FR-CA-017): each `SelectedQuestion` retains source `item_id`; no client scoring; no live User score.

## 4. State transitions

- **Wizard step**: 1 → 12 → Success; "Next" gated per step minimum inputs; draft `currentStep` tracks position (resume, D6).
- **Draft**: `unapproved → approved` (explicit action) → `sent` (creates assignment Not Started). Send is irreversible from the wizard.
- **Selected question**: `proposed → kept | adapted | replaced | removed`; adapted carries a diff; SJT/cognitive cannot become adapted (stays verbatim).

## 5. Service ownership

Completes typed stubs from Spec 001: `assessmentDraftService` (create/save/get/approve/send), `agentDiscoveryService` (script/answer/requirements), `adaptationService` (adapt/diff/safeguards). Reuses `questionBankService` + `services/governance` (eligibility), `assessmentService` (send artifacts, 002), `roleBlueprintService`/`contextProfileService` (pick). See `./contracts/services.md`.
