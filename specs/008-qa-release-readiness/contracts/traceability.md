# Traceability: Spec → Key Requirements → Verifying Gate/Tests

The release-readiness mapping (FR-QA-016 / SC-007). Each prior spec's key guarantees map to at least one verifying gate/test. Existing per-spec tests remain authoritative for their feature; the new `tests/governance/` suite consolidates the cross-cutting NON-NEGOTIABLE invariants.

## Per-spec mapping

| Spec | Key requirements (sample) | Verifying gate / tests |
|---|---|---|
| 001 Foundation | shells, guards, persistence, async/error states, a11y/motion, lazy bank | `guards`, `theme`, `a11y-motion`, `infra`, `import-boundary`; build code-split |
| 002 Admin Core | users/assessments lists, detail tabs, notifications, exports, CSV | `users`, `assessments`, `admin-services`, `csv`, `periphery`, `dashboard` |
| 003 Create Assessment | governed selection, adaptation (text-only, source-id), coverage, attribution | `selection`, `adaptation`, `propose`, `coverage`, `attribution`, `agent-discovery` |
| 004 Blueprints/Contexts | blueprint/context CRUD, two-way link, context signature, versioning | `role-blueprint`, `context-profile`, `blueprint-context-link`, `context-signature`, `versioning`, builders |
| 005 Reports/Domain 6/Comparison/History | governed visibility, user-safe projection, Domain 6 blocked/provisional, no-rank comparison, history | `report-visibility`, `user-safe`, `domain6`, `comparison`, `report-pdf`, `history`, `admin-report` |
| 006 User Portal & Runtime | five question types, source-id keying, no live score, consent + revocation, user-safe report | `runtime`, `question-renderers`, `runtime-backnav`, `consent`, `user-safe-leak`, `user-no-leak`, `user-report`, `dashboard-hero`, `deletion-request` |
| 007 Public/Auth/Activity/Privacy | reset tokens (no enumeration), privacy inbox resolution, activity filters, 404 | `auth-reset`, `recovery`, `privacy-inbox`, `consent`, `activity-log`, `not-found` |
| 008 QA & Release Readiness | consolidated invariants, axe a11y, journeys, route/state coverage, release gate | `tests/governance/*`, `tests/a11y/*`, `tests/journeys/*`, `tests/coverage/*`, `release-gate` |

## NON-NEGOTIABLE invariant → assertion (consolidated suite)

| Invariant | Principle | Asserted in |
|---|---|---|
| No live/client score | VIII | `tests/governance/invariants.test.tsx` (+ `user-no-leak`, `attribution`) |
| No Admin-only data in User views | IX/III | `invariants` (+ `user-safe-leak`, `user-safe`) |
| Blocked values never shown as data | XI | `invariants` (+ `domain6`, `report-governance`) |
| No auto hire/reject or ranking | X | `invariants` (+ `comparison`) |
| Source-Question-ID attribution | VIII | `invariants` (+ `runtime`, `attribution`) |
| Governed-bank-only selection | V | `invariants` (+ `selection`, `bank-provenance`) |
| Immutable metadata (no fabricated fields) | VI | `invariants` (+ `bank-provenance`) |
| Service boundary (no fixture imports) | IV | `invariants` (+ `import-boundary`) |

## Shared-docs currency

- `specs/000-shared/traceability-matrix.md`, `testing-notes.md`, `risk-register.md`, `route-map.md`, `handoff-map.md` reviewed/updated so they reflect Specs 001–008 as delivered (FR-QA-016).
