# Feature Specification: Foundation and Design System

**Feature Branch**: `001-foundation-design-system`

**Created**: 2026-06-15

**Status**: Draft

**Input**: User description: "specs/001-foundation-design-system — Foundation, shells, tokens, mock services, persistence (master scope Spec 001)"

**Prefix**: `FR-FND-*`

**Authoritative sources**: `../000-master-scope/spec.md`, `../000-shared/data-model.md`, `../000-shared/status-models.md`, `../000-shared/route-map.md`, `../000-shared/handoff-map.md`, `../000-shared/workbook-audit.md`; constitution `.specify/memory/constitution.md` (v2.0.0).

## Clarifications

### Session 2026-06-15

- Q: When no theme preference is stored (first/cold load), what default theme should the pre-paint script apply? → A: Follow the OS/browser `prefers-color-scheme` (system) on first load; the explicit user choice, once made, overrides it and persists.
- Q: How should the versioned local store behave when it reads an entry written under an older schema version (version mismatch)? → A: Discard the stale namespaced entry and start fresh (safe reset); no migration code in V1.
- Q: How is the governed `item_bank` workbook converted into app data and loaded? → A: Convert to a committed, typed module (TS/JSON) at build/prep time and load it via dynamic `import()` so it is code-split out of the initial chunk; no runtime fetch or in-browser workbook parsing.

## User Scenarios & Testing *(mandatory)*

<!--
  Spec 001 is the substrate every other feature spec (002–008) builds on. Its "users"
  are both the end users of the platform (Admin and User, who experience consistent,
  secure, accessible, themed screens) and the downstream feature teams (who consume the
  shells, components, services, and governance seam). Each story below is an
  independently demonstrable slice of the foundation.
-->

### User Story 1 - Role-separated, guarded application shell (Priority: P1)

The platform boots into two clearly separated experiences — an Admin workspace and a User (candidate) portal — and routing prevents anyone from reaching screens or data outside their role. Without a session, protected routes send the visitor to the correct entry point; with the wrong-role session, the visitor is denied access rather than shown another role's data.

**Why this priority**: Role separation and route guarding are constitutionally NON-NEGOTIABLE (Two Roles Only) and are the precondition for every other screen. Nothing else can be safely built or demoed until the shells and guards exist. This slice alone delivers a navigable, secure, two-role skeleton.

**Independent Test**: Boot the app, attempt to open an `/admin/*` route and an `/app/*` route with no session, with an Admin session, and with a User session; verify each lands on the correct destination (entry point, allowed shell, or access-denied) and never renders the other role's chrome or data.

**Acceptance Scenarios**:

1. **Given** no active session, **When** any `/admin/*` route is opened, **Then** the visitor is redirected to the Admin login entry point.
2. **Given** no active session, **When** any `/app/*` route is opened, **Then** the visitor is redirected to the User invitation/login entry point.
3. **Given** an Admin session, **When** a User-only route is opened, **Then** access is denied (access-denied screen or redirect) and no User-portal data is rendered — and the reverse holds for a User session opening an Admin route.
4. **Given** a valid session for a role, **When** the role's shell loads, **Then** the correct navigation registry (Admin: 13 entries; User: 7 entries) renders and the signature full-bleed mode is available for the create-assessment and runtime routes.

---

### User Story 2 - Design-faithful, themeable, accessible UI substrate (Priority: P2)

Every screen is composed from one shared set of design-faithful building blocks — colors, typography, spacing, components, charts, and motion — that match the Claude Design source of truth. Users can switch between light and dark themes; the choice persists across reloads with no flash of the wrong theme. All motion respects the user's reduced-motion preference, and core interactions are keyboard-operable with visible focus.

**Why this priority**: A consistent, accessible, theme-correct component and motion system is what makes the prototype look and feel like one credible product (Design Fidelity, Accessibility and Motion). It is required by all feature screens but can be delivered and demonstrated on a sample page once the shells (P1) exist.

**Independent Test**: Render a sample page using the shared components and charts in both themes; toggle theme and reload to confirm persistence with no flash; enable `prefers-reduced-motion` and confirm animations degrade to instant/opacity; navigate the sample interactions by keyboard with visible focus.

**Acceptance Scenarios**:

