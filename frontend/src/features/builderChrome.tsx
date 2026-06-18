// Chrome for the full-screen, immersive flows (builders + pre-assessment). Kept OUT of
// placeholder.tsx because the router eagerly imports Placeholder from there — these belong only in
// the lazy chunks of the screens that use them (budget: ≤260 KB eager).
import type { ReactNode } from 'react';
import { ThemeToggle, IconButton } from '@/components/ui';
import { Icon, x } from '@/components/ui/icons';

/** Compact Nexus mark for the light builder/focus top bar (indigo square + white glyph). */
export function BuilderMark() {
  return (
    <svg width={26} height={26} viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect width="32" height="32" rx="8" fill="var(--indigo-500)" />
      <path
        d="M11 21V11l10 10V11"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Full-screen builder top bar (design Create* header): mark + title, theme toggle, and a
// right-aligned action cluster (Cancel / Save / Activate).
export function BuilderTopBar({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <div className="flex-none h-[60px] flex items-center gap-4 px-6 bg-surface border-b border-border">
      <BuilderMark />
      <div className="text-[15px] font-bold">{title}</div>
      <div className="flex-1" />
      <ThemeToggle />
      {actions}
    </div>
  );
}

// Full-screen focus frame for the immersive candidate flow (design user_assessment.jsx FocusFrame):
// top bar with the Candidate-Portal wordmark + a "Step X of N" label + theme toggle + save-&-exit,
// over a centered scroll body. Used by Overview / Consent / Instructions.
export function FocusFrame({
  label,
  onExit,
  max = 720,
  children,
}: {
  label?: string;
  onExit: () => void;
  max?: number;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-canvas">
      <div className="flex-none h-[58px] flex items-center gap-3.5 px-6 bg-surface border-b border-border">
        <BuilderMark />
        <div className="leading-none">
          <div className="font-display font-bold text-[15px] tracking-[-0.02em]">Nexus</div>
          <div className="text-[10px] font-semibold text-text-3 tracking-[0.08em] uppercase mt-px">
            Candidate Portal
          </div>
        </div>
        <div className="flex-1" />
        {label && <span className="text-[12.5px] text-text-3 font-semibold">{label}</span>}
        <ThemeToggle />
        <IconButton label="Save & exit" onClick={onExit}>
          <Icon path={x} size={18} />
        </IconButton>
      </div>
      <div className="flex-1 overflow-auto flex justify-center px-6 py-10">
        <div className="w-full" style={{ maxWidth: max }}>
          {children}
        </div>
      </div>
    </div>
  );
}
