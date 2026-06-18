# Nexus Assessment Technical Documentation

**Author:** Manus AI  
**Date:** April 5, 2026

## 1. Document purpose

This document is the implementation-ready technical specification for the **Nexus Assessment** platform. It translates the finalized questionnaire bank, the current governance model, the derived **Domain 6** framework, and the governed **role-fit** architecture into a practical engineering specification for backend, frontend, data, analytics, psychometrics, and product teams.

The document assumes the current Nexus design has already locked the following product decisions. First, the questionnaire bank contains a governed master bank of **543 items** across **34 dimensions** in **Domains 1–5**. Second, **Domain 6** is **not** a direct questionnaire domain and must be computed as a **derived person-in-context layer** after questionnaire scoring. Third, the **role-fit agent** must consume validated role blueprints and Domain 6 outputs rather than infer fit directly from raw questionnaire responses. Fourth, pilot and research domains must remain governed and operationally restricted until validation thresholds are met.

This specification is intended to let the engineering team start implementation without having to reconstruct the product logic from scattered design documents.

## 2. Source-of-truth artifacts

The current technical design should be anchored to the following internal artifacts, which function as the governing source set for implementation.

| Artifact | Technical purpose |
|---|---|
| `nexus_governed_master_questionnaire_bank_final.csv` | Master questionnaire bank and item-level schema |
| `nexus_governed_master_questionnaire_bank_final.xlsx` | Workbook representation of the same governed bank |
| `nexus_governed_master_questionnaire_bank_summary_final.md` | Final bank counts, blueprint coverage, method mix, and governance summary |
| `nexus_governed_master_questionnaire_validation_report_final.csv` | Final validation status and schema checks |
| `nexus_domain6_framework_and_context_form.md` | Domain 6 derived scoring architecture, formulas, context schema, and reporting logic |
| `nexus_role_fit_validity_framework.md` | Governed role blueprint and role-fit validity model |
| `nexus_governed_master_questionnaire_blueprint_final.csv` | Final blueprint view of bank composition |
| `nexus_dif_governance_register_final.csv` | DIF quarantine and flag carry-forward register |
| `nexus_forced_choice_expansion_register_final.csv` | Forced-choice expansion governance register |
| `nexus_precision_expansion_register_final.csv` | Item expansion and minimum-per-dimension precision support register |
| `nexus_style_detection_support_register_final.csv` | Response-style resistance and style-detection support register |

Engineering should treat the **CSV bank** and the **Domain 6 framework** as the primary executable sources for the scoring and data contracts.

## 3. Product scope and system boundary

The Nexus platform is not a single questionnaire renderer. It is a **multi-layer assessment system**. The first layer administers and scores the psychometric bank across Domains 1–5. The second layer applies governance and interpretive controls. The third layer computes Domain 6 from person scores plus explicit context inputs. The fourth layer uses governed role blueprints to generate role-fit outputs for hiring, internal mobility, development, or scenario-based decision support.

| Layer | System responsibility | Output |
|---|---|---|
| **Assessment Delivery** | Render items, collect responses, manage sessions, apply administration rules | Raw responses and completion metadata |
| **Scoring Engine** | Score Domains 1–5, reverse-score items, compute dimension and domain results, apply method-specific logic | Standardized person profile |
| **Governance Engine** | Carry forward DIF flags, bank-state rules, confidence logic, and operational restrictions | Governed assessment result |
| **Domain 6 Engine** | Compare person profile to context profile and compute derived indices | CAI, DII, and secondary indices |
| **Role-Fit Engine / Agent** | Compare person-in-context results to approved role blueprint and generate fit interpretation | Fit score, fit band, strengths, risks, narrative |
| **Reporting Layer** | Generate candidate, admin, and role-fit views under governance rules | Reports, dashboards, downloadable summaries |

This separation is essential. It allows the platform to preserve psychometric scoring integrity while still supporting contextual interpretation and downstream fit decisions.

## 4. Final questionnaire architecture

The finalized governed master bank contains **543 items**, **34 dimensions**, and the following locked method mix.

| Method family | Response scale | Item count | Implementation implication |
|---|---|---:|---|
| `likert` | `1-5 Agreement` | 187 | Standard agreement items with reverse scoring support |
| `contextual_self_report` | `1-5 Frequency` | 200 | Contextual behavior-frequency items; must not use agreement scale |
| `forced_choice` | `forced_choice_binary` | 54 | Pairwise or binary forced-choice scoring logic |
| `cognitive_multiple_choice` | `cognitive_mcq` | 90 | Multiple-choice keyed-answer scoring |
| `sjt` | `sjt_single_best` | 12 | Situational judgment keyed-best-response logic |

The bank spans **Domains 1–5**, while **Domain 6** remains derived-only. The active domain states and operational restrictions must be enforced at runtime.

| Domain | Description | Current state | Operational interpretation |
|---|---|---|---|
| **D1** | Personality Architecture | Production | Operationally usable |
| **D2** | Cognitive Architecture | Production | Operationally usable, with some level restrictions |
| **D3** | Values and Motivational Drivers | Pilot / Research mix | Blocked for high-stakes operational use |
| **D4** | Interpersonal and Emotional Functioning | Production | Operationally usable, some dimensions restricted |
| **D5** | Applied Workplace Behavior | Pilot / Research mix | Blocked for high-stakes operational use |
| **D6** | Contextual Alignment and Decision Influence | Derived only | Computed after scoring; no direct questionnaire items |

The current bank also preserves critical calibration remediations. All contextual items use `1-5 Frequency`, reverse-scored non-cognitive coverage is above the minimum target band, forced-choice expansion has been added for response-style resistance, and top-severity DIF items are quarantined through governance markers rather than silently deleted.

