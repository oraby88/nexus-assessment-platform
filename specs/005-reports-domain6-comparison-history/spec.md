# Feature Specification: Reports, Domain 6, Candidate Comparison & Admin History

**Feature Branch**: `005-reports-domain6-comparison-history`

**Created**: 2026-06-15

**Status**: Draft

**Input**: User description: "specs/005-reports-domain6-comparison-history — governed Admin reports, Domain 6 contextual section, user-safe preview, Candidate Comparison, Admin-wide Assessment History (master scope §9/§12/§13)"

**Prefix**: `FR-RPT-*`

**Authoritative sources**: `../000-master-scope/spec.md` (§9 domain model, §12 reports, §13 comparison), `../000-shared/status-models.md` (§2 confidence, §3 visibility, §7 Domain 6), `../000-shared/data-model.md` (§11), `../000-shared/handoff-map.md`; constitution `.specify/memory/constitution.md` (v2.0.0, principles IX/X/XI). Depends on Spec 001; uses Spec 004 blueprint/context summaries.

## Clarifications

### Session 2026-06-15

- Q: How is per-output report visibility determined? → A: Report fixtures carry the raw signals (confidence band/standard error, use case, prerequisites) and the frontend computes visibility at render time via the Spec 001 governance helpers (`visibilityEngine`/`confidenceGate`) — one source of truth, exercising the governed gates.
- Q: Where does the full report + Domain 6 data come from? → A: A dedicated hand-authored report-fixtures set covering all confidence bands (High/Moderate/Low/Unacceptable) plus an omitted section, a blocked Derailment Risk, and complete Domain 6 (including a provisional case) — deterministic coverage of every visibility/Domain-6 state.
- Q: Does Candidate Comparison read live reports or a snapshot? → A: It reads each selected participant's current released report at view time (no snapshotting in V1); participants without an eligible/released report are shown as ineligible with guidance.

## User Scenarios & Testing *(mandatory)*

<!--
  Actor: the single organization Admin. This spec builds the governed reporting surfaces:
  the Reports list + Admin Report detail (governed visibility), the Domain 6 contextual section,
  the user-safe preview (the projection the User later sees in Spec 006), Candidate Comparison
  (human-judgment only — no ranking/auto-decision), and the Admin-wide Assessment History.
  The frontend renders fixture-backed report data; it performs NO production scoring.
-->

### User Story 1 - View a governed Admin report (Priority: P1) 🎯 MVP

The Admin browses a Reports list and opens an Admin Report whose every dimension/section renders through governed visibility (confidence, use-case, audience, and prerequisite gates), with a confidence summary, limitations, omitted-section explanations, blueprint/context summaries, a version footer, and a persistent no-automatic-decision disclaimer.

**Why this priority**: The governed Admin report is the core output of the platform and the precondition for the user-safe view and comparison. Rendering it with correct visibility (no blocked values shown as data) is constitutionally central (Safe Reporting). This is the smallest slice that delivers report value.

**Independent Test**: From the Reports list, filter by status/confidence, open a report, and verify each section renders per its confidence/visibility state — High visible, Moderate cautioned, Low downgraded/hidden, blocked shown only as an omission explanation — with the disclaimer and version footer always present.

**Acceptance Scenarios**:

1. **Given** the Reports list, **When** the Admin filters by status/confidence/role, **Then** rows update and each row shows report status, confidence summary, and Domain 6 status.
2. **Given** an Admin report, **When** a dimension is Moderate confidence, **Then** it renders with caution treatment; **When** Low, **Then** downgraded or hidden per the audience/use-case rule.
3. **Given** a blocked or omitted section, **When** the report renders, **Then** no numeric value is shown and an omission explanation appears.
4. **Given** any Admin report, **When** it renders, **Then** the no-automatic-decision disclaimer and a version footer are always present, plus blueprint and context summaries.

---

### User Story 2 - Domain 6 contextual alignment section (Priority: P1)

Within the Admin report, the Admin sees the Domain 6 person-in-context section: CAI and DII, the six secondary indices (AFI, ECFI, SII, DDI, PDRI, ECSI), a candidate-vs-context fit radar, contextual strengths/cautions, and confidence treatment — with provisional/downgraded/omitted handling where prerequisites (e.g., D3/D5) are insufficient, and Derailment Risk never shown.

