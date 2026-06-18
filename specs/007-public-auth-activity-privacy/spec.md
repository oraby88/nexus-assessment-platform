# Feature Specification: Public/Auth Recovery, Activity Log & Privacy Inbox

**Feature Branch**: `007-public-auth-activity-privacy`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "specs/007-public-auth-activity-privacy — public/auth recovery (forgot/reset password, expired/invalid invitation states), the Admin Activity Log (selected high-value governance/operational events), the Admin privacy-request inbox (resolve the data-deletion requests raised in Spec 006), and a cross-cutting polish pass (missing empty/error/loading/404 states, accessibility & responsive consistency) — master scope §11/§14/§16."

**Prefix**: `FR-PAP-*`

**Authoritative sources**: `../000-master-scope/spec.md` (§11 Activity Log, §14 Admin navigation, §16 frontend-only scope, §17 spec map), `../000-shared/{data-model.md,status-models.md,handoff-map.md}`; constitution `.specify/memory/constitution.md` (v2.0.0, principles I/III/IV/IX/XII/XIII/XV). Depends on Spec 001 (PublicShell, auth, shells, components) and Spec 006 (data-deletion requests + shared consent store).

## Clarifications

### Session 2026-06-16

- Q: What happens when the Admin marks a deletion request Completed? → A: Status-only mock transition — Completed/Rejected updates the request status (shown in the User's privacy view); no actual data is removed or altered (backend responsibility).
- Q: Is the Activity Log a curated set or live-captured? → A: Curated fixture set covering all enumerated event types, read-only; no live session capture (it is a prototype read view).
- Q: How does the reset screen get its (mock) token? → A: Query-param token — reset screen reads `?token=`; the forgot confirmation shows a mock reset link carrying a valid token; missing/used/unknown token → expired-link state.

## User Scenarios & Testing *(mandatory)*

<!--
  Actors: the Admin (organization owner) and the User (candidate). This spec completes the public/auth
  edges and two Admin governance surfaces, then polishes remaining states. Everything is mock-only:
  no real auth, email, or audit logging. The Activity Log is a read view of SELECTED events, not an
  exhaustive/immutable audit log. The privacy inbox resolves the pending deletion requests created by
  Spec 006 (it is the missing other half of that flow).
-->

### User Story 1 - Admin resolves privacy (data-deletion) requests (Priority: P1) 🎯 MVP

The Admin opens a privacy-request inbox, sees the data-deletion requests submitted by Users (from Spec 006), reviews each request, and moves it through a clear lifecycle (acknowledge → in review → completed or rejected), with the change reflected back to the requesting User's privacy view.

**Why this priority**: Spec 006 lets Users submit deletion requests but leaves them pending with nowhere to be resolved. Closing this loop is a privacy/compliance obligation and the highest-value gap; without it the platform accepts requests it can never action.

**Independent Test**: With at least one pending request present, open the privacy inbox, change a request to "In Review" then "Completed" (and another to "Rejected" with a reason), and confirm the status persists and the User's Profile & Privacy view reflects the new state.

**Acceptance Scenarios**:

1. **Given** pending deletion requests exist, **When** the Admin opens the privacy inbox, **Then** each request is listed with requester, date, note, and current status — organization-scoped only.
2. **Given** a pending request, **When** the Admin marks it "In Review" then "Completed", **Then** the status updates (mock) and is reflected in the requesting User's privacy view.
3. **Given** a request, **When** the Admin rejects it, **Then** a reason is required and recorded, and the request shows as "Rejected".
4. **Given** no requests, **When** the inbox loads, **Then** a friendly empty state is shown.

---

### User Story 2 - Account recovery & invitation states (Priority: P1)

A returning Admin or User who cannot sign in can request a password reset (mock email confirmation), set a new password via a reset screen, and return to sign-in. A User opening an expired or invalid invitation sees a clear, non-alarming explanation with a path forward.

**Why this priority**: Sign-in recovery is a basic, expected capability for permanent accounts; the forgot/reset routes are currently unbuilt placeholders. The expired/invalid invitation state was explicitly deferred to this spec from Spec 006.

**Independent Test**: From sign-in, follow "Forgot password" → submit email → see confirmation → open the reset screen → set a new password → return to sign-in; separately, open an expired invitation and confirm the expired state renders with guidance.

**Acceptance Scenarios**:

1. **Given** the sign-in screen, **When** the user selects "Forgot password" and submits a valid email, **Then** a neutral confirmation ("if an account exists, a reset link was sent") is shown (mock — no enumeration of accounts).
2. **Given** the reset screen, **When** the user sets a new password meeting basic rules and the confirmation matches, **Then** a success state returns them to sign-in.
3. **Given** the reset screen, **When** the passwords don't match or are too weak, **Then** inline validation blocks submission with a clear message.
4. **Given** an expired or invalid invitation link, **When** the User opens it, **Then** a clear expired/invalid state explains what happened and offers support/sign-in — no stack trace or blank screen.

---

### User Story 3 - Admin Activity Log (Priority: P2)

The Admin views an organization-scoped Activity Log of selected high-value governance/operational events, and can search, filter by type, filter by actor, and filter by date.

**Why this priority**: A read-only governance overview that builds confidence in the platform; valuable but not blocking the core flows, and it depends on events the other specs already emit.

**Independent Test**: Open the Activity Log, confirm the selected event types render with actor/target/timestamp, then search and apply type/actor/date filters and confirm the list narrows correctly.

**Acceptance Scenarios**:

1. **Given** the Activity Log, **When** it loads, **Then** it shows selected high-value events (e.g., assessment sent, report released, consent revoked, deletion requested, blueprint validated, user added, export generated, invitation expired) with actor, target, and timestamp — organization-scoped.
2. **Given** the log, **When** the Admin searches or filters by type, actor, or date, **Then** the list updates to matching events.
3. **Given** no matching events, **When** filters exclude everything, **Then** a friendly empty state is shown.
4. **Given** the log, **When** it renders, **Then** it is presented as a prototype read view (no claim of being an exhaustive or immutable audit log).

---

### User Story 4 - Public surface & cross-cutting polish (Priority: P3)

Remaining surfaces present consistent, in-language empty / loading / error / 404 states; public and auth screens are visually consistent; and the priority flows meet accessibility and responsive expectations.

**Why this priority**: Quality and consistency raise the prototype's credibility, but the product is usable without this sweep; it builds on everything else.

**Independent Test**: Visit the landing/auth screens and a sampling of data screens; force empty and error conditions; navigate to an unknown route; confirm each shows an in-language state and the 404 offers a way back, and that keyboard/contrast/responsive basics hold.

**Acceptance Scenarios**:

1. **Given** any remaining scaffolded route, **When** it renders with no data or an error, **Then** an in-language empty/error state appears (no blank screens or raw errors).
2. **Given** an unknown URL, **When** it loads, **Then** a 404 screen offers a clear path back to a relevant home.
3. **Given** the public/auth screens, **When** viewed on mobile and desktop in both themes, **Then** layout, contrast, and keyboard operability hold.

---

### Edge Cases

- **Reset link reused / already used (mock)** → reset screen shows an expired-link state with a path to request a new one.
- **Forgot-password with an unknown email** → the same neutral confirmation is shown (no account enumeration).
- **Privacy request already resolved** → terminal states (Completed/Rejected) are not re-actionable; controls are disabled.
- **Reject without a reason** → submission blocked until a reason is provided.
- **Activity Log with overlapping filters** (type + actor + date) → all filters combine (logical AND).
- **Expired invitation** → clear expired state; sign-in/support offered (no penalty language).
- **Empty privacy inbox / empty activity log** → friendly empty guidance.
- **Unknown deep link under a known section** → section-appropriate not-found rather than a global blank.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-PAP-001**: The system MUST provide a "Forgot password" entry from both Admin and User sign-in that accepts an email and returns a neutral confirmation (no account enumeration), simulating a reset email.
- **FR-PAP-002**: The system MUST provide a password reset screen that validates a new password (basic strength + matching confirmation) and, on success, returns the user to sign-in (mock — no real credential change). The screen reads a `token` query parameter; the forgot-password confirmation surfaces a mock reset link carrying a valid token (standing in for the email).
- **FR-PAP-003**: The reset screen MUST show a clear expired/invalid-link state when the (mock) reset `token` query parameter is missing, reused, or unknown, with a path to request a new link.
- **FR-PAP-004**: The system MUST present a clear expired/invalid invitation state on the invitation access screen (explanation + sign-in/support path; no penalty language).
- **FR-PAP-005**: The system MUST provide an Admin privacy-request inbox listing the User-submitted data-deletion requests, organization-scoped, with requester, submission date, note, and status.
- **FR-PAP-006**: The Admin MUST be able to move a deletion request through its lifecycle: Submitted → In Review → Completed, or → Rejected (rejection requires a recorded reason).
- **FR-PAP-007**: A resolved request (Completed/Rejected) MUST be terminal (not re-actionable) and MUST be reflected in the requesting User's Profile & Privacy view. Resolution is a **status-only** mock transition — no User data is actually removed or altered (real deletion is a future backend responsibility; constitution I).
- **FR-PAP-008**: The system MUST provide an Admin Activity Log of selected high-value governance/operational events (assessment sent, report released/with caution, consent revoked, data-deletion requested, blueprint validated, user added, export generated, invitation expired) with actor, target, and timestamp — organization-scoped. The log is a **curated, read-only** set covering all enumerated event types; it does not live-capture session events.
- **FR-PAP-009**: The Activity Log MUST support search and filtering by event type, actor, and date.
- **FR-PAP-010**: The Activity Log MUST be presented as a prototype read view and MUST NOT claim to be an exhaustive or immutable audit log.
- **FR-PAP-011**: The system MUST provide a global 404/not-found screen that offers a clear path back to a relevant home.
- **FR-PAP-012**: Remaining scaffolded routes MUST render in-language empty, loading, and error states (no blank screens or raw errors).
- **FR-PAP-013**: Public and auth screens (landing, sign-in, invitation, forgot/reset) MUST be visually consistent and usable on mobile and desktop in both themes.
- **FR-PAP-014**: All new screens MUST be keyboard operable with visible focus, labelled controls, and sufficient contrast (WCAG 2.1 AA basics).
- **FR-PAP-015**: All data MUST remain mock-only with simulated latency/states; no real auth, email delivery, or audit logging is performed (constitution I).
- **FR-PAP-016**: Role/data scope MUST hold: the privacy inbox and Activity Log are Admin-only and organization-scoped; Users never see another User's data (constitution III).

### Key Entities *(include if feature involves data)*

- **Password Reset Request (mock)**: an email + a simulated reset token passed via the reset URL's `token` query parameter, with state (valid / used / expired/unknown) driving the forgot and reset screens; no real credential store.
- **Data Deletion Request**: the privacy request from Spec 006 — requester, submission date, note, status (Submitted → In Review → Completed/Rejected), rejection reason; resolved by the Admin inbox.
- **Activity Log Event**: a selected governance/operational event — actor, action, target type/id, detail, timestamp; organization-scoped, read-only.
- **Invitation (state view)**: the invitation lifecycle state (e.g., Sent/Opened/Expired/Cancelled) surfaced as a clear access state on the invitation screen.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An Admin can resolve a pending deletion request end-to-end (Submitted → Completed, and another → Rejected with reason) and the new status is reflected in the User's privacy view 100% of the time.
- **SC-002**: A returning user can complete the recovery flow (forgot → confirmation → reset → back to sign-in) in a single session on mobile or desktop.
- **SC-003**: Password reset validation blocks every weak/mismatched submission (0 invalid submissions accepted) and the forgot-password confirmation never reveals whether an account exists.
- **SC-004**: An expired/invalid invitation and an expired/used reset link each render a clear state (0 blank screens or raw errors).
- **SC-005**: The Activity Log shows the selected event types and narrows correctly under search and type/actor/date filters (combined as AND) 100% of the time.
- **SC-006**: Every remaining scaffolded route and an unknown URL render an in-language empty/error/404 state (0 blank screens).
- **SC-007**: The privacy inbox and Activity Log never render under a User session, and show only the current organization's data (0 cross-role/cross-org leaks).
- **SC-008**: The new public/auth, inbox, and log screens meet WCAG 2.1 AA basics (keyboard operable, labelled controls, sufficient contrast) on the priority flows.

## Assumptions

- Builds on Spec 001 (PublicShell, `authService` with `requestReset`, shells, UI components, router) and Spec 006 (`consentService`/shared consent store holding `DataDeletionRequest`s); no backend in this phase.
- Account recovery is mock: "reset" does not change a real credential; the reset token/state is simulated. The neutral forgot-password confirmation avoids account enumeration as a privacy-by-default behavior.
- The Activity Log reads selected events already emitted by prior specs (plus the enumerated set); it is not an exhaustive or immutable audit log and performs no real audit persistence.
- The privacy inbox completes the Spec 006 deletion-request loop using the same shared store the User portal writes; resolution is mock state only.
- Standard web-app performance/error expectations apply; data is mock with simulated latency/errors.

## Dependencies

- **Depends on**: Spec 001 (PublicShell, auth, shells, components, router placeholders for `/forgot-password`, `/reset-password`, `/admin/activity-log`), Spec 006 (data-deletion requests + shared consent store; expired-invitation polish shared here).
- **Consumes services**: `authService` (requestReset + mock reset), `consentService`/consent store (deletion requests), `activityLogService` (selected events), `invitationService` (invitation state).
- **Cross-links**: deletion requests originate in Spec 006 Profile & Privacy; activity events originate across Specs 002–006.
- **Shared canon**: `../000-shared/{data-model.md,status-models.md,handoff-map.md,risk-register.md}`.
