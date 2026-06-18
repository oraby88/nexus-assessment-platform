# Quickstart — Reports, Domain 6, Comparison & History (validation guide)

Run-and-verify guide for the governed reporting surfaces. Implementation detail lives in `tasks.md`
(after `/speckit-tasks`). Builds on Specs 001/002/004; feeds Spec 006.

## Prerequisites
- Sign in as Admin (`/login`); open `/admin/reports`, `/admin/comparison`, `/admin/history`.
- App builds (`npm install`, `npm run dev`).

## Setup & run
```bash
cd frontend
npm run dev      # serve
npm test         # Vitest unit + component
npm run build    # production build
```

## Validation scenarios (map to Success Criteria)

| # | Scenario | Steps | Expected | SC |
|---|---|---|---|---|
| 1 | Reports list | Open `/admin/reports`; filter by status/confidence | Rows update; status/confidence/Domain 6 columns reflect each report | FR-RPT-001 |
| 2 | Governed visibility | Open a report with mixed-confidence dimensions | High visible, Moderate cautioned, Low downgraded/hidden — computed via helpers | SC-001 |
| 3 | Blocked/omitted | Open the report with a blocked Derailment Risk + omitted section | No value shown; omission explanation appears | SC-001/003 |
| 4 | Disclaimer + footer | Any Admin report | No-automatic-decision disclaimer + version footer always present | SC-002 |
| 5 | Domain 6 | Report Domain 6 section | CAI/DII gauges, six indices, fit radar, confidence; provisional case explained; Derailment Risk absent | SC-003 |
| 6 | User-safe preview | Open `/user-preview` | Raw/formulas/versions/flags/blocked/Admin-notes/source-metadata/Domain-6 internals stripped; supportive content remains | SC-004 |
| 7 | Comparison | `/admin/comparison` → pick role/context + ≥2 participants + dimensions | Side-by-side grid; no rank/leaderboard/auto-order/auto-decision; disclaimer present | SC-005 |
| 8 | Comparison eligibility | Add a participant without a released report | Shown ineligible with guidance (no blank cells) | SC-005 |
| 9 | History | `/admin/history` | Global table; lifecycle + validity separate; blueprint/context versions shown | SC-006 |
| 10 | Version awareness | Open a historical report | Reflects the versions it was generated against | SC-007 |
| 11 | PDF | Download PDF on a report | Simulated action + export-history entry (visible in Exports) | SC-008 |
| 12 | A11y / responsive | Charts text equivalents; resize | Text alternatives present; report stacks; comparison grid scrolls with sticky candidate column | SC-009 |

## Done (acceptance)
Reports list works; the Admin report renders all visibility states (blocked never shown as data) with
disclaimer + version footer; Domain 6 renders with provisional/omitted explanations and no Derailment
Risk; the user-safe preview strips all restricted content; comparison is side-by-side with no
ranking/auto-decision and eligibility handling; Admin History is global + version-aware; PDF records an
export entry; charts have text equivalents — with unit/component tests passing.
