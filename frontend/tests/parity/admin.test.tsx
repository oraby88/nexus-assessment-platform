import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { AdminDashboard } from '@/features/dashboard/AdminDashboard';
import { resetState } from '../_helpers/reset';

// Spec 012 / US2 (FR-PAR-004). Admin dashboard parity: KPI cards carry tone-colored icon badges
// matching app/admin_dashboard.jsx (was plain label+number). Structural assertion.
describe('Admin dashboard parity (Spec 012 / US2)', () => {
  beforeEach(resetState);

  it('renders KPI cards with icon badges after data loads', async () => {
    const { container } = render(
      <LocaleProvider>
        <MemoryRouter>
          <Routes>
            <Route path="*" element={<AdminDashboard />} />
          </Routes>
        </MemoryRouter>
      </LocaleProvider>,
    );
    // KPI labels render once the mock services resolve.
    await screen.findByText('Total Users');
    await waitFor(() => expect(screen.getByText('Active Assessments')).toBeInTheDocument());
    // Each of the 8 KPI cards renders an icon badge (svg).
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(8);
  });
});
