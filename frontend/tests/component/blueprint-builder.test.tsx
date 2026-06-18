import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BlueprintBuilder } from '@/features/blueprints/BlueprintBuilder';
import { setMockFailRate } from '@/services/http';

// FR-BC-003/004 / SC-002
describe('BlueprintBuilder dimension cycling (FR-BC-003)', () => {
  beforeEach(() => setMockFailRate(0));

  it('cycles a dimension Required → Optional → Excluded and shows importance when required', async () => {
    render(
      <MemoryRouter>
        <BlueprintBuilder />
      </MemoryRouter>,
    );
    // Advance to the Dimensions step (Role → Success → Dimensions).
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.click(screen.getByText('Continue'));
    // Catalog loads from the item_bank — each dimension is a tone-coloured selection card (button).
    const card = await waitFor(() =>
      screen.getByRole('button', { name: /Conscientious Execution/ }),
    );
    expect(card).not.toHaveTextContent(/required|optional|excluded/i);

    fireEvent.click(card);
    expect(screen.getByRole('button', { name: /Conscientious Execution/ })).toHaveTextContent(
      /required/i,
    );
    // Importance control appears in the dedicated section for required dimensions.
    expect(screen.getByLabelText(/Importance for D1-CE/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Conscientious Execution/ }));
    expect(screen.getByRole('button', { name: /Conscientious Execution/ })).toHaveTextContent(
      /optional/i,
    );

    fireEvent.click(screen.getByRole('button', { name: /Conscientious Execution/ }));
    expect(screen.getByRole('button', { name: /Conscientious Execution/ })).toHaveTextContent(
      /excluded/i,
    );
  });
});
