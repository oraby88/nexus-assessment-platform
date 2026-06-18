import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { UserDashboard } from '@/features/pages';
import { resetState } from '../_helpers/reset';

// Spec 012 / US3 (FR-PAR-004). User-portal dashboard parity: the dark active-assessment hero +
// two-panel rail (Completed Assessments / Available Reports / Recent Notifications) matching
// app/user_portal.jsx UDashboard. Structural assertion.
describe('User dashboard parity (Spec 012 / US3)', () => {
  beforeEach(resetState);

  it('renders the welcome hero + portal panels with icon badges', async () => {
    const { container } = render(
      <LocaleProvider>
        <MemoryRouter>
          <UserDashboard />
        </MemoryRouter>
      </LocaleProvider>,
    );
    // Heading renders once the mock summaries resolve (loading skeleton clears).
    await screen.findByText('Welcome back');
    await waitFor(() => expect(screen.getByText('Completed Assessments')).toBeInTheDocument());
    expect(screen.getByText('Available Reports')).toBeInTheDocument();
    expect(screen.getByText('Recent Notifications')).toBeInTheDocument();
    // Hero + panel rows carry icon badges (svg).
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(1);
  });
});
