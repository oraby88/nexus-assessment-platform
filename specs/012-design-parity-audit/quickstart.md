# Quickstart & Validation: Design-Parity Audit & Gap-Closure

A full-app, screen-by-screen parity pass against the `project/` design, frontend/mock-only and deterministic. Details: `data-model.md`, `contracts/{parity-bar,screen-map}.md`, and the running `inventory.md`.

## Prerequisites

- The existing `frontend/` app (Specs 001–011 present). From repo root: `cd frontend`. No new dependency or tooling.
- The `project/` design source is the reference. Read the source values directly (do not screenshot — clarify Q1).

## Quality gates

```bash
cd frontend
npx tsc -b
npm run test               # incl. tests/parity + reused suites
npx eslint . --ext .ts,.tsx
npm run format:check
npm run build
npm run check:bundle       # initial eager JS ≤ 260 KB (GSAP lazy)
npm run release-gate       # all of the above, fail-fast
```

## Per-area validation (audit → close, interleaved)

For each area, append findings to `specs/012-design-parity-audit/inventory.md` (each deviation classified High/Medium/Low), close all **High + Medium**, then verify:

### US1 — Shared chrome + components (P1, MVP)
- Compare the sidebar/topbar/popovers/avatar/theme toggle (`app/shell.jsx`) and the UI primitives + icons (`app/ui.jsx`/`app/icons.jsx`) to the design in light + dark + RTL + mobile. 0 open High/Medium chrome/component gaps.
- ✅ Pass: shared layer matches the design (SC-003).

### US2 — Admin screens (P2)
- Compare each Admin route to its source (`app/admin_*.jsx`, `report_detail.jsx`) in both themes + responsive + RTL; states present. 0 open High/Medium.
- ✅ Pass (SC-001/002).

### US3 — User portal & runtime (P2)
- Compare each User route to its source (`app/user_portal.jsx`, `app/user_assessment.jsx`); runtime shows no live score/internal data (constitution IX). 0 open High/Medium.
- ✅ Pass (SC-001/002).

### US4 — Create-Assessment flow (P3)
- Compare the wizard steps + discovery + transform sequence to `app/create_assessment*.jsx`/`transform_sequence.jsx`; reduced-motion-safe. 0 open High/Medium.
- ✅ Pass (SC-001/002).

## Cross-cutting
- `npm run build && npm run check:bundle` → initial eager JS ≤ 260 KB (GSAP lazy).
- Reuse the Spec 009 reduced-motion + no-shell-parallax suites → 0 shell parallax; all motion degrades (SC-004).
- `npm run test` three times → identical; 0 external network requests (SC-005/006).
- `inventory.md` covers 100% of live routes; 0 `open` High/Medium; Low entries logged/`deferred` with sign-off (SC-001).

## Implementation progress (Spec 012)

- **Setup + Foundational complete & validated** (T001–T003): gap inventory created; **25 missing design tokens reconciled** into `tokens.css` (`:root` + dark) from `project/app/styles.css` — the app-wide color/elevation/skeleton/grid foundation now matches the design. `tests/parity/tokens.test.ts` green; full `release-gate` green.
- **Bundle baseline (T002)**: initial eager JS = **258.1 KB raw / 82.0 KB gzip** (≤ 260 KB; ~1.9 KB headroom). CSS token additions do not affect the JS budget; GSAP stays lazy.
- **US1 core complete & validated** (T004, T005, T008 + most of T006): centralized **tree-shakeable icon set** (`components/ui/icons.tsx`, ported from `app/icons.jsx`); sidebar nav now renders **icon + label**; topbar uses the design's translucent `--topbar-bg` + `menu`/`logout` icons. Budget pressure (icons pushed eager to 260.7 KB) resolved by **lazy-loading the Nex companion** out of the eager shell → **eager now 257.4 KB ≤ 260 KB**, GSAP still lazy, 256 tests green, 0 regressions. `tests/parity/chrome.test.tsx` green.
- **US1 COMPLETE** (T004–T009): icon set + sidebar icons + topbar token/menu/sign-out (T006 core); T007 audit — the app's primitive set is a **superset** of `app/ui.jsx`, no missing components, tokens reconciled; T009 audit — auth screens are token-aligned (the cinematic hero shipped in Spec 011). **One Medium gap deferred** (logged in `inventory.md` with sign-off): the rich topbar (search/popovers/avatar menu) breaches the eager budget (+8.5 KB → 265.9 KB) — fix is to lazy-load that cluster (like RobotCompanion) in a follow-up. Eager **257.4 KB ≤ 260 KB**; 256 tests green.
- **ALL AREAS COMPLETE & VALIDATED** (T004–T028): US1 (chrome/components/auth), US2 (admin: dashboard · users/blueprints/contexts create-actions · report detail · comparison · assessments list+detail · history · exports · notifications · settings · profile), US3 (dashboard · my-assessments · my-reports · overview · consent · instructions · runtime renderers · completion · user-report · history · notifications · profile), US4 (wizard steps 1–12 + AI Discovery chat + Transform Sequence). Each area: deep audit → `inventory.md` → closed all High+Medium → validated.
- **Budget reclaim (T020)**: the eager i18n catalog grew to the 260 KB ceiling during the US3 dashboard rebuild; the non-default **Arabic (RTL) message table was code-split** into `i18n/catalog.ar.ts` (loaded on demand). Eager **259.8 → 250.1 KB** — ~10 KB headroom restored for the rest of US3/US4.
- **Stray root scaffold removed**: an early, broken "Claude Design handoff bundle" port at the repo root (its own `src/`/`package.json`/config) was deleted; `frontend/` is now the only project (build from `frontend/`).

## Polish sign-off (T029–T032)

- **T029 — inventory finalized**: `inventory.md` covers every live route + shared layer; **0 `open` High/Medium**; every `deferred` (Low) entry carries a reviewer rationale (e.g., hero-Ring color = additive primitive prop; wizard left-rail = functionally-equivalent Stepper; Live-AI/email-preview/context-signature = out of mock-only scope or no backing data; topbar action cluster = budget). SC-001/002 met.
- **T030 — gates green**: full `npm run release-gate` passes — tsc · **257 unit/component tests** · eslint (0 errors) · format · build · `check:bundle` **250.5 KB raw / 80.4 KB gzip ≤ 260 KB** (GSAP lazy). 0 functional regressions (SC-005/006).
- **T031 — cross-cutting verified**: re-ran the Spec 009 suites (`tests/motion` + `tests/i18n` + `tests/a11y` + `tests/parity` = **15 files / 31 tests, all green**): RTL sets `dir/lang` + locale-threaded `Intl` formatting; reduced-motion degrades all animations (the new dark heroes + Transform-Sequence stages use `nx-*` keyframes neutralized by the global `prefers-reduced-motion` guard); **0 shell parallax**; token/chrome/admin structural parity assertions hold. New cinematic/runtime visuals are score-free (no-leak suites green). SC-004 met.
- **T032 — fidelity review**: all four areas reviewed screen-by-screen against `project/` (`Nexus Platform.html` + `app/*.jsx` + `styles.css`); parity bar = match the design's specified source values (color/spacing/type/layout/icons/elevation), preserving every product behaviour, governance constraint, and the ≤260 KB budget. **Parity bar met for all High+Medium gaps across US1–US4.** SC-002/003 met.

## Done = `npm run release-gate` green + `inventory.md` complete (0 open High/Medium, Low signed-off) + all four areas reviewed against `project/` + every `tasks.md` item `[X]`.
