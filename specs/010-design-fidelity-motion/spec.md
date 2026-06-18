# Feature Specification: Design Fidelity & Signature Motion

**Feature Branch**: `010-design-fidelity-motion`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "Bring the frontend up to the visual/animation parity of the reference prototype (`project/Nexus Platform (Standalone).html`). Foundation first — typography, the full signature-motion vocabulary, animated charts, and entrance reveals app-wide. Cinematic set-pieces (Landing, Robot Companion, TransformSequence) are sequenced as later capabilities."

> **Why this feature exists.** The reference design in `project/` is the constitution's declared visual source of truth (Principle II — Design Fidelity). The implemented frontend faithfully ports the **color/spacing tokens** but omits most of the reference's **typography and signature motion**: the three brand font families are referenced in tokens but never loaded (so every screen renders in a system fallback), 11 of the reference's 13 keyframe animations are absent, charts have no entrance animation, and the route/section reveal primitives are wired into only 1 of 56 screens. The result is a product that reads as visibly "off" from the approved design. This feature closes that gap for the **foundation** layer. The three reference-only cinematic set-pieces are explicitly **out of scope here** and tracked as follow-on capabilities.

## Clarifications

### Session 2026-06-16

- Q: How should list/row entrance stagger be bounded so large collections stay usable (FR-012)? → A: Cap the staggered count — only the first ~10 rows stagger; all remaining rows appear together immediately.
- Q: Which brand font weights should be self-hosted (FR-002)? → A: Match the design per family — Schibsted Grotesk 400/500/600/700/800, Hanken Grotesk 400/500/600/700, JetBrains Mono 400/500/600 (Latin subset, woff2).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The app renders in the brand typography (Priority: P1)

Any user opening any screen sees text rendered in the platform's brand typefaces — the display family for headings, the UI family for body/controls, and the monospace family for code/IDs/metrics — in both light and dark themes, matching the approved design rather than a generic system font.

**Why this priority**: Typography is the single most pervasive visual difference between the current build and the reference; it affects every screen and is currently silently broken (fonts named but never loaded). Without it, no amount of other polish makes the app match the design.

**Independent Test**: Load any route with brand fonts available offline; inspect that headings, body, and monospace elements resolve to the brand families (not `system-ui`); confirm in both themes and with no network access.

**Acceptance Scenarios**:

1. **Given** the application is opened on a fresh load, **When** any screen renders, **Then** headings use the display family, body/controls use the UI family, and code/IDs/metrics use the monospace family.
2. **Given** the device is offline, **When** the app loads, **Then** brand fonts still render (no dependency on an external font network request).
3. **Given** either light or dark theme is active, **When** text renders, **Then** typography is identical in family and weight across both themes.
4. **Given** a font is still loading, **When** text paints, **Then** it falls back gracefully to a system stack without layout shift breaking the page.

---

### User Story 2 - Screens animate in with a consistent, purposeful entrance (Priority: P1)

When a user navigates between routes, the incoming screen reveals with a short, consistent entrance motion, and primary sections/lists stagger in — so navigation feels intentional and matches the reference's signature feel, without ever blocking interaction.

**Why this priority**: Entrance motion is the most noticeable "missing animation" across the app and is currently applied to essentially one screen. Wiring it consistently delivers the broadest perceived-quality gain after typography.

**Independent Test**: Navigate across admin and user routes; confirm each route plays a single short entrance reveal, high-value screens stagger their sections/rows, motion never delays the user's ability to click, and everything degrades to instant under reduced-motion.

**Acceptance Scenarios**:

1. **Given** a user navigates to a new route, **When** the screen mounts, **Then** it plays one short entrance reveal (fade/translate) and re-fires on each subsequent route change.
2. **Given** a high-value screen (dashboard, report, primary list), **When** it loads, **Then** its sections/rows reveal with a brief incremental stagger.
3. **Given** any animated screen, **When** motion is playing, **Then** controls remain immediately interactive (motion is non-blocking).
4. **Given** the user has `prefers-reduced-motion` enabled, **When** a screen loads, **Then** content appears in its final state instantly with no movement.

---

### User Story 3 - Reports and charts reveal their data with signature motion (Priority: P2)

When a user views a report or any data visualization, scores draw/count in — gauges sweep their arc and tally the central number, bars grow from their baseline with a slight stagger, and radar/signature shapes scale/fade in — making the data feel alive and matching the reference's most memorable moments.

**Why this priority**: Charts are the emotional peak of the product (the report). They currently appear with zero motion. This is high-impact but narrower in surface than typography/entrance, hence P2.

**Independent Test**: Open a report containing each chart type; confirm the gauge arc draws and its number counts up, bars grow with stagger, radar/signature shapes reveal; confirm all charts show their final, correct values instantly under reduced-motion.

**Acceptance Scenarios**:

