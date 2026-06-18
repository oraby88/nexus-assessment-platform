// Instructions (Spec 006 / US1 / FR-USR-007). Final orientation, then Begin → runtime.
// Spec 012 (T023): visual parity with project/app/user_assessment.jsx Instructions — icon-badge
// instruction cards.
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card } from '@/components/ui';
import { Icon, layers, clock, refresh, check, checkCircle } from '@/components/ui/icons';
import { FocusFrame } from '@/features/builderChrome';

const POINTS: [string, string, string][] = [
  [
    layers,
    'Question types',
    'You’ll see agreement scales, frequency scales, choices, and short scenarios.',
  ],
  [
    clock,
    'Timed sections',
    'Any countdown is a guide only — it never blocks you or submits for you.',
  ],
  [
    refresh,
    'Pause & resume',
    'Use “Save & exit” at any time; you’ll return exactly where you left off.',
  ],
  [check, 'Auto-save', 'Every answer is saved automatically, even if you reload the page.'],
  [checkCircle, 'Submitting', 'At the end you can review every answer before you submit.'],
];

export function Instructions() {
  const { assessmentId = '' } = useParams();
  const navigate = useNavigate();
  return (
    <FocusFrame label="Step 3 of 3" onExit={() => navigate('/app/dashboard')}>
      <h1 className="text-2xl font-bold tracking-[-0.02em]">Instructions</h1>
      <p className="text-sm text-text-2 mt-1 mb-5">A few things to know before you start.</p>
      <div className="flex flex-col gap-3 mb-4">
        {POINTS.map(([icon, term, desc]) => (
          <Card key={term} className="flex gap-3.5">
            <span
              className="w-10 h-10 rounded-[10px] grid place-items-center flex-none"
              style={{ background: 'var(--indigo-50)', color: 'var(--indigo-500)' }}
            >
              <Icon path={icon} size={19} />
            </span>
            <div>
              <div className="text-[14.5px] font-bold">{term}</div>
              <p className="text-[13px] text-text-2 mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex gap-2.5">
        <Button
          variant="secondary"
          onClick={() => navigate(`/app/assessments/${assessmentId}/consent`)}
        >
          Back
        </Button>
        <div className="flex-1" />
        <Button onClick={() => navigate(`/app/assessments/${assessmentId}/run`)}>
          Begin assessment
        </Button>
      </div>
    </FocusFrame>
  );
}
