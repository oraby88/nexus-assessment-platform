// Extended design-system primitives (FR-FND-005 / task T022). Token-driven, theme-reactive,
// keyboard-operable. Composed with the base primitives in ./index.tsx.
// Migrated to Tailwind utilities (spec 0091): utilities resolve to design tokens via the theme
// bridge in tailwind.config.ts; RTL uses logical-property utilities (ps-/pe-/ms-/me-/start-/end-);
// dark mode flows through the CSS variables (no dark: variants needed). Genuinely dynamic or
// computed values (runtime tone colors, conditional positions, gradients, keyframe animations)
// remain inline by design, per the styling contract.
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import type { ConfidenceBand } from '@/models';
import { useFocusTrap, useReducedMotion } from '@/hooks';
import { Icon } from './icons';

export function IconButton({
  label,
  children,
  className,
  ...rest
}: { label: string; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      aria-label={label}
      className={`inline-grid place-items-center w-[34px] h-[34px] rounded-md border border-border-strong bg-surface text-text-2 ${className ?? ''}`}
      {...rest}
    >
      {children}
    </button>
  );
}

const overlayCls = 'fixed inset-0 bg-black/45 grid z-[1500]';

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useFocusTrap<HTMLDivElement>(open);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className={`${overlayCls} place-items-center p-5`} onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border border-border rounded-lg shadow-lg w-[480px] max-w-full p-[22px]"
        style={{ animation: 'nx-fade-up .2s var(--ease-out) both' }}
      >
        <h2 className="text-lg mb-3">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useFocusTrap<HTMLDivElement>(open);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className={`${overlayCls} justify-items-end`} onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border-s border-border shadow-lg w-[420px] max-w-full h-full p-[22px] overflow-y-auto"
      >
        <h2 className="text-lg mb-3">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export function Popover({ trigger, children }: { trigger: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  return (
    <div ref={ref} className="relative inline-block">
      <span onClick={() => setOpen((o) => !o)}>{trigger}</span>
      {open && (
        <div
          role="menu"
          className="absolute top-full start-0 mt-1.5 bg-surface border border-border rounded-md shadow-md p-1.5 min-w-[180px] z-[1400]"
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function Menu({ items }: { items: { label: string; onSelect: () => void }[] }) {
  return (
    <>
      {items.map((it) => (
        <button
          key={it.label}
          role="menuitem"
          onClick={it.onSelect}
          className="block w-full text-start py-2 px-2.5 rounded-sm border-none bg-transparent text-sm text-text"
        >
          {it.label}
        </button>
      ))}
    </>
  );
}

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-border">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={`py-[11px] px-3.5 border-0 border-b-2 bg-transparent text-sm font-semibold ${
            active === t.id ? 'text-indigo-600 border-indigo-500' : 'text-text-2 border-transparent'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

const controlCls =
  'w-full py-2.5 px-3 rounded-md border border-border-strong bg-surface-2 text-text text-sm';

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block mb-3">
      <span className="block text-[13px] font-semibold mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-text-3 mt-1">{hint}</span>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${controlCls} ${props.className ?? ''}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${controlCls} min-h-[88px] resize-y ${props.className ?? ''}`}
    />
  );
}

export function Select({ children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...rest} className={`${controlCls} ${rest.className ?? ''}`}>
      {children}
    </select>
  );
}

export function SearchInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="search"
      aria-label={props['aria-label'] ?? 'Search'}
      placeholder="Search…"
      {...props}
      className={`${controlCls} max-w-[320px] ${props.className ?? ''}`}
    />
  );
}

export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="flex gap-2.5 flex-wrap items-center mb-3.5">{children}</div>;
}

export function Slider(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="range"
      {...props}
      className={`w-full accent-indigo-500 ${props.className ?? ''}`}
    />
  );
}

export function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex bg-track rounded-md p-[3px]">
      {options.map((o) => (
        <button
          key={o.value}
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`py-1.5 px-3.5 rounded-sm border-none text-[13px] font-semibold ${
            value === o.value ? 'bg-surface text-text shadow-sm' : 'bg-transparent text-text-2'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`w-[42px] h-6 rounded-full border-none relative transition-[background] duration-150 ${
        checked ? 'bg-indigo-500' : 'bg-border-strong'
      }`}
    >
      <span
        className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-[left] duration-150"
        // Thumb offset is computed at runtime; kept inline (not a physical-utility class).
        style={{ left: checked ? 21 : 3 }}
      />
    </button>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-indigo-500 w-4 h-4"
      />
      {label}
    </label>
  );
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="grid gap-2">
      {options.map((o) => (
        <label key={o.value} className="inline-flex items-center gap-2 text-sm">
          <input
            type="radio"
            name={name}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            className="accent-indigo-500 w-4 h-4"
          />
          {o.label}
        </label>
      ))}
    </div>
  );
}

export function Chip({
  children,
  tone = 'slate',
  active = false,
  onClick,
  icon,
}: {
  children: ReactNode;
  tone?: 'slate' | 'indigo' | 'teal' | 'amber' | 'rose' | 'violet';
  /** Active filter state — saturated dot fill + white text (design app/ui.jsx Chip). */
  active?: boolean;
  onClick?: () => void;
  icon?: string;
}) {
  // Tone + active are runtime props, so the token vars resolve inline (dynamic).
  const style = active
    ? {
        background: `var(--tone-${tone}-dot)`,
        color: '#fff',
        border: `1px solid var(--tone-${tone}-dot)`,
      }
    : {
        background: `var(--tone-${tone}-bg)`,
        color: `var(--tone-${tone}-fg)`,
        border: '1px solid transparent',
      };
  const cls =
    'inline-flex items-center gap-1.5 rounded-full px-3 py-[5px] text-[13px] font-semibold transition-colors';
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls} style={style}>
        {icon && <Icon path={icon} size={14} />}
        {children}
      </button>
    );
  }
  return (
    <span className={cls} style={style}>
      {icon && <Icon path={icon} size={14} />}
      {children}
    </span>
  );
}

