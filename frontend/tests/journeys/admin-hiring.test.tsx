import { describe, it, expect, beforeEach } from 'vitest';
import { assessmentDraftService } from '@/services/assessmentDraft/assessmentDraftService';
import { reportService } from '@/services/report/reportService';
import { comparisonService } from '@/services/comparison/comparisonService';
import { resetAll } from '../helpers/render';

// Spec 008 / US2 — Admin Hiring-Support journey: Domain 6 visible (Admin) + Comparison with no decision.
describe('Journey: Admin Hiring-Support (Spec 008 / US2)', () => {
  beforeEach(() => resetAll());

  it('sends a hiring-support assessment, surfaces Domain 6, and compares candidates with no auto-decision', async () => {
    const draft = await assessmentDraftService.create('CND-2045');
    draft.useCase = 'hiring_support';
    draft.targetRole = 'Sales Manager';
    await assessmentDraftService.save(draft);
    const approved = await assessmentDraftService.approve(draft.id);
    const { assignment } = await assessmentDraftService.send(approved);
    expect(assignment.useCase).toBe('hiring_support');

    // Domain 6 visible in the Admin report; derailment risk always blocked.
    const ids = ['RPT-001', 'RPT-002', 'RPT-003', 'RPT-004'];
    const withD6 = (await Promise.all(ids.map((id) => reportService.getAdmin(id)))).find(
      (r) => r?.domain6,
    );
    expect(withD6?.domain6?.derailmentRiskBlocked).toBe(true);

    // Candidate Comparison — human-led, no ranking/auto-decision, order preserved.
    const sel = ['CND-2041', 'CND-2045'];
    const { comparison, eligibility } = await comparisonService.build({
      roleTitle: 'Sales Manager',
      participantIds: sel,
      dimensionIds: [],
    });
    expect('rank' in comparison).toBe(false);
    expect(eligibility.length).toBe(2);
    expect(comparison.participants.map((p) => p.participantId)).toEqual(
      sel.filter((id) => comparison.participants.some((p) => p.participantId === id)),
    );
  });
});
