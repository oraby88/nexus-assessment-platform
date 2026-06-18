# Implementation Plan: Design Fidelity & Signature Motion

**Branch**: `010-design-fidelity-motion` | **Date**: 2026-06-16 | **Spec**: [`./spec.md`](./spec.md)

**Input**: Feature specification from `specs/010-design-fidelity-motion/spec.md`. Builds on delivered Specs 001–009 and the Tailwind adoption (`specs/0091-tailwind-css-adoption`). Visual + motion source of truth: `project/` (esp. `app/styles.css`, `app/ui.jsx`, `app/shell.jsx`, the report charts). Shared canon `specs/000-shared/*`; constitution `.specify/memory/constitution.md` (v2.0.0 — esp. I, II, XII, XIII).

## Summary

Close the **foundation** fidelity gap between the implemented frontend and the `project/` design source across four independently-shippable tracks, frontend/mock-only. (1) **Typography**: self-host the three brand families the tokens already name (Schibsted Grotesk 400–800, Hanken Grotesk 400–700, JetBrains Mono 400–600) as offline woff2 with graceful fallback, so every screen renders in brand type in both themes. (2) **Entrance reveals app-wide**: complete the signature keyframe vocabulary (11 of 13 keyframes are currently missing) and reusable motion primitives, and mount a route-keyed entrance reveal **centrally in the 4 shells** so all ~56 routed screens animate consistently; designated high-value screens add a bounded section/row stagger (only the first ~10 rows stagger). (3) **Chart motion**: the report `Gauge` draws its arc + counts up, `DimensionBars`/`CoverageBars` grow with bounded stagger, and `ContextRadar`/`FitRadar`/`ContextSignature` scale-fade in — each resolving to the exact final state under reduced-motion. (4) **Micro-interactions & loading**: consistent hover/press feedback on primitives and brand-timed skeleton shimmer, with focus visibility independent of motion. All motion is non-blocking and degrades to instant/opacity under `prefers-reduced-motion`; no shell parallax. The three cinematic set-pieces (Landing, Robot Companion, Transform Sequence) are explicitly **out of scope** (FR-025) — this plan only keeps the motion-primitive seams usable by them.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 18 (established Spec 001).

**Primary Dependencies**: No new **runtime** dependency. Fonts via `@fontsource` packages (build-time/devDependency that emits self-hosted woff2 assets — no CDN/network). Motion uses CSS keyframes + the existing reduced-motion-aware primitives (`PageFX`/`SectionReveal`/`StaggerRows`/`ChipCreate`/`CountUp`) plus rAF for count-up/arc-draw; GSAP (already in `package.json`) is **not** pulled into the foundation path and stays reserved for the deferred set-pieces.

**Storage**: None new. (No companion/preference state — the companion is out of scope.)

**Testing**: Vitest + RTL + `vitest-axe`. New: font-family resolution + graceful-fallback, route-keyed reveal fires per navigation, stagger cap (≤10 rows animate), chart reduced-motion final-state (no zero/blank start frame), micro-interaction focus visibility; reuse Spec 009 reduced-motion + no-shell-parallax checks and the Spec 008 release gate.

**Target Platform**: Evergreen desktop + tablet + mobile, light + dark themes, RTL reading order, fully **offline** (fonts self-hosted).

**Performance Goals**: 60fps-feel signature motion that never blocks input; initial eager JS chunk stays within the Spec 009 budget (**≤ 260 KB raw / ~85 KB gzip**) — fonts are separate cacheable assets (not JS), `font-display: swap`. Bounded list stagger so large collections are usable immediately.

**Constraints**: **NON-NEGOTIABLE** frontend/mock-only (I) — no backend/network, fonts offline; design fidelity to `project/` (II); purposeful, skippable, reduced-motion-safe motion with **no shell parallax** (XII); responsive + RTL preserved (XIII); WCAG 2.1 AA focus/contrast maintained; every quality gate (incl. the Spec 009 bundle budget) stays green. No new product screens/routes/data/scoring.

**Scale/Scope**: 3 self-hosted font families; ~11 keyframes added to complete the vocabulary; route reveal wired once per the 4 shells (covers ~56 screens); ~6 designated high-value screens add stagger; ~4 chart families animated; micro-interaction + shimmer polish on shared primitives; ~5 new test suites/cases. No feature screens added.

## Constitution Check

*GATE: must pass before Phase 0; re-checked after Phase 1.*

