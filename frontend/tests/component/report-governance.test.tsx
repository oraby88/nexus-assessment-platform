import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AdminReport } from '@/features/reports/AdminReport';
import { setMockFailRate } from '@/services/http';

// SC-001/004 cross-surface: blocked values appear only as omission explanations, never as data.
describe('report governance — blocked never shown as data', () => {
  beforeEach(() => setMockFailRate(0));

  it('a blocked Derailment Risk is surfaced as an omission explanation', async () => {
    render(
      <MemoryRouter initialEntries={['/admin/reports/RPT-003']}>
        <Routes>
          <Route path="/admin/reports/:reportId" element={<AdminReport />} />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByText(/Blocked value/)).toBeInTheDocument());
    // The Domain 6 section restates that Derailment Risk is blocked (explanation, not a value).
    expect(screen.getByText(/Derailment Risk is blocked/)).toBeInTheDocument();
  });
});
