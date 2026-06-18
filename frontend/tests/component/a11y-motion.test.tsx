import { describe, it, expect, afterEach } from 'vitest';
import { render, renderHook } from '@testing-library/react';
import { useReducedMotion, useFocusTrap } from '@/hooks';

// SC-003 / SC-008: reduced-motion is honored; modals trap focus for keyboard users.
const realMatchMedia = window.matchMedia;
afterEach(() => {
  window.matchMedia = realMatchMedia;
});

function mockReducedMotion(reduce: boolean) {
  window.matchMedia = ((query: string) =>
    ({
      matches: query.includes('reduced-motion') ? reduce : false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList) as typeof window.matchMedia;
}

describe('useReducedMotion (SC-003)', () => {
  it('reports true when the user prefers reduced motion', () => {
    mockReducedMotion(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('reports false otherwise', () => {
    mockReducedMotion(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });
});

function TrapHarness() {
  const ref = useFocusTrap<HTMLDivElement>(true);
  return (
    <div ref={ref}>
      <button>first</button>
      <button>second</button>
    </div>
  );
}

describe('useFocusTrap (SC-008)', () => {
  it('focuses the first focusable element on mount', () => {
    render(<TrapHarness />);
    expect((document.activeElement as HTMLElement)?.textContent).toBe('first');
  });
});
