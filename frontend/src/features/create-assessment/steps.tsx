// The 12 wizard steps + success state (Spec 003). Each step reads/writes the draft via useWizard.
import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Field,
  TextInput,
  TextArea,
  Select,
  Avatar,
  Checkbox,
  Chip,
  StatusBadge,
  Tooltip,
  ScoreBar,
  EmptyState,
  Skeleton,
} from '@/components/ui';
import {
  Icon,
  checkCircle,
  trending,
  target,
  shield,
  blueprint as blueprintIcon,
  context as contextIcon,
  plus,
  alert,
  layers,
  check,
  lock,
  search,
  edit,
  sparkles,
  arrowLeft,
  shieldCheck,
  dashboard,
} from '@/components/ui/icons';
import { useWizard } from './wizardContext';
import { AddUserDrawer } from '@/features/users/AddUserDrawer';
import { CONTEXT_FIELDS } from '@/features/contexts/contextSignature';
import { DiscoveryChat } from './DiscoveryChat';
import { QuestionCard } from './QuestionCard';
import { RephrasePanel } from './RephrasePanel';
import { CoverageMap } from './CoverageMap';
import { useAsync } from '@/hooks';
import {
  participantService,
  roleBlueprintService,
  contextProfileService,
  questionBankService,
} from '@/services';
import type {
  ContextProfile,
  JobLevel,
  Participant,
  RoleBlueprint,
  SelectedQuestion,
  UseCase,
} from '@/models';

const LEVELS: JobLevel[] = [
  'Individual Contributor',
  'Professional',
  'Manager',
  'Senior Manager',
  'Director',
  'Executive',
];

/** Step heading (design `StepHead`) — large title + supporting sub. */
function StepHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-[23px] font-bold tracking-[-0.02em]">{title}</h2>
      <p className="text-[14.5px] text-text-2 mt-1.5 max-w-[620px] leading-relaxed">{sub}</p>
    </div>
  );
}

function Step1SelectUser() {
  const { update, participant, setParticipant } = useWizard();
  const { data, reload } = useAsync<Participant[]>(() => participantService.list(), []);
  const [q, setQ] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const rows = (data ?? []).filter((p) =>
    `${p.fullName} ${p.email}`.toLowerCase().includes(q.toLowerCase().trim()),
  );
  const choose = (p: Participant) => {
    setParticipant(p);
    update({ participantId: p.id });
  };
  return (
    <div>
      <StepHead
        title="Who is being assessed?"
        sub="Select an existing candidate, or add a new one. You can assess several people with the same design."
      />
      {/* full-width search with a leading icon (design SelectUser) */}
      <div className="relative mb-4">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3">
          <Icon path={search} size={16} />
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search candidates…"
          aria-label="Search candidates"
          className="w-full py-3 pl-10 pr-3.5 rounded-md border border-border-strong bg-surface text-sm text-text"
        />
      </div>
      {!data && <Skeleton />}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
        {rows.map((p) => {
          const on = participant?.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => choose(p)}
              className="flex items-center gap-3.5 p-3.5 rounded-md border text-start transition-colors"
              style={{
                borderColor: on ? 'var(--indigo-500)' : 'var(--border)',
                borderWidth: '1.5px',
                background: on ? 'var(--indigo-50)' : 'var(--surface)',
                boxShadow: on ? 'var(--sh-sm)' : 'none',
              }}
            >
              <Avatar name={p.fullName} size={40} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{p.fullName}</div>
                <div className="text-xs text-text-3 truncate">
                  {p.currentJobTitle ?? p.jobLevel}
                  {p.targetJobTitle ? ` → ${p.targetJobTitle}` : ''}
                </div>
              </div>
              {on && <Icon path={checkCircle} size={20} style={{ color: 'var(--indigo-500)' }} />}
            </button>
          );
        })}
      </div>

      {/* add-new-candidate (design dashed button) — opens the real Add User drawer */}
      <button
        onClick={() => setAddOpen(true)}
        className="flex items-center justify-center gap-2.5 w-full mt-3.5 py-3 px-3.5 rounded-md text-[13.5px] font-semibold text-indigo-600"
        style={{ border: '1.5px dashed var(--border-strong)' }}
      >
        <Icon path={plus} size={16} /> Add a new candidate
      </button>

      <AddUserDrawer
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={(p) => {
          reload();
          choose(p);
          setAddOpen(false);
        }}
      />
    </div>
  );
}

