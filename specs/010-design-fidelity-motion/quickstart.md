# Quickstart & Validation: Design Fidelity & Signature Motion

Raises the delivered app to foundation-level visual + motion parity with `project/`, frontend/mock-only and deterministic. Details live in `data-model.md`, `contracts/typography.md`, and `contracts/motion.md`.

## Prerequisites

- The existing `frontend/` app (Specs 001–009 + `0091` Tailwind present). From repo root: `cd frontend`.
- One build-time addition: the `@fontsource` font packages (self-hosted woff2; no runtime/CDN dependency).

## Quality gates (extended)

```bash
cd frontend
npx tsc -b
npm run test               # incl. typography / motion / charts suites
npx eslint . --ext .ts,.tsx
npm run format:check
npm run build
npm run check:bundle       # initial eager JS ≤ 260 KB (fonts are separate assets)
npm run release-gate       # all of the above, fail-fast
```

## Story validation

### US1 — Brand typography (P1)
- Run the app offline (no network). Inspect a heading, body text, and a mono element → they resolve to Schibsted Grotesk / Hanken Grotesk / JetBrains Mono (not a system fallback), in both light and dark themes.
- `npm run test -- tests/typography` → brand family resolves; graceful fallback path holds; no external font request.
- ✅ Pass: brand type everywhere, offline, both themes (SC-001/002).

### US2 — Entrance reveals app-wide (P1)
- Navigate across admin + user routes → each screen plays one short entrance reveal that re-fires per navigation; high-value screens (dashboard, reports, primary lists) stagger their first ~10 rows, with the rest appearing together.
- `npm run test -- tests/motion` → `RouteReveal` fires per pathname change; `StaggerRows` staggers ≤10 rows; reduced-motion applies no animation; no shell parallax.
- ✅ Pass: consistent, bounded, reduced-motion-safe reveals (SC-003/005/007).

### US3 — Chart motion (P2)
- Open a report → the gauge arc draws and its number counts up; bars grow with a brief stagger; radar/signature shapes scale-fade in.
- `npm run test -- tests/charts` → with reduced-motion, charts show final shapes/values instantly (no zero/blank frame) and keep their `aria-label`s; edge values 0/100/missing render correctly.
- ✅ Pass: charts animate; reduced-motion-safe final state (SC-004/005).

### US4 — Micro-interactions & loading (P3)
- Hover/press buttons and cards → consistent subtle feedback; focus a control via keyboard → visible focus ring regardless of motion setting; trigger a loading state → skeletons shimmer in brand timing.
- ✅ Pass: tactile feedback + visible focus + brand shimmer (SC-005).

### Determinism & budget
- `npm run test` three times → identical results; 0 external network requests.
- `npm run build && npm run check:bundle` → initial eager JS ≤ 260 KB (fonts are separate cacheable assets); all quality gates green (SC-006/007/008).

## Out of scope (do NOT implement here)
- The cinematic **Landing**, the persistent **Robot Companion**, and the Discovery→Assessment **Transform Sequence** (FR-025) — tracked as later features; this work only keeps the motion-primitive seams usable by them.

## Implementation notes (Spec 010)

### Bundle baseline & budget (T003 / T026)
- Post-implementation production build: initial **eager** chunk = **253.8 KB raw / 80.6 KB gzip** — within the **≤ 260 KB** budget. Fonts ship as separate hashed woff2 assets (not in the JS chunk); motion is CSS keyframes, so the eager JS grew only marginally (~253.1 → 253.8 KB) vs. the Spec 009 baseline. GSAP was **not** added to the eager path (reserved, lazy, for deferred set-pieces).

### RTL directional motion (T025 / FR-026 / SC-009)
- Vertical reveals (`nx-fade-up`, row/section stagger, `nx-bar-grow`/`-y`, ring-draw, scale-in) are direction-neutral and unaffected by RTL.
- The one directional primitive, `SlideIn`, is RTL-aware by construction: it selects `nx-slide-in-left` when `document.documentElement.dir === 'rtl'` and `nx-slide-in-right` otherwise, so it mirrors correctly with no clipping. (No priority surface wires a horizontal slide in this foundation pass; the primitive is provided RTL-safe for adopters.)

### Design fidelity & motion verification (T027)
- Typography: all three brand families self-hosted offline (`fonts.css` via `@fontsource`), exact design weights, `font-display: swap` fallback; `tests/typography` green.
- Motion: full 13-keyframe vocabulary present in `globals.css`; route-keyed reveals mounted in all 4 shells; bounded (first-10) row/section stagger; chart gauge draw + count-up, bars grow, radar/signature scale-fade; micro-interaction hover/press + brand shimmer. Every animation's resting state equals its final state, so reduced-motion (global rule) shows the final visual with no blank/zero frame — confirmed by `tests/motion` + `tests/charts` + the reused Spec 009 reduced-motion & no-shell-parallax suites.

### Out-of-scope confirmation (T028 / FR-025)
- The cinematic **Landing**, persistent **Robot Companion**, and Discovery→Assessment **Transform Sequence** were **not** implemented. The motion primitives (`RouteReveal`, `ScaleIn`, `SlideIn`, `CheckPop`, `StaggerRows`, `CountUp`) + the keyframe vocabulary remain reusable seams for those later features.

## Done = `npm run release-gate` (incl. `check:bundle`) is green + all four stories validated against `project/` + every `tasks.md` item `[X]`.
