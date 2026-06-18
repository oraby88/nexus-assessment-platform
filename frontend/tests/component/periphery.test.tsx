import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotificationsInbox } from '@/features/notifications/NotificationsInbox';
import { ExportsCenter } from '@/features/exports/ExportsCenter';
import { setMockFailRate } from '@/services/http';

describe('NotificationsInbox (FR-ADM-008)', () => {
  beforeEach(() => setMockFailRate(0));
  it('renders notifications and supports mark-all-read', async () => {
    render(
      <MemoryRouter>
        <NotificationsInbox />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByText('Report released')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Mark all as read'));
    // Unread count lives in the All/Unread filter chip; mark-all drives it to zero.
    await waitFor(() => expect(screen.getByText('Unread (0)')).toBeInTheDocument());
  });
});

describe('ExportsCenter (FR-ADM-009)', () => {
  beforeEach(() => setMockFailRate(0));
  it('shows active exports and pending entries for 004/005', async () => {
    render(
      <MemoryRouter>
        <ExportsCenter />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByText('Users')).toBeInTheDocument());
    // Two active types → at least two "Export CSV" buttons; five pending chips.
    expect(screen.getAllByText('Export CSV').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/Pending \(Spec/).length).toBe(5);
  });
});
