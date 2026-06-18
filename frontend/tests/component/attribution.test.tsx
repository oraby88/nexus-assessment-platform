import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuestionCard } from '@/features/create-assessment/QuestionCard';
import type { AdaptedQuestionText, ItemBankItem, SelectedQuestion } from '@/models';

// SC-009 / FR-CA-017: source item_id is preserved through adaptation; no live score is shown.
const item: ItemBankItem = {
  itemId: 'NEX-GMB-007',
  domainId: 'D1',
  domainName: 'Character & Work Style',
  dimensionId: 'D1-CE',
  dimensionName: 'Conscientious Execution',
  facetId: 'D1-CE-ORD',
  facetName: 'Orderliness',
  methodFamily: 'likert',
  itemFormat: 'statement',
  itemText: 'I plan tasks carefully.',
  options: {},
  keyedAnswer: null,
  responseScale: '1-5 Agreement',
  bankState: 'production',
  useStatus: 'operational_allowed',
  reviewStatus: 'draft',
  jobLevelOverlay: 'all_levels',
  reverseScored: false,
};

const adaptation: AdaptedQuestionText = {
  itemId: 'NEX-GMB-007',
  originalText: 'I plan tasks carefully.',
  adaptedText: 'I plan my work tasks carefully and ahead of time.',
  diff: [{ text: 'I plan my work tasks carefully and ahead of time.', changed: true }],
  mode: 'contextual_rephrase_allowed',
  reason: 'Governed rephrase',
  generatedAt: '2026-06-15',
};

const selected: SelectedQuestion = {
  item,
  adaptation,
  requirementCovered: 'Conscientious Execution',
  selectionReason: 'Covers required dimension',
  approved: true,
};

describe('question-level attribution (SC-009)', () => {
  it('preserves the source item_id even when adapted and shows the adapted display text', () => {
    render(<QuestionCard selected={selected} />);
    expect(screen.getByText('NEX-GMB-007')).toBeInTheDocument(); // source id retained
    expect(screen.getByText(/ahead of time/)).toBeInTheDocument(); // adapted display text
  });

  it('shows no live score anywhere on the card', () => {
    render(<QuestionCard selected={selected} />);
    expect(screen.queryByText(/score/i)).toBeNull();
  });
});
