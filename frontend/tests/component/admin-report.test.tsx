import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AdminReport } from '@/features/reports/AdminReport';
import { setMockFailRate } from '@/services/http';

// FR-RPT-002 / SC-001/002
function renderReport(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/admin/reports/${id}`]}>
      <Routes>
        <Route path="/admin/reports/:reportId" element={<AdminReport />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('AdminReport (FR-RPT-002)', () => {
  beforeEach(() => setMockFailRate(0));

  it('always shows the no-automatic-decision disclaimer and a version footer', async () => {
    renderReport('RPT-001');
    await waitFor(() => expect(screen.getByText(/one input among many/i)).toBeInTheDocument());
    expect(screen.getByText(/Scoring score-v/)).toBeInTheDocument();
  });

  it('shows omitted/blocked sections as explanations, not values', async () => {
    renderReport('RPT-003'); // has omitted section + blocked Derailment Risk
    await waitFor(() => expect(screen.getByText(/Omitted Sections/)).toBeInTheDocument());
    expect(screen.getByText(/Blocked value/)).toBeInTheDocument(); // Derailment shown as omission explanation, not a value
  });
});
