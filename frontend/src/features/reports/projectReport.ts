// Report visibility projection (Spec 005 / FR-RPT-002, research D1). Computes each output's
// OutputVisibility at render time from the fixture's raw signals via the Spec 001 governance helpers.
// Blocked outputs (e.g., Derailment Risk) are surfaced only as omission explanations, never values.
import type { DimensionResult, DomainResult, OutputVisibility, Report, UseCase } from '@/models';
import { visibility as visibilityFor } from '@/services/governance';

export interface ProjectedDimension extends DimensionResult {
  visibility: OutputVisibility;
}
export interface ProjectedDomain extends Omit<DomainResult, 'dimensions'> {
  dimensions: ProjectedDimension[];
}

export function dimensionVisibility(
  d: DimensionResult,
  useCase: UseCase,
  audience: 'admin' | 'user',
): OutputVisibility {
  if (d.blocked) return 'blocked';
  return visibilityFor(d.confidence, useCase, audience);
}

export function projectReport(
  report: Report,
  opts: { audience: 'admin' | 'user'; useCase: UseCase },
): { domains: ProjectedDomain[] } {
  const domains = (report.domains ?? []).map((dom) => ({
    ...dom,
    dimensions: dom.dimensions.map((d) => ({
      ...d,
      visibility: dimensionVisibility(d, opts.useCase, opts.audience),
    })),
  }));
  return { domains };
}
