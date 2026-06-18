// Coverage map (Spec 003 / FR-CA-013). Live domain/dimension/method counts + under-coverage warnings.
// Spec 012: parity with app/create_assessment3.jsx ReviewCoverage — stat cards, a Coverage Map +
// Question-Type Distribution two-column, and a governance CheckCard. Coverage is derived from the
// real selected set (no manual ± rebalance — that would edit coverage rather than reflect it).
import { Card, TrustBadge } from '@/components/ui';
import { Icon, layers, clock, assessment, target, alert, check } from '@/components/ui/icons';
import { DimensionBars } from '@/components/charts';
import { computeCoverage } from './coverage';
import type { JobRequirementsProfile, SelectedQuestion } from '@/models';

const METHOD_COLORS = [
  'var(--indigo-500)',
  'var(--amber-600)',
  'var(--teal-600)',
  'var(--violet-600)',
  'var(--rose-600)',
  'var(--indigo-300)',
];

export function CoverageMap({
  selected,
  profile,
}: {
  selected: SelectedQuestion[];
  profile?: JobRequirementsProfile;
}) {
  const report = computeCoverage(selected, profile);
  const dimBars = Object.entries(report.byDimension).map(([label, value]) => ({
    label,
    value: value * 25,
  }));
  const methodEntries = Object.entries(report.methodDistribution);
  const methodTotal = methodEntries.reduce((a, [, c]) => a + c, 0) || 1;
  const underCount = report.warnings.length;
  const coveredDims = Math.max(0, dimBars.length - underCount);
  const coveragePct = dimBars.length ? Math.round((coveredDims / dimBars.length) * 100) : 100;

  const stats: [string, string, string][] = [
    [assessment, 'Total questions', `${report.totalQuestions}`],
    [clock, 'Est. duration', `~${report.estimatedDurationMinutes} min`],
    [layers, 'Domain coverage', `${coveredDims} of ${dimBars.length}`],
    [target, 'Req. coverage', `${coveragePct}%`],
  ];

  return (
    <>
      {/* stat cards (design ReviewCoverage) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-5">
        {stats.map(([icon, label, value]) => {
          const warn = label === 'Req. coverage' && coveragePct < 100;
          return (
            <Card key={label}>
              <Icon
                path={icon}
                size={18}
                style={{ color: warn ? 'var(--amber-600)' : 'var(--indigo-500)' }}
              />
              <div
                className="text-2xl font-bold font-display mt-2.5"
                style={{ color: warn ? 'var(--amber-700)' : 'var(--text)' }}
              >
                {value}
              </div>
              <div className="text-xs text-text-3">{label}</div>
            </Card>
          );
        })}
      </div>

      {/* coverage map + question-type distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[18px]">
        <Card>
          <h3 className="text-[13.5px] font-bold mb-4">Coverage Map</h3>
          {dimBars.length > 0 ? (
            <DimensionBars data={dimBars} />
          ) : (
            <p className="text-[13px] text-text-3">No dimensions covered yet.</p>
          )}
          {report.warnings.length > 0 ? (
            <div
              className="flex gap-2 items-start rounded-md p-3 mt-3.5"
              style={{ background: 'var(--amber-50)', border: '1px solid var(--amber-100)' }}
            >
              <Icon
                path={alert}
                size={15}
                style={{ color: 'var(--amber-700)', flexShrink: 0, marginTop: 1 }}
              />
              <span className="text-xs leading-snug" style={{ color: 'var(--amber-700)' }}>
                {underCount} dimension{underCount > 1 ? 's are' : ' is'} below required coverage —
                add at least one governed item to each.
              </span>
            </div>
          ) : (
            <p className="text-[13px] text-teal-600 mt-3.5">All required dimensions are covered.</p>
          )}
        </Card>

        <Card>
          <h3 className="text-[13.5px] font-bold mb-4">Question-Type Distribution</h3>
          <div className="flex h-3.5 rounded-full overflow-hidden bg-track mb-4">
            {methodEntries.map(([m, c], i) => (
              <div
                key={m}
                style={{
                  width: `${(c / methodTotal) * 100}%`,
                  background: METHOD_COLORS[i % METHOD_COLORS.length],
                }}
              />
            ))}
          </div>
          {methodEntries.map(([m, c], i) => (
            <div key={m} className="flex items-center gap-2.5 mb-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-none"
                style={{ background: METHOD_COLORS[i % METHOD_COLORS.length] }}
              />
              <span className="flex-1 text-[12.5px] font-medium">{m}</span>
              <span className="tnum text-[12.5px] font-semibold text-text-3">{c}</span>
            </div>
          ))}
          <div className="flex gap-1.5 flex-wrap mt-3.5">
            <TrustBadge label="Governed bank" />
            <TrustBadge label="Scoring Logic Locked" />
          </div>
        </Card>
      </div>

      {/* governance check summary (design CheckCard) */}
      <Card className="mt-[18px]">
        <h3 className="text-[13.5px] font-bold mb-3">Pre-flight checks</h3>
        {(
          [
            ['Scoring coverage', 'All items governed & mapped'],
            ['Job-requirement coverage', `${coveredDims} of ${dimBars.length} dimensions`],
            ['Method balance', `${methodEntries.length} question types`],
          ] as [string, string][]
        ).map(([k, v]) => (
          <div key={k} className="flex items-center gap-2.5 text-[13px] mb-2">
            <Icon path={check} size={15} style={{ color: 'var(--teal-600)', flexShrink: 0 }} />
            <span className="flex-1 font-medium">{k}</span>
            <span className="text-text-3">{v}</span>
          </div>
        ))}
      </Card>
    </>
  );
}
