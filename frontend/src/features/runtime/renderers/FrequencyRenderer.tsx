// Contextual frequency (1–5). Stores a numeric value keyed by the source Question ID (US2).
import { ScaleGroup, type RendererProps } from './shared';

const FREQUENCY = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];

export function FrequencyRenderer({ item, value, onChange, disabled }: RendererProps) {
  return (
    <ScaleGroup
      item={item}
      labels={FREQUENCY}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
