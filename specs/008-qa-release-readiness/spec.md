# Feature Specification: QA & Release-Readiness Gates

**Feature Branch**: `008-qa-release-readiness`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "specs/008-qa-release-readiness — the final QA & release-readiness pass: end-to-end journey verification, automated cross-cutting proof that every NON-NEGOTIABLE governance guarantee holds, accessibility & reduced-motion conformance on the priority flows, responsive/state/route coverage, performance (lazy governed bank, code-split, no fixture imports in components), documentation/traceability currency, and a single green release gate — master scope §16, constitution review gates."

**Prefix**: `FR-QA-*`

**Authoritative sources**: `../000-master-scope/spec.md` (§16 frontend-only scope, §17 spec map), `../000-shared/{route-map.md,status-models.md,traceability-matrix.md,handoff-map.md,testing-notes.md,risk-register.md}`; constitution `.specify/memory/constitution.md` (v2.0.0 — all principles, the NON-NEGOTIABLE set, and the Development Workflow & Review Gates). Verifies the work delivered in Specs 001–007.

## Clarifications

### Session 2026-06-16

- Q: How are automated accessibility checks performed? → A: Add `vitest-axe` (axe-core) as a test-only dependency and assert zero critical violations on each priority flow (real WCAG engine), complemented by targeted RTL keyboard/reduced-motion assertions.
- Q: How is the single aggregate gate exposed? → A: An npm script `release-gate` in `package.json` chaining type-check → tests → lint → format-check → build (fail-fast; the failing step is the attributed gate).
- Q: How are the governance invariants verified? → A: A new consolidated `tests/governance/` suite with one explicit assertion per invariant (reusing services/helpers), plus a traceability doc mapping each invariant → its test(s); existing per-spec tests remain.

## User Scenarios & Testing *(mandatory)*

<!--
  Actor: the release reviewer/approver (the Admin stakeholder signing off V1) and the developer
  running the gate. This is a verification & hardening feature — it adds no new product surfaces.
  It proves, automatically and repeatably, that the prototype is constitutionally compliant and
  release-ready, and documents that proof. Everything stays frontend/mock-only and deterministic.
-->

### User Story 1 - Governance invariants are provably enforced (Priority: P1) 🎯 MVP

The reviewer can run a suite that automatically proves every NON-NEGOTIABLE governance guarantee holds across the whole prototype: no live or client-computed score appears anywhere in the User experience; no Admin-only/internal field leaks into any User-facing view; blocked values (e.g., Derailment Risk) are never shown as report data; nothing produces an automatic hire/reject decision or ranking; every captured response is attributed to its immutable source Question ID; source metadata is never fabricated; questions come only from the governed bank with blocked/quarantined/non-operational items excluded; and UI components never read fixtures or persistence directly.

**Why this priority**: These are the platform's NON-NEGOTIABLE constitutional guarantees. A single regression is a release blocker, so a repeatable automated proof is the highest-value safety net before sign-off.

**Independent Test**: Run the governance verification suite; confirm each invariant has at least one passing assertion and that deliberately violating one (in a scratch check) fails the suite.

**Acceptance Scenarios**:

1. **Given** the suite, **When** it runs, **Then** it asserts no live/client score appears in any User view or in the runtime (VIII).
2. **Given** the suite, **When** it runs, **Then** it asserts no Admin-only/internal field appears in any User-facing projection and that User reports derive only from the user-safe projection (IX/III).
3. **Given** the suite, **When** it runs, **Then** it asserts blocked values are never rendered as data and restricted/insufficient outputs appear only as provisional/downgraded/omitted with explanation (XI).
4. **Given** the suite, **When** it runs, **Then** it asserts no ranking/auto-ordering/auto-decision/recommendation label exists in comparison or reports and the human-decision disclaimer is present (X).
5. **Given** the suite, **When** it runs, **Then** it asserts responses are keyed by source Question ID, selection draws only from the governed bank (blocked/quarantine/non-operational excluded), metadata is never fabricated, and no component imports fixtures/persistence (VIII/V/VI/IV).

