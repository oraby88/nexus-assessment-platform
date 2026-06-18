# Implementation Plan: Foundation and Design System

**Branch**: `001-foundation-design-system` | **Date**: 2026-06-15 | **Spec**: [`./spec.md`](./spec.md)

**Input**: Feature specification from `specs/001-foundation-design-system/spec.md`. Inherits the master baseline `specs/000-master-scope/{spec.md,plan.md,research.md,data-model.md,contracts/}`, shared canon `specs/000-shared/*`, and constitution `.specify/memory/constitution.md` (v2.0.0). Visual source of truth: `project/`.

## Summary

Build the shared frontend **substrate** every other area spec (002–008) builds on: application bootstrap, the two role shells (`AdminShell` for `/admin/*`, `UserShell` for `/app/*`) with full-bleed mode and role-based route guards; faithfully ported Claude Design tokens with light/dark theming applied pre-paint (defaulting to OS `prefers-color-scheme` when unset); a reusable UI component library, hand-built SVG chart primitives, and reduced-motion-safe motion primitives; the typed **mock-service layer** (the sole data boundary) over an HTTP latency/error simulator and namespaced, versioned `localStorage` persistence; mock authentication; centralized, decoupled fixtures; the governance-display helpers (eligibility, confidence gate, use-case gate, visibility engine, user-safe projection); typed models from the shared data model; and the governed `item_bank` converted to a committed typed module loaded via code-split dynamic `import()`. The seam (typed services + governance helpers) is the de-facto API contract so a later FastAPI + Supabase phase can replace mocks without a UI rewrite.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 18

**Primary Dependencies**: React Router 6; GSAP 3 (signature motion, wrapped by a reduced-motion hook); React Hook Form + Zod (forms — used by downstream specs, types established here); date-fns (formatting). Hand-built SVG charts (no chart library). No backend libraries.

**Storage**: Browser `localStorage` only, namespaced + versioned (`nexus_theme`, `nexus_runtime_v1`, `nexus_drafts_v1`); on schema-version mismatch the store discards the stale entry and starts fresh (no migration in V1). No database.

**Testing**: Vitest + React Testing Library; `@axe-core` for accessibility on priority sample flows; reduced-motion behavior verified. Foundation ships unit tests for `http`, `persistence`, `authService`, the governance helpers, and an `item_bank` source-provenance test.

**Target Platform**: Evergreen desktop + tablet + mobile browsers (single-page app).

**Project Type**: Web frontend (single app, two role shells + public/auth routes).

**Performance Goals**: 60fps signature motion; route transitions < ~450ms; pre-paint theme (no flash); route-level lazy loading; the full 543-item `item_bank` code-split and excluded from the initial chunk.

**Constraints**: No backend / real auth / real AI / real scoring / real PDF / real email / production audit. All async via mock services with simulated latency + error toggles. `prefers-reduced-motion` honored (degrade to instant/opacity; no shell parallax). WCAG 2.1 AA basics (keyboard, visible focus, contrast both themes, labelled controls, landmarks). Admin-only data must never render in the User portal. UI components must consume services only — never import fixtures or read persistence directly.

**Scale/Scope**: Foundation underpins ~37 screens across both roles (`000-shared/route-map.md`); establishes ~18 typed mock services (`000-shared/handoff-map.md`), ~32 UI primitives, 6 chart primitives, 5 governance helpers, and the full governed bank (543 items). Foundation itself ships shells + infra + one demonstrably service-driven sample render; feature pages are owned by 002–007.

## Constitution Check

*GATE: must pass before Phase 0; re-checked after Phase 1.* Source: `.specify/memory/constitution.md` (v2.0.0). Foundation is where most of these principles are **established** as enforceable seams.

| Principle | How the foundation satisfies it | Gate |
|---|---|---|
| I Frontend First | No backend code; bootstrap + mocks + local persistence only; delivered as a reviewable checkpoint | PASS |
| II Design Fidelity | Tokens/typography/motion ported from `project/`; missing states (empty/loading/error/404/responsive) provided as primitives in-language | PASS |
| III Two Roles Only | Separate `AdminShell`/`UserShell` + route guards; one Admin/org assumed; no cross-role rendering | PASS |
| IV Service Boundaries | `services/` is the sole data boundary; Promise-based typed signatures mirror `handoff-map.md`; UI never imports fixtures/persistence | PASS |
| V Governed Question Source | `questionBankService` selects from `item_bank` only; eligibility helper excludes blocked/quarantine/pilot/research | PASS |
| VI Immutable Metadata | `ItemBankItem` typed read-only; conversion preserves source fields; no fabricated `weight`/`difficulty` | PASS |
| VII Controlled Adaptation | `adaptationService` stub accepts `{itemId, adaptedText}` only + diff; method-family modes typed | PASS |
| VIII Question-Level Attribution | runtime types key responses to `sourceQuestionId`; no client scoring/live score in foundation | PASS |
| IX Safe Reporting | `toUserSafe` projection helper provided; strips restricted fields | PASS |
| X Human Decision Support | comparison types/seam carry no ranking; disclaimer surface available; no auto-decision logic | PASS |
| XI Domain 6 Transparency | visibility engine supports provisional/downgraded/omitted/blocked states for D6 outputs | PASS |
| XII Accessibility & Motion | focus-visible tokens, focus-trap, aria-live, accessible chart text; `useReducedMotion`; no shell parallax | PASS |
| XIII Responsive Runtime | `useViewport` + off-canvas sidebar; mobile-first primitives; full-bleed runtime shell ready for 5 types | PASS |
| XIV Traceability | this plan + spec kept consistent with `000-shared/*`; master-scope authoritative; no doc drift | PASS |
| XV Review Before Implementation | stop for approval before `/speckit-implement` | PASS |

