# Feature Specification: Signature Set-Pieces (Landing, Companion, Transform Sequence)

**Feature Branch**: `011-signature-set-pieces`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "Build the deferred signature cinematics from the `project/` design source (deferred by Spec 010 FR-025): (1) the persistent Nex Robot Companion (per-page contextual hints, dismissible with a persisted preference, accessible/non-focus-trapping, reduced-motion-safe); (2) the Discovery→Assessment Transform Sequence (answers→requirements→dimensions→governed-questions→assembled, shown after the Create-Assessment discovery interview, skippable, reduced-motion fallback, communicates governed assembly with no invented questions); (3) the cinematic Landing page. GSAP-driven and lazy-loaded so the ≤260 KB initial eager-JS budget holds; reconcile the companion's mouse-parallax with constitution XII. Frontend/mock-only; builds on Specs 001–010 + Tailwind (0091)."

**Prefix**: `FR-SSP-*`

**Authoritative sources**: the `project/` design output (visual + motion source of truth — esp. `app/landing.jsx`, `app/robot_companion.jsx`, `app/transform_sequence.jsx`, `app/styles.css`, and `Nexus Platform (Standalone).html`); constitution `.specify/memory/constitution.md` (v2.0.0 — esp. I Frontend First, II Design Fidelity, IX Safe Reporting, XII Accessibility & Motion, XIII Responsive Runtime); `specs/000-shared/*`. Builds on delivered Specs 001–010 and the Tailwind adoption (`specs/0091-tailwind-css-adoption`). These three set-pieces were explicitly deferred by Spec 010 (FR-025); this feature delivers them.

## Clarifications

### Session 2026-06-16

- (Initial defaults documented in Assumptions: (a) companion presence = contained non-parallax motion; (b) companion on by default, dismissible, persisted; (c) companion on in-app surfaces only; (d) cinematic Landing replaces the minimal landing; (e) fidelity bar = "visually matches `project/` at review.")
- Q: How should the companion's motion reconcile with constitution XII (no shell parallax)? → A: No parallax anywhere — companion uses a gentle non-parallax float/hop only; static under reduced-motion (the design's mouse-parallax is dropped; strict XII compliance).
- Q: What is the companion's default visibility on first load? → A: On by default (shows its greeting/hint), dismissible, with the preference persisted — matching the design source.
- Q: How long does the per-page hint bubble stay, and how does the companion behave between pages? → A: Show the hint bubble briefly on each page entry, then auto-collapse to a small re-openable companion avatar; the hint stays re-readable on demand and is announced once per page (on change) via the polite live region.
- Q: On which surfaces does the companion appear, especially the full-bleed flows? → A: The standard Admin + User shell pages only; intentionally absent on the Create-Assessment authoring flow, the Assessment Runtime, and public/auth/landing (the hint map is scoped to covered surfaces).

## User Scenarios & Testing *(mandatory)*

<!--
  This feature delivers the three signature cinematics deferred by Spec 010 (FR-025). It STAYS
  frontend/mock-only (constitution I) and adds no product data/scoring. The animation engine (GSAP)
  is lazy-loaded so it never enters the initial eager bundle. Actors: visitors (Landing), and the
  Admin/User who experience the companion and — for Admins — the create-assessment transform sequence.
-->

### User Story 1 - Cinematic Landing page (Priority: P1) 🎯 MVP

A visitor arriving at the platform's entry page sees the `project/` design's cinematic landing — a branded hero with its signature entrance motion — that sets the tone before sign-in. The motion is non-blocking and skippable, and degrades to a static, on-brand page under reduced-motion.

**Why this priority**: It is the most self-contained set-piece (one route, no app state), the first impression for every visitor, and independently shippable — the cleanest MVP slice.

**Independent Test**: Open the landing route and confirm it matches the design source's hero/motion within the fidelity bar in both themes and across breakpoints; confirm the entrance motion never blocks the call-to-action; enable reduced-motion and confirm the page renders complete and static with no movement.

**Acceptance Scenarios**:

1. **Given** the landing route, **When** it loads, **Then** it matches the `project/` cinematic landing (hero, typography, signature motion) within the fidelity bar, in light and dark themes.
2. **Given** the landing's entrance motion, **When** it plays, **Then** the primary calls-to-action are immediately usable (motion is non-blocking) and the motion is skippable.
3. **Given** reduced-motion is preferred, **When** the landing loads, **Then** it appears complete and static (final state, no movement) and remains on-brand.

---

### User Story 2 - Nex Robot Companion (Priority: P2)

While using the app, the user is accompanied by a friendly guide ("Nex") that presents a short, contextual hint for the current page in the design's voice. It is unobtrusive, dismissible with a preference that persists, fully accessible (announced politely, never trapping focus, keyboard-operable), reduced-motion-safe, and introduces no parallax into the application shell.

