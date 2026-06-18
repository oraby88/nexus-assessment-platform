import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AssessmentRuntime } from '@/features/runtime/AssessmentRuntime';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { setMockFailRate } from '@/services/http';

function renderRuntime() {
  return render(
    <LocaleProvider>
      <MemoryRouter initialEntries={['/app/assessments/AS-RUNTIME/run']}>
        <Routes>
          <Route path="/app/assessments/:assessmentId/run" element={<AssessmentRuntime />} />
        </Routes>
      </MemoryRouter>
    </LocaleProvider>,
  );
}

// Spec 006 / US2 — free back-navigation restores a prior answer; editing re-stores it.
describe('runtime back-navigation (Spec 006 / US2)', () => {
  beforeEach(() => {
    setMockFailRate(0);
    localStorage.clear();
  });

  it('returns to a prior question with its answer still selected, and allows changing it', async () => {
    renderRuntime();
    await screen.findByText(/plan my work tasks/i);

    // Answer Q1 and advance.
    fireEvent.click(screen.getByRole('radio', { name: 'Strongly agree' }));
    await waitFor(() => expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled());
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Now on Q2 (frequency).
    await screen.findByText(/priorities shift unexpectedly/i);

    // Go Back to Q1 — the prior answer is restored (still checked).
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    await screen.findByText(/plan my work tasks/i);
    await waitFor(() =>
      expect(
        (screen.getByRole('radio', { name: 'Strongly agree' }) as HTMLInputElement).checked,
      ).toBe(true),
    );

    // Change the answer (free edit on back-nav).
    fireEvent.click(screen.getByRole('radio', { name: 'Disagree' }));
    await waitFor(() =>
      expect((screen.getByRole('radio', { name: 'Disagree' }) as HTMLInputElement).checked).toBe(
        true,
      ),
    );
  });
});
