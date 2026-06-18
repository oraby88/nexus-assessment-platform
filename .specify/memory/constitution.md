<!--
SYNC IMPACT REPORT (2.0.0 → 2.1.0, MINOR)
Date: 2026-06-16
Bump rationale: Materially changes an engineering standard (the mandated styling approach) without
  altering any core principle (I–XV unchanged). Per semver policy this is MINOR, not MAJOR.
Modified: Quality & Engineering Standards → "Stack" line — "CSS Modules" replaced by "Tailwind CSS"
  (CSS-variable design tokens remain the source of truth). Tailwind declared an approved dependency.
Rationale: Adopted per specs/0091-tailwind-css-adoption (FR-009). CSS Modules were mandated in 2.0.0
  but never actually adopted (styling was inline CSS-variable styles); Tailwind standardizes a
  token-driven utility vocabulary, consumes existing tokens via theme mapping, and ships purged/JIT
  CSS within the ≤260KB bundle budget.
Impact analysis / templates:
  ✅ .specify/templates/{plan,spec,tasks}-template.md — generic Constitution Check; no edit needed.
  ✅ specs/frontend-constitution.md — mirror "Stack" line updated to match.
  ✅ CLAUDE.md — agent stack line updated (CSS Modules → Tailwind).
  ⚠ frontend/src/components/ui/index.tsx — a code comment references CSS Modules; update during
     implementation (specs/0091 tasks T012/T013), not as part of this governance edit.
  ℹ Prior feature specs (000-master-scope, 001-foundation-design-system) retain "CSS Modules" as
     historical record of what was planned at the time; not retroactively edited.
No core principle added/removed/renumbered. Ratification date unchanged.
-->

<!--
SYNC IMPACT REPORT
Version change: 1.0.0 → 2.0.0 (MAJOR)
Bump rationale: The principle set is redefined and renumbered (13 → 15 principles).
  Several prior principles were merged/renamed, which is backward-incompatible for any
  artifact referencing the previous principle numbering. Adopted from specs/CONSTITUTION_DRAFT.md.

Modified / mapped principles (old 1.0.0 → new 2.0.0):
  I Frontend-First Delivery            → I Frontend First
  II Design Fidelity                   → II Design Fidelity
  VIII Role Boundaries & Data Privacy  → III Two Roles Only (+ data scope)
  III UI/Data-Access Separation        → IV Service Boundaries
  VI Governed AI Behavior              → V Governed Question Source (+ split)
  VII Traceability & Scoring-Metadata  → VI Immutable Metadata
  VI/VII (adaptation portion)          → VII Controlled Adaptation
  (new, was implicit)                  → VIII Question-Level Attribution
  IX User-safe/Admin Reporting         → IX Safe Reporting
  X No Automatic Hiring Decisions      → X Human Decision Support
  IX (Domain 6 portion)                → XI Domain 6 Transparency
  XI Accessibility + XII Animation     → XII Accessibility and Motion
  XI (responsive portion)              → XIII Responsive Runtime
  (new, was implicit)                  → XIV Traceability
  Development Workflow & Review Gates   → XV Review Before Implementation (+ retained gates section)
  V Future Backend Integration Readiness → folded into IV Service Boundaries + Governance

Added sections / principles: VIII Question-Level Attribution, XIV Traceability,
  XV Review Before Implementation (now explicit principles).
Removed sections: none removed wholesale (V "Future Backend Readiness" folded into IV + Governance).

