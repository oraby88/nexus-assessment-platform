// Users / Candidates list (US1 / FR-ADM-002). Spec 012 T033: parity with app/admin_candidates.jsx —
// avatar candidate cell + status filter chips. Search, pagination, Add/Bulk, separate lifecycle/report.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { plus, upload, download, compare } from '@/components/ui/icons';
import {
  Card,
  Button,
  SearchInput,
  FilterBar,
  Chip,
  DataTable,
  StatusBadge,
  Avatar,
  EmptyState,
  Skeleton,
} from '@/components/ui';
import { PageHeader } from '@/features/placeholder';
import { AddUserDrawer } from './AddUserDrawer';
import { BulkUploadModal } from './BulkUploadModal';
import { useAsync, useToast } from '@/hooks';
import { participantService } from '@/services';
import type { Participant } from '@/models';

const PAGE_SIZE = 25;
const STATUS_FILTERS = ['All', 'Completed', 'In Progress', 'Not Started', 'Expired'];

export function UsersList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, loading, error, reload } = useAsync<Participant[]>(
    () => participantService.list(),
    [],
  );
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const filtered = useMemo(() => {
    let rows = data ?? [];
    const q = search.toLowerCase().trim();
    if (q)
      rows = rows.filter(
        (p) => p.fullName.toLowerCase().includes(q) || p.email.toLowerCase().includes(q),
      );
    if (status !== 'All')
      rows = rows.filter((p) => (p.latestAssessmentLifecycle ?? 'Not Started') === status);
    return rows;
  }, [data, search, status]);

  const paged = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const allSelected = paged.length > 0 && paged.every((p) => selected.has(p.id));
  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) paged.forEach((p) => next.delete(p.id));
      else paged.forEach((p) => next.add(p.id));
      return next;
    });

  return (
    <div>
      <PageHeader
        title="Users"
        sub={`${(data ?? []).length} people across your workspace.`}
        actions={
          <>
            <Button
              variant="secondary"
              icon={download}
              onClick={() => toast('Export started', 'info')}
            >
              Export
            </Button>
            <Button variant="secondary" icon={upload} onClick={() => setBulkOpen(true)}>
              Bulk Upload
            </Button>
            <Button icon={plus} onClick={() => setAddOpen(true)}>
              Add User
            </Button>
          </>
        }
      />

      <FilterBar>
        <SearchInput
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          placeholder="Search users…"
          aria-label="Search users"
        />
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <Chip
              key={f}
              tone="indigo"
              active={status === f}
              onClick={() => {
                setStatus(f);
                setPage(0);
              }}
            >
              {f}
            </Chip>
          ))}
        </div>
        {selected.size > 0 && (
          <div className="ms-auto flex items-center gap-2.5 ps-3.5 pe-1.5 py-1.5 rounded-full bg-indigo-50">
            <span className="text-[13px] font-semibold text-indigo-700">
              {selected.size} selected
            </span>
            <Button size="sm" icon={compare} onClick={() => navigate('/admin/comparison')}>
              Add to Comparison
            </Button>
          </div>
        )}
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
          <p className="text-rose-600 mb-2.5">Failed to load users.</p>
          <Button variant="secondary" onClick={reload}>
            Retry
          </Button>
        </Card>
      )}
      {data && filtered.length === 0 && (
        <Card>
          <EmptyState
            title="No users match"
            sub="Adjust your search or add a user to get started."
          />
        </Card>
      )}
      {data && filtered.length > 0 && (
        <>
          <DataTable<Participant>
            getKey={(p) => p.id}
            columns={[
              {
                key: 'name',
                header: 'Candidate',
                render: (p) => (
                  <button
                    onClick={() => navigate(`/admin/users/${p.id}`)}
                    className="flex items-center gap-2.5 bg-transparent border-none p-0 text-start"
                  >
                    <Avatar name={p.fullName} size={34} />
                    <div className="min-w-0">
                      <div className="font-semibold text-[13px]">{p.fullName}</div>
                      <div className="text-xs text-text-3 truncate">{p.email}</div>
                    </div>
                  </button>
                ),
              },
              {
                key: 'role',
                header: 'Target Role',
                render: (p) => (
                  <div>
                    <div className="font-medium">{p.targetJobTitle ?? '—'}</div>
                    {p.departmentText && (
                      <div className="text-xs text-text-3">{p.departmentText}</div>
                    )}
                  </div>
                ),
              },
              {
                key: 'level',
                header: 'Level',
                render: (p) => <span className="text-text-2">{p.jobLevel}</span>,
              },
              {
                key: 'total',
                header: 'Assess.',
                right: true,
                render: (p) => <span className="font-semibold">{p.totalAssessments}</span>,
              },
              {
                key: 'lifecycle',
                header: 'Latest Status',
                render: (p) => (
                  <StatusBadge status={p.latestAssessmentLifecycle ?? 'Not Started'} size="sm" />
                ),
              },
              {
                key: 'report',
                header: 'Report',
                render: (p) => (
                  <StatusBadge
                    status={p.latestReportStatus ?? 'Unavailable'}
                    size="sm"
                    dot={!!p.latestReportStatus}
                  />
                ),
              },
              {
                key: 'added',
                header: 'Added',
                render: (p) => <span className="text-[12.5px] text-text-3">{p.dateAdded}</span>,
              },
            ]}
            rows={paged}
            stagger
            selectedKeys={selected}
            onToggleRow={toggleRow}
            allSelected={allSelected}
            onToggleAll={toggleAll}
          />
          {pageCount > 1 && (
            <div className="flex gap-2 items-center mt-3.5 justify-end">
              <Button
                variant="secondary"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>
              <span className="text-[13px] text-text-3">
                Page {page + 1} of {pageCount}
              </span>
              <Button
                variant="secondary"
                disabled={page >= pageCount - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <AddUserDrawer open={addOpen} onClose={() => setAddOpen(false)} onCreated={() => reload()} />
      <BulkUploadModal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onImported={() => reload()}
      />
    </div>
  );
}
