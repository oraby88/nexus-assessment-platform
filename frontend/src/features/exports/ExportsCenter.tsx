// Exports center (US4 / FR-ADM-009, research D2): Users/Assessments active; five registered-pending.
// Spec 012 (T018): visual parity with project/app/admin_misc.jsx Exports — export-type card grid with
// icon badges + an Export History panel. Real registry/availability/CSV-download logic preserved.
import { Card, Button, Chip, StatusBadge, EmptyState, Skeleton } from '@/components/ui';
import {
  Icon,
  candidates,
  assessment,
  clock,
  reports as reportsIcon,
  compare,
  blueprint,
  context,
} from '@/components/ui/icons';
import { PageHeader } from '@/features/placeholder';
import { useAsync, useToast } from '@/hooks';
import { exportService } from '@/services';
import type { ExportJob, ExportRegistryEntry, ExportType } from '@/models';

// Icon per export type (design icon badges).
const TYPE_ICON: Record<ExportType, string> = {
  users: candidates,
  assessments: assessment,
  history: clock,
  reports: reportsIcon,
  comparison: compare,
  blueprints: blueprint,
  contexts: context,
};

export function ExportsCenter() {
  const { toast } = useToast();
  const { data: registry, loading } = useAsync<ExportRegistryEntry[]>(
    () => exportService.registry(),
    [],
  );
  const { data: history, reload: reloadHistory } = useAsync<ExportJob[]>(
    () => exportService.history(),
    [],
  );

  async function runExport(entry: ExportRegistryEntry) {
    try {
      const job = await exportService.request(entry.type);
      const csv = await exportService.getCsv(job.id);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexus-${entry.type}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast(`${entry.label} exported`, 'success');
      reloadHistory();
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  }

  return (
    <div>
      <PageHeader
        title="Exports"
        sub="Generate data exports with filters, date ranges and status scoping."
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        {/* Export-type card grid */}
        <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
          {loading && (
            <>
              <Skeleton height={110} />
              <Skeleton height={110} />
            </>
          )}
          {registry?.map((e) => (
            <Card key={e.type}>
              <div className="flex items-center gap-[11px] mb-3.5">
                <span
                  className="w-[38px] h-[38px] rounded-[10px] grid place-items-center flex-none"
                  style={{ background: 'var(--indigo-50)', color: 'var(--indigo-500)' }}
                >
                  <Icon path={TYPE_ICON[e.type]} size={18} />
                </span>
                <div className="font-bold text-sm">{e.label}</div>
              </div>
              {e.available ? (
                <Button variant="secondary" className="w-full" onClick={() => runExport(e)}>
                  Export CSV
                </Button>
              ) : (
                <Chip tone="slate">Pending (Spec {e.ownedBy})</Chip>
              )}
            </Card>
          ))}
        </div>

        {/* Export History panel */}
        <Card>
          <h2 className="text-sm font-bold mb-3.5">Export History</h2>
          {history && history.length === 0 && <EmptyState title="No exports yet" />}
          {history && history.length > 0 && (
            <ul className="list-none m-0 p-0">
              {history.map((j, i) => (
                <li
                  key={j.id}
                  className={`flex items-center gap-2.5 py-[11px] ${i ? 'border-t border-border-soft' : ''}`}
                >
                  <Icon path={reportsIcon} size={17} style={{ color: 'var(--text-3)' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate">{j.type}</div>
                    <div className="text-[11.5px] text-text-3">{j.createdAt}</div>
                  </div>
                  <StatusBadge status={j.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
