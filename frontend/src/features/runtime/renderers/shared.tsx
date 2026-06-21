// Shared building blocks for the five question-type renderers (Spec 006 / US2). Native radios keep
// the controls keyboard-operable (arrow keys, visible focus via focus-within) and named for AT; the
// card visuals match project/app/user_assessment.jsx (Spec 012 / T023). Each renderer emits a
// normalized number | string answer. Cards meet the ≥44px touch target (constitution XII/XIII).
import { Icon, check } from '@/components/ui/icons';
import type { RuntimeItem } from '@/models';

export interface RendererProps {
  item: RuntimeItem;
  value: number | string | undefined;
  onChange: (value: number | string) => void;
  disabled?: boolean;
}

// The native radio stays in the DOM for keyboard + AT, visually hidden; selection state is shown by
// the card chrome. `aria-label` carries the accessible name so role/name queries stay stable.
function HiddenRadio({
  name,
  label,
  selected,
  disabled,
  onSelect,
}: {
  name: string;
  label: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <input
      type="radio"
      name={name}
      aria-label={label}
      checked={selected}
      disabled={disabled}
      onChange={onSelect}
      className="sr-only"
    />
  );
}

/** Selected/idle card border + background (shared across all option shapes). */
function cardStyle(selected: boolean, disabled?: boolean): React.CSSProperties {
  return {
    borderColor: selected ? 'var(--indigo-500)' : 'var(--border)',
    background: selected ? 'var(--indigo-50)' : 'var(--surface)',
    opacity: disabled ? 0.6 : 1,
  };
}

const badge = (selected: boolean): React.CSSProperties => ({
  background: selected ? 'var(--indigo-500)' : 'var(--canvas-2)',
  color: selected ? '#fff' : 'var(--text-3)',
});

/** A 1..N point scale (Likert agreement / contextual frequency) — horizontal number+label cards. */
export function ScaleGroup({
  item,
  labels,
  value,
  onChange,
  disabled,
}: {
  item: RuntimeItem;
  labels: string[];
  value: number | string | undefined;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={item.itemText} className="flex gap-2.5">
      {labels.map((label, i) => {
        const v = i + 1;
        const on = value === v;
        return (
          <label
            key={v}
            className="flex flex-1 cursor-pointer flex-col items-center gap-2.5 rounded-md border-[1.5px] px-1.5 py-4 transition-colors focus-within:ring-2 focus-within:ring-indigo-500"
            style={cardStyle(on, disabled)}
          >
            <HiddenRadio
              name={item.sourceQuestionId}
              label={label}
              selected={on}
              disabled={disabled}
              onSelect={() => onChange(v)}
            />
            <span
              aria-hidden
              className="grid h-[34px] w-[34px] place-items-center rounded-full font-display text-[15px] font-bold"
              style={badge(on)}
            >
              {v}
            </span>
            <span
              className="text-center text-[11px] font-semibold leading-tight"
              style={{ color: on ? 'var(--indigo-700)' : 'var(--text-3)' }}
            >
              {label}
            </span>
          </label>
        );
      })}
    </div>
  );
}

/** Option cards (MCQ / SJT) — vertical rows with a letter badge + check on select. Stores the key. */
export function OptionGroup({ item, value, onChange, disabled }: RendererProps) {
  const entries = Object.entries(item.options) as [string, string][];
  return (
    <div role="radiogroup" aria-label={item.itemText} className="grid gap-2.5">
      {entries.map(([key, text], i) => {
        const on = value === key;
        const letter = String.fromCharCode(65 + i);
        return (
          <label
            key={key}
            className="flex min-h-12 cursor-pointer items-center gap-3.5 rounded-md border-[1.5px] px-4 py-4 transition-colors focus-within:ring-2 focus-within:ring-indigo-500"
            style={cardStyle(on, disabled)}
          >
            <HiddenRadio
              name={item.sourceQuestionId}
              label={text}
              selected={on}
              disabled={disabled}
              onSelect={() => onChange(key)}
            />
            <span
              aria-hidden
              className="grid h-7 w-7 flex-none place-items-center rounded-lg text-[13px] font-bold"
              style={badge(on)}
            >
              {letter}
            </span>
            <span className="flex-1 text-[14.5px] leading-snug">{text}</span>
            {on && (
              <Icon path={check} size={18} style={{ color: 'var(--indigo-500)', flexShrink: 0 }} />
            )}
          </label>
        );
      })}
    </div>
  );
}

/** Forced-choice (paired statement) — a two-column A/B card grid. Stores the key. */
export function PairedGroup({ item, value, onChange, disabled }: RendererProps) {
  const entries = Object.entries(item.options) as [string, string][];
  return (
    <div
      role="radiogroup"
      aria-label={item.itemText}
      className="grid grid-cols-1 gap-3.5 sm:grid-cols-2"
    >
      {entries.map(([key, text], i) => {
        const on = value === key;
        const letter = String.fromCharCode(65 + i);
        return (
          <label
            key={key}
            className="flex min-h-[140px] cursor-pointer flex-col rounded-lg border-[1.5px] p-5 transition-all focus-within:ring-2 focus-within:ring-indigo-500"
            style={cardStyle(on, disabled)}
          >
            <HiddenRadio
              name={item.sourceQuestionId}
              label={text}
              selected={on}
              disabled={disabled}
              onSelect={() => onChange(key)}
            />
            <span
              aria-hidden
              className="mb-3.5 grid h-[30px] w-[30px] place-items-center rounded-lg font-display font-bold"
              style={badge(on)}
            >
              {letter}
            </span>
            <span className="text-[15px] font-medium leading-relaxed">{text}</span>
          </label>
        );
      })}
    </div>
  );
}
