# Contract — Admin Core Service Methods

Admin Core completes methods on the typed mock services whose stubs already exist from Spec 001
(`frontend/src/services/index.ts`). All methods are `Promise`-based via `mockRequest` (simulated
latency + injectable error), return typed models, are org-scoped, and mirror
`../../000-shared/handoff-map.md`. Signatures are the future API contract.

## participantService (extend existing `list`/`get`)
```ts
add(input: AddUserInput): Promise<Participant>            // dup-email rejected with typed error
bulkUpload(csvText: string): Promise<BulkUploadResult>    // classify valid/invalid/duplicate (no import)
confirmImport(rows: CsvRowResult[]): Promise<Participant[]> // import only valid rows
history(participantId: string): Promise<AssessmentAssignment[]>
```
Future: participant CRUD, CSV ingest, duplicate detection, org scope.

## assessmentService (extend fixture-backed `list`/`get`)
```ts
timeline(assessmentId: string): Promise<TimelineEvent[]>
remind(assessmentId: string): Promise<AssessmentAssignment>
resendInvitation(assessmentId: string): Promise<AssessmentInvitation>
extendDeadline(assessmentId: string, deadline: string): Promise<AssessmentAssignment>
cancel(assessmentId: string): Promise<AssessmentAssignment>   // → Cancelled (terminal)
```
Each mutates mock state, appends a `TimelineEvent`, and emits an `AppNotification` with a simulated
email-delivery state. Actions reject/disable on terminal lifecycle states. Future: assignment/session
lifecycle, deadlines, invitations, reminders.

## notificationService (extend `list`)
```ts
markRead(id: string): Promise<void>
markAllRead(): Promise<void>
```
Items carry `email` (Not Required / Queued / Sent / Failed) display indicator. Future: in-app + email fanout.

## exportService (framework + Users/Assessments)
```ts
registry(): Promise<ExportRegistryEntry[]>                 // 7 types; available flag per D2
request(type: ExportType, query?): Promise<ExportJob>      // Users/Assessments → CSV; others rejected as pending
history(): Promise<ExportJob[]>
download(id: string): Promise<void>                        // CSV real; PDF simulated
```
Future: async export, signed URLs, retention.

## settingsService (implement stub)
```ts
get(): Promise<OrgSettings>          // org + single Admin profile + sections
update(patch: Partial<OrgSettings>): Promise<OrgSettings>  // one-Admin rule enforced
```
Future: organization prefs, notification prefs persistence.

## authService (reuse from 001)
`getSession`, `logout`, profile read for My Profile; password-change is simulated.

## lib/csv.ts (new infra)
```ts
toCsv(rows: Record<string, unknown>[], columns: string[]): string
parseCsv(text: string): Record<string, string>[]
```
Dependency-free; used by both exports and bulk upload (research D3).
