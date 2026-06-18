# Quickstart — Create Assessment Flow (validation guide)

Run-and-verify guide for the signature 12-step flow. Implementation detail lives in `tasks.md`
(after `/speckit-tasks`). Builds on Specs 001/002 (and consumes 004 pickers).

## Prerequisites
- Sign in as Admin (`/login`) → open `/admin/assessments/new` (or "Create Assessment" from Dashboard/User Detail).
- App builds (`npm install`, `npm run dev`).

## Setup & run
```bash
cd frontend
npm run dev      # serve
npm test         # Vitest unit + component
npm run build    # production build (bank lazy-loaded at selection step)
```

## Validation scenarios (map to Success Criteria)

| # | Scenario | Steps | Expected | SC |
|---|---|---|---|---|
| 1 | End-to-end send | Complete all 12 steps for one user → approve → Send | Not-Started assignment + invitation + notification + sim email; success state | SC-001 |
| 2 | Single user only | Step 1 | Exactly one user selectable (existing or inline-add); dup email blocked | FR-CA-002 |
| 3 | Scripted discovery | Answer chat prompts | Requirements panel updates live per answer; prior answer editable; deterministic turns | SC-005 |
| 4 | Chat→build transition | Finish chat | Skippable, reduced-motion-safe, non-blocking | SC-005 |
| 5 | Governed selection | Step 7 with mixed bank | Only eligible items proposable/selectable; blocked/quarantine/pilot/research excluded | SC-002 |
| 6 | Provenance | Step 7 card | Shows source ID/domain/dimension/facet/method/scale/statuses + trust badges; no weight/difficulty | SC-003 |
| 7 | Controlled rephrase | Step 8 Likert rephrase | Display text changes only, with word diff; metadata unchanged | SC-004 |
| 8 | Method safeguards | Step 8 on SJT + cognitive | Rephrase blocked; "Original wording retained" | SC-004 |
| 9 | Coverage warnings | Step 9 remove a required-dimension's only item | Warning when 0 items; soft note when 1; recomputes live | SC-008 |
| 10 | Approval gate | Step 12 before approving | Send disabled; after approval Send enabled | SC-006 |
| 11 | Draft resume | Save mid-flow, leave, return | Resumes at saved step with inputs intact | SC-007 |
| 12 | Attribution | Inspect a selected question | Source `item_id` retained; no live User score anywhere in the flow | SC-009 |
| 13 | Appears in monitoring | After send | New assignment shows in `/admin/assessments` (Spec 002) | SC-001 |

## Done (acceptance)
One tailored assessment can be created and sent; chat is interactive with a live requirements panel;
selection is governed (eligible-only, full provenance, no fabricated fields); rephrase preserves
metadata with a diff and SJT/cognitive stay verbatim; coverage recomputes with warnings; Send is
disabled before approval; drafts resume; send creates assignment+invitation+notification+email and
the assignment appears in Admin Core — with governance unit/component tests passing.
