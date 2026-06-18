// User-safe preview (US3 / FR-RPT-004). Shows exactly the User projection — supportive content only,
// all restricted/internal/blocked fields stripped (via reportService.getUserSafe → toUserSafe).
// Spec 012: parity with project/app/report_detail.jsx candidateView — a "candidate-safe preview"
// admin banner above the same supportive cards the candidate sees (UserReport). No scores/identity.
import { useParams } from 'react-router-dom';
import { Button, Card, Chip, EmptyState, Skeleton } from '@/components/ui';
import { Icon, eye, star, trending, info, download } from '@/components/ui/icons';
import { StaggerRows } from '@/components/motion';
import { PageHeader } from '@/features/placeholder';
import { useAsync, useToast } from '@/hooks';
import { reportService } from '@/services';
import type { ReportInsight, UserSafeReport } from '@/models';

export function UserSafePreview() {
  const { reportId = '' } = useParams();
  const { toast } = useToast();
  const { data, loading, error, reload } = useAsync<UserSafeReport | undefined>(
    () => reportService.getUserSafe(reportId),
    [reportId],
  );

  if (loading) return <Skeleton height={180} />;
  if (error)
    return (
      <Card>
        <p className="text-rose-600 mb-2.5">Failed to load preview.</p>
        <Button variant="secondary" onClick={reload}>
          Retry
        </Button>
      </Card>
    );
  if (!data)
    return (
      <Card>
        <EmptyState title="Report not found" />
      </Card>
    );
  const r = data;

  return (
    <div>
      <PageHeader
        title="User-safe Preview"
        sub="Exactly what the candidate sees"
        actions={
          <Button
            variant="secondary"
            icon={download}
            onClick={() =>
              reportService.downloadPdf(r.id).then(() => toast('PDF prepared', 'success'))
            }
          >
            Download PDF
          </Button>
        }
      />

      {/* candidate-safe banner (design report_detail.jsx candidateView) */}
      <div
        className="flex gap-2.5 p-4 rounded-md mb-[18px]"
        style={{ background: 'var(--indigo-50)', border: '1px solid var(--indigo-100)' }}
      >
        <Icon path={eye} size={17} style={{ color: 'var(--indigo-600)', flexShrink: 0 }} />
        <div className="text-[13px] leading-relaxed" style={{ color: 'var(--indigo-700)' }}>
          <strong>Candidate-safe preview.</strong> Internal scoring formulas, raw governance flags,
          restricted metrics and blocked outputs are hidden — this is exactly what the candidate
          sees.
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
              These reflect patterns from the candidate’s responses, not fixed traits — and this
              feedback is one input for development, not a decision.
            </span>
          </div>
        </Card>
      </StaggerRows>
    </div>
  );
}
