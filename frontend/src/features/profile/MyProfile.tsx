// My Profile (US4 / FR-ADM-011): profile fields, simulated password change, prefs, theme, sign-out.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Field, TextInput, Select, Button, SegmentedControl, Avatar } from '@/components/ui';
import { lock } from '@/components/ui/icons';
import { PageHeader } from '@/features/placeholder';
import { useSession, useToast, useT } from '@/hooks';
import { useThemeContext } from '@/providers';
import { SUPPORTED_LOCALES, LOCALE_LABELS, type Locale } from '@/i18n/catalog';

export function MyProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, signOut } = useSession();
  const { theme, setTheme } = useThemeContext();
  const { t, locale, setLocale } = useT();
  const [notif, setNotif] = useState('all');

  function changePassword() {
    toast(t('profile.passwordUpdated'), 'success', t('profile.passwordUpdatedBody'));
  }

  return (
    <div>
      <PageHeader title={t('profile.title')} sub={session?.email} />

      {/* Profile header (design parity) — avatar + identity. */}
      <Card className="mb-6 flex items-center gap-4">
        <Avatar name={session?.name ?? 'Admin'} size={64} ring />
        <div>
          <div className="text-lg font-bold">{session?.name ?? '—'}</div>
          <div className="text-[13.5px] text-text-2">Administrator · {session?.email ?? ''}</div>
        </div>
      </Card>

      <Card className="mb-4">
        <h2 className="text-base mb-3">{t('profile.profile')}</h2>
        <Field label={t('profile.name')}>
          <TextInput defaultValue={session?.name ?? ''} aria-label={t('profile.name')} />
        </Field>
        <Field label={t('common.email')}>
          <TextInput defaultValue={session?.email ?? ''} aria-label={t('common.email')} />
        </Field>
      </Card>

      <Card className="mb-4">
        <h2 className="text-base mb-3">{t('profile.preferences')}</h2>
        <Field label={t('profile.theme')}>
          <SegmentedControl
            options={[
              { value: 'light', label: t('profile.theme.light') },
              { value: 'dark', label: t('profile.theme.dark') },
              { value: 'system', label: t('profile.theme.system') },
            ]}
            value={theme}
            onChange={(v) => setTheme(v as 'light' | 'dark' | 'system')}
          />
        </Field>
        <Field label={t('profile.notifications')}>
          <Select
            value={notif}
            onChange={(e) => setNotif(e.target.value)}
            aria-label={t('profile.notifications')}
          >
            <option value="all">{t('profile.notif.all')}</option>
            <option value="important">{t('profile.notif.important')}</option>
            <option value="none">{t('profile.notif.none')}</option>
          </Select>
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
      </Card>

      <Card className="mb-4">
        <h2 className="text-base mb-3">{t('profile.security')}</h2>
        <Button variant="secondary" icon={lock} onClick={changePassword}>
          {t('profile.changePassword')}
        </Button>
      </Card>

      <Button
        variant="danger"
        onClick={() => {
          signOut();
          navigate('/');
        }}
      >
        {t('profile.signOut')}
      </Button>
    </div>
  );
}
