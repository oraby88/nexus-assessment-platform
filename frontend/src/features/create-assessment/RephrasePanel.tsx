// Rephrase panel (Spec 003 / FR-CA-011/012). Display-only edit with a word diff; method safeguards.
// SJT + cognitive MCQ are verbatim in V1 (rephrase disabled). Source metadata stays locked.
// Spec 012: parity with project/app/create_assessment3.jsx QuestionSelect expanded card — a two-column
// Original|Adapted diff, a locked-scoring strip, and the governed-metadata row.
import { useState } from 'react';
import { Card, Button, TextArea, TrustBadge } from '@/components/ui';
import { Icon, lock } from '@/components/ui/icons';
import { adaptationService } from '@/services';
import type { AdaptedQuestionText, SelectedQuestion } from '@/models';

export function RephrasePanel({
  selected,
  onAdapted,
}: {
  selected: SelectedQuestion;
  onAdapted: (a: AdaptedQuestionText | undefined) => void;
}) {
  const i = selected.item;
  const adaptable = adaptationService.canAdapt(i.methodFamily);
  const [draftText, setDraftText] = useState(selected.adaptation?.adaptedText ?? i.itemText);
  const [result, setResult] = useState<AdaptedQuestionText | undefined>(selected.adaptation);
  const [busy, setBusy] = useState(false);
  const hasDiff = !!result && result.adaptedText !== result.originalText;

  async function rephrase() {
    setBusy(true);
    const a = await adaptationService.adapt({ itemId: i.itemId, adaptedText: draftText, item: i });
    setResult(a);
    onAdapted(a);
    setBusy(false);
  }

  // Governed metadata — locked, never editable (constitution VI).
  const meta: [string, string][] = [
    ['Facet', i.facetName],
    ['Scoring', i.methodFamily],
    ['Governance', i.useStatus],
    ['Validation', i.reviewStatus],
    ['Job-Level', i.jobLevelOverlay],
  ];

  return (
    <Card className="mb-3">
      <div className="text-xs text-text-3 font-mono">{i.itemId}</div>
      {!hasDiff && (
        <div className="text-[13px] mt-1.5">
          <strong>Original:</strong> {i.itemText}
        </div>
      )}

      {!adaptable ? (
        <p className="text-[13px] text-amber-600 mt-2.5">
          {i.methodFamily} is verbatim by default in V1 — original wording retained (no approved
          equivalence template).
        </p>
      ) : (
        <>
          <TextArea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            aria-label={`Adapt wording for ${i.itemId}`}
            className="mt-2.5"
          />
          <div className="flex gap-2.5 mt-2">
            <Button onClick={rephrase} disabled={busy}>
              {busy ? 'Rephrasing…' : 'Apply rephrase'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setDraftText(i.itemText);
                setResult(undefined);
                onAdapted(undefined);
              }}
            >
              Keep original
            </Button>
          </div>
        </>
      )}

      {/* two-column Original | Adapted diff (design) */}
      {hasDiff && (
        <div
          className="grid sm:grid-cols-2 gap-3.5 p-4 mt-3 rounded-md"
          style={{ background: 'var(--surface-2)' }}
        >
          <div>
            <div className="text-[10.5px] font-bold uppercase text-text-3 mb-1">
              Original (governed bank)
            </div>
            <div className="text-[13px] text-text-2 leading-snug italic">
              “{result!.originalText}”
            </div>
          </div>
          <div>
            <div className="text-[10.5px] font-bold uppercase text-indigo-500 mb-1 flex items-center gap-1.5">
              Adapted for this role
              <span
                className="text-[9px] font-bold rounded-full px-1.5 py-px normal-case tracking-normal"
                style={{ background: 'var(--indigo-100)', color: 'var(--text-3)' }}
              >
                changes highlighted
              </span>
            </div>
            <div className="text-[13px] leading-snug">
              “
              {result!.diff.map((span, idx) => (
                <span
                  key={idx}
                  className={
                    span.changed
                      ? 'bg-indigo-100 text-indigo-700 rounded px-0.5 font-semibold'
                      : undefined
                  }
                >
                  {span.text}
                </span>
              ))}
              ”
            </div>
          </div>
        </div>
      )}

      {/* locked scoring strip (design) — scoring is always locked to the bank item */}
      <div
        className="flex items-center gap-2.5 mt-3 px-3.5 py-[11px] rounded-md"
        style={{ background: 'var(--teal-50)', border: '1px solid var(--teal-100)' }}
      >
        <span
          className="w-[30px] h-[30px] rounded-lg grid place-items-center flex-none text-white"
          style={{ background: 'var(--teal-600)' }}
        >
          <Icon path={lock} size={15} />
        </span>
        <div className="flex-1 text-xs leading-snug" style={{ color: 'var(--teal-700)' }}>
          <strong>Construct, dimension and scoring rule are locked</strong> and identical to the
          bank item — wording changes never affect scoring.
        </div>
        <TrustBadge />
      </div>

      {/* governed metadata row (design) */}
      <div className="flex gap-[18px] flex-wrap mt-3.5">
        {meta.map(([k, v]) => (
          <div key={k}>
            <div className="text-[10px] font-bold uppercase text-text-3">{k}</div>
            <div className="mono text-[11.5px] font-semibold mt-0.5">{v}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
