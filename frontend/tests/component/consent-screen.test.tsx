import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Consent } from '@/features/assessments/user/Consent';
import { consentStore } from '@/services/consentStore';
import { setMockFailRate } from '@/services/http';

function renderConsent() {
  return render(
    <MemoryRouter initialEntries={['/app/assessments/AS-RUNTIME/consent']}>
      <Routes>
        <Route path="/app/assessments/:assessmentId/consent" element={<Consent />} />
        <Route
          path="/app/assessments/:assessmentId/instructions"
          element={<div>INSTRUCTIONS</div>}
        />
        <Route path="/app/dashboard" element={<div>DASH</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

// Spec 006 / US3 — Accept-and-Continue is gated on the required consent; optional are clearly optional.
describe('Consent screen (Spec 006 / US3)', () => {
  beforeEach(() => {
    setMockFailRate(0);
    localStorage.clear();
    consentStore.__resetForTest();
  });

  it('disables Accept and Continue until the required consent is checked (SC-005)', async () => {
    renderConsent();
    await screen.findByText('Pre-hire screening');
    const accept = screen.getByRole('button', { name: /accept and continue/i });
    expect(accept).toBeDisabled();
    fireEvent.click(screen.getByLabelText(/I consent \(required to continue\)/i));
    await waitFor(() => expect(accept).not.toBeDisabled());
  });

  it('shows only applicable consents (no third-party sharing offered here)', async () => {
    renderConsent();
    await screen.findByText('Pre-hire screening');
    expect(screen.getByText('Anonymised research')).toBeInTheDocument();
    expect(screen.queryByText(/third.party/i)).toBeNull();
  });
});
