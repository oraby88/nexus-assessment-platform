# Implementation Plan: Role Blueprints and Context Profiles

**Branch**: `004-role-blueprints-context-profiles` | **Date**: 2026-06-15 | **Spec**: [`./spec.md`](./spec.md)

**Input**: Feature specification from `specs/004-role-blueprints-context-profiles/spec.md`. Inherits the delivered foundation `specs/001-foundation-design-system/*` (components, charts incl. ContextRadar/ContextSignature, `roleBlueprintService`/`contextProfileService`, persistence) and is consumed by Spec 003 (pickers/create-new, already wired to placeholder routes) and Spec 005 (report summaries). Shared canon `specs/000-shared/*`; constitution `.specify/memory/constitution.md` (v2.0.0). Visual source of truth: `project/`.

## Summary

Build the two reusable, first-class V1 objects the Create Assessment flow consumes: **Role Blueprints** ("what does success look like for this role?") via a multi-step builder with required/optional/excluded dimension selection (catalog derived from the governed `item_bank`) + per-dimension importance, lifecycle management (free-form status with the **Validated** state as the Hiring-Support role-fit gate, Archived terminal), detail tabs, duplicate, and version history; and **Context Profiles** ("in what environment will the person operate?") via a visual builder (sliders/segmented controls) with a live Context Signature (radar + intensity bars) and plain-language summary, detail, lifecycle (Draft/Active/Archived), and version history. A two-way Blueprint↔Context link travels into Spec 003. All data flows through the typed mock services (the sole data boundary); the seam stays swappable for the future backend.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 18 (established by Spec 001)

**Primary Dependencies**: React Router 6; foundation UI library (Stepper, Field, Slider, SegmentedControl, Chip, Tabs, DataTable, Toggle), charts (`ContextRadar`/`ContextSignature`/`DimensionBars` already built), hooks (`useAsync`, `useViewport`, `useToast`). No new runtime dependencies.

**Storage**: Browser `localStorage` (mock persistence from 001) for created/updated blueprints and contexts; no database.

**Testing**: Vitest + React Testing Library; unit tests for `roleBlueprintService` (create/update/duplicate/setStatus with guards/versions/link) and `contextProfileService` (create/update/versions/link), the dimension-catalog derivation, and the Validated-gate eligibility helper; component tests for the blueprint builder (dimension cycling + importance), the context visual builder (live signature), and lifecycle actions.

**Target Platform**: Evergreen desktop + tablet + mobile (builder columns stack; radar scales; tables scroll in-card).

**Project Type**: Web frontend — admin routes under `/admin/role-blueprints/*` and `/admin/context-profiles/*` (reserved by Spec 001 router as placeholders).

**Performance Goals**: Inherited (route < ~450ms; 60fps; reduced-motion honored); the live Context Signature updates on every control change without jank.

**Constraints**: No backend / real validation workflow / criterion computation / score linkage. All async via mock services with simulated latency + error toggles. Lifecycle is free-form with guards (Archived terminal; Validated enforced at consumption). WCAG 2.1 AA basics (sliders/toggles keyboard-operable with value labels; chart text alternatives). Created records must be selectable in Spec 003 with lifecycle eligibility respected.

**Scale/Scope**: 6 screens (2 lists, 2 builders, 2 details). Consumes 2 services (`roleBlueprintService`, `contextProfileService`) + `questionBankService` (dimension catalog). ~14 context-profile factors; full blueprint field set; 4 user stories.

## Constitution Check

*GATE: must pass before Phase 0; re-checked after Phase 1.* Source: `.specify/memory/constitution.md` (v2.0.0).

