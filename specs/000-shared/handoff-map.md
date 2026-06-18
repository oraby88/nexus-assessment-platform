# Frontend → Future Backend Handoff Map

Current phase: React frontend prototype with mock services.

Future phase:
- FastAPI,
- Supabase,
- real AI Agent orchestration,
- server-authoritative question eligibility,
- server-authoritative scoring,
- server-authoritative reporting,
- email,
- PDFs,
- and immutable audit logging.

No backend code belongs in the current implementation phase.

---

## Cross-Cutting Rules

Future endpoints must:
- authenticate requests,
- apply role claim (`admin` / `user`),
- enforce organization scoping,
- enforce User own-data access,
- enforce question-bank immutability,
- enforce consent,
- enforce report audience projection,
- enforce blueprint validation gate,
- and write immutable audit events.

Frontend gates are advisory during prototype.  
Backend gates become authoritative in production.

---

## Mock Service Contracts

| Service | Frontend prototype actions | Mock behavior | Future FastAPI responsibility | Likely Supabase data |
|---|---|---|---|---|
| `authService` | Admin login, User invitation/login, session, logout, reset-password simulation | local session | token/session, role claims, password reset, invitation access | auth users, org membership |
| `participantService` | list/search/filter, detail, add, CSV upload, User history | fixtures + local persistence | participant CRUD, CSV ingest, duplicates, org scope | participants |
| `consentService` | consent screen, profile consent history, revoke, deletion request | local status changes | consent enforcement, revocation invalidation, deletion workflow | consents, privacy requests |
| `assessmentDraftService` | create/save tailored 12-step draft, approval state | local draft persistence | draft orchestration, approvals, immutable selected-item references | assessment drafts, draft questions |
| `agentDiscoveryService` | scripted chat, requirements profile, refine summary | deterministic mock script | real Agent orchestration, safe prompt policy, structured output validation | agent conversations, requirements profiles |
| `questionBankService` | query eligible source items by role, level, dimension, method | dynamically loads converted `item_bank`; excludes blocked/quarantine/non-eligible | server-authoritative governed selection | item bank, governance register |
| `adaptationService` | adapted wording + diff | scripted rephrasing; accepts text only | governed rephrasing with immutable metadata; method-family safeguards | item adaptations |
| `roleBlueprintService` | list, create, detail, lifecycle, versions, link context | fixtures + persistence | CRUD, validation workflow, versioning | role blueprints, versions |
| `contextProfileService` | list, create, detail, link blueprint | fixtures + persistence | CRUD, versioning | context profiles, versions |
| `assessmentService` | send, list, detail, remind, extend, cancel, timeline | creates assignment/invitation/reminders locally | assignment/session lifecycle, deadlines, invitation, reminders | assignments, sessions, invitations, reminders |
| `runtimeService` | load/save/pause/resume/submit responses | localStorage runtime | response capture, quality signals, submit trigger | responses, sessions |
| `scoringService` | frontend has no production calculation; optional mock report fixture trigger only | mock processing state | question-level scoring, confidence, response quality, Domain result synthesis | responses, scores, scoring versions |
| `governanceService` | mock eligibility and visibility helpers | deterministic mock gates | server-authoritative gates, release policy, suppression | governance config, release decisions |
| `domain6Service` | report fixture projection only | mock Domain 6 fixtures | CAI/DII/secondary derivation, confidence, prerequisites | context profiles, scores, Domain 6 outputs |
| `reportService` | list, Admin report, User-safe report, simulated PDF | fixtures + audience projection | reporting pipeline, audience projection, PDF | reports, sections, files |
| `comparisonService` | side-by-side comparison | reads eligible report fixtures; no ranking | comparison read model; no automated decision | scores, reports |
| `notificationService` | list, mark read, email state | local notifications | in-app + email fanout | notifications, email logs |
| `exportService` | seven exports, CSV, simulated PDFs, history | client CSV + mock jobs | async export, signed URLs, retention | exports, storage |
| `activityLogService` | Admin org-scoped activity page | local mock events | immutable audit-event read projection | audit events |
| `settingsService` | org settings, profile prefs | local persistence | organization prefs, notification prefs | org settings, profiles |
| `assessmentReminderService` | list scheduled reminders | local fixtures | reminder schedule read/dispatch | reminders |
| `invitationService` | list assessment invitations | local fixtures | invitation lifecycle read | invitations |

---

## Swap-ready seam (Spec 009)

Each service above is type-enforced by a contract interface in `frontend/src/services/contracts.ts`
(the de-facto API a future backend must satisfy — constitution IV). The aggregator
(`frontend/src/services/index.ts`) routes every export through the data-source boundary
(`frontend/src/services/dataSource.ts`): `mock` (default, the only working mode in V1) or `live`
(a typed stub in `frontend/src/services/live/liveStub.ts` that throws "live data source not wired in
V1"). The future backend fills the `live` adapter against the same contracts with **no UI/feature
code change** (FR-PVR-002). `tests/integration-seam` asserts contract coverage parity with this map.

---

## Future Endpoint Categories

| Category | Example endpoint family |
|---|---|
| Auth | `/auth/*` |
| Participants | `/participants/*` |
| Consent and privacy | `/consents/*`, `/privacy-requests/*` |
| Assessment drafts | `/assessment-drafts/*` |
| Agent discovery | `/assessment-drafts/{id}/discovery/*` |
| Question selection | `/question-bank/select` |
| Wording adaptation | `/question-bank/adapt` |
| Role blueprints | `/role-blueprints/*` |
| Context profiles | `/context-profiles/*` |
| Assignments and sessions | `/assessments/*`, `/sessions/*` |
| Runtime answers | `/sessions/{id}/responses`, `/sessions/{id}/submit` |
| Reports and PDFs | `/reports/*`, `/reports/{id}/pdf` |
| Comparison | `/comparison` |
| Notifications | `/notifications/*` |
| Exports | `/exports/*` |
| Activity | `/activity-log/*` |
| Settings | `/settings/*` |

---

## Production Security Handoff

Future backend must enforce:
- Admin organization scope,
- User self-scope,
- one-Admin V1 account rule,
- source-item immutability,
- no blocked item selection,
- validated blueprint requirement for Hiring Support operational role-fit,
- consent gate,
- report audience projection,
- no automated hire/reject behavior,
- version tags on outputs,
- and audit logging.
