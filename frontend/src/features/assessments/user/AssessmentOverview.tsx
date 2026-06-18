// Assessment Overview (Spec 006 / US1 / FR-USR-004). Orientation before consent — own-data only.
// Spec 012 (T023): visual parity with project/app/user_assessment.jsx Overview — icon-grid fact cards
// + a pause/resume info banner. Real session data + navigation preserved.
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Chip, EmptyState, Skeleton } from '@/components/ui';
import {
  Icon,
  briefcase,
  target,
  shield,
  clock,
  layers,
  calendar,
  info,
  arrowRight,
} from '@/components/ui/icons';
import { FocusFrame } from '@/features/builderChrome';
import { useAsync } from '@/hooks';
import { runtimeService } from '@/services';
import type { RuntimeSession } from '@/models';

export function AssessmentOverview() {
  const { assessmentId = '' } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync<RuntimeSession>(
    () => runtimeService.load(assessmentId),
    [assessmentId],
  );

  if (loading) return <Skeleton height={200} />;
  if (error)
    return (
      <Card>
        <p className="text-rose-600 mb-2.5">Couldn’t load this assessment.</p>
        <Button variant="secondary" onClick={reload}>
          Retry
        </Button>
      </Card>
    );
  if (!data)
    return (
      <Card>
        <EmptyState
          title="Assessment unavailable"
          sub="This assessment may have expired or been withdrawn. Please contact support."
        />
      </Card>
    );

  const { meta, items } = data;
  const purpose = meta.useCase === 'hiring_support' ? 'Hiring Support' : 'Developmental';
  const facts: [string, string, string][] = [
    [briefcase, 'Organization', meta.organizationName],
    [target, 'Purpose', purpose],
    [clock, 'Estimated time', `${meta.estimatedMinutes ?? '—'} minutes`],
    [calendar, 'Deadline', meta.deadline ?? 'No deadline'],
    [layers, 'Questions', `${items.length} questions`],
    [shield, 'Privacy', 'Specific consent required'],
  ];

  return (
    <FocusFrame label="Step 1 of 3" onExit={() => navigate('/app/dashboard')}>
      <div className="text-center mb-2">
        <Chip tone="indigo">{purpose}</Chip>
      </div>
      <h1 className="text-[30px] font-bold tracking-[-0.02em] text-center">
        {meta.targetRole} Assessment
      </h1>
      <p className="text-[15.5px] text-text-2 text-center mt-2.5 leading-relaxed max-w-[540px] mx-auto">
        {meta.organizationName} has invited you to complete this assessment. It helps them
        understand your strengths and how you work — there are no trick questions, and no single
        pass/fail score.
      </p>

      <div className="grid grid-cols-2 gap-3.5 my-7">
        {facts.map(([icon, label, value]) => (
          <div
            key={label}
            className="flex items-center gap-3.5 p-4 rounded-md bg-surface border border-border shadow-xs"
          >
            <span
              className="w-[38px] h-[38px] rounded-[10px] grid place-items-center flex-none"
              style={{ background: 'var(--indigo-50)', color: 'var(--indigo-500)' }}
            >
              <Icon path={icon} size={18} />
            </span>
            <div className="min-w-0">
              <div className="text-[11.5px] text-text-3 font-semibold uppercase">{label}</div>
              <div className="text-sm font-bold mt-0.5 truncate">{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* pause/resume info banner */}
      <div
        className="flex gap-2.5 items-start rounded-md p-4 mb-6"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
      >
        <Icon path={info} size={18} style={{ color: 'var(--indigo-500)', flexShrink: 0 }} />
        <div className="text-[13.5px] text-text-2 leading-relaxed">
          <strong className="text-text">You can pause and resume.</strong> Your progress saves
          automatically. Most sections aren’t timed; any timed section will be clearly flagged
          before it begins.
        </div>
      </div>

      <Button
        className="w-full"
        style={{ padding: '12px 22px', fontSize: 15 }}
        onClick={() => navigate(`/app/assessments/${assessmentId}/consent`)}
      >
        Continue to Consent <Icon path={arrowRight} size={16} />
      </Button>
    </FocusFrame>
  );
}
