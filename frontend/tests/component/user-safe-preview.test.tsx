import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { UserSafePreview } from '@/features/reports/UserSafePreview';
import { setMockFailRate } from '@/services/http';

// FR-RPT-004 / SC-004
describe('UserSafePreview (FR-RPT-004)', () => {
  beforeEach(() => setMockFailRate(0));

  it('shows supportive content and no internal/scoring fields', async () => {
    render(
      <MemoryRouter initialEntries={['/admin/reports/RPT-001/user-preview']}>
        <Routes>
          <Route path="/admin/reports/:reportId/user-preview" element={<UserSafePreview />} />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByText('Your strengths')).toBeInTheDocument());
    expect(screen.getByText('Where you can grow')).toBeInTheDocument();
    // Internal/scoring details must not leak into the user view:
    expect(screen.queryByText(/score-v/)).toBeNull();
    expect(screen.queryByText(/synth-v/)).toBeNull();
    expect(screen.queryByText(/PDRI/)).toBeNull();
  });
});
