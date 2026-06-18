# Phase 0 — Research & Decisions (Admin Core)

All Technical Context items are resolved — **no remaining NEEDS CLARIFICATION** (the two `/speckit-clarify` answers settled the CSV rules and export scope). This records the admin-core-specific decisions; foundation/master decisions (stack, charts, state, persistence, governance) are inherited unchanged from `../001-foundation-design-system/research.md` and `../000-master-scope/research.md`.

## D1 — Bulk-upload CSV: required columns & duplicate rule *(clarification Q1)*
- **Decision**: The CSV template has columns matching the Add User fields; **required = Full Name, Email, Job Level** (others optional). A row is **invalid** if a required column is missing/malformed (e.g., bad email, unknown job level); **duplicate** if its email already exists in the org or appears earlier in the same file; otherwise **valid**. Only confirmed valid rows import. Classification happens client-side in `lib/csv.ts` + `participantService.bulkUpload`.
- **Rationale**: Mirrors the Add User required fields and the email-uniqueness rule (FR-ADM-003); deterministic and unit-testable (SC-002).
- **Alternatives**: Require only Name+Email (rejected — Job Level is needed downstream for eligibility/level overlays); allow in-file dupes "last wins" (rejected — silently drops data).

## D2 — Export scope in Admin Core *(clarification Q2)*
- **Decision**: `exportService` provides the **framework** (request → mock job progress → history → re-run → download) and **fully implements Users and Assessments exports** (client-side CSV via `lib/csv.ts`). The other five types (Assessment History, Reports, Candidate Comparison, Role Blueprints, Context Profiles) are **registered entries** that render in the Exports center but are marked pending their owning spec (004/005); requesting them is disabled with an explanatory note.
- **Rationale**: Keeps Admin Core independently testable without depending on unbuilt 004/005 data; the registry makes activation a drop-in when those specs land.
- **Alternatives**: Implement all seven against placeholder data now (rejected — fabricates 004/005 semantics prematurely); hide the five entirely (rejected — loses the visible roadmap and the framework demo).

## D3 — CSV generation/parsing
- **Decision**: A small dependency-free `lib/csv.ts` (RFC-4180-ish: quote fields containing comma/quote/newline; parse with quote handling). Used for both list exports and bulk-upload parsing.
- **Rationale**: Constitution (no heavy deps); CSV is feasible client-side and adds real value (master research). One module serves import + export.
- **Alternatives**: `papaparse` (rejected — unnecessary weight for the controlled mock format).

## D4 — Lifecycle vs validity rendering
- **Decision**: The Assessments list shows `lifecycleStatus` and `validityStatus` as **two separate columns/badges**, never merged; report status is a third signal. Badge tones come from the foundation `StatusBadge`/`ConfidenceChip`.
- **Rationale**: Constitution XIV + `../000-shared/status-models.md` §1 ("keep lifecycle and validity separate"); SC-003.
- **Alternatives**: Single combined status (rejected — explicitly disallowed).

## D5 — Assessment management actions = optimistic mock state
- **Decision**: `assessmentService` actions (`remind`, `resendInvitation`, `extendDeadline`, `cancel`) mutate the local mock record, append a `TimelineEvent`, emit an `AppNotification` (with a simulated email-delivery state), and resolve via `mockRequest`. Actions are disabled on terminal assignments (Completed/Cancelled/Expired where not applicable).
- **Rationale**: Demonstrates the real workflow on mocks (FR-ADM-007, SC-004) while staying advisory; backend becomes authoritative later.
- **Alternatives**: Read-only detail (rejected — misses the core monitoring value).

## D6 — List scaling (Users/Assessments)
- **Decision**: Client-side pagination (page size 25) over the foundation `DataTable`, with search/filter applied before paging; filters are transient (not persisted, per foundation research D-state). Virtualization only if a fixture set exceeds a few hundred rows (not expected in V1).
- **Rationale**: Simple, responsive, testable; avoids premature virtualization complexity.
- **Alternatives**: Windowing library now (rejected — over-engineering for mock data volumes; would go in Complexity Tracking if added).

## D7 — One-Admin Settings
- **Decision**: `settingsService.get/update` returns org + single-Admin profile; the Admin Account section shows exactly one account with a non-interactive "multi-Admin: future" note. No invite/role-management UI.
- **Rationale**: Constitution III; SC-007.
- **Alternatives**: Build a members table (rejected — out of V1 scope).

## Open questions status
None block planning. Deferred to implementation detail (not spec ambiguities): exact page-size tuning and the precise "Save and Create Assessment" hand-off to Spec 003 (a routed CTA stub until 003 lands).
