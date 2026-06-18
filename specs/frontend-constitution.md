# Nexus Assessment Platform — Frontend Constitution

**Phase**: V1 Frontend Prototype (React + TypeScript, mock services, local persistence).
**Companion**: backend governance is in `./backend-constitution.md`. The Spec-Kit canonical copy is `../.specify/memory/constitution.md` (kept in sync). Authoritative scope = `./000-master-scope/spec.md`; shared models/statuses/routes/handoff = `./000-shared/*`; visual source of truth = `../project/`.

**Version**: 2.0.0 | **Ratified**: 2026-06-13 | **Last Amended**: 2026-06-13

---

## Roles & Responsibilities (V1)

V1 has exactly **two product roles**, each in its own app shell. Admin-only data MUST never render in the User portal.

| Role | Scope | Can do | Cannot do |
|---|---|---|---|
| **Admin** (one account per organization) | Organization-level data only | Log in; dashboard; add/bulk-upload Users; search/filter Users; create & manage Role Blueprints and Context Profiles; create one tailored assessment per User via the AI-Agent flow; set deadlines & reminders; send invitations; receive in-platform + simulated-email notifications; monitor progress; resend/remind/extend/cancel; view Admin reports; preview the User-safe report; simulated PDF; compare candidates side-by-side; export operational lists; view global history; view org-scoped Activity Log; manage settings & profile | See another organization's data; build multi-Admin workflows; make automatic hire/reject decisions; generate questions; mutate scoring metadata |
| **User** (candidate) | Own data only | Open invitation; access/login; view dashboard; see active assessments; review overview; accept use-case-specific consent; read instructions; answer all five question types; see progress; auto-save; pause/resume/submit; see completion; receive report notifications; open the User-safe report; simulated PDF; view own history & notifications; review consent history; revoke eligible consent; request data deletion; access Help & Support | See organization-level data; see other Users' data; see raw responses, formulas, scoring versions, governance flags, blocked values, Admin notes, or Domain 6 internals |

**Build/governance actor** — the **AI Agent ("Nex")** (frontend, scripted in V1): may discover requirements, build a Job Requirements Profile, select eligible questions only from `item_bank`, adapt wording where permitted, explain selections, and propose an assessment for Admin approval. It may **not** create new questions, use out-of-bank/blocked items, mutate metadata, or send without Admin approval.

## Core Principles

1. **Frontend First (NON-NEGOTIABLE)** — V1 is a complete React + TypeScript frontend on mock data/services/local persistence only. No FastAPI, Supabase, real auth/AI/scoring/PDF/email/audit. Every feature demoable on mocks; delivered in incremental checkpoints.
2. **Design Fidelity** — `../project/` is the visual source of truth; match tokens/typography/theming/motion. Missing states (error/empty/loading/responsive/404) are added in the same design language.
3. **Two Roles Only (NON-NEGOTIABLE)** — one org Admin + User (see Roles table). Structurally multi-Admin-ready, but no multi-Admin workflow in V1.
4. **Service Boundaries (NON-NEGOTIABLE)** — UI consumes typed mock services only; never imports fixtures/persistence directly. Promise-based services with loading/error/empty states are the API contract (`./000-shared/handoff-map.md`); a future API swap must not require a UI rewrite.
5. **Governed Question Source (NON-NEGOTIABLE)** — the Agent selects only from `item_bank`; never generates questions, uses out-of-bank items, includes blocked/quarantined/non-operational items, or sends without Admin approval.
6. **Immutable Metadata (NON-NEGOTIABLE)** — all source-item metadata is read-only; never fabricate absent fields (`weight`, `difficulty`).
7. **Controlled Adaptation** — rephrasing changes display wording only with method-family safeguards (Likert/contextual rephrase; forced-choice light terminology; cognitive verbatim; SJT approved-equivalence only) + a word diff; attribution stays linked to `item_id`.
8. **Question-Level Attribution (NON-NEGOTIABLE)** — responses stored against immutable `item_id`; no production scoring or live User scoring in the frontend.
9. **Safe Reporting** — Admin and User reports are separate projections; the User report never exposes raw responses, formulas, versions, flags, blocked values, Admin notes, or hire/reject language; Admin can preview the User-safe view.
10. **Human Decision Support (NON-NEGOTIABLE)** — no automatic hire/reject; Candidate Comparison is side-by-side only (no ranking/leaderboard/auto shortlist-reject-hire).
11. **Domain 6 Transparency** — Domain 6 visible in Admin V1 (CAI/DII + AFI/ECFI/SII/DDI/PDRI/ECSI + fit radar) with explicit confidence/provisional/downgraded/omitted states; blocked values never shown as data.
12. **Accessibility and Motion** — WCAG 2.1 AA basics; motion explains state, is skippable/non-blocking, and honors `prefers-reduced-motion`; no shell parallax.
13. **Responsive Runtime** — Admin desktop-first but responsive; User runtime mobile-first, supporting all five question types, pause/resume/auto-save/reload recovery, ≥44px targets.
14. **Traceability** — specs, route map, status models, data model, handoff map, traceability matrix, risk register, open questions stay current; `000-master-scope` decisions override outdated docs.
15. **Review Before Implementation (NON-NEGOTIABLE)** — constitution → specify → clarify → plan → tasks → analyze → explicit human approval before `/speckit.implement`.

