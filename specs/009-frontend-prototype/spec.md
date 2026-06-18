# Feature Specification: Nexus Assessment Platform — Frontend Prototype

**Feature Branch**: `009-frontend-prototype`

**Created**: 2026-06-13

**Status**: Draft

**Input**: User description: "the frontend prototype per 000-master-scope"

> This is the umbrella feature for the V1 frontend prototype. It consolidates the confirmed scope in `../000-master-scope/spec.md` and is realized by the area specs `../001-foundation-design-system` … `../008-qa-release-readiness`, which carry the detailed, area-level requirements. Shared models, statuses, routes, and the future-backend boundary live in `../000-shared/*`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin designs and sends a governed, tailored assessment (Priority: P1)

An organization Admin selects a person, defines the assessment purpose, works with an AI Discovery assistant to capture role requirements, reviews governed questions (selected only from the approved question source, with controlled wording adaptation), checks coverage, approves, and sends an invitation with a deadline.

**Why this priority**: This is the platform's signature value — turning a conversation about a role into a governed, explainable assessment. Without it there is no product.

**Independent Test**: Starting from the Create Assessment entry, an Admin can complete every step against sample data and produce one new "Not Started" assessment for one person, with an invitation and reminder schedule recorded.

**Acceptance Scenarios**:

1. **Given** the Create Assessment flow, **When** the Admin progresses, **Then** the steps follow: select person → define purpose → discovery chat → requirements summary → select/create role blueprint → select/create context profile → question selection → controlled rephrasing → coverage review → approval → deadline & reminders → review & send → success.
2. **Given** question selection, **When** a question is shown, **Then** its source identifier, domain, dimension, facet, method, original wording, and a "scoring locked" indicator are visible, and blocked/non-eligible questions are never included.
3. **Given** a rephrasing request, **When** wording is adapted, **Then** only the displayed wording changes (with a highlighted difference) and no scoring or governance information changes.
4. **Given** the review step, **When** the Admin has not approved, **Then** Send is unavailable; **When** approved and sent, **Then** a success state appears and a notification plus a simulated email state are recorded.

---

### User Story 2 - A person completes an assessment (Priority: P1)

An invited person activates a permanent account from their invitation (sets a password on first access) or signs in to an existing account, reviews the overview, gives use-case-specific consent, reads instructions, answers all supported question types, can pause and resume, and submits.

**Why this priority**: Without the candidate side there is no data and no report; this experience must work well on phones.

**Independent Test**: From the invitation entry, a person can pass overview → consent → instructions → runtime (all five question types) → completion on a mobile-sized screen, and resume correctly after a reload.

**Acceptance Scenarios**:

1. **Given** the consent screen, **When** required consent is not given, **Then** continuing is unavailable.
2. **Given** the runtime, **When** a question is answered, **Then** progress and an auto-save indicator update and the next control becomes available.
3. **Given** any of the five question types, **When** it is displayed, **Then** it is readable and operable by keyboard and touch.
4. **Given** an in-progress assessment, **When** the person pauses and returns (including after reload), **Then** their progress is restored.

---

### User Story 3 - Admin reviews governed reports including contextual alignment (Priority: P1)

An Admin opens a report with measured dimensions, confidence and limitation states, omitted-section explanations, and the contextual alignment (Domain 6) view, and can preview exactly what the candidate will see.

**Why this priority**: Reports are the payoff of the assessment and the place where governance (safe disclosure, no automatic decisions) is most visible.

**Acceptance Scenarios**:

1. **Given** a report, **When** a dimension has reduced confidence, **Then** it is shown with caution or downgraded treatment per the confidence rules.
2. **Given** a report, **When** a section is blocked or omitted, **Then** it is not shown as data and an explanation is provided.
3. **Given** the Admin report, **When** the contextual-alignment view opens, **Then** the alignment and decision-influence indicators, secondary indicators, a candidate-vs-context comparison, and confidence state are shown.
4. **Given** the Admin report, **When** "preview candidate view" is selected, **Then** formulas, raw flags, raw responses, and restricted/blocked content are hidden and language is supportive.
5. **Given** any report or comparison, **When** displayed, **Then** a "not an automatic hiring decision" statement is present.

---

### User Story 4 - Admin manages people and assessments day to day (Priority: P2)

An Admin uses a dashboard, adds people individually or by bulk upload, searches/filters, opens person and assessment details, manages reminders/deadlines/cancellation, sees notifications, and exports lists.

**Acceptance Scenarios**:

