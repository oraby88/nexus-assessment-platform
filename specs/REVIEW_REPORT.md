# NEXUS SpecKit Review Report

## Executive Summary
The uploaded package was a strong starting point. It already covered the main frontend foundation, Admin core, AI-assisted assessment creation, blueprints, contexts, reports, Domain 6, comparison, and the User runtime.

The package did not yet cover the complete project consistently. This revision adds a master scope layer, resolves terminology and route inconsistencies, expands the shared model, formalizes the question-selection and rephrasing governance rules, adds the missing Admin History and Activity Log areas, adds public/auth recovery states, and adds a cross-spec QA/release specification.

## Workbook Validation
The governed workbook was inspected directly.

### Confirmed source facts
- Source worksheet: `item_bank`
- Total governed items: `543`
- Total columns: `31`
- Domain distribution:
  - D1: 95
  - D2: 90
  - D3: 129
  - D4: 99
  - D5: 130
- Method families:
  - `likert`: 187
  - `contextual_self_report`: 200
  - `forced_choice`: 54
  - `cognitive_multiple_choice`: 90
  - `sjt`: 12
- No workbook columns named `weight` or `difficulty`

### Resulting correction
The Agent review experience must not fabricate `weight` or `difficulty` metadata on source-question cards. The UI may show:
- question provenance,
- domain,
- dimension,
- facet,
- method family,
- response scale,
- job-level overlay,
- bank state,
- use status,
- review status,
- validation track,
- adaptation reason,
- and scoring-lock trust messaging.

Any future weighting belongs to the Role Blueprint or assessment-coverage layer, not to a fabricated source-item field.

## Main Gaps Found and Fixed

### 1. No master product scope file
**Problem:** The uploaded specs were feature-level only. Confirmed product decisions were distributed across conversation history and not centralized.

**Fix:** Added `000-master-scope/spec.md`.

### 2. Admin History was missing as a first-class global page
**Problem:** History appeared inside candidate details but not as a searchable Admin-wide surface.

**Fix:** Added `/admin/history` and assigned ownership to Spec 005.

### 3. Public and account-recovery flows were incomplete
**Problem:** `/` was reserved but not owned by a spec. Forgot-password, reset-password, access-denied, offline, and robust 404 states were absent.

**Fix:** Added Spec 007.

### 4. Mandatory auditability was not represented in the Admin prototype
**Problem:** The source PRD requires traceability, while the frontend package only included timelines inside records.

**Fix:** Added an organization-scoped `/admin/activity-log` prototype page. This does not replace future server-authoritative immutable audit logging.

### 5. Data model did not cover the AI assessment draft
**Problem:** Shared types lacked structured models for Agent conversation, requirements profile, assessment draft, invitations, reminders, timeline, question responses, and privacy requests.

**Fix:** Expanded `000-shared/data-model.md`.

### 6. Assessment status was over-collapsed
**Problem:** Lifecycle status and validity status were merged. This made states such as submitted, processing, valid, incomplete, invalid, and uninterpretable hard to represent accurately.

**Fix:** Split:
- assignment lifecycle,
- assessment validity,
- report release status,
- invitation status,
- and consent status.

### 7. User vs Candidate terminology was inconsistent
**Problem:** The product has roles `Admin` and `User`, while many Admin pages use the hiring-specific label “Candidate”.

**Fix:** Standardized the data entity as `Participant`. UI labels can be:
- `Users` for general organization management,
- `Candidate Comparison` for hiring-support comparison.

### 8. Single-user tailored creation was not explicit
**Problem:** The signature Create Assessment spec allowed multi-select even though the Agent chat tailors the assessment to one person and one target role.

**Fix:** Signature flow is now single-participant. Bulk upload remains supported, and batch assignment is deferred until a reusable approved assessment blueprint is explicitly defined.

### 9. Question-level scoring contract needed to be explicit
**Problem:** The confirmed business rule says scoring works with each question, but the frontend specification only discussed immutable question metadata.

**Fix:** Added:
- response capture keyed by source question ID,
- immutable scoring attribution per selected item,
- no client-side production scoring,
- future scoring-service handoff per answer.

### 10. Rephrasing rules needed method-family safeguards
**Problem:** Rephrasing a cognitive or SJT question can accidentally invalidate keyed answers.

**Fix:** Added a governed adaptation policy:
- Likert/contextual self-report: controlled wording adaptation allowed
- Forced choice: light terminology adaptation only; trade-off meaning must stay unchanged
- Cognitive MCQ: verbatim by default
- SJT: scenario adaptation only through approved equivalence rules; otherwise verbatim

This is the safest frontend default until psychometric governance confirms broader rules.

### 11. Domain 6 visibility needed qualification
**Problem:** Domain 6 is confirmed visible in V1, while D3 and D5 are not fully operational.

**Fix:** Added governed V1 report behavior:
- CAI, DII, secondary indices, and fit radar may appear in the Admin prototype
- every output carries confidence/visibility treatment
- D3/D5-dependent outputs may show provisional treatment or omission explanation
- Derailment Risk remains blocked
- User view gets only safe high-level contextual wording where permitted

### 12. Export coverage was incomplete
**Problem:** Admin Core only explicitly owned User and Assessment CSV exports.

**Fix:** Added all confirmed exports:
- users,
- assessments,
- history,
- reports,
- comparisons,
- blueprints,
- contexts.

### 13. Cross-spec release verification was missing
**Problem:** Each feature spec had checkpoints, but there was no overall release-readiness gate.

**Fix:** Added Spec 008 with route coverage, traceability, a11y, responsive, governance, bundle, and end-to-end checks.

## Remaining Decisions
See `000-shared/open-questions.md`.

The remaining questions do not prevent SpecKit planning. Where needed, the package marks a conservative prototype default rather than silently inventing production rules.
