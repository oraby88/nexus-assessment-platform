# Contract: Tailwind Theme & Styling Conventions

This is the UI styling contract for the Tailwind adoption. It defines the configuration shape and
the conventions migrated components MUST follow. It is the authoritative reference for `/speckit-tasks`
and the implementation phase. (No runtime API surface — this is a build/config + conventions contract.)

## C1 — `tailwind.config.ts` shape (contract, not full code)

```ts
// frontend/tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],        // VR-5
  darkMode: ['selector', '[data-theme="dark"]'],           // VR-3
  corePlugins: { preflight: false },                       // VR-4
  theme: {
    extend: {
      colors: { /* var(--token) map — see data-model.md, VR-1/VR-2 */ },
      borderRadius: { sm: 'var(--r-sm)', md: 'var(--r-md)', lg: 'var(--r-lg)', xl: 'var(--r-xl)' },
      boxShadow: { sm: 'var(--sh-sm)', md: 'var(--sh-md)', lg: 'var(--sh-lg)' },
      fontFamily: { display: ['var(--font-display)'], ui: ['var(--font-ui)'], mono: ['var(--font-mono)'] },
      transitionTimingFunction: { DEFAULT: 'var(--ease)', out: 'var(--ease-out)' },
    },
  },
  plugins: [],
} satisfies Config;
```

**Acceptance**: typed (`satisfies Config`, no `any`); all four clarified decisions encoded
(content/darkMode/preflight + token map).

## C2 — PostCSS + CSS entry

- `frontend/postcss.config.js` registers `tailwindcss` and `autoprefixer`.
- The Tailwind layers are added to the global stylesheet **after** the token import so variables
  exist when utilities are generated:

```css
/* globals.css */
@import './tokens.css';   /* MUST precede @tailwind layers */
@tailwind base;           /* base is near-empty because Preflight is disabled */
@tailwind components;
@tailwind utilities;
/* ...existing globals.css reset/typography/focus/motion rules remain below... */
```

**Acceptance**: dev server and `vite build` succeed; existing global rules (reset, `:focus-visible`,
reduced-motion, keyframes) remain present and effective.

## C3 — Utility usage conventions (migrated components)

| Rule | Requirement |
|------|-------------|
| Token utilities | Use mapped utilities (`bg-surface`, `text-text-2`, `rounded-md`, `shadow-md`, `font-display`) instead of inline `style={{ ... var(--token) }}`. |
| Dark mode | Do NOT add `dark:` variants for color — `var(--token)` flips automatically. Use `dark:` only for genuine structural differences. |
| RTL (FR-005) | Logical utilities only: `ps-/pe-`, `ms-/me-`, `start-/end-`, `text-start/text-end`. **Forbidden**: `pl-/pr-`, `ml-/mr-`, `left-/right-`, `text-left/text-right`. |
| Focus & motion | Do not re-implement the focus ring or motion in utilities; `globals.css` + GSAP remain authoritative (Constitution XII). |
| Arbitrary values | Avoid `[#hex]` / `[12px]` arbitrary values where a token utility exists; arbitrary values must reference `var(--token)` (e.g. `bg-[var(--surface)]`) only if no mapped key exists. |
| No new inline styles | New/migrated code MUST NOT add inline `style={{}}` for properties Tailwind can express (FR-010). Dynamic, computed values (e.g. a progress width %) remain inline — that is allowed. |

**Enforcement**: documented convention + code review (clarified decision); not an automated lint
ban (would false-positive on legacy files during coexistence).

## C4 — Reference exemplar scope (FR-008)

Migrated in this feature, used as the canonical pattern:
- `frontend/src/components/ui/primitives.tsx`
- `frontend/src/components/ui/index.tsx`
- `frontend/src/features/auth/index.tsx` — **only** the `AdminLogin` component (route `/login`) plus
  the shared `AuthScaffold` and module-level `inputStyle` it depends on. The file's other exports
  (`Landing`, `InvitationAccess`, `ForgotPassword`, `ResetPassword`, `AccessDenied`, `NotFound`)
  remain unmigrated (coexistence). Because `AuthScaffold`/`inputStyle` are shared with those exports,
  migrating them MUST NOT change their rendering — verify the unmigrated auth screens too.

**Acceptance**: no remaining static inline `style={{}}` on the migrated components (dynamic/computed
values excepted); renders with no perceptible visual difference vs. pre-migration in light/dark +
LTR/RTL (manual review at 100% zoom, reviewer sign-off — SC-003).

## C5 — Coexistence invariant

Unmigrated components (the other ~68 files) MUST continue to render unchanged. Adding Tailwind and
disabling Preflight MUST NOT alter any screen that was not migrated. This is the key regression guard
for the whole feature.
