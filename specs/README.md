# NEXUS Assessment Platform — Complete Revised SpecKit Package

## Purpose
This package is the frontend-first SpecKit planning source for the NEXUS Assessment Platform.

It consolidates:
- the uploaded feature specs,
- the governed questionnaire workbook,
- the confirmed Admin/User product decisions,
- the AI-assisted Create Assessment workflow,
- Domain 6 visibility in V1,
- frontend-only prototype boundaries,
- and the future FastAPI + Supabase handoff.

## Build Strategy
The current phase is **planning and frontend prototype definition only**.

Do not implement:
- FastAPI,
- Supabase,
- real authentication,
- real AI calls,
- real scoring,
- real email delivery,
- production audit infrastructure,
- or production PDF generation.

The frontend prototype must use:
- React,
- TypeScript,
- mock services,
- mock data,
- local persistence where useful,
- and clear seams for later backend replacement.

## Authoritative Order
When requirements conflict, use:
1. Confirmed business decisions in `000-master-scope/spec.md`
2. `Nexus_Master_PRD_Final_v2`
3. Companion Nexus documentation
4. This frontend planning package
5. Visual design files for presentation and styling

## Package Map
| Path | Purpose |
|---|---|
| `000-master-scope/spec.md` | Product scope, confirmed decisions, user journeys, page inventory |
| `000-shared/data-model.md` | TypeScript-facing frontend model inventory |
| `000-shared/status-models.md` | Canonical lifecycle, validity, visibility, eligibility, and glossary rules |
| `000-shared/handoff-map.md` | Frontend mock-service → future FastAPI/Supabase boundary |
| `000-shared/risk-register.md` | V1 planning and implementation risks |
| `000-shared/route-map.md` | Complete route inventory |
| `000-shared/traceability-matrix.md` | Requirement → spec → page → route → service mapping |
| `000-shared/open-questions.md` | Remaining non-blocking and blocking clarifications |
| `001-foundation-design-system/spec.md` | Foundation, design system, shells, typed service layer |
| `002-admin-core/spec.md` | Admin everyday workflow |
| `003-create-assessment-flow/spec.md` | Signature AI-assisted governed assessment creation |
| `004-role-blueprints-context-profiles/spec.md` | Reusable role and context business objects |
| `005-reports-domain6-comparison-history/spec.md` | Admin reporting, Domain 6, comparison, history |
| `006-user-portal-runtime/spec.md` | Full User portal and assessment runtime |
| `007-public-auth-audit-polish/spec.md` | Public/auth recovery, org activity log, privacy requests, polish |
| `008-qa-release-readiness/spec.md` | Cross-spec QA, acceptance gates, release readiness |
| `REVIEW_REPORT.md` | Review findings and changes applied |

## Recommended SpecKit Flow
1. `/speckit.constitution`
2. `/speckit.specify`
3. `/speckit.clarify`
4. `/speckit.plan`
5. `/speckit.tasks`
6. `/speckit.analyze`
7. Human review
8. `/speckit.implement` only after explicit approval
