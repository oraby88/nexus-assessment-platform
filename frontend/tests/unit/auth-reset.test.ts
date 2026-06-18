import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from '@/services/auth/authService';
import { setMockFailRate } from '@/services/http';

// Spec 007 / US2 — mock reset token states + no-enumeration forgot.
describe('authService reset (Spec 007 / US2)', () => {
  beforeEach(() => setMockFailRate(0));

  it('classifies reset tokens (valid / expired / missing)', async () => {
    expect(await authService.verifyResetToken('valid-demo')).toBe('valid');
    expect(await authService.verifyResetToken('')).toBe('missing');
    expect(await authService.verifyResetToken('expired')).toBe('expired');
    expect(await authService.verifyResetToken('used')).toBe('expired');
  });

  it('resetPassword resolves ok (mock, no real credential change)', async () => {
    expect(await authService.resetPassword('valid-demo', 'sup3rsecret')).toEqual({ ok: true });
  });

  it('requestReset returns the same result for any email (no account enumeration, SC-003)', async () => {
    const a = await authService.requestReset('known@meridian.co');
    const b = await authService.requestReset('nobody@nowhere.example');
    expect(a).toEqual(b);
    expect(a).toEqual({ ok: true });
  });
});
