# Phase 0 — Research & Decisions (Create Assessment Flow)

All Technical Context items are resolved — **no remaining NEEDS CLARIFICATION** (the four `/speckit-clarify` answers settled agent scripting, SJT/cognitive adaptation, the proposal model, and the coverage threshold). Foundation/master decisions (stack, motion, persistence, governance helpers) are inherited from `../001-foundation-design-system/research.md` and `../000-master-scope/research.md`.

## D1 — Scripted Agent behavior *(clarification Q1)*
- **Decision**: `agentDiscoveryService` drives a **fixed canonical question sequence** (covering role, level, responsibilities, context factors, success/failure indicators, non-negotiables). Each answer maps deterministically to one or more `JobRequirementsProfile` fields. The only branching is light parameterization by Step-2 use case (developmental vs hiring support) — e.g., hiring adds a role-fit emphasis prompt. No live model; "live AI" affordance is a labeled future stub.
- **Rationale**: Deterministic and unit-testable (SC-005); honors Principle I and the master AI-governance rules; still feels tailored.
- **Alternatives**: Fully identical sequence (rejected — ignores use case); multi-input branching (rejected — combinatorial, harder to test, no added V1 value).

## D2 — SJT / cognitive adaptation in V1 *(clarification Q2)*
- **Decision**: No approved-equivalence templates exist in V1. `adaptationService` **blocks** rephrase for `sjt` and `cognitive_multiple_choice`, returning the original with an "Original wording retained" note. Likert/contextual allow governed rephrase; forced-choice allows light terminology only.
- **Rationale**: Constitution VII + status-models §5; safest path; the template mechanism is a backend concern.
- **Alternatives**: Ship sample SJT templates (rejected — fabricates governance not yet validated); allow unverified rephrase (rejected — violates VII).

## D3 — Question proposal model *(clarification Q3)*
- **Decision**: The Agent **auto-proposes an initial eligible set** sized to the requirements/estimated duration; the Admin then adds/removes/replaces from the eligible pool. Proposal = `questionBankService.select(criteria)` filtered to `selectEligible`, then a deterministic pick covering each critical dimension (≈1–2 per required dimension up to a target count).
- **Rationale**: Matches "AI-assisted, Admin-approved" intent (SC-001) while keeping the Admin in control; reuses the existing eligibility helper.
- **Alternatives**: Fully manual (rejected — loses the assisted feel); propose-only/no-add (rejected — too rigid for coverage fixes).

## D4 — Under-coverage threshold *(clarification Q4)*
- **Decision**: Coverage warns when any **required/critical dimension** (from the requirements profile `criticalDimensionIds`) has **0** selected items; a **soft note** when it has exactly **1**. Recomputes on every selection change.
- **Rationale**: Simple, deterministic, tied to the requirements profile (SC-008); easy to test.
- **Alternatives**: min-2-per-dimension (rejected — arbitrary for V1); percentage coverage (rejected — less actionable).

## D5 — Word-level diff for rephrasing
- **Decision**: A small dependency-free `lib/diffWords.ts` (LCS over whitespace-split tokens) returns `DiffSpan[]` (`{text, changed}`); `adaptationService` returns `AdaptedQuestionText` with this diff.
- **Rationale**: Constitution (no heavy deps); makes the display-only change auditable (SC-004); screen-reader-friendly.
- **Alternatives**: `diff`/`diff-match-patch` libs (rejected — unnecessary weight for short item text).

## D6 — Draft persistence & resume
- **Decision**: `assessmentDraftService` persists the in-progress `AssessmentDraft` (selected user, answers, requirements, selections, deadline/reminders, approval, current step) via the versioned `persistence` store (`nexus_drafts_v1`, discard-on-mismatch). Resume reloads the saved step.
- **Rationale**: SC-007; reuses foundation persistence (research D2 of 001); long flow needs recovery.
- **Alternatives**: No persistence (rejected — lost work on a 12-step flow).

## D7 — Send artifacts via existing services
- **Decision**: On approved send, `assessmentDraftService.send(draft)` delegates to create an `AssessmentAssignment` (Not Started) + `AssessmentInvitation` + `TimelineEvent` + `AppNotification` (simulated email) — reusing the assessment/notification stores from Spec 002 so the new assessment immediately appears in Admin Core monitoring.
- **Rationale**: Single source of truth for assignments (Principle IV/XIV); SC-001; no duplicate state.
- **Alternatives**: Separate draft-only store (rejected — would desync from the Assessments list).

## D8 — Governance reuse (no new boundary)
- **Decision**: Eligibility uses the existing `services/governance` (`selectEligible`, job-level overlay); `questionBankService` remains the only bank consumer (lazy `import()`); `SelectedQuestion.item` typed `Readonly<ItemBankItem>`.
- **Rationale**: Principles V/VI/VIII; avoids divergent governance logic.

## Open questions status
None block planning. Deferred to implementation detail (not spec ambiguities): exact estimated-duration formula (per-method seconds), proposal target-count heuristic, and the canonical script's literal question text (a fixture).
