// My Reports (Spec 006 / US5 / FR-USR-013). Lists the User's own reports (own-data, from their
// assessment summaries) with open + simulated PDF actions. No restricted content here.
// Spec 012 (T022): visual parity with project/app/user_portal.jsx MyReports — supportive report
// cards (violet icon badge + title + purpose + StatusBadge + chevron). Real open/PDF actions kept.
import { useNavigate } from 'react-router-dom';
import { Button, Card, StatusBadge, EmptyState, Skeleton } from '@/components/ui';
import { Icon, reports as reportsIcon, chevronRight } from '@/components/ui/icons';
import { PageHeader } from '@/features/placeholder';
import { useAsync } from '@/hooks';
import { runtimeService } from '@/services';
import type { UserAssessmentSummary } from '@/models';

export function MyReports() {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync<UserAssessmentSummary[]>(
    () => runtimeService.myAssessments(),
    [],
  );

  if (loading) return <Skeleton height={160} />;
  if (error)
    return (
      <Card>
        <p className="text-rose-600 mb-2.5">Couldn’t load your reports.</p>
        <Button variant="secondary" onClick={reload}>
          Retry
        </Button>
      </Card>
    );

  const rows = (data ?? []).filter((s) => s.reportId);

  return (
    <div>
      <PageHeader
        title="My Reports"
        sub="Your assessment results, written to be clear and supportive."
      />
      {rows.length === 0 ? (
        <Card>
          <EmptyState
            title="No reports yet"
            sub="When a report is ready to share with you, it will appear here."
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-3.5">
          {rows.map((r) => (
            // Whole card is the click target (design user_portal.jsx MyReports), capped at 640px.
            <button
              key={r.reportId}
              onClick={() => navigate(`/app/reports/${r.reportId}`)}
              className="w-full max-w-[640px] flex items-center gap-[18px] text-start bg-surface border border-border rounded-lg shadow-sm p-[22px] transition-shadow hover:shadow-md"
            >
              <span
                className="w-12 h-12 rounded-xl grid place-items-center flex-none"
                style={{ background: 'var(--violet-100)', color: 'var(--violet-600)' }}
              >
                <Icon path={reportsIcon} size={22} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-base font-bold truncate">{r.targetRole}</div>
                <div className="text-[13px] text-text-3 mt-[3px]">
                  {r.useCase === 'hiring_support' ? 'Hiring support' : 'Developmental'} ·{' '}
                  {r.organizationName}
                </div>
              </div>
              <StatusBadge status="Released" />
              <Icon path={chevronRight} size={20} style={{ color: 'var(--text-3)' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
