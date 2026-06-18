# Governed Workbook Audit Summary

Source file reviewed: `nexus_governed_master_questionnaire_bank_final(3).xlsx`

## Worksheets
1. `item_bank`
2. `validation_report`
3. `blueprint_summary`
4. `method_scale_audit`
5. `fc_expansion_register`
6. `precision_register`
7. `dif_governance`
8. `style_support`

## `item_bank` Summary

| Metric | Value |
|---|---:|
| Total items | 543 |
| Total source columns | 31 |
| D1 | 95 |
| D2 | 90 |
| D3 | 129 |
| D4 | 99 |
| D5 | 130 |

## Method Families

| Method | Count |
|---|---:|
| contextual_self_report | 200 |
| likert | 187 |
| cognitive_multiple_choice | 90 |
| forced_choice | 54 |
| sjt | 12 |

## Bank State

| State | Count |
|---|---:|
| production | 284 |
| pilot | 192 |
| research | 67 |

## Use Status

| Status | Count |
|---|---:|
| operational_allowed | 233 |
| operational_allowed_with_restrictions | 36 |
| operational_allowed_restricted_by_level | 15 |
| operational_blocked | 259 |

## Review Status

| Status | Count |
|---|---:|
| draft | 425 |
| needs_expert_review | 88 |
| quarantine_pending_dif_review | 30 |

## Exact `item_bank` Columns

```text
item_id
domain_id
domain_name
dimension_id
dimension_name
facet_id
facet_name
method_family
item_format
item_text
option_a
option_b
option_c
option_d
option_e
keyed_answer
response_scale
primary_domain_id
primary_dimension_id
primary_facet_id
secondary_dimension_ids
loading_type
intended_meaning
prohibited_overlap
bank_state
use_status
validation_track
job_level_overlay
reverse_scored
review_status
reviewer_notes
```

## Important Implementation Rules

- The source worksheet is `item_bank`.
- Business-facing copy may call it the Questions Sheet.
- Do not fabricate source-item `weight`.
- Do not fabricate source-item `difficulty`.
- Preserve immutable source metadata.
- Exclude blocked items from operational sets.
- Exclude quarantine items from ordinary operational sets.
- Treat pilot/research items as non-operational in V1 ordinary flow.
- Apply job-level overlays.
- Lazy-load converted source data.
