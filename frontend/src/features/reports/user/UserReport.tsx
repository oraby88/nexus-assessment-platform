// User Report (Spec 006 / US5 / FR-USR-013/018). Built SOLELY from the Spec 005 user-safe projection
// (reportService.getUserSafe) — supportive content only; no restricted/internal/blocked fields, no
// hire/reject language (constitution IX). Simulated PDF via the same projection.
// Spec 012 (T023): visual parity with project/app/user_assessment.jsx UserReport — supportive indigo
// hero + strengths/growth cards + a "Working context" block. The design's numeric "friendly bars"
// are intentionally NOT ported (the user-safe projection carries no dimension scores — Spec 005).
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Chip, EmptyState, Skeleton } from '@/components/ui';
import { Icon, arrowLeft, star, trending, download, info } from '@/components/ui/icons';
import { StaggerRows } from '@/components/motion';
import { useAsync, useToast } from '@/hooks';
import { reportService } from '@/services';
import type { ReportInsight, UserSafeReport } from '@/models';

export function UserReport() {
  const { reportId = '' } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, loading, error, reload } = useAsync<UserSafeReport | undefined>(
    () => reportService.getUserSafe(reportId),
    [reportId],
  );

  if (loading) return <Skeleton height={200} />;
  if (error)
    return (
      <Card>
        <p className="text-rose-600 mb-2.5">Couldn’t load your report.</p>
        <Button variant="secondary" onClick={reload}>
          Retry
        </Button>
      </Card>
    );
  if (!data)
    return (
      <Card>
        <EmptyState title="Report not found" />
        <Button className="mt-3" variant="secondary" onClick={() => navigate('/app/reports')}>
          Back to My Reports
        </Button>
      </Card>
    );
  const r = data;

  return (
    <div className="max-w-[760px] mx-auto">
      <button
        onClick={() => navigate('/app/reports')}
        className="flex items-center gap-1.5 text-[13px] font-semibold text-text-3 mb-4"
      >
        <Icon path={arrowLeft} size={15} /> My Reports
      </button>

      {/* supportive indigo hero */}
      <div
        className="relative overflow-hidden rounded-xl mb-5 px-8 py-7 text-white"
        style={{ background: 'linear-gradient(135deg,#4338CA,#3730A3)' }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-50"
          style={{
            background: 'radial-gradient(circle at 90% 10%,rgba(255,255,255,.18),transparent 45%)',
          }}
        />
        <div className="relative">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-[3px] text-xs font-semibold"
            style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }}
          >
            Your results
          </span>
          <h1 className="text-[28px] font-bold text-white mt-3">Your Strengths &amp; Growth</h1>
          <p
            className="text-[15px] mt-2 leading-relaxed max-w-[520px]"
            style={{ color: 'rgba(255,255,255,.78)' }}
          >
            This report highlights what you do well and the areas you can build on. It’s written to
            support your development — not to label you.
          </p>
        </div>
      </div>

      <StaggerRows stepMs={60}>
        <Card className="mb-4">
          <h2 className="text-lg font-bold mb-3.5">Your strengths</h2>
          <div className="flex flex-col gap-3">
            {r.strengths.map((s: ReportInsight, i) => (
              <div
                key={i}
                className="flex gap-3.5 p-4 rounded-md"
                style={{ background: 'var(--teal-50)' }}
              >
                <span
                  className="w-10 h-10 rounded-[10px] grid place-items-center flex-none"
                  style={{ background: 'var(--teal-600)', color: '#fff' }}
                >
                  <Icon path={star} size={19} />
                </span>
                <p className="text-[13.5px] text-text-2 leading-relaxed self-center">{s.text}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="mb-4">
          <h2 className="text-lg font-bold mb-3.5">Where you can grow</h2>
          <div className="flex flex-col gap-3">
            {r.areasToExplore.map((s: ReportInsight, i) => (
              <div
                key={i}
                className="flex gap-3.5 p-4 rounded-md"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
              >
                <span
                  className="w-10 h-10 rounded-[10px] grid place-items-center flex-none"
                  style={{ background: 'var(--indigo-100)', color: 'var(--indigo-600)' }}
                >
                  <Icon path={trending} size={19} />
                </span>
                <p className="text-[13.5px] text-text-2 leading-relaxed self-center">{s.text}</p>
              </div>
            ))}
          </div>
        </Card>

        {r.domain6Summary && (
          <Card className="mb-4">
            <h2 className="text-lg font-bold mb-2">Working context</h2>
            {r.domain6Summary.alignmentBand && (
              <Chip tone="indigo">{r.domain6Summary.alignmentBand}</Chip>
            )}
            {r.domain6Summary.narrative && (
              <p className="text-sm mt-2 leading-relaxed">{r.domain6Summary.narrative}</p>
            )}
          </Card>
        )}

        <Card className="text-[13px] text-text-2">
          <h2 className="text-base font-bold mb-2">Things to keep in mind</h2>
          <ul className="ps-[18px] grid gap-1.5">
            {r.limitations.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
          <div
            className="flex gap-2 items-start mt-3 p-3 rounded-md"
            style={{ background: 'var(--indigo-50)' }}
          >
            <Icon path={info} size={15} style={{ color: 'var(--indigo-600)', flexShrink: 0 }} />
            <span className="text-[12.5px] leading-relaxed" style={{ color: 'var(--indigo-700)' }}>
              These reflect patterns from your responses, not fixed traits — and this feedback is
              one input for your development and reflection, not a decision about you.
            </span>
          </div>
        </Card>

        {/* Download (design: centered, large, at the bottom) */}
        <div className="flex justify-center mt-2">
          <Button
            icon={download}
            style={{ padding: '12px 22px', fontSize: 15 }}
            onClick={() =>
              reportService.downloadPdf(r.id).then(() => toast('PDF prepared', 'success'))
            }
          >
            Download my report (PDF)
          </Button>
        </div>
      </StaggerRows>
    </div>
  );
}