## 5. Domain and dimension structure

The engineering implementation should treat **dimension** as the primary stable scoring unit. Raw items roll up to facets where applicable, but operational scoring and downstream integration should rely mostly on dimension-level scores because dimension outputs are more stable, easier to validate, and easier to govern.

| Domain | Dimension count | Core implementation note |
|---|---:|---|
| **D1** Personality Architecture | 6 | Non-cognitive; includes reverse-scored items and level overlays |
| **D2** Cognitive Architecture | 6 | Fully cognitive; all items use keyed-answer logic |
| **D3** Values and Motivational Drivers | 8 | Present in bank but operationally restricted |
| **D4** Interpersonal and Emotional Functioning | 6 | Mixed contextual, likert, forced-choice, and SJT support |
| **D5** Applied Workplace Behavior | 8 | Present in bank but operationally restricted |

The 34 current dimensions are as follows.

| Domain | Dimensions |
|---|---|
| **D1** | D1-CE, D1-EO, D1-ES, D1-IN, D1-IO, D1-SA |
| **D2** | D2-AR, D2-DC, D2-LA, D2-NR, D2-SST, D2-VR |
| **D3** | D3-AD, D3-AF, D3-AUD, D3-ID, D3-LD, D3-PU, D3-RO, D3-SD |
| **D4** | D4-RC, D4-RM, D4-SA, D4-SO, D4-SR, D4-TC |
| **D5** | D5-AD, D5-CC, D5-CI, D5-ED, D5-JDQ, D5-LE, D5-TC, D5-WS |

## 6. Production questionnaire item schema

The final CSV bank currently uses the following header and this exact column order should be preserved in importers, validation jobs, internal admin tools, and build pipelines.

| Column | Type | Required | Description |
|---|---|---|---|
| `item_id` | string | Yes | Globally unique item identifier such as `NEX-GMB-001` |
| `domain_id` | string | Yes | Primary domain code, e.g. `D1` |
| `domain_name` | string | Yes | Human-readable domain label |
| `dimension_id` | string | Yes | Dimension code, e.g. `D1-CE` |
| `dimension_name` | string | Yes | Human-readable dimension label |
| `facet_id` | string | Yes | Facet code |
| `facet_name` | string | Yes | Human-readable facet name |
| `method_family` | enum | Yes | `likert`, `contextual_self_report`, `forced_choice`, `cognitive_multiple_choice`, `sjt` |
| `item_format` | enum | Yes | Rendering format such as `statement` |
| `item_text` | text | Yes | Primary prompt or statement |
| `option_a` | text | Conditional | Option A for forced-choice, cognitive, or SJT |
| `option_b` | text | Conditional | Option B |
| `option_c` | text | Conditional | Option C |
| `option_d` | text | Conditional | Option D |
| `option_e` | text | Conditional | Option E |
| `keyed_answer` | string | Conditional | Correct or preferred answer key for scored non-Likert methods |
| `response_scale` | enum | Yes | `1-5 Agreement`, `1-5 Frequency`, `forced_choice_binary`, `cognitive_mcq`, `sjt_single_best` |
| `primary_domain_id` | string | Yes | Governing primary domain linkage |
| `primary_dimension_id` | string | Yes | Governing primary dimension linkage |
| `primary_facet_id` | string | Yes | Governing primary facet linkage |
| `secondary_dimension_ids` | string/list | Optional | Comma-delimited secondary overlaps for governance review |
| `loading_type` | enum | Yes | Loading pattern such as `adjacent` |
| `intended_meaning` | text | Yes | Construct intent statement |
| `prohibited_overlap` | text | Optional | Construct area to avoid conflation with |
| `bank_state` | enum | Yes | `production`, `pilot`, or `research` |
| `use_status` | enum | Yes | Operational permission state |
| `validation_track` | string/list | Yes | Validation flags such as `calibration,discriminant` |
| `job_level_overlay` | enum/string | Yes | Audience or level restrictions |
| `reverse_scored` | boolean | Yes for non-cognitive | Whether scoring direction must be flipped |
| `review_status` | enum | Yes | Current review state |
| `reviewer_notes` | text | Optional | Governance and authoring notes |

The ingestion service should reject files that change column names, reorder required columns without mapping metadata, or introduce unsupported method-scale combinations.

## 7. Method-specific rendering and validation rules

The delivery layer must not treat all items as interchangeable. Each method family requires its own rendering logic, input validation, and scoring behavior.

| Method family | Render pattern | Required fields | Scoring rule |
|---|---|---|---|
| `likert` | Single statement with 1–5 agreement scale | `item_text`, `response_scale`, `reverse_scored` | Numeric score 1–5; reverse if flagged |
| `contextual_self_report` | Context behavior statement with 1–5 frequency scale | `item_text`, `response_scale`, `reverse_scored` | Numeric score 1–5; reverse if flagged |
| `forced_choice` | Pairwise binary choice between two keyed alternatives | `item_text` or standard instruction line, paired options, keyed mapping | Convert choice to trait-keyed polarity or pairwise score |
| `cognitive_multiple_choice` | Stem plus 4–5 options | `item_text`, options, `keyed_answer` | 1 for correct, 0 for incorrect, optionally IRT-ready later |
| `sjt` | Scenario plus options, single best answer | `item_text`, options, `keyed_answer` | Single-best keyed score, later expandable to partial-credit model |

The validation service must enforce the following minimal method contracts.

