# Quickstart & Validation: QA & Release-Readiness Gates

Verifies Specs 001–007 are constitutionally compliant and release-ready. Frontend/mock-only, deterministic. Details live in `contracts/gates.md`, `contracts/traceability.md`, and `data-model.md`.

## Prerequisites

- The existing `frontend/` app (Specs 001–007 present). From repo root: `cd frontend`.
- One-time: `npm install` (pulls the new test-only `vitest-axe` dev dependency).

## The single release gate

```bash
cd frontend
npm run release-gate
# tsc -b  →  vitest run  →  eslint  →  prettier --check  →  vite build  (fail-fast)
```

A green run is the V1 sign-off: all gates passed. The first failing step is the attributed gate.

## Individual gates

```bash
npx tsc -b                 # strict types
npm run test               # all suites incl. governance / a11y / journeys / coverage
npm run test:a11y          # just the a11y suite (tests/a11y)
npx eslint . --ext .ts,.tsx
npm run format:check
npm run build              # production build (confirm a governed-bank-*.js chunk exists)
```

## Story validation

### US1 — Governance invariants (P1, MVP)
- `npm run test -- tests/governance` → every NON-NEGOTIABLE invariant has a passing assertion (no live score, no Admin-leak, blocked-never-shown, no auto-decision/ranking, source-id attribution, governed-bank-only, immutable metadata, service boundary).
- ✅ Pass: 8/8 invariants asserted (SC-001).

### US2 — End-to-end journeys (P1)
- `npm run test -- tests/journeys` → Admin Developmental, Admin Hiring-Support, and User journeys complete with expected mock artifacts; no dead ends.
- ✅ Pass: 3/3 journeys (SC-002).

### US3 — Accessibility & motion (P1)
- `npm run test:a11y` → axe reports zero critical violations on the four priority flows; keyboard + reduced-motion assertions pass.
- ✅ Pass: 0 critical violations; motion degrades under reduced-motion (SC-003/004).

### US4 — Route / state / responsive coverage (P2)
- `npm run test -- tests/coverage` → every route has shell/guard/title; cataloged screens render in-language empty/loading/error; priority surfaces usable mobile↔desktop.
- ✅ Pass: 0 blank screens / raw errors (SC-005).

### US5 — Performance, traceability & the gate (P2)
- `npm run build` → confirm the governed bank is its own lazy chunk and routes are code-split.
- Open `contracts/traceability.md` → every spec (001–008) maps to a verifying gate.
- `npm run release-gate` → single clear pass/fail; force a failure (e.g., break a test) and confirm it's surfaced, not silently green.
- ✅ Pass: code-split verified; full mapping; aggregate gate attributes failures (SC-006/007/008).

### Determinism
- Run `npm run test` three times → identical results (0 flakes); no real network requests (SC-009).

## Done = `npm run release-gate` is green + all five stories validated + every `tasks.md` item `[X]`.
