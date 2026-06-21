// My Assessments (Spec 006 / US6 / FR-USR-003). Own active + completed assessments.
// Spec 012 (T022): visual parity with project/app/user_portal.jsx MyAssessments — progress Ring +
// status badge + org/deadline meta per card. Real data + navigation preserved.
import { useNavigate } from 'react-router-dom';
import { Button, Card, StatusBadge, Ring, EmptyState, Skeleton } from '@/components/ui';
import { play, reports as reportsIcon } from '@/components/ui/icons';
import { PageHeader } from '@/features/placeholder';
import { useAsync } from '@/hooks';
import { runtimeService } from '@/services';
import type { UserAssessmentSummary } from '@/models';

function AssessmentRow({ a }: { a: UserAssessmentSummary }) {
  const navigate = useNavigate();
  const done = a.lifecycle === 'completed' || a.lifecycle === 'submitted';
  const inProgress = a.lifecycle === 'in_progress';
  return (
    <Card className="mb-3.5">
      <div className="flex items-center gap-5">
        <div className="flex-none">
          <Ring
            value={a.progressPercent}
            size={56}
            color={done ? 'var(--teal-600)' : 'var(--indigo-500)'}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-base font-bold">{a.targetRole}</span>
            <StatusBadge
              status={done ? 'Completed' : inProgress ? 'In Progress' : 'Not Started'}
              size="sm"
            />
          </div>
          <div className="text-[13px] text-text-3 mt-1">
            {a.organizationName}
            {a.deadline ? ` · due ${a.deadline}` : ''}
          </div>
        </div>
        {done ? (
          a.reportId ? (
            <Button
              variant="secondary"
              icon={reportsIcon}
              onClick={() => navigate(`/app/reports/${a.reportId}`)}
            >
              View Report
            </Button>
          ) : null
        ) : (
          <Button
            icon={play}
            onClick={() =>
              navigate(
                inProgress
                  ? `/app/assessments/${a.assessmentId}/run`
                  : `/app/assessments/${a.assessmentId}/overview`,
              )
            }
          >
            {inProgress ? 'Resume' : 'Start'}
          </Button>
        )}
      </div>
    </Card>
  );
}

export function MyAssessments() {
  const { data, loading, error, reload } = useAsync<UserAssessmentSummary[]>(
    () => runtimeService.myAssessments(),
    [],
  );

  if (loading) return <Skeleton height={160} />;
  if (error)
    return (
      <Card>
        <p className="text-rose-600 mb-2.5">Couldn’t load your assessments.</p>
        <Button variant="secondary" onClick={reload}>
          Retry
        </Button>
      </Card>
    );

  const list = data ?? [];
  const active = list.filter((a) => a.lifecycle === 'active' || a.lifecycle === 'in_progress');
  const completed = list.filter((a) => a.lifecycle === 'completed' || a.lifecycle === 'submitted');

  return (
    <div>
      <PageHeader title="My Assessments" sub="Your active and completed assessments." />
      {list.length === 0 && (
        <Card>
          <EmptyState
            title="Nothing here yet"
            sub="Assessments assigned to you will appear here."
          />
        </Card>
      )}
      {active.length > 0 && (
        <>
          <h2 className="text-sm text-text-3 mt-1 mb-2">Active</h2>
          {active.map((a) => (
            <AssessmentRow key={a.assessmentId} a={a} />
          ))}
        </>
      )}
      {completed.length > 0 && (
        <>
          <h2 className="text-sm text-text-3 mt-3 mb-2">Completed</h2>
          {completed.map((a) => (
            <AssessmentRow key={a.assessmentId} a={a} />
          ))}
        </>
      )}
    </div>
  );
}
