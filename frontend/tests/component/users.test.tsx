import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UsersList } from '@/features/users/UsersList';
import { setMockFailRate } from '@/services/http';

// FR-ADM-002 / SC-001
function renderList() {
  return render(
    <MemoryRouter>
      <UsersList />
    </MemoryRouter>,
  );
}

describe('UsersList (FR-ADM-002)', () => {
  beforeEach(() => setMockFailRate(0));

  it('renders seeded users after the service resolves', async () => {
    renderList();
    await waitFor(() => expect(screen.getByText('Amara Okonkwo')).toBeInTheDocument());
  });

  it('filters by search', async () => {
    renderList();
    await waitFor(() => expect(screen.getByText('Amara Okonkwo')).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText('Search users'), { target: { value: 'grace' } });
    await waitFor(() => expect(screen.getByText('Grace Mensah')).toBeInTheDocument());
    expect(screen.queryByText('Amara Okonkwo')).toBeNull();
  });

  it('opens the Add User drawer', async () => {
    renderList();
    await waitFor(() => expect(screen.getByText('Amara Okonkwo')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Add User'));
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
  });

  it('shows an empty state when nothing matches', async () => {
    renderList();
    await waitFor(() => expect(screen.getByText('Amara Okonkwo')).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText('Search users'), { target: { value: 'zzzznomatch' } });
    await waitFor(() => expect(screen.getByText('No users match')).toBeInTheDocument());
  });
});
