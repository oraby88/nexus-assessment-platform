---
description: "Task list — Post-V1 Readiness (Integration Seam, i18n, Design Fidelity, Performance)"
---

# Tasks: Post-V1 Readiness (Integration Seam, i18n, Design Fidelity, Performance)

**Input**: Design documents from `specs/009-post-v1-readiness/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/{data-source.md,i18n.md}, quickstart.md

**Tests**: INCLUDED — FR-PVR-015 mandates automated checks/tests for all four areas; the plan/quickstart enumerate new suites (`integration-seam`, `i18n`, `motion`, `perf`).

**Scope**: Frontend/mock-only (constitution I). No new product screens/routes. All paths are under `frontend/`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 (P1, seam) · US2 (P2, i18n) · US3 (P2, fidelity/motion) · US4 (P3, perf)
- Exact file paths included in each task.

## Path Conventions

- App source: `frontend/src/` · Build scripts: `frontend/scripts/` · Tests: `frontend/tests/`
- Priority surfaces: `features/auth/index.tsx`, `features/runtime/AssessmentRuntime.tsx`, `features/dashboard/AdminDashboard.tsx`, `features/pages.tsx` (UserDashboard), `features/profile/{MyProfile.tsx,UserProfilePrivacy.tsx}`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish new module/test folders and a recorded baseline; no behavior change.

- [X] T001 Capture the current bundle baseline: run `npm run build` in `frontend/` and record the initial eager `dist/assets/index-*.js` raw + gzip size in `specs/009-post-v1-readiness/quickstart.md` (baseline ~242 KB raw; budget ≤ 260 KB raw / ~85 KB gzip).
- [X] T002 [P] Create the new test folders with a short `README`/index note in `frontend/tests/integration-seam/`, `frontend/tests/i18n/`, `frontend/tests/motion/`, `frontend/tests/perf/`.
- [X] T003 [P] Confirm the Spec 008 baseline gate is green before changes: run `npm run release-gate` in `frontend/` and note the result (regression reference).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared test conventions every new suite depends on. The four user stories are otherwise independent and may proceed in parallel after this phase.

**⚠️ CRITICAL**: Complete before starting US1–US4 test tasks.

- [X] T004 Add a shared deterministic test helper (resets persistence/localStorage + `setMockFailRate(0)` in `beforeEach`) in `frontend/tests/_helpers/reset.ts`, reusable by integration-seam / i18n / motion suites (SC-008).

**Checkpoint**: Foundation ready — US1–US4 can begin (in parallel if staffed).

---

## Phase 3: User Story 1 - Swap-ready backend integration seam (Priority: P1) 🎯 MVP

**Goal**: Every mock service sits behind a typed contract and a single data-source boundary; a runtime `mode` selects `mock` (default) vs a throwing `live` stub; the handoff map is type-checked in sync. No UI/feature code changes when switching modes.

**Independent Test**: `tsc -b` passes (services `satisfies` contracts); `tests/integration-seam` shows `mock` resolves as today and `live` rejects with "not wired in V1" through the same interface; every service has a contract (drift guard); no component/feature imports fixtures/persistence directly.

### Tests for User Story 1 ⚠️ (write first, expect fail)

- [X] T005 [P] [US1] Contract drift test (every exported service name in `src/services/index.ts` has a matching contract interface in `src/services/contracts.ts`) in `frontend/tests/integration-seam/conformance.test.ts`.
- [X] T006 [P] [US1] Mode-switch test (`getMode()` defaults to `mock` and a representative call resolves as today; with `live` selected the same call rejects with `live data source not wired in V1`) in `frontend/tests/integration-seam/mode-switch.test.ts`.
- [X] T007 [P] [US1] Handoff parity test (each contract method maps to an entry in `specs/000-shared/handoff-map.md`) in `frontend/tests/integration-seam/handoff-parity.test.ts`.

### Implementation for User Story 1

- [X] T008 [US1] Create `frontend/src/services/contracts.ts` with one typed interface per exported service (auth, participant, assessment, assessmentDraft, agentDiscovery, adaptation, roleBlueprint, contextProfile, report, comparison, runtime, consent, notification, export, settings, questionBank, activityLog, invitation, assessmentReminder), mirroring today's signatures (data-model.md §Service Contracts).
- [X] T009 [US1] Assert conformance via `satisfies <Contract>` on each mock service export (`src/services/auth/authService.ts`, `participant/participantService.ts`, `questionBank/questionBankService.ts`, `assessment/assessmentService.ts`, `assessmentDraft/assessmentDraftService.ts`, `agentDiscovery/agentDiscoveryService.ts`, `adaptation/adaptationService.ts`, `roleBlueprint/roleBlueprintService.ts`, `contextProfile/contextProfileService.ts`, `report/reportService.ts`, `comparison/comparisonService.ts`, `runtime/runtimeService.ts`, `consent/consentService.ts`, `notification/notificationService.ts`, `export/exportService.ts`, `settings/settingsService.ts`) — compile-time only, no runtime change.
- [X] T010 [P] [US1] Create `frontend/src/services/dataSource.ts` exporting `type DataSourceMode = 'mock' | 'live'`, `getMode()` (default `mock`; env/config override + dev-only localStorage key), and `isLive()` (contracts/data-source.md).
- [X] T011 [P] [US1] Create `frontend/src/services/live/liveStub.ts` — a `live` implementation of the contracts whose every method throws `Error('live data source not wired in V1')`.
- [X] T012 [US1] Route the aggregator through the mode selector in `frontend/src/services/index.ts`: `mock` exports today's services unchanged; `live` exports the stub — preserving the `@/services` import surface (no UI change). Depends on T008, T010, T011.
- [X] T013 [US1] Update `specs/000-shared/handoff-map.md` so every contract method in `contracts.ts` maps to its future API responsibility (keeps T007 green) and note the seam in `specs/000-shared/handoff-map.md` traceability (constitution XIV).
- [X] T014 [US1] Extend the import-boundary guard to also walk `src/features/` (not just `src/components/`) in `frontend/tests/unit/import-boundary.test.ts` — confirms no feature module imports `@/mocks` or `@/services/persistence` directly (SC-001).

**Checkpoint**: US1 fully functional — contracts enforced, mode switch needs 0 UI changes, mock is default, boundary guarded.

---

## Phase 4: User Story 2 - Internationalization & localization (Priority: P2)

**Goal**: A lightweight in-house keyed catalog (`en` + RTL `ar`) behind `LocaleProvider` + `useT()` + a persisted locale store; priority surfaces externalize copy; missing keys fall back to default locale; dates/numbers format per locale; layout tolerates RTL.

**Independent Test**: `tests/i18n` shows locale switch updates copy + persists, missing key falls back (no raw key/blank), RTL sets `document.dir==='rtl'` with surface still rendering, and `formatDate`/`formatNumber` are locale-correct. Switching language in Profile re-renders priority surfaces translated.

### Tests for User Story 2 ⚠️ (write first, expect fail)

- [X] T015 [P] [US2] Locale switch + persistence test (setLocale updates rendered copy; persisted versioned key restores on remount) in `frontend/tests/i18n/switch-persist.test.ts`.
- [X] T016 [P] [US2] Fallback test (missing key returns DEFAULT_LOCALE value, never a raw key or blank) in `frontend/tests/i18n/fallback.test.ts`.
- [X] T017 [P] [US2] RTL + formatting test (`ar` sets `document.documentElement.dir==='rtl'`/`lang`; a priority surface still renders key controls; `formatDate`/`formatNumber` produce locale-correct output) in `frontend/tests/i18n/rtl-format.test.ts`.

### Implementation for User Story 2

- [X] T018 [P] [US2] Create `frontend/src/i18n/catalog.ts`: `type Locale = 'en' | 'ar'`, `DEFAULT_LOCALE='en'`, `RTL_LOCALES=['ar']`, and `catalog: Record<Locale, Record<MessageKey,string>>` with namespaced keys (`auth.*`, `runtime.*`, `dashboard.*`, `profile.*`).
- [X] T019 [P] [US2] Add a versioned `localeStore` (mirroring `themeStore`) with a new `StorageKeys.locale` in `frontend/src/services/persistence.ts`.
- [X] T020 [US2] Create `frontend/src/i18n/useT.ts` exporting `useT()` → `{ t, locale, dir, formatDate, formatNumber, setLocale }`: `t(key, vars?)` looks up active locale, interpolates `{var}`, falls back to DEFAULT_LOCALE on miss; `formatDate`/`formatNumber` use built-in `Intl`. Depends on T018, T019.
- [X] T021 [US2] Create `frontend/src/i18n/LocaleProvider.tsx` (context provider; reads/persists active locale via `localeStore`; sets `document.documentElement.dir`/`lang` on change). Depends on T019, T020.
- [X] T022 [US2] Mount `LocaleProvider` once in `frontend/src/App.tsx` (wrap inside `ThemeProvider`) and re-export the locale hook from `frontend/src/providers/index.tsx` + `frontend/src/hooks/index.ts`. Depends on T021.
- [X] T023 [P] [US2] Retrofit auth/recovery copy with `useT()` in `frontend/src/features/auth/index.tsx` (no hard-coded display strings; add keys to `catalog.ts`). Depends on T020.
- [X] T024 [P] [US2] Retrofit assessment runtime copy with `useT()` in `frontend/src/features/runtime/AssessmentRuntime.tsx` (+ `ProgressRail.tsx`, `SaveIndicator.tsx`). Depends on T020.
- [X] T025 [P] [US2] Retrofit Admin dashboard copy with `useT()` in `frontend/src/features/dashboard/AdminDashboard.tsx`. Depends on T020.
- [X] T026 [P] [US2] Retrofit User dashboard copy with `useT()` in `frontend/src/features/pages.tsx` (UserDashboard). Depends on T020.
- [X] T027 [P] [US2] Retrofit Profile & Privacy copy with `useT()` in `frontend/src/features/profile/MyProfile.tsx` and `frontend/src/features/profile/UserProfilePrivacy.tsx`. Depends on T020.
- [X] T028 [US2] Add a language selector wired to `setLocale` in the Profile surface (`frontend/src/features/profile/MyProfile.tsx`), reusing the existing preference UI pattern. Depends on T022, T027.
- [X] T029 [US2] Mirror the few directional inline styles on the retrofitted priority surfaces for RTL (logical CSS where feasible; exempt inherently directional charts/icons) across the files touched in T023–T027.

**Checkpoint**: US2 works independently — language switch persists, fallback safe, RTL mirrored, locale formatting correct.

---

## Phase 5: User Story 3 - Design fidelity & signature motion (Priority: P2)

**Goal**: Priority surfaces match `project/` tokens/typography/spacing/theming within the fidelity bar; signature motion communicates state, is skippable/non-blocking, and degrades to instant under `prefers-reduced-motion` (no shell parallax).

**Independent Test**: `tests/motion` shows signature motion degrades to instant under reduced-motion on priority surfaces and the shell has no parallax; review confirms token/typography/theming parity vs `project/`.

### Tests for User Story 3 ⚠️ (write first, expect fail)

- [X] T030 [P] [US3] Reduced-motion degradation test (with `prefers-reduced-motion: reduce`, signature motion on a priority surface renders instant/opacity — e.g. CountUp shows final value, reveal transitions skipped) in `frontend/tests/motion/reduced-motion.test.tsx`.
- [X] T031 [P] [US3] Shell no-parallax assertion (the app shell/layout uses no parallax/transform-on-scroll) in `frontend/tests/motion/no-parallax.test.ts`.

### Implementation for User Story 3

- [X] T032 [US3] Token/typography/spacing/theming fidelity pass on priority surfaces against `project/`: reconcile deviations in the CSS-variable token layer / component CSS modules for `features/auth`, `features/runtime`, `features/dashboard/AdminDashboard.tsx`, `features/pages.tsx`, `features/profile/*` (no new surfaces). Record deviations fixed in `specs/009-post-v1-readiness/quickstart.md`.
- [X] T033 [US3] Audit signature motion on priority surfaces (reveal/CountUp/transitions): ensure each is purposeful, skippable/non-blocking, and gated on `useReducedMotion()`; fix any that block interaction or ignore the preference, across the relevant `features/*` components.
- [X] T034 [US3] Confirm/repair reduced-motion degradation so it satisfies T030–T031 (degrade to instant/opacity; remove any shell parallax) in the affected component CSS/TSX.

**Checkpoint**: US3 complete — fidelity bar met, motion purposeful + reduced-motion-safe, no shell parallax.

---

## Phase 6: User Story 4 - Performance & bundle optimization (Priority: P3)

**Goal**: Initial eager chunk ≤ 260 KB raw (~85 KB gzip) enforced post-build; heavy routes/assets (incl. governed bank) are lazy chunks; priority flows free of re-render/long-task jank.

**Independent Test**: `npm run build && npm run check:bundle` passes the budget; `tests/perf` confirms the governed bank + feature routes are separate lazy chunks; `release-gate` (extended) is green.

### Tests for User Story 4 ⚠️ (write first, expect fail)

- [X] T035 [P] [US4] Lazy-chunk presence test (governed bank loaded via dynamic import; router code-splits feature screens) extending the Spec 008 check in `frontend/tests/perf/lazy-chunks.test.ts`.

### Implementation for User Story 4

- [X] T036 [US4] Create `frontend/scripts/check-bundle.mjs`: after `vite build`, sum the initial eager entry `dist/assets/index-*.js` chunk(s) (excluding lazy chunks), gzip-size via `node:zlib`, and exit non-zero if raw > 266240 bytes (260 KB) — report raw + gzip (research D7).
- [X] T037 [US4] Wire scripts in `frontend/package.json`: add `"check:bundle": "node scripts/check-bundle.mjs"` and extend `release-gate` to append `&& vite build && node scripts/check-bundle.mjs` (single fail-fast gate). Depends on T036.
- [X] T038 [US4] Verify/repair lazy-loading of heavy routes & assets so the budget holds: confirm the governed bank and heavy feature routes remain dynamic-import/`React.lazy` chunks (no static pull into the entry) in `frontend/src/router.tsx` and `frontend/src/services/questionBank/questionBankService.ts`; fix any eager import that breaches the budget.
- [X] T039 [US4] Scan priority flows (auth → runtime → dashboards) for avoidable re-render loops / long blocking tasks and apply targeted memoization/split where needed (FR-PVR-014); record findings in `specs/009-post-v1-readiness/quickstart.md`.

**Checkpoint**: US4 complete — budget enforced in the gate, heavy assets lazy, priority flows smooth.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across all stories.

- [X] T040 [P] Update `specs/000-shared/handoff-map.md` and `CLAUDE.md` notes to reflect the seam, i18n module, and bundle gate (traceability XIV).
- [X] T041 Run the full extended gate `npm run release-gate` (incl. `check:bundle`) in `frontend/` and confirm green (SC-008).
- [X] T042 Execute `specs/009-post-v1-readiness/quickstart.md` story validations (US1–US4) and run `npm run test` three times to confirm deterministic, 0-network results (SC-008).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: After Setup — provides the shared test helper (T004) used by US1–US3 suites.
- **User Stories (Phase 3–6)**: After Foundational. US1/US2/US3/US4 are mutually independent and can run in parallel.
- **Polish (Phase 7)**: After all targeted stories complete.

### User Story Dependencies

- **US1 (P1)**: Independent. MVP — delivers the swap-ready seam alone.
- **US2 (P2)**: Independent of US1/US3/US4.
- **US3 (P2)**: Independent; touches some of the same `features/*` files US2 retrofits — coordinate if run concurrently.
- **US4 (P3)**: Independent; its budget check (T037) is reflected in the shared `release-gate` consumed by Polish.

### Within Each Story

- Tests first (expect fail) → implementation. Models/types before providers/services before retrofits. RTL/styling (T029, T034) after the copy/motion they depend on.

### Parallel Opportunities

- Setup: T002, T003 in parallel.
- US1: T005/T006/T007 (tests) parallel; T010/T011 parallel; T008 before T009/T012.
- US2: T015/T016/T017 (tests) parallel; T018/T019 parallel; retrofits T023–T027 parallel after T020.
- US3: T030/T031 parallel.
- US4: T035 independent of T036.
- After Foundational, US1–US4 can be staffed concurrently (mind the US2/US3 shared-file overlap on `features/*`).

---

## Parallel Example: User Story 1

```bash
# Tests (write first, expect fail):
Task: "Contract drift test in frontend/tests/integration-seam/conformance.test.ts"   # T005
Task: "Mode-switch test in frontend/tests/integration-seam/mode-switch.test.ts"       # T006
Task: "Handoff parity test in frontend/tests/integration-seam/handoff-parity.test.ts" # T007

# Independent implementation files:
Task: "Create frontend/src/services/dataSource.ts"     # T010
Task: "Create frontend/src/services/live/liveStub.ts"  # T011
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1 Setup → Phase 2 Foundational.
2. Phase 3 (US1): contracts + data-source boundary + `live` stub + aggregator routing + boundary guard.
3. **STOP & VALIDATE**: `tsc -b` green; `tests/integration-seam` green; mode switch needs 0 UI changes; mock default.
4. Demo the swap-ready seam.

### Incremental Delivery

1. Setup + Foundational → ready.
2. US1 (seam) → validate → ship (MVP).
3. US2 (i18n) → validate → ship.
4. US3 (fidelity/motion) → validate → ship.
5. US4 (perf budget) → validate → extend the gate → ship.

### Parallel Team Strategy

After Foundational: Dev A → US1, Dev B → US2, Dev C → US3, Dev D → US4. US2 and US3 coordinate on shared `features/*` files. Polish (T040–T042) runs once all targeted stories land.

---

## Notes

- [P] = different files, no dependencies. [Story] maps each task to US1–US4 for traceability.
- Frontend/mock-only throughout (constitution I): `live` is a throwing stub, i18n adds no runtime dependency, no real network/auth/persistence.
- New tests reset state + `setMockFailRate(0)` (T004) to stay deterministic (SC-008).
- Stop at any checkpoint to validate a story independently. Do not start `/speckit-implement` before review (constitution XV).
