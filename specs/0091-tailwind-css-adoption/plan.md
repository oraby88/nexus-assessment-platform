# Implementation Plan: Tailwind CSS Adoption

**Branch**: `0091-tailwind-css-adoption` | **Date**: 2026-06-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/0091-tailwind-css-adoption/spec.md`

## Summary

Introduce Tailwind CSS as the frontend styling system while preserving the existing design-token
system, dark theme, RTL behavior, and visual fidelity. Approach: install Tailwind into the Vite
pipeline, bridge the existing `tokens.css` CSS variables into the Tailwind theme (tokens remain the
source of truth), bind the `dark:` variant to `[data-theme="dark"]`, **disable Tailwind Preflight**
so `globals.css` stays the authoritative reset, and migrate one reference exemplar (the shared UI
primitives + the Auth login screen) to prove the pattern. Tailwind coexists with the ~70 legacy
inline-styled components; the remainder migrate in follow-up batches. The constitution `§ Stack` is
amended to name Tailwind (replacing "CSS Modules") with a justified dependency.

## Technical Context

**Language/Version**: TypeScript 5.5 (strict), React 18.3

**Primary Dependencies**: Vite 5.4, React Router 6, GSAP 3.12 (existing). **New**: `tailwindcss`
3.4.x, `postcss`, `autoprefixer` (dev dependencies).

**Storage**: N/A (frontend prototype, mock services, localStorage — unchanged by this feature)

**Testing**: Vitest 2 + React Testing Library + vitest-axe (existing); manual visual side-by-side
review for parity (SC-003); `npm run check:bundle` for the budget gate.

**Target Platform**: Modern evergreen browsers; Admin desktop-first, User runtime mobile-first.

**Project Type**: Single-page web application frontend (`frontend/`), mock-only, no backend.

**Performance Goals**: Initial bundle ≤260KB (spec 009 budget) maintained after Tailwind purge.

**Constraints**: Frontend/mock-only; zero visual regression on migrated exemplar in light/dark +
LTR/RTL; existing focus-visible ring and `prefers-reduced-motion` behavior preserved; no `any` in
typed config.

**Scale/Scope**: ~70 `.tsx` components total. This feature: setup + token bridge + 1 reference
exemplar (shared UI primitives `components/ui/{primitives,index}.tsx` + Auth login screen). The
remaining ~68 files are explicitly out of scope (follow-up batches).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment |
|-----------|------------|
| I. Frontend First | ✅ Pass — frontend/mock-only, no backend touched; incremental (setup + one exemplar). |
| II. Design Fidelity | ✅ Pass — visual source of truth preserved; SC-003 requires zero visual difference, verified by manual review. Tokens unchanged. |
| IV. Service Boundaries | ✅ Pass — styling-only; no service/fixture/persistence changes. |
| XII. Accessibility and Motion | ✅ Pass — Preflight disabled so `globals.css` focus-visible ring + `prefers-reduced-motion` rules remain authoritative; GSAP keeps owning signature motion. |
| XIII. Responsive Runtime | ✅ Pass — Tailwind responsive utilities are token-aligned; runtime behavior unchanged. |
| XV. Review Before Implementation | ✅ Pass — this is the plan stage; work stops for human approval before `/speckit-implement`. |
| **§ Stack (Quality Standards)** | ⚠️ **Deviation** — mandates "CSS-variable design tokens + **CSS Modules**" and "**No heavy dependency without justification**". Tailwind replaces the (unused) CSS Modules mandate and adds a build dependency. **Resolution**: spec FR-009 amends `§ Stack` via `/speckit-constitution` (MINOR/clarification bump), with documented rationale + impact and human approval per Principle XV. Justification recorded in Complexity Tracking below. |

**Gate result**: PASS with one tracked deviation (the `§ Stack` amendment), which is governed by
the constitution's own amendment process and the spec's FR-009. No NON-NEGOTIABLE principle is
violated. Re-checked after Phase 1 design — unchanged (no new violations introduced by the design).

## Project Structure

### Documentation (this feature)

```text
specs/0091-tailwind-css-adoption/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (token-bridge mapping)
├── quickstart.md        # Phase 1 output (validation guide)
├── contracts/           # Phase 1 output
│   └── tailwind-theme-contract.md
├── checklists/
│   └── requirements.md  # From /speckit-specify + /speckit-clarify
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
frontend/
├── tailwind.config.ts          # NEW — token bridge, darkMode selector, content globs, preflight off
├── postcss.config.js           # NEW — tailwindcss + autoprefixer
├── package.json                # MODIFIED — add tailwindcss/postcss/autoprefixer devDeps
├── index.html                  # (unchanged)
└── src/
    ├── styles/
    │   ├── tokens.css           # (unchanged — remains source of truth)
    │   ├── globals.css          # MODIFIED — add Tailwind @tailwind directives; stays the reset
    │   └── tailwind.css         # OPTIONAL — alternatively the @tailwind layers live here
    ├── components/ui/
    │   ├── primitives.tsx       # MIGRATED — reference exemplar (inline styles → utilities)
    │   └── index.tsx            # MIGRATED — reference exemplar
    └── features/auth/
        └── index.tsx            # PARTIALLY MIGRATED — only AdminLogin (/login) + shared AuthScaffold/inputStyle; other exports stay unmigrated
```

**Structure Decision**: Single existing frontend project (`frontend/`). This feature adds two root
config files and modifies `globals.css` + `package.json`; the only component changes are the
reference exemplar (`components/ui/{primitives,index}.tsx` + `features/auth/index.tsx`). All other
components remain untouched and continue to render via their existing inline styles.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| New heavy build dependency (Tailwind + PostCSS + autoprefixer) vs. `§ Stack` "no heavy dependency without justification" | Stakeholder-directed adoption of Tailwind as the project-wide styling system; replaces verbose, repetitive inline `style={{}}` objects across ~70 files and gives a consistent token-driven utility vocabulary. JIT purge keeps the shipped CSS small (bundle gate enforced). | Continuing with inline styles / introducing real CSS Modules was rejected because the directive is to standardize on Tailwind; CSS Modules were mandated by the constitution but never actually adopted, so the status quo already deviates. |
| Amending the constitution `§ Stack` (CSS Modules → Tailwind) | Keeps the governing document consistent with the actual stack and prevents review-time contradiction. | Adopting Tailwind without amending leaves the constitution contradicting the codebase — rejected for governance hygiene. |

Both deviations are justified, bounded, and routed through the constitution's amendment process
with human approval. No simpler alternative satisfies the stakeholder directive.
