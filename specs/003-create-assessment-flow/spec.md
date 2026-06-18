# Feature Specification: Signature Create Assessment Flow

**Feature Branch**: `003-create-assessment-flow`

**Created**: 2026-06-15

**Status**: Draft

**Input**: User description: "specs/003-create-assessment-flow — Signature AI-assisted, governed 12-step Create Assessment flow (master scope §5–§8)"

**Prefix**: `FR-CA-*` · **Route**: `/admin/assessments/new` (full-bleed)

**Authoritative sources**: `../000-master-scope/spec.md` (§5 signature journey, §6 AI governance, §7 scoring, §8 rephrasing), `../000-shared/status-models.md` (§4 eligibility, §5 adaptation, §6 attribution), `../000-shared/data-model.md` (§5–§9), `../000-shared/workbook-audit.md`, `../000-shared/handoff-map.md`; constitution `.specify/memory/constitution.md` (v2.0.0, principles V–IX). Depends on Specs 001, 002, 004.

## Clarifications

### Session 2026-06-15

- Q: How does the scripted discovery Agent behave in V1? → A: A fixed canonical question sequence whose answers populate the requirements profile, lightly parameterized by the Step-2 use case (developmental vs hiring support) — fully deterministic, no live model.
- Q: Do approved-equivalence templates exist in V1 for SJT/cognitive rephrasing? → A: No templates in V1 — SJT and cognitive MCQ are always retained verbatim; rephrase is blocked for them with an "Original wording retained" note. The template mechanism is deferred to the future backend.
- Q: How do questions enter the selection set? → A: The Agent auto-proposes an initial eligible set (sized to the requirements/estimated duration); the Admin then adds, removes, or replaces items from the eligible pool.
- Q: What triggers an under-coverage warning? → A: Warn when any required/critical dimension (from the requirements profile) has zero selected questions; show a soft note when a required dimension has only one.

## User Scenarios & Testing *(mandatory)*

<!--
  Actor: the single organization Admin. This is the product's signature differentiator — the Admin
  co-designs ONE governed, tailored assessment for ONE User through an AI-Agent-guided 12-step flow.
  US1 is the spanning happy path (wizard shell + approval + send). US2–US6 deepen the governed
  behaviors of specific steps and are independently testable. Hard rules (constitution): no live AI
  call; no new question generation; no production scoring in the UI; no send without explicit approval.
  Blueprint/Context create defers to Spec 004; the runtime/consent the User later experiences is Spec 006.
-->

### User Story 1 - Complete the guided flow and send one tailored assessment (Priority: P1) 🎯 MVP

The Admin starts at `/admin/assessments/new`, moves through the twelve steps (select user → purpose → discovery → requirements → blueprint → context → question selection → rephrasing → coverage → approval → deadline/reminders → review & send), explicitly approves, and sends. Sending creates a Not-Started assignment, an invitation, a timeline event, an in-platform notification, and a simulated email state.

**Why this priority**: This end-to-end flow is the platform's signature value and the precondition for any assessment to exist for the User runtime (Spec 006) and reports (Spec 005). The spanning wizard (navigation, draft, approval gate, send) is the smallest slice that delivers the core outcome; US2–US6 enrich individual steps.

**Independent Test**: From `/admin/assessments/new`, complete all twelve steps on mocks for one selected user and send — verify a Not-Started assignment + invitation + notification + simulated email are created, and the success state offers to open the assessment / create another.

**Acceptance Scenarios**:

1. **Given** the wizard, **When** the Admin advances through the steps, **Then** a progress indicator reflects the current step and each step gates "Next" until its minimum inputs are provided.
2. **Given** the final Review & Send step, **When** the assessment has **not** been explicitly approved, **Then** Send is disabled; **When** approved, **Then** Send is enabled.
3. **Given** an approved assessment, **When** the Admin sends, **Then** an assignment (Not Started), an invitation, a timeline event, an in-platform notification, and a simulated email-delivery state are created and the success state is shown.
4. **Given** the flow, **When** the Admin selects the user in step 1, **Then** exactly **one** user can be chosen (existing or added inline) — no multi-user tailoring.

---

### User Story 2 - Governed, provenance-rich question selection (Priority: P1)

In the selection step, the Agent proposes questions drawn **only** from the governed `item_bank`. Blocked, quarantined, pilot, and research items never enter the ordinary operational set. Each proposed question shows its full source provenance and trust signals; no fabricated fields are shown.

