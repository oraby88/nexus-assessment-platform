// Context Signature derivation (Spec 004 / FR-BC-009, research D4). Pure function of the context
// values → radar axes (0–100) + a plain-language summary. Recomputed on every control change.
import type { ContextProfileValues, ContextSignatureData } from '@/models';

// Full ordered context-field list (design app/data.js CONTEXT_FIELDS) — drives the compact
// 14-bar Context Signature shown on the Link-a-Context step.
export const CONTEXT_FIELDS: { key: keyof ContextProfileValues; label: string; max: number }[] = [
  { key: 'leadershipScope', label: 'Leadership Scope', max: 4 },
  { key: 'ambiguityLevel', label: 'Ambiguity Level', max: 5 },
  { key: 'decisionStakes', label: 'Decision Stakes', max: 5 },
  { key: 'timePressure', label: 'Time Pressure', max: 5 },
  { key: 'regulatoryConstraint', label: 'Regulatory Constraint', max: 5 },
  { key: 'autonomyLevel', label: 'Autonomy Level', max: 5 },
  { key: 'stakeholderComplexity', label: 'Stakeholder Complexity', max: 5 },
  { key: 'interdependenceLevel', label: 'Interdependence', max: 5 },
  { key: 'innovationDemand', label: 'Innovation Demand', max: 5 },
  { key: 'executionPrecisionDemand', label: 'Execution Precision', max: 5 },
  { key: 'customerExposure', label: 'Customer Exposure', max: 5 },
  { key: 'conflictLoad', label: 'Conflict Load', max: 5 },
  { key: 'changeVelocity', label: 'Change Velocity', max: 5 },
  { key: 'failureCost', label: 'Failure Cost', max: 5 },
];

const FACTORS: [keyof ContextProfileValues, string][] = [
  ['ambiguityLevel', 'Ambiguity'],
  ['decisionStakes', 'Decision Stakes'],
  ['timePressure', 'Time Pressure'],
  ['autonomyLevel', 'Autonomy'],
  ['stakeholderComplexity', 'Stakeholders'],
  ['changeVelocity', 'Change Velocity'],
  ['innovationDemand', 'Innovation'],
  ['executionPrecisionDemand', 'Execution Precision'],
];

export const DEFAULT_CONTEXT_VALUES: ContextProfileValues = {
  leadershipScope: 0,
  ambiguityLevel: 3,
  decisionStakes: 3,
  timePressure: 3,
  regulatoryConstraint: 3,
  autonomyLevel: 3,
  stakeholderComplexity: 3,
  interdependenceLevel: 3,
  innovationDemand: 3,
  executionPrecisionDemand: 3,
  customerExposure: 3,
  conflictLoad: 3,
  changeVelocity: 3,
  failureCost: 3,
};

export function contextSignature(values: ContextProfileValues): ContextSignatureData {
  const axes = FACTORS.map(([key, axis]) => ({ axis, value: (values[key] ?? 0) * 20 }));
  const ranked = [...FACTORS].sort((a, b) => (values[b[0]] ?? 0) - (values[a[0]] ?? 0));
  const top = ranked.slice(0, 2).map(([, label]) => label.toLowerCase());
  const summary = `Defined by high ${top.join(' and ')}; leadership scope ${values.leadershipScope}/4.`;
  return { axes, summary };
}