1. **Given** dark theme is selected, **When** the app is reloaded, **Then** it paints in dark theme immediately with no flash of light theme, and badges/charts render correctly in dark theme.
2. **Given** light theme is selected, **When** the app is reloaded, **Then** the same fidelity holds in light theme.
3. **Given** `prefers-reduced-motion` is set, **When** any animation would run, **Then** it degrades to an instant or opacity-only transition and never blocks interaction.
4. **Given** any shared component (modal, menu, table, field), **When** operated by keyboard only, **Then** focus is visible, modals trap focus and close on Escape, and contrast is sufficient in both themes.

---

### User Story 3 - Service-only data boundary with mock persistence (Priority: P3)

All screens obtain data exclusively through a typed mock-service layer that returns Promises with realistic latency and explicit loading/error/empty/success states; no screen reads fixtures or local storage directly. Mock authentication, simulated network behavior, and namespaced versioned persistence are available so that a later real backend can replace the mocks without rewriting the UI.

**Why this priority**: The service seam (Service Boundaries) is what makes the prototype swappable for the future FastAPI + Supabase backend and keeps fixtures decoupled. It depends on the shells and components being in place, so it follows them, but it is essential before feature data work begins.

**Independent Test**: Make one page load its data through a service method (Promise) showing loading then success; confirm via search that no component imports a fixture or persistence module directly; toggle the mock error simulator and confirm the page shows an error/retry state; reload and confirm persisted state (theme, runtime progress) is restored from a namespaced, versioned store.

**Acceptance Scenarios**:

1. **Given** any page needing data, **When** it loads, **Then** it calls a typed service method returning a Promise and exposes loading, error, empty, and success states — and it never imports a fixture or reads persistence directly.
2. **Given** the mock HTTP simulator is set to error, **When** a service call is made, **Then** the UI surfaces an error state with retry.
3. **Given** an Admin signs in, a User activates from an invitation (sets a password on first access), or a User signs in to return, **When** the mock auth service is used, **Then** a local session is established and persisted (no real credential validation).
4. **Given** persisted state exists (theme, assessment runtime progress, explicit drafts), **When** the app reloads, **Then** the namespaced, versioned store restores it correctly.

---

### User Story 4 - Governed question bank and governance-display helpers (Priority: P3)

The governed source question bank (`item_bank`) is converted into the app with its source metadata preserved exactly and is lazy-loaded so it never blocks first paint. Reusable governance-display helpers (eligibility, confidence gating, use-case gating, visibility engine, user-safe projection) are available so every downstream feature applies the same governed rules consistently.

**Why this priority**: Governance is constitutionally NON-NEGOTIABLE (Governed Question Source, Immutable Metadata, Safe Reporting). Centralizing it in the foundation guarantees consistent enforcement and prevents fabrication of fields. It builds on the service boundary (P3) and is required before assessment-creation and reporting features begin.

**Independent Test**: Convert `item_bank`; run a provenance test confirming source `item_id` and metadata are unchanged and no `weight`/`difficulty` is fabricated; confirm the bank is excluded from the initial bundle chunk; unit-test the governance helpers against representative eligible, blocked, quarantined, low-confidence, and restricted items.

**Acceptance Scenarios**:

1. **Given** the build converts `item_bank`, **When** items are loaded, **Then** every source metadata field is preserved exactly and no `weight`/`difficulty` (or any field absent from the source) is fabricated or displayed.
2. **Given** the app boots and question selection is not in use, **When** the initial bundle loads, **Then** the governed bank is not part of the initial chunk (lazy-loaded).
3. **Given** the eligibility helper, **When** evaluating an item, **Then** it includes only production items that are not operationally blocked or quarantine-pending and that satisfy job-level/use-case rules, per `../000-shared/status-models.md`.
4. **Given** the user-safe projection helper, **When** projecting an Admin report for the User audience, **Then** raw responses, formulas, scoring versions, internal governance/psychometric flags, blocked values, Admin notes, and source-item metadata are stripped.

---

### Edge Cases

