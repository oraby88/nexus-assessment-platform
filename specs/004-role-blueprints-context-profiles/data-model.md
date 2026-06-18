# Phase 1 — Data Model (Role Blueprints & Context Profiles slice)

**Source of truth**: `../000-shared/data-model.md` §8 and the types in Spec 001 (`frontend/src/models/`, where `RoleBlueprint`/`ContextProfile`/`VersionEntry` already exist as the Admin-Core slice). This file records what this feature uses and the additions its builders need.

## 1. Entities consumed (from 001 models / shared)

| Entity | Used by | Notes |
|---|---|---|
| `RoleBlueprint` | blueprint list/builder/detail | extend with full field set below |
| `ContextProfile` | context list/builder/detail | extend with `values` + notes below |
| `VersionEntry` | both detail Version History | `{ version, date, summary, status? }` |
| `ItemBankItem` (read-only) | dimension catalog derivation | via `questionBankService` |

## 2. Field set used/extended

`RoleBlueprint` (per master §11): id, organizationId, name, roleTitle, jobFamily, jobLevel, purpose,
responsibilities[], workContext, successIndicators[], failureRisks[], nonNegotiables[],
requiredDimensionIds[], optionalDimensionIds[], excludedDimensionIds[], dimensionImportance[],
evidence[], version, status (`BlueprintStatus`), linkedContextProfileId?, assessmentsUsed, updatedAt,
versionHistory[], notes?.

`ContextProfile` (per master §10): id, organizationId, name, roleTitle, jobFamily, jobLevel, status
(`ContextStatus`), values (`ContextProfileValues`), successProfileNotes?, linkedBlueprintId?, version,
updatedAt, versionHistory[].

> The Spec 001 `RoleBlueprint`/`ContextProfile` are minimal; this feature extends them to the full
> field set above (kept backward-compatible — existing fixtures still satisfy the required fields).

## 3. Additions for the builders

| Type | Shape (summary) | Notes |
|---|---|---|
| `DimensionCatalogEntry` | `{ dimensionId; dimensionName; domainId }` | derived from `item_bank` (D2) |
| `DimensionImportance` | `{ dimensionId; importance: 'Low'\|'Moderate'\|'Critical'; rationale? }` | required dimensions only (FR-BC-004) |
| `ContextProfileValues` | leadershipScope + 13 factors on 1–5 (per shared §8) | drives the live signature |
| `BlueprintDraftState` | builder working copy of `RoleBlueprint` + current step | not persisted until save |
| `ContextSignatureData` | `{ axes: {axis,value}[]; summary: string }` | pure derivation of values (D4) |

## 4. Validation & rules

- **Dimension tri-state** (FR-BC-003): a dimension is in exactly one of required/optional/excluded; toggling cycles Required → Optional → Excluded → (unset).
- **Importance** (FR-BC-004): every required dimension has an importance; rationale optional.
- **Lifecycle** (FR-BC-007, D1): free-form `setStatus`; Archived terminal; Validated enforced at consumption.
- **Eligibility** (FR-BC-013, D7): blueprint eligible for new assignments unless Deprecated/Archived; Hiring-Support role-fit requires Validated.
- **Link** (FR-BC-011, D6): two-way; setting one side updates the other.
- **Versioning** (FR-BC-012): each save appends a `VersionEntry`.

## 5. State transitions

- **Blueprint status**: any → any (free-form) except out of `Archived` (terminal). Consumption gate applies Validated/eligibility at use time, not transition.
- **Context status**: Draft → Active → Archived (Archived terminal for new use).
- **Builder step**: stepper position; save at Review (or save-draft) persists the record.

## 6. Service ownership

Completes the Spec 001 fixture-backed stubs:
- `roleBlueprintService`: `list`/`get` (exist) + `create`, `update`, `duplicate`, `setStatus`, `versions`, `link`, `isEligible`.
- `contextProfileService`: `list`/`get` (exist) + `create`, `update`, `duplicate`, `setStatus`, `versions`, `link`.
- `lib/dimensions.ts`: `dimensionCatalog()` derived from `questionBankService`. See `./contracts/services.md`.
