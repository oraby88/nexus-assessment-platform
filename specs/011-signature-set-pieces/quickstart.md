# Quickstart & Validation: Signature Set-Pieces

Delivers the three cinematics deferred by Spec 010 (FR-025), frontend/mock-only and deterministic. Details live in `data-model.md` and `contracts/{companion,transform-sequence,gsap-loader}.md`.

## Prerequisites

- The existing `frontend/` app (Specs 001–010 + `0091` present). From repo root: `cd frontend`.
- No new dependency — GSAP (`^3.12.5`) is already present and is used **lazily** by the Landing + Transform Sequence only.

## Quality gates (extended)

```bash
cd frontend
npx tsc -b
npm run test               # incl. companion / create-assessment / landing / perf suites
npx eslint . --ext .ts,.tsx
npm run format:check
npm run build
npm run check:bundle       # initial eager JS ≤ 260 KB (GSAP must be a lazy chunk, not eager)
npm run release-gate       # all of the above, fail-fast
```

## Story validation

### US1 — Cinematic Landing (P1, MVP)
- Open `/` (landing) → cinematic hero with signature entrance; the sign-in / invitation CTAs still work and route correctly; matches `project/` at review in both themes.
- Enable OS reduce-motion → landing renders complete + static (no movement), CTA usable.
- `npm run test -- tests/landing` → renders, CTAs preserved, reduced-motion static.
- ✅ Pass: cinematic landing; CTAs intact; reduced-motion-safe (SC-001).

### US2 — Nex Robot Companion (P2)
- Sign in → the companion appears on in-app pages with a per-page hint; it auto-collapses to a re-openable avatar; navigate → hint updates; dismiss → it stays dismissed across reload; it never appears on the landing/auth pages.
- Keyboard: tab to the companion controls (open/dismiss), no focus trap; screen reader announces the hint politely.
- Enable reduce-motion → no float; companion still usable. Shell has no parallax.
- `npm run test -- tests/companion` → default-on, per-route hint, dismiss+persist, live-region, no focus trap, reduced-motion, no parallax.
- ✅ Pass: companion works, accessible, persisted, reduced-motion-safe, no parallax (SC-002/004).

### US3 — Transform Sequence (P3)
- Create an assessment: after the discovery interview, the transform sequence plays (answers→requirements→dimensions→governed questions→assembled) then lands on review; a Skip control reaches review in one action with no data loss; copy says questions come from the validated bank.
- Enable reduce-motion → brief non-animated fallback still reaches review.
- `npm run test -- tests/create-assessment` → plays + onDone, skippable, reduced-motion fallback, governed copy, no restricted leak.
- ✅ Pass: governed-assembly sequence; skippable; reduced-motion-safe; safe copy (SC-003).

### Budget & determinism
- `npm run build && npm run check:bundle` → initial eager JS ≤ 260 KB; **GSAP is a separate lazy chunk** (`tests/perf` asserts no static gsap import + a separate gsap chunk).
- `npm run test` three times → identical; 0 external network requests (SC-005/006).

## Implementation notes (Spec 011)

### Bundle & GSAP-lazy (T003 / T017 / T018)
- Post-implementation production build: initial **eager** chunk = **258.1 KB raw / 82.0 KB gzip** — within the ≤ 260 KB budget (thin headroom; the companion + set-piece wiring added ~4 KB eager).
- **GSAP is a separate lazy chunk** (~70.8 KB raw) loaded on demand only by the Landing and the Transform Sequence — confirmed by the build output and by `check-bundle.mjs` ("GSAP not in the eager chunk"). The static guard (`tests/perf/gsap-lazy.test.ts`) ensures no top-level `import 'gsap'`.

### Companion surface scope (T019 / clarify C1)
- `RobotCompanion` is mounted **once** in the shared `Shell` (Admin + User), so it is **absent by construction** on the full-bleed Create-Assessment + Assessment Runtime flows and on `PublicShell` (public/auth/landing). Verified structurally (not mounted in `FullBleedShell`/`PublicShell`).
- Persistence access lives in the `useCompanion` hook (constitution IV — components don't import `@/services/persistence`); the import-boundary + governance-invariant guards pass.

### Motion & accessibility (T020)
- All three set-pieces are reduced-motion-safe: Landing renders complete/static, the companion's `nx-float` is gated + globally neutralized, and the Transform Sequence uses a non-animated fallback — none load GSAP on the reduced path. No parallax anywhere (the companion float is a self-transform, not parallax — the Spec 009 no-shell-parallax suite still passes). Sequence copy states questions come from the validated bank (never invented); leak-guard confirms no restricted terms.

### Out-of-scope confirmation
- These were the items Spec 010 deferred (FR-025); delivering them does not change any product data/scoring or service surface.

## Done = `npm run release-gate` (incl. `check:bundle`) is green + all three stories validated against `project/` + every `tasks.md` item `[X]`.
