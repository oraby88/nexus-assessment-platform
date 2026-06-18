# Feature Specification: User Portal & Assessment Runtime

**Feature Branch**: `006-user-portal-runtime`

**Created**: 2026-06-15

**Status**: Draft

**Input**: User description: "specs/006-user-portal-runtime — the full User (candidate) experience: invitation access, dashboard, assessment runtime (five question types), consent, user-safe reports, history, notifications, help, profile & privacy (master scope §4/§7/§8)"

**Prefix**: `FR-USR-*`

**Authoritative sources**: `../000-master-scope/spec.md` (§4 User capabilities, §7 scoring attribution, §8 rephrasing, §15 User navigation), `../000-shared/status-models.md` (§5 adaptation, §6 attribution), `../000-shared/data-model.md` (§10), `../000-shared/handoff-map.md`; constitution `.specify/memory/constitution.md` (v2.0.0, principles III/VIII/IX/XII/XIII). Depends on Spec 001 (foundation + auth) and Spec 005 (user-safe projection).

## Clarifications

### Session 2026-06-16

- Q: Runtime navigation model — can the User revisit/change earlier answers? → A: Free back-navigation — User may go to any previously-answered question and change it; Next still requires the current question be answered; final Submit reviews all.
- Q: What do timed sections do in this mock-only prototype? → A: Display-only — show a per-section countdown for realism, but it never blocks input, auto-advances, or auto-submits; answers are always preserved.
- Q: Which consents are revocable (eligibility)? → A: Optional consents (research, third-party) are always revocable; the required use-case consent is revocable until the report is released, then locked as historical/non-revocable.
- Q: What happens when the User submits a data-deletion request? → A: Creates a pending request — User sees an acknowledgement + pending status; it is queued for the Admin privacy-request inbox (inbox UI owned by Spec 007).
- Q: Where does the runtime get its question set for an assessment? → A: Fixed pre-resolved set — `runtimeService` returns the assessment's already-selected/adapted items (from Spec 003) rendered verbatim; no client-side selection, scoring, or governance.

## User Scenarios & Testing *(mandatory)*

