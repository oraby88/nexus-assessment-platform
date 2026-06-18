# NEXUS Frontend Constitution Draft

Use this content as the input for `/speckit.constitution`.

## Principle I — Frontend First
The first implementation phase is a complete React + TypeScript frontend prototype only. FastAPI and Supabase are future phases.

## Principle II — Design Fidelity
The Claude Design output is the visual source of truth. Missing states must be added in the same design language.

## Principle III — Two Roles Only
V1 has Admin and User only. One Admin account per organization in V1.

## Principle IV — Service Boundaries
Components consume typed mock services only. No fixture imports inside pages. Future API replacement must not require UI rewrite.

## Principle V — Governed Question Source
The AI Agent selects only from the workbook `item_bank` source. No new question generation.

## Principle VI — Immutable Metadata
Question IDs, constructs, method family, response scale, keyed answer, reverse flag, governance, and validation fields are read-only.

## Principle VII — Controlled Adaptation
Rephrasing changes display wording only and follows method-family safeguards. Scoring attribution remains linked to source Question ID.

## Principle VIII — Question-Level Attribution
Every response is stored against immutable source Question ID. Frontend never performs production scoring or displays live User scoring.

## Principle IX — Safe Reporting
Admin and User reports are separate projections. User report never exposes restricted internals.

## Principle X — Human Decision Support
Candidate Comparison is side-by-side evidence review only. No leaderboard, auto ranking, shortlist, reject, or hire.

## Principle XI — Domain 6 Transparency
Domain 6 is visible in Admin V1, but confidence, provisional, downgraded, and omitted states must be explicit.

## Principle XII — Accessibility and Motion
All flows are keyboard usable, mobile safe, contrast compliant, and reduced-motion aware. Animation must explain state, not decorate.

## Principle XIII — Responsive Runtime
The User runtime is mobile-first and must support all five question types, pause, resume, save, and reload recovery.

## Principle XIV — Traceability
Specs, route map, status map, handoff map, risk register, open questions, and testing notes stay current.

## Principle XV — Review Before Implementation
After specify, clarify, plan, tasks, and analyze, stop for explicit human approval before `/speckit.implement`.
