# Contract — Service Methods (Reports, Domain 6, Comparison, History)

Completes the `reportService`/`comparisonService` stubs from Spec 001/002 and reuses governance +
export + assessment services. All `Promise`-based via `mockRequest`, typed models, org-scoped,
mirroring `../../000-shared/handoff-map.md`. The frontend performs **no production scoring**.

## reportService (extend existing `list`/`getAdmin`/`downloadPdf`)
```ts
list(query?): Promise<Report[]>                      // exists (fixture)
getAdmin(id: string): Promise<Report | undefined>    // full report fixture (mocks/reports.ts)
getUserSafe(id: string): Promise<UserSafeReport | undefined>  // via toUserSafe (D4)
downloadPdf(id: string): Promise<{ ok: true }>       // simulated → exportService records history (D6)
```
Plus a pure projection helper (feature or governance):
```ts
projectReport(report: Report, opts: { audience: 'admin' | 'user'; useCase: UseCase }): ProjectedReport
// computes per-dimension/section OutputVisibility via confidenceGate + visibilityEngine (D1)
```
Future: reporting pipeline, audience projection, PDF — server-authoritative.

## comparisonService (implement stub)
```ts
build(setup: {
  roleTitle: string;
  blueprintId?: string;
  contextProfileId?: string;
  participantIds: string[];
  dimensionIds: string[];
}): Promise<{ comparison: CandidateComparison; eligibility: ComparisonEligibility[] }>
```
Reads each participant's **current released report** (D3); marks participants without an eligible/released
report ineligible; preserves selection order; **no ranking/auto-decision**. Future: comparison read model.

## Reused services / helpers
- `governance`: `confidenceGate.band`/`visibilityEngine.resolve` (visibility), `toUserSafe` (user-safe projection).
- `exportService` (Spec 002): records the PDF export-history entry; CSV export of comparison.
- `assessmentService` (Spec 002): `list()` for Admin History; joined with report status + versions (D5).
- Charts (Spec 001): `Gauge`, `FitRadar`, `DimensionBars`, `Ring` (with text equivalents).

## Fixtures
`mocks/reports.ts` (new) — 3–5 hand-authored full reports covering all confidence bands, an omitted
section, a blocked Derailment Risk, and complete Domain 6 incl. a provisional case (D2).

## Consumption seam (Spec 006)
Spec 006's User report screen calls `reportService.getUserSafe(id)` — the same projection validated here.
