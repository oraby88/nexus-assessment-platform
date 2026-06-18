// Assessments list (US2 / FR-ADM-006): lifecycle and validity shown as SEPARATE badges.
// Spec 012 (T014): visual parity with project/app/admin_assessments.jsx — search, Create action,
// candidate avatar cell, and a ScoreBar progress column. Lifecycle/Validity/Report stay separate.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Tabs,
  FilterBar,
  SearchInput,
  DataTable,
  StatusBadge,
  Avatar,
  ScoreBar,
  EmptyState,
  Skeleton,
  Button,
} from '@/components/ui';
import { sparkles } from '@/components/ui/icons';
import { PageHeader } from '@/features/placeholder';
import { useAsync } from '@/hooks';
import { assessmentService, participantService } from '@/services';
import type { AssessmentAssignment, Participant } from '@/models';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

export function AssessmentsList() {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync<AssessmentAssignment[]>(
    () => assessmentService.list(),
    [],
  );
  const { data: people } = useAsync<Participant[]>(() => participantService.list(), []);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

  const nameOf = useMemo(() => {
    const m = new Map((people ?? []).map((p) => [p.id, p.fullName]));
    return (id: string) => m.get(id) ?? id;
  }, [people]);

  const rows = useMemo(() => {
    let list = data ?? [];
    if (tab === 'active')
      list = list.filter((a) => !['Completed', 'Cancelled', 'Expired'].includes(a.lifecycleStatus));
    if (tab === 'completed') list = list.filter((a) => a.lifecycleStatus === 'Completed');
    const q = search.toLowerCase().trim();
    if (q)
      list = list.filter((a) =>
        `${nameOf(a.participantId)} ${a.targetRole} ${a.id}`.toLowerCase().includes(q),
      );
    return list;
  }, [data, tab, search, nameOf]);

  return (
    <div>
      <PageHeader title="Assessments" sub="Track every assignment from invitation to report." />
      <div className="mb-3.5">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>
      <FilterBar>
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search assessments…"
          aria-label="Search assessments"
        />
        <div className="flex-1" />
        <Button icon={sparkles} onClick={() => navigate('/admin/assessments/new')}>
          Create Assessment
        </Button>
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
                  <Avatar name={nameOf(a.participantId)} />
                  <div>
                    <button
                      onClick={() => navigate(`/admin/assessments/${a.id}`)}
                      className="bg-transparent border-none text-indigo-500 font-semibold p-0 text-[13px]"
                    >
                      {nameOf(a.participantId)}
                    </button>
                    <div className="text-[11.5px] text-text-3">{a.targetRole}</div>
                  </div>
                </div>
              ),
            },
            { key: 'useCase', header: 'Use Case', render: (a) => a.useCase.replace('_', ' ') },
            { key: 'deadline', header: 'Deadline', render: (a) => a.deadline ?? '—' },
            {
              key: 'progress',
              header: 'Progress',
              render: (a) => (
                <div className="flex items-center gap-2 min-w-[120px]">
                  <div className="flex-1">
                    <ScoreBar value={a.progressPercent} label="progress" />
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
              render: (a) => <StatusBadge status={a.lifecycleStatus} />,
            },
            {
              key: 'validity',
              header: 'Validity',
              render: (a) => <StatusBadge status={a.validityStatus} />,
            },
            {
              key: 'report',
              header: 'Report',
              render: (a) => <StatusBadge status={a.reportStatus ?? 'Unavailable'} />,
            },
          ]}
          rows={rows}
          stagger
        />
      )}
    </div>
  );
}
