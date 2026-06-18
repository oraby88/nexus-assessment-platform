import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import type { Role } from '@/models';
import { SessionProvider } from '@/hooks';
import { RequireRole } from '@/components/layout';
import { StorageKeys, writeKey } from '@/services/persistence';

// SC-001: role-based guards redirect by session/role and never leak the other role's content.
function renderAt(path: string, sessionRole?: Role) {
  if (sessionRole) {
    writeKey(StorageKeys.session, {
      role: sessionRole,
      userId: 'u1',
      name: 'Test',
      email: 't@example.com',
      organizationId: 'org',
      organizationName: 'Org',
    });
  }
  return render(
    <MemoryRouter initialEntries={[path]}>
      <SessionProvider>
        <Routes>
          <Route path="/login" element={<div>LOGIN</div>} />
          <Route path="/invitation" element={<div>INVITE</div>} />
          <Route path="/access-denied" element={<div>DENIED</div>} />
          <Route
            path="/admin"
            element={
              <RequireRole role="admin">
                <div>ADMIN OK</div>
              </RequireRole>
            }
          />
          <Route
            path="/app"
            element={
              <RequireRole role="user">
                <div>USER OK</div>
              </RequireRole>
            }
          />
        </Routes>
      </SessionProvider>
    </MemoryRouter>,
  );
}

describe('route guards (SC-001, constitution III)', () => {
  beforeEach(() => localStorage.clear());

  it('no session → /admin redirects to login', () => {
    renderAt('/admin');
    expect(screen.getByText('LOGIN')).toBeInTheDocument();
    expect(screen.queryByText('ADMIN OK')).toBeNull();
  });

  it('no session → /app redirects to invitation', () => {
    renderAt('/app');
    expect(screen.getByText('INVITE')).toBeInTheDocument();
    expect(screen.queryByText('USER OK')).toBeNull();
  });

  it('user session on /admin is denied (no admin content)', () => {
    renderAt('/admin', 'user');
    expect(screen.getByText('DENIED')).toBeInTheDocument();
    expect(screen.queryByText('ADMIN OK')).toBeNull();
  });

  it('admin session on /app is denied (no user content)', () => {
    renderAt('/app', 'admin');
    expect(screen.getByText('DENIED')).toBeInTheDocument();
    expect(screen.queryByText('USER OK')).toBeNull();
  });

  it('matching role renders the protected content', () => {
    renderAt('/admin', 'admin');
    expect(screen.getByText('ADMIN OK')).toBeInTheDocument();
  });
});
