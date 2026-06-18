// Shared deterministic-test helper (Spec 009 / T004, SC-008). New seam/i18n/motion suites call this
// in beforeEach so every run starts from a clean, network-free, failure-free state.
import { setMockFailRate } from '@/services/http';

/** Reset mock failure injection + persisted state so each test is deterministic and isolated. */
export function resetState(): void {
  setMockFailRate(0);
  try {
    localStorage.clear();
  } catch {
    /* no-op (jsdom without storage) */
  }
}
