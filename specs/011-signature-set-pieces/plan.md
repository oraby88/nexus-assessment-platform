# Implementation Plan: Signature Set-Pieces (Landing, Companion, Transform Sequence)

**Branch**: `011-signature-set-pieces` | **Date**: 2026-06-16 | **Spec**: [`./spec.md`](./spec.md)

**Input**: Feature specification from `specs/011-signature-set-pieces/spec.md`. Delivers the three cinematics Spec 010 deferred (FR-025). Builds on Specs 001–010 + Tailwind (`0091`). Visual + motion source of truth: `project/` (`app/landing.jsx`, `app/robot_companion.jsx`, `app/transform_sequence.jsx`, `app/styles.css`). Constitution `.specify/memory/constitution.md` (v2.0.0 — esp. I, II, IX, XII, XIII).

## Summary

Three independently-shippable signature set-pieces, frontend/mock-only. (1) **Cinematic Landing** — replace the minimal landing with the `project/` hero + signature entrance motion, keeping the existing sign-in / invitation CTAs; motion is skippable and degrades to a complete static page under reduced-motion. (2) **Nex Robot Companion** — a persistent guide mounted once in the shared in-app shell (Admin + User), showing a per-page contextual hint that appears on entry then auto-collapses to a re-openable avatar; **on by default**, dismissible with a persisted (versioned-localStorage) preference, announced once per page via a polite live region, never focus-trapping, using a **gentle CSS float/hop — no parallax anywhere** (constitution XII). (3) **Transform Sequence** — after the Create-Assessment discovery interview, an animated answers→requirements→dimensions→governed-questions→assembled sequence (governed-assembly messaging, no invented questions, no restricted content), skippable in one action, with a brief non-animated reduced-motion fallback that still reaches the assembled review. The heavy animation engine (**GSAP**) is **lazy-loaded** by the Transform Sequence and the Landing only (the companion uses CSS, no GSAP), so GSAP never enters the initial eager chunk and the **≤ 260 KB** budget holds.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 18.

**Primary Dependencies**: **No new dependency.** GSAP (`^3.12.5`, already in `package.json` but currently unused) is now used — but **only** by the Transform Sequence and the Landing, via dynamic `import('gsap')` so it lands in a separate lazy chunk. Reuse Spec 010's motion primitives + keyframe vocabulary, the `useReducedMotion` hook, and the versioned-store pattern (`themeStore`/`localeStore`).

**Storage**: Browser `localStorage` only — adds a versioned companion-preference key (enabled/dismissed), mirroring theme/locale. No other persistence/network.

**Testing**: Vitest + RTL + `vitest-axe`. New suites: companion (default-on; per-route hint; dismiss + persist; polite live-region announce-once; no focus trap; reduced-motion no-float), transform sequence (plays; skippable in 1 action; reduced-motion fallback reaches result; governed copy; no restricted leak), landing (renders; CTAs preserved; reduced-motion static). Reuse Spec 009 reduced-motion + **no-shell-parallax** checks and the bundle-budget gate (assert GSAP is a lazy chunk, not eager).

**Target Platform**: Evergreen desktop + tablet + mobile, light + dark themes, RTL reading order, fully offline.

**Performance Goals**: 60fps-feel set-pieces that never block interaction; the initial eager JS chunk stays **≤ 260 KB raw** (GSAP is a lazy chunk fetched only when the Landing or the create-assessment sequence mounts).

**Constraints**: **NON-NEGOTIABLE** frontend/mock-only (I); design fidelity to `project/` (II); display-copy-only, no restricted content (IX); reduced-motion-safe + **no parallax anywhere incl. the companion** + skippable signature motion (XII); responsive + RTL (XIII); AA contrast both themes; all quality gates stay green incl. the ≤260 KB budget.

**Scale/Scope**: 1 cinematic landing (replaces minimal landing, keeps CTAs); 1 companion mounted once in the shared shell with ~20 per-page hints; 1 transform sequence integrated at the create-assessment assembly transition; 1 lazy GSAP loader; ~4 new test suites. No new product screens/routes/data/scoring.

## Constitution Check

*GATE: must pass before Phase 0; re-checked after Phase 1.*