1. **Given** the people list, **When** the Admin searches/filters, **Then** results update and an empty state appears when nothing matches.
2. **Given** bulk upload, **When** a file is provided, **Then** the Admin sees upload → validation preview (valid/invalid/duplicate) → confirmation → summary.
3. **Given** an export request, **When** confirmed, **Then** a list export is produced and an export-history entry appears.

---

### User Story 5 - Admin builds reusable Role Blueprints and Context Profiles (Priority: P2)

An Admin creates a Role Blueprint (what success looks like) and a Context Profile (the work environment), with lifecycle status and version history, and links them so the Create Assessment flow can use them.

**Acceptance Scenarios**:

1. **Given** the blueprint wizard, **When** dimensions are chosen, **Then** each can be marked required/optional/excluded with an importance level for required ones, and saving records a version.
2. **Given** the context builder, **When** a value is changed, **Then** a live context visualization updates; saving records a version.
3. **Given** a blueprint and a context, **When** linked, **Then** both reflect the link and both are selectable inside Create Assessment.

---

### User Story 6 - Admin compares candidates for human judgment (Priority: P2)

An Admin selects a role, blueprint, context, candidates, and dimensions and views a side-by-side comparison that supports human judgment.

**Acceptance Scenarios**:

1. **Given** comparison setup, **When** the grid is shown, **Then** candidates appear side by side with relevant dimensions, confidence, and contextual indicators.
2. **Given** the comparison, **When** displayed, **Then** there is no ranking, leaderboard, automatic shortlist, reject, or hire action.

---

### User Story 7 - A person manages their reports, history, and privacy (Priority: P3)

A person views their own (candidate-safe) reports and history, manages notifications, reviews consent history, revokes eligible consent, and can request data deletion.

**Acceptance Scenarios**:

1. **Given** the person's report, **When** opened, **Then** it never exposes raw responses, formulas, internal flags, or automatic recommendations.
2. **Given** profile & privacy, **When** the person revokes an eligible consent, **Then** that use case is invalidated and the change is reflected in the Admin's view of that person's consent.

---

### User Story 8 - Public entry, recovery, activity log, and polish (Priority: P3)

A public landing page routes Admin and candidates to the right entry without bypassing access; account-recovery, access-denied, not-found, and offline states exist; the Admin has an organization-scoped activity log; and the experience is consistent, accessible, animated, and responsive.

**Acceptance Scenarios**:

1. **Given** the landing page, **When** any call-to-action is used, **Then** it leads to the correct sign-in/invitation entry and never directly into protected pages.
2. **Given** the activity log, **When** filtered, **Then** organization-scoped events are shown with detail and can be exported.

---

### Edge Cases

- A required dimension has no eligible questions → coverage warning; the assistant cannot fabricate questions; the Admin is informed.
- An attempt to alter governed metadata while rephrasing → rejected; only display wording is editable.
- A person reloads mid-assessment → progress restores; mid-wizard recovery uses the saved draft.
- A report where most dimensions are below the confidence threshold → a "limited / unavailable" state is shown instead of data.
- A person without motion preference enabled → all signature animations degrade to instant.
- Small-screen runtime → forced-choice and scenario items stack; touch targets stay large.
- Theme switch → all surfaces, charts, and badges switch cleanly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The product MUST provide two separate role experiences — an organization Admin (organization-scoped data) and a User/candidate (own data only) — with Admin-only information never appearing in the candidate experience.
- **FR-002**: The product MUST let an Admin create one tailored assessment for one person through the confirmed twelve-step, AI-assisted flow, ending in explicit Admin approval before sending.
- **FR-003**: The AI assistant MUST select questions only from the governed question source, MUST NOT create new questions or use blocked/non-eligible questions in an operational assessment, and MUST present results for Admin approval.
- **FR-004**: Question wording adaptation MUST change only the displayed text (with a visible difference) and MUST preserve all governed metadata and scoring attribution to the original question identifier; method-specific safeguards MUST apply (e.g., cognitive items verbatim by default).
- **FR-005**: The product MUST let a person consent (per applicable use case), read instructions, answer all five supported question types, see progress with auto-save, pause/resume, and submit, with progress surviving a reload.
- **FR-006**: The product MUST present governed reports with confidence, limitation, and omitted-section states; MUST show the contextual-alignment (Domain 6) view in the Admin report with explicit provisional/omitted treatment where inputs are insufficient; and MUST never show blocked values as data.
- **FR-007**: The product MUST provide a candidate-safe report projection and let the Admin preview it; the candidate report MUST exclude formulas, raw flags, raw responses, versions, blocked values, and automatic recommendations.
- **FR-008**: The product MUST provide side-by-side Candidate Comparison for human judgment only, with no ranking, leaderboard, or automatic shortlist/reject/hire.
- **FR-009**: The product MUST provide reusable Role Blueprints and Context Profiles with lifecycle status, version history, and two-way linking, usable inside Create Assessment.
- **FR-010**: The product MUST provide Admin day-to-day management: dashboard, add/bulk-upload people, search/filter, person and assessment detail, reminders/deadline/cancel actions, notifications (in-platform + simulated email), exports (seven list types), settings, profile, and an organization-scoped activity log.
- **FR-011**: The product MUST provide the candidate periphery: dashboard, my assessments, my reports, history, notifications, help, and profile & privacy with consent history, eligible-consent revocation, and a data-deletion request.
- **FR-012**: The product MUST present empty, loading, and error states on every screen; MUST be responsive (Admin desktop-first; candidate runtime mobile-first); MUST meet baseline accessibility (keyboard, focus, contrast, labels) and honor a reduced-motion preference.
- **FR-013**: The product MUST display trust indicators where governance applies (e.g., governed-source and scoring-locked indicators, version footer, no-automatic-decision statement).
- **FR-014**: The product MUST behave as a prototype on sample data with locally saved progress; it MUST NOT perform real scoring, real messaging delivery, or real document generation (these are simulated), and MUST keep a clean boundary for a future backend.
- **FR-015**: Public entry, account recovery, access-denied, not-found, and offline/reconnected states MUST exist and MUST NOT allow bypassing access into protected pages.