- **No session / expired session** on a deep-linked protected route → redirect to the correct role entry point, preserving intended destination where feasible.
- **Wrong-role session** on a cross-role route → access-denied, never a data leak from the other role.
- **Theme flash on first paint** (cold load, no stored preference) → pre-paint application of the OS `prefers-color-scheme` (system) so no wrong-theme flash occurs.
- **Reduced-motion mid-session toggle** → subsequent animations honor the preference without reload.
- **Mock service latency/error** (simulated) → loading skeletons and error/retry states, never an indefinite blank screen.
- **Persistence schema version mismatch** (older stored data after a model change) → versioned store discards the stale entry and starts fresh rather than crashing (no migration in V1).
- **Corrupt or partial `item_bank` row** during conversion → the row is rejected/flagged without fabricating missing metadata.
- **Offline / connection loss** (simulated) → an offline banner appears; the app remains operable for already-loaded content.
- **Component used outside a theme/provider context** → fails safely with a sensible default rather than a broken render.
- **Responsive breakpoint crossings** (mobile <700, tablet <1040) → off-canvas sidebar and touch-friendly targets engage without layout breakage.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-FND-001**: The system MUST provide application bootstrap, a router, an `AdminShell` (for `/admin/*`), a `UserShell` (for `/app/*`), and full-bleed layouts for the signature create-assessment route and the assessment runtime.
- **FR-FND-002**: The system MUST enforce role-based route guards with an access-denied flow, redirecting unauthenticated visitors to the correct role entry point and preventing cross-role access and data exposure.
- **FR-FND-003**: The system MUST port the Claude Design tokens faithfully — colors, typography (Schibsted Grotesk / Hanken Grotesk / JetBrains Mono), spacing, radii, shadows, badge/status tones, chart tokens, and motion easings — and mirror chart-needed values in a typed theme module.
- **FR-FND-004**: The system MUST persist the theme choice locally and apply it pre-paint so there is no flash of the wrong theme on reload. When no preference is stored (first/cold load), the pre-paint script MUST follow the OS/browser `prefers-color-scheme`; an explicit user choice overrides and persists thereafter.
- **FR-FND-005**: The system MUST provide a reusable UI component library, including: Button, IconButton, Card, Modal, Drawer, Popover, Menu, Tabs, Field, TextArea, Select, Slider, SegmentedControl, Toggle, Checkbox, RadioGroup, StatusBadge, Chip, ConfidenceChip, TrustBadge, Avatar, ScoreBar, Ring, CountUp, Tooltip, EmptyState, Skeleton, DataTable, FilterBar, SearchInput, Stepper, Toast, and Timeline.
- **FR-FND-006**: The system MUST provide hand-built, theme-driven chart primitives: Gauge, ContextRadar, FitRadar, DimensionBars, CoverageBars, and ContextSignature.
- **FR-FND-007**: The system MUST provide motion primitives — route reveal, section reveal, staggered rows, count-up, chip creation — and a reduced-motion bypass hook; all motion MUST honor `prefers-reduced-motion`, be skippable, and be non-blocking, with no parallax in the app shell.
- **FR-FND-008**: The system MUST provide a mock HTTP simulator with configurable latency and error injection as the basis for all service calls.
- **FR-FND-009**: The system MUST provide namespaced, versioned local persistence for theme, assessment runtime progress, and explicit drafts. On a schema-version mismatch, the store MUST discard the stale namespaced entry and start fresh (safe reset); no migration logic is implemented in V1.
- **FR-FND-010**: The system MUST provide a mock authentication service supporting Admin sign-in; a permanent User account activated from an invitation (User sets a password on first access) and User return sign-in; and mock forgot/reset — with no real credential validation.
- **FR-FND-011**: The system MUST provide an app-wide error boundary, an aria-live toast host, an offline banner, and retry states.
- **FR-FND-012**: The system MUST provide governance-display helpers — question eligibility, confidence gate, use-case gate, visibility engine, and user-safe report projection — implementing the rules in `../000-shared/status-models.md`.
- **FR-FND-013**: The system MUST define typed service interfaces matching every service in `../000-shared/handoff-map.md`, so feature specs can consume them immediately and a future API swap requires no UI rewrite.
- **FR-FND-014**: The system MUST support route-level lazy loading and code-split the governed `item_bank` so it is excluded from the initial chunk. The bank MUST be produced as a committed, typed module (TS/JSON) by a build/prep-time conversion step and loaded via dynamic `import()` — no runtime fetch of a static asset and no in-browser workbook parsing.
- **FR-FND-015**: The system MUST provide base accessibility utilities — focus management, modal focus trap with Escape, aria-live regions, an accessible text alternative for charts, and reduced-motion handling — targeting WCAG 2.1 AA basics.
- **FR-FND-016**: The system MUST author typed models from `../000-shared/data-model.md` under the models layer, with governance metadata immutable at the type level (no mutation, no fabricated fields).
- **FR-FND-017**: The system MUST provide centralized fixtures decoupled from components (one organization, one Admin, ≥8 Participants, Role Blueprints, Context Profiles, assessment drafts, assignments, invitations, reminders, reports spanning confidence bands plus ≥1 omitted/blocked section, notifications, exports, activity events) and a lazily loaded local bank converted from `item_bank` that includes blocked/pilot/quarantine items to exercise governance filtering.
- **FR-FND-018**: The system MUST provide responsive behavior — an off-canvas sidebar below the tablet breakpoint and a viewport helper distinguishing mobile (<700), tablet (<1040), and desktop — usable down to mobile.

