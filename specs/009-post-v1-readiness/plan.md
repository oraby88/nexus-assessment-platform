# Implementation Plan: Post-V1 Readiness (Integration Seam, i18n, Design Fidelity, Performance)

**Branch**: `009-post-v1-readiness` | **Date**: 2026-06-16 | **Spec**: [`./spec.md`](./spec.md)

**Input**: Feature specification from `specs/009-post-v1-readiness/spec.md`. Builds on delivered Specs 001–008: the `@/services` aggregator (the existing component↔data boundary), `mockRequest`/`http.ts`, versioned `persistence.ts`, `useTheme`/`useReducedMotion`/`useViewport` hooks, the CSS-variable token system + hand-built primitives, the lazy governed-bank seam, and the Spec 008 `release-gate`. Shared canon `specs/000-shared/*`; constitution `.specify/memory/constitution.md` (v2.0.0 — esp. I/II/IV/XII/XIII). Visual source of truth: `project/`.

## Summary

Four post-V1 hardening tracks, all **frontend/mock-only** (constitution I), each an independently-testable user story. (1) **Swap-ready seam**: define a typed **contract interface per service**, assert the mock services satisfy them, and add a single **data-source boundary** with a runtime `mode` (`mock` default; a **stub `live` adapter that throws "not wired in V1"**) — components keep importing from `@/services`, so the future backend swaps in with no UI rewrite; keep the handoff map in sync. (2) **i18n**: a lightweight in-house keyed **message catalog** (`en` + one RTL locale, default fallback) behind a `LocaleProvider` + `useT()` hook + persisted locale store, `dir`-aware layout, locale date/number formatting, retrofitted onto the **priority surfaces** (auth/recovery, runtime, both dashboards, Profile & Privacy). (3) **Design fidelity & motion**: a token/typography/theming fidelity pass against `project/` + verify signature motion is purposeful, skippable, and reduced-motion-safe (no shell parallax). (4) **Performance**: enforce an **initial eager-chunk budget ≤ 260 KB raw (~85 KB gzip)** via a post-build size check, confirm heavy routes/assets (incl. the governed bank) are lazy chunks, and keep priority flows free of re-render/long-task jank. Quality gates (incl. the Spec 008 `release-gate`) stay green.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 18 (established by Spec 001).

**Primary Dependencies**: **No new runtime dependencies** (i18n is in-house per clarify Q1). Build/test only: a small Node size-check script (`scripts/check-bundle.mjs`) using built-in `fs`/`zlib`; existing Vitest + RTL + `vitest-axe`.

**Storage**: Browser `localStorage` (mock) only — adds a persisted locale preference (versioned key) alongside theme. The data-source `mode` is config/env-driven (default `mock`). No real persistence/network.

**Testing**: Vitest + RTL. New: contract-conformance (mock services `satisfies` their contracts; `live` stub throws), data-source mode switch (mock default; live routes through boundary), i18n (language switch persists; missing-key fallback; RTL `dir`; locale formatting), motion (reduced-motion degradation on priority surfaces), and a bundle-budget assertion (post-build size check). Reuses Spec 008 suites.

**Target Platform**: Evergreen desktop + tablet + mobile, both themes, plus RTL reading order.

**Project Type**: Web frontend — cross-cutting hardening; no new product screens/routes.

**Performance Goals**: Initial eager JS ≤ 260 KB raw (~85 KB gzip), no-regression ceiling over the ~242 KB baseline; 60fps; reduced-motion honored; deterministic tests, 0 external network.

**Constraints**: **NON-NEGOTIABLE** frontend/mock-only (I) — `live` adapter is a throwing stub, no real network/auth/backend; service boundary preserved (IV) — components consume `@/services` contracts only, never fixtures/persistence; design fidelity to `project/` (II); purposeful, skippable, reduced-motion-safe motion, no shell parallax (XII); responsive + RTL (XIII). i18n adds no runtime dependency.

**Scale/Scope**: ~service contracts for the existing service set; 1 data-source boundary + `live` stub; i18n framework + ~5 priority-surface retrofits + 2 locales; a fidelity/motion audit pass; 1 bundle-budget script; ~5 new test suites. No feature screens added.

## Constitution Check

*GATE: must pass before Phase 0; re-checked after Phase 1.*

