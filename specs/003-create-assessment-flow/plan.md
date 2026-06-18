# Implementation Plan: Signature Create Assessment Flow

**Branch**: `003-create-assessment-flow` | **Date**: 2026-06-15 | **Spec**: [`./spec.md`](./spec.md)

**Input**: Feature specification from `specs/003-create-assessment-flow/spec.md`. Inherits the delivered foundation `specs/001-foundation-design-system/*` (wizard primitives, motion, services, persistence), Spec 002 (entry points + assessment artifacts), and will consume Spec 004 pickers (built as minimal stubs here if 004 is not yet implemented). Shared canon `specs/000-shared/*`; constitution `.specify/memory/constitution.md` (v2.0.0, principles V–IX). Visual source of truth: `project/`.

## Summary

Build the platform's signature differentiator: a full-bleed, AI-Agent-guided **12-step wizard** at `/admin/assessments/new` where the Admin co-designs **one governed, tailored assessment for one user**. A deterministic scripted Agent runs a fixed canonical discovery (parameterized by use case) that fills a live requirements profile; the Agent auto-proposes an eligible question set drawn **only** from the governed `item_bank` (blocked/quarantine/pilot/research excluded), with full provenance and locked-scoring trust badges; controlled rephrasing changes display text only (word diff; method-family safeguards; SJT/cognitive verbatim in V1); a live coverage map warns on under-coverage; an explicit approval gate keeps Send disabled until approved; and Send creates an assignment + invitation + timeline + notification + simulated email. Drafts save and resume. No live AI, no client scoring, no new questions, no send without approval. The seam stays swappable for the future backend.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 18 (established by Spec 001)

**Primary Dependencies**: React Router 6 (full-bleed route from 001); foundation UI library (Stepper, Modal, Drawer, Chip, Tabs, DataTable, charts), motion primitives (reduced-motion-safe transitions), hooks (`useAsync`, `useReducedMotion`, `useFocusTrap`, persistence); `lib/diffWords.ts` for the rephrase word diff (new). No new runtime deps; no AI SDK.

**Storage**: Browser `localStorage` (versioned draft via `persistence`) for the in-progress 12-step draft; no database.

**Testing**: Vitest + React Testing Library; unit tests for `agentDiscoveryService` (scripted determinism), `questionBankService` eligibility (reuse), `adaptationService` (text-only diff + method safeguards), coverage logic, and `assessmentDraftService` (approval gate, send artifacts); component tests for the wizard happy path, selection provenance, rephrase diff, and draft resume.

**Target Platform**: Evergreen desktop + tablet + mobile (chat stacks above requirements panel on mobile).

**Project Type**: Web frontend — full-bleed guarded route under `/admin/assessments/new` (from 001 `FullBleedShell`).

**Performance Goals**: Inherited (60fps motion; route < ~450ms; reduced-motion honored). The governed bank loads lazily at the selection step (excluded from initial chunk); chat turns simulate latency without blocking input.

**Constraints**: No backend / live AI / real eligibility / real scoring / real email. **NON-NEGOTIABLE governance**: governed source only; immutable source metadata (no `weight`/`difficulty`); controlled adaptation (text-only + diff; method safeguards; SJT/cognitive verbatim in V1); explicit approval before send; question-level attribution with no client scoring and no live User score. Single-user per flow. WCAG 2.1 AA basics; chat keyboard-navigable; diff screen-reader-readable.

**Scale/Scope**: 12 steps + success state on one full-bleed route. Consumes ~7 services (`assessmentDraftService`, `agentDiscoveryService`, `questionBankService`, `adaptationService`, `roleBlueprintService`, `contextProfileService`, `assessmentService`). 5 method families; full governed bank (lazy). ~6 user stories.

## Constitution Check

*GATE: must pass before Phase 0; re-checked after Phase 1.* This is the most governance-dense feature; the gate is substantive.

