---
description: "Task list — Nexus Assessment Platform Frontend Prototype"
---

# Tasks: Nexus Assessment Platform — Frontend Prototype

**Input**: Design documents in `specs/000-master-scope/` (`plan.md`, `spec.md`, `data-model.md`, `contracts/`, `research.md`, `quickstart.md`) + area specs `specs/001-…`–`008-…` + `specs/000-shared/*`. Constitution: `.specify/memory/constitution.md` (v2.0.0).

**Tech**: Vite + React 18 + TypeScript (strict) + React Router; CSS-variable tokens + CSS Modules; GSAP; Vitest + React Testing Library + axe. Mock services only — no backend. App root: `frontend/`.

**Tests**: Included — the constitution mandates governance/runtime/a11y tests and Spec 008 defines the QA gate. Test tasks are targeted (governance invariants, runtime, user-safe boundary, comparison), not full TDD-first.

**Story → area-spec map**: Foundational = 001 · US1 = 003 · US2 = 006 (runtime + account) · US3 = 005 (reports/Domain 6) · US4 = 002 · US5 = 004 · US6 = 005 (comparison + history) · US7 = 006 (periphery) · US8 = 007 · QA = 008.

**Format**: `- [ ] [TaskID] [P?] [Story?] Description with path` — `[P]` = parallelizable (different files, no blocking dep); `[US#]` only on user-story phases.

