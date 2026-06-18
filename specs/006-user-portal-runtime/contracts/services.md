# Service Contracts: User Portal & Assessment Runtime

Deltas over the Spec 001 stubs. All methods are Promise-based with simulated latency via `mockRequest` (constitution IV — services are the only data boundary; components never import fixtures/persistence). Signatures are the de-facto API contract for a future FastAPI/Supabase backend (`specs/000-shared/handoff-map.md`). **No method performs production scoring or returns a live score** (constitution VIII).

## `runtimeService` (completes the Spec 001 stub)

```ts
runtimeService = {
  // Load the fixed pre-resolved item set (Spec 003) + rehydrated progress (D3, D1).
  load(assessmentId: string): Promise<RuntimeSession>;

  // Persist an answer keyed by source Question ID; recompute progress; stamp lastSavedAt (auto-save).
  answer(assessmentId: string, sourceQuestionId: string, value: number | string): Promise<RuntimeState>;

  // Move position. next() requires the current item answered; goTo() allows free back-navigation
  // to any already-answered index (D2). Both persist.
  next(assessmentId: string): Promise<RuntimeState>;
  back(assessmentId: string): Promise<RuntimeState>;
  goTo(assessmentId: string, index: number): Promise<RuntimeState>;

  // Pause / resume (persisted) — supports leave-and-return (D1).
  pause(assessmentId: string): Promise<RuntimeState>;
  resume(assessmentId: string): Promise<RuntimeState>;

  // Submit → sets submittedAt → Completion state. No score returned.
  submit(assessmentId: string): Promise<{ ok: true; submittedAt: string }>;

  // Current persisted progress without reloading the item set (for dashboard hero / resume cards).
  getProgress(assessmentId: string): Promise<RuntimeState | null>;
};
```

- **Persistence**: versioned envelope at `StorageKeys.runtime` (`nexus_runtime_v1`, `SchemaVersions.runtime = 1`) keyed by `assessmentId`; schema-mismatch safely discards (research D1 / Spec 001 D2).
- **Invariants**: `answers` keyed by `sourceQuestionId`; `items` never mutated; no scoring; reload restores `questionIndex` + `answers` 100% (SC-002).
- **Errors**: unknown `assessmentId` → rejects (caller shows empty/expired state); simulated save failure surfaces retry without losing in-memory answers (spec Edge Case).

## `consentService` (completes the Spec 001 stub)

```ts
consentService = {
  // Consents for an assessment; optional ones included only when applicable (D5).
  forAssessment(assessmentId: string): Promise<ConsentRecord[]>;

  accept(consentId: string): Promise<ConsentRecord>;     // → Granted (grantedAt); writes shared store
  decline(consentId: string): Promise<ConsentRecord>;    // → Declined (declinedAt); neutral dashboard return
  revoke(consentId: string): Promise<ConsentRecord>;     // honored only if revocable; → Revoked (revokedAt)

  history(): Promise<ConsentRecord[]>;                    // current User's consent history (Profile & Privacy)

  requestDeletion(note?: string): Promise<DataDeletionRequest>;  // creates pending 'Submitted' (D7)
};
```

- **Eligibility (D5)**: optional consents `revocable: true` always; required consent `revocable: true` until its assessment's report is released, then `false`.
- **Propagation (D6)**: accept/decline/revoke and `requestDeletion` write to the shared `consentStore` that the Admin User-Detail **Consent** tab (Spec 002) reads — revocation reflects there (SC-006). No circular service import.
- **Scope**: all reads/writes filter by the current `participantId`/`organizationId` (constitution III).

## `consentStore` (new internal module — not a UI-facing service)

```ts
// Pattern mirrors services/blueprintContextStore.ts (Spec 004): versioned localStorage, no component access.
consentStore = {
  all(): ConsentRecord[];
  upsert(record: ConsentRecord): void;
  byParticipant(participantId: string): ConsentRecord[];
  deletionRequests(): DataDeletionRequest[];
  addDeletionRequest(req: DataDeletionRequest): void;
};
```

## Consumed (unchanged) services

- `reportService.getUserSafe(reportId)` → `UserSafeReport` (Spec 005) — **only** source for the User report; `downloadPdf(id)` records export-history (Spec 002).
- `notificationService.list()/unreadCount()/markRead()/markAllRead()` — User notifications (own-data view).
- `assessmentService` — the User's own assessment list/history (own-data filter).
- `exportService.recordPdf('reports')` — simulated PDF (via `reportService.downloadPdf`).
- `authService.activateInvitation()/loginUser()/getSession()/logout()` — User session (Spec 001).

## Service → future backend mapping (handoff)

| Mock method | Future responsibility |
|---|---|
| `runtimeService.load/answer/submit` | Assessment runtime API: serve resolved items, persist responses keyed by source item, accept submission (scoring is backend, not here) |
| `consentService.*` | Consent API: per-use-case grant/decline/revoke + audit; deletion-request intake |
| `consentStore` | Supabase consent + privacy-request tables (read by Admin) |
