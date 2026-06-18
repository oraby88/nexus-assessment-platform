// Organization settings (US4 / FR-ADM-010): one Admin account; no multi-Admin workflow.
// Spec 012 (T018): visual parity with project/app/admin_misc.jsx Settings — sticky settings-nav rail
// + section panel. Organization Profile and Admin Account carry the app's real data; the remaining
// sections render the design's explanatory placeholder (V1 prototype) without fabricating controls.
import { useEffect, useState } from 'react';
import { Card, Field, TextInput, Button, Chip, Skeleton } from '@/components/ui';
import { PageHeader } from '@/features/placeholder';
import { useAsync, useToast } from '@/hooks';
import { settingsService } from '@/services';
import type { OrgSettings as OrgSettingsModel } from '@/models';

const SECTIONS = [
  'Organization Profile',
  'Admin Account',
  'Assessment Defaults',
  'Deadlines',
  'Reminder Schedule',
  'Notifications',
  'Report Access',
  'Branding',
  'Privacy & Consent',
  'Integrations',
];

export function OrgSettings() {
  const { toast } = useToast();
  const { data, loading } = useAsync<OrgSettingsModel>(() => settingsService.get(), []);
  const [orgName, setOrgName] = useState('');
  const [tab, setTab] = useState('Organization Profile');

  useEffect(() => {
    if (data) setOrgName(data.organization.name);
  }, [data]);

  if (loading || !data) return <Skeleton height={160} />;

  async function save() {
    await settingsService.update({ organization: { ...data!.organization, name: orgName } });
    toast('Settings saved', 'success');
  }

  return (
    <div>
      <PageHeader
        title="Organization Settings"
        sub={`${data.organization.name} workspace · one Admin account in V1.`}
      />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* settings nav */}
        <div className="flex flex-col gap-0.5 lg:sticky lg:top-[84px] self-start">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setTab(s)}
              className="text-start px-3 py-2.5 rounded-sm text-[13px]"
              style={{
                fontWeight: tab === s ? 700 : 500,
                color: tab === s ? 'var(--indigo-700)' : 'var(--text-2)',
                background: tab === s ? 'var(--indigo-50)' : 'transparent',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* panel */}
        <Card>
          <h2 className="text-base font-bold mb-[18px]">{tab}</h2>

          {tab === 'Organization Profile' && (
            <div className="max-w-[480px]">
              <Field label="Organization name">
                <TextInput
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  aria-label="Organization name"
                />
              </Field>
              <dl className="grid grid-cols-[140px_1fr] gap-x-3 gap-y-2 text-sm mt-3">
                <dt className="text-text-3">Industry</dt>
                <dd>{data.organization.industry ?? '—'}</dd>
                <dt className="text-text-3">Country</dt>
                <dd>{data.organization.country ?? '—'}</dd>
              </dl>
            </div>
          )}

          {tab === 'Admin Account' && (
            <div className="max-w-[480px]">
              <div className="flex items-center gap-2.5 mb-3">
                <Chip tone="indigo">1 Admin</Chip>
              </div>
              <dl className="grid grid-cols-[140px_1fr] gap-x-3 gap-y-2 text-sm">
                <dt className="text-text-3">Name</dt>
                <dd>{data.admin.name}</dd>
                <dt className="text-text-3">Email</dt>
                <dd>{data.admin.email}</dd>
              </dl>
              <p className="text-xs text-text-3 mt-3">
                V1 supports a single Admin per organization. Multi-Admin management is a future
                capability.
              </p>
            </div>
          )}

          {!['Organization Profile', 'Admin Account'].includes(tab) && (
            <p className="text-sm text-text-2 leading-relaxed max-w-[520px]">
              Configure {tab.toLowerCase()} for your organization. These settings apply across all
              assessments in the {data.organization.name} workspace.
            </p>
          )}

          <div className="mt-6 flex gap-2.5">
            <Button onClick={save}>Save Changes</Button>
            <Button variant="ghost">Cancel</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
