// User / Candidate detail (US1 / FR-ADM-005). Spec 012 T033: parity with app/admin_candidates.jsx
// CandidateDetail — identity card (avatar + KV strip + status) + tabbed sections (Overview / Active /
// History / Reports / Consent / Timeline) with progress-Ring assessment rows. Real participant data.
import { useState } from 'react';
import type { ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Tabs,
  StatusBadge,
  Ring,
  Chip,
  EmptyState,
  Skeleton,
  Button,
  Card,
  Avatar,
} from '@/components/ui';
import {
  Icon,
  compare,
  sparkles,
  reports as reportsIcon,
  shieldCheck,
} from '@/components/ui/icons';
import { PageHeader } from '@/features/placeholder';
import { useAsync } from '@/hooks';
import { participantService, consentService } from '@/services';
import type { AssessmentAssignment, ConsentRecord, Participant } from '@/models';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'active', label: 'Active Assessments' },
  { id: 'history', label: 'Assessment History' },
  { id: 'reports', label: 'Reports' },
  { id: 'consent', label: 'Consent' },
  { id: 'timeline', label: 'Timeline' },
];

const RELEASED = ['Released', 'Released with Caution', 'Partial Release'];

function DetailCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <h3 className="text-sm font-bold mb-3.5">{title}</h3>
      {children}
    </Card>
  );
}

function Muted({ text }: { text: string }) {
  return <p className="text-[13px] text-text-3 py-2">{text}</p>;
}

function AsmRow({ a, onOpen }: { a: AssessmentAssignment; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="flex items-center gap-3 w-full text-start p-3 rounded-md border border-border-soft mb-2 bg-surface hover:bg-surface-2"
    >
      <Ring value={a.progressPercent} size={40} />
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-semibold">{a.targetRole}</div>
        <div className="text-xs text-text-3">
          {a.useCase.replace('_', ' ')}
          {a.deadline ? ` · due ${a.deadline}` : ''}
        </div>
      </div>
      <StatusBadge status={a.lifecycleStatus} />
    </button>
  );
}

