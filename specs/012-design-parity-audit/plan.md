# Implementation Plan: Design-Parity Audit & Gap-Closure

**Branch**: `012-design-parity-audit` | **Date**: 2026-06-16 | **Spec**: [`./spec.md`](./spec.md)

**Input**: Feature specification from `specs/012-design-parity-audit/spec.md`. Audits the delivered app (Specs 001–011) against the `project/` design source and closes the remaining visual gaps to parity. Visual + motion source of truth: `project/` (`Nexus Platform.html` + `app/{shell,ui,icons,landing,admin_*,create_assessment*,transform_sequence,report_detail,user_portal,user_assessment,robot_companion}.jsx` + `styles.css`). Constitution `.specify/memory/constitution.md` (v2.0.0 — esp. I, II, IV, IX, XII, XIII).

## Summary

A full-app, screen-by-screen visual-parity pass against the `project/` design, frontend/mock-only. Work proceeds **per area, interleaved** (clarify Q3): each user story audits its area against the design source, records deviations in a written **gap inventory** (each classified High/Medium/Low), then closes all **High + Medium** gaps (Low logged/deferrable — clarify Q2). The **parity bar** (clarify Q1) is an *exact* match to the design's specified source values (color/spacing/type scale/layout/iconography/elevation), verified at review + token/structure assertions — **no pixel-diff tooling**. Order (most pervasive first): (US1) shared chrome + design-system components + public/auth entry → (US2) Admin screens → (US3) User portal & runtime → (US4) Create-Assessment flow. Presentation/markup/styling only — no new features, data, scoring, routes, or service changes; reduced-motion-safe, no shell parallax, RTL + responsive, ≤ 260 KB eager budget (GSAP lazy), all gates green, **0 functional regressions**.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 18.

**Primary Dependencies**: **No new dependency and no new tooling.** Parity is judged at review + token/structure assertions — **no visual-regression/pixel-diff dependency** (clarify Q1). Closure edits use the existing CSS-variable tokens (`tokens.css`, ported from `styles.css`), Tailwind utilities (`0091`), the Spec 010 keyframe/motion vocabulary, and the existing icon/UI primitives. The audit may add **missing tokens, icons, or component variants** the design specifies but the app lacks (presentation, not features); GSAP stays lazy.

**Storage**: None new.

