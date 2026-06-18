// Assessment detail (US2 / FR-ADM-007): management actions update timeline + notification + sim email.
// Spec 012 (T014): visual parity with project/app/admin_assessments.jsx AssessmentDetail — progress
// hero, two-column rail (Candidate / Assignment cards + Timeline), sticky Consent + Manage rail. All
// actions stay wired to the real assessmentService; no blueprint/context (absent on the assignment).
import { useState } from 'react';
import type { ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Ring, StatusBadge, Timeline, Button, EmptyState, Skeleton } from '@/components/ui';
import { Icon, bell, calendar, send, compare, shieldCheck } from '@/components/ui/icons';
import { PageHeader } from '@/features/placeholder';
import { useAsync, useToast } from '@/hooks';
import { assessmentService, consentService, participantService } from '@/services';
import type {
  AssessmentAction,
  AssessmentAssignment,
  ConsentRecord,
  Participant,
  TimelineEvent,
} from '@/models';

const TERMINAL = ['Completed', 'Cancelled', 'Expired'];

/** Label/value row (design `KV`) — separated by a soft divider. */
function KV({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="flex justify-between items-center py-[7px] border-b border-border-soft last:border-0">
      <span className="text-[12.5px] text-text-3">{k}</span>
      <span className="text-[13px] font-semibold text-right">{v}</span>
    </div>
  );
}

/** Section card with a title (design `__DetailCard`). */
function DetailCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <h2 className="text-[15px] font-bold mb-3">{title}</h2>
      {children}
    </Card>
  );
}

