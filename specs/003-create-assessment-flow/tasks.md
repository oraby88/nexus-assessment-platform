---
description: "Task list — Signature Create Assessment Flow (Spec 003)"
---

# Tasks: Signature Create Assessment Flow

**Input**: Design documents in `specs/003-create-assessment-flow/` (`plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`). Builds on implemented Specs 001/002. Consumes Spec 004 pickers (fixtures until 004). Shared canon: `specs/000-shared/*`. Constitution: `.specify/memory/constitution.md` (v2.0.0, principles V–IX).

**Tech**: Vite + React 18 + TypeScript (strict) + React Router; foundation UI/charts/motion/hooks; Vitest + React Testing Library. Mock services only — no backend, no live AI. App root: `frontend/`.

**Tests**: Included — governance is NON-NEGOTIABLE; `spec.md` Success Criteria require tests for eligibility, adaptation safeguards, approval gate, send artifacts, coverage, and draft resume.

**Story map**: US1 = end-to-end flow + approval + send (P1, MVP) · US2 = governed selection (P1) · US3 = controlled rephrasing (P1) · US4 = discovery chat (P2) · US5 = coverage review (P2) · US6 = draft save/resume (P2).

**Format**: `- [ ] [TaskID] [P?] [Story?] Description with path` — `[P]` = parallelizable (different files, no blocking dep); `[US#]` only on user-story phases.

---

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 [P] Create feature folders `frontend/src/features/create-assessment/{steps}/` and service folders `frontend/src/services/{assessmentDraft,agentDiscovery,adaptation}/`
- [X] T002 [P] Add flow types (`AssessmentDraft`, `JobRequirementsProfile`, `AgentTurn`, `DiscoveryAnswer`, `SelectedQuestion`, `AdaptedQuestionText`, `DiffSpan`, `CoverageReport`, `CoverageWarning`) to `frontend/src/models/entities.ts` (per `data-model.md`)

**Checkpoint**: Folders + types compile under `strict`.

---

## Phase 2: Foundational (Blocking Prerequisites) — BLOCKS ALL USER STORIES

**Purpose**: The wizard shell + draft skeleton that every step mounts within.

**⚠️ CRITICAL**: No step work can begin until the shell + draft service exist.

- [X] T003 Implement `assessmentDraftService` `create`/`save`/`get` over the versioned persistence store (`nexus_drafts_v1`, discard-on-mismatch) in `frontend/src/services/assessmentDraft/assessmentDraftService.ts` and export from `frontend/src/services/index.ts` (research D6)
- [X] T004 Implement `CreateAssessmentWizard` full-bleed shell — step state via context, progress `Stepper`, draft load/save, per-step "Next" gating — in `frontend/src/features/create-assessment/CreateAssessmentWizard.tsx`
- [X] T005 Wire `/admin/assessments/new` to the wizard (replace `Placeholder`, lazy-load, under `FullBleedShell`) in `frontend/src/router.tsx`

**Checkpoint**: Wizard shell mounts at the route with a working (empty) step sequence + draft persistence.

---

## Phase 3: User Story 1 — Complete the flow and send one tailored assessment (Priority: P1) 🎯 MVP

**Goal**: Navigate the twelve steps for one user, explicitly approve, and send — producing a Not-Started assignment + invitation + timeline + notification + simulated email.

