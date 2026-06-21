// Assessment runtime container (Spec 006 / US1+US2). Renders the pre-resolved item set verbatim,
// gates Next on an answer, allows free back-navigation, auto-saves to localStorage, supports
// pause/resume + reload restore, and submits to a completion state. It stores each response keyed by
// the source Question ID and shows NO live score at any point (constitution VIII).
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, EmptyState, Skeleton, Chip, ThemeToggle } from '@/components/ui';
import { check, compare, target, briefcase } from '@/components/ui/icons';
import { useAsync, useT } from '@/hooks';
import { runtimeService } from '@/services';
import type { MethodFamily, RuntimeSession, RuntimeState } from '@/models';
import { SaveIndicator } from './SaveIndicator';
import { QuestionRenderer } from './renderers';

// Question-type pill meta (design user_assessment.jsx QuestionCard): per method-family tinted chip
// with an icon + label. The label is i18n-keyed (runtime.type.*); the tone reuses the Chip palette.
const TYPE_META: Record<MethodFamily, { icon: string; tone: 'indigo' | 'violet' }> = {
  likert: { icon: check, tone: 'indigo' },
  contextual_self_report: { icon: check, tone: 'indigo' },
  forced_choice: { icon: compare, tone: 'violet' },
  cognitive_multiple_choice: { icon: target, tone: 'indigo' },
  sjt: { icon: briefcase, tone: 'indigo' },
};

