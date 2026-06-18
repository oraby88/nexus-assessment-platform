// Admin-wide Assessment History (US5 / FR-RPT-008/009). Global, version-aware; lifecycle and
// validity shown as SEPARATE fields; historical reports preserve their versions.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  SearchInput,
  FilterBar,
  DataTable,
  StatusBadge,
  Avatar,
  EmptyState,
  Skeleton,
} from '@/components/ui';
import { PageHeader } from '@/features/placeholder';
import { useAsync } from '@/hooks';
import { assessmentService, reportService, participantService } from '@/services';
import type { AssessmentAssignment, Participant, Report } from '@/models';

interface HistoryRow {
  assignment: AssessmentAssignment;
  report?: Report;
}

export function AssessmentHistory() {
  const navigate = useNavigate();
  const {
    data: assignments,
    loading,
    error,
    reload,
  } = useAsync<AssessmentAssignment[]>(() => assessmentService.list(), []);
  const { data: reports } = useAsync<Report[]>(() => reportService.list(), []);
  const { data: people } = useAsync<Participant[]>(() => participantService.list(), []);
  const [search, setSearch] = useState('');

  const nameOf = useMemo(() => {
    const m = new Map((people ?? []).map((p) => [p.id, p.fullName]));
    return (id: string) => m.get(id) ?? id;
  }, [people]);

  const rows: HistoryRow[] = useMemo(() => {
    const byAssessment = new Map((reports ?? []).map((r) => [r.assessmentId, r]));
    return (assignments ?? [])
      .map((a) => ({ assignment: a, report: byAssessment.get(a.id) }))
      .filter((row) => {
        const q = search.toLowerCase().trim();
        if (!q) return true;
        return (
          nameOf(row.assignment.participantId).toLowerCase().includes(q) ||
          row.assignment.targetRole.toLowerCase().includes(q)
        );
      });
  }, [assignments, reports, search, nameOf]);

  return (
    <div>
      <PageHeader title="Assessment History" sub="Organization-wide, version-aware archive" />
      <FilterBar>
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search history"
        />
      </FilterBar>
      {loading && (
        <Card>
          <div className="grid gap-2.5">
            <Skeleton />
            <Skeleton />
          </div>
        </Card>
      )}
      {error && (
        <Card>
          <p className="text-rose-600 mb-2.5">Failed to load history.</p>
          <Button variant="secondary" onClick={reload}>
            Retry
          </Button>
        </Card>
      )}
      {assignments && rows.length === 0 && (
        <Card>
          <EmptyState title="No history" />
        </Card>
      )}
      {assignments && rows.length > 0 && (
        <DataTable<HistoryRow>
          getKey={(row) => row.assignment.id}
          columns={[
            {
              key: 'user',
              header: 'User',
              render: (row) => (
                <div className="flex items-center gap-2.5">
                  <Avatar name={nameOf(row.assignment.participantId)} />
                  <span className="font-semibold text-[13px]">
                    {nameOf(row.assignment.participantId)}
                  </span>
                </div>
              ),
            },
            {
              key: 'useCase',
              header: 'Use Case',
              render: (row) => row.assignment.useCase.replace('_', ' '),
            },
            { key: 'role', header: 'Target Role', render: (row) => row.assignment.targetRole },
            {
              key: 'bpv',
              header: 'Blueprint v',
              render: (row) => row.report?.blueprintVersion ?? '—',
            },
            {
              key: 'cxv',
              header: 'Context v',
              render: (row) => row.report?.contextVersion ?? '—',
            },
            { key: 'assigned', header: 'Assigned', render: (row) => row.assignment.assignedAt },
            {
              key: 'lifecycle',
              header: 'Lifecycle',
              render: (row) => <StatusBadge status={row.assignment.lifecycleStatus} />,
            },
            {
              key: 'validity',
              header: 'Validity',
              render: (row) => <StatusBadge status={row.assignment.validityStatus} />,
            },
            {
              key: 'report',
              header: 'Report',
              render: (row) =>
                row.report ? (
                  <button
                    onClick={() => navigate(`/admin/reports/${row.report!.id}`)}
                    className="bg-none border-none text-indigo-500 font-semibold p-0"
                  >
                    {row.report.status}
                  </button>
                ) : (
                  <StatusBadge status={row.assignment.reportStatus ?? 'Unavailable'} />
                ),
            },
          ]}
          rows={rows}
        />
      )}
    </div>
  );
}
