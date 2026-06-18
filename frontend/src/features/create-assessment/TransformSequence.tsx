// Discovery → Assessment Transform Sequence (Spec 011 / US3; Spec 012 / T028 visual parity with
// project/app/transform_sequence.jsx). A skippable cinematic at the assembly→review transition:
// answers → requirements → dimensions → governed questions → assembled. GSAP drives the phase TIMING
// (lazy-loaded); per-phase stages enter via the `nx-fade-up`/`nx-scale-in` keyframes, which the global
// prefers-reduced-motion guard neutralizes — so reduced motion (or GSAP unavailable) jumps to the final
// phase and holds, then onDone. Skippable in one action (Skip or Esc). Display copy only — questions
// come from the validated bank, never invented (constitution IX); no scores/restricted content.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon, sparkles, lock, check, layers, shieldCheck, target } from '@/components/ui/icons';
import { useReducedMotion } from '@/hooks';
import { loadGsap } from '@/lib/gsap';

const PHASES = [
  { key: 'read', label: 'Reading your answers', sub: 'Interpreting the interview' },
  {
    key: 'requirements',
    label: 'Structuring requirements',
    sub: 'Compressing answers into a profile',
  },
  { key: 'dimensions', label: 'Mapping to dimensions', sub: 'Linking requirements to the model' },
  {
    key: 'questions',
    label: 'Selecting governed questions',
    sub: 'From the validated bank — never invented',
  },
  { key: 'assembled', label: 'Assessment assembled', sub: 'Ready for your review' },
] as const;

const REQS = [
  'Dependable follow-through',
  'Composure under pressure',
  'Evidence-based decisions',
  'Integrity in ambiguity',
  'Regulated reporting',
  'Team leadership',
];
const DIMS: [string, string][] = [
  ['D1', 'Conscientious Execution'],
  ['D1', 'Integrity Orientation'],
  ['D2', 'Decision Complexity'],
  ['D2', 'Numerical Reasoning'],
  ['D4', 'Self-Regulation'],
  ['D1', 'Emotional Steadiness'],
];
const QTYPES: [string, string][] = [
  ['Likert', '#4F46E5'],
  ['Forced choice', '#0D9488'],
  ['Situational', '#C2820B'],
  ['Cognitive', '#7C3AED'],
  ['Likert', '#4F46E5'],
];

const REDUCED_HOLD_MS = 600;
const enter = (delay = 0, name = 'nx-fade-up'): React.CSSProperties => ({
  animation: `${name} .42s var(--ease-out) both`,
  animationDelay: `${delay}s`,
});

