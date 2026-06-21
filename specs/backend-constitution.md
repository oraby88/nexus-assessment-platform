<!--
SYNC IMPACT REPORT (1.0.0 → 2.0.0, MAJOR)
Date: 2026-06-18
Bump rationale: Backward-incompatible redefinition of the backend stack and governance process.
  v1.0.0 mandated Supabase (Auth + Storage + RLS) as NON-NEGOTIABLE infrastructure. The confirmed
  build decision is self-hosted PostgreSQL (Docker) + SQLAlchemy 2.x + Alembic + JWT auth — no
  Supabase. This redefines Principle 4 (RLS → Data Scoping & Least Privilege) and the recommended
  structure, so it is MAJOR, not MINOR.
Modified principles:
  4. Row-Level Security (Supabase RLS)  → 4. Data Scoping & Least Privilege (app-layer + optional
     native PostgreSQL RLS)
  2. Contract Parity — now names the concrete source: frontend/src/services/contracts.ts + models.
  6. Governed Selection & Scoring — references the pluggable engine (new Principle 7).
Added principles:
  7. Pluggable, Provisional Scoring (NON-NEGOTIABLE)
  15. Phased Delivery with Tests After Each Phase (NON-NEGOTIABLE)
  16. Spec Kit + Superpowers Workflow (NON-NEGOTIABLE)
Modified sections: Roles table (Supabase RLS → server-side scoping); Recommended Backend Structure
  (supabase/ tree → docker-compose + Alembic); Core data (Supabase/RLS → PostgreSQL, scoped).
Stack: FastAPI + Pydantic v2 + PostgreSQL (Docker) + SQLAlchemy 2.x + Alembic + JWT.
Activation: this constitution is now the active governance for the backend build phase (planning +
  implementation). Implementation still requires an explicit human go-ahead (Principle 16).
Dependent artifacts: align CLAUDE.md (backend pointer added), the backend build plan (6 phases), and
  the Spec Kit feature to be created (specs/013-backend-foundation) with this version.
-->

# Nexus Assessment Platform — Backend Constitution

**Phase**: Backend Build (active). Governs the FastAPI backend that becomes authoritative after the V1
frontend prototype. The frontend prototype remains governed by `./frontend-constitution.md`; the two MUST
stay consistent. **The backend lives in a new `backend/` folder and MUST NOT break the existing `frontend/`**;
the only frontend change in scope is wiring the live data-source adapters (`frontend/src/services/live/`).
**Inputs**: the frontend service contracts in `frontend/src/services/contracts.ts` and models in
`frontend/src/models/{index,entities,foundation}.ts`; the per-service mapping in `./000-shared/handoff-map.md`;
product rules in `./000-master-scope/spec.md`; status/visibility/eligibility rules in
`./000-shared/status-models.md`; the governed workbook `item_bank` (543 items / 34 dimensions); and the
authoritative psychometric & governance canon (NotebookLM "Nexus Domain 6": Master PRD, Technical
Documentation, Final Scoring Spec, Domain 6 Framework, Automated Reporting Standard).

**Stack**: FastAPI + Pydantic v2 + PostgreSQL (via `docker-compose`) + SQLAlchemy 2.x + Alembic; JWT auth;
pytest + httpx; Ruff (+ optional mypy). No Supabase. Async optional (start sync for clarity). Scoring math
kept dependency-light (numpy only where useful).

**Version**: 2.0.0 | **Ratified**: 2026-06-13 | **Last Amended**: 2026-06-18

---

## Roles & Responsibilities (backend)

The backend authenticates and authorizes the same two product roles and serves the AI Agent and system
services. Authorization is enforced server-side at the application/repository layer (with optional native
PostgreSQL RLS as defense-in-depth), regardless of any frontend gating.

