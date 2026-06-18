# Feature Specification: Post-V1 Readiness (Integration Seam, i18n, Design Fidelity, Performance)

**Feature Branch**: `009-post-v1-readiness`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "specs/009 — cover all of: backend integration readiness (swap-ready service/contract seam), internationalization & localization, design fidelity & signature motion polish, and performance & bundle optimization. Post-V1 hardening on top of the delivered Specs 001–008, staying frontend/mock-only per the constitution."

**Prefix**: `FR-PVR-*`

**Authoritative sources**: `../000-master-scope/spec.md` (§16 frontend-only scope), `../000-shared/{handoff-map.md,route-map.md,testing-notes.md}`; constitution `.specify/memory/constitution.md` (v2.0.0 — esp. I Frontend First, II Design Fidelity, IV Service Boundaries, XII Accessibility & Motion, XIII Responsive Runtime). Builds on delivered Specs 001–008.

## Clarifications

### Session 2026-06-16

- Q: What i18n mechanism should be used? → A: Lightweight in-house keyed message catalog + a `useT()` hook + a locale store (no runtime dependency); ship a sample `en` plus one RTL locale, with a default-locale fallback.
- Q: How far does the `live` data-source adapter go in V1? → A: Boundary + typed contracts + a **stub** `live` adapter that throws "not wired in V1"; `mock` is the default. Proves swap-readiness with zero network (constitution I); the future backend fills the stub.
- Q: What is the i18n retrofit scope for V1? → A: Build the framework + retrofit a representative priority set (auth/recovery, assessment runtime, Admin + User dashboards, Profile & Privacy); other surfaces adopt it incrementally later.
- Q: What is the initial-bundle budget? → A: ≤ 260 KB raw (~85 KB gzip) for the initial eager chunk — small headroom over the ~242 KB baseline, enforced as a no-regression ceiling.

## User Scenarios & Testing *(mandatory)*

<!--
  This is a post-V1 hardening feature spanning four areas. It adds NO new product screens; it raises
  the prototype's production-readiness while STAYING frontend/mock-only (constitution I). "Backend
  integration readiness" means a swap-ready seam + typed contracts + adapter boundary — NOT building
  a backend. Actors are the developer/integrator preparing the prototype for the future backend phase,
  plus the end users (Admin/User) who benefit from localization, fidelity, and speed.
-->

### User Story 1 - Swap-ready backend integration seam (Priority: P1) 🎯 MVP

An integrator can point the app at a real backend later **without rewriting UI or feature code**: every mock service sits behind a typed contract and a single adapter boundary, a runtime data-source mode selects "mock" (default) vs a future "live" adapter, and the service↔future-API mapping is documented and type-checked. Today everything still runs on mocks.

**Why this priority**: The whole V1 exists to de-risk the backend phase; a clean, documented, type-enforced swap seam is the highest-leverage readiness work and protects the constitution's "API swap MUST NOT require a UI rewrite" guarantee.

**Independent Test**: Confirm every UI/feature module consumes services only through the boundary (no direct fixture/persistence imports), that a documented typed contract exists for each service, and that switching the data-source mode to a stub "live" adapter resolves through the same interfaces with the app still rendering (mock remains the default).

**Acceptance Scenarios**:

1. **Given** the service layer, **When** audited, **Then** each service exposes a typed contract interface and components depend on those interfaces (not concrete mocks/persistence).
2. **Given** a data-source mode setting, **When** set to "mock" (default), **Then** the app behaves exactly as today; **When** set to a stub "live" adapter, **Then** calls route through the adapter against the same contracts without UI changes.
3. **Given** the handoff map, **When** reviewed, **Then** every service method maps to its future API responsibility and the mapping is kept in sync (type-checked where possible).

---

### User Story 2 - Internationalization & localization (Priority: P2)

Admin and User can switch the interface language; all user-facing copy is externalized (no hard-coded strings in new/affected surfaces), dates/numbers format per locale, and the layout tolerates longer translations and right-to-left (RTL) reading order.

**Why this priority**: Localization broadens reach and the Profile already exposes a language preference; it's high value but depends on a stable UI (V1) and is independent of the backend seam.

**Independent Test**: Switch language and confirm a representative set of surfaces render translated copy from a message catalog (with a fallback locale), dates/numbers format per locale, and an RTL locale mirrors layout without breakage.

**Acceptance Scenarios**:

