// Organization settings (US4 / FR-ADM-010): single Admin account (one-Admin V1 rule).
import type { OrgSettings } from '@/models';
import { mockRequest } from '@/services/http';
import type { SettingsServiceContract } from '@/services/contracts';

let settings: OrgSettings = {
  organization: {
    id: 'org-meridian',
    name: 'Meridian',
    industry: 'Financial Services',
    country: 'United Kingdom',
  },
  admin: {
    name: 'Jordan Avery',
    email: 'admin@meridian.co',
    notificationPreference: 'all',
    language: 'en',
  },
};

export const settingsService = {
  get(): Promise<OrgSettings> {
    return mockRequest(() => ({
      ...settings,
      organization: { ...settings.organization },
      admin: { ...settings.admin },
    }));
  },
  update(patch: Partial<OrgSettings>): Promise<OrgSettings> {
    return mockRequest(() => {
      settings = {
        organization: { ...settings.organization, ...patch.organization },
        admin: { ...settings.admin, ...patch.admin },
      };
      return {
        ...settings,
        organization: { ...settings.organization },
        admin: { ...settings.admin },
      };
    });
  },
} satisfies SettingsServiceContract;
