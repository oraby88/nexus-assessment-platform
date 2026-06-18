---
description: "Task list — Design Fidelity & Signature Motion (foundation)"
---

# Tasks: Design Fidelity & Signature Motion

**Input**: Design documents from `specs/010-design-fidelity-motion/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/{typography.md,motion.md}, quickstart.md

**Tests**: INCLUDED — FR-024/SC-006 require the release gate green and the plan/quickstart enumerate suites (`tests/typography`, `tests/motion`, `tests/charts`).

**Scope**: Frontend/mock-only (constitution I). No new product screens/routes/data. Cinematic set-pieces (Landing, Robot Companion, Transform Sequence) are OUT of scope (FR-025). All paths under `frontend/`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 (P1, typography) · US2 (P1, entrance reveals) · US3 (P2, chart motion) · US4 (P3, micro-interactions)
- Exact file paths included in each task.

## Path Conventions

- Styles: `frontend/src/styles/` · Motion: `frontend/src/components/motion/index.tsx` · Charts: `frontend/src/components/charts/index.tsx` · Shells: `frontend/src/components/layout/index.tsx` · Primitives: `frontend/src/components/ui/primitives.tsx` · Entry: `frontend/src/main.tsx` · Tests: `frontend/tests/`
- High-value screens (stagger): `features/dashboard/AdminDashboard.tsx`, `features/reports/AdminReport.tsx`, `features/reports/user/UserReport.tsx`, `features/users/UsersList.tsx`, `features/assessments/AssessmentsList.tsx`, `features/reports/ReportsList.tsx`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the offline font source and test scaffolding; record a baseline. No behavior change.

- [X] T001 Add the self-hosted font packages `@fontsource/schibsted-grotesk`, `@fontsource/hanken-grotesk`, `@fontsource/jetbrains-mono` to `devDependencies` in `frontend/package.json` and install (offline woff2 assets; no CDN/runtime dep).
- [X] T002 [P] Create the new test folders with a one-line README in `frontend/tests/typography/`, `frontend/tests/motion/`, `frontend/tests/charts/`.
- [X] T003 [P] Capture the bundle baseline: run `npm run build` then `npm run check:bundle` in `frontend/` and note the initial eager JS size in `specs/010-design-fidelity-motion/quickstart.md` (regression reference; budget ≤ 260 KB raw).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Complete the shared motion vocabulary and primitives that US2, US3, and US4 build on. (US1 typography depends only on Setup and may proceed in parallel with this phase.)

**⚠️ CRITICAL**: Complete before starting US2/US3/US4.

- [X] T004 Complete the signature keyframe vocabulary in `frontend/src/styles/globals.css` — add `fadeIn`, `scaleIn`, `slideInRight`, `barGrow`, `pulse`, `typing`, `ringDraw`, `checkPop`, `floatUp`, `rowIn`, `spin` (the design's 13 minus the existing `nx-fade-up`/`nx-shimmer`); each keyframe's resting state MUST equal its completed state so reduced-motion shows the final visual (FR-006). Keep the global `@media (prefers-reduced-motion: reduce)` rule authoritative.
- [X] T005 Extend the motion primitives in `frontend/src/components/motion/index.tsx`: add `RouteReveal` (entrance keyed to `useLocation().pathname`, re-fires on route change), `ScaleIn`, `SlideIn` (direction mirrors under RTL), `CheckPop`; and cap `StaggerRows` so only the first 10 children stagger (index ≥ 10 → delay 0). All gate on `useReducedMotion()` and are non-blocking. Depends on T004.

**Checkpoint**: Motion foundation ready — US2/US3/US4 can begin.

---

## Phase 3: User Story 1 - Brand typography (Priority: P1) 🎯 MVP

**Goal**: Every screen renders in the brand typefaces (Schibsted Grotesk display, Hanken Grotesk UI, JetBrains Mono mono) in both themes, fully offline, with graceful fallback.

**Independent Test**: Load any route offline; a heading/body/mono element resolves to the brand family (not a system fallback) in light and dark; `tests/typography` passes.

### Tests for User Story 1 ⚠️ (write first, expect fail)

- [X] T006 [P] [US1] Brand-font resolution + graceful-fallback test (a rendered heading/body/mono element's declared `font-family` begins with the brand family; no external font request) in `frontend/tests/typography/brand-fonts.test.tsx`.

### Implementation for User Story 1

- [X] T007 [US1] Create `frontend/src/styles/fonts.css` importing the `@fontsource` per-weight stylesheets — Schibsted Grotesk 400/500/600/700/800, Hanken Grotesk 400/500/600/700, JetBrains Mono 400/500/600 — relying on `font-display: swap` (contracts/typography.md). Depends on T001.
- [X] T008 [US1] Import `./styles/fonts.css` in `frontend/src/main.tsx` (before `./styles/globals.css`) so families resolve app-wide; leave `frontend/src/styles/tokens.css` family declarations unchanged (fallback stacks stay). Depends on T007.

**Checkpoint**: US1 done — brand type everywhere, offline, both themes.

---

## Phase 4: User Story 2 - Entrance reveals app-wide (Priority: P1)

**Goal**: Every routed screen plays one short entrance reveal (re-firing per navigation) via the shells; high-value screens stagger their first ~10 rows. All reduced-motion-safe; no shell parallax.

**Independent Test**: Navigate across admin/user routes → each screen reveals and re-fires on route change; high-value lists stagger ≤10 rows; reduced-motion applies no animation; `tests/motion` passes.

### Tests for User Story 2 ⚠️ (write first, expect fail)

- [X] T009 [P] [US2] `RouteReveal` test — applies an entrance on mount, re-fires on pathname change, and applies no animation under reduced-motion — in `frontend/tests/motion/route-reveal.test.tsx`.
- [X] T010 [P] [US2] `StaggerRows` cap test — at most the first 10 children stagger; the 11th+ have zero delay — in `frontend/tests/motion/stagger-cap.test.tsx`.

### Implementation for User Story 2

- [X] T011 [US2] Wrap `<Outlet/>` with `RouteReveal` in all four shells (`AdminShell`, `UserShell`, `FullBleedShell`, `PublicShell`) in `frontend/src/components/layout/index.tsx` so all routed screens reveal consistently (FR-009/010). Depends on T005.
- [X] T012 [P] [US2] Add section/row stagger (`StaggerRows`/`SectionReveal`) to `frontend/src/features/dashboard/AdminDashboard.tsx`. Depends on T005.
- [X] T013 [P] [US2] Add section/row stagger to `frontend/src/features/reports/AdminReport.tsx`. Depends on T005.
- [X] T014 [P] [US2] Add section/row stagger to `frontend/src/features/reports/user/UserReport.tsx`. Depends on T005.
- [X] T015 [P] [US2] Add row stagger to the list in `frontend/src/features/users/UsersList.tsx`. Depends on T005.
- [X] T016 [P] [US2] Add row stagger to the list in `frontend/src/features/assessments/AssessmentsList.tsx`. Depends on T005.
- [X] T017 [P] [US2] Add row stagger to the list in `frontend/src/features/reports/ReportsList.tsx`. Depends on T005.

**Checkpoint**: US2 done — consistent, bounded, reduced-motion-safe reveals across the app.

---

## Phase 5: User Story 3 - Chart motion (Priority: P2)

**Goal**: Report charts animate on entrance (gauge draws + counts up, bars grow with bounded stagger, radar/signature scale-fade), each resolving to the exact final state under reduced-motion with `aria-label`s preserved.

**Independent Test**: Open a report → gauge arc draws + number counts up, bars grow, radar/signature reveal; with reduced-motion charts show final shapes/values instantly (no zero/blank frame); edge values 0/100/missing correct; `tests/charts` passes.

### Tests for User Story 3 ⚠️ (write first, expect fail)

- [X] T018 [P] [US3] Chart motion test — under reduced-motion `Gauge`/bars/radar render their final shape & value with no zero/blank start frame and keep their `aria-label`; edge values 0/100/missing render correctly — in `frontend/tests/charts/chart-motion.test.tsx`.

### Implementation for User Story 3 (same file — sequential)

- [X] T019 [US3] Animate `Gauge` in `frontend/src/components/charts/index.tsx`: arc draws via `ringDraw` (stroke-dashoffset full→target) + central number via `CountUp`; reduced-motion → full arc + final number instantly. Depends on T004.
- [X] T020 [US3] Animate `DimensionBars` and `CoverageBars` in `frontend/src/components/charts/index.tsx`: bars grow from baseline (`barGrow`/width) with bounded per-bar stagger; reduced-motion → final widths, no stagger. Depends on T019 (same file).
- [X] T021 [US3] Animate `ContextRadar`/`FitRadar`/`ContextSignature` in `frontend/src/components/charts/index.tsx`: shape `scaleIn`/`fadeIn` entrance; reduced-motion → final shape instantly. Depends on T020 (same file).

**Checkpoint**: US3 done — charts animate; reduced-motion-safe final state; accessible alternatives intact.

---

## Phase 6: User Story 4 - Micro-interactions & loading (Priority: P3)

**Goal**: Consistent hover/press feedback on shared primitives and brand-timed skeleton shimmer, with keyboard focus visible independent of motion settings.

**Independent Test**: Hover/press buttons and cards → consistent subtle feedback; focus via keyboard → visible focus ring regardless of motion; loading → skeletons shimmer in brand timing.

### Tests for User Story 4 ⚠️ (write first, expect fail)

- [X] T022 [P] [US4] Micro-interaction test — a focused control shows a visible focus indicator even under reduced-motion, and hover/press feedback is present — in `frontend/tests/motion/micro-interactions.test.tsx`.

### Implementation for User Story 4 (same file — sequential)

- [X] T023 [US4] Add consistent hover/press feedback to `Button` and `Card` (transform/shadow per `nx-lift`) in `frontend/src/components/ui/primitives.tsx`; keep the focus-visible indicator independent of motion settings (FR-020).
- [X] T024 [US4] Align the `Skeleton` shimmer to the design's brand timing/colors (`nx-shimmer`) in `frontend/src/components/ui/primitives.tsx`; suppress under reduced-motion while preserving the placeholder. Depends on T023 (same file).

**Checkpoint**: US4 done — tactile feedback, visible focus, brand shimmer.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: RTL/perf verification and the final gate.

- [X] T025 [P] Verify directional motion (`SlideIn`/sequence flow) mirrors correctly under an RTL locale on a priority surface (no clipping) (FR-026 / SC-009); record the check in `specs/010-design-fidelity-motion/quickstart.md`.
- [X] T026 Run the full `npm run release-gate` (incl. `check:bundle`) in `frontend/` and confirm the initial eager JS is still ≤ 260 KB and all gates are green (SC-006/007).
- [X] T027 Execute the `specs/010-design-fidelity-motion/quickstart.md` story validations, re-run the Spec 009 reduced-motion + no-shell-parallax suites, and record a fidelity-review note comparing the priority surfaces to `project/` (SC-001/003/008).
- [X] T028 [P] Confirm the out-of-scope set-pieces (Landing cinematic, Robot Companion, Transform Sequence) were not implemented and the motion-primitive seams remain reusable by them (FR-025).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: After Setup — T004 (keyframes) → T005 (primitives). Blocks US2/US3/US4.
- **US1 (Phase 3)**: After Setup only (independent of Foundational) — may run in parallel with Phase 2.
- **US2/US3/US4 (Phases 4–6)**: After Foundational. Independent of each other.
- **Polish (Phase 7)**: After the targeted stories complete.

### User Story Dependencies

- **US1 (P1)**: Independent — needs only the font packages (T001). MVP candidate (minimal).
- **US2 (P1)**: Needs the motion foundation (T004/T005). The true MVP is US1 + US2 (both P1).
- **US3 (P2)**: Needs the keyframes (T004) + existing `CountUp`. Independent of US1/US2/US4.
- **US4 (P3)**: Largely `primitives.tsx`-local; independent of US1–US3.

### Within Each Story

- Tests first (expect fail) → implementation. Shell wiring (T011) before per-screen stagger. Chart tasks (T019→T021) and micro-interaction tasks (T023→T024) are same-file sequential.

### Parallel Opportunities

- Setup: T002, T003 in parallel.
- US1 can run in parallel with Phase 2 (different files).
- US2: tests T009/T010 in parallel; per-screen stagger T012–T017 all parallel after T011/T005.
- After Foundational, US2/US3/US4 can be staffed concurrently (different files).

---

## Parallel Example: User Story 2

```bash
# Tests (write first, expect fail):
Task: "RouteReveal test in frontend/tests/motion/route-reveal.test.tsx"   # T009
Task: "StaggerRows cap test in frontend/tests/motion/stagger-cap.test.tsx" # T010

