# Feature Specification: Tailwind CSS Adoption

**Feature Branch**: `0091-tailwind-css-adoption`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "Apply Tailwind across the whole project."

## Context & Current State

The frontend currently styles components almost entirely with **inline `style={{...}}`
objects that reference CSS-variable design tokens** (e.g. `borderRadius: 'var(--r-md)'`),
spread across **~70 `.tsx` files**. The design system lives in:

- `frontend/src/styles/tokens.css` — brand/neutral colors, surfaces, status tones, radii,
  shadows, easings, fonts; light theme on `:root`, dark theme on `[data-theme="dark"]`.
- `frontend/src/styles/globals.css` — resets, base typography, focus-visible ring,
  reduced-motion handling, keyframes.

No CSS Modules actually exist despite the constitution naming them. This spec introduces
**Tailwind CSS** as the styling system while **preserving the existing design tokens, dark
theme, RTL behavior, and visual fidelity**, and migrating incrementally.

### Decisions (confirmed with stakeholder)

1. **Token strategy** — Map the existing CSS-variable tokens into the Tailwind theme
   (`tailwind.config`). `tokens.css` remains the source of truth; Tailwind utilities resolve
   to `var(--token)`. This preserves dark mode and full visual fidelity.
2. **Scope** — This spec covers **setup + incremental migration**: install/configure Tailwind,
   map tokens, prove the pattern on 1–2 reference screens. Tailwind **coexists** with existing
   inline styles. Remaining files migrate in follow-up batches (out of scope here).
3. **Constitution** — This spec **amends the constitution** (`§ Stack`) to replace
   "CSS Modules" with "Tailwind CSS" and justify the new dependency.
4. **RTL** — Mandate **logical-property utilities** (`ps-/pe-/ms-/me-/start-/end-`) so the
   existing in-house i18n + RTL work (spec 009) keeps functioning.

## Clarifications

### Session 2026-06-16

- Q: Which screen(s) are the reference exemplar for FR-008? → A: The shared UI primitives
  (`components/ui/primitives.tsx` + `index.tsx`) plus the Admin login screen — specifically the
  `AdminLogin` component (route `/login`) with the shared `AuthScaffold` and `inputStyle` it depends
  on, all in `features/auth/index.tsx`. The file's other exports (`Landing`, `InvitationAccess`,
  `ForgotPassword`, `ResetPassword`, `AccessDenied`, `NotFound`) stay unmigrated (coexistence).
- Q: How is the Tailwind Preflight vs. globals.css reset collision resolved? → A: Disable Tailwind
  Preflight; `globals.css` remains the single base/reset (avoids regressing unmigrated screens).
- Q: How is SC-003 "zero visual difference" verified? → A: Manual side-by-side review in light/dark
  and LTR/RTL (no new tooling, per minimal-dependency constitution).
- Q: How are "no new inline styles" / "no physical-direction utilities" enforced? → A: Convention +
  documented policy, enforced in code review (a hard lint ban would false-positive on legacy files).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Tailwind is installed and token-aware (Priority: P1)

A developer can use Tailwind utility classes that resolve to the project's existing design
tokens, in both light and dark themes, without any visual regression.

**Why this priority**: Nothing else is possible until Tailwind is wired into the Vite build
and the token bridge exists. This is the foundational, independently shippable slice.

**Independent Test**: Add a Tailwind utility (e.g. `bg-surface text-text rounded-md`) to any
element and confirm it renders identically to the equivalent inline style in both themes, with
no build errors and the dev server / production build succeeding.

**Acceptance Scenarios**:

1. **Given** the project after setup, **When** a developer writes `class="bg-surface text-text"`,
   **Then** it resolves to `var(--surface)` / `var(--text)` and matches the prior inline style.
2. **Given** `[data-theme="dark"]` is set on the document, **When** Tailwind utilities render,
   **Then** dark-theme token values apply (Tailwind `dark:` variant is bound to the
   `[data-theme="dark"]` selector, not `prefers-color-scheme`).
