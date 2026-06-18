# Screen & Route Contracts: User Portal & Assessment Runtime

All routes are `user`-role-guarded via `RequireRole` under `/app/*`; the runtime is immersive under `FullBleedShell`. Every screen is **own-data only** (constitution III) and must render no Admin-only/internal field (constitution IX — FR-USR-018). Each screen defines loading / empty / error states in the design language (constitution II). Routes currently exist as Placeholders in `router.tsx` and are replaced with lazy feature screens (research D10).

| # | Route | Screen | Shell | Story | Key states |
|---|---|---|---|---|---|
| 1 | `/app/dashboard` | UserDashboard (extend) | UserShell | US6 | active-assessment hero (role, use case, deadline, progress, Continue) · completed · reports · notifications · empty |
| 2 | `/app/assessments` | My Assessments | UserShell | US6 | active/completed lists · empty |
| 3 | `/app/assessments/:id/overview` | Assessment Overview | UserShell | US1 | org/purpose/role/duration/deadline/section+pause rules/privacy summary · Continue to consent · expired |
| 4 | `/app/assessments/:id/consent` | Consent | UserShell | US3 | required + applicable optional consents · Accept-and-Continue gated · decline → neutral return |
| 5 | `/app/assessments/:id/instructions` | Instructions | UserShell | US1 | structure/types/timed sections (display-only)/pause-resume/auto-save/submit · Begin |
| 6 | `/app/assessments/:id/run` | **Assessment Runtime** | **FullBleedShell** | US1/US2 | five renderers · answer-gated Next · free back-nav · save indicator · pause/resume · reload-restore · review · **no live score** |
| 7 | `/app/assessments/:id/complete` | Completion | UserShell | US1 | subtle confirmation + processing/next-steps (no confetti) |
| 8 | `/app/reports` | My Reports | UserShell | US5 | available/partial/historical list with status · open · PDF · empty |
| 9 | `/app/reports/:reportId` | User Report | UserShell | US5 | user-safe content only (strengths, themes, allowed dimensions, caution/omission, optional high-level Domain 6 summary) · simulated PDF |
| 10 | `/app/history` | Assessment History | UserShell | US6 | own completed assessments · empty |
| 11 | `/app/notifications` | Notifications | UserShell | US6 | own notifications + email-delivery indicator · mark read · empty |
| 12 | `/app/help` | Help & Support | UserShell | US6 | FAQ, runtime guidance, contact support, privacy questions |
| 13 | `/app/profile` | Profile & Privacy | UserShell | US3/US6 | personal info · language · simulated password change · consent history · revoke eligible · data-deletion request (pending) |

## Runtime contract (screen 6) — the critical surface

- **Renderers** (FR-USR-008): one per `MethodFamily` — Likert agreement, contextual frequency, forced choice, cognitive MCQ, SJT — from `RuntimeSession.items` (pre-resolved, verbatim). Each is keyboard-operable (arrow/space/enter), labelled, focus-visible, with ≥44px touch targets; forced-choice cards stack on mobile; SJT scenario text remains readable; progress is sticky.
- **Gating + navigation** (FR-USR-009): Next disabled until the current item has a value; **free back-navigation** to any answered item (re-edit re-stores under the same source Question ID); final review then Submit.
- **Persistence** (FR-USR-010): every change auto-saves to `localStorage`; the save indicator reflects `lastSavedAt`; pause/resume and full-reload restore current question + all answers (SC-002). Simulated save failure → retry note, answers preserved.
- **Attribution + no score** (FR-USR-011 / SC-004): responses stored keyed by source Question ID; **no scoring value appears at any point** during or after the runtime.
- **Timers** (D8): any countdown is display-only — never blocks, auto-advances, or auto-submits.

## Consent contract (screen 4)

- Required current-use-case consent gates **Accept and Continue** (FR-USR-005 / SC-005); optional consents (research, third-party) shown **only when applicable** (FR-USR-006). Decline → neutral message → dashboard, mock status updated (no penalty language). Hiring Support → pre-hire screening; Developmental → developmental feedback.

## Profile & Privacy contract (screen 13)

- Consent history with **revoke** on eligible records (optional always; required until report release — D5); revocation propagates to the Admin Consent tab (SC-006). Data-deletion request creates a **pending** record + acknowledgement (D7); language change + simulated password change update mock state.

## Cross-cutting governance & a11y (all screens)

- **No leakage** (FR-USR-018 / SC-007/008): no source metadata, formulas, scoring versions, raw/governance flags, blocked values, Admin notes, Domain 6 internals, or hire/reject language. The User report is built solely from `reportService.getUserSafe`.
- **A11y** (SC-009): keyboard-operable, visible focus, labelled controls, semantic landmarks, sufficient contrast in both themes, reduced-motion-safe; WCAG 2.1 AA basics verified on the priority flow (US1/US2).
- **Responsive** (XIII): mobile-first runtime; periphery usable mobile→desktop.