---

### User Story 2 - End-to-end journeys pass (Priority: P1)

The reviewer can run the required end-to-end journeys and confirm each completes without dead ends and produces the expected mock artifacts: **Admin Developmental** (add user → create assessment → agent discovery → blueprint/context → selection → adaptation → coverage → approve → send → detail → report → user-safe preview → PDF → history), **Admin Hiring Support** (same with a validated blueprint, context profile, Domain 6, and Candidate Comparison with no automatic decision), and the **User** journey (invitation → overview → consent → instructions → all five question types → pause → reload → resume → submit → completion → report → PDF → privacy revoke/request).

**Why this priority**: Happy-path-plus completeness across both roles is the core demonstration of V1; a dead end anywhere blocks release.

**Independent Test**: Drive each journey on mocks end to end; confirm each step transitions correctly and the expected mock artifact (assignment, report, consent change, export-history entry) appears.

**Acceptance Scenarios**:

1. **Given** the Admin Developmental journey, **When** run, **Then** it completes end to end and produces the expected mock artifacts.
2. **Given** the Admin Hiring-Support journey, **When** run, **Then** Domain 6 and Candidate Comparison render with no automatic decision/ranking.
3. **Given** the User journey, **When** run, **Then** the runtime supports all five question types, pause/resume/reload restore, submission reaches completion, and no live score is shown.

---

### User Story 3 - Accessibility & motion conformance on priority flows (Priority: P1)

The reviewer can confirm the priority flows (sign-in/recovery, the assessment runtime with all five question types, Create Assessment, and report viewing) meet WCAG 2.1 AA basics — automated accessibility checks pass with zero critical violations, controls are keyboard operable with visible focus, and all motion honors reduced-motion.

**Why this priority**: Accessibility and motion safety are constitutional requirements (XII) and a baseline quality bar that applies to the flows users actually traverse.

**Independent Test**: Run automated accessibility checks plus keyboard and reduced-motion assertions on each priority flow; confirm zero critical violations and that motion degrades to instant under reduced-motion.

**Acceptance Scenarios**:

1. **Given** a priority flow, **When** automated accessibility checks run, **Then** there are zero critical violations (labels, contrast, roles, landmarks).
2. **Given** a priority flow, **When** navigated by keyboard only, **Then** all interactive controls are reachable and operable with a visible focus indicator (incl. dialog focus trap + Escape).
3. **Given** reduced-motion is preferred, **When** a signature animation would play, **Then** it degrades to instant/opacity and never blocks interaction.

---

### User Story 4 - Responsive, state & route coverage (Priority: P2)

The reviewer can confirm every route renders with the correct shell, guard, and title and presents its empty/loading/error states in the design language, and that priority surfaces remain usable across viewports (mobile → desktop) in both themes — no blank screens or raw errors.

**Why this priority**: Complete route/state/responsive coverage is what makes the prototype demoable end to end; it builds on the governance and accessibility gates.

**Independent Test**: Audit every route in the route map for shell/guard/title/states; force empty/loading/error on cataloged screens; render priority surfaces at mobile and desktop widths in both themes.

**Acceptance Scenarios**:

1. **Given** the route map, **When** audited, **Then** every route renders with the correct shell, guard, and title.
2. **Given** any cataloged screen with no data or a service error, **When** it renders, **Then** an in-language empty/error state with a path forward appears (no blank screen / raw error).
3. **Given** priority surfaces, **When** rendered at mobile and desktop widths in light and dark themes, **Then** they remain readable and operable (≥44px touch targets on the runtime).

---

### User Story 5 - Performance, traceability & a single release gate (Priority: P2)

The reviewer can confirm performance guardrails hold (the governed bank is excluded from the initial chunk and lazy-loaded; routes are code-split; no component imports fixtures), that documentation/traceability is current (each spec 001–008 → key requirements → verifying gate), and can run a single aggregate gate whose green result confirms type-check, tests, lint, format, build, governance, and accessibility all pass.

