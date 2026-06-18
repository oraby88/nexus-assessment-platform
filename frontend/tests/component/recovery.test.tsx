import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ForgotPassword, ResetPassword, InvitationAccess } from '@/features/auth';
import { SessionProvider } from '@/hooks';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { setMockFailRate } from '@/services/http';

function renderAt(path: string, element: React.ReactNode) {
  return render(
    <LocaleProvider>
      <MemoryRouter initialEntries={[path]}>
        <SessionProvider>
          <Routes>
            <Route path="/forgot-password" element={element} />
            <Route path="/reset-password" element={element} />
            <Route path="/invitation" element={element} />
            <Route path="/login" element={<div>LOGIN</div>} />
          </Routes>
        </SessionProvider>
      </MemoryRouter>
    </LocaleProvider>,
  );
}

// Spec 007 / US2 — recovery flow + expired states.
describe('Account recovery (Spec 007 / US2)', () => {
  beforeEach(() => {
    setMockFailRate(0);
    localStorage.clear();
  });

  it('forgot-password shows a neutral confirmation (no enumeration)', async () => {
    renderAt('/forgot-password', <ForgotPassword />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.co' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    await screen.findByText(/if an account exists/i);
  });

  it('reset screen shows an invalid-link state for an expired token', async () => {
    renderAt('/reset-password?token=expired', <ResetPassword />);
    await screen.findByText(/reset link invalid/i);
    expect(screen.getByRole('button', { name: /request a new link/i })).toBeInTheDocument();
  });

  it('reset screen blocks weak/mismatched passwords for a valid token', async () => {
    renderAt('/reset-password?token=valid-demo', <ResetPassword />);
    await screen.findByLabelText('New password');
    fireEvent.change(screen.getByLabelText('New password'), { target: { value: 'short' } });
    fireEvent.change(screen.getByLabelText('Confirm new password'), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /update password/i }));
    await screen.findByText(/at least 8 characters/i);
  });

  it('invitation screen renders a clear expired state', async () => {
    renderAt('/invitation?state=expired', <InvitationAccess />);
    await screen.findByText(/invitation expired/i);
  });
});