# Per-screen stagger (independent files, after T005 + T011):
Task: "Stagger AdminDashboard"  # T012
Task: "Stagger AdminReport"     # T013
Task: "Stagger UserReport"      # T014
Task: "Stagger UsersList"       # T015
Task: "Stagger AssessmentsList" # T016
Task: "Stagger ReportsList"     # T017
```

---

## Implementation Strategy

### MVP First

1. Phase 1 Setup → Phase 2 Foundational (motion infra).
2. US1 (typography) — the most pervasive, lowest-risk visual fix; ship it.
3. US2 (entrance reveals) — completes the P1 MVP (both P1 stories).
4. **STOP & VALIDATE**: brand type everywhere offline; consistent reduced-motion-safe reveals; gate + bundle green.

### Incremental Delivery

1. Setup + Foundational → ready.
2. US1 → validate → ship. 3. US2 → validate → ship (P1 MVP complete).
3. US3 (chart motion) → validate → ship. 4. US4 (micro-interactions) → validate → ship.

### Parallel Team Strategy

After Foundational: Dev A → US1 (can start during Setup), Dev B → US2, Dev C → US3, Dev D → US4. Stories touch mostly distinct files; per-screen stagger (T012–T017) parallelizes within US2. Polish (T025–T028) runs once stories land.

---

## Notes

- [P] = different files, no dependencies. [Story] maps each task to US1–US4 for traceability.
- Frontend/mock-only throughout (constitution I): fonts self-hosted/offline, no network, no backend.
- Every keyframe's resting state must equal its completed state so reduced-motion is safe (FR-006); the application shell uses no parallax (FR-022 / constitution XII).
- Fonts are separate cacheable assets — the ≤260 KB initial eager **JS** budget (Spec 009 `check-bundle`) is unaffected; T026 confirms.
- Do NOT implement the cinematic set-pieces (FR-025). Stop for review before `/speckit-implement` (constitution XV).
