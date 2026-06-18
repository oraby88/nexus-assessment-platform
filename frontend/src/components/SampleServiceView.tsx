// Sample service-driven view (task T035 / SC-004) — proves the UI→service seam end-to-end:
// data arrives via a typed Promise with loading → success/error → retry, and this component
// imports NO fixtures or persistence directly (constitution IV).
import { Card, DataTable, EmptyState, Skeleton, StatusBadge, Button } from '@/components/ui';
import { useAsync } from '@/hooks';
import { participantService } from '@/services';
import type { Participant } from '@/models';

export function SampleServiceView() {
  const { data, loading, error, reload } = useAsync<Participant[]>(
    () => participantService.list(),
    [],
  );

  if (loading) {
    return (
      <Card>
        <div className="grid gap-2.5">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="text-rose-600 mb-2.5">Failed to load users.</p>
        <Button variant="secondary" onClick={reload}>
          Retry
        </Button>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <EmptyState title="No users yet" sub="Add a user to get started." />
      </Card>
    );
  }

  return (
    <Card>
      <DataTable<Participant>
        getKey={(p) => p.id}
        columns={[
          { key: 'name', header: 'Name', render: (p) => p.fullName },
          { key: 'role', header: 'Target Role', render: (p) => p.targetJobTitle ?? '—' },
          {
            key: 'status',
            header: 'Latest',
            render: (p) => <StatusBadge status={p.latestAssessmentLifecycle ?? 'Not Started'} />,
          },
        ]}
        rows={data}
      />
    </Card>
  );
}
