# Phase 1 Data Model: Signature Set-Pieces

No new **product** entities. This feature adds presentation-only constructs: the companion's preference + hint map, the transform sequence's phases, and the landing presentation.

## Companion (US2)

```ts
// services/persistence.ts — versioned preference (mirrors themeStore/localeStore)
StorageKeys.companion = 'nexus_companion_v1';
SchemaVersions.companion = 1;
interface CompanionPref { enabled: boolean } // default { enabled: true } (clarify Q2)
export const companionStore = {
  get(): CompanionPref;   // absent → { enabled: true }
  set(p: CompanionPref): void;
};

// components/companion/hints.ts — display copy only (no restricted content, IX)
// Keyed by a route segment/page id derived from the pathname; falls back to a generic hint.
export const COMPANION_HINTS: Record<string, string>; // e.g. 'dashboard' → "Here's your overview…"
export function hintForPath(pathname: string): string; // route → hint (default fallback)
```

- **State**: `enabled` (persisted). UI sub-state (per render): `bubbleOpen` (true on page entry → auto-collapses on a timer → re-openable). Reduced-motion → no float; bubble still shows/announces.
- **Behavior invariants**: on by default; dismiss persists across reloads; hint announced once per page via polite live region; never traps focus; gentle CSS float/hop only — **no parallax** (FR-SSP-003/004/005/006).
- **Scope**: in-app shared shell (Admin + User) only; absent on public/auth/landing.

## Transform Sequence (US3)

```ts
// features/create-assessment/TransformSequence.tsx
type SequencePhase = 'read' | 'requirements' | 'dimensions' | 'questions' | 'assembled';
interface TransformSequenceProps { onDone: () => void } // onDone → advance to review/success
```

- **Phases** (ordered, from `project/transform_sequence.jsx`): answers → requirements → dimensions → governed questions → assembled.
- **Behavior invariants**: plays after discovery at the assembly→review transition; **skippable in one action** (Skip button / Esc) → `onDone()` with no data loss; reduced-motion (or GSAP-not-loaded) → brief non-animated fallback then `onDone()`; copy states questions come from the validated bank (never invented); no restricted/internal content (FR-SSP-008/009/010/011).

## Landing Presentation (US1)

- `features/landing/CinematicLanding.tsx` — cinematic hero + signature entrance (GSAP lazy). Renders the existing entry CTAs (sign-in → `/login`, invitation → `/invitation`) and i18n copy. Reduced-motion → complete static page (final state). No new data (FR-SSP-001/002).

## GSAP loader (cross-cutting)

```ts
// lib/gsap.ts
export const loadGsap = () => import('gsap'); // lazy chunk; called only by TransformSequence + CinematicLanding, motion-allowed path only
```

## Validation & invariants

- **I** — frontend/mock-only; no network; GSAP lazy (not eager).
- **II** — landing/companion/sequence match `project/` within the fidelity bar (review).
- **IX** — companion hints + sequence copy are display-only; no restricted/internal content.
- **XII** — reduced-motion → final/static everywhere; **no parallax anywhere** (incl. companion); sequence skippable; companion non-focus-trapping + polite live region.
- **XIII** — RTL: companion docks inline-end; directional sequence motion mirrors.
- **Perf** — initial eager JS ≤ 260 KB; GSAP is a separate lazy chunk (Spec 009 `check-bundle`).
- **Scope** — no new product entities/screens/routes/scoring; companion absent on public/auth.
