import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { UserReport } from '@/features/reports/user/UserReport';
import { setMockFailRate } from '@/services/http';

function renderReport(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/app/reports/${id}`]}>
      <Routes>
        <Route path="/app/reports/:reportId" element={<UserReport />} />
        <Route path="/app/reports" element={<div>LIST</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

// Spec 006 / US5 — supportive user-safe content + simulated PDF; no restricted content.
describe('UserReport (Spec 006 / US5)', () => {
  beforeEach(() => setMockFailRate(0));

  it('shows supportive sections and a PDF action, with no restricted content', async () => {
    renderReport('RPT-001');
    await screen.findByText('Your strengths');
    expect(screen.getByText(/Where you can grow/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
    // No restricted/internal leakage in the rendered report.
    expect(screen.queryByText(/Derailment/i)).toBeNull();
    expect(screen.queryByText(/scoring version/i)).toBeNull();
    expect(screen.queryByText(/do not hire/i)).toBeNull();
  });
});
