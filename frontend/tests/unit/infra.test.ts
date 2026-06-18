import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mockRequest, setMockFailRate, MockHttpError } from '@/services/http';
import { getVersioned, setVersioned } from '@/services/persistence';

// SC-004: services simulate latency and injectable errors so the UI exercises error/retry.
describe('http simulator (SC-004)', () => {
  afterEach(() => setMockFailRate(0));

  it('resolves the produced value after simulated latency', async () => {
    const v = await mockRequest(() => 42);
    expect(v).toBe(42);
  });

  it('rejects with MockHttpError when the fail rate is forced high', async () => {
    setMockFailRate(1);
    await expect(mockRequest(() => 'x')).rejects.toBeInstanceOf(MockHttpError);
  });
});

// FR-FND-009 / research D2: versioned reads discard a stale entry on version mismatch.
describe('versioned persistence (research D2)', () => {
  const KEY = 'nexus_test_v';
  beforeEach(() => localStorage.clear());

  it('round-trips data at a matching version', () => {
    setVersioned(KEY, 1, { a: 1 });
    expect(getVersioned(KEY, 1, { a: 0 })).toEqual({ a: 1 });
  });

  it('discards the stale entry and returns fallback on a version mismatch', () => {
    setVersioned(KEY, 1, { a: 1 });
    const out = getVersioned(KEY, 2, { a: 0 });
    expect(out).toEqual({ a: 0 });
    expect(localStorage.getItem(KEY)).toBeNull(); // discarded, not kept
  });

  it('treats a legacy/unwrapped payload as a mismatch (safe reset)', () => {
    localStorage.setItem(KEY, JSON.stringify({ a: 9 }));
    expect(getVersioned(KEY, 1, { a: 0 })).toEqual({ a: 0 });
  });
});
