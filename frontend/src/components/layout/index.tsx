import { Suspense, lazy, useEffect, useState, type ReactNode } from 'react';
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { RouteReveal } from '@/components/motion';

// Spec 012 / US1: lazy-load the (non-critical) Nex companion so it + its hint map leave the eager
// chunk — reclaiming budget for the design icon set while keeping the ≤260 KB eager ceiling.
const RobotCompanion = lazy(() =>
  import('@/components/companion/RobotCompanion').then((m) => ({ default: m.RobotCompanion })),
);
import type { NavItem, Role } from '@/models';
import { useSession, useViewport } from '@/hooks';
import { ThemeToggle, Skeleton } from '@/components/ui';
import {
  Icon,
  dashboard,
  candidates,
  assessment,
  blueprint,
  context,
  reports,
  compare,
  history,
  exports,
  bell,
  shield,
  list,
  settings,
  user,
  help,
  menu,
  logout,
  search,
} from '@/components/ui/icons';

// Spec 012 / US1: per-nav-key design icon (sidebar icon + label, matching app/shell.jsx).
const NAV_ICONS: Record<string, string> = {
  dashboard,
  users: candidates,
  assessments: assessment,
  'role-blueprints': blueprint,
  'context-profiles': context,
  reports,
  comparison: compare,
  history,
  exports,
  notifications: bell,
  privacy: shield,
  'activity-log': list,
  settings,
  profile: user,
  help,
};

// Navigation registries as typed NavItem[] (FR-FND-001 / task T015).
export const NAV_ADMIN: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', route: '/admin/dashboard' },
  { key: 'users', label: 'Users', route: '/admin/users' },
  { key: 'assessments', label: 'Assessments', route: '/admin/assessments' },
  { key: 'role-blueprints', label: 'Role Blueprints', route: '/admin/role-blueprints' },
  { key: 'context-profiles', label: 'Context Profiles', route: '/admin/context-profiles' },
  { key: 'reports', label: 'Reports', route: '/admin/reports' },
  { key: 'comparison', label: 'Candidate Comparison', route: '/admin/comparison' },
  { key: 'history', label: 'Assessment History', route: '/admin/history' },
  { key: 'exports', label: 'Exports', route: '/admin/exports' },
  { key: 'notifications', label: 'Notifications', route: '/admin/notifications' },
  { key: 'privacy', label: 'Privacy Requests', route: '/admin/privacy' },
  { key: 'activity-log', label: 'Activity Log', route: '/admin/activity-log' },
  { key: 'settings', label: 'Settings', route: '/admin/settings' },
  { key: 'profile', label: 'My Profile', route: '/admin/profile' },
];

export const NAV_USER: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', route: '/app/dashboard' },
  { key: 'assessments', label: 'My Assessments', route: '/app/assessments' },
  { key: 'history', label: 'Assessment History', route: '/app/history' },
  { key: 'reports', label: 'My Reports', route: '/app/reports' },
  { key: 'notifications', label: 'Notifications', route: '/app/notifications' },
  { key: 'help', label: 'Help & Support', route: '/app/help' },
  { key: 'profile', label: 'Profile & Privacy', route: '/app/profile' },
];

// Sidebar nav grouped into sections (design app/shell.jsx). Keys map to NAV_ADMIN/NAV_USER entries.
type NavSection = { section: string | null; keys: string[] };
const ADMIN_SECTIONS: NavSection[] = [
  { section: 'Overview', keys: ['dashboard', 'users', 'assessments'] },
  { section: 'Design', keys: ['role-blueprints', 'context-profiles'] },
  { section: 'Insight', keys: ['reports', 'comparison', 'history', 'exports'] },
  { section: 'System', keys: ['notifications', 'privacy', 'activity-log', 'settings', 'profile'] },
];
const USER_SECTIONS: NavSection[] = [
  {
    section: null,
    keys: ['dashboard', 'assessments', 'history', 'reports', 'notifications', 'help', 'profile'],
  },
];

