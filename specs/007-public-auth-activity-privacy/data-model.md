# Phase 1 Data Model: Public/Auth Recovery, Activity Log & Privacy Inbox

Canonical shapes come from `specs/000-shared/data-model.md` (§3 Consent & Privacy `DataDeletionRequest`; Activity events). This feature **extends** `DataDeletionRequest` with new **optional** fields only (F1-safe — no breaking changes) and adds mock reset-token state. `ActivityLogEvent` already exists in `models` and is reused unchanged.

## Extended type — `DataDeletionRequest` (add optional fields)

```ts
interface DataDeletionRequest {
  id: string;
  participantId: string;
  submittedAt: string;
  status: 'Submitted' | 'In Review' | 'Completed' | 'Rejected';
  note?: string;          // requester's note (Spec 006)
  reason?: string;        // NEW — Admin's reason, REQUIRED when status === 'Rejected' (FR-PAP-006)
  resolvedAt?: string;    // NEW — set when moved to a terminal state (Completed/Rejected)
}
```

State transitions (Admin inbox — status-only, no data removed; D3):
`Submitted` → **In Review** → **Completed (resolvedAt)** | **Rejected (reason, resolvedAt)`
- `Submitted` → **Rejected** directly is allowed (reason required).
- `Completed`/`Rejected` are **terminal** (controls disabled; not re-actionable).
- The requesting User's Profile & Privacy view reads the same store, so the new status is reflected automatically (SC-001).

## Reused type — `ActivityLogEvent` (unchanged; curated read-only)

```ts
interface ActivityLogEvent {
  id: string;
  organizationId: string;
  actorName: string;
  action: string;       // e.g., 'sent assessment', 'released report', 'revoked consent', ...
  targetType: string;   // 'Assessment' | 'Report' | 'Consent' | 'Blueprint' | 'User' | 'Export' | 'Invitation' | ...
  targetId?: string;
  detail?: string;
  createdAt: string;    // ISO timestamp
}
```

Curated fixture set MUST cover all enumerated event types (D4): assessment sent, report released / released with caution, consent revoked, data-deletion requested, blueprint validated, user added, export generated, invitation expired. Each is organization-scoped (`organizationId`).

Client-side filter (pure; no new type, AND semantics):
```ts
filterEvents(events, { q, type, actor, date }): ActivityLogEvent[]
// q → substring over action/target/detail/actor; type → targetType; actor → actorName; date → createdAt day
```

## New mock type — reset-token state (no persistence)

```ts
type ResetTokenState = 'valid' | 'expired' | 'missing';
// authService.verifyResetToken(token): missing/'' → 'missing'; 'expired'|'used' → 'expired'; else → 'valid'
// authService.resetPassword(token, password): Promise<{ ok: true }>  // mock; no real credential change
```

Password validation (client-side, FR-PAP-002): non-empty, min length (≥8), and `password === confirm`; otherwise inline error blocks submit.

## Relationships & scope

- `DataDeletionRequest.participantId` ties a request to the requesting User; the inbox is **organization-scoped** (Admin's org) and the User sees only their own (constitution III).
- `ActivityLogEvent.organizationId` scopes the log to the Admin's organization.
- Reset-token state is ephemeral (URL `?token=` only); no entity persisted.

## Validation & invariants

- **III / scope** — privacy inbox + Activity Log render only under an Admin session and only the current org's data; Users never see another User's data.
- **I / mock** — deletion resolution changes status only; no User data removed; reset changes no real credential; no real email/audit.
- **Privacy** — forgot-password never reveals account existence (SC-003); `Rejected` always carries a `reason`.
- **Terminal** — `Completed`/`Rejected` deletion requests are not re-actionable.
