import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PrivacyInbox } from '@/features/privacy/PrivacyInbox';
import { consentStore } from '@/services/consentStore';
import { setMockFailRate } from '@/services/http';

function renderInbox() {
  return render(
    <MemoryRouter>
      <PrivacyInbox />
    </MemoryRouter>,
  );
}

// Spec 007 / US1 — inbox lists requests; reject requires a reason.
describe('PrivacyInbox (Spec 007 / US1)', () => {
  beforeEach(() => {
    setMockFailRate(0);
    localStorage.clear();
    consentStore.__resetForTest();
  });

  it('lists pending deletion requests with actions', async () => {
    renderInbox();
    await screen.findByText('Privacy Requests');
    // Seeded requests render with a status chip and resolution actions.
    expect(await screen.findAllByText('Submitted')).not.toHaveLength(0);
    expect(screen.getAllByRole('button', { name: /^complete$/i }).length).toBeGreaterThan(0);
  });

  it('requires a reason before a rejection can be confirmed', async () => {
    renderInbox();
    await screen.findByText('Privacy Requests');
    fireEvent.click(screen.getAllByRole('button', { name: /^reject$/i })[0]);
    const confirm = await screen.findByRole('button', { name: /confirm reject/i });
    expect(confirm).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/reason for rejection/i), {
      target: { value: 'Out of scope' },
    });
    await waitFor(() => expect(confirm).not.toBeDisabled());
  });
});
