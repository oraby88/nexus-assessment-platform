# Quickstart — Foundation and Design System (validation guide)

Run-and-verify guide proving the foundation works end-to-end against mocks. Implementation details live in `tasks.md` (after `/speckit-tasks`) and the code; this is a validation/run guide only.

## Prerequisites

- Node LTS + a package manager (npm/pnpm).
- Repo cloned; the design source in `project/` available; `item_bank` workbook present (see `../000-shared/workbook-audit.md`).

## Setup & run

```bash
cd frontend
npm install
npm run convert:bank   # build/prep-time: item_bank → committed typed mocks/governed-bank.ts (research D3)
npm run dev            # start Vite dev server
```

```bash
npm test               # Vitest unit + component tests
npm run build          # production build (inspect chunks for code-split bank)
```

## Mock logins (no real auth)

- **Admin**: `authService.loginAdmin` via `/login` → lands in `AdminShell` (`/admin/dashboard`).
- **User (first access)**: `/invitation` → `activateInvitation(code, password)` (sets password) → `UserShell` (`/app/dashboard`).
- **User (return)**: `/invitation` → `loginUser` → `UserShell`.

## Validation scenarios (map to Success Criteria)

| # | Scenario | Steps | Expected | SC |
|---|---|---|---|---|
| 1 | Guard — no session | Open `/admin/dashboard` and `/app/dashboard` logged out | Redirect to `/login` and `/invitation` respectively | SC-001 |
| 2 | Guard — wrong role | As Admin open an `/app/*` route (and reverse) | `/access-denied`; no other-role chrome/data rendered | SC-001 |
| 3 | Theme persist, no flash | Toggle dark, reload | Paints dark immediately, no light flash; badges/charts correct | SC-002 |
| 4 | Theme default | Clear `nexus_theme`, set OS to dark, load | App opens dark (follows `prefers-color-scheme`) | SC-002 |
| 5 | Reduced motion | Enable `prefers-reduced-motion`, navigate | Animations instant/opacity, never block | SC-003 |
| 6 | Service-only data | Load the sample page; inspect | Data via a service Promise (loading→success); grep finds no component importing fixtures/persistence | SC-004 |
| 7 | Mock error/retry | Set `http.setGlobalConfig({forceError:true})`, reload sample page | Error state with working retry | SC-004 |
| 8 | Bank code-split | `npm run build`; inspect chunks | Governed bank not in the initial chunk; loads only on question selection | SC-005 |
| 9 | Bank provenance | `npm test` (provenance test) | Source `item_id`/metadata preserved exactly; no `weight`/`difficulty` | SC-006 |
| 10 | Governance helpers | `npm test` (governance unit tests) | Eligible/blocked/quarantine/low-confidence/restricted handled; user-safe strips restricted fields | SC-007 |
| 11 | Persistence reset | Write a `nexus_runtime_v1` value, bump its version, reload | Stale entry discarded, fresh default (no crash) | SC-006/edge |
| 12 | A11y + keyboard | Tab through sample shell + a modal | Visible focus, focus trap + Esc, contrast both themes (axe clean) | SC-008 |
| 13 | Responsive | Resize < 1040px | Sidebar goes off-canvas; layout intact to mobile | SC-008/FR-018 |

## Done (foundation acceptance)

Both shells boot; guards behave per scenarios 1–2; theme persists with no flash and defaults to system; reduced motion degrades; one page renders via a service Promise with no direct fixture imports; governance helpers and the bank-provenance test pass; the bank is excluded from the initial chunk; public/auth routes are reserved for spec 007.
