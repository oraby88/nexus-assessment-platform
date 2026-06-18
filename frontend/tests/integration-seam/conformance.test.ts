import { describe, it, expect, beforeEach } from 'vitest';
import * as services from '@/services';
import { CONTRACT_SERVICE_NAMES } from '@/services/contracts';
import { resetState } from '../_helpers/reset';

// Spec 009 / US1 (FR-PVR-001/003, SC-001/003). Drift guard: every contract-backed service name is
// exported by the aggregator and resolves to a real service object. Conformance of each mock to its
// contract is enforced at compile time by the `satisfies` assertions (caught by `tsc`).
describe('service contract conformance (Spec 009 / US1)', () => {
  beforeEach(resetState);

  it('every contract service name is exported by the @/services aggregator', () => {
    const aggregator = services as unknown as Record<string, unknown>;
    const missing = CONTRACT_SERVICE_NAMES.filter((name) => aggregator[name] == null);
    expect(missing, `Missing aggregator exports for: ${missing.join(', ')}`).toEqual([]);
  });

  it('each exported service is an object exposing at least one method', () => {
    const aggregator = services as unknown as Record<string, Record<string, unknown>>;
    for (const name of CONTRACT_SERVICE_NAMES) {
      const svc = aggregator[name];
      expect(typeof svc, `${name} should be an object`).toBe('object');
      const methods = Object.keys(svc).filter((k) => typeof svc[k] === 'function');
      expect(methods.length, `${name} exposes no methods`).toBeGreaterThan(0);
    }
  });
});
