---
description: "Task list — Reports, Domain 6, Comparison & History (Spec 005)"
---

# Tasks: Reports, Domain 6, Candidate Comparison & Admin History

**Input**: Design documents in `specs/005-reports-domain6-comparison-history/` (`plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`). Builds on implemented Specs 001/002/004; feeds Spec 006. Shared canon: `specs/000-shared/*`. Constitution: `.specify/memory/constitution.md` (v2.0.0, principles VIII/IX/X/XI).

**Tech**: Vite + React 18 + TypeScript (strict) + React Router; foundation charts (Gauge/FitRadar/DimensionBars/Ring) + governance helpers (confidenceGate/visibilityEngine/toUserSafe); Vitest + React Testing Library. Mock services only — no backend, no production scoring. App root: `frontend/`.

**Tests**: Included — governance is NON-NEGOTIABLE; Success Criteria require tests for computed visibility, Domain 6 provisional/blocked, user-safe stripping, comparison no-ranking/eligibility, history versions.

**Story map**: US1 = governed Admin report (P1, MVP) · US2 = Domain 6 (P1) · US3 = user-safe preview (P1) · US4 = Comparison (P2) · US5 = Admin History (P2) · US6 = simulated PDF (P3).

**Format**: `- [ ] [TaskID] [P?] [Story?] Description with path` — `[P]` = parallelizable; `[US#]` only on user-story phases.

---

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 [P] Create feature folders `frontend/src/features/{reports,comparison,history}/` and service folders `frontend/src/services/{report,comparison}/`
- [X] T002 [P] Extend models in `frontend/src/models/entities.ts` to the full report shape: `Report` (domains, strengths/areasToExplore, domain6, interviewPrompts, limitations, omittedSections, scoring/synth versions), `DimensionResult`, `DomainResult`, `Domain6Result`, `SecondaryIndex`, `RadarAxis`, `ReportInsight`, `InterviewPrompt`, `UserSafeReport`, `ComparisonParticipant`, `CandidateComparison` (per shared §11; new fields optional to keep 002 fixtures valid)

**Checkpoint**: Types compile under `strict`; existing fixtures still valid.

---

## Phase 2: Foundational (Blocking Prerequisites) — BLOCKS US1/US2/US3

**Purpose**: Report fixtures + report service + visibility projection that the report surfaces need.

- [X] T003 Author dedicated full report fixtures in `frontend/src/mocks/reports.ts` — 3–5 reports spanning High/Moderate/Low/Unacceptable confidence, an omitted section, a blocked Derailment Risk, and complete Domain 6 incl. a provisional case (research D2)
- [X] T004 Implement `reportService` dedicated file (`list`/`getAdmin` from fixtures + `getUserSafe` via `toUserSafe` + `downloadPdf` via Spec 002 `exportService`) in `frontend/src/services/report/reportService.ts`, plus a pure `projectReport(report,{audience,useCase})` helper (computes visibility via `confidenceGate`/`visibilityEngine`) in `frontend/src/features/reports/projectReport.ts`; export `reportService` from `frontend/src/services/index.ts` (research D1/D4/D6)

**Checkpoint**: Reports load from fixtures; visibility computes via the governance helpers.

---

## Phase 3: User Story 1 — View a governed Admin report (Priority: P1) 🎯 MVP

**Goal**: Reports list + Admin Report whose sections render through computed governed visibility, with disclaimer, version footer, and blueprint/context summaries.

