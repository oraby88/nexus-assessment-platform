// Nex Robot Companion (Spec 011 / US2). A persistent in-app guide mounted once in the shared Shell
// (Admin + User). Shows a per-page hint on entry, then auto-collapses to a re-openable avatar; on by
// default, dismissible with a persisted preference; the hint is announced once per page via a polite
// live region; never traps focus; gentle CSS float (no parallax) gated on reduced-motion.
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion, useCompanion } from '@/hooks';
import { hintForPath } from './hints';

const AUTO_COLLAPSE_MS = 6000;

export function RobotCompanion() {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const { enabled, setEnabled } = useCompanion();
  const [bubbleOpen, setBubbleOpen] = useState(true);
  const hint = hintForPath(pathname);

  // On each page (route change), re-open the hint bubble briefly then auto-collapse to the avatar.
  useEffect(() => {
    if (!enabled) return;
    setBubbleOpen(true);
    const t = window.setTimeout(() => setBubbleOpen(false), AUTO_COLLAPSE_MS);
    return () => window.clearTimeout(t);
  }, [pathname, enabled]);

  // Dismissed → a small, unobtrusive restore affordance (preference persists across reloads).
  if (!enabled) {
    return (
      <button
        type="button"
        onClick={() => setEnabled(true)}
        className="fixed bottom-4 end-4 z-[1200] rounded-full bg-indigo-500 text-white text-xs font-semibold py-1.5 px-3 shadow-md"
      >
        Nex
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 end-4 z-[1200] flex items-end gap-2 max-w-[280px]">
      {/* Announce the hint once per page (on change) without stealing focus. */}
      <span role="status" aria-live="polite" className="sr-only">
        {hint}
      </span>

      {bubbleOpen && (
        <div
          role="note"
          aria-label="Nex hint"
          className="relative bg-surface border border-border rounded-lg shadow-md p-3 pe-7 text-[13px] text-text"
        >
          {hint}
          <button
            type="button"
            onClick={() => setEnabled(false)}
            aria-label="Dismiss the Nex companion"
            className="absolute top-1 end-1 text-text-3 leading-none px-1"
          >
            ×
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setBubbleOpen((o) => !o)}
        aria-label="Nex companion — show or hide the hint"
        aria-expanded={bubbleOpen}
        className="shrink-0 w-12 h-12 rounded-full bg-indigo-500 text-white grid place-items-center shadow-lg text-xl"
        // Gentle non-parallax float; reduced-motion → no animation (also enforced globally).
        style={reduced ? undefined : { animation: 'nx-float 3s var(--ease) infinite' }}
      >
        <span aria-hidden>🤖</span>
      </button>
    </div>
  );
}
