import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { AdminLogin, ForgotPassword, ResetPassword } from '@/features/auth';
import { renderRoute, resetAll, axeConfig } from '../helpers/render';

// Spec 008 / US3 — sign-in/recovery flow: zero critical axe violations + keyboard operability.
describe('A11y: auth & recovery (Spec 008 / US3)', () => {
  beforeEach(() => resetAll());

  it('AdminLogin has no axe violations and labelled controls', async () => {
    const { container } = renderRoute(<AdminLogin />, { path: '/login', route: '/login' });
    expect(await axe(container, axeConfig)).toHaveNoViolations();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('ForgotPassword has no axe violations', async () => {
    const { container } = renderRoute(<ForgotPassword />, {
      path: '/forgot-password',
      route: '/forgot-password',
    });
    expect(await axe(container, axeConfig)).toHaveNoViolations();
  });

  it('ResetPassword (valid token) has no axe violations', async () => {
    const { container } = renderRoute(<ResetPassword />, {
      path: '/reset-password?token=valid-demo',
      route: '/reset-password',
    });
    await screen.findByLabelText('New password');
    expect(await axe(container, axeConfig)).toHaveNoViolations();
  });
});
