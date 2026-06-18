# Quickstart & Validation: Public/Auth Recovery, Activity Log & Privacy Inbox

Validates the spec end-to-end on mocks (no backend). Details live in `data-model.md`, `contracts/services.md`, and `contracts/screens-routes.md`.

## Prerequisites

- The existing `frontend/` app (Specs 001–006 present). From repo root: `cd frontend`.

## Run

```bash
npm install   # if needed
npm run dev   # open the printed localhost URL
```

## Quality gates (must all pass — same bar as Specs 001–006)

```bash
cd frontend
npx tsc -b                # strict typecheck, 0 errors
npm run test              # vitest — unit + component
npm run build             # vite production build succeeds
npx eslint .              # 0 errors
npx prettier --check .    # formatting clean
```

## Story validation

### US1 — Privacy-request inbox (P1, MVP)
1. As a User (Spec 006 Profile & Privacy), submit a data-deletion request.
2. Sign in as Admin → **Privacy Requests** (`/admin/privacy`): the request appears (requester/date/note/status).
3. Mark it **In Review** → **Completed**; reject another with a **reason** (reject blocked without a reason).
4. Back in the User's Profile & Privacy view, the status reflects the resolution.
- ✅ Pass: lifecycle works, reason enforced, terminal rows disabled, User view reflects status (SC-001).

### US2 — Account recovery & invitation states (P1)
- From sign-in → **Forgot password** → submit email → neutral confirmation (no enumeration) → open the mock reset link.
- On **Reset** (`?token=valid-demo`): set matching strong passwords → success → sign-in. Try `?token=expired` and no token → expired-link state.
- Open the invitation screen's **expired** state → clear explanation + path forward.
- ✅ Pass: recovery completes; validation blocks weak/mismatched; expired states render (SC-002/003/004).

### US3 — Activity Log (P2)
- Open **Activity Log** (`/admin/activity-log`): all enumerated event types render with actor/target/time.
- Search and apply type/actor/date filters (combined AND); confirm the list narrows; empty state when nothing matches.
- ✅ Pass: curated events + filters work; framed as a prototype read view (SC-005).

### US4 — Public surface & polish (P3)
- Visit an unknown URL → 404 with a path back. Force empty/error on a sampling of screens → in-language states.
- Check public/auth screens on mobile + desktop in both themes (keyboard + contrast).
- ✅ Pass: no blank screens/raw errors; a11y/responsive basics hold (SC-006/008).

### Scope guard
- Confirm `/admin/privacy` and `/admin/activity-log` redirect/deny under a User session and show only the current org's data (SC-007).

## Targeted test pointers

- `tests/unit/privacy-inbox.*` — resolution lifecycle, reason-required, terminal, User-view reflection.
- `tests/unit/auth-reset.*` — token states (valid/expired/missing) + password validation + no enumeration.
- `tests/unit/activity-log.*` — filter AND semantics across type/actor/date/search.
- `tests/component/recovery.*`, `tests/component/privacy-inbox.*`, `tests/component/activity-log.*`, `tests/component/not-found.*`.

## Done = all quality gates green + all four stories validated + every `tasks.md` item `[X]`.
