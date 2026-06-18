# Quickstart — Admin Core (validation guide)

Run-and-verify guide proving the Admin Core workspace works end-to-end against mocks. Implementation
details live in `tasks.md` (after `/speckit-tasks`). Builds on the Spec 001 foundation.

## Prerequisites
- Spec 001 foundation in place (`frontend/` builds; `npm install` done).
- Sign in as Admin via `/login` (`authService.loginAdmin`) → lands in `/admin/dashboard`.

## Setup & run
```bash
cd frontend
npm run dev      # serve the app
npm test         # Vitest unit + component tests
npm run build    # production build
```

## Validation scenarios (map to Success Criteria)

| # | Scenario | Steps | Expected | SC |
|---|---|---|---|---|
| 1 | Add a person | Users → Add User → fill Name/Email/Job Level → Save | Person appears in list; success toast | SC-001 |
| 2 | Duplicate guard | Add User with an existing email | Blocked before save with a clear message | SC-001 |
| 3 | Bulk upload | Users → Bulk Upload → upload CSV with valid+invalid+duplicate rows | Preview shows correct 3-way counts; invalid/duplicate reasons listed; confirm imports only valid | SC-002 |
| 4 | User detail | Open a person | Six tabs render; consent shown read-only | SC-001 |
| 5 | Lifecycle vs validity | Assessments list | Lifecycle and Validity shown as separate badges | SC-003 |
| 6 | Management action | Assessment detail → Send Reminder (then Extend/Cancel) | Timeline entry + notification + simulated email state update; terminal actions disabled appropriately | SC-004 |
| 7 | Dashboard | Open `/admin/dashboard` | All KPIs render; quick actions route correctly | SC-005 |
| 8 | Notifications | Mark one / all read | Unread count updates; email indicator persists | — |
| 9 | Exports (active) | Exports → request Users, then Assessments | CSV downloads; export-history entries appear | SC-006 |
| 10 | Exports (pending) | Exports → view the other five | Shown as registered but pending (004/005); request disabled | SC-006 |
| 11 | Settings one-Admin | Settings → Admin Account | Exactly one Admin; no multi-Admin workflow | SC-007 |
| 12 | A11y / responsive | Keyboard-tab Add User & filters; resize < 1040px | Focus visible + trapped in drawer/modal; off-canvas nav; tables scroll in-card | SC-008 |
| 13 | No leak | Sign in as User (`/invitation`), attempt `/admin/*` | Redirected/denied; no Admin data rendered | SC-009 |

## Done (acceptance)
The Admin can browse org data, add a person, bulk-import with validation, open user detail, monitor
assessments with separate lifecycle/validity, run management actions that update timeline+notification+email,
see the dashboard, manage notifications, export Users/Assessments (others registered-pending), view
one-Admin settings, and every screen has loading/empty/error/responsive/accessible states — with zero
Admin-data leakage to the User portal.
