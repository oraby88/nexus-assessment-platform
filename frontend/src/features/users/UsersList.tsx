// Users / Candidates list (US1 / FR-ADM-002). Spec 012 T033: parity with app/admin_candidates.jsx —
// avatar candidate cell + status filter chips. Search, pagination, Add/Bulk, separate lifecycle/report.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { plus } from '@/components/ui/icons';
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
import { AddUserDrawer } from './AddUserDrawer';
import { BulkUploadModal } from './BulkUploadModal';
import { useAsync } from '@/hooks';
import { participantService } from '@/services';
import type { Participant } from '@/models';

const PAGE_SIZE = 25;
const STATUS_FILTERS = ['All', 'Completed', 'In Progress', 'Not Started', 'Expired'];

export function UsersList() {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync<Participant[]>(
    () => participantService.list(),
    [],
  );
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);

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

  return (
    <div>
      <PageHeader title="Users" sub="People in your organization" />

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
          {STATUS_FILTERS.map((f) => {
            const on = status === f;
            return (
              <button
                key={f}
                onClick={() => {
                  setStatus(f);
                  setPage(0);
                }}
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: on ? 'var(--tone-indigo-dot)' : 'var(--surface-2)',
                  color: on ? '#fff' : 'var(--text-2)',
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={() => setBulkOpen(true)}>
          Bulk Upload
        </Button>
        <Button icon={plus} onClick={() => setAddOpen(true)}>
          Add User
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
                    <Avatar name={p.fullName} />
                    <div className="min-w-0">
                      <div className="text-indigo-500 font-semibold text-[13px]">{p.fullName}</div>
                      <div className="text-[11.5px] text-text-3 truncate">{p.email}</div>
                    </div>
                  </button>
                ),
              },
              { key: 'role', header: 'Target Role', render: (p) => p.targetJobTitle ?? '—' },
              { key: 'level', header: 'Level', render: (p) => p.jobLevel },
              { key: 'total', header: 'Assessments', render: (p) => p.totalAssessments },
              {
                key: 'lifecycle',
                header: 'Latest',
                render: (p) => (
                  <StatusBadge status={p.latestAssessmentLifecycle ?? 'Not Started'} />
                ),
              },
              {
                key: 'report',
                header: 'Report',
                render: (p) => <StatusBadge status={p.latestReportStatus ?? 'Unavailable'} />,
              },
            ]}
            rows={paged}
            stagger
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
