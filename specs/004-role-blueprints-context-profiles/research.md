# Phase 0 — Research & Decisions (Role Blueprints & Context Profiles)

All Technical Context items are resolved — **no remaining NEEDS CLARIFICATION** (the two `/speckit-clarify` answers settled the lifecycle model and the dimension-catalog source). Foundation/master decisions are inherited from `../001-foundation-design-system/research.md` and `../000-master-scope/research.md`.

## D1 — Blueprint lifecycle transition model *(clarification Q1)*
- **Decision**: `roleBlueprintService.setStatus(id, status)` accepts any of the six statuses (Draft, Under Review, Active, Validated, Deprecated, Archived) with two guards: **Archived is terminal** (no transition out), and the **Validated requirement is enforced at consumption** (Hiring-Support role-fit in Spec 003), not at transition. Deprecated/Archived are excluded from new-assignment eligibility.
- **Rationale**: Matches master-scope "validate-display in mock form"; flexible for a prototype without a backend approval workflow; testable.
- **Alternatives**: Strict ordered progression (rejected — over-models a mock); no guards (rejected — un-archiving is nonsensical).

## D2 — Dimension catalog source *(clarification Q2)*
- **Decision**: `lib/dimensions.ts` derives the catalog from the distinct `{dimensionId, dimensionName, domainId}` tuples present in the governed `item_bank` (loaded via `questionBankService`), de-duplicated and sorted. Blueprints reference these real dimension IDs.
- **Rationale**: Aligns blueprint dimensions with Spec 003 question selection (same IDs); no separate fixture to drift; honors Principle V (governed source).
- **Alternatives**: Dedicated dimensions fixture (rejected — drift risk); free-text (rejected — breaks alignment with selection/coverage).

## D3 — Blueprint builder & dimension cycling
- **Decision**: A multi-step builder (Stepper) holds draft blueprint state; the Dimension Selection step renders the derived catalog, each dimension a tri-state toggle cycling Required → Optional → Excluded; required dimensions reveal an importance control (Low/Moderate/Critical) + optional rationale. Save persists via `roleBlueprintService.create`/`update` with a version entry.
- **Rationale**: FR-BC-002/003/004; reuses foundation Stepper/Chip/SegmentedControl; deterministic + testable.
- **Alternatives**: Single long form (rejected — poor UX for this many fields).

## D4 — Context visual builder & live signature
- **Decision**: A visual builder with sliders/segmented controls bound to `ContextProfileValues`; a derived `ContextSignature` (reuse `ContextRadar` + `DimensionBars`/`ContextSignature` chart) and a plain-language summary recompute on every control change (pure function of the values). Save via `contextProfileService.create`/`update` + version entry.
- **Rationale**: FR-BC-009; live, reduced-motion-safe; reuses hand-built charts (no new dep).
- **Alternatives**: Form-only (rejected — master scope wants a visual builder).

## D5 — Versioning
- **Decision**: Both services append a `VersionEntry` (version, date, summary) on each meaningful save; detail Version History lists newest-first. Version string bumps simply (e.g., minor increment) in the mock.
- **Rationale**: FR-BC-012/SC-006; traceability (Principle XIV).
- **Alternatives**: No versioning (rejected — required); full semantic diffing (rejected — backend concern).

## D6 — Two-way Blueprint↔Context link
- **Decision**: `roleBlueprintService.link(blueprintId, contextId)` sets `linkedContextProfileId` and the reciprocal `linkedBlueprintId` on the context (and `contextProfileService.link` mirrors). Both detail views show the link; Spec 003 offers the linked context when its blueprint is chosen.
- **Rationale**: FR-BC-011/SC-005; single update keeps both sides consistent.
- **Alternatives**: One-way link (rejected — spec requires two-way).

## D7 — Consumption eligibility (shared helper)
- **Decision**: A small predicate (in the blueprint service or governance) marks a blueprint eligible for new assignments when not Deprecated/Archived, and eligible for Hiring-Support role-fit only when **Validated**. Spec 003 pickers use it.
- **Rationale**: FR-BC-007/013, SC-003/007; centralizes the gate.
- **Alternatives**: Inline checks in 003 (rejected — duplication/divergence).

## Open questions status
None block planning. Deferred to implementation detail (not spec ambiguities): name-uniqueness policy (default: duplicates allowed), version-string scheme, and save-draft mechanics within the builder.