**Why this priority**: Constitutionally NON-NEGOTIABLE (Governed Question Source, Immutable Metadata). The integrity of every downstream score depends on selecting only eligible governed items with intact metadata.

**Independent Test**: Open the selection step with a bank containing eligible, blocked, quarantine, pilot, and research items; verify only eligible items can be added to the operational set, each card shows source ID/domain/dimension/facet/method/scale/statuses + "Selected From Governed Bank" + "Scoring Logic Locked", and no `weight`/`difficulty` appears.

**Acceptance Scenarios**:

1. **Given** the bank, **When** the Agent proposes/selects items, **Then** only items satisfying eligibility (production bank state; not operationally blocked; not quarantine-pending; job-level overlay satisfied; use-case restriction satisfied; method policy satisfied) are offered for the operational set.
2. **Given** a proposed question, **When** its card renders, **Then** it shows source Question ID, original wording, domain, dimension, facet, method family, response scale, job-level overlay, bank state, use status, review status, the requirement it covers, and trust badges — and never fabricated `weight`/`difficulty`.
3. **Given** the Agent, **When** it operates, **Then** it never creates a new question, never uses an item outside the governed bank, and never alters source identity/metadata.

---

### User Story 3 - Controlled, metadata-preserving rephrasing (Priority: P1)

The Admin may request governed rephrasing of a question's display wording. Only the display text changes; a word-level diff is shown; all source metadata and scoring attribution stay locked. Method-family safeguards constrain what may be adapted.

**Why this priority**: Constitutionally NON-NEGOTIABLE (Controlled Adaptation, Immutable Metadata). Improper rephrasing would invalidate scoring.

**Independent Test**: Request a rephrase on each method family; verify only display text changes with a visible diff; cognitive MCQ stays verbatim by default; SJT only adapts via an approved-equivalence template (else original retained); and item ID/domain/dimension/facet/method/scale/keyed answer/governance fields are unchanged.

**Acceptance Scenarios**:

1. **Given** a rephrase request, **When** adapted text is produced, **Then** only display wording changes (with a word-level diff and adaptation reason); the source `item_id` and all governance/scoring metadata are unchanged.
2. **Given** method families, **When** adapting, **Then** Likert/contextual allow governed role-context rephrase; forced-choice allows light terminology only (trade-off and polarity preserved); cognitive MCQ is verbatim by default; SJT uses an approved-equivalence template only (otherwise the original is retained with an "Original wording retained" note).
3. **Given** an adapted question, **When** the Admin previews the User view, **Then** the User-facing wording is shown without internal metadata.

---

### User Story 4 - AI Discovery chat with a live requirements profile (Priority: P2)

The Admin answers the Agent's scripted discovery questions (role, level, responsibilities, context factors, success/failure indicators, non-negotiables). As answers are given, a requirements profile panel updates in real time; on completion a skippable transition leads into the assessment build.

**Why this priority**: This is the differentiating co-design experience, but the wizard can function with a simpler requirements summary, so it enriches rather than blocks the MVP.

**Independent Test**: Answer scripted chat prompts; verify the requirements panel updates live per answer, previous answers can be edited, a "Why are we asking?" explanation is available, and the chat→build transition is skippable and reduced-motion-safe.

**Acceptance Scenarios**:

1. **Given** the discovery chat, **When** the Admin answers a prompt, **Then** the live requirements panel updates the relevant field(s) immediately.
2. **Given** the chat, **When** the Admin edits a previous answer, **Then** the requirements panel reflects the change.
3. **Given** chat completion, **When** the transition to the build plays, **Then** it is skippable, non-blocking, and honors reduced motion.
4. **Given** the prototype, **When** the chat runs, **Then** it is deterministic/scripted with no live model call (any "live AI" affordance is a clearly-labeled future stub).

---

### User Story 5 - Coverage review with under-coverage warnings (Priority: P2)

Before approval, the Admin reviews how the selected set covers domains, dimensions, requirements, and method balance, with warnings where coverage is insufficient. Changing the selection updates the coverage view live.

**Why this priority**: Coverage feedback improves assessment quality and supports an informed approval, but the flow can send without it; it follows the core path.

**Independent Test**: On the coverage step, view total questions/estimated duration/domain & dimension/requirement coverage/method distribution; remove a question and confirm the coverage updates live and an under-coverage warning can appear.

**Acceptance Scenarios**:

1. **Given** the coverage review, **When** it loads, **Then** it shows total questions, estimated duration, domain coverage, dimension coverage, requirement coverage, and question-type distribution.
2. **Given** a selection change, **When** a question is added/removed, **Then** the coverage view recomputes live and surfaces an under-coverage **warning** when a required/critical dimension has zero selected items (and a **soft note** when it has only one).

---

### User Story 6 - Draft save and resume (Priority: P2)

The Admin can leave the wizard mid-flow and return later to resume from the saved step without losing entered data.

**Why this priority**: The 12-step flow is long; recovery prevents lost work, but the happy path works without it, so it is secondary.

**Independent Test**: Partially complete the wizard, save the draft, navigate away, return, and confirm the wizard resumes at the saved step with prior inputs intact.

**Acceptance Scenarios**:

1. **Given** an in-progress wizard, **When** the Admin saves a draft and leaves, **Then** the draft (selected user, answers, selections, step) is persisted.
2. **Given** a saved draft, **When** the Admin returns, **Then** the wizard resumes at the saved step with prior inputs restored.

---

### Edge Cases

- **No eligible items for a required dimension** → the Agent cannot fill it; the Admin is informed and an under-coverage warning appears (no blocked/pilot substitution).
- **Rephrase cannot be governed safely** → retain original wording with an "Original wording retained" note (never force an unsafe adaptation).
- **SJT/cognitive rephrase attempted** → blocked in V1 (no approved-equivalence templates exist); original kept verbatim with an "Original wording retained" note.
- **Hiring Support purpose without a Validated blueprint** → operational role-fit release is gated/flagged (Validated blueprint required).
- **Admin abandons mid-chat** → draft save offered; partial requirements preserved.
- **Send attempted before approval** → blocked (Send disabled until explicit approval).
- **Mock service latency/error** (chat turn, selection, rephrase, send) → loading/typing indicators and error/retry; a failed rephrase falls back to the original.
- **Bank not yet loaded** at the selection step → lazy-load with a loading state; never blocks first paint of earlier steps.
- **Inline-added user duplicate email** → blocked before creation (consistent with Spec 002 rules).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-CA-001**: The system MUST provide a full-bleed 12-step wizard shell with a progress indicator and draft persistence.
- **FR-CA-002**: The system MUST restrict the flow to a single user (select one existing or add one inline); no multi-user tailoring.
- **FR-CA-003**: The system MUST capture assessment purpose and role definition (use case, target role, job level, sector, description, notes).
- **FR-CA-004**: The system MUST provide a scripted Agent discovery chat with a live requirements profile panel. The script is a **fixed canonical question sequence** whose answers populate the requirements profile, lightly parameterized by the Step-2 use case (developmental vs hiring support); it is fully deterministic with no live model call.
- **FR-CA-005**: The system MUST provide a skippable, reduced-motion-safe transition from chat to assessment build.
- **FR-CA-006**: The system MUST present a structured requirements summary with edit / return-to-chat / refine / approve.
- **FR-CA-007**: The system MUST provide a Role Blueprint picker with a create-new entry (create defers to Spec 004).
- **FR-CA-008**: The system MUST provide a Context Profile picker with a create-new entry (create defers to Spec 004).
- **FR-CA-009**: The system MUST lazily load the governed `item_bank` and apply the eligibility gate (production; not operationally blocked; not quarantine-pending; job-level overlay; use-case restriction; method policy), excluding pilot/research from ordinary operational sets. The Agent MUST **auto-propose an initial eligible set** (sized to the requirements/estimated duration); the Admin MUST be able to add, remove, or replace items from the eligible pool.
- **FR-CA-010**: The system MUST render provenance-rich question cards (source ID, original wording, domain, dimension, facet, method family, response scale, statuses, requirement covered, trust badges) and MUST NOT show fabricated `weight`/`difficulty`.
- **FR-CA-011**: The system MUST perform controlled rephrasing accepting display text only (`{itemId, adaptedText}`) and surface a word-level diff; source metadata stays immutable.
- **FR-CA-012**: The system MUST enforce method-family adaptation safeguards (Likert/contextual rephrase; forced-choice light terminology; cognitive verbatim default; SJT approved-equivalence only). In V1 **no approved-equivalence templates exist**, so SJT and cognitive MCQ are always retained verbatim and their rephrase action is blocked with an "Original wording retained" note.
- **FR-CA-013**: The system MUST show a coverage map (domain/dimension/requirement/method) with under-coverage warnings that recompute on selection change. A **warning** appears when any required/critical dimension has zero selected questions; a **soft note** appears when a required dimension has only one.
- **FR-CA-014**: The system MUST require explicit Admin approval and MUST keep Send disabled until approval.
- **FR-CA-015**: The system MUST allow deadline and reminder configuration (schedule, channels, invitation message).
- **FR-CA-016**: On send, the system MUST create an assignment, an invitation, a timeline event, an in-platform notification, and a simulated email state, then show a success state.
- **FR-CA-017**: The system MUST preserve the source Question ID with each selected question so future answers attribute to the immutable item (no client scoring; no live User score).
- **FR-CA-018**: The system MUST NOT generate new questions, use items outside the governed bank, alter source identity/metadata, or send without approval.

