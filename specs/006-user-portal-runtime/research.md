# Phase 0 Research: User Portal & Assessment Runtime

All five clarifications from `/speckit-clarify` (Session 2026-06-16) are resolved in `spec.md`; this file records the technical decisions that flow from them plus the integration patterns reused from prior specs. No open `NEEDS CLARIFICATION` remain.

## D1 — Runtime progress persistence (pause / resume / reload)

- **Decision**: Persist a single `RuntimeState` per in-progress assessment via the existing versioned envelope at `StorageKeys.runtime` (`nexus_runtime_v1`, `SchemaVersions.runtime = 1`) using `getVersioned`/`setVersioned`. Store keyed by `assessmentId` (a `Record<assessmentId, RuntimeState>`) so a User with multiple active assessments doesn't collide. Auto-save is debounced (~400ms) on every answer/index/pause change; `lastSavedAt` drives the save indicator. On reload, `runtimeService.load` rehydrates `questionIndex` + `answers`; a schema-version mismatch safely discards (research D2 of Spec 001) rather than crashing.
- **Rationale**: Reuses the constitution-mandated local-persistence layer already shipped; the versioned envelope gives free, safe invalidation. Keyed-by-assessment matches `RuntimeState.assessmentId` in shared §10.
- **Alternatives considered**: A bespoke key per assessment (more keys to manage, no envelope versioning); sessionStorage (lost on tab close — fails the resume requirement).

## D2 — Five question-type render contracts + answer gating

- **Decision**: A `renderers` map keyed by `MethodFamily` → component, each receiving `{ item: Readonly<ItemBankItem>, value, onChange, disabled }` and emitting a normalized `number | string` answer. Likert/contextual frequency → radio scale from `responseScale`; forced choice → option cards (stack on mobile); cognitive MCQ → single-select options; SJT → scenario text + single-select. **Next is gated** on `value != null` for the current item; **free back-navigation** lets the User jump to any prior (answered) item and change it, re-storing under the same source Question ID. The final step is a review-then-Submit.
- **Rationale**: One contract keeps all five types uniform for keyboard/touch a11y and testing; keying by source Question ID (not array index) satisfies constitution VIII and survives back-nav edits.
- **Alternatives considered**: Per-type bespoke state (duplicated a11y/gating logic); index-keyed answers (breaks attribution and back-nav correctness).

## D3 — Source of the runtime's question set

- **Decision** (clarify Q5 = A): `runtimeService.load(assessmentId)` returns a **fixed, pre-resolved** ordered item set (the assessment's already-selected/adapted items from Spec 003) plus the rehydrated `RuntimeState`. The runtime renders items verbatim and performs **no** client-side selection, adaptation, scoring, or governance. Items are `Readonly<ItemBankItem>` exposing only display fields to the User (no metadata).
- **Rationale**: Honors Governed Question Source + Controlled Adaptation (selection/adaptation already governed upstream) and keeps the runtime a pure capture surface.
- **Alternatives considered**: Runtime selects from the governed bank (B) or adapts live (C) — both move governance into the client, violating V/VII/VIII.

## D4 — No live score / no production scoring

- **Decision** (clarify SC-004): The runtime captures `QuestionResponse { assessmentId, sourceQuestionId, value, answeredAt }` only. There is **no** score state, no derived totals, and no scoring UI anywhere in `/app/*`. Completion shows a subtle confirmation + processing/next-steps state (no confetti). Reports are read from `reportService.getUserSafe` only.
- **Rationale**: Constitution VIII is NON-NEGOTIABLE; future backend scoring consumes responses keyed by source Question ID.
- **Alternatives considered**: A "preliminary score" preview — rejected outright.

## D5 — Consent gating, applicability, and revocation eligibility

- **Decision** (clarify Q3 = A): `consentService.forAssessment(assessmentId)` returns the `ConsentRecord[]` for that assessment; the required current-use-case consent gates **Accept and Continue** (disabled until checked). Optional consents (research, third-party) render **only when applicable**. Revocation eligibility: optional consents are **always** revocable; the required use-case consent is revocable **until the report is released**, then locked (shown as historical, non-revocable). Declining returns the User to the dashboard with a neutral message and updates mock status (no penalty language).
- **Rationale**: Mirrors real informed-consent practice and produces a meaningful "already used for a released report" edge case (spec Edge Cases).
- **Alternatives considered**: All-revocable (B) ignores released-report immutability; optional-only (C) removes a needed pre-release withdrawal path.

## D6 — Shared consent store (cross-role propagation)

- **Decision**: Introduce `services/consentStore.ts` — a versioned `localStorage`-backed store (pattern copied from Spec 004's `blueprintContextStore.ts`) holding `ConsentRecord[]` + `DataDeletionRequest[]`. `consentService` (User) writes grant/decline/revoke; the Admin User-Detail **Consent** tab (Spec 002, currently an empty state) reads the same store so revocation reflects without a circular service import.
- **Rationale**: Avoids `consentService ↔ participantService` circularity; single source of truth keeps SC-006 (revocation reflects in Admin view) deterministic.
- **Alternatives considered**: Two-way service imports (circular); duplicating state in each service (drift).

## D7 — Data-deletion request lifecycle

- **Decision** (clarify Q4 = A): `consentService.requestDeletion(note?)` creates a `DataDeletionRequest` with status `Submitted` (pending) in the shared store and returns an acknowledgement; the User sees pending status. The Admin privacy-request **inbox UI is owned by Spec 007**; this spec only creates the pending record and shows the User-side acknowledgement. The User never self-deletes data.
- **Rationale**: Satisfies the privacy obligation now, preserves the data boundary, and hands the inbox cleanly to Spec 007.
- **Alternatives considered**: Immediate local deletion (B — wrong boundary); cosmetic-only (C — nothing for Spec 007 to consume).

## D8 — Display-only section timers

- **Decision** (clarify Q2 = A): Section/question timers are **display-only** — an optional countdown shown for realism that never blocks input, auto-advances, or auto-submits, and never causes answer loss. Remaining time is approximate after reload; answers are always authoritative.
- **Rationale**: Enforced timers add lost-answer risk that contradicts the auto-save guarantee for no V1 value (no scoring).
- **Alternatives considered**: Soft warning (B) / hard cutoff (C) — unnecessary complexity for a no-scoring prototype.

## D9 — User-safe leakage guard

- **Decision**: The User report is rendered solely from `reportService.getUserSafe` (Spec 005), which already strips `domains`, `domain6` internals, `scoringVersion`, `omittedSections`, `interviewPrompts`, etc. A unit guard asserts no restricted/internal key appears in any User-facing payload; a component guard asserts no hire/reject language. No User screen imports the full `Report` shape.
- **Rationale**: Constitution IX/III; reuses the proven Spec 005 projection (one path, already tested).
- **Alternatives considered**: A second User-side projection — duplicate risk; rejected.

## D10 — Routing, shells, and code-splitting

- **Decision**: Replace the reserved `/app/*` Placeholders and the `/app/assessments/:assessmentId/run` Placeholder (FullBleedShell) with lazy-loaded feature screens, matching the established `React.lazy` pattern in `router.tsx`. Runtime uses `FullBleedShell` (immersive); the rest use `UserShell`. All `user`-role-guarded via `RequireRole`.
- **Rationale**: Consistent with foundation routing + per-route code-splitting; keeps initial chunk lean.
- **Alternatives considered**: Eager imports (bloat first paint); a separate runtime router (unneeded).
