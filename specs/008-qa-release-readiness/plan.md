# Implementation Plan: QA & Release-Readiness Gates

**Branch**: `008-qa-release-readiness` | **Date**: 2026-06-16 | **Spec**: [`./spec.md`](./spec.md)

**Input**: Feature specification from `specs/008-qa-release-readiness/spec.md`. Verifies the work delivered in Specs 001–007. Builds on the existing test harness (Vitest + RTL, jsdom global env, `src/test/setup.ts`, mock services with `setMockFailRate`), the `governance` helpers, the route map, and the lazy governed-bank seam (`questionBankService` dynamic-imports `@/mocks/governed-bank`). Shared canon `specs/000-shared/*`; constitution `.specify/memory/constitution.md` (v2.0.0 — all principles + Development Workflow & Review Gates). Visual source of truth: `project/`.

## Summary

Add the **final QA & release-readiness layer** — no new product surfaces. It (1) proves every NON-NEGOTIABLE governance invariant via a **consolidated `tests/governance/` suite** (no live score; no Admin-data leak; blocked-never-shown; no auto-decision/ranking; source-ID attribution; governed-bank-only; immutable metadata; service-boundary); (2) verifies **accessibility & motion** on the priority flows via **`vitest-axe`** (zero critical violations) plus keyboard/reduced-motion assertions; (3) drives the three **end-to-end journeys** (Admin Developmental, Admin Hiring-Support, User) on mocks; (4) verifies **route/state/responsive coverage** (every route → shell/guard/title + in-language empty/loading/error; priority surfaces mobile↔desktop, both themes); (5) verifies **performance guardrails** (governed bank out of the initial chunk; routes code-split; no fixture imports in components) and ties it together with a **traceability/release-readiness doc** and a single **`npm run release-gate`** (tsc → tests → lint → format-check → build, fail-fast). Everything stays deterministic and frontend/mock-only.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 18 (established by Spec 001).

**Primary Dependencies**: No new **runtime** dependencies. One **test-only** dev dependency: `vitest-axe` (+ its `axe-core` peer) for automated WCAG checks. Existing: Vitest 2, @testing-library/react, jsdom.

**Storage**: N/A for verification (reads existing mock fixtures via services only). No persistence changes.

**Testing**: Vitest + RTL (jsdom). New suites: `tests/governance/` (one explicit assertion per invariant), `tests/a11y/` (axe + keyboard + reduced-motion on priority flows), `tests/journeys/` (the three end-to-end journeys driven on mocks), `tests/coverage/` (route shell/guard/title + empty/loading/error state coverage). `vitest-axe` matchers registered in `src/test/setup.ts`.

**Target Platform**: Evergreen desktop + tablet + mobile (verification asserts responsive behavior of existing screens).

**Project Type**: Web frontend — verification-only addition; no routes/screens/services added.

**Performance Goals**: Inherited. The suite must be **deterministic** (controlled mock latency; 0 flakes over 3 runs) and make **0 real network requests**.

