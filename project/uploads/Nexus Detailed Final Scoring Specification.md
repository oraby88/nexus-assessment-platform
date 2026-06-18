# Nexus Detailed Final Scoring Specification

**Author:** Manus AI  
**Date:** April 3, 2026

## Executive decision

The critique is correct in its central judgment. The current Nexus scoring design is already **strong as an architecture**, but it is not yet sufficiently explicit to function as a **production scoring standard**. The missing layer is not new mathematics; it is **operational definition**.

This document therefore converts the current Nexus scoring architecture into a more complete operational specification. It preserves the core design decisions that should remain unchanged, while adding the missing implementation controls.

The most important conclusion is the following.

> **Nexus should keep the current four-part scoring architecture, but it must now formalize five missing elements before production use: confidence thresholds, validation gates, role-blueprint approval rules, construct exception triggers, and reporting permissions by use case.**

That means the final Nexus scoring standard is not a different philosophy. It is a **tightened operational version** of the system you already built.

## 1. What stays unchanged

The critique does **not** require a redesign of the core scoring logic. It requires that the existing logic become more explicit.

| Component | Final decision | Why |
|---|---|---|
| no omnibus total-person score | keep | protects scientific clarity and governance |
| default noncognitive ideal-point engine | keep as default | still the simplest viable common engine |
| separate cognitive scoring engine | keep | cognitive items are performance-based, not preference-based |
| dimension-first reporting | keep | dimensions remain the main interpretable outputs |
| domain summaries as optional | keep | useful for summaries, but not primary decision outputs |
| role fit as derived and permissioned | keep | stronger and safer than earlier role-fit approaches |
| equal weights as default | keep | conservative and defendable until unequal weights are validated |
| confidence gating | keep and specify numerically | strong concept, previously underdefined |
| construct exception pathway | keep and specify | prevents the default engine from becoming too broad |

So the correct response to the critique is **tightening**, not reinvention.

## 2. Final scoring architecture

Nexus continues to operate with **four scoring layers** and **one governance layer**.

| Layer | Purpose | Final production status |
|---|---|---|
| Layer 1: Noncognitive scoring | estimate traits, drivers, integrity-related indicators, emotional-social tendencies, resilience, collaboration, and many applied tendencies | core |
| Layer 2: Cognitive scoring | estimate reasoning and cognitive performance | core |
| Layer 3: Role-fit and contextual indices | compare measured dimensions against approved blueprints or context models | derived and permissioned |
| Layer 4: Confidence scoring | quantify uncertainty and determine reporting eligibility | mandatory |
| Layer 5: Governance | control activation, interpretation, use case, and release permissions | mandatory |

The architectural principle remains:

> **Nexus measures first, summarizes second, matches third, and decides only under separate governance.**

## 3. Final mathematical scoring model

## 3.1 Noncognitive scoring engine

The default noncognitive engine remains the primary scoring model for Domains 1, 3, 4, and much of Domain 5.

For item \(i\) and option \(j\):

\[
U_{ij}(\theta) = \exp\left(-a_{ij} \cdot \lVert \theta - b_{ij} \rVert^2\right)
\]

\[
P(Y_i = j \mid \theta) = \frac{U_{ij}(\theta)}{\sum_{k=1}^{J_i} U_{ik}(\theta)}
\]

For all answered noncognitive items:

\[
L(\theta) = \prod_{i=1}^{n} P(Y_i = y_i \mid \theta)
\]

With prior:

\[
\theta \sim \mathcal{N}(0, I)
\]

Posterior:

\[
p(\theta \mid Y) \propto p(\theta) \cdot L(\theta)
\]

Final estimate:

\[
\hat{\theta} = E[\theta \mid Y]
\]

### Illustration

Suppose a collaboration item has three options with ideal points 0.20, 0.50, and 0.80. If a person's latent standing is 0.75, the option at 0.80 will receive the highest utility. The engine therefore interprets the chosen option as evidence about the respondent's proximity to that latent point rather than as a right or wrong answer.

## 3.2 Cognitive scoring engine

For cognitive item \(i\):

\[
P(X_i=1 \mid \theta_c) = \frac{1}{1 + \exp[-a_i(\theta_c - b_i)]}
\]

where correct performance depends on the person's latent cognitive ability relative to item difficulty.

### Illustration

If \(\theta_c = 0.80\), \(b_i = 0.50\), and \(a_i = 1.20\), then:

