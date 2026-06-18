# Phase 0 — Research & Decisions (Foundation and Design System)

All Technical Context items are resolved — **no remaining NEEDS CLARIFICATION**. This file records the foundation-specific decisions and the deltas/refinements over the master baseline (`../000-master-scope/research.md`), including the three clarifications captured in `spec.md` (Session 2026-06-15). Where the master research already fixes a decision (tooling, charts, AI/adaptation, consent, exports), it is inherited unchanged and not repeated here.

## D1 — Default theme on first load *(clarification Q1)*
- **Decision**: The inline pre-paint script in `index.html` reads the stored preference (`nexus_theme`); if absent, it applies the OS/browser `prefers-color-scheme` (system). An explicit user toggle writes the preference and overrides system thereafter. The script runs before first paint to prevent any flash.
- **Rationale**: Respects the user's environment, matches modern conventions, and is synchronously readable pre-paint with no flash (SC-002).
- **Alternatives**: Hard-default dark or light (rejected — ignores user environment); React-effect-applied theme (rejected — paints wrong theme first, causing a flash).

## D2 — Persistence version-mismatch behavior *(clarification Q2)*
- **Decision**: `persistence.ts` stores each namespaced value with a schema version. On read, a version mismatch discards the stale entry and returns the default (safe reset). No migration code in V1.
- **Rationale**: A mock-only prototype has no durable user data to preserve; discard-and-reset avoids fragile migration logic and keeps the seam clean for the future backend, which will own durable data and migrations.
- **Alternatives**: Best-effort migration with fallback (rejected — unnecessary complexity in V1); keep stale data as-is (rejected — risks runtime shape errors after model changes).

## D3 — Governed `item_bank` conversion & loading *(clarification Q3)*
- **Decision**: A build/prep-time step (`scripts/convert-item-bank.ts`) converts the source workbook to a committed, typed module (`mocks/governed-bank.ts`) preserving every source field exactly and omitting fields absent from the source (`weight`, `difficulty`). It is loaded **only** via dynamic `import()` inside `questionBankService`, so bundling code-splits it out of the initial chunk. A source-provenance unit test asserts field fidelity.
- **Rationale**: Bakes provenance into a committed, type-checked artifact (clean SC-006 test); guarantees initial-chunk exclusion via dynamic import (SC-005); needs no runtime fetch infrastructure or in-browser workbook parser. Consistent with the master research's "converted at build time, code-split" decision.
- **Alternatives**: Runtime fetch of a static JSON asset (rejected — adds fetch/caching surface and weakens type-checking of provenance); in-browser workbook parsing (rejected — heavyweight parser in the client bundle, slower, error-prone).

## D4 — State management (inherited, confirmed for the seam)
- **Decision**: React local state + Context providers for cross-cutting concerns (theme, toasts, session), plus a `useAsync`/resource hook over services. No Redux/Zustand in V1.
- **Rationale**: Constitution (no over-engineering); needs are modest against a mock layer. Revisit only if the wizard demands it (then log in Complexity Tracking).
- **Alternatives**: Redux/Zustand (rejected for V1 — disproportionate to current needs).

## D5 — Service boundary & infra contracts
- **Decision**: Every screen consumes typed `Promise`-returning service methods; `http.ts` simulates latency and injectable errors; services reject with a typed error on simulated failure. UI never imports fixtures or reads persistence directly (enforced by an import-boundary check in tests/lint).
- **Rationale**: Principle IV — the signatures are the future API contract; a backend swap must not require a UI rewrite. Verified by SC-004.
- **Alternatives**: Components reading fixtures directly (rejected — couples UI to mock data, breaks the seam).

## D6 — Governance helpers as a unit-tested layer
- **Decision**: `services/governance/{eligibility,confidenceGate,useCaseGate,visibilityEngine,toUserSafe}` implement the rules in `../000-shared/status-models.md` as pure functions, unit-tested against eligible/blocked/quarantined/low-confidence/restricted cases.
- **Rationale**: Centralizes constitutional governance (Principles V, VI, IX, X, XI) so every downstream feature enforces identical rules; isolated and later replaceable by server-authoritative responses. Verified by SC-007.
- **Alternatives**: Inline governance per feature (rejected — duplication and divergence risk).

## D7 — Accessibility & motion primitives
- **Decision**: Semantic landmarks; focus-visible from tokens; `useFocusTrap` for modals/drawers with Esc; aria-live regions via the toast host; accessible text alternative for charts; GSAP motion wrapped by `useReducedMotion` (degrade to instant/opacity); no parallax in the shell.
- **Rationale**: Constitution XII; axe checks on priority sample flows (SC-008) and reduced-motion behavior (SC-003).
- **Alternatives**: Decorative-only motion / no reduced-motion path (rejected — violates XII).

## Open questions status
The non-blocking items in `../000-shared/open-questions.md` adopt the master-research prototype defaults; the three foundation clarifications above (D1–D3) are now closed in `spec.md`. None block planning or implementation.