**Constraints**: Frontend/mock-only (constitution I) — no backend, no CI provisioning, no real network. The aggregate gate composes existing commands. `vitest-axe` is test-only (justified by constitution's explicit call for axe). The suite must **fail loudly** on any violated invariant (never silently green).

**Scale/Scope**: ~4 new test suites + matcher registration + 2 `package.json` scripts (`release-gate`, `format:check`) + a release-readiness/traceability doc. Verifies ~176 existing tests' guarantees are consolidated and complete; covers the full route map and the four priority flows.

## Constitution Check

*GATE: must pass before Phase 0; re-checked after Phase 1.* This feature **enforces** the constitution; it cannot violate it.

| Principle | How this feature complies | Gate |
|---|---|---|
| I Frontend First | Verification is mock-only, deterministic; `vitest-axe` is test-only; no backend/CI | PASS |
| II Design Fidelity | Asserts in-language empty/error/loading + responsive states exist (does not restyle) | PASS |
| III Two Roles Only | Governance suite asserts no cross-role/cross-org leakage | PASS |
| IV Service Boundaries | Suite asserts components never import fixtures/persistence (extends `import-boundary` test) | PASS |
| V Governed Question Source | Suite asserts selection is governed-bank-only (blocked/quarantine/non-operational excluded) | PASS |
| VI Immutable Metadata | Suite asserts metadata not mutated/fabricated | PASS |
| VII Controlled Adaptation | Journey/governance checks confirm adapted text only; source id preserved | PASS |
| VIII Question-Level Attribution | Suite asserts source-ID keying + no live/client score anywhere | PASS |
| IX Safe Reporting | Suite asserts user-safe projection only; no restricted fields in User views | PASS |
| X Human Decision Support | Suite asserts no ranking/auto-decision + disclaimer present | PASS |
| XI Domain 6 Transparency | Suite asserts blocked-never-shown + provisional/omitted treatment | PASS |
| XII Accessibility & Motion | `vitest-axe` zero critical violations + keyboard + reduced-motion on priority flows | PASS |
| XIII Responsive Runtime | Coverage suite asserts mobile↔desktop usability + ≥44px runtime targets | PASS |
| XIV Traceability | Release-readiness doc maps spec → requirement → gate; shared docs current | PASS |
| XV Review Before Implementation | Stop for approval before `/speckit-implement` | PASS |

**Result**: No violations. Complexity Tracking empty.

## Project Structure

### Documentation (this feature)

```text
specs/008-qa-release-readiness/
├── plan.md              # This file
├── research.md          # Phase 0 — axe integration, journey strategy, perf/determinism approach
├── data-model.md        # Phase 1 — verification entities (invariant, priority flow, traceability entry)
├── contracts/           # Phase 1
│   ├── gates.md              # the gate catalog + release-gate command contract
│   └── traceability.md       # spec → key requirement → verifying gate/test mapping
├── quickstart.md        # Phase 1 — run + validation guide (incl. release-gate)
└── checklists/
    └── requirements.md  # spec quality checklist (from /speckit-specify, /speckit-clarify)
```

### Source Code (repository root — frontend app)

```text
frontend/
├── src/test/setup.ts            # register vitest-axe matchers (expect.extend)
├── tests/
│   ├── governance/
│   │   └── invariants.test.tsx  # one explicit assertion per NON-NEGOTIABLE invariant (FR-QA-000…008)
│   ├── a11y/
│   │   └── priority-flows.test.tsx  # axe (zero critical) + keyboard + reduced-motion on the 4 flows
│   ├── journeys/
│   │   └── end-to-end.test.tsx  # Admin Developmental, Admin Hiring-Support, User journeys on mocks
│   └── coverage/
│       └── routes-states.test.tsx   # route shell/guard/title + empty/loading/error coverage
├── package.json                 # add `release-gate` + `format:check` scripts; add vitest-axe devDep
└── (no src/ feature changes — verification only)
```

**Structure Decision**: Add four focused test suites under `tests/` (governance, a11y, journeys, coverage) rather than touching feature code — this feature is a **gate**, not a surface. `vitest-axe` matchers register once in the existing `src/test/setup.ts` so any suite can call `expect(await axe(container)).toHaveNoViolations()`. The single `release-gate` npm script chains the existing quality commands fail-fast; a `format:check` script (prettier `--check`) is added because the repo currently only has `format` (write). The traceability + release-readiness doc lives in the spec folder (`contracts/traceability.md`) and is referenced from the shared canon. Performance guardrails are verified by extending the existing `import-boundary` test (no fixture imports in components) plus a build-output check documented in quickstart (governed bank as its own chunk).

## Complexity Tracking

No constitution violations require justification. The only new dependency is the test-only `vitest-axe`, explicitly sanctioned by the constitution's "Accessibility (axe)" testing standard; it ships no runtime code.