const PURPOSES = [
  {
    v: 'developmental' as UseCase,
    icon: trending,
    title: 'Developmental Feedback',
    d: 'Support growth with strengths, themes and development suggestions. All measured dimensions are interpretable.',
    gov: 'Standard governance',
  },
  {
    v: 'hiring_support' as UseCase,
    icon: target,
    title: 'Hiring Support',
    d: 'Role-linked results against a validated blueprint. Selection-safe outputs only — no omnibus fit score.',
    gov: 'Controlled · requires validated blueprint',
  },
];

function Step2Purpose() {
  const { draft, update } = useWizard();
  return (
    <div>
      <StepHead
        title="What is this assessment for?"
        sub="V1 supports two governed use cases. The purpose determines which outputs may be shown and how reports are gated."
      />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mb-5">
        {PURPOSES.map((o) => {
          const on = draft.useCase === o.v;
          return (
            <button
              key={o.v}
              onClick={() => update({ useCase: o.v })}
              className="p-[22px] rounded-lg border text-start transition-colors"
              style={{
                borderColor: on ? 'var(--indigo-500)' : 'var(--border)',
                borderWidth: '1.5px',
                background: on ? 'var(--indigo-50)' : 'var(--surface)',
              }}
            >
              <div className="flex justify-between items-start">
                <span
                  className="w-11 h-11 rounded-[12px] grid place-items-center"
                  style={{
                    background: on ? 'var(--indigo-500)' : 'var(--canvas-2)',
                    color: on ? '#fff' : 'var(--indigo-500)',
                  }}
                >
                  <Icon path={o.icon} size={22} />
                </span>
                {on && <Icon path={checkCircle} size={22} style={{ color: 'var(--indigo-500)' }} />}
              </div>
              <div className="text-base font-bold mt-3.5">{o.title}</div>
              <p className="text-[13px] text-text-2 mt-[7px] leading-relaxed">{o.d}</p>
              <div className="inline-flex items-center gap-1.5 mt-3 text-[11.5px] font-semibold text-text-3">
                <Icon path={shield} size={13} />
                {o.gov}
              </div>
            </button>
          );
        })}
      </div>
      <Card>
        <Field label="Target role">
          <TextInput
            value={draft.targetRole}
            onChange={(e) => update({ targetRole: e.target.value })}
            aria-label="Target role"
          />
        </Field>
        <Field label="Job level">
          <Select
            value={draft.jobLevel}
            onChange={(e) => update({ jobLevel: e.target.value as JobLevel })}
            aria-label="Job level"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Sector (optional)">
          <TextInput
            value={draft.sector ?? ''}
            onChange={(e) => update({ sector: e.target.value })}
            aria-label="Sector"
          />
        </Field>
        <Field label="Job description (optional)">
          <TextArea
            value={draft.description ?? ''}
            onChange={(e) => update({ description: e.target.value })}
            aria-label="Job description"
          />
        </Field>
        {draft.useCase === 'hiring_support' && (
          <p className="text-xs text-amber-600">
            Hiring Support requires a Validated blueprint before operational role-fit release.
          </p>
        )}
      </Card>
    </div>
  );
}