**Result**: No violations. Complexity Tracking empty. (State management = React local state + Context + a `useAsync` resource hook; Redux/Zustand explicitly rejected — see `research.md`. If the wizard later forces a store, record it in Complexity Tracking then.)

## Project Structure

### Documentation (this feature)

```text
specs/001-foundation-design-system/
├── plan.md              # This file
├── research.md          # Phase 0 — foundation decisions (deltas over master research)
├── data-model.md        # Phase 1 — model/enum slice the foundation authors + immutability typing
├── contracts/           # Phase 1 — foundation contracts
│   ├── shells-routing.md     # shells, route tree, guards, navigation registries
│   ├── infra-services.md     # http, persistence, authService, governance helpers
│   └── design-system.md      # tokens/theme, UI primitives, charts, motion, a11y utils
├── quickstart.md        # Phase 1 — run + validation guide for the foundation
└── checklists/
    └── requirements.md  # spec quality checklist (from /speckit-specify, /speckit-clarify)
```

### Source Code (repository root — frontend app)

Foundation creates/owns the substrate paths below (subset of the master structure; feature folders are populated by 002–007).

```text
frontend/
├── index.html              # pre-paint theme script (reads stored pref → else prefers-color-scheme)
├── package.json · vite.config.ts · tsconfig.json (strict)
├── scripts/
│   └── convert-item-bank.ts   # build/prep-time: item_bank workbook → committed typed module
└── src/
    ├── main.tsx · App.tsx · router.tsx        # AdminShell (/admin/*), UserShell (/app/*), public/auth
    ├── styles/  tokens.css · globals.css · theme.ts        # ported design tokens + typed chart mirror
    ├── components/
    │   ├── ui/         # Button, IconButton, Card, Modal, Drawer, Popover, Menu, Tabs, Field, TextArea,
    │   │               # Select, Slider, SegmentedControl, Toggle, Checkbox, RadioGroup, StatusBadge,
    │   │               # Chip, ConfidenceChip, TrustBadge, Avatar, ScoreBar, Ring, CountUp, Tooltip,
    │   │               # EmptyState, Skeleton, DataTable, FilterBar, SearchInput, Stepper, Toast, Timeline
    │   ├── charts/     # Gauge, ContextRadar, FitRadar, DimensionBars, CoverageBars, ContextSignature
    │   ├── motion/     # PageFX (route reveal), SectionReveal, StaggerRows, CountUp, ChipCreate
    │   └── layout/     # AdminShell, UserShell, FullBleedShell, Sidebar(off-canvas), TopBar, NavRegistry
    ├── services/                              # the ONLY data boundary (mock, Promise-based)
    │   ├── http.ts · persistence.ts
    │   ├── authService.ts
    │   ├── <feature services as typed stubs>  # mirror handoff-map.md (impl owned by 002–007)
    │   └── governance/  eligibility · confidenceGate · useCaseGate · visibilityEngine · toUserSafe
    ├── models/     # authored from ../../000-shared/data-model.md; governance fields Readonly
    ├── mocks/      # fixtures.ts (decoupled) · governed-bank.ts (generated, code-split) · import-bank.ts
    ├── hooks/      # useTheme, useAsync, useLocalStorage, useViewport, useToast, useReducedMotion, useFocusTrap
    ├── lib/        # csv.ts, diffWords.ts, format.ts, ids.ts
    └── providers/  # ThemeProvider, ToastProvider, SessionProvider
tests/
├── unit/        # http, persistence, authService, governance/*, item-bank provenance
└── component/   # guard redirects, theme persistence/no-flash, reduced-motion, service-driven sample render
```

**Structure Decision**: Foundation establishes the substrate of the master web-frontend structure — two route shells for role separation, `services/` as the single data boundary with governance isolated under `services/governance/`, a generated code-split governed bank, and decoupled fixtures. Feature-specific folders under `components/`/`services/`/`features/` are scaffolded as typed stubs here and implemented by specs 002–007. This is the 1:1 foundation slice of `specs/000-master-scope/plan.md`.

## Complexity Tracking

No constitution violations require justification. (If a state-management library is later introduced for the Create Assessment wizard, record it here against the React-Context + `useAsync` alternative it would replace.)
