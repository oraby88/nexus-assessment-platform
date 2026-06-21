// Cinematic Landing — home page (Spec 011 / Spec 012 T033). Faithful rebuild of project/app/landing.jsx:
// animated Nexus robot, starfield + grid atmosphere, hero, trust strip, platform/domains/intelligence/
// governance sections, stats band, final CTA, footer. Content is visible by default (the resting state
// is final) so reduced-motion (GSAP never loads) renders complete + static; the CSS float/twinkle/aura
// keyframes are neutralized by the global prefers-reduced-motion guard. GSAP adds a non-blocking hero
// entrance only (no scroll parallax — keeps it jank-free). Lazy route → stays out of the eager chunk.
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui';
import {
  Icon,
  arrowRight,
  chevronDown,
  agent,
  shieldCheck,
  layers,
  lock,
  eye,
  shield,
  flag,
} from '@/components/ui/icons';
import { useReducedMotion } from '@/hooks';
import { loadGsap } from '@/lib/gsap';
import { NexusRobot } from '@/components/companion/NexusRobot';

const DOMAINS = [
  {
    code: 'D1',
    label: 'Character & Work Style',
    sci: 'Personality Architecture',
    status: 'active',
    color: '#4F46E5',
  },
  {
    code: 'D2',
    label: 'Thinking & Problem Solving',
    sci: 'Cognitive Architecture',
    status: 'active',
    color: '#0D9488',
  },
  {
    code: 'D3',
    label: 'Drivers & Motivation',
    sci: 'Motivational & Driver Architecture',
    status: 'phase2',
    color: '#7C3AED',
  },
  {
    code: 'D4',
    label: 'Emotional Intelligence & Relationships',
    sci: 'Emotional & Social Functioning',
    status: 'active',
    color: '#C2820B',
  },
  {
    code: 'D5',
    label: 'Workplace Effectiveness',
    sci: 'Applied Work & Leadership',
    status: 'phase2',
    color: '#0EA5E9',
  },
  {
    code: 'D6',
    label: 'Contextual Alignment',
    sci: 'Contextual Alignment & Decision Influence',
    status: 'derived',
    color: '#3730A3',
  },
];

/** Compact Nexus brand mark (concentric rings + nodes + N). */
function NexusMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden>
      <defs>
        <linearGradient id="nm-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4F46E5" />
          <stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      <g transform="translate(100,100)">
        <circle r="84" fill="none" stroke="url(#nm-g)" strokeWidth="7" opacity="0.35" />
        <circle r="58" fill="none" stroke="url(#nm-g)" strokeWidth="7" opacity="0.55" />
        <circle cx="0" cy="-84" r="9" fill="#6366F1" />
        <circle cx="73" cy="42" r="9" fill="#14B8A6" />
        <circle cx="-73" cy="42" r="9" fill="#7C3AED" />
        <circle r="34" fill="url(#nm-g)" />
        <path
          d="M-12 -14 L-12 14 M-12 -14 L12 14 M12 -14 L12 14"
          stroke="#fff"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

