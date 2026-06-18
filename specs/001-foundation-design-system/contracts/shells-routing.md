# Contract — Shells, Routing & Guards (Foundation)

Foundation owns the route tree, the two role shells, full-bleed mode, and the role-based guards. Pages for most routes are implemented by specs 002–007; foundation reserves the routes and guarantees the guard/shell behavior. Source: `../../000-shared/route-map.md`, master `../../000-master-scope/contracts/routes.md`.

## Shells

| Shell | Mounts | Chrome |
|---|---|---|
| `AdminShell` | `/admin/*` | TopBar + off-canvas Sidebar (Admin nav registry, 13 items) |
| `UserShell` | `/app/*` | TopBar + Sidebar (User nav registry, 7 items) |
| `FullBleedShell` | `/admin/assessments/new`, `/app/assessments/:id/run` | no sidebar; immersive signature/runtime mode |
| `PublicShell` | public/auth routes | minimal chrome (pages owned by 007) |

## Route tree (reserved)

- **Public/auth** (pages → 007; `/login`,`/invitation` entry shared with 002/006): `/` · `/login` · `/invitation` · `/forgot-password` · `/reset-password` · `/access-denied` · `*`
- **Admin** (`/admin/*`): the 22 routes in `route-map.md` (dashboard, users[/:id], assessments[/new,/:id], role-blueprints[*], context-profiles[*], reports[/:id,/:id/user-preview], comparison, history, exports, notifications, activity-log, settings, profile).
- **User** (`/app/*`): the 13 routes in `route-map.md` (dashboard, assessments[+overview/consent/instructions/run/complete], reports[/:id], history, notifications, help, profile).

Foundation provides lazy route loading (`React.lazy` + `Suspense` with a `Skeleton` fallback) for all route elements.

## Guard contract

```ts
// Behavior the guards MUST satisfy (verified by SC-001 + component tests)
guard(route, session):
  no session            & route ∈ /admin/* → redirect /login
  no session            & route ∈ /app/*   → redirect /invitation
  session.role='user'   & route ∈ /admin/* → /access-denied (no Admin chrome/data rendered)
  session.role='admin'  & route ∈ /app/*   → /access-denied (no User chrome/data rendered)
  matching role         & protected route   → render within the role shell
```

- Guards read the session via `SessionProvider` (sourced from `authService.getSession()`); they never read persistence directly.
- A wrong-role hit MUST NOT mount the other shell or fetch its data.

## Navigation registries

- **Admin (13)**: Dashboard · Users · Assessments · Role Blueprints · Context Profiles · Reports · Candidate Comparison · Assessment History · Exports · Notifications · Activity Log · Organization Settings · My Profile.
- **User (7)**: Dashboard · My Assessments · Assessment History · My Reports · Notifications · Help and Support · Profile and Privacy.

Registries are typed `NavItem[]` (see `../data-model.md`) and drive the Sidebar; active-route highlighting and off-canvas collapse (`useViewport`, < 1040px) are foundation behavior.
