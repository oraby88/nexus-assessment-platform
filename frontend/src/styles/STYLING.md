# Styling Conventions (Tailwind CSS)

Adopted in `specs/0091-tailwind-css-adoption`. See `contracts/tailwind-theme-contract.md` for the
authoritative configuration contract and `data-model.md` for the full token→utility map.

## Source of truth

`src/styles/tokens.css` defines all design tokens as CSS variables (light on `:root`, dark on
`[data-theme="dark"]`). `tailwind.config.ts` maps these into the Tailwind theme — every theme value
is a `var(--token)` reference, never a hard-coded hex. Editing a token in `tokens.css` updates every
utility that references it.

## Token utilities

Use the mapped utilities instead of inline `style={{ ... var(--token) }}`:

| Instead of inline | Use |
|-------------------|-----|
| `background: 'var(--surface)'` | `bg-surface` |
| `color: 'var(--text-2)'` | `text-text-2` |
| `borderRadius: 'var(--r-md)'` | `rounded-md` |
| `boxShadow: 'var(--sh-md)'` | `shadow-md` |
| `fontFamily: 'var(--font-display)'` | `font-display` |
| brand colors | `bg-indigo-500`, `text-teal-600`, `border-rose-600`, … |
| status tones | `bg-tone-amber-bg`, `text-tone-amber-fg`, … |

## Dark mode

Do **not** add `dark:` variants for color. Because utilities resolve to `var(--token)` and the
variables flip under `[data-theme="dark"]`, dark mode works automatically. Reserve `dark:` (bound to
the `[data-theme="dark"]` selector) for rare genuinely-structural differences between themes.

## RTL — logical utilities only

Migrated code MUST use logical-property utilities so it mirrors correctly under `dir="rtl"`:

- Padding/margin: `ps-`/`pe-`, `ms-`/`me-` (not `pl-`/`pr-`/`ml-`/`mr-`)
- Position: `start-`/`end-` (not `left-`/`right-`)
- Text align: `text-start`/`text-end` (not `text-left`/`text-right`)
- Borders: `border-s`/`border-e` (not `border-l`/`border-r`)

## Base styles, focus, motion

`globals.css` remains the authoritative reset — Tailwind **Preflight is disabled**. The
`:focus-visible` ring, `prefers-reduced-motion` handling, base typography, and keyframes
(`nx-fade-up`, `nx-shimmer`) live there. GSAP owns signature motion. Do not re-implement these in
utilities.

## No new inline styles

New and migrated components MUST NOT add inline `style={{}}` for properties Tailwind can express.
Inline styles remain acceptable only for **dynamic / computed values** — e.g. a progress-bar width
`%`, a runtime-selected tone color, a computed position, or a gradient/keyframe animation string.

Enforcement is by convention + code review (not an automated lint ban), because the ~68
not-yet-migrated components still legitimately use inline styles during coexistence.

## Migration status

The full app has been migrated to Tailwind utilities. The only inline `style={{}}` that remain are
**intentional dynamic/computed values** allowed by the rule above — e.g. clamp() fluid type, `%`-width
progress/score bars, runtime tone colors (Chip/StatusBadge/Toast), read-state backgrounds, computed
selected states, gradients, and keyframe `animation` strings. New work should follow the conventions
above and not reintroduce static inline styles.
