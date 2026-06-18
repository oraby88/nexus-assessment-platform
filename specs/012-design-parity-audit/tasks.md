---
description: "Task list — Design-Parity Audit & Gap-Closure"
---

# Tasks: Design-Parity Audit & Gap-Closure

**Input**: Design documents from `specs/012-design-parity-audit/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/{parity-bar.md,screen-map.md}, quickstart.md

**Tests**: INCLUDED — structural/token parity assertions (`tests/parity/`) + reuse of the Spec 008 release gate, Spec 009 reduced-motion/no-shell-parallax/`check:bundle`. Parity match itself is review-signed-off via `inventory.md` (no pixel-diff — clarify Q1).

**Scope**: Frontend/mock-only (constitution I). Presentation/markup/styling only — **no** new features, data, scoring, routes, or service changes; reduced-motion-safe; no shell parallax; ≤260 KB eager (GSAP lazy); **0 functional regressions**. Per-area interleaved audit→close (clarify Q3); close all **High+Medium** gaps, **Low** deferrable (Q2). All paths under `frontend/`; design sources per `contracts/screen-map.md`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 (P1, chrome+components+public/auth) · US2 (P2, Admin) · US3 (P2, User portal & runtime) · US4 (P3, Create-Assessment)
- Each closure task = bring the named screen(s) to the parity bar vs the design source, recording deviations (High/Medium/Low) in `inventory.md` and closing all High+Medium.

## Path Conventions

- Inventory: `specs/012-design-parity-audit/inventory.md` · Tests: `frontend/tests/parity/` · Design source: `project/app/*.jsx` + `styles.css` (per `contracts/screen-map.md`).

---

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 Create the gap-inventory file `specs/012-design-parity-audit/inventory.md` with per-area sections (chrome / admin / user / create) using the entry schema from `data-model.md`, and create `frontend/tests/parity/` with a one-line README.
- [X] T002 [P] Capture the bundle baseline: run `npm run build` then `npm run check:bundle` in `frontend/` and record the initial eager JS size in `specs/012-design-parity-audit/quickstart.md` (headroom reference; budget ≤ 260 KB — currently ~258 KB).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Reconcile the shared token/icon foundation every screen depends on — so all areas close against correct values.

**⚠️ CRITICAL**: Complete before per-area closure.

- [X] T003 Audit + reconcile design tokens: diff `frontend/src/styles/tokens.css` (and `globals.css` keyframes) against `project/app/styles.css` (`:root` light + `[data-theme="dark"]`); add any missing color/spacing/radius/shadow/easing/font tokens or keyframes the design specifies; record discrepancies in `inventory.md`. Token/class changes only — no new eager JS imports (budget headroom is ~2 KB).

**Checkpoint**: Token/icon foundation correct — area closure can proceed.

---

## Phase 3: User Story 1 - Shared chrome + components + public/auth (Priority: P1) 🎯 MVP

**Goal**: The sidebar/topbar/popovers/avatar/theme toggle, the UI primitives + icon set, and the public/auth entry screens match the design (`app/shell.jsx`, `app/ui.jsx`, `app/icons.jsx`, `app/landing.jsx`) in both themes + RTL + responsive.

**Independent Test**: Side-by-side review of the shell + primitives + auth screens vs their sources in light/dark + mobile + RTL; `tests/parity/chrome` passes; 0 open High/Medium chrome/component gaps.

### Audit + Tests for User Story 1

- [X] T004 [US1] Audit the shared chrome (`frontend/src/components/layout/index.tsx` ← `app/shell.jsx`), UI primitives (`frontend/src/components/ui/{index.tsx,primitives.tsx}` ← `app/ui.jsx`), icon set (← `app/icons.jsx`), and public/auth screens (`frontend/src/features/auth/index.tsx` ← `app/landing.jsx`); append classified deviations to the chrome section of `inventory.md`.
- [X] T005 [P] [US1] Parity structural test (chrome renders the expected nav/topbar structure + tokens; primitives expose the expected variants/states; loading/empty/skeleton present) in `frontend/tests/parity/chrome.test.tsx`.

### Closure for User Story 1

- [X] T006 [US1] Close shell gaps (sidebar, topbar, search, notification/help/profile popovers, avatar, theme toggle, mobile nav) in `frontend/src/components/layout/index.tsx` vs `app/shell.jsx`.
- [X] T007 [P] [US1] Close UI-primitive gaps (Button, Card, inputs/Select, Badge/Chip, DataTable, tooltips, EmptyState/Skeleton) in `frontend/src/components/ui/index.tsx` + `frontend/src/components/ui/primitives.tsx` vs `app/ui.jsx`.
- [X] T008 [P] [US1] Establish a centralized icon set: create `frontend/src/components/ui/icons.tsx` porting the named icons from `project/app/icons.jsx` (a named-`Icon` API), and use it for the chrome icons (sidebar nav, topbar bell/help, menu items, affordances); add any missing icons. **Note**: the app has no dedicated icon module today — icons are passed ad hoc as `IconButton` `children` — so this task introduces one (presentation asset) and replaces ad-hoc inline chrome icons with it.
- [X] T009 [P] [US1] Close public/auth screen gaps (admin login, invitation, forgot/reset password, access-denied, 404) in `frontend/src/features/auth/index.tsx` vs `app/landing.jsx` (Landing already done in Spec 011).

**Checkpoint**: US1 done — shared layer matches the design (the most pervasive parity gain).

---

## Phase 4: User Story 2 - Admin screens parity (Priority: P2)

**Goal**: Every Admin screen matches its `app/admin_*.jsx`/`report_detail.jsx` counterpart, including states, in both themes + RTL + responsive.

**Independent Test**: Review each Admin route vs its source; `tests/parity/admin` passes; 0 open High/Medium.

### Audit + Tests for User Story 2

- [X] T010 [US2] Audit all Admin screens vs their design sources (per `contracts/screen-map.md`); append classified deviations to the admin section of `inventory.md`. Note app-only screens with no design counterpart (`privacy`, `activity-log`, `sample`, Placeholder) as "no design source".
- [X] T011 [P] [US2] Parity structural test (each Admin screen renders expected sections + loading/empty/error states) in `frontend/tests/parity/admin.test.tsx`.

### Closure for User Story 2

- [X] T012 [P] [US2] Dashboard — `frontend/src/features/dashboard/AdminDashboard.tsx` vs `app/admin_dashboard.jsx`.
- [X] T013 [P] [US2] Users list + detail — `frontend/src/features/users/*` vs `app/admin_candidates.jsx`.
- [X] T014 [P] [US2] Assessments list + detail — `frontend/src/features/assessments/{AssessmentsList,AssessmentDetail}.tsx` vs `app/admin_assessments.jsx`.
- [X] T015 [P] [US2] Blueprints list/detail/builder — `frontend/src/features/blueprints/*` vs `app/admin_blueprints.jsx`.
- [X] T016 [P] [US2] Contexts list/detail/builder — `frontend/src/features/contexts/*` vs `app/admin_contexts.jsx`.
- [X] T017 [P] [US2] Reports list + Admin report + user-safe preview + comparison — `frontend/src/features/reports/*` + `frontend/src/features/comparison/*` vs `app/admin_reports.jsx`/`app/report_detail.jsx`.
- [X] T018 [P] [US2] Misc — history/exports/notifications/settings/profile — `frontend/src/features/{history,exports,notifications,settings,profile}/*` vs `app/admin_misc.jsx`.

**Checkpoint**: US2 done — Admin matches the design.

---

## Phase 5: User Story 3 - User portal & runtime parity (Priority: P2)

**Goal**: Every User-facing screen matches its `app/user_portal.jsx`/`app/user_assessment.jsx`/`report_detail.jsx` counterpart, including states; runtime shows no live score/internal data (constitution IX).

**Independent Test**: Review each User route vs its source; `tests/parity/user` passes; 0 open High/Medium; no restricted content.

### Audit + Tests for User Story 3

- [X] T019 [US3] Audit all User-portal + runtime screens vs their design sources (per `contracts/screen-map.md`); append classified deviations to the user section of `inventory.md`.
- [X] T020 [P] [US3] Parity structural test (each User screen renders expected sections + states; runtime leak-guard reuses the Spec 006 forbidden-terms pattern) in `frontend/tests/parity/user.test.tsx`.

### Closure for User Story 3

- [X] T021 [P] [US3] User dashboard + my reports + history + notifications + help + profile/privacy — `frontend/src/features/pages.tsx` (UserDashboard) + `frontend/src/features/reports/user/MyReports.tsx` + `frontend/src/features/history/user/*` + `frontend/src/features/notifications/UserNotifications.tsx` + `frontend/src/features/help/*` + `frontend/src/features/profile/UserProfilePrivacy.tsx` vs `app/user_portal.jsx`.
- [X] T022 [P] [US3] My assessments + overview/consent/instructions/completion — `frontend/src/features/assessments/user/*` vs `app/user_assessment.jsx`.
- [X] T023 [P] [US3] Assessment runtime — `frontend/src/features/runtime/*` vs `app/user_assessment.jsx` (no live score/internal metadata).
- [X] T024 [P] [US3] User report — `frontend/src/features/reports/user/UserReport.tsx` vs `app/report_detail.jsx` (user-safe projection).

**Checkpoint**: US3 done — User portal & runtime match the design.

---

## Phase 6: User Story 4 - Create-Assessment flow parity (Priority: P3)

**Goal**: The wizard (all steps), discovery interview, and Transform Sequence match `app/create_assessment*.jsx`/`app/transform_sequence.jsx`, including full-bleed layout and signature motion (reduced-motion-safe).

**Independent Test**: Walk the create flow vs its sources; `tests/parity/create-assessment` passes; 0 open High/Medium; reduced-motion-safe.

### Audit + Tests for User Story 4

- [X] T025 [US4] Audit the create-assessment wizard + steps + discovery + transform sequence vs their design sources; append classified deviations to the create section of `inventory.md`.
- [X] T026 [P] [US4] Parity structural test (wizard renders the expected steps/controls; the sequence remains skippable + reduced-motion-safe) in `frontend/tests/parity/create-assessment.test.tsx`.

### Closure for User Story 4

- [X] T027 [US4] Close wizard + step gaps — `frontend/src/features/create-assessment/{CreateAssessmentWizard,steps,QuestionCard,CoverageMap,RephrasePanel,DiscoveryChat}.tsx` vs `app/create_assessment{,2,3}.jsx`.
- [X] T028 [US4] Verify/refine the Transform Sequence visuals — `frontend/src/features/create-assessment/TransformSequence.tsx` vs `app/transform_sequence.jsx` (Spec 011 baseline; keep skippable + reduced-motion fallback + governed copy). Depends on T027 (shared create-flow tokens).

**Checkpoint**: US4 done — Create-Assessment matches the design.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T029 [P] Finalize `specs/012-design-parity-audit/inventory.md`: confirm it covers 100% of live routes, 0 `open` High/Medium remain, and every `deferred` (Low) entry has a reviewer sign-off note (SC-001/002).
- [X] T030 Run the full `npm run release-gate` (incl. `check:bundle`) in `frontend/` and confirm initial eager JS ≤ 260 KB (GSAP lazy), all gates green, and 0 functional regressions (SC-005/006).
- [X] T031 [P] Verify across audited areas: both themes, RTL, reduced-motion degradation, and 0 shell parallax (reuse the Spec 009 suites); record the checks in `specs/012-design-parity-audit/quickstart.md` (SC-004).
- [X] T032 [P] Record the fidelity-review sign-off note (areas reviewed vs `project/`, parity bar met) in `specs/012-design-parity-audit/quickstart.md` (SC-002/003).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: After Setup — T003 token reconciliation blocks all area closure (every screen uses tokens/icons).
- **User Stories (Phases 3–6)**: After Foundational. Run in priority order (US1 first — its shared chrome/component/token fixes are inherited by US2–US4). US2/US3/US4 are otherwise independent of each other.
- **Polish (Phase 7)**: After the targeted stories complete.

### User Story Dependencies

- **US1 (P1)**: Needs T003. MVP — the most pervasive layer; US2–US4 inherit its shared fixes.
- **US2 (P2)**: After US1 (inherits chrome/components/tokens). Per-screen closure tasks are independent.
- **US3 (P2)**: After US1. Independent of US2/US4.
- **US4 (P3)**: After US1. Independent of US2/US3.

### Within Each Story

- Audit (writes the inventory section) → tests → closure. Closure tasks for distinct screen files are [P]. T028 follows T027 (shared create-flow tokens).

### Parallel Opportunities

- Setup: T001, T002.
- US1 closure: T007/T008/T009 in parallel after T004 (T006 is the shell file).
- US2 closure: T012–T018 all parallel (distinct feature folders) after T010.
- US3 closure: T021–T024 all parallel after T019.
- US2/US3/US4 can be staffed concurrently after US1 (distinct files).

---

## Parallel Example: User Story 2

```bash
# After T010 audit + T011 test:
Task: "Dashboard parity"            # T012
Task: "Users list/detail parity"    # T013
Task: "Assessments parity"          # T014
Task: "Blueprints parity"           # T015
Task: "Contexts parity"             # T016
Task: "Reports/comparison parity"   # T017
Task: "Misc (history/exports/…) parity"  # T018
```

---

## Implementation Strategy

### MVP First

1. Setup → Foundational (token reconciliation).
2. US1 (shared chrome + components + public/auth) — the highest-leverage parity gain; every other screen inherits it.
3. **STOP & VALIDATE**: shell + primitives + auth match the design in both themes + RTL; gate + bundle green; 0 open High/Medium chrome gaps.

### Incremental Delivery

1. Setup + Foundational → ready.
2. US1 → validate → ship (MVP). 3. US2 (Admin) → validate → ship. 4. US3 (User) → validate → ship. 5. US4 (Create) → validate → ship.
3. The gap inventory grows per area; each area is an independently reviewable parity increment.

### Parallel Team Strategy

After US1: Dev A → US2, Dev B → US3, Dev C → US4 (distinct files). Within each, per-screen closure parallelizes. Polish (T029–T032) runs once areas land.

---

## Notes

- [P] = different files, no dependencies. [Story] maps each task to US1–US4 for traceability.
- Presentation/markup/styling only (constitution I/IV): no new features, data, scoring, routes, or service changes; **0 functional regressions** (existing suites are the backstop).
- Match the design's SPECIFIED source values exactly; verify at review + token/structure assertions — **no pixel-diff** (clarify Q1). Close all High+Medium; Low logged/deferrable (Q2).
- Watch the eager budget (~2 KB headroom): closure is token/class/markup changes — avoid new eager imports; keep GSAP lazy.
- Reduced-motion-safe + no shell parallax preserved throughout. Stop for review before `/speckit-implement` (constitution XV).
