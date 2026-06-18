# Contract — Admin Core Screens, Routes & States

Routes are reserved by Spec 001's router; Admin Core replaces the `Placeholder` elements with real screens. Source: `../../000-shared/route-map.md`. All screens render inside `AdminShell` (`/admin/*`), are org-scoped, and provide loading/empty/error/responsive/accessible states (FR-ADM-013).

## Screens & routes

| Screen | Route / overlay | Owner story |
|---|---|---|
| Dashboard | `/admin/dashboard` | US3 |
| Users list | `/admin/users` | US1 |
| Add User | drawer on `/admin/users` | US1 |
| Bulk Upload | modal on `/admin/users` | US1 |
| User Detail | `/admin/users/:participantId` | US1 |
| Assessments list | `/admin/assessments` | US2 |
| Assessment Detail | `/admin/assessments/:assessmentId` | US2 |
| Notifications | `/admin/notifications` | US4 |
| Exports | `/admin/exports` | US4 |
| Organization Settings | `/admin/settings` | US4 |
| My Profile | `/admin/profile` | US4 |

> `/admin/assessments/new` (Create Assessment) is reserved here but **owned by Spec 003** (full-bleed shell). "Add to Comparison" / report links target Spec 005.

## Key screen contracts

- **Users list**: search + filters (lifecycle, latest report, job level, target role), sort, multi-select, pagination (page 25), Export, Add User, Bulk Upload. Columns: Name · Email · Current Title · Target Role · Job Level · Total Assessments · Latest Lifecycle · Latest Report · Date Added · Actions. Empty/loading/error states.
- **Add User drawer**: fields per `data-model.md#AddUserInput`; actions Save · Save and Create Assessment (routes to 003 stub) · Cancel; focus-trapped; duplicate-email blocked before save.
- **Bulk Upload modal (stepper)**: download template → upload (drag/drop or picker) → progress → validate → valid/invalid/duplicate preview (reasons on invalid/duplicate) → confirm → success summary. Imports only valid rows.
- **User Detail tabs**: Overview · Active Assessments · History · Reports · Consent (read-only, from 006) · Timeline. Actions route to assessment/report flows.
- **Assessments list**: status tabs + filters (use case, deadline, role, blueprint, report state); columns include **separate** Lifecycle and Validity badges + Report Status.
- **Assessment Detail**: user/assignment cards, progress ring, consent state, timeline, reminder history, invitation status, lifecycle, validity, report status, Domain-6-availability summary, version summary; actions remind/resend/extend/cancel (+ open user/report, simulated PDF, create reassessment, add to comparison).
- **Notifications**: list with unread state, email indicator, filters, related-record link, mark read / mark all read.
- **Exports**: registry of 7 types — Users & Assessments active (CSV); five marked pending (004/005); job progress, history, re-run, download.
- **Settings**: sections per spec; Admin Account shows exactly one Admin (+ future note).
- **My Profile**: profile fields, simulated password change, notification preference, language, theme, sign-out.

## Cross-cutting states (FR-ADM-013)
Loading (skeletons), Empty (guidance + CTA), Error (retry), Responsive (KPI grid 4→2→1, tables scroll in-card, off-canvas nav < 1040px), Accessibility (keyboard filters/menus, focus-trapped drawer/modal, aria-live toasts), Motion (KPI count-ups, staggered rows, reduced-motion-safe).
