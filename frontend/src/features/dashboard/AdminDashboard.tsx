// Admin dashboard (US3 / FR-ADM-001). Spec 012 T033: rebuilt to match app/admin_dashboard.jsx —
// decorated KPI cards + a two-column rail (Recent Assessments table, Deadline Alerts, Blueprint Status,
// Recent Candidates, Quick Actions, Notifications). All from the real services; lazy route (budget-safe).
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  CountUp,
  StatusBadge,
  ScoreBar,
  Avatar,
  Skeleton,
  EmptyState,
} from '@/components/ui';
import {
  Icon,
  candidates,
  assessment,
  clock,
  refresh,
  checkCircle,
  reports as reportsIcon,
  alert,
  shieldCheck,
  sparkles,
  plus,
  blueprint,
  context,
  compare,
  chevronRight,
  upload,
} from '@/components/ui/icons';
import { PageHeader } from '@/features/placeholder';
import { useAsync, useT } from '@/hooks';
import {
  participantService,
  assessmentService,
  reportService,
  roleBlueprintService,
  notificationService,
} from '@/services';
import type {
  AppNotification,
  AssessmentAssignment,
  Participant,
  Report,
  RoleBlueprint,
} from '@/models';

interface DashboardData {
  people: Participant[];
  assignments: AssessmentAssignment[];
  reports: Report[];
  blueprints: RoleBlueprint[];
  notifications: AppNotification[];
}

type Tone = 'indigo' | 'teal' | 'amber' | 'slate' | 'violet';

/** KPI card with a tone corner-glow + icon badge + CountUp value (design `KPI`). */
function Kpi({
  label,
  value,
  icon,
  tone,
  sub,
  onClick,
}: {
  label: string;
  value: number;
  icon: string;
  tone: Tone;
  sub?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden text-start rounded-lg border border-border bg-surface shadow-sm p-[18px_18px_16px] transition-[box-shadow,transform] hover:shadow-md hover:-translate-y-[3px]"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <span
        aria-hidden
        className="absolute -top-6 -right-6 w-[90px] h-[90px] rounded-full opacity-45 transition-opacity group-hover:opacity-80"
        style={{ background: `var(--tone-${tone}-bg)` }}
      />
      <span
        className="relative grid place-items-center w-[38px] h-[38px] rounded-[11px]"
        style={{ background: `var(--tone-${tone}-bg)`, color: `var(--tone-${tone}-dot)` }}
      >
        <Icon path={icon} size={19} />
      </span>
      <div className="relative font-display text-[30px] font-bold tracking-[-0.02em] tnum mt-3.5">
        <CountUp to={value} />
      </div>
      <div className="relative text-[12.5px] text-text-2 font-medium mt-0.5">{label}</div>
      {sub && <div className="relative text-[11.5px] text-text-3 mt-0.5">{sub}</div>}
    </button>
  );
}