**Why this priority**: Domain 6 visibility is a constitutional V1 differentiator (Domain 6 Transparency) and a major part of report value; it must render with honest provisional/omission treatment.

**Independent Test**: Open a report's Domain 6 section; verify CAI/DII, the six secondary indices, the fit radar, and confidence render; where inputs are insufficient, outputs show provisional/downgraded/omitted with an explanation; Derailment Risk never appears as data.

**Acceptance Scenarios**:

1. **Given** a report with sufficient inputs, **When** Domain 6 renders, **Then** CAI/DII, the six secondary indices, the fit radar, contextual strengths/cautions, and confidence are shown.
2. **Given** insufficient/restricted inputs (e.g., D3/D5), **When** Domain 6 renders, **Then** affected outputs are marked provisional/downgraded or omitted with an explanation (no implied final certainty).
3. **Given** any report, **When** Domain 6 renders, **Then** Derailment Risk is never shown as a value.

---

### User Story 3 - User-safe report preview (Priority: P1)

The Admin opens a user-safe preview showing exactly what the User will see — supportive language with strengths, development themes, allowed dimensions, limitations, and (where permitted) a high-level contextual summary — with all restricted/internal/blocked content stripped.

**Why this priority**: The user-safe projection enforces Safe Reporting (the User must never see raw responses, formulas, internal flags, blocked values, Admin notes, or source metadata). Spec 006's User report reuses this exact projection, so it must be correct here.

**Independent Test**: Open the user-preview for a report; verify raw responses, formulas, scoring/synthesis versions, internal flags, blocked values, Admin notes, source-item metadata, and detailed Domain 6 internals are absent, while strengths/development/allowed dimensions/limitations remain.

**Acceptance Scenarios**:

1. **Given** an Admin report, **When** the Admin opens the user-safe preview, **Then** all restricted/raw/internal/blocked fields are stripped (0 leaks).
2. **Given** the preview, **When** it renders, **Then** language is supportive and only the permitted content (strengths, development themes, allowed dimensions, limitations, optional high-level contextual summary) is shown.

---

### User Story 4 - Candidate Comparison (human judgment only) (Priority: P2)

The Admin compares candidates for the same role/blueprint/context side by side across selected dimensions, with confidence indicators, contextual bands, strengths, areas to explore, and interview prompts — and **no ranking, leaderboard, automatic ordering, or auto-decision** of any kind, plus a persistent disclaimer.

**Why this priority**: Comparison supports hiring decisions but is built on reports (US1–US3). It is constitutionally constrained (Human Decision Support) and must never imply an automatic decision.

**Independent Test**: Set up a comparison (role/blueprint/context/participants/dimensions), view the side-by-side grid, and confirm there is no rank/podium/leaderboard/auto-order/auto-shortlist/auto-reject/auto-hire/recommendation labelling, and a disclaimer is present.

**Acceptance Scenarios**:

1. **Given** comparison setup with ≥2 participants, **When** the grid renders, **Then** candidates appear side-by-side with dimension bars, confidence chips, contextual band/summary, strengths, areas to explore, and interview prompts.
2. **Given** the comparison grid, **When** it renders, **Then** it contains no ranking/leaderboard/auto-order/auto-decision UI and shows a persistent "one input among many" disclaimer.
3. **Given** the comparison, **When** the Admin changes role/blueprint/context/dimensions or adds/removes a participant, **Then** the grid updates with no automatic ordering by fit.

---

### User Story 5 - Admin-wide Assessment History (Priority: P2)

The Admin views a global, searchable archive of all assessments with version awareness (blueprint/context versions), and opens historical reports that preserve the versions they were generated against.

**Why this priority**: History provides organizational traceability and access to past reports; it builds on the report and assessment data and is valuable but not the core report-viewing slice.

**Independent Test**: Open Assessment History; search/filter/sort; confirm lifecycle and validity show separately and blueprint/context versions are shown; open a historical report and confirm its version awareness is preserved.

