# Implementation Plan: Admin Core — Everyday Organization Workspace

**Branch**: `002-admin-core` | **Date**: 2026-06-15 | **Spec**: [`./spec.md`](./spec.md)

**Input**: Feature specification from `specs/002-admin-core/spec.md`. Inherits the master baseline `specs/000-master-scope/{spec.md,plan.md,research.md,data-model.md,contracts/}`, the delivered foundation `specs/001-foundation-design-system/*` (shells, services, components, persistence), shared canon `specs/000-shared/*`, and constitution `.specify/memory/constitution.md` (v2.0.0). Visual source of truth: `project/`.

## Summary

Build the single organization Admin's everyday, org-scoped workspace on top of the Spec 001 foundation: a **Users** roster (list/search/filter, Add User drawer with duplicate-email guard, Bulk Upload CSV with valid/invalid/duplicate validation, User Detail tabs), an **Assessments** monitoring surface (filterable list showing lifecycle and validity as separate signals; detail with remind/resend/extend/cancel actions updating timeline + notification + simulated email), a **Dashboard** overview (KPIs, sections, quick actions), and the supporting periphery — **Notifications** (read state + email indicator), **Exports** (framework + Users/Assessments now; five more registered for 004/005), **Settings** (one-Admin rule), and **My Profile**. All data flows through the typed mock services (the sole data boundary); the seam stays swappable for the future FastAPI + Supabase backend.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 18 (established by Spec 001)

**Primary Dependencies**: React Router 6 (shells/guards from 001); foundation UI library, charts, motion, hooks (`useAsync`, `useViewport`, `useToast`, `useFocusTrap`), and a new `lib/csv.ts` for client-side CSV. No new runtime dependencies expected.

**Storage**: Browser `localStorage` only (mock persistence from 001) for Admin-created mock records and preferences; no database.

**Testing**: Vitest + React Testing Library; component tests for Users list/Add/Bulk-upload, Assessments list/detail actions, and notification read-state; unit tests for CSV parse/validate classification and the new service methods.

**Target Platform**: Evergreen desktop + tablet + mobile browsers (single-page app); Admin is desktop-first but tablet/mobile usable.

**Project Type**: Web frontend — Admin shell routes under `/admin/*` (from 001).

**Performance Goals**: Inherited from 001 (route transitions < ~450ms; 60fps motion; reduced-motion honored). Users/Assessments lists stay responsive on a large roster via paginated/virtualized table state.

**Constraints**: No backend / real CSV ingestion / real email / real export jobs / production persistence. All async via mock services with simulated latency + error toggles. Org-scoped data only; **Admin-only data must never render in the User portal**. One Admin account per org (no multi-Admin workflow). Lifecycle and validity are always separate fields. WCAG 2.1 AA basics.

**Scale/Scope**: 12 Admin screens/overlays (Dashboard, Users list/detail, Add User drawer, Bulk Upload modal, Assessments list/detail, Notifications, Exports, Settings, My Profile). Consumes ~6 services (`participantService`, `assessmentService`, `notificationService`, `exportService`, `settingsService`, `authService`). ~9 fixture sets already seeded in 001 (participants ≥8, assignments, notifications, exports, etc.).

## Constitution Check

*GATE: must pass before Phase 0; re-checked after Phase 1.* Source: `.specify/memory/constitution.md` (v2.0.0).

