import { describe, it, expect, beforeEach } from 'vitest';
import { assessmentDraftService } from '@/services/assessmentDraft/assessmentDraftService';
import { reportService } from '@/services/report/reportService';
import { resetAll } from '../helpers/render';

// Spec 008 / US2 — Admin Developmental journey produces its mock artifacts with no dead ends.
describe('Journey: Admin Developmental (Spec 008 / US2)', () => {
  beforeEach(() => resetAll());

  it('create → approve → send produces an assignment + invitation; report is retrievable + user-safe + PDF', async () => {
    // Create assessment (draft → approve → send).
    const draft = await assessmentDraftService.create('CND-2041');
    draft.useCase = 'developmental';
    draft.targetRole = 'Finance Manager';
    await assessmentDraftService.save(draft);
    const approved = await assessmentDraftService.approve(draft.id);
    expect(approved.approved).toBe(true);
    const { assignment, invitation } = await assessmentDraftService.send(approved);
    expect(assignment.lifecycleStatus).toBe('Not Started');
    expect(invitation.assessmentId).toBe(assignment.id);

    // Report half: admin report retrievable, user-safe projection works, PDF records history.
    const admin = await reportService.getAdmin('RPT-001');
    expect(admin).toBeTruthy();
    const safe = await reportService.getUserSafe('RPT-001');
    expect(safe?.strengths.length).toBeGreaterThan(0);
    expect(await reportService.downloadPdf('RPT-001')).toEqual({ ok: true });
  });
});
