# Feature Specification: Role Blueprints and Context Profiles

**Feature Branch**: `004-role-blueprints-context-profiles`

**Created**: 2026-06-15

**Status**: Draft

**Input**: User description: "specs/004-role-blueprints-context-profiles — reusable Role Blueprints and Context Profiles (master scope §10–§11)"

**Prefix**: `FR-BC-*`

**Authoritative sources**: `../000-master-scope/spec.md` (§10 Context Profile, §11 Role Blueprint), `../000-shared/status-models.md` (blueprint/context lifecycles), `../000-shared/data-model.md` (§8), `../000-shared/handoff-map.md`; constitution `.specify/memory/constitution.md` (v2.0.0). Depends on Spec 001; consumed by Specs 003 and 005.

## Clarifications

### Session 2026-06-15

- Q: Are blueprint lifecycle transitions ordered or free-form? → A: Free-form — the Admin may set any status; the only guards are that Archived is terminal and the Validated requirement is enforced at consumption time (Hiring-Support role-fit), not at transition. (Matches master-scope "validate-display in mock form".)
- Q: Where does the dimension catalog for the blueprint builder come from? → A: Derive it from the distinct dimensions present in the governed `item_bank` (real dimension IDs/names via `questionBankService`), so blueprints align with Spec 003 question selection — no separate dimensions fixture.

## User Scenarios & Testing *(mandatory)*

<!--
  Actor: the single organization Admin. Two reusable, first-class V1 objects:
  - Role Blueprint — "what does success look like for this role?"
  - Context Profile — "in what environment will the person operate?"
  Both are consumed by the Create Assessment flow (Spec 003) pickers and summarized in reports (Spec 005).
  Stories are ordered so the two creatable objects (needed by 003) come first; linking and versioning follow.
-->

### User Story 1 - Create and manage reusable Role Blueprints (Priority: P1)

The Admin defines what success looks like for a role through a guided multi-step builder (role info, work context, success requirements, dimension selection with required/optional/excluded + importance, supporting evidence, link context, review), then manages the blueprint through its lifecycle from a list and detail view.

**Why this priority**: Role Blueprints are a first-class reusable object the Create Assessment flow (Spec 003) selects from, and the **Validated** state gates operational Hiring-Support role-fit. Without blueprints, the signature flow and hiring support cannot be governed. This is the foundational slice.

**Independent Test**: From the blueprints list, run the builder to create one blueprint (cycling a dimension through Required→Optional→Excluded and setting importance on a required one), save it, open its detail tabs, and move it through lifecycle states — all on mocks.

**Acceptance Scenarios**:

1. **Given** the builder, **When** the Admin toggles a dimension, **Then** it cycles Required → Optional → Excluded; **When** a dimension is Required, **Then** an importance control (Low/Moderate/Critical) with optional rationale appears.
2. **Given** the builder, **When** the Admin saves, **Then** a blueprint is created (Draft) with an initial version entry and appears in the list.
3. **Given** Blueprint Detail, **When** the Admin acts, **Then** they can preview, edit, duplicate, change lifecycle status (Draft → Under Review → Active → Validated → Deprecated → Archived), and view the tabs (Overview, Context, Dimensions, Evidence, Assessment Usage, Version History, Notes).
4. **Given** lifecycle rules, **When** a blueprint is **Validated**, **Then** it satisfies the Hiring-Support role-fit gate; **When** Deprecated/Archived, **Then** it cannot be used for new assignments.
5. **Given** the list, **When** the Admin searches/filters/sorts, **Then** rows update with empty/loading/error states.

---

### User Story 2 - Create and manage visual Context Profiles (Priority: P1)

The Admin captures the operating environment of a role through a visual builder (sliders/segmented controls for ambiguity, decision stakes, time pressure, autonomy, stakeholder complexity, etc.) with a live "Context Signature" (radar + intensity bars) and a plain-language summary, then manages it from a list and detail view.

**Why this priority**: Context Profiles are the other first-class object the Create Assessment flow selects from and that drives Domain 6 interpretation later. Like blueprints, they are required before the signature flow is complete.

**Independent Test**: Open the context builder, adjust sliders, observe the live Context Signature and summary update, save the profile, and open its detail — on mocks.

