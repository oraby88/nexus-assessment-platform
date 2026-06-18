// Likert agreement (1–5). Stores a numeric value keyed by the source Question ID (US2 / FR-USR-008).
import { ScaleGroup, type RendererProps } from './shared';

const AGREEMENT = ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'];

export function LikertRenderer({ item, value, onChange, disabled }: RendererProps) {
  return (
    <ScaleGroup
      item={item}
      labels={AGREEMENT}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
