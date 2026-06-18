# Contract: Service Contracts & Data-Source Boundary (US1)

The swap-ready seam. Components consume `@/services` only; the aggregator routes through a mode selector. `mock` is the default and the only working mode in V1; `live` is a typed stub the future backend fills. No real network (constitution I).

## Contract interfaces (`services/contracts.ts`)

One interface per service mirroring today's signatures — the de-facto API a future backend must satisfy (constitution IV). Mock services assert conformance via `satisfies`:

```ts
export const reportService = { /* ... */ } satisfies ReportServiceContract;
```

Coverage: a contract interface for each exported service (auth, participant, assessment, assessmentDraft, agentDiscovery, adaptation, roleBlueprint, contextProfile, report, comparison, runtime, consent, notification, export, settings, questionBank, activityLog, invitation, assessmentReminder). The scoring/domain6 stubs remain `notImplemented` throwers (owned by the future backend) and need no contract beyond their stub signature.

## Data-source boundary (`services/dataSource.ts`)

```ts
export type DataSourceMode = 'mock' | 'live';
export function getMode(): DataSourceMode;   // 'mock' default; env/config override (+ dev-only localStorage)
export function isLive(): boolean;
```

- Default `mock` → existing behavior unchanged.
- `live` → `services/live/liveStub.ts`, whose every method throws `Error('live data source not wired in V1')`.
- The aggregator (`services/index.ts`) selects per mode. Switching modes requires **no UI/feature code change** (FR-PVR-002 / SC-002).

## Tests (`tests/integration-seam/`)

- **Conformance**: each mock service `satisfies` its contract (compile-time, enforced by `tsc`); a runtime test asserts every exported service name has a matching contract interface (drift guard, SC-003).
- **Mode switch**: with `mock` (default) a representative call resolves as today; with `live` selected, the same call rejects with the "not wired in V1" error through the same interface (SC-002) — proving the seam without network.
- **Boundary**: extends the Spec 008 import-boundary check (no component imports fixtures/persistence; all go through `@/services`).

## Handoff sync

`specs/000-shared/handoff-map.md` maps each contract method → future FastAPI/Supabase responsibility; kept in sync with `contracts.ts` (a test asserts coverage parity).
