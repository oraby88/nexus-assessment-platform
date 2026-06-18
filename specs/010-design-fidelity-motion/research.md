# Phase 0 Research: Design Fidelity & Signature Motion

The two `/speckit-clarify` decisions (Session 2026-06-16) are recorded in `spec.md`; this file captures the technical decisions that follow plus the patterns reused from the existing codebase and the `project/` source. No open `NEEDS CLARIFICATION` remain.

## D1 — Font delivery: self-hosted woff2 via `@fontsource` (US1)

- **Decision**: Self-host the three families the tokens already name using the `@fontsource` packages — `@fontsource/schibsted-grotesk` (400/500/600/700/800), `@fontsource/hanken-grotesk` (400/500/600/700), `@fontsource/jetbrains-mono` (400/500/600). Import the needed weight stylesheets once from a new `src/styles/fonts.css` (or the app entry). Vite emits the woff2 as hashed, cacheable **assets** (not JS). Use `font-display: swap` (the `@fontsource` default) for graceful fallback to the existing `system-ui`/`ui-monospace` stacks already in the tokens.
- **Rationale**: All three are open-licensed (OFL) and self-hostable; the design source only loaded them via a Google Fonts CDN `@import`, which violates the offline/no-network constraint (constitution I). `@fontsource` gives offline woff2 + Latin subset without manual subsetting, and the font files do not enter the eager JS chunk (the Spec 009 ≤260 KB JS budget is unaffected).
- **Alternatives considered**: Runtime Google Fonts CDN (rejected — network dependency, constitution I); manual woff2 files + hand-written `@font-face` (more maintenance, easy to get weights/format wrong); variable fonts (only some families ship variable; per-weight static woff2 is simplest and matches the clarified weight set).

## D2 — Motion mechanism: CSS keyframes + existing reduced-motion-aware primitives (US2)

- **Decision**: Complete the signature vocabulary by adding the ~11 missing keyframes to `globals.css` (the design has 13; only `nx-fade-up` and `nx-shimmer` exist): `scaleIn`, `slideInRight`, `barGrow`, `pulse`, `typing`, `ringDraw`, `checkPop`, `floatUp`, `rowIn`, `spin` (+ `fadeIn`). Expose reusable React primitives in `components/motion` — extend the existing `PageFX`/`SectionReveal`/`StaggerRows`/`ChipCreate`/`CountUp` with `RouteReveal`, `ScaleIn`, `SlideIn`, `CheckPop`. Each primitive gates on the existing `useReducedMotion()` and the global `@media (prefers-reduced-motion: reduce)` rule already in `globals.css`. **Resting (un-animated) styles must equal the completed state** so disabling motion never leaves a blank/partial visual (FR-006).
- **Rationale**: CSS keyframes + rAF (for count-up/arc-draw) keep the foundation motion dependency-free and within budget; GSAP stays out of the eager path. Reuses the established reduced-motion seam from Spec 001/009.
- **Alternatives considered**: Routing all motion through GSAP (heavier eager bundle; unnecessary for foundation reveals — reserve GSAP for the deferred cinematic set-pieces); a new animation library (rejected — no justification, budget risk).

## D3 — App-wide entrance reveal wired centrally in the shells (US2)

- **Decision**: Mount a route-keyed `RouteReveal` wrapper around the `<Outlet/>` in each of the 4 shells (`AdminShell`, `UserShell`, `FullBleedShell`, `PublicShell` in `components/layout/index.tsx`), keyed to `useLocation().pathname` so it **re-fires on every route change** (FR-009/010). This covers all ~56 routed screens without editing each screen. High-value screens (admin dashboard; admin + user reports; the users/assessments/reports list screens — per spec Assumptions) additionally wrap their primary sections/rows in `StaggerRows`.
- **Rationale**: One integration point per shell = consistent coverage + minimal surface area; matches the design's "every screen reveals" intent. Keying on pathname is the standard React Router re-mount trigger.
- **Alternatives considered**: Per-screen `PageFX` (status quo — only ~1 of 56 wired, inconsistent, high edit cost); a router-level transition wrapper (more complex, and the shells already render the outlet).

## D4 — Bounded list/row stagger (US2, clarified)

