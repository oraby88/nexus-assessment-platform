import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LikertRenderer } from '@/features/runtime/renderers/LikertRenderer';
import { FrequencyRenderer } from '@/features/runtime/renderers/FrequencyRenderer';
import { ForcedChoiceRenderer } from '@/features/runtime/renderers/ForcedChoiceRenderer';
import { McqRenderer } from '@/features/runtime/renderers/McqRenderer';
import { SjtRenderer } from '@/features/runtime/renderers/SjtRenderer';
import type { RuntimeItem } from '@/models';

const base: Omit<RuntimeItem, 'methodFamily' | 'responseScale' | 'options'> = {
  sourceQuestionId: 'Q-1',
  itemText: 'Sample question',
  sectionId: 'S1',
};

// Spec 006 / US2 — each renderer presents keyboard-operable radios and emits the right value.
describe('question-type renderers (Spec 006 / US2)', () => {
  it('Likert emits a numeric value (radios are keyboard-operable)', () => {
    const onChange = vi.fn();
    const item: RuntimeItem = {
      ...base,
      methodFamily: 'likert',
      responseScale: '1-5 Agreement',
      options: {},
    };
    render(<LikertRenderer item={item} value={undefined} onChange={onChange} />);
    expect(screen.getAllByRole('radio')).toHaveLength(5);
    fireEvent.click(screen.getByRole('radio', { name: 'Agree' }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('Frequency emits a numeric value', () => {
    const onChange = vi.fn();
    const item: RuntimeItem = {
      ...base,
      methodFamily: 'contextual_self_report',
      responseScale: '1-5 Frequency',
      options: {},
    };
    render(<FrequencyRenderer item={item} value={undefined} onChange={onChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Often' }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('Forced choice emits the option key', () => {
    const onChange = vi.fn();
    const item: RuntimeItem = {
      ...base,
      methodFamily: 'forced_choice',
      responseScale: 'forced_choice_binary',
      options: { a: 'Option A', b: 'Option B' },
    };
    render(<ForcedChoiceRenderer item={item} value={undefined} onChange={onChange} />);
    expect(screen.getAllByRole('radio')).toHaveLength(2);
    fireEvent.click(screen.getByRole('radio', { name: /Option A/ }));
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('MCQ emits the option key', () => {
    const onChange = vi.fn();
    const item: RuntimeItem = {
      ...base,
      methodFamily: 'cognitive_multiple_choice',
      responseScale: 'cognitive_mcq',
      options: { a: 'One', b: 'Two', c: 'Three', d: 'Four' },
    };
    render(<McqRenderer item={item} value={undefined} onChange={onChange} />);
    fireEvent.click(screen.getByRole('radio', { name: /Two/ }));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('SJT emits the option key', () => {
    const onChange = vi.fn();
    const item: RuntimeItem = {
      ...base,
      methodFamily: 'sjt',
      responseScale: 'sjt_single_best',
      options: { a: 'Escalate', b: 'Talk to the teammate', c: 'Redo it', d: 'Blame them' },
    };
    render(<SjtRenderer item={item} value={undefined} onChange={onChange} />);
    fireEvent.click(screen.getByRole('radio', { name: /Talk to the teammate/ }));
    expect(onChange).toHaveBeenCalledWith('b');
  });
});
