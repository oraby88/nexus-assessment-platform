# Feature Specification: Admin Core — Everyday Organization Workspace

**Feature Branch**: `002-admin-core`

**Created**: 2026-06-15

**Status**: Draft

**Input**: User description: "specs/002-admin-core — Admin everyday workflow (master scope Spec 002): Dashboard, Users, Add/Bulk-upload, Assessments monitoring, Notifications, Exports, Settings, Profile"

**Prefix**: `FR-ADM-*`

**Authoritative sources**: `../000-master-scope/spec.md` (§3 Admin capabilities, §14 Admin navigation), `../000-shared/route-map.md`, `../000-shared/status-models.md`, `../000-shared/handoff-map.md`, `../000-shared/data-model.md`; constitution `.specify/memory/constitution.md` (v2.0.0). Depends on Spec 001 (foundation).

## Clarifications

### Session 2026-06-15

- Q: For bulk upload, which CSV columns are required and what counts as a duplicate? → A: Required columns are Full Name, Email, and Job Level (other columns optional); a row is a duplicate if its email already exists in the organization **or** appears earlier in the same file.
- Q: How much of the seven-type export capability does Admin Core implement, given several types' data is owned by specs 004/005? → A: Admin Core builds the export framework (history, re-run, download) and fully implements the Users and Assessments exports now; the other five (Assessment History, Reports, Candidate Comparison, Role Blueprints, Context Profiles) are registered framework entries that activate when their owning spec (004/005) lands.

## User Scenarios & Testing *(mandatory)*

<!--
  Actor: the single organization Admin (one Admin per org in V1; org-scoped data only).
  This spec is the Admin's everyday workspace. Stories are ordered so the earliest delivers a
  usable slice. Items owned elsewhere: Create Assessment wizard → Spec 003; Role Blueprints &
  Context Profiles → Spec 004; Reports/Comparison/global History → Spec 005; Activity Log → Spec 007.
-->

### User Story 1 - Manage the organization's people (Priority: P1)

The Admin maintains the roster of people who will be assessed: browsing and searching/filtering the list, adding an individual, bulk-importing many from a spreadsheet with validation, and opening a person's detail to review their assessments, reports, consent, and history.

**Why this priority**: People are the root entity of the entire product — no assessment, report, or comparison exists without them. A working roster (list + add + bulk import + detail) is the smallest slice that delivers standalone Admin value and unblocks every later flow.

**Independent Test**: Open Users, search/filter the list, add one person via the drawer (appears in the list), bulk-upload a CSV and see valid/invalid/duplicate counts then confirm, and open a person's detail to see their tabs — all against mock services with no other story implemented.

**Acceptance Scenarios**:

1. **Given** the Users list, **When** the Admin searches or applies filters (assessment lifecycle, latest report, job level, target role), **Then** the rows update accordingly and an empty state appears when nothing matches.
2. **Given** the Add User drawer, **When** the Admin completes required fields and saves, **Then** the person is created via the participant service, a success confirmation shows, and the list refreshes to include them.
3. **Given** the Bulk Upload flow, **When** the Admin uploads a CSV, **Then** they see upload progress, a validation preview splitting rows into valid / invalid / duplicate, and on confirm an import-success summary.
4. **Given** a person, **When** the Admin opens their detail, **Then** the detail tabs (Overview, Active Assessments, History, Reports, Consent, Timeline) render and per-use-case consent state is shown.
5. **Given** any person record, **When** it is displayed anywhere in the Admin workspace, **Then** only this organization's data is shown and nothing renders in the User portal.

---

### User Story 2 - Monitor and manage assessments (Priority: P2)

The Admin oversees in-flight and completed assessments: a filterable list that shows assignment progress and interpretability as **separate** signals, and a detail view from which the Admin can take management actions (send reminder, resend invitation, extend deadline, cancel) and see the resulting timeline, notification, and simulated email state.

**Why this priority**: Once people exist and assessments are assigned (via Spec 003), monitoring and intervening is the Admin's main ongoing job. It depends on the roster (US1) for context but is independently testable against assessment fixtures.

**Independent Test**: Open Assessments, filter by use case/role/report state and status tabs, confirm lifecycle and validity appear as distinct columns, open a detail, run each management action, and verify the timeline, a notification, and the simulated email state update.

**Acceptance Scenarios**:

1. **Given** the Assessments list, **When** the Admin filters or switches status tabs, **Then** lifecycle status and validity status are shown as two separate fields (never conflated).
2. **Given** an assessment detail, **When** the Admin sends a reminder, resends an invitation, extends the deadline, or cancels, **Then** the mock state, timeline, a notification, and the simulated email-delivery state update accordingly.
3. **Given** an assessment, **When** the Admin opens the linked person, report, or downloads a simulated PDF, **Then** the correct destination opens (or the simulated download is triggered).
4. **Given** a list with no matching assessments, **When** filters exclude everything, **Then** an empty state with guidance is shown; loading and error/retry states are available.

