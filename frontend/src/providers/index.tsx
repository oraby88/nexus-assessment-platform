// Provider scaffolds (FR-FND-011 / task T011). Mounted once in App.tsx.
// - ThemeProvider: keeps <html data-theme> synced app-wide and exposes theme via context.
// - ToastProvider: renders the aria-live ToastHost so any code can fire toasts.
// - SessionProvider: re-exported from hooks (single source of truth).
import { createContext, useContext, type ReactNode } from 'react';
import { useTheme } from '@/hooks';
import { ToastHost } from '@/components/ToastHost';
import type { ThemePreference } from '@/models';

interface ThemeCtxValue {
  theme: ThemePreference;
  resolved: 'light' | 'dark';
  setTheme: (p: ThemePreference) => void;
  toggle: () => void;
}

const ThemeCtx = createContext<ThemeCtxValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = useTheme();
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

/** Theme control from context; throws if used outside ThemeProvider. */
export function useThemeContext(): ThemeCtxValue {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ToastHost />
    </>
  );
}

export { SessionProvider, useSession } from '@/hooks';
export { LocaleProvider } from '@/i18n/LocaleProvider';
export { useT } from '@/i18n/useT';
