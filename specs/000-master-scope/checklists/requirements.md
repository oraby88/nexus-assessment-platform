# Requirements Quality Checklist: Nexus Assessment Platform — Master Scope

**Purpose**: Validate the **quality** of the master-scope requirements (completeness, clarity, consistency, measurability, coverage) before implementation — these test the spec, not the implementation.
**Created**: 2026-06-15
**Feature**: [spec.md](../spec.md)
**Depth**: Thorough · **Audience**: Reviewer (Gate 1 — Business Spec Review) · **Focus**: roles & data boundaries · governed-AI & question-bank immutability · reporting safety & Domain 6 · scope/status models · cross-cutting NFR.

## Requirement Completeness

- [x] CHK001 Are required fields enumerated for every first-class entity (Participant, Role Blueprint, Context Profile, Assessment, Report, Consent)? [Completeness, Spec §10/§11/§12]
- [x] CHK002 Is every one of the 13 Admin and 7 User navigation destinations backed by a stated capability requirement? [Completeness, Spec §3/§4/§14/§15]
- [x] CHK003 Are inputs and outputs defined for each of the 12 Create-Assessment steps? [Completeness, Spec §5]
- [x] CHK004 Does the spec define the full set of notification event types and their in-platform vs simulated-email behavior? [Gap, Spec §3]
- [x] CHK005 Are the seven export types and their formats (real CSV vs simulated PDF) specified? [Completeness, Spec §3/§16]
- [x] CHK006 Are empty/loading/error state requirements stated at scope level or explicitly delegated to area specs? [Coverage, Spec §17]

## Requirement Clarity

- [x] CHK007 Is the "governed source bank" precisely identified (worksheet name) so eligibility is unambiguous? [Clarity, Spec §6]
- [x] CHK008 Are the method-family rephrasing rules quantified per family (controlled vs light vs verbatim) without overlap ambiguity? [Clarity, Spec §8]
- [x] CHK009 Is the "safe, high-level Domain 6 summary" for the user report bounded by what may and may not appear? [Clarity, Spec §12 + Clarifications]
- [x] CHK010 Is "selected high-value events" for the Activity Log defined by an explicit event set rather than a vague adjective? [Clarity, Spec §14 + Clarifications]
- [x] CHK011 Are the "validated blueprint" preconditions for operational Hiring-Support role-fit explicitly stated? [Clarity, Spec §11]
- [x] CHK012 Is the "one tailored assessment for one User" boundary explicit versus batch assignment? [Clarity, Spec §5]

## Requirement Consistency

- [x] CHK013 Do the role/data-scope rules (§2) align with the Admin/User capability lists (§3/§4) without contradiction? [Consistency, Spec §2/§3/§4]
- [x] CHK014 Is the permanent-User-account decision consistent across the Clarifications, §4, and frontend-only scope? [Consistency, Spec §4 + Clarifications]
- [x] CHK015 Are Domain 6 visibility rules consistent between §9 (visible in V1), §12 (Admin report), and the user-safe clarification? [Consistency, Spec §9/§12]
- [x] CHK016 Do the immutable-metadata fields (§6/§7) match the workbook columns the bank is built from? [Consistency, Spec §6/§7 + 000-shared/workbook-audit]
- [x] CHK017 Is terminology consistent (Participant vs Candidate vs User) with a single canonical definition? [Consistency, 000-shared/status-models glossary]

## Acceptance Criteria & Measurability

- [ ] CHK018 Does the master scope reference measurable success criteria (or delegate to a spec that defines them)? [Measurability, Spec §17]
- [x] CHK019 Can "no automatic hiring decision" be objectively verified via the stated prohibitions (no ranking/shortlist/reject/hire)? [Measurability, Spec §13]
- [x] CHK020 Are the governance invariants (no fabricated questions, no blocked items operational, metadata immutable) phrased as testable MUSTs? [Measurability, Spec §6]
- [x] CHK021 Is the "user-safe report" defined as an explicit exclusion list that enables objective verification? [Measurability, Spec §12]

## Scenario & Edge Case Coverage

- [x] CHK022 Are requirements defined for when no eligible questions exist for a required dimension? [Edge Case, Gap]
- [x] CHK023 Are assessment validity states defined as distinct from lifecycle states (e.g., Valid-but-Uninterpretable)? [Coverage, 000-shared/status-models]
- [x] CHK024 Are consent decline and revocation flows specified (mandatory current-use-case vs optional consents)? [Coverage, Spec §4 + Clarifications]
- [x] CHK025 Are blocked/omitted/partial report outputs defined with a user-facing explanation requirement? [Coverage, Spec §9/§12]
- [x] CHK026 Are pause/resume and reload-recovery requirements stated for the runtime? [Coverage, Spec §4]
- [x] CHK027 Are reduced-motion and mobile-runtime requirements captured at scope level? [Coverage, Spec §16]

## Governance & Safety (domain completeness)