**Acceptance Scenarios**:

1. **Given** the history page, **When** it loads, **Then** a global table shows user, use case, role, blueprint version, context version, assigned/submitted dates, lifecycle, validity, and report status.
2. **Given** a historical entry, **When** the Admin opens its report, **Then** the report reflects the versions it was generated against (version awareness preserved).

---

### User Story 6 - Simulated PDF download (Priority: P3)

From any report (Admin or user-safe), the Admin triggers a simulated PDF download that records an export-history entry.

**Why this priority**: PDF is an expected affordance but simulated in the prototype (real generation is a backend concern); lowest priority.

**Independent Test**: Trigger PDF on a report; confirm a simulated action runs and an export-history entry is created (visible in Exports).

**Acceptance Scenarios**:

1. **Given** a report, **When** the Admin downloads a PDF, **Then** a simulated action runs and an export-history entry appears.

---

### Edge Cases

- **Report not ready** (Processing/Unavailable) → status shown; detail surfaces a non-error "processing/unavailable" state, not a crash.
- **Moderate confidence in hiring context** → downgraded per the audience/use-case rule (not shown as confident).
- **Low/Unacceptable confidence** → downgraded or hidden; never presented as reliable.
- **Restricted prerequisites (D3/D5) for Domain 6** → provisional/downgraded/omitted with explanation; never implied as validated.
- **Blocked value (Derailment Risk)** → never rendered as data anywhere (report, preview, comparison).
- **User-safe projection** → zero Admin-only/restricted/blocked fields leak.
- **Comparison with <2 participants or missing reports** → guidance, not a broken grid; participants without an eligible/released report are shown as ineligible (no auto-fill, no blank-cell inclusion).
- **Comparison never auto-orders by fit** → order is the Admin's selection order.
- **Historical report whose blueprint/context later changed** → still shows the version it was generated against.
- **Mock service latency/error** (list/detail/comparison/history/PDF) → loading skeletons and error/retry.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-RPT-001**: The system MUST provide a Reports list with filters (search, use case, status, confidence, date, role, blueprint, context), row actions, and empty/loading/error states.
- **FR-RPT-002**: The Admin Report MUST render every dimension/section through governed visibility (confidence, use-case, audience, and prerequisite gates per `../000-shared/status-models.md`), **computing visibility at render time from the fixture's raw signals via the Spec 001 governance helpers** (`visibilityEngine`/`confidenceGate`), with a confidence summary, limitations, omitted-section explanations, blueprint/context summaries, a version footer, and a persistent no-automatic-decision disclaimer.
- **FR-RPT-003**: The Domain 6 section MUST render CAI/DII, the six secondary indices (AFI, ECFI, SII, DDI, PDRI, ECSI), a candidate-vs-context fit radar, contextual strengths/cautions, and confidence — with provisional/downgraded/omitted treatment where prerequisites are insufficient; **Derailment Risk MUST never be shown as data**.
- **FR-RPT-004**: The system MUST provide a user-safe preview that strips raw responses, formulas, scoring/synthesis versions, internal/psychometric flags, blocked values, Admin notes, source-item metadata, and detailed Domain 6 internals, while keeping supportive content.
- **FR-RPT-005**: The system MUST provide a simulated PDF action that creates an export-history entry.
- **FR-RPT-006**: The system MUST provide Candidate Comparison setup (role, blueprint, context, participants, dimensions) and a side-by-side grid (dimension bars, confidence chips, contextual band/summary, strengths, areas to explore, interview prompts), reading each participant's **current released report at view time** (no snapshot); participants without an eligible/released report are shown as ineligible with guidance.
- **FR-RPT-007**: Candidate Comparison MUST NOT include ranking, leaderboard, podium, automatic ordering by fit, auto shortlist/reject/hire, or recommendation labels, and MUST show a persistent disclaimer.
- **FR-RPT-008**: The system MUST provide an Admin-wide Assessment History page (global, searchable/filterable/sortable) showing lifecycle and validity as separate fields plus blueprint/context versions.
- **FR-RPT-009**: Historical reports MUST preserve version awareness (the blueprint/context/scoring versions they were generated against).
- **FR-RPT-010**: All report/comparison charts MUST provide accessible text equivalents.
- **FR-RPT-011**: Report sections MUST stack responsively and the comparison grid MUST scroll horizontally with a sticky candidate column.

