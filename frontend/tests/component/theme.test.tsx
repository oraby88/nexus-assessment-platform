import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '@/components/ui';
import { themeStore, StorageKeys } from '@/services/persistence';

// SC-002 / research D1: theme persists and, when no explicit choice is stored, follows the OS.
function mockColorScheme(dark: boolean) {
  window.matchMedia = ((query: string) =>
    ({
      matches: query.includes('dark') ? dark : false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList) as typeof window.matchMedia;
}

describe('theme: default + persistence (SC-002, research D1)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });
  afterEach(() => localStorage.clear());

  it('defaults to system (prefers-color-scheme) when no preference is stored', () => {
    mockColorScheme(true);
    expect(themeStore.getPref()).toBe('system');
    expect(themeStore.resolve()).toBe('dark');
    mockColorScheme(false);
    expect(themeStore.resolve()).toBe('light');
  });

  it('an explicit choice is persisted and overrides the system default', () => {
    mockColorScheme(true); // system would be dark
    themeStore.set('light');
    expect(localStorage.getItem(StorageKeys.theme)).toBe('light');
    expect(themeStore.getPref()).toBe('light');
    expect(themeStore.resolve()).toBe('light'); // explicit wins over system dark
  });

  it("selecting 'system' clears the stored preference", () => {
    themeStore.set('dark');
    expect(localStorage.getItem(StorageKeys.theme)).toBe('dark');
    themeStore.set('system');
    expect(localStorage.getItem(StorageKeys.theme)).toBeNull();
  });

  it('toggling applies data-theme to <html> and persists', () => {
    mockColorScheme(false); // system light
    render(<ThemeToggle />);
    fireEvent.click(screen.getByLabelText('Toggle theme'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem(StorageKeys.theme)).toBe('dark');
  });
});
