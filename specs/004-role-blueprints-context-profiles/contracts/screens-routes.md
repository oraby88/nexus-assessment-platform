# Contract — Screens, Routes & States (Role Blueprints & Context Profiles)

Routes reserved by the Spec 001 router (currently placeholders); this feature replaces them. All under
`AdminShell` (`/admin/*`), org-scoped, with loading/empty/error/responsive/accessible states (FR-BC-001/008).

## Screens & routes

| Screen | Route | Story |
|---|---|---|
| Role Blueprints List | `/admin/role-blueprints` | US1 |
| Create/Edit Role Blueprint | `/admin/role-blueprints/new` (+ edit from detail) | US1 |
| Role Blueprint Detail | `/admin/role-blueprints/:blueprintId` | US1 |
| Context Profiles List | `/admin/context-profiles` | US2 |
| Create/Edit Context Profile | `/admin/context-profiles/new` (+ edit from detail) | US2 |
| Context Profile Detail | `/admin/context-profiles/:contextId` | US2 |

> `/admin/role-blueprints/new` and `/admin/context-profiles/new` are the targets of the Spec 003
> "create new" entries.

## Blueprint builder (US1) — steps & contract
1. **Role Information** — name, role title, job family, job level, purpose.
2. **Work Context** — work context text, optional link to a Context Profile (US3).
3. **Success Requirements** — responsibilities, success indicators, failure risks, non-negotiables.
4. **Dimension Selection** — derived catalog (from `item_bank`); each dimension tri-state toggle Required → Optional → Excluded.
5. **Dimension Importance** — for each Required dimension: Low/Moderate/Critical + optional rationale.
6. **Supporting Evidence** — evidence list + notes.
7. **Link Context Profile** — pick a context to link (two-way).
8. **Review & Save** — summary; Save creates Draft + initial version entry.

## Blueprint Detail (US1)
Tabs: Overview · Context · Dimensions · Evidence · Assessment Usage · Version History · Notes.
Actions: preview · edit · duplicate · **set status** (free-form; Archived terminal) · export · create assessment · archive.
Status shown via `StatusBadge`; **Validated** marked as the Hiring-Support gate.

## Context visual builder (US2) — contract (FR-BC-009)
- Controls: sliders/segmented controls for `ContextProfileValues` (leadership scope + 13 factors), chips, tooltips.
- Live **Context Signature**: `ContextRadar` + intensity bars (`DimensionBars`/`ContextSignature`) + plain-language summary, recomputed on every control change.
- Save creates Draft/Active + version entry.

## Context Detail (US2)
Summary · radar · bars · linked role/blueprint · notes · version history · linked assessments.
Lifecycle: Draft · Active · Archived (Archived terminal).

## Lists (US1/US2)
- Blueprint columns: Name · Role Title · Job Family · Job Level · Status · Version · Linked Context · Assessments Used · Updated · Actions.
- Context columns: Name · Linked Role · Job Family · Job Level · Linked Blueprint · Status · Updated · Actions.
- Both: search/filter/sort, create CTA, empty/loading/error.

## Cross-cutting states
Loading (skeleton lists/detail; builder initial), Empty (create CTA), Error (step validation inline; failed load retry), Responsive (wizard rail collapses; builder columns stack; radar scales; tables scroll in-card), Accessibility (dimension toggle + sliders keyboard-operable with value labels; logical tab order; chart text alternatives), Motion (bars/radar animate on change; staggered rows; step transitions — reduced-motion-safe).
