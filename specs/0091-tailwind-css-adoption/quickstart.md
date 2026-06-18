# Quickstart: Validate Tailwind CSS Adoption

Validation guide proving the feature works end-to-end. Run from `frontend/`. Implementation details
live in the theme contract (`contracts/tailwind-theme-contract.md`) and `tasks.md`.

## Prerequisites

- Node + npm installed; dependencies installed (`npm install`).
- Tailwind devDeps added: `tailwindcss@^3.4`, `postcss`, `autoprefixer`.
- `tailwind.config.ts` and `postcss.config.js` present per the theme contract.

## Scenario 1 — Build & dev server succeed (FR-001, SC-001/SC-002)

```bash
npm run dev        # dev server starts, no PostCSS/Tailwind errors
npm run build      # tsc -b && vite build succeed
npm run check:bundle   # initial bundle ≤ 260KB
```

**Expected**: all three succeed; bundle within budget.

## Scenario 2 — Token utility resolves correctly (FR-002, SC-004)

Add a throwaway element (or inspect the migrated exemplar):

```tsx
<div className="bg-surface text-text rounded-md shadow-md font-display">probe</div>
```

**Expected**: computed `background-color` equals `var(--surface)` / the rendered light value;
`border-radius` = 11px (`--r-md`); identical to the equivalent prior inline style.

## Scenario 3 — Dark theme via selector (FR-003)

Toggle the app theme (or set `document.documentElement.dataset.theme = 'dark'`).

**Expected**: the same utilities now render dark-theme token values (e.g. `bg-surface` → `#141b26`)
**without** any `dark:` variant on the element — the CSS variable flips. `prefers-color-scheme` is
NOT the trigger.

## Scenario 4 — Reference exemplar visual parity (FR-008, SC-003)

Open the migrated exemplar (shared UI primitives + Auth login screen). Compare side-by-side with the
pre-migration render (git stash / previous build) in **all four** combinations:

| Theme | Direction | Expected |
|-------|-----------|----------|
| Light | LTR | Identical |
| Dark | LTR | Identical |
| Light | RTL (`dir="rtl"`) | Mirrored correctly, spacing intact |
| Dark | RTL | Mirrored correctly, spacing intact |

**Expected**: zero visual difference; no static inline `style={{}}` left on the migrated components
(dynamic/computed values excepted).

## Scenario 5 — RTL uses logical utilities only (FR-005, SC-005)

```bash
# spot-check migrated files for forbidden physical-direction utilities
grep -REn "className=.*(\bpl-|\bpr-|\bml-|\bmr-|\bleft-|\bright-|text-left|text-right)" \
  src/components/ui src/features/auth
```

**Expected**: no matches in migrated files.

## Scenario 6 — Coexistence: unmigrated screens unchanged (C5)

Open 2–3 screens that were NOT migrated (e.g. AdminDashboard, a runtime renderer).

**Expected**: pixel-identical to before — disabling Preflight + adding Tailwind did not alter them.

## Scenario 7 — Existing test + a11y gates still pass

```bash
npm test            # Vitest suite green (css:true transform unaffected)
npm run test:a11y   # axe checks green
npm run lint && npm run format:check
```

**Expected**: full release gate (`npm run release-gate`) passes.

## Done when

All seven scenarios pass and the constitution amendment (FR-009, via `/speckit-constitution`) is
recorded and approved. Then proceed to follow-up migration batches (separate specs).