| Actor | Identity / claim | Server-enforced scope & responsibilities |
|---|---|---|
| **Admin** | authenticated user, JWT role claim `admin` | Organization-scoped read/write: participants, blueprints, contexts, assessment drafts, assignments, reports, comparison, exports, settings, activity-log read. One Admin per organization (V1). Cannot access other orgs; cannot trigger automated hire/reject; cannot mutate `item_bank`. |
| **User** | authenticated user, JWT role claim `user` | Self-scoped only: own assignments, sessions/responses, consents, user-safe reports, notifications, profile, privacy requests. No access to Admin data or other Users. |
| **AI Agent service** | service principal (governed) | Discovery orchestration with safe-prompt policy + structured-output validation; governed question **selection only** (never creation); display-only adaptation. Bound by immutability + eligibility rules. V1 discovery is deterministic/scripted (no live LLM call required). |
| **System services** | internal/service principals | Scoring, Domain 6 derivation, deterministic report release, comparison read model, notification/email fan-out, export generation, PDF, immutable audit logging. No automated decisions. |

## Core Principles

1. **Backend Authoritative (NON-NEGOTIABLE)** — the server is the source of truth for governance, eligibility,
   scoring, release, and audience projection. Frontend gates are advisory; the backend re-enforces every rule.
2. **Contract Parity (NON-NEGOTIABLE)** — endpoints and Pydantic schemas mirror the frontend service contracts
   in `frontend/src/services/contracts.ts`; response JSON matches the field names and enum strings in
   `frontend/src/models/entities.ts` (e.g. `UseCase`, `ConfidenceBand`, `ReportStatus`, the `SecondaryIndex.code`
   set). A `tests/contract/` suite asserts parity and is the merge gate. Breaking changes require API versioning
   (`/api/v1`). The existing UI MUST run unchanged once the live adapters are wired.
3. **Authentication & Authorization (NON-NEGOTIABLE)** — every endpoint authenticates, applies the JWT role
   claim (`admin`/`user`), enforces org scope for Admin and self-scope for User, and respects the
   one-Admin-per-organization V1 rule.
4. **Data Scoping & Least Privilege (NON-NEGOTIABLE)** — org scoping and User own-data are enforced on every
   query at the application/repository layer; native PostgreSQL Row-Level Security MAY be added as
   defense-in-depth. Identity/PII tables are separated from scoring outputs. `item_bank` is read-only to
   application roles.
5. **Immutable Question Bank (NON-NEGOTIABLE)** — source-item metadata is immutable; adaptations are stored
   separately referencing `item_id`; no metadata mutation; no fabricated `weight`/`difficulty`. Ingestion
   preserves the 27-column ordered schema and rejects reordered columns or unsupported method-scale combos.
6. **Governed Selection (NON-NEGOTIABLE)** — selection draws only from eligible `item_bank` items (excludes
   blocked/quarantine/pilot/research and respects job-level overlay); the Agent never creates questions; no
   assessment is sent without explicit Admin approval.
7. **Pluggable, Provisional Scoring (NON-NEGOTIABLE)** — scoring sits behind a `ScoringEngine` interface.
   V1 uses a deterministic **provisional** estimator for θ/SE; real GGUM (noncognitive) and 3PL-IRT (cognitive)
   drop in later without an API change. The Domain 6 formulas (CAI, DII, and the six secondary indices),
   aggregation rules, and SE→confidence bands (`High ≤0.25 / Moderate ≤0.35 / Low ≤0.45 / Unacceptable`) are
   implemented exactly as specified. Provisional outputs are version-labeled (`*-provisional`) and MUST NOT be
   presented as calibrated. No omnibus total-person score, ever.
8. **Deterministic Release Pipeline** — reports pass the P1–P7 precedence and confidence/use-case/audience/
   prerequisite gates, resolving to one of six states (VISIBLE, VISIBLE_WITH_CAUTION, DOWNGRADED, HIDDEN,
   BLOCKED, NOT_GENERATED); suppressed/blocked outputs are omitted with an explanation; the user-safe
   projection is produced server-side and never leaks Admin-only data.