| Principle | How Admin Core complies | Gate |
|---|---|---|
| I Frontend First | No backend; all flows on mocks + local persistence; reviewable per-story checkpoints | PASS |
| II Design Fidelity | Screens composed from ported tokens/components; missing states added in-language | PASS |
| III Two Roles Only | Admin-only workspace under `/admin/*`; org-scoped; one Admin; no data leak to User portal | PASS |
| IV Service Boundaries | UI consumes `participant/assessment/notification/export/settings/auth` services only; no fixture/persistence imports | PASS |
| V Governed Question Source | N/A — Admin Core does not select questions (Create Assessment is Spec 003) | PASS (n/a) |
| VI Immutable Metadata | N/A — no item-bank mutation here | PASS (n/a) |
| VII Controlled Adaptation | N/A | PASS (n/a) |
| VIII Question-Level Attribution | N/A | PASS (n/a) |
| IX Safe Reporting | Admin Core links to reports (Spec 005) but renders no User-facing report; consent shown read-only | PASS |
| X Human Decision Support | "Add to Comparison" links to Spec 005; no ranking/auto-decision introduced | PASS |
| XI Domain 6 Transparency | N/A — report internals owned by Spec 005 | PASS (n/a) |
| XII Accessibility & Motion | Keyboard-operable filters/menus; focus-trapped drawer/modal; aria-live toasts; reduced-motion-safe | PASS |
| XIII Responsive Runtime | Admin desktop-first, tablet/mobile usable (off-canvas nav from 001; tables scroll in-card) | PASS |
| XIV Traceability | Spec/plan kept consistent with `000-shared/*`; lifecycle/validity separation honored | PASS |
| XV Review Before Implementation | Stop for approval before `/speckit-implement` | PASS |

**Result**: No violations. Complexity Tracking empty.

## Project Structure

### Documentation (this feature)

```text
specs/002-admin-core/
├── plan.md              # This file
├── research.md          # Phase 0 — admin-core decisions (CSV, exports, list scaling)
├── data-model.md        # Phase 1 — entities/views the Admin Core screens use
├── contracts/           # Phase 1 — admin-core contracts
│   ├── routes-screens.md     # screens, routes, overlays, states
│   └── services.md           # service methods Admin Core requires (deltas over 001 stubs)
├── quickstart.md        # Phase 1 — run + validation guide
└── checklists/
    └── requirements.md  # spec quality checklist (from /speckit-specify, /speckit-clarify)
```

### Source Code (repository root — frontend app)

Admin Core adds feature folders + completes the service methods the screens need (typed stubs exist from 001).

```text
frontend/src/
├── features/
│   ├── dashboard/        # AdminDashboard (replaces the 001 sample dashboard)
│   ├── users/            # UsersList, UserDetail, AddUserDrawer, BulkUploadModal
│   ├── assessments/      # AssessmentsList, AssessmentDetail (+ action modals)
│   ├── notifications/    # NotificationsInbox
│   ├── exports/          # ExportsCenter (framework + Users/Assessments)
│   ├── settings/         # OrgSettings (one-Admin)
│   └── profile/          # MyProfile
├── services/
│   ├── participant/participantService.ts   # add() + bulkUpload() added to existing list/get
│   ├── assessment/assessmentService.ts     # detail actions: remind/resend/extend/cancel/timeline
│   ├── notification/notificationService.ts # markRead/markAllRead + email indicator
│   ├── export/exportService.ts             # framework + users/assessments CSV; registry for 5 more
│   └── settings/settingsService.ts         # get/update org + profile (one-Admin)
├── lib/csv.ts            # client-side CSV generate/parse (new)
└── components/ui/        # reuse DataTable, FilterBar, SearchInput, Drawer, Modal, Stepper, Tabs, Timeline, Toast
tests/
├── unit/        # csv parse/validate classification, service add/bulkUpload, action state
└── component/   # users list/add/bulk-upload, assessments list/detail actions, notifications read
```

**Structure Decision**: One feature folder per Admin area under `features/`, mapped to `../000-shared/route-map.md`. Admin Core **completes the service methods** whose typed stubs already exist in `frontend/src/services/index.ts` (from Spec 001) rather than inventing new boundaries — preserving the single data boundary and the future-backend seam. Reuses the foundation component library; adds only `lib/csv.ts`.

## Complexity Tracking

No constitution violations require justification. (If list virtualization needs a dedicated library beyond the foundation's table state, record it here against the simpler windowing alternative.)