| Method family | Validation contract |
|---|---|
| `likert` | `response_scale` must equal `1-5 Agreement`; `keyed_answer` must be empty; at least `item_text` must exist |
| `contextual_self_report` | `response_scale` must equal `1-5 Frequency`; `keyed_answer` must be empty |
| `forced_choice` | `response_scale` must equal `forced_choice_binary`; at least two options must exist; scoring key must be inferable from schema or pair map |
| `cognitive_multiple_choice` | `response_scale` must equal `cognitive_mcq`; options A–D required, E optional; `keyed_answer` required |
| `sjt` | `response_scale` must equal `sjt_single_best`; options required; `keyed_answer` required |

## 8. Assessment delivery architecture

The assessment application should be implemented as a **session-based adaptive delivery shell** even if the first release does not yet include psychometric adaptivity. The session system must support resumability, method-aware rendering, audit logging, timed sections for cognitive methods if enabled, and governance-aware blocking of restricted scales in operational contexts.

| Delivery component | Responsibility |
|---|---|
| **Session service** | Creates assessment sessions, stores state, supports pause and resume |
| **Item selection service** | Chooses which bank items are delivered for a given form or program |
| **Renderer** | Displays item based on `method_family` and `response_scale` |
| **Response capture service** | Validates and stores user responses with timestamps |
| **Quality-control service** | Records missingness, latency, straightlining indicators, contradiction checks, and forced-choice completion consistency |
| **Completion service** | Closes sections, computes eligibility for scoring, and emits scoring job |

The team should separate **bank administration** from **form assembly**. The governed master bank is not what every candidate necessarily sees in one sitting. Production forms can be assembled from the bank according to program rules, role family, job level, validation state, and release policy.

## 9. Recommended system components

A service-oriented internal design is recommended even if the first implementation deploys as a modular monolith. The reason is that the Nexus product contains clearly separable responsibilities that will become difficult to maintain if deeply entangled.

| Service / module | Core responsibility | Suggested storage ownership |
|---|---|---|
| **Identity and Access** | Users, admins, managers, assessor roles, API credentials | User/auth tables |
| **Bank Registry** | Item bank versions, import jobs, release states, governance metadata | Bank and item tables |
| **Form Assembly** | Assessment form definition, versioning, program rules | Form tables |
| **Assessment Runtime** | Sessions, page state, timers, responses, completion | Session and response tables |
| **Scoring Engine** | Item scoring, dimension scoring, standardization, QC flags | Result tables |
| **Governance Engine** | DIF carry-forward, restrictions, confidence, release policy | Governance tables |
| **Context Service** | Context forms, role templates, scenario definitions | Context tables |
| **Domain 6 Engine** | CAI, DII, secondary indices, confidence statement | Domain 6 results tables |
| **Role Blueprint Service** | Role evidence intake, blueprint approval, weights, thresholds | Role blueprint tables |
| **Role-Fit Engine** | Candidate-role matching and interpretive output | Role-fit result tables |
| **Reporting Service** | Report generation, dashboards, export jobs | Report metadata |
| **Audit and Analytics** | Event logs, calibration data, psychometric monitoring | Event and analytics warehouse |

## 10. End-to-end scoring pipeline

The scoring flow should be deterministic, asynchronous, and fully auditable. A background job architecture is recommended because scoring can include multiple dependent passes: raw scoring, quality-control checks, standardization, governance, Domain 6 derivation, and role-fit interpretation.

| Stage | Input | Processing | Output |
|---|---|---|---|
| **1. Response finalization** | Session responses | Check completion, missingness, method validity | Locked response payload |
| **2. Item scoring** | Locked responses + bank metadata | Reverse scoring, keyed-answer scoring, forced-choice mapping | Item-level scored responses |
| **3. Aggregate scoring** | Scored items | Compute facet, dimension, domain, and method summaries | Raw score profile |
| **4. Standardization** | Raw scores + norms/config | Convert raw scores to standardized scores | Standardized person profile |
| **5. Quality control** | Scored profile + response metadata | Detect style issues, contradictions, DIF exposure, low precision | QC and governance flags |
| **6. Governance pass** | Standardized profile + governance rules | Block restricted outputs, compute confidence, quarantine flagged content | Governed profile |
| **7. Domain 6 derivation** | Governed profile + context record | Compute CAI, DII, AFI, ECFI, SII, DDI, PDRI, ECSI | Domain 6 result |
| **8. Role-fit scoring** | Governed profile + Domain 6 + approved role blueprint | Compute fit score, fit band, strengths, and risks | Role-fit result |
| **9. Reporting** | All prior outputs | Build user-specific report views under permissions | Candidate/admin/assessor reports |

## 11. Item scoring logic

### 11.1 Likert and contextual scoring

For `likert` and `contextual_self_report` items, the response value should be stored as an ordinal integer from **1** to **5**. Reverse-scored items must be flipped before aggregation using the simple transformation:

```text
reversed_score = 6 - raw_score
```

This rule applies only to non-cognitive items flagged as `reverse_scored = true`.

### 11.2 Cognitive multiple-choice scoring

For `cognitive_multiple_choice` items, the runtime captures the selected option and compares it against `keyed_answer`.

```text
item_score = 1 if selected_option == keyed_answer else 0
```

The first release should use classical keyed scoring. The architecture should nevertheless preserve support for future IRT or difficulty-parameter extensions by storing item-level correctness separately from higher-level scale summaries.

### 11.3 Situational judgment scoring

For `sjt` items, the first release should also use keyed-best-response scoring.

```text
item_score = 1 if selected_option == keyed_answer else 0
```

A later release may introduce partial-credit models if calibration evidence supports that change.

### 11.4 Forced-choice scoring

