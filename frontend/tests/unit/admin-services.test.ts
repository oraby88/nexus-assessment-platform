import { describe, it, expect, beforeEach } from 'vitest';
import { exportService } from '@/services/export/exportService';
import { settingsService } from '@/services/settings/settingsService';
import { notificationService } from '@/services/notification/notificationService';
import { setMockFailRate } from '@/services/http';

// FR-ADM-008 / FR-ADM-009 / FR-ADM-010 / SC-006 / SC-007
describe('exportService (FR-ADM-009)', () => {
  beforeEach(() => setMockFailRate(0));

  it('exposes 7 registry entries with Users/Assessments active', async () => {
    const reg = await exportService.registry();
    expect(reg).toHaveLength(7);
    expect(reg.find((e) => e.type === 'users')?.available).toBe(true);
    expect(reg.find((e) => e.type === 'assessments')?.available).toBe(true);
    expect(reg.filter((e) => !e.available)).toHaveLength(5);
  });

  it('produces CSV for an active type and records a history entry', async () => {
    const before = (await exportService.history()).length;
    const job = await exportService.request('users');
    expect(job.status).toBe('Ready');
    const csv = await exportService.getCsv(job.id);
    expect(csv.split('\r\n')[0]).toContain('fullName');
    expect((await exportService.history()).length).toBe(before + 1);
  });

  it('rejects a pending (non-owned) export type', async () => {
    await expect(exportService.request('reports')).rejects.toThrow(/pending/i);
  });
});

describe('settingsService (FR-ADM-010)', () => {
  beforeEach(() => setMockFailRate(0));
  it('returns a single Admin account', async () => {
    const s = await settingsService.get();
    expect(s.admin.email).toBeTruthy();
    expect(typeof s.admin.name).toBe('string');
  });
  it('updates the organization name', async () => {
    const s = await settingsService.update({
      organization: { id: 'org-meridian', name: 'Meridian Renamed' },
    });
    expect(s.organization.name).toBe('Meridian Renamed');
  });
});

describe('notificationService (FR-ADM-008)', () => {
  beforeEach(() => setMockFailRate(0));
  it('marks all read so the unread count reaches zero', async () => {
    await notificationService.markAllRead();
    expect(await notificationService.unreadCount()).toBe(0);
  });
});