\[
P(X_i=1 \mid \theta_c) \approx 0.59
\]

This means the candidate has a 59% chance of answering correctly.

## 3.3 Facet, dimension, and domain scoring

The operational scoring unit remains the **facet** whenever a validated facet model exists.

If a dimension \(d\) has \(M_d\) validated facets, then its default score is:

\[
S_d = \frac{1}{M_d} \sum_{m=1}^{M_d} \hat{\theta}_{dm}
\]

If the dimension has no validated facet breakdown in production, then:

\[
S_d = \hat{\theta}_d
\]

If a domain \(g\) has \(K_g\) validated dimensions, then its optional summary score is:

\[
D_g = \frac{1}{K_g} \sum_{d=1}^{K_g} S_d
\]

The rule remains strict.

> **Dimensions are primary measured outputs. Domains are optional summaries only.**

## 3.4 Percentile conversion

Percentile conversion is allowed only after scale linking and norm definition.

\[
Percentile_k = \Phi(\hat{\theta}_k) \times 100
\]

This formula is allowed only when \(\hat{\theta}_k\) is already located on a validated reporting scale. Otherwise percentiles must not be shown.

## 3.5 Role-fit scoring

Role fit remains a weighted similarity model built from **validated dimensions**, not raw items and not whole-domain totals.

\[
Fit(r) = \frac{\sum_{d=1}^{K} w_d \cdot f(S_d, T_d)}{\sum_{d=1}^{K} w_d}
\]

with:

\[
f(S_d, T_d) = 1 - |S_d - T_d|
\]

where scores are on a 0 to 1 linked scale.

### Illustration

Suppose a manager role requires three dimensions.

| Dimension | Candidate \(S_d\) | Target \(T_d\) | Weight \(w_d\) | Similarity |
|---|---:|---:|---:|---:|
| Leadership expression | 0.80 | 0.90 | 0.40 | 0.90 |
| Judgment | 0.70 | 0.80 | 0.35 | 0.90 |
| Collaboration | 0.60 | 0.50 | 0.25 | 0.90 |

Then:

\[
Fit(r)=\frac{0.40(0.90)+0.35(0.90)+0.25(0.90)}{1.00}=0.90
\]

So role fit is 0.90, or 90%, **provided that the blueprint is approved and the contributing dimensions pass confidence gates**.

## 4. Exact confidence and reporting thresholds

The critique correctly identified confidence gating as underdefined. This section operationalizes it.

## 4.1 Standard error bands

For score \(k\):

\[
SE_k = \sqrt{Var(\theta_k \mid Y)}
\]

and:

\[
CI_k = \hat{\theta}_k \pm 1.96 \cdot SE_k
\]

Nexus should use the following default **production confidence bands** on the linked latent scale.

| Confidence band | Standard error rule | Reporting consequence |
|---|---|---|
| High confidence | \(SE \le 0.25\) | may be shown for all approved report types |
| Moderate confidence | \(0.25 < SE \le 0.35\) | may be shown for development use; consequential use requires additional controls |
| Low confidence | \(0.35 < SE \le 0.45\) | may be shown only as exploratory, visually downgraded |
| Unacceptable confidence | \(SE > 0.45\) | hidden from user-facing reports |

These cutoffs are deliberately conservative and should be revisited after calibration data are available.

## 4.2 Confidence policy by output type

| Output type | Minimum confidence for developmental reporting | Minimum confidence for internal talent advisory use | Minimum confidence for consequential use |
|---|---|---|---|
| facet score | high or moderate | high | not primary output |
| dimension score | moderate | high | high |
| domain summary | all contributing dimensions high or moderate, and at least 80% above threshold | all contributing dimensions high | not primary output |
| role fit | all role-relevant dimensions at least moderate | all role-relevant dimensions high or one moderate with warning | all role-relevant dimensions high |
| restricted outputs | not applicable | not applicable | higher than high plus separate validation |

## 4.3 What happens when confidence fails

The critique asked exactly what should happen if confidence is too low. Nexus should implement a clear display policy.

| Condition | Product action |
|---|---|
| one facet low confidence | hide facet from technical view or mark as unstable |
| one dimension low confidence in development report | show with amber warning and explanation |
| one dimension low confidence in internal advisory report | gray out and exclude from automated summaries |
| one dimension low confidence in consequential report | hide and block derived outputs depending on it |
| one role-relevant dimension fails threshold | role fit becomes exploratory only or hidden, depending on use case |
| more than 20% of dimensions fail threshold | suppress domain summary |

