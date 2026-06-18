# Quickstart & Validation: User Portal & Assessment Runtime

Validates the spec end-to-end on mocks (no backend). Details live in `data-model.md`, `contracts/services.md`, and `contracts/screens-routes.md` — this is a run/validation guide.

## Prerequisites

- Node + the existing `frontend/` app (Spec 001 foundation present).
- From repo root: `cd frontend`.

## Run

```bash
npm install      # if not already
npm run dev      # start Vite; open the printed localhost URL
```

Enter the User portal via `/invitation` (activate — set a password) or returning sign-in, landing on `/app/dashboard`.

## Quality gates (must all pass — same bar as Specs 001–005)

```bash
cd frontend
npx tsc -b                # strict typecheck, 0 errors
npm run test              # vitest — unit + component
npm run build             # vite production build succeeds
npx eslint .              # 0 errors
npx prettier --check .    # formatting clean
```

## Story validation

### US1 — Take an assessment end-to-end (P1, MVP)
1. From the dashboard active-assessment **hero**, Continue → **Overview** → **Consent**.
2. Accept the required consent (Accept-and-Continue was disabled until checked) → **Instructions** → **Begin**.
3. In the **runtime**: answer items; confirm the **save indicator** updates and **no score** is shown.
4. **Pause** then resume; **reload** mid-runtime → current question + all answers restored.
5. Use **back-navigation** to change a prior answer; advance; **review**; **Submit** → **Completion** (subtle confirmation, no confetti).
- ✅ Pass: full journey completes; reload/pause restore 100% (SC-001/002/004).

### US2 — Five question types (P1)
- Render one of each: Likert, contextual frequency, forced choice, cognitive MCQ, SJT. Confirm correct layout, Next disabled until answered, response stored **keyed by source Question ID**, keyboard + touch operable (≥44px), forced-choice stacks on mobile, progress sticky.
- ✅ Pass: all five behave correctly (SC-003/009).

### US3 — Consent + revocation (P1)
- Consent screen shows only **applicable** consents; Accept-and-Continue gated on required. Decline → neutral return.
- In **Profile & Privacy**, revoke an eligible consent → confirm it reflects in the **Admin User-Detail → Consent** tab (`/admin/users/:participantId`).
- ✅ Pass: gating + applicable filtering + revocation propagation (SC-005/006).

### US4 — No Admin-data leakage (P1)
- Inspect every User screen (especially the report): no source metadata, formulas, scoring versions, raw/governance flags, blocked values, Admin notes, Domain 6 internals, or hire/reject language.
- ✅ Pass: 0 leaks; report built only from `reportService.getUserSafe` (SC-007/008).

### US5 — User-safe reports (P2)
- **My Reports** lists available/partial/historical with status; open a report → supportive user-safe content + simulated PDF (records export-history).
- ✅ Pass: only user-safe content shown.

### US6 — Portal periphery (P2)
- Dashboard hero links into the active assessment; My Assessments / History / Notifications render own-data only; Help renders; Profile & Privacy submits a **pending** data-deletion request and shows consent history.
- ✅ Pass: own-data only; deletion request pending (queued for Spec 007 inbox).

## Targeted test pointers

- `tests/unit/runtime.*` — load/save/resume, answer keying by source Question ID, no-score invariant, schema-mismatch discard.
- `tests/unit/consent.*` — gating, applicable filtering, revocation eligibility + Admin-tab propagation, deletion pending.
- `tests/unit/user-safe.*` — leakage guard (extends Spec 005's `user-safe.test.ts`).
- `tests/component/runtime.*` — five renderers, gating, back-nav, reload restore, save indicator, no live score.
- `tests/component/consent.*`, `tests/component/profile.*`, `tests/component/dashboard-hero.*`.

## Done = all quality gates green + all six stories validated + every `tasks.md` item `[X]`.
