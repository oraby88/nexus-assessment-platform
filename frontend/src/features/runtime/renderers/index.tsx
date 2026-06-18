// MethodFamily → renderer registry (Spec 006 / US2). The runtime container picks a renderer by the
// item's method family; each shares the { item, value, onChange, disabled } contract.
import type { ComponentType } from 'react';
import type { MethodFamily } from '@/models';
import type { RendererProps } from './shared';
import { LikertRenderer } from './LikertRenderer';
import { FrequencyRenderer } from './FrequencyRenderer';
import { ForcedChoiceRenderer } from './ForcedChoiceRenderer';
import { McqRenderer } from './McqRenderer';
import { SjtRenderer } from './SjtRenderer';

export type { RendererProps } from './shared';

export const RENDERERS: Record<MethodFamily, ComponentType<RendererProps>> = {
  likert: LikertRenderer,
  contextual_self_report: FrequencyRenderer,
  forced_choice: ForcedChoiceRenderer,
  cognitive_multiple_choice: McqRenderer,
  sjt: SjtRenderer,
};

export function QuestionRenderer(props: RendererProps) {
  const Cmp = RENDERERS[props.item.methodFamily];
  return <Cmp {...props} />;
}