const confidenceTone: Record<ConfidenceBand, 'teal' | 'amber' | 'rose' | 'slate'> = {
  High: 'teal',
  Moderate: 'amber',
  Low: 'rose',
  Unacceptable: 'slate',
};

export function ConfidenceChip({ band }: { band: ConfidenceBand }) {
  return <Chip tone={confidenceTone[band]}>{band} confidence</Chip>;
}

export function TrustBadge({ label = 'Scoring Logic Locked' }: { label?: string }) {
  return (
    <span
      title="Source scoring metadata is immutable"
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 border border-teal-100 bg-teal-100 rounded-sm px-2 py-[3px]"
    >
      🔒 {label}
    </span>
  );
}

// Name-hashed gradient avatar (design app/ui.jsx Avatar): deterministic palette colour,
// 30% radius, display-font initials, optional focus ring.
const AVATAR_PALETTE = [
  '#4F46E5',
  '#0D9488',
  '#C2820B',
  '#7C3AED',
  '#0EA5E9',
  '#D03A2C',
  '#3730A3',
  '#0F766E',
];

export function Avatar({
  name,
  size = 38,
  ring = false,
}: {
  name: string;
  size?: number;
  ring?: boolean;
}) {
  const initials =
    (name || '?')
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?';
  const idx =
    (name || '').split('').reduce((a, ch) => a + ch.charCodeAt(0), 0) % AVATAR_PALETTE.length;
  const c = AVATAR_PALETTE[idx];
  return (
    <span
      aria-hidden
      className="inline-grid place-items-center flex-none text-white font-display font-bold tracking-[-0.02em]"
      style={{
        width: size,
        height: size,
        borderRadius: '30%',
        fontSize: size * 0.38,
        background: `linear-gradient(140deg, ${c}, ${c}cc)`,
        boxShadow: ring ? `0 0 0 3px var(--surface), 0 0 0 4px ${c}40` : 'none',
      }}
    >
      {initials}
    </span>
  );
}

export function ScoreBar({
  value,
  max = 100,
  label,
  // Design ScoreBar (app/ui.jsx): color + height are caller-driven (e.g. teal for "best",
  // tone dot for index bars). Defaults preserve the prior indigo-500 / 8px look.
  color = 'var(--indigo-500)',
  height = 8,
}: {
  value: number;
  max?: number;
  label?: string;
  color?: string;
  height?: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label ?? 'score'}
    >
      <div className="bg-track rounded-full overflow-hidden" style={{ height }}>
        {/* Fill width + color are computed from the value; kept inline. */}
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export function Ring({
  value,
  size = 64,
  // Design Ring (app/ui.jsx): color + stroke are caller-driven (e.g. teal for completed,
  // stroke 7 for the assessment-detail hero). Defaults preserve the prior look.
  stroke = 6,
  color = 'var(--indigo-500)',
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r = (size - stroke - 2) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <svg width={size} height={size} role="img" aria-label={`${pct}%`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--track)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (c * pct) / 100}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size > 70 ? 18 : 14}
        fontWeight={700}
        fill="var(--text)"
      >
        {pct}
      </text>
    </svg>
  );
}