### Key Entities *(include if feature involves data)*

- **Organization**: the single tenant in V1 (one Admin account).
- **Admin / User**: the two roles; Admin is organization-scoped, User sees only their own data. Both have a **permanent account in V1** (the User activates theirs from the invitation and signs in to return).
- **Participant (Candidate)**: a person assessed; identity, target role, level, consent and assessment history.
- **Role Blueprint**: a reusable definition of role success (dimensions, importance, evidence, lifecycle, versions).
- **Context Profile**: the work-environment definition driving contextual interpretation.
- **Governed Question (item)**: an approved question with immutable provenance and governance status; rephrasing adds a display-only adaptation linked to its identifier.
- **Assessment**: a tailored assignment for one person (purpose, blueprint/context, deadline, lifecycle and validity states).
- **Response**: a person's answer stored against the original question identifier.
- **Report**: an Admin (full, governed) and a candidate-safe projection, including the contextual-alignment view.
- **Comparison**: a human-judgment, side-by-side view across candidates.
- **Consent**: per-use-case, revocable.
- **Notification / Export / Activity event**: operational records (in-platform + simulated email; CSV exports; organization-scoped log).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An Admin can complete the full create-and-send flow on sample data in under 5 minutes and produce one new assessment ready to send.
- **SC-002**: 100% of selected questions visibly show their provenance and a scoring-locked indicator, and 0 blocked or fabricated questions ever appear in an operational assessment.
- **SC-003**: A person can complete an assessment covering all five question types on a phone-sized screen, including a successful pause-and-resume across a reload.
- **SC-004**: The candidate-safe report and preview never expose formulas, raw flags, raw responses, or restricted/blocked content (verified by review and test).
- **SC-005**: Every screen presents coherent empty, loading, and error states.
- **SC-006**: All signature animations degrade to instant when a reduced-motion preference is set, and no animation blocks input.
- **SC-007**: Switching theme updates all surfaces, charts, and badges with no flash.
- **SC-008**: Candidate Comparison shows no ranking/leaderboard language and offers no automatic decision action (verified by review and test).
- **SC-009**: Keyboard-only operation can reach and activate every control on the priority flows, and automated accessibility checks pass on those flows.

## Assumptions

- The frontend prototype runs on representative sample data with locally saved progress; scoring, messaging delivery, and document generation are simulated. Real backend services are a separate future phase.
- The confirmed decisions in `../000-master-scope/spec.md` are authoritative and override any contradictory companion documentation: two roles only; one Admin per organization; the User has a permanent account in V1 (activated from the invitation); Context Profiles are first-class; the contextual-alignment (Domain 6) view is shown in the Admin report; the full governed question source is used; per-use-case consent with revocation; question fields absent from the source (e.g., weight, difficulty) are not shown; list exports are real where practical while document downloads are simulated.
- All five question types and both use cases (Developmental Feedback, Hiring Support) are in scope; restricted constructs are shown only as governed/omitted states, never as fabricated data.
- Detailed, area-level requirements live in the area specs `../001-…` through `../008-…`; this umbrella spec defines the cross-area outcomes and acceptance.
