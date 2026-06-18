// Admin privacy-request inbox (Spec 007 / US1 / FR-PAP-005/006/007). Resolves the data-deletion
// requests Users submitted in Spec 006 — a status-only mock transition reflected in the User's view.
import { useMemo, useState } from 'react';
import { Button, Card, Chip, EmptyState, Field, TextArea, Skeleton } from '@/components/ui';
import { PageHeader } from '@/features/placeholder';
import { useAsync, useToast } from '@/hooks';
import { consentService, participantService } from '@/services';
import type { DataDeletionRequest, Participant } from '@/models';

const statusTone: Record<DataDeletionRequest['status'], 'slate' | 'amber' | 'teal' | 'rose'> = {
  Submitted: 'amber',
  'In Review': 'slate',
  Completed: 'teal',
  Rejected: 'rose',
};

export function PrivacyInbox() {
  const { toast } = useToast();
  const { data, loading, error, reload } = useAsync<DataDeletionRequest[]>(
    () => consentService.allDeletionRequests(),
    [],
  );
  const { data: people } = useAsync<Participant[]>(() => participantService.list(), []);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  const nameOf = useMemo(() => {
    const m = new Map((people ?? []).map((p) => [p.id, p.fullName]));
    return (id: string) => m.get(id) ?? id;
  }, [people]);

  if (loading) return <Skeleton height={180} />;
  if (error)
    return (
      <Card>
        <p className="text-rose-600 mb-2.5">Couldn’t load privacy requests.</p>
        <Button variant="secondary" onClick={reload}>
          Retry
        </Button>
      </Card>
    );

  const rows = data ?? [];

  const act = async (id: string, status: 'In Review' | 'Completed' | 'Rejected', why?: string) => {
    setBusy(id);
    try {
      await consentService.resolveDeletion(id, status, why);
      toast(`Request ${status.toLowerCase()}.`, 'success');
      setRejecting(null);
      setReason('');
      reload();
    } catch {
      toast('Could not update the request.', 'error');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <PageHeader title="Privacy Requests" sub="Data-deletion requests from candidates" />
      <Card>
        {rows.length === 0 ? (
          <EmptyState
            title="No privacy requests"
            sub="Data-deletion requests submitted by candidates will appear here."
          />
        ) : (
          <ul className="list-none grid gap-3">
            {rows.map((r) => {
              const terminal = r.status === 'Completed' || r.status === 'Rejected';
              return (
                <li key={r.id} className="border border-border rounded-md px-[18px] py-[15px]">
                  <div className="flex gap-2.5 items-center flex-wrap">
                    <strong className="text-[15px]">{nameOf(r.participantId)}</strong>
                    <Chip tone={statusTone[r.status]}>{r.status}</Chip>
                    <span className="text-xs text-text-3">{r.submittedAt.slice(0, 10)}</span>
                  </div>
                  {r.note && <p className="text-sm text-text-2 my-2">“{r.note}”</p>}
                  {r.status === 'Rejected' && r.reason && (
                    <p className="text-[13px] text-rose-600 my-1">Rejected: {r.reason}</p>
                  )}

                  {!terminal &&
                    (rejecting === r.id ? (
                      <div className="mt-2.5">
                        <Field label="Reason for rejection">
                          <TextArea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Explain why this request is rejected…"
                          />
                        </Field>
                        <div className="flex gap-2">
                          <Button
                            variant="danger"
                            disabled={!reason || busy === r.id}
                            onClick={() => act(r.id, 'Rejected', reason)}
                          >
                            Confirm reject
                          </Button>
                          <Button variant="ghost" onClick={() => setRejecting(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-2.5 flex-wrap">
                        {r.status === 'Submitted' && (
                          <Button
                            variant="secondary"
                            disabled={busy === r.id}
                            onClick={() => act(r.id, 'In Review')}
                          >
                            Mark in review
                          </Button>
                        )}
                        <Button disabled={busy === r.id} onClick={() => act(r.id, 'Completed')}>
                          Complete
                        </Button>
                        <Button
                          variant="ghost"
                          disabled={busy === r.id}
                          onClick={() => setRejecting(r.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    ))}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
