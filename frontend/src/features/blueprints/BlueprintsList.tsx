// Role Blueprints list (US1 / FR-BC-001). Spec 012 T033: parity with app/admin_blueprints.jsx —
// icon-badge name cell + status filter chips + header action. Search + navigation preserved.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, plus, blueprint as blueprintIcon } from '@/components/ui/icons';
import {
  Card,
  Button,
  SearchInput,
  FilterBar,
  DataTable,
  StatusBadge,
  EmptyState,
  Skeleton,
} from '@/components/ui';
import { PageHeader } from '@/features/placeholder';
import { useAsync } from '@/hooks';
import { roleBlueprintService } from '@/services';
import type { RoleBlueprint } from '@/models';

const STATUS_FILTERS = ['All', 'Validated', 'Active', 'Under Review', 'Draft', 'Archived'];

export function BlueprintsList() {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync<RoleBlueprint[]>(
    () => roleBlueprintService.list(),
    [],
  );
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const rows = (data ?? []).filter((b) => {
    if (!b.name.toLowerCase().includes(search.toLowerCase().trim())) return false;
    if (status !== 'All' && b.status !== status) return false;
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Role Blueprints"
        sub="Define what success looks like for a role — beyond the job title."
        actions={
          <Button icon={plus} onClick={() => navigate('/admin/role-blueprints/new')}>
            Create Blueprint
          </Button>
        }
      />

      <FilterBar>
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search blueprints…"
          aria-label="Search blueprints"
        />
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => {
            const on = status === f;
            return (
              <button
                key={f}
                onClick={() => setStatus(f)}
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
          <p className="text-rose-600 mb-2.5">Failed to load blueprints.</p>
          <Button variant="secondary" onClick={reload}>
            Retry
          </Button>
        </Card>
      )}
      {data && rows.length === 0 && (
        <Card>
          <EmptyState title="No blueprints" sub="Create one to define role success." />
        </Card>
      )}
      {data && rows.length > 0 && (
        <DataTable<RoleBlueprint>
          getKey={(b) => b.id}
          columns={[
            {
              key: 'name',
              header: 'Blueprint',
              render: (b) => (
                <button
                  onClick={() => navigate(`/admin/role-blueprints/${b.id}`)}
                  className="flex items-center gap-2.5 bg-transparent border-none p-0 text-start"
                >
                  <span
                    className="w-8 h-8 rounded-[9px] grid place-items-center flex-none"
                    style={{ background: 'var(--indigo-50)', color: 'var(--indigo-500)' }}
                  >
                    <Icon path={blueprintIcon} size={16} />
                  </span>
                  <span className="font-semibold text-indigo-500">{b.name}</span>
                </button>
              ),
            },
            { key: 'role', header: 'Role Title', render: (b) => b.roleTitle },
            { key: 'family', header: 'Family', render: (b) => b.jobFamily },
            { key: 'level', header: 'Level', render: (b) => b.jobLevel },
            { key: 'status', header: 'Status', render: (b) => <StatusBadge status={b.status} /> },
            {
              key: 'version',
              header: 'Version',
              render: (b) => <span className="font-mono text-xs">{b.version}</span>,
            },
            {
              key: 'context',
              header: 'Linked Context',
              render: (b) => b.linkedContextProfileId ?? '—',
            },
          ]}
          rows={rows}
        />
      )}
    </div>
  );
}
