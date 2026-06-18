// Foundation substrate types (FR-FND-007 / data-model §2) — types that support the
// infrastructure itself (theme, persistence, async, http sim, nav, governance output, toasts).
import type { ThemePref } from '@/services/persistence';
import type { OutputVisibility } from './index';

export type ThemePreference = ThemePref;

export interface PersistedEnvelope<T> {
  v: number;
  data: T;
}

export type AsyncStatus = 'idle' | 'loading' | 'error' | 'success';

export interface AppError {
  code: string;
  message: string;
  retryable: boolean;
}

export interface AsyncState<T> {
  status: AsyncStatus;
  data?: T;
  error?: AppError;
}

export interface HttpSimConfig {
  minDelayMs: number;
  maxDelayMs: number;
  errorRate: number;
  forceError?: boolean;
}

export interface NavItem {
  key: string;
  label: string;
  route: string;
  icon?: string;
}

export interface GovernanceDecision {
  visibility: OutputVisibility;
  reason?: string;
}

export interface Toast {
  id: string;
  tone: 'info' | 'success' | 'warn' | 'error';
  message: string;
  ttlMs?: number;
}
