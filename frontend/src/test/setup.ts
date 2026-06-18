import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';

// Spec 008 — register the vitest-axe matcher (its prebuilt extend-expect entry is empty, so we
// register manually) and type `toHaveNoViolations()` on Vitest's Assertion for all suites.
expect.extend(axeMatchers);

declare module 'vitest' {
  interface Assertion {
    toHaveNoViolations(): void;
  }
}

// Polyfill matchMedia for components that read prefers-reduced-motion / breakpoints under jsdom.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}