The simplest policy is:

> **Low-confidence scores may be visible for development, but they may not drive derived decision outputs.**

## 5. Exact validation release gates

The critique correctly observed that Nexus needs explicit pass/fail rules. These rules should function as the **release gate** for every score and derived output.

## 5.1 Item-model validation gates

| Component | Minimum rule for release |
|---|---|
| noncognitive item pool | acceptable model fit, stable parameter estimation, no unresolved item-key ambiguity |
| cognitive item pool | acceptable difficulty spread, discrimination quality, no unstable item parameters |
| response-quality indicators | detection logic must be calibrated before use in production |
| subgroup review | no unresolved adverse-functioning flags for intended use |

## 5.2 Dimension-score validation gates

A dimension may enter production only if all of the following conditions are satisfied.

| Requirement | Minimum production rule |
|---|---|
| structure | the intended items/facets load coherently on the target dimension |
| reliability | precision is acceptable across the intended score range |
| interpretability | the construct definition and score meaning are documented |
| subgroup review | fairness review completed for intended use |
| reporting rule | confidence thresholds and display behavior are defined |

If any of these are missing, the dimension remains **draft** or **pilot only**.

## 5.3 Domain-summary validation gates

A domain summary may be released only if:

| Requirement | Minimum production rule |
|---|---|
| all included dimensions are production-approved | required |
| the domain summary is conceptually coherent | required |
| the aggregation adds interpretation value beyond dimensions | required |
| the domain is not used as a high-stakes standalone decision score | required |

## 5.4 Percentile release gates

A percentile may be shown only if:

| Requirement | Minimum production rule |
|---|---|
| norm group exists | required |
| norm group size and relevance are documented | required |
| linked reporting scale exists | required |
| subgroup review completed for consequential use | required |

## 5.5 Role-fit release gates

Role fit may enter production only if **all** of the following are true.

| Requirement | Minimum production rule |
|---|---|
| blueprint approval | approved or validated blueprint, not draft |
| blueprint evidence quality | based on role analysis, not title only |
| selected dimensions | all included dimensions are validated and confidence-qualified |
| weighting policy | equal weights by default unless blueprint evidence supports unequal weights |
| use-case policy | allowed for the report type in question |
| criterion evidence | required before operational consequential use |

## 5.6 Restricted-output release gates

Restricted outputs such as predicted success probability, automated hiring recommendation, promotion-readiness trigger, or derailment-risk alert require a separate gate.

| Requirement | Minimum production rule |
|---|---|
| validated inputs | required |
| criterion evidence | required |
| fairness review | required |
| governance approval | required |
| human oversight rule | required |
| audit logging | required |

## 6. Role Blueprint approval workflow

The critique is especially strong on this point: the role-fit formula is not the weak point; **blueprint quality** is the weak point. Nexus must therefore treat blueprint creation as a governed workflow.

## 6.1 Required blueprint fields

A Role Blueprint must include the following fields before scoring can use it.

| Field | Rule |
|---|---|
| role title | required |
| role level | required |
| reporting line / scope | required |
| critical duties | required |
| critical outcomes | required |
| failure risks | required |
| required Nexus dimensions | required |
| proposed target levels by dimension | required |
| proposed weights | required |
| evidence sources | required |
| approver identities | required |
| blueprint status | required |

## 6.2 Blueprint evidence requirements

A blueprint may not be title-only. It must be supported by at least **three evidence sources**, including at least one human-source and one job-content source.

| Evidence source | Minimum requirement |
|---|---|
| job description or competency file | at least one |
| hiring manager input | at least one |
| subject-matter expert panel | at least two qualified SMEs recommended |
| incumbent data | used when available |
| performance criteria or success outcomes | strongly preferred |

## 6.3 Blueprint maturity states

| Status | Meaning | Role-fit permission |
|---|---|---|
| Draft | incomplete or admin-generated only | no user-facing role fit |
| Reviewed | evidence collected, pending sign-off | internal design use only |
| Approved | governance sign-off complete, evidence adequate | development and exploratory role fit allowed |
| Validated | approved plus criterion linkage established | operational role fit allowed |

## 6.4 Blueprint approval scorecard

Nexus should score blueprint quality before allowing role fit.

Let blueprint quality be:

\[
BQ = 0.30E + 0.25C + 0.20S + 0.15W + 0.10R
\]

where:

| Symbol | Meaning | Range |
|---|---|---|
| \(E\) | evidence completeness | 0 to 1 |
| \(C\) | construct clarity | 0 to 1 |
| \(S\) | SME agreement quality | 0 to 1 |
| \(W\) | weight justification quality | 0 to 1 |
| \(R\) | role-level specificity | 0 to 1 |

Blueprint quality interpretation:

| Blueprint quality score | Meaning | Permission |
|---|---|---|
| \(BQ < 0.70\) | weak blueprint | no role-fit output |
| \(0.70 \le BQ < 0.85\) | adequate blueprint | exploratory or development-only role fit |
| \(BQ \ge 0.85\) | strong blueprint | approved for operational role-fit, subject to other gates |

This is the clearest operational response to the critique.

## 7. Construct exception rules

The critique also correctly warns that the default noncognitive engine is still carrying a great deal. That is acceptable only if the exception rule is concrete.

## 7.1 Construct families on the default engine

The following construct families begin on the default noncognitive engine.

| Construct family | Default status |
|---|---|
| personality | default engine |
| work style | default engine |
| motivation and values | default engine |
| collaboration | default engine |
| emotional-social functioning | default engine |
| resilience | default engine |
| leadership expression | default engine initially |
| integrity-related preference indicators | default engine with extra controls |

## 7.2 Exception triggers

A construct family must enter exception review if any of the following occur.

| Trigger | Meaning |
|---|---|
| persistent model misfit | the default model does not represent the response process well |
| unstable parameters | item or option parameters do not calibrate reliably |
| weak structural evidence | items do not support the intended construct map |
| low precision | standard errors remain too high across the target score range |
| fairness concern | unresolved subgroup functioning issues appear |
| weak criterion linkage | the construct does not behave meaningfully in relevant use cases |
| method contradiction | the construct appears better captured by a different response model |

## 7.3 Exception pathways

If a construct triggers exception review, Nexus should use one of four responses.

| Pathway | Meaning |
|---|---|
| revise items | keep the same engine, improve item quality |
| narrow the construct | reduce breadth and keep the engine |
| add method support | keep dimension but supplement with scenario or behavioral evidence |
| reassign model family | move the construct to a different scoring model |

The operational rule is:

> **The default engine remains the starting point, not a permanent entitlement.**

## 8. Exact weighting policy

Equal weights remain the default rule. The critique is right that they should not become a permanent substitute for evidence.

## 8.1 Default rule

If a dimension has \(M\) validated facets:

\[
S_d = \frac{1}{M} \sum_{m=1}^{M} \hat{\theta}_{dm}
\]

If a role blueprint uses \(K\) dimensions:

\[
Fit(r) = \frac{\sum_{d=1}^{K} w_d \cdot (1 - |S_d - T_d|)}{\sum_{d=1}^{K} w_d}
\]

with default:

\[
w_d = 1
\]

for all dimensions unless evidence justifies otherwise.

## 8.2 Unequal-weight approval rule

Unequal weights may be used only when all four conditions are satisfied.

| Requirement | Rule |
|---|---|
| theoretical basis | written rationale exists |
| SME support | relevant stakeholders agree |
| empirical support | unequal weights improve predictive or interpretive performance materially |
| governance sign-off | approved and version-controlled |

If these conditions are not met, Nexus must revert to equal weights.

## 9. Reporting permissions by business use case

The critique asked for exact output policy by use case. This section defines it.

## 9.1 Use-case classes

| Use case | Definition |
|---|---|
| Developmental | coaching, self-understanding, growth planning |
| Talent advisory | internal talent discussions with human review |
| Selection support | used in hiring or promotion support with additional controls |
| Restricted high-consequence | automated or strongly consequential outputs |
| Research / pilot | internal testing, validation, calibration |

## 9.2 Output permissions table

| Output | Developmental | Talent advisory | Selection support | Restricted high-consequence | Research / pilot |
|---|---|---|---|---|---|
| dimension score | allowed | allowed | allowed if validated | allowed only if separately approved | allowed |
| domain summary | allowed | allowed | secondary only | not primary | allowed |
| percentile | allowed if normed | allowed if normed | allowed if validated for that use | restricted | allowed |
| role fit with approved blueprint | allowed | allowed | allowed if criterion-linked | restricted | allowed |
| exploratory role fit | allowed with disclaimer | allowed with disclaimer | not allowed | not allowed | allowed |
| automated recommendation | not allowed | not allowed | not allowed without special approval | restricted | pilot only |
| derailment risk / success probability | not default | not default | restricted | restricted | pilot only |

