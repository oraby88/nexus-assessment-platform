# Phase 0 Research: Signature Set-Pieces

The three `/speckit-clarify` decisions (Session 2026-06-16) are recorded in `spec.md`; this file captures the technical decisions that follow plus the patterns reused from the codebase and the `project/` source. No open `NEEDS CLARIFICATION` remain.

## D1 — GSAP lazy-loading strategy (cross-cutting, budget)

- **Decision**: Add `src/lib/gsap.ts` exporting `loadGsap = () => import('gsap')`. Only `TransformSequence` and `CinematicLanding` call it, inside an effect after mount and only when motion is allowed (reduced-motion path never loads GSAP). Vite emits GSAP as a separate lazy chunk; it is **not** in the initial eager `index-*.js` and is not `modulepreload`-ed from `index.html`, so the Spec 009 `check-bundle.mjs` ≤260 KB budget is unaffected.
- **Rationale**: GSAP (~50 KB) is already a dependency but currently unused (tree-shaken out). Dynamic import keeps it off every route; it loads only on the landing route or when the create-assessment sequence plays. The companion — which mounts on every in-app page — deliberately uses **CSS motion, no GSAP** (see D2).
- **Alternatives considered**: Static `import 'gsap'` (would pull GSAP into the eager chunk → budget breach); a new animation lib (unjustified, GSAP already present); GSAP for the companion too (rejected — would load GSAP app-wide).

## D2 — Companion architecture, motion, and accessibility (US2)

- **Decision**: `components/companion/RobotCompanion.tsx` mounted **once** in the shared `Shell` (used by `AdminShell` + `UserShell`) in `components/layout/index.tsx` — not in `FullBleedShell`/`PublicShell`. It reads `useLocation()` to pick a per-route hint from `components/companion/hints.ts` (display copy ported from `project/app/robot_companion.jsx`). Motion is a gentle **CSS** float/hop (`nx-float` keyframe) — **no GSAP, no parallax** (clarify Q1); reduced-motion → static (global rule). The hint bubble shows on page entry, then auto-collapses (timer) to a re-openable avatar; it's announced **once per page** via a polite `aria-live="polite"` region (clarify Q3). The avatar/controls are buttons (keyboard-operable: open/dismiss); the companion is **not** a focus trap and `aria-hidden`s its decorative parts.
- **Rationale**: Mounting in the shared shell covers all in-app pages with one integration point. CSS motion keeps the always-on companion GSAP-free (budget) and reduced-motion-safe by construction. The live-region + button approach satisfies WCAG without stealing focus.
- **Alternatives considered**: Per-page companion mounts (duplication); GSAP-driven companion (budget + complexity); a modal/dialog (would trap focus — rejected).

## D3 — Companion default state + persistence (US2)

- **Decision** (clarify Q2): **On by default.** A versioned `companionStore` in `services/persistence.ts` (new `StorageKeys.companion`, `SchemaVersions.companion`) persists `{ enabled: boolean }`; default when absent is `enabled: true`. Dismiss sets `enabled:false` (persists); a re-enable affordance restores it. Mirrors `themeStore`/`localeStore`.
- **Rationale**: Matches the design intent (Nex greets and travels along) while the persisted dismissal is the escape hatch (SC-002).
- **Alternatives considered**: First-visit-only / off-by-default (lower brand presence; clarify chose on-by-default).

## D4 — Transform Sequence integration + behavior (US3)

- **Decision**: `features/create-assessment/TransformSequence.tsx` — an overlay played at the **assembly→review transition** in `CreateAssessmentWizard` (after discovery has produced requirements and questions are assembled, before the review/success step). Phases mirror `project/app/transform_sequence.jsx`: answers → requirements → dimensions → governed questions → assembled. Uses GSAP (lazy, D1) for the timeline; **skippable in one action** (a Skip control + Esc) that jumps straight to review with no data loss; under reduced-motion (or if GSAP hasn't loaded), a **brief non-animated fallback** (short hold then proceed) reaches review. Copy states questions come **from the validated bank (never invented)** and contains no restricted/internal content (constitution IX).
- **Rationale**: It reinforces the governance story at the natural moment; skippable + fallback keep it non-blocking (XII); reading existing draft/assembly state via `@/services` keeps the service boundary intact.
- **Alternatives considered**: Inline (non-overlay) step (less cinematic, harder to skip cleanly); always-on with no skip (blocks fast users — rejected).

## D5 — Cinematic Landing (US1)

- **Decision**: `features/landing/CinematicLanding.tsx` reproduces the `project/app/landing.jsx` hero + signature entrance motion (GSAP lazy, D1); `features/auth` `Landing` renders it and **preserves the existing CTAs/routes/i18n** ("Enter the Platform" → `/login`, "I have an invitation" → `/invitation`). Motion is non-blocking and skippable; under reduced-motion the page renders complete and static (final state). Landing is a `PublicShell` route — the companion does not appear there.
- **Rationale**: Replaces only the landing's visuals/motion while keeping its navigational contract; reduced-motion static state guarantees the CTA is always usable.
- **Alternatives considered**: A brand-new landing route (would orphan existing links); keeping the minimal landing (doesn't meet the design goal).

## D6 — Reduced-motion, RTL, and no-shell-parallax (cross-cutting)

- **Decision**: Reuse `useReducedMotion` + the global `@media (prefers-reduced-motion: reduce)` rule from Spec 010. Every set-piece has a final/static state under reduced-motion; the companion's `nx-float` and the landing/sequence GSAP timelines are gated so reduced-motion shows the end state with no movement and **no GSAP load** on the reduced path. RTL: companion docks to the inline-end corner (logical positioning) and directional sequence motion mirrors. The Spec 009 no-shell-parallax test continues to pass (companion float is transform-on-self, not background/scroll parallax) — a test asserts the companion introduces no parallax.
- **Rationale**: One reduced-motion seam; constitution XII honored everywhere; RTL preserved (XIII).
- **Alternatives considered**: Pointer-parallax companion (rejected by clarify Q1 / XII).

## D7 — Testing & gate integration

- **Decision**: New suites under `tests/{companion,create-assessment,landing}` + extend `tests/perf` to assert GSAP is a lazy chunk (the eager `index-*.js` does not contain GSAP; a `gsap`/`Gsap`-named chunk exists separately after build). All reuse the deterministic reset helper + reduced-motion matchMedia override pattern. The Spec 008 `release-gate` (incl. `check:bundle`) stays the single authority for SC-005/006.
- **Rationale**: Keeps determinism and the budget enforced in the existing gate.
- **Alternatives considered**: Visual/snapshot diffing (brittle in jsdom — use behavior + source assertions + review).
