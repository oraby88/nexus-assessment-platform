// Notifications inbox (US4 / FR-ADM-008): unread state + simulated email-delivery indicator.
// Spec 012 (T018): visual parity with project/app/admin_misc.jsx Notifications — tone-colored type
// icon badge, unread-tinted rows, All/Unread filter, inline "Emailed" indicator. Real read/markAll kept.
import { useState } from 'react';
import { Button, EmptyState, Skeleton } from '@/components/ui';
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

// Per-type icon + tone (design `iconFor`/`toneFor`); falls back to a neutral bell/slate.
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

export function NotificationsInbox() {
  const { data, loading, error, reload } = useAsync<AppNotification[]>(
    () => notificationService.list(),
    [],
  );
  const [filter, setFilter] = useState<'All' | 'Unread'>('All');

  async function markAll() {
    await notificationService.markAllRead();
    reload();
  }
  async function markOne(id: string) {
    await notificationService.markRead(id);
    reload();
  }

  const all = data ?? [];
  const unread = all.filter((n) => !n.read).length;
  const rows = filter === 'Unread' ? all.filter((n) => !n.read) : all;

  return (
    <div>
      <PageHeader
        title="Notifications"
        sub="In-platform and email notifications across your workspace."
      />

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {(['All', 'Unread'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              background: filter === f ? 'var(--tone-indigo-dot)' : 'var(--surface-2)',
              color: filter === f ? '#fff' : 'var(--text-2)',
            }}
          >
            {f}
            {f === 'Unread' && ` (${unread})`}
          </button>
        ))}
        <div className="flex-1" />
        <Button variant="secondary" onClick={markAll} disabled={unread === 0}>
          Mark all as read
        </Button>
      </div>

      <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
        {loading && (
          <div className="grid gap-2.5 p-4">
            <Skeleton />
            <Skeleton />
          </div>
        )}
        {error && (
          <div className="p-4">
            <p className="text-rose-600 mb-2.5">Failed to load notifications.</p>
            <Button variant="secondary" onClick={reload}>
              Retry
            </Button>
          </div>
        )}
        {data && rows.length === 0 && (
          <div className="p-4">
            <EmptyState title="No notifications" />
          </div>
        )}
        {data && rows.length > 0 && (
          <ul className="list-none m-0 p-0">
            {rows.map((n, i) => {
              const tone = TONE_FOR[n.type] ?? 'slate';
              return (
                <li
                  key={n.id}
                  onClick={() => !n.read && markOne(n.id)}
                  className={`flex gap-3.5 px-[18px] py-[15px] ${i ? 'border-t border-border-soft' : ''} ${n.read ? '' : 'cursor-pointer'}`}
                  style={{ background: n.read ? 'transparent' : 'var(--indigo-50)' }}
                >
                  <span
                    className="w-[38px] h-[38px] rounded-[10px] flex-none grid place-items-center"
                    style={{
                      background: `var(--tone-${tone}-bg)`,
                      color: `var(--tone-${tone}-dot)`,
                    }}
                  >
                    <Icon path={ICON_FOR[n.type] ?? bell} size={18} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{n.title}</span>
                      {!n.read && (
                        <span
                          aria-label="unread"
                          className="w-[7px] h-[7px] rounded-full bg-indigo-500 flex-none"
                        />
                      )}
                    </div>
                    <div className="text-[13px] text-text-2 mt-0.5 leading-snug">{n.body}</div>
                    <div className="flex items-center gap-2.5 mt-1.5">
                      <span className="text-[11.5px] text-text-3">{n.time}</span>
                      {n.email ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-text-3 font-semibold">
                          <Icon path={mail} size={12} /> Emailed
                        </span>
                      ) : (
                        <span className="text-[11px] text-text-3 font-semibold">No email</span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