**Independent Test**: From `/admin/assessments/new`, complete the non-deep steps (with stub data for selection/chat), approve, and send → verify artifacts created and the new assignment appears in `/admin/assessments` (quickstart #1–2,10,13; SC-001/006).

### Tests for User Story 1

- [X] T006 [P] [US1] Unit test `assessmentDraftService.approve`/`send` (send requires approval; creates assignment + invitation + notification) in `frontend/tests/unit/assessment-draft.test.ts`
- [X] T007 [P] [US1] Component test wizard happy path (advance steps → approve → Send enabled → success state) in `frontend/tests/component/create-assessment.test.tsx`

### Implementation for User Story 1

- [X] T008 [US1] `Step1SelectUser` (single-user select/inline-add via `participantService`, dup-email guard) + `Step2Purpose` (use case/role/level/sector/description) in `frontend/src/features/create-assessment/steps/`
- [X] T009 [P] [US1] `Step5Blueprint` + `Step6Context` pickers (select via `roleBlueprintService`/`contextProfileService`; create-entry routes to Spec 004) in `frontend/src/features/create-assessment/steps/`
- [X] T010 [US1] `Step10Approval` (explicit approval) + `Step11Deadline` (deadline/reminders/invitation message) + `Step12Review` (final summary, Send) + `SuccessState` in `frontend/src/features/create-assessment/steps/`; Send disabled until `draft.approved`
- [X] T011 [US1] `assessmentDraftService.approve` (set approved) + `send(draft)` (creates Not-Started assignment + invitation + `TimelineEvent` + `AppNotification` w/ sim email via the Spec 002 assessment store) in `frontend/src/services/assessmentDraft/assessmentDraftService.ts` (research D7)

**Checkpoint**: An assessment can be sent end-to-end and appears in Admin Core monitoring — MVP demoable.

---

## Phase 4: User Story 2 — Governed, provenance-rich question selection (Priority: P1)

**Goal**: The Agent auto-proposes an eligible set from `item_bank`; blocked/quarantine/pilot/research are excluded; cards show full provenance + trust badges; no fabricated fields.

**Independent Test**: With a mixed bank, open Step 7; verify only eligible items are proposed/selectable, the card shows source ID/domain/dimension/facet/method/scale/statuses + "Selected From Governed Bank" + "Scoring Logic Locked", and no `weight`/`difficulty` (quickstart #5–6; SC-002/003).

### Tests for User Story 2

- [X] T012 [P] [US2] Unit test `questionBankService.propose` (eligible-only auto set; excludes blocked/quarantine/pilot/research; covers critical dimensions) in `frontend/tests/unit/propose.test.ts`
- [X] T013 [P] [US2] Component test `QuestionCard` provenance (badges shown; no `weight`/`difficulty`) in `frontend/tests/component/selection.test.tsx`

### Implementation for User Story 2

- [X] T014 [US2] Add `questionBankService.propose(profile, jobLevel, useCase)` (filter via `selectEligible`, deterministically cover critical dimensions to a target count) in `frontend/src/services/questionBank/questionBankService.ts` (research D3/D8)
- [X] T015 [P] [US2] `Step7Selection` + `QuestionCard` (provenance-rich card + trust badges; add/remove/replace from the eligible pool) in `frontend/src/features/create-assessment/steps/Step7Selection.tsx` and `frontend/src/features/create-assessment/QuestionCard.tsx`

**Checkpoint**: Selection is governed and provenance-complete.

---

## Phase 5: User Story 3 — Controlled, metadata-preserving rephrasing (Priority: P1)

**Goal**: Display-only rephrasing with a word diff and method-family safeguards; SJT/cognitive verbatim in V1; source metadata immutable.

**Independent Test**: Rephrase a Likert item (text changes + diff, metadata unchanged); attempt SJT + cognitive rephrase (blocked, "Original wording retained"); preview the User view (quickstart #7–8; SC-004).

### Tests for User Story 3

- [X] T016 [P] [US3] Unit test `diffWords` + `adaptationService` (text-only diff; `canAdapt` false for `sjt`/`cognitive_multiple_choice`; metadata unchanged) in `frontend/tests/unit/adaptation.test.ts`

### Implementation for User Story 3

- [X] T017 [US3] Implement dependency-free word diff `diffWords(original, adapted): DiffSpan[]` in `frontend/src/lib/diffWords.ts` (research D5)
- [X] T018 [US3] Implement `adaptationService.adapt`/`canAdapt` (accepts `{itemId, adaptedText}` only; Likert/contextual rephrase; forced-choice light terminology; `sjt`/`cognitive` verbatim with "Original wording retained") in `frontend/src/services/adaptation/adaptationService.ts` and export from `services/index.ts` (research D2)
- [X] T019 [P] [US3] `Step8Rephrase` + `RephrasePanel` (original/adapted/diff, method-policy messaging, locked metadata, User-view preview) in `frontend/src/features/create-assessment/steps/Step8Rephrase.tsx` and `frontend/src/features/create-assessment/RephrasePanel.tsx`

**Checkpoint**: Rephrasing preserves metadata; method safeguards enforced.

---

## Phase 6: User Story 4 — AI Discovery chat with live requirements profile (Priority: P2)

**Goal**: Scripted deterministic chat fills a live requirements panel; answers editable; skippable transition; use-case parameterization.

**Independent Test**: Answer the scripted prompts; verify the requirements panel updates live per answer, prior answers are editable, and the chat→build transition is skippable/reduced-motion-safe (quickstart #3–4; SC-005).

### Tests for User Story 4

- [X] T020 [P] [US4] Unit test `agentDiscoveryService` (deterministic canonical sequence; answers build requirements; use-case parameterization) in `frontend/tests/unit/agent-discovery.test.ts`

### Implementation for User Story 4

- [X] T021 [US4] Implement `agentDiscoveryService.start`/`next`/`summary` (fixed canonical script; map answers → `JobRequirementsProfile`; param by use case) in `frontend/src/services/agentDiscovery/agentDiscoveryService.ts` and export from `services/index.ts` (research D1)
- [X] T022 [P] [US4] `Step3Discovery` (chat + live requirements panel; edit prior answer; "Why?" explainer; skippable transition) + `Step4Requirements` (summary: edit/refine/approve) + `DiscoveryChat` in `frontend/src/features/create-assessment/steps/` and `frontend/src/features/create-assessment/DiscoveryChat.tsx`

**Checkpoint**: Discovery experience works and feeds requirements.

---

## Phase 7: User Story 5 — Coverage review with under-coverage warnings (Priority: P2)

**Goal**: Live coverage map (domain/dimension/requirement/method) with warnings (0 items → warning, 1 → note) that recompute on selection change.

**Independent Test**: On Step 9, remove a required dimension's only item → warning appears; recomputes live (quickstart #9; SC-008).

### Tests for User Story 5

- [X] T023 [P] [US5] Unit test `computeCoverage` (0 → warning, 1 → soft note; recompute) in `frontend/tests/unit/coverage.test.ts`

### Implementation for User Story 5

- [X] T024 [US5] Implement `computeCoverage(selected, profile): CoverageReport` (domain/dimension/requirement/method + estimated duration + warnings per D4) in `frontend/src/features/create-assessment/coverage.ts`
- [X] T025 [P] [US5] `Step9Coverage` + `CoverageMap` (live bars + warnings, recompute on change) in `frontend/src/features/create-assessment/steps/Step9Coverage.tsx` and `frontend/src/features/create-assessment/CoverageMap.tsx`

**Checkpoint**: Coverage feedback is live and actionable.

---

## Phase 8: User Story 6 — Draft save and resume (Priority: P2)

**Goal**: Leave mid-flow and resume at the saved step with inputs intact.

**Independent Test**: Partially complete, save, leave, return → resumes at the saved step with prior inputs (quickstart #11; SC-007).

### Tests for User Story 6

- [X] T026 [P] [US6] Unit test draft persistence/resume (`save` then `get` restores step + inputs; version-mismatch discard) in `frontend/tests/unit/draft-resume.test.ts`

### Implementation for User Story 6

- [X] T027 [US6] Add save-draft control + resume-from-`currentStep` wiring (persist selected user/answers/selections/step) in `frontend/src/features/create-assessment/CreateAssessmentWizard.tsx`

**Checkpoint**: Draft recovery works; all six stories functional.

---

## Phase 9: Polish & Cross-Cutting Concerns

- [X] T028 [P] Governance compliance test — no client scoring / no live User score in the flow; selected questions retain source `item_id` (SC-009) in `frontend/tests/component/attribution.test.tsx`
- [X] T029 [P] Run all `quickstart.md` validation scenarios (1–13) and record results
- [X] T030 [P] Update `frontend/src/services/README.md` (Create-Assessment services now implemented) and add usage notes
- [X] T031 Final gate pass (`tsc -b`, `vitest run`, `vite build`, `eslint`) + constitution compliance (governed source, immutable metadata, controlled adaptation, approval gate, attribution)

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: depends on Specs 001/002 — start immediately.
- **Foundational (Phase 2)**: depends on Setup — **BLOCKS all stories** (shell + draft skeleton).
- **User Stories (Phases 3–8)**: depend on Foundational. Recommended order P1 (US1→US2→US3) → P2 (US4→US5→US6).
- **Polish (Phase 9)**: after the desired stories are complete.

### User Story Dependencies
- **US1 (P1)**: after Foundational. The spanning happy path (can use stub selection/chat data for its own test). No hard dependency on US2–US6.
- **US2 (P1)**: after Foundational. Independent (Step 7 governed selection).
- **US3 (P1)**: after Foundational. Independent (Step 8 rephrase); pairs naturally with US2 selections.
- **US4 (P2)**: after Foundational. Independent (Step 3/4 discovery → requirements).
- **US5 (P2)**: after Foundational. Reads selections (US2) + requirements (US4) but testable with fixture inputs.
- **US6 (P2)**: after Foundational. Cross-cutting persistence on the shell.

### Within Each User Story
- Tests first (fail), then services, then step components, then wiring.
- `CreateAssessmentWizard.tsx` is touched by T004, T010, T027 → run those sequentially.
- `services/index.ts` export edits (T003, T018, T021) touch one file → serialize.

### Parallel Opportunities
- Setup: T001, T002.
- US1: T006, T007 (tests) ∥; T008, T009 ∥; then T010 → T011.
- US2: T012, T013 ∥; T014 → T015.
- US3: T016 (test) ∥; T017 → T018 → T019.
- US4: T020 (test) ∥; T021 → T022.
- US5: T023 (test) ∥; T024 → T025.
- After Foundational, US1–US6 can be staffed in parallel (serialize wizard/`services/index.ts` edits).

---

## Parallel Example: User Story 2

```bash
# Tests for US2 together:
Task: "Unit test questionBankService.propose in frontend/tests/unit/propose.test.ts"
Task: "Component test QuestionCard provenance in frontend/tests/component/selection.test.tsx"

# Then service before screen:
Task: "Add questionBankService.propose in frontend/src/services/questionBank/questionBankService.ts"
Task: "Step7Selection + QuestionCard in frontend/src/features/create-assessment/"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)
Setup → Foundational → US1 (with stub selection/chat data) → **STOP and VALIDATE**: send an assessment that appears in Admin Core (SC-001/006) → demo.

### Incremental Delivery
1. Setup + Foundational → wizard shell + draft.
2. US1 → end-to-end send (MVP).
3. US2 → governed selection. 4. US3 → controlled rephrasing. 5. US4 → discovery chat. 6. US5 → coverage. 7. US6 → draft resume.
Each story adds value without breaking earlier ones.

### Parallel Team Strategy
After Foundational: Dev A → US1, Dev B → US2, Dev C → US3, Dev D → US4/US5; serialize wizard + `services/index.ts` edits.

---

## Notes
- `[P]` = different files, no blocking dependency; `[US#]` maps to spec.md stories.
- Completes the Spec 001 stubs (`assessmentDraftService`, `agentDiscoveryService`, `adaptationService`); reuses `questionBankService`/governance + the Spec 002 assessment store for send artifacts.
- Governance invariants: governed source only; immutable `Readonly<ItemBankItem>` (no `weight`/`difficulty`); text-only adaptation + diff with method safeguards (SJT/cognitive verbatim in V1); Send disabled until approval; source `item_id` attribution with no client scoring.
- Verify tests fail before implementing; commit per task/logical group; stop at any checkpoint to validate.
