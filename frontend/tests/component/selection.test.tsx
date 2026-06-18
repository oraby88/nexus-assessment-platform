import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuestionCard } from '@/features/create-assessment/QuestionCard';
import type { ItemBankItem, SelectedQuestion } from '@/models';

// FR-CA-010 / SC-003 / SC-009
const item: ItemBankItem = {
  itemId: 'NEX-GMB-001',
  domainId: 'D1',
  domainName: 'Character & Work Style',
  dimensionId: 'D1-CE',
  dimensionName: 'Conscientious Execution',
  facetId: 'D1-CE-DEP',
  facetName: 'Dependability',
  methodFamily: 'likert',
  itemFormat: 'statement',
  itemText: 'I keep my commitments.',
  options: {},
  keyedAnswer: null,
  responseScale: '1-5 Agreement',
  bankState: 'production',
  useStatus: 'operational_allowed',
  reviewStatus: 'draft',
  jobLevelOverlay: 'all_levels',
  reverseScored: false,
};
const selected: SelectedQuestion = {
  item,
  requirementCovered: 'Conscientious Execution',
  selectionReason: 'Covers required dimension',
  approved: false,
};

describe('QuestionCard provenance (FR-CA-010, SC-003)', () => {
  it('shows source id, metadata and trust badges', () => {
    render(<QuestionCard selected={selected} />);
    expect(screen.getByText('NEX-GMB-001')).toBeInTheDocument();
    expect(screen.getByText('Selected From Governed Bank')).toBeInTheDocument();
    expect(screen.getByText(/Scoring Logic Locked/)).toBeInTheDocument();
    expect(screen.getByText('likert')).toBeInTheDocument();
  });

  it('never shows fabricated fields or a live score (SC-003/SC-009)', () => {
    render(<QuestionCard selected={selected} />);
    expect(screen.queryByText(/weight/i)).toBeNull();
    expect(screen.queryByText(/difficulty/i)).toBeNull();
    expect(screen.queryByText(/score:/i)).toBeNull();
  });
});