1. **Given** a report with a score gauge, **When** it enters view, **Then** the arc draws to its value and the central number counts up to the final figure.
2. **Given** a chart with multiple bars, **When** it renders, **Then** bars grow from their baseline with a brief per-bar stagger.
3. **Given** a radar or signature visualization, **When** it renders, **Then** the shape reveals with a scale/fade entrance.
4. **Given** `prefers-reduced-motion` is enabled, **When** any chart renders, **Then** it shows its completed shape and final value immediately (no blank/zero start frame).

---

### User Story 4 - Interactive elements and loading states feel responsive (Priority: P3)

When a user hovers, focuses, or presses buttons and cards, the elements respond with subtle, consistent feedback; while content loads, skeletons shimmer in the brand style — giving the interface a finished, tactile quality consistent with the reference.

**Why this priority**: Micro-interactions and loading polish meaningfully raise perceived quality but are the least structurally significant of the four stories, hence P3.

**Independent Test**: Hover/press primary buttons and cards and confirm consistent subtle feedback with visible focus; trigger a loading state and confirm skeletons shimmer in the brand timing/colors; verify reduced-motion neutralizes non-essential movement while preserving focus visibility.

**Acceptance Scenarios**:

1. **Given** a button or card, **When** the user hovers or presses it, **Then** it gives subtle, consistent visual feedback.
2. **Given** any interactive control, **When** focused via keyboard, **Then** a visible focus indicator is present regardless of motion settings.
3. **Given** content is loading, **When** the placeholder shows, **Then** skeletons shimmer in the brand style and timing.
4. **Given** `prefers-reduced-motion` is enabled, **When** elements load or update, **Then** decorative motion is suppressed while focus and state cues remain.

---

### Edge Cases

- **Reduced motion (global):** Every animation in this feature MUST degrade to its final/opacity state instantly. Resting (un-animated) styles MUST equal the completed state so a disabled animation never leaves a blank ring, zero-width bar, or hidden content.
- **Font not yet loaded / unavailable:** Text MUST fall back to a system stack without breaking layout; no blank/invisible text and no large reflow that disrupts the page.
- **Theme switch mid-session:** Typography and motion behavior MUST remain identical and correct after toggling light/dark.
- **Rapid navigation:** Re-triggering the route entrance on fast successive navigations MUST not stack, freeze, or block interaction.
- **Charts with zero, full, or missing values:** Draw-in MUST resolve to the correct final state for 0, 100, and absent data without visual glitch.
- **Long lists:** Only the first ~10 rows stagger; all remaining rows appear together immediately, so large lists never produce a long cumulative delay before content is usable.
- **Accessibility:** All animated content MUST retain its accessible text alternative and not interfere with screen-reader output or keyboard operation.

## Requirements *(mandatory)*

### Functional Requirements

**Typography**

- **FR-001**: The application MUST load all three brand font families (display, UI, monospace) so the families named by the existing design tokens resolve to real fonts on every screen.
- **FR-002**: Brand fonts MUST be available without an external/network dependency (work offline), self-hosted as a Latin subset (woff2), covering the exact weights each family uses in the design: Schibsted Grotesk 400/500/600/700/800, Hanken Grotesk 400/500/600/700, JetBrains Mono 400/500/600.
- **FR-003**: Text MUST fall back to a graceful system stack while fonts load or if they are unavailable, without breaking layout.
- **FR-004**: Typography MUST be identical in family and weight across light and dark themes.

**Signature motion vocabulary**

- **FR-005**: The design system MUST define the reference's full keyframe vocabulary as named CSS keyframes — fade-up, fade-in, scale-in, slide-in, bar-grow, pulse, typing, ring-draw, check-pop, float-up, row-in, spin, and shimmer — serving as the low-level motion definitions that the primitive components (FR-007) compose.
- **FR-006**: Every animation's resting state MUST equal its completed visual state, so that disabling motion (reduced-motion) shows the final result with no missing or partial visuals.
- **FR-007**: The system MUST expose reusable motion **primitive components** — built on the FR-005 keyframe vocabulary — (route reveal, section reveal, row/list stagger, scale-in, slide-in, float-in, success "pop", and number count-up) so screens apply consistent motion without bespoke per-screen code.
- **FR-008**: All motion building blocks MUST reuse the existing reduced-motion detection and degrade to instant/opacity when reduced motion is requested.

**Entrance reveals app-wide**

- **FR-009**: Every routed screen MUST play one short entrance reveal on mount, applied centrally at the shell level so all screens are covered consistently (admin, user, public, and full-bleed shells).
- **FR-010**: The route entrance MUST re-fire when the route changes (keyed to the active route).
- **FR-011**: High-value screens (admin dashboard, admin and user reports, and the primary list screens for users, assessments, and reports) MUST additionally apply section- and/or row-level staggered reveals.
- **FR-012**: List/row stagger MUST be bounded by count — only the first ~10 rows stagger their entrance; all remaining rows appear together immediately, so large collections remain usable quickly (no unbounded cumulative delay).

