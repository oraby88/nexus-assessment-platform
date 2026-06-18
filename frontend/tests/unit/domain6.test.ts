import { describe, it, expect } from 'vitest';
import { reports } from '@/mocks/reports';

// FR-RPT-003 / SC-003
describe('Domain 6 fixtures (provisional + blocked Derailment)', () => {
  it('every report Domain 6 marks Derailment Risk as blocked', () => {
    for (const r of reports) {
      if (r.domain6) expect(r.domain6.derailmentRiskBlocked).toBe(true);
    }
  });

  it('a provisional case carries provisional reasons and Provisional confidence', () => {
    const provisional = reports.find((r) => r.domain6?.confidence === 'Provisional');
    expect(provisional).toBeTruthy();
    expect((provisional!.domain6!.provisionalReasons ?? []).length).toBeGreaterThan(0);
  });

  it('exposes the six secondary indices', () => {
    const withD6 = reports.find((r) => r.domain6);
    const codes = (withD6!.domain6!.secondaryIndices ?? []).map((s) => s.code);
    expect(codes).toEqual(['AFI', 'ECFI', 'SII', 'DDI', 'PDRI', 'ECSI']);
  });

  it('no secondary index named Derailment Risk exists', () => {
    for (const r of reports) {
      const names = (r.domain6?.secondaryIndices ?? []).map((s) => s.name.toLowerCase());
      expect(names.some((n) => n.includes('derailment'))).toBe(false);
    }
  });
});