### Key Entities *(include if feature involves data)*

- **Report (Admin)**: the full governed report — header, user summary, strengths, areas to explore, measured dimensions (with confidence/visibility), optional domain summaries, role-linked results, Domain 6, interview prompts, confidence summary, limitations, omitted sections, blueprint/context summaries, scoring/synthesis versions, status.
- **Dimension Result**: a measured dimension — score, confidence band, score band, standard error, visibility, explanation.
- **Domain 6 Result**: CAI, DII, six secondary indices (fit/risk), fit radar axes, contextual strengths/cautions, confidence, provisional reasons, visibility.
- **User-safe Report**: the audience-projected report — strengths, development themes, allowed dimensions, optional high-level contextual summary, limitations (no restricted/internal/blocked content).
- **Candidate Comparison**: role/blueprint/context + participants + selected dimensions + per-participant read model (scores, confidence, contextual band, strengths, areas, prompts); no ordering/decision.
- **Assessment History entry**: the historical record of an assessment with versions and separate lifecycle/validity/report statuses.
- **Output Visibility**: visible / visible-with-caution / downgraded / hidden / blocked / not-generated — applied per output.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of Admin report dimensions/sections render according to their confidence/visibility state; blocked outputs are never shown as a value (only as an omission explanation).
- **SC-002**: Every Admin report shows the no-automatic-decision disclaimer and a version footer (100% of reports).
- **SC-003**: The Domain 6 section renders CAI/DII, all six secondary indices, the fit radar, and confidence; provisional/omitted outputs carry an explanation; Derailment Risk appears in 0 reports.
- **SC-004**: The user-safe preview strips 100% of restricted/raw/internal/blocked fields (verified field-by-field) while retaining supportive content.
- **SC-005**: Candidate Comparison shows ≥2 candidates side-by-side with 0 instances of ranking/leaderboard/auto-order/auto-decision UI and a persistent disclaimer.
- **SC-006**: Assessment History presents lifecycle and validity as separate fields and shows blueprint/context versions for every row.
- **SC-007**: Opening a historical report preserves the versions it was generated against (no silent re-rendering against current versions).
- **SC-008**: A PDF download produces a simulated action and an export-history entry every time.
- **SC-009**: 100% of report/comparison charts expose an accessible text equivalent, and the surfaces are usable on tablet/mobile (report stacks; comparison grid scrolls with a sticky candidate column).

## Assumptions

- Builds on Spec 001 (charts: Gauge/FitRadar/DimensionBars/Ring; the `visibilityEngine`/`confidenceGate`/`useCaseGate`/`toUserSafe` governance helpers; `reportService`) and Spec 004 (blueprint/context summaries); no backend in this phase.
- The frontend performs **no production scoring** — report and Domain 6 data come from a **dedicated hand-authored report-fixtures set** covering all confidence bands + an omitted section + blocked Derailment Risk + full Domain 6 (incl. a provisional case); future `scoringService`/`domain6Service` produce these server-side. The frontend only applies audience/visibility projection for display (computed via the governance helpers).
- The User-facing report screen is owned by Spec 006 and reuses the user-safe projection defined here.
- `reportService`/`comparisonService` exist as stubs/fixture reads from Spec 001/002 and are completed here; PDF and export-history reuse Spec 002's `exportService`.
- Confidence bands, visibility states, and Domain 6 rules come from `../000-shared/status-models.md`; report shape from `../000-shared/data-model.md` §11.
- Standard web-app performance/error expectations apply; data is mock with simulated latency/errors.

## Dependencies

- **Depends on**: Spec 001 (charts + governance helpers + `reportService`), Spec 004 (blueprint/context summaries), Spec 002 (`exportService` for PDF/export-history; `assessmentService` for history).
- **Feeds**: Spec 006 (User report reuses the user-safe projection).
- **Shared canon**: `../000-shared/{status-models.md,data-model.md,handoff-map.md,risk-register.md}`.
