# Contract: Parity Bar & Audit Method

The acceptance contract for "matches the design," the gap-inventory schema, and the verification method. Presentation-only; no new dependency/tooling.

## Parity bar (clarify Q1)

A screen/component **meets the bar** when it matches the `project/` design's **specified source values exactly**:

- **Color** — token values from `app/styles.css` (both `:root` light + `[data-theme="dark"]`).
- **Spacing / layout** — paddings, gaps, grid/flex structure, max-widths, radii.
- **Typography** — family (`--font-display/ui/mono`), size, weight, line-height, letter-spacing.
- **Iconography** — the design's icon set (`app/icons.jsx`); correct icon + size + alignment.
- **Elevation** — shadows (`--sh-sm/md/lg`).
- **States** — loading, empty, error, 404, responsive, hover/press/focus — present in the design's language.
- **Motion** — signature motion matches intent; reduced-motion-safe; no shell parallax.

Verified at **review** against the source + **token/structure assertions** (no pixel-diff). Pixel-perfect where the design specifies a value; not required where the design omits a state.

## Gap-inventory schema (`inventory.md`)

Per-area sections; one row per deviation: `area · route · designSource · aspect · detail · severity(High/Medium/Low) · status(open/closed/deferred)`. See `data-model.md` for the full shape.

## Definition of done (clarify Q2/Q3)

- Audit + close **per area, interleaved** (chrome → admin → user → create).
- Close **all High + Medium** deviations; **Low** logged + deferrable with reviewer sign-off.
- No `open` High/Medium at completion; inventory covers 100% of live routes.

## Verification (`tests/parity/` + reuse)

- Structural/token assertions per area (states present; chrome/components use the design's tokens/icons/structure).
- Reuse Spec 009 reduced-motion + no-shell-parallax + `check:bundle`; Spec 008 release gate for regression.
- Parity match signed off at review via the inventory. **No pixel-diff tooling.**
