# NEXUS Assessment Platform — Master Frontend Scope Specification

**Status:** Revised Planning Baseline  
**Delivery Mode:** Frontend-first prototype  
**Future Backend:** FastAPI + Supabase  
**Primary Roles:** Admin, User  
**Authoritative Scope:** This file centralizes confirmed V1 decisions for SpecKit planning.

---

## Clarifications

### Session 2026-06-13

- Q: Candidate (User-safe) report — should Domain 6 appear, or be omitted? → A: Show a safe, high-level Domain 6 contextual-alignment **summary only** (narrative or band label) when the report permits — never indices, radar, formulas, or internals.
- Q: Candidate access model — permanent account or invitation-only? → A: **The User has a permanent account in V1.** The invitation activates the account (the User sets a password on first access); the User then signs in to return. (Revised 2026-06-13 per stakeholder request — supersedes the earlier invitation-only choice.)
- Q: Activity Log — exhaustive event stream or selected events? → A: Show selected high-value governance/operational events (the Spec 007 set) with search/filter/date/actor; it is a prototype read view, not the future immutable audit log.

---

## 1. Product Definition

NEXUS is an enterprise workforce-assessment platform.

It is not a generic survey builder and not a simple personality test.

The platform helps an organization:
- create role-specific assessments,
- assign assessments to Users,
- understand strengths and development areas,
- support hiring decisions through explainable evidence,
- generate contextual interpretation,
- view Domain 6 contextual alignment,
- compare candidates side by side,
- monitor assessment progress,
- view reports,
- download PDFs,
- export operational lists,
- and review historical assessments.

The product must never reduce a person to one uncontrolled master score or present an automated hire/reject decision.

---

## 2. V1 Roles and Organization Rules

### Roles
V1 has exactly two product roles:
1. `Admin`
2. `User`

### Admin account rule
- One Admin role only
- One Admin account per organization in V1
- Future multi-Admin support may be planned structurally but must not be implemented as a V1 workflow

### Data scope
- Admin sees only their organization’s data
- User sees only their own assessments, reports, notifications, consent information, and profile

### Organization structure
- No branch hierarchy
- No department hierarchy
- Optional department text may be stored on a User record

---

## 3. Confirmed Admin Capabilities

The Admin can:
- log in,
- view Dashboard,
- add Users individually,
- bulk upload Users,
- search and filter Users,
- view User details,
- export User list,
- create Role Blueprints,
- edit, duplicate, activate, validate-display, deprecate, and archive Role Blueprints in mock form,
- create Context Profiles,
- edit, duplicate, activate, and archive Context Profiles,
- create one tailored assessment for one User through an AI Agent-guided workflow,
- set deadlines,
- configure automated reminders,
- send invitations,
- receive in-platform notifications,
- see simulated email-notification states,
- monitor assessment progress,
- resend invitation,
- send reminder,
- extend deadline,
- cancel assessment,
- view Admin reports,
- preview User-safe report,
- download simulated PDF,
- compare candidates side by side,
- export operational data,
- view global assessment history,
- view organization-scoped activity log,
- and manage organization settings and profile.

---

## 4. Confirmed User Capabilities

The User can:
- open an invitation,
- activate a permanent User account from the invitation (set a password on first access),
- sign in to their account to return,
- view User Dashboard,
- see active assessments,
- review assessment overview,
- accept use-case-specific consent,
- read instructions,
- answer all supported question types,
- see progress,
- auto-save progress,
- pause,
- resume,
- submit,
- see completion state,
- receive report notification,
- open User-safe report,
- download simulated PDF,
- view own assessment history,
- view notifications,
- review consent history,
- revoke consent where permitted,
- request data deletion,
- and access Help & Support.

---

## 5. Signature Create Assessment Journey

The signature Admin flow is:

