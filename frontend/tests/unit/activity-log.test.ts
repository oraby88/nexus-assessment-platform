import { describe, it, expect, beforeEach } from 'vitest';
import { filterEvents } from '@/features/activity/ActivityLog';
import { activityLogService } from '@/services';
import { setMockFailRate } from '@/services/http';

// Spec 007 / US3 — curated set covers all enumerated types; filters combine as AND.
describe('Activity Log filtering (Spec 007 / US3)', () => {
  beforeEach(() => setMockFailRate(0));

  it('the curated set covers the enumerated event types', async () => {
    const events = await activityLogService.list();
    const actions = events
      .map((e) => e.action)
      .join(' | ')
      .toLowerCase();
    for (const needle of [
      'sent assessment',
      'released report',
      'released report with caution',
      'revoked consent',
      'requested data deletion',
      'validated blueprint',
      'added user',
      'generated export',
      'invitation expired',
    ]) {
      expect(actions).toContain(needle);
    }
  });

  it('combines search + type + actor + date as logical AND', async () => {
    const events = await activityLogService.list();
    // type filter
    const reports = filterEvents(events, { type: 'Report' });
    expect(reports.length).toBeGreaterThan(0);
    expect(reports.every((e) => e.targetType === 'Report')).toBe(true);
    // actor filter
    const byActor = filterEvents(events, { actor: 'System' });
    expect(byActor.every((e) => e.actorName === 'System')).toBe(true);
    // combined type + actor (AND) — narrower than either alone
    const combined = filterEvents(events, { type: 'Report', actor: 'System' });
    expect(combined.length).toBeLessThanOrEqual(reports.length);
    expect(combined.every((e) => e.targetType === 'Report' && e.actorName === 'System')).toBe(true);
    // search
    const q = filterEvents(events, { q: 'deletion' });
    expect(q.every((e) => /deletion/i.test(`${e.action} ${e.detail ?? ''}`))).toBe(true);
    // date that matches nothing
    expect(filterEvents(events, { date: '1999-01-01' })).toHaveLength(0);
  });
});