Forced-choice items should not be flattened into ordinary Likert-like values. They require either pairwise keyed logic or ipsative/partial-ipsative scoring rules depending on how the pair was authored. The current bank uses forced-choice as a response-style resistance layer rather than as a standalone primary scale. Therefore, first-release scoring can use a governed pairwise mapping table that translates each forced-choice response into one or more dimension contributions.

| Forced-choice release recommendation | Implementation detail |
|---|---|
| **Store each option’s keyed target** | Add a pair-map config table rather than overloading bank CSV columns |
| **Score by selected keyed pole** | Increment contribution to the keyed dimension/pole |
| **Do not normalize as raw Likert mean** | Keep separate method-weight handling in aggregation |
| **Retain raw choice trail** | Needed for audit, style detection, and future recalibration |

## 12. Aggregate scoring model

The bank should be aggregated in stages. The first release should compute **item -> facet -> dimension -> domain** summaries. However, downstream interpretation, Domain 6, and role-fit should primarily consume **dimension-level standardized scores**.

| Level | Recommended computation |
|---|---|
| **Facet raw score** | Mean or sum of scored items mapped to facet |
| **Dimension raw score** | Weighted or unweighted aggregate of facets/items in the dimension |
| **Domain raw score** | Aggregate of dimension scores within domain |
| **Standardized score** | Convert raw level to 0–100 or normed metric based on calibration config |

The platform should store both **raw scores** and **standardized scores** because psychometric maintenance, calibration work, and future norm updates require reproducibility.

## 13. Standardization and norms layer

The current documentation and build artifacts imply a standardized **0–100** dimension representation is the correct operational layer for Domain 6 and role-fit. The scoring engine should therefore support a norm/config table that maps raw dimension results into standardized outputs.

| Field | Purpose |
|---|---|
| `norm_version` | Identifies the standardization release used |
| `dimension_id` | Dimension to which the rule applies |
| `population_segment` | Optional norm segment such as job family or level |
| `raw_min` / `raw_max` | Expected raw range |
| `transform_type` | Linear, percentile, z-score-derived, or lookup table |
| `standardized_output_min` / `max` | Usually 0 and 100 |
| `effective_date` | Governance and reproducibility |

The first release may use a controlled linear or lookup transform if empirical norms are not yet final. The implementation must keep the transform versioned so historical reports remain reproducible.

## 14. Quality control and response-style safeguards

Nexus already expanded forced-choice content and reverse coverage to improve resistance to careless, acquiescent, or stylized responding. The platform therefore needs a dedicated **response-quality layer** rather than treating the questionnaire as a simple survey.

| QC signal | Operational purpose |
|---|---|
| **Straightlining detection** | Detect low variance responding across same-scale blocks |
| **Reverse inconsistency checks** | Detect agreement with both positive and negative trait statements |
| **Latency anomalies** | Detect unrealistically fast completion or block-level speed issues |
| **Missingness and abandonment** | Detect incomplete or low-engagement sessions |
| **Forced-choice inconsistency** | Detect unstable polarity across mirrored pairs |
| **Cognitive section timing anomalies** | Detect non-serious engagement or unusual administration conditions |
| **DIF exposure flags** | Carry forward governance warnings on flagged items/scales |

The system should not automatically invalidate a result solely because one QC rule triggers. Instead, the governance engine should convert QC signals into **confidence states**, **warnings**, **suppression rules**, or **manual review requirements**.

## 15. Governance model

The governance layer is a first-class system, not a reporting afterthought. This is especially important because the final bank explicitly contains production, pilot, and research content in the same governed master bank.

| Governance field | System use |
|---|---|
| `bank_state` | Determines maturity of the item or scale |
| `use_status` | Determines whether output may appear operationally |
| `validation_track` | Tracks calibration, discriminant, or further study needs |
| `review_status` | Tracks review workflow |
| `reviewer_notes` | Human-readable governance rationale |
| DIF registers | Suppress or warn on quarantined items/scales |

The minimum runtime governance rules should be the following.

| Rule | Required system behavior |
|---|---|
| **Operationally blocked scales** | Must not appear as decision-driving outputs in high-stakes operational reports |
| **Pilot or research bank states** | May appear only in research, calibration, or explicitly provisional reporting modes |
| **Quarantined DIF items** | Must be excluded, down-weighted, or flagged according to governance config |
| **Low-confidence profiles** | Must show confidence label and restrict strong interpretive language |
| **Domain 6 dependence on provisional content** | Must reduce Domain 6 confidence accordingly |
| **Role-fit on unapproved role blueprint** | Must not produce high-stakes or definitive fit decisions |

## 16. Domain 6 technical architecture

**Domain 6** is a post-scoring derived engine. It must not alter raw Domains 1–5 scores. Instead, it consumes the standardized person profile and an explicit context record.

| Domain 6 input layer | Technical source |
|---|---|
| **Person profile** | Standardized dimension scores from Domains 1–5 plus governance flags |
| **Context profile** | 17-field short context form or approved role-template record |
| **Governance context** | QC flags, DIF flags, blocked domains, blueprint approval status |

The current production recommendation includes **two primary outputs** and **six secondary outputs**.

| Index | Meaning |
|---|---|
| **CAI** | Contextual Alignment Index |
| **DII** | Decision Influence Index |
| **AFI** | Ambiguity Fit Index |
| **ECFI** | Execution-Context Fit Index |
| **SII** | Stakeholder-Influence Index |
| **DDI** | Decision Discipline Index |
| **PDRI** | Pressure Distortion Risk Index |
| **ECSI** | Ethical Constraint Stability Index |

### 16.1 Context form schema

The implementation should support a short structured context object with the following minimum fields.

