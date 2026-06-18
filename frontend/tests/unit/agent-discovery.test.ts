import { describe, it, expect, beforeEach } from 'vitest';
import { agentDiscoveryService } from '@/services/agentDiscovery/agentDiscoveryService';
import { setMockFailRate } from '@/services/http';
import type { DiscoveryAnswer } from '@/models';

// FR-CA-004 / SC-005
describe('agentDiscoveryService (deterministic scripted, research D1)', () => {
  beforeEach(() => setMockFailRate(0));

  it('starts with the role question', async () => {
    const t = await agentDiscoveryService.start('developmental');
    expect(t.id).toBe('role');
    expect(t.sender).toBe('agent');
  });

  it('builds requirements from answers and advances deterministically', async () => {
    const answers: DiscoveryAnswer[] = [
      { questionId: 'role', topic: 'role', answer: 'Finance Manager', answeredAt: 'x' },
      {
        questionId: 'responsibilities',
        topic: 'responsibilities',
        answer: 'budgets, reporting',
        answeredAt: 'x',
      },
    ];
    const res = await agentDiscoveryService.next(answers, 'developmental');
    expect(res.requirements.role).toBe('Finance Manager');
    expect(res.requirements.responsibilities).toEqual(['budgets', 'reporting']);
    expect(res.turn?.id).toBe('context'); // third question
  });

  it('adds a hiring-specific question for hiring_support', async () => {
    const devAll: DiscoveryAnswer[] = [
      'role',
      'responsibilities',
      'context',
      'success',
      'risks',
    ].map((id) => ({
      questionId: id,
      topic: id,
      answer: 'x',
      answeredAt: 'x',
    }));
    const dev = await agentDiscoveryService.next(devAll, 'developmental');
    expect(dev.turn).toBeNull(); // developmental complete after 5
    const hire = await agentDiscoveryService.next(devAll, 'hiring_support');
    expect(hire.turn?.id).toBe('rolefit'); // hiring has a 6th
  });
});
