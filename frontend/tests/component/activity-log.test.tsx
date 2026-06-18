import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ActivityLog } from '@/features/activity/ActivityLog';
import { setMockFailRate } from '@/services/http';

function renderLog() {
  return render(
    <MemoryRouter>
      <ActivityLog />
    </MemoryRouter>,
  );
}

// Spec 007 / US3 — renders curated events; filters narrow; framed as a prototype read view.
describe('ActivityLog (Spec 007 / US3)', () => {
  beforeEach(() => setMockFailRate(0));

  it('renders events and the prototype-read-view framing', async () => {
    renderLog();
    await screen.findByText('Activity Log');
    expect(screen.getByText('Prototype read view')).toBeInTheDocument();
    expect(await screen.findByText(/sent assessment/i)).toBeInTheDocument();
  });

  it('narrows the list when a type filter is applied', async () => {
    renderLog();
    await screen.findByText(/sent assessment/i);
    fireEvent.change(screen.getByLabelText(/filter by type/i), { target: { value: 'Consent' } });
    await waitFor(() => expect(screen.queryByText(/sent assessment/i)).toBeNull());
    expect(screen.getByText(/revoked consent/i)).toBeInTheDocument();
  });
});
