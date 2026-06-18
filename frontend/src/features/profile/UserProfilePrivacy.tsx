// Profile & Privacy (Spec 006 / US3+US6 / FR-USR-017). Personal info, language, simulated password
// change, consent history with revoke (eligible only), and a data-deletion request that is created
// pending and queued for the Admin privacy inbox (Spec 007). Own-data only.
import { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Chip,
  Field,
  Select,
  TextInput,
  TextArea,
  Skeleton,
  EmptyState,
} from '@/components/ui';
import { PageHeader } from '@/features/placeholder';
import { useAsync, useSession, useToast, useT } from '@/hooks';
import { consentService } from '@/services';
import type { ConsentRecord, DataDeletionRequest } from '@/models';
import { SUPPORTED_LOCALES, LOCALE_LABELS, type Locale } from '@/i18n/catalog';

function ConsentHistory() {
  const { toast } = useToast();
  const { t } = useT();
  const { data, loading, reload } = useAsync<ConsentRecord[]>(() => consentService.history(), []);
  const [busy, setBusy] = useState<string | null>(null);

  if (loading) return <Skeleton height={120} />;
  const list = data ?? [];

  const revoke = async (c: ConsentRecord) => {
    setBusy(c.id);
    await consentService.revoke(c.id);
    setBusy(null);
    toast(t('privacy.revoked'), 'success');
    reload();
  };

  return (
    <Card className="mb-4">
      <h2 className="text-base mb-2">{t('privacy.consentHistory')}</h2>
      {list.length === 0 ? (
        <EmptyState title={t('privacy.noConsent')} />
      ) : (
        <ul className="list-none grid gap-2.5">
          {list.map((c) => {
            const eligible = c.revocable && c.status === 'Granted';
            return (
              <li
                key={c.id}
                className="flex gap-2.5 items-center flex-wrap border-t border-border pt-2.5"
              >
                <div className="flex-1 min-w-[160px]">
                  <div className="text-sm font-semibold">{c.label}</div>
                  <div className="text-xs text-text-3">
                    {c.required ? t('privacy.required') : t('privacy.optional')}
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
                {eligible ? (
                  <Button
                    variant="ghost"
                    className="py-1.5 px-2.5"
                    disabled={busy === c.id}
                    onClick={() => revoke(c)}
                  >
                    {t('privacy.revoke')}
                  </Button>
                ) : c.status === 'Granted' && !c.revocable ? (
                  <Chip tone="slate">{t('privacy.locked')}</Chip>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

function DeletionRequest() {
  const { toast } = useToast();
  const { t } = useT();
  const { data, loading, reload } = useAsync<DataDeletionRequest[]>(
    () => consentService.deletionRequests(),
    [],
  );
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    await consentService.requestDeletion(note || undefined);
    setBusy(false);
    setNote('');
    toast(t('privacy.deletionSubmitted'), 'success');
    reload();
  };

  const requests = data ?? [];

  return (
    <Card>
      <h2 className="text-base mb-2">{t('privacy.requestDeletion')}</h2>
      <p className="text-sm text-text-2 mb-2.5">{t('privacy.deletionIntro')}</p>
      {!loading && requests.length > 0 && (
        <ul className="list-none grid gap-2 mb-3">
          {requests.map((r) => (
            <li key={r.id} className="flex gap-2.5 items-center text-[13px]">
              <span className="text-text-3">
                {t('privacy.requestOn', { date: r.submittedAt.slice(0, 10) })}
              </span>
              <Chip
                tone={
                  r.status === 'Completed'
                    ? 'teal'
                    : r.status === 'Rejected'
                      ? 'rose'
                      : r.status === 'In Review'
                        ? 'slate'
                        : 'amber'
                }
              >
                {r.status === 'Submitted' ? t('privacy.pendingReview') : r.status}
              </Chip>
            </li>
          ))}
        </ul>
      )}
      <Field label={t('privacy.reasonOptional')}>
        <TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t('privacy.reasonPlaceholder')}
        />
      </Field>
      <Button onClick={submit} disabled={busy}>
        {t('privacy.submitDeletion')}
      </Button>
    </Card>
  );
}

export function UserProfilePrivacy() {
  const { session } = useSession();
  const { toast } = useToast();
  const { t, locale, setLocale } = useT();

  return (
    <div>
      <PageHeader title={t('privacy.title')} sub={t('privacy.sub')} />

      {/* identity header (design parity) */}
      <Card className="mb-4 flex items-center gap-4">
        <Avatar name={session?.name ?? 'You'} size={56} ring />
        <div className="min-w-0">
          <div className="text-[17px] font-bold truncate">{session?.name ?? '—'}</div>
          <div className="text-[13px] text-text-2 truncate">{session?.email ?? ''}</div>
        </div>
      </Card>

      <Card className="mb-4">
        <h2 className="text-base mb-2">{t('privacy.personalInfo')}</h2>
        <Field label={t('profile.name')}>
          <TextInput value={session?.name ?? ''} readOnly />
        </Field>
        <Field label={t('common.email')}>
          <TextInput value={session?.email ?? ''} readOnly />
        </Field>
        <Field label={t('common.language')}>
          <Select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            aria-label={t('common.language')}
          >
            {SUPPORTED_LOCALES.map((l) => (
              <option key={l} value={l}>
                {LOCALE_LABELS[l]}
              </option>
            ))}
          </Select>
        </Field>
        <Button variant="secondary" onClick={() => toast(t('privacy.preferencesSaved'), 'success')}>
          {t('privacy.savePreferences')}
        </Button>
      </Card>

      <Card className="mb-4">
        <h2 className="text-base mb-2">{t('privacy.changePassword')}</h2>
        <Field label={t('privacy.newPassword')}>
          <TextInput type="password" placeholder="••••••••" />
        </Field>
        <Field label={t('privacy.confirmPassword')}>
          <TextInput type="password" placeholder="••••••••" />
        </Field>
        <Button variant="secondary" onClick={() => toast(t('privacy.passwordUpdated'), 'success')}>
          {t('privacy.updatePassword')}
        </Button>
      </Card>

      <ConsentHistory />
      <DeletionRequest />
    </div>
  );
}
