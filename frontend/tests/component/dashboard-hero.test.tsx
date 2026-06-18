import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { UserDashboard } from '@/features/pages';
import { setMockFailRate } from '@/services/http';

function renderDashboard() {
  return render(
    <LocaleProvider>
      <MemoryRouter initialEntries={['/app/dashboard']}>
        <Routes>
          <Route path="/app/dashboard" element={<UserDashboard />} />
          <Route path="/app/assessments/:assessmentId/overview" element={<div>OVERVIEW</div>} />
        </Routes>
      </MemoryRouter>
    </LocaleProvider>,
  );
}

// Spec 006 / US6 — the dashboard surfaces an active-assessment hero + completed/reports/notifications.
describe('UserDashboard hero (Spec 006 / US6)', () => {
  beforeEach(() => {
    setMockFailRate(0);
    localStorage.clear();
  });

  it('shows the active-assessment hero with a continue action', async () => {
    renderDashboard();
    await screen.findByText('Active assessment');
    expect(screen.getByText('Finance Manager')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start assessment/i })).toBeInTheDocument();
    // Periphery panels present.
    expect(screen.getByText('Completed Assessments')).toBeInTheDocument();
    expect(screen.getByText('Available Reports')).toBeInTheDocument();
  });
});
