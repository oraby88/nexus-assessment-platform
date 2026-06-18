# Services

The typed mock-service layer is the **only** data boundary (constitution IV). Every method is
`Promise`-based, returns typed models, simulates latency/error via `http.ts`, and mirrors
`specs/000-shared/handoff-map.md`. These signatures are the de-facto API contract a future
FastAPI + Supabase backend must satisfy without a UI rewrite.

Import from the aggregator: `import { participantService, reportService } from '@/services'`.

## Infrastructure
- `http.ts` — `mockRequest(value, opts)`, `setMockFailRate(rate)`, `MockHttpError`. Simulated latency
  + injectable errors so the UI exercises loading/error/retry.
- `persistence.ts` — namespaced/versioned `localStorage`. `getVersioned`/`setVersioned` **discard a
  stale entry on a schema-version mismatch** (research D2; no migration in V1). `themeStore` follows
  the OS `prefers-color-scheme` when no explicit choice is stored (research D1).
- `governance/` — pure, unit-tested helpers: `isOperationallyEligible`/`selectEligible`,
  `confidenceBand`, `visibility`, `toUserSafe` (constitution V/VI/IX/X/XI).

## Implemented in the foundation (Spec 001)
`authService`, `participantService` (list/get), `questionBankService` (lazy-loads the code-split
governed bank), plus the governance helpers above.

## Implemented in Admin Core (Spec 002)
- `participantService` — `add`, `bulkUpload`, `confirmImport`, `history` (dedicated file; in-memory roster).
- `assessmentService` — `list`, `get`, `timeline`, `remind`, `resendInvitation`, `extendDeadline`,
  `cancel` (mutates mock state, appends a `TimelineEvent`, emits an `AppNotification` with a simulated
  email-delivery flag; actions blocked on terminal lifecycle).
- `notificationService` — `list`, `unreadCount`, `markRead`, `markAllRead`.
- `exportService` — `registry` (7 types; Users/Assessments active, 5 pending), `request`, `getCsv`,
  `history` (client-side CSV via `lib/csv.ts`).
- `settingsService` — `get`/`update` (single Admin account; one-Admin V1 rule).
- Fixture-backed reads: `roleBlueprintService`, `contextProfileService`, `reportService`,
  `activityLogService`, `invitationService`, `assessmentReminderService`.

## Implemented in Role Blueprints & Context Profiles (Spec 004)
- `roleBlueprintService` — `list`/`get` + `create`/`update`/`duplicate`/`setStatus` (free-form; Archived
  terminal)/`versions`/`link`/`isEligible` (Validated gate for hiring; Deprecated/Archived excluded).
- `contextProfileService` — `list`/`get` + `create`/`update`/`duplicate`/`setStatus`/`versions`/`link`.
- Shared `blueprintContextStore` backs the two-way Blueprint↔Context link.
- `lib/dimensions.ts` — dimension catalog derived from the governed `item_bank`.
- `features/contexts/contextSignature.ts` — pure live Context Signature derivation.

## Implemented in Reports/Domain 6/Comparison/History (Spec 005)
- `reportService` — `list`/`getAdmin` (full report fixtures in `mocks/reports.ts`), `getUserSafe`
  (audience projection — strips restricted/internal/blocked), `downloadPdf` (records export-history).
- `features/reports/projectReport.ts` — computes per-dimension `OutputVisibility` via the governance
  helpers at render time (Safe Reporting).
- `comparisonService.build` — reads current released reports; flags ineligible participants; **no
  ranking/order/auto-decision** (Human Decision Support).
- `exportService.recordPdf` — records a simulated PDF export-history entry without the registry gate.
- Admin History joins `assessmentService.list` + reports (version-aware; lifecycle/validity separate).

## Implemented in Create Assessment (Spec 003)
- `assessmentDraftService` — `create`/`save`/`get` (versioned draft store), `approve`, `send`
  (requires approval; creates assignment + invitation + timeline + notification via the 002 store).
- `agentDiscoveryService` — `start`/`next`/`summary` (deterministic canonical script; builds the
  requirements profile; parameterized by use case).
- `adaptationService` — `adapt`/`canAdapt` (display-text-only rephrase + word diff; method safeguards;
  SJT + cognitive MCQ verbatim in V1).
- `questionBankService.propose` — auto-proposes a governed-eligible set covering critical dimensions.
- `assessmentService.create` — adds a Not-Started assignment so sent drafts appear in Admin Core.
- `lib/diffWords.ts` — dependency-free word diff for the rephrase panel.

## Typed stubs (owned by later area specs 005–007)
`consentService`, `runtimeService`, `scoringService`, `domain6Service`, `comparisonService` are thin
stubs that throw until their feature spec implements them.

## Rules
- Services own governance enforcement (advisory in V1, server-authoritative later).
- Never fabricate source-item fields (`weight`/`difficulty`); `ItemBankItem` metadata is immutable.
