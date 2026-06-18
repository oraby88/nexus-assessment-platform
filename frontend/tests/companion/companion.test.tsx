import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RobotCompanion } from '@/components/companion/RobotCompanion';
import { companionStore } from '@/services/persistence';
import { hintForPath } from '@/components/companion/hints';
import { resetState } from '../_helpers/reset';

// Spec 011 / US2 (FR-SSP-003/004/005/006, SC-002). Default-on, per-route hint, dismiss+persist,
// polite live region, no focus trap, reduced-motion no-float.
const original = window.matchMedia;
function setReduced(v: boolean) {
  window.matchMedia = (q: string) =>
    ({
      matches: v && /reduced-motion/.test(q),
      media: q,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}
function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <RobotCompanion />
    </MemoryRouter>,
  );
}

describe('Nex Robot Companion (Spec 011 / US2)', () => {
  beforeEach(() => {
    resetState();
    setReduced(false);
  });
  afterEach(() => {
    window.matchMedia = original;
  });

  it('is on by default and shows the per-route hint via a polite live region', () => {
    renderAt('/admin/dashboard');
    expect(screen.getByRole('status').textContent).toBe(hintForPath('/admin/dashboard'));
    expect(screen.getByRole('button', { name: /show or hide the hint/ })).toBeInTheDocument();
  });

  it('shows a different hint on a different route', () => {
    renderAt('/admin/reports');
    expect(screen.getByRole('status').textContent).toBe(hintForPath('/admin/reports'));
  });

  it('dismiss persists across reloads', () => {
    const { unmount } = renderAt('/admin/dashboard');
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss the Nex companion' }));
    expect(companionStore.get().enabled).toBe(false);
    expect(screen.queryByRole('button', { name: /show or hide the hint/ })).toBeNull();
    // Fresh mount stays dismissed (only the small restore affordance).
    unmount();
    renderAt('/admin/dashboard');
    expect(screen.queryByRole('button', { name: /show or hide the hint/ })).toBeNull();
    expect(screen.getByRole('button', { name: 'Nex' })).toBeInTheDocument();
  });

  it('applies no float animation under reduced motion', () => {
    setReduced(true);
    renderAt('/admin/dashboard');
    const avatar = screen.getByRole('button', { name: /show or hide the hint/ });
    expect(avatar.style.animation).toBe('');
  });
});