| Principle | How this feature complies | Gate |
|---|---|---|
| I Frontend First | No backend/network; GSAP lazy; companion/sequence are presentation; mock services untouched | PASS |
| II Design Fidelity | Landing/companion/sequence reproduce the `project/` set-pieces | PASS |
| III Two Roles Only | Companion is role-neutral; transform sequence is in the Admin create flow only; no role/scope change | PASS |
| IV Service Boundaries | Presentation only; companion hints + sequence copy are display strings; sequence reads existing draft/assembly via `@/services`; no fixture/persistence imports in components | PASS |
| V Governed Question Source | Unchanged; sequence *messaging* states questions come from the validated bank (no invented questions) | PASS |
| VI Immutable Metadata | No metadata/model changes | PASS |
| VII Controlled Adaptation | Unchanged | PASS (n/a) |
| VIII Question-Level Attribution | Unchanged; no scoring | PASS (n/a) |
| IX Safe Reporting | Sequence + companion copy are display-only; no restricted/internal content surfaced | PASS |
| X Human Decision Support | Unchanged | PASS (n/a) |
| XI Domain 6 Transparency | Unchanged | PASS (n/a) |
| XII Accessibility & Motion | Reduced-motion fallbacks everywhere; **no parallax anywhere (incl. companion)**; sequence skippable; companion non-focus-trapping + polite live region + keyboard-operable; landing motion skippable | PASS |
| XIII Responsive Runtime | Responsive + RTL preserved; companion/sequence mirror under RTL; budget protected | PASS |
| XIV Traceability | No service surface change → handoff-map unaffected; plan consistent with `000-shared/*` + `project/` | PASS |
| XV Review Before Implementation | Stop for approval before `/speckit-implement` | PASS |

**Result**: No violations. The companion-parallax tension is resolved in favor of the constitution (clarify Q1: no parallax). Complexity Tracking empty.

## Project Structure

### Documentation (this feature)

```text
specs/011-signature-set-pieces/
├── plan.md              # This file
├── research.md          # Phase 0 — companion arch, GSAP lazy strategy, sequence + landing approach
├── data-model.md        # Phase 1 — companion state + hint map, sequence phases, landing presentation
├── contracts/           # Phase 1
│   ├── companion.md         # companion API/behavior + accessibility + persistence contract
│   ├── transform-sequence.md# phases, skippability, reduced-motion fallback, governed-copy contract
│   └── gsap-loader.md       # lazy GSAP loading contract (budget guarantee)
├── quickstart.md        # Phase 1 — run + validation guide
└── checklists/
    └── requirements.md  # spec quality checklist (passing)
```

### Source Code (repository root — frontend app)

```text
frontend/
├── src/
│   ├── lib/
│   │   └── gsap.ts                  # NEW: lazy loader — `loadGsap = () => import('gsap')` (kept out of eager chunk)
│   ├── components/
│   │   ├── companion/
│   │   │   ├── RobotCompanion.tsx   # NEW: Nex — avatar + hint bubble (CSS float, no parallax), a11y live region
│   │   │   └── hints.ts             # NEW: per-route hint map (display copy, from project/robot_companion.jsx)
│   │   └── layout/index.tsx         # mount <RobotCompanion/> once in the shared Shell (Admin + User)
│   ├── features/
│   │   ├── landing/
│   │   │   └── CinematicLanding.tsx # NEW: cinematic hero (GSAP lazy) — keeps sign-in/invitation CTAs
│   │   ├── auth/index.tsx           # Landing now renders CinematicLanding (CTAs/routes preserved)
│   │   └── create-assessment/
│   │       ├── TransformSequence.tsx# NEW: governed-assembly sequence (GSAP lazy) + reduced-motion fallback
│   │       └── CreateAssessmentWizard.tsx # trigger the sequence at the assembly→review transition
│   └── services/persistence.ts      # add a versioned companion-preference key + store
tests/
├── companion/        # default-on, per-route hint, dismiss+persist, live-region, no focus trap, reduced-motion
├── create-assessment/# transform sequence: plays, skippable, reduced-motion fallback, governed copy, no leak
├── landing/          # cinematic landing renders, CTAs preserved, reduced-motion static
└── perf/             # extend: assert GSAP is a lazy chunk (not in the eager entry)
```

**Structure Decision**: GSAP is isolated behind `src/lib/gsap.ts` (`loadGsap = () => import('gsap')`) and consumed **only** by `TransformSequence` and `CinematicLanding` via dynamic import — so GSAP compiles to a lazy chunk and never enters the initial eager `index-*.js` (the Spec 009 `check-bundle.mjs` gate guards this). The **companion uses CSS motion only** (a `nx-float` keyframe + the existing reduced-motion rule), so the always-mounted in-app companion pulls **no** GSAP. The companion mounts once in the shared `Shell` (Admin + User) — not in the FullBleed or Public shells — and reads the route to pick its hint; its preference lives in a versioned `localStorage` key. The cinematic Landing replaces the minimal landing's visuals inside `features/landing/CinematicLanding.tsx`, with `features/auth` `Landing` rendering it and preserving the existing CTAs/routes/i18n. The Transform Sequence is an overlay triggered at the create-assessment assembly→review transition, skippable, with a non-animated reduced-motion fallback.

## Complexity Tracking

No constitution violations. No new dependency: GSAP was already present (unused) and is now used **lazily** for two set-pieces only; the companion stays CSS-only — so the always-on in-app path adds no animation-engine weight and the ≤260 KB eager budget is preserved (constitution "no heavy dependency without justification"). The companion's design-source mouse-parallax is dropped (clarify Q1) to honor constitution XII.
