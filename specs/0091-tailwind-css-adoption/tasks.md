---

description: "Task list for Tailwind CSS Adoption"
---

# Tasks: Tailwind CSS Adoption

**Input**: Design documents from `specs/0091-tailwind-css-adoption/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/tailwind-theme-contract.md, quickstart.md

**Tests**: No new TDD tests are requested. Parity is verified by manual side-by-side review (SC-003,
clarified decision) and the existing Vitest/RTL/axe suite must remain green. Test tasks below are
therefore validation/gate tasks, not new unit tests.

**Organization**: Tasks grouped by user story. All paths are under `frontend/` unless noted.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 / US2 / US3 from spec.md

## Path Conventions

- Web app frontend at `frontend/` (config at `frontend/`, source at `frontend/src/`).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install Tailwind toolchain and create the (empty) config files it needs.

- [X] T001 Add `tailwindcss@^3.4`, `postcss`, and `autoprefixer` to `devDependencies` in `frontend/package.json`, then run `npm install` in `frontend/`.
- [X] T002 [P] Create `frontend/postcss.config.js` registering the `tailwindcss` and `autoprefixer` plugins (ESM `export default`, per contract C2).
- [X] T003 [P] Create `frontend/tailwind.config.ts` skeleton typed with `satisfies Config`: set `content: ['./index.html', './src/**/*.{ts,tsx}']`, `darkMode: ['selector', '[data-theme="dark"]']`, `corePlugins: { preflight: false }`, empty `theme.extend`, `plugins: []` (contract C1; VR-3/VR-4/VR-5).

**Checkpoint**: Toolchain installed; config files exist but theme is not yet bridged.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Wire the Tailwind CSS layers into the app so utilities are generated at build. Blocks all user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Add `@tailwind base; @tailwind components; @tailwind utilities;` to `frontend/src/styles/globals.css` **after** the existing `@import './tokens.css';` line, leaving all existing reset/typography/`:focus-visible`/reduced-motion/keyframe rules in place below (contract C2; FR-006).
- [X] T005 Verify the dev server (`npm run dev`) and production build (`npm run build`) both succeed in `frontend/` with no PostCSS/Tailwind errors (quickstart Scenario 1; FR-001).

**Checkpoint**: Tailwind is active in the build; utilities resolve (though theme map still pending in US1).

---

## Phase 3: User Story 1 - Tailwind installed and token-aware (Priority: P1) 🎯 MVP

**Goal**: Tailwind utilities resolve to the project's existing design tokens in both light and dark themes, with no visual regression and the bundle within budget.

**Independent Test**: Apply `bg-surface text-text rounded-md` to an element; confirm it renders identically to the equivalent inline `var(--token)` style in both themes, build succeeds, bundle ≤260KB.

### Implementation for User Story 1

- [X] T006 [US1] Add the full color map to `theme.extend.colors` in `frontend/tailwind.config.ts` — every key references `var(--token)` only (no hex/RGB literals): brand `indigo-*`/`teal-*`/`amber-*`/`rose-*`/`violet-600`, neutrals `ink-*`, `shell-*`, surfaces `canvas`/`canvas-2`/`surface`/`surface-2`/`border`/`border-strong`/`track`, text `text`/`text-2`/`text-3`, and `tone-{indigo,teal,amber,rose,slate}-{bg,fg}` (data-model.md Colors table; VR-1, VR-2).
- [X] T007 [US1] Add `theme.extend.borderRadius` (`sm/md/lg/xl` → `var(--r-*)`) and `theme.extend.boxShadow` (`sm/md/lg` → `var(--sh-*)`) in `frontend/tailwind.config.ts` (data-model.md). Same file as T006/T008 — apply sequentially, not in parallel.
- [X] T008 [US1] Add `theme.extend.fontFamily` (`display/ui/mono` → `var(--font-*)`) and `theme.extend.transitionTimingFunction` (`DEFAULT`→`var(--ease)`, `out`→`var(--ease-out)`) in `frontend/tailwind.config.ts` (data-model.md). Same file as T006/T007 — apply sequentially.
- [X] T009 [US1] Verify token resolution: temporarily render `<div className="bg-surface text-text rounded-md shadow-md font-display">` (or inspect via devtools) and confirm computed values equal the corresponding `var(--token)` in light theme (quickstart Scenario 2; FR-002, SC-004). Remove the probe after verifying.
- [X] T010 [US1] Verify dark theme: set `data-theme="dark"` on the document and confirm the same utilities flip to dark token values with **no** `dark:` variant present (quickstart Scenario 3; FR-003).
- [X] T011 [US1] Run `npm run build && npm run check:bundle` in `frontend/`; confirm the initial bundle stays ≤260KB after purge (FR-004, SC-001).

**Checkpoint**: Tailwind is fully token-aware in both themes and within budget — MVP complete and independently demonstrable.

---

## Phase 4: User Story 2 - Reference exemplar proves the pattern (Priority: P2)

**Goal**: The shared UI primitives plus the Auth login screen are migrated from inline styles to Tailwind utilities as the canonical pattern, with zero visual regression.

**Independent Test**: Open the migrated exemplar; manual side-by-side comparison shows identical rendering in light/dark + LTR/RTL; no static inline `style={{}}` remains on the migrated components.

### Implementation for User Story 2

- [X] T012 [US2] Migrate `frontend/src/components/ui/primitives.tsx`: replace static inline `style={{}}` objects with mapped Tailwind utilities per contract C3 (token utilities, logical-property utilities only, no `dark:` for color). Keep genuinely dynamic/computed style values inline.
- [X] T013 [US2] Migrate `frontend/src/components/ui/index.tsx` the same way (contract C3), reusing the patterns established in T012.
- [X] T014 [US2] Migrate the Admin login screen in `frontend/src/features/auth/index.tsx`: convert **only** the `AdminLogin` component plus the shared `AuthScaffold` and module-level `inputStyle` it depends on, to consume the migrated primitives and use Tailwind utilities (contract C3, C4). Leave the file's other exports (`Landing`, `InvitationAccess`, `ForgotPassword`, `ResetPassword`, `AccessDenied`, `NotFound`) unmigrated for coexistence. Note: `AuthScaffold`/`inputStyle` are shared by those exports, so migrating them must not change their rendering (verify in T016/T020).
- [X] T015 [P] [US2] RTL check: run the quickstart Scenario 5 grep over `src/components/ui` and `src/features/auth`; confirm zero physical-direction utilities (`pl-/pr-/ml-/mr-/left-/right-/text-left/text-right`) in the migrated files (FR-005, SC-005).
- [ ] T016 [US2] ⏳ HUMAN SIGN-OFF REQUIRED — Manual visual parity review of the exemplar in all four combinations (light/dark × LTR/RTL) vs. the pre-migration render; confirm zero visual difference and no leftover static inline styles (quickstart Scenario 4; FR-008, SC-003).

**Checkpoint**: Reference exemplar migrated with verified parity — the canonical pattern for follow-up batches exists.

---

## Phase 5: User Story 3 - Governance & conventions documented (Priority: P3)

**Goal**: The constitution and project docs reflect Tailwind as the approved styling system, with documented token/dark/RTL/coexistence conventions.

**Independent Test**: Read the amended constitution and docs; they name Tailwind (replacing CSS Modules), justify the dependency, and state the conventions and the "no new inline styles" policy.

### Implementation for User Story 3

- [X] T017 [US3] Amend `.specify/memory/constitution.md` `§ Stack` via `/speckit-constitution`: replace "CSS Modules" with "Tailwind CSS" and add the dependency justification; record rationale + impact and bump the version per the constitution's amendment rules (FR-009). **Requires human approval (Principle XV).**
- [X] T018 [P] [US3] Update the stack line inside the `<!-- SPECKIT -->` block in `CLAUDE.md` and the stack mention in `frontend/README.md` (if present) to say "Tailwind CSS" instead of "CSS Modules".
- [X] T019 [P] [US3] Document the migration conventions (token utilities, dark variant, RTL logical-utility rule, focus/motion ownership, "no new inline styles" policy) in a short `frontend/src/styles/STYLING.md` (or append to the frontend README), referencing `contracts/tailwind-theme-contract.md` (FR-010).

**Checkpoint**: Governance consistent; conventions discoverable for future contributors.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Confirm coexistence and the full release gate.

- [ ] T020 [P] ⏳ HUMAN SIGN-OFF REQUIRED — Coexistence check: open 2–3 unmigrated screens (e.g. `AdminDashboard`, a runtime renderer) **and at least one unmigrated auth export that reuses the now-migrated `AuthScaffold`/`inputStyle`** (e.g. `ForgotPassword` at `/forgot-password`); confirm all render pixel-identical to before — disabling Preflight, adding Tailwind, and migrating the shared scaffold did not regress them (quickstart Scenario 6; contract C5).
- [X] T021 Run the full release gate in `frontend/`: `npm run release-gate` (`tsc -b && vitest run && eslint && format:check && vite build && check:bundle`) and `npm run test:a11y`; confirm all green (quickstart Scenario 7; FR-011).
- [~] T022 (automated scenarios 1-3,5,7 done; visual scenarios 4,6 need human sign-off) Run through `quickstart.md` end-to-end (all 7 scenarios) as the final acceptance pass.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately. T002/T003 parallel after T001.
- **Foundational (Phase 2)**: Depends on Setup. T004 needs T002/T003; T005 needs T004. BLOCKS all user stories.
- **US1 (Phase 3)**: Depends on Foundational. The MVP.
- **US2 (Phase 4)**: Depends on US1 (needs the token map to migrate against).
- **US3 (Phase 5)**: Depends on the decision being implemented; T017 (constitution) can proceed in parallel with US2 but should follow US1 conceptually. Independently testable (doc review).
- **Polish (Phase 6)**: Depends on US1 + US2 complete (T020/T021); T022 after all.

### Within Each User Story

- US1: T006/T007/T008 all edit `tailwind.config.ts` and MUST be applied sequentially (not parallel); T006 first (color map), then T007/T008; T009/T010 after the maps exist; T011 last.
- US2: T012 before T013/T014 (establishes the pattern); T015/T016 after migration.
- US3: T017 (needs approval) independent of T018/T019.

### Parallel Opportunities

- Setup: T002 ∥ T003 (different files).
- US1: none — T006/T007/T008 all edit `tailwind.config.ts` (sequential).
- US3: T018 ∥ T019 (different files).
- Polish: T020 ∥ (T021 after migrations).

---

## Parallel Example: Setup

```bash
# T002 and T003 touch different files and can run together:
Task: "Create frontend/postcss.config.js"        # T002
Task: "Create frontend/tailwind.config.ts skeleton"  # T003
```

US1's theme tasks (T006/T007/T008) all edit `tailwind.config.ts`, so they are NOT parallel —
apply them sequentially (or as one coordinated edit).

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1 Setup → 2. Phase 2 Foundational → 3. Phase 3 US1.
4. **STOP and VALIDATE**: token utilities resolve in both themes, bundle ≤260KB.
5. Demo: Tailwind is live and token-aware with zero regression.

### Incremental Delivery

1. Setup + Foundational → Tailwind active.
2. US1 → token bridge (MVP).
3. US2 → reference exemplar migrated + parity verified.
4. US3 → constitution amended + conventions documented.
5. Follow-up batches (separate specs) migrate the remaining ~68 components.

---

## Notes

- [P] = different files, no dependencies. Several US1 tasks share `tailwind.config.ts` — coordinate edits.
- Per Principle XV, STOP for explicit human approval before `/speckit-implement`; the constitution amendment (T017) must be approved as part of that.
- Visual parity is verified by manual review (no screenshot-diff dependency) per the clarified decision.
- Keep `tokens.css` as the single source of truth — no hex literals in `tailwind.config.ts` (VR-2).
- Commit after each task or logical group; do not regress unmigrated screens (contract C5).
