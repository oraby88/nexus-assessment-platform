import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AssessmentsList } from '@/features/assessments/AssessmentsList';
import { setMockFailRate } from '@/services/http';

// FR-ADM-006 / SC-003: lifecycle and validity are separate columns.
describe('AssessmentsList (FR-ADM-006)', () => {
  beforeEach(() => setMockFailRate(0));

  it('renders assessments with separate Lifecycle and Validity columns', async () => {
    render(
      <MemoryRouter>
        <AssessmentsList />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByText('Finance Manager')).toBeInTheDocument());
    // Distinct column headers prove lifecycle/validity are not conflated.
    expect(screen.getByText('Lifecycle')).toBeInTheDocument();
    expect(screen.getByText('Validity')).toBeInTheDocument();
    expect(screen.getByText('Report')).toBeInTheDocument();
  });
});
