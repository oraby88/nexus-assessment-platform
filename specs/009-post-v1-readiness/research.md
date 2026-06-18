# Phase 0 Research: Post-V1 Readiness

The four `/speckit-clarify` decisions (Session 2026-06-16) are recorded in `spec.md`; this file captures the technical decisions that follow plus the patterns reused from the existing codebase. No open `NEEDS CLARIFICATION` remain.

## D1 — Service contracts + data-source boundary (US1)

- **Decision** (clarify Q2 = A): Add `services/contracts.ts` defining a typed interface per service (mirroring today's mock service signatures — the de-facto API). Each mock service is asserted to conform with `satisfies <Contract>` (compile-time, no runtime cost). Add `services/dataSource.ts` exposing `getMode(): 'mock' | 'live'` (default `mock`, overridable via an env/config flag and a dev-only localStorage key) and a selector the aggregator uses. Add `services/live/liveStub.ts` — a `live` implementation whose every method throws `Error('live data source not wired in V1')`. `services/index.ts` routes exports through the selector: `mock` returns today's services unchanged; `live` returns the stub.
- **Rationale**: Components already import from `@/services`, so this is a drop-in seam — the future backend replaces `liveStub` without touching UI (constitution IV; "API swap MUST NOT require a UI rewrite"). The throwing stub proves the path with zero network (constitution I).
- **Alternatives considered**: Per-call `fetch` live adapter (implies backend work; rejected per clarify Q2); wrapping every method in a runtime guard (heavier, redundant with the selector).

## D2 — Keeping the handoff map in sync (US1)

- **Decision**: The contract interfaces are the single source of truth; `specs/000-shared/handoff-map.md` references each contract method → future API responsibility. A test asserts every exported service name has a corresponding contract interface (catches drift).
- **Rationale**: Traceability (XIV) without manual divergence.
- **Alternatives considered**: Doc-only mapping (drifts); codegen (overkill for a prototype).

## D3 — In-house i18n (US2)

- **Decision** (clarify Q1 = A): `src/i18n/` with `catalog.ts` (`Record<Locale, Record<Key, string>>` for `en` + one RTL locale, e.g. `ar`), a `LocaleProvider` (context + persisted locale via a versioned localStorage key, mirroring `themeStore`), and `useT()` returning `t(key, vars?)` that looks up the active locale, falls back to the default locale on a missing key (never returns a raw key/blank), and interpolates simple `{var}` placeholders. Date/number formatting uses the built-in `Intl` APIs keyed to the active locale. `LocaleProvider` sets `document.documentElement.dir = 'rtl'|'ltr'` and `lang`.
- **Rationale**: No runtime dependency (constitution "no heavy dependency without justification"); `Intl` is built-in; pattern matches the existing theme store/hook.
- **Alternatives considered**: `react-i18next` / `react-intl` (runtime deps; richer but unnecessary for a prototype — rejected per clarify Q1).

## D4 — i18n retrofit scope (US2)

- **Decision** (clarify Q3 = A): Wrap user-facing copy with `useT()` on the **priority surfaces** — auth/recovery (`features/auth`), assessment runtime (`features/runtime`), Admin dashboard + User dashboard, and Profile & Privacy. Other surfaces keep literal copy and adopt `useT()` incrementally later. Keys are namespaced by surface (e.g., `auth.signIn`).
- **Rationale**: Demonstrates end-to-end localization on high-traffic journeys without an exhaustive string sweep (bounded, testable — SC-004/005).
- **Alternatives considered**: Full retrofit (B — disproportionate); single POC screen (C — too thin).

## D5 — RTL handling (US2)

- **Decision**: Drive direction from `dir` on `<html>`; rely on logical CSS where feasible and mirror the few directional inline styles on priority surfaces. Charts/icons that are inherently directional are exempted explicitly. A test sets the RTL locale and asserts `document.dir === 'rtl'` and that a priority surface still renders its key controls.
- **Rationale**: Minimal, standards-based RTL; avoids a invasive CSS rewrite.
- **Alternatives considered**: Full logical-property refactor of all CSS (out of scope for V1 priority-surface goal).

## D6 — Design fidelity & motion audit (US3)

- **Decision**: Audit priority surfaces against `project/` for token/typography/spacing/theming parity; fix deviations in the token layer/components (no new surfaces). Verify signature motion (e.g., `CountUp`, reveal transitions) communicates state, is skippable/non-blocking, and degrades under `prefers-reduced-motion` (reuse `useReducedMotion`); confirm no parallax in the shell. Add/extend motion tests on the priority surfaces.
- **Rationale**: Polish to the design source (II) + motion safety (XII) without scope creep; deeper fidelity work reserved for `010`.
- **Alternatives considered**: Full visual redesign (out of scope); pixel-diff snapshotting (brittle in jsdom — use review + token assertions instead).

## D7 — Bundle budget enforcement (US4)

- **Decision** (clarify Q4 = A): Add `scripts/check-bundle.mjs` that, after `vite build`, sums the **initial eager** JS (the entry `index-*.js` chunk(s) not lazy-loaded), gzip-sizes it via `zlib`, and fails if raw > 260 KB (~85 KB gzip). Wire `check:bundle` into `release-gate` after `vite build`. A `tests/perf` assertion also confirms the governed bank and feature routes are separate chunks (extends Spec 008's static lazy check).
- **Rationale**: Concrete, enforceable ceiling (SC-007) using built-ins only; complements the existing lazy-seam test.
- **Alternatives considered**: `rollup-plugin-visualizer`/size-limit (extra deps); in-test bundle parsing (can't build inside Vitest).

## D8 — Determinism & gate integration

- **Decision**: All new tests reset state + `setMockFailRate(0)` in `beforeEach`; the bundle check runs post-build in `release-gate` (not in Vitest). `release-gate` becomes: `tsc -b && vitest run && eslint && format:check && vite build && node scripts/check-bundle.mjs`.
- **Rationale**: Keeps the suite deterministic (SC-008) and the budget enforced in the single gate.
- **Alternatives considered**: Running the size check as a Vitest test (needs a prior build artifact — fragile ordering).
