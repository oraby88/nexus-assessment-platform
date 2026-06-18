---
description: "Task list — Signature Set-Pieces (Landing, Companion, Transform Sequence)"
---

# Tasks: Signature Set-Pieces (Landing, Companion, Transform Sequence)

**Input**: Design documents from `specs/011-signature-set-pieces/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/{companion.md,transform-sequence.md,gsap-loader.md}, quickstart.md

**Tests**: INCLUDED — FR-SSP-014 requires the release gate green; the plan/quickstart enumerate suites (`tests/companion`, `tests/landing`, `tests/create-assessment`, `tests/perf`).

**Scope**: Frontend/mock-only (constitution I). Delivers the three cinematics deferred by Spec 010 (FR-025). GSAP lazy-loaded by the Landing + Transform Sequence ONLY (companion is CSS-only); ≤260 KB eager budget holds; no parallax anywhere (XII). All paths under `frontend/`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 (P1, cinematic landing) · US2 (P2, Nex companion) · US3 (P3, transform sequence)
- Exact file paths included in each task.

## Path Conventions

- GSAP loader: `frontend/src/lib/gsap.ts` · Companion: `frontend/src/components/companion/` · Shells: `frontend/src/components/layout/index.tsx` · Landing: `frontend/src/features/auth/index.tsx` + `frontend/src/features/landing/` · Sequence: `frontend/src/features/create-assessment/` · Persistence: `frontend/src/services/persistence.ts` · Styles: `frontend/src/styles/globals.css` · Tests: `frontend/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the lazy GSAP seam and test scaffolding; record a baseline. No behavior change.

- [X] T001 Create `frontend/src/lib/gsap.ts` exporting `loadGsap = () => import('gsap')` (lazy chunk; consumed only by the Landing + Transform Sequence, motion-allowed path only) — contracts/gsap-loader.md.
- [X] T002 [P] Create the new test folders with a one-line README in `frontend/tests/companion/`, `frontend/tests/landing/`, `frontend/tests/create-assessment/`.
- [X] T003 [P] Capture the bundle baseline: run `npm run build` then `npm run check:bundle` in `frontend/` and note the initial eager JS size in `specs/011-signature-set-pieces/quickstart.md` (regression reference; budget ≤ 260 KB raw).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Enforce the budget rule the Landing + Transform Sequence depend on. (The three stories are otherwise independent.)

- [X] T004 Add a GSAP-lazy static guard to `frontend/tests/perf/gsap-lazy.test.ts`: assert no source file uses a top-level `import ... from 'gsap'` (only `import('gsap')` via `lib/gsap.ts`), so GSAP can never enter the eager chunk (FR-SSP-012). Reuse the deterministic helper `tests/_helpers/reset.ts`.

**Checkpoint**: GSAP-lazy rule guarded — US1/US2/US3 can proceed (independently).

---

## Phase 3: User Story 1 - Cinematic Landing (Priority: P1) 🎯 MVP

**Goal**: Replace the minimal landing with the `project/` cinematic hero + signature entrance motion, keeping the sign-in / invitation CTAs; skippable; reduced-motion → complete static page.

**Independent Test**: Open `/`; the cinematic landing matches `project/` in both themes; the CTAs route correctly; with reduced-motion the page is complete + static; `tests/landing` passes.

### Tests for User Story 1 ⚠️ (write first, expect fail)

- [X] T005 [P] [US1] Landing test — renders the cinematic landing, preserves the sign-in (`/login`) and invitation (`/invitation`) CTAs, and under reduced-motion applies no entrance animation (static, CTAs present) — in `frontend/tests/landing/cinematic-landing.test.tsx`.

### Implementation for User Story 1

- [X] T006 [US1] Create `frontend/src/features/landing/CinematicLanding.tsx` — the `project/app/landing.jsx` hero + signature entrance motion via `loadGsap()` (lazy, motion-allowed path only); reduced-motion → complete static final state; keeps the existing i18n copy and the two entry CTAs. Depends on T001.
- [X] T007 [US1] Update the `Landing` export in `frontend/src/features/auth/index.tsx` to render `CinematicLanding` (preserving the `/login` and `/invitation` navigation), so the `PublicShell` `/` route shows the cinematic landing with no route change. Depends on T006.

**Checkpoint**: US1 done — cinematic landing live, CTAs intact, reduced-motion-safe.

---

## Phase 4: User Story 2 - Nex Robot Companion (Priority: P2)

