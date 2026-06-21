// Nex Robot Companion (Spec 011 / US2). A persistent in-app guide mounted once in the shared Shell
// (Admin + User). Shows a per-page hint on entry, then auto-collapses to a re-openable avatar; on by
// default, dismissible with a persisted preference; the hint is announced once per page via a polite
// live region; never traps focus; gentle CSS float (no parallax) gated on reduced-motion.
// Spec 012: parity with app/robot_companion.jsx — "Nex · AI guide" branded bubble + dark robot orb
// (aura glow + NexusRobot + teal status dot), replacing the prior flat emoji button.
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion, useCompanion } from '@/hooks';
import { hintForPath } from './hints';
import { NexusRobot } from './NexusRobot';

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
    <div className="fixed bottom-4 end-4 z-[1200] flex flex-col items-end gap-2.5 max-w-[260px]">
      {/* Announce the hint once per page (on change) without stealing focus. */}
      <span role="status" aria-live="polite" className="sr-only">
        {hint}
      </span>

      {bubbleOpen && (
        <div
          role="note"
          aria-label="Nex hint"
          className="relative bg-surface border border-border rounded-[16px_16px_4px_16px] shadow-lg p-3 pe-7 max-w-[240px]"
        >
          {/* Branded header — teal glow dot + "Nex · AI guide" (design robot_companion.jsx). */}
          <div className="flex items-center gap-[7px] mb-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full flex-none"
              style={{ background: 'var(--teal-500)', boxShadow: '0 0 8px var(--teal-500)' }}
            />
            <span className="text-[11px] font-bold tracking-[0.06em] uppercase text-indigo-600">
              Nex · AI guide
            </span>
          </div>
          <div className="text-[13px] leading-[1.5] text-text font-medium">{hint}</div>
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
        className="relative shrink-0 bg-transparent border-none p-0 cursor-pointer"
        // Gentle non-parallax float; reduced-motion → no animation (also enforced globally).
        style={reduced ? undefined : { animation: 'nx-float 3s var(--ease) infinite' }}
      >
        {/* Aura glow behind the orb (static — reduced-motion-safe). */}
        <span
          aria-hidden
          className="absolute rounded-full"
          style={{
            inset: '-14%',
            background:
              'radial-gradient(circle, rgba(99,102,241,.5), rgba(13,148,136,.16) 50%, transparent 70%)',
            filter: 'blur(4px)',
          }}
        />
        {/* Dark robot orb */}
        <span
          className="relative grid place-items-center w-[58px] h-[58px] rounded-full overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, rgba(20,26,44,.92), rgba(12,16,28,.95))',
            border: '1px solid rgba(165,176,248,.3)',
            boxShadow: '0 14px 30px -10px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.12)',
          }}
        >
          <NexusRobot size={60} compact />
        </span>
        {/* Status dot */}
        <span
          aria-hidden
          className="absolute rounded-full"
          style={{
            top: '6%',
            right: '6%',
            width: 13,
            height: 13,
            background: 'var(--teal-500)',
            border: '2.5px solid var(--surface)',
            boxShadow: '0 0 8px var(--teal-500)',
          }}
        />
      </button>
    </div>
  );
}
