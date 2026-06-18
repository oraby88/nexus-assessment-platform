---
description: "Task list — Foundation and Design System (Spec 001)"
---

# Tasks: Foundation and Design System

**Input**: Design documents in `specs/001-foundation-design-system/` (`plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`). Shared canon: `specs/000-shared/*`. Constitution: `.specify/memory/constitution.md` (v2.0.0).

**Tech**: Vite + React 18 + TypeScript (strict) + React Router; CSS-variable tokens + CSS Modules; GSAP; Vitest + React Testing Library + axe. Mock services only — no backend. App root: `frontend/`.

**Tests**: Included (targeted, not full TDD-first) — the constitution and `plan.md` mandate unit tests for governance, the `item_bank` provenance test, and a11y/reduced-motion checks; `spec.md` Success Criteria reference them directly.

**Story map**: US1 = role-separated shells & guards (P1, MVP) · US2 = design-faithful themeable accessible UI substrate (P2) · US3 = service-only data boundary with mock persistence (P3) · US4 = governed bank & governance helpers (P3).

**Format**: `- [ ] [TaskID] [P?] [Story?] Description with path` — `[P]` = parallelizable (different files, no blocking dep); `[US#]` only on user-story phases.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and structure.

- [X] T001 Initialize the frontend app (Vite + React 18 + TypeScript **strict**) in `frontend/` with `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- [X] T002 [P] Configure ESLint + Prettier in `frontend/.eslintrc.cjs` and `frontend/.prettierrc`
- [X] T003 [P] Configure Vitest + React Testing Library + axe in `frontend/vitest.config.ts` and `frontend/src/test/setup.ts`
- [X] T004 [P] Add npm scripts (`dev`, `build`, `test`, `test:a11y`, `lint`, `convert:bank`) to `frontend/package.json`
- [X] T005 Create source folder structure per plan: `frontend/src/{styles,components/{ui,charts,motion,layout},services/governance,models,mocks,hooks,lib,providers}` and `frontend/{scripts,tests/{unit,component}}`

**Checkpoint**: App scaffold builds and `npm run dev` serves a blank page.

---

## Phase 2: Foundational (Blocking Prerequisites) — BLOCKS ALL USER STORIES

**Purpose**: The universal substrate every story needs (types, tokens, base hooks, providers, bootstrap).

**⚠️ CRITICAL**: No user-story work may begin until this phase is complete.

- [X] T006 [P] Author TS models + enums from `data-model.md` (shared inventory) in `frontend/src/models/` — governance fields `Readonly`; no fabricated `weight`/`difficulty` (FR-FND-016)
- [X] T007 [P] Author foundation substrate types (`ThemePreference`, `PersistedEnvelope<T>`, `AsyncState<T>`, `AppError`, `HttpSimConfig`, `NavItem`, `GovernanceDecision`, `Toast`) in `frontend/src/models/foundation.ts` (data-model §2)
- [X] T008 [P] Port Claude Design tokens to `frontend/src/styles/tokens.css` (light + `[data-theme=dark]`) and base/utilities/keyframes in `frontend/src/styles/globals.css` (FR-FND-003)
- [X] T009 [P] Typed token mirror for charts in `frontend/src/styles/theme.ts` (FR-FND-003)
- [X] T010 [P] Base hooks `useAsync`, `useViewport` (mobile<700/tablet<1040), `useReducedMotion` in `frontend/src/hooks/` (FR-FND-018)
- [X] T011 Provider scaffolds `ThemeProvider`, `ToastProvider`, `SessionProvider` in `frontend/src/providers/` — `SessionProvider` exposes an injectable session (default `null`) so guards/components are testable before `authService` lands
- [X] T012 App bootstrap `frontend/src/main.tsx` + `frontend/src/App.tsx` mounting providers + app-wide `ErrorBoundary` (FR-FND-011, partial)

**Checkpoint**: Types compile under `strict`; tokens load in both themes; providers mount; app renders an empty themed page.

---

## Phase 3: User Story 1 — Role-separated, guarded application shell (Priority: P1) 🎯 MVP

**Goal**: Boot two separated role shells with full-bleed mode and role-based route guards; protected/cross-role access is correctly redirected or denied with no other-role data rendered.

**Independent Test**: With a mocked `SessionProvider`, open `/admin/*` and `/app/*` logged out, as Admin, and as User → each lands on the correct entry point, allowed shell, or `/access-denied`; the other role's chrome/data never renders (quickstart #1–2, SC-001).

### Tests for User Story 1

- [X] T013 [P] [US1] Component test for guard behavior in `frontend/tests/component/guards.test.tsx` (no-session → `/login` & `/invitation`; wrong-role → `/access-denied`; no other-role chrome) (SC-001)

### Implementation for User Story 1

- [X] T014 [P] [US1] Implement `AdminShell`, `UserShell`, `FullBleedShell`, `PublicShell` in `frontend/src/components/layout/` (FR-FND-001; contracts/shells-routing.md)
- [X] T015 [P] [US1] Define Admin (13) + User (7) navigation registries as `NavItem[]` in `frontend/src/components/layout/navRegistry.ts` (FR-FND-001)
- [X] T016 [US1] Build the route tree with lazy route loading + `Suspense`/`Skeleton` fallback, reserving all public/auth/admin/user routes, in `frontend/src/router.tsx` (FR-FND-001, FR-FND-014 partial; contracts/shells-routing.md)
- [X] T017 [US1] Implement role guards + `/access-denied` reading `SessionProvider`, in `frontend/src/components/layout/RouteGuard.tsx` and wired in `frontend/src/router.tsx` (FR-FND-002)
- [X] T018 [US1] Implement `Sidebar` (off-canvas < 1040px via `useViewport`) + `TopBar` with active-route highlighting in `frontend/src/components/layout/` (FR-FND-002, FR-FND-018)

**Checkpoint**: Both shells boot and guard correctly with mocked sessions — MVP demoable.

---

## Phase 4: User Story 2 — Design-faithful, themeable, accessible UI substrate (Priority: P2)

**Goal**: One shared set of design-faithful, accessible building blocks (components, charts, motion) with light/dark theming that persists with no flash and defaults to OS preference; all motion honors reduced-motion.

**Independent Test**: Render a sample page with shared components/charts in both themes; toggle + reload → persists, no flash, defaults to system when unset; enable reduced-motion → animations degrade; navigate by keyboard with visible focus and focus-trapped modals (quickstart #3–5,12–13; SC-002/003/008).

### Tests for User Story 2

- [X] T019 [P] [US2] Component test for theme persistence, no-flash, and system default in `frontend/tests/component/theme.test.tsx` (SC-002)
- [X] T020 [P] [US2] Accessibility + reduced-motion test (axe on sample shell + modal; motion degrades to instant/opacity) in `frontend/tests/component/a11y-motion.test.tsx` (SC-003, SC-008)

### Implementation for User Story 2

- [X] T021 [US2] Pre-paint theme script in `frontend/index.html` (apply stored `nexus_theme`, else `prefers-color-scheme`) + `useTheme` hook in `frontend/src/hooks/useTheme.ts` (FR-FND-004; research D1)
- [X] T022 [P] [US2] Implement the UI component library in `frontend/src/components/ui/` (Button, IconButton, Card, Modal, Drawer, Popover, Menu, Tabs, Field, TextArea, Select, Slider, SegmentedControl, Toggle, Checkbox, RadioGroup, StatusBadge, Chip, ConfidenceChip, TrustBadge, Avatar, ScoreBar, Ring, CountUp, Tooltip, EmptyState, Skeleton, DataTable, FilterBar, SearchInput, Stepper, Toast, Timeline) (FR-FND-005)
- [X] T023 [P] [US2] Implement chart primitives with accessible text alternatives in `frontend/src/components/charts/` (Gauge, ContextRadar, FitRadar, DimensionBars, CoverageBars, ContextSignature) (FR-FND-006)
- [X] T024 [P] [US2] Implement motion primitives wrapped by `useReducedMotion` in `frontend/src/components/motion/` (PageFX, SectionReveal, StaggerRows, CountUp, ChipCreate); no shell parallax (FR-FND-007)
- [X] T025 [P] [US2] Implement a11y utilities `useFocusTrap` (modal/drawer + Esc), aria-live wiring in `ToastProvider`, focus-visible tokens, chart text-equivalents in `frontend/src/hooks/` + `frontend/src/providers/` (FR-FND-015)
- [X] T026 [P] [US2] Implement `OfflineBanner` (simulated connectivity) + retry surfaces bound to `AppError.retryable` in `frontend/src/components/layout/` (FR-FND-011)

**Checkpoint**: Sample page renders design-faithfully in both themes, keyboard-operable, reduced-motion-safe — US1 + US2 both work.

---

## Phase 5: User Story 3 — Service-only data boundary with mock persistence (Priority: P3)

**Goal**: All screens get data via typed `Promise` services with loading/error/empty/success states; mock auth, simulated network, and namespaced versioned persistence exist; no component reads fixtures/persistence directly.

**Independent Test**: A sample page loads via a service Promise (loading→success); forcing the mock error shows retry; reload restores persisted state; a version bump discards stale state; grep finds zero direct fixture/persistence imports in components (quickstart #6–7,11; SC-004).

### Tests for User Story 3

- [X] T027 [P] [US3] Unit tests for `http.ts` (latency + injectable error) and `persistence.ts` (versioned; discard-on-mismatch) in `frontend/tests/unit/infra.test.ts` (SC-004; persistence edge case)
- [X] T028 [P] [US3] Unit test for `authService` session lifecycle (Admin login, invitation activation, user login, getSession/logout) in `frontend/tests/unit/auth.test.ts`
- [X] T029 [P] [US3] Import-boundary test asserting no component imports fixtures/persistence directly in `frontend/tests/unit/import-boundary.test.ts` (SC-004)

### Implementation for User Story 3

- [X] T030 [US3] Implement the mock HTTP latency/error simulator in `frontend/src/services/http.ts` (FR-FND-008; contracts/infra-services.md)
- [X] T031 [P] [US3] Implement namespaced, versioned `persistence.ts` (discard stale entry on version mismatch) in `frontend/src/services/persistence.ts` (FR-FND-009; research D2)
- [X] T032 [US3] Implement `authService` (`loginAdmin`, `activateInvitation`, `loginUser`, `getSession`, `logout`, `requestReset`) and wire it into `SessionProvider`, in `frontend/src/services/authService.ts` (FR-FND-010; contracts/infra-services.md)
- [X] T033 [P] [US3] Declare typed feature-service stub interfaces mirroring `000-shared/handoff-map.md` in `frontend/src/services/*.ts` (FR-FND-013; contracts/infra-services.md)
- [X] T034 [P] [US3] Author centralized, decoupled fixtures in `frontend/src/mocks/fixtures.ts` (1 org, 1 Admin, ≥8 Participants, blueprints, contexts, drafts, assignments, invitations, reminders, reports spanning confidence bands + ≥1 omitted/blocked section, notifications, exports, activity events) (FR-FND-017)
- [X] T035 [US3] Build a sample service-driven page proving the seam (loading→success via `useAsync`, error→retry) in `frontend/src/components/SampleServiceView.tsx` (SC-004)

**Checkpoint**: Data flows only through services; persistence recovers and safely resets — US1–US3 work.

---

## Phase 6: User Story 4 — Governed question bank & governance-display helpers (Priority: P3)

**Goal**: Convert `item_bank` to a committed typed module preserving source metadata exactly, code-split out of the initial chunk; provide unit-tested governance helpers applied consistently downstream.

**Independent Test**: Provenance test confirms exact metadata and no fabricated fields; build chunk analysis shows the bank excluded from the initial chunk; governance helpers pass unit tests across eligible/blocked/quarantine/low-confidence/restricted cases and user-safe stripping (quickstart #8–10; SC-005/006/007).

### Tests for User Story 4

- [X] T036 [P] [US4] Unit tests for governance helpers (eligibility, confidence band/visibility, use-case gate, visibility engine, `toUserSafe`) in `frontend/tests/unit/governance.test.ts` (SC-007)
- [X] T037 [P] [US4] `item_bank` source-provenance test (every source field preserved; no `weight`/`difficulty`) in `frontend/tests/unit/bank-provenance.test.ts` (SC-006)

### Implementation for User Story 4

- [X] T038 [US4] Implement governance helpers in `frontend/src/services/governance/{eligibility,confidenceGate,useCaseGate,visibilityEngine,toUserSafe}.ts` per `000-shared/status-models.md` (FR-FND-012; contracts/infra-services.md)
- [X] T039 [US4] Implement the build/prep-time converter `frontend/scripts/convert-item-bank.ts` (+ helper `frontend/src/mocks/import-bank.ts`) producing committed typed `frontend/src/mocks/governed-bank.ts` (full 543 items, all metadata; blocked/pilot/quarantine included) (FR-FND-014; research D3)
- [X] T040 [US4] Implement `questionBankService` loading `governed-bank.ts` via dynamic `import()` so it is code-split out of the initial chunk, in `frontend/src/services/questionBankService.ts` (FR-FND-014)

**Checkpoint**: All four foundation stories independently functional and tested.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verification across stories.

- [X] T041 [P] Verify production build chunk analysis confirms the governed bank is excluded from the initial chunk (`npm run build`; quickstart #8)
- [X] T042 [P] Run all `quickstart.md` validation scenarios (1–13) and record results
- [X] T043 [P] Add short component/usage notes for UI primitives and the service seam in `frontend/src/components/README.md` and `frontend/src/services/README.md`
- [X] T044 Final constitution compliance pass (services-only boundary, item metadata immutability, a11y + reduced-motion, two-role separation, no fabricated fields)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies — start immediately.
- **Foundational (Phase 2)**: depends on Setup — **BLOCKS all user stories**.
- **User Stories (Phases 3–6)**: all depend on Foundational completion.
  - Recommended order is priority order (US1 → US2 → US3 → US4).
  - US1 is testable immediately via the injectable `SessionProvider`; **US3's `authService` (T032) replaces the mock session** to make guards real end-to-end (a one-line wiring integration, not a blocker for US1's independent test).
- **Polish (Phase 7)**: depends on the desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: after Foundational. Independently testable with a mocked session. No dependency on US2–US4.
- **US2 (P2)**: after Foundational. Independent; renders against shells from US1 but its tests use a sample page.
- **US3 (P3)**: after Foundational. Independent; completes real session wiring for US1 (enhancement, not prerequisite).
- **US4 (P3)**: after Foundational. Depends on US3 only for the `http`/service pattern; governance helpers + provenance are otherwise self-contained.

### Within Each User Story

- Tests (where included) are written to fail first, then implementation.
- Types/models → providers → shells/services → integration.

### Parallel Opportunities

- Setup: T002, T003, T004 in parallel.
- Foundational: T006–T010 in parallel (distinct files); T011 then T012.
- US1: T013 (test) ∥ T014, T015; then T016 → T017 → T018.
- US2: T019, T020 (tests) ∥; T022–T026 in parallel after T021.
- US3: T027–T029 (tests) ∥; T031, T033, T034 ∥ alongside T030 → T032 → T035.
- US4: T036, T037 (tests) ∥; T038 ∥ T039 → T040.
- Once Foundational is done, US1–US4 can be staffed in parallel by different developers.

---

## Parallel Example: User Story 2

```bash
# Tests for US2 together:
Task: "Theme persistence/no-flash/system-default test in frontend/tests/component/theme.test.tsx"
Task: "A11y + reduced-motion test in frontend/tests/component/a11y-motion.test.tsx"

# After T021, build the substrate in parallel:
Task: "UI component library in frontend/src/components/ui/"
Task: "Chart primitives in frontend/src/components/charts/"
Task: "Motion primitives in frontend/src/components/motion/"
Task: "A11y utilities in frontend/src/hooks/ + frontend/src/providers/"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1 Setup → 2. Phase 2 Foundational (CRITICAL — blocks all) → 3. Phase 3 US1 → 4. **STOP and VALIDATE**: guard behavior with mocked sessions (SC-001) → demo the two-role skeleton.

### Incremental Delivery

1. Setup + Foundational → substrate ready.
2. US1 → role-separated guarded shells (MVP).
3. US2 → design-faithful, themeable, accessible UI.
4. US3 → service/persistence boundary + real auth wiring.
5. US4 → governed bank + governance helpers.
   Each story adds value without breaking earlier ones.

### Parallel Team Strategy

After Foundational: Dev A → US1, Dev B → US2, Dev C → US3, Dev D → US4; integrate US3's auth wiring into US1 when both land.

---

## Notes

- `[P]` = different files, no blocking dependency.
- `[US#]` maps each task to a spec.md user story for traceability.
- Each user story is independently completable and testable; verify tests fail before implementing.
- Commit after each task or logical group; stop at any checkpoint to validate independently.
- Avoid: components importing fixtures/persistence directly, mutating `ItemBankItem` metadata, fabricating `weight`/`difficulty`, parallax in the shell.