**Why this priority**: It is the most distinctive, pervasive brand element (it appears across the app), but also the most complex (persistent state, per-page hints, accessibility), so it follows the self-contained Landing.

**Independent Test**: Navigate across in-app pages and confirm the companion shows the correct per-page hint, can be dismissed, stays dismissed across reloads, is announced to assistive tech without trapping focus, never blocks controls, and shows no parallax/looping motion under reduced-motion.

**Acceptance Scenarios**:

1. **Given** the companion is enabled, **When** the user lands on an in-app page, **Then** it presents that page's contextual hint in the design's voice without stealing focus or blocking the page.
2. **Given** the user dismisses the companion, **When** they reload or navigate, **Then** it stays dismissed (preference persists) until re-enabled.
3. **Given** assistive technology, **When** the companion appears or updates its hint, **Then** the hint is announced via a polite live region and the companion never traps keyboard focus.
4. **Given** reduced-motion is preferred, **When** the companion is shown, **Then** it uses no looping or parallax motion and remains usable; the application shell has no parallax in any case.

---

### User Story 3 - Discovery → Assessment Transform Sequence (Priority: P3)

After completing the Create-Assessment discovery interview, the Admin sees an animated transformation sequence that visualizes how their answers become a governed assessment — answers compress into requirements, map to dimensions, select governed questions (from the validated bank, never invented), and assemble into the finished assessment — reinforcing the platform's "governed and explainable" promise.

**Why this priority**: It is a brand-defining moment but sits on one specific flow and depends on the existing discovery step, so it is the most narrowly scoped and is independently descopable.

**Independent Test**: Complete the discovery interview and confirm the sequence plays its phases, communicates the governed assembly, is skippable within one action, never blocks reaching the assembled assessment, and presents a brief reduced-motion fallback that still lands on the result.

**Acceptance Scenarios**:

1. **Given** the discovery interview is complete, **When** the assessment is assembled, **Then** the sequence plays its phases (answers → requirements → dimensions → governed questions → assembled) and ends on the review step.
2. **Given** a user who wants to proceed immediately, **When** they skip, **Then** the sequence is dismissable within one action and lands on the same result with no loss of data.
3. **Given** the sequence copy, **When** displayed, **Then** it conveys that questions are selected from the validated bank (never invented) and shows no restricted/internal content (constitution IX).
4. **Given** reduced-motion is preferred, **When** the sequence would play, **Then** a brief non-animated fallback completes and reaches the assembled assessment.

---

### Edge Cases

- **Reduced-motion preferred** → every set-piece degrades to instant/static; the companion shows no looping/float; no shell parallax anywhere.
- **Companion dismissed** → it does not reappear on navigation/reload; re-enabling restores it.
- **Companion overlap on small screens** → it never obscures critical controls; it stays clear of or yields to primary actions and remains dismissible.
- **Rapid navigation** → the companion updates its hint cleanly without stacking, freezing, or blocking; the transform sequence does not double-fire.
- **Skip during the transform sequence** → proceeding is always possible in one action with no data loss.
- **RTL locale** → directional motion mirrors; the companion and sequence position/animate correctly with no clipping.
- **Slow devices / animation engine still loading** → set-pieces never block interaction; a non-animated state is shown until ready.
- **Immersive full-bleed flows (Create-Assessment, Assessment Runtime) and public/auth/landing pages** → the in-app companion is intentionally absent (the runtime stays focused; Create-Assessment has its own signature Transform Sequence; the Landing has its own motion). The per-page hint map contains entries only for surfaces where the companion appears.

## Requirements *(mandatory)*

### Functional Requirements

**Cinematic Landing (US1)**

- **FR-SSP-001**: The landing page MUST match the `project/` cinematic landing (hero, typography, signature entrance motion) within the agreed fidelity bar, in both light and dark themes and across supported breakpoints.
- **FR-SSP-002**: The landing's signature motion MUST be non-blocking and skippable, and MUST degrade to a complete static page under `prefers-reduced-motion`.

**Nex Robot Companion (US2)**

- **FR-SSP-003**: The system MUST present a persistent companion across the standard in-app pages (Admin and User shells) that shows a short, per-page contextual hint in the design's voice; the hint bubble appears on each page entry and then auto-collapses to a small re-openable companion avatar, with the hint re-readable on demand. The companion is intentionally absent from the immersive full-bleed flows (Create-Assessment authoring and the Assessment Runtime) and from public/auth/landing pages; the hint map covers only the surfaces where the companion appears.
- **FR-SSP-004**: The companion MUST be enabled (visible, with its greeting/hint) by default on first load; it MUST be dismissible, and its enabled/dismissed preference MUST persist across reloads.
- **FR-SSP-005**: The companion MUST be accessible: its hint is announced once per page (on change) via a polite live region, it never traps keyboard focus, and it is keyboard-operable (including dismiss and re-open).
- **FR-SSP-006**: The companion MUST honor `prefers-reduced-motion` (no looping/float animation) and MUST use a gentle, contained **non-parallax** float/hop only — no parallax (pointer- or scroll-reactive depth) anywhere, including the application shell (constitution XII).
- **FR-SSP-007**: The companion MUST NOT block interaction or obscure critical controls; on small screens it stays clear of primary actions and remains dismissible.

