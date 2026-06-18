# Phase 1 Data Model: Design Fidelity & Signature Motion

This feature introduces **no new product data entities**. It operates on existing visual surfaces and adds presentation-only constructs. The "model" below documents those constructs (font set, motion vocabulary, primitive APIs, chart-motion specs) so implementation and tests share one reference.

## Brand Font Set (US1)

| Family token | Family | Weights (self-hosted, woff2, Latin) | Usage |
|---|---|---|---|
| `--font-display` | Schibsted Grotesk | 400, 500, 600, 700, 800 | headings (h1–h5) |
| `--font-ui` | Hanken Grotesk | 400, 500, 600, 700 | body, controls, labels |
| `--font-mono` | JetBrains Mono | 400, 500, 600 | code, IDs, metrics |

- Delivery: `@fontsource` per-weight imports → self-hosted woff2 assets (no CDN). `font-display: swap`.
- Fallback: the existing token stacks (`system-ui, sans-serif` / `ui-monospace, monospace`) render until loaded, with no layout-breaking shift.
- Invariant: families/weights identical across light and dark themes; app is visually correct fully offline.

## Motion Vocabulary (US2)

Keyframes in `globals.css` (✓ = already present, ➕ = added by this feature):

| Keyframe | State |
|---|---|
| `nx-fade-up` (fadeUp) | ✓ |
| `nx-shimmer` (shimmer) | ✓ |
| `fadeIn`, `scaleIn`, `slideInRight`, `barGrow`, `pulse`, `typing`, `ringDraw`, `checkPop`, `floatUp`, `rowIn`, `spin` | ➕ |

Invariant (FR-006): every keyframe's **resting state == completed state** (reduced-motion shows the final visual; no blank/zero/partial frame).

## Motion Primitive APIs (US2) — `components/motion`

```ts
// Existing (reused): PageFX, SectionReveal, StaggerRows, ChipCreate, CountUp
// Added:
RouteReveal({ children })        // route-keyed entrance; re-fires on pathname change; reduced-motion → none
ScaleIn({ children, delayMs? })  // scale/opacity entrance
SlideIn({ children, dir? })      // directional entrance; mirrors under RTL
CheckPop({ children })           // success confirmation pop
// StaggerRows cap: only the first 10 children stagger; index >= 10 → delay 0 (FR-012 / clarify Q1)
```

State/behavior: each primitive reads `useReducedMotion()`; when reduced, it renders children in final state with no animation. None block interaction (motion is non-blocking, FR-005/021).

## Chart Motion Specs (US3) — `components/charts`

| Primitive | Entrance motion | Reduced-motion final state |
|---|---|---|
| `Gauge` | arc draws (`ringDraw` via stroke-dashoffset) + central number `CountUp` | full arc at value + final number shown instantly |
| `DimensionBars` / `CoverageBars` | bars grow from baseline (`barGrow`/width) with bounded per-bar stagger | bars at final width, no stagger |
| `ContextRadar` / `FitRadar` / `ContextSignature` | shape `scaleIn`/`fadeIn` | shape at final scale/opacity |

Invariants: edge values 0/100/missing resolve to the exact final state with no glitch (FR-016); existing `aria-label` text alternatives retained (FR-017).

## Micro-interaction & Loading States (US4)

- `Button`, `Card`: consistent hover/press feedback (transform/shadow per `nx-lift`); visible keyboard focus indicator **independent of motion settings** (FR-020).
- `Skeleton`: brand-timed shimmer (`nx-shimmer`) matching `project/` colors/timing.
- Under reduced-motion: decorative movement suppressed; focus + state cues preserved.

## Validation & invariants (cross-cutting)

- **II** — typography, motion, and charts match `project/` within the fidelity bar (review).
- **XII** — all motion degrades to instant/opacity under reduced-motion; no shell parallax; focus visible regardless of motion.
- **XIII** — directional motion mirrors under RTL; bounded stagger keeps large lists usable.
- **I / perf** — fonts offline (no network); initial eager JS chunk stays ≤ 260 KB (Spec 009 `check-bundle`).
- **Scope** — no new product entities, screens, routes, scoring; set-pieces (Landing/Companion/Transform) excluded (FR-025).
