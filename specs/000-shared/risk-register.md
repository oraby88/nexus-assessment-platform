# Risk Register — Complete Frontend-First V1 Planning

| ID | Risk | Impact | Mitigation | Validation |
|---|---|---|---|---|
| R1 | Design misses empty/loading/error/mobile states | Rework and inconsistent UX | Build state checklist for every route | QA route matrix |
| R2 | Scope is large | Partial delivery | Phase specs, checkpoints, P1 journey first | Phase review |
| R3 | Premature global-state complexity | Slow implementation | Local state + Context + service layer unless justified | Plan review |
| R4 | Workbook metadata is fabricated | Governance breach | Mirror actual 31 source columns; omit source weight/difficulty | Workbook provenance test |
| R5 | Agent uses a question outside `item_bank` | Governance breach | Select only through `questionBankService` | Blocked-selection test |
| R6 | Agent selects blocked, quarantine, pilot, or research item operationally | Invalid operational set | Eligibility gate | Eligibility unit tests |
| R7 | Rephrasing changes meaning | Invalid assessment | Original vs adapted diff, approval, method-family rules | Adaptation review test |
| R8 | Rephrasing cognitive or SJT content invalidates keyed answer | Invalid scoring | Cognitive verbatim default; SJT approved equivalence only | Method-family adaptation tests |
| R9 | Metadata changes during adaptation | Invalid scoring traceability | `adaptationService` accepts `{itemId, adaptedText}` only | Type + unit test |
| R10 | Question-level scoring link is lost | Results cannot be reconstructed | Store response by immutable source Question ID | Runtime attribution test |
| R11 | UI calculates fake production scores | Misleading prototype | Mock report fixtures only; future scoring handoff documented | Code review |
| R12 | Admin-only information leaks into User portal | Privacy breach | Separate shells, separate report projection, tests | User-safe projection test |
| R13 | Domain 6 appears fully validated when prerequisites are restricted | Misleading report | Provisional/downgrade/omit states, explanations | Domain 6 fixture review |
| R14 | Candidate Comparison looks like ranking | Ethical/product violation | No order-by-fit, rank, leaderboard, shortlist, reject | Text/action audit |
| R15 | Signature flow supports multi-user tailoring incorrectly | Confusing workflow | Single-user Create Assessment; bulk upload separate | Journey test |
| R16 | Lifecycle and validity statuses are conflated | Incorrect UI states | Separate models | Status mapping test |
| R17 | Public landing page bypasses login | Security/user-flow defect | CTAs route to `/login` or `/invitation`; guards | Route test |
| R18 | Full 543 bank blocks initial load | Performance issue | Build-time convert + lazy import | Bundle check |
| R19 | Animation blocks input or causes discomfort | Accessibility issue | Reduced motion, short transforms, skip option | Reduced-motion QA |
| R20 | Mobile runtime is difficult to use | Completion drop-off | Mobile-first runtime, 44px touch targets | Mobile E2E |
| R21 | Consent screen asks irrelevant mandatory opt-ins | User confusion | Required current-use-case consent; optional separate opt-ins only if applicable | Consent UX test |
| R22 | Revoked consent not reflected across surfaces | Privacy inconsistency | Shared consent service; invalidate relevant access | Revoke E2E |
| R23 | Missing activity/audit representation | Poor traceability | Add org-scoped Activity Log prototype | Activity route test |
| R24 | Export support is partial | Missing confirmed function | Include all seven exports | Export test |
| R25 | Future backend integration causes rewrite | Costly rework | Promise-based services and handoff map | Boundary review |
| R26 | Mock fixtures imported directly into components | Tight coupling | Components use services only | Static import review |
| R27 | Blueprint status semantics are unclear | Incorrect Hiring Support gate | Canonical lifecycle + Validated operational gate | Status review |
| R28 | Question source worksheet naming causes confusion | Wrong import script | Document workbook sheet `item_bank`; UI may call it Questions Sheet | Build import test |
| R29 | One Admin account V1 rule is accidentally replaced by multi-Admin UI | Scope creep | Single account page, future-ready note only | Settings review |
| R30 | Missing global Admin history | Operational gap | Add `/admin/history` | Route and journey QA |
