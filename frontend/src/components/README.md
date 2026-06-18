# Components

Design-system building blocks for the Nexus prototype. All are token-driven (theme-reactive via CSS
variables in `src/styles/tokens.css`), keyboard-operable, and reduced-motion aware (constitution II/XII).

## Layout (`layout/`)
- `AdminShell` / `UserShell` — role shells with a responsive off-canvas sidebar (< 1040px) + topbar.
- `FullBleedShell` — immersive shell for the create-assessment flow and the assessment runtime.
- `PublicShell` — minimal chrome for public/auth routes.
- `RequireRole` — route guard (redirects by session/role; never leaks the other role's content).
- `OfflineBanner` — reflects browser online/offline.
- `NAV_ADMIN` / `NAV_USER` — `NavItem[]` navigation registries.

## UI primitives (`ui/`)
Base: `Button`, `Card`, `StatusBadge`, `EmptyState`, `Skeleton`, `ThemeToggle`.
Extended (`ui/primitives.tsx`): `IconButton`, `Modal`, `Drawer`, `Popover`, `Menu`, `Tabs`, `Field`,
`TextInput`, `TextArea`, `Select`, `SearchInput`, `FilterBar`, `Slider`, `SegmentedControl`, `Toggle`,
`Checkbox`, `RadioGroup`, `Chip`, `ConfidenceChip`, `TrustBadge`, `Avatar`, `ScoreBar`, `Ring`,
`CountUp`, `Tooltip`, `DataTable`, `Stepper`, `Toast`, `Timeline`.

`Modal`/`Drawer` use `useFocusTrap` (Esc to close). `CountUp` respects reduced motion.

## Charts (`charts/`)
Hand-built SVG, theme-driven, each with a text alternative (`role="img"` + `aria-label`):
`Gauge`, `ContextRadar`, `FitRadar`, `DimensionBars`, `CoverageBars`, `ContextSignature`.

## Motion (`motion/`)
`PageFX`, `SectionReveal`, `StaggerRows`, `ChipCreate`, `CountUp` — all gated by `useReducedMotion`,
degrade to instant/opacity, non-blocking, no shell parallax.

## Rules
- Components consume **typed services** only — never import `@/mocks` or `@/services/persistence`
  directly (enforced by `tests/unit/import-boundary.test.ts`). `SampleServiceView` shows the seam.
- Use design tokens; do not hardcode colors.
