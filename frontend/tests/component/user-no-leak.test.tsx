import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AssessmentRuntime } from '@/features/runtime/AssessmentRuntime';
import { UserDashboard } from '@/features/pages';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { setMockFailRate } from '@/services/http';

// Spec 006 / US4 / SC-004/008 — no score or Admin-only/internal data leaks into User screens.
const FORBIDDEN = [
  /score/i,
  /scoring version/i,
  /derailment/i,
  /standard error/i,
  /\bweight\b/i,
  /do not hire/i,
  /recommend reject/i,
];

describe('User screens leak guard (Spec 006 / US4)', () => {
  beforeEach(() => {
    setMockFailRate(0);
    localStorage.clear();
  });

  it('the runtime shows no live score or internal metadata', async () => {
    render(
      <LocaleProvider>
        <MemoryRouter initialEntries={['/app/assessments/AS-RUNTIME/run']}>
          <Routes>
            <Route path="/app/assessments/:assessmentId/run" element={<AssessmentRuntime />} />
          </Routes>
        </MemoryRouter>
      </LocaleProvider>,
    );
    await screen.findByText(/plan my work tasks/i);
    for (const re of FORBIDDEN) expect(screen.queryByText(re)).toBeNull();
  });

  it('the dashboard shows no score or Admin-only data', async () => {
    render(
      <LocaleProvider>
        <MemoryRouter initialEntries={['/app/dashboard']}>
          <Routes>
            <Route path="/app/dashboard" element={<UserDashboard />} />
          </Routes>
        </MemoryRouter>
      </LocaleProvider>,
    );
    await waitFor(() => expect(screen.getByText('Welcome back')).toBeInTheDocument());
    for (const re of FORBIDDEN) expect(screen.queryByText(re)).toBeNull();
  });
});
