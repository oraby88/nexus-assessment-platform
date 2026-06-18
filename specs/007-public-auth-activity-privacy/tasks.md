---
description: "Task list for Public/Auth Recovery, Activity Log & Privacy Inbox"
---

# Tasks: Public/Auth Recovery, Activity Log & Privacy Inbox

**Input**: Design documents from `specs/007-public-auth-activity-privacy/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/services.md, contracts/screens-routes.md, quickstart.md

**Tests**: INCLUDED — the constitution mandates unit tests for services/governance and component tests for screens; tests ship in the same checkpoint as code.

**Organization**: Tasks grouped by user story (US1–US4, priority order). App root: `frontend/`. Paths are repo-relative.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1–US4 (Setup/Foundational/Polish have no story label)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Model fields + fixtures + feature folders. No new dependencies.

- [X] T001 [P] Extend `DataDeletionRequest` in `frontend/src/models/entities.ts` with optional `reason?` and `resolvedAt?` (F1-safe — new optional fields only; per data-model.md).
- [X] T002 [P] Expand `activityEvents` in `frontend/src/mocks/index.ts` to a curated set covering all enumerated types (assessment sent, report released, report released with caution, consent revoked, data-deletion requested, blueprint validated, user added, export generated, invitation expired) — each with actor/target/timestamp, org-scoped.
- [X] T003 [P] Seed 1–2 `DataDeletionRequest` fixtures (status `Submitted`) in `frontend/src/mocks/runtime.ts` `deletionRequestSeed` so the Admin privacy inbox is demoable.
- [X] T004 Create feature folders `frontend/src/features/privacy/` and `frontend/src/features/activity/` with `index.ts` barrels.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Service + store + nav/route wiring every story consumes. **No story work begins until this phase is complete.**

**⚠️ CRITICAL**: Blocks all user stories.

- [X] T005 Add reset methods to `frontend/src/services/auth/authService.ts` — `verifyResetToken(token): Promise<'valid'|'expired'|'missing'>` and `resetPassword(token, password): Promise<{ ok: true }>` (mock; per research D1).
- [X] T006 Add `updateDeletionRequest(req)` to `frontend/src/services/consentStore.ts` (replace by id; persists).
- [X] T007 Add Admin-side methods to `frontend/src/services/consent/consentService.ts` — `allDeletionRequests()` (org-scoped) and `resolveDeletion(id, status, reason?)` (status-only; rejects when `Rejected` lacks a reason or the request is terminal; sets `resolvedAt`).
- [X] T008 Add a `Privacy Requests` item (`/admin/privacy`) to `NAV_ADMIN` in `frontend/src/components/layout/index.tsx`.
- [X] T009 Wire routes in `frontend/src/router.tsx` — replace the `/forgot-password`, `/reset-password`, and `/admin/activity-log` Placeholders with lazy `ForgotPassword`/`ResetPassword`/`ActivityLog`; add lazy `/admin/privacy` → `PrivacyInbox` (screens may start as minimal shells, filled per story).

**Checkpoint**: Services + store + routes resolve; stories can proceed.

---

## Phase 3: User Story 1 — Privacy-request inbox (Priority: P1) 🎯 MVP

**Goal**: Admin resolves the data-deletion requests Users submitted (Spec 006) through Submitted → In Review → Completed/Rejected; reflected in the User's view.

**Independent Test**: With a pending request present, resolve one to Completed and another to Rejected (with reason); confirm status persists, terminal rows are disabled, and the User's Profile & Privacy view reflects the change.

### Tests for User Story 1 ⚠️ (write first, ensure they fail)

- [X] T010 [P] [US1] Unit test `frontend/tests/unit/privacy-inbox.test.ts` — `allDeletionRequests` is org-scoped; `resolveDeletion` transitions In Review/Completed/Rejected, requires a reason for Rejected, blocks re-resolving a terminal request, sets `resolvedAt`; the change is visible via `consentService.deletionRequests()` (User view) — SC-001.
- [X] T011 [P] [US1] Component test `frontend/tests/component/privacy-inbox.test.tsx` — lists requests; reject requires a reason; Complete disables the row's controls; empty state when none.

### Implementation for User Story 1

- [X] T012 [US1] `frontend/src/features/privacy/PrivacyInbox.tsx` — list `consentService.allDeletionRequests()` (requester/date/note/status); actions Mark In Review / Complete / Reject (reason required); terminal rows show disabled controls; loading/empty/error states; route `/admin/privacy`.

**Checkpoint**: US1 fully functional and independently testable (MVP).

---

## Phase 4: User Story 2 — Account recovery & invitation states (Priority: P1)

**Goal**: Forgot → neutral confirmation → reset (token-gated, validated) → sign-in; plus a clear expired/invalid invitation state.

**Independent Test**: Complete forgot → reset (`?token=valid-demo`) → sign-in; verify `?token=expired`/missing shows the expired-link state; open the invitation expired state.

### Tests for User Story 2 ⚠️

- [X] T013 [P] [US2] Unit test `frontend/tests/unit/auth-reset.test.ts` — `verifyResetToken` returns valid/expired/missing for token / `expired` / ''; `resetPassword` resolves ok for a valid token; `requestReset` resolves the same for any email (no enumeration) — SC-003.
- [X] T014 [P] [US2] Component test `frontend/tests/component/recovery.test.tsx` — Forgot shows a neutral confirmation; Reset blocks weak/mismatched passwords and shows the expired-link state for a missing/expired token; the invitation expired state renders.

### Implementation for User Story 2

- [X] T015 [US2] Add `ForgotPassword` to `frontend/src/features/auth/index.tsx` — email field → `authService.requestReset` → neutral confirmation + mock reset link to `/reset-password?token=valid-demo` (reuse `AuthScaffold`); route `/forgot-password`.
- [X] T016 [US2] Add `ResetPassword` to `frontend/src/features/auth/index.tsx` — read `?token=` via `useSearchParams`; `verifyResetToken` → expired/missing shows expired-link state; valid shows new+confirm password with inline validation (≥8, matching) → `resetPassword` → success → `/login`; route `/reset-password`.
- [X] T017 [US2] Add an expired/invalid invitation state to `InvitationAccess` in `frontend/src/features/auth/index.tsx` (via `?state=expired` / unknown code) — clear explanation + sign-in/support path, no penalty language; add "Forgot password" cross-links on AdminLogin + InvitationAccess.

**Checkpoint**: US1+US2 independently functional.

---

## Phase 5: User Story 3 — Admin Activity Log (Priority: P2)

**Goal**: Curated, read-only activity log with search + type/actor/date filters.

**Independent Test**: Open the log, confirm enumerated event types render with actor/target/time, apply combined filters and confirm narrowing, see the empty state, and the prototype-read-view framing.

### Tests for User Story 3 ⚠️

- [X] T018 [P] [US3] Unit test `frontend/tests/unit/activity-log.test.ts` — `filterEvents` combines search + type + actor + date as logical AND and returns the expected subset; the curated set covers all enumerated types.
- [X] T019 [P] [US3] Component test `frontend/tests/component/activity-log.test.tsx` — renders events with actor/target/time; a type filter narrows the list; empty state when filters exclude all; the prototype-read-view note is present.

### Implementation for User Story 3

- [X] T020 [US3] `frontend/src/features/activity/ActivityLog.tsx` — render `activityLogService.list()`; pure `filterEvents` helper (search/type/actor/date, AND); FilterBar + SearchInput + Select controls; loading/empty/error; prototype-read-view note; route `/admin/activity-log`.

**Checkpoint**: US1–US3 independently functional.

---

## Phase 6: User Story 4 — Public surface & cross-cutting polish (Priority: P3)

**Goal**: Consistent in-language empty/loading/error/404 states; a11y + responsive consistency on the new screens.

**Independent Test**: Visit an unknown URL → 404 with a path back; force empty/error on a sampling of screens → in-language states; check public/auth on mobile + desktop in both themes.

### Tests for User Story 4 ⚠️

- [X] T021 [P] [US4] Component test `frontend/tests/component/not-found.test.tsx` — an unknown route renders the 404 with a working "return home" path.

### Implementation for User Story 4

- [X] T022 [US4] Enhance `NotFound` in `frontend/src/features/auth/index.tsx` — clearer message + path back to a relevant home (role-aware if a session exists).
- [X] T023 [US4] Verify remaining scaffolded routes render in-language empty/loading/error states (no blank screens/raw errors); fix any gap found.

**Checkpoint**: All four stories functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Quality gates + a11y/responsive verification.

- [X] T024 [P] Accessibility + responsive pass on the new screens (Forgot/Reset/invitation-expired, Privacy Inbox, Activity Log, 404) — keyboard-operable forms/filters, labelled controls, visible focus, sufficient contrast in both themes, mobile→desktop (SC-008).
- [X] T025 Scope guard check — confirm `/admin/privacy` and `/admin/activity-log` deny under a User session and show only the current org's data (SC-007).
- [X] T026 Run all quality gates from `frontend/`: `npx tsc -b` (0 errors), `npm run test` (all green), `npm run build` (succeeds), `npx eslint .` (0 errors), `npx prettier --check .` (clean).
- [X] T027 Run `specs/007-public-auth-activity-privacy/quickstart.md` story validation end-to-end; mark every task `[X]`.

---

## Dependencies & Execution Order

### Phase dependencies
- **Setup (P1)** → no deps.
- **Foundational (P2)** → after Setup; **blocks all stories**.
- **US1–US4 (P3–P6)** → after Foundational. US1/US2 are independent P1s. US3 self-contained. US4 builds on everything (404/polish).
- **Polish (P7)** → after targeted stories.

### Within each story
- Tests written first (must fail), then services → screens → integration.

### Parallel opportunities
- Setup: T001, T002, T003 all `[P]` (T004 folders any time).
- Foundational: T005 (auth) and T006 (store) independent; T007 after T006; T008/T009 after.
- All per-story `[P]` test tasks run together; US1 and US2 implementations can proceed in parallel after Foundational.

---

## Parallel Example: Foundational + P1 stories

```bash
# After Setup, foundational service/store work in parallel:
Task: "authService reset methods"            # T005
Task: "consentStore.updateDeletionRequest"   # T006 (then T007 resolveDeletion)
# Then US1 and US2 proceed in parallel:
Task: "PrivacyInbox.tsx + tests"             # US1
Task: "Forgot/Reset/invitation + tests"      # US2
```

---

## Implementation Strategy

### MVP First (US1)
1. Phase 1 Setup → 2. Phase 2 Foundational → 3. Phase 3 US1 → **STOP & validate** (resolve a deletion request end-to-end, reflected in the User view) → demo.

### Incremental delivery
US1 (privacy inbox, MVP) → US2 (recovery) → US3 (activity log) → US4 (polish/404) → Polish gates. Keep all quality gates green at every checkpoint.

---

## Notes
- `[P]` = different files, no incomplete-task dependency.
- Add only NEW/optional model fields (recurring F1 rule) — never break prior fixtures.
- Components consume services only — never import fixtures/persistence (constitution IV).
- Status-only deletion resolution — no real data removed (constitution I).
- Run `tsc -b` from `frontend/` (not a spec dir).
