// Create Assessment wizard shell (Spec 003 / FR-CA-001/014/016). Full-bleed; holds draft state,
// progress, per-step gating, draft persistence, approval gate, and send.
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Skeleton, Avatar, ThemeToggle, IconButton } from '@/components/ui';
import { Icon, x } from '@/components/ui/icons';
import { useToast } from '@/hooks';
import { assessmentDraftService } from '@/services';
import type { AssessmentDraft, JobRequirementsProfile, Participant } from '@/models';
import { WizardContext } from './wizardContext';
import { STEPS, SuccessState, canAdvance } from './steps';
import { TransformSequence } from './TransformSequence';

const SUCCESS_STEP = STEPS.length + 1; // 13
const REVIEW_STEP = STEPS.length; // 12 — the assembled assessment, ready for review

// Short per-step descriptions for the left rail (design create_assessment.jsx STEPS[].d).
const STEP_DESC = [
  'Who is being assessed',
  'Why this assessment',
  'Interview the agent',
  'Review the profile',
  'Link success model',
  'Define the environment',
  'Select governed items',
  'Adapt the wording',
  'Coverage & balance',
  'Approve the summary',
  'Set the deadline',
  'Confirm & invite',
];

/** Compact Nexus mark for the wizard top bar (indigo square + white glyph). */
function WizardMark() {
  return (
    <svg width={26} height={26} viewBox="0 0 32 32" fill="none" aria-hidden>
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

export function CreateAssessmentWizard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [draft, setDraft] = useState<AssessmentDraft | null>(null);
  const [participant, setParticipant] = useState<Participant>();
  const [requirements, setRequirements] = useState<JobRequirementsProfile>();
  const [sentId, setSentId] = useState<string>();
  const [busy, setBusy] = useState(false);
  // Spec 011 / US3: the transform sequence plays once, on the transition INTO Review (assembled).
  const [showSequence, setShowSequence] = useState(false);
  const [sequencePlayed, setSequencePlayed] = useState(false);

  useEffect(() => {
    // Start with no participant so Step 1 gates "Next" until one is explicitly selected.
    assessmentDraftService.create('').then(setDraft);
  }, []);

  const update = useMemo(
    () => (patch: Partial<AssessmentDraft>) => {
      setDraft((prev) => {
        if (!prev) return prev;
        const nd = { ...prev, ...patch };
        void assessmentDraftService.save(nd);
        return nd;
      });
    },
    [],
  );

  if (!draft)
    return (
      <div className="p-6">
        <Skeleton height={200} />
      </div>
    );

  const step = draft.currentStep;
  const goTo = (s: number) => update({ currentStep: s });
  // Advance Next; entering Review for the first time plays the transform sequence (then advances).
  const advance = () => {
    const next = step + 1;
    if (next === REVIEW_STEP && !sequencePlayed) {
      setShowSequence(true);
      return;
    }
    goTo(next);
  };

  async function send() {
    if (!draft || !draft.approved) return;
    setBusy(true);
    try {
      const res = await assessmentDraftService.send(draft);
      setSentId(res.assignment.id);
      toast('Assessment sent', 'success');
      setDraft((prev) => (prev ? { ...prev, currentStep: SUCCESS_STEP } : prev));
    } catch (e) {
      toast((e as Error).message, 'error');
    } finally {
      setBusy(false);
    }
  }

  const ctx = { draft, update, participant, setParticipant, requirements, setRequirements };

  if (step >= SUCCESS_STEP) {
    return (
      <div className="max-w-[1100px] mx-auto p-6">
        <SuccessState
          candidate={participant?.fullName}
          role={draft.targetRole}
          onList={() => navigate(sentId ? `/admin/assessments/${sentId}` : '/admin/assessments')}
          onDashboard={() => navigate('/admin/dashboard')}
        />
      </div>
    );
  }

  const StepComp = STEPS[step - 1].component;
  const advanceOk = canAdvance(step, draft, !!participant);

  return (
    <WizardContext.Provider value={ctx}>
      {showSequence && (
        <TransformSequence
          count={draft.selected.length}
          onDone={() => {
            setSequencePlayed(true);
            setShowSequence(false);
            goTo(REVIEW_STEP);
          }}
        />
      )}
      <div className="flex flex-col h-screen bg-canvas">
        {/* top bar (design create_assessment.jsx) */}
        <div className="flex-none h-[60px] flex items-center gap-4 px-6 bg-surface border-b border-border">
          <WizardMark />
          <div className="text-[15px] font-bold">Create Assessment</div>
          {participant && (
            <div
              className="flex items-center gap-2 rounded-full pl-2.5 pr-1 py-1"
              style={{ background: 'var(--indigo-50)' }}
            >
              <span className="text-[12.5px] font-semibold text-indigo-700">
                for {participant.fullName}
              </span>
              <Avatar name={participant.fullName} size={24} />
            </div>
          )}
          <div className="flex-1" />
          <span className="text-[12.5px] text-text-3">
            Step {step} of {STEPS.length}
          </span>
          <ThemeToggle />
          <IconButton label="Exit" onClick={() => navigate('/admin/assessments')}>
            <Icon path={x} size={18} />
          </IconButton>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* step rail (design left rail) */}
          <aside className="hidden md:block w-[216px] flex-none border-r border-border bg-surface overflow-auto py-[22px] px-3.5">
            {STEPS.map((s, i) => {
              const idx = i + 1;
              const on = idx === step;
              const done = idx < step;
              return (
                <button
                  key={s.title}
                  onClick={() => idx <= step && goTo(idx)}
                  disabled={idx > step}
                  className="flex gap-3 w-full text-start mb-0.5 rounded-md p-2.5"
                  style={{ background: on ? 'var(--indigo-50)' : 'transparent' }}
                >
                  <span
                    className="grid place-items-center w-[26px] h-[26px] rounded-full text-xs font-bold font-display flex-none"
                    style={{
                      background: done
                        ? 'var(--teal-600)'
                        : on
                          ? 'var(--indigo-500)'
                          : 'var(--canvas-2)',
                      color: done || on ? '#fff' : 'var(--text-3)',
                      border: on || done ? 'none' : '1px solid var(--border)',
                    }}
                  >
                    {done ? '✓' : idx}
                  </span>
                  <span className="pt-px">
                    <span
                      className="block text-[13px]"
                      style={{
                        fontWeight: on ? 700 : 600,
                        color: on ? 'var(--indigo-700)' : done ? 'var(--text)' : 'var(--text-2)',
                      }}
                    >
                      {s.title}
                    </span>
                    <span className="block text-[11px] text-text-3 mt-px">{STEP_DESC[i]}</span>
                  </span>
                </button>
              );
            })}
          </aside>

          {/* content — discovery (step 3) fills the whole area (design); other steps are centered */}
          {step === 3 ? (
            <div className="flex-1 min-w-0 min-h-0 overflow-hidden">
              <StepComp />
            </div>
          ) : (
            <div className="flex-1 min-w-0 overflow-auto">
              <div className="max-w-[920px] mx-auto px-10 py-8">
                <StepComp />
              </div>
            </div>
          )}
        </div>

        {/* footer */}
        <div className="flex-none h-[70px] flex items-center gap-2.5 px-6 border-t border-border bg-surface">
          <Button
            variant="ghost"
            onClick={() => (step > 1 ? goTo(step - 1) : navigate('/admin/assessments'))}
            disabled={busy}
          >
            {step > 1 ? 'Back' : 'Cancel'}
          </Button>
          <div className="flex-1" />
          {step < STEPS.length && (
            <Button onClick={advance} disabled={!advanceOk}>
              Continue
            </Button>
          )}
          {step === STEPS.length && (
            <Button onClick={send} disabled={!draft.approved || busy}>
              {busy ? 'Sending…' : 'Send assessment'}
            </Button>
          )}
        </div>
      </div>
    </WizardContext.Provider>
  );
}