**Why this priority**: A single, documented, repeatable green gate is the V1 sign-off artifact; it makes readiness auditable. Lower frequency than the core correctness gates.

**Independent Test**: Inspect the build output for bank/route code-splitting; open the release-readiness checklist and confirm full spec→gate mapping; run the aggregate gate and confirm a clear single pass/fail (and that a forced failure is surfaced, not silently green).

**Acceptance Scenarios**:

1. **Given** the production build, **When** inspected, **Then** the governed bank is not in the initial chunk and feature routes are code-split.
2. **Given** the release-readiness checklist, **When** reviewed, **Then** every spec (001–008) and its key requirements map to at least one verifying gate, and the shared docs are current.
3. **Given** the aggregate gate, **When** run, **Then** it executes all gates and reports one clear pass/fail; a forced failure in any gate is correctly attributed and never counted as green.

---

### Edge Cases

- **A new screen ships without an empty/error state** → the state-coverage gate flags it rather than silently passing.
- **A component imports a fixture/persistence module directly** → the service-boundary/performance gate fails.
- **A User-facing payload gains a restricted field** → the leakage gate fails on that field.
- **An animation ignores reduced-motion** → the motion gate flags it on the affected flow.
- **A gate is skipped or errors** → the aggregate reports it as not-passed (never green).
- **Fixtures fabricate a non-source field (e.g., weight/difficulty) shown as data** → the immutable-metadata gate fails.
- **The governed bank slips into the initial chunk** → the performance gate flags it.
- **A flaky/timing-dependent assertion** → tests must be deterministic (controlled mock latency), so re-runs are stable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-QA-000**: A consolidated `tests/governance/` suite MUST hold one explicit assertion per NON-NEGOTIABLE invariant (FR-QA-001…008), reusing existing services/helpers; existing per-spec tests remain in place.
- **FR-QA-001**: An automated check MUST assert no live/client-computed score appears in any User-facing view or the runtime (VIII).
- **FR-QA-002**: An automated check MUST assert no Admin-only/internal field (source metadata, formulas, scoring versions, governance/psychometric flags, blocked values, Admin notes, Domain 6 internals, hire/reject language) appears in any User-facing projection, and that User reports derive only from the user-safe projection (IX/III).
- **FR-QA-003**: An automated check MUST assert blocked values are never rendered as report data and restricted/insufficient outputs appear only as provisional/downgraded/omitted with explanation (XI).
- **FR-QA-004**: An automated check MUST assert no automatic hire/reject decision, ranking, auto-ordering, or recommendation label exists in comparison/reports and the human-decision disclaimer is present (X).
- **FR-QA-005**: An automated check MUST assert every captured response is keyed by its immutable source Question ID and no production scoring occurs in the UI (VIII).
- **FR-QA-006**: An automated check MUST assert selection draws only from the governed bank with blocked/quarantined/non-operational items excluded (V).
- **FR-QA-007**: An automated check MUST assert source-item metadata is never mutated and absent fields (e.g., weight, difficulty) are never fabricated or displayed as data (VI).
- **FR-QA-008**: An automated check MUST assert no UI component imports fixtures or persistence directly (service boundary; IV).
- **FR-QA-009**: The required end-to-end journeys (Admin Developmental, Admin Hiring-Support, User) MUST complete without dead ends and produce the expected mock artifacts.
- **FR-QA-010**: Automated accessibility checks (via `vitest-axe`/axe-core, a test-only dependency) MUST pass with zero critical violations on the priority flows (sign-in/recovery, runtime incl. all five question types, Create Assessment, report viewing) (XII).
- **FR-QA-011**: Keyboard operability with visible focus (incl. dialog focus trap/Escape) and reduced-motion degradation MUST be verified on the priority flows (XII).
- **FR-QA-012**: Every route in the route map MUST render with the correct shell, guard, and title.
- **FR-QA-013**: Cataloged screens MUST present in-language empty, loading, and error states (no blank screens or raw errors).
- **FR-QA-014**: Priority surfaces MUST remain usable at mobile and desktop widths in both themes, with ≥44px touch targets on the runtime (XIII).
- **FR-QA-015**: Performance guardrails MUST hold: the governed bank is excluded from the initial chunk and lazy-loaded, and feature routes are code-split.
- **FR-QA-016**: A release-readiness checklist MUST map each spec (001–008) and its key requirements to verifying gates/tests, and the shared docs MUST be current (XIV).
- **FR-QA-017**: A single aggregate gate — an npm script `release-gate` in `package.json` — MUST chain type-check → tests (incl. governance & accessibility suites) → lint → format-check → build, failing fast so the failing step is the attributed gate; a failing/skipped gate MUST be reported as not-passed (never silently green).
- **FR-QA-018**: All verification MUST be deterministic and frontend/mock-only — no backend, no real network, controlled mock latency (I).

