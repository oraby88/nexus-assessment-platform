# Phase 1 Data Model: Design-Parity Audit & Gap-Closure

No new **product** entities. This feature adds presentation-only/process constructs: the gap inventory, the parity bar, and the screen map.

## Gap Inventory Entry (the audit deliverable — `inventory.md`)

```ts
interface GapInventoryEntry {
  area: 'chrome' | 'admin' | 'user' | 'create';
  route: string;            // live route, e.g. '/admin/dashboard'
  designSource: string;     // project/ file, e.g. 'app/admin_dashboard.jsx' | 'no design source'
  deviations: Deviation[];
}
interface Deviation {
  aspect: 'color' | 'spacing' | 'typography' | 'layout' | 'iconography' | 'elevation' | 'state' | 'motion' | 'structure';
  detail: string;           // concrete description vs the source value
  severity: 'High' | 'Medium' | 'Low';
  status: 'open' | 'closed' | 'deferred';  // deferred (Low only) requires reviewer sign-off
}
```

- **Severity rubric** (D2): High = wrong/missing tokens, broken layout, missing state, off-brand component, a11y/contrast regression. Medium = noticeable spacing/type/icon/elevation deviation. Low = sub-pixel/marginal cosmetic.
- **Invariant (definition of done)**: every High + Medium deviation reaches `closed`; Low may be `deferred` with sign-off. No `open` High/Medium at completion.

## Parity Bar (the acceptance contract)

- Match the design's **specified source values exactly** (color/spacing/type scale/layout/iconography/elevation), read from `project/app/styles.css` + `app/*.jsx`. Verified at **review** + token/structure assertions. No pixel-diff. Pixel-perfect where the design specifies a value; not required where it omits a state.

## Screen Map (route ↔ design source — see `contracts/screen-map.md`)

- Per-area mapping of every live route to its `project/` counterpart (or "no design source"). Drives audit scope and inventory rows.

## Validation & invariants

- **II** — every audited screen matches the design within the parity bar (review + assertions), both themes + RTL.
- **I / IV** — presentation/markup/styling only; no service/data/route/scoring changes; components keep consuming `@/services`.
- **IX** — user-screen parity surfaces no restricted/internal content.
- **XII** — reduced-motion → final/static; no shell parallax; a11y/contrast not regressed.
- **XIII** — responsive + RTL parity.
- **Perf** — initial eager JS ≤ 260 KB; GSAP lazy (Spec 009 `check-bundle`).
- **Done** — 0 open High/Medium gaps; Low logged/deferred; all gates green; 0 functional regressions.
