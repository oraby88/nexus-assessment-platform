import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SessionProvider } from '@/hooks';
import { RequireRole } from '@/components/layout';
import { UsersList } from '@/features/users/UsersList';
import { StorageKeys, writeKey } from '@/services/persistence';

// SC-009 / FR-ADM-012: Admin Core screens/data must never render under a User session.
describe('Admin data isolation (SC-009)', () => {
  beforeEach(() => localStorage.clear());

  it('a User session cannot reach the Admin Users screen', async () => {
    writeKey(StorageKeys.session, {
      role: 'user',
      userId: 'u1',
      name: 'Test User',
      email: 'u@example.com',
      organizationId: 'org',
      organizationName: 'Org',
    });
    render(
      <MemoryRouter initialEntries={['/admin/users']}>
        <SessionProvider>
          <Routes>
            <Route path="/access-denied" element={<div>DENIED</div>} />
            <Route
              path="/admin/users"
              element={
                <RequireRole role="admin">
                  <UsersList />
                </RequireRole>
              }
            />
          </Routes>
        </SessionProvider>
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByText('DENIED')).toBeInTheDocument());
    // No Admin roster data leaked.
    expect(screen.queryByText('Amara Okonkwo')).toBeNull();
    expect(screen.queryByText('Add User')).toBeNull();
  });
});
