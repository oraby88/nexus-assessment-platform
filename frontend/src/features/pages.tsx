import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Chip, Ring, EmptyState, Skeleton } from '@/components/ui';
import {
  Icon,
  play,
  calendar,
  clock,
  checkCircle,
  reports as reportsIcon,
  chevronRight,
  help,
} from '@/components/ui/icons';
import { PageHeader } from './placeholder';
import { useAsync, useT } from '@/hooks';
import { runtimeService, notificationService } from '@/services';
import type { AppNotification, UserAssessmentSummary } from '@/models';

// AdminDashboard now lives in features/dashboard/AdminDashboard.tsx (Spec 002 US3).

/** Portal side panel (design `UPanel`). */
function UPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <h3 className="text-sm font-bold mb-3">{title}</h3>
      {children}
    </Card>
  );
}

// User Dashboard (Spec 006 / US6 / FR-USR-002): active-assessment hero + completed + reports + notifications.
// Spec 012 (T021): visual parity with project/app/user_portal.jsx UDashboard — dark gradient active
// hero + two-panel rail (completed/reports + recent notifications + help CTA). All data is real; i18n-keyed.
export function UserDashboard() {
  const navigate = useNavigate();
  const { t } = useT();
  const { data, loading } = useAsync<UserAssessmentSummary[]>(
    () => runtimeService.myAssessments(),
    [],
  );
  const { data: notifs } = useAsync<AppNotification[]>(() => notificationService.list(), []);

  if (loading) return <Skeleton height={200} />;

  const list = data ?? [];
  const active = list.find((a) => a.lifecycle === 'active' || a.lifecycle === 'in_progress');
  const completed = list.filter((a) => a.lifecycle === 'completed' || a.lifecycle === 'submitted');
  const reports = completed.filter((a) => a.reportId);
  const recentNotifs = (notifs ?? []).slice(0, 3);

  return (
    <div>
      <PageHeader title={t('dashboard.user.welcome')} sub={t('dashboard.user.sub')} />

      {active ? (
        <div
          className="relative overflow-hidden rounded-xl mb-5 px-8 py-7 text-white"
          style={{ background: 'linear-gradient(135deg,#11141B,#1E2840)' }}
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              background: 'radial-gradient(circle at 85% 20%,rgba(79,70,229,.4),transparent 50%)',
            }}
          />
          <div className="relative flex items-center gap-7 flex-wrap">
            <div className="flex-1 min-w-[240px]">
              <Chip tone="indigo">{t('dashboard.user.activeAssessment')}</Chip>
              <h2 className="text-2xl font-bold text-white mt-3">{active.targetRole}</h2>
              <div className="text-sm mt-1.5" style={{ color: 'rgba(255,255,255,.65)' }}>
                {active.organizationName} ·{' '}
                {active.useCase === 'hiring_support'
                  ? t('runtime.hiringSupport')
                  : t('runtime.developmental')}
              </div>
              <div className="flex items-center gap-[18px] mt-[18px] flex-wrap">
                {active.deadline && (
                  <div
                    className="flex items-center gap-2 text-[13px]"
                    style={{ color: 'rgba(255,255,255,.8)' }}
                  >
                    <Icon path={calendar} size={15} style={{ color: '#A5B0F8' }} />
                    {t('dashboard.user.due', { date: active.deadline })}
                  </div>
                )}
                <div
                  className="flex items-center gap-2 text-[13px]"
                  style={{ color: 'rgba(255,255,255,.8)' }}
                >
                  <Icon path={clock} size={15} style={{ color: '#A5B0F8' }} />
                  {active.progressPercent > 0
                    ? t('dashboard.user.percentComplete', { percent: active.progressPercent })
                    : t('dashboard.user.notStarted')}
                </div>
              </div>
              <div className="mt-5">
                <Button
                  icon={play}
                  onClick={() =>
                    navigate(
                      active.lifecycle === 'in_progress'
                        ? `/app/assessments/${active.assessmentId}/run`
                        : `/app/assessments/${active.assessmentId}/overview`,
                    )
                  }
                >
                  {active.lifecycle === 'in_progress'
                    ? t('dashboard.user.continue')
                    : t('dashboard.user.start')}
                </Button>
              </div>
            </div>
            {/* progress ring — placed on the dark hero (design UDashboard); track/text tuned for dark */}
            <Ring
              value={active.progressPercent}
              size={120}
              stroke={9}
              color="#4F46E5"
              track="rgba(255,255,255,.14)"
              textColor="#fff"
            />
          </div>
        </div>
      ) : (
        <Card className="mb-4">
          <EmptyState title={t('dashboard.user.noActive')} sub={t('dashboard.user.noActiveSub')} />
        </Card>
      )}

      <div className="grid gap-[18px] lg:grid-cols-2">
        {/* left rail */}
        <div className="flex flex-col gap-[18px]">
          <UPanel title={t('dashboard.user.completedTitle')}>
            {completed.length === 0 ? (
              <p className="text-[13px] text-text-3">{t('dashboard.user.nothingYet')}</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {completed.map((c) => (
                  <div
                    key={c.assessmentId}
                    className="flex items-center gap-3 p-3.5 rounded-md border border-border-soft"
                  >
                    <span
                      className="w-9 h-9 rounded-[10px] grid place-items-center flex-none"
                      style={{ background: 'var(--teal-50)', color: 'var(--teal-600)' }}
                    >
                      <Icon path={checkCircle} size={18} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{c.targetRole}</div>
                      <div className="text-xs text-text-3">
                        {c.useCase === 'hiring_support'
                          ? t('runtime.hiringSupport')
                          : t('runtime.developmental')}
                      </div>
                    </div>
                    {c.reportId && (
                      <Button variant="secondary" onClick={() => navigate('/app/reports')}>
                        {t('dashboard.user.viewReport')}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </UPanel>

          <UPanel title={t('dashboard.user.availableReports')}>
            {reports.length === 0 ? (
              <p className="text-[13px] text-text-3">{t('dashboard.user.nothingYet')}</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {reports.map((r) => (
                  <button
                    key={r.assessmentId}
                    onClick={() => navigate('/app/reports')}
                    className="flex items-center gap-3 p-3.5 rounded-md border border-border-soft text-start w-full"
                  >
                    <span
                      className="w-9 h-9 rounded-[10px] grid place-items-center flex-none"
                      style={{ background: 'var(--violet-100)', color: 'var(--violet-600)' }}
                    >
                      <Icon path={reportsIcon} size={18} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{r.targetRole}</div>
                      <div className="text-xs text-text-3">{t('dashboard.user.myReports')}</div>
                    </div>
                    <Icon path={chevronRight} size={18} style={{ color: 'var(--text-3)' }} />
                  </button>
                ))}
              </div>
            )}
          </UPanel>
        </div>

        {/* right rail */}
        <div className="flex flex-col gap-[18px]">
          <UPanel title={t('dashboard.user.recentNotifications')}>
            {recentNotifs.length === 0 ? (
              <p className="text-[13px] text-text-3">{t('dashboard.user.nothingYet')}</p>
            ) : (
              <div className="flex flex-col">
                {recentNotifs.map((n, i) => (
                  <div
                    key={n.id}
                    className={`flex gap-2.5 py-2.5 ${i ? 'border-t border-border-soft' : ''}`}
                  >
                    <span
                      className="w-[7px] h-[7px] rounded-full mt-1.5 flex-none"
                      style={{ background: n.read ? 'transparent' : 'var(--indigo-500)' }}
                    />
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold">{n.title}</div>
                      <div className="text-xs text-text-3">{n.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </UPanel>

          {/* Help CTA */}
          <div
            className="rounded-lg p-[18px]"
            style={{ background: 'var(--indigo-50)', border: '1px solid var(--indigo-100)' }}
          >
            <Icon path={help} size={20} style={{ color: 'var(--indigo-600)' }} />
            <div className="text-sm font-bold mt-2">{t('dashboard.user.needHand')}</div>
            <p className="text-[12.5px] text-text-2 mt-1 leading-relaxed">
              {t('dashboard.user.needHandBody')}
            </p>
            <button
              onClick={() => navigate('/app/help')}
              className="text-[13px] font-semibold mt-2.5"
              style={{ color: 'var(--indigo-600)' }}
            >
              {t('dashboard.user.visitHelp')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
