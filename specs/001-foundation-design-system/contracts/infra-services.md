# Contract — Infrastructure Services & Governance (Foundation)

Foundation **implements** the cross-cutting infrastructure (`http`, `persistence`, `authService`, governance helpers) and **declares typed stubs** for every feature service in `../../000-shared/handoff-map.md` so specs 002–007 can consume stable signatures immediately. The full service-method catalogue is the master contract `../../000-master-scope/contracts/mock-services.md`; this file fixes the infra + governance contracts foundation owns. All methods are `Promise`-based, return typed models (`../data-model.md`), and reject with a typed `AppError` on simulated failure.

## `http.ts` — latency/error simulator

```ts
http.simulate<T>(produce: () => T, cfg?: Partial<HttpSimConfig>): Promise<T>
// resolves after a random delay in [minDelayMs,maxDelayMs];
// rejects with AppError when forceError or random < errorRate.
http.setGlobalConfig(cfg: Partial<HttpSimConfig>): void   // dev toggle for error/latency
```

## `persistence.ts` — namespaced, versioned localStorage

```ts
persistence.get<T>(key, version, fallback: T): T   // version mismatch → discard + return fallback
persistence.set<T>(key, version, data: T): void    // writes PersistedEnvelope<T>
persistence.remove(key): void
```

- Namespaced `nexus_*`; never throws on quota/parse errors (logs + returns fallback). No migration (research D2).

## `authService` — mock authentication (foundation-owned)

```ts
authService.loginAdmin(creds): Promise<Session>          // single Admin per org (V1)
authService.activateInvitation(code, password): Promise<Session>  // first access: User sets password
authService.loginUser(creds): Promise<Session>           // permanent V1 User account return sign-in
authService.getSession(): Promise<Session | null>
authService.logout(): Promise<void>
authService.requestReset(email): Promise<void>           // simulated
```

- No real credential validation; establishes a local session via `persistence`. Carries `role` for the guards. Org/self scope is advisory in V1, server-authoritative later.

## Governance helpers (`services/governance/*`) — pure, unit-tested

```ts
eligibility.isOperational(item, { jobLevel, useCase }): boolean
confidenceGate.band(standardError: number): ConfidenceBand
confidenceGate.visibilityFor(band, useCase): OutputVisibility
useCaseGate.allows(outputKind, useCase): boolean
visibilityEngine.resolve(output, { confidence, prerequisitesMet, restricted }): GovernanceDecision
toUserSafe(report: Report): UserSafeReport
```

Rules per `../../000-shared/status-models.md`; verified by SC-007. Derailment Risk is always `blocked`; restricted/blocked outputs surface only as omission explanations, never as data.

## Feature service stubs (typed signatures only here)

Foundation declares typed interfaces for: `participantService`, `consentService`, `assessmentDraftService`, `agentDiscoveryService`, `questionBankService`, `adaptationService`, `roleBlueprintService`, `contextProfileService`, `assessmentService`, `runtimeService`, `scoringService`, `domain6Service`, `reportService`, `comparisonService`, `notificationService`, `exportService`, `activityLogService`, `settingsService`.

- Signatures and per-service governance are defined in `../../000-master-scope/contracts/mock-services.md`; future FastAPI/Supabase mapping in `../../000-shared/handoff-map.md`.
- `questionBankService` is the only consumer of the code-split `mocks/governed-bank.ts` (dynamic `import()`, research D3).
- Implementations are delivered by the owning specs (002–007); foundation guarantees the types compile under `strict` and that one sample render proves the service→UI seam end-to-end (SC-004).
