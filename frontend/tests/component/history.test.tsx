import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AssessmentHistory } from '@/features/history/AssessmentHistory';
import { setMockFailRate } from '@/services/http';

// FR-RPT-008/009 / SC-006
describe('AssessmentHistory (FR-RPT-008)', () => {
  beforeEach(() => setMockFailRate(0));

  it('shows separate Lifecycle and Validity columns plus version columns', async () => {
    render(
      <MemoryRouter>
        <AssessmentHistory />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByText('Lifecycle')).toBeInTheDocument());
    expect(screen.getByText('Validity')).toBeInTheDocument();
    expect(screen.getByText('Blueprint v')).toBeInTheDocument();
    expect(screen.getByText('Context v')).toBeInTheDocument();
  });
});
