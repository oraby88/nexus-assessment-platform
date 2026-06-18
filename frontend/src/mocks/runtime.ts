// Spec 006 fixtures — pre-resolved assessment item sets (all five method families) + per-use-case
// consent records. Decoupled from components; only services import these (constitution IV).
// The frontend captures responses but performs NO production scoring (constitution VIII).
import type {
  ConsentRecord,
  DataDeletionRequest,
  RuntimeItem,
  UseCase,
  UserAssessmentSummary,
} from '@/models';

const ORG = 'org-meridian';
const ORG_NAME = 'Meridian';

/** The mock signed-in User maps to this participant (Admin roster id) so revocation reflects there. */
export const CURRENT_USER_PARTICIPANT = 'CND-2041';

export interface RuntimeAssessmentFixture {
  assessmentId: string;
  participantId: string;
  targetRole: string;
  useCase: UseCase;
  organizationName: string;
  deadline?: string;
  estimatedMinutes: number;
  items: RuntimeItem[];
}

// One pre-resolved item per method family (verbatim display text adapted upstream by Spec 003).
const RUNTIME_ITEMS: RuntimeItem[] = [
  {
    sourceQuestionId: 'NEX-GMB-007',
    methodFamily: 'likert',
    itemText: 'I plan my work tasks carefully and ahead of time.',
    options: {},
    responseScale: '1-5 Agreement',
    sectionId: 'S1',
    sectionName: 'Work Style',
  },
  {
    sourceQuestionId: 'NEX-CSR-014',
    methodFamily: 'contextual_self_report',
    itemText: 'When priorities shift unexpectedly, how often do you adjust your plan calmly?',
    options: {},
    responseScale: '1-5 Frequency',
    sectionId: 'S1',
    sectionName: 'Work Style',
  },
  {
    sourceQuestionId: 'NEX-FC-022',
    methodFamily: 'forced_choice',
    itemText: 'Which describes you better at work?',
    options: {
      a: 'I prefer to finish one task fully before starting another.',
      b: 'I prefer to keep several tasks moving at once.',
    },
    responseScale: 'forced_choice_binary',
    sectionId: 'S2',
    sectionName: 'Preferences',
  },
  {
    sourceQuestionId: 'NEX-COG-031',
    methodFamily: 'cognitive_multiple_choice',
    itemText: 'If every Bloop is a Razzie, and some Razzies are Lazzies, which must be true?',
    options: {
      a: 'All Bloops are Lazzies.',
      b: 'Some Bloops may be Lazzies.',
      c: 'No Bloops are Razzies.',
      d: 'All Lazzies are Bloops.',
    },
    responseScale: 'cognitive_mcq',
    sectionId: 'S3',
    sectionName: 'Reasoning',
  },
  {
    sourceQuestionId: 'NEX-SJT-045',
    methodFamily: 'sjt',
    itemText:
      'A teammate misses a deadline that affects your deliverable, and the client is waiting. What is your best first action?',
    options: {
      a: 'Escalate to your manager immediately.',
      b: 'Speak with the teammate to understand the blocker and agree on a recovery plan.',
      c: 'Quietly redo the work yourself.',
      d: 'Inform the client the delay is the teammate’s fault.',
    },
    responseScale: 'sjt_single_best',
    sectionId: 'S3',
    sectionName: 'Reasoning',
  },
];

export const runtimeAssessments: RuntimeAssessmentFixture[] = [
  {
    assessmentId: 'AS-RUNTIME',
    participantId: CURRENT_USER_PARTICIPANT,
    targetRole: 'Finance Manager',
    useCase: 'hiring_support',
    organizationName: ORG_NAME,
    deadline: '2026-06-30',
    estimatedMinutes: 25,
    items: RUNTIME_ITEMS.map((i) => ({ ...i })),
  },
  {
    assessmentId: 'AS-DEV',
    participantId: CURRENT_USER_PARTICIPANT,
    targetRole: 'Finance Manager',
    useCase: 'developmental',
    organizationName: ORG_NAME,
    deadline: '2026-07-10',
    estimatedMinutes: 20,
    items: RUNTIME_ITEMS.map((i) => ({ ...i })),
  },
];

/** Completed/own assessments shown in dashboard, My Assessments, History (own-data only). */
export const userAssessmentSummaries: UserAssessmentSummary[] = [
  {
    assessmentId: 'AS-RUNTIME',
    targetRole: 'Finance Manager',
    useCase: 'hiring_support',
    organizationName: ORG_NAME,
    deadline: '2026-06-30',
    progressPercent: 0,
    lifecycle: 'active',
  },
  {
    assessmentId: 'AS-DONE',
    targetRole: 'Senior Analyst',
    useCase: 'developmental',
    organizationName: ORG_NAME,
    progressPercent: 100,
    lifecycle: 'completed',
    reportId: 'RPT-001',
  },
];

const now = '2026-06-14T10:00:00Z';

/** Seed consent records. Optional consents are always revocable; required consent is revocable
 * until the report is released (AS-DONE's required consent is locked). */
export const consentSeed: ConsentRecord[] = [
  {
    id: 'CNS-RUNTIME-REQ',
    participantId: CURRENT_USER_PARTICIPANT,
    assessmentId: 'AS-RUNTIME',
    useCase: 'pre_hire_screening',
    label: 'Pre-hire screening',
    informedText:
      'I consent to my responses being used to support a hiring decision for the target role. Results are one input among many and never produce an automatic decision.',
    status: 'Pending',
    required: true,
    revocable: true,
    organizationId: ORG,
  },
  {
    id: 'CNS-RUNTIME-RESEARCH',
    participantId: CURRENT_USER_PARTICIPANT,
    assessmentId: 'AS-RUNTIME',
    useCase: 'research',
    label: 'Anonymised research',
    informedText:
      'Optional: I allow my anonymised responses to be used to improve assessment quality. This is not required to take the assessment.',
    status: 'Pending',
    required: false,
    revocable: true,
    organizationId: ORG,
  },
  {
    id: 'CNS-DEV-REQ',
    participantId: CURRENT_USER_PARTICIPANT,
    assessmentId: 'AS-DEV',
    useCase: 'developmental_feedback',
    label: 'Developmental feedback',
    informedText:
      'I consent to my responses being used to generate developmental feedback for my own growth.',
    status: 'Pending',
    required: true,
    revocable: true,
    organizationId: ORG,
  },
  {
    id: 'CNS-DONE-REQ',
    participantId: CURRENT_USER_PARTICIPANT,
    assessmentId: 'AS-DONE',
    useCase: 'developmental_feedback',
    label: 'Developmental feedback',
    informedText: 'I consented to developmental feedback for a completed assessment.',
    status: 'Granted',
    required: true,
    revocable: false, // report released → locked (historical)
    grantedAt: now,
    organizationId: ORG,
  },
];

// Seeded pending deletion requests so the Admin privacy inbox (Spec 007) is demoable.
export const deletionRequestSeed: DataDeletionRequest[] = [
  {
    id: 'DEL-1',
    participantId: CURRENT_USER_PARTICIPANT,
    submittedAt: '2026-06-12T13:40:00Z',
    status: 'Submitted',
    note: 'Please remove my assessment data — I have changed roles.',
  },
  {
    id: 'DEL-2',
    participantId: 'CND-2045',
    submittedAt: '2026-06-13T09:05:00Z',
    status: 'Submitted',
  },
];
