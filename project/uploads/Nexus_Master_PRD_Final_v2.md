---
title: "Nexus Assessment Platform — Implementation-Ready Master PRD"
version: "2.0.0"
date: "April 3, 2026"
status: "Implementation-Ready Final Working Specification"
supersedes: "All prior individual Nexus PRD, construct map, scoring, and governance documents"
scope: "Complete platform specification for build, validation planning, governance design, and reporting implementation"
exclusion: "Latency framework excluded by design"
authors: "Nexus Product and Science Team"
classification: "Internal — Controlled Distribution"
---

# NEXUS ASSESSMENT PLATFORM
## Implementation-Ready Master Product Requirements Document
### Complete Architecture · All Domains · All Governance Fixes Applied

| Field | Value |
|---|---|
| **Document Title** | Nexus Assessment Platform — Implementation-Ready Master PRD |
| **Version** | 2.0.0 |
| **Date** | April 3, 2026 |
| **Status** | Implementation-Ready Final Working Specification |
| **Supersedes** | All prior individual Nexus PRD, construct map, scoring, and governance documents |
| **Scope** | Complete platform specification for build, validation planning, governance design, and reporting implementation |
| **Exclusion** | Latency framework excluded by design |
| **Governance Fixes Incorporated** | All 28 tasks from Nexus Full Governance Review v4 |

---

> **This document is the single authoritative implementation reference for the Nexus Assessment Platform. All prior documents are superseded. All 28 governance fixes from the Nexus Full Governance Review v4 are incorporated as binding mandates, clearly marked throughout.**

---

## TABLE OF CONTENTS

