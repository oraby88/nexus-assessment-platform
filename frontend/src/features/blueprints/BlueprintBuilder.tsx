// Role Blueprint builder (US1 / FR-BC-002/003/004). Multi-step; dimension tri-state cycling
// (Required→Optional→Excluded) from the item_bank-derived catalog; importance for required dimensions.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Field, TextInput, TextArea, Select } from '@/components/ui';
import { BuilderTopBar } from '@/features/builderChrome';
import { useToast } from '@/hooks';
import { roleBlueprintService } from '@/services';
import { dimensionCatalog } from '@/lib/dimensions';
import type { DimensionCatalogEntry, DimensionImportance, JobFamily, JobLevel } from '@/models';

const STEPS = [
  'Role Information',
  'Success Requirements',
  'Dimension Selection',
  'Supporting Evidence',
  'Review & Save',
];
const LEVELS: JobLevel[] = [
  'Individual Contributor',
  'Professional',
  'Manager',
  'Senior Manager',
  'Director',
  'Executive',
];
const FAMILIES: JobFamily[] = [
  'Strategy',
  'Operations',
  'Sales',
  'Product',
  'Engineering',
  'People',
  'Finance',
  'Risk',
  'General Management',
  'Other',
];
type DimState = 'required' | 'optional' | 'excluded' | undefined;
const NEXT: Record<string, DimState> = {
  undefined: 'required',
  required: 'optional',
  optional: 'excluded',
  excluded: undefined,
};
// Disposition → tone (design admin_blueprints.jsx Dimension Selection: Required=rose, Optional=indigo,
// Excluded=slate). Drives the tinted card border/background.
const DIM_TONE: Record<'required' | 'optional' | 'excluded', string> = {
  required: 'rose',
  optional: 'indigo',
  excluded: 'slate',
};

