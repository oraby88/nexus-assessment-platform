import { Suspense, lazy, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, ThemeToggle } from '@/components/ui';
import { Icon, arrowRight, arrowLeft, shieldCheck, mail } from '@/components/ui/icons';
import { useSession, toast, useT } from '@/hooks';
import { authService } from '@/services/auth/authService';

/** Compact Nexus wordmark (mark + name + optional sub) — light variant for the dark brand panel. */
function NexusWordmark({ light, sub }: { light?: boolean; sub?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={30} height={30} viewBox="0 0 200 200" aria-hidden>
        <defs>
          <linearGradient id="wm-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4F46E5" />
            <stop offset="1" stopColor="#14B8A6" />
          </linearGradient>
        </defs>
        <g transform="translate(100,100)">
          <circle r="84" fill="none" stroke="url(#wm-g)" strokeWidth="7" opacity="0.35" />
          <circle r="58" fill="none" stroke="url(#wm-g)" strokeWidth="7" opacity="0.55" />
          <circle cx="0" cy="-84" r="9" fill="#6366F1" />
          <circle cx="73" cy="42" r="9" fill="#14B8A6" />
          <circle cx="-73" cy="42" r="9" fill="#7C3AED" />
          <circle r="34" fill="url(#wm-g)" />
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
      <div>
        <div
          className="font-display font-bold text-[19px] tracking-[-0.02em]"
          style={{ color: light ? '#fff' : 'var(--text)' }}
        >
          Nexus
        </div>
        {sub && (
          <div
            className="text-[11px] font-medium uppercase tracking-[1px]"
            style={{ color: light ? 'rgba(255,255,255,.5)' : 'var(--text-3)' }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

// The public `/` landing renders the cinematic set-piece (Spec 011 / US1). It's heavy (animated robot +
// full marketing page), so it's lazy-loaded out of the eager auth bundle (≤260 KB budget, FR-PVR-012);
// the entry CTAs and routes (sign-in → /login, invitation → /invitation) live inside CinematicLanding.
const CinematicLanding = lazy(() =>
  import('@/features/landing/CinematicLanding').then((m) => ({ default: m.CinematicLanding })),
);

export function Landing() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#06080F' }} />}>
      <CinematicLanding />
    </Suspense>
  );
}

// AuthScaffold is shared by all auth screens. Migrated to Tailwind (spec 0091); the utilities are
// visually equivalent to the prior inline styles so the unmigrated screens are unaffected.
function AuthScaffold({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-[380px] max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-[22px]">{title}</h1>
          <ThemeToggle />
        </div>
        {children}
      </Card>
    </div>
  );
}

// Tailwind equivalent of the legacy inputStyle, used by the migrated AdminLogin screen (spec 0091).
const inputCls =
  'w-full py-2.5 px-3 rounded-md border border-border-strong bg-surface-2 text-text mb-3';

// Field input without the legacy stacked-margin (the split login uses explicit gaps + labels).
const fieldInput =
  'w-full py-2.5 px-3 rounded-md border border-border-strong bg-surface-2 text-text';

// Admin sign-in — split-screen (dark brand panel + form) matching app/shell.jsx AdminLogin.
export function AdminLogin() {
  const navigate = useNavigate();
  const { setSession } = useSession();
  const { t } = useT();
  const [email, setEmail] = useState('admin@meridian.co');
  const [busy, setBusy] = useState(false);
  const signIn = async () => {
    setBusy(true);
    const s = await authService.loginAdmin(email);
    setSession(s);
    navigate('/admin/dashboard');
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_0.95fr]">
      {/* brand panel (hidden on small screens) */}
      <div
        className="relative overflow-hidden hidden lg:flex flex-col justify-between p-14 text-white"
        style={{ background: 'linear-gradient(160deg,#0C111C 0%,#141C2E 55%,#1E2840 100%)' }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-50"
          style={{
            background:
              'radial-gradient(circle at 78% 18%, rgba(79,70,229,.32), transparent 42%), radial-gradient(circle at 14% 86%, rgba(13,148,136,.22), transparent 44%)',
          }}
        />
        <div className="relative">
          <NexusWordmark light sub="Assessment Platform" />
        </div>
        <div className="relative max-w-[440px]">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{
              background: 'rgba(255,255,255,.08)',
              border: '1px solid rgba(255,255,255,.12)',
            }}
          >
            <Icon path={shieldCheck} size={14} style={{ color: '#A5B0F8' }} />
            <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,.8)' }}>
              Governed · Explainable · Context-aware
            </span>
          </div>
          <h1 className="font-display text-[38px] font-bold leading-[1.12] tracking-[-0.025em]">
            Workforce assessment, measured with scientific discipline.
          </h1>
          <p
            className="text-[15.5px] mt-[18px] leading-relaxed"
            style={{ color: 'rgba(255,255,255,.62)' }}
          >
            Six domains. Governed question banks. Context-aware reports that support human judgement
            — never replace it.
          </p>
          <div className="flex gap-7 mt-9">
            {[
              ['6', 'Measured domains'],
              ['35+', 'Validated dimensions'],
              ['100%', 'Audited outputs'],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-[26px] font-bold">{n}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,.5)' }}>
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-xs" style={{ color: 'rgba(255,255,255,.4)' }}>
          © 2026 Nexus · Meridian Group deployment
        </div>
      </div>

      {/* form panel */}
      <div className="relative flex items-center justify-center p-8 bg-canvas">
        <div className="absolute top-5 right-6 flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-text-3 bg-transparent border-none"
          >
            <Icon path={arrowLeft} size={14} /> Home
          </button>
          <ThemeToggle />
        </div>
        <div className="w-full max-w-[380px]">
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-sm text-text-2 mt-1.5">Sign in to your Meridian Group workspace.</p>
          <div className="mt-7 flex flex-col gap-4">
            <label className="block">
              <span className="block text-[12.5px] font-semibold text-text-2 mb-1.5">
                {t('common.email')}
              </span>
              <input
                className={fieldInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label={t('common.email')}
              />
            </label>
            <label className="block">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[12.5px] font-semibold text-text-2">
                  {t('common.password')}
                </span>
                <button
                  onClick={() => navigate('/forgot-password')}
                  className="text-[12.5px] text-indigo-600 font-semibold bg-transparent border-none"
                >
                  {t('auth.forgotPassword')}
                </button>
              </div>
              <input
                className={fieldInput}
                type="password"
                defaultValue="demo"
                aria-label={t('common.password')}
              />
            </label>
            <label className="flex items-center gap-2.5 text-[13.5px] text-text-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="accent-indigo-500 w-[18px] h-[18px]"
              />
              Remember me on this device
            </label>
            <Button
              className="w-full inline-flex items-center justify-center gap-2"
              disabled={busy}
              onClick={signIn}
            >
              {busy ? t('auth.signingIn') : t('auth.signIn')} <Icon path={arrowRight} size={16} />
            </Button>
          </div>
          <div className="mt-6 pt-5 border-t border-border text-center">
            <p className="text-[13px] text-text-3">Have an assessment invitation?</p>
            <button
              onClick={() => navigate('/invitation')}
              className="text-[13.5px] font-semibold text-indigo-600 mt-1 bg-transparent border-none"
            >
              Go to the candidate portal →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InvitationAccess() {
  const navigate = useNavigate();
  const { setSession } = useSession();
  const { t } = useT();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<'activate' | 'signin'>('activate');
  const [code, setCode] = useState('amara');
  const [busy, setBusy] = useState(false);

  // Expired/invalid invitation state (Spec 007 / FR-PAP-004) — deferred from Spec 006.
  if (params.get('state') === 'expired') {
    return (
      <AuthScaffold title={t('auth.invitation.expiredTitle')}>
        <p className="text-sm text-text-2 mb-3.5">{t('auth.invitation.expiredBody')}</p>
        <Button className="w-full" onClick={() => navigate('/invitation')}>
          {t('auth.invitation.goToSignIn')}
        </Button>
        <button
          onClick={() => navigate('/')}
          className="mt-3 bg-transparent border-none text-text-2 text-[13px]"
        >
          {t('common.returnHome')}
        </button>
      </AuthScaffold>
    );
  }

  const submit = async () => {
    setBusy(true);
    const s =
      mode === 'activate'
        ? await authService.activateInvitation(code, 'demo')
        : await authService.loginUser('');
    setSession(s);
    toast(t('auth.signedIn'), 'success');
    navigate('/app/dashboard');
  };

  // Candidate portal — centered card on a radial gradient, matching app/user_portal.jsx UserLogin.
  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-6"
      style={{
        background: 'radial-gradient(circle at 50% 0%, var(--indigo-50), var(--canvas) 60%)',
      }}
    >
      <div className="absolute top-5 right-6 flex items-center gap-2">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-text-3 bg-transparent border-none"
        >
          <Icon path={arrowLeft} size={14} /> {t('common.returnHome')}
        </button>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[420px]">
        <div className="flex justify-center mb-5">
          <NexusWordmark sub="Candidate Portal" />
        </div>

        <Card className="shadow-lg">
          <div
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-md mb-5"
            style={{ background: 'var(--indigo-50)' }}
          >
            <Icon path={mail} size={18} style={{ color: 'var(--indigo-600)' }} />
            <div className="text-[13px] font-semibold" style={{ color: 'var(--indigo-700)' }}>
              You've been invited by Meridian Group
            </div>
          </div>

          <h2 className="text-[21px] font-bold">
            {mode === 'activate'
              ? t('auth.invitation.activateTitle')
              : t('auth.invitation.welcomeBack')}
          </h2>
          <p className="text-sm text-text-2 mt-1.5 leading-snug">{t('auth.invitation.intro')}</p>

          <div className="mt-5 flex flex-col gap-3.5">
            {mode === 'activate' ? (
              <>
                <label className="block">
                  <span className="block text-[12.5px] font-semibold text-text-2 mb-1.5">
                    {t('auth.invitation.code')}
                  </span>
                  <input
                    className={fieldInput}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    aria-label={t('auth.invitation.code')}
                  />
                </label>
                <label className="block">
                  <span className="block text-[12.5px] font-semibold text-text-2 mb-1.5">
                    {t('auth.invitation.setPassword')}
                  </span>
                  <input
                    className={fieldInput}
                    type="password"
                    aria-label={t('auth.invitation.setPassword')}
                  />
                </label>
              </>
            ) : (
              <>
                <label className="block">
                  <span className="block text-[12.5px] font-semibold text-text-2 mb-1.5">
                    {t('common.email')}
                  </span>
                  <input
                    className={fieldInput}
                    aria-label={t('common.email')}
                    defaultValue="amara.okonkwo@meridian.co"
                  />
                </label>
                <label className="block">
                  <span className="block text-[12.5px] font-semibold text-text-2 mb-1.5">
                    {t('common.password')}
                  </span>
                  <input className={fieldInput} type="password" aria-label={t('common.password')} />
                </label>
              </>
            )}
            <Button
              className="w-full inline-flex items-center justify-center gap-2"
              disabled={busy}
              onClick={submit}
            >
              {busy
                ? t('common.pleaseWait')
                : mode === 'activate'
                  ? t('auth.invitation.activateContinue')
                  : t('auth.signIn')}{' '}
              <Icon path={arrowRight} size={16} />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4 pt-2.5">
            <Icon path={shieldCheck} size={15} style={{ color: 'var(--teal-600)' }} />
            <span className="text-xs text-text-3">Private &amp; secure · GDPR compliant</span>
          </div>
        </Card>

        <div className="flex flex-col items-center gap-2 mt-4">
          <button
            onClick={() => setMode((m) => (m === 'activate' ? 'signin' : 'activate'))}
            className="text-[13px] text-text-2 font-semibold bg-transparent border-none"
          >
            {mode === 'activate'
              ? t('auth.invitation.alreadyActivated')
              : t('auth.invitation.firstTime')}
          </button>
          <button
            onClick={() => navigate('/login')}
            className="text-[13px] text-text-3 font-semibold bg-transparent border-none"
          >
            ← Back to admin sign-in
          </button>
        </div>
      </div>
    </div>
  );
}

export function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useT();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    await authService.requestReset(email); // always resolves the same (no account enumeration)
    setBusy(false);
    setSent(true);
  };

  return (
    <AuthScaffold title={t('auth.reset.title')}>
      {sent ? (
        <>
          <p className="text-sm text-text-2 mb-3.5">{t('auth.reset.sentBody')}</p>
          {/* Mock stand-in for the emailed link (no real email is sent). */}
          <Button className="w-full" onClick={() => navigate('/reset-password?token=valid-demo')}>
            {t('auth.reset.openLinkDemo')}
          </Button>
          <button
            onClick={() => navigate('/login')}
            className="mt-3 bg-transparent border-none text-text-2 text-[13px]"
          >
            {t('common.backToSignIn')}
          </button>
        </>
      ) : (
        <>
          <p className="text-[13px] text-text-2 mb-3.5">{t('auth.reset.intro')}</p>
          <input
            className={inputCls}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('common.email')}
            aria-label={t('common.email')}
            type="email"
          />
          <Button className="w-full" disabled={busy} onClick={submit}>
            {busy ? t('auth.reset.sending') : t('auth.reset.send')}
          </Button>
          <button
            onClick={() => navigate('/login')}
            className="mt-3 bg-transparent border-none text-text-2 text-[13px]"
          >
            {t('common.backToSignIn')}
          </button>
        </>
      )}
    </AuthScaffold>
  );
}

export function ResetPassword() {
  const navigate = useNavigate();
  const { t } = useT();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [tokenState, setTokenState] = useState<'checking' | 'valid' | 'expired' | 'missing'>(
    'checking',
  );
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    authService.verifyResetToken(token).then(setTokenState);
  }, [token]);

  const submit = async () => {
    if (pw.length < 8) {
      setError(t('auth.reset.tooShort'));
      return;
    }
    if (pw !== confirm) {
      setError(t('auth.reset.mismatch'));
      return;
    }
    setError('');
    setBusy(true);
    await authService.resetPassword(token, pw);
    setBusy(false);
    toast(t('auth.reset.updated'), 'success');
    navigate('/login');
  };

  if (tokenState === 'checking') {
    return (
      <AuthScaffold title={t('auth.reset.newTitle')}>
        <p className="text-sm text-text-2">{t('auth.reset.checking')}</p>
      </AuthScaffold>
    );
  }

  if (tokenState !== 'valid') {
    const stateText =
      tokenState === 'missing' ? t('auth.reset.invalidMissing') : t('auth.reset.invalidExpired');
    return (
      <AuthScaffold title={t('auth.reset.invalidTitle')}>
        <p className="text-sm text-text-2 mb-3.5">
          {t('auth.reset.invalidBody', { state: stateText })}
        </p>
        <Button className="w-full" onClick={() => navigate('/forgot-password')}>
          {t('auth.reset.requestNew')}
        </Button>
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold title={t('auth.reset.newTitle')}>
      <input
        className={inputCls}
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder={t('auth.reset.newPassword')}
        aria-label={t('auth.reset.newPassword')}
      />
      <input
        className={inputCls}
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder={t('auth.reset.confirmPassword')}
        aria-label={t('auth.reset.confirmPassword')}
      />
      {error && (
        <p className="text-rose-600 text-[13px] mb-2.5" role="alert">
          {error}
        </p>
      )}
      <Button className="w-full" disabled={busy} onClick={submit}>
        {busy ? t('auth.reset.updating') : t('auth.reset.update')}
      </Button>
    </AuthScaffold>
  );
}

export function AccessDenied() {
  const navigate = useNavigate();
  const { t } = useT();
  return (
    <div className="min-h-[60vh] grid place-items-center text-center">
      <div>
        <h1>{t('auth.accessDenied.title')}</h1>
        <p className="text-text-2 mt-2 mb-4">{t('auth.accessDenied.body')}</p>
        <Button onClick={() => navigate('/')}>{t('common.returnHome')}</Button>
      </div>
    </div>
  );
}

export function NotFound() {
  const navigate = useNavigate();
  const { session } = useSession();
  const { t } = useT();
  // Role-aware "home" so a signed-in user lands somewhere relevant (FR-PAP-011).
  const home =
    session?.role === 'admin'
      ? '/admin/dashboard'
      : session?.role === 'user'
        ? '/app/dashboard'
        : '/';
  return (
    <div className="min-h-[60vh] grid place-items-center text-center">
      <div className="max-w-[420px] p-6">
        <h1 className="text-[28px]">{t('auth.notFound.title')}</h1>
        <p className="text-text-2 mt-2 mb-4">{t('auth.notFound.body')}</p>
        <Button onClick={() => navigate(home)}>
          {home === '/' ? t('common.returnHome') : t('common.backToDashboard')}
        </Button>
      </div>
    </div>
  );
}
