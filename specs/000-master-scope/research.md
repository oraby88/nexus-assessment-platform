# Phase 0 — Research & Decisions (Frontend Prototype)

All Technical Context items are resolved (no remaining NEEDS CLARIFICATION). Decisions below also resolve the non-blocking items in `../000-shared/open-questions.md`.

## Tooling & framework
- **Decision**: Vite + React 18 + TypeScript (strict) + React Router 6; Vitest + React Testing Library; ESLint + Prettier.
- **Rationale**: Matches the constitution; fastest dev/build for an SPA; closest to the existing CDN-React prototype with no SSR needs.
- **Alternatives**: Next.js (rejected — SSR/conventions unneeded, complicates the "pure frontend / mock" boundary); CRA (rejected — unmaintained, slow).

## Styling & design tokens
- **Decision**: Port `project/app/styles.css` custom properties into `tokens.css` (light + `[data-theme=dark]`) + CSS Modules per component; typed `theme.ts` mirror for charts. Pre-paint theme via inline `index.html` script.
- **Rationale**: Faithful to the design source; smallest footprint; trivial theming/dark mode.
- **Alternatives**: CSS-in-TS (vanilla-extract/stitches) — more typed styling but a larger departure from existing CSS.

## State management
- **Decision**: React local state + Context for cross-cutting concerns (theme, toasts, session, active wizard draft); a small `useAsync`/resource hook over services. No Redux/Zustand in V1.
- **Rationale**: Constitution XIII (no over-engineering); needs are modest with a mock layer. Revisit only if the wizard demands it (record in Complexity Tracking).

## Charts
- **Decision**: Hand-built SVG primitives (Gauge, ContextRadar, FitRadar, DimensionBars, CoverageBars, ContextSignature) reading `theme.ts`.
- **Rationale**: Matches the prototype's bespoke visuals; small bundle; full theming/motion control; easy text-equivalents for a11y.
- **Alternatives**: Recharts/visx (rejected — weight + theming friction for a few bespoke charts).

## Local persistence
- **Decision**: `persistence.ts` over `localStorage`, namespaced + versioned (`nexus_theme`, `nexus_runtime_v1`, `nexus_drafts_v1`). Always persist theme + runtime; persist explicit "Save Draft" for wizards; do not auto-persist transient filters.
- **Rationale**: Required runtime recovery + safe schema evolution; resolves open-question on draft scope.

## Governed question bank
- **Decision**: Embed the **full 543-item `item_bank`** converted at build time into a **code-split** `governed-bank.ts`, imported only by `questionBankService`; exclude blocked/quarantine/pilot/research from ordinary operational sets; **omit** `weight`/`difficulty` (absent in source).
- **Rationale**: Realistic governance demo without inflating first paint (Risk R18); honors immutability (Principle VI) and the workbook audit.

## AI Discovery & adaptation (prototype)
- **Decision**: Deterministic **scripted** Agent chat with a clearly-labeled, non-functional "live AI" toggle; `adaptationService` accepts `{itemId, adaptedText}` only and returns a word diff; method-family safeguards enforced (cognitive verbatim, SJT approved-equivalence only).
- **Rationale**: No live model in V1 (Principle I); preserves governance (Principles V–VII).

## Consent model
- **Decision**: **Full per-use-case consent** — mandatory current-use-case consent gates the runtime; optional research/third-party opt-ins shown only when applicable; revocation in Profile & Privacy invalidates the use case and reflects in the Admin consent tab.
- **Rationale**: Confirmed decision; resolves open-questions Q6; matches PRD intent at prototype fidelity.

## Exports & PDF
- **Decision**: Real client-side **CSV** for list exports (`lib/csv.ts`); **simulated** PDF (toast + export-history entry) for reports.
- **Rationale**: CSV is feasible client-side and adds real value; PDF generation is a backend concern (resolves open-questions Q8).

## Reports visibility & user-safe boundary
- **Decision**: A governance layer (`confidenceGate`, `useCaseGate`, `visibilityEngine`) annotates each output with a visibility state; `toUserSafe(report)` strips Admin-only/restricted/blocked content server-of-record-style on the client.
- **Rationale**: Faithful to `../000-shared/status-models.md`; enforces Principles IX–XI; verified by tests (SC-004, SC-008).

## Accessibility & motion
- **Decision**: Semantic landmarks, focus-visible tokens, modal focus-trap + Esc, aria-live for toasts/auto-save, radio-group semantics for question options; GSAP wrapped by `useReducedMotion`; no shell parallax.
- **Rationale**: Constitution XII; axe checks on priority flows (SC-006, SC-009).

## Backend seam (future)
- **Decision**: Every mock service signature is the API contract; the per-service FastAPI/Supabase mapping is fixed in `../000-shared/handoff-map.md` and `./contracts/mock-services.md`.
- **Rationale**: Principle IV — future API swap must not require a UI rewrite.

## Open questions status
Q1–Q10 in `../000-shared/open-questions.md` are non-blocking; their prototype defaults above are adopted. None block planning or implementation.
