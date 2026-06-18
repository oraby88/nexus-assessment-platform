# Quickstart & Validation: Post-V1 Readiness

Hardens the delivered app across four tracks, staying frontend/mock-only and deterministic. Details live in `data-model.md`, `contracts/data-source.md`, and `contracts/i18n.md`.

## Prerequisites

- The existing `frontend/` app (Specs 001–008 present). From repo root: `cd frontend`. No new runtime dependencies.

## Quality gates (extended)

```bash
cd frontend
npx tsc -b                 # contracts enforced via `satisfies`
npm run test               # incl. integration-seam / i18n / motion / perf suites
npx eslint . --ext .ts,.tsx
npm run format:check
npm run build              # production build
npm run check:bundle       # initial eager chunk ≤ 260 KB raw (~85 KB gzip)
npm run release-gate       # all of the above, fail-fast, single result
```

## Story validation

### US1 — Swap-ready seam (P1, MVP)
- `tsc -b` passes → every mock service `satisfies` its contract.
- `npm run test -- tests/integration-seam` → default `mock` resolves as today; selecting `live` rejects with "not wired in V1" through the same interface (no network); every service has a contract (drift guard).
- ✅ Pass: contracts enforced; mode switch needs 0 UI changes; mock default (SC-001/002/003).

### US2 — i18n & localization (P2)
- Run the app; switch language in Profile → priority surfaces (auth/recovery, runtime, dashboards, profile) re-render translated copy; reload → choice persists.
- `npm run test -- tests/i18n` → missing-key fallback; RTL sets `document.dir='rtl'`; locale date/number formatting.
- ✅ Pass: localization works with fallback + RTL (SC-004/005).

### US3 — Design fidelity & motion (P2)
- Compare priority surfaces to `project/` (tokens/typography/theming) at review.
- `npm run test -- tests/motion` → signature motion degrades to instant under reduced-motion; no shell parallax.
- ✅ Pass: fidelity bar met; motion safe (SC-006).

### US4 — Performance & bundle (P3)
- `npm run build && npm run check:bundle` → initial eager chunk ≤ 260 KB raw (~85 KB gzip); governed bank + routes are separate lazy chunks.
- `npm run test -- tests/perf` → lazy-chunk seam asserted.
- ✅ Pass: budget enforced; heavy assets lazy (SC-007).

### Determinism
- `npm run test` three times → identical results; 0 external network requests (SC-008).

## Implementation notes (Spec 009)

### Bundle baseline & budget (US4)
- Measured production build: initial **eager** chunk `dist/assets/index-*.js` = **254.6 KB raw / 80.5 KB gzip** — within the **≤ 260 KB raw (~85 KB gzip)** budget (FR-PVR-012).
- Lazy chunks confirmed separate: `governed-bank-*.js`, all feature route screens (`AssessmentRuntime`, `AdminReport`, `CreateAssessmentWizard`, dashboards, etc.), and secondary `index-*` route chunks — none in the eager set.
- Enforced by `scripts/check-bundle.mjs` (parses `dist/index.html` for the entry + `modulepreload` set; gzips via `node:zlib`), wired into `release-gate`.

### Design fidelity & motion audit (US3)
- Priority surfaces (auth, runtime, both dashboards, profile/privacy) consume the CSS-variable token system (`var(--…)`) — no hard-coded colors/spacing introduced; theming follows `data-theme`.
- Signature motion is already reduced-motion-safe: `CountUp` renders its final value instantly, and `PageFX`/`SectionReveal`/`StaggerRows`/`ChipCreate` apply no animation under `prefers-reduced-motion` (per-component `useReducedMotion` + the global `@media (prefers-reduced-motion: reduce)` rule in `globals.css`). No shell parallax / fixed-attachment backgrounds exist (asserted by `tests/motion/no-parallax.test.ts`). No repair was required.

### Re-render / responsiveness scan (US4 / FR-PVR-014)
- Priority flows (auth → runtime → dashboards) load data once via `useAsync` and hold local component state; no re-render loops or long blocking tasks were observed. The runtime auto-save is non-blocking (optimistic local state). No targeted memoization changes were needed.

## Done = `npm run release-gate` (incl. `check:bundle`) is green + all four stories validated + every `tasks.md` item `[X]`.