| Field | Type | Notes |
|---|---|---|
| `context_id` | string | Unique identifier |
| `context_name` | string | Role/scenario name |
| `job_family` | enum | Strategy, Operations, Sales, Product, Engineering, People, Finance, Risk, General Management, Other |
| `job_level` | enum | IC, Professional, Manager, Senior Manager, Director, Executive |
| `leadership_scope` | integer | 0–4 |
| `ambiguity_level` | integer | 1–5 |
| `decision_stakes` | integer | 1–5 |
| `time_pressure` | integer | 1–5 |
| `regulatory_constraint` | integer | 1–5 |
| `autonomy_level` | integer | 1–5 |
| `stakeholder_complexity` | integer | 1–5 |
| `interdependence_level` | integer | 1–5 |
| `innovation_demand` | integer | 1–5 |
| `execution_precision_demand` | integer | 1–5 |
| `customer_exposure` | integer | 1–5 |
| `conflict_load` | integer | 1–5 |
| `change_velocity` | integer | 1–5 |
| `failure_cost` | integer | 1–5 |
| `success_profile_notes` | text | Optional narrative notes |

### 16.2 Contextual Alignment Index formula

The current recommended implementation formula is:

```text
CAI = 100 - 100 * ( sum(Wd * abs(Pd - Rd)) / (sum(Wd) * 100) ) - sum(Gd)
```

Where:

| Symbol | Meaning |
|---|---|
| `Pd` | Standardized person score on dimension `d` |
| `Rd` | Required level for dimension `d` in the context template |
| `Wd` | Weight of dimension `d` in the template |
| `Gd` | Governance penalty if flagged constraints apply |

Recommended interpretation bands are as follows.

| CAI range | Interpretation |
|---|---|
| 80–100 | Strong contextual fit |
| 65–79 | Good fit with manageable stretch |
| 50–64 | Mixed or conditional fit |
| 35–49 | Weak fit |
| 0–34 | Poor fit |

### 16.3 Decision Influence Index formula

The current recommended implementation formula is:

```text
DII = 0.30 * DDI + 0.20 * AFI + 0.15 * SII + 0.15 * ECSI - 0.20 * PDRI
```

This makes DII interpretable rather than opaque. High decision discipline, ambiguity fit, stakeholder control, and ethical stability raise the score; high pressure distortion lowers it.

### 16.4 Secondary index formulas

The first release should implement the currently recommended formulas as configurable weighted composites rather than hard-coded constants spread across code.

| Index | Recommended formula |
|---|---|
| **AFI** | `0.35 * D2 ambiguity-handling + 0.25 * D2 systems reasoning + 0.20 * D4 resilience + 0.20 * D5 adaptability` |
| **ECFI** | `0.35 * D5 disciplined execution + 0.25 * D1 conscientious execution + 0.20 * D5 workload structure + 0.20 * D1 integrity/compliance orientation` |
| **SII** | `0.30 * D3 influence drive + 0.20 * D3 affiliation + 0.20 * D4 social regulation + 0.15 * D1 self-awareness - 0.15 * approval-dependent distortion flag` |
| **DDI** | `0.35 * D2 decision quality + 0.25 * D5 judgment quality + 0.20 * D4 self-regulation + 0.20 * D1 conscientious execution` |
| **PDRI** | `0.35 * low D4 self-regulation + 0.25 * low D4 resilience + 0.20 * high motive pressure + 0.20 * high time-pressure context interaction` |
| **ECSI** | `0.40 * D1 integrity + 0.20 * D1 conscientious execution + 0.20 * D4 self-regulation + 0.20 * low motive-pressure distortion` |

The best implementation pattern is to store these as **versioned formula configurations** mapped to dimension IDs and transformation rules.

### 16.5 Domain 6 confidence logic

The Domain 6 engine must emit a confidence value because the derived layer depends on both source-scale quality and context quality.

| Condition | Confidence |
|---|---|
| Stable source scales, no major flags, explicit context | `High` |
| Some provisional or pilot/research dependence | `Moderate` |
| Major DIF, quarantined content, weak profile precision, or poor context definition | `Provisional` |

## 17. Role blueprint and role-fit architecture

The role-fit layer must consume a governed **Role Blueprint** object. The role-fit service should never rely on job title alone.

| Role blueprint field | Description |
|---|---|
| `role_id` | Unique role identifier |
| `role_title` | Human-readable title |
| `role_level` | Level band |
| `job_family` | Functional family |
| `context_flags` | Context descriptors such as regulated or innovation-heavy |
| `critical_outcomes` | Measurable success targets |
| `critical_tasks` | Ranked task list |
| `required_dimensions` | Dimensions included in fit model |
| `excluded_dimensions` | Dimensions intentionally not used |
| `dimension_weights` | Role-fit weights |
| `rationale` | Why each dimension matters |
| `evidence_sources` | Source list supporting blueprint |
| `confidence_score` | Evidence completeness and agreement score |
| `approval_status` | `draft`, `reviewed`, `approved`, `validated` |

The role blueprint process should preserve the five-layer validity logic already defined conceptually: intake, translation, verification, approval, and validation.

### 17.1 Role-fit score formula

The role-fit engine should use only approved role blueprint dimensions and weights.

```text
Fit = sum( wd * similarity(Sd, Td) ) / sum(wd)
```

A simple default similarity function is:

```text
similarity(Sd, Td) = 1 - abs(Sd - Td)
```

Where scores are normalized to 0–1 or equivalently standardized to 0–100 and rescaled internally.

Recommended operational bands are:

| Fit score | Band |
|---|---|
| 85–100 | Strong Fit |
| 75–84 | Good Fit |
| 60–74 | Conditional Fit |
| Below 60 | Weak Fit |

