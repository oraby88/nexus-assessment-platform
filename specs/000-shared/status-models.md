# Shared Status Models, Visibility Rules, Eligibility Rules, and Glossary

This file is the single frontend planning source for lifecycle and governance-display behavior.

---

## 1. Keep Lifecycle and Validity Separate

Do not collapse assignment progress and assessment interpretability into one field.

### Assessment assignment lifecycle
| Status | Meaning |
|---|---|
| `Draft` | Assessment draft is not sent |
| `Not Started` | Invitation sent; User has not started |
| `In Progress` | User started and may pause/resume |
| `Submitted` | User submitted answers |
| `Processing` | Mock report/scoring processing state |
| `Completed` | Processing completed |
| `Expired` | Deadline passed |
| `Cancelled` | Admin cancelled assignment |

### Assessment validity
| Status | Meaning |
|---|---|
| `Pending` | Not yet evaluated |
| `Valid` | Interpretable under permitted rules |
| `Pass With Limits` | Some results may release with caution |
| `Valid but Uninterpretable` | Completed, but no reliable interpretive report |
| `Incomplete` | Completion conditions not met |
| `Invalid` | Structural, identity, or major quality issue |
| `Deferred` | Some output depends on a future condition |

### Report release
| Status | Meaning |
|---|---|
| `Processing` | Report not ready |
| `Released` | Permitted report available |
| `Released with Caution` | Available with caution treatment |
| `Partial Release` | Some sections omitted |
| `Blocked Section` | Specific derived section is blocked |
| `Unavailable` | No interpretive report available |
| `Deferred` | Output waits for future condition |

### Invitation
`Draft` · `Sent` · `Opened` · `Expired` · `Cancelled`

### Blueprint
`Draft` · `Under Review` · `Active` · `Validated` · `Deprecated` · `Archived`

`Validated` is required for operational Hiring Support role-fit outputs.

### Context Profile
`Draft` · `Active` · `Archived`

### Consent
`Pending` · `Granted` · `Declined` · `Revoked`

### Export
`Queued` · `Processing` · `Ready` · `Failed`

---

## 2. Confidence Bands

| Confidence band | Standard error rule | UI behavior |
|---|---:|---|
| High | `SE <= 0.25` | visible |
| Moderate | `0.25 < SE <= 0.35` | visible with caution for developmental; downgraded for higher-stakes use |
| Low | `0.35 < SE <= 0.45` | downgraded or hidden |
| Unacceptable | `SE > 0.45` | hidden |

---

## 3. Output Visibility

```ts
type OutputVisibility =
  | 'visible'
  | 'visible_with_caution'
  | 'downgraded'
  | 'hidden'
  | 'blocked'
  | 'not_generated';
```

### General rules
- High confidence → visible
- Moderate confidence → visible-with-caution for developmental use; downgraded for hiring-support context unless policy allows otherwise
- Low confidence → downgraded or hidden
- Unacceptable confidence → hidden
- Derived outputs require their prerequisites
- Blocked output is never displayed as a score
- User-safe report strips Admin-only metadata

### Domain summary behavior
Hide a domain summary when the contributing dimensions do not meet the required coverage/confidence rule.

### Restricted outputs
- Values-alignment-style output is suppressed in hiring context unless explicitly permitted in the future.
- Derailment Risk remains blocked.
- Restricted/blocked output appears only as an omission explanation, never as data.

---

## 4. Operational Question Eligibility

The AI Agent selects only governed eligible items from `item_bank`.

### Minimum frontend prototype eligibility rule
An operational selected question must:
1. have `bankState = production`,
2. not have `useStatus = operational_blocked`,
3. not have `reviewStatus = quarantine_pending_dif_review`,
4. satisfy job-level overlay,
5. satisfy use-case restrictions,
6. preserve source metadata,
7. comply with method-family adaptation policy.

### Restricted items
`operational_allowed_with_restrictions` and `operational_allowed_restricted_by_level` may only appear when the relevant mock rule explicitly passes.

### Pilot and research
Pilot/research items must not appear in ordinary operational assessment sets.

They may be represented later in a separately consented calibration flow, which is not part of the V1 prototype.

---

## 5. Method-Family Adaptation Rules

| Method family | Adaptation rule | Notes |
|---|---|---|
| Likert | Controlled contextual rephrase | Preserve intended meaning |
| Contextual self-report | Controlled contextual rephrase | Preserve behavior-frequency meaning |
| Forced choice | Light terminology adaptation only | Preserve trade-off and option polarity |
| Cognitive MCQ | Verbatim default | Do not invalidate keyed answer |
| SJT | Approved equivalence only | Preserve scenario logic, options, and keyed answer |

If a rephrase cannot be governed safely:
- retain original wording,
- show `Original wording retained`,
- and allow Admin preview.

---

## 6. Question-Level Scoring Attribution

Every answer is saved using:
- assessment ID,
- source Question ID,
- response,
- timestamp.

The User runtime must not calculate or display live scoring.

Future backend scoring becomes server-authoritative.

---

## 7. Domain 6 V1 Visibility

Domain 6 is visible in Admin reports.

Possible Admin visuals:
- CAI
- DII
- AFI
- ECFI
- SII
- DDI
- PDRI
- ECSI
- fit radar
- strengths
- contextual cautions
- confidence state
- omitted explanations

Where D3/D5 or other prerequisites are insufficient:
- mark provisional,
- downgrade,
- or omit with explanation.

User-safe projection may show only safe high-level contextual language where permitted.

---

## 8. UI to Future Backend Mapping

| UI concept | Future backend concept |
|---|---|
| Assignment lifecycle | session/assignment workflow state |
| Validity status | assessment-quality interpretation state |
| Report status | report-release state |
| Confidence chip | standard-error band |
| Selected question | immutable item-bank reference |
| Adapted wording | display-only adaptation record |
| Scoring Logic Locked | source scoring metadata is immutable |
| User-safe report | audience projection |
| Candidate Comparison | human-review comparison read model |
| Activity Log | organization-scoped view of future immutable audit stream |

---

## 9. Glossary

- **Participant**: canonical record for an assessed User
- **Candidate**: hiring-support label used in Candidate Comparison
- **User**: authenticated assessed person
- **Role Blueprint**: reusable governed definition of success for a role
- **Assessment Draft**: one tailored assessment being prepared for one Participant
- **Context Profile**: role-context inputs driving Domain 6 interpretation
- **Domain 6**: person-in-context interpretation layer
- **CAI**: Contextual Alignment Index
- **DII**: Decision Influence Index
- **AFI**: Ambiguity Fit Index
- **ECFI**: Execution-Context Fit Index
- **SII**: Stakeholder-Influence Index
- **DDI**: Decision Discipline Index
- **PDRI**: Pressure Distortion Risk Index
- **ECSI**: Ethical Constraint Stability Index
- **Fit radar**: User profile vs context-requirement visualization
