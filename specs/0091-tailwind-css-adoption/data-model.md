# Phase 1 Data Model: Tailwind CSS Adoption

This feature has no runtime domain data. The "data model" here is the **token-bridge mapping** — the
contract between `tokens.css` CSS variables and Tailwind theme keys. It is the central design entity.

## Entity: Token Bridge

The mapping from `frontend/src/styles/tokens.css` variables into `theme.extend` in
`tailwind.config.ts`. Every entry resolves to `var(--token)` so `tokens.css` stays the single source
of truth (light on `:root`, dark on `[data-theme="dark"]`).

### Colors (`theme.extend.colors`)

| Tailwind key | CSS variable | Notes |
|--------------|--------------|-------|
| `indigo-{700,600,500,400,100,50}` | `var(--indigo-*)` | Brand scale |
| `teal-{600,500,100}` | `var(--teal-*)` | Secondary |
| `amber-{600,100}` | `var(--amber-*)` | Caution |
| `rose-{600,100}` | `var(--rose-*)` | Risk |
| `violet-600` | `var(--violet-600)` | |
| `ink-{900,700,500,300}` | `var(--ink-*)` | Neutrals |
| `shell-{900,800,700,line,text,muted}` | `var(--shell-*)` | Navy shell |
| `canvas`, `canvas-2` | `var(--canvas)`, `var(--canvas-2)` | Surfaces |
| `surface`, `surface-2` | `var(--surface)`, `var(--surface-2)` | |
| `border`, `border-strong` | `var(--border)`, `var(--border-strong)` | |
| `track` | `var(--track)` | |
| `text`, `text-2`, `text-3` | `var(--text)`, `var(--text-2)`, `var(--text-3)` | Text colors |
| `tone-{indigo,teal,amber,rose,slate}-{bg,fg}` | `var(--tone-*-*)` | Status tone pairs |

These power `bg-*`, `text-*`, `border-*`, `ring-*`, `fill-*` utilities. Because values are CSS
variables, the same utility renders the correct color in both themes with no `dark:` variant.

### Border radius (`theme.extend.borderRadius`)

| Tailwind key | CSS variable |
|--------------|--------------|
| `sm` | `var(--r-sm)` (7px) |
| `md` | `var(--r-md)` (11px) |
| `lg` | `var(--r-lg)` (16px) |
| `xl` | `var(--r-xl)` (22px) |

### Box shadow (`theme.extend.boxShadow`)

| Tailwind key | CSS variable |
|--------------|--------------|
| `sm` | `var(--sh-sm)` |
| `md` | `var(--sh-md)` |
| `lg` | `var(--sh-lg)` |

### Font family (`theme.extend.fontFamily`)

| Tailwind key | CSS variable |
|--------------|--------------|
| `display` | `var(--font-display)` |
| `ui` | `var(--font-ui)` |
| `mono` | `var(--font-mono)` |

### Transition timing (`theme.extend.transitionTimingFunction`)

| Tailwind key | CSS variable |
|--------------|--------------|
| `DEFAULT` / `ease` | `var(--ease)` |
| `out` | `var(--ease-out)` |

### Keyframes / animation (optional)

`nx-fade-up` and `nx-shimmer` already live in `globals.css`. They are NOT re-declared in Tailwind;
GSAP and the existing keyframes keep owning motion (Constitution XII). Tailwind `animate-*` is not
introduced for these in this feature.

## Validation rules

- **VR-1**: Every Tailwind theme key MUST reference an existing `var(--token)` defined in
  `tokens.css`. A key pointing at a missing variable is a defect (renders empty).
- **VR-2**: No hex/RGB literal may appear in `tailwind.config.ts` color/shadow values — only
  `var(--token)` references (preserves single source of truth + dark theme).
- **VR-3**: `darkMode` MUST be `['selector', '[data-theme="dark"]']`.
- **VR-4**: `corePlugins.preflight` MUST be `false`.
- **VR-5**: `content` MUST include `./index.html` and `./src/**/*.{ts,tsx}` (purge correctness).
- **VR-6**: Migrated files MUST NOT contain physical-direction utilities (logical only — FR-005).

## State transitions

N/A — static configuration. The only "lifecycle" is the per-file migration status (legacy
inline-styled → migrated to utilities), tracked informally per follow-up batch, out of scope here.
