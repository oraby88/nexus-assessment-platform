// Coverage computation (Spec 003 / FR-CA-013, research D4). Recomputed on every selection change.
// Warning when a required/critical dimension has 0 selected items; soft note when exactly 1.
import type {
  CoverageReport,
  CoverageWarning,
  JobRequirementsProfile,
  SelectedQuestion,
} from '@/models';

const MINUTES_PER_QUESTION = 1;

export function computeCoverage(
  selected: SelectedQuestion[],
  profile?: JobRequirementsProfile,
): CoverageReport {
  const byDomain: Record<string, number> = {};
  const byDimension: Record<string, number> = {};
  const methodDistribution: Record<string, number> = {};

  for (const s of selected) {
    byDomain[s.item.domainId] = (byDomain[s.item.domainId] ?? 0) + 1;
    byDimension[s.item.dimensionId] = (byDimension[s.item.dimensionId] ?? 0) + 1;
    methodDistribution[s.item.methodFamily] = (methodDistribution[s.item.methodFamily] ?? 0) + 1;
  }

  const warnings: CoverageWarning[] = [];
  for (const dim of profile?.criticalDimensionIds ?? []) {
    const count = byDimension[dim] ?? 0;
    if (count === 0) {
      warnings.push({
        dimensionId: dim,
        level: 'warning',
        message: `No questions cover required dimension ${dim}`,
      });
    } else if (count === 1) {
      warnings.push({
        dimensionId: dim,
        level: 'note',
        message: `Only one question covers ${dim}`,
      });
    }
  }

  return {
    totalQuestions: selected.length,
    estimatedDurationMinutes: selected.length * MINUTES_PER_QUESTION,
    byDomain,
    byDimension,
    methodDistribution,
    warnings,
  };
}
