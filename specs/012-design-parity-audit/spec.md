# Feature Specification: Design-Parity Audit & Gap-Closure

**Feature Branch**: `012-design-parity-audit`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "Design-parity audit & gap-closure: bring every implemented screen to visual parity with the `project/` design source (`Nexus Platform.html` and its `app/*.jsx` imports + `styles.css`). Audit each route against its prototype counterpart, enumerate fidelity gaps (color/spacing/typography/layout/iconography/elevation, loading/empty/error/404/responsive states, signature motion, component structure) in both light/dark themes + RTL, and close them within the agreed fidelity bar. Frontend/mock-only; no new product features, data, scoring, routes, or service changes; reduced-motion-safe; no shell parallax; ≤ 260 KB eager JS budget; all quality gates green. Builds on Specs 001–011 and deepens the 010 readiness-level fidelity pass to full-app parity."

**Prefix**: `FR-PAR-*`

**Authoritative sources**: the `project/` design output — `Nexus Platform.html` (the full-app entry) and its imports (`app/shell.jsx`, `app/ui.jsx`, `app/icons.jsx`, `app/landing.jsx`, `app/admin_*.jsx`, `app/create_assessment*.jsx`, `app/transform_sequence.jsx`, `app/report_detail.jsx`, `app/user_portal.jsx`, `app/user_assessment.jsx`, `app/robot_companion.jsx`, `app/styles.css`). Constitution `.specify/memory/constitution.md` (v2.0.0 — esp. I Frontend First, II Design Fidelity, IX Safe Reporting, XII Accessibility & Motion, XIII Responsive Runtime). Builds on delivered Specs 001–011; deepens the readiness-level fidelity pass of Spec 010 to full-app parity.

## Clarifications

### Session 2026-06-16

- (Initial defaults documented in Assumptions: (a) parity bar against source values; (b) no-design-counterpart screens kept + noted; (c) shared chrome/components first; (d) a written per-screen gap inventory artifact.)
- Q: How strict is the parity bar? → A: Match the design's specified source values **exactly** (color, spacing, type scale, layout, iconography, elevation), verified at review plus token/structure assertions; **no automated pixel-diff tooling** (brittle in jsdom). Pixel-perfect is the target where the design specifies a value; not required where the design omits a state.
- Q: Which gap severities must this feature close (definition of done)? → A: Close all **High + Medium** severity gaps; **Low** (cosmetic/marginal) gaps are logged in the inventory and deferrable with reviewer sign-off. Each inventory entry is classified High/Medium/Low.
- Q: Audit sequencing — one upfront inventory or per-area interleaved? → A: Per-area interleaved — each user story audits its area then closes that area's High+Medium gaps; the gap inventory grows area-by-area (incremental delivery), rather than one upfront app-wide audit phase.

## User Scenarios & Testing *(mandatory)*

<!--
  This is a polish/parity feature. It adds NO new product screens, routes, data, scoring, or service
  behavior. It audits the already-implemented app (Specs 001–011) against the project/ design source
  and closes the remaining visual gaps, STAYING frontend/mock-only (constitution I). Actors are the
  end users (Admin/User) who get a pixel-faithful, on-brand experience, and the reviewer who judges
  parity against the design source.
-->

### User Story 1 - Shared chrome & component parity (Priority: P1) 🎯 MVP

The app's shared frame and design-system primitives — sidebar, topbar (search, notifications, help/profile popovers, avatar, theme toggle), mobile navigation, and the reusable components (buttons, cards, inputs/selects, badges/chips, data tables, tooltips, empty/loading/skeleton states) — visibly match the `project/` design in both themes, across breakpoints, and in RTL.

**Why this priority**: The chrome and primitives appear on every screen, so closing their gaps yields the broadest, highest-leverage parity gain and is the foundation every other screen sits on. It is independently shippable and testable.

**Independent Test**: Place the shell and a representative set of primitives side by side with their `project/` counterparts in light + dark themes, at mobile/tablet/desktop widths, and in RTL; confirm color, spacing, typography, iconography, elevation, and interaction states match the parity bar with no off-brand or missing states.

**Acceptance Scenarios**:

1. **Given** the sidebar + topbar, **When** compared to `app/shell.jsx`, **Then** layout, spacing, icons, popovers/menus, avatar, and theme toggle match the parity bar in both themes.
2. **Given** the shared components, **When** compared to `app/ui.jsx`/`app/icons.jsx`, **Then** buttons, cards, inputs, badges/chips, tables, tooltips, and empty/loading/skeleton states match the design.
3. **Given** the shell at mobile width and in RTL, **When** viewed, **Then** the responsive nav and reading order match the design with no overflow/clipping.

---

### User Story 2 - Admin screens parity (Priority: P2)

