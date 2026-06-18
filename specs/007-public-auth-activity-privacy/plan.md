# Implementation Plan: Public/Auth Recovery, Activity Log & Privacy Inbox

**Branch**: `007-public-auth-activity-privacy` | **Date**: 2026-06-16 | **Spec**: [`./spec.md`](./spec.md)

**Input**: Feature specification from `specs/007-public-auth-activity-privacy/spec.md`. Inherits Spec 001 (`PublicShell`, `authService` incl. `requestReset`, `AuthScaffold`/auth screens, UI kit, router placeholders for `/forgot-password`, `/reset-password`, `/admin/activity-log`, `NotFound`), Spec 002 (`activityLogService` + `activityEvents` fixtures; Admin shell + `NAV_ADMIN`), and Spec 006 (`consentService` + shared `consentStore` holding `DataDeletionRequest`s; User Profile & Privacy view). Shared canon `specs/000-shared/*`; constitution `.specify/memory/constitution.md` (v2.0.0, principles I/III/IV/IX/XII/XIII/XV). Visual source of truth: `project/`.

## Summary

Close the platform's remaining public/auth edges and two Admin governance surfaces, then polish. (1) **Account recovery**: build the `/forgot-password` and `/reset-password` screens (mock) — forgot returns a neutral, no-enumeration confirmation with a mock reset link carrying a `?token=`; reset validates a new password and shows a clear expired/invalid-link state when the token is missing/used/unknown; plus a clear **expired/invalid invitation** state on the existing invitation screen. (2) **Privacy-request inbox** (Admin, org-scoped): list the `DataDeletionRequest`s Users submitted in Spec 006 and move each through **Submitted → In Review → Completed/Rejected** (rejection requires a reason) — a **status-only** mock transition (no data removed) that reflects back into the User's Profile & Privacy view via the shared store. (3) **Activity Log** (Admin, org-scoped): a curated, read-only set covering all enumerated high-value event types with search + type/actor/date filters, explicitly a prototype read view (not an immutable audit log). (4) **Polish**: in-language empty/loading/error states on remaining surfaces, a clearer 404, and an a11y/responsive pass. Everything is mock-only (no real auth/email/audit).

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 18 (established by Spec 001).

**Primary Dependencies**: React Router 6 (incl. `useSearchParams` for the reset token); UI kit (Card, Button, Field/TextInput, Select, SearchInput, FilterBar, DataTable, StatusBadge, Chip, EmptyState, Skeleton); `AuthScaffold` (auth screens); hooks (`useAsync`, `useToast`, `useSession`). No new runtime dependencies.

**Storage**: Browser `localStorage` (mock) only. Deletion-request resolution writes through the existing shared `consentStore` (`nexus_consent_v1`). Activity events and reset-token state are committed fixtures / mock logic behind services. No database.

**Testing**: Vitest + React Testing Library (jsdom). Unit: deletion-request resolution lifecycle + reflection in the User view; reset-token state (valid/expired/missing) + password validation; activity-log filtering (type/actor/date AND). Component: forgot + reset screens (validation, expired-link state, no enumeration), expired invitation state, privacy inbox (lifecycle + reason-required + terminal), activity log (render + filters + empty), 404 path.

**Target Platform**: Evergreen desktop + tablet + mobile; public/auth screens centered and responsive in both themes.

**Project Type**: Web frontend — public/auth routes under `PublicShell` (`/forgot-password`, `/reset-password`), Admin routes under `AdminShell` (`/admin/activity-log`, new `/admin/privacy`), and the global `*` 404.

**Performance Goals**: Inherited (route < ~450ms; 60fps; reduced-motion honored). Mock latency on all service calls.

**Constraints**: No backend / real auth / real email / real audit / real deletion. **NON-NEGOTIABLE**: mock-only (I); Two Roles + org scope — privacy inbox & Activity Log are Admin-only and organization-scoped, Users never see other Users' data (III); services are the only data boundary (IV); Safe Reporting/privacy posture — no account enumeration, status-only deletion (IX-adjacent privacy-by-default); WCAG 2.1 AA basics + responsive (XII/XIII). Activity Log must read as a prototype view, not an immutable audit log.

**Scale/Scope**: ~6 surfaces (Forgot, Reset, invitation expired-state, Privacy Inbox, Activity Log, 404/polish). Completes `authService` (reset), `consentService`/`consentStore` (admin-side deletion resolution), and `activityLogService` (curated event set). ~8–12 curated activity events covering all enumerated types; 1–2 seeded deletion requests for the inbox.

## Constitution Check

*GATE: must pass before Phase 0; re-checked after Phase 1.* This is a governance/privacy + polish feature.