**Transform Sequence (US3)**

- **FR-SSP-008**: After the Create-Assessment discovery interview completes, the system MUST present a transformation sequence showing the governed assembly phases (answers → requirements → dimensions → governed questions → assembled) and ending on the review step.
- **FR-SSP-009**: The sequence MUST be skippable within one action and MUST NOT block reaching the assembled assessment; skipping MUST lose no data.
- **FR-SSP-010**: The sequence copy MUST convey that questions are selected from the validated bank (never invented) and MUST show no restricted/internal content (constitution IX).
- **FR-SSP-011**: Under `prefers-reduced-motion`, the sequence MUST present a brief non-animated fallback that still reaches the assembled assessment.

**Cross-cutting**

- **FR-SSP-012**: The set-pieces' animation engine MUST be lazy-loaded so it does not enter the initial eager JS chunk; the documented initial-bundle budget (**≤ 260 KB raw**) MUST hold.
- **FR-SSP-013**: The feature MUST remain frontend/mock-only — no backend, network, product data, or scoring; the `project/` design is the source of truth (constitution I/II).
- **FR-SSP-014**: All set-pieces MUST be keyboard-accessible with visible focus and AA contrast in both themes, MUST tolerate RTL reading order, and MUST keep all existing quality gates green (no regressions).

### Key Entities *(include if data involved)*

- **Companion State**: the companion's enabled/dismissed preference plus the per-page contextual hint set (display copy only).
- **Transform Sequence**: the ordered phases visualizing governed assessment assembly after discovery.
- **Landing Presentation**: the cinematic landing's content and signature-motion definition (presentation-only).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The landing page matches the `project/` design within the fidelity bar (both themes, all breakpoints), and 100% of its motion degrades to a complete static page under reduced-motion.
- **SC-002**: The companion shows the correct per-page hint on 100% of covered in-app pages, its dismissal persists across reloads, and it adds 0 accessibility violations and 0 focus traps on the priority flows.
- **SC-003**: The transform sequence is skippable within one action, never blocks reaching the assembled assessment, and its reduced-motion fallback reaches the result.
- **SC-004**: The application shell has 0 parallax (verified by automated check), and 100% of set-piece motion degrades to instant/static under reduced-motion.
- **SC-005**: The initial eager JS chunk stays ≤ 260 KB (the animation engine is not in it), and all quality gates (type-check, tests, lint, format, build, bundle budget) remain green.
- **SC-006**: 0 functional regressions — every previously passing flow and test still passes.

## Assumptions

- Builds on delivered Specs 001–010 and the Tailwind adoption (`0091`); these three set-pieces are exactly what Spec 010 deferred (FR-025). Everything stays frontend/mock-only (constitution I).
- The `project/` design output is the authoritative visual + motion source of truth; pixel-perfect parity is not required where the design omits a state; behavioral deviations require justification at review.
- **Parallax vs constitution XII**: constitution XII forbids parallax in the application shell and is non-negotiable, so the companion's design-source *mouse-parallax* is dropped in favor of a contained, non-parallax float/presence. `/speckit-clarify` may revisit if the companion is judged not to be "shell," but the default respects the constitution.
- The companion is **on by default**, dismissible, with the preference persisted (versioned local storage, mirroring the theme/locale stores); it appears on the in-app Admin/User surfaces, not on public/auth pages.
- The cinematic Landing replaces the current minimal landing page.
- The animation engine (already an approved dependency) is **lazy-loaded** per set-piece so the eager bundle budget holds; the motion reuses the existing reduced-motion detection and keyframe vocabulary where applicable (Spec 010).
- Reduced-motion safety and the no-shell-parallax rule are hard, non-negotiable constraints (constitution XII).
- Existing test infrastructure (Vitest + RTL, axe, the Spec 008 release gate, the Spec 009 bundle-budget + reduced-motion + no-shell-parallax checks) is reused and extended.

## Dependencies

- **Depends on**: Specs 001–010 (delivered surfaces, the create-assessment discovery flow, the motion-primitive vocabulary from Spec 010, the bundle-budget gate, RTL) and `0091` (Tailwind styling).
- **Consumes**: the `project/` design source (`landing.jsx`, `robot_companion.jsx`, `transform_sequence.jsx`); the existing reduced-motion/theming utilities; `specs/000-shared/*`.
- **Out of scope**: any new product feature, screen beyond these set-pieces, route, scoring, report-content change, or backend work.