/** Compact Nexus brand mark (design app/shell.jsx NexusMark, light variant for the dark shell). */
function NexusMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect width="32" height="32" rx="8" fill="rgba(255,255,255,.12)" />
      <circle cx="16" cy="16" r="9" stroke="#fff" strokeWidth="2" opacity=".55" />
      <path
        d="M11 21V11l10 10V11"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="11" r="2" fill="#A5B0F8" />
      <circle cx="21" cy="21" r="2" fill="#A5B0F8" />
    </svg>
  );
}

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** Route guard — redirects by role/session (constitution III; FR-FND-002). */
export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { session } = useSession();
  if (!session) return <Navigate to={role === 'admin' ? '/login' : '/invitation'} replace />;
  if (session.role !== role) return <Navigate to="/access-denied" replace />;
  return <>{children}</>;
}

/** Simulated connectivity banner + reflects the browser online/offline events (FR-FND-011). */
export function OfflineBanner() {
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  );
  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);
  if (online) return null;
  return (
    <div
      role="status"
      className="fixed top-0 inset-x-0 z-[2000] bg-amber-600 text-white text-center text-[13px] py-1.5 px-3"
    >
      You are offline — changes are paused until the connection returns.
    </div>
  );
}

function Sidebar({
  nav,
  sections,
  badges,
  brandSub,
  open,
  overlay,
  onNavigate,
}: {
  nav: NavItem[];
  sections: NavSection[];
  badges: Record<string, number>;
  brandSub: string;
  open: boolean;
  overlay: boolean;
  onNavigate: () => void;
}) {
  const { session, signOut } = useSession();
  const navigate = useNavigate();
  const byKey = (key: string) => nav.find((n) => n.key === key);
  return (
    <aside
      aria-label="Primary navigation"
      className="w-[248px] shrink-0 bg-shell-850 text-shell-text h-screen flex flex-col border-r border-shell-line"
      // Overlay vs sticky placement, slide transform, and conditional shadow are runtime/computed — kept inline.
      style={
        overlay
          ? {
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: 1200,
              transform: open ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform .3s var(--ease-out)',
              boxShadow: open ? 'var(--sh-xl)' : 'none',
            }
          : { position: 'sticky', top: 0 }
      }
    >
      <div className="flex items-center gap-2.5 px-[18px] pt-5 pb-3.5">
        <NexusMark />
        <div className="leading-none">
          <div className="font-display font-bold text-[17px] tracking-[-0.02em] text-white">
            Nexus
          </div>
          <div className="text-[10.5px] font-semibold text-shell-muted tracking-[0.08em] uppercase mt-[3px]">
            {brandSub}
          </div>
        </div>
      </div>

      <nav className="shell-scroll flex-1 overflow-y-auto px-3 py-2">
        {sections.map((grp, gi) => (
          <div key={gi} className="mb-3.5">
            {grp.section && (
              <div className="text-[10.5px] font-bold tracking-[0.09em] uppercase text-shell-muted px-2.5 pt-2 pb-1.5">
                {grp.section}
              </div>
            )}
            {grp.keys.map((key) => {
              const n = byKey(key);
              if (!n) return null;
              return (
                <NavLink
                  key={n.key}
                  to={n.route}
                  onClick={onNavigate}
                  className="relative flex items-center gap-2.5 py-[9px] px-2.5 rounded-md mb-0.5 text-[13.5px]"
                  style={({ isActive }) => ({
                    color: isActive ? '#fff' : 'var(--shell-text)',
                    background: isActive ? 'var(--shell-700)' : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                  })}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute -left-3 top-2 bottom-2 w-[3px] rounded-r bg-indigo-400" />
                      )}
                      {NAV_ICONS[n.key] && (
                        <Icon
                          path={NAV_ICONS[n.key]}
                          size={17}
                          style={{ color: isActive ? '#A5B0F8' : 'var(--shell-muted)' }}
                        />
                      )}
                      <span className="flex-1">{n.label}</span>
                      {badges[n.key] && (
                        <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-indigo-500 text-white text-[11px] font-bold grid place-items-center">
                          {badges[n.key]}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-shell-line">
        <div className="flex items-center gap-2.5 px-1.5 py-2">
          <span className="w-[34px] h-[34px] rounded-full grid place-items-center bg-shell-700 text-white text-[13px] font-bold flex-none">
            {initialsOf(session?.name ?? 'You')}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-white truncate">{session?.name}</div>
            <div className="text-[11.5px] text-shell-muted truncate capitalize">
              {session?.role}
            </div>
          </div>
          <button
            onClick={() => {
              signOut();
              navigate('/');
            }}
            aria-label="Sign out"
            className="text-shell-muted hover:text-white"
          >
            <Icon path={logout} size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

// Topbar (design app/shell.jsx): search field + notification bell + theme. The user identity + sign-out
// live in the sidebar footer (matching the design); the help/avatar popovers are deferred (budget).
function Topbar({
  onMenu,
  showMenu,
  notificationsPath,
}: {
  onMenu: () => void;
  showMenu: boolean;
  notificationsPath: string;
}) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  return (
    <header
      className="h-16 shrink-0 flex items-center gap-3 px-4 border-b border-border sticky top-0 z-10"
      style={{ background: 'var(--topbar-bg)', backdropFilter: 'blur(10px)' }}
    >
      {showMenu && (
        <button
          onClick={onMenu}
          aria-label="Open navigation"
          className="inline-grid place-items-center w-[38px] h-[38px] rounded-md border border-border bg-surface text-text-2 flex-none"
        >
          <Icon path={menu} size={18} />
        </button>
      )}
      <div className="relative flex-1 max-w-[440px] min-w-0">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3">
          <Icon path={search} size={16} />
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search"
          placeholder="Search candidates, assessments, reports…"
          className="w-full py-2.5 pl-9 pr-3 rounded-md border border-border bg-surface text-[13.5px] text-text"
        />
      </div>
      <div className="flex-1" />
      <ThemeToggle />
      <button
        onClick={() => navigate(notificationsPath)}
        aria-label="Notifications"
        className="inline-grid place-items-center w-[38px] h-[38px] rounded-md border border-border bg-surface text-text-2"
      >
        <Icon path={bell} size={18} />
      </button>
    </header>
  );
}

function Shell({
  nav,
  sections,
  badges,
  brandSub,
  notificationsPath,
}: {
  nav: NavItem[];
  sections: NavSection[];
  badges: Record<string, number>;
  brandSub: string;
  notificationsPath: string;
}) {
  const { isDesktop } = useViewport();
  const [open, setOpen] = useState(false);
  const overlay = !isDesktop;
  return (
    <div className="flex min-h-screen">
      <Sidebar
        nav={nav}
        sections={sections}
        badges={badges}
        brandSub={brandSub}
        open={open}
        overlay={overlay}
        onNavigate={() => setOpen(false)}
      />
      {overlay && open && (
        <div
          onClick={() => setOpen(false)}
          aria-hidden
          className="fixed inset-0 bg-black/40 z-[1100]"
        />
      )}
      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar
          onMenu={() => setOpen(true)}
          showMenu={overlay}
          notificationsPath={notificationsPath}
        />
        <div className="flex-1 p-[clamp(16px,3vw,28px)] max-w-[1320px] w-full mx-auto">
          <Suspense fallback={<Skeleton height={120} />}>
            <RouteReveal>
              <Outlet />
            </RouteReveal>
          </Suspense>
        </div>
      </main>
      {/* Nex companion — mounted once for the in-app shells only (Spec 011 / US2); lazy (Spec 012). */}
      <Suspense fallback={null}>
        <RobotCompanion />
      </Suspense>
    </div>
  );
}

export function AdminShell() {
  return (
    <Shell
      nav={NAV_ADMIN}
      sections={ADMIN_SECTIONS}
      badges={{ notifications: 3 }}
      brandSub="Assessment Platform"
      notificationsPath="/admin/notifications"
    />
  );
}
export function UserShell() {
  return (
    <Shell
      nav={NAV_USER}
      sections={USER_SECTIONS}
      badges={{ notifications: 1 }}
      brandSub="Candidate Portal"
      notificationsPath="/app/notifications"
    />
  );
}

/** Immersive shell for the signature create-assessment flow and the assessment runtime (FR-FND-001). */
export function FullBleedShell() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Suspense fallback={<Skeleton height={200} />}>
        <RouteReveal>
          <Outlet />
        </RouteReveal>
      </Suspense>
    </div>
  );
}

/** Minimal chrome for public/auth routes (pages owned by spec 007). */
export function PublicShell() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<Skeleton height={120} />}>
        <RouteReveal>
          <Outlet />
        </RouteReveal>
      </Suspense>
    </div>
  );
}
