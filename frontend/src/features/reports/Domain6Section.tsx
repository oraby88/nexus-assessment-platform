// Domain 6 contextual section (US2 / FR-RPT-003). CAI/DII gauges, six secondary indices (honoring
// visibility), candidate-vs-context fit radar, provisional/omitted handling. Derailment Risk is
// blocked and never shown as data (constitution XI).
import { Card, Chip, ConfidenceChip, ScoreBar, Ring } from '@/components/ui';
import { Icon, checkCircle as check, alert, layers } from '@/components/ui/icons';
import { FitRadar } from '@/components/charts';
import type { Domain6Result, SecondaryIndex } from '@/models';

function indexShown(s: SecondaryIndex): boolean {
  return s.visibility !== 'hidden' && s.visibility !== 'blocked' && s.score != null;
}

// Tone selection mirrors report_detail.jsx: risks invert (low=good→teal), others scale up.
function indexTone(s: SecondaryIndex): string {
  const score = s.score ?? 0;
  if (s.type === 'risk') return score < 35 ? 'teal' : score < 60 ? 'amber' : 'rose';
  return score >= 75 ? 'teal' : score >= 55 ? 'indigo' : 'amber';
}

export function Domain6Section({ d6 }: { d6: Domain6Result }) {
  return (
    <Card>
      <div className="flex gap-2.5 items-center mb-3 flex-wrap">
        <h2 className="text-lg">Domain 6 — Contextual Alignment</h2>
        {d6.confidence === 'Provisional' ? (
          <Chip tone="amber">Provisional</Chip>
        ) : (
          <ConfidenceChip band={d6.confidence === 'High' ? 'High' : 'Moderate'} />
        )}
        <Chip tone="violet" icon={layers}>
          Derived layer
        </Chip>
      </div>

      {/* radar (candidate vs context, in a tinted card) + CAI/DII rings (design report_detail.jsx). */}
      <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-center mb-4">
        <div
          className="flex flex-col items-center rounded-lg px-2.5 py-4"
          style={{ background: 'var(--surface-2)' }}
        >
          <FitRadar axes={d6.radar} />
          <div className="flex gap-4 text-[11.5px] font-semibold mt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-[3px] rounded-sm" style={{ background: '#4F46E5' }} />
              Candidate
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-3.5 inline-block border-t-2 border-dashed"
                style={{ borderColor: '#94A0B0' }}
              />
              Context requirement
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <Ring value={d6.cai ?? 0} size={76} stroke={7} color="var(--indigo-700)" />
            <div>
              <div className="text-[15px] font-bold">Contextual Alignment Index (CAI)</div>
              {d6.caiBand && (
                <div className="text-[12.5px] text-text-2 mt-0.5 max-w-[240px] leading-snug">
                  {d6.caiBand}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Ring value={d6.dii ?? 0} size={76} stroke={7} color="var(--teal-600)" />
            <div>
              <div className="text-[15px] font-bold">Decision Influence Index (DII)</div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[13.5px] text-text-2 leading-relaxed mb-[18px] max-w-[680px]">
        {d6.narrative}
      </p>

      <h3 className="text-[13px] font-bold mt-6 mb-3.5">Secondary Indices</h3>
      <div className="grid grid-cols-[1fr,1fr,1fr] gap-3 mb-3.5">
        {d6.secondaryIndices.map((s) => {
          const shown = indexShown(s);
          const tone = indexTone(s);
          const isRisk = s.type === 'risk';
          return (
            <div
              key={s.code}
              className="bg-surface border border-border rounded-md px-4 py-3.5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="mono text-[10.5px] font-bold text-text-3">{s.code}</span>
                {isRisk && (
                  <span
                    className="text-[9.5px] font-bold rounded-full px-1.5 py-px"
                    style={{ background: 'var(--amber-50)', color: 'var(--amber-700)' }}
                  >
                    RISK
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span
                  className="text-2xl font-bold font-display"
                  style={{ color: shown ? `var(--tone-${tone}-fg)` : 'var(--text-3)' }}
                >
                  {shown ? s.score : '—'}
                </span>
                <span className="text-xs font-semibold text-text-2">{s.name}</span>
              </div>
              {shown && (
                <div className="mt-2.5">
                  <ScoreBar value={s.score ?? 0} color={`var(--tone-${tone}-dot)`} height={5} />
                </div>
              )}
              {s.explanation && (
                <div className="text-[11px] text-amber-600 mt-1.5">{s.explanation}</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 gap-3.5 mt-[18px] mb-3">
        <div className="rounded-md p-4" style={{ background: 'var(--teal-50)' }}>
          <div className="text-xs font-bold text-teal-700 mb-2.5 uppercase tracking-[0.04em]">
            Contextual Strengths
          </div>
          {d6.contextStrengths.map((s) => (
            <div key={s} className="flex gap-2 text-[13px] text-text-2 mb-[7px]">
              <Icon path={check} size={15} style={{ color: 'var(--teal-600)' }} />
              {s}
            </div>
          ))}
        </div>
        <div className="rounded-md p-4" style={{ background: 'var(--amber-50)' }}>
          <div className="text-xs font-bold text-amber-700 mb-2.5 uppercase tracking-[0.04em]">
            Contextual Risks
          </div>
          {d6.contextCautions.map((s) => (
            <div key={s} className="flex gap-2 text-[13px] text-text-2 mb-[7px]">
              <Icon path={alert} size={15} style={{ color: 'var(--amber-600)' }} />
              {s}
            </div>
          ))}
        </div>
      </div>

      {d6.provisionalReasons && d6.provisionalReasons.length > 0 && (
        <div className="text-xs text-amber-600">
          Provisional: {d6.provisionalReasons.join('; ')}
        </div>
      )}
      <div className="text-xs text-text-3 mt-2">
        Derailment Risk is blocked and is never shown as report data.
      </div>
    </Card>
  );
}
