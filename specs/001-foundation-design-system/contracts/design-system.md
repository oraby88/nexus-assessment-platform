# Contract — Design System: Tokens, Components, Charts, Motion, A11y (Foundation)

Foundation ports the Claude Design tokens from `project/` and provides the reusable component, chart, motion, and accessibility primitives every screen composes. Visual source of truth: `project/` (Principle II). Missing states (empty/loading/error/404/responsive) are added in the same design language.

## Tokens & theme

- `styles/tokens.css`: CSS custom properties for color, typography (Schibsted Grotesk / Hanken Grotesk / JetBrains Mono), spacing, radii, shadows, badge/status tones, chart tokens, motion easings/durations — light defaults + `[data-theme="dark"]` overrides.
- `styles/theme.ts`: typed mirror of chart-needed token values (charts read JS, not CSS).
- `index.html` pre-paint script: apply stored `nexus_theme`, else `prefers-color-scheme` (research D1). No flash (SC-002).
- `useTheme()`: `{ theme: ThemePreference, resolved: 'light'|'dark', set(pref) }`.

## UI primitives (`components/ui/`)

Button · IconButton · Card · Modal · Drawer · Popover · Menu · Tabs · Field · TextArea · Select · Slider · SegmentedControl · Toggle · Checkbox · RadioGroup · StatusBadge · Chip · ConfidenceChip · TrustBadge · Avatar · ScoreBar · Ring · CountUp · Tooltip · EmptyState · Skeleton · DataTable · FilterBar · SearchInput · Stepper · Toast · Timeline.

Contract per primitive: themed via tokens (both themes), keyboard-operable with visible focus, labelled, responsive. `StatusBadge`/`ConfidenceChip` map to the shared status/confidence enums; `TrustBadge` renders governance trust signals (e.g., "Scoring Logic Locked"); `DataTable`/`FilterBar`/`SearchInput` back list screens; `Skeleton`/`EmptyState` provide the loading/empty states all specs reuse.

## Chart primitives (`components/charts/`)

Gauge · ContextRadar · FitRadar · DimensionBars · CoverageBars · ContextSignature — hand-built SVG, theme-driven (`theme.ts`), each exposing an accessible text alternative (SC-008). No chart library (research/master).

## Motion primitives (`components/motion/`)

PageFX (route reveal) · SectionReveal · StaggerRows · CountUp · ChipCreate — GSAP-backed, wrapped by `useReducedMotion()`. Contract: short, purposeful, skippable, non-blocking; degrade to instant/opacity under `prefers-reduced-motion` (SC-003); **no parallax in the app shell**.

## Accessibility utilities (`hooks/` + providers)

- `useFocusTrap()` — modal/drawer focus containment + Esc to close.
- `ToastProvider` — `aria-live` region for toasts and auto-save announcements.
- `useReducedMotion()` — reduced-motion gate for all motion.
- `useViewport()` — breakpoints: mobile < 700, tablet < 1040, desktop ≥ 1040 (drives off-canvas sidebar, FR-FND-018).
- Focus-visible styling from tokens; semantic landmarks in shells; chart text alternatives. Target WCAG 2.1 AA basics; axe checks on priority sample flows.

## Error/feedback surfaces

- `ErrorBoundary` (app-wide) with a retry fallback in design language.
- Toast host (above) + OfflineBanner (simulated connectivity) + retry states wired to `AppError.retryable`.
