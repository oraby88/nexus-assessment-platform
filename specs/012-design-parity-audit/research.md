# Phase 0 Research: Design-Parity Audit & Gap-Closure

The three `/speckit-clarify` decisions (Session 2026-06-16) are recorded in `spec.md`; this file captures the technical decisions that follow plus the route↔design mapping. No open `NEEDS CLARIFICATION` remain.

## D1 — Parity bar & verification method (clarify Q1)

- **Decision**: Match the design's **specified source values exactly** — color, spacing, type scale, layout, iconography, elevation — read directly from `project/app/styles.css` and the `app/*.jsx` source. Verify at **review** against the source, supported by **token/structure assertions** (a screen renders the expected tokens/icons/structure/states). **No automated pixel-diff / visual-regression tooling** (brittle in jsdom; would add a heavy dependency and CI infra — disproportionate for a mock-only prototype).
- **Rationale**: The design source gives exact values, so an exact match is achievable and meaningful without screenshot diffing. Keeps the deterministic Vitest suite and the ≤260 KB budget intact.
- **Alternatives considered**: Playwright/Loki visual-regression gating (B — heavy dep + infra, rejected); "close enough" look-and-feel only (C — too loose, leaves visible gaps).

## D2 — Severity model & definition of done (clarify Q2)

- **Decision**: Each gap-inventory entry is classified **High / Medium / Low**. This feature closes **all High + Medium**; **Low** (cosmetic/marginal) gaps are logged and deferrable with reviewer sign-off. Severity rubric: **High** = wrong/missing tokens, broken layout, missing state, off-brand component, or a11y/contrast regression; **Medium** = noticeable spacing/typography/iconography/elevation deviation; **Low** = sub-pixel/marginal cosmetic difference.
- **Rationale**: Full exact-match on every pixel of ~40 screens is unbounded; closing High+Medium yields a credibly on-brand app and a testable, finite "done."
- **Alternatives considered**: Close-all (B — largest effort, unbounded); High-only (C — leaves visible Medium gaps).

## D3 — Audit sequencing (clarify Q3)

- **Decision**: **Per-area interleaved** — each user story audits its area against the design source, appends its findings to `inventory.md`, then closes that area's High+Medium gaps. The inventory accumulates area-by-area; there is no separate upfront app-wide audit phase.
- **Rationale**: Matches the area-based user stories, delivers visible parity incrementally (shell first), and avoids a giant upfront inventory going stale before fixes land.
- **Alternatives considered**: Full upfront audit then close (B — single inventory but delays all visible fixes and risks staleness).

## D4 — Route ↔ design-source mapping (scope per area)

- **Decision**: Map each live route to its `project/` counterpart (see `contracts/screen-map.md`):
  - **US1 (chrome + components + public/auth)**: `components/layout` ← `app/shell.jsx`; `components/ui` + icons ← `app/ui.jsx` + `app/icons.jsx`; public/auth (`features/auth`, `features/landing`) ← `app/landing.jsx` (Landing already done in Spec 011).
  - **US2 (Admin)**: dashboard ← `admin_dashboard.jsx`; users (list/detail) ← `admin_candidates.jsx`; assessments (list/detail) ← `admin_assessments.jsx`; blueprints ← `admin_blueprints.jsx`; contexts ← `admin_contexts.jsx`; reports list ← `admin_reports.jsx`; report detail + user-safe preview + comparison ← `report_detail.jsx`/`admin_reports.jsx`; history/exports/notifications/settings/profile ← `admin_misc.jsx`.
  - **US3 (User portal & runtime)**: dashboard/reports/history/notifications/help/profile ← `user_portal.jsx`; my-assessments/overview/consent/instructions/completion + runtime ← `user_assessment.jsx`; user report ← `report_detail.jsx` (user-safe).
  - **US4 (Create-Assessment)**: wizard + steps + discovery + question/coverage/rephrase ← `create_assessment.jsx` / `create_assessment2.jsx` / `create_assessment3.jsx`; transform sequence ← `transform_sequence.jsx`.
- **No design counterpart** (record in inventory, keep current treatment): `SampleServiceView`, the `Placeholder` route, and any app-only screens (e.g., `ActivityLog`, `PrivacyInbox`) the design only scaffolds — audited as "no/limited design source," not parity defects.
- **Rationale**: Concrete mapping makes each area's audit scope unambiguous and testable.

## D5 — Closure mechanics (presentation-only)

- **Decision**: Close gaps by editing existing components/screens' markup, Tailwind classes, tokens, icons, and states to the design's values. Where the design specifies a **token, icon, or component variant the app lacks**, add it in the token/primitive/icon layer (`tokens.css`/`globals.css`/`components/ui`/icon set) — presentation assets, not features. No service/data/route changes; no behavior changes (0 functional regressions).
- **Rationale**: Keeps the change surface presentation-only (constitution I/IV) and centralizes shared fixes (US1) so per-screen work (US2–US4) inherits them.
- **Alternatives considered**: Per-screen bespoke styling (rejected — duplicates; fix shared layer first).

## D6 — Budget, motion, RTL, gate (cross-cutting)

- **Decision**: Watch the eager budget (currently ~258 KB / 260 KB) — parity edits are markup/class changes that should add ~no eager JS; any new eager import must be justified or lazy. Preserve reduced-motion + no-shell-parallax (reuse Spec 009 tests). Verify parity in both themes + RTL. The Spec 008 `release-gate` (incl. `check:bundle`) stays the single authority for SC-005/006.
- **Rationale**: Parity must not regress performance, motion safety, or a11y.

## D7 — Testing strategy

- **Decision**: Add `tests/parity/` structural assertions per area where meaningful (states present; chrome/components use the design's tokens/icons/structure). Rely on the existing suites (component, a11y, reduced-motion, no-parallax, check-bundle) for regression. Parity match itself is review-signed-off via the gap inventory (no pixel-diff).
- **Rationale**: Deterministic, dependency-free; matches the clarified parity bar.
