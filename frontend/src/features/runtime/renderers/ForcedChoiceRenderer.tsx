// Forced choice — two-column A/B statement cards (stack on mobile). Stores the chosen option key
// (US2 / FR-USR-008). Spec 012 (T023): paired-statement card layout matching the design.
import { PairedGroup, type RendererProps } from './shared';

export function ForcedChoiceRenderer(props: RendererProps) {
  return <PairedGroup {...props} />;
}
