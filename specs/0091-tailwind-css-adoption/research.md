# Phase 0 Research: Tailwind CSS Adoption

All Technical Context items are known (no NEEDS CLARIFICATION). This file records the technology
decisions that shape Phase 1 design.

## R1 — Tailwind version

**Decision**: Tailwind CSS **3.4.x** (JS/TS config: `tailwind.config.ts`).

**Rationale**: v3.4 has mature, widely documented support for the three mechanisms this feature
depends on, all configured in one typed file:
- `corePlugins: { preflight: false }` to disable Preflight (clarified decision).
- `darkMode: ['selector', '[data-theme="dark"]']` to bind `dark:` to the existing attribute.
- `theme.extend.colors`/`borderRadius`/etc. mapping to `var(--token)` values.
RTL logical utilities (`ps-/pe-/ms-/me-/start-/end-`, `text-start/text-end`) are built in since
v3.3. PostCSS integration plugs into the existing Vite pipeline with no Vite plugin change.

**Alternatives considered**:
- **Tailwind v4 (CSS-first `@theme`)** — elegant for CSS-variable-native theming and is the latest
  major, but disabling Preflight and defining a custom `[data-theme]` dark variant use newer,
  less-documented `@import`/`@custom-variant` patterns, and it introduces the `@tailwindcss/vite`
  plugin. Rejected for now to minimize risk during coexistence; revisit in a later batch.
- **No Tailwind (keep inline styles / adopt real CSS Modules)** — rejected per stakeholder directive
  and because CSS Modules were mandated but never adopted.

## R2 — Token bridge (tokens.css → Tailwind theme)

**Decision**: Map existing CSS variables into `theme.extend` using `var(--token)` references, e.g.
`colors: { surface: 'var(--surface)', 'indigo-500': 'var(--indigo-500)', ... }`. `tokens.css` stays
the single source of truth and continues to define light (`:root`) and dark (`[data-theme="dark"]`)
values.

**Rationale**: Because utilities resolve to `var(--token)`, theme switching keeps working with zero
duplication — Tailwind never hard-codes a hex value, so dark mode "just works" through the same CSS
variables. Visual fidelity is guaranteed because the rendered value is identical to the prior inline
`var(--token)`.

**Alternatives considered**: Copying hex values into the Tailwind config (rejected — duplicates the
source of truth, breaks dark theme, invites drift). Using v4 `@theme` (deferred per R1).

## R3 — Dark mode

**Decision**: `darkMode: ['selector', '[data-theme="dark"]']`.

**Rationale**: The app already toggles theme via the `data-theme` attribute on the document, not
`prefers-color-scheme`. Binding the Tailwind `dark:` variant to that selector keeps a single theming
mechanism. Note: because colors already resolve to `var(--token)` (R2), most components need **no**
`dark:` variants at all — the variable flips automatically. `dark:` is reserved for the rare cases
where a utility must differ structurally between themes.

## R4 — Preflight / reset collision

**Decision**: Disable Preflight (`corePlugins: { preflight: false }`); `globals.css` remains the
authoritative base/reset.

**Rationale** (clarified decision): With ~70 components still using inline styles during coexistence,
enabling Preflight would change default element rendering app-wide (unstyled headings/lists, reset
form controls) and risk regressing unmigrated screens. Keeping `globals.css` as the only reset means
the existing focus-visible ring, base typography, and `prefers-reduced-motion` rules stay
authoritative (Constitution XII).

**Alternatives considered**: Enable Preflight and fold `globals.css` into it (cleaner long-term but
regression risk now); layer both (conflict-prone). Both rejected during coexistence.

## R5 — RTL strategy

**Decision**: Use Tailwind's built-in **logical-property utilities** only in migrated code
(`ps-/pe-`, `ms-/me-`, `start-/end-`, `text-start/text-end`); forbid physical utilities
(`pl-/pr-/ml-/mr-/left-/right-/text-left/text-right`). No extra RTL plugin needed.

**Rationale**: Spec 009 sets `dir` on the document; logical utilities automatically mirror under
`dir="rtl"`. v3.4 ships these natively, so no `tailwindcss-rtl` dependency is required. Enforcement
is by documented convention + code review (clarified decision) — a hard lint ban would false-positive
on the ~68 unmigrated files.

## R6 — Bundle budget

**Decision**: Configure `content` globs to cover `./index.html` and `./src/**/*.{ts,tsx}`; rely on
JIT/purge so only used utilities ship. Validate via existing `npm run check:bundle` (≤260KB).

**Rationale**: Tailwind's JIT emits only classes actually referenced. Disabling Preflight further
trims base CSS. With one exemplar migrated, net CSS added is small; the bundle gate is the guard
against an under-configured `content` path bloating output.

**Risk**: An incomplete `content` glob silently drops classes (missing styles) or, if over-broad,
slows builds. Mitigation: globs scoped to source; bundle check in the release gate.

## R7 — Verification method

**Decision**: Manual side-by-side visual review of the reference exemplar in light + dark themes and
LTR + RTL (clarified decision). Existing Vitest/RTL/axe tests must still pass.

**Rationale**: Fits the prototype scale and the constitution's "no heavy dependency" stance; a
screenshot-diff tool would add a heavy dev dependency for marginal benefit on a single exemplar.

## Open risks carried into Phase 1

- Vitest uses `css: true`; confirm Tailwind/PostCSS doesn't break the jsdom test transform (expected
  fine — PostCSS runs at build, tests don't assert computed styles). Validated in quickstart.
- `globals.css` currently `@import './tokens.css'`; the `@tailwind` directives must be ordered so
  tokens load before utilities. Captured in the theme contract.