1. **Given** a language selection, **When** changed, **Then** the interface updates to that language and the choice persists across reloads.
2. **Given** a missing translation key, **When** rendered, **Then** the app falls back to the default locale (no blank/raw key shown).
3. **Given** an RTL locale, **When** active, **Then** reading order and layout mirror correctly and remain usable.
4. **Given** locale-specific dates/numbers, **When** displayed, **Then** they format per the active locale.

---

### User Story 3 - Design fidelity & signature motion (Priority: P2)

The implemented UI visibly matches the `project/` design source of truth — tokens (color/spacing/typography), dark/light theming, and signature motion/micro-interactions — with motion that explains state changes, stays skippable, and honors reduced-motion.

**Why this priority**: Fidelity and purposeful motion make the prototype credible and on-brand (constitution II/XII); it's polish on top of working flows.

**Independent Test**: Compare priority surfaces against the design source for token/typography/theming fidelity; verify signature motion plays on key transitions, is non-blocking/skippable, and degrades to instant under reduced-motion.

**Acceptance Scenarios**:

1. **Given** a priority surface, **When** compared to the design source, **Then** tokens, typography, spacing, and dark/light theming match within the agreed fidelity bar.
2. **Given** a key transition, **When** it occurs, **Then** signature motion communicates the state change, is skippable, and never blocks interaction.
3. **Given** reduced-motion is preferred, **When** motion would play, **Then** it degrades to instant/opacity (no parallax in the shell).

---

### User Story 4 - Performance & bundle optimization (Priority: P3)

The app loads and responds quickly: the initial bundle stays within an explicit budget, heavy/rarely-used routes and assets are split and lazy-loaded, and interactions remain smooth (no avoidable re-render or long-task jank) on the priority flows.

**Why this priority**: Speed improves perceived quality and demo credibility; it builds on everything else and has no functional dependencies.

**Independent Test**: Measure the production build's initial chunk against the budget, confirm heavy routes/assets are separate lazy chunks, and verify the priority flows have no obvious re-render storms or long blocking tasks.

**Acceptance Scenarios**:

1. **Given** the production build, **When** measured, **Then** the initial (eager) chunk is within the documented budget and heavy routes/assets are separate lazy chunks.
2. **Given** a priority flow, **When** interacted with, **Then** there are no avoidable re-render loops or long blocking tasks degrading responsiveness.
3. **Given** the governed bank and other large fixtures, **When** the app starts, **Then** they are not part of the initial chunk.

---

### Edge Cases

- **Live-adapter selected but unreachable (future)** → the seam surfaces a clear error state via the same loading/error contract; mock remains the safe default.
- **Untranslated key / unsupported locale** → fall back to the default locale; never show a raw key or blank.
- **Very long translation** → layout wraps/truncates gracefully without overflow.
- **RTL + charts/icons** → directional elements mirror or are explicitly exempt; no clipping.
- **Reduced-motion** → all signature motion degrades to instant; no parallax in the shell.
- **A new route ships without lazy-loading a heavy dependency** → the bundle-budget check flags it.
- **A component reintroduces a direct fixture/persistence import** → the boundary check fails (regression guard).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-PVR-001**: Each mock service MUST expose a typed contract interface; UI/feature modules MUST depend on those interfaces, never on concrete mock/persistence modules (constitution IV).
- **FR-PVR-002**: The system MUST provide a single data-source adapter boundary with a runtime mode selectable via configuration: `mock` (default, current behavior) and a **stub `live` adapter that throws "not wired in V1"** (no real network — constitution I). Switching modes MUST require no UI/feature code changes; the future backend fills the stub.
- **FR-PVR-003**: The service↔future-API mapping (handoff) MUST be documented and kept consistent with the service contracts (type-checked where feasible).
- **FR-PVR-004**: All data access MUST remain mock-only by default; no real backend, network, auth, or persistence is implemented (constitution I).
- **FR-PVR-005**: The system MUST provide a language-selection mechanism that updates the interface language and persists the choice across reloads.
- **FR-PVR-006**: User-facing copy on the **priority surfaces (auth/recovery, assessment runtime, Admin + User dashboards, Profile & Privacy)** MUST be externalized into a **lightweight in-house keyed message catalog** (accessed via a `useT()` hook + locale store; no runtime i18n dependency) with a default fallback locale and at least one RTL sample locale (no hard-coded display strings). Other surfaces adopt the framework incrementally later.
- **FR-PVR-007**: A missing translation key MUST fall back to the default locale (never render a raw key or blank).
- **FR-PVR-008**: Dates and numbers MUST format according to the active locale.
- **FR-PVR-009**: The layout MUST tolerate longer translations and support a right-to-left reading order without breakage.
- **FR-PVR-010**: Priority surfaces MUST match the `project/` design source for tokens, typography, spacing, and dark/light theming within the agreed fidelity bar.
- **FR-PVR-011**: Signature motion MUST communicate state changes, be skippable/non-blocking, and honor `prefers-reduced-motion` (degrade to instant/opacity; no shell parallax) (constitution XII).
- **FR-PVR-012**: The production build's initial (eager) JS chunk MUST stay within a documented budget of **≤ 260 KB raw (~85 KB gzip)** (a no-regression ceiling over the ~242 KB baseline); heavy/rarely-used routes and assets MUST be split into lazy chunks.
- **FR-PVR-013**: Large fixtures (e.g., the governed bank) MUST be excluded from the initial chunk.
- **FR-PVR-014**: Priority flows MUST avoid avoidable re-render loops and long blocking tasks that degrade responsiveness.
- **FR-PVR-015**: All four areas MUST be covered by automated checks/tests where feasible (boundary audit, i18n fallback, reduced-motion, bundle budget) and remain deterministic and frontend/mock-only.