/** Animated number; respects reduced motion (instant) — constitution XII. */
export function CountUp({ to, durationMs = 700 }: { to: number; durationMs?: number }) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? to : 0);
  useEffect(() => {
    if (reduced) {
      setN(to);
      return;
    }
    let raf = 0;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / durationMs);
      setN(Math.round(to * p));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, durationMs, reduced]);
  return <>{n}</>;
}

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span title={label} aria-label={label} className="inline-flex">
      {children}
    </span>
  );
}

export function DataTable<T>({
  columns,
  rows,
  getKey,
  stagger = false,
}: {
  columns: { key: string; header: string; render: (row: T) => ReactNode }[];
  rows: T[];
  getKey: (row: T) => string;
  /** Spec 010 / US2 (FR-011/012): stagger the first 10 rows' entrance; reduced-motion → no animation. */
  stagger?: boolean;
}) {
  const reduced = useReducedMotion();
  const animate = stagger && !reduced;
  return (
    // Flush table shell (design TableShell): bordered, rounded, no padding — the table runs
    // edge-to-edge so callers should NOT wrap this in a padded Card.
    <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-surface-2">
          <tr className="text-start text-text-3 border-b border-border">
            {columns.map((c) => (
              <th
                key={c.key}
                className="py-2.5 px-3 font-semibold text-start text-[11.5px] uppercase tracking-[0.03em]"
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={getKey(row)}
              className="border-t border-border-soft transition-colors hover:bg-surface-2"
              style={
                animate
                  ? {
                      animation: 'nx-row-in .4s var(--ease-out) both',
                      animationDelay: `${(i < 10 ? i : 0) * 40}ms`,
                    }
                  : undefined
              }
            >
              {columns.map((c) => (
                <td key={c.key} className="py-2.5 px-3">
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex gap-2 list-none flex-wrap">
      {steps.map((s, i) => (
        <li
          key={s}
          className={`flex items-center gap-2 text-[13px] ${
            i <= current ? 'text-text' : 'text-text-3'
          }`}
        >
          <span
            className={`inline-grid place-items-center w-[26px] h-[26px] rounded-full text-xs font-bold font-display ${
              i < current
                ? 'bg-teal-600 text-white'
                : i === current
                  ? 'bg-indigo-500 text-white'
                  : 'bg-canvas-2 text-text-3 border border-border'
            }`}
          >
            {i < current ? '✓' : i + 1}
          </span>
          {s}
        </li>
      ))}
    </ol>
  );
}

export function Toast({
  tone = 'info',
  children,
}: {
  tone?: 'info' | 'success' | 'caution' | 'error';
  children: ReactNode;
}) {
  const colors = {
    info: 'var(--indigo-500)',
    success: 'var(--teal-500)',
    caution: 'var(--amber-600)',
    error: 'var(--rose-600)',
  };
  return (
    <div
      role="status"
      className="bg-surface border border-border border-s-[3px] rounded-md shadow-md py-2.5 px-3.5 text-sm"
      // Accent color is tone-driven (runtime); applied to the logical start border inline.
      style={{ borderInlineStartColor: colors[tone] }}
    >
      {children}
    </div>
  );
}

export function Timeline({
  items,
}: {
  items: { id: string; label: string; detail?: string; time?: string }[];
}) {
  const baseId = useId();
  return (
    <ol className="list-none grid gap-3.5 ps-2">
      {items.map((it) => (
        <li key={it.id || `${baseId}-${it.label}`} className="relative ps-[18px]">
          <span className="absolute start-0 top-[5px] w-2 h-2 rounded-full bg-indigo-500" />
          <div className="text-sm font-semibold">{it.label}</div>
          {it.detail && <div className="text-[13px] text-text-2">{it.detail}</div>}
          {it.time && <div className="text-xs text-text-3">{it.time}</div>}
        </li>
      ))}
    </ol>
  );
}
