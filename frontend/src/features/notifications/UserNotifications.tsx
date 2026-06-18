// User Notifications (Spec 006 / US6 / FR-USR-015). Own-data notifications with an email-delivery
// indicator. Reuses the shared notificationService.
// Spec 012 (T024): visual parity with project/app/user_portal.jsx UNotifications — tone-colored
// per-type icon badge + title/body/time + inline "Emailed". (Mirrors the admin inbox treatment.)
import { Button, Card, EmptyState, Skeleton } from '@/components/ui';
import {
  Icon,
  reports,
  alert,
  checkCircle,
  clock,
  play,
  blueprint,
  send,
  bell,
  download,
  upload,
  mail,
} from '@/components/ui/icons';
import { PageHeader } from '@/features/placeholder';
import { useAsync } from '@/hooks';
import { notificationService } from '@/services';
import type { AppNotification } from '@/models';

const ICON_FOR: Record<string, string> = {
  report: reports,
  caution: alert,
  completed: checkCircle,
  deadline: clock,
  started: play,
  blueprint,
  invited: send,
  reminder: bell,
  expired: alert,
  export: download,
  partial: reports,
  upload,
};
const TONE_FOR: Record<string, string> = {
  report: 'teal',
  caution: 'amber',
  completed: 'teal',
  deadline: 'amber',
  started: 'indigo',
  blueprint: 'indigo',
  invited: 'indigo',
  reminder: 'slate',
  expired: 'rose',
  export: 'slate',
  partial: 'amber',
  upload: 'teal',
};

export function UserNotifications() {
  const { data, loading, error, reload } = useAsync<AppNotification[]>(
    () => notificationService.list(),
    [],
  );

  if (loading) return <Skeleton height={160} />;
  if (error)
    return (
      <Card>
        <p className="text-rose-600 mb-2.5">Couldn’t load notifications.</p>
        <Button variant="secondary" onClick={reload}>
          Retry
        </Button>
      </Card>
    );

  const list = data ?? [];

  return (
    <div>
      <PageHeader title="Notifications" sub="Updates about your assessments and reports" />
      {list.length === 0 ? (
        <Card>
          <EmptyState title="You’re all caught up" sub="New notifications will appear here." />
        </Card>
      ) : (
        <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
          {list.map((n, i) => {
            const tone = TONE_FOR[n.type] ?? 'slate';
            return (
              <div
                key={n.id}
                className={`flex gap-3.5 px-[18px] py-[15px] ${i ? 'border-t border-border-soft' : ''}`}
                style={{ background: n.read ? 'transparent' : 'var(--indigo-50)' }}
              >
                <span
                  className="w-[38px] h-[38px] rounded-[10px] flex-none grid place-items-center"
                  style={{ background: `var(--tone-${tone}-bg)`, color: `var(--tone-${tone}-dot)` }}
                >
                  <Icon path={ICON_FOR[n.type] ?? bell} size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold">{n.title}</div>
                  <div className="text-[13px] text-text-2 mt-0.5 leading-snug">{n.body}</div>
                  {n.email && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-text-3 font-semibold mt-1.5">
                      <Icon path={mail} size={12} /> Emailed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