The role-fit engine should also expose the top positive gaps, top negative gaps, role-critical threshold failures, and confidence modifiers.

## 18. Database model

A relational core with analytics export is the best fit for Nexus. PostgreSQL is recommended for transactional storage, with a warehouse or analytical mirror later if usage scales.

### 18.1 Core entity model

| Table | Purpose | Key fields |
|---|---|---|
| `users` | Candidate, admin, manager, assessor identities | `user_id`, `role_type`, auth fields |
| `item_banks` | Bank versions and release states | `bank_id`, `version`, `status`, `created_at` |
| `items` | Questionnaire items | all item schema fields plus foreign keys |
| `forms` | Deliverable assessment forms assembled from bank | `form_id`, `bank_id`, `form_type`, `status` |
| `form_items` | Item order and form membership | `form_id`, `item_id`, section/order metadata |
| `assessment_sessions` | Runtime instances | `session_id`, `user_id`, `form_id`, state, started/completed times |
| `responses` | Raw captured responses | `response_id`, `session_id`, `item_id`, answer payload, timestamps |
| `scoring_runs` | Scoring job metadata | `scoring_run_id`, `session_id`, `norm_version`, status |
| `item_scores` | Item-level scored outputs | `scoring_run_id`, `item_id`, scored value |
| `dimension_scores` | Dimension-level raw and standardized outputs | `scoring_run_id`, `dimension_id`, raw_score, standardized_score |
| `domain_scores` | Domain summaries | `scoring_run_id`, `domain_id`, raw_score, standardized_score |
| `qc_flags` | Response quality and governance signals | `scoring_run_id`, flag_code, severity |
| `contexts` | Short context form instances or imported context records | `context_id`, all context fields |
| `domain6_runs` | Domain 6 jobs | `domain6_run_id`, `scoring_run_id`, `context_id`, version |
| `domain6_scores` | Domain 6 primary and secondary indices | `domain6_run_id`, index_code, score |
| `role_blueprints` | Role profile objects | `role_blueprint_id`, approval state, confidence |
| `role_blueprint_dimensions` | Required dimensions and weights | `role_blueprint_id`, `dimension_id`, required_level, weight |
| `role_fit_runs` | Candidate-role evaluation jobs | `role_fit_run_id`, `scoring_run_id`, `domain6_run_id`, `role_blueprint_id` |
| `role_fit_outputs` | Fit outputs and interpretive details | fit score, band, strengths, risks, notes |
| `audit_events` | Immutable system event log | actor, event, target, timestamp, payload |

### 18.2 Example response payload model

The runtime should store raw user responses in method-specific but normalized format.

```json
{
  "response_id": "resp_001",
  "session_id": "sess_123",
  "item_id": "NEX-GMB-001",
  "method_family": "likert",
  "response_value": 4,
  "captured_at": "2026-04-05T10:15:21Z",
  "latency_ms": 5820,
  "page_index": 3
}
```

A cognitive response would use option keys instead.

```json
{
  "response_id": "resp_450",
  "session_id": "sess_123",
  "item_id": "NEX-GMB-220",
  "method_family": "cognitive_multiple_choice",
  "selected_option": "C",
  "captured_at": "2026-04-05T10:32:09Z",
  "latency_ms": 17120,
  "page_index": 14
}
```

## 19. API contract overview

A REST API is sufficient for the first release. Internal background jobs may still use message queues for scoring and report generation.

### 19.1 Bank and form management APIs

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/banks` | `GET` | List bank versions |
| `/api/banks/:bankId/items` | `GET` | Retrieve governed items |
| `/api/forms` | `POST` | Create or publish a form |
| `/api/forms/:formId` | `GET` | Get form definition |
| `/api/forms/:formId/publish` | `POST` | Publish form for runtime use |

### 19.2 Assessment runtime APIs

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/sessions` | `POST` | Start new session |
| `/api/sessions/:sessionId` | `GET` | Get current session state |
| `/api/sessions/:sessionId/responses` | `POST` | Submit response batch |
| `/api/sessions/:sessionId/complete` | `POST` | Finalize session and trigger scoring |
| `/api/sessions/:sessionId/status` | `GET` | Poll progress |

### 19.3 Scoring and Domain 6 APIs

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/scoring/:sessionId` | `GET` | Get scored D1–D5 result |
| `/api/contexts` | `POST` | Create context record |
| `/api/domain6` | `POST` | Compute Domain 6 for scored profile + context |
| `/api/domain6/:runId` | `GET` | Retrieve Domain 6 result |

### 19.4 Role blueprint and role-fit APIs

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/role-blueprints` | `POST` | Create role blueprint |
| `/api/role-blueprints/:id` | `GET` | Retrieve blueprint |
| `/api/role-blueprints/:id/approve` | `POST` | Move blueprint through governance workflow |
| `/api/role-fit` | `POST` | Compute role fit from profile, Domain 6, and role blueprint |
| `/api/role-fit/:runId` | `GET` | Retrieve fit output |

