// Mock HTTP simulator — the only place that fakes network latency/errors.
// Services call mockRequest() so the UI exercises real loading/error states (constitution IV).

let failRate = 0; // 0..1 — tests/dev can bump this to exercise error states.

export function setMockFailRate(rate: number): void {
  failRate = Math.min(1, Math.max(0, rate));
}

export class MockHttpError extends Error {
  constructor(message = 'Mock service error') {
    super(message);
    this.name = 'MockHttpError';
  }
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Resolve `value` after simulated latency, or reject to exercise error UI. */
export async function mockRequest<T>(
  value: T | (() => T),
  opts?: { minMs?: number; maxMs?: number },
): Promise<T> {
  const min = opts?.minMs ?? 150;
  const max = opts?.maxMs ?? 600;
  // Deterministic-ish jitter without Math.random dependency in tests.
  const span = Math.max(0, max - min);
  await delay(min + (span ? span / 2 : 0));
  if (failRate > 0 && deterministicRoll() < failRate) {
    throw new MockHttpError();
  }
  return typeof value === 'function' ? (value as () => T)() : value;
}

let counter = 0;
function deterministicRoll(): number {
  counter = (counter + 1) % 100;
  return counter / 100;
}
