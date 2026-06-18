// Admin Activity Log (Spec 007 / US3 / FR-PAP-008/009/010). A curated, read-only set of selected
// high-value governance/operational events with search + type/actor/date filters (combined AND).
// It is a prototype read view — NOT an exhaustive or immutable audit log.
import { useMemo, useState } from 'react';
import {
  Button,
  Card,
  Chip,
  DataTable,
  EmptyState,
  FilterBar,
  SearchInput,
  Select,
  Skeleton,
  TextInput,
} from '@/components/ui';
import { PageHeader } from '@/features/placeholder';
import { useAsync } from '@/hooks';
import { activityLogService } from '@/services';
import type { ActivityLogEvent } from '@/models';

export interface ActivityFilters {
  q?: string;
  type?: string;
  actor?: string;
  date?: string;
}

/** Pure filter — search + type + actor + date combined as logical AND (FR-PAP-009). */
export function filterEvents(events: ActivityLogEvent[], f: ActivityFilters): ActivityLogEvent[] {
  const q = (f.q ?? '').toLowerCase().trim();
  return events.filter((e) => {
    if (
      q &&
      !`${e.action} ${e.targetType} ${e.detail ?? ''} ${e.actorName} ${e.targetId ?? ''}`
        .toLowerCase()
        .includes(q)
    )
      return false;
    if (f.type && e.targetType !== f.type) return false;
    if (f.actor && e.actorName !== f.actor) return false;
    if (f.date && e.createdAt.slice(0, 10) !== f.date) return false;
    return true;
  });
}

export function ActivityLog() {
  const { data, loading, error, reload } = useAsync<ActivityLogEvent[]>(
    () => activityLogService.list(),
    [],
  );
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [actor, setActor] = useState('');
  const [date, setDate] = useState('');

  const events = data ?? [];
  const types = useMemo(
    () => Array.from(new Set(events.map((e) => e.targetType))).sort(),
    [events],
  );
  const actors = useMemo(
    () => Array.from(new Set(events.map((e) => e.actorName))).sort(),
    [events],
  );
  const rows = useMemo(
    () => filterEvents(events, { q, type, actor, date }),
    [events, q, type, actor, date],
  );

  if (loading) return <Skeleton height={200} />;
  if (error)
    return (
      <Card>
        <p className="text-rose-600 mb-2.5">Couldn’t load the activity log.</p>
        <Button variant="secondary" onClick={reload}>
          Retry
        </Button>
      </Card>
    );

  return (
    <div>
      <PageHeader title="Activity Log" sub="Selected governance & operational events" />
      <Card className="mb-3 text-[13px] text-text-2">
        <Chip tone="slate">Prototype read view</Chip>
        <span className="ms-2">
          A curated view of selected high-value events — not an exhaustive or immutable audit log.
        </span>
      </Card>
      <FilterBar>
        <SearchInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search activity"
        />
        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label="Filter by type"
          className="max-w-[200px]"
        >
          <option value="">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
        <Select
          value={actor}
          onChange={(e) => setActor(e.target.value)}
          aria-label="Filter by actor"
          className="max-w-[200px]"
        >
          <option value="">All actors</option>
          {actors.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </Select>
        <TextInput
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Filter by date"
          className="max-w-[180px]"
        />
      </FilterBar>
      {rows.length === 0 ? (
        <Card>
          <EmptyState title="No matching events" sub="Try clearing or adjusting your filters." />
        </Card>
      ) : (
        <DataTable<ActivityLogEvent>
          getKey={(e) => e.id}
          columns={[
            { key: 'actor', header: 'Actor', render: (e) => e.actorName },
            {
              key: 'action',
              header: 'Event',
              render: (e) => (
                <span>
                  {e.action}
                  {e.detail ? <span className="text-text-3"> — {e.detail}</span> : null}
                </span>
              ),
            },
            {
              key: 'target',
              header: 'Target',
              render: (e) => <Chip tone="slate">{e.targetType}</Chip>,
            },
            { key: 'when', header: 'When', render: (e) => e.createdAt.slice(0, 10) },
          ]}
          rows={rows}
        />
      )}
    </div>
  );
}
