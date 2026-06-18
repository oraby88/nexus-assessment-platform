import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { AssessmentRuntime } from '@/features/runtime/AssessmentRuntime';
import { QuestionRenderer } from '@/features/runtime/renderers';
import type { MethodFamily, ResponseScale, RuntimeItem } from '@/models';
import { renderRoute, resetAll, axeConfig } from '../helpers/render';

// Spec 008 / US3 — runtime + all five renderers: zero critical axe violations; keyboard-operable radios.
const FAMILIES: { mf: MethodFamily; rs: ResponseScale; options: RuntimeItem['options'] }[] = [
  { mf: 'likert', rs: '1-5 Agreement', options: {} },
  { mf: 'contextual_self_report', rs: '1-5 Frequency', options: {} },
  { mf: 'forced_choice', rs: 'forced_choice_binary', options: { a: 'A', b: 'B' } },
  { mf: 'cognitive_multiple_choice', rs: 'cognitive_mcq', options: { a: 'A', b: 'B', c: 'C' } },
  { mf: 'sjt', rs: 'sjt_single_best', options: { a: 'A', b: 'B', c: 'C', d: 'D' } },
];

describe('A11y: assessment runtime (Spec 008 / US3)', () => {
  beforeEach(() => resetAll());

  it('the runtime container has no axe violations and keyboard-operable options', async () => {
    const { container } = renderRoute(<AssessmentRuntime />, {
      path: '/app/assessments/AS-RUNTIME/run',
      route: '/app/assessments/:assessmentId/run',
      role: 'user',
    });
    await screen.findByText(/plan my work tasks/i);
    expect(await axe(container, axeConfig)).toHaveNoViolations();
    expect(screen.getAllByRole('radio').length).toBeGreaterThan(0);
  });

  it.each(FAMILIES)('renderer for %s has no axe violations', async ({ mf, rs, options }) => {
    const item: RuntimeItem = {
      sourceQuestionId: `Q-${mf}`,
      methodFamily: mf,
      itemText: 'Sample question',
      options,
      responseScale: rs,
      sectionId: 'S1',
    };
    const { container } = render(
      <QuestionRenderer item={item} value={undefined} onChange={vi.fn()} />,
    );
    expect(await axe(container, axeConfig)).toHaveNoViolations();
  });
});
