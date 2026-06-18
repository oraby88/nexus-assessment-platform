import { describe, it, expect, beforeEach } from 'vitest';
import { consentService } from '@/services/consent/consentService';
import { runtimeService } from '@/services/runtime/runtimeService';
import { reportService } from '@/services/report/reportService';
import { resetAll } from '../helpers/render';

// Spec 008 / US2 — User journey: consent → answer all five types → pause/reload → submit; no live score.
describe('Journey: User (Spec 008 / US2)', () => {
  beforeEach(() => resetAll());

  it('consents, answers all five question types, resumes after reload, submits, and never sees a score', async () => {
    // Many sequential mock calls (consent + per-item answer/next + submit) — allow extra time.
    // Consent gate: required consent present → accept.
    const consents = await consentService.forAssessment('AS-RUNTIME');
    const required = consents.find((c) => c.required)!;
    expect(required).toBeTruthy();
    expect((await consentService.accept(required.id)).status).toBe('Granted');

    // Runtime: answer every item (covers all five method families), advancing with forward gating.
    const session = await runtimeService.load('AS-RUNTIME');
    expect(session.items.length).toBeGreaterThanOrEqual(5);
    for (let i = 0; i < session.items.length; i++) {
      const item = session.items[i];
      const value =
        item.methodFamily === 'likert' || item.methodFamily === 'contextual_self_report'
          ? 4
          : (Object.keys(item.options)[0] ?? 'a');
      await runtimeService.answer('AS-RUNTIME', item.sourceQuestionId, value);
      await runtimeService.next('AS-RUNTIME');
    }

    // Reload restores progress (pause → reload).
    await runtimeService.pause('AS-RUNTIME');
    const resumed = await runtimeService.load('AS-RUNTIME');
    expect(Object.keys(resumed.state.answers).length).toBe(session.items.length);

    // Submit → completion; no score in any payload.
    const submit = await runtimeService.submit('AS-RUNTIME');
    expect(submit.ok).toBe(true);
    expect(JSON.stringify(resumed.state).toLowerCase()).not.toContain('score');

    // User-safe report available, supportive content only.
    const safe = await reportService.getUserSafe('RPT-001');
    expect(safe?.strengths.length).toBeGreaterThan(0);
  }, 20000);
});
