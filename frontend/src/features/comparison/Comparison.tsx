// Candidate Comparison (US4 / FR-RPT-006/007). Side-by-side, human judgment only — NO ranking,
// ordering by fit, or auto-decision. Reads current released reports; ineligible participants shown.
import { useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Button,
  IconButton,
  Field,
  TextInput,
  Checkbox,
  Avatar,
  Chip,
  ConfidenceChip,
  ScoreBar,
  Ring,
  EmptyState,
} from '@/components/ui';
import { Icon, info, layers, download, x, checkCircle } from '@/components/ui/icons';
import { PageHeader } from '@/features/placeholder';
import { useAsync, useToast } from '@/hooks';
import { comparisonService, participantService } from '@/services';
import type { CandidateComparison, ComparisonEligibility, Participant } from '@/models';

const DIMENSIONS = [
  { id: 'D1-CE', label: 'Conscientious Execution' },
  { id: 'D2-AR', label: 'Abstract Reasoning' },
  { id: 'D4-SR', label: 'Self-Regulation' },
];

export function Comparison() {
  const { toast } = useToast();
  const { data: people } = useAsync<Participant[]>(() => participantService.list(), []);
  const [role, setRole] = useState('Finance Manager');
  const [selected, setSelected] = useState<string[]>([]);
  const [dims, setDims] = useState<string[]>(DIMENSIONS.map((d) => d.id));
  const [result, setResult] = useState<{
    comparison: CandidateComparison;
    eligibility: ComparisonEligibility[];
  } | null>(null);
  const [busy, setBusy] = useState(false);
  // Per-candidate removal from the comparison (design admin_reports.jsx — the header X button).
  // Local presentation state only; never reorders, and a fresh Compare resets it.
  const [removed, setRemoved] = useState<Set<string>>(new Set());

  const nameOf = useMemo(() => {
    const m = new Map((people ?? []).map((p) => [p.id, p.fullName]));
    return (id: string) => m.get(id) ?? id;
  }, [people]);

  function toggleParticipant(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }
  function toggleDim(id: string) {
    setDims((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  async function build() {
    if (selected.length < 2) {
      toast('Select at least 2 participants', 'caution');
      return;
    }
    setBusy(true);
    const r = await comparisonService.build({
      roleTitle: role,
      participantIds: selected,
      dimensionIds: dims,
    });
    setResult(r);
    setRemoved(new Set());
    setBusy(false);
  }

  const ineligible = (result?.eligibility ?? []).filter((e) => !e.eligible);
  // Visible candidates after removal — drives every column below (preserves selection order).
  const cands = (result?.comparison.participants ?? []).filter(
    (c) => !removed.has(c.participantId),
  );
  function removeCandidate(id: string) {
    // Keep at least two — a comparison needs a pair.
    setRemoved((s) => (cands.length > 2 ? new Set(s).add(id) : s));
  }

  return (
    <div>
      <PageHeader
        title="Candidate Comparison"
        sub="Explainable, side-by-side comparison against one role. Supports human judgement — never an automatic decision."
        actions={
          result && cands.length >= 2 ? (
            <>
              <Button
                variant="secondary"
                icon={download}
                onClick={() => toast('Comparison export started', 'info')}
              >
                Export
              </Button>
              <Button
                variant="secondary"
                icon={download}
                onClick={() => toast('Comparison export started', 'info')}
              >
                Download PDF
              </Button>
            </>
          ) : undefined
        }
      />

      <Card className="mb-4">
        <Field label="Target role">
          <TextInput
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-label="Target role"
          />
        </Field>
        <div className="text-[13px] font-semibold mt-2 mb-1.5">Participants</div>
        {/* Selectable candidate cards (design SelectUser idiom) — avatar + name + current→target,
            indigo highlight + checkCircle when picked. Replaces the plain checkbox list. */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2.5 mb-2.5">
          {(people ?? []).map((p) => {
            const on = selected.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => toggleParticipant(p.id)}
                className="flex items-center gap-3 p-3 rounded-md border text-start transition-colors"
                style={{
                  borderColor: on ? 'var(--indigo-500)' : 'var(--border)',
                  borderWidth: '1.5px',
                  background: on ? 'var(--indigo-50)' : 'var(--surface)',
                  boxShadow: on ? 'var(--sh-sm)' : 'none',
                }}
              >
                <Avatar name={p.fullName} size={36} />
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-semibold truncate">{p.fullName}</span>
                  <span className="block text-[11.5px] text-text-3 truncate">
                    {p.currentJobTitle ?? p.jobLevel}
                    {p.targetJobTitle ? ` → ${p.targetJobTitle}` : ''}
                  </span>
                </span>
                {on && <Icon path={checkCircle} size={18} style={{ color: 'var(--indigo-500)' }} />}
              </button>
            );
          })}
        </div>
        <div className="text-[13px] font-semibold mt-2 mb-1.5">Dimensions</div>
        <div className="flex gap-3 flex-wrap mb-2.5">
          {DIMENSIONS.map((d) => (
            <Checkbox
              key={d.id}
              checked={dims.includes(d.id)}
              onChange={() => toggleDim(d.id)}
              label={d.label}
            />
          ))}
        </div>
        <Button onClick={build} disabled={busy}>
          {busy ? 'Building…' : 'Compare'}
        </Button>
      </Card>

      {result && cands.length < 2 && (
        <Card>
          <EmptyState
            title="Not enough eligible candidates"
            sub="At least two participants with released reports are needed."
          />
        </Card>
      )}

      {result && cands.length >= 2 && (
        <>
          {/* Setup bar — the role/blueprint/context this comparison is scoped to (design parity). */}
          <div className="flex gap-3.5 items-center flex-wrap mb-4 rounded-lg border border-border bg-surface px-[18px] py-3.5 shadow-sm">
            {(
              [
                ['Target Role', result.comparison.roleTitle],
                ['Role Blueprint', result.comparison.blueprintId ?? '—'],
                ['Context Profile', result.comparison.contextProfileId ?? '—'],
              ] as [string, string][]
            ).map(([label, value]) => (
              <div key={label}>
                <div className="text-[10.5px] text-text-3 font-bold uppercase">{label}</div>
                <div className="text-[13.5px] font-semibold mt-0.5">{value}</div>
              </div>
            ))}
            <div className="flex-1" />
            {cands.some((c) => c.contextualBand) && (
              <Chip tone="violet" icon={layers}>
                Domain 6 enabled
              </Chip>
            )}
          </div>

          {/* Governance banner — Nexus never produces an automatic decision (FR-RPT-006/007). */}
          <div
            className="flex gap-2.5 items-start mb-4 rounded-md px-4 py-3"
            style={{ background: 'var(--amber-50)', border: '1px solid var(--amber-100)' }}
          >
            <Icon path={info} size={16} style={{ color: 'var(--amber-700)', flexShrink: 0 }} />
            <div className="text-[12.5px] leading-relaxed" style={{ color: 'var(--amber-700)' }}>
              Nexus does not produce an automatic hiring decision. Use this comparison to inform
              structured, evidence-based judgement.
            </div>
          </div>

          {/* Side-by-side grid (design admin_reports.jsx). The highest score in each dimension row is
              highlighted (teal) for explainability — a per-dimension fact, NOT an overall ranking,
              shortlist, or omnibus fit verdict, which remain forbidden (FR-RPT-006/007). */}
          <Card className="mb-4 overflow-x-auto">
            <table className="border-collapse min-w-[480px] w-full">
              <thead>
                <tr>
                  <th className="sticky start-0 bg-surface-2 text-start p-[18px] text-[12px] font-bold text-text-3 border-b border-e border-border-soft">
                    Candidate
                  </th>
                  {cands.map((c, ci, arr) => (
                    <th
                      key={c.participantId}
                      className={`relative p-4 min-w-[170px] border-b border-border align-top ${ci < arr.length - 1 ? 'border-e border-border-soft' : ''}`}
                    >
                      {/* Remove this candidate from the comparison (design admin_reports.jsx). */}
                      {cands.length > 2 && (
                        <IconButton
                          label={`Remove ${c.displayName}`}
                          onClick={() => removeCandidate(c.participantId)}
                          className="absolute top-2 end-2 w-7 h-7 border-0 bg-transparent text-text-3"
                        >
                          <Icon path={x} size={14} />
                        </IconButton>
                      )}
                      <div className="flex flex-col items-center gap-2">
                        <Avatar name={c.displayName} size={48} />
                        <span className="text-sm font-bold">{c.displayName}</span>
                        <ConfidenceChip band={c.confidence} />
                        {c.contextualBand && <Chip tone="indigo">{c.contextualBand}</Chip>}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Contextual Alignment (Domain 6 · CAI) ring row (design admin_reports.jsx). The
                    highest CAI is marked "Highest" — a per-metric fact for explainability, NOT an
                    overall ranking or omnibus fit verdict (forbidden, FR-RPT-006/007). */}
                {cands.some((c) => c.cai != null) && (
                  <tr className="border-t border-border-soft">
                    <td className="sticky start-0 bg-surface px-[18px] py-3.5 border-e border-border-soft">
                      <div className="text-[13px] font-semibold">Contextual Alignment</div>
                      <div className="text-[11px] text-text-3">Domain 6 · CAI</div>
                    </td>
                    {cands.map((c, ci, arr) => {
                      const bestCai = Math.max(...cands.map((x) => x.cai ?? -1));
                      const isBest = c.cai != null && c.cai === bestCai;
                      return (
                        <td
                          key={c.participantId}
                          className={`p-3.5 ${ci < arr.length - 1 ? 'border-e border-border-soft' : ''}`}
                        >
                          {c.cai != null ? (
                            <div className="flex items-center justify-center gap-2">
                              <Ring
                                value={c.cai}
                                size={52}
                                stroke={5}
                                color={isBest ? 'var(--teal-600)' : 'var(--indigo-500)'}
                              />
                              {isBest && (
                                <span className="text-[10.5px] font-bold text-teal-700">
                                  Highest
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="text-center text-xs text-text-3">—</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                )}
                {dims.map((dimId) => {
                  // Highlight the highest score in each dimension row (design admin_reports.jsx).
                  const best = Math.max(...cands.map((c) => c.dimensionScores[dimId] ?? -1));
                  return (
                    <tr key={dimId} className="border-t border-border-soft">
                      <td className="sticky start-0 bg-surface py-[13px] px-[18px] text-[12.5px] font-medium border-e border-border-soft">
                        {DIMENSIONS.find((d) => d.id === dimId)?.label ?? dimId}
                      </td>
                      {cands.map((c, ci, arr) => {
                        const v = c.dimensionScores[dimId];
                        const isBest = v != null && v === best;
                        return (
                          <td
                            key={c.participantId}
                            className={`py-[13px] px-[14px] ${ci < arr.length - 1 ? 'border-e border-border-soft' : ''}`}
                          >
                            {v != null ? (
                              <div className="flex items-center gap-2.5">
                                <div className="flex-1">
                                  <ScoreBar
                                    value={v}
                                    label={dimId}
                                    color={isBest ? 'var(--teal-600)' : 'var(--indigo-400)'}
                                  />
                                </div>
                                <span
                                  className={`tnum text-[13px] w-6 text-right ${isBest ? 'font-bold text-teal-700' : 'font-semibold'}`}
                                >
                                  {v}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-text-3">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

          {/* Per-candidate qualitative cards (design parity) — real strengths/areas data. One column
              per candidate (design repeat(n,1fr)) so the row fills exactly, with no empty gap when
              fewer than 3 are compared; stacks on mobile. */}
          <div
            className="grid gap-3.5 mb-4 grid-cols-1 sm:[grid-template-columns:repeat(var(--cmp-cols),minmax(0,1fr))]"
            style={{ '--cmp-cols': cands.length } as CSSProperties}
          >
            {cands.map((c) => (
              <Card key={c.participantId}>
                <div className="flex items-center gap-2.5 mb-3">
                  <Avatar name={c.displayName} size={32} />
                  <span className="text-sm font-bold">{c.displayName}</span>
                </div>
                <div className="text-[11px] font-bold uppercase mb-1.5 text-teal-700">
                  Strengths
                </div>
                <ul className="text-[12.5px] text-text-2 leading-relaxed mb-3 ps-1 list-none">
                  {(c.strengths.length ? c.strengths : ['—']).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
                <div className="text-[11px] font-bold uppercase mb-1.5 text-amber-700">Stretch</div>
                <ul className="text-[12.5px] text-text-2 leading-relaxed mb-3.5 ps-1 list-none">
                  {(c.areasToExplore.length ? c.areasToExplore : ['—']).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
                <Link to={`/admin/reports/${c.reportId}`}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Open Report
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </>
      )}

      {ineligible.length > 0 && (
        <Card className="mb-4 text-[13px] text-amber-600">
          Not included (no eligible/released report):{' '}
          {ineligible.map((e) => nameOf(e.participantId)).join(', ')}.
        </Card>
      )}

      {result && (
        <Card className="text-xs text-text-2">
          This comparison shows candidates side by side to support human judgment. It does not rank,
          shortlist, or recommend — the assessment is one input among many requiring human review.
        </Card>
      )}
    </div>
  );
}