- [Executive Summary](#executive-summary)
- [Key Decisions at a Glance](#key-decisions-at-a-glance)
- [Quick Reference: V1 vs Phase 2 Feature Map](#quick-reference-v1-vs-phase-2-feature-map)
- [PART 0 — Product Doctrine and Executive Summary](#part-0)
- [PART 1 — Platform Architecture](#part-1)
- [PART 2 — Construct Architecture: All Six Domains](#part-2)
  - [2.2 Domain 1: Personality Architecture](#domain-1)
  - [2.3 Domain 2: Cognitive Architecture](#domain-2)
  - [2.4 Domain 3: Motivational and Driver Architecture](#domain-3)
  - [2.5 Domain 4: Emotional and Social Functioning](#domain-4)
  - [2.6 Domain 5: Applied Work and Leadership Expression](#domain-5)
  - [2.7 Domain 6: Contextual Alignment and Decision Indices](#domain-6)
- [PART 3 — Construct Relations and Nomological Network](#part-3)
- [PART 4 — Item and Assessment Architecture](#part-4)
- [PART 5 — Scoring Architecture](#part-5)
- [PART 6 — Validity States and Response Quality](#part-6)
- [PART 7 — Role-Fit Architecture](#part-7)
- [PART 8 — Reporting Architecture](#part-8)
- [PART 9 — Governance, Ethics, and Enterprise Validity](#part-9)
- [PART 10 — Top 10 Dimensions: Enterprise Curated View](#part-10)
- [PART 11 — API Object Model](#part-11)
- [PART 12 — Failover Behavior Specification](#part-12)
- [PART 13 — Non-Functional Requirements](#part-13)
- [PART 14 — Release and Maturity Model](#part-14)
- [PART 15 — Companion Documents](#part-15)
- [PART 16 — Out of Scope](#part-16)
- [PART 17 — References](#part-17)
- [Appendix A — Governance Fixes Incorporated (All 28 Tasks)](#appendix-a)
- [Appendix B — Glossary of Key Terms](#appendix-b)

---

## EXECUTIVE SUMMARY

**Nexus** is a next-generation enterprise workforce assessment platform designed to measure broad human capability and behavioral expression across all job levels — from entry-level to executive — through one governed, multidimensional measurement architecture.

Nexus is not a questionnaire product. It is a **regulated measurement ecosystem** built on five foundations: (1) a scientifically grounded construct architecture spanning 6 domains, 35+ dimensions, and 170+ facets; (2) a multimethod, adaptive item and scoring engine; (3) a role-fit and contextual alignment architecture; (4) a deterministic, policy-governed reporting engine; and (5) a four-ring enterprise governance and ethics framework.

### The Six-Domain Architecture

Nexus organizes human measurement into six domains, each serving a distinct scientific and business purpose:

- **Domain 1 — Personality Architecture** ("Character and Work Style"): The stable dispositional backbone, anchored in the Big Five and Integrity family. Active at V1.
- **Domain 2 — Cognitive Architecture** ("Thinking and Problem Solving"): Reasoning and complexity-processing capacity, scored through a separate cognitive IRT engine. Active at V1.
- **Domain 3 — Motivational and Driver Architecture** ("Drivers and Motivation"): What energizes and sustains effort. Deferred to Phase 2 pending dimension reduction analysis and culture-specific validation.
- **Domain 4 — Emotional and Social Functioning** ("Emotional Intelligence and Relationships"): Self-regulation, social awareness, resilience, and collaboration. Active at V1.
- **Domain 5 — Applied Work and Leadership Expression** ("Workplace Effectiveness"): Business-facing behavioral synthesis. Deferred to Phase 2.
- **Domain 6 — Contextual Alignment and Decision Indices** ("Fit and Readiness Indices"): Derived outputs including role fit, readiness, and risk indices. Restricted; most deferred to Phase 2 or later.

### V1 Scope: Two Use Cases Only

V1 launch is restricted to exactly two use cases: **Developmental Feedback** and **Hiring Support with Validated Role Blueprints**. All other use cases — including leadership readiness, executive readiness, team fit, and all risk outputs — are deferred. The Derailment Risk Index is **BLOCKED entirely** pending independent criterion validity review and independent ethics review.

### Governance Model

Nexus operates under a four-ring governance model covering Scientific, Ethical, Enterprise, and Operational governance. Every scored output must pass a seven-priority rule precedence hierarchy (P1 Absolute Block through P7 Audience Gate) before it may be shown. The reporting engine is deterministic: every output resolves to one of six controlled states (VISIBLE, VISIBLE_WITH_CAUTION, DOWNGRADED, HIDDEN, BLOCKED, NOT_GENERATED).

### Why This PRD Is the Single Authoritative Reference

This document consolidates all prior Nexus specification documents — the PRD, construct map, scoring standard, reporting framework, role-fit validity framework, governance document, executable reporting rules, logic architecture, six-domain scoring map, detailed scoring specification, and construct registry — into one implementation-ready reference. All 28 governance fixes from the Nexus Full Governance Review v4 are incorporated as binding mandates, clearly marked with `> **GOVERNANCE MANDATE**` callouts throughout.

This document is the final working specification for implementation and validation planning. It is not a claim of final scientific closure: confidence thresholds, synthesis weights, and some governance rules remain policy definitions awaiting empirical refinement.

---

## KEY DECISIONS AT A GLANCE

> The following 10 governance mandates are non-negotiable. They are binding at all system layers and may not be overridden by product, engineering, or commercial decisions without Ethics Committee and Chief Psychologist approval.

| # | Decision | Mandate |
|---|---|---|
| 1 | **V1 scope is two use cases only** | Only `developmental` and `hiring_support_validated_blueprint` use cases are permitted at V1. All others are suppressed at the reporting engine level. |
| 2 | **Derailment Risk Index is BLOCKED entirely** | The DRI must not appear in any report, API output, UI element, sales material, or demo until independent criterion validity and ethics review are complete. |
| 3 | **Values Alignment is never a standalone selection criterion** | Values Alignment is restricted to developmental use only at V1. The reporting engine must suppress it in all selection-context sessions. |
| 4 | **No omnibus total-person score** | Nexus must never collapse a person into one master number. Dimensions are the primary measured unit. Domain summaries are optional. |
| 5 | **Role fit requires a validated blueprint** | Role-fit scoring is blocked unless `blueprint_status: validated`. Draft and under_review blueprints may not be used for operational scoring. |
| 6 | **GGUM calibration minimums are pre-launch gates** | D1, D2, and D4 must meet calibration minimums (N ≥ 500/item for GGUM; N ≥ 300/item for IRT) before V1 launch. No exceptions. |
| 7 | **Audit logging failure blocks all operations** | If the audit logging service is unavailable, ALL scoring and reporting operations must be blocked. The system must never silently degrade. |
| 8 | **Consent is per-use-case, not global** | A single blanket consent form is not sufficient. Candidates must provide separate, revocable consent for each distinct use case. |
| 9 | **Cross-cultural deployment requires measurement invariance** | Nexus must not make cross-cultural score comparisons or apply global norms until invariance is established. Domain 3 carries a culture-specific validation flag for all non-Western deployments. |
| 10 | **Score versioning is mandatory on every output** | Every scored output must carry `scoring_version` and `synthesis_weight_version` tags. Scores from different major versions may not be directly compared. |

---

## QUICK REFERENCE: V1 VS PHASE 2 FEATURE MAP

| Feature / Capability | V1 Status | Phase / Notes |
|---|---|---|
| **Domain 1 — Personality Architecture** | ✅ Active | All 6 dimensions; GGUM calibration required pre-launch |
| **Domain 2 — Cognitive Architecture** | ✅ Active | All 6 dimensions; IRT calibration required pre-launch |
| **Domain 3 — Motivational Drivers** | 🔶 Phase 2 | Dimension reduction analysis required first; culture flag active |
| **Domain 4 — Emotional-Social Functioning** | ✅ Active | All 6 dimensions; exception monitoring active |
| **Domain 5 — Applied Work and Leadership** | 🔶 Phase 2 | Synthesis validation required; D1/D2/D4 must be calibrated first |
| **Domain 6 — Role Fit** | ⚠️ Restricted at V1 | Hiring Support use case only; validated blueprint required |
| **Domain 6 — Team Fit** | 🔶 Phase 2 | Team-level validation required |
| **Domain 6 — Values Alignment** | 🔶 Phase 2 (developmental only) | Never for selection; adverse impact monitoring mandatory |
| **Domain 6 — Leadership Readiness** | 🔶 Phase 2 | Criterion validation from leadership outcomes required |
| **Domain 6 — Executive Readiness** | 🔶 Phase 2 | Criterion validation from executive outcomes required |
| **Domain 6 — Derailment Risk Index** | 🚫 BLOCKED | Requires independent criterion validity + ethics review |
| **Domain 6 — BRI Framework** | 🔶 Phase 2 at earliest | All 5 BRIs pending criterion validation |
| **Developmental Feedback use case** | ✅ Active | Standard trained-user interpretation required |
| **Hiring Support use case** | ✅ Active | Validated blueprint required; HR governance sign-off |
| **Talent Advisory / Succession** | 🔶 Phase 2 | Longitudinal validity evidence required |
| **Percentile reporting (global norms)** | 🔶 Phase 2 | Global norm groups not yet established |
| **Facet drill-down reports** | 🔶 Phase 3 | Validated facet model required per dimension |
| **Cross-cultural deployment (non-English)** | 🔶 Phase 2 | Measurement invariance not yet established |
| **Top 10 Dimensions view (9 of 10)** | ✅ Active | Rank 5 (Communication and Influence) shows Phase 2 placeholder |
| **Score versioning tags** | ✅ Required at V1 | `scoring_version` and `synthesis_weight_version` on all outputs |
| **Audit logging** | ✅ Required at V1 | Failure blocks all operations (SEV-1) |
| **Per-use-case consent framework** | ✅ Required at V1 | Granular consent system must be operational at launch |
| **Blueprint versioning engine** | ✅ Required at V1 | Automated invalidation engine must be operational |
| **Counterbalancing protocol (A/B)** | ✅ Required at V1 | Random module-order allocation at session creation |
| **Method-variance flags** | ✅ Required at V1 | MV_UNRESOLVED applied to all multi-method constructs |

---

---

<a name="part-0"></a>
## PART 0: PRODUCT DOCTRINE AND EXECUTIVE SUMMARY

### 0.1 What Nexus Is

**Nexus** is a next-generation enterprise workforce assessment platform designed to measure broad human capability and behavioral expression across all job levels — from entry-level to executive — through one governed, multidimensional measurement architecture.

Nexus is not a questionnaire product. It is a **regulated measurement ecosystem** that combines:

1. A scientifically grounded construct architecture (6 domains, 35+ dimensions, 170+ facets)
2. A multimethod, adaptive item and scoring engine
3. A role-fit and contextual alignment architecture
4. A deterministic, policy-governed reporting engine
5. A four-ring enterprise governance and ethics framework

> **Nexus generates valid, interpretable, permissioned, and use-bounded outputs. It determines not only what can be measured, but what can be scored, what can be shown, what can be used for which purpose, and what must be blocked.**

### 0.2 Core Product Doctrine

> **Nexus is a dynamic, multidimensional workforce assessment platform designed to measure broad human capability and behavioral expression across job levels while maintaining scientific discipline, ethical boundaries, enterprise governance, and deterministic reporting control. The primary measured outputs are validated dimensions supported by facets where appropriate. Domain summaries are optional. Derived outputs such as role fit, readiness, and risk are permissioned and never equivalent to direct traits. Role fit depends on an approved and, where required, validated role blueprint. Confidence, validation status, blueprint maturity, response quality, use case, and audience permissions jointly determine what may be shown or used. No omnibus total-person score is permitted. This PRD is final for implementation and validation planning, but not a claim of final scientific closure.**

### 0.3 Product Principles

| Principle | Product Meaning |
|---|---|
| No omnibus total-person score | Nexus never collapses people into one master number |
| Dimensions before domains | Dimensions are the primary reportable measured unit |
| Domains are optional summaries | Domain scores exist only when they add interpretive value |
| Facets support depth, not noise | Facets are narrow measured components where validated |
| Derived outputs are permissioned | Role fit, readiness, and risk require additional gates |
| Equal weights are the default | Unequal weights require theory, evidence, and governance approval |
| Response quality matters | Invalid or low-quality response patterns affect release decisions |
| Reporting is deterministic | Visible outputs are governed by explicit rule states |
| Role fit depends on blueprint validity | Title alone can never define fit |
| Scientific maturity must be declared | Final spec ≠ final proof |

### 0.4 V1 Launch Scope — TWO USE CASES ONLY

> **GOVERNANCE MANDATE — Governance Review v4, Critical Fix, Task 12**

**V1 launch scope is restricted to exactly two use cases. All other use cases are deferred. This restriction is non-negotiable.**

| # | Use Case | Permitted Outputs | Governance Level |
|---|---|---|---|
| 1 | **Developmental Feedback** | All measured dimension scores (confidence-gated), facet scores where SE ≤ 0.35, behavioral descriptors, developmental suggestions, confidence chips, omission explanations | Standard — trained-user interpretation required |
| 2 | **Hiring Support with Validated Role Blueprints** | Role-linked dimension scores only (confidence-gated), role blueprint match indicators (validated blueprint only), structured interview prompts. No omnibus fit score. No readiness index. | Controlled — HR governance sign-off on blueprint required |

**V1 Explicitly Excluded Use Cases:**

| Use Case | Reason | Earliest Phase |
|---|---|---|
| Talent advisory / succession | Requires longitudinal validity evidence | Phase 2 |
| Leadership Readiness Index | Requires criterion validation from leadership outcomes | Phase 2 |
| Executive Readiness Index | Requires criterion validation from executive outcomes | Phase 2 |
| Team Fit / team composition | Requires team-level validation | Phase 2 |
| Values Alignment as any decision input | High adverse impact risk; developmental only with governance approval | Phase 2 (developmental only) |
| Derailment Risk Index | **BLOCKED ENTIRELY** — ethically indefensible without independent criterion validity review | Post-Phase 2; requires independent ethics review |
| Percentile reporting (global norms) | Global norm groups not yet established | Phase 2 |
| Cross-cultural deployment outside English | Measurement invariance not yet established | Phase 2 |
| All Domain 6 contextual indices (general) | Restricted until external criterion validity studies complete | Phase 2 or later |

**V1 Enforcement Rules:**

| Rule | Specification |
|---|---|
| Use case gate | Every session must carry a `use_case` tag. Only `developmental` and `hiring_support_validated_blueprint` permitted at V1 |
| Blueprint validation gate | Hiring Support requires `blueprint_status: validated` before role-linked output is scored |
| Output suppression | Non-permitted outputs suppressed at reporting engine level, not just hidden in UI |
| Commercial gate | Sales must not offer, demo, or contract any excluded use case until Phase 2 criteria are met |
| Audit log | `use_case` tag and all suppressed output types written to session audit log |

---

<a name="part-1"></a>
## PART 1: PLATFORM ARCHITECTURE

### 1.1 Seven-Layer System Architecture

| Layer | Role | Primary Output |
|---|---|---|
| Layer 1: Session Orchestration | Determines assessment path, module sequence, routing | Route, module sequence, timing profile |
| Layer 2: Measurement | Administers items and tasks | Raw responses and response-process signals |
| Layer 3: Response Quality | Detects careless, inconsistent, overly managed, or invalid responding | Quality flags, confidence weights, disqualification rules |
| Layer 4: Psychometric Scoring | Estimates scale and trait levels | Theta scores, scale scores, precision estimates |
| Layer 5: Profile Modeling | Combines primary scores into interpretable construct profiles | Domain profiles, facet patterns, balance indicators |
| Layer 6: Contextual Interpretation | Maps scores to job level, role family, culture, and use case | Role-relevant summaries, fit inputs |
| Layer 7: Governance | Constrains what is reported and how it may be used | Use permissions, redactions, warnings, evidence links |

### 1.2 Five Product Layers

| Product Layer | Purpose | Primary Output |
|---|---|---|
| Construct Architecture | Defines what Nexus measures | Domains, dimensions, facets, drivers, derived indices |
| Assessment Architecture | Defines how Nexus measures | Multidimensional item bank, adaptive assembly, method families |
| Scoring Architecture | Defines how Nexus estimates and governs scores | Measured scores, confidence states, derived outputs |
| Role-Fit Architecture | Defines how job context enters interpretation | Governed role blueprint and role-fit index |
| Reporting Architecture | Defines what appears to whom and how | Audience-specific reports and API payloads |
| Governance Architecture | Defines product limits and enterprise control | Permissions, fairness, auditability, release rules |

### 1.3 Modular Assessment Session Design

| Module | Purpose | Administration |
|---|---|---|
| Universal Identity and Consent Module | Informed consent, use disclosure, administration conditions | Always administered |
| Core Noncognitive Module | Foundational dispositions (Domain 1, Domain 4) | Always administered |
| Core Cognitive Module | Reasoning capacity (Domain 2) | Administered by use case and user tier |
| Motivation and Driver Module | Work motives and value preferences (Domain 3) | Phase 2 |
| Applied Workplace Behavior Module | Leadership, collaboration, judgment, work style (Domain 5) | Phase 2 |
| Integrity and Ethics Module | Honesty, fairness, accountability (governed) | Use restrictions apply |
| Optional Specialty Modules | Industry or enterprise-specific content | Only where separately validated |
| Feedback and Reflection Module | Reaction data and developmental insight | Post-assessment |

### 1.4 Job-Level Routing Logic

| Job Level | Core Administration | Overlay Emphasis |
|---|---|---|
| Entry-level | Foundational dispositions, integrity, basic reasoning, motivation | Learning agility, reliability, teamwork, coachability |
| Individual Contributor | Core + role-relevant reasoning and work-style modules | Execution, communication, adaptability, problem solving |
| Manager | Core + people-leadership overlay | Coaching, delegation, prioritization, judgment, team climate |
| Senior Leader | Core + enterprise leadership overlay | Systems thinking, organizational influence, ambiguity handling |
| Executive | Core + executive complexity overlay | Long-horizon trade-offs, culture stewardship, stakeholder orchestration, ethical authority |

---

<a name="part-2"></a>
## PART 2: CONSTRUCT ARCHITECTURE — ALL SIX DOMAINS

### 2.1 The Six-Domain Framework

The construct hierarchy is:

```
Facet → Dimension → Optional Domain Summary → Permissioned Derived Index
```

| Domain | Status | Core Question | Primary Use |
|---|---|---|---|
| Domain 1: Personality Architecture | Directly measured | How does this person tend to behave across situations? | Foundational noncognitive profile |
| Domain 2: Cognitive Architecture | Directly measured | How does this person reason, learn, and process complexity? | Reasoning and complexity capacity |
| Domain 3: Motivational and Driver Architecture | Directly measured (Phase 2) | What energizes, sustains, and directs this person? | Motivation, fit, retention, role preference |
| Domain 4: Emotional and Social Functioning | Directly measured | How does this person regulate self and navigate others? | Emotional-social functioning |
| Domain 5: Applied Work and Leadership Expression | Directly measured + validated synthesis (Phase 2) | How do underlying tendencies show up in work behavior? | Business-facing behavior reporting |
| Domain 6: Contextual Alignment and Decision Indices | Derived only | How well does the person align with a role, team, or environment? | Fit, readiness, governed decision support |

---

<a name="domain-1"></a>
### 2.2 DOMAIN 1: Personality Architecture

**V1 Status: Active — Required for V1 Launch**
**Scoring Engine: Default Noncognitive (GGUM/Bayesian Ideal-Point)**
**Scientific Anchor: Big Five + Integrity Family**
**Enterprise Display Name: Character and Work Style**

| Dimension | Definition | Final Facets | Scientific Anchor | Business Meaning |
|---|---|---|---|---|
| **Conscientious Execution** | Tendency toward order, discipline, reliability, and task completion | Dependability, Organization, Self-Discipline, Follow-Through, Time Discipline | Conscientiousness | Work ethic, reliability, execution consistency |
| **Interpersonal Orientation** | Tendency toward cooperative, considerate, and prosocial behavior | Cooperation, Tact, Empathy, Respect, Conflict Restraint | Agreeableness | Teamwork climate, service style, trustworthiness in interaction |
| **Emotional Steadiness** | Tendency toward composure and emotional balance under stress | Stress Tolerance, Composure, Recovery Speed, Frustration Control, Pressure Stability | Emotional Stability / low Neuroticism | Resilience baseline, pressure handling |
| **Exploratory Openness** | Tendency toward curiosity, imagination, and comfort with novelty | Curiosity, Conceptual Range, Learning Appetite, Creativity, Ambiguity Tolerance | Openness to Experience | Innovation style, learning orientation |
| **Social Assertiveness** | Tendency toward social energy, voice, influence, and outward confidence | Social Confidence, Voice, Influence Projection, Visibility Comfort, Energy Expression | Extraversion | Presence, persuasion, leadership emergence |
| **Integrity Orientation** | Tendency toward honesty, fairness, humility, accountability, and non-exploitation | Honesty, Fairness, Rule Regard, Accountability, Humility, Non-Exploitation | Honesty-Humility / Integrity Family | Ethics, trust, misconduct risk protection |

**Scoring Example — Conscientious Execution (5 facets):**

```
S(Conscientious Execution) = (θ_Dependability + θ_Organization + θ_SelfDiscipline + θ_FollowThrough + θ_TimeDiscipline) / 5
```

**Optional Domain 1 Summary:**
```
D1 = (1/6) × Σ S_d   for d = 1 to 6
```

**Governance Notes:**
- Integrity Orientation requires stronger response-quality review and integrity validation track
- All 6 dimensions active at V1 (subject to GGUM calibration completion)
- Discriminant validity tests DV-01 and DV-02 required before V1 launch

---

<a name="domain-2"></a>
### 2.3 DOMAIN 2: Cognitive Architecture

**V1 Status: Active — Required for V1 Launch**
**Scoring Engine: Cognitive IRT (3PL Logistic)**
**Enterprise Display Name: Thinking and Problem Solving**

| Dimension | Definition | Final Facets | Scientific Anchor | Business Meaning |
|---|---|---|---|---|
| **Verbal Reasoning** | Ability to understand, analyze, and reason with language | Comprehension, Inference, Argument Evaluation, Language Precision | Verbal reasoning ability | Communication reasoning, policy comprehension |
| **Numerical Reasoning** | Ability to reason with quantities, relations, and quantitative evidence | Numerical Comparison, Quantitative Inference, Applied Numeracy, Data Pattern Recognition | Quantitative reasoning ability | Analytical rigor, data-based decision support |
| **Abstract Reasoning** | Ability to detect patterns and solve novel problems | Pattern Detection, Analogical Logic, Rule Induction, Matrix Logic | Fluid reasoning | Problem solving and novel inference |
| **Decision Complexity** | Ability to process ambiguity, trade-offs, and competing constraints | Trade-Off Evaluation, Prioritization Under Constraint, Uncertainty Handling, Option Integration | Applied decision reasoning | Judgment under ambiguity |
| **Learning Agility** | Ability and readiness to absorb, transfer, and apply new learning | Learning Speed, Rule Transfer, Adaptation Speed, Feedback Integration | Adaptive learning capacity | Growth potential, transition readiness |
| **Strategic Systems Thinking** | Ability to reason across interconnected systems and second-order effects | Systems Mapping, Second-Order Thinking, Scenario Integration, Long-Horizon Logic | Systems reasoning / strategic complexity | Executive complexity capacity |

**Cognitive IRT Scoring (3PL):**
```
P(X_i = 1 | θ_c) = 1 / (1 + exp[-a_i(θ_c - b_i)])
```
Where: θ_c = cognitive ability, a_i = item discrimination, b_i = item difficulty.

**Governance Notes:**
- Separate cognitive engine — never mixed with noncognitive scoring
- Minimum calibration: N ≥ 300 per item; N ≥ 1,500 per dimension
- Verbal items are language-dependent; metric invariance required before cross-cultural cognitive comparison

---

<a name="domain-3"></a>
### 2.4 DOMAIN 3: Motivational and Driver Architecture

**V1 Status: DEFERRED TO PHASE 2**
**Scoring Engine: Default Noncognitive (GGUM)**
**Enterprise Display Name: Drivers and Motivation**

> **GOVERNANCE MANDATE — Governance Review v4, High Priority Fix, Tasks 18 + 27**

Domain 3 is deferred to Phase 2. Dimension reduction analysis must be completed before operational use. Domain 3 carries a **culture-specific validation flag** for all non-Western deployments.

**Current 7-Dimension Structure (Pre-Reduction):**

| # | Dimension | Definition | Reduction Hypothesis |
|---|---|---|---|
| D3-1 | Achievement Drive | Motivation toward accomplishment, progress, and excellence | Retain |
| D3-2 | Security Drive | Motivation toward predictability, safety, and stability | Bipolar pair with D3-3 |
| D3-3 | Autonomy Drive | Motivation toward independence, self-direction, and ownership | Bipolar pair with D3-2 |
| D3-4 | Affiliation Drive | Motivation toward belonging, loyalty, and positive connection | Retain |
| D3-5 | Learning Drive | Motivation toward growth, mastery, and self-expansion | Consolidation candidate with D3-6 |
| D3-6 | Purpose Drive | Motivation toward meaning, mission, and contribution | Consolidation candidate with D3-5 |
| D3-7 | Recognition Drive | Motivation toward status, visibility, and external validation | Retain |

**Target 5-Dimension Structure (Post-Reduction, Conditional):**

| # | Dimension | Derived From | Condition |
|---|---|---|---|
| D3-1 | Achievement Drive | D3-1 unchanged | Confirmed by discriminant validity |
| D3-2 | Security–Autonomy Orientation | D3-2 + D3-3 collapsed (bipolar) | Confirmed if r(D3-2, D3-3) ≤ −0.60 |
| D3-3 | Affiliation Drive | D3-4 renumbered | Confirmed by discriminant validity |
| D3-4 | Growth and Purpose Drive | D3-5 + D3-6 consolidated | Confirmed if r(D3-5, D3-6) ≥ 0.70 |
| D3-5 | Recognition Drive | D3-7 renumbered | Confirmed by discriminant validity |

**Culture-Specific Validation Flag:**
```
domain: D3
flag_type: CULTURE_VALIDATION_REQUIRED
flag_status: ACTIVE
applies_to: all_non_anglo_western_deployments
blocking: true
```

| Construct | Cross-Cultural Risk |
|---|---|
| Achievement Drive | HIGH — collectivist cultures may express achievement through group success |
| Autonomy Drive | HIGH — Western individualist value; high power-distance cultures may suppress expression |
| Recognition Drive | HIGH — status expression varies significantly by cultural display norms |
| Security Drive | MODERATE |
| Affiliation Drive | MODERATE |
| Purpose Drive | MODERATE |
| Learning Drive | LOW-MODERATE |

---

<a name="domain-4"></a>
### 2.5 DOMAIN 4: Emotional and Social Functioning

**V1 Status: Active — Required for V1 Launch**
**Scoring Engine: Default Noncognitive (GGUM) with Active Exception Monitoring**
**Enterprise Display Name: Emotional Intelligence and Relationships**

| Dimension | Definition | Final Facets | Business Meaning |
|---|---|---|---|
| **Self-Awareness** | Ability to notice, understand, and reflect on internal states | Emotional Insight, Self-Reflection, Signal Recognition, Pattern Awareness | Self-insight |
| **Self-Regulation** | Ability to manage impulses, emotions, and reactions productively | Impulse Management, Emotional Discipline, Recovery Control, Response Modulation | Emotional intelligence in action |
| **Social Awareness** | Ability to perceive others accurately and appreciate interpersonal cues | Perspective Taking, Empathic Recognition, Interpersonal Sensitivity, Social Signal Reading | Interpersonal sensitivity |
| **Relationship Management** | Ability to maintain productive relationships and repair friction | Trust Building, Conflict Handling, Influence Tone, Repair Behavior, Boundary Management | Collaboration effectiveness |
| **Resilience Capacity** | Ability to recover, persist, and adapt under stress or setbacks | Bounce-Back Speed, Persistence, Reframing Capacity, Endurance, Setback Tolerance | Resilience |
| **Team Collaboration Style** | Typical way of contributing within interdependent work | Coordination, Reciprocity, Information Sharing, Role Flexibility, Collective Accountability | Teamwork style |

**Governance Notes:**
- Self-Regulation: restricted to developmental use only until DV-02 discriminant validity test is resolved
- Exception monitoring priority: HIGH for emotional-social functioning and resilience constructs
- Minimum calibration: N ≥ 500 per item; N ≥ 2,500 per dimension

---

<a name="domain-5"></a>
### 2.6 DOMAIN 5: Applied Work and Leadership Expression

**V1 Status: DEFERRED TO PHASE 2**
**Enterprise Display Name: Workplace Effectiveness**

> **GOVERNANCE MANDATE — Governance Review v4, High Priority Fix, Tasks 22 + 23**

Domain 5 synthesis relations are validation hypotheses, not scoring shortcuts.

| Dimension | Definition | Primary Source Logic | Business Meaning |
|---|---|---|---|
| **Work Style** | Typical pattern of planning, pacing, structure, and execution | Partly direct, partly D1/D3 informed | Work style |
| **Leadership Expression** | Tendency and capability to set direction, mobilize others, and hold standards | Direct applied items + validated synthesis | Leadership |
| **Execution Discipline** | Consistency in translating intent into delivery | Direct applied + D1/D3 overlap | Execution strength |
| **Communication and Influence** | Ability to communicate clearly and shape understanding or action | Applied direct + D2/D4 support | Communication impact |
| **Adaptability** | Behavioral flexibility under change, novelty, and disruption | Direct applied + D1/D2/D3/D4 support | Agility |
| **Judgment and Decision Quality** | Quality of practical work decisions under constraints and consequences | Hybrid with D2 and Integrity input | Judgment |
| **Team Contribution** | Functional value added by the person to collective work | Direct applied + D1/D4 support | Teamwork contribution |
| **Culture Contribution** | Typical effect on norms, climate, and standards | Applied synthesis | Culture shaping tendency |

**Mandatory Caveats:**

> *"Leadership Expression is a synthesis dimension. At V1, it is supported by self-report indicators only. Multi-model evidence (SJT, 360, behavioral observation) is required before Leadership Expression is used in any selection or high-consequence context."*

> *"Judgment and Decision Quality scores reflect general tendencies in practical reasoning and ethical choice. These scores are not domain-specific. Judgment quality in a specific professional domain requires domain-specific validation before this dimension is used for selection in that domain."*

**D5 Provisional Synthesis Weights:**

> **GOVERNANCE MANDATE — Governance Review v4, Immediate Priority Fix, Task 10**

All D5 synthesis weights carry `synthesis_weight_version: 1.0.0-provisional`. Equal weights are in use for all synthesis and domain summaries.

---

<a name="domain-6"></a>
### 2.7 DOMAIN 6: Contextual Alignment and Decision Indices

**V1 Status: RESTRICTED — Most indices deferred to Phase 2 or later**
**Enterprise Display Name: Fit and Readiness Indices**

Domain 6 outputs are never direct traits. They are derived algorithmic interpretations.

| Index | Definition | Governance Status | V1 Status |
|---|---|---|---|
| **Role Fit** | Person-to-role alignment against approved role blueprint | Permissioned | Hiring Support only; validated blueprint required |
| **Team Fit** | Person-to-team alignment against team model | Permissioned | Phase 2 |
| **Values Alignment** *(developmental use only — NEVER for selection)* | Person-to-culture alignment | Highly restricted | Phase 2 (developmental only) |
| **Leadership Readiness** | Readiness for people-leadership scope | Restricted | Phase 2 |
| **Executive Readiness** | Readiness for enterprise-scale complexity | Restricted | Phase 2 |
| **Derailment Risk Index** | **BLOCKED — Not Defensible for V1** | **BLOCKED ENTIRELY** | Post-Phase 2; requires independent criterion validity + ethics review |
| **Development Priority Index** | Estimated development leverage area | Advisory | Phase 2 |

---

<a name="part-3"></a>
## PART 3: CONSTRUCT RELATIONS AND NOMOLOGICAL NETWORK

### 3.1 Relation Hierarchy

| Level | Relation Type | Meaning |
|---|---|---|
| Level 1 | Facet-to-dimension | Facets are narrow manifestations of one dimension |
| Level 2 | Within-domain dimension relation | Dimensions in the same domain may correlate but must remain distinguishable |
| Level 3 | Cross-domain adjacency | Dimensions in different domains may show meaningful association |
| Level 4 | Synthesis relation | Domain 5 constructs may be supported by validated lower-layer contributors |
| Level 5 | Derived relation | Domain 6 indices consume validated dimension scores but are never direct traits |

### 3.2 Strong Expected Relations

| Construct A | Construct B | Expected Relation | Product Meaning |
|---|---|---|---|
| Conscientious Execution | Execution Discipline | Strong positive | Stable discipline should support delivery behavior |
| Conscientious Execution | Work Style | Strong positive | Planning and structure influence work pattern |
| Emotional Steadiness | Resilience Capacity | Strong positive | Composure supports stress recovery |
| Interpersonal Orientation | Team Collaboration Style | Strong positive | Cooperation supports collaborative behavior |
| Social Assertiveness | Leadership Expression | Strong positive | Assertiveness supports visibility and mobilization |
| Social Awareness | Relationship Management | Strong positive | Reading others supports managing relationships |
| Self-Regulation | Judgment and Decision Quality | Strong positive | Regulation supports better practical decisions |
| Learning Drive | Learning Agility | Strong positive (cross-domain) | Motivation to learn supports applied learning expression |
| Exploratory Openness | Adaptability | Strong positive | Openness supports behavioral flexibility |
| Integrity Orientation | Culture Contribution | Strong positive | Integrity shapes climate and norm impact |
| Verbal Reasoning | Communication and Influence | Strong positive (not identity) | Language reasoning supports communication quality |
| Strategic Systems Thinking | Executive Readiness | Strong positive in derived models | Systems reasoning supports enterprise-level readiness |

### 3.3 Required Separations (Discriminant Validity)

> **GOVERNANCE MANDATE — Governance Review v4, High Priority Fix, Task 17**

The discriminant validity threshold for all Nexus construct pairs is **r < 0.70** (latent correlation from CFA).

| Pair ID | Construct A | Construct B | Pre-Launch? | Action if r ≥ 0.70 |
|---|---|---|---|---|
| DV-01 | Conscientious Execution | Achievement Drive | **YES — V1 pre-launch** | Subordinate one under the other |
| DV-02 | Emotional Steadiness | Self-Regulation | **YES — V1 pre-launch** | Self-Regulation subordinated as facet |
| DV-03 | Social Assertiveness | Leadership Expression | Phase 2 | Leadership Expression restricted to synthesis-only |
| DV-04 | Integrity Orientation | Ethical Choice (D6 facet) | Phase 2 | Ethical Choice facet removed if redundant |
| DV-05 | Security Drive | Autonomy Drive | Phase 2 | Collapse into single bipolar dimension |
| DV-06 | Learning Drive | Purpose Drive | Phase 2 | Consolidate if r ≥ 0.70 |

**Discriminant Validity Testing Protocol:**

| Step | Procedure | Standard |
|---|---|---|
| 1. CFA model specification | Two-factor CFA for each pair | CFI ≥ 0.95, RMSEA ≤ 0.06 |
| 2. Latent correlation | Extract r with 95% CI | r < 0.70 = confirmed |
| 3. Threshold evaluation | Compare against 0.70 | r ≥ 0.70 = resolution required |
| 4. Fornell-Larcker | AVE_A > r² AND AVE_B > r² | Required |
| 5. HTMT ratio | Supplementary evidence | HTMT < 0.85 required |
| 6. Resolution | Apply resolution action | Document in Construct Registry |

Minimum N: 300 per test. Chief Psychologist sign-off required for any resolution decision.


---

<a name="part-4"></a>
## PART 4: ITEM AND ASSESSMENT ARCHITECTURE

### 4.1 Multimethod Design

| Method Family | Primary Use | Best Suited For |
|---|---|---|
| Likert Self-Report | Efficient direct measurement | Stable noncognitive traits, drivers, work style tendencies |
| Forced-Choice / Comparative Items | Reduce desirability; improve trade-off behavior | Personality, drivers, leadership style, work tendencies |
| Scenario-Based Judgment Items | Contextualized behavioral reasoning | Judgment, integrity, leadership, collaboration, adaptability |
| Cognitive Reasoning Items | Performance-based reasoning measurement | Verbal, quantitative, abstract reasoning, decision complexity |
| Applied Work Simulations | Higher-fidelity work expression | Leadership, communication, prioritization, judgment |

### 4.2 Item Bank Structure

| Item Bank Field | Purpose |
|---|---|
| primary_domain_id | Mandatory |
| primary_dimension_id | Mandatory |
| primary_facet_id | Mandatory unless direct-dimension item |
| secondary_dimension_ids | Optional; maximum two |
| loading_type | direct, adjacent, or synthesized |
| intended_meaning | One-sentence construct definition |
| prohibited_overlap | Constructs the item must not represent |
| validation_status | draft, pilot, validated, production |
| item_method_type | self-report, forced-choice, SJT, simulation, cognitive, other |
| intended_population | Validated job levels, industries, languages, regions |
| reading_level | Supports fairness and accommodations |
| psychometric_parameters | IRT/CTT statistics |
| exposure_controls | Manages overuse in adaptive or secure forms |
| bias_dif_review_status | Subgroup fairness evaluation |
| security_classification | Developmental vs. high-stakes use |
| revision_lineage | Version history and retirement status |

### 4.3 Multidimensional Item Design Rules

> Each item must measure one primary facet or dimension clearly, and may carry no more than two validated secondary loadings, each justified by theory and confirmed statistically.

| Pattern | Allowed? |
|---|---|
| One facet, one dimension | Yes |
| One primary facet + one adjacent secondary facet | Yes |
| One primary applied dimension + one lower-layer contributor | Yes, with care |
| One item spanning three adjacent constructs | Only if validated and very clear |
| One item spanning unrelated domains | No |
| One item measuring direct trait and derived fit index | No |

### 4.4 Adaptive Routing Architecture

| Construct Family | Recommended Adaptive Approach | Why |
|---|---|---|
| Cognitive measures | Full item-level CAT where psychometrically justified | Maximizes precision and efficiency |
| Broad trait measures | Multistage or shadow-test assembly | Preserves content balance and interpretability |
| Leadership and behavioral scenarios | Stage-based routing by job level and prior responses | Maintains realism and contextual comparability |
| Motivation and values | Limited adaptivity or fixed balanced forms | Excessive adaptivity may distort ipsative meaning |
| Integrity module | Exposure-controlled multistage design | Reduces coaching risk and protects security |

---

<a name="part-5"></a>
## PART 5: SCORING ARCHITECTURE

### 5.1 Five-Layer Scoring Architecture

| Layer | Purpose | Production Status |
|---|---|---|
| Layer 1: Noncognitive Scoring | Estimate traits, drivers, emotional-social tendencies, collaboration, resilience, integrity indicators | Core |
| Layer 2: Cognitive Scoring | Estimate reasoning and cognitive performance | Core |
| Layer 3: Contextual Indices | Compute role fit and other context-bound outputs from validated inputs | Derived and permissioned |
| Layer 4: Confidence Scoring | Quantify uncertainty and determine reporting eligibility | Mandatory |
| Layer 5: Governance | Control activation, interpretation, use case, and release permissions | Mandatory |

> **Nexus measures first, summarizes second, matches third, and decides only under restricted governance.**

### 5.2 Noncognitive Scoring Engine (GGUM / Bayesian Ideal-Point)

```
U_ij(θ) = exp(-a_ij × ||θ - b_ij||²)

P(Y_i = j | θ) = U_ij(θ) / Σ_k U_ik(θ)

L(θ) = Π_i P(Y_i = y_i | θ)

Prior: θ ~ N(0, I)
Posterior: p(θ | Y) ∝ p(θ) · L(θ)
Final estimate: θ̂ = E[θ | Y]
```

### 5.3 Cognitive Scoring Engine (3PL IRT)

```
P(X_i = 1 | θ_c) = 1 / (1 + exp[-a_i(θ_c - b_i)])
```
Where: θ_c = cognitive ability, a_i = item discrimination, b_i = item difficulty.

### 5.4 Facet, Dimension, and Domain Scoring

```
If dimension d has M_d validated facets:
  S_d = (1/M_d) × Σ θ̂_dm   for m = 1 to M_d

If no validated facet split:
  S_d = θ̂_d

Optional domain summary (domain g with K_g validated dimensions):
  D_g = (1/K_g) × Σ S_d   for d = 1 to K_g
```

> **Dimensions are primary measured outputs. Domain scores are optional summaries only.**

### 5.5 Percentile Conversion

```
Percentile_k = Φ(θ̂_k) × 100
```
Allowed **only** when θ̂_k is on a validated reporting scale with an established norm group.

### 5.6 Role-Fit Scoring

```
Fit(r) = Σ w_d × f(S_d, T_d) / Σ w_d   for d = 1 to K

Default similarity function:
  f(S_d, T_d) = 1 - |S_d - T_d|

Default: w_d = 1 for all dimensions unless evidence justifies otherwise.
```

### 5.7 Score Versioning

> **GOVERNANCE MANDATE — Governance Review v4, Immediate Priority Fix, Task 9**

Every scored output must carry two mandatory version tags:

| Tag | Type | Definition | Current Baseline |
|---|---|---|---|
| `scoring_version` | Semantic version | Complete scoring engine version | `1.0.0-provisional` |
| `synthesis_weight_version` | Semantic version | Weight set for synthesis/aggregation | `1.0.0-provisional` |

**Version Increment Rules:**

| Change Type | When to Increment | Approval Required |
|---|---|---|
| Major (x.0.0) | Fundamental change breaking score comparability | Chief Psychologist + Ethics Committee + Global Validation Council |
| Minor (0.x.0) | New dimensions, new confidence rules | Chief Psychologist sign-off |
| Patch (0.0.x) | Bug fixes, calibration corrections | Engineering lead sign-off |

**Cross-Version Comparison Rules:**

| Scenario | Rule |
|---|---|
| Same major + minor version | Direct comparison permitted |
| Same major, different minor/patch | Comparison permitted with version disclosure |
| Different major version | Direct comparison NOT permitted |
| Different synthesis_weight_version | Derived index comparison NOT permitted |

### 5.8 Confidence and Precision Model

```
SE_k = sqrt(Var(θ_k | Y))
CI_k = θ̂_k ± 1.96 × SE_k
```

**Production Confidence Bands (V1 Policy Thresholds):**

| Confidence Band | Standard Error Rule | Internal Code | Reporting Consequence |
|---|---|---|---|
| High | SE ≤ 0.25 | `HIGH` | May be shown for all approved report types |
| Moderate | 0.25 < SE ≤ 0.35 | `MODERATE` | May be shown for development use; consequential use requires additional controls |
| Low | 0.35 < SE ≤ 0.45 | `LOW` | May be shown only as exploratory, visually downgraded |
| Unacceptable | SE > 0.45 | `UNACCEPTABLE` | Hidden from user-facing reports |

*These are working operational policy thresholds, not final scientific constants.*

### 5.9 Method-Variance Correction

> **GOVERNANCE MANDATE — Governance Review v4, Critical Fix, Task 11**

**Method-Variance Flags:**

| Flag | Condition | Reporting Consequence |
|---|---|---|
| `MV_CLEAN` | ω_method ≤ 0.15 AND MBI ≤ 0.30 for all contributing methods | Full synthesis score released |
| `MV_CAUTION` | ω_method 0.15–0.25 OR MBI 0.30–0.50 for any method | Synthesis score released with caution; confidence band widened by one tier |
| `MV_HIGH` | ω_method > 0.25 OR MBI > 0.50 for any method | Synthesis score suppressed; single best-method score released |
| `MV_UNRESOLVED` | Method-variance calibration not yet completed | Cross-method synthesis BLOCKED; single-method score only |

**V1 Method-Variance Status:**

| Construct | Methods in Synthesis | V1 Constraint |
|---|---|---|
| Integrity Orientation | Self-report + SJT | Single-method (self-report) only; selection use BLOCKED |
| Self-Regulation | Self-report + SJT | Single-method (self-report) only; selection use BLOCKED |
| Leadership Expression | Self-report + SJT + 360 | Single-method (self-report) only; selection use BLOCKED |
| Emotional Steadiness | Self-report + scenario | Single-method; developmental use permitted |
| Cognitive constructs (D2) | Performance + self-report | Performance-only scoring at V1 |
| Domain 1 personality | Self-report + forced-choice | Equal-weight provisional synthesis; `MV_UNRESOLVED` flag applied |

### 5.10 GGUM Calibration Minimum Sample Requirements

> **GOVERNANCE MANDATE — Governance Review v4, High Priority Fix, Task 20**

| Scoring Model | Application | Min N per Item | Min Total N per Dimension |
|---|---|---|---|
| GGUM (noncognitive) | D1, D3, D4 self-report | 500 | 2,500 |
| 3PL IRT (cognitive) | D2 performance items | 300 | 1,500 |
| Forced-choice (Thurstonian IRT) | D1/D3/D4 forced-choice | 500 | 2,500 |
| SJT scoring (Phase 2) | D4/D5 situational judgment | 300 | 1,500 |

**GGUM Model-Data Fit Requirements:**

| Fit Index | Minimum Standard | Preferred Standard |
|---|---|---|
| CFI | ≥ 0.95 | ≥ 0.97 |
| RMSEA | ≤ 0.06 | ≤ 0.04 |
| SRMR | ≤ 0.08 | ≤ 0.05 |
| Q3 residual correlations | All Q3 < 0.20 | All Q3 < 0.15 |

**Calibration Status Flags:**

| Flag | Condition | Operational Consequence |
|---|---|---|
| `CALIBRATION_COMPLETE` | N meets minimum; model-data fit meets all standards | Available for operational scoring |
| `CALIBRATION_PROVISIONAL` | N meets minimum; fit meets minimum but not preferred | Developmental use only; not for selection |
| `CALIBRATION_INSUFFICIENT` | N below minimum for any item | BLOCKED from all operational use |
| `CALIBRATION_FIT_FAIL` | Model-data fit below minimum standard | BLOCKED; item revision required |
| `CALIBRATION_EXPIRED` | Calibration data > 3 years old | Flagged for re-calibration; continues with caution flag |

### 5.11 Cognitive–Noncognitive Module Counterbalancing Protocol

> **GOVERNANCE MANDATE — Governance Review v4, High Priority Fix, Task 19**

Fixed ordering of cognitive before noncognitive is **prohibited** unless a specific scientific rationale is documented and approved.

| Condition | Module Order | Assignment Rule |
|---|---|---|
| Condition A (Cognitive-first) | D2 → D1 → D4 → D3 (if active) | 50% of sessions via random allocation |
| Condition B (Noncognitive-first) | D1 → D4 → D3 (if active) → D2 | 50% of sessions via random allocation |
| Condition C (Interleaved) | D1 → D2 (short block) → D4 → D2 (short block) | Phase 2 only |

**Fatigue Monitoring Thresholds:**

| Indicator | Threshold | Action |
|---|---|---|
| Response time acceleration (noncognitive) | Mean RT drops > 30% from first to last quartile | Flag session; apply RQ modifier |
| Response time acceleration (cognitive) | Mean RT drops > 25% from first to last quartile | Flag session; apply cognitive RQ modifier |
| Completion time vs. norm | Total time < 40% of norm | Flag for speed-through review |
| Late-session omission spike | Omission rate in final 20% > 3× rate in first 20% | Flag for fatigue-related omission |

### 5.12 Weighting Policy

**Default Rule:** Equal weights for all facet-to-dimension and dimension-to-role-fit aggregations.

**Unequal-Weight Approval (all four conditions required):**

| Requirement | Rule |
|---|---|
| Theoretical basis | Written rationale exists |
| SME support | Relevant stakeholders agree |
| Empirical support | Unequal weights materially improve predictive or interpretive performance |
| Governance sign-off | Approved and version-controlled |

### 5.13 Output Eligibility Formula

```
Eligible(O) = Validation(O) × Confidence(O) × Permission(O)
```
Where each term is binary (0 or 1). If Eligible(O) = 1, the output may be shown.

### 5.14 Score Generation Sequence

| Step | Decision |
|---|---|
| 1 | Estimate facet or dimension scores using the appropriate scoring engine |
| 2 | Compute standard errors and confidence bands |
| 3 | Apply validation status checks to each score |
| 4 | Derive dimension scores from facets where approved |
| 5 | Derive domain summaries only if domain rules are met |
| 6 | Evaluate whether blueprint status permits role fit |
| 7 | Evaluate whether contributing dimensions meet confidence thresholds |
| 8 | Compute role fit only if blueprint, confidence, and use-case permissions all pass |
| 9 | Suppress, downgrade, or label outputs according to reporting policy |
| 10 | Log output status for audit and governance review |

---

<a name="part-6"></a>
## PART 6: VALIDITY STATES AND RESPONSE QUALITY

### 6.1 Assessment Validity States

> **GOVERNANCE MANDATE — Governance Review v4, Immediate Priority Fix, Task 8**

| Validity State | Trigger Conditions | Reporting Consequence |
|---|---|---|
| `VALID` | All quality checks pass; confidence bands HIGH or MODERATE across all dimensions | Full interpretive report released |
| `PASS_WITH_LIMITS` | Minor quality concerns; one or more dimensions at LOW confidence; no severe flags | Partial report with caution codes |
| `VALID_BUT_UNINTERPRETABLE` | Session complete but severe/pervasive response-quality flags prevent reliable interpretation | No interpretive report released; session retained for audit |
| `INCOMPLETE` | completion_ratio < 0.85 | No report generated; re-assessment offered |
| `INVALID` | Structural integrity failure, identity concern, or disqualifying quality flag | Session voided; escalation triggered |
| `DEFERRED` | Report section cannot be generated now but may become available when specified conditions are met | Section shows "not yet available" chip with reason code |

**State Resolution Sequence:** `INCOMPLETE` → `INVALID` → `VALID_BUT_UNINTERPRETABLE` → `PASS_WITH_LIMITS` → `VALID`

**VALID_BUT_UNINTERPRETABLE Trigger Conditions:**

| Trigger | Threshold |
|---|---|
| All-low-confidence state | Every reportable dimension at LOW or UNACCEPTABLE confidence |
| Pervasive impression-management | IM severity = severe on 3+ domains |
| Cross-method consistency failure | Divergence > 1.5 SD on 2+ constructs requiring multimethod corroboration |
| Uniform response pattern | ≥ 60% uniform response across noncognitive items |
| Domain-level missingness | completion_ratio ≥ 0.85 but item-level missingness concentrated in ≥ 2 full domains |

**Candidate Communication for VALID_BUT_UNINTERPRETABLE:**
> *"Your assessment session was completed, but the response patterns recorded did not meet the quality standards required to generate a reliable report. No interpretive results have been produced. You may be invited to retake the assessment under standard conditions."*

**Retest Policy:**

| Scenario | Retest Eligibility | Waiting Period | Conditions |
|---|---|---|---|
| First VALID_BUT_UNINTERPRETABLE | Eligible for one governed retest | Minimum 72 hours | Standardised administration; proctoring recommended for selection |
| Second VALID_BUT_UNINTERPRETABLE | Eligible for escalated review only | Minimum 14 days | Human review required before retest authorisation |
| Third occurrence | Retest suspended | Indefinite | Ethics Committee review required |

### 6.2 Per-Dimension Response-Quality Modifiers

> **GOVERNANCE MANDATE — Governance Review v4, Immediate Priority Fix, Task 8**

| RQ Level | Definition | Reporting Action |
|---|---|---|
| RQ-0: Clean | No quality concerns | Full dimension score and narrative released |
| RQ-1: Minor | Minor inconsistency; within acceptable tolerance | Score released; internal flag logged |
| RQ-2: Moderate | Moderate quality concern (elevated IM, low person-fit, response-time anomaly) | Score downgraded to band-only display; caution chip shown; narrative suppressed |
| RQ-3: Severe | Severe quality concern (extreme inconsistency, straightlining, cross-method divergence) | Dimension score hidden; omission code triggered |
| RQ-4: Disqualifying | Quality failure renders dimension unmeasurable | Dimension marked `NOT_GENERATED`; contributes to VALID_BUT_UNINTERPRETABLE if ≥ 2 dimensions affected |

**RQ Assignment Rules:**

| Quality Signal | RQ Assignment |
|---|---|
| Person-fit z-score > 2.0 for this dimension's item set | RQ-2 |
| Person-fit z-score > 3.0 for this dimension's item set | RQ-3 |
| Impression-management = elevated for this domain | RQ-2 |
| Impression-management = severe for this domain | RQ-3 |
| Response time < 0.5s average for this dimension's items | RQ-3 |
| Variance = 0 (all identical responses) across this dimension | RQ-3 |
| Cross-method divergence > 1.5 SD for this construct | RQ-3 if multimethod required; RQ-2 otherwise |
| Missing items > 30% within this dimension | RQ-4 |

### 6.3 DEFERRED State

> **GOVERNANCE MANDATE — Governance Review v4, High Priority Fix, Task 28**

| Trigger Code | Condition | Resolution Path |
|---|---|---|
| `DEFERRED_BLUEPRINT_PENDING` | Blueprint in `draft` or `under_review` status | Blueprint achieves `validated` status |
| `DEFERRED_NORM_PENDING` | Norm group being established but not yet approved | Norm group approved |
| `DEFERRED_MULTIMETHOD_PENDING` | Multimethod evidence not yet collected | Multimethod module completed |
| `DEFERRED_CONSENT_PENDING` | Candidate has not provided consent for this output type | Consent provided |
| `DEFERRED_CALIBRATION_PENDING` | Dimension calibration in progress (`CALIBRATION_PROVISIONAL`) | Calibration achieves `CALIBRATION_COMPLETE` |
| `DEFERRED_BLUEPRINT_INVALIDATED` | Role-fit score invalidated by blueprint version update | Re-scoring completed against new blueprint version |
| `DEFERRED_PHASE_2` | Section requires Phase 2 feature not yet activated | Phase 2 activation |

**DEFERRED vs. SUPPRESSED vs. OMITTED:**

| State | Meaning | Can Become Available? | User-Facing Label |
|---|---|---|---|
| `SUPPRESSED` | Blocked by P1–P5 governance rule; permanent for this session | No | "This section is not available for this report" |
| `DEFERRED` | Temporarily unavailable pending a resolvable condition | Yes — auto-generates when condition is met | "This section is not yet available" |
| `OMITTED` | Suppressed due to low confidence or insufficient data | No | Omission chip with reason code |


---

<a name="part-7"></a>
## PART 7: ROLE-FIT ARCHITECTURE

### 7.1 Role-Fit Process Layers

> The agent proposes, the evidence verifies, governance approves, and outcomes validate.

| Layer | Purpose | Decision Rule |
|---|---|---|
| Layer 1: Intake | Gather structured role evidence | No scoring yet |
| Layer 2: Translation | Convert evidence into dimension hypotheses | Agent recommends only |
| Layer 3: Verification | Test whether proposed dimensions match role demands | Minimum thresholds required |
| Layer 4: Approval | Governance review of final role blueprint | No operational use without approval |
| Layer 5: Validation | Compare blueprint against actual outcomes | Required for high-stakes operational use |

### 7.2 Required Role Evidence

| Evidence Category | Examples | Why It Matters |
|---|---|---|
| Role identity | Title, family, department, geography, business unit | Prevents generic profiling |
| Job purpose | Mission, expected outcomes | Defines success meaning |
| Key duties | Responsibilities and relative importance | Anchors demands |
| Decision scope | Autonomy, complexity, ambiguity, risk | Identifies leadership and cognitive demands |
| Stakeholder environment | Internal/external interaction and conflict load | Identifies interpersonal demands |
| Seniority | Entry, IC, manager, senior leader, executive | Changes construct meaning |
| Context | Remote, regulated, growth-stage, customer-facing | Changes weighting and relevance |
| Success indicators | Metrics of success | Supports criterion linkage |
| Failure risks | Typical derailers or failure points | Supports risk modeling |
| Non-negotiables | Compliance, ethics, safety, security | Supports governance |

### 7.3 Role Blueprint Object

| Field | Description |
|---|---|
| role_id | Unique role identifier |
| role_title | Business title |
| role_level | Entry, IC, manager, senior leader, executive |
| job_family | Functional family |
| context_flags | Work environment and business context |
| critical_outcomes | Measurable success outcomes |
| critical_tasks | Ranked task list |
| required_dimensions | Included measured dimensions |
| excluded_dimensions | Explicitly excluded dimensions |
| dimension_weights | Importance weights for included dimensions |
| rationale | Written reason each dimension matters |
| evidence_sources | Job description, manager input, SME input, performance data |
| confidence_score | Completeness and agreement score |
| approval_status | draft, reviewed, approved, validated |
| blueprint_version | Semantic version (MAJOR.MINOR.PATCH) |
| effective_date | ISO 8601 |
| approved_by | Name/ID of approving authority |

### 7.4 Blueprint Maturity States

| Status | Meaning | Role-Fit Permission |
|---|---|---|
| Draft | Incomplete or title-led | No user-facing role fit |
| Reviewed | Evidence gathered, awaiting sign-off | Internal design use only |
| Approved | Evidence adequate and governance signed | Development and exploratory role fit |
| Validated | Approved + criterion linkage established | Operational role fit |

### 7.5 Blueprint Quality Scorecard

```
BQ = 0.30E + 0.25C + 0.20S + 0.15W + 0.10R

Where:
  E = Evidence completeness (0–1)
  C = Construct clarity (0–1)
  S = SME agreement quality (0–1)
  W = Weight justification quality (0–1)
  R = Role-level specificity (0–1)
```

| BQ Score | Meaning | Permission |
|---|---|---|
| BQ < 0.70 | Weak blueprint | No role-fit output |
| 0.70 ≤ BQ < 0.85 | Adequate blueprint | Exploratory or development-only role fit |
| BQ ≥ 0.85 | Strong blueprint | Approved for operational role-fit (subject to other gates) |

### 7.6 Blueprint Versioning and Score Invalidation

> **GOVERNANCE MANDATE — Governance Review v4, High Priority Fix, Task 25**

| Change Type | Definition | Score Invalidation Trigger |
|---|---|---|
| `major` | Addition/removal of required dimensions; change to use-case permissions; change to adverse impact analysis results | **Immediate invalidation of all scores from prior version** |
| `minor` | Change to dimension weightings; change to benchmark thresholds | **Invalidation of scores older than 90 days from prior version** |
| `patch` | Typographical corrections; metadata updates; clarifications not affecting scoring | **No invalidation** |

**Score Invalidation Rules:**
- Every role-fit score must carry `blueprint_id`, `blueprint_version`, and `blueprint_effective_date`
- Invalidated scores carry `score_validity: BLUEPRINT_INVALIDATED` and must not appear in active hiring workflows
- HR admin must be notified within 24 hours of invalidation
- All blueprint version changes, invalidation events, and re-scoring events written to audit log

### 7.7 Adverse Impact Analysis

> **GOVERNANCE MANDATE — Governance Review v4, Immediate Priority Fix (Role-Fit Validity Framework)**

Before any role blueprint is approved for operational use:

| Requirement | Specification |
|---|---|
| Protected group analysis | Adverse impact analysis across all protected group categories (race, gender, age, disability, national origin) |
| 4/5ths rule | Selection rate for any group must not be less than 4/5ths (80%) of the rate for the group with the highest selection rate |
| Documentation | Full adverse impact analysis report filed in blueprint evidence file |
| Remediation | If adverse impact detected, blueprint must be revised or additional validation evidence provided before approval |
| Ongoing monitoring | Quarterly adverse impact monitoring for all active blueprints |

---

<a name="part-8"></a>
## PART 8: REPORTING ARCHITECTURE

### 8.1 Core Reporting Principles

| Principle | Meaning |
|---|---|
| Measurement before interpretation | Start from validated measured scores |
| Dimensions before domains | Dimensions are the main report unit |
| Domains are optional | Include only when helpful |
| Derived outputs are permissioned | Role fit, readiness, and risk require additional gates |
| Uncertainty is operational | Low-confidence outputs are downgraded, hidden, or explained |
| Audience controls visibility | Different audiences see different outputs |
| Evidence controls language | Wording must match construct maturity and evidence status |
| Human oversight remains available | Consequential uses must support review |

### 8.2 Standard Assessment-to-Workplace Performance Disclaimer

> **GOVERNANCE MANDATE — Governance Review v4, High Priority Fix, Task 24**

The following disclaimer must appear in all Nexus reports:

> *"Assessment scores reflect measured tendencies and capabilities at the time of assessment. They are not direct measures of job performance. The relationship between assessment scores and workplace performance depends on the specific role, context, and use case, and requires validation evidence for the specific application. Assessment results should be used as one input among multiple sources of evidence in any talent decision."*

### 8.3 Five-Gate Reporting Pipeline

| Gate | Question | Possible Outcomes |
|---|---|---|
| Gate 1: Assessment Validity | Is the assessment complete and valid enough for interpretation? | pass, incomplete, invalid |
| Gate 2: Score Eligibility | Is this specific score validated and allowed for this use? | eligible, restricted, ineligible |
| Gate 3: Confidence Status | Is the score precise enough to show? | high, moderate, low, unacceptable |
| Gate 4: Derived-Output Prerequisites | If derived, do all blueprint and dependency rules pass? | pass, partial fail, fail |
| Gate 5: Audience Release Rule | What is the final visible behavior for this audience? | visible, caution, hidden, blocked |

### 8.4 Output States

| Output State | Definition | User-Facing Behavior |
|---|---|---|
| `VISIBLE` | All required gates passed | Show normally |
| `VISIBLE_WITH_CAUTION` | Allowed with moderated interpretation | Show with caution chip and bounded language |
| `DOWNGRADED` | Shown in limited/exploratory form only | Reduced emphasis; excluded from summaries |
| `HIDDEN` | Not allowed for this audience or use case | Do not render |
| `BLOCKED` | Explicitly suppressed because prerequisites failed | Omit section; provide policy-based explanation |
| `NOT_GENERATED` | Report object never assembled because assessment-level conditions failed | No section or score object emitted |

### 8.5 Exact Confidence-Based Display Rules

| Confidence Band | Developmental | Talent Advisory | Selection Support | Restricted / High Consequence |
|---|---|---|---|---|
| High | VISIBLE | VISIBLE | VISIBLE | VISIBLE if otherwise allowed |
| Moderate | VISIBLE_WITH_CAUTION | VISIBLE_WITH_CAUTION | DOWNGRADED or HIDDEN | HIDDEN unless policy exception |
| Low | DOWNGRADED or HIDDEN | HIDDEN from summaries | HIDDEN | HIDDEN |
| Unacceptable | HIDDEN | HIDDEN | HIDDEN | HIDDEN |

**Exact Downgrade vs. Hide Rules:**

| Rule ID | Object Type | Use Case | Confidence | Final Behavior |
|---|---|---|---|---|
| CF-01 | Facet | Developmental | Moderate | `VISIBLE_WITH_CAUTION` |
| CF-02 | Facet | Developmental | Low | `DOWNGRADED` |
| CF-03 | Facet | Non-developmental | Low | `HIDDEN` |
| CF-04 | Dimension | Developmental | Moderate | `VISIBLE_WITH_CAUTION` |
| CF-05 | Dimension | Developmental | Low | `DOWNGRADED` if not dependency; otherwise `HIDDEN` |
| CF-06 | Dimension | Talent advisory | Moderate | `VISIBLE_WITH_CAUTION` |
| CF-07 | Dimension | Talent advisory | Low | `HIDDEN` |
| CF-08 | Dimension | Selection support | Moderate | `VISIBLE_WITH_CAUTION` only if not primary selection driver; otherwise `HIDDEN` |
| CF-09 | Dimension | Selection support | Low | `HIDDEN` |
| CF-10 | Domain summary | Any consequential | >25% of included dimensions below HIGH | `HIDDEN` |
| CF-11 | Derived output | Any | Any required input below required threshold | `BLOCKED` |
| CF-12 | Any object | Any | Unacceptable | `HIDDEN` |

### 8.6 Rule Precedence Hierarchy

> **GOVERNANCE MANDATE — Governance Review v4, Critical Fix, Task 16**

Rules are applied in strict order. A higher-priority rule always overrides a lower-priority rule.

| Priority | Rule Category | Description | Override Behaviour |
|---|---|---|---|
| **P1 — ABSOLUTE BLOCK** | Legal / ethical prohibition | Output prohibited by law, ethics policy, or governance mandate | Suppressed unconditionally; no lower-priority rule can release it |
| **P2 — VALIDITY GATE** | Assessment validity state | Assessment is `INVALID`, `INCOMPLETE`, or `VALID_BUT_UNINTERPRETABLE` | All scored outputs suppressed |
| **P3 — USE CASE GATE** | Use case permission | Output type not permitted for the assigned `use_case` | Output suppressed for this session |
| **P4 — RESPONSE QUALITY** | Assessment-level RQ failure | RQ is `RQ-0` (invalid) or `RQ-1` (severely degraded) | All outputs suppressed |
| **P5 — CONSTRUCT RESTRICTION** | Construct governance restriction | Construct carries `RESTRICTED`, `BLOCKED`, `MV_UNRESOLVED`, or `INV_UNTESTED` flag | Construct output suppressed |
| **P6 — CONFIDENCE GATE** | Score precision | Confidence band below threshold for use case | Output downgraded or hidden per CF rules |
| **P7 — AUDIENCE GATE** | Audience permissions | Output not permitted for this audience role | Output hidden or blocked |

### 8.7 Percentile Norm Rules

> **GOVERNANCE MANDATE — Governance Review v4, Critical Fix, Task 15**

| Rule ID | Condition | Final Behavior |
|---|---|---|
| PC-01 | Norm group linked and validated for audience/use | VISIBLE |
| PC-02 | Norm group present but not validated for use | HIDDEN |
| PC-03 | Score confidence LOW or UNACCEPTABLE | HIDDEN |
| PC-04 | Candidate report where percentile likely harms clarity | HIDDEN |

### 8.8 Audience-Specific Reporting

| Audience | Reporting Posture | Typical Content |
|---|---|---|
| Candidate / Participant | Supportive, bounded, non-punitive | Measured dimensions, strengths, development themes |
| Coach / Assessor | More detailed but still guarded | Dimensions, facets, development interpretation |
| Hiring Manager | Concise and role-relevant | Role-linked dimensions only; fit if allowed |
| HR / Talent Partner | Structured and governance-aware | Dimensions, role fit, selective comparative interpretation |
| Senior Leader / Executive Sponsor | Selective business-facing summary | Key validated themes and approved indices only |
| Admin / Psychometric User | Full traceability | Metadata, flags, evidence and version detail |
| Research / Validation User | Analytic and technical | Distributions, fairness, evidence, calibration detail |

### 8.9 Score Eligibility by Audience

| Score Class | Candidate | Coach | Hiring Manager | HR / Talent | Executive | Admin / Research |
|---|---|---|---|---|---|---|
| Validated dimension | Yes | Yes | Filtered yes | Yes | Selected yes | Yes |
| Facet | Limited | Yes | Usually no | Optional | Usually no | Yes |
| Domain summary | Optional | Optional | Usually no | Optional | Optional | Yes |
| Percentile | Only if normed and allowed | Yes if normed | Yes if validated | Yes | Optional | Yes |
| Role-fit | Developmental only if approved | Yes if allowed | Yes if validated | Yes if validated | Selected summary only | Yes |
| Readiness / potential | No by default | Limited | Restricted | Restricted | Restricted summary only | Yes if authorized |
| Risk / derailment | **BLOCKED** | No by default | No by default | Restricted | Restricted | Yes if authorized |
| Response-quality details | No | Limited | No | Limited | No | Yes |

### 8.10 Report Display Hierarchy

| Layer | Purpose | Typical Contents |
|---|---|---|
| Layer A: Headline Summary | Quick orientation | Report purpose, use, trust boundaries |
| Layer B: Primary Measured Profile | Main interpretation | Validated dimensions and explanations |
| Layer C: Contextual Interpretation | Use-case layer | Role relevance, development themes, team implications |
| Layer D: Drill-Down Detail | Deeper view | Facets, confidence detail, evidence notes |
| Layer E: Governance and Limits | Safeguard layer | Omissions, restrictions, version and permission notes |

### 8.11 Omission Explanation Matrix

| Code | Trigger | Candidate-Facing Text | Admin Text |
|---|---|---|---|
| OM-01 | Low confidence | "This result is not shown because the available evidence was not precise enough for reliable interpretation." | "Suppressed: SE threshold failed." |
| OM-02 | Restricted use | "This section is not included in this report format." | "Suppressed: permission rule failed." |
| OM-03 | Blueprint immaturity | "A fit estimate is not shown because the target profile has not yet met activation requirements." | "Blocked: blueprint state below minimum." |
| OM-04 | Assessment incomplete | "The assessment was not completed sufficiently to support a full interpretation." | "Not generated: completion threshold failed." |
| OM-05 | Response-quality concern | "Some interpretive sections are not shown because response quality conditions did not support reliable reporting." | "Restricted: response-quality severity threshold triggered." |
| OM-06 | Validation limit | "This result is still being evaluated for this use and is not included here." | "Suppressed: use-validation rule failed." |

### 8.12 Reporting Agent Contract

| Agent Function | Required Behavior |
|---|---|
| Ingest | Read reportable objects, visibility states, confidence codes, permissions, and blueprint status |
| Filter | Exclude hidden, blocked, or ineligible objects |
| Prioritize | Rank visible outputs by importance, role relevance, and audience context |
| Narrate | Generate bounded explanation text consistent with maturity and confidence rules |
| Compose | Assemble audience-specific report sections in correct order |
| Explain Omission | Provide standardized omission or caution text where required |
| Log | Write all release decisions and generation states to audit ledger |

### 8.13 Phased Rollout

| Phase | Scope | Allowed Outputs | Restricted Outputs |
|---|---|---|---|
| Phase 1 (V1 Launch) | Core production launch | Validated dimension reporting, confidence chips, omission logic, audit log, partial release states | No readiness, no risk, no broad percentile use unless norming complete |
| Phase 2 | Governed role-fit launch + D3 + D5 | Approved/validated role-fit outputs, blueprint gating, section blocking | No risk outputs; readiness only pilot |
| Phase 3 | Advisory expansion | Selected facet drill-down, broader advisory views, validated percentile expansion | High-consequence derived outputs still restricted |
| Phase 4 | Advanced enterprise modules | Validated readiness or specialized indices for authorized contexts | Still no unrestricted omnibus outputs |
| Phase 5 | Mature ecosystem | Construct-family exceptions resolved, thresholds empirically refined, global localization hardened | Restricted outputs remain governed |

---

<a name="part-9"></a>
## PART 9: GOVERNANCE, ETHICS, AND ENTERPRISE VALIDITY

### 9.1 Four-Ring Governance Model

| Governance Ring | Primary Responsibility | Typical Owners |
|---|---|---|
| Scientific Governance | Construct definitions, scoring integrity, validation standards, revision thresholds | Chief Psychologist, psychometricians, scientific advisory board |
| Ethical Governance | Candidate rights, privacy, fairness, explainability, use boundaries | Ethics Committee, privacy lead, legal counsel, DEI/fairness reviewers |
| Enterprise Governance | Client configuration, use controls, auditability, deployment standards | Product Governance Council, enterprise admins |
| Operational Governance | Security, access control, item exposure, versioning, incident management | Platform operations, security, QA, compliance |

### 9.2 Six Ethical Pillars

| Ethical Pillar | Meaning for Nexus |
|---|---|
| Respect for Persons | Informed participation and understandable feedback |
| Purpose Limitation | Scores used only for disclosed, evidence-supported purposes |
| Proportionality | Burden and inference power must fit the use case |
| Fairness and Inclusion | Reduce avoidable bias and exclusion |
| Transparency and Explainability | Users should understand what was measured and what was inferred |
| Accountability and Remedy | Review, challenge, correction, and appeal pathways |

### 9.3 Fairness Architecture

| Fairness Layer | What Nexus Must Do |
|---|---|
| Design Fairness | Review wording, reading load, stereotypes, accessibility |
| Statistical Fairness | Monitor subgroup score patterns, DIF, local bias signals, adverse impact |
| Process Fairness | Standardize administration and accommodations |
| Interpretation Fairness | Avoid overclaiming from group means or fit outputs |
| Outcome Fairness | Monitor real decision consequences in deployments |
| Governance Fairness | Require escalation and remediation when thresholds are breached |

### 9.4 Behavioral Risk Indicators (BRI) Framework

> **GOVERNANCE MANDATE — Governance Review v4, Critical Fix, Task 13**

The Derailment Risk Index is **BLOCKED entirely** and replaced by the BRI framework.

**Why the Derailment Risk Index Is Blocked:**
1. No criterion validity evidence
2. High adverse impact risk
3. Stigmatising language
4. No independent ethical review completed

**BRI Candidate Indicators (Provisional — Pending Criterion Validation):**

| BRI Code | Behavioral Indicator | Source Constructs | Validation Status |
|---|---|---|---|
| BRI-01 | Interpersonal friction under pressure | Low Agreeableness facets + Low Self-Regulation | Not yet validated |
| BRI-02 | Reliability risk in high-accountability roles | Low Conscientiousness facets + Low Follow-Through | Not yet validated |
| BRI-03 | Integrity concern in trust-critical roles | Low Integrity Orientation (SJT-confirmed only) | Not yet validated |
| BRI-04 | Emotional dysregulation under high stress | Low Emotional Steadiness + Low Self-Regulation | Not yet validated |
| BRI-05 | Resistance to feedback and development | Low Openness to Experience + Low Learning Orientation | Not yet validated |

**BRI Activation Requirements (all must be met before any BRI is operational):**
- Criterion validity study: N ≥ 300 with documented relationship to criterion anchor
- Independent ethics review: Written Ethics Committee approval
- Chief Psychologist sign-off
- Construct brief in Nexus Construct Registry
- Adverse impact analysis
- Release restriction confirmed in governance configuration

### 9.5 Values Alignment: Prohibition on Standalone Selection Use

> **GOVERNANCE MANDATE — Governance Review v4, Critical Fix, Task 14**

| Rule | Specification |
|---|---|
| **Never a standalone selection criterion** | Values Alignment must never be used as a standalone criterion in any hiring, promotion, placement, or screening decision |
| **Developmental use only at V1** | Restricted to developmental reports only; may not appear in any selection-context report |
| **No selection-context release** | Reporting engine must suppress Values Alignment in any session with `use_case: hiring_support_validated_blueprint` |
| **Explicit consent required** | Candidates must provide explicit, separate consent before Values Alignment is scored or reported |
| **Approved culture model required** | May only be scored against an explicitly approved, documented organisational culture model |
| **Adverse impact monitoring mandatory** | Any deployment must include adverse impact monitoring across protected group categories; reviewed quarterly |
| **No composite use** | Must not be combined with other dimensions into a composite score or index |

### 9.6 Data Retention Policy

> **GOVERNANCE MANDATE — Governance Review v4, Immediate Priority Fix**

| Data Category | Retention Limit | Deletion Trigger |
|---|---|---|
| Raw item responses | 24 months from assessment date | Candidate deletion request OR retention limit reached |
| Derived scores (domain scores, indices) | 24 months from assessment date | Candidate deletion request OR retention limit reached |
| Narrative report outputs | 24 months from report generation date | Candidate deletion request OR retention limit reached |
| Audit logs (scoring version, session metadata) | 36 months (extended for legal defensibility) | Legal hold expiry or regulatory clearance |
| Anonymised aggregate research data | Indefinite (no PII linkage permitted after anonymisation) | N/A |

**2-Year Hard Limit:** No identifiable candidate data may be retained beyond 24 months without explicit renewed consent and documented business justification approved by the Ethics Committee.

**Deletion-on-Request:** All identifiable data must be purged within 30 calendar days of verified request.

### 9.7 Granular Per-Use-Case Consent Framework

> **GOVERNANCE MANDATE — Governance Review v4, Immediate Priority Fix**

Consent is **not global**. Candidates must provide separate, informed, revocable consent for each distinct use case.

| Use Case | Consent Type | Revocation Right | Notes |
|---|---|---|---|
| Pre-hire screening (role-fit scoring) | Explicit opt-in, written or digital | Yes — revocation invalidates hiring use | Must name the specific role and employer |
| Developmental feedback report | Explicit opt-in, written or digital | Yes | Candidate retains copy if already delivered |
| Leadership readiness assessment | Explicit opt-in, written or digital | Yes | Must specify whether results are shared with manager |
| Team composition analysis | Explicit opt-in, written or digital | Yes | Must disclose who will see team-level data |
| Longitudinal tracking / re-assessment | Separate renewed consent | Yes | Prior consent does not carry forward |
| Research and product validation | Separate explicit opt-in (anonymised) | Yes | Data must be anonymised before research use |
| Third-party sharing (e.g., ATS integration) | Explicit opt-in naming the third party | Yes | Third party must be named; blanket consent not valid |

### 9.8 Privacy and Data Governance

| Principle | Operational Meaning |
|---|---|
| Data Minimization | Collect only what is required |
| Purpose-Bound Retention | Retain according to use case and policy |
| Role-Based Access | Restrict visibility by audience and authorization |
| Segmented Storage | Separate identity data from psychometric data where practical |
| Audit Logging | Log access, scoring version, report generation, and configuration changes |
| Deletion and Correction Rights | Support lawful data access, correction, and deletion |
| Model-Data Separation | Prevent ungoverned reuse for unrelated AI modeling |

### 9.9 Measurement Invariance Requirements

> **GOVERNANCE MANDATE — Governance Review v4, Critical Fix, Task 16**

> **Nexus must not make cross-cultural score comparisons, apply global norms, or use cross-cultural role blueprints until measurement invariance has been established across the relevant cultural clusters.**

**Required Cultural Clusters:**

| Cluster | Representative Regions | Priority |
|---|---|---|
| Cluster 1: Anglo-Western | US, UK, Australia, Canada, New Zealand | **Highest — required for V1 English deployment** |
| Cluster 2: Northern/Western European | Germany, Netherlands, Scandinavia, France | Phase 2 |
| Cluster 3: East Asian | China, Japan, South Korea, Taiwan | Phase 2 |
| Cluster 4: South/Southeast Asian | India, Singapore, Malaysia, Philippines | Phase 2 |
| Cluster 5: Latin American | Brazil, Mexico, Colombia, Argentina | Phase 2 |

**Invariance Status Flags:**

| Flag | Condition | Deployment Consequence |
|---|---|---|
| `INV_FULL` | Full scalar invariance confirmed | Cross-cultural comparison and global norms permitted |
| `INV_PARTIAL` | Partial scalar invariance; corrections applied | Cross-cultural comparison permitted with documented limitations; global norms blocked |
| `INV_METRIC` | Metric invariance only | Latent mean comparisons blocked |
| `INV_CONFIGURAL` | Configural only | Cross-cultural comparison BLOCKED |
| `INV_UNTESTED` | Not yet tested | Cross-cultural deployment BLOCKED |

### 9.10 Accessibility and Localization

| Area | Requirement |
|---|---|
| Reading Burden | Plain-language targets where compatible with construct meaning |
| Visual Accessibility | Screen-reader support, contrast, scalable text, keyboard access |
| Timing Accommodations | Extended time or timing waivers where psychometrically appropriate |
| Format Accommodations | Alternative formats without changing construct meaning |
| Language Access | Validated localization rather than informal translation |
| Measurement Equivalence | Test cross-language comparability before broad release |

### 9.11 Human Oversight Requirements

| Decision Context | Required Human Oversight |
|---|---|
| Developmental feedback | Standard trained-user interpretation |
| Internal talent review | HR or talent professional review |
| Selection and promotion | Qualified human decision-maker + documented multi-factor review |
| Executive or board-level use | Elevated review panel, documented rationale, and governance sign-off |
| Risk or derailment flags | Mandatory human review before any action |

### 9.12 AI Governance Rules

| Rule | Requirement |
|---|---|
| No construct invention | AI cannot create unsanctioned score labels or psychological claims |
| No silent inference expansion | AI cannot infer clinical, medical, or protected-class judgments from assessment data |
| No bypass of permissions | AI-generated reports must respect score visibility and use restrictions |
| Explanation traceability | Narratives must map back to actual score architecture and evidence |
| Human review for high stakes | AI-assisted outputs in consequential contexts require human oversight |

---

<a name="part-10"></a>
## PART 10: TOP 10 DIMENSIONS — ENTERPRISE CURATED VIEW

> **GOVERNANCE MANDATE — Governance Review v4, High Priority Fix, Task 21**

The Top 10 Dimensions view is the **default enterprise-facing display** for all non-specialist audiences.

| Rank | Display Name | Source Domain | Source Dimension | V1 Status |
|---|---|---|---|---|
| 1 | **Drive and Delivery** | D1 | Conscientious Execution | ✅ Active at V1 |
| 2 | **Thinking and Problem Solving** | D2 | Verbal Reasoning + Numerical Reasoning (composite) | ✅ Active at V1 |
| 3 | **Emotional Steadiness** | D1 | Emotional Steadiness | ✅ Active at V1 |
| 4 | **Working with Others** | D1 | Interpersonal Orientation | ✅ Active at V1 |
| 5 | **Communication and Influence** | D5 | Communication and Influence | 🔶 Phase 2 only — placeholder at V1 |
| 6 | **Self-Awareness and Regulation** | D4 | Self-Regulation | ✅ Active at V1 |
| 7 | **Openness to Change** | D1 | Exploratory Openness | ✅ Active at V1 |
| 8 | **Integrity and Reliability** | D1 | Integrity Orientation | ✅ Active at V1 |
| 9 | **Social Confidence** | D1 | Social Assertiveness | ✅ Active at V1 |
| 10 | **Learning Agility** | D4 | Self-Awareness (Learning Orientation facet) | ✅ Active at V1 |

> **Note:** Rank 5 (Communication and Influence) is a D5 synthesis dimension deferred to Phase 2. At V1, the Top 10 view displays 9 dimensions, with Rank 5 shown as "Coming in Phase 2."

**Domain Renaming for Enterprise Audiences:**

| Original Name | Enterprise Display Name |
|---|---|
| Domain 1: Personality Architecture | **Character and Work Style** |
| Domain 2: Cognitive Architecture | **Thinking and Problem Solving** |
| Domain 3: Motivation and Drivers | **Drivers and Motivation** |
| Domain 4: Emotional-Social Functioning | **Emotional Intelligence and Relationships** |
| Domain 5: Applied Workplace Dimensions | **Workplace Effectiveness** |
| Domain 6: Contextual Alignment and Decision Indices | **Fit and Readiness Indices** |

---

<a name="part-11"></a>
## PART 11: API OBJECT MODEL

### 11.1 Core Score Object

| Field | Description |
|---|---|
| object_id | Unique identifier |
| object_type | facet, dimension, domain, percentile, derived_index |
| construct_id | Linked construct or index name |
| score_value | Numeric estimate |
| standard_error | Precision estimate |
| confidence_band | high, moderate, low, unacceptable |
| validation_status | draft, pilot, validated, restricted |
| eligibility_state | eligible, restricted, ineligible |
| audience_visibility | visible, caution, downgraded, hidden, blocked |
| scoring_version | Semantic version string |
| synthesis_weight_version | Semantic version string (null for directly scored dimensions) |
| mv_flag | MV_CLEAN, MV_CAUTION, MV_HIGH, MV_UNRESOLVED |
| rq_level | RQ-0 through RQ-4 |
| module_order_condition | A, B, or C |

### 11.2 Report Object

| Field | Description |
|---|---|
| report_id | Unique identifier |
| use_case | developmental, hiring_support_validated_blueprint |
| audience_type | candidate, coach, manager, HR, executive, admin |
| assessment_status | valid, pass_with_limits, valid_but_uninterpretable, incomplete, invalid |
| visible_sections | Emitted report sections |
| suppressed_sections | Hidden or blocked sections with reason codes |
| score_cards | Renderable score objects |
| narrative_blocks | Text objects generated under policy |
| disclaimers | Mandatory limits and caution text (including standard assessment-to-workplace disclaimer) |
| audit_footer | Version, timestamp, permissions, blueprint state |

### 11.3 Blueprint Object

| Field | Description |
|---|---|
| blueprint_id | Unique identifier (immutable) |
| blueprint_version | Semantic version: MAJOR.MINOR.PATCH |
| blueprint_status | draft, under_review, validated, deprecated, archived |
| effective_date | ISO 8601 |
| deprecated_date | ISO 8601 (null if active) |
| change_summary | Human-readable summary of changes |
| change_type | major, minor, patch |
| approved_by | Name/ID of approving authority |
| approval_date | ISO 8601 |
| prior_version_id | blueprint_id + version of immediately preceding version |
| adverse_impact_analysis | Reference to completed adverse impact analysis report |

---

<a name="part-12"></a>
## PART 12: FAILOVER BEHAVIOR SPECIFICATION

> **GOVERNANCE MANDATE — Governance Review v4, High Priority Fix, Task 26**

> **Every upstream dependency failure must have a documented failover behaviour. Undocumented failure modes are prohibited. The system must never silently degrade.**

| Dependency | Failure Type | Failover Behaviour | User-Facing Message | Audit Action |
|---|---|---|---|---|
| Item bank | Unavailable at session start | Session creation blocked | "Assessment temporarily unavailable. Please try again in a few minutes." | `SESSION_BLOCKED_ITEM_BANK_UNAVAILABLE` |
| Item bank | Partial failure during assessment | Assessment paused; session preserved for resumption | "We've encountered a technical issue. Your progress has been saved." | `SESSION_PAUSED_ITEM_BANK_PARTIAL_FAILURE` |
| Scoring engine | Unavailable after completion | Scoring queued; session held in `SCORING_PENDING` state | "Your assessment is complete. Results are being processed." | `SCORING_QUEUED_ENGINE_UNAVAILABLE` |
| Scoring engine | Partial failure (some dimensions not scored) | Affected dimensions carry `SCORE_UNAVAILABLE`; report with omission chips | Standard omission chip displayed | `PARTIAL_SCORE_ENGINE_FAILURE` |
| Synthesis engine | Unavailable (D5 synthesis fails) | All D5 scores suppressed; D1/D2/D4 released normally | D5 section shows omission chip | `D5_SYNTHESIS_UNAVAILABLE` |
| Blueprint store | Unavailable (role-fit scoring fails) | Role-fit suppressed; measured dimension scores released normally | Role-fit section shows omission chip | `BLUEPRINT_STORE_UNAVAILABLE` |
| Reporting engine | Unavailable | Report generation queued | "Your report is being generated and will be available shortly." | `REPORT_GENERATION_QUEUED` |
| Reporting engine | Template rendering failure | Fallback to plain-text structured output | "Report formatting temporarily unavailable. A plain-text summary has been provided." | `REPORT_TEMPLATE_RENDER_FAILURE` |
| Audit logging service | Unavailable | **ALL scoring and reporting operations BLOCKED** | "System maintenance in progress. Please try again shortly." | Local failover log written to persistent queue for replay |
| Norm store | Unavailable (percentile lookup fails) | Percentile scores suppressed; T-scores and confidence bands released normally | Percentile omission chip displayed | `NORM_STORE_UNAVAILABLE` |
| Consent store | Unavailable (consent status cannot be verified) | All scoring and reporting BLOCKED | "We are unable to verify your consent status. Please contact support." | `CONSENT_STORE_UNAVAILABLE` |

**Failover Severity Levels:**

| Level | Definition | System Behaviour | SLA |
|---|---|---|---|
| SEV-1 (Critical) | Audit logging unavailable; consent store unavailable | All operations BLOCKED; immediate engineering alert | Restore within 1 hour |
| SEV-2 (High) | Scoring engine unavailable; item bank unavailable | Operations queued or blocked; engineering alert | Restore within 4 hours |
| SEV-3 (Medium) | Synthesis engine unavailable; blueprint store unavailable; norm store unavailable | Partial output released; affected outputs suppressed | Restore within 8 hours |
| SEV-4 (Low) | Reporting engine template failure; partial scoring failure | Fallback output provided; engineering ticket | Resolve within 24 hours |


---

<a name="part-13"></a>
## PART 13: NON-FUNCTIONAL REQUIREMENTS

| Area | Requirement |
|---|---|
| Traceability | Every score and report output must be version-traceable |
| Auditability | Access, scoring, reporting, and configuration changes must be logged |
| Security | Role-based access control and protected item exposure are required |
| Scalability | Architecture must support high-volume administration and reporting |
| Localization | Language adaptation and equivalence review required before release |
| Accessibility | Accommodations and accessible delivery must be structural |
| Configurability | Clients may configure workflows, but not bypass governed permissions |
| Observability | System must monitor score release patterns, fairness signals, and exception triggers |

---

<a name="part-14"></a>
## PART 14: RELEASE AND MATURITY MODEL

### 14.1 Current Maturity Position

| Maturity Layer | Current Position |
|---|---|
| Product architecture | Sufficiently defined for implementation planning |
| Construct model | Sufficiently defined for build and validation planning |
| Scoring model | Final working standard established |
| Reporting and governance | Sufficiently defined for deterministic implementation |
| Norming and scale linking | Still to be fully completed |
| Construct-family validation protocols | Still to be locked in detail |
| Blueprint-governance ownership | Still to be operationalized by named owners |
| Final scientific proof | Not yet complete |

### 14.2 V1 Pre-Launch Gate Checklist

| Gate | Requirement | Status |
|---|---|---|
| D1 GGUM calibration | N ≥ 500/item; N ≥ 2,500/dimension; CFI ≥ 0.95 | Required |
| D2 IRT calibration | N ≥ 300/item; N ≥ 1,500/dimension | Required |
| D4 GGUM calibration | N ≥ 500/item; N ≥ 2,500/dimension | Required |
| DV-01 discriminant validity test | Conscientious Execution vs. Achievement Drive | Required |
| DV-02 discriminant validity test | Emotional Steadiness vs. Self-Regulation | Required |
| Cluster 1 configural invariance | Anglo-Western cluster configural invariance testing | Required |
| Blueprint versioning engine | Automated invalidation engine operational | Required |
| Failover behavior | All SEV-1 and SEV-2 failover scenarios tested | Required |
| Consent framework | Granular per-use-case consent system operational | Required |
| Audit logging | Full audit trail operational | Required |
| Counterbalancing protocol | A/B randomization operational | Required |
| Score versioning | scoring_version and synthesis_weight_version tags on all outputs | Required |
| Method-variance flags | MV_UNRESOLVED flags applied to all multi-method constructs without calibration | Required |
| Values Alignment suppression | Suppression engine operational for all non-developmental use cases | Required |
| Derailment Risk Index block | Complete suppression confirmed at all system layers | Required |

### 14.3 Phase 2 Readiness Criteria

Before any excluded use case may be activated:

| Criterion | Requirement |
|---|---|
| Criterion validity evidence | Minimum one published or internally documented criterion validity study with N ≥ 200 for the specific use case and construct set |
| Adverse impact analysis | Pre-deployment adverse impact analysis completed and documented |
| Method-variance calibration | All constructs involved carry `MV_CLEAN` or `MV_CAUTION` status (not `MV_UNRESOLVED`) |
| Norm group establishment | Region-specific norm groups established for any percentile-based output |
| Chief Psychologist sign-off | Written approval |
| Ethics Committee review | Written approval for any use case involving selection, readiness, or risk outputs |
| Global Validation Council notification | Formal notification with evidence summary |

---

<a name="part-15"></a>
## PART 15: COMPANION DOCUMENTS

| Companion Document | Purpose |
|---|---|
| Technical Manual | Empirical scoring, reliability, and validity documentation |
| Construct Briefs | Formal definitions and exclusions for every dimension and facet |
| Item-Authoring Guide | Item-writing rules, method design, prohibited overlaps |
| Validation Protocol Library | Evidence requirements by construct family and use case |
| Norming and Scale-Linking Plan | Percentiles, reference groups, cross-form comparability |
| Blueprint Governance SOP | Role blueprint workflow, approvers, review cadence |
| Reporting UI Specification | Visual behavior and content hierarchy by audience |
| Enterprise Controls Specification | Permissions, audit, data retention, and access management |
| Global Validation Council Charter | Council structure, membership, review cadence |
| Nexus Construct Registry | Version-controlled definitions and validation milestones |

---

<a name="part-16"></a>
## PART 16: OUT OF SCOPE

| Out-of-Scope Item | Why Excluded |
|---|---|
| Latency framework | Explicitly excluded by user request |
| Full technical manual | Requires empirical calibration and validation results |
| Complete item bank specifications | Should exist in authoring and content ops documentation |
| Full norming study design | Separate methodological program |
| Full fairness monitoring dashboard design | Separate analytics specification |

---

<a name="part-17"></a>
## PART 17: REFERENCES

[1] APA Standards for Educational and Psychological Testing: https://www.apa.org/science/programs/testing/standards

[2] EEOC Employment Tests and Selection Procedures: https://www.eeoc.gov/laws/guidance/employment-tests-and-selection-procedures

[3] ITC Guidelines on Test Use: https://www.intestcom.org/page/15

[4] ACT WorkKeys Essential Skills Technical Manual: https://www.act.org/content/dam/act/unsecured/documents/pdfs/ACT-WorkKeys-Essential-Skills-Technical-Manual.pdf

---

<a name="appendix-a"></a>
## APPENDIX A: GOVERNANCE FIXES INCORPORATED (All 28 Tasks)

| Task | Fix | Document Section |
|---|---|---|
| Task 1 | Multimethod evidence requirements | Part 4: Item and Assessment Architecture |
| Task 2 | Score versioning rules | Part 5.7: Score Versioning |
| Task 3 | Retest policy | Part 6.1: Validity States |
| Task 4 | Validity state modifications (`VALID_BUT_UNINTERPRETABLE`) | Part 6.1: Validity States |
| Task 5 | Blueprint versioning | Part 7.6: Blueprint Versioning |
| Task 6 | Adverse impact analysis documentation | Part 7.7: Adverse Impact Analysis |
| Task 7 | Boundary-condition test suite | Part 12: Failover Behavior |
| Task 8 | `VALID_BUT_UNINTERPRETABLE` state + per-dimension RQ modifiers | Parts 6.1 and 6.2 |
| Task 9 | `scoring_version` and `synthesis_weight_version` tags | Part 5.7: Score Versioning |
| Task 10 | Provisional D5 synthesis weights | Part 2.6: Domain 5 |
| Task 11 | Method-variance correction for Bayesian synthesis | Part 5.9: Method-Variance Correction |
| Task 12 | V1 two-use-case scope restriction | Part 0.4: V1 Launch Scope |
| Task 13 | BRI framework replacing Derailment Risk Index | Part 9.4: BRI Framework |
| Task 14 | Values Alignment standalone prohibition | Part 9.5: Values Alignment |
| Task 15 | Percentile norm rules | Part 8.7: Percentile Norm Rules |
| Task 16 | Measurement invariance + rule precedence framework | Parts 8.6 and 9.9 |
| Task 17 | Discriminant validity requirements for D1/D3 construct pairs | Part 3.4: Required Separations |
| Task 18 | Domain 3 dimension reduction plan | Part 2.4: Domain 3 |
| Task 19 | Cognitive–noncognitive module counterbalancing protocol | Part 5.11: Counterbalancing |
| Task 20 | GGUM calibration minimum sample size requirements | Part 5.10: GGUM Calibration |
| Task 21 | Top 10 Dimensions curated view + domain renaming | Part 10: Top 10 Dimensions |
| Task 22 | Leadership Behavioral Tendency reframing + multi-model caveat | Part 2.6: Domain 5 |
| Task 23 | Judgment and Decision Quality domain-specificity caveat | Part 2.6: Domain 5 |
| Task 24 | Standard assessment-to-workplace performance disclaimer | Part 8.2: Disclaimer |
| Task 25 | Blueprint versioning and score invalidation | Part 7.6: Blueprint Versioning |
| Task 26 | Failover behavior specification | Part 12: Failover Behavior |
| Task 27 | Culture-specific validation flag for Domain 3 | Part 2.4: Domain 3 |
| Task 28 | `DEFERRED` state for sections awaiting additional data | Part 6.3: DEFERRED State |

---

<a name="appendix-b"></a>
## APPENDIX B: GLOSSARY OF KEY TERMS

This glossary defines all technical acronyms, governance codes, flags, and status values used throughout this document.

---

### B.1 Psychometric and Statistical Terms

| Term | Full Name | Definition |
|---|---|---|
| **θ (theta)** | Latent trait estimate | The estimated underlying trait level for a person on a given construct, expressed on a standardized scale (typically mean 0, SD 1). The primary output of IRT and GGUM scoring. |
| **SE** | Standard Error | The precision estimate for a theta score. Lower SE = higher precision. SE is the primary input to confidence band assignment. Formula: SE_k = sqrt(Var(θ_k given Y)). |
| **CI** | Confidence Interval | The range within which the true score is likely to fall. Computed as: CI_k = θ̂_k ± 1.96 × SE_k (95% CI). |
| **IRT** | Item Response Theory | A family of psychometric models that estimate a person's latent trait level from their item responses, accounting for item difficulty and discrimination. |
| **3PL IRT** | Three-Parameter Logistic IRT | The IRT model used for Nexus cognitive items. Parameters: a (discrimination), b (difficulty). Formula: P(X=1 given θ) = 1 / (1 + exp[-a(θ - b)]). |
| **GGUM** | Graded Generalized Unfolding Model | An ideal-point IRT model used for noncognitive items (personality, motivation, emotional-social). Assumes people endorse items closest to their own trait level, not items at the extreme. Appropriate for Likert-style attitude and personality items. |
| **CAT** | Computerized Adaptive Testing | A testing approach where item selection is adapted in real time based on the person's estimated trait level, maximizing precision with fewer items. |
| **CFA** | Confirmatory Factor Analysis | A structural equation modeling technique used to test whether a hypothesized factor structure fits observed data. Used for discriminant validity testing and measurement invariance. |
| **CFI** | Comparative Fit Index | A model fit index for CFA. Values ≥ 0.95 indicate acceptable fit; ≥ 0.97 is preferred. |
| **RMSEA** | Root Mean Square Error of Approximation | A model fit index for CFA. Values ≤ 0.06 indicate acceptable fit; ≤ 0.04 is preferred. |
| **SRMR** | Standardized Root Mean Square Residual | A model fit index for CFA. Values ≤ 0.08 indicate acceptable fit; ≤ 0.05 is preferred. |
| **DIF** | Differential Item Functioning | A statistical test for item-level bias. An item shows DIF if people from different groups with the same trait level have systematically different response probabilities. Items with DIF Δ > 0.10 are flagged for review or removal. |
| **HTMT** | Heterotrait-Monotrait Ratio | A supplementary discriminant validity indicator. Values < 0.85 are required to confirm construct distinctiveness. |
| **AVE** | Average Variance Extracted | A convergent validity indicator. For discriminant validity (Fornell-Larcker criterion): AVE_A > r² AND AVE_B > r² must both hold. |
| **Q3** | Q3 Residual Correlation | A local independence diagnostic for IRT models. All Q3 values should be < 0.20 (preferred < 0.15). High Q3 indicates item pairs that share variance beyond the measured trait. |
| **SJT** | Situational Judgment Test | An item format presenting realistic work scenarios with response options. Used to measure judgment, integrity, leadership, and collaboration with reduced social desirability effects. |
| **CTT** | Classical Test Theory | The traditional psychometric framework based on observed scores, reliability coefficients, and item-total correlations. Used alongside IRT for item analysis. |
| **BQ** | Blueprint Quality Score | A composite score (0–1) assessing the quality of a role blueprint. Formula: BQ = 0.30E + 0.25C + 0.20S + 0.15W + 0.10R. Minimum BQ ≥ 0.70 required for any role-fit output. |

---

### B.2 Scoring and Versioning Codes

| Term | Definition |
|---|---|
| **scoring_version** | A semantic version tag (e.g., `1.0.0-provisional`) attached to every scored output. Identifies the complete scoring engine version used to generate the score. Required on all outputs. Scores from different major versions may not be directly compared. |
| **synthesis_weight_version** | A semantic version tag attached to every synthesized or aggregated output. Identifies the weight set used for synthesis. Null for directly scored dimensions. Required on all derived outputs. |
| **Semantic Versioning** | Version numbering in MAJOR.MINOR.PATCH format. MAJOR = breaking change; MINOR = new feature; PATCH = bug fix or minor correction. |

---

### B.3 Method-Variance (MV) Flags

| Flag | Condition | Reporting Consequence |
|---|---|---|
| `MV_CLEAN` | ω_method ≤ 0.15 AND MBI ≤ 0.30 for all contributing methods | Full synthesis score released |
| `MV_CAUTION` | ω_method 0.15–0.25 OR MBI 0.30–0.50 for any method | Synthesis score released with caution; confidence band widened by one tier |
| `MV_HIGH` | ω_method > 0.25 OR MBI > 0.50 for any method | Synthesis score suppressed; single best-method score released; omission code triggered |
| `MV_UNRESOLVED` | Method-variance calibration not yet completed | Cross-method synthesis BLOCKED; single-method score only |

---

### B.4 Response Quality (RQ) Levels

| Level | Name | Definition | Reporting Action |
|---|---|---|---|
| **RQ-0** | Clean | No quality concerns | Full dimension score and narrative released |
| **RQ-1** | Minor | Minor inconsistency; within acceptable tolerance | Score released; internal flag logged |
| **RQ-2** | Moderate | Moderate quality concern (elevated impression management, low person-fit, response-time anomaly) | Score downgraded to band-only display; caution chip shown; narrative suppressed |
| **RQ-3** | Severe | Severe quality concern (extreme inconsistency, straightlining, cross-method divergence) | Dimension score hidden; omission code triggered |
| **RQ-4** | Disqualifying | Quality failure renders dimension unmeasurable | Dimension marked `NOT_GENERATED`; contributes to VALID_BUT_UNINTERPRETABLE if ≥ 2 dimensions affected |

---

### B.5 Calibration Status Flags

| Flag | Condition | Operational Consequence |
|---|---|---|
| `CALIBRATION_COMPLETE` | N meets minimum; model-data fit meets all standards | Available for operational scoring |
| `CALIBRATION_PROVISIONAL` | N meets minimum; fit meets minimum but not preferred standards | Developmental use only; not for selection |
| `CALIBRATION_INSUFFICIENT` | N below minimum for any item | BLOCKED from all operational use |
| `CALIBRATION_FIT_FAIL` | Model-data fit below minimum standard | BLOCKED; item revision required |
| `CALIBRATION_EXPIRED` | Calibration data > 3 years old | Flagged for re-calibration; continues with caution flag |

---

### B.6 Measurement Invariance Flags

| Flag | Condition | Deployment Consequence |
|---|---|---|
| `INV_FULL` | Full scalar invariance confirmed across cultural cluster | Cross-cultural comparison and global norms permitted |
| `INV_PARTIAL` | Partial scalar invariance; non-invariant items identified and corrections applied | Cross-cultural comparison permitted with documented limitations; global norms blocked |
| `INV_METRIC` | Metric invariance confirmed; scalar invariance not confirmed | Latent mean comparisons blocked |
| `INV_CONFIGURAL` | Configural invariance only; factor loadings not equal across groups | Cross-cultural comparison BLOCKED |
| `INV_UNTESTED` | Measurement invariance testing not yet completed | Cross-cultural deployment BLOCKED |

---

### B.7 Output States

| State | Definition | User-Facing Behavior |
|---|---|---|
| `VISIBLE` | All required gates passed; output may be shown | Show normally |
| `VISIBLE_WITH_CAUTION` | Output allowed but with moderated interpretation | Show with caution chip and bounded language |
| `DOWNGRADED` | Output shown in limited or exploratory form only | Reduced emphasis; excluded from summaries |
| `HIDDEN` | Output not allowed for this audience or use case | Do not render |
| `BLOCKED` | Output explicitly suppressed because prerequisites failed | Omit section; provide policy-based explanation |
| `NOT_GENERATED` | Report object never assembled because assessment-level conditions failed | No section or score object emitted |

---

### B.8 Blueprint Statuses

| Status | Meaning | Role-Fit Permission |
|---|---|---|
| `draft` | Blueprint is incomplete or title-led; evidence not yet gathered | No user-facing role fit |
| `under_review` | Blueprint evidence gathered; awaiting governance sign-off | Internal design use only |
| `reviewed` | Evidence gathered and reviewed; awaiting final approval | Internal design use only |
| `approved` | Evidence adequate and governance sign-off obtained | Development and exploratory role fit |
| `validated` | Approved + criterion linkage established through outcome data | Operational role fit for hiring support use case |
| `deprecated` | Blueprint superseded by a newer version | No new scoring; existing scores carry BLUEPRINT_INVALIDATED flag if major change |
| `archived` | Blueprint retired; no longer in active use | No scoring |

---

### B.9 Assessment Validity States

| State | Trigger | Reporting Consequence |
|---|---|---|
| `VALID` | All quality checks pass; confidence bands HIGH or MODERATE across all dimensions | Full interpretive report released |
| `PASS_WITH_LIMITS` | Minor quality concerns; one or more dimensions at LOW confidence; no severe flags | Partial report with caution codes; affected dimensions downgraded or hidden |
| `VALID_BUT_UNINTERPRETABLE` | Session complete but severe/pervasive response-quality flags prevent reliable interpretation | No interpretive report released; session retained for audit |
| `INCOMPLETE` | completion_ratio < 0.85 | No report generated; re-assessment offered |
| `INVALID` | Structural integrity failure, identity concern, or disqualifying quality flag | Session voided; escalation triggered |
| `DEFERRED` | Report section cannot be generated now but may become available when specified conditions are met | Section shows "not yet available" chip with reason code |

---

### B.10 DEFERRED Trigger Codes

| Code | Condition | Resolution Path |
|---|---|---|
| `DEFERRED_BLUEPRINT_PENDING` | Blueprint in `draft` or `under_review` status | Blueprint achieves `validated` status |
| `DEFERRED_NORM_PENDING` | Norm group being established but not yet approved | Norm group approved |
| `DEFERRED_MULTIMETHOD_PENDING` | Multimethod evidence not yet collected | Multimethod module completed |
| `DEFERRED_CONSENT_PENDING` | Candidate has not provided consent for this output type | Consent provided |
| `DEFERRED_CALIBRATION_PENDING` | Dimension calibration in progress (`CALIBRATION_PROVISIONAL`) | Calibration achieves `CALIBRATION_COMPLETE` |
| `DEFERRED_BLUEPRINT_INVALIDATED` | Role-fit score invalidated by blueprint version update | Re-scoring completed against new blueprint version |
| `DEFERRED_PHASE_2` | Section requires Phase 2 feature not yet activated | Phase 2 activation |

---

### B.11 Omission Codes

| Code | Trigger | Candidate-Facing Text |
|---|---|---|
| **OM-01** | Low confidence (SE threshold failed) | "This result is not shown because the available evidence was not precise enough for reliable interpretation." |
| **OM-02** | Restricted use (permission rule failed) | "This section is not included in this report format." |
| **OM-03** | Blueprint immaturity (blueprint state below minimum) | "A fit estimate is not shown because the target profile has not yet met activation requirements." |
| **OM-04** | Assessment incomplete (completion threshold failed) | "The assessment was not completed sufficiently to support a full interpretation." |
| **OM-05** | Response-quality concern (RQ severity threshold triggered) | "Some interpretive sections are not shown because response quality conditions did not support reliable reporting." |
| **OM-06** | Validation limit (use-validation rule failed) | "This result is still being evaluated for this use and is not included here." |

---

### B.12 Rule Precedence Levels (P1–P7)

| Level | Name | Description |
|---|---|---|
| **P1** | Absolute Block | Legal or ethical prohibition. Output suppressed unconditionally. No lower-priority rule can release it. |
| **P2** | Validity Gate | Assessment is INVALID, INCOMPLETE, or VALID_BUT_UNINTERPRETABLE. All scored outputs suppressed. |
| **P3** | Use Case Gate | Output type not permitted for the assigned use_case. Output suppressed for this session. |
| **P4** | Response Quality | Assessment-level RQ failure. All outputs suppressed. |
| **P5** | Construct Restriction | Construct carries RESTRICTED, BLOCKED, MV_UNRESOLVED, or INV_UNTESTED flag. Construct output suppressed. |
| **P6** | Confidence Gate | Confidence band below threshold for use case. Output downgraded or hidden per CF rules. |
| **P7** | Audience Gate | Output not permitted for this audience role. Output hidden or blocked. |

---

### B.13 Discriminant Validity Pairs (DV)

| Pair ID | Construct A | Construct B | Pre-Launch Requirement |
|---|---|---|---|
| **DV-01** | Conscientious Execution | Achievement Drive | YES — V1 pre-launch |
| **DV-02** | Emotional Steadiness | Self-Regulation | YES — V1 pre-launch |
| **DV-03** | Social Assertiveness | Leadership Expression | Phase 2 |
| **DV-04** | Integrity Orientation | Ethical Choice (D6 facet) | Phase 2 |
| **DV-05** | Security Drive | Autonomy Drive | Phase 2 |
| **DV-06** | Learning Drive | Purpose Drive | Phase 2 |

Discriminant validity threshold: latent correlation r < 0.70 (from CFA). Pairs at r ≥ 0.70 require resolution before both constructs may be used operationally.

---

### B.14 Behavioral Risk Indicator Codes (BRI)

| Code | Behavioral Indicator | Status |
|---|---|---|
| **BRI-01** | Interpersonal friction under pressure | Not yet validated |
| **BRI-02** | Reliability risk in high-accountability roles | Not yet validated |
| **BRI-03** | Integrity concern in trust-critical roles | Not yet validated |
| **BRI-04** | Emotional dysregulation under high stress | Not yet validated |
| **BRI-05** | Resistance to feedback and development | Not yet validated |

All BRIs are provisional. None may be activated without criterion validity study (N ≥ 300), independent ethics review, Chief Psychologist sign-off, adverse impact analysis, and governance configuration confirmation.

---

### B.15 Confidence Band Codes

| Code | SE Range | Reporting Consequence |
|---|---|---|
| `HIGH` | SE ≤ 0.25 | May be shown for all approved report types |
| `MODERATE` | 0.25 < SE ≤ 0.35 | May be shown for development use; consequential use requires additional controls |
| `LOW` | 0.35 < SE ≤ 0.45 | May be shown only as exploratory, visually downgraded |
| `UNACCEPTABLE` | SE > 0.45 | Hidden from all user-facing reports |

---

### B.16 Additional Key Terms

| Term | Definition |
|---|---|
| **Facet** | A narrow, specific component of a dimension. Facets are the most granular measured units in Nexus. Multiple facets aggregate to form a dimension score. |
| **Dimension** | The primary measured construct unit in Nexus. Dimensions are the main reportable output. They aggregate from facets (where validated) and feed into domain summaries and derived indices. |
| **Domain** | A grouping of related dimensions. Domain scores are optional summaries — they exist only when they add interpretive value and all constituent dimensions meet confidence thresholds. |
| **Role Blueprint** | A governed document specifying which dimensions are relevant for a given role, their relative importance, and the evidence supporting those choices. Required for any role-fit scoring. |
| **Synthesis Relation** | A validated relationship between lower-layer dimensions (D1, D2, D4) and a Domain 5 applied behavior construct. Synthesis relations are validation hypotheses, not scoring shortcuts. |
| **Derived Index** | A Domain 6 output computed from validated dimension scores and contextual models (e.g., role blueprints). Derived indices are never direct trait measurements. |
| **Omnibus Score** | A single composite score collapsing all dimensions into one number. **Prohibited in Nexus.** No omnibus total-person score may be generated or reported. |
| **Impression Management (IM)** | A response-quality signal indicating the degree to which a person may be presenting themselves in an overly favorable light. Elevated IM triggers RQ-2; severe IM triggers RQ-3. |
| **Person-Fit** | A psychometric statistic measuring how well a person's response pattern fits the expected pattern given their estimated trait level. High person-fit z-scores indicate unusual or inconsistent responding. |
| **Adverse Impact** | A substantially different selection rate for a protected group compared to the highest-selected group. The 4/5ths rule (80% rule) is the primary operational threshold. |
| **Criterion Validity** | Evidence that assessment scores predict a relevant outcome criterion (e.g., job performance ratings, promotion, retention). Required before any use case beyond developmental feedback is activated. |
| **Measurement Invariance** | The property that a construct is measured in the same way across different groups (e.g., cultural clusters, demographic groups). Required before cross-group score comparisons are made. |
| **Norm Group** | A reference population used to convert theta scores into percentile ranks. Norm groups must be validated for the specific audience and use case before percentile reporting is permitted. |
| **SME** | Subject Matter Expert. A person with direct knowledge of a role's demands, used to validate role blueprints and item content. |
| **ATS** | Applicant Tracking System. A third-party HR technology platform. Any ATS integration requires explicit named-party consent from candidates. |
| **360 Feedback** | Multi-rater feedback from peers, direct reports, and managers. Used as a secondary method source for constructs like Leadership Expression. Requires method-variance calibration before synthesis. |
| **Ipsative** | A measurement approach where scores are relative to each other within a person (forced-choice), rather than absolute. Relevant to Domain 3 motivation measurement design. |
| **Configural Invariance** | The weakest form of measurement invariance: the same factor structure holds across groups, but loadings and intercepts may differ. |
| **Metric Invariance** | Factor loadings are equal across groups, but intercepts may differ. Latent mean comparisons are blocked at this level. |
| **Scalar Invariance** | Both factor loadings and item intercepts are equal across groups. Full cross-group score comparisons and global norms are permitted only at this level. |
| **Thurstonian IRT** | An IRT model for forced-choice item formats. Used for Domain 1, 3, and 4 forced-choice items. Minimum calibration: N ≥ 500 per item. |

---

*End of Nexus Assessment Platform — Implementation-Ready Master PRD v2.0.0*

*All 28 governance fixes from Nexus Full Governance Review v4 incorporated as binding mandates.*

*This document supersedes all prior individual Nexus specification documents.*

*Document prepared by: Nexus Product and Science Team*
*Classification: Internal — Controlled Distribution*
*Version: 2.0.0 | Date: April 3, 2026*
