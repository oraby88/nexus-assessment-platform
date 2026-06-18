// Mock auth (constitution I: no real auth). Admin sign-in + permanent User account in V1:
// activate-from-invitation (set password on first access) and sign-in to return.
import type { Session } from '@/models';
import { mockRequest } from '@/services/http';
import { StorageKeys, readKey, writeKey, removeKey } from '@/services/persistence';
import type { AuthServiceContract } from '@/services/contracts';

const ORG = { id: 'org-meridian', name: 'Meridian' };

function persist(session: Session): Session {
  writeKey(StorageKeys.session, session);
  return session;
}

export const authService = {
  getSession(): Session | null {
    return readKey<Session | null>(StorageKeys.session, null);
  },

  async loginAdmin(email: string): Promise<Session> {
    return mockRequest(() =>
      persist({
        role: 'admin',
        userId: 'admin-1',
        name: 'Jordan Avery',
        email: email || 'admin@meridian.co',
        organizationId: ORG.id,
        organizationName: ORG.name,
      }),
    );
  },

  /** First access from an invitation: the User sets a password and the account is activated. */
  async activateInvitation(code: string, _password: string): Promise<Session> {
    return mockRequest(() =>
      persist({
        role: 'user',
        userId: `user-${code || 'amara'}`,
        name: 'Amara Okonkwo',
        email: 'amara.okonkwo@meridian.co',
        organizationId: ORG.id,
        organizationName: ORG.name,
      }),
    );
  },

  /** Returning User signs in to their permanent account. */
  async loginUser(email: string): Promise<Session> {
    return mockRequest(() =>
      persist({
        role: 'user',
        userId: 'user-amara',
        name: 'Amara Okonkwo',
        email: email || 'amara.okonkwo@meridian.co',
        organizationId: ORG.id,
        organizationName: ORG.name,
      }),
    );
  },

  /** Forgot-password (mock): always resolves the same regardless of email (no account enumeration). */
  async requestReset(_email: string): Promise<{ ok: true }> {
    return mockRequest({ ok: true } as const);
  },

  /** Verify the mock reset token from the reset URL's ?token= (Spec 007 / research D1). */
  async verifyResetToken(token: string): Promise<'valid' | 'expired' | 'missing'> {
    return mockRequest<'valid' | 'expired' | 'missing'>(() => {
      if (!token) return 'missing';
      if (token === 'expired' || token === 'used') return 'expired';
      return 'valid';
    });
  },

  /** Mock password reset — returns ok for a valid token; performs NO real credential change. */
  async resetPassword(_token: string, _password: string): Promise<{ ok: true }> {
    return mockRequest({ ok: true } as const);
  },

  logout(): void {
    removeKey(StorageKeys.session);
  },
} satisfies AuthServiceContract;
