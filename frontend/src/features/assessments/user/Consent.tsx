// Consent (Spec 006 / US3 / FR-USR-005/006). Gates starting on the required current-use-case consent;
// only applicable consents are shown (the service seeds applicable ones only). Decline returns the User
// to the dashboard with a neutral message (no penalty language).
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Checkbox, Chip, EmptyState, Skeleton } from '@/components/ui';
import { Icon, shieldCheck } from '@/components/ui/icons';
import { FocusFrame } from '@/features/builderChrome';
import { useAsync, useToast } from '@/hooks';
import { consentService } from '@/services';
import type { ConsentRecord } from '@/models';

export function Consent() {
  const { assessmentId = '' } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, loading, error, reload } = useAsync<ConsentRecord[]>(
    () => consentService.forAssessment(assessmentId),
    [assessmentId],
  );
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);

  if (loading) return <Skeleton height={200} />;
  if (error)
    return (
      <Card>
        <p className="text-rose-600 mb-2.5">Couldn’t load consent details.</p>
        <Button variant="secondary" onClick={reload}>
          Retry
        </Button>
      </Card>
    );
  if (!data || data.length === 0)
    return (
      <Card>
        <EmptyState title="No consent required" sub="You can begin this assessment directly." />
        <Button
          className="mt-3"
          onClick={() => navigate(`/app/assessments/${assessmentId}/instructions`)}
        >
          Continue
        </Button>
      </Card>
    );

  const required = data.filter((c) => c.required);
  const optional = data.filter((c) => !c.required);
  const allRequiredChecked = required.every((c) => checked[c.id]);

  const accept = async () => {
    setBusy(true);
    await Promise.all(data.filter((c) => checked[c.id]).map((c) => consentService.accept(c.id)));
    setBusy(false);
    navigate(`/app/assessments/${assessmentId}/instructions`);
  };

  const decline = async () => {
    setBusy(true);
    await Promise.all(required.map((c) => consentService.decline(c.id)));
    setBusy(false);
    toast('No problem — you can return to this any time.', 'info');
    navigate('/app/dashboard');
  };

  const renderConsent = (c: ConsentRecord) => {
    const on = !!checked[c.id];
    return (
      <Card
        key={c.id}
        className="mb-3"
        // Card highlights teal once agreed (design parity); computed from state.
        style={on ? { borderColor: 'var(--teal-100)', background: 'var(--teal-50)' } : undefined}
      >
        <div className="flex gap-2 items-center mb-1.5">
          <strong className="text-[15px]">{c.label}</strong>
          <Chip tone={c.required ? 'indigo' : 'slate'}>{c.required ? 'Required' : 'Optional'}</Chip>
        </div>
        <p className="text-sm text-text-2 mb-2.5">{c.informedText}</p>
        <Checkbox
          checked={on}
          onChange={(v) => setChecked((s) => ({ ...s, [c.id]: v }))}
          label={c.required ? 'I consent (required to continue)' : 'I agree (optional)'}
        />
      </Card>
    );
  };

  return (
    <FocusFrame label="Step 2 of 3" max={640} onExit={() => navigate('/app/dashboard')}>
      {/* centered shield header (design parity) */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <span
            className="w-14 h-14 rounded-[15px] grid place-items-center"
            style={{ background: 'var(--teal-50)', color: 'var(--teal-600)' }}
          >
            <Icon path={shieldCheck} size={26} />
          </span>
        </div>
        <h1 className="text-[26px] font-bold">Your consent</h1>
        <p className="text-[15px] text-text-2 mt-2 leading-relaxed">
          Please review how your assessment will be used. This consent is specific to this
          assessment.
        </p>
      </div>

      {required.map(renderConsent)}
      {optional.length > 0 && (
        <>
          <h2 className="text-sm text-text-3 my-2">Optional</h2>
          {optional.map(renderConsent)}
        </>
      )}
      <div className="flex gap-2.5 mt-2">
        <Button variant="ghost" onClick={decline} disabled={busy}>
          Decline
        </Button>
        <div className="flex-1" />
        <Button onClick={accept} disabled={!allRequiredChecked || busy}>
          Accept and Continue
        </Button>
      </div>
    </FocusFrame>
  );
}
