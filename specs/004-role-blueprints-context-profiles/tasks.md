---
description: "Task list — Role Blueprints & Context Profiles (Spec 004)"
---

# Tasks: Role Blueprints and Context Profiles

**Input**: Design documents in `specs/004-role-blueprints-context-profiles/` (`plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`). Builds on implemented Spec 001; consumed by Specs 003/005. Shared canon: `specs/000-shared/*`. Constitution: `.specify/memory/constitution.md` (v2.0.0).

**Tech**: Vite + React 18 + TypeScript (strict) + React Router; foundation UI/charts (ContextRadar/ContextSignature/DimensionBars)/hooks; Vitest + React Testing Library. Mock services only — no backend. App root: `frontend/`.

**Tests**: Included — `spec.md` Success Criteria require tests for lifecycle/Validated-gate, dimension cycling, dimension-catalog derivation, live signature, linking, and versioning.

**Story map**: US1 = Role Blueprints (P1) · US2 = Context Profiles (P1) · US3 = Blueprint↔Context link (P2) · US4 = Versioning (P2).

**Format**: `- [ ] [TaskID] [P?] [Story?] Description with path` — `[P]` = parallelizable (different files, no blocking dep); `[US#]` only on user-story phases.

---

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 [P] Create feature folders `frontend/src/features/{blueprints,contexts}/` and service folders `frontend/src/services/{roleBlueprint,contextProfile}/`
- [X] T002 [P] Extend models in `frontend/src/models/entities.ts` to the full field set: `RoleBlueprint` (responsibilities, work context, success/failure/non-negotiables, required/optional/excluded dimension IDs, `DimensionImportance[]`, evidence, versionHistory), `ContextProfile` + `ContextProfileValues`, `VersionEntry`, `DimensionImportance`, `DimensionCatalogEntry`, `ContextSignatureData` (per `data-model.md`; keep existing fixtures valid)

**Checkpoint**: Types compile under `strict`; existing fixtures still satisfy required fields.

---

## Phase 2: Foundational (Blocking Prerequisites) — BLOCKS US1

**Purpose**: The dimension catalog the blueprint builder needs.

- [X] T003 Implement `dimensionCatalog()` deriving distinct `{dimensionId,dimensionName,domainId}` from the governed `item_bank` (via `questionBankService`) in `frontend/src/lib/dimensions.ts` (research D2)
- [X] T004 [P] Unit test for `dimensionCatalog` (deduped, sorted, real IDs; excludes nothing fabricated) in `frontend/tests/unit/dimensions.test.ts`

**Checkpoint**: A real, deduped dimension catalog is available to the builder.

---

## Phase 3: User Story 1 — Create and manage Role Blueprints (Priority: P1) 🎯 MVP

**Goal**: Build a Role Blueprint (steps + dimension required/optional/excluded + importance), manage it via list/detail with free-form lifecycle (Validated = Hiring-Support gate; Archived terminal).