| Principle | How the flow complies | Gate |
|---|---|---|
| I Frontend First | No backend; scripted Agent + mocks + local draft; reviewable per-story checkpoints | PASS |
| II Design Fidelity | Full-bleed wizard composed from ported tokens/components/motion; missing states in-language | PASS |
| III Two Roles Only | Admin-only `/admin/*` full-bleed route; org-scoped; single user per flow | PASS |
| IV Service Boundaries | UI consumes the 7 typed services only; no fixture/persistence imports | PASS |
| V Governed Question Source | `questionBankService` selects from `item_bank` only; eligibility excludes blocked/quarantine/pilot/research; Agent never generates questions | PASS |
| VI Immutable Metadata | `SelectedQuestion.item` is `Readonly<ItemBankItem>`; cards never show fabricated `weight`/`difficulty` | PASS |
| VII Controlled Adaptation | `adaptationService` accepts `{itemId, adaptedText}` only + word diff; method safeguards; SJT/cognitive verbatim in V1 | PASS |
| VIII Question-Level Attribution | each `SelectedQuestion` keeps source `item_id`; no client scoring; no live User score in the flow | PASS |
| IX Safe Reporting | rephrase step offers a User-view preview without internal metadata | PASS |
| X Human Decision Support | Admin-approval gate; no auto-decision; flow only proposes for approval | PASS |
| XI Domain 6 Transparency | N/A — no report rendering here (Domain 6 owned by 005) | PASS (n/a) |
| XII Accessibility & Motion | chat keyboard-navigable; diff readable; transitions skippable + reduced-motion-safe; no input-blocking | PASS |
| XIII Responsive Runtime | chat stacks above requirements on mobile; touch-friendly steppers | PASS |
| XIV Traceability | spec/plan consistent with `000-shared/*`; eligibility/adaptation rules sourced from status-models | PASS |
| XV Review Before Implementation | stop for approval before `/speckit-implement` | PASS |

**Result**: No violations. Complexity Tracking empty. (If the multi-step wizard state outgrows React Context + the draft service, record a store decision there.)

## Project Structure

### Documentation (this feature)

```text
specs/003-create-assessment-flow/
├── plan.md              # This file
├── research.md          # Phase 0 — agent script, proposal sizing, diff, draft, governance reuse
├── data-model.md        # Phase 1 — draft/requirements/selected-question/adaptation entities + step state
├── contracts/           # Phase 1
│   ├── wizard-flow.md        # 12 steps, gating, states, governance display
│   └── services.md           # service methods this flow requires (deltas over 001/002 stubs)
├── quickstart.md        # Phase 1 — run + validation guide
└── checklists/
    └── requirements.md  # spec quality checklist (from /speckit-specify, /speckit-clarify)
```

### Source Code (repository root — frontend app)

```text
frontend/src/
├── features/create-assessment/
│   ├── CreateAssessmentWizard.tsx     # full-bleed shell: step state, progress, draft, nav
│   ├── steps/                         # Step1Select … Step12Review + SuccessState
│   ├── DiscoveryChat.tsx              # scripted chat + live requirements panel
│   ├── QuestionCard.tsx               # provenance-rich card + trust badges
│   ├── RephrasePanel.tsx              # original/adapted/diff + method safeguard messaging
│   └── CoverageMap.tsx                # domain/dimension/requirement/method + warnings
├── services/
│   ├── assessmentDraft/assessmentDraftService.ts   # create/save/get/approve/send (complete stub)
│   ├── agentDiscovery/agentDiscoveryService.ts     # scripted canonical script + requirements build
│   ├── adaptation/adaptationService.ts             # {itemId, adaptedText} → diff; method safeguards
│   └── (reuse) questionBank, roleBlueprint, contextProfile, assessment
├── lib/diffWords.ts        # word-level diff for rephrase (new)
└── components/             # reuse Stepper, Modal, Drawer, Chip, Tabs, charts, motion
tests/
├── unit/        # agentDiscovery, adaptation (+safeguards), coverage, draft approval/send
└── component/   # wizard happy path, selection provenance, rephrase diff, draft resume
```

**Structure Decision**: One `features/create-assessment/` folder with a wizard shell + per-step components, plus completion of the three typed service stubs (`assessmentDraftService`, `agentDiscoveryService`, `adaptationService`) created in Spec 001 — preserving the single data boundary. Reuses `questionBankService`/governance (eligibility), `assessmentService` (send artifacts, from 002), and the foundation component/motion library. Adds only `lib/diffWords.ts`. Spec 004 pickers are consumed; if not yet implemented, minimal select-from-fixtures pickers are used with a create-entry that routes to the 004 stub.

## Complexity Tracking

No constitution violations require justification. (Wizard state = React Context + the draft service; revisit only if a store is later needed for the chat/selection interplay.)