export function TransformSequence({
  onDone,
  count,
}: {
  onDone: () => void;
  /** Real selected-item count, shown on the assembled card (design shows a concrete tally). */
  count?: number;
}) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const doneRef = useRef(false);
  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  }, [onDone]);

  useEffect(() => {
    if (reduced) {
      setPhase(PHASES.length - 1);
      const t = window.setTimeout(finish, REDUCED_HOLD_MS);
      return () => window.clearTimeout(t);
    }
    let alive = true;
    let tl: { kill: () => void } | undefined;
    loadGsap()
      .then((gsap) => {
        if (!alive) return;
        const timeline = gsap.timeline({ onComplete: finish });
        PHASES.forEach((_, i) =>
          timeline.call(() => setPhase(i), undefined, i === 0 ? 0 : '+=0.9'),
        );
        timeline.to({}, { duration: 0.9 }); // hold the final phase
        tl = timeline;
      })
      .catch(() => window.setTimeout(finish, REDUCED_HOLD_MS));
    return () => {
      alive = false;
      tl?.kill();
    };
  }, [reduced, finish]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [finish]);

  const cur = PHASES[phase];

  return (
    <div
      aria-label="Assembling your governed assessment"
      className="fixed inset-0 z-[1300] overflow-hidden flex flex-col items-center justify-center p-6 text-white"
      style={{ background: 'radial-gradient(ellipse at 50% 32%, #18203A, #0B1020 70%)' }}
    >
      {/* grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(rgba(120,130,180,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(120,130,180,.08) 1px,transparent 1px)',
          backgroundSize: '46px 46px',
          maskImage: 'radial-gradient(ellipse at 50% 40%,black,transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%,black,transparent 75%)',
        }}
      />

      <button
        onClick={finish}
        className="absolute top-[18px] right-[22px] text-[12.5px] font-semibold px-3 py-[7px] rounded-full"
        style={{ color: 'rgba(255,255,255,.55)', border: '1px solid rgba(255,255,255,.16)' }}
      >
        Skip <span aria-hidden>→</span>
      </button>

      {/* header */}
      <div className="relative text-center mb-9 min-h-[64px]">
        <div
          className="inline-flex items-center gap-2 px-3 py-[5px] rounded-full mb-3.5"
          style={{ background: 'rgba(99,102,241,.18)', border: '1px solid rgba(165,176,248,.3)' }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#22D3C4', boxShadow: '0 0 8px #22D3C4' }}
          />
          <span
            className="text-[11.5px] font-bold uppercase tracking-[0.08em]"
            style={{ color: '#A5B0F8' }}
          >
            Nexus Agent · Synthesizing
          </span>
        </div>
        <h2
          key={phase}
          className="font-display text-[26px] font-extrabold tracking-[-0.02em] text-white"
          style={enter()}
          role="status"
          aria-live="polite"
        >
          {cur.label}
        </h2>
        <p key={`s${phase}`} className="text-sm mt-1.5" style={{ color: 'rgba(255,255,255,.6)' }}>
          {cur.sub}
        </p>
      </div>

      {/* stage */}
      <div
        key={`stage${phase}`}
        className="relative w-full max-w-[620px] h-[240px] flex items-center justify-center"
      >
        {phase === 0 && (
          <div className="absolute inset-0 grid place-items-center">
            {REQS.map((_, i) => {
              const a = (i / REQS.length) * Math.PI * 2;
              return (
                <span
                  key={i}
                  className="absolute w-[46px] h-[30px] rounded-[9px]"
                  style={{
                    background: 'rgba(255,255,255,.08)',
                    border: '1px solid rgba(255,255,255,.16)',
                    left: `calc(50% + ${Math.cos(a) * 150}px - 23px)`,
                    top: `calc(50% + ${Math.sin(a) * 78}px - 15px)`,
                    ...enter(i * 0.06),
                  }}
                />
              );
            })}
            <span
              className="w-16 h-16 rounded-full grid place-items-center"
              style={{
                background: 'linear-gradient(140deg,#4F46E5,#14B8A6)',
                ...enter(0, 'nx-scale-in'),
              }}
            >
              <Icon path={sparkles} size={28} style={{ color: '#fff' }} />
            </span>
          </div>
        )}

        {phase === 1 && (
          <div className="absolute inset-0 flex flex-wrap gap-2.5 items-center justify-center px-5">
            {REQS.map((r, i) => (
              <span
                key={i}
                className="px-[15px] py-[9px] rounded-[10px] text-[13.5px] font-semibold"
                style={{
                  background: 'rgba(99,102,241,.2)',
                  border: '1px solid rgba(165,176,248,.34)',
                  color: '#E9ECF5',
                  ...enter(i * 0.06),
                }}
              >
                {r}
              </span>
            ))}
          </div>
        )}

        {phase === 2 && (
          <div className="absolute inset-0 flex flex-col gap-2.5 justify-center max-w-[440px] mx-auto">
            {DIMS.map(([code, name], i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-[10px] px-3 py-2.5"
                style={{
                  background: 'rgba(255,255,255,.05)',
                  border: '1px solid rgba(255,255,255,.1)',
                  ...enter(i * 0.06),
                }}
              >
                <span
                  className="font-mono text-[10.5px] font-bold w-5"
                  style={{ color: '#A5B0F8' }}
                >
                  {code}
                </span>
                <span className="flex-1 text-[13px] font-semibold text-white">{name}</span>
                <span
                  className="w-[60px] h-[5px] rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,.1)' }}
                >
                  <span
                    className="block h-full rounded-full"
                    style={{
                      background: i < 2 ? '#F2A096' : '#A5B0F8',
                      ...enter(i * 0.06, 'nx-bar-grow'),
                    }}
                  />
                </span>
              </div>
            ))}
          </div>
        )}

        {phase === 3 && (
          <div className="absolute inset-0 flex flex-wrap gap-3 items-center justify-center px-4">
            {QTYPES.map(([t, c], i) => (
              <div
                key={i}
                className="w-[104px] h-[128px] rounded-[13px] p-3 flex flex-col gap-[7px]"
                style={{
                  background: 'rgba(255,255,255,.06)',
                  border: '1px solid rgba(255,255,255,.13)',
                  ...enter(i * 0.08),
                }}
              >
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.04em]"
                  style={{ color: c }}
                >
                  {t}
                </span>
                <span
                  className="h-[5px] rounded-[9px]"
                  style={{ background: 'rgba(255,255,255,.18)' }}
                />
                <span
                  className="h-[5px] rounded-[9px] w-[70%]"
                  style={{ background: 'rgba(255,255,255,.12)' }}
                />
                <span className="flex-1" />
                <Icon path={lock} size={13} style={{ color: 'rgba(255,255,255,.4)' }} />
              </div>
            ))}
          </div>
        )}

        {phase === 4 && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={enter(0, 'nx-scale-in')}
          >
            <div
              className="w-full max-w-[420px] rounded-[18px] px-7 py-6"
              style={{
                background: 'rgba(255,255,255,.05)',
                border: '1px solid rgba(165,176,248,.3)',
                boxShadow: '0 20px 50px -16px rgba(0,0,0,.5)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-[42px] h-[42px] rounded-xl grid place-items-center"
                  style={{ background: '#0D9488' }}
                >
                  <Icon path={check} size={22} stroke={3} style={{ color: '#fff' }} />
                </span>
                <div>
                  <div className="text-base font-bold text-white leading-tight">
                    Your governed assessment
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,.55)' }}>
                    {count != null ? `${count} governed items` : 'Governed items'} · ready for your
                    review
                  </div>
                </div>
              </div>
              {(
                [
                  [layers, 'Requirements mapped to dimensions'],
                  [shieldCheck, 'All logic locked & governed'],
                  [target, 'Full job-requirement coverage'],
                ] as [string, string][]
              ).map(([icon, text], i) => (
                <div key={i} className="flex items-center gap-2.5 py-[7px]" style={enter(i * 0.08)}>
                  <Icon path={icon} size={15} style={{ color: '#22D3C4' }} />
                  <span className="text-[13px]" style={{ color: 'rgba(255,255,255,.82)' }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* phase progress dots */}
      <ol className="relative flex gap-2 mt-9" aria-hidden>
        {PHASES.map((p, i) => (
          <li
            key={p.key}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === phase ? 22 : 8,
              background: i <= phase ? '#4F46E5' : 'rgba(255,255,255,.18)',
            }}
          />
        ))}
      </ol>

      <p className="relative text-xs mt-4" style={{ color: 'rgba(255,255,255,.45)' }}>
        Questions are selected from the validated bank — never invented.
      </p>
    </div>
  );
}
