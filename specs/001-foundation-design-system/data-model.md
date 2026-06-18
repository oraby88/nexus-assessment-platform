# Phase 1 — Data Model (Foundation slice)

**Source of truth**: `../000-shared/data-model.md` (full TypeScript inventory, 543-item `item_bank`, 31 source columns). This file records **what the foundation authors and how**, not a re-definition of every entity. Foundation transcribes the shared inventory into `src/models/*` and establishes the immutability and persistence typing every other spec relies on.

## 1. What the foundation authors

- **All enums/unions** from `../000-shared/data-model.md` §1 (e.g., `Role`, `DomainId`, `MethodFamily`, `BankState`, `UseStatus`, `ReviewStatus`, `JobLevelOverlay`, lifecycle/validity/report/blueprint/context/consent statuses, `ConfidenceBand`, `OutputVisibility`, `AdaptationMode`, `ExportStatus`) and `SE_THRESHOLDS`.
- **All interfaces** from §2–§12: `Organization`, `Session`, `Participant`/`Candidate`, consent/privacy, construct taxonomy, `ItemBankItem`, adaptation, AI discovery, `RoleBlueprint`/`ContextProfile`, draft/assignment/invitation/reminder, runtime + scoring attribution, reports + Domain 6, comparison/notification/export/timeline/activity.
- These are **type-only** declarations under `src/models/`. Foundation does not implement feature behavior over them — it guarantees the types exist, compile under `strict`, and enforce immutability.

## 2. Foundation-specific entities (substrate, not in the shared inventory)

These exist only to support the foundation infrastructure:

| Entity | Shape (summary) | Notes |
|---|---|---|
| `ThemePreference` | `'light' \| 'dark' \| 'system'` (stored value) | Resolved against `prefers-color-scheme` when `system`/unset (research D1) |
| `PersistedEnvelope<T>` | `{ v: number; data: T }` | Versioned wrapper; version mismatch → discard + default (research D2) |
| `AsyncState<T>` | `{ status: 'idle'\|'loading'\|'error'\|'success'; data?: T; error?: AppError }` | Returned by the `useAsync` hook over services |
| `AppError` | `{ code: string; message: string; retryable: boolean }` | Typed rejection from services / `http.ts` |
| `HttpSimConfig` | `{ minDelayMs: number; maxDelayMs: number; errorRate: number; forceError?: boolean }` | Drives latency/error simulation |
| `NavItem` | `{ key: string; label: string; route: string; icon: string }` | Admin (13) + User (7) navigation registries |
| `GovernanceDecision` | `{ visibility: OutputVisibility; reason?: string }` | Output of the governance helpers |
| `Toast` | `{ id: string; tone: 'info'\|'success'\|'warn'\|'error'; message: string; ttlMs?: number }` | Aria-live toast host |

## 3. Immutability rules (typed)

- `ItemBankItem` is consumed as `Readonly<ItemBankItem>` everywhere; `SelectedQuestion.item` and `ScoringAttribution.immutableItemReference` are already `Readonly<ItemBankItem>` in the shared inventory.
- The source-item immutability list (`../000-shared/data-model.md` §5) MUST never be mutated by any service or component: `itemId`, domain, dimension, facet, method family, item format, response scale, keyed answer, options, loading type, bank state, use status, validation track, job-level overlay, reverse-scored flag, review status.
- Fields absent from the source workbook (`weight`, `difficulty`) MUST NOT be added to `ItemBankItem` or displayed as data.

## 4. Persistence keys & versioning

| Key | Payload | Version | Mismatch behavior |
|---|---|---|---|
| `nexus_theme` | `ThemePreference` | n/a (forward-compatible string) | unknown value → treat as `system` |
| `nexus_runtime_v1` | `RuntimeState` | `1` | discard + start fresh |
| `nexus_drafts_v1` | explicit wizard draft(s) | `1` | discard + start fresh |

All keys are namespaced (`nexus_*`); transient UI state (filters, scroll) is **not** persisted.

## 5. Governance-decision derivation (foundation helpers)

Per `../000-shared/status-models.md`:
- **Eligibility** (`eligibility.ts`): item is operational only if `bankState='production'`, `useStatus≠'operational_blocked'`, `reviewStatus≠'quarantine_pending_dif_review'`, satisfies `jobLevelOverlay` and use-case rule; pilot/research excluded from operational sets.
- **Confidence gate** (`confidenceGate.ts`): map `standardError` → `ConfidenceBand` via `SE_THRESHOLDS`; High→visible, Moderate→visible-with-caution (developmental) / downgraded (hiring), Low→downgraded/hidden, Unacceptable→hidden.
- **Use-case gate** (`useCaseGate.ts`): suppress restricted outputs (e.g., values-alignment) in hiring context unless permitted.
- **Visibility engine** (`visibilityEngine.ts`): combine confidence + prerequisites + restrictions → `OutputVisibility` (`visible`/`visible_with_caution`/`downgraded`/`hidden`/`blocked`/`not_generated`); Derailment Risk always `blocked`.
- **User-safe projection** (`toUserSafe.ts`): `Report → UserSafeReport`, stripping raw responses, formulas, scoring/synthesis versions, internal flags, blocked values, Admin notes, and source-item metadata; Domain 6 reduced to a safe high-level summary only where permitted.