## Recommended Frontend Structure (to be implemented)

Stack: **Vite + React 18 + TypeScript (strict) + React Router**; CSS-variable tokens (source of truth) styled with Tailwind CSS utilities (adopted per `specs/0091-tailwind-css-adoption`; Preflight disabled, tokens mapped into the Tailwind theme); Vitest + React Testing Library; ESLint + Prettier; GSAP for signature motion; hand-built SVG charts.

```text
frontend/
├── index.html                             # pre-paint theme script
├── package.json · vite.config.ts · tsconfig.json · .eslintrc · .prettierrc
├── public/
└── src/
    ├── main.tsx · App.tsx · router.tsx     # AdminShell (/admin/*), UserShell (/app/*), public routes
    ├── styles/ tokens.css · globals.css · theme.ts
    ├── components/
    │   ├── ui/        # Button, IconButton, Card, Modal, Drawer, Popover, Menu, Tabs, Field, TextArea,
    │   │              #   Select, Slider, SegmentedControl, Toggle, Checkbox, RadioGroup, StatusBadge,
    │   │              #   Chip, ConfidenceChip, TrustBadge, Avatar, ScoreBar, Ring, CountUp, Tooltip,
    │   │              #   EmptyState, Skeleton, DataTable, FilterBar, SearchInput, Stepper, Toast, Timeline
    │   ├── charts/    # Gauge, ContextRadar, FitRadar, DimensionBars, CoverageBars, ContextSignature
    │   ├── motion/    # PageFX, Reveal, CountUp, TransformSequence, useReducedMotion
    │   ├── layout/    # AdminShell, UserShell, Sidebar, Topbar, FocusFrame, ErrorBoundary
    │   └── nex/       # RobotCompanion + contextual hints
    ├── features/      # one folder per feature spec
    │   ├── auth/                 (specs 001/007)
    │   ├── dashboard/            (spec 002)
    │   ├── users/                (spec 002)
    │   ├── assessments/          (spec 002)
    │   ├── create-assessment/    (spec 003: steps/*, DiscoveryChat, RequirementsPanel)
    │   ├── blueprints/           (spec 004)
    │   ├── contexts/             (spec 004)
    │   ├── reports/              (specs 005/006)
    │   ├── comparison/           (spec 005)
    │   ├── history/ exports/ notifications/ settings/ profile/   (specs 002/005)
    │   ├── activity-log/         (spec 007)
    │   └── runtime/              (spec 006: Overview, Consent, Instructions, Runtime, QuestionCard ×5, Pause, Completion)
    ├── services/      # THE only data boundary (mock, Promise-based)
    │   ├── http.ts · persistence.ts
    │   ├── authService · participantService · consentService
    │   ├── assessmentDraftService · agentDiscoveryService
    │   ├── questionBankService · adaptationService
    │   ├── roleBlueprintService · contextProfileService
    │   ├── assessmentService · runtimeService
    │   ├── scoringService · domain6Service · reportService · comparisonService
    │   ├── notificationService · exportService · activityLogService · settingsService
    │   └── governance/  # eligibility, confidenceGate, useCaseGate, visibilityEngine, toUserSafe
    ├── models/        # from ./000-shared/data-model.md
    ├── mocks/         # fixtures (decoupled) + governed-bank.ts (code-split, full 543-item item_bank) + import-bank.ts (build-time)
    ├── hooks/         # useTheme, useAsync, useLocalStorage, useViewport, useToast
    └── lib/           # csv.ts, diffWords.ts, format.ts, ids.ts
tests/ unit/ · component/ · e2e/
```

**Structure rules**: feature folders map 1:1 to specs; `services/` is the sole data boundary (Principle 4); governance logic isolated in `services/governance` (unit-testable, later replaceable by API responses); the governed bank is code-split so it never blocks first paint; tokens/theme single-sourced.

## Quality Standards
TypeScript strict, no `any` in models/services; governance metadata immutable at the type level; unit tests for services + governance gates; component tests for runtime/wizard/report visibility; axe + reduced-motion checks on priority flows; fixtures conform to models and are never imported by components.

## Governance
This constitution supersedes other frontend practices for V1. Deviations from NON-NEGOTIABLE principles require written justification + approval. Amendments require documented change, rationale, and dependent-artifact impact, plus approval. Versioning: MAJOR (incompatible principle redefinition), MINOR (new principle/section), PATCH (clarification). Keep in sync with `../.specify/memory/constitution.md`.
