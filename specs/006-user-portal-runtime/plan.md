# Implementation Plan: User Portal & Assessment Runtime

**Branch**: `006-user-portal-runtime` | **Date**: 2026-06-16 | **Spec**: [`./spec.md`](./spec.md)

**Input**: Feature specification from `specs/006-user-portal-runtime/spec.md`. Inherits the delivered foundation `specs/001-foundation-design-system/*` (UserShell + FullBleedShell + RequireRole; `authService` activate/sign-in; `runtimeService`/`consentService` stubs; versioned local persistence `nexus_runtime_v1`; `useAsync`/`useViewport`; UI kit; charts), Spec 005 (`reportService.getUserSafe` projection + report components), Spec 003 (assessments produced for the User to take), Spec 002 (Admin User-Detail **Consent** tab that this feature populates; `exportService` PDF/export-history; `assessmentService` history). Shared canon `specs/000-shared/*`; constitution `.specify/memory/constitution.md` (v2.0.0, principles **III/IV/VIII/IX/XII/XIII**). Visual source of truth: `project/`.

## Summary

Build the **entire User (candidate) portal under `/app/*`** plus the **mobile-first assessment runtime** under `/app/assessments/:assessmentId/run`, all on mocks. The spanning MVP is the take-an-assessment journey (overview → consent → instructions → runtime → pause/resume/reload → submit → completion); the runtime renders all five method families from a **fixed pre-resolved item set** returned by `runtimeService` (selected/adapted upstream by Spec 003, rendered verbatim), stores each response **keyed by the immutable source Question ID**, **auto-saves to `localStorage`** (`nexus_runtime_v1`, versioned), supports **free back-navigation** (Next still gated forward), and **never shows a live score** (constitution VIII). Starting is gated on the required per-use-case **consent**; optional consents appear only when applicable; from **Profile & Privacy** the User can revoke eligible consents (optional always; required until report release, then locked) — revocation writes to a **shared consent store** the Admin User-Detail Consent tab reads (Spec 002). Reports reuse Spec 005's **user-safe projection** only. The periphery (Dashboard, My Assessments, History, Notifications, Help, Profile & Privacy with a **pending** data-deletion request queued for the Spec 007 Admin privacy inbox) is **own-data only**, and **no Admin-only/internal field leaks** into any User screen (constitution III/IX). The frontend performs **no production scoring**; section timers are **display-only**.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 18 (established by Spec 001).

**Primary Dependencies**: React Router 6; foundation shells (`UserShell`, `FullBleedShell`, `RequireRole`); UI kit (Button, Card, Tabs, StatusBadge, ConfidenceChip, EmptyState, ProgressBar/Stepper, FormField, Toast); hooks (`useAsync`, `useViewport`); user-safe report components + governance helpers (Spec 005). No new runtime dependencies.

**Storage**: Browser `localStorage` (mock) only. Runtime progress uses the existing versioned envelope at `StorageKeys.runtime` (`nexus_runtime_v1`, `SchemaVersions.runtime = 1`). Consent state + data-deletion requests persist via a new versioned store shared with the Admin Consent tab. Question/assessment/report data are committed fixtures behind services.

**Testing**: Vitest + React Testing Library (jsdom). Unit: `runtimeService` load/save/resume + answer-keying by source Question ID + no-score invariant; `consentService` gating, applicable-consent filtering, revocation eligibility + propagation; deletion-request pending creation; user-safe leak guard. Component: the five question-type renderers (answer-gating, keyboard/touch, back-nav), the runtime container (pause/resume/reload restore, save indicator, no live score), consent screen (Accept-and-Continue gating), user-safe report view, dashboard hero, Profile & Privacy.

**Target Platform**: Evergreen mobile-first (runtime), responsive up to desktop. Touch targets ≥44px; sticky progress; forced-choice cards stack; SJT readable; safe-area aware.

**Project Type**: Web frontend — User routes under `/app/*` (placeholders reserved by Spec 001 router) and the immersive runtime under `/app/assessments/:assessmentId/run` (FullBleedShell, reserved as a Placeholder).

**Performance Goals**: Inherited (route < ~450ms; 60fps; reduced-motion honored). Auto-save is debounced and non-blocking; reload restoration is instant from `localStorage`.

**Constraints**: No backend / real auth / production scoring / live score / real PDF. **NON-NEGOTIABLE**: Question-Level Attribution (responses keyed by source Question ID; no client/live score — VIII), Safe Reporting + Two Roles Only (zero Admin-only/internal leakage; user-safe projection only — IX/III), Responsive Runtime (mobile-first; five types; pause/resume/auto-save/reload — XIII), Accessibility & Motion (keyboard-operable options, visible focus, labelled controls, reduced-motion-safe; WCAG 2.1 AA basics on the priority flow — XII). Section timers display-only (never block/auto-advance/auto-submit). Revocation must propagate to the Admin Consent tab via the shared store.

**Scale/Scope**: ~13 User surfaces (Dashboard, My Assessments, Overview, Consent, Instructions, Runtime [+5 type renderers], Completion, My Reports, User Report view, History, Notifications, Help, Profile & Privacy). Completes the `runtimeService` and `consentService` stubs from Spec 001; consumes `reportService.getUserSafe`, `notificationService`, `exportService`, `assessmentService`. ~1–2 hand-authored assessment item sets covering all five method families + matching consent fixtures.

## Constitution Check

*GATE: must pass before Phase 0; re-checked after Phase 1.* This is a privacy/runtime-critical User-side feature.