**Independent Test**: Filter the list, open a report, verify High/Moderate/Low render per gate, blocked/omitted shows an explanation (no value), and the disclaimer + version footer are always present (quickstart #1–4; SC-001/002).

### Tests for User Story 1

- [X] T005 [P] [US1] Unit test `projectReport` visibility (High→visible, Moderate→caution/downgraded by use-case, Low→downgraded/hidden, Unacceptable→hidden, blocked→omission) in `frontend/tests/unit/report-visibility.test.ts`
- [X] T006 [P] [US1] Component test `AdminReport` (disclaimer + version footer always present; blocked section shows explanation, not a value) in `frontend/tests/component/admin-report.test.tsx`

### Implementation for User Story 1

- [X] T007 [US1] `ReportsList` (columns, filters, actions, states) in `frontend/src/features/reports/ReportsList.tsx`
- [X] T008 [US1] `AdminReport` (ordered sections via `projectReport`; measured dimensions with `DimensionBars`/`ConfidenceChip`; confidence summary, limitations, omitted sections, blueprint/context summaries, version footer, no-automatic-decision disclaimer) in `frontend/src/features/reports/AdminReport.tsx`
- [X] T009 [US1] Wire `/admin/reports` and `/admin/reports/:reportId` routes (replace placeholders, lazy) in `frontend/src/router.tsx`

**Checkpoint**: A governed Admin report renders correctly — MVP demoable.

---

## Phase 4: User Story 2 — Domain 6 contextual section (Priority: P1)

**Goal**: Domain 6 section with CAI/DII, six secondary indices, fit radar, confidence, provisional/omitted handling; Derailment Risk never shown.

**Independent Test**: Open a report's Domain 6 section; verify gauges/indices/radar render; provisional case explained; Derailment Risk absent (quickstart #5; SC-003).

### Tests for User Story 2

- [X] T010 [P] [US2] Unit test Domain 6 handling (provisional/downgraded/omitted per prerequisites; Derailment Risk never a value) in `frontend/tests/unit/domain6.test.ts`
- [X] T011 [P] [US2] Component test `Domain6Section` (CAI/DII gauges, six indices, fit radar render; provisional explanation shown) in `frontend/tests/component/domain6.test.tsx`

### Implementation for User Story 2

- [X] T012 [US2] `Domain6Section` (CAI/DII `Gauge`s, six `SecondaryIndex` cards, candidate-vs-context `FitRadar`, contextual strengths/cautions, confidence, provisional reasons, omission explanations) in `frontend/src/features/reports/Domain6Section.tsx` (rendered within `AdminReport`)

**Checkpoint**: Domain 6 renders with honest provisional/omitted treatment; Derailment Risk blocked.

---

## Phase 5: User Story 3 — User-safe report preview (Priority: P1)

**Goal**: Preview the exact User projection; all restricted/internal/blocked content stripped via `toUserSafe`.

**Independent Test**: Open the user-preview; verify raw/formulas/versions/flags/blocked/Admin-notes/source-metadata/Domain-6 internals are absent; supportive content remains (quickstart #6; SC-004).

### Tests for User Story 3

- [X] T013 [P] [US3] Unit test `reportService.getUserSafe` stripping (field-by-field absence of restricted/internal/blocked) in `frontend/tests/unit/user-safe.test.ts`
- [X] T014 [P] [US3] Component test `UserSafePreview` (no restricted fields; supportive content present) in `frontend/tests/component/user-safe-preview.test.tsx`

### Implementation for User Story 3

- [X] T015 [US3] `UserSafePreview` screen (strengths, development themes, allowed dimensions, optional high-level contextual summary, limitations, PDF action) in `frontend/src/features/reports/UserSafePreview.tsx`
- [X] T016 [US3] Wire `/admin/reports/:reportId/user-preview` route in `frontend/src/router.tsx`

**Checkpoint**: User-safe projection is correct (reused by Spec 006).

---

## Phase 6: User Story 4 — Candidate Comparison (Priority: P2)

**Goal**: Side-by-side comparison reading current released reports; no ranking/auto-decision; eligibility handling; disclaimer.

**Independent Test**: Set up role/context + ≥2 participants + dimensions; grid renders side-by-side with no ranking/auto-order/auto-decision and a disclaimer; report-less participant shown ineligible (quickstart #7–8; SC-005).

### Tests for User Story 4

- [X] T017 [P] [US4] Unit test `comparisonService.build` (reads current released reports; marks ineligible participants; preserves selection order; no ranking) in `frontend/tests/unit/comparison.test.ts`
- [X] T018 [P] [US4] Component test `ComparisonGrid` (no rank/leaderboard/auto-decision UI; persistent disclaimer) in `frontend/tests/component/comparison.test.tsx`

### Implementation for User Story 4

- [X] T019 [US4] Implement `comparisonService.build` in `frontend/src/services/comparison/comparisonService.ts` and export from `frontend/src/services/index.ts` (research D3)
- [X] T020 [US4] `ComparisonSetup` + `ComparisonGrid` (cards, dimension bars, confidence chips, contextual band, strengths/areas/prompts, disclaimer; CSV export) in `frontend/src/features/comparison/`
- [X] T021 [US4] Wire `/admin/comparison` route in `frontend/src/router.tsx`

**Checkpoint**: Comparison is human-judgment only, with eligibility + disclaimer.

---

## Phase 7: User Story 5 — Admin-wide Assessment History (Priority: P2)

**Goal**: Global version-aware history; lifecycle + validity separate; open historical reports.

**Independent Test**: Open history; search/filter/sort; lifecycle/validity separate; blueprint/context versions shown; open a historical report preserving versions (quickstart #9–10; SC-006/007).

### Tests for User Story 5

- [X] T022 [P] [US5] Component test `AssessmentHistory` (separate lifecycle/validity columns; version columns present) in `frontend/tests/component/history.test.tsx`

### Implementation for User Story 5

- [X] T023 [US5] `AssessmentHistory` (global table from `assessmentService.list` + report status + blueprint/context/scoring versions; search/filter/sort; open assessment/report; add to comparison) in `frontend/src/features/history/AssessmentHistory.tsx`
- [X] T024 [US5] Wire `/admin/history` route in `frontend/src/router.tsx`

**Checkpoint**: History is global and version-aware.

---

## Phase 8: User Story 6 — Simulated PDF download (Priority: P3)

**Goal**: PDF action records an export-history entry.

**Independent Test**: Download PDF on a report → simulated action + export-history entry (quickstart #11; SC-008).

### Tests for User Story 6

- [X] T025 [P] [US6] Unit test `reportService.downloadPdf` records an export-history entry via `exportService` in `frontend/tests/unit/report-pdf.test.ts`

### Implementation for User Story 6

- [X] T026 [US6] PDF action buttons on `AdminReport` + `UserSafePreview` calling `reportService.downloadPdf` in `frontend/src/features/reports/`

**Checkpoint**: PDF simulated with export history; all six stories functional.

---

## Phase 9: Polish & Cross-Cutting Concerns

- [X] T027 [P] Cross-surface governance test — blocked values (Derailment Risk) never render as data in report/preview/comparison; user-safe leaks = 0 in `frontend/tests/component/report-governance.test.tsx` (SC-001/004)
- [X] T028 [P] Run all `quickstart.md` validation scenarios (1–12) and record results
- [X] T029 [P] Update `frontend/src/services/README.md` (report/comparison services implemented) and usage notes
- [X] T030 Final gate pass (`tsc -b`, `vitest run`, `vite build`, `eslint`) + constitution compliance (Safe Reporting, Human Decision Support, Domain 6 Transparency, no production scoring)

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: depends on Specs 001/002/004 — start immediately.
- **Foundational (Phase 2)**: depends on Setup — **BLOCKS US1/US2/US3** (fixtures + reportService + projection). US4/US5 read reports/assignments but depend on Foundational for report data.
- **User Stories (Phases 3–8)**: depend on Setup + Foundational. Recommended order P1 (US1 → US2 → US3) → P2 (US4 → US5) → P3 (US6).
- **Polish (Phase 9)**: after the desired stories.

### User Story Dependencies
- **US1 (P1)**: after Foundational. The governed report (MVP).
- **US2 (P1)**: after Foundational; renders within the US1 report (Domain6Section), independently testable.
- **US3 (P1)**: after Foundational; reuses `getUserSafe`.
- **US4 (P2)**: after Foundational (needs report data); independent grid.
- **US5 (P2)**: after Foundational; reads assignments + report status.
- **US6 (P3)**: after US1/US3 (buttons on those surfaces); `downloadPdf` exists from Foundational.

### Within Each User Story
- Tests first (fail), then service/helper, then screens, then route wiring.
- `router.tsx` route-wiring (T009, T016, T021, T024) → serialize.
- `services/index.ts` export edits (T004, T019) → serialize.

### Parallel Opportunities
- Setup: T001, T002.
- US1: T005, T006 (tests) ∥; T007 ∥ T008; then T009.
- US2: T010, T011 (tests) ∥; then T012.
- US3: T013, T014 (tests) ∥; T015 then T016.
- US4: T017, T018 (tests) ∥; T019 → T020 → T021.
- After Foundational, US1–US5 can be staffed in parallel (serialize router + index.ts edits).

---

## Parallel Example: User Story 1

```bash
# Tests for US1 together:
Task: "projectReport visibility unit test in frontend/tests/unit/report-visibility.test.ts"
Task: "AdminReport component test in frontend/tests/component/admin-report.test.tsx"

# Build in parallel:
Task: "ReportsList in frontend/src/features/reports/ReportsList.tsx"
Task: "AdminReport in frontend/src/features/reports/AdminReport.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)
Setup → Foundational → US1 → **STOP and VALIDATE**: a governed Admin report with correct visibility + disclaimer + version footer (SC-001/002) → demo.

### Incremental Delivery
1. Setup + Foundational → fixtures + reportService + projection.
2. US1 → governed report (MVP). 3. US2 → Domain 6. 4. US3 → user-safe preview. 5. US4 → comparison. 6. US5 → history. 7. US6 → PDF.
Each story adds value without breaking earlier ones.

### Parallel Team Strategy
After Foundational: Dev A → US1+US2 (report+Domain6), Dev B → US3 (user-safe), Dev C → US4 (comparison), Dev D → US5 (history); serialize `router.tsx` and `services/index.ts` edits.

---

## Notes
- `[P]` = different files, no blocking dependency; `[US#]` maps to spec.md stories.
- Completes the `reportService`/`comparisonService` stubs; reuses governance helpers (visibility/user-safe), foundation charts, Spec 002 `exportService`/`assessmentService`, Spec 004 summaries.
- Governance: visibility computed via helpers; blocked values never shown as data anywhere; comparison has no ranking/auto-decision; **no production scoring** (fixtures only).
- Verify tests fail before implementing; commit per task/logical group; stop at any checkpoint to validate.
