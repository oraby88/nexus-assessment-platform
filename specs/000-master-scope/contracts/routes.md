# Contract — Route / UI Surface (Frontend Prototype)

The UI contract is the route map: every route renders within the correct shell, behind the correct role guard, with title + loading/error/empty/mobile states. Canonical source: `../../000-shared/route-map.md`. Summary below; owner = area spec responsible.

## Public / system
`/` Landing (007) · `/login` Admin Login (001/002) · `/invitation` User access (006) · `/forgot-password` (007) · `/reset-password` (007) · `/access-denied` (007) · `*` Not Found (007)

## Admin (`/admin/*`, guard: role=admin, org-scoped)
`dashboard` (002) · `users` + `users/:participantId` (002) · `assessments` + `assessments/:assessmentId` (002) · `assessments/new` Create wizard (003) · `role-blueprints` + `/new` + `/:id` (004) · `context-profiles` + `/new` + `/:id` (004) · `reports` + `/:id` + `/:id/user-preview` (005) · `comparison` (005) · `history` (005) · `exports` (002) · `notifications` (002) · `activity-log` (007) · `settings` (002) · `profile` (002)

## User (`/app/*`, guard: role=user, self-scoped)
`dashboard` · `assessments` · `assessments/:id/overview` · `/consent` · `/instructions` · `/run` · `/complete` · `reports` + `/:reportId` · `history` · `notifications` · `help` · `profile` (all 006)

## Overlays
Add User drawer + Bulk Upload modal (on `/admin/users`); Pause overlay (on `/run`); Extend-deadline / Send-reminder / Cancel-confirm (on `/admin/assessments/:id`); PDF-preparation toast (report routes); Data-deletion modal (on `/app/profile`).

## Guard contract
- Unauthenticated → `/login` (admin routes) or `/invitation` (app routes).
- Wrong role for a route → `/access-denied`.
- Full-bleed (no shell chrome) for `/admin/assessments/new` and the `/app/.../run` runtime.
- Admin-only data never rendered under `/app/*`.