function Step3Discovery() {
  const { draft, requirements, setRequirements, update } = useWizard();
  return (
    // Full-bleed discovery (design): chat column fills the area + a 300px requirements sidebar.
    <div className="flex h-full min-h-0">
      <div className="flex-1 min-w-0 h-full">
        <DiscoveryChat
          useCase={draft.useCase}
          onRequirements={setRequirements}
          onComplete={(r) => {
            setRequirements(r);
            update({ requirements: r });
          }}
        />
      </div>
      <aside className="hidden lg:flex w-[300px] flex-none flex-col border-l border-border bg-surface">
        <div className="flex-none px-5 py-[18px] border-b border-border-soft">
          <div className="flex items-center gap-2">
            <Icon path={layers} size={17} style={{ color: 'var(--indigo-500)' }} />
            <h3 className="text-sm font-bold">Job Requirements Profile</h3>
          </div>
          <p className="text-xs text-text-3 mt-1">Assembled live from your answers</p>
        </div>
        <div className="flex-1 overflow-auto p-5">
          {requirements ? (
            <dl className="grid grid-cols-[110px_1fr] gap-x-2.5 gap-y-1.5 text-[13px]">
              <dt className="text-text-3">Role</dt>
              <dd>{requirements.role}</dd>
              <dt className="text-text-3">Responsibilities</dt>
              <dd>{requirements.responsibilities.join(', ') || '—'}</dd>
              <dt className="text-text-3">Context</dt>
              <dd>{requirements.contextFactors.join(', ') || '—'}</dd>
              <dt className="text-text-3">Success</dt>
              <dd>{requirements.successIndicators.join(', ') || '—'}</dd>
              <dt className="text-text-3">Risks</dt>
              <dd>{requirements.failureRisks.join(', ') || '—'}</dd>
            </dl>
          ) : (
            <EmptyState
              title="Answer the chat"
              sub="The requirements profile fills in as you respond."
            />
          )}
        </div>
      </aside>
    </div>
  );
}

function ReqChips({ items, tone }: { items: string[]; tone: string }) {
  if (items.length === 0) return <span className="text-[13px] text-text-3">—</span>;
  return (
    <div className="flex gap-1.5 flex-wrap">
      {items.map((it, i) => (
        <span
          key={i}
          className="px-2.5 py-[5px] rounded-lg text-[12.5px] font-semibold"
          style={{ background: `var(--tone-${tone}-bg)`, color: `var(--tone-${tone}-fg)` }}
        >
          {it}
        </span>
      ))}
    </div>
  );
}

function ReqSec({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <h3 className="text-[13.5px] font-bold mb-3">{title}</h3>
      {children}
    </Card>
  );
}

