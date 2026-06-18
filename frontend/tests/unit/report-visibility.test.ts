import { describe, it, expect } from 'vitest';
import { dimensionVisibility } from '@/features/reports/projectReport';
import type { DimensionResult } from '@/models';

// FR-RPT-002 / SC-001
function dim(over: Partial<DimensionResult>): DimensionResult {
  return {
    dimensionId: 'D',
    dimensionName: 'D',
    score: 70,
    confidence: 'High',
    scoreBand: 'Strong',
    ...over,
  };
}

describe('dimensionVisibility (computed via governance helpers, research D1)', () => {
  it('High → visible', () => {
    expect(dimensionVisibility(dim({ confidence: 'High' }), 'developmental', 'admin')).toBe(
      'visible',
    );
  });
  it('Moderate → caution (developmental) / downgraded (hiring admin)', () => {
    expect(dimensionVisibility(dim({ confidence: 'Moderate' }), 'developmental', 'admin')).toBe(
      'visible_with_caution',
    );
    expect(dimensionVisibility(dim({ confidence: 'Moderate' }), 'hiring_support', 'admin')).toBe(
      'downgraded',
    );
  });
  it('Low → downgraded (admin) / hidden (user)', () => {
    expect(dimensionVisibility(dim({ confidence: 'Low' }), 'developmental', 'admin')).toBe(
      'downgraded',
    );
    expect(dimensionVisibility(dim({ confidence: 'Low' }), 'developmental', 'user')).toBe('hidden');
  });
  it('Unacceptable → hidden', () => {
    expect(dimensionVisibility(dim({ confidence: 'Unacceptable' }), 'developmental', 'admin')).toBe(
      'hidden',
    );
  });
  it('blocked dimension → blocked (never a value)', () => {
    expect(dimensionVisibility(dim({ blocked: true }), 'developmental', 'admin')).toBe('blocked');
  });
});
