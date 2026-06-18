# Contract — Mock Service Layer (Frontend Prototype)

The frontend exposes no public API; its "contracts" are the **typed mock-service interfaces** that are the sole data boundary (constitution Principle IV). Each is async (`Promise`), returns typed models (`../../000-shared/data-model.md`), simulates latency + error, and maps 1:1 to a future FastAPI/Supabase responsibility (`../../000-shared/handoff-map.md`). Signatures below are the stable contract a later backend must satisfy without a UI rewrite.

> Conventions: all methods reject with a typed error on simulated failure; list methods accept `{ search?, filters?, sort?, page? }`; governance is enforced inside services (advisory in V1, server-authoritative later).

| Service | Representative methods (inputs → output) | Governance enforced |
|---|---|---|
| `authService` | `loginAdmin(creds)→Session` · `activateInvitation(code, password)→Session` (first access) · `loginUser(creds)→Session` (permanent V1 account) · `getSession()→Session?` · `logout()` · `requestReset(email)` | role claim; org/self scope |
| `participantService` | `list(query)→Participant[]` · `get(id)→Participant` · `add(input)→Participant` · `bulkUpload(csv)→{valid,invalid,duplicate}` · `history(id)→Assessment[]` | org scope |
| `consentService` | `forAssessment(id)→ConsentRecord[]` · `grant(useCase)` · `revoke(useCase)` · `requestDeletion()→DataDeletionRequest` | per-use-case gate; revocation invalidates |
| `assessmentDraftService` | `create(participantId)→draft` · `save(draft)` · `get(id)→draft` · `approve(id)` | approval required before send |
| `agentDiscoveryService` | `next(answers)→{question,chips,requirements}` · `summary()→RequirementsProfile` | scripted; no live model |
| `questionBankService` | `select({domain,dimension,level,method,useCase})→ItemBankItem[]` | excludes blocked/quarantine/pilot/research; eligibility rule |
| `adaptationService` | `adapt({itemId, adaptedText})→AdaptedQuestionText` | **text-only**; metadata immutable; method safeguards |
| `roleBlueprintService` | `list/get/create/update/duplicate/setStatus/link(contextId)` · `versions(id)` | Validated gate for Hiring-Support |
| `contextProfileService` | `list/get/create/update/duplicate/setStatus/link(blueprintId)` · `versions(id)` | — |
| `assessmentService` | `list/get` · `send(draftId)→Assessment` · `remind/extend/resend/cancel` · `timeline(id)` | send requires approval |
| `runtimeService` | `load(assessmentId)→RuntimeState` · `save(state)` · `submit(id)` | responses keyed by `itemId`; no client scoring |
| `scoringService` | `getReportFixture(assessmentId)→Report` (mock processing only) | no production scoring in UI |
| `domain6Service` | `getDomain6(reportId)→Domain6` (fixture projection) | provisional/omitted treatment |
| `reportService` | `list(query)→Report[]` · `getAdmin(id)→Report` · `getUserSafe(id)→UserSafeReport` · `downloadPdf(id)` (simulated) | audience projection; visibility gates |
| `comparisonService` | `build({role,blueprint,context,candidates,dimensions})→Comparison` | no ranking / no auto-decision |
| `notificationService` | `list(query)→AppNotification[]` · `markRead(id)` · `markAllRead()` | recipient scope; email indicator |
| `exportService` | `request(type,query)→ExportJob` · `history()→ExportJob[]` · `download(id)` | 7 types; CSV real / PDF simulated |
| `activityLogService` | `list(query)→ActivityEvent[]` · `exportCsv(query)` | org-scoped read view |
| `settingsService` | `get()→OrgSettings` · `update(patch)` | one-Admin V1 rule |

**Cross-cutting infra contracts**: `http.ts` (latency + error simulation), `persistence.ts` (namespaced/versioned localStorage), `governance/{eligibility,confidenceGate,useCaseGate,visibilityEngine,toUserSafe}`.

See `../../000-shared/handoff-map.md` for the future endpoint families and Supabase tables behind each service.
