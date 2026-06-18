# Phase 1 — Data Model (Frontend Prototype)

**Source of truth**: the full typed inventory + enums lives in `../000-shared/data-model.md` and the lifecycle/visibility rules in `../000-shared/status-models.md`. This file summarizes the entities, relationships, validation, and state transitions for planning; do not duplicate the TypeScript here.

## Entities & key relationships

| Entity | Key fields | Relationships |
|---|---|---|
| **Organization** | id, name, v1AdminAccountLimit=1 | has 1 Admin; has many Participants |
| **Session** (auth) | role (`admin`/`user`), userId, organizationId | belongs to Organization |
| **Participant** (Candidate) | id, fullName, email, jobLevel, target/current title, dept?, dateAdded, latest lifecycle/validity/report | has many Assessments, Consents, Reports |
| **ConsentRecord** | useCase (pre_hire/developmental/research/third_party), status, required, revocable, timestamps | belongs to Participant (+ optional Assessment) |
| **RoleBlueprint** | id, name, role, family, level, required/optional/excluded dimensions, importance, evidence, version, status | links 1 ContextProfile; used by many Assessments; has VersionEntries |
| **ContextProfile** | id, name, family, level, 17 context values, status, version | links 1 RoleBlueprint; used by Assessments; has VersionEntries |
| **ItemBankItem** (governed) | itemId, domain/dimension/facet, methodFamily, itemFormat, responseScale, options, keyedAnswer, bankState, useStatus, reviewStatus, jobLevelOverlay, reverseScored | referenced (read-only) by SelectedQuestion, Response |
| **AdaptedQuestionText** | itemId, originalText, adaptedText, diff, mode | display-only layer over ItemBankItem |
| **SelectedQuestion** | item (readonly), adapted?, requirementCovered, approved | part of an Assessment draft |
| **Assessment** | id, participant, useCase, role, blueprint, context, assigned/deadline, progress, lifecycle, validity, report | belongs to Participant; references Blueprint/Context; has Responses, Report |
| **RuntimeState** | assessmentId, index, answers (by itemId), progress, paused | per in-progress Assessment (local) |
| **Response** | assessmentId, itemId, response, timestamp | keyed to immutable itemId |
| **Report** | id, participant, type, status, confidence, domains→dimensions, strengths/stretch, d6, limitations, omitted, versions | Admin view; projects to UserSafeReport |
| **Domain6** | cai, dii, secondary[AFI/ECFI/SII/DDI/PDRI/ECSI], radar, confidence, strengths/cautions | embedded in Report |
| **Comparison** | role, blueprint, context, dimensions, candidates[] | read model over Reports |
| **AppNotification** | type, title, body, read, email | per recipient |
| **ExportJob** | type (7), status, progress, downloadUrl | Admin-scoped |
| **DataDeletionRequest** | participantId, status, submittedAt | privacy inbox |
| **Activity event** | actor, action, target, timestamp | org-scoped (Spec 007) |

## Validation rules (from requirements)
- Governance metadata on `ItemBankItem` is immutable; adaptation may set `adaptedText` only.
- A question is operationally eligible only if `bankState=production`, not `operational_blocked`, not `quarantine_pending_dif_review`, passes job-level overlay + use-case + method policy (`status-models.md` §4).
- `Assessment` cannot be sent until Admin approval is recorded.
- `RoleBlueprint` must be `Validated` to release operational Hiring-Support role-fit.
- Required current-use-case `ConsentRecord` must be `Granted` before the runtime starts.
- `Response` must reference a valid `itemId`; the frontend never computes scores.
- `UserSafeReport` excludes scoringVersion, synthVersion, omitted technical detail, raw flags, raw responses, and d6 internals beyond a safe summary.

## State transitions
- **Assessment lifecycle**: Draft → Not Started → In Progress → Submitted → Processing → Completed; (Expired / Cancelled as terminal branches).
- **Assessment validity** (separate): Pending → Valid / Pass With Limits / Valid but Uninterpretable / Incomplete / Invalid / Deferred.
- **Report**: Processing → Released / Released with Caution / Partial Release / Blocked Section / Unavailable / Deferred.
- **Blueprint**: Draft → Under Review → Active → Validated → Deprecated → Archived.
- **Context**: Draft → Active → Archived.
- **Consent**: Pending → Granted → (Revoked) / Declined.
- **Confidence band** by SE: High ≤0.25 < Moderate ≤0.35 < Low ≤0.45 < Unacceptable.
