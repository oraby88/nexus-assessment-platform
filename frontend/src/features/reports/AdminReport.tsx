// Admin Report (US1 / FR-RPT-002). Sections render via computed visibility; blocked/omitted shown
// as explanations (never values); disclaimer + version footer always present.
// Spec 012 (T017): brought to visual parity with project/app/report_detail.jsx — dark hero banner +
// KPI row, sectioned surface cards, tinted strengths/development grids, iconified dimensions, numbered
// interview prompts, two-column limitations, meta cards. Governance projection is preserved (the design
// mock has none); the user-safe preview route, Domain6Section and the version-footer disclaimer stay.
import { useState, type ReactNode } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Card,
  Button,
  Avatar,
  StatusBadge,
  ConfidenceChip,
  Chip,
  ScoreBar,
  EmptyState,
  Skeleton,
} from '@/components/ui';
import { Icon, eye, download, star, trending, check, info, lock } from '@/components/ui/icons';
import { StaggerRows } from '@/components/motion';
import { PageHeader } from '@/features/placeholder';
import { Domain6Section } from './Domain6Section';
import { projectReport } from './projectReport';
import { useAsync, useToast } from '@/hooks';
import {
  reportService,
  participantService,
  roleBlueprintService,
  contextProfileService,
} from '@/services';
import type { ContextProfile, Participant, Report, RoleBlueprint } from '@/models';

// Decorative per-domain dot colors (cycled by index — matches the design's colored domain markers
// without inventing a domain→color contract; tokens added in T003).
const DOMAIN_DOTS = [
  'var(--indigo-500)',
  'var(--teal-600)',
  'var(--amber-600)',
  'var(--rose-600)',
  'var(--indigo-300)',
  'var(--teal-700)',
];

/** Sectioned surface card with a title row + optional badge (design `Sec`). `id` is the
 *  in-page anchor target for the section-nav; scroll-margin offsets the sticky topbar. */
function Sec({
  id,
  title,
  badge,
  children,
}: {
  id?: string;
  title: string;
  badge?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card id={id} className="mb-4 scroll-mt-[84px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[17px] font-bold tracking-[-0.01em]">{title}</h2>
        {badge}
      </div>
      {children}
    </Card>
  );
}