**Goal**: A persistent in-app guide (Admin + User shells) with per-page hints; on by default, dismissible + persisted; announced once per page via a polite live region; never focus-trapping; gentle CSS float (no parallax); reduced-motion-safe.

**Independent Test**: Sign in → companion shows the page hint, auto-collapses, re-opens; navigate → hint updates; dismiss → stays dismissed across reload; absent on public/auth; keyboard-operable + no focus trap; reduced-motion → no float; `tests/companion` passes.

### Tests for User Story 2 ⚠️ (write first, expect fail)

- [X] T008 [P] [US2] Companion test — default-on (no stored pref → visible with hint), per-route hint via `hintForPath`, dismiss hides it and `companionStore.get().enabled===false`, a fresh mount stays dismissed, hint carried by a polite `aria-live` region, no focus trap, reduced-motion → no float style — in `frontend/tests/companion/companion.test.tsx`.

### Implementation for User Story 2

- [X] T009 [P] [US2] Add a versioned `companionStore` (`{ enabled: boolean }`, default `true`) with `StorageKeys.companion = 'nexus_companion_v1'` + `SchemaVersions.companion = 1` in `frontend/src/services/persistence.ts` (mirrors `themeStore`/`localeStore`).
- [X] T010 [P] [US2] Add a gentle `nx-float` keyframe (resting state == final, reduced-motion-safe) to `frontend/src/styles/globals.css` for the companion's contained float/hop — no parallax (pointer/scroll depth).
- [X] T011 [P] [US2] Create `frontend/src/components/companion/hints.ts` — the per-route hint map (display copy ported from `project/app/robot_companion.jsx`) + `hintForPath(pathname)` with a generic fallback (no restricted content, constitution IX). Scope the map to the covered surfaces (standard Admin/User pages); do NOT include entries for the full-bleed Create-Assessment/Runtime or public routes (the companion never mounts there).
- [X] T012 [US2] Create `frontend/src/components/companion/RobotCompanion.tsx` — avatar + hint bubble that shows on page entry then auto-collapses to a re-openable avatar; reads `useLocation()` → `hintForPath`; announces the hint once per page via a polite live region; dismiss/re-enable via `companionStore`; keyboard-operable buttons, never traps focus, decorative art `aria-hidden`; gentle `nx-float` (gated on `useReducedMotion`), no parallax. Depends on T009, T010, T011.
- [X] T013 [US2] Mount `<RobotCompanion/>` once in the shared `Shell` in `frontend/src/components/layout/index.tsx` (covers Admin + User shells; NOT `FullBleedShell`/`PublicShell`). Depends on T012.

**Checkpoint**: US2 done — companion live across in-app pages, accessible, persisted, reduced-motion-safe, no parallax.

---

## Phase 5: User Story 3 - Discovery → Assessment Transform Sequence (Priority: P3)

**Goal**: After the Create-Assessment discovery interview, an animated governed-assembly sequence (answers→requirements→dimensions→governed questions→assembled) plays at the assembly→review transition; skippable in one action; reduced-motion fallback reaches review; governed copy, no restricted content.

**Independent Test**: Complete discovery → sequence plays its phases and ends on review; Skip reaches review in one action with no data loss; reduced-motion → brief non-animated fallback still reaches review; copy says questions come from the validated bank; `tests/create-assessment` passes.

### Tests for User Story 3 ⚠️ (write first, expect fail)

- [X] T014 [P] [US3] Transform-sequence test — renders the phase labels and calls `onDone` (reaches review); Skip calls `onDone` in one action; reduced-motion path calls `onDone` via the non-animated fallback (no GSAP load); governed copy present and a leak-guard finds no score/restricted terms — in `frontend/tests/create-assessment/transform-sequence.test.tsx`.

### Implementation for User Story 3

- [X] T015 [US3] Create `frontend/src/features/create-assessment/TransformSequence.tsx` — phases answers→requirements→dimensions→governed questions→assembled via `loadGsap()` (lazy); `onDone()` advances; Skip control + Esc → `onDone` immediately (no data loss); reduced-motion OR GSAP-not-loaded → brief non-animated hold then `onDone`; copy states questions are from the validated bank (never invented), no restricted/internal content (constitution IX). Depends on T001.
- [X] T016 [US3] Trigger `TransformSequence` as an overlay at the assembly→review transition in `frontend/src/features/create-assessment/CreateAssessmentWizard.tsx` (after discovery/question assembly, before the review/`SUCCESS_STEP`); `onDone` advances to review. Depends on T015.

**Checkpoint**: US3 done — governed-assembly sequence plays, skippable, reduced-motion-safe, safe copy.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Budget/lazy-chunk verification, RTL/scope checks, and the final gate.

