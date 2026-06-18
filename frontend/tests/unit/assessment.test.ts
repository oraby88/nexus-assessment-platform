import { describe, it, expect, beforeEach } from 'vitest';
import { assessmentService } from '@/services/assessment/assessmentService';
import { notificationService } from '@/services/notification/notificationService';
import { setMockFailRate } from '@/services/http';

// FR-ADM-007 / SC-004
describe('assessmentService actions', () => {
  beforeEach(() => setMockFailRate(0));

  it('reminding appends a timeline event and emits a notification', async () => {
    const before = (await notificationService.list()).length;
    await assessmentService.remind('ASN-002'); // In Progress (actionable)
    const timeline = await assessmentService.timeline('ASN-002');
    expect(timeline.some((e) => e.label === 'Reminder sent')).toBe(true);
    const after = (await notificationService.list()).length;
    expect(after).toBe(before + 1);
  });

  it('extending the deadline updates the assignment', async () => {
    const updated = await assessmentService.extendDeadline('ASN-002', '2026-08-01');
    expect(updated.deadline).toBe('2026-08-01');
  });

  it('cancel sets a terminal Cancelled status', async () => {
    const updated = await assessmentService.cancel('ASN-002');
    expect(updated.lifecycleStatus).toBe('Cancelled');
  });

  it('blocks actions on a terminal assessment', async () => {
    // ASN-001 is Completed (terminal)
    await expect(assessmentService.remind('ASN-001')).rejects.toThrow(/Completed/);
  });
});