export function AdminReport() {
  const { reportId = '' } = useParams();
  const { toast } = useToast();
  const { data, loading, error, reload } = useAsync<Report | undefined>(
    () => reportService.getAdmin(reportId),
    [reportId],
  );
  const { data: people } = useAsync<Participant[]>(() => participantService.list(), []);
  const { data: blueprints } = useAsync<RoleBlueprint[]>(() => roleBlueprintService.list(), []);
  const { data: contexts } = useAsync<ContextProfile[]>(() => contextProfileService.list(), []);
  const [activeSec, setActiveSec] = useState('summary');

  if (loading) return <Skeleton height={200} />;
  if (error)
    return (
      <Card>
        <p className="text-rose-600 mb-2.5">Failed to load report.</p>
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

  if (r.status === 'Processing' || r.status === 'Unavailable') {
    return (
      <div>
        <PageHeader title={`Report ${r.id}`} sub={r.targetRole} />
        <Card>
          <EmptyState title={`Report ${r.status}`} sub="This report is not yet available." />
        </Card>
      </div>
    );
  }

  const projected = projectReport(r, { audience: 'admin', useCase: r.useCase });

  // Resolve a strength/area insight's dimension name + score from the projected domains (real data —
  // ReportInsight carries only dimensionId + text).
  const dimById = new Map(
    projected.domains.flatMap((dom) => dom.dimensions.map((d) => [d.dimensionId, d] as const)),
  );

  // Admin view shows the candidate identity (resolved from the real participant list).
  const candidateName =
    (people ?? []).find((p) => p.id === r.participantId)?.fullName ?? r.targetRole;

  // Meta cards (design: Blueprint + status, Context Profile + status, Version) — names + real
  // statuses resolved from the services; raw id is the fallback while they load.
  const bp = (blueprints ?? []).find((b) => b.id === r.blueprintId);
  const ctx = (contexts ?? []).find((c) => c.id === r.contextProfileId);
  const metaCards: { label: string; value: string; status?: string }[] = [
    {
      label: 'Blueprint',
      value: bp
        ? `${bp.name}${r.blueprintVersion ? ` v${r.blueprintVersion}` : ''}`
        : (r.blueprintId ?? '—'),
      status: bp?.status,
    },
    {
      label: 'Context Profile',
      value: ctx
        ? `${ctx.name}${r.contextVersion ? ` v${r.contextVersion}` : ''}`
        : (r.contextProfileId ?? '—'),
      status: ctx?.status,
    },
    {
      label: 'Version',
      value: `${r.scoringVersion ?? '—'} · ${r.synthesisWeightVersion ?? '—'}`,
    },
  ];

  // Candidate Summary highlights (design summary section) — derived from real strengths/areas/domains.
  const strengthDims = (r.strengths ?? [])
    .map((s) => (s.dimensionId ? dimById.get(s.dimensionId) : undefined))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));
  const sigStrength = [...strengthDims].sort((a, b) => b.score - a.score)[0];
  const cogDomain = projected.domains.find((d) => /cogn/i.test(d.label));
  const cogPool = (
    cogDomain ? cogDomain.dimensions : projected.domains.flatMap((d) => d.dimensions)
  ).filter((d) => d.visibility !== 'blocked' && d.visibility !== 'hidden');
  const topCognitive = [...cogPool].sort((a, b) => b.score - a.score)[0];
  const stretchInsight = (r.areasToExplore ?? [])[0];
  const primaryStretch = stretchInsight?.dimensionId
    ? dimById.get(stretchInsight.dimensionId)
    : undefined;
  const summaryStats: [string, string][] = [
    ['Signature strength', sigStrength?.dimensionName ?? '—'],
    ['Top cognitive', topCognitive?.dimensionName ?? '—'],
    ['Primary stretch', primaryStretch?.dimensionName ?? stretchInsight?.text ?? '—'],
  ];
  const summaryLead = sigStrength
    ? `${candidateName.split(' ')[0]} shows the strongest measured signal in ${sigStrength.dimensionName}` +
      (primaryStretch
        ? `, with ${primaryStretch.dimensionName} as the primary development area.`
        : '.')
    : null;

  // Section-nav rail (design nx-secnav) — only the sections actually rendered for this report.
  const navSections: { id: string; label: string }[] = [
    { id: 'summary', label: 'Summary' },
    { id: 'strengths', label: 'Strengths' },
    { id: 'development', label: 'Development' },
    { id: 'dimensions', label: 'Measured Dimensions' },
    ...(r.domain6 ? [{ id: 'domain6', label: 'Domain 6 · Contextual Alignment' }] : []),
    ...((r.interviewPrompts ?? []).length > 0
      ? [{ id: 'interview', label: 'Interview Prompts' }]
      : []),
    { id: 'confidence', label: 'Confidence & Limitations' },
    { id: 'meta', label: 'Blueprint & Version' },
  ];
  const goToSection = (id: string) => {
    setActiveSec(id);
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  // Hero KPI row — only fields the report actually carries (no fabricated duration).
  const heroKpis: [string, string][] = [
    ['Confidence', r.confidence],
    ...(r.domain6?.cai != null
      ? ([['Contextual Alignment', `${r.domain6.cai} / 100`]] as [string, string][])
      : []),
    ['Scoring', r.scoringVersion ?? '—'],
  ];

  async function downloadPdf() {
    await reportService.downloadPdf(r.id);
    toast('PDF prepared', 'success', 'An export-history entry was created.');
  }

  return (
    <div>
      {/* Hero banner (design report header) */}
      <div
        className="relative overflow-hidden rounded-xl mb-5 px-7 py-6 text-white"
        style={{ background: 'linear-gradient(135deg,#11141B 0%,#1E2840 100%)' }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            background: 'radial-gradient(circle at 88% 10%,rgba(79,70,229,.4),transparent 45%)',
          }}
        />
        <div className="relative flex items-start justify-between gap-5 flex-wrap">
          <div className="flex gap-[18px]">
            <Avatar name={candidateName} size={60} />
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="font-mono text-[11.5px]" style={{ color: 'var(--indigo-300)' }}>
                  {r.id}
                </span>
                <StatusBadge status={r.status} />
              </div>
              <h1 className="text-[26px] font-bold text-white">{candidateName}</h1>
              <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,.62)' }}>
                {r.targetRole} · {r.useCase} · Completed {r.completedAt}
              </div>
            </div>
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <Link to={`/admin/reports/${r.id}/user-preview`}>
              <Button
                variant="secondary"
                icon={eye}
                style={{
                  background: 'rgba(255,255,255,.1)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,.18)',
                }}
              >
                Preview Candidate View
              </Button>
            </Link>
            <Button icon={download} onClick={downloadPdf}>
              Download PDF
            </Button>
          </div>
        </div>
        {/* header KPIs */}
        <div className="relative flex gap-7 mt-[22px] flex-wrap">
          {heroKpis.map(([label, value]) => (
            <div key={label}>
              <div
                className="text-[11px] font-semibold uppercase tracking-[0.04em]"
                style={{ color: 'rgba(255,255,255,.5)' }}
              >
                {label}
              </div>
              <div className="text-lg font-bold mt-[3px]">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[208px_1fr] gap-6 items-start">
        {/* section-nav rail (design nx-secnav) */}
        <nav className="hidden lg:flex flex-col gap-0.5 sticky top-[84px]">
          {navSections.map((s) => {
            const on = activeSec === s.id;
            return (
              <button
                key={s.id}
                onClick={() => goToSection(s.id)}
                className="text-start px-3 py-2 rounded-sm text-[12.5px] transition-colors"
                style={{
                  fontWeight: on ? 700 : 500,
                  color: on ? 'var(--indigo-700)' : 'var(--text-2)',
                  background: on ? 'var(--indigo-50)' : 'transparent',
                }}
              >
                {s.label}
              </button>
            );
          })}
        </nav>

        <div className="min-w-0">
          <StaggerRows stepMs={60}>
            {/* Candidate Summary — derived highlights (design summary section) */}
            <Sec id="summary" title="Candidate Summary">
              {summaryLead && (
                <p className="text-[15px] leading-relaxed text-text">{summaryLead}</p>
              )}
              <div className="flex gap-6 mt-[18px] flex-wrap">
                {summaryStats.map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[11px] text-text-3 font-semibold uppercase">{k}</div>
                    <div className="text-sm font-bold mt-[3px] text-indigo-700">{v}</div>
                  </div>
                ))}
              </div>
            </Sec>

            {/* Core Strengths — tinted teal card grid */}
            <Sec id="strengths" title="Core Strengths">
              {(r.strengths ?? []).length === 0 ? (
                <EmptyState title="No strengths recorded" />
              ) : (
                <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {(r.strengths ?? []).map((s, i) => {
                    const dim = s.dimensionId ? dimById.get(s.dimensionId) : undefined;
                    return (
                      <div
                        key={i}
                        className="rounded-md p-4"
                        style={{
                          background: 'var(--teal-50)',
                          border: '1px solid var(--teal-100)',
                        }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <Icon path={star} size={16} style={{ color: 'var(--teal-600)' }} />
                          {dim && (
                            <span
                              className="text-xl font-bold"
                              style={{
                                color: 'var(--teal-700)',
                                fontFamily: 'var(--font-display)',
                              }}
                            >
                              {dim.score}
                            </span>
                          )}
                        </div>
                        {dim && <div className="text-[13.5px] font-bold">{dim.dimensionName}</div>}
                        <p className="text-[12.5px] text-text-2 mt-1.5 leading-relaxed">{s.text}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Sec>

            {/* Development Areas — tinted surface card grid */}
            <Sec id="development" title="Development Areas">
              {(r.areasToExplore ?? []).length === 0 ? (
                <EmptyState title="No development areas recorded" />
              ) : (
                <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
                  {(r.areasToExplore ?? []).map((s, i) => {
                    const dim = s.dimensionId ? dimById.get(s.dimensionId) : undefined;
                    return (
                      <div
                        key={i}
                        className="rounded-md p-4"
                        style={{
                          background: 'var(--surface-2)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <Icon path={trending} size={16} style={{ color: 'var(--amber-600)' }} />
                          {dim && (
                            <span
                              className="text-xl font-bold"
                              style={{
                                color: 'var(--amber-700)',
                                fontFamily: 'var(--font-display)',
                              }}
                            >
                              {dim.score}
                            </span>
                          )}
                        </div>
                        {dim && <div className="text-[13.5px] font-bold">{dim.dimensionName}</div>}
                        <p className="text-[12.5px] text-text-2 mt-1.5 leading-relaxed">{s.text}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Sec>

            {/* Measured Dimensions — governance projection preserved, styled per design */}
            <Sec id="dimensions" title="Measured Dimensions">
              <div className="flex flex-col gap-[22px]">
                {projected.domains.map((dom, di) => {
                  const domColor = DOMAIN_DOTS[di % DOMAIN_DOTS.length];
                  return (
                    <div key={dom.domainId}>
                      <div className="flex items-center gap-2.5 mb-3.5">
                        <span
                          className="w-2.5 h-2.5 rounded-[3px]"
                          style={{ background: domColor }}
                        />
                        <span className="mono text-[11px] font-bold text-text-3">
                          {dom.domainId}
                        </span>
                        <span className="text-sm font-bold">{dom.label}</span>
                      </div>
                      <div className="flex flex-col gap-[11px]">
                        {dom.dimensions.map((d) => {
                          if (d.visibility === 'hidden' || d.visibility === 'not_generated')
                            return null;
                          if (d.visibility === 'blocked') {
                            return (
                              <div key={d.dimensionId} className="text-[13px] text-text-3">
                                {d.dimensionName}: omitted (blocked output)
                              </div>
                            );
                          }
                          return (
                            <div key={d.dimensionId} className="flex items-center gap-3.5">
                              <span className="w-[180px] text-[13px] font-medium flex-none">
                                {d.dimensionName}
                              </span>
                              <div className="flex-1">
                                <ScoreBar
                                  value={d.score}
                                  label={d.dimensionName}
                                  color={domColor}
                                />
                              </div>
                              <span className="tnum text-[13.5px] font-bold w-[30px] text-right">
                                {d.score}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <ConfidenceChip band={d.confidence} />
                                {d.visibility === 'visible_with_caution' && (
                                  <Chip tone="amber">caution</Chip>
                                )}
                                {d.visibility === 'downgraded' && (
                                  <Chip tone="slate">downgraded</Chip>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Sec>

            {r.domain6 && (
              <div id="domain6" className="mb-4 scroll-mt-[84px]">
                <Domain6Section d6={r.domain6} />
              </div>
            )}

            {/* Structured Interview Prompts — numbered badge cards */}
            {(r.interviewPrompts ?? []).length > 0 && (
              <Sec id="interview" title="Structured Interview Prompts">
                <p className="text-[13px] text-text-2 mb-3.5">
                  Evidence-based prompts to probe stretch areas in a structured interview. These
                  support — never replace — human judgement.
                </p>
                <div className="flex flex-col gap-3">
                  {(r.interviewPrompts ?? []).map((p, i) => (
                    <div
                      key={i}
                      className="flex gap-3.5 p-4 rounded-md"
                      style={{
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border-soft)',
                      }}
                    >
                      <div
                        className="w-[30px] h-[30px] rounded-[8px] flex-none grid place-items-center font-bold"
                        style={{
                          background: 'var(--indigo-100)',
                          color: 'var(--indigo-600)',
                          fontFamily: 'var(--font-display)',
                        }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        {p.dimensionId && dimById.get(p.dimensionId) && (
                          <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.04em]">
                            {dimById.get(p.dimensionId)!.dimensionName}
                          </div>
                        )}
                        <p className="text-sm leading-normal mt-1">{p.question}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Sec>
            )}

            {/* Confidence Summary & Limitations — two columns */}
            <Sec id="confidence" title="Confidence Summary & Limitations">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div
                  className="rounded-md p-4"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  <div className="text-[12.5px] font-bold mb-2.5">Report Limitations</div>
                  {(r.limitations ?? []).map((l, i) => (
                    <div
                      key={i}
                      className="flex gap-2 text-[12.5px] mb-2.5 text-text-2 leading-snug"
                    >
                      <Icon
                        path={info}
                        size={14}
                        style={{ color: 'var(--text-3)', flexShrink: 0, marginTop: 1 }}
                      />
                      {l}
                    </div>
                  ))}
                </div>
                <div
                  className="rounded-md p-4"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  <div className="text-[12.5px] font-bold mb-2.5">Omitted Sections</div>
                  {r.omittedSections.map((o, i) => (
                    <div
                      key={i}
                      className="flex gap-2 text-[12.5px] mb-2.5 text-text-2 leading-snug"
                    >
                      <Icon
                        path={lock}
                        size={14}
                        style={{ color: 'var(--rose-600)', flexShrink: 0, marginTop: 1 }}
                      />
                      <div>
                        <strong>{o.name}.</strong> {o.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Sec>

            {/* Blueprint, Context & Version — meta card grid */}
            <Sec id="meta" title="Blueprint, Context & Version">
              <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-3">
                {metaCards.map(({ label, value, status }) => (
                  <div
                    key={label}
                    className="rounded-md p-4"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--sh-sm)',
                    }}
                  >
                    <div className="text-[11px] text-text-3 font-semibold uppercase">{label}</div>
                    <div className="text-sm font-bold mt-1.5 break-words">{value}</div>
                    {status && (
                      <div className="mt-2">
                        <StatusBadge status={status} size="sm" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Sec>

            {/* Version footer + no-automatic-decision disclaimer — always present (FR-RPT-002). */}
            <Card className="text-xs text-text-3">
              <div className="flex items-center gap-1.5">
                <Icon path={check} size={13} style={{ color: 'var(--teal-600)' }} />
                Scoring {r.scoringVersion ?? '—'} · Synthesis {r.synthesisWeightVersion ?? '—'}
              </div>
              <p className="mt-2 text-text-2">
                This report is one input among many and requires human review. It does not produce
                an automatic hire/reject decision.
              </p>
            </Card>
          </StaggerRows>
        </div>
      </div>
    </div>
  );
}
