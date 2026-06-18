import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { NotFound } from '@/features/auth';
import { SessionProvider } from '@/hooks';
import { LocaleProvider } from '@/i18n/LocaleProvider';

// Spec 007 / US4 — unknown route renders a 404 with a path back.
describe('NotFound (Spec 007 / US4)', () => {
  it('renders a 404 with a return-home action', async () => {
    render(
      <LocaleProvider>
        <MemoryRouter initialEntries={['/totally/unknown']}>
          <SessionProvider>
            <Routes>
              <Route path="/" element={<div>HOME</div>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SessionProvider>
        </MemoryRouter>
      </LocaleProvider>,
    );
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /return home/i }));
    expect(await screen.findByText('HOME')).toBeInTheDocument();
  });
});
