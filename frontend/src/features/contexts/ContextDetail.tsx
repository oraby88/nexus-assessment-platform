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
import { copy, edit, link } from '@/components/ui/icons';
import { ContextRadar } from '@/components/charts';
import { PageHeader } from '@/features/placeholder';
import { useAsync, useToast } from '@/hooks';
import { contextProfileService } from '@/services';
import { contextSignature, CONTEXT_FIELDS } from './contextSignature';
import type { ContextProfile, ContextProfileValues } from '@/models';

/** Compact 14-field bar visualization of a context's dimensions (design ContextMini — maps every
 * CONTEXT_FIELD over the raw values; higher demand → warmer colour). */
function ContextMini({ values }: { values: ContextProfileValues }) {
  return (
    <div className="flex flex-col gap-[7px]">
      {CONTEXT_FIELDS.map((f) => {
        const v = values[f.key] ?? 0;
        const pct = (v / f.max) * 100;
        const color =
          pct >= 70 ? 'var(--rose-600)' : pct >= 45 ? 'var(--amber-600)' : 'var(--teal-600)';
        return (
          <div key={f.key} className="flex items-center gap-2">
            <span className="w-[118px] text-[11px] text-text-2 font-medium flex-none truncate">
              {f.label}
            </span>
            <div className="flex-1">
              <ScoreBar
                value={v}
                max={f.max}
                color={color}
                height={6}
                label={`${f.label} intensity`}
              />
            </div>
            <span className="text-[10.5px] font-bold text-text-3 w-3.5 text-right">{v}</span>
          </div>
        );
      })}
    </div>
  );
}

export function ContextDetail() {
  const { contextId = '' } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
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
            <Button
              variant="secondary"
              icon={link}
              onClick={() => toast('Link to a blueprint from the Blueprint detail screen', 'info')}
            >
              Link to Blueprint
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
          {/* Context Dimensions — full 14-field bar visualization (design ContextMini). */}
          <Card>
            <h3 className="text-sm font-bold mb-4">Context Dimensions</h3>
            {c.values && <ContextMini values={c.values} />}
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