### Key Entities *(include if feature involves data)*

- **Assessment Draft**: the in-progress tailored assessment for one participant — selected user, purpose/use case, discovery answers, requirements profile, chosen blueprint/context, selected questions, deadline/reminders, approval state, current step.
- **Job Requirements Profile**: the structured output of discovery — role, level, responsibilities, skills, behaviors, context factors, critical dimensions, success indicators, failure risks, non-negotiables, recommended focus, estimated duration.
- **Selected Question**: a chosen governed item (read-only `ItemBankItem`) plus the requirement it covers, selection reason, optional adaptation, and approval flag.
- **Adapted Question Text**: display-only adaptation — original text, adapted text, word-level diff, adaptation mode, reason — linked to the source `item_id`.
- **Role Blueprint / Context Profile**: referenced/selected here (owned by Spec 004).
- **Assessment Assignment / Invitation / Reminder / Notification**: the artifacts produced on send (owned operationally by Spec 002 for monitoring).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An Admin can complete all twelve steps and send one tailored assessment for one user, producing an assignment + invitation + notification + simulated email, in a single uninterrupted session.
- **SC-002**: 100% of items entering the operational set are governed-eligible; blocked, quarantine-pending, pilot, and research items never appear in the operational set.
- **SC-003**: Every selected/proposed question card displays full source provenance and trust signals, with 0 fabricated fields (`weight`/`difficulty`).
- **SC-004**: 100% of rephrasings change display wording only (verified by diff), with the source `item_id` and all governance/scoring metadata unchanged; cognitive MCQ remains verbatim by default and SJT only adapts via an approved-equivalence template.
- **SC-005**: The requirements panel reflects each discovery answer immediately (live update), and the chat→build transition is skippable and reduced-motion-safe.
- **SC-006**: Send is disabled in 100% of cases until explicit approval; no assessment is sent without approval.
- **SC-007**: A saved draft resumes at the correct step with prior inputs intact 100% of the time.
- **SC-008**: The coverage view recomputes on every selection change and surfaces under-coverage warnings when a required dimension/requirement is unmet.
- **SC-009**: Each selected question persists its source Question ID for future scoring attribution, and no live User score is ever displayed in the flow.

## Assumptions

- Builds on Spec 001 (wizard shell pieces, motion, services, persistence), Spec 002 (entry points from Users/Assessments/Dashboard), and Spec 004 (blueprint/context create + pick); no backend exists in this phase.
- The Agent is **deterministic and scripted** in V1 — no live model call, no real eligibility/scoring; a "live AI" affordance, if shown, is a clearly-labeled future stub.
- The governed `item_bank` is the only question source; eligibility and adaptation rules follow `../000-shared/status-models.md`; the bank ships as the converted module (full set when `convert:bank` is run; a representative subset otherwise).
- Creating a new Role Blueprint or Context Profile from steps 5/6 routes into the Spec 004 builders; this flow only selects/links and provides the create entry point.
- Consent the User must accept, and the assessment runtime, are owned by Spec 006; this flow records the consent requirement but does not collect consent.
- Standard web-app performance/error expectations apply; data is mock with simulated latency/errors.

## Dependencies

- **Depends on**: Spec 001 (foundation), Spec 002 (entry points + assessment artifacts for monitoring), Spec 004 (blueprint/context pickers + create).
- **Consumes services**: `assessmentDraftService`, `agentDiscoveryService`, `questionBankService`, `adaptationService`, `roleBlueprintService`, `contextProfileService`, `assessmentService`.
- **Feeds**: Spec 006 (User runtime answers the sent assessment), Spec 005 (reports derived later).
- **Shared canon**: `../000-shared/{status-models.md,data-model.md,workbook-audit.md,handoff-map.md,risk-register.md}`.
