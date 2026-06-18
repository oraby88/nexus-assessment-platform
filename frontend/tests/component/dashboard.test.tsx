import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { AdminDashboard } from '@/features/dashboard/AdminDashboard';
import { setMockFailRate } from '@/services/http';

// FR-ADM-001 / SC-005
function renderDashboard() {
  return render(
    <LocaleProvider>
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<div>USERS PAGE</div>} />
        </Routes>
      </MemoryRouter>
    </LocaleProvider>,
  );
}

describe('AdminDashboard (FR-ADM-001)', () => {
  beforeEach(() => setMockFailRate(0));

  it('renders KPIs and sections via services', async () => {
    renderDashboard();
    await waitFor(() => expect(screen.getByText('Total Users')).toBeInTheDocument());
    expect(screen.getByText('Reports With Caution')).toBeInTheDocument();
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
  });

  it('quick actions navigate to the correct route', async () => {
    renderDashboard();
    await waitFor(() => expect(screen.getByText('Quick Actions')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Add User'));
    await waitFor(() => expect(screen.getByText('USERS PAGE')).toBeInTheDocument());
  });
});
