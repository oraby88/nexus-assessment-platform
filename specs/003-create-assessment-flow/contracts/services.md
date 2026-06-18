# Contract — Create Assessment Service Methods

Completes the typed stubs created in Spec 001 (`frontend/src/services/index.ts`) and reuses
implemented services. All `Promise`-based via `mockRequest` (simulated latency + injectable error),
typed models, mirroring `../../000-shared/handoff-map.md`. Signatures are the future API contract.

## agentDiscoveryService (complete stub) — deterministic scripted (D1)
```ts
start(useCase: UseCase): Promise<AgentTurn>                 // first scripted question (param by use case)
next(answers: DiscoveryAnswer[]): Promise<{ turn: AgentTurn | null; requirements: JobRequirementsProfile }>
summary(answers: DiscoveryAnswer[]): Promise<JobRequirementsProfile>
```
Fixed canonical sequence; each answer maps to requirements fields; `turn = null` signals completion.
No live model. Future: real Agent orchestration with safe-prompt policy + structured-output validation.

## questionBankService (reuse, Spec 001) + proposal helper
```ts
select(criteria): Promise<ItemBankItem[]>                   // eligible only (existing)
propose(profile: JobRequirementsProfile, jobLevel, useCase): Promise<SelectedQuestion[]>  // D3 auto-set
```
`propose` filters via `selectEligible` then deterministically covers each critical dimension up to a
target count. Pilot/research/blocked/quarantine excluded. Future: server-authoritative selection.

## adaptationService (complete stub) — text-only (D2/D5)
```ts
adapt(input: { itemId: string; adaptedText: string; item: Readonly<ItemBankItem> }): Promise<AdaptedQuestionText>
canAdapt(methodFamily: MethodFamily): boolean              // false for sjt + cognitive_multiple_choice in V1
```
Accepts display text only; returns original/adapted/`diff: DiffSpan[]`/mode/reason. For non-adaptable
families returns the original with an "Original wording retained" note. Never mutates source metadata.

## coverage (pure helper in feature or governance)
```ts
computeCoverage(selected: SelectedQuestion[], profile: JobRequirementsProfile): CoverageReport
```
Domain/dimension/requirement/method counts + estimated duration; warnings per D4 (0 → warning, 1 → note).

## assessmentDraftService (complete stub) — orchestration + send (D6/D7)
```ts
create(participantId: string): Promise<AssessmentDraft>
save(draft: AssessmentDraft): Promise<AssessmentDraft>     // persists via versioned store (nexus_drafts_v1)
get(id: string): Promise<AssessmentDraft | undefined>
approve(id: string): Promise<AssessmentDraft>              // sets approved = true
send(draft: AssessmentDraft): Promise<{ assignment: AssessmentAssignment; invitation: AssessmentInvitation }>
```
`send` requires `draft.approved`; creates a Not-Started assignment + invitation + `TimelineEvent` +
`AppNotification` (simulated email) in the Spec 002 assessment store so it appears in monitoring.
Future: draft orchestration, approvals, immutable selected-item references, assignment lifecycle.

## Reused services
`participantService` (select/add user — Spec 002), `roleBlueprintService`/`contextProfileService`
(pick/create-entry — Spec 004), `services/governance` (`selectEligible`, job-level overlay — Spec 001).

## New infra
`lib/diffWords.ts` — `diffWords(original, adapted): DiffSpan[]` (dependency-free LCS over tokens).
