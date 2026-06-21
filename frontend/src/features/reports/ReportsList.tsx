// Reports list (US1 / FR-RPT-001). Spec 012: parity with app/admin_reports.jsx Reports —
// chip filter tabs, Export/Compare header actions, candidate (avatar + role) / Type / Blueprint
// columns, mono report id, colored Domain 6, small status badge, per-row actions.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  SearchInput,
  FilterBar,
  Chip,
  DataTable,
  StatusBadge,
  ConfidenceChip,
  Avatar,
  IconButton,
  EmptyState,
  Skeleton,
} from '@/components/ui';
import { Icon, download, compare } from '@/components/ui/icons';
import { PageHeader } from '@/features/placeholder';
import { useAsync, useToast } from '@/hooks';
import { reportService, participantService } from '@/services';
import type { Participant, Report } from '@/models';

const FILTERS = ['All', 'Released', 'Caution', 'Processing'] as const;
type Filter = (typeof FILTERS)[number];

function matchesFilter(r: Report, f: Filter): boolean {
  if (f === 'All') return true;
  if (f === 'Released') return r.status === 'Released';
  if (f === 'Caution') return r.status.includes('Caution') || r.status.includes('Partial');
  return r.status === 'Processing';
}

export function ReportsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, loading, error, reload } = useAsync<Report[]>(() => reportService.list(), []);
  const { data: people } = useAsync<Participant[]>(() => participantService.list(), []);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  const nameOf = useMemo(() => {
    const m = new Map((people ?? []).map((p) => [p.id, p.fullName]));
    return (id: string) => m.get(id) ?? id;
  }, [people]);

  const rows = (data ?? []).filter((r) => {
    const q = search.toLowerCase().trim();
    if (
      q &&
      !r.targetRole.toLowerCase().includes(q) &&
      !nameOf(r.participantId).toLowerCase().includes(q)
    )
      return false;
    return matchesFilter(r, filter);
  });

  return (
    <div>
      <PageHeader
        title="Reports"
        sub={`${(data ?? []).length} governed reports across your workspace.`}
        actions={
          <>
            <Button
              variant="secondary"
              icon={download}
              onClick={() => toast('Export started', 'info')}
            >
              Export
            </Button>
            <Button
              variant="secondary"
              icon={compare}
              onClick={() => navigate('/admin/comparison')}
            >
              Compare
            </Button>
          </>
        }
      />

      <FilterBar>
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reports…"
          aria-label="Search reports"
        />
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
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
          </div>
        </Card>
      )}
      {error && (
        <Card>
          <p className="text-rose-600 mb-2.5">Failed to load reports.</p>
          <Button variant="secondary" onClick={reload}>
            Retry
          </Button>
        </Card>
      )}
      {data && rows.length === 0 && (
        <Card>
          <EmptyState title="No reports" sub="No reports match your filters." />
        </Card>
      )}
      {data && rows.length > 0 && (
        <DataTable<Report>
          getKey={(r) => r.id}
          columns={[
            {
              key: 'id',
              header: 'Report',
              render: (r) => (
                <button
                  onClick={() => navigate(`/admin/reports/${r.id}`)}
                  className="mono text-xs text-text-2 bg-transparent border-none p-0"
                >
                  {r.id}
                </button>
              ),
            },
            {
              key: 'candidate',
              header: 'Candidate',
              render: (r) => (
                <button
                  onClick={() => navigate(`/admin/reports/${r.id}`)}
                  className="flex items-center gap-2.5 bg-transparent border-none p-0 text-start"
                >
                  <Avatar name={nameOf(r.participantId)} size={30} />
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold truncate">
                      {nameOf(r.participantId)}
                    </span>
                    <span className="block text-[11.5px] text-text-3 truncate">{r.targetRole}</span>
                  </span>
                </button>
              ),
            },
            {
              key: 'type',
              header: 'Type',
              render: (r) => (
                <span className="text-[12.5px] text-text-2 capitalize">
                  {r.useCase.replace(/_/g, ' ')}
                </span>
              ),
            },
            {
              key: 'blueprint',
              header: 'Blueprint',
              render: (r) => <span className="text-[12.5px]">{r.blueprintId ?? '—'}</span>,
            },
            {
              key: 'completed',
              header: 'Completed',
              render: (r) => <span className="text-[12.5px] text-text-2">{r.completedAt}</span>,
            },
            {
              key: 'confidence',
              header: 'Confidence',
              render: (r) => <ConfidenceChip band={r.confidence} />,
            },
            {
              key: 'd6',
              // Domain 6 contextual-alignment band (design shows the fit descriptor here, NOT the
              // confidence level — that has its own column). Teal when strongly aligned, else amber.
              header: 'Domain 6',
              render: (r) =>
                r.domain6?.caiBand ? (
                  <span
                    className="text-[12.5px] font-semibold"
                    style={{
                      color: r.domain6.caiBand.includes('Strong')
                        ? 'var(--teal-700)'
                        : 'var(--amber-700)',
                    }}
                  >
                    {r.domain6.caiBand}
                  </span>
                ) : (
                  <span className="text-text-3">—</span>
                ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (r) => <StatusBadge status={r.status} size="sm" />,
            },
            {
              key: 'actions',
              header: '',
              render: (r) => (
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <IconButton label="Download PDF" onClick={() => toast('Export started', 'info')}>
                    <Icon path={download} size={16} />
                  </IconButton>
                  <IconButton label="Compare" onClick={() => navigate('/admin/comparison')}>
                    <Icon path={compare} size={16} />
                  </IconButton>
                  <span className="sr-only">{r.id}</span>
                </div>
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