### Key Entities *(include if feature involves data)*

- **Service Contract**: the typed interface a service implements (the de-facto API a future backend must satisfy).
- **Data-Source Adapter**: the boundary implementation selected by mode (`mock` | `live`-stub) that fulfills the contracts.
- **Locale / Message Catalog**: the active locale plus the keyed translation set with a default fallback.
- **Design Token Set**: the color/spacing/typography/theming tokens sourced from `project/`.
- **Bundle Budget**: the documented size ceiling for the initial chunk and the lazy-split policy.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of UI/feature modules consume services via typed contracts; 0 direct fixture/persistence imports in components (boundary audit).
- **SC-002**: Switching the data-source mode to a stub `live` adapter routes all calls through the boundary with the app still rendering and **0** UI/feature code changes required; `mock` remains the default.
- **SC-003**: Every service method maps to a documented future-API responsibility (100% of the handoff map current).
- **SC-004**: Switching language updates the interface and persists across reloads; a representative surface set renders translated copy with a working fallback (0 raw keys/blanks).
- **SC-005**: An RTL locale renders the priority surfaces mirrored and usable (0 overflow/clipping defects on those surfaces).
- **SC-006**: Priority surfaces match the design source within the agreed fidelity bar, and all signature motion degrades to instant under reduced-motion (100%).
- **SC-007**: The initial eager JS chunk is ≤ 260 KB raw (~85 KB gzip); the governed bank and other heavy assets are confirmed separate lazy chunks (0 in the initial chunk).
- **SC-008**: All quality gates remain green (type-check, tests, lint, format, build) and the new checks are deterministic and make 0 external network requests.

## Assumptions

- Builds on delivered Specs 001–008; adds no new product screens. Everything stays frontend/mock-only (constitution I) — "backend integration readiness" is a swap-ready seam + contracts + adapter boundary, not an implemented backend.
- A standard i18n approach is used (library or lightweight in-house catalog chosen at plan time); copy externalization focuses on affected/new and high-traffic surfaces in V1, not an exhaustive retrofit of every string.
- "Priority surfaces/flows" are the highest-traffic/risk journeys (auth/recovery, runtime, Create Assessment, reports, dashboards).
- The design fidelity bar is "visually matches `project/` tokens/typography/theming/motion" as judged at review; pixel-perfect parity is not required where the design omits a state.
- The bundle budget value is set at plan time from the current baseline; this spec requires that a budget exists and is enforced, not a specific number.
- Existing test infrastructure (Vitest + RTL, axe, the Spec 008 gates) is reused/extended; no CI service is provisioned (frontend-only scope).

## Dependencies

- **Depends on**: Specs 001–008 (delivered surfaces, services, governance helpers, test harness, lazy-bank seam) and the Spec 008 release gate.
- **Consumes**: existing services/contracts via the boundary; `governance` helpers; the `project/` design source; `specs/000-shared/handoff-map.md`.
- **Relationship**: design-fidelity/motion here may be deepened by a dedicated follow-up (a `010` design-fidelity feature appears reserved); this spec covers the readiness-level fidelity pass.
