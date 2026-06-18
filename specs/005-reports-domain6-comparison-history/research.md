# Phase 0 — Research & Decisions (Reports, Domain 6, Comparison, History)

All Technical Context items are resolved — **no remaining NEEDS CLARIFICATION** (the three `/speckit-clarify` answers settled visibility computation, the fixture source, and the comparison data source). Foundation/master decisions are inherited from `../001-foundation-design-system/research.md` and `../000-master-scope/research.md`.

## D1 — Visibility computed at render time *(clarification Q1)*
- **Decision**: Report fixtures carry raw signals (`confidence` band, `standardError`, use case, prerequisite flags). A pure `projectReport(report, { audience, useCase })` helper computes each output's `OutputVisibility` via the Spec 001 `confidenceGate`/`visibilityEngine` and renders accordingly (High→visible, Moderate→caution/downgraded by audience+use-case, Low→downgraded/hidden, Unacceptable→hidden, blocked→omission only).
- **Rationale**: One source of truth; genuinely exercises the governed gates (testable, SC-001); honors Principle IX.
- **Alternatives**: Pre-set `visibility` in fixtures (rejected — bypasses the gate, drift risk); hybrid (rejected — split logic).

## D2 — Dedicated report + Domain 6 fixtures *(clarification Q2)*
- **Decision**: A committed `mocks/reports.ts` with 3–5 full reports spanning High/Moderate/Low/Unacceptable confidence, an omitted section, a **blocked Derailment Risk**, and complete Domain 6 (CAI/DII/six indices/fit radar) including a **provisional** case (insufficient D3/D5).
- **Rationale**: Deterministic coverage of every visibility/Domain-6 state for tests (SC-001/003/004); the frontend does no scoring (Principle VIII).
- **Alternatives**: Procedural derivation (rejected — non-deterministic, implies scoring); extend minimal 002 fixtures (rejected — insufficient coverage).

## D3 — Comparison reads current released reports *(clarification Q3)*
- **Decision**: `comparisonService.build({ role, blueprintId, contextId, participantIds, dimensionIds })` reads each participant's **current released report** at view time; participants without an eligible/released report are returned as ineligible (shown with guidance, not blank cells). No ranking/order/auto-decision; participants appear in the Admin's selection order.
- **Rationale**: Always consistent with reports; matches the read-model intent (SC-005); Principle X.
- **Alternatives**: Snapshot (rejected — freezes/desyncs in a mock); include report-less participants as blank (rejected — misleading).

## D4 — User-safe projection via toUserSafe
- **Decision**: `reportService.getUserSafe(id)` derives the user-safe report from the Admin report via the Spec 001 `toUserSafe` projection (plus a high-level Domain 6 summary where permitted), stripping raw responses, formulas, scoring/synthesis versions, internal flags, blocked values, Admin notes, source-item metadata, detailed Domain 6 internals.
- **Rationale**: Single projection reused by Spec 006 (Principle IX); testable field-by-field (SC-004).
- **Alternatives**: Separate user-safe fixtures (rejected — drift from the Admin report).

## D5 — History via assessmentService + version awareness
- **Decision**: Admin History reads `assessmentService.list()` joined with report status; each row shows lifecycle + validity (separate) and the blueprint/context **versions the assessment was generated against** (carried on the report/assignment fixture, not re-derived from current blueprint/context). Historical report open uses the report's own `scoringVersion`/`synthesisWeightVersion`.
- **Rationale**: SC-006/007; reuses existing data; preserves version awareness.
- **Alternatives**: Re-derive from current versions (rejected — breaks version awareness).

## D6 — PDF + export-history via Spec 002 exportService
- **Decision**: `reportService.downloadPdf(id)` triggers a simulated download and records an export-history entry through Spec 002's `exportService` (reusing the export framework).
- **Rationale**: SC-008; single export framework; no duplicate state.
- **Alternatives**: Separate PDF stub (rejected — bypasses export history).

## D7 — Charts reuse (no new dependency)
- **Decision**: Domain 6 uses `Gauge` (CAI/DII), `FitRadar` (candidate-vs-context), secondary-index cards; measured dimensions use `DimensionBars`; all with text equivalents (already built in Spec 001).
- **Rationale**: Constitution XII; no new chart dep; consistent visuals.

## Open questions status
None block planning. Deferred to implementation detail (not spec ambiguities): exact report-fixture authoring, and the precise history version-field placement on fixtures.
