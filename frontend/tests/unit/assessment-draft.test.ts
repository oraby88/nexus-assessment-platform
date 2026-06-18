import { describe, it, expect, beforeEach } from 'vitest';
import { assessmentDraftService } from '@/services/assessmentDraft/assessmentDraftService';
import { assessmentService } from '@/services/assessment/assessmentService';
import { setMockFailRate } from '@/services/http';

// FR-CA-014/016 / SC-001/006
describe('assessmentDraftService approve + send', () => {
  beforeEach(() => {
    localStorage.clear();
    setMockFailRate(0);
  });

  it('refuses to send an unapproved draft', async () => {
    const draft = await assessmentDraftService.create('CND-2041');
    await expect(assessmentDraftService.send(draft)).rejects.toThrow(/approved/i);
  });

  it('approves then sends, creating an assignment + invitation', async () => {
    const draft = await assessmentDraftService.create('CND-2041');
    await assessmentDraftService.save({ ...draft, targetRole: 'Finance Manager' });
    await assessmentDraftService.approve(draft.id);
    const approved = await assessmentDraftService.get(draft.id);
    expect(approved?.approved).toBe(true);

    const before = (await assessmentService.list()).length;
    const res = await assessmentDraftService.send(approved!);
    expect(res.assignment.lifecycleStatus).toBe('Not Started');
    expect(res.invitation.assessmentId).toBe(res.assignment.id);
    const after = await assessmentService.list();
    expect(after.length).toBe(before + 1);
    expect(after.some((a) => a.id === res.assignment.id)).toBe(true);
  });
});