**Independent Test**: Run the builder to create a blueprint (cycle a dimension, set importance), save, open detail tabs, change status across values, confirm Archived is terminal and Validated marks the gate (quickstart #1–4; SC-001/002/003).

### Tests for User Story 1

- [X] T005 [P] [US1] Unit test `roleBlueprintService` (create/update/duplicate; `setStatus` free-form + Archived terminal; `versions`; `isEligible` Validated-for-hiring) in `frontend/tests/unit/role-blueprint.test.ts`
- [X] T006 [P] [US1] Component test `BlueprintBuilder` (dimension cycles Required→Optional→Excluded; importance appears for required) in `frontend/tests/component/blueprint-builder.test.tsx`

### Implementation for User Story 1

- [X] T007 [US1] Implement `roleBlueprintService` dedicated file (`list`/`get` + `create`/`update`/`duplicate`/`setStatus`[Archived terminal]/`versions`/`isEligible`) in `frontend/src/services/roleBlueprint/roleBlueprintService.ts` and export from `frontend/src/services/index.ts` (research D1/D7)
- [X] T008 [P] [US1] `BlueprintsList` (columns, search/filter/sort, states, create CTA) in `frontend/src/features/blueprints/BlueprintsList.tsx`
- [X] T009 [US1] `BlueprintBuilder` (multi-step `Stepper`; dimension tri-state from `dimensionCatalog`; importance Low/Moderate/Critical + rationale; review→save with version entry) in `frontend/src/features/blueprints/BlueprintBuilder.tsx`
- [X] T010 [P] [US1] `BlueprintDetail` (tabs Overview/Context/Dimensions/Evidence/Assessment Usage/Version History/Notes; actions incl. preview/edit/duplicate/setStatus/archive) in `frontend/src/features/blueprints/BlueprintDetail.tsx`
- [X] T011 [US1] Wire `/admin/role-blueprints`, `/admin/role-blueprints/new`, `/admin/role-blueprints/:blueprintId` routes (replace placeholders, lazy) in `frontend/src/router.tsx`

**Checkpoint**: Blueprints fully creatable/manageable — MVP demoable; Spec 003 picker can list them.

---

## Phase 4: User Story 2 — Create and manage Context Profiles (Priority: P1)

**Goal**: Visual context builder with a live Context Signature (radar + bars) + plain-language summary; list/detail; lifecycle Draft/Active/Archived.

**Independent Test**: Open the builder, move sliders, see the signature + summary update live, save, open detail (quickstart #5; SC-004).

### Tests for User Story 2

- [X] T012 [P] [US2] Unit test `contextProfileService` (create/update/duplicate/setStatus/versions) in `frontend/tests/unit/context-profile.test.ts`
- [X] T013 [P] [US2] Unit test `contextSignature(values)` derivation (axes + summary; recomputes) in `frontend/tests/unit/context-signature.test.ts`
- [X] T014 [P] [US2] Component test `ContextBuilder` live signature updates on slider change in `frontend/tests/component/context-builder.test.tsx`

### Implementation for User Story 2

- [X] T015 [US2] Implement `contextProfileService` dedicated file (`list`/`get` + `create`/`update`/`duplicate`/`setStatus`/`versions`/`link`) in `frontend/src/services/contextProfile/contextProfileService.ts` and export from `frontend/src/services/index.ts`
- [X] T016 [P] [US2] `contextSignature(values): ContextSignatureData` pure helper in `frontend/src/features/contexts/contextSignature.ts` (research D4)
- [X] T017 [P] [US2] `ContextsList` (columns, search/filter, states, create CTA) in `frontend/src/features/contexts/ContextsList.tsx`
- [X] T018 [US2] `ContextBuilder` (sliders/segmented controls for `ContextProfileValues`; live `ContextRadar` + `DimensionBars` + plain-language summary; save with version entry) in `frontend/src/features/contexts/ContextBuilder.tsx`
- [X] T019 [P] [US2] `ContextDetail` (summary, radar, bars, linked role/blueprint, notes, version history) in `frontend/src/features/contexts/ContextDetail.tsx`
- [X] T020 [US2] Wire `/admin/context-profiles`, `/admin/context-profiles/new`, `/admin/context-profiles/:contextId` routes in `frontend/src/router.tsx`

**Checkpoint**: Context Profiles fully creatable/manageable; Spec 003 picker can list them.

---

## Phase 5: User Story 3 — Link a Blueprint and a Context Profile (Priority: P2)

**Goal**: Two-way link reflected on both records and surfaced into Create Assessment.

**Independent Test**: Link a blueprint to a context; both detail views show the link; the linked context is offered when its blueprint is chosen in Spec 003 (quickstart #6–7; SC-005).

### Tests for User Story 3

- [X] T021 [P] [US3] Unit test two-way link (`roleBlueprintService.link` updates the context; `contextProfileService.link` mirrors) in `frontend/tests/unit/blueprint-context-link.test.ts`

### Implementation for User Story 3

- [X] T022 [US3] Implement reciprocal `link` in `roleBlueprintService` and `contextProfileService` (set `linkedContextProfileId` + `linkedBlueprintId` on both) in their service files (research D6)
- [X] T023 [P] [US3] Link UI — blueprint builder step 7 / detail link control + show link on both `BlueprintDetail` and `ContextDetail` in `frontend/src/features/blueprints/` and `frontend/src/features/contexts/`

**Checkpoint**: Linked pairs travel into Spec 003.

---

## Phase 6: User Story 4 — Version awareness for both objects (Priority: P2)

**Goal**: Each save records a version-history entry, listed newest-first on detail.

**Independent Test**: Edit + save a blueprint and a context; a new version entry appears on each detail (quickstart #8; SC-006).

### Tests for User Story 4

- [X] T024 [P] [US4] Unit test version-history append on update for both services in `frontend/tests/unit/versioning.test.ts`

### Implementation for User Story 4

- [X] T025 [US4] Ensure `update` appends a `VersionEntry` (version, date, summary) in both services and render the Version History tab newest-first in both detail views (`frontend/src/services/{roleBlueprint,contextProfile}/` + `frontend/src/features/{blueprints,contexts}/`)

**Checkpoint**: Versioning visible on both objects; all four stories functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T026 [P] Integration test: Spec 003 pickers list created blueprints/contexts and respect eligibility (Validated gate; Deprecated/Archived excluded) in `frontend/tests/component/picker-integration.test.tsx`
- [X] T027 [P] Run all `quickstart.md` validation scenarios (1–10) and record results
- [X] T028 [P] Update `frontend/src/services/README.md` (blueprint/context services now implemented) and usage notes
- [X] T029 Final gate pass (`tsc -b`, `vitest run`, `vite build`, `eslint`) + constitution compliance (governed dimension source, Validated gate, a11y)

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: depends on Spec 001 — start immediately.
- **Foundational (Phase 2)**: depends on Setup — **BLOCKS US1** (dimension catalog). US2 does not need it.
- **User Stories (Phases 3–6)**: depend on Setup; US1 also on Foundational. Recommended order P1 (US1 → US2) → P2 (US3 → US4).
- **Polish (Phase 7)**: after the desired stories are complete.

### User Story Dependencies
- **US1 (P1)**: after Setup + Foundational. Independent (blueprints).
- **US2 (P1)**: after Setup. Independent (contexts).
- **US3 (P2)**: after US1 + US2 (needs both services' `link`).
- **US4 (P2)**: after US1 + US2 (versioning on both services).

### Within Each User Story
- Tests first (fail), then service, then list/builder/detail, then route wiring.
- `router.tsx` route-wiring (T011, T020) touches one file → serialize.
- `services/index.ts` export edits (T007, T015) touch one file → serialize.

### Parallel Opportunities
- Setup: T001, T002.
- US1: T005, T006 (tests) ∥; T008, T010 ∥ after T007; T009 then T011.
- US2: T012, T013, T014 (tests) ∥; T016, T017, T019 ∥ after T015; T018 then T020.
- After Foundational, US1 and US2 can be staffed in parallel (serialize router + index.ts edits); US3/US4 follow both.

---

## Parallel Example: User Story 2

```bash
# Tests for US2 together:
Task: "contextProfileService unit test in frontend/tests/unit/context-profile.test.ts"
Task: "contextSignature unit test in frontend/tests/unit/context-signature.test.ts"
Task: "ContextBuilder live-signature component test in frontend/tests/component/context-builder.test.tsx"

# After T015 (service), build in parallel:
Task: "contextSignature helper in frontend/src/features/contexts/contextSignature.ts"
Task: "ContextsList in frontend/src/features/contexts/ContextsList.tsx"
Task: "ContextDetail in frontend/src/features/contexts/ContextDetail.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)
Setup → Foundational → US1 → **STOP and VALIDATE**: create a blueprint with dimension importance, manage lifecycle, confirm the Validated gate (SC-001/002/003) → demo.

### Incremental Delivery
1. Setup + Foundational → dimension catalog + models.
2. US1 → Role Blueprints (MVP). 3. US2 → Context Profiles. 4. US3 → linking. 5. US4 → versioning.
Each story adds value without breaking earlier ones; both objects become selectable in Spec 003.

### Parallel Team Strategy
After Foundational: Dev A → US1, Dev B → US2; then US3/US4 once both services exist. Serialize `router.tsx` and `services/index.ts` edits.

---

## Notes
- `[P]` = different files, no blocking dependency; `[US#]` maps to spec.md stories.
- Completes the Spec 001 `roleBlueprintService`/`contextProfileService` stubs; reuses `questionBankService` (dimension catalog) and foundation charts (live signature).
- Governance: dimension catalog derives from the governed `item_bank` (no fabricated dimensions); Validated gate enforced at consumption; lifecycle free-form with Archived terminal.
- Verify tests fail before implementing; commit per task/logical group; stop at any checkpoint to validate.