---

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Initialize the frontend app (Vite + React + TypeScript **strict**) in `frontend/` with `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- [x] T002 [P] Configure ESLint + Prettier in `frontend/.eslintrc.cjs` and `frontend/.prettierrc`
- [x] T003 [P] Configure Vitest + React Testing Library + axe in `frontend/vitest.config.ts` and `frontend/src/test/setup.ts`
- [x] T004 [P] Initialize git repo + `.gitignore` at repo root (no git repo exists yet)
- [x] T005 Create source folder structure per plan: `frontend/src/{styles,components/{ui,charts,motion,layout,nex},features,services/governance,models,mocks,hooks,lib}` and `frontend/tests/{unit,component,e2e}`
- [x] T006 [P] Add npm scripts (`dev`, `build`, `test`, `test:a11y`, `lint`) to `frontend/package.json`

**Checkpoint**: App scaffold builds and `npm run dev` serves a blank shell.

---

## Phase 2: Foundational (Spec 001) — BLOCKS ALL USER STORIES

**⚠️ No user-story work may begin until this phase is complete.**

- [x] T007 [P] Port Claude Design tokens to `frontend/src/styles/tokens.css` (light + `[data-theme=dark]`) and base/utilities/keyframes in `frontend/src/styles/globals.css`
- [x] T008 [P] Add pre-paint theme script (reads `localStorage('nexus_theme')`) in `frontend/index.html`
- [x] T009 [P] Typed token mirror for charts in `frontend/src/styles/theme.ts`
- [x] T010 [P] Author TS models + enums from `data-model.md` in `frontend/src/models/` (governance fields immutable at type level; no `weight`/`difficulty`)
- [x] T011 Mock HTTP simulator (latency + toggleable errors) in `frontend/src/services/http.ts`
- [x] T012 [P] Namespaced/versioned local persistence in `frontend/src/services/persistence.ts`
- [x] T013 Governance helpers in `frontend/src/services/governance/{eligibility,confidenceGate,useCaseGate,visibilityEngine,toUserSafe}.ts`
- [x] T014 [P] Unit tests for governance helpers in `frontend/tests/unit/governance.test.ts` (eligibility excludes blocked/quarantine/pilot/research; confidence bands; user-safe strips restricted)
- [x] T015 Mock auth (`authService`) in `frontend/src/services/auth/authService.ts`: Admin sign-in; **permanent User account** — `activateInvitation(code,password)` + `loginUser(creds)` + `requestReset`; `getSession`/`logout`
- [x] T016 Router + `AdminShell`/`UserShell` + role guards + `/access-denied` + full-bleed mode in `frontend/src/router.tsx` and `frontend/src/components/layout/`
- [ ] T017 [P] UI component library in `frontend/src/components/ui/` (Button, IconButton, Card, Modal, Drawer, Popover, Menu, Tabs, Field, TextArea, Select, Slider, SegmentedControl, Toggle, Checkbox, RadioGroup, StatusBadge, Chip, ConfidenceChip, TrustBadge, Avatar, ScoreBar, Ring, CountUp, Tooltip, EmptyState, Skeleton, DataTable, FilterBar, SearchInput, Stepper, Toast, Timeline)
- [ ] T018 [P] Chart primitives in `frontend/src/components/charts/` (Gauge, ContextRadar, FitRadar, DimensionBars, CoverageBars, ContextSignature) with text-equivalents
- [ ] T019 [P] Motion primitives + `useReducedMotion` in `frontend/src/components/motion/` (PageFX, Reveal, CountUp, TransformSequence)
- [x] T020 [P] App-wide `ErrorBoundary` + `ToastHost` (aria-live) + hooks (`useTheme`, `useAsync`, `useLocalStorage`, `useViewport`, `useToast`) in `frontend/src/components/` and `frontend/src/hooks/`
- [ ] T021 [P] Seed fixtures in `frontend/src/mocks/` (1 org, 1 Admin, ≥8 Participants, blueprints, contexts, drafts, assignments, invitations, reminders, reports spanning confidence bands + ≥1 omitted/blocked section, notifications, exports, activity events)
- [ ] T022 Build-time bank conversion `frontend/src/mocks/import-bank.ts` → **code-split** `frontend/src/mocks/governed-bank.ts` (full 543-item `item_bank`, all metadata; not in initial chunk)

**Checkpoint**: Both shells boot; theme flips with no flash; a page renders via a service Promise; governance tests pass; bank is code-split.

---

## Phase 3: User Story 1 — Admin designs & sends a governed assessment (Priority: P1) 🎯 MVP

**Goal**: Complete the 12-step Create Assessment flow on mocks, producing one Not-Started assessment.
**Independent test**: From `/admin/assessments/new`, finish all 12 steps → success creates an assignment + invitation + notification + simulated email; every question shows provenance + locked-scoring; no blocked item appears.

- [ ] T023 [P] [US1] Service stubs in `frontend/src/services/`: `assessmentDraft/assessmentDraftService.ts`, `agentDiscovery/agentDiscoveryService.ts`, `questionBank/questionBankService.ts`, `adaptation/adaptationService.ts`, `assessment/assessmentService.ts` (signatures per `contracts/mock-services.md`)
- [ ] T024 [US1] Wizard shell (12-step progress, draft persistence, full-bleed) in `frontend/src/features/create-assessment/Wizard.tsx`
- [ ] T025 [P] [US1] Step 1 Select User + Step 2 Define Purpose in `frontend/src/features/create-assessment/steps/{SelectUser,Purpose}.tsx`
- [ ] T026 [US1] Step 3 AI Discovery Chat + live Requirements Panel (scripted; labeled "live AI" stub) in `frontend/src/features/create-assessment/{DiscoveryChat,RequirementsPanel}.tsx`
- [ ] T027 [P] [US1] Transform sequence (skippable, reduced-motion-safe) in `frontend/src/features/create-assessment/steps/TransformSequence.tsx`
- [ ] T028 [P] [US1] Step 4 Job Requirements Summary (edit/return/refine/approve) in `frontend/src/features/create-assessment/steps/RequirementsSummary.tsx`
- [ ] T029 [P] [US1] Steps 5 & 6 Blueprint + Context pickers (select/create) in `frontend/src/features/create-assessment/steps/{PickBlueprint,PickContext}.tsx`
- [ ] T030 [US1] Step 7 Question Selection via `questionBankService` (eligibility gate) + provenance cards + "Scoring Logic Locked" in `frontend/src/features/create-assessment/steps/QuestionSelection.tsx`
- [ ] T031 [US1] Step 8 Controlled Rephrasing via `adaptationService` (`{itemId,adaptedText}` only) + word diff + method safeguards in `frontend/src/features/create-assessment/steps/Rephrasing.tsx`
- [ ] T032 [P] [US1] Step 9 Coverage Review (live recompute + amber under-coverage warnings) in `frontend/src/features/create-assessment/steps/Coverage.tsx`
- [ ] T033 [US1] Step 10 Approval gate + Step 11 Deadline & Reminders + Step 12 Review & Send + Success in `frontend/src/features/create-assessment/steps/{Approval,Schedule,ReviewSend,Success}.tsx`
- [ ] T034 [US1] Tests in `frontend/tests/component/create-assessment.test.tsx`: blocked-item exclusion, adaptation metadata immutability, coverage recompute, Send disabled until approval
- [ ] T035 [US1] Wire entry points (Dashboard/Users/Assessments "Create Assessment") to `/admin/assessments/new`

**Checkpoint**: US1 fully functional and testable independently (SC-001, SC-002).

---

## Phase 4: User Story 2 — A person completes an assessment + account (Priority: P1)

**Goal**: Invitation→account activation/sign-in→overview→consent→instructions→runtime (5 types)→pause/resume→submit→completion, mobile-first.
**Independent test**: From `/invitation`, activate account, complete all five question types on a mobile viewport, reload mid-run and resume, submit.

- [ ] T036 [P] [US2] `runtimeService` (load/save/pause/resume/submit; responses keyed by `itemId`) in `frontend/src/services/runtime/runtimeService.ts`
- [ ] T037 [US2] Invitation/account screen (activate-from-invitation + sign-in + forgot-password) in `frontend/src/features/auth/InvitationAccess.tsx` (uses `authService`)
- [ ] T038 [P] [US2] User Dashboard + My Assessments + Assessment Overview in `frontend/src/features/runtime/{UDashboard,MyAssessments,Overview}.tsx`
- [ ] T039 [US2] Consent (mandatory current-use-case gate + applicable optional opt-ins) in `frontend/src/features/runtime/Consent.tsx` (uses `consentService`)
- [ ] T040 [P] [US2] Instructions screen in `frontend/src/features/runtime/Instructions.tsx`
- [ ] T041 [US2] Runtime shell (section, X-of-Y, progress, dots, timed chip, auto-save, prev/next/submit gating, pause) in `frontend/src/features/runtime/Runtime.tsx`
- [ ] T042 [US2] `QuestionCard` ×5 (Likert agreement, contextual frequency, forced-choice, cognitive MCQ, SJT) + mobile layouts in `frontend/src/features/runtime/QuestionCard.tsx`
- [ ] T043 [P] [US2] Pause overlay + Completion/processing in `frontend/src/features/runtime/{Pause,Completion}.tsx`
- [ ] T044 [US2] Tests in `frontend/tests/component/runtime.test.tsx`: consent gate, answer-gated next, pause→resume across reload, all five types render, account activate/sign-in
- [ ] T045 [P] [US2] `consentService` (per-use-case grant; current-use-case gate) in `frontend/src/services/consent/consentService.ts`
- [ ] T046 [US2] Reduced-motion + ≥44px touch-target verification for the runtime

**Checkpoint**: US2 works end-to-end on mobile incl. account + pause/resume (SC-003).

---

## Phase 5: User Story 3 — Admin reviews governed reports incl. Domain 6 (Priority: P1)

**Goal**: Governed Admin report (visibility states + omitted sections), Domain 6 view, user-safe preview, simulated PDF.
**Independent test**: Open a report → caution/downgraded dims + an omitted section with explanation; Domain 6 renders; user-preview strips restricted content; disclaimer present.

- [ ] T047 [P] [US3] `reportService` (list, getAdmin, getUserSafe via `toUserSafe`, downloadPdf simulated) in `frontend/src/services/report/reportService.ts`
- [ ] T048 [P] [US3] `scoringService` (report fixture/processing) + `domain6Service` (fixture projection) in `frontend/src/services/{scoring,domain6}/`
- [ ] T049 [US3] Reports list (filters, confidence chip, Domain 6 status, actions) in `frontend/src/features/reports/ReportsList.tsx`
- [ ] T050 [US3] Admin Report Detail with visibility engine wiring + version footer + no-auto-decision disclaimer in `frontend/src/features/reports/AdminReport.tsx`
- [ ] T051 [US3] Domain 6 section (CAI/DII gauges, six secondary indices, candidate-vs-context Fit Radar, provisional/omitted treatment) in `frontend/src/features/reports/Domain6.tsx`
- [ ] T052 [US3] User-safe Preview route (`/admin/reports/:id/user-preview`) using `toUserSafe` in `frontend/src/features/reports/UserSafePreview.tsx`
- [ ] T053 [P] [US3] Simulated PDF action + export-history entry in `frontend/src/features/reports/pdf.ts`
- [ ] T054 [US3] Tests in `frontend/tests/component/reports.test.tsx`: visibility rendering (caution/downgraded/omitted), user-safe excludes restricted (SC-004), Domain 6 provisional
- [ ] T055 [P] [US3] Accessible text-equivalents for report charts

**Checkpoint**: US3 renders governed data correctly; user-safe boundary verified (SC-004).

---

## Phase 6: User Story 4 — Admin manages people & assessments (Priority: P2)

**Goal**: Dashboard, people (add/bulk), assessments list/detail + actions, notifications, exports, settings, profile.
**Independent test**: Add a user, bulk-upload a CSV (validation preview), export Users CSV, run an assessment management action.

- [ ] T056 [P] [US4] `participantService`, `notificationService`, `exportService` (CSV via `lib/csv.ts`), `settingsService` in `frontend/src/services/`
- [ ] T057 [US4] Admin Dashboard (KPIs count-up, recent lists, deadline alerts, blueprint status, quick actions) in `frontend/src/features/dashboard/Dashboard.tsx`
- [ ] T058 [US4] Users list (search/filter/multi-select/staggered rows/empty) in `frontend/src/features/users/UsersList.tsx`
- [ ] T059 [P] [US4] Add User drawer + Bulk Upload modal (validation phases) in `frontend/src/features/users/{AddUser,BulkUpload}.tsx`
- [ ] T060 [US4] User Detail (Overview/Active/History/Reports/Consent/Timeline tabs) in `frontend/src/features/users/UserDetail.tsx`
- [ ] T061 [US4] Assessments list (lifecycle + validity separate) + Assessment Detail (actions, reminders, consent, timeline) in `frontend/src/features/assessments/{AssessmentsList,AssessmentDetail}.tsx`
- [ ] T062 [P] [US4] Notifications page (read/unread + email indicator) in `frontend/src/features/notifications/Notifications.tsx`
- [ ] T063 [P] [US4] Exports page (7 types, CSV real / PDF simulated, history, re-run) in `frontend/src/features/exports/Exports.tsx` + `frontend/src/lib/csv.ts`
- [ ] T064 [P] [US4] Organization Settings (one-Admin rule) + My Profile in `frontend/src/features/settings/Settings.tsx`, `frontend/src/features/profile/AdminProfile.tsx`
- [ ] T065 [US4] Test in `frontend/tests/component/admin-core.test.tsx`: CSV export downloads; bulk-upload validation counts

**Checkpoint**: Admin can run the org day-to-day on mocks; CSV exports work.

---

## Phase 7: User Story 5 — Role Blueprints & Context Profiles (Priority: P2)

**Goal**: Create/manage reusable blueprints & contexts with lifecycle, versions, linking; selectable in Create Assessment.
**Independent test**: Build a blueprint (dimension required/optional/excluded + importance) and a context (live signature); link; both appear in US1 pickers.

- [ ] T066 [P] [US5] `roleBlueprintService` + `contextProfileService` (CRUD, lifecycle, versions, link) in `frontend/src/services/{roleBlueprint,contextProfile}/`
- [ ] T067 [US5] Blueprints list + 8-step Create wizard in `frontend/src/features/blueprints/{BlueprintsList,CreateBlueprint}.tsx`
- [ ] T068 [P] [US5] Blueprint Detail (7 tabs + lifecycle actions + version history) in `frontend/src/features/blueprints/BlueprintDetail.tsx`
- [ ] T069 [US5] Contexts list + Context builder (17 fields, live ContextSignature) in `frontend/src/features/contexts/{ContextsList,CreateContext}.tsx`
- [ ] T070 [P] [US5] Context Detail (context map, linked blueprint, versions) in `frontend/src/features/contexts/ContextDetail.tsx`
- [ ] T071 [US5] Two-way Blueprint↔Context linking + ensure created records appear in US1 pickers

**Checkpoint**: Blueprints/contexts create/view/link; lifecycle works.

---

## Phase 8: User Story 6 — Candidate Comparison + Admin History (Priority: P2)

**Goal**: Side-by-side human-led comparison (no ranking) + global Assessment History.
**Independent test**: Configure role/blueprint/context + candidates + dimensions → grid shows side-by-side with no ranking/auto-decision; history is searchable with version awareness.

- [ ] T072 [P] [US6] `comparisonService` (read model; no ranking) in `frontend/src/services/comparison/comparisonService.ts`
- [ ] T073 [US6] Comparison setup + side-by-side grid (CAI, per-dimension bars, strengths/stretch, prompts, disclaimer) in `frontend/src/features/comparison/Comparison.tsx`
- [ ] T074 [P] [US6] Admin Assessment History (versions, filters, export, open historical report) in `frontend/src/features/history/AdminHistory.tsx`
- [ ] T075 [US6] Test in `frontend/tests/component/comparison.test.tsx`: no ranking/leaderboard language; no auto shortlist/reject/hire action (SC-008)
- [ ] T076 [P] [US6] Responsive comparison grid (horizontal scroll + sticky candidate column)

**Checkpoint**: Comparison + history work; no-ranking guarantee verified (SC-008).

---

## Phase 9: User Story 7 — Candidate reports, history & privacy (Priority: P3)

**Goal**: User-safe reports + history + notifications + help + profile/privacy (consent revoke, deletion request).
**Independent test**: Open own report (user-safe), revoke an eligible consent → reflects in Admin Consent tab.

- [ ] T077 [US7] My Reports + User Report Detail (user-safe, reuse `toUserSafe` + report components) in `frontend/src/features/reports/{MyReports,UserReport}.tsx`
- [ ] T078 [P] [US7] User History + User Notifications in `frontend/src/features/runtime/{UHistory,UNotifications}.tsx`
- [ ] T079 [P] [US7] Help & Support (FAQ + contacts) in `frontend/src/features/runtime/Help.tsx`
- [ ] T080 [US7] Profile & Privacy (account/password sim, consent history, **revoke eligible consent**, data-deletion request) in `frontend/src/features/profile/UserProfile.tsx`
- [ ] T081 [US7] Consent revocation propagation to Admin User-Detail Consent tab (via `consentService`)
- [ ] T082 [US7] Test in `frontend/tests/component/user-periphery.test.tsx`: revoke invalidates use case + propagates; no Admin-only data in user portal

**Checkpoint**: Candidate periphery complete; user-safe boundary holds.

---

## Phase 10: User Story 8 — Public entry, recovery, activity log & polish (Priority: P3)

**Goal**: Landing, account recovery, access-denied, not-found, offline, org Activity Log, privacy inbox, motion/responsive/theme polish.
**Independent test**: Landing CTAs route to sign-in/invitation without bypass; activity log filters org events.

- [ ] T083 [P] [US8] Public Landing (safe CTAs → `/login` / `/invitation`) in `frontend/src/features/auth/Landing.tsx`
- [ ] T084 [P] [US8] Forgot/Reset Password (mock) in `frontend/src/features/auth/{ForgotPassword,ResetPassword}.tsx`
- [ ] T085 [P] [US8] Access Denied + Not Found + Offline/Reconnected banner in `frontend/src/features/auth/{AccessDenied,NotFound}.tsx` + `frontend/src/components/layout/OfflineBanner.tsx`
- [ ] T086 [US8] `activityLogService` + Activity Log page (selected high-value events, filters, detail drawer, CSV) in `frontend/src/services/activityLog/activityLogService.ts` + `frontend/src/features/activity-log/ActivityLog.tsx`
- [ ] T087 [P] [US8] Privacy Request inbox state in Settings → Privacy and Consent in `frontend/src/features/settings/PrivacyInbox.tsx`
- [ ] T088 [US8] Nex companion (float/hop, desktop mouse-parallax, contextual hints, reduced-motion-safe) in `frontend/src/components/nex/RobotCompanion.tsx`
- [ ] T089 [P] [US8] Motion polish pass (route/section transitions, count-ups, diff reveal, coverage bars) — no parallax, reduced-motion-safe
- [ ] T090 [US8] Responsive polish across Admin/User surfaces

**Checkpoint**: Public/system states + activity log + polish complete; no access bypass.

---

## Phase 11: Polish & Cross-Cutting / QA Gate (Spec 008)

- [ ] T091 [P] Empty/loading/error state audit across every route in `frontend/src/features/**`
- [ ] T092 [P] Accessibility QA (axe + manual: keyboard, focus trap, aria-live, radio-group, chart text, contrast both themes) on priority flows — `frontend/tests/a11y/`
- [ ] T093 [P] Responsive QA across desktop/laptop/tablet/mobile/small-mobile for the priority surfaces
- [ ] T094 [P] Performance QA: `item_bank` not in initial chunk; route lazy loading; no fixture imports inside page components; no rerender loops
- [ ] T095 Route audit: every route in `000-shared/route-map.md` renders with shell/guard/title/states
- [ ] T096 Governance QA: no fabricated/blocked items; metadata immutable; source ID preserved to runtime; user-safe strips restricted; Domain 6 provisional; no ranking/auto-decision
- [ ] T097 [P] E2E journeys (optional Playwright) in `frontend/tests/e2e/`: Admin Journey A (developmental), Admin Journey B (hiring support), User journey
- [ ] T098 Documentation QA + Definition of Done check (Spec 008 §9) and final delivery notes

---

## Dependencies & Execution Order

- **Phase 1 (Setup)** → **Phase 2 (Foundational, Spec 001)** must complete first; Phase 2 **blocks all** user stories.
- After Phase 2: **US1, US2, US4, US5** are largely independent and can run in parallel by different developers. **US3** depends on report fixtures (Phase 2) and is independent of US1. **US6** depends on report fixtures (US3 helpful but comparison uses its own service). **US7** depends on US3's user-safe components + US2 consent. **US8** depends on shells (Phase 2).
- **Phase 11 (QA)** depends on the prior phases it audits.

## Parallel Opportunities

- All `[P]` Setup tasks (T002–T004, T006) and most Foundational `[P]` tasks (T007–T010, T012, T014, T017–T021) run together.
- Within a story, `[P]` tasks touch different files — e.g. US1: T025/T027/T028/T029/T032; US2: T036/T038/T040/T043/T045.
- Across stories (post-Foundational): a team can run US1 + US2 + US4 + US5 concurrently.

## Implementation Strategy

- **MVP** = Phase 1 + Phase 2 + **US1 (Create Assessment)**. Stop & validate (SC-001/SC-002), demo.
- **Incremental**: add US2 (runtime) → US3 (reports) to complete the three P1 stories → then P2 (US4/US5/US6) → P3 (US7/US8) → QA gate.
- Each story ends at its checkpoint with its tests passing before the next begins (constitution review gates).