- **Decision** (clarify Q1): Only the **first ~10 rows** of a list stagger their entrance; all remaining rows appear together immediately. Implement as a cap inside `StaggerRows` (index < 10 → incremental delay; else delay 0).
- **Rationale**: Predictable, testable, and keeps large collections usable instantly (FR-012) without per-list duration recomputation. Preserves the "brief incremental stagger" feel for the visible head of the list.
- **Alternatives considered**: Total-duration cap (needs row-count-aware delay math); viewport-only stagger (needs intersection tracking — more complex); unbounded per-row delay (rejected — long lists stall).

## D5 — Chart entrance motion, reduced-motion-safe (US3)

- **Decision**: Animate the existing chart primitives in `components/charts`:
  - `Gauge` — draw the arc to its value (`ringDraw` via `stroke-dashoffset` from full circumference → target) and `CountUp` the central number.
  - `DimensionBars`/`CoverageBars` — grow from baseline (`barGrow`/width transition) with a bounded per-bar stagger.
  - `ContextRadar`/`FitRadar`/`ContextSignature` — `scaleIn`/`fadeIn` entrance of the shape.
  - Under reduced-motion every chart renders its **final** shape/value immediately (no zero/blank start frame), and all existing `aria-label` alternatives are preserved (FR-016/017). Edge values 0/100/missing resolve to the correct final state.
- **Rationale**: Charts are the product's emotional peak (the report); the primitives already expose the values and SVG geometry, so motion is additive and reduced-motion degradation is a matter of starting at the final frame.
- **Alternatives considered**: Canvas/charting library (rejected — hand-built SVG is the constitution's choice and already in place); animating via JS timers (rAF/CSS preferred for smoothness).

## D6 — Micro-interactions & loading polish (US4)

- **Decision**: Apply consistent hover/press feedback to shared primitives (`Button`, `Card`) using the design's `nx-lift` transition feel (transform/shadow on hover, subtle press), and align the skeleton `Skeleton`/shimmer to the brand timing/colors (`nx-shimmer` exists — verify token colors + duration match `project/`). Keyboard focus indicators remain visible and are **independent of motion settings** (FR-020). Decorative motion is suppressed under reduced-motion while focus/state cues remain.
- **Rationale**: Tactile feedback raises perceived quality at low risk; reuses existing primitives and tokens.
- **Alternatives considered**: Per-component bespoke hover styles (inconsistent; centralize on the primitives instead).

## D7 — Budget, RTL, and gate integration (cross-cutting)

- **Decision**: Fonts ship as separate assets (not JS) so the Spec 009 `scripts/check-bundle.mjs` ≤260 KB **JS** budget is unaffected; the gate continues to enforce it. Directional motion (`slideInRight`) mirrors under RTL by using logical/`dir`-aware direction (or a mirrored keyframe when `dir="rtl"`); inherently directional glyphs are exempt (consistent with Spec 009 RTL). New tests under `tests/{typography,motion,charts}` join the Spec 008 `release-gate`; reuse the Spec 009 reduced-motion and no-shell-parallax assertions.
- **Rationale**: Keeps determinism and the single gate authoritative (SC-006/SC-007 equivalent: release gate stays green).
- **Alternatives considered**: Adding fonts to a JS-imported module (would inflate the JS chunk — rejected).

## D8 — Out-of-scope seams preserved (FR-025)

- **Decision**: The Landing cinematic, Robot Companion, and Discovery→Assessment Transform Sequence are **not** implemented here. The motion primitives, `useReducedMotion`, and keyframe vocabulary are authored so those later features can consume them without rework.
- **Rationale**: Keeps this feature a clean, shippable foundation slice (spec scope) while not blocking the deferred set-pieces.
- **GSAP usage policy (decided 2026-06-16)**: GSAP (already a dependency, constitution-approved for signature motion) is used **only** for heavy set-pieces and **lazy-loaded** so it never enters the eager shell bundle — the app-wide foundation (reveals, charts, micro-interactions) stays on CSS keyframes to protect the ≤260 KB initial-JS budget (FR-013/SC-007). The external `gsap-animated-frontend` agent-skill workflow was evaluated and **not adopted** (it would run a parallel `.gsap/` workflow outside Spec Kit and implies the same eager-GSAP budget risk); we drive motion through the Spec Kit flow instead.