/** Section panel with a header (design `Panel`). */
function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-[18px] py-3.5 border-b border-border-soft">
        <h3 className="text-[14.5px] font-bold">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useT();
  const { data, loading, error, reload } = useAsync<DashboardData>(async () => {
    const [people, assignments, reports, blueprints, notifications] = await Promise.all([
      participantService.list(),
      assessmentService.list(),
      reportService.list(),
      roleBlueprintService.list(),
      notificationService.list(),
    ]);
    return { people, assignments, reports, blueprints, notifications };
  }, []);

  if (loading) return <Skeleton height={160} />;
  if (error)
    return (
      <Card>
        <p className="text-rose-600 mb-2.5">{t('dashboard.loadError')}</p>
        <Button variant="secondary" onClick={reload}>
          {t('common.retry')}
        </Button>
      </Card>
    );
  if (!data) return <EmptyState title={t('common.noData')} />;

  const { people, assignments, reports, blueprints, notifications } = data;
  const nameOf = (id: string) => people.find((p) => p.id === id)?.fullName ?? id;
  const byLifecycle = (s: string) => assignments.filter((a) => a.lifecycleStatus === s).length;
  const released = reports.filter((r) =>
    ['Released', 'Released with Caution', 'Partial Release'].includes(r.status),
  ).length;
  const inProgress = byLifecycle('In Progress');
  const notStarted = byLifecycle('Not Started');
  const withCaution = reports.filter((r) => r.status === 'Released with Caution').length;

  const kpis: [string, number, string, Tone, string?, (() => void)?][] = [
    [
      'dashboard.kpi.totalUsers',
      people.length,
      candidates,
      'indigo',
      'in your workspace',
      () => navigate('/admin/users'),
    ],
    [
      'dashboard.kpi.activeAssessments',
      assignments.filter((a) => !['Completed', 'Cancelled', 'Expired'].includes(a.lifecycleStatus))
        .length,
      assessment,
      'teal',
      `${inProgress} in progress · ${notStarted} not started`,
      () => navigate('/admin/assessments'),
    ],
    ['dashboard.kpi.completed', byLifecycle('Completed'), checkCircle, 'teal', 'all time'],
    [
      'dashboard.kpi.reportsAvailable',
      released,
      reportsIcon,
      'violet',
      `${withCaution} with caution`,
      () => navigate('/admin/reports'),
    ],
    ['dashboard.kpi.notStarted', notStarted, clock, 'slate'],
    ['dashboard.kpi.inProgress', inProgress, refresh, 'indigo'],
    [
      'dashboard.kpi.reportsWithCaution',
      withCaution,
      alert,
      'amber',
      undefined,
      () => navigate('/admin/reports'),
    ],
    [
      'dashboard.kpi.validatedBlueprints',
      blueprints.filter((b) => b.status === 'Validated').length,
      shieldCheck,
      'teal',
      `of ${blueprints.length} total`,
      () => navigate('/admin/role-blueprints'),
    ],
  ];

  // Deadline alerts — active assignments with a deadline, soonest first.
  const today = new Date();
  const deadlines = assignments
    .filter((a) => a.deadline && !['Completed', 'Cancelled', 'Expired'].includes(a.lifecycleStatus))
    .map((a) => ({
      a,
      days: Math.max(0, Math.ceil((new Date(a.deadline!).getTime() - today.getTime()) / 86400000)),
    }))
    .sort((x, y) => x.days - y.days)
    .slice(0, 4);

  const BP_STATUSES: [string, Tone][] = [
    ['Validated', 'teal'],
    ['Active', 'indigo'],
    ['Under Review', 'amber'],
    ['Draft', 'slate'],
  ];
  const bpCount = (s: string) => blueprints.filter((b) => b.status === s).length;
  const bpMax = Math.max(1, ...BP_STATUSES.map(([s]) => bpCount(s)));

  const quickActions: [string, string, string, boolean][] = [
    ['dashboard.qa.createAssessment', '/admin/assessments/new', sparkles, true],
    ['dashboard.qa.addUser', '/admin/users', plus, false],
    ['dashboard.qa.createBlueprint', '/admin/role-blueprints/new', blueprint, false],
    ['dashboard.qa.createContext', '/admin/context-profiles/new', context, false],
    ['dashboard.qa.compareCandidates', '/admin/comparison', compare, false],
  ];

  const linkBtn = 'text-[12.5px] font-semibold text-indigo-600 bg-transparent border-none';

  return (
    <div>
      <PageHeader
        title={t('dashboard.admin.title')}
        sub={t('dashboard.admin.sub')}
        actions={
          <>
            <Button variant="secondary" icon={upload} onClick={() => navigate('/admin/users')}>
              Upload Candidates
            </Button>
            <Button icon={plus} onClick={() => navigate('/admin/assessments/new')}>
              Create Assessment
            </Button>
          </>
        }
      />

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(([label, value, icon, tone, sub, onClick]) => (
          <Kpi
            key={label}
            label={t(label)}
            value={value}
            icon={icon}
            tone={tone}
            sub={sub}
            onClick={onClick}
          />
        ))}
      </div>

      {/* two-column rail */}
      <div className="grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
        {/* left */}
        <div className="flex flex-col gap-5">
          <Panel
            title={t('dashboard.recentAssessments')}
            action={
              <button onClick={() => navigate('/admin/assessments')} className={linkBtn}>
                View all →
              </button>
            }
          >
            <table className="w-full border-collapse text-[13px]">
              <tbody>
                {assignments.slice(0, 5).map((a, i) => (
                  <tr
                    key={a.id}
                    onClick={() => navigate(`/admin/assessments/${a.id}`)}
                    className={`cursor-pointer hover:bg-surface-2 ${i ? 'border-t border-border-soft' : ''}`}
                  >
                    <td className="py-3 px-[18px]">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={nameOf(a.participantId)} />
                        <div>
                          <div className="font-semibold">{nameOf(a.participantId)}</div>
                          <div className="text-xs text-text-3">{a.targetRole}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-[12.5px] text-text-2">
                      {a.useCase.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-2 w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <ScoreBar
                            value={a.progressPercent}
                            height={6}
                            color={
                              a.progressPercent === 100 ? 'var(--teal-600)' : 'var(--indigo-500)'
                            }
                            label="progress"
                          />
                        </div>
                        <span className="text-[11px] text-text-3 font-semibold w-7 text-right">
                          {a.progressPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-[18px] text-right">
                      <StatusBadge status={a.lifecycleStatus} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <div className="grid gap-5 sm:grid-cols-2">
            <Panel title="Deadline Alerts">
              <div className="flex flex-col gap-2.5 p-3.5">
                {deadlines.length === 0 && (
                  <p className="text-[13px] text-text-3">No upcoming deadlines.</p>
                )}
                {deadlines.map(({ a, days }) => {
                  const urgent = days <= 2;
                  return (
                    <div
                      key={a.id}
                      className="flex items-center gap-2.5 p-3 rounded-md"
                      style={{
                        background: urgent ? 'var(--amber-50)' : 'var(--surface-2)',
                        border: `1px solid ${urgent ? 'var(--amber-100)' : 'var(--border-soft)'}`,
                      }}
                    >
                      <div
                        className="w-[34px] h-[34px] rounded-[9px] flex-none grid place-items-center text-white"
                        style={{ background: urgent ? 'var(--amber-600)' : 'var(--ink-600)' }}
                      >
                        <div className="text-[13px] font-bold leading-none">{days}</div>
                        <div className="text-[8px] opacity-80">days</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold truncate">
                          {nameOf(a.participantId)}
                        </div>
                        <div className="text-[11.5px] text-text-3 truncate">{a.targetRole}</div>
                      </div>
                      <span className="text-[11px] font-semibold text-text-3">
                        {a.progressPercent}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </Panel>

            <Panel title="Blueprint Status">
              <div className="p-4 flex flex-col gap-3.5">
                {BP_STATUSES.map(([status, tone]) => {
                  const c = bpCount(status);
                  return (
                    <div key={status} className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-none"
                        style={{ background: `var(--tone-${tone}-dot)` }}
                      />
                      <span className="flex-1 text-[13px] font-medium">{status}</span>
                      <span className="w-[90px] h-1.5 rounded-full overflow-hidden bg-track">
                        <span
                          className="block h-full rounded-full"
                          style={{
                            width: `${(c / bpMax) * 100}%`,
                            background: `var(--tone-${tone}-dot)`,
                          }}
                        />
                      </span>
                      <span className="text-[13px] font-bold w-4 text-right">{c}</span>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>

          <Panel
            title={t('dashboard.recentUsers')}
            action={
              <button onClick={() => navigate('/admin/users')} className={linkBtn}>
                View all →
              </button>
            }
          >
            <div className="grid sm:grid-cols-2 gap-1 p-1.5">
              {people.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/admin/users/${p.id}`)}
                  className="flex items-center gap-[11px] px-3 py-[11px] rounded-md text-start hover:bg-surface-2 bg-transparent border-none"
                >
                  <Avatar name={p.fullName} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold truncate">{p.fullName}</div>
                    <div className="text-xs text-text-3 truncate">{p.targetJobTitle ?? '—'}</div>
                  </div>
                  <StatusBadge
                    status={p.latestAssessmentLifecycle ?? 'Not Started'}
                    size="sm"
                    dot={false}
                  />
                </button>
              ))}
            </div>
          </Panel>
        </div>

        {/* right rail — sticky below the shell top bar (design position:sticky; top:84) */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-[84px]">
          <Panel title={t('dashboard.quickActions')}>
            <div className="p-3 flex flex-col gap-2">
              {quickActions.map(([label, route, icon, primary]) => (
                <button
                  key={label}
                  onClick={() => navigate(route)}
                  className="flex items-center gap-3 p-3 rounded-md text-start"
                  style={
                    primary
                      ? { background: 'var(--indigo-500)', color: '#fff' }
                      : { background: 'var(--surface)', border: '1px solid var(--border)' }
                  }
                >
                  <span
                    className="w-8 h-8 rounded-[9px] grid place-items-center flex-none"
                    style={
                      primary
                        ? { background: 'rgba(255,255,255,.16)', color: '#fff' }
                        : { background: 'var(--indigo-50)', color: 'var(--indigo-500)' }
                    }
                  >
                    <Icon path={icon} size={16} />
                  </span>
                  <span className="flex-1 text-[13.5px] font-semibold">{t(label)}</span>
                  <Icon
                    path={chevronRight}
                    size={15}
                    style={{ color: primary ? 'rgba(255,255,255,.7)' : 'var(--text-3)' }}
                  />
                </button>
              ))}
            </div>
          </Panel>

          <Panel
            title={t('dashboard.user.notifications')}
            action={
              <button onClick={() => navigate('/admin/notifications')} className={linkBtn}>
                All →
              </button>
            }
          >
            <div className="flex flex-col p-1.5">
              {notifications.slice(0, 5).map((n) => (
                <div key={n.id} className="flex gap-2.5 p-3 rounded-md">
                  <span
                    className="w-[7px] h-[7px] rounded-full mt-1.5 flex-none"
                    style={{ background: n.read ? 'transparent' : 'var(--indigo-500)' }}
                  />
                  <div className="min-w-0">
                    <div className="text-[12.5px] font-semibold leading-tight">{n.title}</div>
                    <div className="text-[11.5px] text-text-3 mt-0.5 leading-snug">{n.body}</div>
                    <div className="text-[10.5px] text-text-3 mt-[3px]">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