function StarField() {
  const dots = useRef(
    [...Array(46)].map((_, i) => ({
      x: (i * 37) % 100,
      y: (i * 53) % 100,
      s: ((i * 7) % 20) / 10 + 0.5,
      d: ((i * 11) % 40) / 10 + 2,
      delay: ((i * 13) % 40) / 10,
      teal: i % 3 === 0,
    })),
  ).current;
  return (
    <div
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
      aria-hidden
    >
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.s,
            height: d.s,
            borderRadius: '50%',
            background: d.teal ? '#22D3C4' : '#A5B0F8',
            opacity: 0.6,
            animation: `nx-twinkle ${d.d}s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Eyebrow({ children }: { children: string }) {
  return <div className="lp-eyebrow">{children}</div>;
}

export function CinematicLanding() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const onEnter = () => navigate('/login');
  const onUser = () => navigate('/invitation');

  // Non-blocking hero entrance (lazy GSAP). Content is visible by default; the entrance only animates
  // FROM hidden, so nothing can get stuck invisible. Reduced-motion → skip entirely.
  useEffect(() => {
    if (reduced) return;
    let alive = true;
    let ctx: { revert: () => void } | undefined;
    loadGsap()
      .then((gsap) => {
        if (!alive || !rootRef.current) return;
        ctx = gsap.context(() => {
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
          tl.from('.lp-badge', { opacity: 0, y: 18, duration: 0.6 })
            .from('.lp-h1', { opacity: 0, y: 34, duration: 0.8 }, '-=0.3')
            .from('.lp-sub', { opacity: 0, y: 24, duration: 0.7 }, '-=0.5')
            .from('.lp-cta-row > *', { opacity: 0, y: 20, stagger: 0.12, duration: 0.6 }, '-=0.4')
            .from('.lp-stat', { opacity: 0, y: 18, stagger: 0.1, duration: 0.5 }, '-=0.3')
            .from(
              '.lp-herobot',
              { opacity: 0, scale: 0.7, rotate: -8, duration: 1, ease: 'back.out(1.5)' },
              '-=1.1',
            );
        }, rootRef);
      })
      .catch(() => {});
    return () => {
      alive = false;
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <div ref={rootRef} className="lp-root">
      <style>{LP_CSS}</style>

      {/* NAV */}
      <nav className="lp-nav">
        <div className="lp-brand">
          <NexusMark size={32} />
          <span className="lp-brandtext">Nexus</span>
        </div>
        <div className="lp-navlinks">
          {['Platform', 'Domains', 'Intelligence', 'Governance'].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="lp-navlink">
              {l}
            </a>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <ThemeToggle />
        <button onClick={onUser} className="lp-ghost">
          I have an invitation
        </button>
        <button onClick={onEnter} className="lp-cta-sm">
          Enter Platform <Icon path={arrowRight} size={15} />
        </button>
      </nav>

      {/* HERO */}
      <header className="lp-hero-wrap">
        <div className="lp-atmos" />
        <div className="lp-gridbg" />
        <div className="lp-stars">
          <StarField />
        </div>
        <div className="lp-hero">
          <div>
            <div className="lp-badge">
              <span className="lp-badge-dot" />
              <span className="lp-badge-text">The AI-native human-capability platform</span>
            </div>
            <h1 className="lp-h1">
              Step into a new
              <br />
              era of <span className="lp-grad">human insight</span>.
            </h1>
            <p className="lp-sub">
              Nexus measures people across six scientific domains with governed, explainable,
              context-aware intelligence. We don't reduce a person to one number — we reveal how
              they think, work, and fit.
            </p>
            <div className="lp-cta-row">
              <button onClick={onEnter} className="lp-cta-lg">
                Enter the Platform <Icon path={arrowRight} size={18} />
              </button>
              <button onClick={onUser} className="lp-cta-ghost">
                Access your assessment
              </button>
            </div>
            <div className="lp-stats">
              {[
                ['6', 'Scientific domains'],
                ['35+', 'Validated dimensions'],
                ['100%', 'Governed & auditable'],
              ].map(([n, l]) => (
                <div key={l} className="lp-stat">
                  <div className="lp-stat-n">{n}</div>
                  <div className="lp-stat-l">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="lp-herobot">
            <NexusRobot size={360} />
          </div>
        </div>
        <div className="lp-discover">
          <span>Discover</span>
          <Icon path={chevronDown} size={18} />
        </div>
      </header>

      {/* TRUST STRIP */}
      <div className="lp-trust">
        <div className="lp-trust-inner">
          <span className="lp-trust-label">TRUSTED BY MODERN TALENT TEAMS</span>
          {['MERIDIAN', 'NORTHWIND', 'AXIOM', 'VANTAGE', 'HELIOS'].map((b) => (
            <span key={b} className="lp-trust-logo">
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* PLATFORM */}
      <section id="platform" className="lp-section">
        <div className="lp-section-inner">
          <div className="lp-sechead lp-sechead-c">
            <Eyebrow>Why Nexus</Eyebrow>
            <h2 className="lp-h2">Assessment, reimagined as intelligence</h2>
          </div>
          <div className="lp-grid3">
            {[
              [
                agent,
                'AI-guided design',
                'An intelligent agent interviews you about the role, builds a structured requirements profile, and selects governed questions — adapted to your context, never invented.',
              ],
              [
                shieldCheck,
                'Governed by design',
                'Every item keeps its validated scoring, dimension and governance status. Outputs are confidence-gated, explainable, and audit-ready end to end.',
              ],
              [
                layers,
                'Context-aware fit',
                'Domain 6 fuses the person, the role blueprint and the work context into a premium contextual-alignment layer that supports real human decisions.',
              ],
            ].map(([icon, title, body]) => (
              <div key={title as string} className="lp-card">
                <div className="lp-cardicon">
                  <Icon path={icon as string} size={22} />
                </div>
                <h3 className="lp-card-h">{title as string}</h3>
                <p className="lp-card-p">{body as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOMAINS */}
      <section id="domains" className="lp-section">
        <div className="lp-section-inner">
          <div className="lp-sechead lp-sechead-c">
            <Eyebrow>The model</Eyebrow>
            <h2 className="lp-h2">Six domains. One coherent picture.</h2>
          </div>
          <div className="lp-grid3">
            {DOMAINS.map((d) => (
              <div key={d.code} className="lp-domain">
                <div className="lp-domain-top">
                  <span className="lp-domain-code" style={{ color: d.color }}>
                    {d.code}
                  </span>
                  {d.status !== 'active' && (
                    <span className="lp-domain-tag">
                      {d.status === 'derived' ? 'DERIVED' : 'PHASE 2'}
                    </span>
                  )}
                </div>
                <h4 className="lp-domain-h">{d.label}</h4>
                <p className="lp-domain-sci">{d.sci}</p>
                <div
                  className="lp-domain-bar"
                  style={{ background: `linear-gradient(90deg, ${d.color}, transparent)` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTELLIGENCE (split + robot) */}
      <section id="intelligence" className="lp-section">
        <div className="lp-split">
          <div className="lp-split-robot">
            <div style={{ position: 'relative' }}>
              <div className="lp-split-aura" />
              <NexusRobot size={300} />
            </div>
          </div>
          <div className="lp-sechead">
            <Eyebrow>The agent</Eyebrow>
            <h2 className="lp-h2 lp-h2-l">An intelligence that designs with you</h2>
            <div className="lp-steps">
              {[
                [
                  'Interviews you',
                  'It asks about responsibilities, decision complexity, pressure and non-negotiables — like a seasoned I/O psychologist.',
                ],
                [
                  'Builds the profile',
                  'Your answers assemble into a structured Job Requirements Profile in real time, chip by chip.',
                ],
                [
                  'Selects, never invents',
                  'It draws only from the governed question bank and rephrases items to your role — preserving every scoring property.',
                ],
              ].map(([t, b], i) => (
                <div key={t} className="lp-step">
                  <div className="lp-step-n">{i + 1}</div>
                  <div>
                    <div className="lp-step-h">{t}</div>
                    <p className="lp-step-p">{b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <div className="lp-band">
        <div className="lp-band-glow" />
        <div className="lp-band-inner">
          <Eyebrow>Why teams choose us</Eyebrow>
          <h2 className="lp-band-h">
            We don't just assess. We set the standard for governed human intelligence.
          </h2>
          <div className="lp-grid4">
            {[
              ['98%', 'Adoption by invited candidates'],
              ['3.2×', 'Faster role-fit decisions'],
              ['0', 'Ungoverned outputs, ever'],
              ['24mo', 'Audit trail retained'],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="lp-grad lp-bignum">{n}</div>
                <div className="lp-bignum-l">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GOVERNANCE */}
      <section id="governance" className="lp-section">
        <div className="lp-section-inner">
          <div className="lp-sechead lp-sechead-c">
            <Eyebrow>Trust</Eyebrow>
            <h2 className="lp-h2">Built for decisions that matter</h2>
          </div>
          <div className="lp-grid2">
            {[
              [
                lock,
                'Confidence-gated outputs',
                'Low-confidence results are flagged, never silently shown.',
              ],
              [
                eye,
                'Explainable, not black-box',
                'Every score traces to validated items and clear logic.',
              ],
              [shield, 'Consent-first for candidates', 'Specific, purpose-bound consent — always.'],
              [
                flag,
                'No automatic decisions',
                'Nexus informs human judgement; it never replaces it.',
              ],
            ].map(([icon, title, body]) => (
              <div key={title as string} className="lp-card lp-card-row">
                <div className="lp-cardicon" style={{ flex: 'none' }}>
                  <Icon path={icon as string} size={20} />
                </div>
                <div>
                  <h3 className="lp-card-h lp-card-h-sm">{title as string}</h3>
                  <p className="lp-card-p lp-card-p-sm">{body as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <div className="lp-final">
        <div className="lp-final-glow" />
        <div className="lp-final-inner">
          <div className="lp-final-robot">
            <NexusRobot size={150} />
          </div>
          <h2 className="lp-final-h">Ready to enter the world of Nexus?</h2>
          <p className="lp-final-p">
            Sign in to your workspace, or open your assessment invitation. The future of
            human-capability intelligence is one click away.
          </p>
          <div className="lp-cta-row lp-cta-center">
            <button onClick={onEnter} className="lp-cta-lg">
              Enter the Platform <Icon path={arrowRight} size={18} />
            </button>
            <button onClick={onUser} className="lp-cta-ghost">
              I have an invitation
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <NexusMark size={24} />
          <span className="lp-footer-name">Nexus Assessment Platform</span>
          <div style={{ flex: 1 }} />
          <span className="lp-footer-copy">
            © 2026 Nexus · Governed human-capability intelligence
          </span>
        </div>
      </footer>
    </div>
  );
}

const LP_CSS = `
.lp-root{
  --lp-bg:#06080F; --lp-text:#E9ECF5; --lp-dim:#A6AFC4; --lp-faint:#6B7488;
  --lp-line:rgba(255,255,255,.08); --lp-panel:rgba(255,255,255,.02); --lp-nav:rgba(6,8,15,.72);
  --lp-grid:rgba(120,130,180,.08); --lp-accent-bg:rgba(99,102,241,.16);
  --lp-ease:cubic-bezier(.4,0,.2,1);
  background:var(--lp-bg); color:var(--lp-text); min-height:100vh; overflow-x:hidden;
  font-family:var(--font-ui,system-ui,sans-serif);
}
.lp-nav{ position:sticky; top:0; z-index:50; display:flex; align-items:center; gap:16px; padding:16px 40px;
  background:var(--lp-nav); backdrop-filter:blur(14px); border-bottom:1px solid var(--lp-line); }
.lp-brand{ display:flex; align-items:center; gap:11px; }
.lp-brandtext{ font-family:var(--font-display); font-weight:700; font-size:19px; letter-spacing:-.02em; color:#fff; }
.lp-navlinks{ display:flex; gap:4px; margin-left:24px; }
.lp-navlink{ padding:8px 14px; font-size:14px; font-weight:500; color:var(--lp-dim); border-radius:8px; text-decoration:none; transition:all .18s var(--lp-ease); }
.lp-navlink:hover{ color:#fff; background:rgba(255,255,255,.06); }
.lp-grad{ background:linear-gradient(100deg,#A5B0F8,#22D3C4); -webkit-background-clip:text; background-clip:text; color:transparent; }
.lp-cta-sm{ display:inline-flex; align-items:center; gap:7px; padding:9px 17px; border-radius:11px; font-size:14px; font-weight:600;
  background:#4F46E5; color:#fff; box-shadow:0 8px 22px -6px rgba(79,70,229,.6); transition:all .18s var(--lp-ease); border:none; cursor:pointer; }
.lp-cta-sm:hover{ transform:translateY(-1px); filter:brightness(1.08); }
.lp-cta-lg{ display:inline-flex; align-items:center; gap:9px; padding:15px 28px; border-radius:14px; font-size:16px; font-weight:700;
  background:linear-gradient(100deg,#4F46E5,#6366F1); color:#fff; box-shadow:0 14px 34px -8px rgba(79,70,229,.65); transition:all .2s var(--lp-ease); border:none; cursor:pointer; }
.lp-cta-lg:hover{ transform:translateY(-2px); box-shadow:0 20px 44px -8px rgba(79,70,229,.8); }
.lp-cta-ghost{ display:inline-flex; align-items:center; padding:15px 26px; border-radius:14px; font-size:16px; font-weight:600;
  background:rgba(255,255,255,.05); color:#fff; border:1px solid rgba(255,255,255,.16); transition:all .2s var(--lp-ease); cursor:pointer; }
.lp-cta-ghost:hover{ background:rgba(255,255,255,.1); }
.lp-ghost{ background:none; border:none; padding:9px 16px; font-size:14px; font-weight:600; color:var(--lp-dim); border-radius:10px; cursor:pointer; transition:color .18s; }
.lp-ghost:hover{ color:#fff; }

.lp-hero-wrap{ position:relative; min-height:calc(100vh - 72px); display:flex; align-items:center; padding:0 40px; overflow:hidden; }
.lp-atmos{ position:absolute; inset:-10% 0; background:radial-gradient(ellipse at 72% 38%, rgba(79,70,229,.30), transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(13,148,136,.18), transparent 46%); }
.lp-gridbg{ position:absolute; inset:-10% 0; background-image:linear-gradient(var(--lp-grid) 1px, transparent 1px), linear-gradient(90deg, var(--lp-grid) 1px, transparent 1px);
  background-size:54px 54px; -webkit-mask-image:radial-gradient(ellipse at 50% 40%, black, transparent 78%); mask-image:radial-gradient(ellipse at 50% 40%, black, transparent 78%); }
.lp-stars{ position:absolute; inset:0; }
.lp-hero{ position:relative; z-index:2; max-width:1240px; margin:0 auto; width:100%; display:grid; grid-template-columns:1.1fr .9fr; gap:40px; align-items:center; }
.lp-badge{ display:inline-flex; align-items:center; gap:9px; padding:7px 14px; border-radius:99px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12); margin-bottom:26px; }
.lp-badge-dot{ width:7px; height:7px; border-radius:99px; background:#22D3C4; box-shadow:0 0 10px #22D3C4; }
.lp-badge-text{ font-size:12.5px; font-weight:600; color:var(--lp-dim); letter-spacing:.02em; }
.lp-h1{ font-family:var(--font-display); font-size:62px; line-height:1.04; font-weight:800; letter-spacing:-.03em; color:#fff; margin:0; }
.lp-sub{ font-size:18.5px; line-height:1.6; color:var(--lp-dim); margin-top:24px; max-width:520px; }
.lp-cta-row{ display:flex; gap:14px; margin-top:34px; flex-wrap:wrap; }
.lp-cta-center{ justify-content:center; }
.lp-stats{ display:flex; gap:30px; margin-top:42px; }
.lp-stat-n{ font-family:var(--font-display); font-size:30px; font-weight:800; color:#fff; }
.lp-stat-l{ font-size:12.5px; color:var(--lp-faint); margin-top:2px; }
.lp-herobot{ display:flex; justify-content:center; }
.lp-discover{ position:absolute; bottom:24px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:6px; color:var(--lp-faint); animation:nx-bobble 2s ease-in-out infinite; }
.lp-discover span{ font-size:11px; letter-spacing:.14em; text-transform:uppercase; }

.lp-trust{ border-top:1px solid var(--lp-line); border-bottom:1px solid var(--lp-line); background:var(--lp-panel); }
.lp-trust-inner{ max-width:1100px; margin:0 auto; padding:22px 40px; display:flex; align-items:center; gap:30px; flex-wrap:wrap; justify-content:center; }
.lp-trust-label{ font-size:12.5px; color:var(--lp-faint); font-weight:600; letter-spacing:.04em; }
.lp-trust-logo{ font-family:var(--font-display); font-size:17px; font-weight:700; color:var(--lp-faint); letter-spacing:.06em; opacity:.7; }

.lp-section{ padding:62px 40px; }
.lp-section-inner{ max-width:1100px; margin:0 auto; }
.lp-sechead-c{ text-align:center; margin-bottom:34px; }
.lp-eyebrow{ display:inline-block; font-size:12.5px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:#22D3C4; }
.lp-h2{ font-family:var(--font-display); font-size:38px; font-weight:800; letter-spacing:-.025em; color:#fff; margin-top:12px; line-height:1.1; }
.lp-h2-l{ font-size:36px; margin:12px 0 26px; }
.lp-grid3{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
.lp-grid2{ display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
.lp-grid4{ display:grid; grid-template-columns:repeat(4,1fr); gap:24px; margin-top:38px; }
.lp-card{ background:rgba(255,255,255,.025); border:1px solid var(--lp-line); border-radius:18px; padding:26px; transition:all .25s var(--lp-ease); }
.lp-card:hover{ background:rgba(255,255,255,.05); transform:translateY(-3px); border-color:rgba(165,176,248,.3); }
.lp-card-row{ display:flex; gap:14px; }
.lp-cardicon{ width:46px; height:46px; border-radius:13px; background:linear-gradient(135deg,rgba(79,70,229,.3),rgba(13,148,136,.2)); border:1px solid rgba(255,255,255,.12); display:flex; align-items:center; justify-content:center; color:#A5B0F8; }
.lp-card-h{ font-size:19px; font-weight:700; color:#fff; margin-top:18px; }
.lp-card-h-sm{ font-size:16px; margin-top:0; }
.lp-card-p{ font-size:14.5px; line-height:1.6; color:var(--lp-dim); margin-top:10px; }
.lp-card-p-sm{ font-size:13.5px; margin-top:5px; line-height:1.5; }
.lp-domain{ background:rgba(255,255,255,.025); border:1px solid var(--lp-line); border-radius:16px; padding:20px; transition:all .25s var(--lp-ease); }
.lp-domain:hover{ background:rgba(255,255,255,.05); transform:translateY(-3px); }
.lp-domain-top{ display:flex; align-items:center; justify-content:space-between; }
.lp-domain-code{ font-family:var(--font-mono,monospace); font-size:12px; font-weight:700; }
.lp-domain-tag{ font-size:9.5px; font-weight:700; padding:2px 7px; border-radius:99px; background:rgba(255,255,255,.07); color:var(--lp-faint); letter-spacing:.04em; }
.lp-domain-h{ font-size:17px; font-weight:700; color:#fff; margin-top:12px; }
.lp-domain-sci{ font-size:12.5px; color:var(--lp-faint); margin-top:5px; }
.lp-domain-bar{ height:3px; border-radius:99px; margin-top:16px; }

.lp-split{ max-width:1100px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:center; }
.lp-split-robot{ display:flex; justify-content:center; order:1; }
.lp-split-aura{ position:absolute; inset:-20%; background:radial-gradient(circle, rgba(79,70,229,.28), transparent 65%); filter:blur(10px); }
.lp-steps{ display:flex; flex-direction:column; gap:16px; }
.lp-step{ display:flex; gap:14px; }
.lp-step-n{ width:30px; height:30px; flex:none; border-radius:9px; background:var(--lp-accent-bg); color:#A5B0F8; display:flex; align-items:center; justify-content:center; font-weight:700; font-family:var(--font-display); }
.lp-step-h{ font-size:16px; font-weight:700; color:#fff; }
.lp-step-p{ font-size:14px; color:var(--lp-dim); margin-top:3px; line-height:1.55; }

.lp-band{ position:relative; padding:58px 40px; overflow:hidden; border-top:1px solid var(--lp-line); border-bottom:1px solid var(--lp-line); }
.lp-band-glow{ position:absolute; inset:0; background:radial-gradient(ellipse at 50% 50%, rgba(79,70,229,.20), transparent 60%); }
.lp-band-inner{ position:relative; max-width:1100px; margin:0 auto; text-align:center; }
.lp-band-h{ font-family:var(--font-display); font-size:40px; font-weight:800; letter-spacing:-.025em; color:#fff; margin:12px auto 0; max-width:760px; line-height:1.1; }
.lp-bignum{ font-family:var(--font-display); font-size:46px; font-weight:800; letter-spacing:-.02em; }
.lp-bignum-l{ font-size:13.5px; color:var(--lp-dim); margin-top:6px; }

.lp-final{ position:relative; padding:66px 40px 54px; text-align:center; overflow:hidden; }
.lp-final-glow{ position:absolute; inset:0; background:radial-gradient(ellipse at 50% 120%, rgba(13,148,136,.22), transparent 55%); }
.lp-final-inner{ position:relative; }
.lp-final-robot{ display:flex; justify-content:center; margin-bottom:8px; }
.lp-final-h{ font-family:var(--font-display); font-size:44px; font-weight:800; letter-spacing:-.03em; color:#fff; line-height:1.08; }
.lp-final-p{ font-size:17px; color:var(--lp-dim); margin:16px auto 0; max-width:520px; line-height:1.55; }

.lp-footer{ border-top:1px solid var(--lp-line); padding:28px 40px; background:var(--lp-panel); }
.lp-footer-inner{ max-width:1100px; margin:0 auto; display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
.lp-footer-name{ font-size:13px; font-weight:700; color:#fff; }
.lp-footer-copy{ font-size:12.5px; color:var(--lp-faint); }

@keyframes nx-robot-float{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
@keyframes nx-aura-pulse{ 0%,100%{opacity:.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.06)} }
@keyframes nx-twinkle{ 0%,100%{opacity:.15} 50%{opacity:.75} }
@keyframes nx-bobble{ 0%,100%{transform:translate(-50%,0)} 50%{transform:translate(-50%,6px)} }
@keyframes nx-spin{ to{transform:rotate(360deg)} }
@media (max-width:920px){
  .lp-hero{ grid-template-columns:1fr; text-align:center; }
  .lp-h1{ font-size:44px; }
  .lp-navlinks{ display:none; }
  .lp-nav,.lp-section,.lp-hero-wrap,.lp-band,.lp-final,.lp-trust-inner{ padding-left:20px; padding-right:20px; }
  .lp-grid3,.lp-grid4,.lp-grid2,.lp-split{ grid-template-columns:1fr; }
  .lp-split-robot{ order:0; }
  .lp-stats{ justify-content:center; }
}
@media (prefers-reduced-motion: reduce){
  .lp-root [style*="animation"]{ animation:none !important; }
}
`;
