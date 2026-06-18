# Quickstart — Validate the Frontend Prototype

A run + validation guide that proves the prototype works end-to-end on mock data. No implementation code here (that lives in `tasks.md` / the implementation phase). References: `./contracts/*`, `./data-model.md`, `../000-shared/route-map.md`.

> Status: the frontend app is **not yet implemented** (planning phase). This guide is the acceptance script to run once Phase 1 (Foundation, Spec 001) and the relevant area specs are built.

## Prerequisites
- Node.js LTS (≥ 20) and a package manager (npm/pnpm).
- Evergreen browser; a mobile viewport (DevTools device emulation) for runtime checks.

## Setup & run (once implemented)
```bash
cd frontend
npm install
npm run dev        # start the prototype (Vite dev server)
npm test           # unit + component tests (Vitest)
npm run test:a11y  # axe checks on priority flows (if configured)
```

## Mock logins
- **Admin**: open `/login` → any email/password (mock auth) → lands in `/admin/dashboard`.
- **User/Candidate**: open `/invitation` → any access code (mock) → lands in `/app/dashboard`.

## Validation scenarios (map to Success Criteria)

1. **Create & send (SC-001, SC-002)** — `/admin/assessments/new`: complete all 12 steps; confirm each question shows provenance + "Scoring Logic Locked"; confirm no blocked/quarantine item appears; rephrase a Likert item and confirm only wording changes (diff shown); confirm Send is disabled until approval; send → success creates a Not-Started assessment + notification + simulated email.
2. **Take assessment on mobile (SC-003)** — `/invitation` → overview → consent (Accept disabled until checked) → instructions → runtime: answer all five question types; pause; reload the page; resume and confirm progress restored; submit → completion.
3. **Governed report + Domain 6 + user-safe (SC-004)** — `/admin/reports/:id`: confirm caution/downgraded dimensions and an omitted/blocked section with explanation; open the Domain 6 view (CAI/DII, secondary indices, fit radar, confidence); open `:id/user-preview` and confirm no formulas/raw flags/raw responses/blocked content; confirm the no-automatic-decision disclaimer.
4. **Comparison is human-led (SC-008)** — `/admin/comparison`: set role/blueprint/context, pick ≥2 candidates + dimensions; confirm side-by-side view with **no** ranking/leaderboard and **no** auto shortlist/reject/hire action.
5. **Blueprints & contexts (Spec 004)** — create a Role Blueprint (cycle a dimension required/optional/excluded; set importance; save → version); create a Context Profile (move a slider → live signature updates; save); link them; confirm both appear in the Create Assessment pickers.
6. **Admin management & exports (Spec 002)** — add a user; bulk-upload a CSV (see validation preview); export the Users list as CSV (file downloads); confirm an export-history entry; trigger a simulated report PDF.
7. **Consent revocation (Spec 006)** — `/app/profile`: revoke an eligible consent; confirm it reflects in the Admin `users/:id` Consent tab.
8. **Cross-cutting (SC-005, SC-006, SC-007, SC-009)** — verify empty/loading/error states on a list; toggle reduced-motion and confirm animations degrade; toggle theme and confirm all surfaces/charts/badges switch with no flash; keyboard-only traverse the create-assessment and runtime flows; axe passes on priority flows.

## Done = all eight scenarios pass + the Spec 008 release-readiness gate (`../008-qa-release-readiness/spec.md`).