### Key Entities *(include if feature involves data)*

- **Governance Invariant**: a NON-NEGOTIABLE guarantee under verification (e.g., "no live score", "no Admin-data leak", "blocked-never-shown") with its asserting check(s).
- **Required Journey**: an end-to-end flow under verification (Admin Developmental, Admin Hiring-Support, User).
- **Priority Flow**: a journey under accessibility/motion/responsive verification (sign-in/recovery, runtime, Create Assessment, report viewing).
- **Screen Catalog / Route Entry**: a route/screen under shell/guard/title/state/responsive coverage.
- **Traceability Entry**: a mapping of spec → key requirement(s) → verifying gate/test.
- **Release-Readiness Report**: the aggregate gate's single pass/fail summary across all gates.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The governance suite asserts all eight invariants (no live score, no Admin-data leak, blocked-never-shown, no auto-decision/ranking, source-ID attribution, governed-bank-only, immutable metadata, service-boundary) with ≥1 passing assertion each (100% of the NON-NEGOTIABLE set).
- **SC-002**: All three required end-to-end journeys complete without dead ends (100%).
- **SC-003**: Automated accessibility checks report **zero critical violations** on every priority flow.
- **SC-004**: Every priority flow is fully keyboard operable and degrades motion under reduced-motion (100%).
- **SC-005**: Every route renders with correct shell/guard/title, and 100% of cataloged screens present in-language empty/loading/error states (0 blank screens / raw errors).
- **SC-006**: The governed bank is absent from the initial chunk and routes are code-split (verified in the build output).
- **SC-007**: Every spec (001–008) and its key requirements map to at least one verifying gate (100%); shared docs are current.
- **SC-008**: The aggregate gate reports a single clear pass/fail; a forced failure in any gate is correctly surfaced (not silently green).
- **SC-009**: The full suite is deterministic — three consecutive runs produce identical results (0 flakes) — and makes 0 external network requests.

## Assumptions

- This feature verifies and documents the work of Specs 001–007; it adds no new product screens or services.
- Existing test infrastructure (unit + component tests; mock services with controllable latency/failure) is the foundation; this spec adds cross-cutting governance, accessibility, route/state-coverage suites, a traceability/checklist artifact, and an aggregate gate.
- Automated accessibility checking uses a standard a11y assertion approach on rendered priority flows (specific tool chosen at plan time; a test-only dependency, not a runtime one).
- "Priority flows" are the highest-traffic/highest-risk journeys; exhaustive a11y coverage of every screen is not required in V1, while route/state/responsive coverage spans the route map/screen catalog.
- The aggregate gate composes the existing quality commands (type-check, tests, lint, format, build); no CI service is provisioned in this phase (frontend-only scope).
- Some manual checks (e.g., nuanced screen-reader phrasing) supplement automation where automation is insufficient; these are documented in the checklist.

## Dependencies

- **Depends on**: Specs 001–007 (all delivered surfaces, services, governance helpers, and the user-safe projection under verification).
- **Consumes**: existing services/fixtures (read-only, via the service boundary), `governance` helpers, and the test harness.
- **Shared canon**: `../000-shared/{route-map.md,status-models.md,traceability-matrix.md,handoff-map.md,testing-notes.md,risk-register.md}`; constitution review gates.
