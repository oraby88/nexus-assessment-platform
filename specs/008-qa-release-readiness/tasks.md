---
description: "Task list for QA & Release-Readiness Gates"
---

# Tasks: QA & Release-Readiness Gates

**Input**: Design documents from `specs/008-qa-release-readiness/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/gates.md, contracts/traceability.md, quickstart.md

**Tests**: This feature **is** tests — the deliverables are verification suites plus the aggregate gate. No product/runtime code changes.

**Organization**: Tasks grouped by user story (US1–US5, priority order). App root: `frontend/`. Paths are repo-relative.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1–US5 (Setup/Foundational/Polish have no story label)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the test-only a11y dependency + the gate scripts every story relies on.

- [X] T001 Add `vitest-axe` (and its `axe-core` peer) to `devDependencies` in `frontend/package.json` and install.
- [X] T002 Register `vitest-axe` matchers in `frontend/src/test/setup.ts` (`expect.extend` / `import 'vitest-axe/extend-expect'`) so `toHaveNoViolations()` is available in all suites.
- [X] T003 [P] Add `format:check` and `release-gate` scripts to `frontend/package.json` per contracts/gates.md (release-gate = `tsc -b && vitest run && eslint . --ext .ts,.tsx && npm run format:check && vite build`).
- [X] T004 [P] Create test suite folders `frontend/tests/governance/`, `frontend/tests/a11y/`, `frontend/tests/journeys/`, `frontend/tests/coverage/`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared test helpers used across the verification suites. **No story work begins until this is complete.**

**⚠️ CRITICAL**: Blocks the verification suites.

- [X] T005 Create `frontend/tests/helpers/render.tsx` — a `renderRoute(ui, { path, role })` helper wrapping `MemoryRouter` + `SessionProvider` (seeds session via `writeKey(StorageKeys.session, …)`), plus a `resetAll()` (localStorage.clear + `consentStore.__resetForTest()` + `setMockFailRate(0)`) for deterministic `beforeEach`.

**Checkpoint**: Helpers compile and are importable; suites can proceed.

---

## Phase 3: User Story 1 — Governance invariants provably enforced (Priority: P1) 🎯 MVP

**Goal**: One explicit, passing assertion per NON-NEGOTIABLE invariant, consolidated in one suite.

**Independent Test**: Run `tests/governance`; confirm all 8 invariants assert and pass, and that deliberately breaking one fails the suite.

- [X] T006 [US1] Create `frontend/tests/governance/invariants.test.tsx` covering: (VIII) no live/client score in runtime + User report and source-ID keying; (IX/III) `reportService.getUserSafe` exposes no restricted keys; (XI) blocked Derailment Risk never rendered as data; (X) comparison has no ranking/auto-decision + disclaimer present; (V) governance selection excludes blocked/quarantine/non-operational; (VI) no fabricated weight/difficulty; (IV) no component imports `@/mocks`/persistence (static scan, reuse the `import-boundary` approach). One labelled assertion per invariant (FR-QA-000…008 / SC-001).

**Checkpoint**: 8/8 invariants asserted and green (MVP).

---

## Phase 4: User Story 2 — End-to-end journeys pass (Priority: P1)

**Goal**: The three required journeys complete on mocks with expected artifacts, no dead ends.

**Independent Test**: Run `tests/journeys`; each journey transitions through its steps and produces its mock artifact.

- [X] T007 [P] [US2] Create `frontend/tests/journeys/admin-developmental.test.tsx` — drive add-user → create-assessment (draft → selection → adaptation → coverage → approve → send) → assignment exists → report retrievable → user-safe preview → PDF export-history entry (FR-QA-009).
- [X] T008 [P] [US2] Create `frontend/tests/journeys/admin-hiring.test.tsx` — hiring-support variant: validated blueprint + context profile + Domain 6 present + Candidate Comparison renders with no automatic decision/ranking (FR-QA-009/004).
- [X] T009 [P] [US2] Create `frontend/tests/journeys/user.test.tsx` — invitation/activate → overview → consent gate → instructions → answer all five question types → pause → reload restore → submit → completion; assert no live score (FR-QA-009/001).

**Checkpoint**: 3/3 journeys green (SC-002).

---

## Phase 5: User Story 3 — Accessibility & motion conformance (Priority: P1)

**Goal**: Zero critical axe violations + keyboard + reduced-motion on the four priority flows.

**Independent Test**: Run `tests/a11y` (or `npm run test:a11y`); zero critical violations; keyboard reachable; motion degrades under reduced-motion.

- [X] T010 [P] [US3] Create `frontend/tests/a11y/auth-recovery.a11y.test.tsx` — axe on AdminLogin/ForgotPassword/ResetPassword + keyboard reachability/focus-visible (FR-QA-010/011).
- [X] T011 [P] [US3] Create `frontend/tests/a11y/runtime.a11y.test.tsx` — axe on `AssessmentRuntime` rendering each of the five question types; ≥44px targets; keyboard-operable options (FR-QA-010/011/014).
- [X] T012 [P] [US3] Create `frontend/tests/a11y/reports.a11y.test.tsx` — axe on `UserReport` + `AdminReport` (no critical violations) (FR-QA-010).
- [X] T013 [P] [US3] Create `frontend/tests/a11y/motion.a11y.test.tsx` — assert reduced-motion degrades signature motion to instant/opacity and never blocks (extends `a11y-motion` coverage) (FR-QA-011).

**Checkpoint**: 0 critical violations across priority flows (SC-003/004).

---

## Phase 6: User Story 4 — Route / state / responsive coverage (Priority: P2)

**Goal**: Every route renders with shell/guard/title; cataloged screens show in-language empty/loading/error; priority surfaces usable mobile↔desktop.

**Independent Test**: Run `tests/coverage`; route audit passes; forced empty/error render in-language states; breakpoints exercised.

- [X] T014 [P] [US4] Create `frontend/tests/coverage/routes.test.tsx` — assert every path in the route map resolves to a guarded element with a title (no missing routes; correct shell/guard) (FR-QA-012).
- [X] T015 [P] [US4] Create `frontend/tests/coverage/states.test.tsx` — for a representative screen set, force empty (no data) and error (`setMockFailRate(1)`) and assert in-language empty/error states with a path forward; loading shows a skeleton (FR-QA-013).
- [X] T016 [P] [US4] Create `frontend/tests/coverage/responsive.test.tsx` — exercise `useViewport` breakpoints (mock `innerWidth`) on priority surfaces; assert mobile + desktop render without overflow/blank (FR-QA-014).

**Checkpoint**: Route/state/responsive coverage green (SC-005).

---

## Phase 7: User Story 5 — Performance, traceability & the release gate (Priority: P2)

**Goal**: Performance guardrails verified; traceability documented; the single aggregate gate runs green.

**Independent Test**: Build shows the governed-bank lazy chunk; traceability doc maps every spec→gate; `npm run release-gate` reports a single clear pass/fail.

- [X] T017 [P] [US5] Create `frontend/tests/coverage/performance.test.ts` — assert no component imports `@/mocks`/persistence (consolidate/extend `import-boundary`) and that `questionBankService` loads the bank via dynamic import (FR-QA-015/008).
- [X] T018 [US5] Finalize `specs/008-qa-release-readiness/contracts/traceability.md` against the delivered tests (every spec 001–008 → key requirement → verifying gate); refresh shared canon currency notes in `specs/000-shared/{traceability-matrix.md,testing-notes.md}` (FR-QA-016 / SC-007).
- [X] T019 [US5] Verify the `release-gate` script runs all gates fail-fast and attributes failures (FR-QA-017 / SC-008): run it green, then temporarily break one assertion to confirm the failure surfaces, then restore.

**Checkpoint**: All five stories green; release gate runnable.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Determinism + final green gate.

- [X] T020 [P] Determinism check — run `npm run test` three times; confirm identical results (0 flakes) and no real network requests (SC-009); fix any timing-dependent assertion.
- [X] T021 Run `npm run release-gate` from `frontend/` and confirm a single green result (tsc → tests → lint → format-check → build); mark every task `[X]`.
- [X] T022 Run `specs/008-qa-release-readiness/quickstart.md` story validation end-to-end.

---

## Dependencies & Execution Order

### Phase dependencies
- **Setup (P1)** → no deps (T001/T002 before any axe suite; T003 before T019/T021).
- **Foundational (P2)** → after Setup; the render helper (T005) blocks the suites.
- **US1–US5 (P3–P7)** → after Foundational. US1/US2/US3 are independent P1s; US4/US5 (P2) build on the catalog. US5's traceability (T018) depends on the other suites existing.
- **Polish (P8)** → after all suites.

### Within each story
- Suites are independent files → highly parallel once the helper (T005) exists.

### Parallel opportunities
- Setup: T003, T004 `[P]`.
- US2 journeys T007–T009 all `[P]`; US3 a11y T010–T013 all `[P]`; US4 coverage T014–T016 `[P]`; US5 T017 `[P]`.

---

## Parallel Example: User Story 3 (a11y)

```bash
Task: "auth-recovery.a11y.test.tsx"   # T010
Task: "runtime.a11y.test.tsx"         # T011
Task: "reports.a11y.test.tsx"         # T012
Task: "motion.a11y.test.tsx"          # T013
```

---

## Implementation Strategy

### MVP First (US1)
1. Phase 1 Setup → 2. Phase 2 Foundational → 3. Phase 3 US1 (governance invariants) → **STOP & validate** (8/8 invariants green) → the core safety net is in place.

### Incremental delivery
US1 (governance, MVP) → US2 (journeys) → US3 (a11y) → US4 (route/state coverage) → US5 (perf/traceability/gate) → Polish (determinism + green release-gate). Keep the whole suite green at every checkpoint.

---

## Notes
- `[P]` = different files, no incomplete-task dependency.
- Verification-only — **no `src/` feature changes**; if a suite reveals a real defect, fix it minimally in the owning spec's code and note it.
- `vitest-axe` is a test-only dependency (constitution: accessibility via axe).
- Determinism is mandatory — reset state + `setMockFailRate(0)` in `beforeEach`; no real time/random in assertions.
- Run all gates from `frontend/`.