3. **Given** the production build, **When** `vite build` runs, **Then** Tailwind purges unused
   utilities and the initial bundle stays within the ≤260KB budget (spec 009).

### User Story 2 - A reference screen proves the migration pattern (Priority: P2)

A developer can see the reference exemplar — the shared UI primitives
(`components/ui/primitives.tsx` + `index.tsx`) plus the Admin login screen (`AdminLogin` at route
`/login`, with its shared `AuthScaffold` + `inputStyle`) that consumes them — fully converted from
inline styles to Tailwind utilities as the canonical pattern for future batches.

**Why this priority**: Establishes the conventions (token utilities, dark variant, RTL logical
utilities, focus ring) that all later migration batches follow. Demonstrable value on its own.

**Independent Test**: Open the migrated reference exemplar, manually compare side-by-side against
the pre-migration render in both themes and both LTR/RTL directions — visual parity, no inline
`style` remaining on the migrated components.

**Acceptance Scenarios**:

1. **Given** a migrated reference screen, **When** viewed in light and dark themes, **Then** it
   is visually identical to before migration.
2. **Given** RTL direction (`dir="rtl"`), **When** the migrated screen renders, **Then** spacing
   and alignment mirror correctly because only logical-property utilities were used.
3. **Given** the migrated components, **When** inspected, **Then** they contain Tailwind classes
   and no remaining inline `style={{...}}` for properties Tailwind can express.

### User Story 3 - Governance and conventions are documented (Priority: P3)

A developer (and the constitution) reflect that Tailwind is the approved styling system, with
documented conventions for tokens, dark mode, RTL, and coexistence with legacy inline styles.

**Why this priority**: Keeps governance consistent and prevents drift, but the code works
without it. Lowest priority of the three.

**Independent Test**: Read the amended constitution and CLAUDE.md / quickstart and confirm they
name Tailwind, document the token bridge, and state the migration policy.

**Acceptance Scenarios**:

1. **Given** the constitution `§ Stack`, **When** read, **Then** it names Tailwind CSS (replacing
   CSS Modules) with a dependency justification.
2. **Given** project docs, **When** a new contributor reads them, **Then** the Tailwind token
   conventions, dark variant, RTL rule, and "no new inline styles" policy are clear.

### Edge Cases

- **Dark theme**: Tailwind's default `dark:` keys off `prefers-color-scheme`; the project uses
  `[data-theme="dark"]`. The config MUST bind `darkMode` to that selector — otherwise dark mode
  silently breaks.
- **Token drift**: A token referenced by a utility but missing from `tokens.css` must fail
  visibly (build/lint), not render a blank value.
- **Bundle budget**: Tailwind's full utility set must be purged via content globs; an
  unconfigured content path bloats the bundle past the 260KB budget.
- **RTL regression**: Any physical-direction utility (`pl-`, `mr-`, `left-`) reintroduced in a
  migrated file breaks RTL — these must be linted against / disallowed in migrated code.
- **Reduced motion & focus ring**: The existing `:focus-visible` ring and
  `prefers-reduced-motion` rules in `globals.css` must remain authoritative; Tailwind must not
  override or duplicate them inconsistently.
- **Preflight collision**: Tailwind's Preflight reset overlaps with the existing global reset in
  `globals.css`. **Resolved**: Tailwind Preflight is **disabled**; `globals.css` remains the single
  base/reset so unmigrated inline-styled screens are not regressed during coexistence.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The build MUST integrate Tailwind CSS into the existing Vite pipeline (via PostCSS),
  with `dev`, `build`, and `vitest` continuing to pass.
- **FR-002**: `tailwind.config` MUST map the existing design tokens (colors, status tones, radii,
  shadows, easings, font families) to Tailwind theme keys that resolve to the corresponding
  `var(--token)` values. `tokens.css` remains the single source of truth.