9. **No Automated Decisions (NON-NEGOTIABLE)** — no automatic hire/reject/rank/shortlist; operational
   Hiring-Support role-fit requires a Validated Role Blueprint; comparison is a read model with no decision
   logic and preserves the Admin's selection order. Derailment Risk is never computed or shown.
10. **Consent Enforcement (NON-NEGOTIABLE)** — per-use-case consent gates each operation; revocation
    immediately invalidates the affected use case; the data-deletion workflow + retention policy is enforced.
11. **Immutable Audit Logging (NON-NEGOTIABLE)** — every consequential action writes an immutable audit event;
    if the audit (or consent) store is unavailable, ALL scoring/reporting operations are BLOCKED — the system
    MUST NEVER silently degrade. The frontend Activity Log reads a projection of this stream.
12. **Privacy & Data Protection** — encrypt in transit and at rest; minimize PII in payloads/filenames/logs;
    honor retention and deletion-on-request; signed, expiring URLs for exports.
13. **Versioning & Reproducibility (NON-NEGOTIABLE)** — every scored output carries the full version chain
    (`scoring_version`, `synthesis_weight_version`, blueprint, context, norm, report template); results are
    reproducible from stored responses + versions; cross-major-version comparison is rejected.
14. **Observability & Resilience** — structured logging, health/readiness checks, consistent error envelopes,
    idempotent async jobs, retries with backoff; every documented dependency failure has a defined failover.
15. **Phased Delivery with Tests After Each Phase (NON-NEGOTIABLE)** — the build ships in **six phases**
    (Foundation → Admin Core → Create-Assessment → Runtime → Scoring & Domain 6 → Reporting & Live Wiring).
    Each phase ends at an acceptance checkpoint: its unit + contract + integration tests MUST be green before
    the next phase begins. No big-bang merge.
16. **Spec Kit + Superpowers Workflow (NON-NEGOTIABLE)** — planning walks the Spec Kit stages
    (constitution → specify → clarify → plan → tasks → analyze) and implementation uses the **superpowers**
    TDD/verify discipline (write the failing contract/unit test first, then make it pass, then verify). Work
    MUST STOP for explicit human go-ahead before implementation begins; the approver's explicit "go" is required.

## Six-Phase Build Map (governed by Principle 15)

| Phase | Scope | Exit tests |
|---|---|---|
| 1. Foundation | FastAPI app, config, `docker-compose` Postgres, SQLAlchemy + Alembic, JWT auth (`AuthServiceContract`), audit middleware, item-bank ingestion (543 items, 27-col schema) | migrations apply; health green; ingestion counts + malformed-row rejection; auth + `Session` shape |
| 2. Admin Core | participants (CSV bulk), assessments (lifecycle ≠ validity), invitations, activity log, notifications, settings | contract tests; lifecycle transitions; audit rows |
| 3. Create-Assessment | blueprints, contexts (14 sliders), eligibility engine, question select/propose, scripted discovery, adaptation guards, drafts | eligibility truth table; propose coverage; adaptation refusals; validated-blueprint gate |
| 4. Runtime | runtime load/answer-by-`sourceQuestionId`/pause/resume/submit (no scoring), form assembly, consent gating | answer persistence + progress; resume/reload; submit without scores; consent rules |
| 5. Scoring & Domain 6 | 9-stage pipeline; exact CAI/DII/secondary formulas; confidence bands; RQ/validity; versioning; background job | hand-computed formula unit tests; band thresholds; pipeline → `Report` shape |
| 6. Reporting & Live Wiring | admin + user-safe projections, P1–P7 + 6 states, comparison, exports, deletion resolution, audit-blocks-all; wire `frontend/src/services/live/*` + `VITE_DATA_SOURCE=live` | suppression matrix; user-safe stripping; audit-failure block; end-to-end smoke vs running frontend |

## Recommended Backend Structure (to be implemented)

