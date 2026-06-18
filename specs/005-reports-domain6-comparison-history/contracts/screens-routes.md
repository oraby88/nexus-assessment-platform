# Contract — Screens, Routes & States (Reports, Domain 6, Comparison, History)

Routes reserved by the Spec 001 router (currently placeholders); this feature replaces them. All under
`AdminShell` (`/admin/*`), org-scoped, with loading/empty/error/responsive/accessible states.

## Screens & routes

| Screen | Route | Story |
|---|---|---|
| Reports List | `/admin/reports` | US1 |
| Admin Report Detail | `/admin/reports/:reportId` | US1 |
| User-safe Preview | `/admin/reports/:reportId/user-preview` | US3 |
| Candidate Comparison | `/admin/comparison` | US4 |
| Admin Assessment History | `/admin/history` | US5 |

## Reports List (US1)
Columns: Report ID · User · Assessment Type · Target Role · Blueprint · Context · Completion Date · Report Status · Confidence Summary · Domain 6 Status · Actions. Filters: search, use case, status, confidence, date, role, blueprint, context. Actions: open, download PDF, add to comparison, open user/assessment, export. Empty/loading/error.

## Admin Report Detail (US1/US2) — section order
Report Header · User Summary · Strengths · Areas to Explore · Measured Dimensions · Optional Domain Summaries · Role-Linked Results · **Domain 6** · Structured Interview Prompts · Confidence Summary · Limitations · Omitted Sections · Blueprint Summary · Context Summary · **Version Footer** · **No-Automatic-Decision Disclaimer**.
- Each dimension/section rendered through `projectReport` (visibility computed via governance helpers, D1).
- Blocked/omitted → omission explanation, never a value.
- Disclaimer + version footer always present (FR-RPT-002, SC-002).

## Domain 6 Section (US2) — FR-RPT-003
CAI gauge · DII gauge · six secondary-index cards (AFI, ECFI, SII, DDI, PDRI, ECSI) · candidate-vs-context Fit Radar · context strengths · context cautions · Domain 6 confidence · provisional reasons · omission explanations. D3/D5-dependent outputs marked provisional/downgraded/omitted; **Derailment Risk never shown as data**.

## User-safe Preview (US3) — `/admin/reports/:reportId/user-preview`
Derived via `reportService.getUserSafe` (→ `toUserSafe`). Shows strengths, development themes, allowed dimensions, supportive explanations, optional high-level contextual summary, limitations, PDF action. **Strips** raw responses, formulas, scoring/synth versions, internal flags, blocked values, Admin notes, source-item metadata, detailed Domain 6 internals (SC-004).

## Candidate Comparison (US4) — FR-RPT-006/007
Setup: target role, blueprint, context, participants, dimension selection. Grid: participant cards · dimension bars · confidence chips · contextual band/summary · strengths · areas to explore · interview prompts · limitations · **persistent disclaimer**. Reads each participant's current released report (D3); ineligible (no/processing report) shown with guidance. **Prohibited**: ranks, podium, leaderboard, auto-order by fit, auto shortlist/reject/hire, recommendation labels. Actions: add/remove participant, change role/blueprint/context, filter dimensions, open report, export CSV, simulated PDF.

## Admin Assessment History (US5) — `/admin/history`
Global table: User · Use Case · Target Role · Blueprint Version · Context Version · Assigned · Submitted · **Lifecycle** · **Validity** · Report Status · Actions (search/filter/sort/export/open assessment/open historical report/download PDF/add to comparison). Version awareness preserved on historical reports (D5).

## Cross-cutting states
Loading (skeletons), Empty (no reports; comparison <2 or missing reports → guidance), Error (Processing/Unavailable report; failed load → retry), Responsive (report sections stack; Domain 6 charts scale; comparison grid scrolls horizontally with a **sticky candidate column**), Accessibility (chart text equivalents; labelled confidence chips; keyboard-navigable comparison grid), Motion (bars/radar/gauges animate on reveal; comparison reflow — reduced-motion-safe).