export function BlueprintBuilder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [catalog, setCatalog] = useState<DimensionCatalogEntry[]>([]);
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [jobFamily, setJobFamily] = useState<JobFamily>('Operations');
  const [jobLevel, setJobLevel] = useState<JobLevel>('Manager');
  const [purpose, setPurpose] = useState('');
  const [successIndicators, setSuccess] = useState('');
  const [evidence, setEvidence] = useState('');
  const [dimState, setDimState] = useState<Record<string, DimState>>({});
  const [importance, setImportance] = useState<Record<string, DimensionImportance['importance']>>(
    {},
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    dimensionCatalog().then(setCatalog);
  }, []);

  function cycle(id: string) {
    setDimState((s) => ({ ...s, [id]: NEXT[String(s[id])] }));
  }

  async function save() {
    setBusy(true);
    const required = Object.keys(dimState).filter((k) => dimState[k] === 'required');
    const optional = Object.keys(dimState).filter((k) => dimState[k] === 'optional');
    const excluded = Object.keys(dimState).filter((k) => dimState[k] === 'excluded');
    const created = await roleBlueprintService.create({
      organizationId: 'org-meridian',
      name: name || 'Untitled Blueprint',
      roleTitle,
      jobFamily,
      jobLevel,
      status: 'Draft',
      purpose,
      successIndicators: successIndicators
        ? successIndicators
            .split(/[,;]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      requiredDimensionIds: required,
      optionalDimensionIds: optional,
      excludedDimensionIds: excluded,
      dimensionImportance: required.map((id) => ({
        dimensionId: id,
        importance: importance[id] ?? 'Moderate',
      })),
      evidence: evidence ? [evidence] : [],
    });
    setBusy(false);
    toast('Blueprint created', 'success');
    navigate(`/admin/role-blueprints/${created.id}`);
  }

  return (
    <div className="flex flex-col h-screen bg-canvas">
      <BuilderTopBar
        title="Create Role Blueprint"
        actions={
          <Button variant="ghost" onClick={() => navigate('/admin/role-blueprints')}>
            Cancel
          </Button>
        }
      />
      {/* step pills rail (design CreateBlueprint) — clickable up to the furthest reached step */}
      <div className="flex-none flex gap-1.5 px-9 py-3.5 border-b border-border bg-surface overflow-x-auto">
        {STEPS.map((s, i) => {
          const done = i < step;
          const on = i === step;
          return (
            <button
              key={s}
              onClick={() => i <= step && setStep(i)}
              disabled={i > step}
              className="flex items-center gap-2 flex-none rounded-full px-3 py-1.5 text-[12.5px] font-semibold"
              style={{
                background: on ? 'var(--indigo-500)' : done ? 'var(--indigo-50)' : 'transparent',
                color: on ? '#fff' : done ? 'var(--indigo-700)' : 'var(--text-3)',
              }}
            >
              <span
                className="grid place-items-center w-[18px] h-[18px] rounded-full text-[10.5px] font-bold"
                style={{
                  background: on
                    ? 'rgba(255,255,255,.2)'
                    : done
                      ? 'var(--indigo-500)'
                      : 'var(--canvas-2)',
                  color: i <= step ? '#fff' : 'var(--text-3)',
                }}
              >
                {done ? '✓' : i + 1}
              </span>
              {s}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-auto px-6 py-7">
        <div className="max-w-[760px] mx-auto">
          <Card>
            <h2 className="text-xl font-bold mb-[18px] tracking-[-0.01em]">{STEPS[step]}</h2>
            {step === 0 && (
              <>
                <Field label="Blueprint name">
                  <TextInput
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-label="Blueprint name"
                  />
                </Field>
                <Field label="Role title">
                  <TextInput
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    aria-label="Role title"
                  />
                </Field>
                <Field label="Job family">
                  <Select
                    value={jobFamily}
                    onChange={(e) => setJobFamily(e.target.value as JobFamily)}
                    aria-label="Job family"
                  >
                    {FAMILIES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Job level">
                  <Select
                    value={jobLevel}
                    onChange={(e) => setJobLevel(e.target.value as JobLevel)}
                    aria-label="Job level"
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Purpose">
                  <TextArea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    aria-label="Purpose"
                  />
                </Field>
              </>
            )}

            {step === 1 && (
              <Field label="Success indicators (comma-separated)">
                <TextArea
                  value={successIndicators}
                  onChange={(e) => setSuccess(e.target.value)}
                  aria-label="Success indicators"
                />
              </Field>
            )}

            {step === 2 && (
              <div>
                <p className="text-[13px] text-text-2 mb-3.5">
                  Tap a dimension to cycle Required → Optional → Excluded. Required dimensions get
                  an importance.
                </p>
                {/* tone-coloured selection cards (design Dimension Selection grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catalog.map((d) => {
                    const state = dimState[d.dimensionId];
                    const tone = state ? DIM_TONE[state] : null;
                    return (
                      <button
                        key={d.dimensionId}
                        onClick={() => cycle(d.dimensionId)}
                        className="text-start rounded-md p-3.5 transition-colors"
                        style={{
                          border: `1.5px solid ${state ? `var(--tone-${tone}-dot)` : 'var(--border)'}`,
                          background: state ? `var(--tone-${tone}-bg)` : 'var(--surface)',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="mono text-[10px] font-bold text-text-3">
                            {d.dimensionId.split('-')[0]}
                          </span>
                          {state && (
                            <span
                              className="text-[10px] font-bold capitalize"
                              style={{ color: `var(--tone-${tone}-fg)` }}
                            >
                              {state}
                            </span>
                          )}
                        </div>
                        <div className="text-[13px] font-semibold mt-2">{d.dimensionName}</div>
                      </button>
                    );
                  })}
                </div>

                {/* importance for required dimensions (design Dimension Importance step) */}
                {catalog.some((d) => dimState[d.dimensionId] === 'required') && (
                  <div className="mt-5">
                    <h4 className="text-[13px] font-bold mb-2.5">
                      Importance for required dimensions
                    </h4>
                    <div className="flex flex-col gap-2.5">
                      {catalog
                        .filter((d) => dimState[d.dimensionId] === 'required')
                        .map((d) => (
                          <div key={d.dimensionId} className="flex items-center gap-2.5">
                            <span className="flex-1 text-[13px] font-medium">
                              {d.dimensionName}
                            </span>
                            <Select
                              value={importance[d.dimensionId] ?? 'Moderate'}
                              onChange={(e) =>
                                setImportance((m) => ({
                                  ...m,
                                  [d.dimensionId]: e.target
                                    .value as DimensionImportance['importance'],
                                }))
                              }
                              aria-label={`Importance for ${d.dimensionId}`}
                              className="max-w-[150px]"
                            >
                              <option>Low</option>
                              <option>Moderate</option>
                              <option>Critical</option>
                            </Select>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <Field label="Supporting evidence">
                <TextArea
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  aria-label="Evidence"
                />
              </Field>
            )}

            {step === 4 && (
              <dl className="grid grid-cols-[160px_1fr] gap-x-3 gap-y-2 text-sm">
                <dt className="text-text-3">Name</dt>
                <dd>{name || 'Untitled Blueprint'}</dd>
                <dt className="text-text-3">Role</dt>
                <dd>{roleTitle || '—'}</dd>
                <dt className="text-text-3">Required dimensions</dt>
                <dd>
                  {Object.keys(dimState)
                    .filter((k) => dimState[k] === 'required')
                    .join(', ') || '—'}
                </dd>
              </dl>
            )}
          </Card>
        </div>
      </div>

      <div className="flex-none h-[70px] flex items-center gap-2.5 px-6 border-t border-border bg-surface">
        {step > 0 && (
          <Button variant="ghost" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        <div className="flex-1" />
        {step < STEPS.length - 1 && <Button onClick={() => setStep(step + 1)}>Continue</Button>}
        {step === STEPS.length - 1 && (
          <div className="flex gap-2.5">
            <Button variant="secondary" onClick={save} disabled={busy}>
              Save as Draft
            </Button>
            <Button onClick={save} disabled={busy}>
              {busy ? 'Saving…' : 'Save Blueprint'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
