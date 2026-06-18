# Nexus Assessment Platform — Backend Constitution

**Phase**: Future Backend (FastAPI + Supabase). Governs the backend phase that becomes authoritative after the V1 frontend prototype. **Do not implement during the frontend phase** (frontend governance: `./frontend-constitution.md`).
**Inputs**: the frontend mock-service contracts + per-service mapping in `./000-shared/handoff-map.md`; product rules in `./000-master-scope/spec.md`; status/visibility/eligibility rules in `./000-shared/status-models.md`; the governed workbook `item_bank`.

**Version**: 1.0.0 | **Ratified**: 2026-06-13 | **Last Amended**: 2026-06-13

---

## Roles & Responsibilities (backend)

The backend authenticates and authorizes the same two product roles and serves the AI Agent and system services. Authorization is enforced server-side (defense-in-depth with Supabase RLS), regardless of any frontend gating.

| Actor | Identity / claim | Server-enforced scope & responsibilities |
|---|---|---|
| **Admin** | authenticated user, role claim `admin` | Organization-scoped read/write: participants, blueprints, contexts, assessment drafts, assignments, reports, comparison, exports, settings, activity-log read. One Admin per organization (V1). Cannot access other orgs; cannot trigger automated hire/reject; cannot mutate `item_bank`. |
| **User** | authenticated user, role claim `user` | Self-scoped only: own assignments, sessions/responses, consents, user-safe reports, notifications, profile, privacy requests. No access to Admin data or other Users. |
| **AI Agent service** | service principal (governed) | Discovery orchestration with safe-prompt policy + structured-output validation; governed question **selection only** (never creation); display-only adaptation. Bound by immutability + eligibility rules. |
| **System services** | internal/service principals | Scoring, Domain 6 derivation, deterministic report release, comparison read model, notification/email fan-out, export generation, PDF, immutable audit logging. No automated decisions. |

## Core Principles

1. **Backend Authoritative (NON-NEGOTIABLE)** — the server is the source of truth for governance, eligibility, scoring, release, and audience projection. Frontend gates are advisory; the backend re-enforces every rule.
2. **Contract Parity (NON-NEGOTIABLE)** — endpoints and Pydantic schemas mirror the frontend mock-service contracts in `./000-shared/handoff-map.md`; response shapes match frontend models; breaking changes require API versioning (`/api/v1`).
3. **Authentication & Authorization (NON-NEGOTIABLE)** — every endpoint authenticates, applies the role claim (`admin`/`user`), enforces org scope for Admin and self-scope for User, and respects the one-Admin-per-organization V1 rule.
4. **Row-Level Security (NON-NEGOTIABLE)** — Supabase RLS enforces org scoping and User own-data on every table as defense-in-depth; app-layer checks never replace RLS. `item_bank` is read-only to application roles.
5. **Immutable Question Bank (NON-NEGOTIABLE)** — source-item metadata is immutable; adaptations stored separately referencing `item_id`; no metadata mutation; no fabricated `weight`/`difficulty`.
6. **Governed Selection & Scoring (NON-NEGOTIABLE)** — selection draws only from eligible `item_bank` items (excludes blocked/quarantine/pilot/research); the Agent never creates questions. Scoring is deterministic and version-tagged (`scoring_version`, `synthesis_weight_version`); SE/confidence bands drive visibility.
7. **Deterministic Release Pipeline** — reports pass confidence, use-case, audience, and prerequisite gates; suppressed/blocked outputs omitted with explanation; the user-safe projection is produced server-side and never leaks Admin-only data.
8. **No Automated Decisions (NON-NEGOTIABLE)** — no automatic hire/reject/rank/shortlist; operational Hiring-Support role-fit requires a Validated Role Blueprint; comparison is a read model with no decision logic.
9. **Consent Enforcement (NON-NEGOTIABLE)** — per-use-case consent gates each operation; revocation immediately invalidates the affected use case; data-deletion workflow + retention policy (e.g., 24-month limit) enforced.
10. **Immutable Audit Logging (NON-NEGOTIABLE)** — every consequential action writes an immutable audit event; audit-write failure blocks the operation; the frontend Activity Log reads a projection of this stream.
11. **Privacy & Data Protection** — encrypt in transit and at rest; minimize PII in payloads/filenames/logs; honor retention and deletion-on-request; signed, expiring URLs for exports.
12. **Versioning & Reproducibility** — outputs carry version tags (scoring, synthesis, blueprint, norm, report); results reproducible from stored responses + versions.
13. **Observability & Resilience** — structured logging, health/readiness checks, consistent error envelopes, idempotent async jobs, retries with backoff; no silent governance degradation.
14. **Testing & CI (NON-NEGOTIABLE)** — contract tests for schema parity; unit/integration tests; RLS policy tests; governance-invariant tests (no blocked-item selection, metadata immutability, user-safe projection, no auto-decision). CI green before deploy.
15. **Migrations & Schema Discipline** — all schema + RLS policies are versioned migrations in source control; `item_bank` seeded from the governed workbook via reviewed import; no ad-hoc production schema changes.

