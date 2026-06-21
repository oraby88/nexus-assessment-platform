// Context Profiles list (US2 / FR-BC-008). Spec 012 T033: parity with app/admin_contexts.jsx —
// icon-badge name cell + status filter chips + header action. Search + navigation preserved.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, plus, download, context as contextIcon } from '@/components/ui/icons';
import {
  Card,
  Button,
  SearchInput,
  FilterBar,
  Chip,
  DataTable,
  StatusBadge,
  EmptyState,
  Skeleton,
} from '@/components/ui';
import { PageHeader } from '@/features/placeholder';
import { useAsync, useToast } from '@/hooks';
import { contextProfileService } from '@/services';
import type { ContextProfile } from '@/models';

const STATUS_FILTERS = ['All', 'Active', 'Draft', 'Archived'];

export function ContextsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, loading, error, reload } = useAsync<ContextProfile[]>(
    () => contextProfileService.list(),
    [],
  );
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const rows = (data ?? []).filter((c) => {
    if (!c.name.toLowerCase().includes(search.toLowerCase().trim())) return false;
    if (status !== 'All' && c.status !== status) return false;
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Context Profiles"
        sub="Describe the environment a role operates in — the engine behind Domain 6 contextual alignment."
        actions={
          <>
            <Button
              variant="secondary"
              icon={download}
              onClick={() => toast('Export started', 'info')}
            >
              Export
            </Button>
            <Button icon={plus} onClick={() => navigate('/admin/context-profiles/new')}>
              Create Context Profile
            </Button>
          </>
        }
      />

      <FilterBar>
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contexts…"
          aria-label="Search contexts"
        />
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <Chip key={f} tone="indigo" active={status === f} onClick={() => setStatus(f)}>
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
          <p className="text-rose-600 mb-2.5">Failed to load contexts.</p>
          <Button variant="secondary" onClick={reload}>
            Retry
          </Button>
        </Card>
      )}
      {data && rows.length === 0 && (
        <Card>
          <EmptyState
            title="No context profiles"
            sub="Create one to capture a role's environment."
          />
        </Card>
      )}
      {data && rows.length > 0 && (
        <DataTable<ContextProfile>
          getKey={(c) => c.id}
          columns={[
            {
              key: 'name',
              header: 'Context',
              render: (c) => (
                <button
                  onClick={() => navigate(`/admin/context-profiles/${c.id}`)}
                  className="flex items-center gap-2.5 bg-transparent border-none p-0 text-start"
                >
                  <span
                    className="w-8 h-8 rounded-[9px] grid place-items-center flex-none"
                    style={{ background: 'var(--teal-50)', color: 'var(--teal-600)' }}
                  >
                    <Icon path={contextIcon} size={16} />
                  </span>
                  <span className="font-semibold">{c.name}</span>
                </button>
              ),
            },
            { key: 'role', header: 'Linked Role', render: (c) => c.roleTitle },
            {
              key: 'family',
              header: 'Family',
              render: (c) => <span className="text-text-2">{c.jobFamily}</span>,
            },
            {
              key: 'level',
              header: 'Level',
              render: (c) => <span className="text-text-2">{c.jobLevel}</span>,
            },
            {
              key: 'blueprint',
              header: 'Linked Blueprint',
              render: (c) => <span className="text-[12.5px]">{c.linkedBlueprintId ?? '—'}</span>,
            },
            {
              key: 'status',
              header: 'Status',
              render: (c) => <StatusBadge status={c.status} size="sm" />,
            },
            {
              key: 'updated',
              header: 'Updated',
              render: (c) => <span className="text-[12.5px] text-text-3">{c.updatedAt}</span>,
            },
          ]}
          rows={rows}
          stagger
        />
      )}
    </div>
  );
}