**Acceptance Scenarios**:

1. **Given** the builder, **When** the Admin moves a slider or changes a control, **Then** the live Context Signature (radar + intensity bars) and the plain-language summary update in real time.
2. **Given** the builder, **When** the Admin saves, **Then** a context profile is created (Draft or Active) with a version entry and appears in the list.
3. **Given** Context Detail, **When** it loads, **Then** it shows the context summary, radar, bars, linked role/blueprint, notes, version history, and linked assessments.
4. **Given** lifecycle, **When** the Admin acts, **Then** a context moves through Draft → Active → Archived; Archived cannot be used for new assignments.

---

### User Story 3 - Link a Blueprint and a Context Profile (Priority: P2)

The Admin links a Role Blueprint to a Context Profile so the pair travels together into the Create Assessment flow and reports.

**Why this priority**: Linking improves reuse and feeds Domain 6/role-fit context, but each object is usable independently first, so it follows their creation.

**Independent Test**: Link a blueprint to a context; confirm both records reflect the link and the linked pair is selectable inside the Create Assessment flow.

**Acceptance Scenarios**:

1. **Given** a blueprint and a context, **When** the Admin links them, **Then** both records show the link (two-way).
2. **Given** a linked pair, **When** the Admin selects the blueprint in Create Assessment, **Then** the linked context is offered/auto-selected.

---

### User Story 4 - Version awareness for both objects (Priority: P2)

Each meaningful update to a blueprint or context records a version-history entry so the Admin can see how a definition evolved.

**Why this priority**: Versioning supports traceability and informed reuse but is not required to create or use the objects; it enhances them.

**Independent Test**: Edit and save a blueprint (and a context); confirm a new version-history entry is recorded and visible on the detail view.

**Acceptance Scenarios**:

1. **Given** an existing blueprint/context, **When** the Admin saves an update, **Then** a version-history entry (version, date, summary) is added.
2. **Given** the detail Version History tab, **When** it loads, **Then** entries are listed newest-first.

---

### Edge Cases

- **Missing required fields** in a builder step → inline validation messages; the step cannot be completed until resolved.
- **No blueprints/contexts yet** → empty state with a create call-to-action.
- **Hiring-Support assignment referencing a non-Validated blueprint** → the role-fit gate flags/blocks operational release (Validated required).
- **Using a Deprecated/Archived blueprint or Archived context for a new assignment** → not offered/blocked with explanation.
- **Linking already-linked objects / unlinking** → the two-way link updates consistently (no dangling references).
- **Editing a blueprint already used by assessments** → allowed in the prototype, recorded as a new version (no retroactive change to sent assessments).
- **Mock service latency/error** (list, save, lifecycle change) → loading/skeleton and error/retry states.
- **Slider extremes / all-default context** → Context Signature still renders a valid (flat) shape with a sensible summary.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-BC-001**: The system MUST provide a Role Blueprints list with search, filter, sort, and empty/loading/error states.
- **FR-BC-002**: The system MUST provide a multi-step Role Blueprint builder (role info → work context → success requirements → dimension selection → dimension importance → evidence → link context → review).
- **FR-BC-003**: The builder MUST support cycling each dimension through Required → Optional → Excluded, where the dimension catalog is **derived from the distinct dimensions in the governed `item_bank`** (real dimension IDs/names) so it aligns with Spec 003 selection.
- **FR-BC-004**: For required dimensions, the system MUST capture an importance level (Low/Moderate/Critical) and an optional rationale.
- **FR-BC-005**: The system MUST capture supporting evidence and notes on a blueprint.
- **FR-BC-006**: The system MUST provide Blueprint Detail tabs (Overview, Context, Dimensions, Evidence, Assessment Usage, Version History, Notes) and actions (preview, edit, duplicate, change status, export, create assessment, archive).
- **FR-BC-007**: The system MUST support the canonical blueprint lifecycle (Draft, Under Review, Active, Validated, Deprecated, Archived) as **free-form Admin-set status** with two guards: Archived is terminal, and the **Validated** requirement is enforced at consumption time (Hiring-Support role-fit gate), not at transition. Deprecated/Archived blueprints are unusable for new assignments.
- **FR-BC-008**: The system MUST provide a Context Profiles list with search, filter, and the standard states.
- **FR-BC-009**: The system MUST provide a visual Context Profile builder (sliders/segmented controls/chips) with a live Context Signature (radar + intensity bars) and a plain-language summary that update in real time.
- **FR-BC-010**: The system MUST provide Context Detail (summary, radar, bars, linked role/blueprint, notes, version history, linked assessments).
- **FR-BC-011**: The system MUST support a two-way link between a Role Blueprint and a Context Profile, reflected on both records.
- **FR-BC-012**: The system MUST record a mock version-history entry on meaningful updates to both objects.
- **FR-BC-013**: Created/updated blueprints and contexts MUST be selectable in the Create Assessment flow (Spec 003) pickers, with lifecycle eligibility respected.