- [X] T017 [P] Extend `frontend/tests/perf/gsap-lazy.test.ts` (or `lazy-chunks.test.ts`) with a build-output assertion that, after `vite build`, GSAP appears in a **separate** chunk and is NOT in the eager `index-*.js` (complements the static guard from T004).
- [X] T018 Run the full `npm run release-gate` (incl. `check:bundle`) in `frontend/` and confirm the initial eager JS is still ≤ 260 KB (GSAP lazy) and all gates are green (SC-005/006).
- [X] T019 [P] Verify the companion is absent on the full-bleed Create-Assessment + Assessment Runtime and public/auth/landing routes, and present on the standard Admin/User pages; and that RTL is correct (companion docks inline-end; the sequence's directional motion mirrors); record the checks in `specs/011-signature-set-pieces/quickstart.md`.
- [X] T020 Execute the `specs/011-signature-set-pieces/quickstart.md` story validations, re-run the Spec 009 reduced-motion + no-shell-parallax suites (confirm the companion adds no parallax), and record a fidelity-review note comparing the three set-pieces to `project/` (SC-001/004).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately. T001 (GSAP loader) gates US1 + US3.
- **Foundational (Phase 2)**: After Setup — T004 guards the GSAP-lazy rule.
- **User Stories (Phases 3–5)**: US1/US2/US3 are mutually independent and can run in parallel (US1 + US3 need T001; US2 is fully independent — CSS-only, no GSAP).
- **Polish (Phase 6)**: After the targeted stories complete.

### User Story Dependencies

- **US1 (P1)**: Needs the GSAP loader (T001). MVP — the cleanest, most self-contained set-piece.
- **US2 (P2)**: Fully independent (no GSAP). Internal order: store/keyframe/hints (T009–T011) → component (T012) → mount (T013).
- **US3 (P3)**: Needs the GSAP loader (T001). Internal order: component (T015) → wizard trigger (T016).

### Within Each Story

- Tests first (expect fail) → implementation. Companion: store/keyframe/hints before the component before the mount. Landing: component before the auth-Landing wiring. Sequence: component before the wizard trigger.

### Parallel Opportunities

- Setup: T002, T003 in parallel.
- US2 internals T009/T010/T011 in parallel (different files) before T012.
- After Setup, US1/US2/US3 can be staffed concurrently (mostly distinct files; only US1+US3 share `lib/gsap.ts`, already created in T001).

---

## Parallel Example: User Story 2

```bash
# Test first (expect fail):
Task: "Companion test in frontend/tests/companion/companion.test.tsx"   # T008
# Independent internals (parallel):
Task: "companionStore in frontend/src/services/persistence.ts"           # T009
Task: "nx-float keyframe in frontend/src/styles/globals.css"             # T010
Task: "hints map in frontend/src/components/companion/hints.ts"          # T011
# Then sequentially:
Task: "RobotCompanion.tsx"                                               # T012
Task: "Mount in shared Shell (layout/index.tsx)"                         # T013
```

---

## Implementation Strategy

### MVP First

1. Phase 1 Setup (GSAP loader) → Phase 2 Foundational (lazy guard).
2. US1 (Cinematic Landing) — the most self-contained, highest first-impression value; ship it.
3. **STOP & VALIDATE**: cinematic landing matches `project/`, CTAs work, reduced-motion static, gate + bundle green (GSAP lazy).

### Incremental Delivery

1. Setup + Foundational → ready.
2. US1 → validate → ship (MVP).
3. US2 (Companion) → validate → ship. 4. US3 (Transform Sequence) → validate → ship.
4. Each set-piece adds value without breaking the others.

### Parallel Team Strategy

After Setup: Dev A → US1, Dev B → US2 (independent, CSS-only), Dev C → US3. Stories touch mostly distinct files; US1+US3 share only the (already-created) `lib/gsap.ts`. Polish (T017–T020) runs once stories land.

---

## Notes

- [P] = different files, no dependencies. [Story] maps each task to US1–US3 for traceability.
- Frontend/mock-only throughout (constitution I): no backend/network; GSAP lazy (not eager); companion CSS-only.
- No parallax anywhere (FR-SSP-006 / constitution XII); reduced-motion → final/static; sequence skippable; companion non-focus-trapping + polite live region.
- Fonts/keyframe additions and GSAP are separate from the eager JS chunk — the ≤260 KB budget (Spec 009 `check-bundle`) is enforced by T018.
- Stop for review before `/speckit-implement` (constitution XV).
