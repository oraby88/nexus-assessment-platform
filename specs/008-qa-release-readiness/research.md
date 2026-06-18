# Phase 0 Research: QA & Release-Readiness Gates

The three `/speckit-clarify` decisions (Session 2026-06-16) are recorded in `spec.md`; this file captures the technical decisions that follow plus the patterns reused from the existing harness. No open `NEEDS CLARIFICATION` remain.

## D1 — Automated accessibility checks (vitest-axe)

- **Decision** (clarify Q1 = A): Add `vitest-axe` (wrapping `axe-core`) as a test-only dev dependency. Register its matchers once in `src/test/setup.ts` (`expect.extend(matchers)` / `import 'vitest-axe/extend-expect'`). Each priority-flow test renders the flow and asserts `expect(await axe(container)).toHaveNoViolations()`, scoped to **critical/serious** rules. Complement with RTL keyboard assertions (tab/focus-visible, dialog focus-trap/Escape) and reduced-motion assertions (mock `prefers-reduced-motion`).
- **Rationale**: The constitution explicitly names axe; a real WCAG engine catches label/role/contrast/landmark issues hand-rolled checks miss. Test-only → no runtime/bundle impact (constitution I).
- **Alternatives considered**: Hand-rolled RTL-only assertions (weaker, partial); a browser-based runner like Playwright+axe (heavier, out of frontend-only/mock scope for V1).

## D2 — Priority-flow rendering for a11y

- **Decision**: Render each priority flow's key screen(s) in isolation under `MemoryRouter` + `SessionProvider` (the established component-test pattern), seeding the session via `writeKey(StorageKeys.session, …)` where a role guard applies. Flows: sign-in/recovery (`AdminLogin`/`ForgotPassword`/`ResetPassword`), runtime (`AssessmentRuntime` with each of the five renderers), Create Assessment (wizard entry), report viewing (`UserReport` + `AdminReport`).
- **Rationale**: Reuses the exact harness all component tests already use; deterministic with controlled mock latency.
- **Alternatives considered**: Full router mount (more brittle, slower); snapshot testing (doesn't assert a11y).

## D3 — Consolidated governance invariant suite

- **Decision** (clarify Q3 = A): A single `tests/governance/invariants.test.tsx` with one clearly-labelled assertion per invariant, reusing services/helpers: (VIII) no live score — scan rendered runtime/User report text for score tokens + assert responses keyed by source id; (IX/III) `reportService.getUserSafe` exposes no restricted keys; (XI) blocked Derailment Risk never rendered as data; (X) comparison has no ranking/auto-decision + disclaimer present; (V) `selectEligible`/governance excludes blocked/quarantine/non-operational; (VI) governance/models don't fabricate weight/difficulty; (IV) static check that no component imports `@/mocks`/persistence. Existing per-spec tests remain.
- **Rationale**: Makes SC-001 ("≥1 passing assertion each") auditable in one file; catches any invariant lacking explicit coverage.
- **Alternatives considered**: Curate-only mapping (B) — relies on scattered tests, easy to miss a gap; hybrid (C) — harder to read at a glance.

## D4 — Service-boundary / no-fixture-import check

- **Decision**: Extend the existing `tests/unit/import-boundary.test.ts` approach — statically scan `src/features/**` and `src/components/**` source for imports of `@/mocks` or `@/services/persistence` and assert none. Reference it from the governance suite for FR-QA-008/006.
- **Rationale**: Reuses a proven static check; deterministic and fast.
- **Alternatives considered**: Runtime interception (overkill); ESLint rule (heavier config; the static test already exists).

## D5 — End-to-end journeys on mocks

- **Decision**: `tests/journeys/end-to-end.test.tsx` drives each journey at the **service + key-screen transition** level (not a full pixel walkthrough): assert each step's service resolves and the expected artifact appears (assignment created, report retrievable, consent change persisted, export-history entry recorded, runtime submit → completion). Use `setMockFailRate(0)` and the existing services.
- **Rationale**: Proves "no dead ends + expected artifacts" deterministically without a brittle full-DOM crawl; complements the per-screen component tests already in place.
- **Alternatives considered**: Full UI click-through of every screen (slow, flaky in jsdom); E2E browser tooling (out of scope).

## D6 — Route / state / responsive coverage

- **Decision**: `tests/coverage/routes-states.test.tsx` asserts (a) every route in the route map maps to a guarded element with a title, (b) a representative set of screens renders an in-language empty and error state when their service returns empty / `setMockFailRate(1)`, and (c) responsive behavior is exercised via the `useViewport` breakpoints (mock `innerWidth`). Full per-screen a11y is out of scope (priority flows only); state/route coverage spans the catalog.
- **Rationale**: Balances breadth (route/state catalog) with depth (a11y on priority flows) per the spec's stated scope.
- **Alternatives considered**: Exhaustive a11y on every screen (disproportionate for V1).

## D7 — Single aggregate gate + format:check

- **Decision** (clarify Q2 = A): Add `"release-gate": "tsc -b && vitest run && eslint . --ext .ts,.tsx && npm run format:check && vite build"` and `"format:check": "prettier --check \"src/**/*.{ts,tsx,css}\" \"tests/**/*.{ts,tsx}\""` to `package.json`. Fail-fast `&&` chaining means the first failing step is the attributed gate and the run is non-green.
- **Rationale**: One runnable command; clear attribution; reuses existing tooling; no CI provisioning (frontend-only).
- **Alternatives considered**: A Node summary runner (B) — nicer table but more code; documented-sequence-only (C) — not a single command, weaker guarantee.

## D8 — Performance guardrail verification

- **Decision**: Verify (a) no fixture imports in components (D4 static check) and (b) the governed bank is a separate lazy chunk — asserted by the existing `questionBankService` dynamic import (`await import('@/mocks/governed-bank')`) and confirmed in the build output (documented in quickstart; the build already emits a `governed-bank-*.js` chunk).
- **Rationale**: The lazy seam already exists (Risk R18); this feature verifies and documents it rather than re-architecting.
- **Alternatives considered**: Bundle-analyzer assertion in-test (brittle across builds) — left to the documented build-output check.

## D9 — Determinism

- **Decision**: All suites set `setMockFailRate(0)` (or a forced rate only within a scoped assertion) and `localStorage.clear()` / store `__resetForTest()` in `beforeEach`; no `Date.now()`/random reliance in assertions. The mock HTTP layer uses deterministic jitter already.
- **Rationale**: Satisfies SC-007/009 (identical results across runs; 0 external requests).
- **Alternatives considered**: None — determinism is a hard requirement.