---

### User Story 3 - Organization dashboard overview (Priority: P2)

On entering the workspace, the Admin sees an at-a-glance overview: key counts (KPIs), recent activity sections, deadline alerts, and quick actions that route to the main flows.

**Why this priority**: The dashboard is the orientation surface that ties the workspace together, but it summarizes data the other stories own, so it follows them. It is independently testable against mock aggregates.

**Independent Test**: Open the dashboard; confirm every KPI renders a value, each section populates from a service, and every quick action navigates to the correct route.

**Acceptance Scenarios**:

1. **Given** the dashboard, **When** it loads, **Then** all KPIs (Total Users, Active Assessments, Not Started, In Progress, Completed, Reports Available, Reports With Caution, Validated Blueprints) render values via services.
2. **Given** the dashboard, **When** sections load, **Then** Recent Assessments, Recent Users, Recently Available Reports, Deadline Alerts, Blueprint Status Summary, and Notifications populate (with empty/loading/error states).
3. **Given** the quick actions, **When** the Admin clicks any (Add User, Upload Users, Create Assessment, Create Role Blueprint, Create Context Profile, View Reports, Compare Candidates), **Then** it routes to the correct screen.

---

### User Story 4 - Notifications, exports, settings, and profile (Priority: P3)

The Admin manages the supporting periphery: an in-platform notification inbox with read state and simulated email-delivery indicators; operational data exports; organization settings (respecting the one-Admin rule); and a personal profile.

**Why this priority**: These are essential but lower-frequency supporting surfaces that build on the data the earlier stories manage. Each is independently testable.

**Independent Test**: Mark a notification read and confirm the unread count updates; request each export type and confirm a CSV download (or simulated PDF) plus an export-history entry; open Settings and confirm only one Admin account is shown; edit profile preferences (theme/language/notification) and confirm they apply.

**Acceptance Scenarios**:

1. **Given** Notifications, **When** the Admin marks one (or all) read, **Then** the unread count updates and each item's email-delivery indicator persists; items link to the related record.
2. **Given** Exports, **When** the Admin requests any of the seven export types, **Then** a CSV downloads where practical (or a PDF is simulated), a mock job shows progress, and an export-history entry appears with re-run/download.
3. **Given** Settings, **When** the Admin views the Admin Account section, **Then** exactly one Admin account is shown with no multi-Admin invite/manage workflow (a non-interactive future note is permitted).
4. **Given** My Profile, **When** the Admin changes a preference (theme, language, notification preference) or simulates a password change, **Then** the change is reflected; sign-out returns to the public entry.

---

### Edge Cases

- **Empty organization** (no users / assessments / notifications / exports) → guidance + a primary call-to-action, not a blank screen.
- **CSV with mixed rows** (valid + invalid + duplicate) → counts shown, invalid rows reviewable inline with reasons (missing Full Name / Email / Job Level, or duplicate email in-org or in-file), import proceeds only for valid rows after explicit confirmation.
- **Duplicate person on add** (same email already in org) → flagged before save rather than creating a duplicate.
- **Action on an ineligible assessment** (e.g., reminder on a completed/cancelled assessment) → the action is unavailable or clearly blocked with explanation.
- **Lifecycle vs validity mismatch** (e.g., Submitted but Valid-but-Uninterpretable) → both signals shown independently, never merged into one status.
- **Mock service latency/error** → loading skeletons and error/retry states; partial failures do not corrupt the list.
- **Large roster** → list remains usable (pagination/virtualized table state) and search stays responsive.
- **Admin-only data isolation** → no Admin screen or export ever renders in or leaks to the User portal.
- **Export of an empty/filtered set** → produces a valid (empty or filtered) file with a clear indication of what was included.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-ADM-001**: The dashboard MUST render all KPIs and overview sections via services, with quick actions routing to the correct screens.
- **FR-ADM-002**: The Users list MUST support search, the defined filters, sorting, multi-select, and explicit empty/loading/error states.
- **FR-ADM-003**: Add User MUST persist a new person through the participant service with validation (including duplicate-email detection) and refresh the list.
- **FR-ADM-004**: Bulk Upload MUST parse and validate CSV records across the defined stages (template → upload → validate → valid/invalid/duplicate preview → confirm → success summary). Required columns are **Full Name, Email, Job Level** (other columns optional); a row is **invalid** when a required column is missing/malformed, and **duplicate** when its email already exists in the organization or appears earlier in the same file. Only confirmed valid rows are imported.
- **FR-ADM-005**: User Detail MUST surface the defined tabs and present per-use-case consent and a timeline consistently.
- **FR-ADM-006**: The Assessments list MUST display lifecycle status and validity status as separate fields (per `../000-shared/status-models.md`).
- **FR-ADM-007**: Assessment Detail actions (send reminder, resend invitation, extend deadline, cancel, open person/report, simulated PDF) MUST update mock state, the timeline, notifications, and simulated email state.
- **FR-ADM-008**: Notifications MUST support read/unread state, an email-delivery indicator, filters, related-record links, and mark-read / mark-all-read.
- **FR-ADM-009**: Exports MUST provide the export framework (mock job progress, export history, re-run, download) and **fully implement the Users and Assessments exports now** (real CSV where practical, simulated PDF where needed). The other five types (Assessment History, Reports, Candidate Comparison, Role Blueprints, Context Profiles) MUST be **registered framework entries that activate when their owning spec (004/005) lands** — surfaced but not yet producing data within Admin Core.
- **FR-ADM-010**: Settings MUST respect the one-Admin V1 rule (single Admin account; no multi-Admin invite/manage workflow), and present the defined settings sections.
- **FR-ADM-011**: My Profile MUST support profile fields, a simulated password change, notification preference, language, theme, and sign-out.
- **FR-ADM-012**: Every Admin Core screen MUST be org-scoped, and Admin-only data MUST NOT render in or leak to the User portal.
- **FR-ADM-013**: Every Admin Core screen MUST provide loading, empty, error/retry, responsive, and accessible states (keyboard-operable filters/menus, labelled drawer/modal forms with focus trap, aria-live confirmations).