**Chart motion**

- **FR-013**: The score gauge MUST animate its arc drawing to the value and count its central number up to the final figure on entrance.
- **FR-014**: Bar visualizations MUST grow from their baseline with a brief per-bar stagger.
- **FR-015**: Radar and signature visualizations MUST reveal with a scale/fade entrance.
- **FR-016**: All chart motion MUST resolve to the exact final values for edge values (0, 100, missing data) and MUST show completed charts immediately under reduced motion.
- **FR-017**: Animated charts MUST retain their existing accessible text alternatives.

**Micro-interactions & loading**

- **FR-018**: Primary interactive primitives (buttons, cards) MUST provide subtle, consistent hover/press feedback.
- **FR-019**: Loading skeletons MUST shimmer in the brand style and timing consistent with the reference.
- **FR-020**: Visible keyboard focus indicators MUST remain present and unaffected by motion settings.

**Constraints & non-regression**

- **FR-021**: All motion MUST be non-blocking — content and controls remain interactive while motion plays; signature motion MUST be skippable in effect via reduced-motion.
- **FR-022**: The application shell MUST NOT use parallax.
- **FR-023**: This feature MUST NOT introduce backend dependencies, new product data, or new product features — it is limited to visual fidelity and motion over existing surfaces.
- **FR-024**: The change MUST keep the existing release gate green: linting, type checking, unit/component tests, and the accessibility + reduced-motion checks on priority flows.
- **FR-025**: Out of scope for this feature (tracked separately): the cinematic Landing page, the persistent Robot Companion mascot, and the Discovery→Assessment transformation sequence. This feature MUST NOT implement them, and MUST leave the seams (motion primitives, hooks) usable by those later capabilities.
- **FR-026**: Directional signature motion (e.g., slide-in and any sequence/flow direction) MUST mirror correctly under a right-to-left locale; inherently directional glyphs/icons are explicitly exempt, and no signature motion causes clipping or overflow at any supported breakpoint (consistent with Spec 009 RTL).

### Key Entities

*Not applicable — this feature introduces no new product data entities. It operates on existing visual surfaces (design tokens, shells, charts, primitives) and presentation-only constructs (font assets, animation definitions, motion primitives).*

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On every screen, 100% of text resolves to the intended brand font family (display / UI / monospace) rather than a system fallback, verified in both light and dark themes.
- **SC-002**: Brand fonts render with no external network request (the app is visually correct fully offline).
- **SC-003**: 100% of routed screens play a single entrance reveal on navigation, and the designated high-value screens additionally stagger their sections/rows.
- **SC-004**: All chart types (gauge, bars, radar, signature) animate on entrance, with the gauge number counting to the correct final value.
- **SC-005**: With `prefers-reduced-motion` enabled, 100% of animated elements (typography, reveals, charts, micro-interactions) display their final state instantly, with zero blank, zero-value, or hidden-content frames.
- **SC-006**: The full release gate (lint, type check, tests, accessibility + reduced-motion priority-flow checks) passes with no new failures introduced by this feature.
- **SC-007**: No parallax is present in the application shell, and no screen blocks interaction while motion plays.
- **SC-008**: Side-by-side against the reference, an informed reviewer judges typography and the foundation motion set (entrance, chart draw-in, stagger, shimmer) to match the reference's intent on the priority flows.
- **SC-009**: Under an RTL locale, directional motion on the priority surfaces mirrors correctly with 0 clipping/overflow defects.

## Assumptions

- The existing design tokens already define the correct brand families and the intended easing/radii/shadow values; this feature loads the fonts and adds motion, it does not redesign tokens.
- The reference prototype in `project/` remains the visual source of truth; where the implemented app and reference differ on the items in scope, the reference wins.
- Self-hosted, offline-available fonts (Latin subset, woff2) are required over a runtime CDN dependency, consistent with the backend-less prototype constraint. The three families are open-licensed (Schibsted Grotesk, Hanken Grotesk, JetBrains Mono) and self-hostable; weights match the design per family (Schibsted Grotesk 400–800, Hanken Grotesk 400–700, JetBrains Mono 400–600).
- The existing reduced-motion detection and the existing number count-up and reveal primitives are the basis to extend; new primitives follow the same pattern.
- Route-level reveals can be applied centrally at the existing shell components (which already render the routed outlet), covering all screens without editing every screen file.
- "High-value screens" for section/row stagger are the admin dashboard, admin/user reports, and the users/assessments/reports list screens; other screens rely on the central route reveal.
- The three cinematic set-pieces are confirmed as wanted by the stakeholder but are deferred to their own feature(s); this spec only ensures it does not block them.
- Existing tests and the release gate from the QA-readiness feature are the regression baseline that must stay green.