## Recommended Backend Structure (to be implemented)

Stack: **FastAPI + Pydantic v2 + Supabase (Postgres + Auth + Storage + RLS)**; async SQL via Supabase client or SQLAlchemy/asyncpg; pytest; Ruff + mypy; Alembic or Supabase migrations.

```text
backend/
├── pyproject.toml · ruff.toml · mypy.ini · .env.example
├── app/
│   ├── main.py                  # FastAPI factory, middleware, router include, health
│   ├── core/                    # config, security (JWT + role claim), dependencies (require_admin/org_scope/self_scope), errors, logging (audit)
│   ├── api/v1/
│   │   ├── router.py
│   │   └── routers/             # auth, participants, consents, privacy_requests, assessment_drafts, discovery,
│   │                            #   question_bank, role_blueprints, context_profiles, assessments, sessions,
│   │                            #   reports, comparison, notifications, exports, activity_log, settings
│   ├── schemas/                 # Pydantic request/response (parity with frontend models)
│   ├── services/
│   │   ├── governance/          # eligibility, confidence_gate, use_case_gate, visibility, release_policy, user_safe_projection
│   │   ├── selection.py · adaptation.py
│   │   ├── scoring/ · domain6/ · reporting/
│   │   ├── comparison.py · consent.py · notifications.py · exports.py · audit.py
│   ├── db/ supabase.py · repositories/      # RLS-aware data access per table
│   ├── integrations/            # ai_agent (governed prompts + structured output), email, pdf
│   └── workers/                 # async: scoring, export generation, email fan-out
├── supabase/
│   ├── migrations/              # tables + indexes
│   ├── policies/                # RLS (org scope, user self-scope, item_bank read-only)
│   ├── functions/              # edge functions (optional)
│   └── seed/                    # item_bank import from governed workbook + reference data
└── tests/ contract/ · unit/ · integration/ · rls/ · governance/
```

### Endpoint categories (from `./000-shared/handoff-map.md`)
`/auth/*` · `/participants/*` · `/consents/*`, `/privacy-requests/*` · `/assessment-drafts/*` · `/assessment-drafts/{id}/discovery/*` · `/question-bank/select` · `/question-bank/adapt` · `/role-blueprints/*` · `/context-profiles/*` · `/assessments/*`, `/sessions/*` · `/sessions/{id}/responses`, `/sessions/{id}/submit` · `/reports/*`, `/reports/{id}/pdf` · `/comparison` · `/notifications/*` · `/exports/*` · `/activity-log/*` · `/settings/*`.

### Core data (Supabase, RLS-protected)
`auth.users`, `org_members`, `organizations`, `org_settings`, `profiles`, `participants`, `consents`, `privacy_requests`, `assessment_drafts`, `draft_questions`, `agent_conversations`, `requirements_profiles`, `item_bank` (read-only), `item_adaptations`, `role_blueprints`, `blueprint_versions`, `context_profiles`, `context_versions`, `assignments`, `sessions`, `invitations`, `reminders`, `responses`, `scores`, `scoring_versions`, `reports`, `report_sections`, `files`, `notifications`, `email_logs`, `exports`, `audit_events`.

## Production Security Handoff (must enforce)
Admin organization scope · User self-scope · one-Admin V1 rule · source-item immutability · no blocked-item selection · Validated-blueprint requirement for Hiring-Support operational role-fit · consent gate · report audience projection · no automated hire/reject behavior · version tags on outputs · immutable audit logging.

## Governance
Governs the backend phase only; must stay consistent with `./frontend-constitution.md` and the shared specs. Activates only after explicit approval to begin the backend phase. Amendments require documented change, rationale, dependent-artifact impact, and approval. Versioning: MAJOR (incompatible principle/contract redefinition), MINOR (new principle/section/endpoint family), PATCH (clarification).
