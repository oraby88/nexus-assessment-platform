# Phase 1 — Data Model (Admin Core slice)

**Source of truth**: `../000-shared/data-model.md` and the types authored in Spec 001 (`frontend/src/models/`). This file records the entities/views Admin Core **uses**, plus the small additions its flows need. It does not redefine the shared inventory.

## 1. Entities consumed (from 001 models)

| Entity | Used by | Key fields Admin Core reads/writes |
|---|---|---|
| `Participant` | Users list/detail, Add, Bulk upload | id, fullName, email, currentJobTitle, targetJobTitle, jobLevel, departmentText, organizationId, notes, dateAdded, totalAssessments, latestAssessmentLifecycle, latestReportStatus |
| `AssessmentAssignment` | Assessments list/detail, Dashboard | id, participantId, useCase, targetRole, jobLevel, assignedAt, deadline, **lifecycleStatus**, **validityStatus**, progressPercent, reportStatus |
| `AssessmentInvitation` | Assessment detail (resend) | id, assessmentId, participantId, email, status, sentAt, expiresAt |
| `AssessmentReminder` | Assessment detail (remind history) | id, assessmentId, kind, channel, scheduledFor, status |
| `AppNotification` | Notifications, Dashboard | id, type, title, body, time, read, email |
| `ExportJob` | Exports | id, organizationId, type, status, progressPercent, downloadUrl, createdAt |
| `Organization`, `Session` | Settings, Profile, shell | org identity + signed-in Admin |

## 2. Additions for Admin Core

| Type | Shape (summary) | Notes |
|---|---|---|
| `AddUserInput` | `{ fullName; email; currentJobTitle?; targetJobTitle?; jobLevel; departmentText?; notes? }` | Drawer form payload (FR-ADM-003) |
| `CsvRowResult` | `{ row: number; raw: Record<string,string>; status: 'valid'\|'invalid'\|'duplicate'; reasons?: string[]; participant?: AddUserInput }` | Output of `lib/csv.ts` classification (FR-ADM-004) |
| `BulkUploadResult` | `{ valid: CsvRowResult[]; invalid: CsvRowResult[]; duplicate: CsvRowResult[] }` | Preview before confirm |
| `TimelineEvent` | `{ id; entityType; entityId; label; detail?; createdAt }` | Appended by assessment actions (from shared data-model §12) |
| `AssessmentAction` | `'remind' \| 'resendInvitation' \| 'extendDeadline' \| 'cancel'` | Detail actions (FR-ADM-007) |
| `ExportRegistryEntry` | `{ type: ExportType; label; available: boolean; ownedBy: '002'\|'004'\|'005' }` | Drives which exports are active vs pending (D2) |
| `OrgSettings` | `{ organization: Organization; admin: {name; email; preferences}; sections: {...} }` | One-Admin settings (FR-ADM-010) |

## 3. Validation rules

- **Add User / CSV row valid**: `fullName` non-empty; `email` well-formed; `jobLevel` ∈ the `JobLevel` enum. Optional fields free-form.
- **Duplicate**: `email` already present in the org roster **or** earlier in the same upload file (case-insensitive) → `duplicate` (clarification Q1 / D1).
- **Import**: only `valid` rows are persisted on confirm; `invalid`/`duplicate` are surfaced with reasons, never imported.
- **Action eligibility**: management actions are offered only when the assignment's `lifecycleStatus` permits (e.g., no reminder on `Completed`/`Cancelled`/`Expired`).

## 4. State transitions (mock, advisory)

- **Assignment** (`lifecycleStatus`, from `../000-shared/status-models.md`): `Not Started → In Progress → Submitted → Processing → Completed`; `→ Expired` on deadline; `→ Cancelled` via cancel action (terminal).
- **Invitation**: `Sent → Opened`; resend re-issues a `Sent` event; `→ Expired`/`Cancelled`.
- **Validity** evolves independently of lifecycle (never merged).
- **Notification**: `unread → read` (mark read / mark all read); `email` delivery indicator is display-only.
- **Export job**: `Queued → Processing → Ready` (or `Failed`); Users/Assessments run to `Ready`; pending types stay non-requestable.

## 5. Service ownership

Admin Core completes methods on the typed stubs from Spec 001 (`frontend/src/services/index.ts`): `participantService.add/bulkUpload`, `assessmentService.get/timeline/remind/resendInvitation/extendDeadline/cancel`, `notificationService.markRead/markAllRead`, `exportService.request/history/download` (+ registry), `settingsService.get/update`. See `./contracts/services.md`.
