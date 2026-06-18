// Context Profile visual builder (US2 / FR-BC-009). Sliders drive a live Context Signature
// (radar + bars) and a plain-language summary that recompute on every change.
// Spec 012: parity with app/admin_contexts.jsx CreateContext — grouped slider cards (label +
// info tooltip + indigo value), a live "Context Signature" panel, and Save Draft / Activate.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Field, TextInput, Select, Slider, Tooltip, ScoreBar } from '@/components/ui';
import { Icon, info } from '@/components/ui/icons';
import { ContextRadar } from '@/components/charts';
import { BuilderTopBar } from '@/features/builderChrome';
import { useToast } from '@/hooks';
import { contextProfileService } from '@/services';
import { contextSignature, DEFAULT_CONTEXT_VALUES } from './contextSignature';
import type { ContextProfileValues, ContextStatus, JobFamily, JobLevel } from '@/models';

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
const LEVELS: JobLevel[] = [
  'Individual Contributor',
  'Professional',
  'Manager',
  'Senior Manager',
  'Director',
  'Executive',
];

// Per-factor label + helper text + range (design app/data.js CONTEXT_FIELDS).
type FactorKey = keyof ContextProfileValues;
const FIELD_META: Record<FactorKey, { label: string; desc: string; min: number; max: number }> = {
  leadershipScope: {
    label: 'Leadership Scope',
    desc: 'People and organizational scope the role carries.',
    min: 0,
    max: 4,
  },
  ambiguityLevel: {
    label: 'Ambiguity Level',
    desc: 'Strength of uncertainty and incomplete structure.',
    min: 1,
    max: 5,
  },
  decisionStakes: {
    label: 'Decision Stakes',
    desc: 'Consequence severity of the decisions made.',
    min: 1,
    max: 5,
  },
  timePressure: {
    label: 'Time Pressure',
    desc: 'Pressure for speed of response and delivery.',
    min: 1,
    max: 5,
  },
  regulatoryConstraint: {
    label: 'Regulatory Constraint',
    desc: 'Degree of formal boundaries and compliance load.',
    min: 1,
    max: 5,
  },
  autonomyLevel: {
    label: 'Autonomy Level',
    desc: 'Decision freedom afforded to the role.',
    min: 1,
    max: 5,
  },
  stakeholderComplexity: {
    label: 'Stakeholder Complexity',
    desc: 'Social and political complexity of stakeholders.',
    min: 1,
    max: 5,
  },
  interdependenceLevel: {
    label: 'Interdependence',
    desc: 'Degree of coordination dependency with others.',
    min: 1,
    max: 5,
  },
  innovationDemand: {
    label: 'Innovation Demand',
    desc: 'Need for creativity and adaptation.',
    min: 1,
    max: 5,
  },
  executionPrecisionDemand: {
    label: 'Execution Precision',
    desc: 'Need for consistency, accuracy and follow-through.',
    min: 1,
    max: 5,
  },
  customerExposure: {
    label: 'Customer Exposure',
    desc: 'External interaction and customer-facing load.',
    min: 1,
    max: 5,
  },
  conflictLoad: {
    label: 'Conflict Load',
    desc: 'Likelihood of disagreement and difficult influence.',
    min: 1,
    max: 5,
  },
  changeVelocity: {
    label: 'Change Velocity',
    desc: 'Speed of environmental and priority change.',
    min: 1,
    max: 5,
  },
  failureCost: {
    label: 'Failure Cost',
    desc: 'Practical cost of poor judgment in the role.',
    min: 1,
    max: 5,
  },
};

const GROUPS: { title: string; keys: FactorKey[] }[] = [
  {
    title: 'Scope & Stakes',
    keys: ['leadershipScope', 'decisionStakes', 'failureCost', 'autonomyLevel'],
  },
  {
    title: 'Demand & Pace',
    keys: ['ambiguityLevel', 'timePressure', 'changeVelocity', 'innovationDemand'],
  },
  {
    title: 'Discipline & Constraint',
    keys: ['regulatoryConstraint', 'executionPrecisionDemand', 'interdependenceLevel'],
  },
  {
    title: 'People & Pressure',
    keys: ['stakeholderComplexity', 'customerExposure', 'conflictLoad'],
  },
];

