# Contract — Create Assessment Wizard (12 Steps)

Full-bleed guarded route `/admin/assessments/new` (Spec 001 `FullBleedShell`, admin guard). Single user per flow. Each step gates "Next" until its minimum inputs exist; a progress indicator shows position; the draft persists/resumes (D6). All states loading/empty/error/responsive/accessible.

## Steps

| # | Step | Minimum to advance | Governance / notes |
|---|---|---|---|
| 1 | Select User | one user selected (existing or added inline) | single-user only; inline add reuses `participantService.add` (dup-email guard) |
| 2 | Define Purpose | use case + target role + job level | use case parameterizes the script (D1); Hiring Support flags Validated-blueprint need |
| 3 | AI Discovery Chat | scripted sequence answered | deterministic; live requirements panel updates per answer; edit prior answer; "Why?" explainer; skippable transition |
| 4 | Requirements Summary | summary reviewed/approved | structured `JobRequirementsProfile`; edit / return-to-chat / refine / approve |
| 5 | Role Blueprint | select or create-entry | create routes to Spec 004; fixtures until 004 |
| 6 | Context Profile | select or create-entry | create routes to Spec 004 |
| 7 | Question Selection | ≥1 eligible question selected | Agent auto-proposes eligible set (D3); add/remove/replace from eligible pool; provenance cards |
| 8 | Rephrasing | per-question approve/keep | `{itemId, adaptedText}` only + word diff; method safeguards; SJT/cognitive verbatim (D2); User-view preview |
| 9 | Coverage Review | reviewed | live domain/dimension/requirement/method map; warnings (D4) |
| 10 | Admin Approval | explicit approval action | sets `draft.approved = true`; Send stays disabled until set |
| 11 | Deadline & Reminders | deadline set | reminder schedule; channels; invitation message |
| 12 | Review & Send | approved | Send creates assignment + invitation + timeline + notification + sim email |
| ✓ | Success State | — | open Assessment Detail / back to Assessments / create another |

## Question card (Step 7/8) — required display (FR-CA-010)
Source Question ID · original wording · domain · dimension · facet · method family · response scale · job-level overlay · bank state · use status · review status · requirement covered · selection reason · `Selected From Governed Bank` · `Scoring Logic Locked`. **Never** `weight`/`difficulty`.

## Rephrase panel (Step 8) — display (FR-CA-011/012)
Original wording · adapted wording · word-level diff · adaptation reason · method-family policy message · locked source metadata. Actions: approve · request rephrase · keep original · replace with another eligible item · remove · add another eligible item · preview User view. For `sjt`/`cognitive_multiple_choice`: rephrase disabled with "Original wording retained" (D2).

## Coverage (Step 9) — behavior (FR-CA-013, D4)
Recompute on every selection change. Warning when a required/critical dimension has 0 selected items; soft note when exactly 1. Show totals, estimated duration, domain/dimension/requirement coverage, method distribution.

## Gating & governance invariants
- Send disabled until `draft.approved` (FR-CA-014, SC-006).
- Only `selectEligible` items enter the set; pilot/research/blocked/quarantine excluded (FR-CA-009, SC-002).
- Source metadata immutable; no fabricated fields (FR-CA-010, SC-003).
- Each selected question keeps source `item_id`; no client scoring / no live User score (FR-CA-017, SC-009).

## States
Loading (chat typing, selection spinner, step transitions); Empty (no eligible items for a dimension → coverage warning); Error (rephrase fail → retain original; selection/send fail → retry); Responsive (chat stacks above requirements on mobile; full-width cards; touch steppers); Accessibility (keyboard chat, screen-reader diff, logical focus across steps); Motion (typing indicator, chip creation, chat→build transition, card slide/fade — all reduced-motion-safe, non-blocking).
