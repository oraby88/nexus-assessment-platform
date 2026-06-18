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
          <Route path="/app/dashboard" element={<div>DASH</div>} />
          <Route path="/app/assessments/:assessmentId/complete" element={<div>DONE</div>} />
        </Routes>
      </MemoryRouter>
    </LocaleProvider>,
  );
}

// Spec 006 / US1 — runtime renders, gates Next, auto-saves, shows no live score.
describe('AssessmentRuntime (Spec 006 / US1)', () => {
  beforeEach(() => {
    setMockFailRate(0);
    localStorage.clear();
  });

  it('renders the first question, shows no live score, and gates Next until answered', async () => {
    renderRuntime();
    await screen.findByText(/plan my work tasks/i);
    expect(screen.queryByText(/score/i)).toBeNull();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /save & exit/i })).toBeInTheDocument();
  });

  it('enables Next after answering and shows a saved indicator (auto-save)', async () => {
    renderRuntime();
    await screen.findByText(/plan my work tasks/i);
    fireEvent.click(screen.getByRole('radio', { name: 'Strongly agree' }));
    await waitFor(() => expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled());
    await screen.findByText(/Saved/i);
  });
});