Templates requiring updates:
  ✅ .specify/templates/plan-template.md   — generic "Constitution Check" gate; compatible, no edit needed
  ✅ .specify/templates/spec-template.md   — generic; compatible, no edit needed
  ✅ .specify/templates/tasks-template.md  — generic; compatible, no edit needed
  ✅ .specify/templates/checklist-template.md / constitution-template.md — unchanged source templates
  ✅ specs/ feature specs (001–008) + 000-shared/* — already embody these principles
  ⚠ specs/README.md, specs/000-master-scope/spec.md — user-curated; verify they cite this v2.0.0 (no auto-edit)

Follow-up TODOs: none (ratification date known: 2026-06-13).
-->

# Nexus Assessment Platform Constitution

**Phase scope of this version**: Frontend Prototype (V1). The backend phase (FastAPI + Supabase + AI/scoring/reporting/notification/PDF services) is explicitly out of scope and is governed here only by the "future-readiness" rules embedded in the principles below. The authoritative scope baseline is `specs/000-master-scope/spec.md`; shared models, statuses, routes, and the backend handoff live in `specs/000-shared/*`.

## Core Principles

### I. Frontend First (NON-NEGOTIABLE)

The first implementation phase MUST be a complete React + TypeScript frontend prototype only, backed entirely by mock data, mock services, and local persistence. FastAPI, Supabase, real authentication, real AI calls, real scoring, real report/PDF/email generation, and production audit/policy enforcement are future phases and MUST NOT be implemented now. Every feature MUST be demonstrable end-to-end against mocks, delivered in incremental, reviewable checkpoints rather than a single big-bang merge.

**Rationale**: The bundle is a design prototype; V1 value is a credible, clickable product that validates flows before backend investment.

### II. Design Fidelity

The Claude Design output in `project/` is the visual source of truth. Re-implementations MUST match its visual output (tokens, typography, layout, dark/light theming, signature motion) rather than copying prototype internals. Any state missing from the design (error, empty, loading, responsive, 404) MUST be added in the same design language. Visual or behavioral deviations require explicit justification at review.

### III. Two Roles Only (NON-NEGOTIABLE)

V1 has exactly two product roles: a single organization **Admin** and the **User**. There is one Admin account per organization in V1. The Admin sees only their organization's data; the User sees only their own assessments, reports, notifications, consent information, and profile. The architecture MAY remain structurally ready for future multi-Admin support, but no multi-Admin workflow MUST be built in V1.

### IV. Service Boundaries (NON-NEGOTIABLE)

UI components MUST consume typed mock services only; they MUST NOT import fixtures or read persistence directly. Services return Promise-based, typed models with simulated latency and explicit loading/error/empty/success states. Service signatures are the de-facto API contract: a future API swap MUST NOT require a UI rewrite. The mapping of each mock service to its future FastAPI responsibility and Supabase data lives in `specs/000-shared/handoff-map.md` and MUST stay current.

### V. Governed Question Source (NON-NEGOTIABLE)

The AI Agent MAY only select questions from the governed workbook source worksheet `item_bank` (business copy may call this the "Questions Sheet"). The Agent MUST NOT generate new questions, use questions outside the governed bank, or include blocked / quarantined / non-operational items in an operational assessment, and it MUST NOT send an assessment without explicit Admin approval. Eligibility rules are defined in `specs/000-shared/status-models.md`.

### VI. Immutable Metadata (NON-NEGOTIABLE)

Source-item metadata is read-only everywhere in the frontend: `item_id`, domain, dimension, facet, method family, item format, response scale, keyed answer, options, loading type, reverse-scored flag, bank state, use status, validation track, job-level overlay, and review status. No service or component MUST mutate any of these. Fields absent from the source workbook (e.g., `weight`, `difficulty`) MUST NOT be fabricated or displayed as data.

### VII. Controlled Adaptation

Question rephrasing MUST change display wording only and MUST follow method-family safeguards: Likert/contextual allow controlled role-context rephrase preserving meaning; forced-choice allows light terminology only (trade-off and option polarity preserved); cognitive MCQ is verbatim by default; SJT is verbatim unless an approved-equivalence template applies (keyed answer and option meaning preserved). The adaptation service MUST accept display text only, surface a word-level diff, and keep all scoring attribution linked to the source `item_id`.

### VIII. Question-Level Attribution (NON-NEGOTIABLE)

Every User response MUST be stored against the immutable source `item_id` (with assessment ID, response, and timestamp). The frontend MUST NOT perform production scoring and MUST NOT display live User scoring during the assessment. Future backend scoring receives response + source metadata and computes governed results.

### IX. Safe Reporting

Admin and User reports are separate projections of the same data. The Admin report MAY include full governed detail (measured dimensions, confidence/limitation states, Domain 6, omitted sections, version footer, no-automatic-decision disclaimer). The User report MUST use supportive language and MUST NOT expose raw responses, formulas, scoring versions, internal governance/psychometric flags, blocked values, Admin notes, source-item metadata, or automatic hiring recommendations. The Admin MUST be able to preview the exact User-safe view before release.

### X. Human Decision Support (NON-NEGOTIABLE)

Nothing in the product MUST produce an automatic hire/reject decision. Candidate Comparison is side-by-side, human-judgment evidence review only: no leaderboard or ranking language, no automatic ordering by fit, no automatic shortlist/reject/hire, no recommendation labels. A persistent disclaimer states the assessment is one input among many requiring human review.

### XI. Domain 6 Transparency

Domain 6 (contextual alignment and decision influence) is visible in the Admin experience in V1 and MAY display CAI, DII, AFI, ECFI, SII, DDI, PDRI, ECSI, a candidate-vs-context fit radar, contextual strengths/cautions, and confidence treatment. Where an output depends on restricted or insufficient inputs (e.g., D3/D5), it MUST be shown as provisional, downgraded, or omitted with an explanation. Blocked values (e.g., Derailment Risk) MUST NOT be shown as report data.

### XII. Accessibility and Motion

All flows MUST be keyboard operable with visible focus, sufficient contrast in both themes, labelled controls, and semantic landmarks (target WCAG 2.1 AA). Motion MUST explain state changes, never merely decorate: short, purposeful timings; signature animations skippable and non-blocking; all motion MUST honor `prefers-reduced-motion` by degrading to instant/opacity. No parallax in the application shell.

### XIII. Responsive Runtime

The Admin experience is desktop-first but fully usable on tablet/mobile. The User assessment runtime MUST be mobile-first and MUST support all five question/method types, pause, resume, auto-save, and reload recovery, with readable questions and touch targets ≥ 44px.

### XIV. Traceability

The planning artifacts MUST stay current and mutually consistent: feature specs (`specs/001-008`), route map, status models, data model, handoff map, traceability matrix, risk register, open questions, and testing notes (`specs/000-shared/*`). Confirmed business decisions in `specs/000-master-scope/spec.md` are the authoritative scope source and override outdated companion documentation.

### XV. Review Before Implementation (NON-NEGOTIABLE)

Planning proceeds through Spec Kit stages — constitution → specify → clarify → plan → tasks → analyze — and then MUST stop for explicit human approval before `/speckit.implement`. Implementation MUST NOT begin until the approver confirms with an explicit go-ahead.

## Quality & Engineering Standards

- **Stack**: Vite + React 18 + TypeScript (strict) + React Router; CSS-variable design tokens (the source of truth) styled with **Tailwind CSS** utilities; Vitest + React Testing Library; ESLint + Prettier; GSAP (or the existing motion library) for signature motion; hand-built SVG / lightweight charts. Tailwind is an approved dependency (adopted per `specs/0091-tailwind-css-adoption`, FR-009): it maps the existing design tokens into its theme (no hard-coded values, so dark theme via `[data-theme="dark"]` is preserved), ships purged/JIT CSS within the bundle budget, and supersedes the previously-mandated (never-adopted) CSS Modules approach. Tailwind Preflight is disabled so the global stylesheet remains the authoritative reset. No other heavy dependency without justification. No backend stack in V1.
- **Type safety**: TypeScript `strict`. Models, status enums, and governance fields are typed from the source specs and the `item_bank` schema. No `any` in models or service signatures. Governance metadata is immutable at the type level.
- **Testing**: Unit tests for mock services and governance logic (eligibility, confidence/use-case/audience gating, adaptation immutability, user-safe projection). Component tests for the assessment runtime (all five question types), the Create Assessment wizard, and report visibility. Accessibility (axe) and reduced-motion behavior verified on priority flows. Tests ship in the same checkpoint as the code.
- **Mock-data integrity**: Fixtures live in a dedicated layer decoupled from components and conform to the typed models. The governed bank preserves real `item_id`s and metadata from `item_bank` and is code-split / lazy-loaded so it never blocks first paint.
- **Documentation**: Each phase updates the relevant `specs/*` artifacts and short component/usage notes; the Spec Kit artifacts are living documents kept in sync with the code.

## Development Workflow & Review Gates

Five review gates govern progress to implementation:
1. **Business Specification Review** — journeys, routes, pages, actions, statuses, permissions, AI behavior, question-bank rules, report boundaries, Domain 6 visibility, comparison behavior.
2. **Design Coverage Review** — every required page has a design; missing/empty/loading/error/responsive states identified; Admin vs User visual boundaries clear.
3. **Frontend Plan Review** — component/service/state/mock-data strategy, routing, accessibility, testing, backend handoff notes, no over-engineering.
4. **Task Review** — ordered, dependency-correct, parallelism identified, per-phase acceptance checkpoints, backend tasks excluded.
5. **Human Approval** — explicit go-ahead before implementation (Principle XV).

Each implementation phase ends at an acceptance checkpoint with its test requirements met before the next phase begins.

## Governance

This constitution supersedes other practices for the duration of the V1 frontend phase. All reviews MUST verify compliance with the principles above; any deviation — especially to a principle marked NON-NEGOTIABLE — MUST be justified in writing, recorded in the Clarification Register / Open Questions or Complexity Tracking, and approved. Complexity MUST be justified against the simpler alternative it replaces.

Amendments require documented change, rationale, and impact analysis on dependent artifacts (specs, templates, shared docs), plus approval before adoption. Versioning follows semantic rules: **MAJOR** for backward-incompatible governance/principle removals or redefinitions, **MINOR** for a new principle/section or materially expanded guidance, **PATCH** for clarifications and non-semantic refinements. Use the Spec Kit artifacts under `specs/` for runtime planning guidance and `CLAUDE.md` for agent operating instructions.

**Version**: 2.1.0 | **Ratified**: 2026-06-13 | **Last Amended**: 2026-06-16
