// Assessment History (Spec 006 / US6 / FR-USR-014). The User's own completed assessments only.
// Spec 012 (T024): visual parity with project/app/user_portal.jsx UHistory — a bordered row list
// (title + purpose/org + Open Report). Real own-data + navigation preserved.
import { useNavigate } from 'react-router-dom';
import { Button, Card, StatusBadge, EmptyState, Skeleton } from '@/components/ui';
import { PageHeader } from '@/features/placeholder';
import { useAsync } from '@/hooks';
import { runtimeService } from '@/services';
import type { UserAssessmentSummary } from '@/models';

export function UserAssessmentHistory() {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync<UserAssessmentSummary[]>(
    () => runtimeService.myAssessments(),
    [],
  );

  if (loading) return <Skeleton height={160} />;
  if (error)
    return (
      <Card>
        <p className="text-rose-600 mb-2.5">Couldn’t load your history.</p>
        <Button variant="secondary" onClick={reload}>
          Retry
        </Button>
      </Card>
    );

  const rows = (data ?? []).filter(
    (a) => a.lifecycle === 'completed' || a.lifecycle === 'submitted',
  );

  return (
    <div>
      <PageHeader title="Assessment History" />
      {rows.length === 0 ? (
        <Card>
          <EmptyState title="No history yet" sub="Completed assessments will be listed here." />
        </Card>
      ) : (
        <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
          {rows.map((r, i) => (
            <div
              key={r.assessmentId}
              className={`flex items-center gap-3.5 px-[18px] py-4 ${i ? 'border-t border-border-soft' : ''}`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{r.targetRole}</div>
                <div className="text-[12.5px] text-text-3">
                  {r.useCase === 'hiring_support' ? 'Hiring support' : 'Developmental'} ·{' '}
                  {r.organizationName}
                </div>
              </div>
              <StatusBadge status="Completed" size="sm" />
              {r.reportId && (
                <Button
                  variant="secondary"
                  style={{ padding: '7px 12px', fontSize: 13 }}
                  onClick={() => navigate(`/app/reports/${r.reportId}`)}
                >
                  Open Report
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
