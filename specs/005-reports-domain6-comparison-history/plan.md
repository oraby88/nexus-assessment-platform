# Implementation Plan: Reports, Domain 6, Candidate Comparison & Admin History

**Branch**: `005-reports-domain6-comparison-history` | **Date**: 2026-06-15 | **Spec**: [`./spec.md`](./spec.md)

**Input**: Feature specification from `specs/005-reports-domain6-comparison-history/spec.md`. Inherits the delivered foundation `specs/001-foundation-design-system/*` (charts: Gauge/FitRadar/DimensionBars/Ring/ContextRadar; governance helpers `visibilityEngine`/`confidenceGate`/`useCaseGate`/`toUserSafe`; `reportService`), Spec 002 (`exportService` for PDF/export-history; `assessmentService` for history), and Spec 004 (blueprint/context summaries). Shared canon `specs/000-shared/*`; constitution `.specify/memory/constitution.md` (v2.0.0, principles IX/X/XI). Visual source of truth: `project/`.

## Summary

Build the governed reporting surfaces: a **Reports list**; an **Admin Report** whose every dimension/section renders through governed visibility **computed at render time** from fixture raw signals via the Spec 001 governance helpers; the **Domain 6** contextual section (CAI/DII, six secondary indices, candidate-vs-context fit radar, provisional/omitted treatment, Derailment Risk never shown); a **user-safe preview** that strips all restricted/internal/blocked content via `toUserSafe` (the projection Spec 006 reuses); **Candidate Comparison** (side-by-side, human-judgment only — no ranking/auto-decision, reading each participant's current released report); and the **Admin-wide Assessment History** (version-aware). Report/Domain 6 data come from a dedicated hand-authored fixtures set; the frontend performs **no production scoring**. PDF is simulated via Spec 002's `exportService`.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 18 (established by Spec 001)

**Primary Dependencies**: React Router 6; foundation charts (`Gauge`, `FitRadar`, `DimensionBars`, `Ring`, `ContextRadar`), governance helpers, UI (DataTable, FilterBar, Tabs, StatusBadge, ConfidenceChip, Chip), hooks (`useAsync`, `useViewport`). No new runtime dependencies.

**Storage**: Browser `localStorage` (mock) only; report/Domain 6 data are committed fixtures. No database.

**Testing**: Vitest + React Testing Library; unit tests for the report visibility projection (confidence→visibility via helpers), `toUserSafe` stripping, Domain 6 provisional/blocked handling, comparison no-ranking/eligibility, and history version awareness; component tests for the Admin report sections, Domain 6 section, user-safe preview, and comparison grid.

**Target Platform**: Evergreen desktop + tablet + mobile (report sections stack; Domain 6 charts scale; comparison grid scrolls horizontally with a sticky candidate column).

**Project Type**: Web frontend — admin routes under `/admin/reports/*`, `/admin/comparison`, `/admin/history` (reserved by Spec 001 router as placeholders).

**Performance Goals**: Inherited (route < ~450ms; 60fps; reduced-motion honored); charts animate on reveal without jank.

**Constraints**: No backend / production scoring / Domain 6 derivation / report generation / real PDF. **NON-NEGOTIABLE**: Safe Reporting (governed visibility; user-safe stripping; blocked values never shown as data), Human Decision Support (no ranking/auto-decision in comparison), Domain 6 Transparency (provisional/omitted; Derailment Risk blocked). The frontend computes only audience/visibility projection for display. WCAG 2.1 AA basics (chart text equivalents; labelled confidence chips; keyboard-navigable comparison grid).

**Scale/Scope**: 5 screens (Reports list, Admin Report detail, user-safe preview, Comparison, Admin History). Consumes `reportService`, `comparisonService`, `exportService`, `assessmentService`, governance helpers. ~3–5 hand-authored full report fixtures spanning all visibility/Domain-6 states.

## Constitution Check

*GATE: must pass before Phase 0; re-checked after Phase 1.* This is a governance-critical reporting feature.

| Principle | How this feature complies | Gate |
|---|---|---|
| I Frontend First | No backend; fixtures + mocks; reviewable per-story checkpoints | PASS |
| II Design Fidelity | Report/Domain6/comparison composed from ported charts/components; missing states in-language | PASS |
| III Two Roles Only | Admin-only `/admin/*`; user-safe preview is the Admin previewing the User projection | PASS |
| IV Service Boundaries | UI consumes `reportService`/`comparisonService`/`exportService`/`assessmentService` + governance helpers; no fixture/persistence imports in components | PASS |
| V Governed Question Source | N/A — no question selection here | PASS (n/a) |
| VI Immutable Metadata | Reports reference source data read-only; no fabricated fields | PASS |
| VII Controlled Adaptation | N/A | PASS (n/a) |
| VIII Question-Level Attribution | **No production scoring in the UI** — report/Domain 6 are fixtures; UI applies only display projection; no live User score | PASS |
| IX Safe Reporting | Admin report governed visibility + `toUserSafe` preview strips restricted/internal/blocked; blocked never shown as data | PASS |
| X Human Decision Support | Comparison side-by-side only; no ranking/order/auto-decision; persistent disclaimer | PASS |
| XI Domain 6 Transparency | CAI/DII + six indices + fit radar; provisional/downgraded/omitted with explanation; Derailment Risk blocked | PASS |
| XII Accessibility & Motion | chart text equivalents; labelled confidence chips; keyboard comparison grid; reduced-motion-safe reveals | PASS |
| XIII Responsive Runtime | report stacks; Domain 6 charts scale; comparison grid scrolls with sticky candidate column | PASS |
| XIV Traceability | spec/plan consistent with `000-shared/*`; visibility/Domain-6 rules sourced from status-models | PASS |
| XV Review Before Implementation | stop for approval before `/speckit-implement` | PASS |

**Result**: No violations. Complexity Tracking empty.

## Project Structure

### Documentation (this feature)

```text
specs/005-reports-domain6-comparison-history/
├── plan.md              # This file
├── research.md          # Phase 0 — visibility computation, fixtures, comparison source, history versions
├── data-model.md        # Phase 1 — report/Domain6/user-safe/comparison entities + projection
├── contracts/           # Phase 1
│   ├── screens-routes.md     # 5 screens, routes, governed-visibility + comparison rules + states
│   └── services.md           # report/comparison service methods (deltas over 001/002 stubs)
├── quickstart.md        # Phase 1 — run + validation guide
└── checklists/
    └── requirements.md  # spec quality checklist (from /speckit-specify, /speckit-clarify)
```

### Source Code (repository root — frontend app)

```text
frontend/src/
├── features/
│   ├── reports/          # ReportsList, AdminReport (sections), Domain6Section, UserSafePreview
│   ├── comparison/       # ComparisonSetup, ComparisonGrid
│   └── history/          # AssessmentHistory
├── services/
│   ├── report/reportService.ts          # list/getAdmin/getUserSafe/downloadPdf (+ projection)
│   └── comparison/comparisonService.ts  # build (read current released reports; no ranking)
├── models/               # extend Report to full shape + Domain6Result/SecondaryIndex/RadarAxis/UserSafeReport (shared §11)
├── mocks/reports.ts      # dedicated hand-authored full report fixtures (all bands + omitted/blocked + Domain 6)
└── components/           # reuse Gauge/FitRadar/DimensionBars/Ring + governance helpers
tests/
├── unit/        # visibility projection, toUserSafe stripping, domain6 handling, comparison no-rank/eligibility, history versions
└── component/   # admin report, domain6 section, user-safe preview, comparison grid
```

**Structure Decision**: One feature folder per surface (`features/reports/`, `features/comparison/`, `features/history/`). Completes the `reportService` (add `getUserSafe` + full projection) and `comparisonService` (implement `build`) stubs from Spec 001; reuses `governance` helpers for visibility/user-safe, the foundation charts for Domain 6/dimension visuals, Spec 002's `exportService` for PDF/export-history, and `assessmentService` for history. The dedicated `mocks/reports.ts` provides deterministic coverage of every visibility/Domain-6 state. The Spec 006 User report will reuse `reportService.getUserSafe`.

## Complexity Tracking

No constitution violations require justification. (If the Admin report's section-visibility orchestration grows complex, a small pure `projectReport(report, audience, useCase)` helper centralizes it — recorded here only if it replaces a simpler inline approach.)
