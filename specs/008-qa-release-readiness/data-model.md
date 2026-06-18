# Phase 1 Data Model: QA & Release-Readiness Gates

This is a verification feature — it introduces **no runtime entities, services, or persistence**. The "entities" below are conceptual structures used to organize the verification suites and the traceability artifact. No changes to `frontend/src/models`.

## Conceptual structures

### Governance Invariant
A NON-NEGOTIABLE guarantee under verification.
- `id` — e.g., `no-live-score`, `no-admin-leak`, `blocked-never-shown`, `no-auto-decision`, `source-id-attribution`, `governed-bank-only`, `immutable-metadata`, `service-boundary`
- `principle` — constitution reference (VIII, IX/III, XI, X, V, VI, IV)
- `assertion` — the concrete check in `tests/governance/invariants.test.tsx`
- Invariant: every id has **≥1 passing assertion** (SC-001).

### Priority Flow
A journey under accessibility/motion verification.
- `id` — `auth-recovery` | `runtime` | `create-assessment` | `report-viewing`
- `entryScreens` — the rendered screen(s)
- `checks` — `axe` (zero critical) + `keyboard` + `reduced-motion`

### Required Journey
An end-to-end flow under journey verification.
- `id` — `admin-developmental` | `admin-hiring-support` | `user`
- `steps` — ordered service/screen transitions
- `expectedArtifacts` — assignment / report / consent change / export-history entry / completion

### Screen / Route Catalog Entry
A route under shell/guard/title/state/responsive coverage.
- `path`, `shell` (Public/Admin/User/FullBleed), `guard` (admin/user/none), `title`
- `states` — expected empty / loading / error
- `responsive` — usable at mobile + desktop, both themes

### Traceability Entry
- `spec` — 001…008
- `requirements` — key FR/SC ids
- `gates` — verifying test file(s) / npm gate

### Release-Readiness Report
The aggregate gate's single pass/fail.
- `gates[]` — { name: tsc | tests | lint | format | build, status: pass/fail }
- `overall` — pass iff all gates pass; a failing/skipped gate ⇒ fail (SC-008)

## Validation & invariants

- **Coverage**: all 8 governance invariants asserted (SC-001); all 4 priority flows axe-clean (SC-003); all 3 journeys complete (SC-002); full route map shell/guard/title + state coverage (SC-005); every spec→gate mapped (SC-007).
- **Determinism**: 3 consecutive suite runs → identical results; 0 external network requests (SC-009).
- **Mock-only**: no backend, no runtime dependency added; `vitest-axe` is test-only (constitution I).