<!--
  Actor: the User (candidate) — a permanent V1 account holder. This spec builds the entire User
  portal under /app/* and the mobile-first assessment runtime. The User sees ONLY their own data.
  Invitation access (activate/sign-in) already exists from Spec 001 (authService + InvitationAccess);
  user-safe reports reuse Spec 005's reportService.getUserSafe. The frontend captures responses but
  performs NO production scoring and never shows a live score.
-->

### User Story 1 - Take an assessment end-to-end (Priority: P1) 🎯 MVP

The User opens an active assessment, reviews the overview, accepts the required consent, reads instructions, answers all questions in a focused runtime that auto-saves, can pause and resume, can reload without losing progress, submits, and reaches a completion state.

**Why this priority**: Completing an assessment is the entire reason the User portal exists and the precondition for any report. The spanning journey (overview → consent → instructions → runtime → pause/resume/reload → submit → completion) is the smallest slice that delivers the core value.

**Independent Test**: From an active assessment, go overview → consent → instructions → runtime, answer questions, pause and resume, reload mid-runtime (progress restores), submit, and reach completion — all on mocks; verify auto-save and that no live score is shown.

**Acceptance Scenarios**:

1. **Given** an active assessment, **When** the User proceeds overview → consent → instructions → runtime → submit, **Then** they reach the completion state.
2. **Given** the runtime, **When** the User reloads or pauses and resumes, **Then** progress (current question + answers) is restored.
3. **Given** the runtime, **When** the User answers, **Then** an auto-save indicator confirms saving and **no live score is ever displayed**.
4. **Given** the completion state, **When** submission is confirmed, **Then** a processing/next-steps state is shown (no confetti — subtle confirmation).

---

### User Story 2 - Answer all five question types (Priority: P1)

The runtime renders all five method families correctly — Likert agreement, contextual frequency, forced choice, cognitive MCQ, and SJT — each answer-gated, stored against the immutable source Question ID, and fully operable by keyboard and on mobile.

**Why this priority**: An assessment is only valid if every question type works and each answer attributes to its source item (constitution VIII). Mobile operability is constitutionally required (Responsive Runtime).

**Independent Test**: Render one of each of the five types; confirm the correct layout, that Next is disabled until answered, that the response is stored keyed by source Question ID, and that each is keyboard- and touch-operable (≥44px targets).

**Acceptance Scenarios**:

1. **Given** any of the five question types, **When** rendered, **Then** the layout matches the type and the control is keyboard- and touch-operable.
2. **Given** a question, **When** it is unanswered, **Then** Next is disabled; **When** answered, **Then** Next is enabled and the response is stored keyed by the source Question ID.
3. **Given** the runtime on a small screen, **When** displayed, **Then** touch targets are ≥44px, forced-choice cards stack, SJT text is readable, and progress is sticky.

---

### User Story 3 - Per-use-case consent with revocation (Priority: P1)

The User must accept the assessment's required, use-case-specific consent before starting; optional consents (research, third-party sharing) appear only when applicable. From Profile & Privacy, the User can view consent history and revoke eligible consents, which propagates to the Admin's view.

**Why this priority**: Consent gating and revocation are privacy-critical and constitutionally required before an assessment can be taken; the projection to the Admin consent tab must stay consistent.

**Independent Test**: On the consent screen, confirm "Accept and Continue" is disabled until the required consent is checked and that only applicable optional consents appear; in Profile & Privacy, revoke an eligible consent and confirm it reflects in the Admin User-Detail consent tab.

**Acceptance Scenarios**:

1. **Given** the consent screen, **When** the required current-use-case consent is unchecked, **Then** "Accept and Continue" is disabled; **When** checked, **Then** the User can continue.
2. **Given** an assessment, **When** consent screens render, **Then** only the applicable consents appear (Hiring Support → pre-hire screening; Developmental → developmental feedback; optional research/third-party only when applicable).
3. **Given** declining consent, **When** the User declines, **Then** a neutral message returns them to the dashboard and the mock status updates.
4. **Given** Profile & Privacy, **When** the User revokes an eligible consent, **Then** that use case is invalidated (mock) and the change reflects in the Admin Candidate Consent tab.

---

### User Story 4 - No Admin-only data ever reaches the User (Priority: P1)

Across every User screen — runtime, reports, history, notifications, profile — no Admin-only or internal data appears: no raw responses surfaced back as analysis, source-item metadata, formulas, scoring versions, internal governance/psychometric flags, blocked values, Admin notes, Domain 6 internals, or automated hire/reject language.

**Why this priority**: This is the constitutional Safe Reporting + Two-Roles guarantee from the User side; a leak would be a serious privacy/governance failure.

**Independent Test**: Inspect each User screen (especially the report) and confirm none of the restricted/internal fields are present; the User report is built solely from the Spec 005 user-safe projection.

**Acceptance Scenarios**:

1. **Given** any User screen, **When** rendered, **Then** no Admin-only/internal field (source IDs as analysis, metadata, formulas, scoring versions, raw flags, blocked values, Admin notes, Domain 6 internals) appears.
2. **Given** the User report, **When** it renders, **Then** it is built only from the user-safe projection and uses supportive (non hire/reject) language.

---

### User Story 5 - View user-safe reports (Priority: P2)

The User views their available reports and opens a supportive, user-safe report (strengths, development themes, allowed dimensions, suggestions, caution/omission notes, optional high-level contextual summary) with a simulated PDF download.

**Why this priority**: Reports are valuable feedback but depend on an assessment being completed (US1) and on the user-safe projection; they follow the core runtime.

**Independent Test**: Open My Reports, open an available report, confirm only user-safe content shows and a simulated PDF action runs.

**Acceptance Scenarios**:

1. **Given** My Reports, **When** it loads, **Then** available/partial/historical reports are listed with status and open/PDF actions.
2. **Given** a user-safe report, **When** opened, **Then** it shows supportive content (strengths, development themes, allowed dimensions, caution/omission notes, optional contextual summary) and a simulated PDF action — with no restricted content.

---

### User Story 6 - User portal periphery (Priority: P2)

The User has a dashboard (active-assessment hero + completed + reports + notifications), My Assessments, Assessment History, Notifications, Help & Support, and Profile & Privacy (personal info, language, simulated password change, consent history, data-deletion request) — all own-data only.

**Why this priority**: Essential supporting surfaces that orient the User and meet privacy obligations, building on the core flows; lower frequency than taking an assessment.

**Independent Test**: Visit each periphery screen; confirm it renders own-data only, the dashboard hero links into the active assessment, and a data-deletion request can be submitted.

**Acceptance Scenarios**:

1. **Given** the dashboard, **When** it loads, **Then** an active-assessment hero (role, use case, deadline, progress, continue) plus completed assessments, reports, and notifications appear.
2. **Given** Profile & Privacy, **When** the User submits a data-deletion request or changes a preference, **Then** the mock state updates and consent history is shown.
3. **Given** History/Notifications, **When** they render, **Then** only the User's own assessments/notifications appear.

---

### Edge Cases

- **Reload / pause mid-runtime** → progress restored from local persistence (current question + answers).
- **Required consent unchecked** → "Accept and Continue" disabled; cannot start.
- **Consent declined** → neutral message, return to dashboard, mock status updated (no penalty language).
- **Save failure (simulated)** → retry / offline note; answers not lost.
- **Expired/invalid invitation** → clear expired state on the access screen (owned with Spec 007).
- **Submit with unanswered required questions** → blocked until answered (Next gated per question).
- **No active assessment / no reports / no notifications** → friendly empty guidance.
- **Revoking a consent already used for a released report** → use case invalidated going forward; the change reflects in the Admin consent tab (mock).
- **Mobile small-screen runtime** → ≥44px targets, stacked forced-choice, readable SJT, sticky progress, safe-area behavior.
- **Live score never shown** → no scoring value appears at any point during or after the runtime in the User view.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-USR-001**: The system MUST support the permanent V1 User account — activate from invitation (set password on first access) and sign in to return, establishing a User session, with mock forgot/reset (reuses Spec 001 auth).
- **FR-USR-002**: The system MUST provide a User Dashboard (active-assessment hero, completed assessments, reports, notifications, support).
- **FR-USR-003**: The system MUST provide a My Assessments list (active/completed) for the User's own assessments.
- **FR-USR-004**: The system MUST provide an Assessment Overview (organization, purpose, target role, estimated duration, deadline, section/pause rules, privacy summary, continue to consent).
- **FR-USR-005**: The system MUST gate starting an assessment on the required current-use-case consent.
- **FR-USR-006**: The system MUST show optional consents (research, third-party sharing) only when applicable, never requiring irrelevant consents.
- **FR-USR-007**: The system MUST provide Instructions (structure, question types, timed sections, pause/resume, auto-save, submit behavior, begin). Section timers are display-only: a countdown MAY be shown for realism but MUST never block input, auto-advance, or auto-submit, and MUST never cause answer loss.
- **FR-USR-008**: The runtime MUST render all five method families (Likert agreement, contextual frequency, forced choice, cognitive MCQ, SJT) in a focused mode, from a fixed pre-resolved item set returned by `runtimeService` (the assessment's already-selected/adapted items from Spec 003), rendered verbatim — the runtime performs no client-side selection, scoring, or governance.
- **FR-USR-009**: The runtime MUST gate Next on an answer for each question, while allowing free back-navigation to any previously-answered question to review or change its answer (advancing forward still requires the current question be answered).
- **FR-USR-010**: The runtime MUST locally auto-save and support pause, resume, and reload restoration of progress.
- **FR-USR-011**: Each response MUST be stored keyed by the immutable source Question ID (attribution), with no client scoring and no live User score shown.
- **FR-USR-012**: The system MUST provide a completion state (subtle confirmation + processing/next-steps).
- **FR-USR-013**: The system MUST provide My Reports and a user-safe report view (built from the Spec 005 projection) with a simulated PDF action.
- **FR-USR-014**: The system MUST provide the User's own Assessment History.
- **FR-USR-015**: The system MUST provide User Notifications (own-data) with an email-delivery indicator.
- **FR-USR-016**: The system MUST provide Help & Support (FAQ, runtime guidance, contact support, privacy questions).
- **FR-USR-017**: The system MUST provide Profile & Privacy (personal info, language, simulated password change, consent history, revoke eligible consent, data-deletion request) with revocation propagating to the Admin consent view. A submitted data-deletion request MUST create a **pending** record (User sees an acknowledgement + pending status) queued for the Admin privacy-request inbox (inbox UI owned by Spec 007); the User never self-deletes data.
- **FR-USR-018**: No Admin-only/internal data (source metadata, formulas, scoring versions, raw/governance flags, blocked values, Admin notes, Domain 6 internals, hire/reject language) MUST appear in any User screen.

### Key Entities *(include if feature involves data)*

- **Assessment Assignment (User view)**: the User's assigned assessment — role, use case, deadline, progress, lifecycle (own-data).
- **Runtime State**: the in-progress runtime — assessment ID, current question index, answers (keyed by source Question ID), progress, paused flag, timestamps; persisted locally for resume/reload.
- **Question (render-only `ItemBankItem`)**: the source item rendered to the User (text, options, response scale); immutable; never shows internal metadata. Supplied as part of the assessment's fixed pre-resolved item set (selected/adapted upstream by Spec 003); the runtime does not select or adapt items.
- **Question Response**: assessment ID + source Question ID + value + timestamp (attribution; no client scoring).
- **Consent Record**: per-use-case consent (use case, label, informed text, status, required, revocable) — granted/declined/revoked. Optional consents (research, third-party) are always revocable; the required use-case consent is revocable until the report is released, then locked (historical, non-revocable).
- **User-safe Report**: the audience-projected report (from Spec 005) — supportive content only.
- **App Notification / Data Deletion Request**: the User's notifications and a privacy deletion request (deletion request created in **pending** status, queued for the Admin privacy-request inbox; never self-resolved by the User).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A User can complete the full journey (overview → consent → instructions → runtime → submit → completion) for an active assessment in a single session on mobile or desktop.
- **SC-002**: Reloading or pausing/resuming mid-runtime restores the current question and all answers 100% of the time.
- **SC-003**: All five question types render correctly, gate Next until answered, and store responses keyed by the source Question ID (100%).
- **SC-004**: No live score is shown at any point in the User experience (0 instances).
- **SC-005**: "Accept and Continue" is disabled until the required consent is checked (100%); only applicable optional consents appear.
- **SC-006**: Revoking an eligible consent invalidates that use case and reflects in the Admin consent view 100% of the time.
- **SC-007**: The User report contains 0 restricted/internal fields and uses supportive (non hire/reject) language.
- **SC-008**: No Admin-only data appears in any User screen (0 leaks).
- **SC-009**: The runtime is fully operable on a small screen (touch targets ≥44px, keyboard-operable options, sticky progress) and meets WCAG 2.1 AA basics on the priority flow.

## Assumptions

- Builds on Spec 001 (UserShell, runtime persistence `nexus_runtime_v1`, `authService` with invitation/activation/sign-in, components) and Spec 005 (`reportService.getUserSafe` projection + report components); no backend in this phase.
- The frontend **captures responses but performs no production scoring** and never shows a live User score (constitution VIII); future backend scoring consumes responses keyed by source Question ID.
- Invitation access (activate/sign-in) and the `/invitation` screen exist from Spec 001; expired-invitation/forgot-password polish is shared with Spec 007.
- `runtimeService` and `consentService` exist as stubs from Spec 001 and are completed here (local persistence + mock state); revocation propagates to the same consent store the Admin User-Detail tab reads (Spec 002).
- Adapted question wording (from Spec 003) is shown verbatim to the User; the User never sees diffs or internal metadata.
- Standard web-app performance/error expectations apply; data is mock with simulated latency/errors.

## Dependencies

- **Depends on**: Spec 001 (UserShell, auth, runtime persistence, components), Spec 005 (`reportService.getUserSafe` + report components).
- **Consumes services**: `authService`, `runtimeService`, `consentService`, `reportService` (user-safe), `notificationService`, `exportService` (PDF), `assessmentService` (history).
- **Cross-links**: revocation reflects in Spec 002 Admin User-Detail consent tab; assessments to take are produced by Spec 003.
- **Shared canon**: `../000-shared/{status-models.md,data-model.md,handoff-map.md,risk-register.md}`.