- **FR-003**: Tailwind `darkMode` MUST be bound to the `[data-theme="dark"]` selector so the
  `dark:` variant matches the existing theming mechanism.
- **FR-004**: Tailwind content globs MUST cover all `.tsx`/`.ts` source so unused utilities are
  purged and the **initial bundle stays ≤260KB** (spec 009 budget).
- **FR-005**: Migrated code MUST use **logical-property utilities** (`ps-/pe-/ms-/me-/start-/end-`,
  `text-start/text-end`) and MUST NOT use physical-direction utilities, preserving RTL. This rule is
  enforced by **documented convention + code review** (not an automated lint ban, which would
  false-positive on the unmigrated legacy files during coexistence).
- **FR-006**: The existing `:focus-visible` ring, reduced-motion handling, and base typography
  MUST remain functionally intact after Tailwind is introduced. Tailwind Preflight MUST be disabled
  so `globals.css` stays the authoritative base/reset.
- **FR-007**: Tailwind MUST coexist with existing inline styles; legacy inline-styled components
  continue to render correctly while unmigrated.
- **FR-008**: 1–2 representative reference screen(s) MUST be fully migrated to Tailwind as the
  canonical pattern, with no visual regression in light/dark themes and LTR/RTL.
- **FR-009**: The constitution `§ Stack` MUST be amended to name Tailwind CSS (replacing
  "CSS Modules") with a dependency justification; CLAUDE.md and quickstart updated accordingly.
- **FR-010**: Migration conventions MUST be documented: token utility usage, dark variant, RTL
  logical-utility rule, focus/motion ownership, and a "no new inline styles" policy for new work.
  These conventions are enforced via code review, not an automated gate (see FR-005).
- **FR-011**: The change MUST remain frontend/mock-only — no backend, no runtime behavior change
  beyond styling.

### Non-Goals (Out of Scope for 0091)

- Migrating all ~70 components in this spec (follow-up batches).
- Redesigning any visuals — fidelity is preserved, not changed.
- Replacing the design tokens with Tailwind's default palette.
- Removing `tokens.css` / `globals.css` (they remain the token + base-style source).

### Key Entities

- **Design token bridge**: The mapping in `tailwind.config` from token names to `var(--token)`
  values; the contract between `tokens.css` and Tailwind utilities.
- **Reference exemplar**: The migrated shared UI primitives (`components/ui/primitives.tsx` +
  `index.tsx`) and the Admin login screen (`AdminLogin` + shared `AuthScaffold`/`inputStyle` in
  `features/auth/index.tsx`), defining the canonical migration pattern.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `npm run build` succeeds and the initial bundle is **≤260KB**.
- **SC-002**: The full release gate (`tsc -b && vitest && eslint && format:check && build &&
  check:bundle`) passes after setup.
- **SC-003**: The reference exemplar renders with **no perceptible visual difference** vs.
  pre-migration in light and dark themes and in both LTR and RTL, confirmed by manual side-by-side
  review at 100% zoom across all four theme×direction combinations, with reviewer sign-off recorded.
- **SC-004**: A Tailwind utility bound to a token (e.g. `bg-surface`) resolves to the same color
  as the prior inline `var(--surface)` in 100% of sampled cases.
- **SC-005**: No physical-direction utilities exist in migrated files (verifiable by code review or
  a grep spot-check).
- **SC-006**: Constitution and project docs name Tailwind as the styling system with zero
  remaining references to CSS Modules as the mandated approach.

## Assumptions

- Tailwind is configured with JIT/content purge; the dependency cost is justified by developer
  velocity and is offset by purging + removal of repetitive inline style objects.
- The existing in-house i18n + RTL mechanism (spec 009) sets `dir` on the document; Tailwind
  logical utilities rely on that.
- GSAP-driven signature motion continues to own animation; Tailwind transitions are used only for
  simple, token-aligned cases.
- Visual fidelity is judged against the current rendered output as the baseline of record.
- Follow-up migration batches will be tracked as separate specs/tasks, not in 0091.
