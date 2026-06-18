import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@/providers';
import { CreateAssessmentWizard } from '@/features/create-assessment/CreateAssessmentWizard';
import { setMockFailRate } from '@/services/http';

// Spec 012 / US4 (FR-PAR-004). Create-Assessment parity: Step 1 renders the design's StepHead +
// searchable candidate card grid matching app/create_assessment.jsx. The transform sequence's
// skippable + reduced-motion behaviour is covered by transform-sequence.test.tsx.
describe('Create-Assessment wizard parity (Spec 012 / US4)', () => {
  beforeEach(() => setMockFailRate(0));

  it('renders the Step 1 StepHead + candidate card grid + search', async () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <CreateAssessmentWizard />
        </ThemeProvider>
      </MemoryRouter>,
    );
    // Design StepHead replaces the old "Step 1 — Select User" heading.
    await screen.findByText('Who is being assessed?');
    expect(screen.getByPlaceholderText('Search candidates…')).toBeInTheDocument();
    // Candidate cards render from the mock participant list.
    await waitFor(() => expect(screen.getByText('Amara Okonkwo')).toBeInTheDocument());
  });
});
