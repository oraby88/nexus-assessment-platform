# Contract: Nex Robot Companion (US2)

A persistent in-app guide. Presentation + display copy only (constitution IX); gentle CSS motion, no parallax (constitution XII); no service/data changes.

## Mount & scope

- Mounted **once** in the shared `Shell` (`components/layout/index.tsx`, used by `AdminShell` + `UserShell`). **Not** mounted in `FullBleedShell` (Create-Assessment + Assessment Runtime) or `PublicShell` (public/auth/landing) — so it is absent there by construction.
- Reads `useLocation()` → `hintForPath(pathname)` (`components/companion/hints.ts`).

## State & persistence

- `companionStore` (versioned `localStorage`, `StorageKeys.companion`): `{ enabled: boolean }`, default `true` (clarify Q2).
- Dismiss → `enabled:false` (persists across reloads). A re-enable affordance restores it.
- Per-render UI state: hint bubble opens on page entry, auto-collapses to a re-openable avatar (clarify Q3).

## Accessibility (FR-SSP-005)

- Hint announced **once per page (on change)** via a polite `aria-live="polite"` region.
- Never traps keyboard focus; avatar + dismiss + re-open are real `<button>`s (keyboard-operable); decorative art is `aria-hidden`.
- Visible focus indicator (inherits global `:focus-visible`); AA contrast both themes.

## Motion (FR-SSP-006)

- Gentle **CSS** float/hop (`nx-float` keyframe) — **no GSAP, no parallax** (no pointer/scroll depth). Reduced-motion → static (global rule). Never blocks interaction; never obscures critical controls (docks to inline-end corner; clears primary actions on small screens; dismissible).

## Tests (`tests/companion/`)

- Default-on: with no stored preference, the companion renders with its hint.
- Per-route hint: hint text matches `hintForPath` for representative routes; updates on navigation.
- Dismiss + persist: dismiss hides it and `companionStore.get().enabled === false`; a fresh mount stays dismissed.
- A11y: a polite live region carries the hint; no focus trap; axe clean on a priority flow.
- Reduced-motion: no float animation style applied; companion still usable.
- No parallax: companion introduces no parallax (reuse/extend the Spec 009 shell check).
