# Contract: Signature Motion (US2 / US3 / US4)

The reusable motion layer and its reduced-motion guarantees. All motion is purposeful, non-blocking, and degrades to instant/opacity; the application shell has no parallax (constitution XII).

## Keyframe vocabulary (`src/styles/globals.css`)

Complete the design's 13-keyframe set (2 exist): add `fadeIn, scaleIn, slideInRight, barGrow, pulse, typing, ringDraw, checkPop, floatUp, rowIn, spin`. **Invariant**: each keyframe's resting state equals its completed state, so the global `@media (prefers-reduced-motion: reduce)` rule yields the final visual (no blank/zero/partial frame) (FR-006).

## Primitive APIs (`src/components/motion`)

```ts
RouteReveal({ children })          // entrance keyed to route; re-fires on pathname change (FR-009/010)
SectionReveal({ children, delayMs?})
StaggerRows({ children, stepMs? }) // ONLY first 10 children stagger; rest delay 0 (FR-012 / clarify Q1)
ScaleIn({ children, delayMs? })
SlideIn({ children, dir? })        // mirrors under RTL
CheckPop({ children })
CountUp({ to, durationMs? })       // existing; reduced-motion → final value immediately
```

- Every primitive consults `useReducedMotion()`; when reduced, renders children in final state with no animation.
- Motion never blocks input/navigation (FR-005/021); signature motion is effectively skippable via reduced-motion.

## Shell integration (`src/components/layout`)

`RouteReveal` wraps `<Outlet/>` in all four shells (`AdminShell`, `UserShell`, `FullBleedShell`, `PublicShell`) → every routed screen reveals consistently. High-value screens additionally wrap sections/rows in `StaggerRows` (FR-011).

## Chart motion (`src/components/charts`)

`Gauge` (arc draw + count-up), `DimensionBars`/`CoverageBars` (grow + bounded stagger), `ContextRadar`/`FitRadar`/`ContextSignature` (scale/fade). Reduced-motion → final shape/value instantly; `aria-label`s preserved; edge values 0/100/missing correct (FR-013–017).

## Micro-interactions (`src/components/ui/primitives.tsx`)

`Button`/`Card` hover/press feedback; `Skeleton` brand-timed shimmer; visible keyboard focus **independent of motion settings** (FR-018–020).

## Tests (`tests/motion/`, `tests/charts/`)

- `RouteReveal` applies an entrance on mount and re-fires on pathname change; under reduced-motion no animation style is applied.
- `StaggerRows` staggers at most the first 10 children (11th+ have zero delay).
- Charts render their final shape/value under reduced-motion (no zero/blank start frame) and keep `aria-label`s.
- Reuse Spec 009 reduced-motion degradation + no-shell-parallax assertions.