- [x] CHK028 Are the AI Agent's MUST-NOT actions enumerated exhaustively (ID, domain, dimension, facet, method, scale, keyed answer, reverse flag, governance, validation)? [Completeness, Spec §6]
- [x] CHK029 Is the boundary between display-only rephrasing and scoring metadata clearly drawn? [Clarity, Spec §6/§8]
- [x] CHK030 Are Domain 3 / D5 "restricted" usage rules specified to prevent unsupported outputs? [Completeness, Spec §9]
- [x] CHK031 Is Derailment Risk explicitly declared blocked (never shown as report data)? [Completeness, Spec §9]
- [x] CHK032 Are Admin-only vs User data boundaries specified precisely enough to prevent leakage? [Coverage, Spec §2/§12]

## Non-Functional Requirements

- [x] CHK033 Are accessibility expectations (keyboard, contrast, labels) stated or delegated with a clear owner? [Gap, Spec §16]
- [x] CHK034 Are responsiveness expectations (admin desktop-first; runtime mobile-first) specified? [Completeness, Spec §16]
- [ ] CHK035 Are localization/language requirements addressed or explicitly declared out of scope? [Gap]
- [x] CHK036 Are data-privacy/retention expectations stated for the prototype versus deferred to backend? [Clarity, Spec §16]

## Dependencies & Assumptions

- [x] CHK037 Is the dependency on the governed workbook (source of items + metadata) documented? [Dependency, Spec §6 + 000-shared/workbook-audit]
- [x] CHK038 Is the assumption that scoring/AI/PDF/email are simulated in V1 explicitly recorded? [Assumption, Spec §16]
- [ ] CHK039 Are absent source fields (weight/difficulty) explicitly excluded to prevent fabrication? [Assumption, Spec §7 + Clarifications]

## Ambiguities & Conflicts

- [x] CHK040 Is a documented authoritative-order resolution stated for when master scope conflicts with companion docs? [Conflict, Spec §16 / README]
- [ ] CHK041 Do two specs (000-master-scope vs 009 umbrella) carry overlapping requirements without a stated authority relationship (drift risk)? [Conflict, Gap]
- [ ] CHK042 Is a requirement / acceptance-criteria ID scheme established for traceability across specs? [Traceability, Gap]

## Notes

- Check items off as completed: `[x]`. Each item tests whether the requirement is **well-written**, not whether the feature works.
- Traceability: ≥80% of items cite a spec section or a `[Gap]`/`[Conflict]`/`[Assumption]`/`[Dependency]`/`[Traceability]` marker.
- Likely findings to expect: CHK018 (master scope defers measurable SC to `009`), CHK041 (002-master-scope vs 009 overlap — see analyze finding D1/I1), CHK042 (no FR/SC ID scheme in master `spec.md`).


---

## Review — 2026-06-15 (evaluated against spec.md + 000-shared/* + constitution + area specs 001–008/009)

**Result: 37 / 42 PASS · 5 gaps · 0 blocking errors.** The spec is strong on governance, roles/data boundaries, reporting safety, Domain 6, and the AI-agent invariants (all PASS). The 5 unchecked items are documentation gaps at the master-scope level — each is already satisfied downstream (009/area specs/shared), so none block implementation; fixing them removes drift risk.

| ID | Verdict | Finding | Suggested fix |
|----|---------|---------|---------------|
| CHK018 | GAP | Master `spec.md` states no measurable success criteria and does not reference `009`'s SC-001..009. | Add a one-line pointer in §17 to `009-frontend-prototype` success criteria. |
| CHK035 | GAP | Localization/i18n is neither specified nor declared out of scope (only a User "language preference" exists in 006). | Add an explicit "localization out of scope for V1" line to §16. |
| CHK039 | GAP | The "do not fabricate weight/difficulty" rule lives in 000-shared/workbook-audit + 009, not in master `spec.md` (§7 or Clarifications). | Add the exclusion to §7 (it is a confirmed decision). |
| CHK041 | GAP (= analyze D1/I1) | `000-master-scope` and `009-frontend-prototype` overlap; `009` is absent from `specs/README.md` package map and no authority relationship is stated. | State "000-master-scope = authoritative scope; 009 = umbrella user-story/SC spec" and add 009 to README. |
| CHK042 | GAP | Master `spec.md` capabilities have no FR/AC ID scheme (area specs use FR-FND/ADM/CA/… and SC-### in 009). | Note the FR-prefix scheme in §17 or add IDs to master capabilities. |

**Notes on PASS-by-delegation** (counted as PASS because §17 explicitly delegates detail to area specs): CHK003 (per-step I/O → 003), CHK004 (notification types → 002), CHK005 (export types → 002), CHK006 (empty/loading/error states → area specs/008), CHK022 (no-eligible-questions edge case → 003/009), CHK027 (reduced-motion/mobile → constitution XII/XIII + 006/007), CHK033/CHK034 (a11y/responsive specifics → constitution + 008). Master-level wording is generic for these.
