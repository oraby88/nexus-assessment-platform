# Contract — Service Methods (Role Blueprints & Context Profiles)

Completes the typed `roleBlueprintService`/`contextProfileService` stubs from Spec 001 (currently
fixture-backed `list`/`get` in `frontend/src/services/index.ts`). All `Promise`-based via `mockRequest`
(simulated latency + injectable error), typed models, org-scoped, mirroring `../../000-shared/handoff-map.md`.

## roleBlueprintService (extend existing `list`/`get`)
```ts
create(input: Omit<RoleBlueprint, 'id' | 'version' | 'versionHistory' | 'updatedAt' | 'assessmentsUsed'>): Promise<RoleBlueprint>
update(blueprint: RoleBlueprint): Promise<RoleBlueprint>           // appends a VersionEntry
duplicate(id: string): Promise<RoleBlueprint>                      // copy as Draft, new id/version
setStatus(id: string, status: BlueprintStatus): Promise<RoleBlueprint>  // free-form; Archived terminal (D1)
versions(id: string): Promise<VersionEntry[]>
link(blueprintId: string, contextId: string): Promise<RoleBlueprint>    // two-way (D6)
isEligible(b: RoleBlueprint, opts?: { useCase?: UseCase }): boolean      // not Deprecated/Archived; Validated for hiring_support (D7)
```
Future: CRUD, validation workflow, versioning.

## contextProfileService (extend existing `list`/`get`)
```ts
create(input: Omit<ContextProfile, 'id' | 'version' | 'versionHistory' | 'updatedAt'>): Promise<ContextProfile>
update(context: ContextProfile): Promise<ContextProfile>          // appends a VersionEntry
duplicate(id: string): Promise<ContextProfile>
setStatus(id: string, status: ContextStatus): Promise<ContextProfile>   // Draft/Active/Archived (Archived terminal)
versions(id: string): Promise<VersionEntry[]>
link(contextId: string, blueprintId: string): Promise<ContextProfile>   // mirrors blueprint link
```
Future: CRUD, versioning.

## lib/dimensions.ts (new) — dimension catalog (D2)
```ts
dimensionCatalog(): Promise<DimensionCatalogEntry[]>   // distinct {dimensionId,dimensionName,domainId} from item_bank, deduped+sorted
```
Loads the governed bank via `questionBankService` (lazy/code-split); never fabricates dimensions.

## Pure derivations (feature helpers)
```ts
contextSignature(values: ContextProfileValues): ContextSignatureData   // axes + plain-language summary (D4)
```

## Reused services
`questionBankService` (Spec 001) for the dimension catalog source; foundation charts
(`ContextRadar`, `ContextSignature`, `DimensionBars`) for the live signature; `persistence` (versioned).

## Consumption seam (Spec 003)
Spec 003 pickers call `roleBlueprintService.list`/`isEligible` and `contextProfileService.list`; the
"create new" entries route to the builders here. Linked pairs are surfaced when a blueprint is chosen.
