// Context Profile detail (US2 / FR-BC-010, US4 versions). Spec 012: parity with
// app/admin_contexts.jsx ContextDetail — "Visual Context Map" radar card + "Context Dimensions"
// bar visualization (ContextMini), both driven by the real derived context signature.
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  StatusBadge,
  Chip,
  ScoreBar,
  EmptyState,
  Skeleton,
  Button,
  Timeline,
} from '@/components/ui';
import { copy, edit } from '@/components/ui/icons';
import { ContextRadar } from '@/components/charts';
import { PageHeader } from '@/features/placeholder';
import { useAsync } from '@/hooks';
import { contextProfileService } from '@/services';
import { contextSignature } from './contextSignature';
import type { ContextProfile } from '@/models';

/** Compact bar visualization of a context's derived dimensions (design ContextMini). */
function ContextMini({ axes }: { axes: { axis: string; value: number }[] }) {
  return (
    <div className="flex flex-col gap-[7px]">
      {axes.map((a) => {
        // Higher demand → warmer colour (design thresholds on the 0–100 scale).
        const color =
          a.value >= 70
            ? 'var(--rose-600)'
            : a.value >= 45
              ? 'var(--amber-600)'
              : 'var(--teal-600)';
        return (
          <div key={a.axis} className="flex items-center gap-2">
            <span className="w-[118px] text-[11px] text-text-2 font-medium flex-none truncate">
              {a.axis}
            </span>
            <div className="flex-1">
              <ScoreBar value={a.value} max={100} color={color} height={6} label={a.axis} />
            </div>
            <span className="text-[10.5px] font-bold text-text-3 w-3.5 text-right">
              {Math.round(a.value / 20)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function ContextDetail() {
  const { contextId = '' } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync<ContextProfile | undefined>(
    () => contextProfileService.get(contextId),
    [contextId],
  );

  async function duplicate() {
    const made = await contextProfileService.duplicate(contextId);
    navigate(`/admin/context-profiles/${made.id}`);
  }

  if (loading) return <Skeleton height={180} />;
  if (error)
    return (
      <Card>
        <p className="text-rose-600 mb-2.5">Failed to load context.</p>
        <Button variant="secondary" onClick={reload}>
          Retry
        </Button>
      </Card>
    );
  if (!data)
    return (
      <Card>
        <EmptyState title="Context not found" />
      </Card>
    );
  const c = data;
  const signature = c.values ? contextSignature(c.values) : undefined;

  return (
    <div>
      <PageHeader
        title={c.name}
        sub={`${c.roleTitle} · ${c.jobFamily} · ${c.jobLevel}`}
        actions={
          <>
            <Button variant="secondary" icon={copy} onClick={duplicate}>
              Duplicate
            </Button>
            <Button icon={edit} onClick={() => navigate('/admin/context-profiles/new')}>
              Edit
            </Button>
          </>
        }
      />

      {signature && (
        <div className="grid lg:grid-cols-2 gap-5 mb-5">
          {/* Visual Context Map — radar + status/linked chips (design layout). */}
          <Card className="flex flex-col items-center">
            <h3 className="text-sm font-bold self-start mb-1.5">Visual Context Map</h3>
            <ContextRadar axes={signature.axes.map((a) => ({ axis: a.axis, person: a.value }))} />
            <div className="flex gap-2.5 mt-2 flex-wrap justify-center">
              <StatusBadge status={c.status} />
              <Chip tone="slate">Linked: {c.linkedBlueprintId ?? 'None'}</Chip>
              <Chip tone="slate">v{c.version}</Chip>
            </div>
          </Card>
          {/* Context Dimensions — bar visualization. */}
          <Card>
            <h3 className="text-sm font-bold mb-4">Context Dimensions</h3>
            <ContextMini axes={signature.axes} />
            <p className="text-[12.5px] text-text-3 mt-4 leading-relaxed">{signature.summary}</p>
          </Card>
        </div>
      )}

      <Card>
        <h2 className="text-base mb-3">Version History</h2>
        {(c.versionHistory ?? []).length > 0 ? (
          <Timeline
            items={(c.versionHistory ?? []).map((v) => ({
              id: v.version,
              label: `v${v.version} — ${v.summary}`,
              time: v.date,
            }))}
          />
        ) : (
          <EmptyState title="No version history" />
        )}
      </Card>
    </div>
  );
}
