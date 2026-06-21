// Role Blueprint detail (US1 / FR-BC-006/007, US3 link, US4 versions).
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Tabs,
  StatusBadge,
  Select,
  Button,
  Chip,
  EmptyState,
  Skeleton,
  Timeline,
} from '@/components/ui';
import { sparkles } from '@/components/ui/icons';
import { PageHeader } from '@/features/placeholder';
import { useAsync, useToast } from '@/hooks';
import { dimensionCatalog } from '@/lib/dimensions';
import { roleBlueprintService, contextProfileService } from '@/services';
import type {
  BlueprintStatus,
  ContextProfile,
  DimensionCatalogEntry,
  RoleBlueprint,
} from '@/models';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'dimensions', label: 'Dimensions' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'versions', label: 'Version History' },
];

// Dimension disposition → tone (design admin_blueprints.jsx: Required=rose, Optional=indigo,
// Excluded=slate). Rendered as a tinted pill on each dimension card.
const DISPOSITION_TONE: Record<string, string> = {
  Required: 'rose',
  Optional: 'indigo',
  Excluded: 'slate',
};

/** Tone-pilled card for one dimension (design Dimensions tab grid). */
function DimensionCard({
  name,
  code,
  disposition,
  importance,
}: {
  name: string;
  code: string;
  disposition: string;
  importance: string;
}) {
  const tone = DISPOSITION_TONE[disposition] ?? 'slate';
  return (
    <div className="bg-surface border border-border rounded-md p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <span className="mono text-[10.5px] font-bold text-text-3">{code}</span>
        <span
          className="text-[10.5px] font-bold rounded-full px-2 py-[2px]"
          style={{ background: `var(--tone-${tone}-bg)`, color: `var(--tone-${tone}-fg)` }}
        >
          {disposition}
        </span>
      </div>
      <div className="text-sm font-semibold mt-2.5">{name}</div>
      <div className="text-xs text-text-3 mt-1">Importance: {importance}</div>
    </div>
  );
}
const STATUSES: BlueprintStatus[] = [
  'Draft',
  'Under Review',
  'Active',
  'Validated',
  'Deprecated',
  'Archived',
];

export function BlueprintDetail() {
  const { blueprintId = '' } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState('overview');
  const { data, loading, error, reload } = useAsync<RoleBlueprint | undefined>(
    () => roleBlueprintService.get(blueprintId),
    [blueprintId],
  );
  const { data: contexts } = useAsync<ContextProfile[]>(() => contextProfileService.list(), []);
  const { data: dimMeta } = useAsync<DimensionCatalogEntry[]>(() => dimensionCatalog(), []);

  if (loading) return <Skeleton height={180} />;
  if (error)
    return (
      <Card>
        <p className="text-rose-600 mb-2.5">Failed to load blueprint.</p>
        <Button variant="secondary" onClick={reload}>
          Retry
        </Button>
      </Card>
    );
  if (!data)
    return (
      <Card>
        <EmptyState title="Blueprint not found" />
      </Card>
    );
  const b = data;
  const terminal = b.status === 'Archived';

  // Flatten the disposition lists into one ordered set of dimension cards (Required→Optional→Excluded).
  const importanceOf = (id: string) =>
    (b.dimensionImportance ?? []).find((d) => d.dimensionId === id)?.importance ?? 'Moderate';
  const dimensionRows: { id: string; disposition: string; importance: string }[] = [
    ...(b.requiredDimensionIds ?? []).map((id) => ({
      id,
      disposition: 'Required',
      importance: importanceOf(id),
    })),
    ...(b.optionalDimensionIds ?? []).map((id) => ({
      id,
      disposition: 'Optional',
      importance: '—',
    })),
    ...(b.excludedDimensionIds ?? []).map((id) => ({
      id,
      disposition: 'Excluded',
      importance: '—',
    })),
  ];

  async function setStatus(status: BlueprintStatus) {
    try {
      await roleBlueprintService.setStatus(b.id, status);
      toast('Status updated', 'success');
      reload();
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  }
  async function duplicate() {
    const copy = await roleBlueprintService.duplicate(b.id);
    navigate(`/admin/role-blueprints/${copy.id}`);
  }
  async function link(contextId: string) {
    if (!contextId) return;
    await roleBlueprintService.link(b.id, contextId);
    toast('Context linked', 'success');
    reload();
  }

  return (
    <div>
      <PageHeader
        title={b.name}
        sub={`${b.roleTitle} · ${b.jobFamily} · ${b.jobLevel} · v${b.version}`}
        actions={
          <>
            <Button variant="secondary" onClick={duplicate}>
              Duplicate
            </Button>
            <Button icon={sparkles} onClick={() => navigate('/admin/assessments/new')}>
              Create Assessment
            </Button>
          </>
        }
      />

      {/* status + linked chips, with the governance status control on the right (design row) */}
      <div className="flex gap-2.5 items-center flex-wrap mb-[18px]">
        <StatusBadge status={b.status} />
        {b.status === 'Validated' && <Chip tone="teal">Hiring-Support role-fit enabled</Chip>}
        <Chip tone="slate">Linked: {b.linkedContextProfileId ?? 'None'}</Chip>
        <div className="flex-1" />
        <Select
          value={b.status}
          onChange={(e) => setStatus(e.target.value as BlueprintStatus)}
          aria-label="Set status"
          disabled={terminal}
          className="max-w-[180px]"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      <div className="mb-[18px]">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {tab === 'dimensions' ? (
        dimensionRows.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {dimensionRows.map((d) => {
              const meta = (dimMeta ?? []).find((m) => m.dimensionId === d.id);
              return (
                <DimensionCard
                  key={`${d.disposition}-${d.id}`}
                  name={meta?.dimensionName ?? d.id}
                  code={meta?.domainId ?? d.id.split('-')[0]}
                  disposition={d.disposition}
                  importance={d.importance}
                />
              );
            })}
          </div>
        ) : (
          <Card>
            <EmptyState title="No dimensions selected" />
          </Card>
        )
      ) : (
        <Card>
          {tab === 'overview' && (
            <div className="grid gap-3">
              <dl className="grid grid-cols-[160px_1fr] gap-x-3 gap-y-2 text-sm">
                <dt className="text-text-3">Purpose</dt>
                <dd>{b.purpose ?? '—'}</dd>
                <dt className="text-text-3">Success indicators</dt>
                <dd>{b.successIndicators?.join(', ') || '—'}</dd>
                <dt className="text-text-3">Linked context</dt>
                <dd>{b.linkedContextProfileId ?? 'None'}</dd>
              </dl>
              <div>
                <div className="text-[13px] text-text-3 mb-1.5">Link a Context Profile</div>
                <Select
                  defaultValue=""
                  onChange={(e) => link(e.target.value)}
                  aria-label="Link context profile"
                  className="max-w-[280px]"
                >
                  <option value="">Select a context…</option>
                  {(contexts ?? []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          )}
          {tab === 'evidence' && (
            <div className="text-sm">
              {b.evidence?.join(' · ') || <EmptyState title="No evidence recorded" />}
            </div>
          )}
          {tab === 'versions' &&
            ((b.versionHistory ?? []).length > 0 ? (
              <Timeline
                items={(b.versionHistory ?? []).map((v) => ({
                  id: v.version,
                  label: `v${v.version} — ${v.summary}`,
                  time: v.date,
                }))}
              />
            ) : (
              <EmptyState title="No version history" />
            ))}
        </Card>
      )}
    </div>
  );
}
