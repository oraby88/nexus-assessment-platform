# Phase 1 — Data Model (Reports, Domain 6, Comparison, History slice)

**Source of truth**: `../000-shared/data-model.md` §11 (Report, DimensionResult, DomainResult, SecondaryIndex, RadarAxis, Domain6Result, ReportInsight, InterviewPrompt, OmittedSection, UserSafeReport, ComparisonParticipant, CandidateComparison). The Spec 001/002 `Report` is minimal; this feature extends it to the full shape. The frontend renders these; it computes no scores.

## 1. Entities authored/extended

| Entity | Shape (per shared §11) | Notes |
|---|---|---|
| `Report` (full) | header + confidence + scoring/synth versions + `domains: DomainResult[]` + strengths/areasToExplore + `domain6?` + interviewPrompts + limitations + omittedSections | extends the minimal 002 Report (new fields optional to keep fixtures valid) |
| `DimensionResult` | dimensionId, dimensionName, score, confidence, scoreBand, standardError?, visibility, explanation? | `visibility` is **derived at render** (D1), fixtures carry confidence/SE |
| `DomainResult` | domainId, label, colorToken, dimensions[] | |
| `Domain6Result` | cai?, dii?, caiBand?, confidence, narrative, secondaryIndices[], radar[], contextStrengths[], contextCautions[], visibility, provisionalReasons? | provisional/omitted handling (D2) |
| `SecondaryIndex` | code (AFI/ECFI/SII/DDI/PDRI/ECSI), name, score?, type (fit/risk), visibility, explanation? | |
| `RadarAxis` | axis, person, required | candidate-vs-context fit radar |
| `UserSafeReport` | strengths, areasToExplore, allowed domains, optional `domain6Summary`, limitations | from `toUserSafe` (D4) |
| `CandidateComparison` / `ComparisonParticipant` | role/blueprint/context + dimensionIds + participants[] | read model; no order/decision (D3) |

## 2. Additions for this feature

| Type | Shape (summary) | Notes |
|---|---|---|
| `ReportAudience` | `'admin' \| 'user'` | drives projection |
| `ProjectedSection<T>` | `{ value?: T; visibility: OutputVisibility; explanation?: string }` | render wrapper from `projectReport` |
| `HistoryRow` | `{ assignment; report?; blueprintVersion?; contextVersion? }` | history join (D5) |
| `ComparisonEligibility` | `{ participantId; eligible: boolean; reason?: string }` | report-less participants (D3) |

## 3. Validation & governance rules

- **Visibility** (FR-RPT-002, D1): computed via `confidenceGate.band(se)` → `visibilityEngine.resolve(...)`; High visible, Moderate caution/downgraded by audience+use-case, Low downgraded/hidden, Unacceptable hidden.
- **Blocked** (FR-RPT-003): `visibility==='blocked'` (e.g., Derailment Risk) → render an omission explanation only, never a value, in **all** surfaces.
- **User-safe** (FR-RPT-004, D4): `toUserSafe` strips raw responses, formulas, scoring/synth versions, internal flags, blocked values, Admin notes, source-item metadata, Domain 6 internals.
- **Comparison** (FR-RPT-006/007, D3): reads current released reports; ineligible participants flagged; no ranking/order/auto-decision; persistent disclaimer.
- **History** (FR-RPT-008/009, D5): lifecycle + validity separate; blueprint/context + scoring versions preserved as generated.

## 4. State / projection flow

- `reportService.getAdmin(id)` → full `Report` (fixture).
- `projectReport(report, { audience:'admin', useCase })` → per-section `ProjectedSection` (visibility computed).
- `reportService.getUserSafe(id)` → `UserSafeReport` via `toUserSafe`.
- `comparisonService.build(setup)` → `{ comparison, eligibility[] }` from current reports.
- `assessmentService.list()` + reports → `HistoryRow[]`.

## 5. Service ownership

Completes Spec 001/002 stubs:
- `reportService`: `list`/`getAdmin` (exist) + `getUserSafe`, `downloadPdf` (via exportService), + `projectReport` helper.
- `comparisonService`: implement `build` (current released reports; eligibility; no ranking).
- Reuses `governance` (`confidenceGate`/`visibilityEngine`/`toUserSafe`), `exportService` (PDF/history), `assessmentService` (history). See `./contracts/services.md`.
