# Contract: Discovery → Assessment Transform Sequence (US3)

An animated, governed-assembly moment after the Create-Assessment discovery interview. Display copy only (constitution IX); skippable + reduced-motion-safe (XII); GSAP lazy-loaded (budget).

## Trigger & integration

- Lives in `features/create-assessment/TransformSequence.tsx`; played by `CreateAssessmentWizard` at the **assembly → review** transition (after discovery has produced requirements and the governed question set is assembled, before the review/success step). `onDone()` advances to review.

## Phases (ordered)

`answers → requirements → dimensions → governed questions → assembled` (mirrors `project/app/transform_sequence.jsx`).

## Behavior

- **Skippable in one action**: a Skip control (and Esc) calls `onDone()` immediately; reaching the assembled assessment loses **no** data (FR-SSP-009).
- **Reduced-motion / GSAP-not-loaded fallback**: a brief non-animated hold then `onDone()` — still reaches the assembled review (FR-SSP-011).
- **Governed messaging**: copy states questions are selected from the **validated bank (never invented)**; **no** restricted/internal content, scores, or raw fields (FR-SSP-010, constitution IX).
- **Non-blocking**: never blocks reaching review; GSAP loaded lazily via `lib/gsap.ts` only on the motion-allowed path.

## Tests (`tests/create-assessment/`)

- Sequence renders its phase labels and ends by calling `onDone` (reaching review).
- Skip in one action calls `onDone` immediately (no data loss).
- Reduced-motion: non-animated fallback still calls `onDone` (reaches review); GSAP not loaded on this path.
- Governed copy present; a leak-guard asserts no score/restricted terms appear (reuse the Spec 006 forbidden-terms pattern).
