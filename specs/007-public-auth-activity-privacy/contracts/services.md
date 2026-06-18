# Service Contracts: Public/Auth Recovery, Activity Log & Privacy Inbox

Deltas over existing services. All methods are Promise-based with simulated latency via `mockRequest` (constitution IV — services are the only data boundary). No real auth, email, audit, or data deletion (constitution I).

## `authService` (add reset methods)

```ts
authService = {
  // ...existing: getSession, loginAdmin, activateInvitation, loginUser, requestReset, logout

  // Verify the mock reset token from the reset URL's ?token= (research D1).
  verifyResetToken(token: string): Promise<'valid' | 'expired' | 'missing'>;

  // Mock password reset — returns ok for a valid token; performs NO real credential change.
  resetPassword(token: string, password: string): Promise<{ ok: true }>;
};
```

- `requestReset(email)` (exists) is called for any email and always yields the same neutral confirmation (no enumeration — D2/SC-003).
- `verifyResetToken`: `''`/missing → `'missing'`; `'expired'`/`'used'` → `'expired'`; else → `'valid'`.

## `consentService` (add Admin-side resolution)

```ts
consentService = {
  // ...existing (Spec 006): forAssessment, forParticipant, history, accept, decline, revoke,
  //                         requestDeletion, deletionRequests (current User's own)

  // Org-scoped list for the Admin privacy inbox.
  allDeletionRequests(): Promise<DataDeletionRequest[]>;

  // Status-only resolution (D3). 'Rejected' requires a reason; sets resolvedAt on terminal states.
  resolveDeletion(
    id: string,
    status: 'In Review' | 'Completed' | 'Rejected',
    reason?: string,
  ): Promise<DataDeletionRequest>;
};
```

- Resolution writes via `consentStore.updateDeletionRequest`; the User's own `deletionRequests()` reads the same store, so status reflects in the User view (SC-001).
- `resolveDeletion` rejects (mock error) if `status === 'Rejected'` and no `reason`, or if the request is already terminal.

## `consentStore` (add update)

```ts
consentStore = {
  // ...existing: all, byParticipant, byAssessment, find, upsert, deletionRequests, addDeletionRequest, __resetForTest
  updateDeletionRequest(req: DataDeletionRequest): void;  // replace by id; persists
};
```

## `activityLogService` (curated read + filter)

```ts
activityLogService = {
  list(): Promise<ActivityLogEvent[]>;  // exists — expand fixtures to cover all enumerated types (D4)
};
// Filtering is pure client-side (no service change):
filterEvents(events, { q, type, actor, date }): ActivityLogEvent[]   // AND semantics
```

## Service → future backend mapping (handoff)

| Mock method | Future responsibility |
|---|---|
| `authService.requestReset/verifyResetToken/resetPassword` | Auth API: reset-email issuance, token verification, credential update |
| `consentService.allDeletionRequests/resolveDeletion` | Privacy API: deletion-request queue + real erasure workflow + audit |
| `activityLogService.list` | Immutable audit log query (this prototype view is read-only and curated) |
