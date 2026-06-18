// Minimal design-system primitives for the foundation increment.
// Migrated to Tailwind utilities (spec 0091): token-driven via the theme bridge in
// tailwind.config.ts, theme-reactive via CSS vars, RTL-safe (logical utilities). Callers may still
// override via the `style`/`className` props; dynamic/computed values stay inline by design.
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { useTheme } from '@/hooks';
import { Icon } from './icons';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

// Variant colors/borders/elevation mirror the design Button (app/ui.jsx): primary/danger use a
// transparent border + glow, secondary a strong border + subtle shadow.
const btnVariant: Record<Variant, string> = {
  primary: 'bg-indigo-500 text-white border border-transparent shadow-indigo',
  secondary: 'bg-surface text-text border border-border-strong shadow-xs',
  ghost: 'bg-transparent text-text-2 border border-transparent',
  danger: 'bg-rose-600 text-white border border-transparent',
};

export function Button({
  variant = 'primary',
  icon,
  children,
  className,
  ...rest
}: {
  variant?: Variant;
  /** Spec 012 / US2 (FR-PAR-012): optional leading icon path (from components/ui/icons). */
  icon?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      // Spec 010 / US4 (FR-018): subtle hover lift + press feedback. Transitions are zeroed under
      // prefers-reduced-motion by the global rule; the :focus-visible ring (globals.css) is
      // independent of motion (FR-020). inline-flex centers an optional leading icon + label.
      className={`inline-flex items-center justify-center gap-2 px-4 py-[9px] rounded-md font-semibold text-sm whitespace-nowrap transition-[filter,background,transform] duration-150 hover:-translate-y-px hover:brightness-[1.04] active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:brightness-100 ${btnVariant[variant]} ${className ?? ''}`}
      {...rest}
    >
      {icon && <Icon path={icon} size={16} />}
      {children}
    </button>
  );
}

export function Card({
  children,
  style,
  className,
  id,
}: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  /** Optional anchor id (e.g. for in-page section navigation). */
  id?: string;
}) {
  return (
    <div
      id={id}
      // Spec 010 / US4 (FR-018): gentle hover elevation; transition zeroed under reduced-motion.
      className={`bg-surface border border-border rounded-lg shadow-sm p-5 transition-shadow duration-200 hover:shadow-md ${className ?? ''}`}
      style={style}
    >
      {children}
    </div>
  );
}

// Status → tone name (mirrors the design STATUS_MAP in app/ui.jsx). The tone resolves to the
// --tone-*-{bg,fg,dot} token trio so the badge gets the saturated dot, matching the source.
const STATUS_TONE: Record<string, string> = {
  Completed: 'teal',
  'In Progress': 'indigo',
  'Not Started': 'slate',
  Valid: 'teal',
  'Pass With Limits': 'amber',
  Incomplete: 'amber',
  'Valid but Uninterpretable': 'amber',
  Invalid: 'rose',
  Deferred: 'slate',
  Cancelled: 'slate',
  Expired: 'rose',
  Processing: 'indigo',
  Released: 'teal',
  'Released with Caution': 'amber',
  'Partial Release': 'amber',
  'Blocked Section': 'rose',
  Unavailable: 'slate',
  Draft: 'slate',
  'Under Review': 'amber',
  Active: 'indigo',
  Validated: 'teal',
  Archived: 'slate',
  '—': 'slate',
};

export function StatusBadge({
  status,
  dot = true,
  size = 'md',
}: {
  status: string;
  /** Leading saturated tone dot (design StatusBadge default `dot=true`). */
  dot?: boolean;
  size?: 'sm' | 'md';
}) {
  // Tone is resolved at runtime from the status, so the token vars stay inline (dynamic).
  const tone = STATUS_TONE[status] ?? 'slate';
  const pad = size === 'sm' ? 'px-2 py-[2px]' : 'px-2.5 py-[3px]';
  const fs = size === 'sm' ? 'text-[11px]' : 'text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap leading-tight ${pad} ${fs}`}
      style={{ background: `var(--tone-${tone}-bg)`, color: `var(--tone-${tone}-fg)` }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-none"
          style={{ background: `var(--tone-${tone}-dot)` }}
        />
      )}
      {status}
    </span>
  );
}

export function EmptyState({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="text-center py-12 px-5 text-text-3">
      <div className="font-display text-lg text-text-2">{title}</div>
      {sub && <div className="mt-2 text-sm">{sub}</div>}
    </div>
  );
}

export function Skeleton({
  height = 16,
  width = '100%',
}: {
  height?: number;
  width?: number | string;
}) {
  return (
    <div
      aria-hidden
      className="rounded-sm"
      style={{
        // height/width are props; the shimmer gradient + animation are intentionally inline.
        height,
        width,
        background:
          'linear-gradient(90deg, var(--track) 0px, var(--surface-2) 200px, var(--track) 400px)',
        backgroundSize: '800px 100%',
        // Spec 010 / US4 (FR-019): brand shimmer timing matching the design source (1.4s).
        animation: 'nx-shimmer 1.4s linear infinite',
      }}
    />
  );
}

export function ThemeToggle() {
  const { resolved, toggle } = useTheme();
  return (
    <Button
      variant="secondary"
      onClick={toggle}
      aria-label="Toggle theme"
      style={{ padding: '7px 12px' }}
    >
      {resolved === 'light' ? '🌙 Dark' : '☀ Light'}
    </Button>
  );
}

// Extended primitives (FR-FND-005).
export * from './primitives';
