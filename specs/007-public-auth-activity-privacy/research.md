# Phase 0 Research: Public/Auth Recovery, Activity Log & Privacy Inbox

The three `/speckit-clarify` decisions (Session 2026-06-16) are recorded in `spec.md`; this file captures the technical decisions that follow plus the reuse patterns from prior specs. No open `NEEDS CLARIFICATION` remain.

## D1 — Mock password-reset token model

- **Decision** (clarify Q3 = A): The reset screen reads a `token` query parameter via `useSearchParams`. `authService.verifyResetToken(token)` returns `'valid' | 'expired' | 'missing'`: missing/empty → `missing`; the sentinels `expired`/`used` → `expired`; any other non-empty token → `valid`. The forgot-password confirmation renders a mock "Open reset link" affordance to `/reset-password?token=valid-demo` (standing in for the email). `authService.resetPassword(token, password)` is a mock returning `{ ok: true }` (no real credential change).
- **Rationale**: Mirrors real reset-link UX while staying mock; makes the happy path, the missing-token path, and the expired/used path all directly testable from the URL.
- **Alternatives considered**: Direct reachable reset with a demo toggle (less realistic, weaker test of the expired state); localStorage handoff (hidden state, harder to test).

## D2 — Forgot-password privacy posture (no enumeration)

- **Decision**: `authService.requestReset(email)` (already exists, returns `{ ok: true }`) is called regardless of whether the email "exists"; the screen always shows the same neutral confirmation ("if an account exists, a reset link was sent"). No branch reveals account existence.
- **Rationale**: Privacy-by-default; prevents account enumeration (SC-003). No backend means no real lookup anyway.
- **Alternatives considered**: Distinct "no such account" message — rejected (enumeration risk).

## D3 — Deletion-request resolution (status-only)

- **Decision** (clarify Q1 = A): Extend `DataDeletionRequest` with optional `reason?` and `resolvedAt?`. `consentService.allDeletionRequests()` returns org-scoped requests for the Admin inbox; `consentService.resolveDeletion(id, status, reason?)` writes the new status (`In Review` | `Completed` | `Rejected`) via a new `consentStore.updateDeletionRequest(req)`. **No User data is removed or altered** — status only. Terminal states (`Completed`/`Rejected`) are not re-actionable; `Rejected` requires a `reason`.
- **Rationale**: Constitution I forbids real deletion in V1; the User's own view (`consentService.deletionRequests()`, Spec 006) reads the same store, so resolution reflects automatically (SC-001) with no new wiring.
- **Alternatives considered**: Visible side-effects on consents/assessments (B) or purging mock data (C) — both exceed the mock boundary and risk corrupting other specs' fixtures.

## D4 — Activity Log source & filtering

- **Decision** (clarify Q2 = A): The Activity Log is a **curated, read-only** set from `activityLogService.list()`. Expand the `activityEvents` fixtures to cover all enumerated types (assessment sent, report released/with caution, consent revoked, data-deletion requested, blueprint validated, user added, export generated, invitation expired), each with actor/target/timestamp. Filtering (search + type + actor + date) is pure client-side and combines as logical AND. No live session capture; no event bus.
- **Rationale**: Deterministic coverage of every selected type; honors "prototype read view, not an immutable audit log" (FR-PAP-010); avoids cross-service emission wiring.
- **Alternatives considered**: Fixtures + live append (B) / full event bus (C) — more wiring and non-determinism for a read view; deferred to the backend audit log.

## D5 — Reuse of `AuthScaffold` for recovery screens

- **Decision**: Add `ForgotPassword` and `ResetPassword` to `features/auth/index.tsx`, reusing the existing (file-local) `AuthScaffold` + `inputStyle` so public/auth visuals stay consistent (FR-PAP-013). Add cross-links: AdminLogin/InvitationAccess → "Forgot password".
- **Rationale**: Single source of auth chrome; no new shell; consistent theming/responsive behavior.
- **Alternatives considered**: A new standalone layout — visual drift, duplicated chrome.

## D6 — Expired/invalid invitation state

- **Decision**: Add an expired/invalid state to `InvitationAccess` triggered by a query flag (e.g., `?state=expired`) or an unknown invitation code, showing a clear, non-alarming explanation + sign-in/support path (no penalty language). This is the deferred Spec 006 edge case.
- **Rationale**: Completes the invitation UX; keeps it on the existing screen rather than a new route.
- **Alternatives considered**: A separate expired route — unnecessary surface.

## D7 — Privacy inbox placement (Admin nav + route)

- **Decision**: Add a `Privacy Requests` item to `NAV_ADMIN` and a `/admin/privacy` route rendering `PrivacyInbox` (lazy). The Activity Log replaces the existing `/admin/activity-log` Placeholder.
- **Rationale**: Discoverable, org-scoped Admin governance surfaces; matches the established nav/route pattern.
- **Alternatives considered**: Nesting privacy under Settings — less discoverable for a compliance task.

## D8 — Polish scope (states + 404)

- **Decision**: Sweep remaining scaffolded routes for in-language empty/loading/error states; enhance `NotFound` with a clearer message and a relevant home link; verify keyboard/contrast/responsive on the new screens. No redesign — consistency only.
- **Rationale**: Raises prototype credibility (constitution II/XII/XIII) without scope creep.
- **Alternatives considered**: A broad visual redesign — out of scope for V1.