| Principle | How this feature complies | Gate |
|---|---|---|
| I Frontend First | No backend; builders + mocks + local persistence; reviewable per-story checkpoints | PASS |
| II Design Fidelity | Builders/lists/details composed from ported tokens/components/charts; missing states in-language | PASS |
| III Two Roles Only | Admin-only `/admin/*` routes; org-scoped | PASS |
| IV Service Boundaries | UI consumes `roleBlueprintService`/`contextProfileService`/`questionBankService` only; no fixture/persistence imports | PASS |
| V Governed Question Source | Dimension catalog derived from `item_bank` via `questionBankService` (no fabricated dimensions) | PASS |
| VI Immutable Metadata | Reads dimension metadata read-only; never mutates item-bank fields | PASS |
| VII Controlled Adaptation | N/A — no question wording here | PASS (n/a) |
| VIII Question-Level Attribution | N/A | PASS (n/a) |
| IX Safe Reporting | N/A — no reports rendered here (005 owns summaries) | PASS (n/a) |
| X Human Decision Support | Validated gate supports human role-fit judgment; no auto-decision introduced | PASS |
| XI Domain 6 Transparency | Context Profile feeds Domain 6 later (005); no D6 output rendered here | PASS (n/a) |
| XII Accessibility & Motion | sliders/toggles keyboard-operable + value labels; chart text alternatives; reduced-motion-safe animation | PASS |
| XIII Responsive Runtime | builders stack; radar scales; tables scroll in-card | PASS |
| XIV Traceability | spec/plan consistent with `000-shared/*`; lifecycles sourced from status-models | PASS |
| XV Review Before Implementation | stop for approval before `/speckit-implement` | PASS |

**Result**: No violations. Complexity Tracking empty.

## Project Structure

### Documentation (this feature)

```text
specs/004-role-blueprints-context-profiles/
├── plan.md              # This file
├── research.md          # Phase 0 — lifecycle model, dimension catalog, builder, versioning, link
├── data-model.md        # Phase 1 — blueprint/context entities + builder state + derivations
├── contracts/           # Phase 1
│   ├── screens-routes.md     # 6 screens, routes, states, the visual builder contract
│   └── services.md           # service methods this feature requires (deltas over 001 stubs)
├── quickstart.md        # Phase 1 — run + validation guide
└── checklists/
    └── requirements.md  # spec quality checklist (from /speckit-specify, /speckit-clarify)
```

### Source Code (repository root — frontend app)

```text
frontend/src/
├── features/
│   ├── blueprints/       # BlueprintsList, BlueprintBuilder (steps), BlueprintDetail
│   └── contexts/         # ContextsList, ContextBuilder (visual), ContextDetail
├── services/
│   ├── roleBlueprint/roleBlueprintService.ts    # create/update/duplicate/setStatus/versions/link (+ existing list/get)
│   └── contextProfile/contextProfileService.ts  # create/update/duplicate/setStatus/versions/link (+ existing list/get)
├── lib/dimensions.ts     # derive the dimension catalog from the governed item_bank (new)
└── components/           # reuse Stepper, Slider, SegmentedControl, Chip, Tabs, DataTable, charts
tests/
├── unit/        # roleBlueprint + contextProfile services, dimension derivation, validated-gate
└── component/   # blueprint builder (dimension cycle + importance), context builder (live signature), lifecycle
```

**Structure Decision**: One feature folder per object (`features/blueprints/`, `features/contexts/`). Completes the typed `roleBlueprintService`/`contextProfileService` stubs created in Spec 001 (currently fixture-backed `list`/`get`) with create/update/duplicate/setStatus/versions/link — preserving the single data boundary. Reuses the foundation chart primitives (`ContextRadar`, `ContextSignature`, `DimensionBars`) for the live signature. Adds only `lib/dimensions.ts` (catalog derivation). The Spec 003 "create new" entries already route to `/admin/role-blueprints/new` and `/admin/context-profiles/new`, which this feature replaces with real builders.

## Complexity Tracking

No constitution violations require justification. (If the context visual builder needs a charting/animation dependency beyond the hand-built SVG primitives, record it here against the simpler alternative.)
