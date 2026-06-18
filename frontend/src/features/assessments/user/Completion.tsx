// Completion (Spec 006 / US1 / FR-USR-012). Confirmation + next steps — no score. Spec 012:
// parity with project/app/user_assessment.jsx Completion — full-screen radial-gradient celebration,
// pulsing check badge, and a processing→confirmed status card. Infinite pulse/spin animations are
// zeroed by the global prefers-reduced-motion rule (constitution XII); no score is ever shown.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '@/components/ui';
import { Icon, check, reports as reportsIcon, dashboard } from '@/components/ui/icons';
import { useSession } from '@/hooks';

export function Completion() {
  const navigate = useNavigate();
  const { session } = useSession();
  const first = session?.name?.split(' ')[0];
  const [phase, setPhase] = useState<'processing' | 'confirmed'>('processing');

  useEffect(() => {
    const t = setTimeout(() => setPhase('confirmed'), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: 'radial-gradient(circle at 50% 30%, var(--tone-indigo-bg), var(--canvas) 60%)',
      }}
    >
      <div
        className="text-center max-w-[480px]"
        style={{ animation: 'nx-fade-up .5s var(--ease-out) both' }}
      >
        {/* celebratory check badge with a pulsing ring */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ background: 'var(--teal-50)', animation: 'nx-pulse 2s infinite' }}
          />
          <span
            className="absolute inset-0 rounded-full grid place-items-center"
            style={{
              background: 'var(--teal-600)',
              boxShadow: '0 12px 32px -8px rgba(13,148,136,.5)',
            }}
          >
            <Icon
              path={check}
              size={48}
              stroke={2.4}
              style={{ color: '#fff', animation: 'nx-check-pop .5s var(--ease-out) .2s both' }}
            />
          </span>
        </div>

        <h1 className="text-[30px] font-bold tracking-[-0.02em]">
          All done{first ? `, ${first}` : ''}!
        </h1>
        <p className="text-base text-text-2 mt-3 leading-relaxed">
          Thank you for completing your assessment. Your responses have been submitted securely.
        </p>

        {/* processing → confirmed status card */}
        <Card className="mt-6 flex items-center gap-3.5 text-start">
          {phase === 'processing' ? (
            <span
              aria-hidden
              className="w-9 h-9 flex-none rounded-full"
              style={{
                border: '3px solid var(--indigo-100)',
                borderTopColor: 'var(--indigo-500)',
                animation: 'nx-spin .8s linear infinite',
              }}
            />
          ) : (
            <span
              className="w-9 h-9 rounded-[10px] grid place-items-center flex-none"
              style={{ background: 'var(--indigo-50)', color: 'var(--indigo-500)' }}
            >
              <Icon path={reportsIcon} size={18} />
            </span>
          )}
          <div>
            <div className="text-sm font-bold">
              {phase === 'processing' ? 'Your report is being prepared' : 'Submission confirmed'}
            </div>
            <div className="text-[12.5px] text-text-3 mt-0.5">
              {phase === 'processing'
                ? 'Your organization will be notified when it is ready.'
                : 'You won’t see a score here — results are reviewed before anything is shared, and any report will appear under My Reports.'}
            </div>
          </div>
        </Card>

        <div className="flex justify-center mt-7">
          <Button
            icon={dashboard}
            style={{ padding: '12px 22px', fontSize: 15 }}
            onClick={() => navigate('/app/dashboard')}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