### Key Entities *(include if feature involves data)*

- **Role Blueprint**: a reusable definition of role success — name, role title, job family, job level, purpose, responsibilities, work context, success indicators, failure risks, non-negotiables, required/optional/excluded dimensions, per-dimension importance + rationale, evidence, notes, version, lifecycle status, linked context profile, assessments-used count, version history.
- **Context Profile**: the operating-environment definition — name, role title, job family, job level, status, the context values (leadership scope, ambiguity, decision stakes, time pressure, regulatory constraint, autonomy, stakeholder complexity, interdependence, innovation demand, execution precision, customer exposure, conflict load, change velocity, failure cost), success-profile notes, linked blueprint, version, version history.
- **Dimension**: a construct dimension referenced by blueprints for required/optional/excluded selection and importance; the catalog is derived from the distinct dimensions present in the governed `item_bank` (real dimension IDs/names).
- **Version Entry**: a record of a change — version, date, summary, optional status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An Admin can create a Role Blueprint through the builder (including dimension required/optional/excluded selection and importance) and see it in the list in a single session.
- **SC-002**: A dimension toggles deterministically through Required → Optional → Excluded, and an importance control appears for 100% of required dimensions.
- **SC-003**: The Validated state is the only blueprint state that satisfies the Hiring-Support role-fit gate; Deprecated/Archived blueprints are never offered for new assignments (0 violations).
- **SC-004**: An Admin can create a Context Profile via the visual builder, with the Context Signature and plain-language summary updating on every control change (live).
- **SC-005**: A blueprint↔context link is reflected on both records and the linked pair is selectable in the Create Assessment flow.
- **SC-006**: Each saved update to a blueprint or context produces a version-history entry visible on its detail view.
- **SC-007**: Both blueprints and contexts created here appear in the Create Assessment pickers with lifecycle eligibility respected.
- **SC-008**: 100% of list/builder/detail screens present loading, empty, and error states and are keyboard-operable (sliders/toggles with value labels, chart text alternatives) in both themes.

## Assumptions

- Builds on Spec 001 (components, charts incl. ContextRadar/ContextSignature, `roleBlueprintService`/`contextProfileService`, persistence); no backend in this phase. The two services exist as fixture-backed reads from Spec 001 and are completed here with create/update/lifecycle/version/link.
- Consumed by Spec 003 (pickers + create-new entry routes here) and Spec 005 (report blueprint/context summaries).
- The **Validated** transition is an Admin action in the prototype; production validation authority (psychometric/governance approval) is a future backend concern — the prototype treats it as the role-fit gate without computing validity.
- No real validation workflow, criterion computation, or score linkage; data is mock with simulated latency/errors.
- The dimension catalog is derived from the distinct dimensions present in the governed `item_bank` (via `questionBankService`); blueprints reference those real dimension IDs so they align with Spec 003 selection.
- Standard web-app performance/error expectations apply unless stated.

## Dependencies

- **Depends on**: Spec 001 (foundation — components, charts, `roleBlueprintService`, `contextProfileService`, persistence).
- **Consumed by**: Spec 003 (Create Assessment pickers + create-new), Spec 005 (report blueprint/context summaries).
- **Shared canon**: `../000-shared/{status-models.md,data-model.md,handoff-map.md,risk-register.md}`.