| Principle | How this feature complies | Gate |
|---|---|---|
| I Frontend First | No backend; `live` adapter is a throwing stub; i18n in-house; mock remains default; no real network | PASS |
| II Design Fidelity | Fidelity pass aligns surfaces to `project/` tokens/typography/theming/motion | PASS |
| III Two Roles Only | No role/scope changes; localization/seam are role-neutral | PASS |
| IV Service Boundaries | Typed contracts + single adapter boundary strengthen the existing component↔service boundary; no fixture/persistence imports in components | PASS |
| V Governed Question Source | Unchanged; governed bank stays lazy and excluded from initial chunk | PASS |
| VI Immutable Metadata | No metadata changes; contracts type the existing read-only shapes | PASS |
| VII Controlled Adaptation | Unchanged | PASS (n/a) |
| VIII Question-Level Attribution | Unchanged; no scoring introduced | PASS |
| IX Safe Reporting | Unchanged; localization must not surface restricted content (catalog is display copy only) | PASS |
| X Human Decision Support | Unchanged | PASS (n/a) |
| XI Domain 6 Transparency | Unchanged | PASS (n/a) |
| XII Accessibility & Motion | Motion audit keeps reduced-motion degradation + no shell parallax; RTL improves a11y | PASS |
| XIII Responsive Runtime | Responsive preserved; RTL added; bundle budget protects load on constrained devices | PASS |
| XIV Traceability | Handoff map kept in sync with contracts; plan consistent with `000-shared/*` | PASS |
| XV Review Before Implementation | Stop for approval before `/speckit-implement` | PASS |

**Result**: No violations. Complexity Tracking empty.

## Project Structure

### Documentation (this feature)

```text
specs/009-post-v1-readiness/
├── plan.md              # This file
├── research.md          # Phase 0 — seam pattern, i18n design, fidelity/motion approach, bundle check
├── data-model.md        # Phase 1 — ServiceContract, DataSourceMode, Locale/MessageCatalog, BundleBudget
├── contracts/           # Phase 1
│   ├── data-source.md        # contract interfaces + adapter boundary + mode switch
│   └── i18n.md               # catalog shape, useT() API, locale store, RTL rules
├── quickstart.md        # Phase 1 — run + validation guide (incl. mode switch + budget check)
└── checklists/
    └── requirements.md  # spec quality checklist (from /speckit-specify, /speckit-clarify)
```

### Source Code (repository root — frontend app)

```text
frontend/
├── src/
│   ├── services/
│   │   ├── contracts.ts          # typed contract interface per service (the de-facto API)
│   │   ├── dataSource.ts         # mode (`mock` default | `live` stub-that-throws) + selector
│   │   ├── live/liveStub.ts      # `live` adapter: throws "not wired in V1" for every method
│   │   └── index.ts              # aggregator routes through dataSource; mock services `satisfies` contracts
│   ├── i18n/
│   │   ├── catalog.ts            # keyed messages: en + one RTL locale (e.g., ar)
│   │   ├── LocaleProvider.tsx    # provider + persisted locale store + `dir` on <html>
│   │   └── useT.ts               # t(key, vars?) with default-locale fallback + locale date/number format
│   ├── hooks/                    # (locale hook re-exported; reuse useReducedMotion/useTheme)
│   └── components|features/      # priority-surface retrofits use useT(); fidelity/motion polish
├── scripts/check-bundle.mjs      # post-build initial-chunk size check vs budget (fs + zlib gzip)
├── package.json                  # add `check:bundle`; extend `release-gate`
tests/
├── integration-seam/   # contract conformance + mode switch (mock default; live throws)
├── i18n/               # language switch persist, fallback, RTL dir, locale formatting
├── motion/             # reduced-motion degradation on priority surfaces
└── perf/               # bundle-budget assertion (reads dist after build) + lazy-chunk presence
```

**Structure Decision**: Keep `@/services` as the **single boundary** components already use; introduce `contracts.ts` (interfaces the mock services `satisfies`), `dataSource.ts` (mode selector, `mock` default), and a `live/liveStub.ts` that throws — so the aggregator can route by mode without any component change (FR-PVR-001/002). i18n is a self-contained `src/i18n/` module (no runtime dep) with a `LocaleProvider` mounted once in `App`, retrofitted onto priority surfaces via `useT()`. The bundle budget is enforced by a tiny `scripts/check-bundle.mjs` wired into `release-gate` (the perf test asserts lazy chunks; the script asserts the ≤260 KB ceiling). Design fidelity/motion is an audit-and-tighten pass on existing components (no new surfaces), with a deeper dedicated `010` follow-up reserved.

## Complexity Tracking

No constitution violations. The data-source boundary adds one indirection layer, justified by the constitution's "API swap MUST NOT require a UI rewrite" mandate (IV) — it replaces ad-hoc future refactoring with a typed seam now. No runtime dependencies added.
