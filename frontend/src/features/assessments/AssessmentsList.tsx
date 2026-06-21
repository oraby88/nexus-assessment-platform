// Assessments list (US2 / FR-ADM-006): lifecycle and validity shown as SEPARATE badges.
// Spec 012 (T014): visual parity with project/app/admin_assessments.jsx — search, Create action,
// candidate avatar cell, and a ScoreBar progress column. Lifecycle/Validity/Report stay separate.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  FilterBar,
  SearchInput,
  Chip,
  DataTable,
  StatusBadge,
  Avatar,
  ScoreBar,
  EmptyState,
  Skeleton,
  Button,
} from '@/components/ui';
import { sparkles, download } from '@/components/ui/icons';
import { PageHeader } from '@/features/placeholder';
import { useAsync, useToast } from '@/hooks';
import { assessmentService, participantService } from '@/services';
import type { AssessmentAssignment, Participant } from '@/models';

const STATUS_FILTERS = ['All', 'In Progress', 'Completed', 'Not Started', 'Expired'];

export function AssessmentsList() {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync<AssessmentAssignment[]>(
    () => assessmentService.list(),
    [],
  );
  const { data: people } = useAsync<Participant[]>(() => participantService.list(), []);
  const { toast } = useToast();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const nameOf = useMemo(() => {
    const m = new Map((people ?? []).map((p) => [p.id, p.fullName]));
    return (id: string) => m.get(id) ?? id;
  }, [people]);

  const rows = useMemo(() => {
    let list = data ?? [];
    if (filter !== 'All') list = list.filter((a) => a.lifecycleStatus === filter);
    const q = search.toLowerCase().trim();
    if (q)
      list = list.filter((a) =>
        `${nameOf(a.participantId)} ${a.targetRole} ${a.id}`.toLowerCase().includes(q),
      );
    return list;
  }, [data, filter, search, nameOf]);

  return (
    <div>
      <PageHeader
        title="Assessments"
        sub="Track every assignment from invitation to report."
        actions={
          <>
            <Button
              variant="secondary"
              icon={download}
              onClick={() => toast('Export started', 'info')}
            >
              Export
            </Button>
            <Button icon={sparkles} onClick={() => navigate('/admin/assessments/new')}>
              Create Assessment
            </Button>
          </>
        }
      />
      <FilterBar>
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search assessments…"
          aria-label="Search assessments"
        />
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <Chip key={f} tone="indigo" active={filter === f} onClick={() => setFilter(f)}>
              {f}
            </Chip>
          ))}
        </div>
      </FilterBar>
      {loading && (
        <Card>
          <div className="grid gap-2.5">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        </Card>
      )}
      {error && (
        <Card>
          <p className="text-rose-600 mb-2.5">Failed to load assessments.</p>
          <Button variant="secondary" onClick={reload}>
            Retry
          </Button>
        </Card>
      )}
      {data && rows.length === 0 && (
        <Card>
          <EmptyState title="No assessments" sub="No assessments match this view." />
        </Card>
      )}
      {data && rows.length > 0 && (
        <DataTable<AssessmentAssignment>
          getKey={(a) => a.id}
          columns={[
            {
              key: 'id',
              header: 'ID',
              render: (a) => <span className="font-mono text-xs text-text-2">{a.id}</span>,
            },
            {
              key: 'user',
              header: 'Candidate',
              render: (a) => (
                <div className="flex items-center gap-2.5">
                  <Avatar name={nameOf(a.participantId)} size={30} />
                  <div>
                    <button
                      onClick={() => navigate(`/admin/assessments/${a.id}`)}
                      className="bg-transparent border-none font-semibold p-0 text-[13px]"
                    >
                      {nameOf(a.participantId)}
                    </button>
                    <div className="text-[11.5px] text-text-3">{a.targetRole}</div>
                  </div>
                </div>
              ),
            },
            {
              key: 'useCase',
              header: 'Use Case',
              render: (a) => (
                <span className="text-[12.5px] text-text-2 capitalize">
                  {a.useCase.replace(/_/g, ' ')}
                </span>
              ),
            },
            {
              key: 'deadline',
              header: 'Deadline',
              render: (a) => <span className="text-[12.5px] text-text-2">{a.deadline ?? '—'}</span>,
            },
            {
              key: 'progress',
              header: 'Progress',
              render: (a) => (
                <div className="flex items-center gap-2 min-w-[120px]">
                  <div className="flex-1">
                    <ScoreBar
                      value={a.progressPercent}
                      height={6}
                      color={a.progressPercent === 100 ? 'var(--teal-600)' : 'var(--indigo-500)'}
                      label="progress"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-text-3 w-7 text-right">
                    {a.progressPercent}%
                  </span>
                </div>
              ),
            },
            {
              key: 'lifecycle',
              header: 'Lifecycle',
              render: (a) => <StatusBadge status={a.lifecycleStatus} size="sm" />,
            },
            {
              key: 'validity',
              header: 'Validity',
              render: (a) => <StatusBadge status={a.validityStatus} size="sm" />,
            },
            {
              key: 'report',
              header: 'Report',
              render: (a) => (
                <StatusBadge
                  status={a.reportStatus ?? 'Unavailable'}
                  size="sm"
                  dot={!!a.reportStatus}
                />
              ),
            },
          ]}
          rows={rows}
          stagger
        />
      )}
    </div>
  );
}