/** Compact Nexus mark for the runtime top bar (indigo square + white glyph). */
function RuntimeMark() {
  return (
    <svg width={24} height={24} viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect width="32" height="32" rx="8" fill="var(--indigo-500)" />
      <path
        d="M11 21V11l10 10V11"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AssessmentRuntime() {
  const { assessmentId = '' } = useParams();
  const navigate = useNavigate();
  const { t } = useT();
  const { data, loading, error, reload } = useAsync<RuntimeSession>(
    () => runtimeService.load(assessmentId),
    [assessmentId],
  );
  const [state, setState] = useState<RuntimeState | null>(null);
  const [saving, setSaving] = useState(false);

  // Rehydrate local state on load; implicitly resume if previously paused (research D1).
  useEffect(() => {
    if (!data) return;
    if (data.state.paused) {
      runtimeService.resume(assessmentId).then(setState);
    } else {
      setState(data.state);
    }
  }, [data, assessmentId]);

  if (loading || !state) return <Skeleton height={240} />;
  if (error)
    return (
      <Card className="m-6">
        <p className="text-rose-600 mb-2.5">{t('runtime.loadError')}</p>
        <Button variant="secondary" onClick={reload}>
          {t('runtime.retry')}
        </Button>
      </Card>
    );
  if (!data) return <EmptyState title={t('runtime.notFound')} />;

  const { items, meta } = data;
  const idx = state.questionIndex;
  const isReview = idx >= items.length;
  const current = items[idx];
  const currentAnswer = current ? state.answers[current.sourceQuestionId] : undefined;
  const canAdvance = currentAnswer != null;

  async function run(p: Promise<RuntimeState>) {
    setSaving(true);
    const s = await p;
    setState(s);
    setSaving(false);
  }

  const onChange = (v: number | string) =>
    current && run(runtimeService.answer(assessmentId, current.sourceQuestionId, v));
  const next = () => run(runtimeService.next(assessmentId));
  const back = () => run(runtimeService.back(assessmentId));
  const goTo = (i: number) => run(runtimeService.goTo(assessmentId, i));
  const saveAndExit = async () => {
    await runtimeService.pause(assessmentId);
    navigate('/app/dashboard');
  };
  const submit = async () => {
    await runtimeService.submit(assessmentId);
    navigate(`/app/assessments/${assessmentId}/complete`);
  };

  return (
    <div className="flex flex-col h-screen bg-canvas">
      {/* top bar + progress (design user_assessment.jsx Runtime) */}
      <div className="flex-none bg-surface border-b border-border">
        <div className="h-[54px] flex items-center gap-4 px-6">
          <RuntimeMark />
          <span className="text-[13px] font-bold truncate min-w-0">
            {isReview ? t('runtime.reviewTitle') : (current?.sectionName ?? meta.targetRole)}
          </span>
          <div className="flex-1" />
          <span className="text-[12.5px] text-text-3 font-semibold">
            {t('runtime.ofCount', {
              current: Math.min(idx + 1, items.length),
              total: items.length,
            })}
          </span>
          <SaveIndicator saving={saving} lastSavedAt={state.lastSavedAt} />
          <ThemeToggle />
          <Button
            variant="secondary"
            onClick={saveAndExit}
            style={{ padding: '7px 12px', fontSize: 13 }}
          >
            {t('runtime.saveExit')}
          </Button>
        </div>
        <div
          role="progressbar"
          aria-valuenow={state.progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t('runtime.progressLabel')}
          className="h-1 bg-canvas-2"
        >
          <div
            className="h-full bg-indigo-500"
            style={{ width: `${state.progressPercent}%`, transition: 'width .4s var(--ease-out)' }}
          />
        </div>
      </div>

      {/* question / review */}
      <div className="flex-1 overflow-auto flex justify-center px-6 py-12">
        <div className="w-full max-w-[680px]">
          {isReview ? (
            <Card>
              <h2 className="text-xl mb-1">{t('runtime.reviewTitle')}</h2>
              <p className="text-sm text-text-2 mb-3.5">{t('runtime.reviewIntro')}</p>
              <ol className="grid gap-2 list-none">
                {items.map((it, i) => {
                  const answered = state.answers[it.sourceQuestionId] != null;
                  return (
                    <li key={it.sourceQuestionId}>
                      <button
                        onClick={() => goTo(i)}
                        className="flex w-full gap-2.5 items-center text-start py-2.5 px-3 rounded-md border border-border bg-surface-2 text-sm"
                      >
                        <span className="text-text-3 min-w-[22px]">{i + 1}</span>
                        <span className="flex-1">{it.itemText}</span>
                        <Chip tone={answered ? 'teal' : 'amber'}>
                          {answered ? t('runtime.answered') : t('runtime.skipped')}
                        </Chip>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </Card>
          ) : (
            <Card>
              <div className="mb-[18px]">
                <Chip
                  tone={TYPE_META[current.methodFamily].tone}
                  icon={TYPE_META[current.methodFamily].icon}
                >
                  {t(`runtime.type.${current.methodFamily}`)}
                </Chip>
              </div>
              <h2 className="text-[23px] font-bold leading-[1.35] tracking-[-0.01em] mb-4">
                {current.itemText}
              </h2>
              <QuestionRenderer item={current} value={currentAnswer} onChange={onChange} />
            </Card>
          )}
        </div>
      </div>

      {/* nav footer with dot indicators (design) */}
      <div className="flex-none h-[74px] flex items-center justify-between px-6 bg-surface border-t border-border">
        <Button variant="ghost" onClick={back} disabled={isReview ? false : idx === 0}>
          {t('runtime.back')}
        </Button>
        <div className="flex gap-1.5">
          {items.map((it, k) => (
            <span
              key={it.sourceQuestionId}
              className="w-2 h-2 rounded-full"
              style={{
                background:
                  k === idx
                    ? 'var(--indigo-500)'
                    : state.answers[it.sourceQuestionId] != null
                      ? 'var(--indigo-300)'
                      : 'var(--border-strong)',
                transition: 'all .2s',
              }}
            />
          ))}
        </div>
        {isReview ? (
          <Button onClick={submit}>{t('runtime.submitAssessment')}</Button>
        ) : (
          <Button onClick={next} disabled={!canAdvance}>
            {idx === items.length - 1 ? t('runtime.review') : t('runtime.next')}
          </Button>
        )}
      </div>
    </div>
  );
}