| Principle | How this feature complies | Gate |
|---|---|---|
| I Frontend First | No backend; fonts self-hosted/offline; no network; mock services untouched | PASS |
| II Design Fidelity | This feature's purpose — aligns typography + signature motion + charts to `project/` | PASS |
| III Two Roles Only | No role/scope change; polish is role-neutral | PASS |
| IV Service Boundaries | Presentation/motion only; no service, fixture, or persistence changes | PASS |
| V Governed Question Source | Unchanged; bank stays lazy | PASS |
| VI Immutable Metadata | No metadata/model changes | PASS |
| VII Controlled Adaptation | Unchanged | PASS (n/a) |
| VIII Question-Level Attribution | Unchanged; no scoring | PASS (n/a) |
| IX Safe Reporting | Motion/typography are display-only; charts keep accessible text alternatives; no restricted content surfaced | PASS |
| X Human Decision Support | Unchanged | PASS (n/a) |
| XI Domain 6 Transparency | Unchanged | PASS (n/a) |
| XII Accessibility & Motion | Core to the feature — reduced-motion → instant/opacity, no shell parallax, visible focus independent of motion, AA contrast both themes | PASS |
| XIII Responsive Runtime | Responsive + RTL preserved; directional motion mirrors under RTL; bounded stagger protects constrained devices | PASS |
| XIV Traceability | No service surface → handoff-map unaffected; plan consistent with `000-shared/*` and `project/` | PASS |
| XV Review Before Implementation | Stop for approval before `/speckit-implement` | PASS |

**Result**: No violations. Complexity Tracking empty.

## Project Structure

### Documentation (this feature)

```text
specs/010-design-fidelity-motion/
├── plan.md              # This file
├── research.md          # Phase 0 — font delivery, motion mechanism, reveal wiring, chart motion, budget
├── data-model.md        # Phase 1 — presentation constructs (font set, motion vocabulary, chart specs)
├── contracts/           # Phase 1
│   ├── typography.md        # font-face set, weights, fallback contract
│   └── motion.md            # motion-primitive component APIs + reduced-motion contract
├── quickstart.md        # Phase 1 — run + validation guide
└── checklists/
    └── requirements.md  # spec quality checklist (passing)
```

### Source Code (repository root — frontend app)

```text
frontend/
├── src/
│   ├── styles/
│   │   ├── fonts.css            # NEW: @font-face / @fontsource imports (self-hosted woff2)
│   │   ├── globals.css          # extend: add the ~11 missing keyframes (scaleIn, slideIn, barGrow,
│   │   │                        #         pulse, typing, ringDraw, checkPop, floatUp, rowIn, spin)
│   │   └── tokens.css           # unchanged (already names the three families)
│   ├── components/
│   │   ├── motion/index.tsx     # extend: RouteReveal (route-keyed), ScaleIn, SlideIn, CheckPop;
│   │   │                        #         keep PageFX/SectionReveal/StaggerRows/ChipCreate/CountUp
│   │   ├── charts/index.tsx     # add entrance motion to Gauge/Bars/Radar/Signature (reduced-safe)
│   │   ├── layout/index.tsx     # mount RouteReveal around <Outlet/> in the 4 shells (FR-009/010)
│   │   └── ui/primitives.tsx    # hover/press feedback + shimmer timing; focus unaffected
│   └── features/                # designated high-value screens add section/row stagger (FR-011)
tests/
├── typography/   # brand-family resolution + graceful fallback (offline)
├── motion/       # route reveal fires per nav; stagger cap; reuse reduced-motion + no-parallax
└── charts/       # chart entrance + reduced-motion final-state (no zero/blank frame)
```

**Structure Decision**: Keep all work in the existing `frontend/` app. Typography is a new `styles/fonts.css` (self-hosted via `@fontsource`) referenced once; the keyframe vocabulary is completed in `globals.css`; reusable motion lives in `components/motion`; the **single** integration point for app-wide reveals is the 4 shells' `<Outlet/>` wrapper in `components/layout/index.tsx` (so no per-screen edits for the base reveal). Chart motion is added inside `components/charts`. High-value screens opt into stagger via the shared primitives. The Spec 009 `check-bundle.mjs` gate guards the budget; new tests live under `tests/{typography,motion,charts}`.

## Complexity Tracking

No constitution violations. No new runtime dependency: `@fontsource` is a build-time asset source (self-hosted woff2, offline), and motion reuses CSS keyframes + existing primitives rather than adding a runtime animation engine to the foundation path — keeping the initial-bundle budget intact (constitution "no heavy dependency without justification").
