import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@/providers';
import { CreateAssessmentWizard } from '@/features/create-assessment/CreateAssessmentWizard';
import { setMockFailRate } from '@/services/http';

// FR-CA-001/002/014 / SC-006: wizard mounts, step 1 gates Next until a user is selected.
function renderWizard() {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <CreateAssessmentWizard />
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe('CreateAssessmentWizard (FR-CA-001/002)', () => {
  beforeEach(() => {
    localStorage.clear();
    setMockFailRate(0);
  });

  it('mounts at Step 1 and gates Next until a user is selected', async () => {
    renderWizard();
    await waitFor(() => expect(screen.getByText('Who is being assessed?')).toBeInTheDocument());
    const next = screen.getByText('Continue') as HTMLButtonElement;
    expect(next).toBeDisabled();

    await waitFor(() => expect(screen.getByText('Amara Okonkwo')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Amara Okonkwo'));
    expect((screen.getByText('Continue') as HTMLButtonElement).disabled).toBe(false);
  });

  it('advances to Step 2 (Purpose) after selecting a user', async () => {
    renderWizard();
    await waitFor(() => expect(screen.getByText('Amara Okonkwo')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Amara Okonkwo'));
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() =>
      expect(screen.getByText('What is this assessment for?')).toBeInTheDocument(),
    );
  });
});