1. Select User
2. Define Assessment Purpose
3. AI Discovery Chat
4. Job Requirements Summary
5. Select or Create Role Blueprint
6. Select or Create Context Profile
7. Agent Question Selection
8. Controlled Question Rephrasing
9. Assessment Coverage Review
10. Admin Approval
11. Deadline and Reminder Setup
12. Review and Send
13. Success State

### Important V1 rule
The tailored Create Assessment flow is for one User at a time.

Bulk upload is supported for User creation.  
Batch assignment of one reusable assessment to many Users is not included unless separately specified later.

---

## 6. AI Agent Governance Rules

The AI Agent may:
- ask the Admin questions about role, job level, responsibilities, context, and requirements,
- build a Job Requirements Profile,
- select questions only from the governed workbook source sheet,
- adapt wording and workplace context where permitted,
- explain why questions were selected,
- and propose an assessment for Admin approval.

The AI Agent must not:
- create a new question from scratch,
- use a question outside the governed source bank,
- change source Question ID,
- change Domain,
- change Dimension,
- change Facet,
- change method family,
- change response scale,
- change keyed answer,
- change reverse-scored status,
- change governance status,
- change validation status,
- use blocked questions in an operational assessment,
- or send an assessment without Admin approval.

### Workbook naming
The uploaded workbook source worksheet is named `item_bank`.  
Business copy may call this the “Questions Sheet”.

---

## 7. Question-Level Scoring Rule

Scoring is linked to every question.

For the frontend prototype:
- each selected question keeps its immutable source metadata,
- each User response is stored against the immutable source Question ID,
- the UI does not calculate production scores,
- the UI may show trust badges such as `Scoring Logic Locked`,
- the future scoring service receives response + source metadata and computes governed results.

The User must never see live score changes while answering.

---

## 8. Question Rephrasing Policy by Method Family

The frontend prototype must use a conservative governed policy.

| Method family | V1 prototype adaptation rule |
|---|---|
| `likert` | Controlled role-context wording adaptation allowed if meaning is preserved |
| `contextual_self_report` | Controlled role-context wording adaptation allowed if meaning is preserved |
| `forced_choice` | Light terminology adaptation only; the trade-off meaning and option polarity must remain unchanged |
| `cognitive_multiple_choice` | Verbatim by default; do not adapt unless a future approved equivalence rule exists |
| `sjt` | Verbatim by default or scenario adaptation only through an approved equivalence template; keyed answer and option meaning must remain unchanged |

The question-review UI must clearly show:
- original wording,
- adapted wording,
- diff,
- provenance,
- and locked metadata.

---

## 9. Domain Model

| Domain | V1 posture | Notes |
|---|---|---|
| D1 — Character and Work Style | Active | Directly measured |
| D2 — Thinking and Problem Solving | Active | Directly measured |
| D3 — Drivers and Motivation | Governed / restricted | Use only where allowed |
| D4 — Emotional Intelligence and Relationships | Active | Directly measured |
| D5 — Workplace Effectiveness | Governed / restricted | Use only where allowed |
| D6 — Contextual Alignment and Decision Influence | Visible in V1 | Derived person-in-context layer |

### Domain 6 V1 rule
Domain 6 is visible in the Admin experience.

The Admin report may display:
- CAI,
- DII,
- AFI,
- ECFI,
- SII,
- DDI,
- PDRI,
- ECSI,
- candidate-vs-context radar,
- contextual strengths,
- contextual cautions,
- confidence treatment,
- and omitted-section explanations.

Where an output depends on restricted or insufficient inputs:
- show provisional treatment,
- downgrade,
- or omit it with explanation.

Do not expose blocked values as report data.

Derailment Risk remains blocked.

---

## 10. Context Profile

Context Profile is a first-class V1 object.

It captures:
- context name,
- job family,
- job level,
- leadership scope,
- ambiguity level,
- decision stakes,
- time pressure,
- regulatory constraint,
- autonomy level,
- stakeholder complexity,
- interdependence level,
- innovation demand,
- execution precision demand,
- customer exposure,
- conflict load,
- change velocity,
- failure cost,
- and success-profile notes.

