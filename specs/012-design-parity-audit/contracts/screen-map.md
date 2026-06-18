# Contract: Route ↔ Design-Source Map

Scopes each parity area by mapping every live route to its `project/` design counterpart. Drives the audit's inventory rows.

## US1 — Shared chrome + components + public/auth

| Live | Design source |
|---|---|
| `components/layout` (AdminShell/UserShell, Sidebar, Topbar, Popover, Avatar, ThemeToggle, mobile nav) | `app/shell.jsx` |
| `components/ui` (Button, Card, inputs/Select, Badge/Chip, DataTable, tooltips, EmptyState/Skeleton, etc.) | `app/ui.jsx` |
| icon set → **new** `components/ui/icons.tsx` | `app/icons.jsx` — the app has no icon module today (icons are passed ad hoc as `IconButton` children); this establishes a centralized named-icon set |
| `/` Landing (done in Spec 011), `/login`, `/invitation`, `/forgot-password`, `/reset-password`, `/access-denied`, `*` NotFound | `app/landing.jsx` |

## US2 — Admin screens

| Live route | Design source |
|---|---|
| `/admin/dashboard` | `app/admin_dashboard.jsx` |
| `/admin/users`, `/admin/users/:id` | `app/admin_candidates.jsx` |
| `/admin/assessments`, `/admin/assessments/:id` | `app/admin_assessments.jsx` |
| `/admin/role-blueprints` (+ `/new`, `/:id`) | `app/admin_blueprints.jsx` |
| `/admin/context-profiles` (+ `/new`, `/:id`) | `app/admin_contexts.jsx` |
| `/admin/reports` | `app/admin_reports.jsx` |
| `/admin/reports/:id`, `/admin/reports/:id/user-preview`, `/admin/comparison` | `app/report_detail.jsx` / `app/admin_reports.jsx` |
| `/admin/history`, `/exports`, `/notifications`, `/settings`, `/profile` | `app/admin_misc.jsx` |
| `/admin/privacy`, `/admin/activity-log`, `/admin/sample`, Placeholder | no/limited design source — keep current, record in inventory |

## US3 — User portal & runtime

| Live route | Design source |
|---|---|
| `/app/dashboard`, `/app/reports`, `/app/history`, `/app/notifications`, `/app/help`, `/app/profile` | `app/user_portal.jsx` |
| `/app/assessments`, `…/overview`, `…/consent`, `…/instructions`, `…/complete` | `app/user_assessment.jsx` |
| `/app/assessments/:id/run` (runtime) | `app/user_assessment.jsx` |
| `/app/reports/:id` (user report) | `app/report_detail.jsx` (user-safe) |

## US4 — Create-Assessment flow

| Live | Design source |
|---|---|
| `CreateAssessmentWizard` + `steps` (+ `QuestionCard`, `CoverageMap`, `RephrasePanel`) | `app/create_assessment.jsx`, `app/create_assessment2.jsx`, `app/create_assessment3.jsx` |
| `DiscoveryChat` | `app/create_assessment*.jsx` |
| `TransformSequence` (Spec 011) | `app/transform_sequence.jsx` |