### 19.5 Reporting APIs

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/reports/assessment/:sessionId` | `GET` | Candidate/admin report |
| `/api/reports/domain6/:runId` | `GET` | Domain 6 section |
| `/api/reports/role-fit/:runId` | `GET` | Role-fit report |

## 20. Example scored-profile contract

The scoring engine should return a stable machine-readable contract that downstream services can trust.

```json
{
  "scoring_run_id": "score_001",
  "session_id": "sess_123",
  "bank_version": "final",
  "norm_version": "v1",
  "domain_scores": [
    {"domain_id": "D1", "standardized_score": 71.4},
    {"domain_id": "D2", "standardized_score": 77.8}
  ],
  "dimension_scores": [
    {"dimension_id": "D1-CE", "raw_score": 43, "standardized_score": 74.2},
    {"dimension_id": "D2-DC", "raw_score": 11, "standardized_score": 79.1}
  ],
  "qc_flags": [
    {"flag_code": "reverse_consistency_watch", "severity": "low"}
  ],
  "confidence": "High"
}
```

## 21. Example Domain 6 output contract

```json
{
  "domain6_run_id": "d6_001",
  "scoring_run_id": "score_001",
  "context_id": "ctx_101",
  "version": "v1",
  "primary_indices": {
    "CAI": 81.6,
    "DII": 54.3
  },
  "secondary_indices": {
    "AFI": 73.2,
    "ECFI": 68.4,
    "SII": 57.9,
    "DDI": 75.1,
    "PDRI": 33.8,
    "ECSI": 79.4
  },
  "confidence": "Moderate",
  "governance_notes": [
    "Includes provisional input from pilot domain D5",
    "No quarantined item dependence detected"
  ]
}
```

## 22. Example role-fit output contract

```json
{
  "role_fit_run_id": "rf_001",
  "role_blueprint_id": "rb_001",
  "scoring_run_id": "score_001",
  "domain6_run_id": "d6_001",
  "fit_score": 84.7,
  "fit_band": "Good Fit",
  "confidence": "Moderate",
  "top_strengths": [
    {"dimension_id": "D2-DC", "gap_vs_target": 6.3},
    {"dimension_id": "D1-CE", "gap_vs_target": 4.2}
  ],
  "top_risks": [
    {"dimension_id": "D4-SR", "gap_vs_target": -8.1}
  ],
  "threshold_failures": [],
  "narrative_summary": "The profile shows good match to the role blueprint with manageable stretch under pressure.",
  "blueprint_status": "approved"
}
```

## 23. Workflow specifications

### 23.1 Candidate assessment workflow

| Step | Actor | System action |
|---|---|---|
| 1 | Candidate or admin | Session is created from a published form |
| 2 | Candidate | Completes assessment sections |
| 3 | Runtime | Validates responses and closes session |
| 4 | Scoring engine | Computes D1–D5 scores and QC flags |
| 5 | Governance engine | Applies restrictions and confidence logic |
| 6 | Reporting | Publishes candidate-safe report |

### 23.2 Context-aware fit workflow

| Step | Actor | System action |
|---|---|---|
| 1 | Admin/manager/assessor | Creates or selects a context record |
| 2 | Domain 6 engine | Computes person-in-context indices |
| 3 | Role blueprint service | Loads approved role blueprint |
| 4 | Role-fit engine | Computes fit score and band |
| 5 | Reporting | Publishes fit report with governance notes |

### 23.3 Role blueprint governance workflow

| Step | Actor | System action |
|---|---|---|
| 1 | Admin or agent-assisted intake | Captures role evidence |
| 2 | Blueprint service | Produces draft role blueprint |
| 3 | Reviewer | Reviews and edits blueprint |
| 4 | Governance lead | Approves or rejects |
| 5 | Analytics / validation team | Upgrades blueprint to validated after evidence review |

## 24. Reporting architecture

The platform should support at least four report audiences because one report cannot safely serve all purposes.

| Report type | Intended audience | Allowed content |
|---|---|---|
| **Candidate report** | Candidate or participant | High-level D1–D5 results, selective Domain 6 if enabled, development-safe language |
| **Admin report** | Assessment administrator | Full score grid, governance flags, completion metadata |
| **Assessor/manager report** | Development or placement use | Context-aware interpretation with confidence statements |
| **Role-fit report** | Recruiter, talent, or decision support team | Fit score, fit band, strengths, risks, blueprint status, explicit governance caveats |

Pilot or research outputs should only appear where governance rules permit them.

## 25. Security, privacy, and audit requirements

Because Nexus stores sensitive psychometric and role-evaluation data, the implementation should treat security and auditability as product requirements rather than infrastructure extras.

| Requirement | Minimum implementation expectation |
|---|---|
| **Access control** | Role-based access control for candidate, admin, assessor, manager, governance, and analytics roles |
| **PII separation** | Separate identity/PII tables from scoring outputs where possible |
| **Encryption** | Encrypt data in transit and at rest |
| **Audit trails** | Log scoring version, bank version, context version, role blueprint version, and report access |
| **Version reproducibility** | Every result must be reproducible from stored version metadata |
| **Report suppression rules** | Prevent blocked or provisional content from leaking into high-stakes outputs |
| **Data retention controls** | Support jurisdictional retention policies and deletion workflows |

## 26. Versioning strategy

Nexus will evolve. Engineering therefore needs a versioning strategy from day one.

| Versioned object | Why versioning is mandatory |
|---|---|
| **Item bank** | Item wording, governance state, and scoring logic may change |
| **Forms** | Operational forms can differ from master bank |
| **Norms / transforms** | Standardized scores must remain reproducible |
| **Domain 6 formulas** | Weights and mappings will evolve through validation |
| **Context templates** | Role contexts are governed objects |
| **Role blueprints** | Role requirements change over time |
| **Report templates** | Different releases may expose different content |

The result object should always record the full version chain used to produce it.

## 27. Calibration, analytics, and monitoring requirements

The platform should be designed to support post-launch psychometric monitoring. This means the engineering team must not throw away scoring internals after producing a report.

| Analytics requirement | Stored data needed |
|---|---|
| **Item performance tracking** | Item-level responses, keyed correctness, response times |
| **Reverse-item functioning checks** | Item-level non-cognitive data with reverse flags |
| **DIF analysis** | Group metadata and item response distributions under privacy controls |
| **Scale precision and reliability** | Raw and standardized dimension outputs, item-score matrices |
| **Form-equating or parallel-form review** | Form membership and bank version data |
| **Role-fit validation** | Blueprint versions, fit outputs, and downstream outcome linkage data |
| **Domain 6 validation** | Context record versions, Domain 6 outputs, and performance/decision-quality outcomes |

## 28. Frontend implementation requirements

The frontend should be built as a method-aware assessment runtime plus an admin/governance console. It should not be implemented as a flat survey page.

| Frontend surface | Main requirements |
|---|---|
| **Candidate runtime** | Session resume, progress save, method-aware rendering, accessibility, timing support, mobile-safe layout |
| **Admin console** | Bank version browsing, form publishing, session management, governance review |
| **Context form UI** | 17-field structured form, template prefill, free-text notes |
| **Role blueprint UI** | Evidence intake, dimension weighting, approval workflow |
| **Report UI** | Candidate-safe and admin-safe views with confidence and governance badges |

## 29. First-release implementation recommendation

The best initial engineering release is a governed **Phase 1 production shell** rather than a maximally ambitious all-at-once platform. The first release should support end-to-end execution while keeping the more experimental content properly controlled.

| Release component | First-release recommendation |
|---|---|
| **Questionnaire runtime** | Full support for current method families |
| **D1, D2, D4 reporting** | Operationally enabled |
| **D3, D5 reporting** | Research/pilot-only or suppressed depending on program mode |
| **Domain 6** | Enabled as derived layer when valid context exists |
| **Role-fit** | Enabled only against approved role blueprints |
| **Analytics logging** | Mandatory from launch |
| **Manual governance console** | Mandatory from launch |

## 30. Implementation sequence for the tech team

The user has consistently preferred a complete, structured plan rather than a sprint-only view. The engineering sequence below therefore follows the product architecture from foundation to full operational use.

| Sequence | Build objective | Main deliverables |
|---|---|---|
| **1** | Establish data contracts and bank ingestion | Item schema validator, bank import service, versioned registry |
| **2** | Build assessment runtime | Session APIs, rendering engine, response capture |
| **3** | Implement scoring engine | Method scoring, reverse logic, aggregate scoring, standardization |
| **4** | Implement governance layer | QC flags, blocked-state suppression, confidence logic |
| **5** | Build reporting shell | Candidate/admin score output with permissions |
| **6** | Add context service and Domain 6 | Context form, template registry, CAI/DII engine |
| **7** | Add role blueprint workflow | Role evidence intake, approval flow, versioning |
| **8** | Add role-fit engine | Fit scoring, fit banding, strengths/risks, report view |
| **9** | Add analytics and calibration monitoring | Warehousing, psychometric dashboards, DIF review pipeline |
| **10** | Prepare validation-driven upgrades | Norm refinement, Domain 6 tuning, partial-credit SJT or IRT if justified |

## 31. Acceptance criteria

The first complete engineering implementation should be considered acceptable only if the following conditions are met.

| Acceptance area | Minimum criterion |
|---|---|
| **Schema fidelity** | Final bank imports without column loss or unsupported method combinations |
| **Scoring fidelity** | Reverse scoring, cognitive keys, SJT keys, and forced-choice mapping all execute deterministically |
| **Governance fidelity** | Blocked and provisional content is correctly suppressed or labeled |
| **Domain 6 fidelity** | CAI, DII, and secondary indices compute only from scored profile plus explicit context |
| **Role-fit fidelity** | Fit scoring uses only approved role blueprints |
| **Auditability** | Each result stores bank, norm, context, Domain 6, and blueprint versions |
| **Report safety** | Candidate and admin outputs obey permission and governance rules |
| **Calibration readiness** | Analytics data required for psychometric monitoring is preserved |

## 32. Recommended engineering conventions

| Area | Recommendation |
|---|---|
| **Primary language** | TypeScript for APIs and frontend, or Python for scoring microservices if preferred |
| **Data store** | PostgreSQL transactional core |
| **Background jobs** | Queue-based worker architecture for scoring and report jobs |
| **Configuration** | Versioned config tables for formulas, norms, and blueprint weights |
| **Testing** | Golden-file scoring tests, bank import tests, governance regression tests |
| **Observability** | Structured logs, job tracing, report access audit |

## 33. Final technical conclusion

Nexus should be implemented as a **governed assessment platform**, not merely a survey application. The correct production architecture is:

> **Questionnaire delivery -> D1–D5 scoring -> governance pass -> Domain 6 derivation -> role-fit evaluation -> audience-specific reporting.**

This separation preserves psychometric clarity, supports context-aware interpretation, and makes the system extensible for calibration, role-fit validation, and future product growth. The most important implementation rule is that **Domain 6 and role-fit must remain downstream derived layers**, while the questionnaire engine remains the governed source of person measurement.

## 34. Immediate next build artifacts to produce

To move from documentation into engineering execution, the next technical artifacts should be produced directly from this specification.

| Artifact | Why it should be next |
|---|---|
| **Database schema DDL** | Needed to start backend implementation |
| **OpenAPI specification** | Needed for frontend/backend contract alignment |
| **Scoring rules configuration package** | Needed to encode method logic, reverse scoring, and aggregation behavior |
| **Domain 6 config package** | Needed to encode formulas and context-template mappings |
| **Role blueprint JSON schema** | Needed to govern role-fit inputs |
| **Golden scoring test fixtures** | Needed to prevent scoring regressions |

If you want, the next step can be the **database schema + API contract package**, or the **full engineering PRD and implementation workplan** built on top of this documentation.
