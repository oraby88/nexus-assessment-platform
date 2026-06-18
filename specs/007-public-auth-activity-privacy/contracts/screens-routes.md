# Screen & Route Contracts: Public/Auth Recovery, Activity Log & Privacy Inbox

Public/auth routes render under `PublicShell`; Admin governance routes under `AdminShell` (`user`/`admin` guarded via `RequireRole`). Existing Spec 001 Placeholders are replaced. Every screen defines loading / empty / error states in the design language (constitution II) and meets WCAG 2.1 AA basics (XII).

| # | Route | Screen | Shell | Story | Key states |
|---|---|---|---|---|---|
| 1 | `/forgot-password` | ForgotPassword | PublicShell | US2 | email field · neutral confirmation (no enumeration) · mock reset link |
| 2 | `/reset-password?token=` | ResetPassword | PublicShell | US2 | valid: new+confirm password w/ inline validation → success → sign-in · expired/missing token → expired-link state w/ "request new link" |
| 3 | `/invitation` (extend) | InvitationAccess | PublicShell | US2 | activate/sign-in (exists) · **expired/invalid** state (explanation + sign-in/support, no penalty) |
| 4 | `/admin/privacy` | PrivacyInbox | AdminShell | US1 | list (requester/date/note/status) · resolve lifecycle · reject-requires-reason · terminal disabled · empty |
| 5 | `/admin/activity-log` | ActivityLog | AdminShell | US3 | curated events (actor/target/time) · search + type/actor/date filters · empty · "prototype read view" note |
| 6 | `*` | NotFound (enhance) | — | US4 | clear message + path back to a relevant home |

## Account recovery (screens 1–3)

- **Forgot** (FR-PAP-001/SC-003): submit email → call `authService.requestReset` → always the same neutral confirmation; render a mock "Open reset link" → `/reset-password?token=valid-demo`. Cross-linked from AdminLogin + InvitationAccess.
- **Reset** (FR-PAP-002/003): read `?token=`; `authService.verifyResetToken` → `expired`/`missing` shows the expired-link state with "request a new link"; `valid` shows new+confirm password fields with inline validation (≥8 chars, matching) → `authService.resetPassword` → success → `/login`.
- **Invitation expired** (FR-PAP-004): an expired/invalid state (via `?state=expired` or unknown code) explaining what happened with sign-in/support — no penalty language.

## Privacy inbox (screen 4)

- Lists `consentService.allDeletionRequests()` (org-scoped) with requester, submission date, note, status.
- Actions per request (FR-PAP-006/007): **Mark In Review**, **Complete**, **Reject** (reason required → recorded). Resolution is **status-only**; reflects in the User's Profile & Privacy view. Terminal (`Completed`/`Rejected`) rows show disabled controls. Empty state when none.

## Activity Log (screen 5)

- Renders `activityLogService.list()` (curated) with actor/target/timestamp; **search** + **type** + **actor** + **date** filters combine as AND (FR-PAP-009). Friendly empty state when filters exclude all. A visible note frames it as a prototype read view, not an immutable audit log (FR-PAP-010).

## Polish (screen 6 + sweep)

- Enhanced 404 (FR-PAP-011); remaining scaffolded routes show in-language empty/loading/error states (FR-PAP-012); a11y/responsive verification on the new screens (FR-PAP-013/014).

## Cross-cutting governance & a11y (all screens)

- **Scope** (FR-PAP-016/SC-007): `/admin/privacy` + `/admin/activity-log` are Admin-only, org-scoped; never render under a User session; no cross-user/cross-org data.
- **Privacy** (SC-003/004): no account enumeration; clear expired states (invitation + reset link) — never blank/raw errors.
- **A11y** (SC-008): keyboard-operable forms/filters, labelled controls, visible focus, sufficient contrast in both themes; responsive mobile→desktop.