| Principle | How this feature complies | Gate |
|---|---|---|
| I Frontend First | No backend; mock auth/reset/email/audit; status-only deletion; reviewable per-story | PASS |
| II Design Fidelity | Reuses `AuthScaffold`/UI kit; missing states (empty/error/expired/404) added in-language | PASS |
| III Two Roles Only | Privacy inbox + Activity Log are Admin-only, org-scoped; recovery is role-neutral; no cross-user data | PASS |
| IV Service Boundaries | UI consumes `authService`/`consentService`/`activityLogService`; resolution writes via `consentStore`; no fixture/persistence imports in components | PASS |
| V Governed Question Source | N/A | PASS (n/a) |
| VI Immutable Metadata | No source-item metadata involved; no fabricated fields | PASS |
| VII Controlled Adaptation | N/A | PASS (n/a) |
| VIII Question-Level Attribution | N/A (no scoring/runtime) | PASS (n/a) |
| IX Safe Reporting | Privacy-by-default: no account enumeration; deletion is status-only; no restricted data surfaced | PASS |
| X Human Decision Support | N/A | PASS (n/a) |
| XI Domain 6 Transparency | N/A | PASS (n/a) |
| XII Accessibility & Motion | Keyboard-operable forms/filters, labelled controls, visible focus, sufficient contrast; reduced-motion-safe | PASS |
| XIII Responsive Runtime | Public/auth + Admin surfaces usable mobile→desktop in both themes | PASS |
| XIV Traceability | Plan consistent with `000-shared/*` (DataDeletionRequest §3, ActivityLogEvent) + master §11 | PASS |
| XV Review Before Implementation | Stop for approval before `/speckit-implement` | PASS |

**Result**: No violations. Complexity Tracking empty.

## Project Structure

### Documentation (this feature)

```text
specs/007-public-auth-activity-privacy/
├── plan.md              # This file
├── research.md          # Phase 0 — reset token model, deletion resolution, activity source/filters, polish scope
├── data-model.md        # Phase 1 — DataDeletionRequest (resolution fields), ActivityLogEvent, reset-token state
├── contracts/           # Phase 1
│   ├── screens-routes.md     # 6 surfaces, routes, states, governance/a11y rules
│   └── services.md           # authService (reset) + consentService/consentStore (admin resolution) + activityLogService deltas
├── quickstart.md        # Phase 1 — run + validation guide
└── checklists/
    └── requirements.md  # spec quality checklist (from /speckit-specify, /speckit-clarify)
```

### Source Code (repository root — frontend app)

```text
frontend/src/
├── features/
│   ├── auth/index.tsx        # add ForgotPassword + ResetPassword (reuse AuthScaffold); polish InvitationAccess expired state; clearer NotFound
│   ├── privacy/PrivacyInbox.tsx   # Admin privacy-request inbox (resolve deletion requests)
│   └── activity/ActivityLog.tsx   # Admin activity log (search + type/actor/date filters)
├── services/
│   ├── auth/authService.ts        # add verifyResetToken(token) + resetPassword(token, pw) (mock)
│   ├── consent/consentService.ts  # add allDeletionRequests() (org-scoped) + resolveDeletion(id, status, reason?)
│   └── consentStore.ts            # add updateDeletionRequest(req)
├── models/               # extend DataDeletionRequest with optional reason/resolvedAt (F1-safe; new optional fields only)
├── mocks/                # expand activityEvents to cover all enumerated types; seed 1–2 deletion requests
├── components/layout/index.tsx    # add 'Privacy Requests' to NAV_ADMIN
└── router.tsx            # wire /forgot-password, /reset-password, /admin/privacy; activity-log → ActivityLog (replace Placeholders)
tests/
├── unit/        # deletion resolution + reflection, reset-token + password validation, activity filtering
└── component/   # forgot/reset, expired invitation, privacy inbox, activity log, 404
```

**Structure Decision**: Reuse `features/auth/index.tsx`'s `AuthScaffold` for the two recovery screens to keep public/auth visuals consistent (FR-PAP-013). The privacy inbox reads/writes the **same `consentStore`** the User portal uses (Spec 006), so resolution reflects in the User's view with no new store and no circular import — the Admin-side methods (`allDeletionRequests`, `resolveDeletion`) are added to `consentService`. The Activity Log is a curated, read-only `activityLogService` set (expanded fixtures) filtered client-side. Reset-token validity is mock logic in `authService` keyed off the `?token=` query param. Routing replaces the existing Spec 001 Placeholders; a new `Privacy Requests` Admin nav item + route is added.

## Complexity Tracking

No constitution violations require justification. (If activity-log filtering grows, a small pure `filterEvents(events, {q,type,actor,date})` helper centralizes it — recorded here only if it replaces a simpler inline approach.)
