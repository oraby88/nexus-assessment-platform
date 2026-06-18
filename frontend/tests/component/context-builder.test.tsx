import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContextBuilder } from '@/features/contexts/ContextBuilder';
import { setMockFailRate } from '@/services/http';

// FR-BC-009 / SC-004: the live signature/summary updates on every control change.
describe('ContextBuilder live signature (FR-BC-009)', () => {
  beforeEach(() => setMockFailRate(0));

  it('updates the plain-language summary when a slider changes', () => {
    render(
      <MemoryRouter>
        <ContextBuilder />
      </MemoryRouter>,
    );
    // Raise Time Pressure to the max → it becomes a top factor in the summary paragraph.
    fireEvent.change(screen.getByLabelText('Time Pressure'), { target: { value: '5' } });
    const summary = screen.getByText(/^Defined by high/);
    expect(summary).toHaveTextContent(/time pressure/i);
  });
});
