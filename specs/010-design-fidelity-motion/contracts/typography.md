# Contract: Brand Typography (US1)

Self-hosted, offline brand fonts that make the families named in `tokens.css` resolve to real type on every screen, in both themes, with no network dependency (constitution I).

## Font-face set (`src/styles/fonts.css`)

Provided via `@fontsource` per-weight stylesheets (self-hosted woff2, Latin subset, `font-display: swap`):

```
@fontsource/schibsted-grotesk → 400, 500, 600, 700, 800   (→ var(--font-display))
@fontsource/hanken-grotesk    → 400, 500, 600, 700        (→ var(--font-ui))
@fontsource/jetbrains-mono    → 400, 500, 600             (→ var(--font-mono))
```

Imported once (entry/`fonts.css`); the existing `tokens.css` family declarations are unchanged.

## Behavior

- **Resolution**: headings → `--font-display`; body/controls → `--font-ui`; code/IDs/metrics → `--font-mono`.
- **Offline**: no external/CDN request; fonts load from app assets (FR-002).
- **Fallback**: while loading or if unavailable, text uses the token system stack with no layout-breaking shift (`font-display: swap`) (FR-003).
- **Theme parity**: identical family + weight in light and dark (FR-004).

## Tests (`tests/typography/`)

- A rendered heading/body/mono element resolves to the brand family (not bare `system-ui`) — assert the computed/declared `font-family` begins with the brand family.
- No external network request is required for fonts (assets are local).
- Fallback path does not throw or break layout when a face is unavailable.