### Key Entities *(include if feature involves data)*

- **Participant (person)**: the canonical record for an assessed person — name, email, current/target job title, job level, optional department, organization, notes, counts, and latest assessment lifecycle/validity/report status.
- **Assessment Assignment**: an assigned assessment — person, use case, target role, linked blueprint/context, assigned date, deadline, progress, and the separate lifecycle and validity statuses plus report status.
- **App Notification**: an in-platform notification — type, title/body, timestamp, read state, simulated email-delivery state, and a related-record link.
- **Export Job**: a requested operational export — type, status (queued/processing/ready/failed), progress, and download reference.
- **Organization**: the single org context (one-Admin rule, org-scoping).
- **Session / Admin account**: the signed-in Admin (role, identity, preferences).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An Admin can add an individual person and see them in the list in under 1 minute, with duplicate emails prevented 100% of the time.
- **SC-002**: A bulk CSV import correctly classifies 100% of rows into valid / invalid / duplicate and imports only confirmed valid rows; invalid rows are reviewable with a reason.
- **SC-003**: In the Assessments list and detail, lifecycle status and validity status are always presented as two distinct signals (0 instances of conflation).
- **SC-004**: Every assessment management action (reminder, resend, extend, cancel) reflects in the timeline, a notification, and the simulated email state within the same interaction.
- **SC-005**: 100% of dashboard quick actions navigate to their correct destination.
- **SC-006**: The Users and Assessments exports each produce a downloadable artifact (CSV or simulated PDF) and an export-history entry; the remaining five export types are visible as registered entries pending their owning spec (004/005).
- **SC-007**: The Admin Account view shows exactly one Admin and offers no multi-Admin management workflow.
- **SC-008**: 100% of Admin Core screens present loading, empty, and error states and are operable by keyboard with visible focus in both themes.
- **SC-009**: No Admin-only data appears in the User portal in any scenario (0 leaks).

## Assumptions

- This builds on Spec 001 (shells, routing, typed mock services, persistence, components, theming) and consumes its services; no backend exists in this phase.
- The Create Assessment wizard (Spec 003), Role Blueprints & Context Profiles (Spec 004), Reports/Domain 6/Comparison/global Assessment History (Spec 005), the User portal (Spec 006), and the Activity Log (Spec 007) are owned by those specs; Admin Core links to them but does not implement them.
- Consent state shown in User Detail originates from the consent model owned by Spec 006; Admin Core displays it read-only.
- "Real CSV where practical" means client-side CSV generation/parsing; PDF and email remain simulated (per the backend handoff map).
- The organization has exactly one Admin account in V1; multi-Admin structure may be noted but not built.
- Standard web-app expectations apply for performance and error handling unless stated; data is mock with simulated latency/errors.

## Dependencies

- **Depends on**: Spec 001 (foundation) — shells, route guards, `participantService`, `assessmentService`, `notificationService`, `exportService`, `settingsService`, `authService`, components, persistence.
- **Consumed by / links to**: Spec 003 (Create Assessment), Spec 004 (Blueprints/Contexts), Spec 005 (Reports/Comparison/History), Spec 006 (consent source), Spec 007 (Activity Log).
- **Shared canon**: `../000-shared/{route-map.md,status-models.md,data-model.md,handoff-map.md,risk-register.md}`.
