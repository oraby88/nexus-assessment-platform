import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Comparison } from '@/features/comparison/Comparison';
import { setMockFailRate } from '@/services/http';

// FR-RPT-007 / SC-005
describe('Comparison (FR-RPT-007 — no ranking/auto-decision)', () => {
  beforeEach(() => setMockFailRate(0));

  it('builds a side-by-side grid with a disclaimer and no ranking language', async () => {
    render(
      <MemoryRouter>
        <Comparison />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByText('Amara Okonkwo')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Amara Okonkwo')); // RPT-001 released
    fireEvent.click(screen.getByText('Grace Mensah')); // RPT-004 released
    fireEvent.click(screen.getByText('Compare'));

    await waitFor(() =>
      expect(screen.getByText(/one input among many requiring human review/i)).toBeInTheDocument(),
    );
    // No leaderboard/positional-ranking UI (the disclaimer itself negates "rank/shortlist", so we
    // check for ranking artifacts rather than those words):
    expect(screen.queryByText(/leaderboard/i)).toBeNull();
    expect(screen.queryByText(/#1|1st place|podium/i)).toBeNull();
  });
});
