import { useCallback, useEffect, useRef, useState } from 'react';
import {
  themeStore,
  systemTheme,
  getVersioned,
  setVersioned,
  companionStore,
  type ThemePref,
} from '@/services/persistence';

/**
 * Theme control, persisted + applied to <html data-theme> (matches index.html pre-paint).
 * `theme` is the stored preference ('light' | 'dark' | 'system'); `resolved` is what actually renders.
 * Research D1: 'system' follows the OS prefers-color-scheme and tracks live OS changes.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<ThemePref>(() => themeStore.getPref());
  const [resolved, setResolved] = useState<'light' | 'dark'>(() => themeStore.resolve());

  useEffect(() => {
    themeStore.set(theme);
    const r = theme === 'system' ? systemTheme() : theme;
    setResolved(r);
    document.documentElement.setAttribute('data-theme', r);
  }, [theme]);

  // When following the system, react to OS theme changes without a reload.
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const onChange = () => {
      const r = systemTheme();
      setResolved(r);
      document.documentElement.setAttribute('data-theme', r);
    };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [theme]);

  const setTheme = useCallback((p: ThemePref) => setThemeState(p), []);
  const toggle = useCallback(
    () => setThemeState(() => (themeStore.resolve() === 'light' ? 'dark' : 'light')),
    [],
  );
  return { theme, resolved, setTheme, toggle };
}

type AsyncState<T> = { data: T | null; loading: boolean; error: Error | null };

/** Run an async (mock-service) call with loading/error/data state (constitution IV). */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const reload = useCallback(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fnRef
      .current()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error: Error) => alive && setState({ data: null, loading: false, error }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => reload(), [reload]);
  return { ...state, reload };
}

/** Versioned localStorage state hook (discard-on-mismatch via persistence; research D2). */
export function useLocalStorage<T>(key: string, version: number, initial: T) {
  const [value, setValue] = useState<T>(() => getVersioned(key, version, initial));
  useEffect(() => {
    setVersioned(key, version, value);
  }, [key, version, value]);
  return [value, setValue] as const;
}

/** Viewport breakpoints mirroring the prototype (mobile <700, tablet <1040). */
export function useViewport() {
  const [w, setW] = useState(() => (typeof window === 'undefined' ? 1200 : window.innerWidth));
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return { w, isMobile: w < 700, isTablet: w >= 700 && w < 1040, isDesktop: w >= 1040 };
}

/** True when the user prefers reduced motion; tracks live changes (constitution XII; FR-FND-007). */
export function useReducedMotion(): boolean {
  const read = () => {
    try {
      return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    } catch {
      return false;
    }
  };
  const [reduced, setReduced] = useState<boolean>(read);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return reduced;
}

/**
 * Trap keyboard focus within a container while `active` (modals/drawers); FR-FND-015.
 * Focuses the first focusable on mount and cycles Tab/Shift+Tab within the container.
 */
export function useFocusTrap<T extends HTMLElement>(active = true) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const sel =
      'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const focusables = () => Array.from(el.querySelectorAll<HTMLElement>(sel));
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [active]);
  return ref;
}

export type ToastType = 'success' | 'info' | 'caution' | 'error';
/** Fire a toast (consumed by ToastHost via a custom event). */
export function toast(title: string, type: ToastType = 'info', body?: string): void {
  window.dispatchEvent(new CustomEvent('nx-toast', { detail: { title, type, body } }));
}
export function useToast() {
  return { toast };
}

export { useSession, SessionProvider } from './session';
export { useT } from '@/i18n/useT';

/** Companion enabled/dismissed preference, persisted (Spec 011 / US2). Keeps persistence access out
 *  of the component (constitution IV) — mirrors useTheme. */
export function useCompanion() {
  const [enabled, setEnabledState] = useState<boolean>(() => companionStore.get().enabled);
  const setEnabled = useCallback((v: boolean) => {
    companionStore.set({ enabled: v });
    setEnabledState(v);
  }, []);
  return { enabled, setEnabled };
}