export function UserDetail() {
  const { participantId = '' } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const {
    data: person,
    loading,
    error,
    reload,
  } = useAsync<Participant | undefined>(
    () => participantService.get(participantId),
    [participantId],
  );
  const { data: history } = useAsync<AssessmentAssignment[]>(
    () => participantService.history(participantId),
    [participantId],
  );
  const { data: consents } = useAsync<ConsentRecord[]>(
    () => consentService.forParticipant(participantId),
    [participantId, tab],
  );

  if (loading) return <Skeleton height={160} />;
  if (error)
    return (
      <Card>
        <p className="text-rose-600 mb-2.5">Failed to load user.</p>
        <Button variant="secondary" onClick={reload}>
          Retry
        </Button>
      </Card>
    );
  if (!person)
    return (
      <Card>
        <EmptyState title="User not found" />
      </Card>
    );

  const assignments = history ?? [];
  const active = assignments.filter(
    (a) => !['Completed', 'Cancelled', 'Expired'].includes(a.lifecycleStatus),
  );
  const released = assignments.filter((a) => RELEASED.includes(a.reportStatus ?? ''));

  const facts: [string, string][] = [
    ['Email', person.email],
    ['Current Role', person.currentJobTitle ?? '—'],
    ['Target Role', person.targetJobTitle ?? '—'],
    ['Job Level', person.jobLevel],
    ['Department', person.departmentText ?? '—'],
    ['Date Added', person.dateAdded],
  ];

  return (
    <div>
      <PageHeader
        title={person.fullName}
        sub={`${person.currentJobTitle ?? '—'} → ${person.targetJobTitle ?? '—'}${
          person.departmentText ? ` · ${person.departmentText}` : ''
        }`}
        actions={
          <>
            <Button
              variant="secondary"
              icon={compare}
              onClick={() => navigate('/admin/comparison')}
            >
              Add to Comparison
            </Button>
            <Button icon={sparkles} onClick={() => navigate('/admin/assessments/new')}>
              Assign Assessment
            </Button>
          </>
        }
      />

      {/* identity card */}
      <Card className="mb-5 flex items-center gap-5 flex-wrap">
        <Avatar name={person.fullName} size={64} ring />
        <div className="flex gap-x-8 gap-y-3 flex-wrap">
          {facts.map(([k, v]) => (
            <div key={k}>
              <div className="text-[11.5px] text-text-3 font-semibold uppercase tracking-[0.04em]">
                {k}
              </div>
              <div className="text-sm font-semibold mt-0.5">{v}</div>
            </div>
          ))}
        </div>
        <div className="flex-1" />
        <div className="text-right">
          <StatusBadge status={person.latestAssessmentLifecycle ?? 'Not Started'} />
          <div className="text-xs text-text-3 mt-1.5">
            {person.totalAssessments} assessments · {released.length} reports
          </div>
        </div>
      </Card>

      <div className="mb-4">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {tab === 'overview' && (
        <div className="grid gap-[18px] sm:grid-cols-2">
          <DetailCard title="Active Assessments">
            {active.length === 0 ? (
              <Muted text="No active assessments." />
            ) : (
              active.map((a) => (
                <AsmRow key={a.id} a={a} onOpen={() => navigate(`/admin/assessments/${a.id}`)} />
              ))
            )}
          </DetailCard>
          <DetailCard title="Latest Reports">
            {released.length === 0 ? (
              <Muted text="No reports yet." />
            ) : (
              released.map((a) => (
                <button
                  key={a.id}
                  onClick={() => navigate('/admin/reports')}
                  className="flex items-center gap-3 w-full text-start p-3 rounded-md border border-border-soft mb-2 bg-surface hover:bg-surface-2"
                >
                  <Icon path={reportsIcon} size={18} style={{ color: 'var(--violet-600)' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold">{a.targetRole}</div>
                    <div className="text-xs text-text-3">{a.assignedAt}</div>
                  </div>
                  <StatusBadge status={a.reportStatus ?? 'Unavailable'} />
                </button>
              ))
            )}
          </DetailCard>
        </div>
      )}

      {(tab === 'active' || tab === 'history') && (
        <DetailCard title={tab === 'active' ? 'Active Assessments' : 'Assessment History'}>
          {(tab === 'active' ? active : assignments).length === 0 ? (
            <Muted text="Nothing here yet." />
          ) : (
            (tab === 'active' ? active : assignments).map((a) => (
              <AsmRow key={a.id} a={a} onOpen={() => navigate(`/admin/assessments/${a.id}`)} />
            ))
          )}
        </DetailCard>
      )}

      {tab === 'reports' && (
        <DetailCard title="Reports">
          {released.length === 0 ? (
            <EmptyState
              title="No reports"
              sub="Released reports appear here (owned by Spec 005)."
            />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {released.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 p-4 rounded-md border border-border-soft"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{a.targetRole}</div>
                    <div className="text-xs text-text-3 mt-0.5">
                      {a.useCase.replace('_', ' ')} · {a.assignedAt}
                    </div>
                    <div className="mt-2.5">
                      <StatusBadge status={a.reportStatus ?? 'Unavailable'} />
                    </div>
                  </div>
                  <Button variant="secondary" onClick={() => navigate('/admin/reports')}>
                    Open
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DetailCard>
      )}

      {tab === 'consent' && (
        <DetailCard title="Consent records">
          {(consents ?? []).length === 0 ? (
            <EmptyState
              title="No consent records yet"
              sub="Per-use-case consent is captured in the User portal; records appear here as the User grants or revokes them."
            />
          ) : (
            <div className="flex flex-col gap-2.5">
              {(consents ?? []).map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 p-3 rounded-md border border-border-soft"
                >
                  <Icon path={shieldCheck} size={18} style={{ color: 'var(--teal-600)' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold">{c.label}</div>
                    <div className="text-xs text-text-3">
                      {c.required ? 'Required' : 'Optional'}
                    </div>
                  </div>
                  <Chip
                    tone={
                      c.status === 'Granted'
                        ? 'teal'
                        : c.status === 'Revoked'
                          ? 'rose'
                          : c.status === 'Declined'
                            ? 'amber'
                            : 'slate'
                    }
                  >
                    {c.status}
                  </Chip>
                </div>
              ))}
            </div>
          )}
        </DetailCard>
      )}

      {tab === 'timeline' && (
        <DetailCard title="Activity timeline">
          <EmptyState title="Timeline" sub="Assessment activity for this user will appear here." />
        </DetailCard>
      )}
    </div>
  );
}
