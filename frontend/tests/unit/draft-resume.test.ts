import { describe, it, expect, beforeEach } from 'vitest';
import { assessmentDraftService } from '@/services/assessmentDraft/assessmentDraftService';
import { setMockFailRate } from '@/services/http';

// FR-CA-001 / SC-007
describe('draft save & resume', () => {
  beforeEach(() => {
    localStorage.clear();
    setMockFailRate(0);
  });

  it('persists the draft and restores step + inputs on get', async () => {
    const draft = await assessmentDraftService.create('CND-2041');
    await assessmentDraftService.save({
      ...draft,
      currentStep: 5,
      targetRole: 'Sales Manager',
      useCase: 'hiring_support',
    });
    const resumed = await assessmentDraftService.get(draft.id);
    expect(resumed?.currentStep).toBe(5);
    expect(resumed?.targetRole).toBe('Sales Manager');
    expect(resumed?.useCase).toBe('hiring_support');
  });
});