## 9.3 Report labels

Nexus should attach labels directly to outputs.

| Label | Meaning |
|---|---|
| Core measured | direct validated score |
| Summary | optional aggregation |
| Exploratory | visible but not suitable for consequential interpretation |
| Permissioned | allowed only for defined report types |
| Restricted | requires separate validation and approval |
| Hidden | not displayed because required conditions failed |

## 10. Full final scoring decision logic

The most operational way to express Nexus is as a decision sequence.

## 10.1 Score generation sequence

| Step | Decision |
|---|---|
| 1 | estimate facet or dimension scores using the appropriate scoring engine |
| 2 | compute standard errors and confidence bands |
| 3 | apply validation status checks to each score |
| 4 | derive dimension scores from facets where approved |
| 5 | derive domain summaries only if domain rules are met |
| 6 | evaluate whether blueprint status permits role fit |
| 7 | evaluate whether contributing dimensions meet confidence thresholds |
| 8 | compute role fit only if blueprint, confidence, and use-case permissions all pass |
| 9 | suppress, downgrade, or label outputs according to reporting policy |
| 10 | log output status for audit and governance review |

## 10.2 Output eligibility formula

For any output \(O\), Nexus should evaluate:

\[
Eligible(O) = Validation(O) \times Confidence(O) \times Permission(O)
\]

where each term is binary, either 0 or 1.

If:

\[
Eligible(O)=1
\]

then the output may be shown.

If:

\[
Eligible(O)=0
\]

then the output is hidden or downgraded according to policy.

This is not a psychometric equation; it is a **product governance equation**.

## 11. Final full scoring standard

The complete Nexus scoring standard is now the following.

> **Nexus uses a four-part scoring architecture composed of default noncognitive Bayesian ideal-point scoring, separate cognitive logistic scoring, mandatory confidence estimation, and governed role-fit scoring based on approved role blueprints. Facets are the narrow estimation layer where validated. Dimensions are the primary measured outputs. Domains are optional summaries only. Contextual indices such as role fit are derived outputs and may only be shown when blueprint quality, confidence thresholds, validation status, and report permissions all pass. Equal weights are the default aggregation rule unless unequal weights are justified by theory, evidence, and governance approval. Low-confidence scores may support development interpretation but may not drive consequential derived outputs. The default noncognitive engine is the starting model, but construct families must enter exception review when fit, precision, structure, fairness, or criterion behavior are inadequate. No omnibus total-person score is permitted. No restricted decision output may be released without separate criterion validation, governance approval, and human oversight.**

## 12. Final judgment on the critique

The attached critique should be applied almost entirely. It is not arguing against the current design backbone. It is arguing that the backbone still needs operational muscle.

That judgment is correct.

| Critique point | Final decision |
|---|---|
| current document is not yet fully production-ready | accepted |
| default engine needs stricter exception control | accepted |
| role fit depends heavily on blueprint quality | accepted |
| equal weights are a default, not a permanent substitute for evidence | accepted |
| confidence gating needs exact rules | accepted |

So the refined Nexus position is:

> **The current scoring architecture is the right one. The next step is not redesign. The next step is operationalization.**

## 13. Recommended build order

The cleanest implementation path is now obvious.

| Order | Build item |
|---|---|
| 1 | implement noncognitive and cognitive scoring engines |
| 2 | implement facet-to-dimension aggregation with equal-weight defaults |
| 3 | implement standard-error calculation and confidence band classification |
| 4 | implement reporting labels and suppression logic |
| 5 | implement blueprint data model and approval workflow |
| 6 | implement blueprint quality scoring |
| 7 | implement role-fit calculation and gating |
| 8 | implement validation status registry per score |
| 9 | implement restricted-output approval layer |
| 10 | validate each construct family and use case before production activation |

## Final conclusion

This is the first Nexus scoring specification that can reasonably be called a **detailed production candidate** rather than only a strong architecture draft. The mathematics remain intentionally manageable. The real improvement is that the system now defines when a score is allowed to exist, when it is allowed to be shown, when it is allowed to influence a derived output, and when it must be blocked.

That is what turns a strong scoring concept into an enterprise-grade scoring system.
