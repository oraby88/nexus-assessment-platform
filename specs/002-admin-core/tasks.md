---
description: "Task list — Admin Core (Spec 002)"
---

# Tasks: Admin Core — Everyday Organization Workspace

**Input**: Design documents in `specs/002-admin-core/` (`plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`). Builds on the implemented foundation `specs/001-foundation-design-system/*`. Shared canon: `specs/000-shared/*`. Constitution: `.specify/memory/constitution.md` (v2.0.0).

**Tech**: Vite + React 18 + TypeScript (strict) + React Router; foundation UI library/charts/motion/hooks; Vitest + React Testing Library. Mock services only — no backend. App root: `frontend/`.

**Tests**: Included (targeted) — `spec.md` Success Criteria and the constitution require tests for CSV classification, assessment actions, notifications/exports, and guard/leak behavior.

**Story map**: US1 = Manage people (P1, MVP) · US2 = Monitor & manage assessments (P2) · US3 = Dashboard overview (P2) · US4 = Notifications/Exports/Settings/Profile (P3).

**Format**: `- [ ] [TaskID] [P?] [Story?] Description with path` — `[P]` = parallelizable (different files, no blocking dep); `[US#]` only on user-story phases.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Admin Core scaffolding on top of the foundation.

- [X] T001 [P] Create Admin Core feature folders `frontend/src/features/{dashboard,users,assessments,notifications,exports,settings,profile}/` and service folders `frontend/src/services/{notification,export,settings}/`
- [X] T002 [P] Add Admin Core types (`AddUserInput`, `CsvRowResult`, `BulkUploadResult`, `AssessmentAction`, `ExportRegistryEntry`, `OrgSettings`) to `frontend/src/models/entities.ts` (per `data-model.md`)

**Checkpoint**: Folders + types compile under `strict`.

---

## Phase 2: Foundational (Blocking Prerequisites) — BLOCKS US1 & US4

**Purpose**: Shared CSV utility used by bulk upload (US1) and exports (US4).

**⚠️ CRITICAL**: US1 bulk upload and US4 exports depend on this.

- [X] T003 Implement dependency-free CSV helper (`toCsv`, `parseCsv`, RFC-4180-ish quoting) in `frontend/src/lib/csv.ts` (research D3)
- [X] T004 [P] Unit test for `lib/csv.ts` (quoting, embedded commas/quotes/newlines, round-trip) in `frontend/tests/unit/csv.test.ts`

**Checkpoint**: CSV round-trips correctly; tests pass.

---

## Phase 3: User Story 1 — Manage the organization's people (Priority: P1) 🎯 MVP

**Goal**: A working roster — list/search/filter, Add User (duplicate-email guard), Bulk Upload with valid/invalid/duplicate validation, and User Detail tabs.

**Independent Test**: Search/filter the list; add one person (appears, dup blocked); bulk-upload a mixed CSV and see correct 3-way counts then confirm-import valid rows; open a person's detail tabs (quickstart #1–4; SC-001/002).

### Tests for User Story 1

- [X] T005 [P] [US1] Unit test `participantService.add`/`bulkUpload`/`confirmImport` (dup-email reject; required-column + duplicate classification) in `frontend/tests/unit/participant.test.ts`
- [X] T006 [P] [US1] Component test Users list (search/filter/empty), Add User (dup guard), Bulk Upload preview in `frontend/tests/component/users.test.tsx`

### Implementation for User Story 1

- [X] T007 [US1] Extend `participantService` with `add()`, `bulkUpload(csvText)`, `confirmImport(rows)`, `history(id)` (required = Full Name/Email/Job Level; duplicate = email in-org or in-file) in `frontend/src/services/participant/participantService.ts` (contracts/services.md)
- [X] T008 [P] [US1] `UsersList` screen — `DataTable` + `FilterBar` + `SearchInput`, pagination (25), multi-select, empty/loading/error — in `frontend/src/features/users/UsersList.tsx`
- [X] T009 [P] [US1] `AddUserDrawer` — form (`Field`/`TextInput`/`Select`), validation, duplicate-email guard, focus trap — in `frontend/src/features/users/AddUserDrawer.tsx`
- [X] T010 [P] [US1] `BulkUploadModal` — `Stepper` flow (template → upload → validate → valid/invalid/duplicate preview with reasons → confirm → summary) — in `frontend/src/features/users/BulkUploadModal.tsx`
- [X] T011 [P] [US1] `UserDetail` — tabs (Overview, Active Assessments, History, Reports, Consent read-only, Timeline) — in `frontend/src/features/users/UserDetail.tsx`
- [X] T012 [US1] Wire `/admin/users` and `/admin/users/:participantId` routes (replace placeholders, lazy-load) in `frontend/src/router.tsx`

