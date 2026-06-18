// Shared wizard context (Spec 003). Kept separate from the shell to avoid an import cycle with steps.
import { createContext, useContext } from 'react';
import type { AssessmentDraft, JobRequirementsProfile, Participant } from '@/models';

export interface WizardCtx {
  draft: AssessmentDraft;
  update: (patch: Partial<AssessmentDraft>) => void;
  participant?: Participant;
  setParticipant: (p?: Participant) => void;
  requirements?: JobRequirementsProfile;
  setRequirements: (r?: JobRequirementsProfile) => void;
}

export const WizardContext = createContext<WizardCtx | null>(null);

export function useWizard(): WizardCtx {
  const c = useContext(WizardContext);
  if (!c) throw new Error('useWizard must be used within CreateAssessmentWizard');
  return c;
}
