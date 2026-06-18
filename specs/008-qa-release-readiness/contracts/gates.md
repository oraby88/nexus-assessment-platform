# Gate Catalog & `release-gate` Contract

The aggregate gate is the V1 sign-off artifact. It composes the existing quality commands plus the new verification suites and reports a single, clearly-attributed pass/fail.

## `package.json` scripts (added)

```jsonc
{
  "scripts": {
    // existing: dev, build, preview, test, test:watch, test:a11y, lint, format, ...
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css}\" \"tests/**/*.{ts,tsx}\"",
    "release-gate": "tsc -b && vitest run && eslint . --ext .ts,.tsx && npm run format:check && vite build"
  }
}
```

- **Fail-fast** (`&&`): the first failing step halts the chain and is the attributed gate (FR-QA-017/SC-008).
- `vitest run` includes the new `tests/governance/`, `tests/a11y/`, `tests/journeys/`, and `tests/coverage/` suites alongside all existing tests.
- No CI service is provisioned (frontend-only scope); `release-gate` is the runnable single command.

## Gate catalog

| Gate | Command | Verifies | Spec refs |
|---|---|---|---|
| Type-check | `tsc -b` | strict types across app + tests | all |
| Tests | `vitest run` | unit + component + governance + a11y + journeys + coverage | FR-QA-000…014 |
| Lint | `eslint . --ext .ts,.tsx` | lint clean (0 errors) | quality std |
| Format | `npm run format:check` | Prettier clean | quality std |
| Build | `vite build` | production build succeeds + code-split (governed bank lazy chunk) | FR-QA-015 |

## Test-suite contracts (Vitest + RTL, jsdom)

- **`tests/governance/invariants.test.tsx`** — one labelled assertion per invariant (FR-QA-000…008). Reuses `reportService.getUserSafe`, `runtimeService`, `comparisonService`, `governance` helpers; includes the static no-fixture-import check (FR-QA-006/008).
- **`tests/a11y/priority-flows.test.tsx`** — for each priority flow: `expect(await axe(container)).toHaveNoViolations()` (critical/serious) + keyboard reachability/focus-visible + reduced-motion degradation (FR-QA-010/011).
- **`tests/journeys/end-to-end.test.tsx`** — Admin Developmental, Admin Hiring-Support, User journeys driven on mocks; assert step transitions + expected artifacts, no dead ends (FR-QA-009).
- **`tests/coverage/routes-states.test.tsx`** — route map shell/guard/title coverage + in-language empty/loading/error states + responsive breakpoints (FR-QA-012/013/014).

## Setup contract

- `src/test/setup.ts` registers `vitest-axe` matchers once (`expect.extend`), so `toHaveNoViolations()` is available in every suite. No change to runtime code.

## Determinism contract

- Every suite: `beforeEach` resets (`localStorage.clear()`, store `__resetForTest()` where used) and `setMockFailRate(0)` (a forced fail rate is scoped to a single assertion when exercising error states). No reliance on real time/random in assertions (FR-QA-018 / SC-009).