**Checkpoint**: Roster fully usable end-to-end — MVP demoable.

---

## Phase 4: User Story 2 — Monitor and manage assessments (Priority: P2)

**Goal**: Filterable assessments list with **separate** lifecycle/validity, and a detail with management actions that update timeline + notification + simulated email.

**Independent Test**: Filter list + confirm lifecycle and validity are distinct columns; open detail; run remind/resend/extend/cancel; verify timeline/notification/email update and terminal actions are disabled (quickstart #5–6; SC-003/004).

### Tests for User Story 2

- [X] T013 [P] [US2] Unit test `assessmentService` actions (timeline append, notification + sim-email emit, terminal-state guard) in `frontend/tests/unit/assessment.test.ts`
- [X] T014 [P] [US2] Component test Assessments list (separate Lifecycle/Validity badges) + detail actions in `frontend/tests/component/assessments.test.tsx`

### Implementation for User Story 2

- [X] T015 [US2] Extend `assessmentService` with `timeline()`, `remind()`, `resendInvitation()`, `extendDeadline()`, `cancel()` (mutate mock state + append `TimelineEvent` + emit `AppNotification` w/ sim email; disable on terminal lifecycle) in `frontend/src/services/assessment/assessmentService.ts`
- [X] T016 [P] [US2] `AssessmentsList` — status tabs, filters, columns with **separate** Lifecycle + Validity + Report badges — in `frontend/src/features/assessments/AssessmentsList.tsx`
- [X] T017 [P] [US2] `AssessmentDetail` — user/assignment cards, progress `Ring`, `Timeline`, reminder history, invitation status, action buttons + confirm `Modal`s — in `frontend/src/features/assessments/AssessmentDetail.tsx`
- [X] T018 [US2] Wire `/admin/assessments` and `/admin/assessments/:assessmentId` routes in `frontend/src/router.tsx`

**Checkpoint**: Assessment monitoring + actions work; lifecycle/validity never conflated.

---

## Phase 5: User Story 3 — Organization dashboard overview (Priority: P2)

**Goal**: At-a-glance dashboard — KPIs, sections, and quick actions that route correctly.

**Independent Test**: Open the dashboard; all KPIs render via services; each section populates with empty/loading/error states; every quick action routes correctly (quickstart #7; SC-005).

### Tests for User Story 3

- [X] T019 [P] [US3] Component test dashboard (KPIs render via service; quick actions navigate) in `frontend/tests/component/dashboard.test.tsx`

### Implementation for User Story 3

- [X] T020 [US3] `AdminDashboard` — KPIs (`CountUp`), sections (Recent Assessments/Users/Reports, Deadline Alerts, Blueprint Summary, Notifications), quick actions — in `frontend/src/features/dashboard/AdminDashboard.tsx` (replaces the 001 sample dashboard)
- [X] T021 [US3] Wire `/admin/dashboard` to the new dashboard (lazy-load) in `frontend/src/router.tsx`

**Checkpoint**: Dashboard overview functional.

---

## Phase 6: User Story 4 — Notifications, exports, settings, and profile (Priority: P3)

**Goal**: Notification inbox (read state + email indicator), Exports (framework + Users/Assessments active, 5 registered-pending), Settings (one-Admin), My Profile.

**Independent Test**: Mark notifications read (count updates); export Users and Assessments (CSV + history entry); see five pending export types; Settings shows one Admin; edit profile prefs (quickstart #8–11; SC-006/007).

### Tests for User Story 4

- [X] T022 [P] [US4] Component test notifications read-state + Exports active/pending rendering in `frontend/tests/component/periphery.test.tsx`
- [X] T023 [P] [US4] Unit test `settingsService` (one-Admin) + `exportService` registry/request (Users/Assessments active; others rejected as pending) in `frontend/tests/unit/admin-services.test.ts`

### Implementation for User Story 4

- [X] T024 [P] [US4] `notificationService.markRead`/`markAllRead` + `NotificationsInbox` (unread state, email indicator, filters, related links) in `frontend/src/services/notification/notificationService.ts` and `frontend/src/features/notifications/NotificationsInbox.tsx`
- [X] T025 [P] [US4] `exportService` (`registry`/`request`/`history`/`download`; Users+Assessments CSV via `lib/csv.ts`; 5 pending) + `ExportsCenter` screen in `frontend/src/services/export/exportService.ts` and `frontend/src/features/exports/ExportsCenter.tsx`
- [X] T026 [P] [US4] `settingsService.get`/`update` (org + single Admin; one-Admin rule) + `OrgSettings` screen (sections; Admin Account shows one account + future note) in `frontend/src/services/settings/settingsService.ts` and `frontend/src/features/settings/OrgSettings.tsx`
- [X] T027 [P] [US4] `MyProfile` screen (profile fields, simulated password change, notification preference, language, theme, sign-out) in `frontend/src/features/profile/MyProfile.tsx`
- [X] T028 [US4] Wire `/admin/notifications`, `/admin/exports`, `/admin/settings`, `/admin/profile` routes in `frontend/src/router.tsx`

**Checkpoint**: All four Admin Core stories independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T029 [P] Add a guard/leak test confirming Admin Core data/screens never render in the User portal in `frontend/tests/component/no-leak.test.tsx` (SC-009)
- [X] T030 [P] Run all `quickstart.md` validation scenarios (1–13) and record results
- [X] T031 [P] Update `frontend/src/services/README.md` (Admin Core methods now implemented) and add usage notes
- [X] T032 Final gate pass (`tsc -b`, `vitest run`, `vite build`, `eslint`) + constitution compliance (lifecycle/validity separate, one-Admin, org-scope, no leak)

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: depends on the 001 foundation — start immediately.
- **Foundational (Phase 2)**: depends on Setup — **BLOCKS US1 (bulk upload) and US4 (exports)**. US2/US3 do not need it.
- **User Stories (Phases 3–6)**: depend on Setup; US1/US4 also on Foundational. Recommended order P1 → P2 → P2 → P3.
- **Polish (Phase 7)**: after the desired stories are complete.

### User Story Dependencies
- **US1 (P1)**: after Setup + Foundational. Independent (the roster). No dependency on US2–US4.
- **US2 (P2)**: after Setup. Independent; reads participants from US1 fixtures but testable alone.
- **US3 (P2)**: after Setup. Summarizes other stories' data but renders against mock aggregates independently.
- **US4 (P3)**: after Setup + Foundational (exports need CSV). Independent.

### Within Each User Story
- Tests first (fail), then service methods, then screens, then route wiring.
- `router.tsx` route-wiring tasks (T012, T018, T021, T028) touch the **same file** → run sequentially, not in parallel.

### Parallel Opportunities
- Setup: T001, T002 in parallel.
- Foundational: T003 → T004.
- US1: T005, T006 (tests) ∥; T008–T011 (screens) ∥ after T007 (service); T012 last.
- US2: T013, T014 ∥; T016, T017 ∥ after T015; T018 last.
- US4: T022, T023 ∥; T024–T027 ∥; T028 last.
- After Foundational, US1–US4 can be staffed by different developers (coordinate `router.tsx` edits).

---

## Parallel Example: User Story 1

```bash
# Tests for US1 together:
Task: "Unit test participantService add/bulkUpload in frontend/tests/unit/participant.test.ts"
Task: "Component test Users list/Add/Bulk-upload in frontend/tests/component/users.test.tsx"

# After T007 (service), build screens in parallel:
Task: "UsersList in frontend/src/features/users/UsersList.tsx"
Task: "AddUserDrawer in frontend/src/features/users/AddUserDrawer.tsx"
Task: "BulkUploadModal in frontend/src/features/users/BulkUploadModal.tsx"
Task: "UserDetail in frontend/src/features/users/UserDetail.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)
Setup → Foundational → US1 → **STOP and VALIDATE** the roster (add, bulk-import, detail) against SC-001/002 → demo.

### Incremental Delivery
1. Setup + Foundational → CSV + types ready.
2. US1 → roster (MVP).
3. US2 → assessment monitoring + actions.
4. US3 → dashboard overview.
5. US4 → notifications/exports/settings/profile.
Each story adds value without breaking earlier ones.

### Parallel Team Strategy
After Foundational: Dev A → US1, Dev B → US2, Dev C → US3, Dev D → US4; serialize `router.tsx` edits.

---

## Notes
- `[P]` = different files, no blocking dependency; `[US#]` maps to spec.md stories.
- Admin Core **completes the typed service stubs from Spec 001** — it does not create new data boundaries.
- Keep lifecycle and validity as separate fields everywhere; show only one Admin account; never leak Admin data to the User portal.
- Verify tests fail before implementing; commit per task/logical group; stop at any checkpoint to validate.
