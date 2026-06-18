import { describe, it, expect, beforeEach } from 'vitest';
import { runtimeService } from '@/services/runtime/runtimeService';
import { setMockFailRate } from '@/services/http';

// Spec 006 / US1 — runtime persistence, source-ID keying, forward gating, reload restore, no score.
describe('runtimeService (Spec 006 / US1)', () => {
  beforeEach(() => {
    setMockFailRate(0);
    localStorage.clear();
  });

  it('loads a fixed pre-resolved item set covering all five method families', async () => {
    const s = await runtimeService.load('AS-RUNTIME');
    expect(s.items.length).toBeGreaterThanOrEqual(5);
    const families = new Set(s.items.map((i) => i.methodFamily));
    expect(families.has('likert')).toBe(true);
    expect(families.has('contextual_self_report')).toBe(true);
    expect(families.has('forced_choice')).toBe(true);
    expect(families.has('cognitive_multiple_choice')).toBe(true);
    expect(families.has('sjt')).toBe(true);
    expect(s.state.questionIndex).toBe(0);
  });

  it('stores answers keyed by the source Question ID and recomputes progress (FR-USR-011)', async () => {
    const s = await runtimeService.load('AS-RUNTIME');
    const qid = s.items[0].sourceQuestionId;
    const st = await runtimeService.answer('AS-RUNTIME', qid, 4);
    expect(st.answers[qid]).toBe(4);
    expect(st.progressPercent).toBeGreaterThan(0);
  });

  it('gates next() until the current item is answered (FR-USR-009)', async () => {
    await runtimeService.load('AS-RUNTIME');
    let st = await runtimeService.next('AS-RUNTIME'); // unanswered → no advance
    expect(st.questionIndex).toBe(0);
    const s = await runtimeService.load('AS-RUNTIME');
    await runtimeService.answer('AS-RUNTIME', s.items[0].sourceQuestionId, 3);
    st = await runtimeService.next('AS-RUNTIME');
    expect(st.questionIndex).toBe(1);
  });

  it('restores current question + all answers on reload (SC-002)', async () => {
    const s = await runtimeService.load('AS-RUNTIME');
    await runtimeService.answer('AS-RUNTIME', s.items[0].sourceQuestionId, 5);
    await runtimeService.answer('AS-RUNTIME', s.items[1].sourceQuestionId, 2);
    await runtimeService.goTo('AS-RUNTIME', 1);
    await runtimeService.pause('AS-RUNTIME');
    const again = await runtimeService.load('AS-RUNTIME'); // simulate reload
    expect(again.state.questionIndex).toBe(1);
    expect(again.state.answers[s.items[0].sourceQuestionId]).toBe(5);
    expect(again.state.answers[s.items[1].sourceQuestionId]).toBe(2);
  });

  it('exposes no score field in any runtime payload (SC-004)', async () => {
    const s = await runtimeService.load('AS-RUNTIME');
    const st = await runtimeService.answer('AS-RUNTIME', s.items[0].sourceQuestionId, 4);
    const submit = await runtimeService.submit('AS-RUNTIME');
    for (const obj of [s.state, s.meta, st, submit]) {
      expect(JSON.stringify(obj).toLowerCase()).not.toContain('score');
    }
  });

  it('safely discards a stale runtime payload on schema mismatch (research D1)', async () => {
    localStorage.setItem(
      'nexus_runtime_v1',
      JSON.stringify({ v: 999, data: { 'AS-RUNTIME': { questionIndex: 7 } } }),
    );
    const s = await runtimeService.load('AS-RUNTIME');
    expect(s.state.questionIndex).toBe(0); // discarded → fresh
  });

  it('a simulated save failure does not lose previously saved answers (edge case)', async () => {
    const s = await runtimeService.load('AS-RUNTIME');
    await runtimeService.answer('AS-RUNTIME', s.items[0].sourceQuestionId, 4);
    setMockFailRate(1);
    await expect(
      runtimeService.answer('AS-RUNTIME', s.items[1].sourceQuestionId, 2),
    ).rejects.toBeTruthy();
    setMockFailRate(0);
    const again = await runtimeService.load('AS-RUNTIME');
    expect(again.state.answers[s.items[0].sourceQuestionId]).toBe(4);
  });
});