Every Admin screen — dashboard, candidates/users (list + detail), assessments (list + detail), reports (list + detail), candidate comparison, role blueprints (list/detail/builder), context profiles (list/detail/builder), history, exports, notifications, organization settings, and profile — visibly matches its `project/` counterpart, including all states.

**Why this priority**: Admin is the larger, higher-traffic surface area and the primary daily workflow; bringing it to parity delivers the most visible product credibility after the shared layer.

**Independent Test**: For each Admin route, compare to its design counterpart (`app/admin_*.jsx`, `app/report_detail.jsx`) in both themes + responsive + RTL; confirm tokens/typography/spacing/layout/iconography and loading/empty/error states match the parity bar.

**Acceptance Scenarios**:

1. **Given** each Admin screen, **When** compared to its design source, **Then** color, type, spacing, layout, and iconography match the parity bar in both themes.
2. **Given** an Admin screen in a loading/empty/error state, **When** viewed, **Then** the state exists and matches the design's language.
3. **Given** an Admin screen at mobile/tablet width and in RTL, **When** viewed, **Then** the responsive layout and reading order match the design with no overflow/clipping.

---

### User Story 3 - User portal & runtime parity (Priority: P2)

Every User-facing screen — the user dashboard, my assessments, assessment overview/instructions/consent/completion, the assessment runtime, user-safe reports, history, notifications, profile & privacy, and help — visibly matches its `project/` counterpart, including all states.

**Why this priority**: The candidate experience is brand-critical and lower-tolerance for visual roughness; it is independent of the Admin surface and separately demonstrable.

**Independent Test**: For each User route, compare to its design counterpart (`app/user_portal.jsx`, `app/user_assessment.jsx`) in both themes + responsive + RTL; confirm parity-bar match including states, and that no restricted/internal content surfaces (constitution IX).

**Acceptance Scenarios**:

1. **Given** each User screen, **When** compared to its design source, **Then** tokens/typography/spacing/layout/iconography match the parity bar in both themes.
2. **Given** the assessment runtime, **When** compared to the design, **Then** the question presentation, progress, and controls match, with no live score or internal metadata shown.
3. **Given** a User screen at mobile width and in RTL, **When** viewed, **Then** the responsive layout and reading order match with no overflow/clipping.

---

### User Story 4 - Create-Assessment flow parity (Priority: P3)

The Create-Assessment wizard (all steps), the scripted discovery interview, and the Transform Sequence visibly match the `project/` create-assessment design, including the full-bleed layout and signature motion.

**Why this priority**: It is the signature authoring journey but the most contained (one flow), so it follows the broader surfaces; it can be brought to parity independently.

**Independent Test**: Walk the create-assessment flow and compare each step + the discovery chat + the transform sequence to `app/create_assessment*.jsx`/`app/transform_sequence.jsx`; confirm parity-bar match and reduced-motion safety.

**Acceptance Scenarios**:

1. **Given** each wizard step, **When** compared to the design, **Then** layout, controls, spacing, and iconography match the parity bar.
2. **Given** the discovery chat and the transform sequence, **When** compared to the design, **Then** their presentation and motion match the design's intent and remain skippable/reduced-motion-safe.

---

### Edge Cases

- **Screen with no design counterpart** (internal/sample scaffolds) → keep the current treatment in the same design language; record it in the inventory as "no design source" (not a parity defect).
- **Design screen with no app counterpart** → out of scope (this feature adds no new product screens/features); record as a known omission.
- **Reduced-motion** → all signature motion degrades to instant/opacity; no shell parallax anywhere.
- **RTL** → reading order, directional icons, and directional motion mirror; no clipping.
- **Theme switch** → parity holds in both light and dark; no mismatched or unstyled colors.
- **Long content / large tables / small screens** → layout matches the design's responsive intent without overflow or broken spacing.
- **Iconography mismatch** → icons align to the design's icon set; no placeholder or off-set icons.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-PAR-001**: The feature MUST produce a written per-screen **gap inventory** mapping each live route to its `project/` counterpart and listing concrete deviations (color, spacing, typography, layout, iconography, elevation, states, motion, component structure), each classified **High / Medium / Low** severity. The feature MUST close all High + Medium gaps; Low gaps are logged and deferrable with reviewer sign-off.
- **FR-PAR-002**: The shared chrome (sidebar, topbar, search, notification/help/profile popovers, avatar, theme toggle, mobile navigation) MUST match the design within the parity bar in both themes, across breakpoints, and in RTL.
- **FR-PAR-003**: The shared UI components (buttons, cards, inputs/selects, badges/chips, data tables, tooltips, and empty/loading/skeleton states) MUST match the design within the parity bar.
- **FR-PAR-004**: Every Admin screen MUST match its `project/` counterpart for color, typography, spacing, layout, iconography, and elevation, including its loading/empty/error/responsive states.
- **FR-PAR-005**: Every User-portal and runtime screen MUST match its `project/` counterpart, including states, and MUST NOT surface restricted/internal content (constitution IX).
- **FR-PAR-006**: The Create-Assessment wizard (all steps), the discovery interview, and the Transform Sequence MUST match the `project/` create-assessment design, including full-bleed layout and signature motion.
- **FR-PAR-007**: Every screen MUST present its loading, empty, error, 404, and responsive states in the design's language (no missing or off-brand states).
- **FR-PAR-008**: Signature motion on each screen MUST match the design's intent, be skippable/non-blocking, honor `prefers-reduced-motion`, and introduce no parallax in the application shell (constitution XII).
- **FR-PAR-009**: Parity MUST be verified in both light and dark themes and in RTL reading order.
- **FR-PAR-010**: The feature MUST change presentation/markup/styling only — no new product features, screens, routes, data, scoring, or service/contract behavior (constitution I/IV).
- **FR-PAR-011**: The initial eager JS chunk MUST stay ≤ 260 KB (GSAP remains lazy), and all existing quality gates MUST remain green with 0 functional regressions.
- **FR-PAR-012**: Iconography MUST align to the design's icon set; no placeholder, mismatched, or misaligned icons on audited screens.

