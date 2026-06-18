# Implementation Plan: Nexus Assessment Platform — Frontend Prototype

**Branch**: `(none — not a git repo)` | **Date**: 2026-06-13 | **Spec**: `./spec.md` (Master Scope)

**Input**: Master scope `specs/000-master-scope/spec.md`; umbrella feature `specs/009-frontend-prototype/spec.md`; area specs `specs/001-…`–`008-…`; shared canon `specs/000-shared/*`; constitution `.specify/memory/constitution.md` (frontend v2.0.0). Visual source of truth: `project/`.

## Summary

Build the V1 **frontend prototype** of the Nexus Assessment Platform: two role experiences (one organization Admin + User/candidate) on a typed **mock-service layer** with local persistence — no backend. Deliver the signature AI-assisted, governed Create-Assessment flow, the candidate assessment runtime (five question types), governed reporting including the Domain 6 contextual-alignment view, reusable Role Blueprints and Context Profiles, Candidate Comparison (human-led, no ranking), and the supporting Admin/User periphery — faithful to the `project/` design and the governance rules in the constitution. Architecture preserves a clean seam (typed services + governance helpers) so a later FastAPI + Supabase phase can replace mocks without a UI rewrite.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 18

**Primary Dependencies**: React Router 6; GSAP 3 (signature motion, already used by the design); React Hook Form + Zod (wizard/forms — recommended); date-fns (formatting). Hand-built SVG charts (no heavy chart lib). No backend libraries.

**Storage**: Browser `localStorage` only (theme, assessment runtime progress, explicit drafts), namespaced + versioned. No database.

**Testing**: Vitest + React Testing Library; `@axe-core` for accessibility on priority flows; Playwright optional for the two P1 end-to-end journeys.

**Target Platform**: Evergreen desktop + tablet + mobile browsers (single-page app).

**Project Type**: Web frontend (single app, two role shells `/admin/*` and `/app/*`).

**Performance Goals**: 60fps signature motion; route transitions < ~450ms; pre-paint theme (no flash); lazy-loaded routes; the full 543-item `item_bank` code-split and excluded from the initial chunk.

**Constraints**: No backend / real auth / real AI / real scoring / real PDF / real email / production audit. All async via mock services with simulated latency + error toggles. `prefers-reduced-motion` honored. WCAG 2.1 AA basics. Admin-only data must never render in the User portal.

**Scale/Scope**: ~37 screens (Admin + User per `000-shared/route-map.md`); 5 question/method families; 6-domain construct (D1/D2/D4 active, D3/D5 restricted, D6 derived-visual); full governed bank (543 items); ~18 mock services (`000-shared/handoff-map.md`).

## Constitution Check

*GATE: must pass before Phase 0; re-checked after Phase 1.* Source: `.specify/memory/constitution.md` (v2.0.0).

| Principle | Plan compliance | Gate |
|---|---|---|
| I Frontend First | No backend code; all features on mocks; phased checkpoints | PASS |
| II Design Fidelity | Tokens/motion/theming ported from `project/`; missing states added in-language | PASS |
| III Two Roles Only | Separate shells + route guards; one Admin/org | PASS |
| IV Service Boundaries | `services/` is the sole data boundary; Promise-based; mirrors handoff-map | PASS |
| V Governed Question Source | `questionBankService` selects from `item_bank` only; excludes blocked/quarantine | PASS |
| VI Immutable Metadata | `Item` metadata read-only at type level; no fabricated weight/difficulty | PASS |
| VII Controlled Adaptation | `adaptationService` accepts `{itemId, adaptedText}` only + diff; method safeguards | PASS |
| VIII Question-Level Attribution | responses keyed to `item_id`; no client scoring/live score | PASS |
| IX Safe Reporting | `toUserSafe` projection + Admin preview | PASS |
| X Human Decision Support | comparison side-by-side; no ranking/auto-decision | PASS |
| XI Domain 6 Transparency | CAI/DII + secondary + fit radar with provisional/omitted states | PASS |
| XII Accessibility & Motion | tokens contrast, keyboard, `useReducedMotion`, no shell parallax | PASS |
| XIII Responsive Runtime | mobile-first runtime, 5 types, pause/resume/reload | PASS |
| XIV Traceability | specs + 000-shared kept current; master-scope authoritative | PASS |
| XV Review Before Implementation | stop for approval before `/speckit-implement` | PASS |

**Result**: No violations. Complexity Tracking empty.

## Project Structure

### Documentation (this feature)
```text
specs/000-master-scope/
├── spec.md            # Master scope (authoritative confirmed decisions)
├── plan.md            # This file
├── research.md        # Phase 0 — decisions resolving open questions
├── data-model.md      # Phase 1 — entity summary (source of truth: ../000-shared/data-model.md)
├── contracts/         # Phase 1 — mock-service + route UI contracts
│   ├── mock-services.md
│   └── routes.md
└── quickstart.md      # Phase 1 — run + validation guide (mock logins, journeys)
specs/000-shared/      # shared canon referenced by all specs (models, statuses, routes, handoff, risks)
specs/001-…008-…       # area feature specs (detailed requirements)
specs/009-frontend-prototype/  # umbrella feature spec
```

### Source Code (repository root — frontend app to be implemented)
```text
frontend/
├── index.html · package.json · vite.config.ts · tsconfig.json
└── src/
    ├── main.tsx · App.tsx · router.tsx        # AdminShell (/admin/*), UserShell (/app/*), public
    ├── styles/ tokens.css · globals.css · theme.ts
    ├── components/ ui/ · charts/ · motion/ · layout/ · nex/
    ├── features/                              # one folder per area spec (001–007)
    │   ├── auth/ dashboard/ users/ assessments/
    │   ├── create-assessment/ blueprints/ contexts/
    │   ├── reports/ comparison/ history/ exports/ notifications/ settings/ profile/
    │   ├── activity-log/ runtime/
    ├── services/                              # the ONLY data boundary (mock, Promise-based)
    │   ├── http.ts · persistence.ts
    │   ├── auth/participant/consent/assessmentDraft/agentDiscovery/questionBank/adaptation
    │   ├── roleBlueprint/contextProfile/assessment/runtime/scoring/domain6/report
    │   ├── comparison/notification/export/activityLog/settings
    │   └── governance/  eligibility · confidenceGate · useCaseGate · visibilityEngine · toUserSafe
    ├── models/    # from ../000-shared/data-model.md
    ├── mocks/     # fixtures (decoupled) + governed-bank.ts (code-split full item_bank) + import-bank.ts
    ├── hooks/     # useTheme, useAsync, useLocalStorage, useViewport, useToast
    └── lib/       # csv.ts, diffWords.ts, format.ts, ids.ts
tests/ unit/ · component/ · e2e/
```

**Structure Decision**: Feature-folder organization mapped 1:1 to the area specs; `services/` is the single data boundary with governance logic isolated under `services/governance` (unit-testable, later replaceable by API responses); two route shells map to the role separation; the governed bank is code-split. Detailed per-area requirements live in `specs/001-…`–`008-…`.

## Complexity Tracking

No constitution violations require justification. (If a state-management library is later introduced for the wizard, record it here against the simpler alternative it replaces.)