It must have:
- list page,
- create builder,
- detail page,
- live visual context map,
- linking to Role Blueprint,
- and selection inside Create Assessment.

---

## 11. Role Blueprint

Role Blueprint is a reusable first-class V1 object.

It defines what success looks like for a role.

It includes:
- name,
- role title,
- family,
- level,
- purpose,
- responsibilities,
- work context,
- success indicators,
- failure risks,
- non-negotiables,
- required dimensions,
- optional dimensions,
- excluded dimensions,
- importance,
- evidence,
- notes,
- version history,
- lifecycle status,
- and linked Context Profile.

Validated blueprint is required for operational Hiring Support role-fit output.

---

## 12. Reports

Two separate report experiences are required.

### Admin Report
May contain:
- User summary,
- strengths,
- areas to explore,
- measured dimensions,
- confidence treatment,
- Domain 6,
- role-linked results,
- structured interview prompts,
- limitations,
- omitted sections,
- blueprint summary,
- context summary,
- version footer,
- and no-automatic-decision disclaimer.

### User Report
Must be safe and supportive.

Must not expose:
- raw responses,
- formulas,
- scoring versions,
- internal governance codes,
- blocked values,
- internal psychometric flags,
- Admin notes,
- or automatic hiring recommendation.

May show a safe, high-level Domain 6 contextual-alignment summary (narrative or band label) only when the report permits — never indices, radar, formulas, or internals.

Both report experiences support simulated PDF download in the frontend prototype.

---

## 13. Candidate Comparison

Candidate Comparison is required.

It supports:
- role selection,
- blueprint selection,
- context selection,
- participant selection,
- dimension selection,
- side-by-side results,
- confidence indicators,
- contextual indicators,
- strengths,
- areas to explore,
- and interview prompts.

It must not include:
- ranking,
- leaderboard language,
- automatic shortlist,
- automatic reject,
- automatic hire,
- or recommendation ordering.

---

## 14. Required Admin Navigation

1. Dashboard
2. Users
3. Assessments
4. Role Blueprints
5. Context Profiles
6. Reports
7. Candidate Comparison
8. Assessment History
9. Exports
10. Notifications
11. Activity Log
12. Organization Settings
13. My Profile

The Activity Log shows selected high-value governance/operational events (the set enumerated in Spec 007) with search, filter, date, and actor — not an exhaustive event stream. It is an organization-scoped prototype read view, not the future immutable audit log.

---

## 15. Required User Navigation

1. Dashboard
2. My Assessments
3. Assessment History
4. My Reports
5. Notifications
6. Help and Support
7. Profile and Privacy

---

## 16. Frontend-Only Scope

The current phase includes:
- React frontend,
- TypeScript models,
- mock auth,
- mock data,
- mock services,
- local persistence,
- realistic workflow interactions,
- CSV import/export,
- simulated email status,
- simulated PDF download,
- animations,
- accessibility,
- responsive behavior,
- and documentation.

The current phase excludes:
- FastAPI code,
- Supabase setup,
- database schema implementation,
- real AI calls,
- real scoring,
- real report generation,
- real PDF generation,
- real email delivery,
- production auth,
- production audit logging,
- and production policy enforcement.

The future backend becomes authoritative.

---

## 17. Required Feature Specs

| Spec | Coverage |
|---|---|
| 001 | Foundation, shells, tokens, mock services, persistence |
| 002 | Admin everyday workflow |
| 003 | Signature Create Assessment flow |
| 004 | Role Blueprints and Context Profiles |
| 005 | Reports, Domain 6, Candidate Comparison, Admin History |
| 006 | User portal and runtime |
| 007 | Public/auth recovery, activity log, privacy-request inbox, polish |
| 008 | QA and release-readiness gates |