**Testing**: Vitest + RTL + `vitest-axe`. Per-area structural/token assertions where meaningful (e.g., a screen renders the expected states/structure/icons; chrome uses the design's tokens). Reuse the Spec 009 reduced-motion + **no-shell-parallax** checks and the bundle-budget gate; reuse the Spec 008 release gate as the regression backstop. Parity itself is signed off at **review** against the source (the gap inventory drives this), not by pixel-diff.

**Target Platform**: Evergreen desktop + tablet + mobile, light + dark themes, RTL reading order.

**Performance Goals**: Initial eager JS stays **≤ 260 KB raw** (currently ~258 KB — thin headroom; parity edits are mostly markup/class changes that add ~no eager JS; watch any new eager imports). GSAP remains a lazy chunk.

**Constraints**: **NON-NEGOTIABLE** frontend/mock-only (I); design fidelity to `project/` (II — the feature's purpose); service/data boundary untouched (IV); display-only, no restricted content on user screens (IX); reduced-motion-safe + no shell parallax (XII); responsive + RTL (XIII); ≤260 KB eager budget; all gates green; **0 functional regressions** (no behavioral/test changes).

**Scale/Scope**: ~40 live routes/screens across 4 areas mapped to ~12 design source files; 1 written gap inventory (per-area sections); closure of all High+Medium gaps. No new screens/routes/data/scoring.

## Constitution Check

*GATE: must pass before Phase 0; re-checked after Phase 1.*

| Principle | How this feature complies | Gate |
|---|---|---|
| I Frontend First | Presentation-only; no backend/network/data; mock services untouched; GSAP lazy | PASS |
| II Design Fidelity | The feature's entire purpose — align every screen to `project/` | PASS |
| III Two Roles Only | No role/scope change; parity is role-neutral | PASS |
| IV Service Boundaries | No service/contract/fixture/persistence changes; components keep consuming `@/services` | PASS |
| V Governed Question Source | Unchanged | PASS |
| VI Immutable Metadata | No metadata/model changes | PASS |
| VII Controlled Adaptation | Unchanged | PASS (n/a) |
| VIII Question-Level Attribution | Unchanged; no scoring | PASS (n/a) |
| IX Safe Reporting | User-screen parity must not surface restricted/internal content (audited explicitly) | PASS |
| X Human Decision Support | Unchanged | PASS (n/a) |
| XI Domain 6 Transparency | Unchanged | PASS (n/a) |
| XII Accessibility & Motion | Reduced-motion-safe + no shell parallax preserved; AA contrast both themes; parity must not regress a11y | PASS |
| XIII Responsive Runtime | Responsive + RTL parity verified | PASS |
| XIV Traceability | No service surface change → handoff-map unaffected; plan consistent with `000-shared/*` + `project/` | PASS |
| XV Review Before Implementation | Stop for approval before `/speckit-implement`; parity itself is review-signed-off | PASS |

**Result**: No violations. Complexity Tracking empty.

## Project Structure

### Documentation (this feature)

```text
specs/012-design-parity-audit/
├── plan.md              # This file
├── research.md          # Phase 0 — area→design-source mapping, parity method, severity, sequencing
├── data-model.md        # Phase 1 — gap-inventory entry schema, parity bar, screen map
├── contracts/           # Phase 1
│   ├── parity-bar.md        # acceptance contract + inventory schema + verification method
│   └── screen-map.md        # route ↔ project/ design-source mapping (per area)
├── inventory.md         # the per-screen GAP INVENTORY (audit deliverable; grows per area)
├── quickstart.md        # Phase 1 — run + validation guide
└── checklists/
    └── requirements.md  # spec quality checklist (passing)
```

### Source Code (repository root — frontend app)

```text
frontend/
├── src/
│   ├── styles/{tokens.css,globals.css}   # add any design-specified tokens/keyframes the app lacks
│   ├── components/
│   │   ├── layout/index.tsx              # US1: shell (sidebar/topbar/popovers/avatar/theme toggle) → app/shell.jsx
│   │   ├── ui/{index.tsx,primitives.tsx} # US1: components → app/ui.jsx
│   │   ├── ui/icons.tsx                  # US1 (NEW): centralized named-icon set ported from app/icons.jsx (the app has none today)
│   │   ├── charts/index.tsx              # US2/US3: report visuals
│   │   ├── companion/ · motion/          # reused (Spec 010/011) — no behavior change
│   │   └── …
│   └── features/
│       ├── auth/ · landing/              # US1: public/auth entry → app/landing.jsx
│       ├── dashboard/ users/ assessments/ blueprints/ contexts/ reports/ history/ … # US2 → app/admin_*.jsx, report_detail.jsx
│       ├── (user) assessments/user, reports/user, history/user, notifications, profile, help, runtime/ # US3 → app/user_portal.jsx, user_assessment.jsx
│       └── create-assessment/            # US4 → app/create_assessment*.jsx, transform_sequence.jsx
tests/
├── parity/   # per-area structural/token assertions (states present, expected tokens/icons/structure)
└── (reuse)   # Spec 009 reduced-motion + no-shell-parallax + check-bundle; Spec 008 release gate
```

**Structure Decision**: No new product screens/routes — the work edits existing components/screens' markup, classes, tokens, icons, and states to match the design's specified values. The **gap inventory** (`specs/012-design-parity-audit/inventory.md`) is the audit deliverable, written per area with each entry classified High/Medium/Low and a resolution status. The route↔design-source map (`contracts/screen-map.md`) scopes each area. Closure is **per-area interleaved** (audit area → close its High+Medium gaps). Parity is **review-signed-off** against the source; automated tests cover regression + structure/states + the budget/motion gates (no pixel-diff). Any design-specified tokens/icons/component variants the app lacks are added in the token/primitive layer (presentation, not features).

## Complexity Tracking

No constitution violations. No new dependency or tooling: the clarified parity bar (exact source-value match, review + structural assertions, **no pixel-diff**) deliberately avoids a heavy visual-regression dependency, keeping the ≤260 KB budget and the deterministic test suite intact. The only additions are design-specified tokens/icons/variants the app is currently missing — presentation assets, not new behavior.