### Key Entities *(include if data involved)*

- **Gap Inventory**: the per-screen record mapping a live route to its design counterpart and enumerating its deviations and resolution status (presentation-only artifact).
- **Parity Bar**: the agreed acceptance threshold for "matches the design" used at review.
- **Design Source Set**: the `project/` screens/components that are the authoritative visual reference.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The gap inventory covers 100% of live routes, each mapped to its design counterpart (or explicitly marked "no design source").
- **SC-002**: 100% of audited screens meet the parity bar at review in both themes and in RTL, with **0 High or Medium** severity gaps remaining (Low gaps logged/deferrable) and 0 missing or off-brand states.
- **SC-003**: The shared chrome + components (the most pervasive layer) have **0 High or Medium** severity deviations remaining.
- **SC-004**: 100% of signature motion degrades to instant/opacity under reduced-motion, and the application shell has 0 parallax (verified by automated check).
- **SC-005**: The initial eager JS chunk stays ≤ 260 KB (GSAP lazy), and all quality gates (type-check, tests, lint, format, build, bundle budget) remain green.
- **SC-006**: 0 functional regressions — every previously passing flow and test still passes.

## Assumptions

- Builds on delivered Specs 001–011; the entire app already exists and is the subject of the audit. This feature deepens the readiness-level fidelity pass of Spec 010 to full-app, screen-by-screen parity.
- The `project/` design output (`Nexus Platform.html` + its `app/*.jsx` imports + `styles.css`) is the authoritative visual + motion source of truth.
- **Parity bar** (clarify Q1): match the design's specified source values **exactly** (color/spacing/type scale/layout/iconography/elevation), verified at review + token/structure assertions, with **no automated pixel-diff tooling** (brittle in jsdom, and avoids a heavy visual-regression dependency). Pixel-perfect is the target where the design specifies a value; not required where the design omits a state.
- **Prioritization**: highest-traffic/most-pervasive first — shared chrome/components (P1), then Admin (P2), User portal/runtime (P2), Create-Assessment (P3). (Can be re-ordered in `/speckit-clarify`.)
- Screens with no design counterpart keep their current treatment (recorded in the inventory); design screens with no app counterpart are out of scope (no new features).
- **Audit sequencing** (clarify Q3): per-area interleaved — each user story audits its area then closes that area's High+Medium gaps; the gap inventory accumulates area-by-area rather than as one upfront audit phase.
- Reduced-motion safety, no-shell-parallax, RTL, and the ≤260 KB eager budget are hard, non-negotiable constraints (constitution XII/XIII; Spec 009 gate).
- Existing test infrastructure (Vitest + RTL, axe, the Spec 008 release gate, the Spec 009 bundle-budget + reduced-motion + no-shell-parallax checks) is reused and extended; pixel-diff snapshotting is not used (brittle in jsdom — parity is judged at review + token/structure assertions).

## Dependencies

- **Depends on**: Specs 001–011 (the delivered surfaces, design tokens, motion vocabulary, companion/set-pieces, RTL, i18n, the bundle-budget gate) and `0091` (Tailwind styling).
- **Consumes**: the `project/` design source; the existing design-token system; reduced-motion/theming utilities; `specs/000-shared/*`.
- **Out of scope**: any new product feature, screen, route, scoring, report-content change, data model, or service/contract change.
