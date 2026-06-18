# Contract: Lazy GSAP Loader (cross-cutting)

Keeps the heavy animation engine out of the initial eager bundle so the ≤260 KB budget holds (FR-SSP-012, SC-005).

## API (`src/lib/gsap.ts`)

```ts
export const loadGsap = () => import('gsap'); // returns Promise<typeof import('gsap')>
```

## Rules

- Called **only** by `CinematicLanding` and `TransformSequence`, inside an effect after mount, and **only when motion is allowed** (reduced-motion path never loads GSAP).
- **No static `import 'gsap'`** anywhere in `src/` — GSAP must resolve to a dynamic-import (lazy) chunk, never the eager entry.
- The companion does **not** use GSAP (CSS motion only).

## Tests (`tests/perf/`)

- Static guard: no source file uses a top-level `import ... from 'gsap'` (only `import('gsap')`).
- Build guard (extends the Spec 009 lazy-chunk check): after `vite build`, GSAP appears in a **separate** chunk, not in the eager `index-*.js`; `check:bundle` stays ≤ 260 KB.