```text
backend/
├── pyproject.toml · ruff.toml · .env.example · docker-compose.yml · alembic.ini
├── app/
│   ├── main.py                  # FastAPI factory, middleware (audit, error, CORS), router include, health
│   ├── core/                    # config (pydantic-settings), db session, security (JWT + role claim),
│   │                            #   dependencies (require_admin / org_scope / self_scope), errors, audit
│   ├── api/v1/
│   │   ├── router.py
│   │   └── routers/             # auth, participants, consents, privacy_requests, assessment_drafts, discovery,
│   │                            #   question_bank, role_blueprints, context_profiles, assessments, runtime,
│   │                            #   reports, comparison, notifications, exports, activity_log, settings
│   ├── schemas/                 # Pydantic request/response — PARITY with frontend contracts.ts / entities.ts
│   ├── services/
│   │   ├── governance/          # eligibility, confidence_gate, use_case_gate, precedence (P1–P7), visibility,
│   │   │                        #   release_policy, user_safe_projection
│   │   ├── selection.py · adaptation.py · discovery.py
│   │   ├── scoring/             # ScoringEngine interface + provisional estimator + 9-stage pipeline
│   │   ├── domain6/ · reporting/ · comparison.py · consent.py · notifications.py · exports.py · audit.py
│   ├── db/                      # SQLAlchemy Base, models/, repositories/ (scoped data access per table)
│   ├── integrations/            # ai_agent (governed prompts + structured output), email (sim), pdf (sim)
│   └── workers/                 # async: scoring pipeline, export generation, email fan-out
├── alembic/ versions/           # versioned migrations (tables + indexes)
├── seed/                        # item_bank import from governed workbook + demo seed matching frontend mocks
└── tests/ contract/ · unit/ · integration/ · e2e/ · governance/
```

### Endpoint categories (parity with `frontend/src/services/contracts.ts` + `./000-shared/handoff-map.md`)
`/auth/*` · `/participants/*` · `/consents/*`, `/privacy-requests/*` · `/assessment-drafts/*`,
`/assessment-drafts/{id}/discovery/*` · `/question-bank/select`, `/question-bank/adapt` · `/role-blueprints/*` ·
`/context-profiles/*` · `/assessments/*`, `/runtime/*` · `/runtime/{id}/responses`, `/runtime/{id}/submit` ·
`/reports/*`, `/reports/{id}/pdf` · `/comparison` · `/notifications/*` · `/exports/*` · `/activity-log/*` ·
`/settings/*`. All under `/api/v1`.

### Core data (PostgreSQL, server-scoped)
`organizations`, `org_members`, `org_settings`, `users`, `profiles`, `participants`, `consents`,
`privacy_requests`, `assessment_drafts`, `draft_questions`, `agent_conversations`, `requirements_profiles`,
`item_banks`, `items` (read-only), `forms`, `form_items`, `item_adaptations`, `role_blueprints`,
`blueprint_versions`, `context_profiles`, `context_versions`, `assignments`, `invitations`, `reminders`,
`assessment_sessions`, `responses`, `scoring_runs`, `item_scores`, `dimension_scores`, `domain_scores`,
`qc_flags`, `contexts`, `domain6_runs`, `domain6_scores`, `role_fit_runs`, `role_fit_outputs`, `norm_versions`,
`reports`, `report_sections`, `files`, `notifications`, `email_logs`, `exports`, `audit_events`.

## Production Security Handoff (must enforce)
Admin organization scope · User self-scope · one-Admin V1 rule · source-item immutability · no blocked-item
selection · Validated-blueprint requirement for Hiring-Support operational role-fit · per-use-case consent gate ·
report audience projection · no automated hire/reject behavior · version tags on outputs · immutable audit
logging with audit-failure-blocks-all.

## Governance
Governs the backend build phase and MUST stay consistent with `./frontend-constitution.md` and the shared specs.
Planning is active now; **implementation activates only after explicit human approval** (Principle 16).
Amendments require documented change, rationale, dependent-artifact impact, and approval. Versioning: MAJOR
(incompatible principle/stack/contract redefinition), MINOR (new principle/section/endpoint family), PATCH
(clarification).
