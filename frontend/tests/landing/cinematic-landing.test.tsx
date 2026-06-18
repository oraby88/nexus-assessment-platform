import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { Landing } from '@/features/auth';
import { resetState } from '../_helpers/reset';

// Spec 011 / US1 (FR-SSP-001/002, SC-001). The cinematic landing renders, preserves the sign-in /
// invitation CTAs, and under reduced-motion is complete + static (no GSAP load, no hidden state).
const original = window.matchMedia;

function renderLanding() {
  return render(
    <LocaleProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<div>LOGIN</div>} />
          <Route path="/invitation" element={<div>INVITE</div>} />
        </Routes>
      </MemoryRouter>
    </LocaleProvider>,
  );
}

describe('Cinematic Landing (Spec 011 / US1)', () => {
  beforeEach(() => {
    resetState();
    // Force reduced-motion so the entrance never loads GSAP — deterministic + static.
    window.matchMedia = (q: string) =>
      ({
        matches: /reduced-motion/.test(q),
        media: q,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
  });
  afterEach(() => {
    window.matchMedia = original;
  });

  it('renders the cinematic hero + sections, static (visible) under reduced-motion', async () => {
    renderLanding();
    // CinematicLanding is lazy-loaded (Suspense) — await it, then assert the hero + a section.
    expect(await screen.findByText('The AI-native human-capability platform')).toBeInTheDocument();
    expect(screen.getByText('human insight')).toBeInTheDocument();
    expect(screen.getByText('Six domains. One coherent picture.')).toBeInTheDocument();
  });

  it('preserves the sign-in and invitation CTAs and routes correctly', async () => {
    renderLanding();
    // The design repeats the CTAs (nav + hero + final), so there are several.
    expect(
      (await screen.findAllByRole('button', { name: 'I have an invitation' })).length,
    ).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByRole('button', { name: 'Enter the Platform' })[0]);
    expect(await screen.findByText('LOGIN')).toBeInTheDocument();
  });
});
