---
description: "Task list for User Portal & Assessment Runtime"
---

# Tasks: User Portal & Assessment Runtime

**Input**: Design documents from `specs/006-user-portal-runtime/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/screens-routes.md, contracts/services.md, quickstart.md

**Tests**: INCLUDED — the constitution mandates unit tests for services/governance and component tests for the runtime (all five question types) and report visibility; tests ship in the same checkpoint as code.

**Organization**: Tasks grouped by user story (US1–US6, priority order). App root: `frontend/`. Paths are repo-relative.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1–US6 (Setup/Foundational/Polish have no story label)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Models + fixtures + feature folders that every story builds on. No new dependencies.

- [X] T001 [P] Add runtime/consent types to `frontend/src/models/entities.ts` — `RuntimeState`, `QuestionResponse`, `ConsentRecord`, `ConsentUseCase`, `ConsentStatus`, `DataDeletionRequest`, `RuntimeItem`, `RuntimeSession`, `UserAssessmentSummary` (NEW exports only; per data-model.md; F1-safe — no edits to existing required fields).
- [X] T002 [P] Create `frontend/src/mocks/runtime.ts` — 1–2 hand-authored pre-resolved item sets covering all five method families (Likert, contextual frequency, forced choice, cognitive MCQ, SJT) with section grouping, plus matching `ConsentRecord` fixtures (required + applicable optional) per assessment; export from `frontend/src/mocks/index.ts`.
- [X] T003 [P] Create feature folders: `frontend/src/features/runtime/`, `frontend/src/features/assessments/user/`, `frontend/src/features/reports/user/`, `frontend/src/features/history/user/`, `frontend/src/features/help/`, `frontend/src/features/profile/` (User), with `index.ts` barrels.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared persistence store + the two service stubs every story consumes. **No story work begins until this phase is complete.**

**⚠️ CRITICAL**: Blocks all user stories.

- [X] T004 Create `frontend/src/services/consentStore.ts` — versioned `localStorage` store (mirror `blueprintContextStore.ts`) holding `ConsentRecord[]` + `DataDeletionRequest[]`; API: `all/upsert/byParticipant/deletionRequests/addDeletionRequest`; seeds from `mocks/runtime.ts` consent fixtures.
- [X] T005 Implement `runtimeService` in `frontend/src/services/runtime/runtimeService.ts` replacing the Spec 001 stub — `load/answer/next/back/goTo/pause/resume/submit/getProgress` per contracts/services.md; persist `RuntimeState` keyed by `assessmentId` in the versioned `nexus_runtime_v1` envelope (`getVersioned`/`setVersioned`); answers keyed by `sourceQuestionId`; **no scoring**.
- [X] T006 Implement `consentService` in `frontend/src/services/consent/consentService.ts` replacing the Spec 001 stub — `forAssessment/accept/decline/revoke/history/requestDeletion` per contracts/services.md; writes via `consentStore`; revocation eligibility per D5; deletion creates pending `Submitted` (D7).
- [X] T007 Update `frontend/src/services/index.ts` — export the completed `runtimeService` and `consentService` from their new modules; remove the `notImplemented` stubs for both.
- [X] T008 Wire User routes in `frontend/src/router.tsx` — replace the `/app/*` periphery Placeholders and the `/app/assessments/:assessmentId/run` Placeholder with `React.lazy` feature screens (runtime under `FullBleedShell`; rest under `UserShell`; all `user`-guarded). Screens may start as minimal shells to be filled per story.

**Checkpoint**: Services + store + routes resolve; stories can proceed in parallel.

---

## Phase 3: User Story 1 — Take an assessment end-to-end (Priority: P1) 🎯 MVP

**Goal**: Overview → consent → instructions → runtime → pause/resume/reload → submit → completion, on mocks, with auto-save and no live score.

**Independent Test**: From an active assessment, complete the spanning journey; pause/resume and reload restore progress; submit reaches completion; no score shown.

### Tests for User Story 1 ⚠️ (write first, ensure they fail)

- [X] T009 [P] [US1] Unit test `frontend/tests/unit/runtime.test.ts` — `load` returns fixed item set + rehydrated state; `answer` keys by `sourceQuestionId`; `next` gated on current answered; reload restores `questionIndex`+`answers` (SC-002); schema-mismatch safely discards; no score field in any payload (SC-004).
- [X] T010 [P] [US1] Component test `frontend/tests/component/runtime-container.test.tsx` — pause/resume + reload restore; save indicator reflects `lastSavedAt`; **no live score** anywhere; submit → completion (subtle, no confetti).

### Implementation for User Story 1

- [X] T011 [P] [US1] `frontend/src/features/assessments/user/AssessmentOverview.tsx` — org/purpose/role/duration/deadline/section+pause rules/privacy summary; Continue to consent; expired state.
- [X] T012 [P] [US1] `frontend/src/features/assessments/user/Instructions.tsx` — structure, question types, timed sections (display-only note), pause/resume, auto-save, submit behavior; Begin.
- [X] T013 [US1] `frontend/src/features/runtime/ProgressRail.tsx` + `SaveIndicator.tsx` — sticky progress + auto-save status (driven by `lastSavedAt`).
- [X] T014 [US1] `frontend/src/features/runtime/AssessmentRuntime.tsx` — container consuming `runtimeService` via `useAsync`; renders current item, gated Next, pause/resume, review step, Submit; **renders no score**.
- [X] T015 [P] [US1] `frontend/src/features/assessments/user/Completion.tsx` — subtle confirmation + processing/next-steps state (no confetti).
- [X] T016 [US1] Verify `/app/assessments/:id/{overview,consent,instructions,run,complete}` route to the new screens (runtime under `FullBleedShell`) in `frontend/src/router.tsx`.

**Checkpoint**: US1 fully functional and independently testable (MVP).

---

## Phase 4: User Story 2 — Answer all five question types (Priority: P1)

**Goal**: Five method-family renderers, answer-gated, stored by source Question ID, keyboard + touch operable, mobile-correct, with free back-navigation.

**Independent Test**: Render one of each type; correct layout; Next disabled until answered; response keyed by source Question ID; keyboard/touch operable (≥44px); back-nav edits restore.

### Tests for User Story 2 ⚠️

- [X] T017 [P] [US2] Component test `frontend/tests/component/question-renderers.test.tsx` — each of the five renderers: correct layout, answer-gating, keyboard operation, value stored by `sourceQuestionId`; forced-choice stacks; SJT readable.
- [X] T018 [P] [US2] Component test `frontend/tests/component/runtime-backnav.test.tsx` — back-navigate to a prior item, change the answer, confirm it re-stores under the same source Question ID and Next remains gated correctly.

### Implementation for User Story 2

- [X] T019 [P] [US2] `frontend/src/features/runtime/renderers/LikertRenderer.tsx` (Likert agreement, from `responseScale`).
- [X] T020 [P] [US2] `frontend/src/features/runtime/renderers/FrequencyRenderer.tsx` (contextual frequency).
- [X] T021 [P] [US2] `frontend/src/features/runtime/renderers/ForcedChoiceRenderer.tsx` (option cards; stack on mobile).
- [X] T022 [P] [US2] `frontend/src/features/runtime/renderers/McqRenderer.tsx` (cognitive MCQ single-select).
- [X] T023 [P] [US2] `frontend/src/features/runtime/renderers/SjtRenderer.tsx` (scenario + single-select).
- [X] T024 [US2] `frontend/src/features/runtime/renderers/index.ts` — `MethodFamily → renderer` registry with shared `{ item, value, onChange, disabled }` contract; wire into `AssessmentRuntime.tsx`; add `goTo`/`back` navigation controls.

**Checkpoint**: All five types work; US1+US2 independently functional.

---

## Phase 5: User Story 3 — Per-use-case consent with revocation (Priority: P1)

**Goal**: Consent gating + applicable-only optional consents; revoke eligible consents from Profile & Privacy; revocation reflects in the Admin Consent tab.

**Independent Test**: Accept-and-Continue gated on required consent; only applicable optional consents appear; revoke an eligible consent and confirm it shows in `/admin/users/:participantId` Consent tab.

### Tests for User Story 3 ⚠️

- [X] T025 [P] [US3] Unit test `frontend/tests/unit/consent.test.ts` — `forAssessment` returns required + only-applicable optional; `accept/decline` transitions; `revoke` honored only when `revocable` (optional always; required until report release); writes reflected via `consentStore.byParticipant` (SC-005/006).
- [X] T026 [P] [US3] Component test `frontend/tests/component/consent-screen.test.tsx` — Accept-and-Continue disabled until required checked; decline → neutral message/return; irrelevant optional consents absent.

### Implementation for User Story 3

- [X] T027 [US3] `frontend/src/features/assessments/user/Consent.tsx` — required + applicable optional consents; Accept-and-Continue gating; decline → neutral return to dashboard + mock status update; route `/app/assessments/:id/consent`.
- [X] T028 [US3] Consent history + revoke section in `frontend/src/features/profile/UserProfilePrivacy.tsx` — list `consentService.history()`; revoke eligible (per D5); reflect via `consentStore`.
- [X] T029 [US3] Populate the Admin Consent tab in `frontend/src/features/users/UserDetail.tsx` — read `consentStore.byParticipant(participantId)` (replace the current empty state) so revocation propagates (SC-006).

**Checkpoint**: Consent gating + revocation propagation work; US1–US3 independently functional.

---

## Phase 6: User Story 4 — No Admin-only data ever reaches the User (Priority: P1)

**Goal**: Guarantee zero Admin-only/internal leakage across all User screens; the User report is built solely from the Spec 005 user-safe projection.

**Independent Test**: Inspect each User screen (especially the report) — none of the restricted/internal fields are present; supportive (non hire/reject) language.

### Tests for User Story 4 ⚠️

- [X] T030 [P] [US4] Unit test `frontend/tests/unit/user-safe-leak.test.ts` — extend the Spec 005 user-safe guard: assert the User report payload (`reportService.getUserSafe`) contains 0 restricted/internal keys (`domains`, `domain6`, `scoringVersion`, `synthesisWeightVersion`, `omittedSections`, `interviewPrompts`) (SC-007/008).
- [X] T031 [P] [US4] Component test `frontend/tests/component/no-leak.test.tsx` — render the User report + runtime + dashboard; assert no scoring value, no metadata, no hire/reject language is present.

### Implementation for User Story 4

- [X] T032 [US4] Audit all User screens to consume only user-safe sources — confirm no component imports the full `Report` shape or `mocks/*` directly (constitution IV/IX); fix any violation found during T030/T031.

**Checkpoint**: Leakage guards green; US1–US4 satisfied.

---

## Phase 7: User Story 5 — View user-safe reports (Priority: P2)

**Goal**: My Reports list + a supportive user-safe report view with a simulated PDF.

**Independent Test**: Open My Reports, open an available report — only user-safe content shows; simulated PDF runs.

### Tests for User Story 5 ⚠️

- [X] T033 [P] [US5] Component test `frontend/tests/component/user-report.test.tsx` — report shows strengths/themes/allowed dimensions/caution-omission/optional high-level Domain 6 summary; PDF action invokes `reportService.downloadPdf` (records export-history); no restricted content.

### Implementation for User Story 5

- [X] T034 [P] [US5] `frontend/src/features/reports/user/MyReports.tsx` — list available/partial/historical with status + open/PDF actions; empty state; route `/app/reports`.
- [X] T035 [US5] `frontend/src/features/reports/user/UserReport.tsx` — render `reportService.getUserSafe` reusing Spec 005 user-safe components; simulated PDF; route `/app/reports/:reportId`.

**Checkpoint**: US5 functional; US1–US5 independently testable.

---

## Phase 8: User Story 6 — User portal periphery (Priority: P2)

**Goal**: Dashboard hero + My Assessments + History + Notifications + Help + Profile & Privacy (incl. pending data-deletion request) — own-data only.

**Independent Test**: Visit each periphery screen; own-data only; dashboard hero links into the active assessment; submit a pending data-deletion request.

### Tests for User Story 6 ⚠️

- [X] T036 [P] [US6] Component test `frontend/tests/component/dashboard-hero.test.tsx` — active-assessment hero (role, use case, deadline, progress, Continue) + completed/reports/notifications; empty state.
- [X] T037 [P] [US6] Unit test `frontend/tests/unit/deletion-request.test.ts` — `consentService.requestDeletion` creates a pending `Submitted` record in `consentStore` (D7).

### Implementation for User Story 6

- [X] T038 [US6] Extend `frontend/src/features/pages/UserDashboard.tsx` — active-assessment hero (from `runtimeService.getProgress` + `assessmentService`), completed, reports, notifications; empty states.
- [X] T039 [P] [US6] `frontend/src/features/assessments/user/MyAssessments.tsx` — active/completed own-data lists; route `/app/assessments`.
- [X] T040 [P] [US6] `frontend/src/features/history/user/UserAssessmentHistory.tsx` — own completed assessments; route `/app/history`.
- [X] T041 [P] [US6] `frontend/src/features/notifications/UserNotifications.tsx` — own notifications + email-delivery indicator + mark read (reuse `notificationService`); route `/app/notifications`.
- [X] T042 [P] [US6] `frontend/src/features/help/HelpAndSupport.tsx` — FAQ, runtime guidance, contact support, privacy questions; route `/app/help`.
- [X] T043 [US6] Complete `frontend/src/features/profile/UserProfilePrivacy.tsx` — personal info, language, simulated password change, consent history (from US3), data-deletion request (pending acknowledgement); route `/app/profile`.

**Checkpoint**: All six stories independently functional.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Quality gates + a11y/responsive verification across the portal.

- [X] T044 [P] Accessibility + reduced-motion pass on the priority flow (US1/US2) — keyboard operability, visible focus, labelled controls, ≥44px targets, sticky progress, safe-area; WCAG 2.1 AA basics (SC-009).
- [X] T045 [P] Responsive verification — runtime mobile-first (forced-choice stacks, SJT readable), periphery mobile→desktop.
- [X] T046 Run all quality gates from `frontend/`: `npx tsc -b` (0 errors), `npm run test` (all green), `npm run build` (succeeds), `npx eslint .` (0 errors), `npx prettier --check .` (clean).
- [X] T047 Run `specs/006-user-portal-runtime/quickstart.md` story validation end-to-end; mark every task `[X]`.

---

## Dependencies & Execution Order

### Phase dependencies
- **Setup (P1)** → no deps.
- **Foundational (P2)** → after Setup; **blocks all stories**.
- **US1–US6 (P3–P8)** → after Foundational. US1 first (MVP). US2 extends the US1 runtime container. US4 depends on US5 report being viewable to fully assert (run T030 against `getUserSafe` regardless). US3 self-contained. US5/US6 build on US1 data.
- **Polish (P9)** → after all targeted stories.

### Within each story
- Tests written first (must fail), then models → services → screens → integration.

### Parallel opportunities
- Setup: T001, T002, T003 all `[P]`.
- Foundational: T004 before T005/T006 (store first); T005 and T006 are independent files (parallelizable after T004); T007/T008 after.
- US2 renderers T019–T023 all `[P]`; US6 screens T039–T042 all `[P]`.
- All per-story `[P]` test tasks run together.

---

## Parallel Example: User Story 2

```bash
# Renderers (different files, no interdeps):
Task: "LikertRenderer.tsx"     # T019
Task: "FrequencyRenderer.tsx"  # T020
Task: "ForcedChoiceRenderer.tsx" # T021
Task: "McqRenderer.tsx"        # T022
Task: "SjtRenderer.tsx"        # T023
# Then T024 wires the registry into AssessmentRuntime.
```

---

## Implementation Strategy

### MVP First (US1)
1. Phase 1 Setup → 2. Phase 2 Foundational → 3. Phase 3 US1 → **STOP & validate** (full take-assessment journey on mocks) → demo.

### Incremental delivery
US1 (MVP) → US2 (five types) → US3 (consent/revocation) → US4 (leak guards) → US5 (reports) → US6 (periphery) → Polish. Each story is an independently testable increment; keep all quality gates green at every checkpoint.

---

## Notes
- `[P]` = different files, no incomplete-task dependency.
- Add only NEW/optional model fields (recurring F1 rule) — never break prior fixtures.
- Import charts from `@/components/charts`, not `@/components/ui` (recurring fix).
- Run `tsc -b` from `frontend/` (not a spec dir).
- No production scoring / live score anywhere (constitution VIII).
- Components consume services only — never import fixtures/persistence (constitution IV).