### Key Entities *(include if feature involves data)*

- **Session**: the mock-authenticated context for a signed-in actor; carries role (Admin or User) and drives route guarding and shell selection. No real credentials.
- **Theme Preference**: the persisted light/dark selection applied pre-paint.
- **Service Interface**: the typed contract for each mock service (mirrors `../000-shared/handoff-map.md`); the de-facto API boundary the UI consumes.
- **Governed Item (`item_bank` entry)**: an immutable source question record with its full source metadata (`item_id`, domain, dimension, facet, method family, format, response scale, keyed answer, options, loading type, reverse-scored flag, bank state, use status, validation track, job-level overlay, review status); read-only everywhere.
- **Governance Decision**: the output of eligibility / confidence / use-case / visibility / user-safe helpers (e.g., visible, visible-with-caution, downgraded, hidden, blocked, not-generated) applied consistently across features.
- **Persisted Store Record**: namespaced, versioned local data (theme, runtime progress, explicit drafts) with safe handling of version mismatches.
- **Fixture Set**: the centralized, typed mock dataset (organization, Admin, Participants, blueprints, context profiles, drafts, assignments, reports, notifications, exports, activity events) decoupled from components.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of attempts to reach a protected or cross-role route without the correct session result in the correct redirect or access-denied outcome, with zero instances of the other role's data rendering.
- **SC-002**: Switching theme and reloading restores the chosen theme with no perceptible flash of the wrong theme on 100% of loads.
- **SC-003**: With reduced-motion enabled, 100% of animations degrade to instant/opacity and none block interaction.
- **SC-004**: 100% of data-displaying screens obtain their data through a typed service call; an automated check finds zero components importing fixtures or persistence directly.
- **SC-005**: The governed bank is excluded from the initial load; first meaningful paint occurs without loading the full bank, and the bank loads only when question selection is needed.
- **SC-006**: A provenance test confirms 100% of converted `item_bank` items preserve their source metadata unchanged, with zero fabricated fields (e.g., no `weight`/`difficulty`).
- **SC-007**: Governance-display helpers pass unit tests covering eligible, blocked, quarantined, low-confidence, and restricted cases, with the user-safe projection stripping every restricted field.
- **SC-008**: Both shells boot and core shared components are operable by keyboard with visible focus and sufficient contrast in both themes on priority sample flows (accessibility checks pass).
- **SC-009**: A downstream feature team can build a new screen using only the foundation's shells, components, and a typed service stub without modifying foundation internals.

## Assumptions

- The current phase is frontend-only; FastAPI, Supabase, real authentication, real AI calls, real scoring, real report/PDF/email generation, and production audit/policy enforcement are explicitly out of scope (see `../000-shared/handoff-map.md`).
- The Claude Design output in `project/` is the visual source of truth; any state missing from the design (error, empty, loading, responsive, 404) is added in the same design language.
- The confirmed tooling is Vite + React 18 + TypeScript (strict) + React Router, CSS-variable tokens + CSS Modules, Vitest + React Testing Library, ESLint + Prettier, GSAP (or the existing motion library), and hand-built SVG / lightweight charts; no heavy dependency is added without justification.
- Public/system routes (`/`, `/login`, `/invitation`, `/forgot-password`, `/reset-password`, `/access-denied`, `*`) are reserved here but their pages are owned by Spec 007 (and `/login`/`/invitation` entry behavior shared with 002/006).
- The User has a permanent account in V1: the invitation activates the account (password set on first access) and the User signs in to return (per master-scope clarification 2026-06-13).
- The governed workbook source worksheet `item_bank` (≈543 items, 31 columns per `../000-shared/workbook-audit.md`) is the only question source; frontend gates are advisory and become server-authoritative in the future backend.
- Local persistence uses the browser's local storage only, namespaced and versioned; no database is used in V1.

## Dependencies

- **Depends on**: nothing — this is the foundation substrate every other spec (002–008) builds on.
- **Provides to all other specs**: shells, routing, components, charts, motion, typed services and persistence, governance helpers, models, and fixtures.
- **Consumes**: the design bundle in `project/`, the governed `item_bank`, and the shared canon in `../000-shared/*` (data model, status models, route map, handoff map, workbook audit, risk register).
