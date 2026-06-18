# Quickstart — Role Blueprints & Context Profiles (validation guide)

Run-and-verify guide for the two reusable objects. Implementation detail lives in `tasks.md` (after
`/speckit-tasks`). Builds on Spec 001; consumed by Spec 003.

## Prerequisites
- Sign in as Admin (`/login`); open `/admin/role-blueprints` and `/admin/context-profiles`.
- App builds (`npm install`, `npm run dev`).

## Setup & run
```bash
cd frontend
npm run dev      # serve
npm test         # Vitest unit + component
npm run build    # production build
```

## Validation scenarios (map to Success Criteria)

| # | Scenario | Steps | Expected | SC |
|---|---|---|---|---|
| 1 | Create blueprint | Builder → fill steps → set a dimension Required + importance → Save | Blueprint created (Draft) with a version entry; appears in list | SC-001 |
| 2 | Dimension cycling | Dimension Selection step → toggle a dimension repeatedly | Cycles Required → Optional → Excluded; importance control appears when Required | SC-002 |
| 3 | Dimension catalog | Inspect dimension list | Dimensions derive from the governed item_bank (real IDs aligning with Spec 003) | SC-002 |
| 4 | Lifecycle + gate | Detail → set status to each value; try Archived then change | Free-form set; Archived terminal; only Validated satisfies the Hiring-Support gate | SC-003 |
| 5 | Create context | Context builder → move sliders → Save | Live Context Signature (radar+bars) + summary update on every change; context created | SC-004 |
| 6 | Link | Blueprint builder/detail → link a context | Both records show the two-way link | SC-005 |
| 7 | In Create Assessment | Spec 003 Step 5/6 | The created blueprint/context appear and are selectable; linked context offered with its blueprint | SC-005/007 |
| 8 | Versioning | Edit + save a blueprint and a context | A new version-history entry appears (newest-first) on each detail | SC-006 |
| 9 | Eligibility | Deprecate/Archive a blueprint | Not offered for new assignments in Spec 003 | SC-003/007 |
| 10 | A11y / responsive | Keyboard sliders/toggles; resize | Value labels; focus order; chart text alternatives; columns stack | SC-008 |

## Done (acceptance)
Role Blueprint creates/updates/versions/duplicates/sets-status (Validated gate visible) with dimension
required/optional/excluded + importance from the item_bank-derived catalog; Context Profile
creates/updates/visualizes (live signature)/links/versions; both are selectable in Spec 003 with
lifecycle eligibility respected — with unit/component tests passing.
