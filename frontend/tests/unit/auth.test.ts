import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from '@/services/auth/authService';
import { setMockFailRate } from '@/services/http';

// FR-FND-010: mock auth — Admin sign-in + permanent User account (activate + return sign-in).
describe('authService session lifecycle (FR-FND-010)', () => {
  beforeEach(() => {
    localStorage.clear();
    setMockFailRate(0);
  });

  it('has no session until sign-in', () => {
    expect(authService.getSession()).toBeNull();
  });

  it('admin sign-in establishes and persists an admin session', async () => {
    const s = await authService.loginAdmin('admin@meridian.co');
    expect(s.role).toBe('admin');
    expect(authService.getSession()?.role).toBe('admin');
  });

  it('invitation activation establishes a permanent user session', async () => {
    const s = await authService.activateInvitation('code', 'pw');
    expect(s.role).toBe('user');
    expect(authService.getSession()?.role).toBe('user');
  });

  it('returning user sign-in establishes a user session', async () => {
    const s = await authService.loginUser('amara@meridian.co');
    expect(s.role).toBe('user');
  });

  it('logout clears the session', async () => {
    await authService.loginAdmin('admin@meridian.co');
    authService.logout();
    expect(authService.getSession()).toBeNull();
  });
});