export function ContextBuilder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [jobFamily, setJobFamily] = useState<JobFamily>('Operations');
  const [jobLevel, setJobLevel] = useState<JobLevel>('Manager');
  const [notes, setNotes] = useState('');
  const [values, setValues] = useState<ContextProfileValues>({ ...DEFAULT_CONTEXT_VALUES });
  const [busy, setBusy] = useState(false);

  const signature = useMemo(() => contextSignature(values), [values]);

  function setFactor(key: FactorKey, v: number) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function save(status: ContextStatus) {
    setBusy(true);
    const created = await contextProfileService.create({
      organizationId: 'org-meridian',
      name: name || 'Untitled Context',
      roleTitle,
      jobFamily,
      jobLevel,
      status,
      values,
    });
    setBusy(false);
    toast(status === 'Draft' ? 'Draft saved' : 'Context activated', 'success');
    navigate(`/admin/context-profiles/${created.id}`);
  }

  return (
    <div className="flex flex-col h-screen bg-canvas">
      <BuilderTopBar
        title="Create Context Profile"
        actions={
          <>
            <Button variant="ghost" onClick={() => navigate('/admin/context-profiles')}>
              Cancel
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => save('Draft')}>
              Save Draft
            </Button>
            <Button disabled={busy} onClick={() => save('Active')}>
              {busy ? 'Saving…' : 'Activate'}
            </Button>
          </>
        }
      />

      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_360px] gap-5 items-start max-w-[1100px] mx-auto">
          {/* form */}
          <div className="flex flex-col gap-4">
            <Card>
              <Field label="Context name">
                <TextInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Finance Manager · Regulated"
                  aria-label="Context name"
                />
              </Field>
              <Field label="Role title">
                <TextInput
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  aria-label="Role title"
                />
              </Field>
              <div className="grid grid-cols-2 gap-2.5">
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
              </div>
            </Card>

            {GROUPS.map((g) => (
              <Card key={g.title}>
                <h3 className="text-sm font-bold mb-[18px]">{g.title}</h3>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-[22px]">
                  {g.keys.map((key) => {
                    const meta = FIELD_META[key];
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[13px] font-semibold flex items-center gap-1.5">
                            {meta.label}
                            <Tooltip label={meta.desc}>
                              <Icon path={info} size={13} style={{ color: 'var(--text-3)' }} />
                            </Tooltip>
                          </span>
                          <span className="text-xs font-bold text-indigo-600 w-6 text-right">
                            {values[key]}
                          </span>
                        </div>
                        <Slider
                          min={meta.min}
                          max={meta.max}
                          value={values[key]}
                          onChange={(e) => setFactor(key, Number(e.target.value))}
                          aria-label={meta.label}
                        />
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}

            <Card>
              <h3 className="text-sm font-bold mb-2.5">Success Profile Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Qualitative notes that support interpretation…"
                aria-label="Success profile notes"
                className="w-full min-h-[80px] resize-y py-2.5 px-3 rounded-md border border-border-strong bg-surface-2 text-text text-sm"
              />
            </Card>
          </div>

          {/* live Context Signature */}
          <div className="lg:sticky lg:top-4">
            <Card>
              <div className="text-[13px] font-bold mb-1">Context Signature</div>
              <div className="text-xs text-text-3 mb-2">Updates live as you tune the sliders.</div>
              <div className="grid place-items-center my-1">
                <ContextRadar
                  axes={signature.axes.map((a) => ({ axis: a.axis, person: a.value }))}
                />
              </div>
              <div className="flex flex-col gap-[7px] mt-3">
                {signature.axes.map((a) => {
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
                        <ScoreBar
                          value={a.value}
                          max={100}
                          color={color}
                          height={6}
                          label={`${a.axis} intensity`}
                        />
                      </div>
                      <span className="text-[10.5px] font-bold text-text-3 w-3.5 text-right">
                        {Math.round(a.value / 20)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[12.5px] text-text-3 mt-4 leading-relaxed">{signature.summary}</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