function Step4Requirements() {
  const { requirements: r, update } = useWizard();
  if (!r)
    return (
      <Card>
        <EmptyState
          title="Complete discovery first"
          sub="Return to Step 3 to build the requirements profile."
        />
      </Card>
    );
  const stats: [number, string][] = [
    [r.criticalDimensionIds.length, 'Critical dims'],
    [r.recommendedFocus.length, 'Focus areas'],
    [r.nonNegotiables.length, 'Non-negotiables'],
  ];
  return (
    <div>
      <StepHead
        title="Job Requirements Profile"
        sub="The agent assembled this from your interview. Review it, return to the chat to refine, or approve to continue."
      />

      {/* action row (design) — Edit / Refine / Return all reopen the discovery chat where the
          profile is shaped (this app refines by continuing the conversation). */}
      <div className="flex gap-2.5 mb-[18px] flex-wrap">
        <Button
          variant="secondary"
          icon={edit}
          style={{ padding: '7px 12px', fontSize: 13 }}
          onClick={() => update({ currentStep: 3 })}
        >
          Edit
        </Button>
        <Button
          variant="secondary"
          icon={sparkles}
          style={{ padding: '7px 12px', fontSize: 13 }}
          onClick={() => update({ currentStep: 3 })}
        >
          Ask Agent to Refine
        </Button>
        <Button
          variant="ghost"
          icon={arrowLeft}
          style={{ padding: '7px 12px', fontSize: 13 }}
          onClick={() => update({ currentStep: 3 })}
        >
          Return to Chat
        </Button>
      </div>

      {/* dark hero summary */}
      <div
        className="rounded-lg px-6 py-[22px] mb-4 text-white flex items-center gap-6 flex-wrap"
        style={{ background: 'linear-gradient(135deg,#11141B,#1E2840)' }}
      >
        <div className="flex-1 min-w-[200px]">
          <div
            className="text-[11px] font-bold uppercase tracking-[0.08em]"
            style={{ color: 'var(--indigo-300)' }}
          >
            Role Summary
          </div>
          <div className="text-2xl font-bold mt-1">{r.role}</div>
          <div className="text-[13.5px] mt-0.5" style={{ color: 'rgba(255,255,255,.65)' }}>
            {r.jobLevel} · ~{r.estimatedDurationMinutes} min estimated
          </div>
        </div>
        <div className="flex gap-7">
          {stats.map(([n, label]) => (
            <div key={label}>
              <div className="text-[22px] font-bold">{n}</div>
              <div className="text-[11px]" style={{ color: 'rgba(255,255,255,.5)' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ReqSec title="Main Responsibilities">
          <ReqChips items={r.responsibilities} tone="indigo" />
        </ReqSec>
        <ReqSec title="Required Skills">
          <ReqChips items={r.skills} tone="teal" />
        </ReqSec>
        <ReqSec title="Required Behaviours">
          <ReqChips items={r.behaviors} tone="violet" />
        </ReqSec>
        <ReqSec title="Context Requirements">
          <ReqChips items={r.contextFactors} tone="slate" />
        </ReqSec>
        <ReqSec title="Critical Dimensions">
          <ReqChips items={r.criticalDimensionIds} tone="indigo" />
        </ReqSec>
        <ReqSec title="Success & Risk">
          <div className="text-[11px] font-bold text-teal-700 mb-1.5">SUCCESS INDICATORS</div>
          {r.successIndicators.map((s, i) => (
            <div key={i} className="flex gap-2 text-[12.5px] mb-1 text-text-2">
              <Icon path={check} size={14} style={{ color: 'var(--teal-600)', flexShrink: 0 }} />
              {s}
            </div>
          ))}
          <div className="text-[11px] font-bold text-rose-600 mb-1.5 mt-3">FAILURE RISKS</div>
          {r.failureRisks.map((s, i) => (
            <div key={i} className="flex gap-2 text-[12.5px] mb-1 text-text-2">
              <Icon path={alert} size={14} style={{ color: 'var(--rose-600)', flexShrink: 0 }} />
              {s}
            </div>
          ))}
        </ReqSec>
      </div>

      {r.nonNegotiables.length > 0 && (
        <div
          className="flex gap-2.5 mt-4 p-4 rounded-md"
          style={{ background: 'var(--amber-50)', border: '1px solid var(--amber-100)' }}
        >
          <Icon path={lock} size={16} style={{ color: 'var(--amber-700)', flexShrink: 0 }} />
          <div className="text-[12.5px] leading-relaxed" style={{ color: 'var(--amber-700)' }}>
            <strong>Non-negotiables:</strong> {r.nonNegotiables.join(' · ')}. A score below
            threshold on these blocks a positive role-fit indicator.
          </div>
        </div>
      )}
    </div>
  );
}

function Step5Blueprint() {
  const { draft, update } = useWizard();
  const navigate = useNavigate();
  const { data } = useAsync<RoleBlueprint[]>(() => roleBlueprintService.list(), []);
  return (
    <div>
      <StepHead
        title="Link a Role Blueprint"
        sub="Hiring Support requires a validated blueprint. It defines what success looks like — beyond the job title."
      />
      <div className="mb-4">
        <Button
          variant="secondary"
          icon={plus}
          onClick={() => navigate('/admin/role-blueprints/new')}
        >
          Create Blueprint
        </Button>
      </div>
      <div className="flex flex-col gap-2.5">
        {!data && <Skeleton />}
        {data?.map((b) => {
          const on = draft.blueprintId === b.id;
          return (
            <button
              key={b.id}
              onClick={() => update({ blueprintId: b.id })}
              className="flex items-center gap-4 px-[18px] py-4 rounded-lg border text-start transition-colors"
              style={{
                borderColor: on ? 'var(--indigo-500)' : 'var(--border)',
                borderWidth: '1.5px',
                background: on ? 'var(--indigo-50)' : 'var(--surface)',
              }}
            >
              <span
                className="w-[42px] h-[42px] rounded-[11px] grid place-items-center flex-none"
                style={{ background: 'var(--surface-2)', color: 'var(--indigo-500)' }}
              >
                <Icon path={blueprintIcon} size={20} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className="text-[15px] font-bold">{b.name}</span>
                  <StatusBadge status={b.status} size="sm" />
                </div>
                <div className="text-[12.5px] text-text-3 mt-0.5">
                  {b.roleTitle} · {b.jobFamily} · v{b.version}
                  {b.assessmentsUsed != null ? ` · ${b.assessmentsUsed} assessments` : ''}
                </div>
              </div>
              {b.status !== 'Validated' && (
                <Tooltip label="Only validated blueprints can be used for Hiring Support scoring.">
                  <Icon
                    path={alert}
                    size={18}
                    className="flex-none"
                    style={{ color: 'var(--amber-600)' }}
                  />
                </Tooltip>
              )}
              {on && <Icon path={checkCircle} size={22} style={{ color: 'var(--indigo-500)' }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step6Context() {
  const { draft, update } = useWizard();
  const navigate = useNavigate();
  const { data } = useAsync<ContextProfile[]>(() => contextProfileService.list(), []);
  const selected = (data ?? []).find((c) => c.id === draft.contextProfileId);
  // Panel previews the selected context, or the first available so it shows immediately (design
  // pre-selects a context); previewing does NOT link it — that still needs an explicit click.
  const preview = selected ?? (data ?? [])[0];
  const vals = preview?.values;
  return (
    <div>
      <StepHead
        title="Link a Context Profile"
        sub="The context describes the environment. It powers Domain 6 — how this person's profile fits and influences decisions here."
      />
      <div className="flex gap-2.5 mb-[18px]">
        <Button
          variant="secondary"
          size="sm"
          icon={plus}
          onClick={() => navigate('/admin/context-profiles/new')}
        >
          Create Context Profile
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-[18px]">
        <div className="flex flex-col gap-2.5">
          {!data && <Skeleton />}
          {data?.map((c) => {
            // Mirror the design (create_assessment3.jsx PickContext): a context is highlighted by
            // default so the list selection matches the Context Signature panel preview; committing
            // still needs an explicit click (updates draft.contextProfileId).
            const on = (draft.contextProfileId ?? preview?.id) === c.id;
            return (
              <button
                key={c.id}
                onClick={() => update({ contextProfileId: c.id })}
                className="flex items-center gap-3.5 py-3.5 px-4 rounded-lg border text-start transition-colors"
                style={{
                  borderColor: on ? 'var(--indigo-500)' : 'var(--border)',
                  borderWidth: '1.5px',
                  background: on ? 'var(--indigo-50)' : 'var(--surface)',
                }}
              >
                <span
                  className="w-10 h-10 rounded-[11px] grid place-items-center flex-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--teal-600)' }}
                >
                  <Icon path={contextIcon} size={19} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14.5px] font-bold">{c.name}</span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                  <div className="text-xs text-text-3 mt-0.5">
                    {c.roleTitle} · {c.jobLevel}
                  </div>
                </div>
                {on && <Icon path={checkCircle} size={20} style={{ color: 'var(--indigo-500)' }} />}
              </button>
            );
          })}
        </div>

        {vals && (
          <div className="lg:sticky lg:top-0 h-fit rounded-lg border border-border bg-surface shadow-sm p-[18px]">
            <div className="text-[13px] font-bold mb-3.5">Context Signature</div>
            <div className="flex flex-col gap-[7px]">
              {CONTEXT_FIELDS.map((f) => {
                const v = vals[f.key] ?? 0;
                const pct = (v / f.max) * 100;
                const color =
                  pct >= 70
                    ? 'var(--rose-600)'
                    : pct >= 45
                      ? 'var(--amber-600)'
                      : 'var(--teal-600)';
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
                    <span className="text-[10.5px] font-bold text-text-3 w-3.5 text-right">
                      {v}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Step7Selection() {
  const { draft, update, requirements } = useWizard();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Approved' | 'Needs review'>('All');

  useEffect(() => {
    if (draft.selected.length > 0 || !requirements) return;
    setLoading(true);
    questionBankService.propose(requirements, draft.jobLevel, draft.useCase).then((picked) => {
      update({ selected: picked });
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirements]);

  function remove(itemId: string) {
    update({ selected: draft.selected.filter((s) => s.item.itemId !== itemId) });
  }

  return (
    <div>
      <StepHead
        title="Question Selection & Adaptation"
        sub="The agent selected governed items and rephrased them for this role — preserving every scoring property. Nothing is invented."
      />

      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        {(['All', 'Approved', 'Needs review'] as const).map((f) => (
          <Chip key={f} tone="indigo" active={filter === f} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
        <div className="flex-1" />
        <div className="text-[12.5px] text-text-3">
          <strong className="text-text">{draft.selected.length}</strong> items
        </div>
      </div>

      {/* governance banner (design) */}
      <div
        className="flex gap-2.5 p-4 rounded-md mb-4"
        style={{ background: 'var(--teal-50)', border: '1px solid var(--teal-100)' }}
      >
        <Icon path={shieldCheck} size={17} style={{ color: 'var(--teal-700)', flexShrink: 0 }} />
        <div className="text-[12.5px] leading-relaxed" style={{ color: 'var(--teal-700)' }}>
          Every adapted item keeps its original{' '}
          <strong>Question ID, domain, dimension, facet, scoring rule and governance status</strong>
          . The agent cannot create new questions or change scoring logic.
        </div>
      </div>

      {loading && <Skeleton height={120} />}
      {!loading && draft.selected.length === 0 && (
        <EmptyState
          title="No questions yet"
          sub="Complete discovery (Step 3) so the Agent can propose an eligible set."
        />
      )}
      {draft.selected
        .filter((s) => filter === 'All' || (filter === 'Approved' ? s.approved : !s.approved))
        .map((s) => (
          <QuestionCard key={s.item.itemId} selected={s} onRemove={() => remove(s.item.itemId)} />
        ))}
    </div>
  );
}

function Step8Rephrase() {
  const { draft, update } = useWizard();
  function setAdaptation(itemId: string, adaptation: SelectedQuestion['adaptation']) {
    update({
      selected: draft.selected.map((s) => (s.item.itemId === itemId ? { ...s, adaptation } : s)),
    });
  }
  return (
    <div>
      <StepHead
        title="Controlled rephrasing"
        sub="Lightly adapt wording within governed limits — scoring stays locked to the source item."
      />
      {draft.selected.length === 0 && <EmptyState title="No questions to rephrase" />}
      {draft.selected.map((s) => (
        <RephrasePanel
          key={s.item.itemId}
          selected={s}
          onAdapted={(a) => setAdaptation(s.item.itemId, a)}
        />
      ))}
    </div>
  );
}

function Step9Coverage() {
  const { draft, requirements } = useWizard();
  return (
    <div>
      <StepHead
        title="Coverage & balance"
        sub="A live coverage check across domains and question types before approval."
      />
      <CoverageMap selected={draft.selected} profile={requirements} />
    </div>
  );
}

function Step10Approval() {
  const { draft, update } = useWizard();
  return (
    <div>
      <StepHead
        title="Admin approval"
        sub="Review is complete. Explicit approval is required before this assessment can be sent."
      />
      <Card>
        <div className="flex items-start gap-3.5 mb-4">
          <span
            className="w-11 h-11 rounded-xl grid place-items-center flex-none"
            style={{ background: 'var(--indigo-50)', color: 'var(--indigo-500)' }}
          >
            <Icon path={shieldCheck} size={22} />
          </span>
          <div>
            <h3 className="text-[15px] font-bold">Approve for sending</h3>
            <p className="text-[13px] text-text-2 mt-1 leading-relaxed max-w-[560px]">
              Your approval confirms the assessment design, governed items and report gating are
              correct for this purpose. The candidate receives a consent request before starting —
              no automatic hire/reject decision is made.
            </p>
          </div>
        </div>
        <div
          className="p-3.5 rounded-md transition-colors"
          style={{
            background: draft.approved ? 'var(--teal-50)' : 'var(--surface-2)',
            border: `1px solid ${draft.approved ? 'var(--teal-100)' : 'var(--border)'}`,
          }}
        >
          <Checkbox
            checked={draft.approved}
            onChange={(v) => update({ approved: v })}
            label="I approve this tailored assessment for sending"
          />
        </div>
      </Card>
    </div>
  );
}

// Long-form deadline date (design shows "June 25, 2026"). Parse the ISO parts to build a local
// date so we don't shift a day across time zones; fall back to the raw value if it's malformed.
function formatDeadline(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(y, m - 1, d));
  } catch {
    return iso;
  }
}

function Step11Deadline() {
  const { draft, update } = useWizard();
  return (
    <div>
      <StepHead
        title="Deadline & reminders"
        sub="Set when the assessment is due. Automated reminders are sent before the deadline."
      />
      <Card>
        <Field label="Deadline">
          <TextInput
            type="date"
            value={draft.deadline ?? ''}
            onChange={(e) => update({ deadline: e.target.value })}
            aria-label="Deadline"
          />
        </Field>
        <Field label="Invitation message (optional)">
          <TextArea
            value={draft.invitationMessage ?? ''}
            onChange={(e) => update({ invitationMessage: e.target.value })}
            aria-label="Invitation message"
          />
        </Field>
        {/* read-only reminders + consent — design "Deadline & Reminders" card / __KV rows */}
        <div className="mt-3.5 pt-3.5 border-t border-border-soft">
          <h3 className="text-[13.5px] font-bold mb-2">Deadline &amp; Reminders</h3>
          {(
            [
              ['Deadline', draft.deadline ? formatDeadline(draft.deadline) : 'Not set'],
              ['Reminders', '3 days & 1 day before'],
              [
                'Consent',
                `Required · ${draft.useCase === 'hiring_support' ? 'Hiring Support' : 'Developmental'}`,
              ],
            ] as [string, string][]
          ).map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between items-center py-[7px] border-b border-border-soft last:border-0"
            >
              <span className="text-[12.5px] text-text-3">{k}</span>
              <span className="text-[13px] font-semibold text-end">{v}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Step12Review() {
  const { draft, participant, requirements } = useWizard();
  const useCaseLabel = draft.useCase === 'hiring_support' ? 'Hiring Support' : 'Developmental';
  const duration = requirements?.estimatedDurationMinutes ?? draft.selected.length;
  const first = (participant?.fullName ?? 'the candidate').split(' ')[0];
  const rows: [string, string][] = [
    ['Candidate', participant?.fullName ?? draft.participantId],
    ['Use case', useCaseLabel],
    ['Target role', draft.targetRole || '—'],
    ['Job level', draft.jobLevel],
    ['Blueprint', draft.blueprintId ?? '—'],
    ['Context profile', draft.contextProfileId ?? '—'],
    ['Questions', `${draft.selected.length} items · ~${duration} min`],
    ['Deadline', draft.deadline ? formatDeadline(draft.deadline) : '—'],
    ['Reminders', '3 days & 1 day before'],
    ['Consent', `Required · ${useCaseLabel}`],
  ];
  return (
    <div>
      <StepHead
        title="Review & Send"
        sub="Final confirmation. The candidate receives an invitation with a use-case-specific consent request."
      />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        <Card>
          <div className="flex flex-col">
            {rows.map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between py-2.5 border-b border-border-soft last:border-0"
              >
                <span className="text-[13px] text-text-3">{k}</span>
                <span className="text-[13.5px] font-semibold text-end">{v}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* invitation preview (design SendStep) */}
        <div>
          <div className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-text-3 mb-2.5">
            Invitation Preview
          </div>
          <div className="rounded-lg overflow-hidden border border-border shadow-sm">
            <div
              className="flex items-center gap-2.5 px-[18px] py-4"
              style={{ background: '#11141B' }}
            >
              <svg width={22} height={22} viewBox="0 0 32 32" fill="none" aria-hidden>
                <rect width="32" height="32" rx="8" fill="rgba(255,255,255,.12)" />
                <path
                  d="M11 21V11l10 10V11"
                  stroke="#fff"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-white text-[13.5px] font-bold">Nexus</span>
            </div>
            <div className="p-[18px] bg-surface">
              <div className="text-sm font-bold">You’ve been invited to an assessment</div>
              <p className="text-[12.5px] text-text-2 mt-2 leading-relaxed">
                Hello {first}, you’ve been invited to complete a {draft.targetRole || 'role'}{' '}
                assessment. It takes about {duration} minutes and you can pause and resume.
              </p>
              <div
                className="mt-3.5 py-2.5 px-3 rounded-md text-center text-[13px] font-semibold text-white"
                style={{ background: 'var(--indigo-500)' }}
              >
                Start Assessment →
              </div>
              <p className="text-[11px] text-text-3 mt-3 leading-snug">
                Deadline: {draft.deadline ? formatDeadline(draft.deadline) : '—'} · Your consent
                will be requested before you begin.
              </p>
            </div>
          </div>
        </div>
      </div>

      {!draft.approved && (
        <p className="text-xs text-rose-600 mt-2.5">Approve in Step 10 to enable Send.</p>
      )}
    </div>
  );
}

export function SuccessState({
  candidate,
  role,
  onList,
  onDashboard,
}: {
  candidate?: string;
  role?: string;
  onList: () => void;
  onDashboard: () => void;
}) {
  return (
    <div className="max-w-[480px] mx-auto text-center pt-10">
      <div className="flex justify-center mb-4">
        <span
          className="w-[88px] h-[88px] rounded-full grid place-items-center"
          style={{
            background: 'var(--teal-600)',
            boxShadow: '0 12px 32px -8px rgba(13,148,136,.5)',
          }}
        >
          <Icon
            path={checkCircle}
            size={44}
            stroke={2.4}
            style={{ color: '#fff', animation: 'nx-check-pop .5s var(--ease-out) .1s both' }}
          />
        </span>
      </div>
      <h2 className="text-2xl font-bold tracking-[-0.02em]">Assessment sent</h2>
      <p className="text-[15px] text-text-2 mt-2 leading-relaxed">
        {candidate ?? 'The candidate'} has been invited to the {role ? `${role} ` : ''}assessment.
        You’ll be notified at each milestone.
      </p>
      <div className="flex gap-2.5 justify-center mt-6 flex-wrap">
        <Button variant="secondary" onClick={onList}>
          View Assessments
        </Button>
        <Button icon={dashboard} onClick={onDashboard}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}

export const STEPS: { title: string; component: () => JSX.Element }[] = [
  { title: 'User', component: Step1SelectUser },
  { title: 'Purpose', component: Step2Purpose },
  { title: 'Discovery', component: Step3Discovery },
  { title: 'Requirements', component: Step4Requirements },
  { title: 'Blueprint', component: Step5Blueprint },
  { title: 'Context', component: Step6Context },
  { title: 'Selection', component: Step7Selection },
  { title: 'Rephrase', component: Step8Rephrase },
  { title: 'Coverage', component: Step9Coverage },
  { title: 'Approval', component: Step10Approval },
  { title: 'Deadline', component: Step11Deadline },
  { title: 'Review', component: Step12Review },
];

/** Minimum-input gate for advancing from a given 1-based step (FR-CA-001). */
export function canAdvance(
  step: number,
  draft: { participantId: string; targetRole: string; approved: boolean },
  hasParticipant: boolean,
): boolean {
  if (step === 1) return hasParticipant || !!draft.participantId;
  if (step === 2) return !!draft.targetRole;
  if (step === 10) return draft.approved;
  return true;
}