export function AssessmentDetail() {
  const { assessmentId = '' } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    data: a,
    loading,
    error,
    reload,
  } = useAsync<AssessmentAssignment | undefined>(
    () => assessmentService.get(assessmentId),
    [assessmentId],
  );
  const { data: timeline, reload: reloadTimeline } = useAsync<TimelineEvent[]>(
    () => assessmentService.timeline(assessmentId),
    [assessmentId],
  );
  const { data: person } = useAsync<Participant | undefined>(
    () => (a ? participantService.get(a.participantId) : Promise.resolve(undefined)),
    [a?.participantId],
  );
  const { data: consents } = useAsync<ConsentRecord[]>(
    () => (a ? consentService.forParticipant(a.participantId) : Promise.resolve([])),
    [a?.participantId],
  );
  const [busy, setBusy] = useState(false);

  async function run(action: AssessmentAction) {
    setBusy(true);
    try {
      if (action === 'remind') await assessmentService.remind(assessmentId);
      else if (action === 'resendInvitation')
        await assessmentService.resendInvitation(assessmentId);
      else if (action === 'extendDeadline')
        await assessmentService.extendDeadline(assessmentId, '2026-07-15');
      else if (action === 'cancel') await assessmentService.cancel(assessmentId);
      toast('Action applied', 'success');
      reload();
      reloadTimeline();
    } catch (e) {
      toast((e as Error).message, 'error');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Skeleton height={200} />;
  if (error)
    return (
      <Card>
        <p className="text-rose-600 mb-2.5">Failed to load assessment.</p>
        <Button variant="secondary" onClick={reload}>
          Retry
        </Button>
      </Card>
    );
  if (!a)
    return (
      <Card>
        <EmptyState title="Assessment not found" />
      </Card>
    );

  const terminal = TERMINAL.includes(a.lifecycleStatus);
  const granted = (consents ?? []).some((c) => c.status === 'Granted');

  return (
    <div>
      <PageHeader title={a.targetRole} sub={`Assessment ${a.id}`} />

      {/* Header actions (design action cluster) — all wired to the real service. */}
      <div className="flex gap-2.5 flex-wrap mb-4">
        <Button
          variant="secondary"
          icon={bell}
          disabled={busy || terminal}
          onClick={() => run('remind')}
        >
          Send Reminder
        </Button>
        <Button
          variant="secondary"
          icon={calendar}
          disabled={busy || terminal}
          onClick={() => run('extendDeadline')}
        >
          Extend Deadline
        </Button>
        <Button icon={send} disabled={busy || terminal} onClick={() => run('resendInvitation')}>
          Resend Invitation
        </Button>
      </div>

      <div className="grid gap-[18px] lg:grid-cols-[1fr_280px]">
        {/* Left column */}
        <div className="flex flex-col gap-[18px]">
          {/* progress hero */}
          <Card className="flex items-center gap-6">
            <Ring
              value={a.progressPercent}
              size={84}
              stroke={7}
              color={a.lifecycleStatus === 'Completed' ? 'var(--teal-600)' : 'var(--indigo-500)'}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                <StatusBadge status={a.lifecycleStatus} />
                <StatusBadge status={a.validityStatus} />
                <StatusBadge status={a.reportStatus ?? 'Unavailable'} />
              </div>
              <div className="flex gap-7 flex-wrap">
                {(
                  [
                    ['Assigned', a.assignedAt],
                    ['Deadline', a.deadline ?? '—'],
                    ['Use Case', a.useCase.replace('_', ' ')],
                  ] as [string, string][]
                ).map(([label, value]) => (
                  <div key={label}>
                    <div className="text-[11px] text-text-3 font-semibold uppercase">{label}</div>
                    <div className="text-[13.5px] font-semibold mt-0.5">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* section grid */}
          <div className="grid gap-[18px] sm:grid-cols-2">
            <DetailCard title="Candidate Information">
              <KV k="Name" v={person?.fullName ?? '—'} />
              <KV k="Current Role" v={person?.currentJobTitle ?? '—'} />
              <KV k="Target Role" v={a.targetRole} />
              <KV k="Job Level" v={a.jobLevel} />
              <div className="mt-3">
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/admin/users/${a.participantId}`)}
                >
                  Open User
                </Button>
              </div>
            </DetailCard>
            <DetailCard title="Assignment">
              <KV k="Use Case" v={a.useCase.replace('_', ' ')} />
              <KV k="Assigned" v={a.assignedAt} />
              <KV k="Deadline" v={a.deadline ?? '—'} />
              <KV k="Lifecycle" v={<StatusBadge status={a.lifecycleStatus} />} />
              <KV k="Validity" v={<StatusBadge status={a.validityStatus} />} />
              <KV k="Report" v={<StatusBadge status={a.reportStatus ?? 'Unavailable'} />} />
            </DetailCard>
          </div>

          <DetailCard title="Timeline">
            {timeline && timeline.length > 0 ? (
              <Timeline
                items={timeline.map((e) => ({
                  id: e.id,
                  label: e.label,
                  detail: e.detail,
                  time: e.createdAt,
                }))}
              />
            ) : (
              <EmptyState title="No activity yet" />
            )}
          </DetailCard>
        </div>

        {/* Right rail */}
        <div className="flex flex-col gap-[18px] lg:sticky lg:top-[84px] self-start">
          <DetailCard title="Consent">
            <div
              className="flex items-center gap-2.5 p-3 rounded-md"
              style={{ background: granted ? 'var(--teal-50)' : 'var(--surface-2)' }}
            >
              <Icon
                path={shieldCheck}
                size={18}
                style={{ color: granted ? 'var(--teal-600)' : 'var(--text-3)' }}
              />
              <div>
                <div className="text-[13px] font-semibold">
                  {granted ? 'Consent granted' : 'No consent on file'}
                </div>
                <div className="text-[11.5px] text-text-3">
                  Scoped to {a.useCase.replace('_', ' ')}
                </div>
              </div>
            </div>
          </DetailCard>

          <DetailCard title="Manage">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate('/admin/comparison')}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-md border border-border-soft text-[13px] font-semibold text-text text-start"
              >
                <Icon path={compare} size={16} style={{ color: 'var(--text-3)' }} />
                Add to Comparison
              </button>
              <button
                disabled={busy || terminal}
                onClick={() => run('cancel')}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-md border border-border-soft text-[13px] font-semibold text-rose-600 text-start disabled:opacity-50"
              >
                <Icon path={shieldCheck} size={16} style={{ color: 'var(--rose-600)' }} />
                Cancel Assessment
              </button>
            </div>
            {terminal && (
              <p className="text-xs text-text-3 mt-2.5">
                This assessment is {a.lifecycleStatus.toLowerCase()}; management actions are
                unavailable.
              </p>
            )}
          </DetailCard>
        </div>
      </div>
    </div>
  );
}