| Principle | How this feature complies | Gate |
|---|---|---|
| I Frontend First | No backend; fixtures + mock services + local persistence; reviewable per-story checkpoints | PASS |
| II Design Fidelity | Portal + runtime composed from ported shells/UI/charts; missing states (empty/loading/error/expired) in design language | PASS |
| III Two Roles Only | All screens under `/app/*`, `user` role-guarded, **own-data only**; no Admin surfaces | PASS |
| IV Service Boundaries | UI consumes `runtimeService`/`consentService`/`reportService`/`notificationService`/`exportService`/`assessmentService`; no fixture/persistence imports in components | PASS |
| V Governed Question Source | Runtime renders a **pre-resolved** item set (selection happened upstream in Spec 003); no client selection from the bank | PASS (n/a here) |
| VI Immutable Metadata | Items render-only (`Readonly<ItemBankItem>`); no fabricated weight/difficulty; no metadata shown to User | PASS |
| VII Controlled Adaptation | Adapted wording (Spec 003) shown verbatim; User never sees diffs/internal metadata | PASS |
| VIII Question-Level Attribution | Responses stored keyed by source Question ID; **no client scoring, no live score** at any point | PASS |
| IX Safe Reporting | User report built **only** from `reportService.getUserSafe`; no restricted/internal/blocked field on any screen; supportive language | PASS |
| X Human Decision Support | N/A (no comparison/decision surfaces in the User portal) | PASS (n/a) |
| XI Domain 6 Transparency | User sees only the high-level Domain 6 summary the user-safe projection permits; no indices/radar/internals | PASS |
| XII Accessibility & Motion | Keyboard-operable question controls, visible focus, labelled inputs, sticky progress; reduced-motion-safe; subtle (no confetti) completion | PASS |
| XIII Responsive Runtime | Mobile-first runtime; all five types; pause/resume/auto-save/reload; ≥44px targets | PASS |
| XIV Traceability | Plan consistent with `000-shared/*` canon (RuntimeState §10, ConsentRecord/DataDeletionRequest §3); FR/SC mapped | PASS |
| XV Review Before Implementation | Stop for approval before `/speckit-implement` | PASS |

**Result**: No violations. Complexity Tracking empty.

## Project Structure

### Documentation (this feature)

```text
specs/006-user-portal-runtime/
├── plan.md              # This file
├── research.md          # Phase 0 — runtime persistence, question-type contracts, consent store, item source, timers
├── data-model.md        # Phase 1 — RuntimeState/QuestionResponse/ConsentRecord/DataDeletionRequest + render types
├── contracts/           # Phase 1
│   ├── screens-routes.md     # 13 User surfaces, routes, states, governance/a11y rules
│   └── services.md           # runtimeService + consentService (deltas over 001 stubs) + consumed services
├── quickstart.md        # Phase 1 — run + validation guide
└── checklists/
    └── requirements.md  # spec quality checklist (from /speckit-specify, /speckit-clarify)
```

### Source Code (repository root — frontend app)

```text
frontend/src/
├── features/
│   ├── runtime/          # AssessmentRuntime container + question-type renderers (Likert, Frequency, ForcedChoice, MCQ, SJT) + SaveIndicator + ProgressRail
│   ├── assessments/user/ # MyAssessments, AssessmentOverview, Consent, Instructions, Completion (User-side)
│   ├── reports/user/     # MyReports, UserReport (reuse Spec 005 user-safe components)
│   ├── history/user/     # UserAssessmentHistory (own-data)
│   ├── pages/            # UserDashboard (exists) extended with active-assessment hero
│   ├── notifications/    # UserNotifications (own-data view) — reuse notificationService
│   ├── help/             # HelpAndSupport
│   └── profile/          # UserProfilePrivacy (info, language, password sim, consent history, revoke, deletion request)
├── services/
│   ├── runtime/runtimeService.ts     # load(assessmentId) → item set + RuntimeState; save/answer/pause/resume/submit (local)
│   ├── consent/consentService.ts     # forAssessment / applicable / accept / decline / revoke / history / requestDeletion
│   └── consentStore.ts               # shared versioned store read by Admin User-Detail Consent tab (Spec 002)
├── models/               # add RuntimeState, QuestionResponse, ConsentRecord, DataDeletionRequest, RuntimeItem (shared §3/§10) — all NEW/optional, no breaking changes
├── mocks/runtime.ts      # 1–2 hand-authored item sets (all five method families) + consent fixtures
└── router.tsx            # replace `/app/*` + runtime Placeholders with lazy feature screens
tests/
├── unit/        # runtime persistence/keying/no-score, consent gating/applicable/revoke+propagate, deletion pending, user-safe leak guard
└── component/   # five renderers, runtime container, consent screen, user report, dashboard hero, profile/privacy
```

**Structure Decision**: One feature folder per surface group (`features/runtime/`, `features/assessments/user/`, `features/reports/user/`, etc.) so each user story is an independently testable increment. Completes the `runtimeService` and `consentService` stubs from Spec 001 (the de-facto API contract a future FastAPI/Supabase backend must satisfy). A small **`consentStore.ts`** (mirroring the `blueprintContextStore.ts` pattern from Spec 004) is the single shared persistence the User portal writes and the Admin Consent tab reads — avoiding a circular service dependency while keeping revocation consistent across roles. The runtime reuses `FullBleedShell` (immersive) and the versioned `nexus_runtime_v1` envelope already wired in persistence. The User report reuses Spec 005's `reportService.getUserSafe` + user-safe components verbatim (no second projection path).

## Complexity Tracking

No constitution violations require justification. (If question-type rendering grows branchy, a small `renderers` registry keyed by `MethodFamily` centralizes it; recorded here only if it replaces a simpler inline switch.)
