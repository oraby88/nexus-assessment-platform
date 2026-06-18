# Shared Frontend Data Model — TypeScript Inventory (V1)

This inventory is the shared frontend model source for SpecKit planning.

It is designed for:
- React + TypeScript frontend prototype,
- mock services,
- local persistence,
- and clean future FastAPI + Supabase replacement.

The uploaded workbook source sheet is `item_bank`.

The workbook contains 543 governed items and 31 source columns.

Do not fabricate source-item fields such as `weight` or `difficulty`; they are not present in the workbook.

---

## 1. Enums and Unions

```ts
type Role = 'admin' | 'user';

type DomainId = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6';
type DomainState = 'active' | 'restricted' | 'derived';

type MethodFamily =
  | 'likert'
  | 'contextual_self_report'
  | 'forced_choice'
  | 'cognitive_multiple_choice'
  | 'sjt';

type ItemFormat =
  | 'statement'
  | 'paired_statement'
  | 'mcq_single'
  | 'single_best_answer'
  | 'scenario_mcq';

type ResponseScale =
  | '1-5 Agreement'
  | '1-5 Frequency'
  | 'forced_choice_binary'
  | 'cognitive_mcq'
  | 'sjt_single_best';

type BankState = 'production' | 'pilot' | 'research';

type UseStatus =
  | 'operational_allowed'
  | 'operational_allowed_with_restrictions'
  | 'operational_allowed_restricted_by_level'
  | 'operational_blocked';

type ReviewStatus =
  | 'draft'
  | 'needs_expert_review'
  | 'quarantine_pending_dif_review';

type JobLevelOverlay =
  | 'all_levels'
  | 'professional_plus'
  | 'manager_plus'
  | 'senior_plus';

type LoadingType = 'primary' | 'adjacent' | 'direct';

type UseCase = 'developmental' | 'hiring_support';

type JobLevel =
  | 'Individual Contributor'
  | 'Professional'
  | 'Manager'
  | 'Senior Manager'
  | 'Director'
  | 'Executive';

type JobFamily =
  | 'Strategy'
  | 'Operations'
  | 'Sales'
  | 'Product'
  | 'Engineering'
  | 'People'
  | 'Finance'
  | 'Risk'
  | 'General Management'
  | 'Other';

type InvitationStatus = 'Draft' | 'Sent' | 'Opened' | 'Expired' | 'Cancelled';

type AssessmentLifecycleStatus =
  | 'Draft'
  | 'Not Started'
  | 'In Progress'
  | 'Submitted'
  | 'Processing'
  | 'Completed'
  | 'Expired'
  | 'Cancelled';

type AssessmentValidityStatus =
  | 'Pending'
  | 'Valid'
  | 'Pass With Limits'
  | 'Valid but Uninterpretable'
  | 'Incomplete'
  | 'Invalid'
  | 'Deferred';

type ReportStatus =
  | 'Processing'
  | 'Released'
  | 'Released with Caution'
  | 'Partial Release'
  | 'Blocked Section'
  | 'Unavailable'
  | 'Deferred';

type BlueprintStatus =
  | 'Draft'
  | 'Under Review'
  | 'Active'
  | 'Validated'
  | 'Deprecated'
  | 'Archived';

type ContextStatus = 'Draft' | 'Active' | 'Archived';

type ConsentStatus = 'Pending' | 'Granted' | 'Declined' | 'Revoked';

type ConfidenceBand = 'High' | 'Moderate' | 'Low' | 'Unacceptable';

type Domain6Confidence = 'High' | 'Moderate' | 'Provisional';

type ScoreBand = 'Strong' | 'Effective' | 'Mixed' | 'Developing';

type OutputVisibility =
  | 'visible'
  | 'visible_with_caution'
  | 'downgraded'
  | 'hidden'
  | 'blocked'
  | 'not_generated';

type AdaptationMode =
  | 'contextual_rephrase_allowed'
  | 'light_terminology_only'
  | 'verbatim_default'
  | 'approved_equivalence_only';

type ExportStatus = 'Queued' | 'Processing' | 'Ready' | 'Failed';

const SE_THRESHOLDS = {
  high: 0.25,
  moderate: 0.35,
  low: 0.45,
} as const;
```

---

## 2. Organization, Session, and People

```ts
interface Organization {
  id: string;
  name: string;
  logoUrl?: string;
  industry?: string;
  country?: string;
  v1AdminAccountLimit: 1;
}

interface Session {
  role: Role;
  userId: string;
  name: string;
  email: string;
  organizationId: string;
  organizationName: string;
}

interface Participant {
  id: string;
  fullName: string;
  email: string;
  currentJobTitle?: string;
  targetJobTitle?: string;
  jobLevel: JobLevel;
  departmentText?: string;
  organizationId: string;
  notes?: string;
  dateAdded: string;
  totalAssessments: number;
  latestAssessmentLifecycle?: AssessmentLifecycleStatus;
  latestAssessmentValidity?: AssessmentValidityStatus;
  latestReportStatus?: ReportStatus;
}

/**
 * Candidate is a UI label used in hiring-support comparison.
 * Participant is the canonical shared entity.
 */
type Candidate = Participant;
```

---

## 3. Consent and Privacy

```ts
type ConsentUseCase =
  | 'pre_hire_screening'
  | 'developmental_feedback'
  | 'research'
  | 'third_party_sharing';

interface ConsentRecord {
  id: string;
  participantId: string;
  assessmentId?: string;
  useCase: ConsentUseCase;
  label: string;
  informedText: string;
  status: ConsentStatus;
  required: boolean;
  revocable: boolean;
  grantedAt?: string;
  declinedAt?: string;
  revokedAt?: string;
  organizationId: string;
}

interface DataDeletionRequest {
  id: string;
  participantId: string;
  submittedAt: string;
  status: 'Submitted' | 'In Review' | 'Completed' | 'Rejected';
  note?: string;
}
```

---

## 4. Construct Taxonomy

```ts
interface Domain {
  id: DomainId;
  label: string;
  scientificLabel: string;
  state: DomainState;
  colorToken: string;
  dimensionIds: string[];
}

interface Dimension {
  id: string;
  name: string;
  domainId: DomainId;
}

interface Facet {
  id: string;
  name: string;
  dimensionId: string;
}
```

---

## 5. Governed Item Bank — Exact Source Metadata

The following model mirrors the uploaded `item_bank` sheet.

All fields are immutable inside the frontend application.

```ts
interface ItemBankItem {
  itemId: string;
  domainId: DomainId;
  domainName: string;
  dimensionId: string;
  dimensionName: string;
  facetId: string;
  facetName: string;
  methodFamily: MethodFamily;
  itemFormat: ItemFormat;
  itemText: string;
  options: Partial<Record<'a' | 'b' | 'c' | 'd' | 'e', string>>;
  keyedAnswer: string | null;
  responseScale: ResponseScale;
  primaryDomainId: DomainId;
  primaryDimensionId: string;
  primaryFacetId: string;
  secondaryDimensionIds: string[];
  loadingType: LoadingType;
  intendedMeaning: string;
  prohibitedOverlap?: string;
  bankState: BankState;
  useStatus: UseStatus;
  validationTrack: string[];
  jobLevelOverlay: JobLevelOverlay;
  reverseScored: boolean;
  reviewStatus: ReviewStatus;
  reviewerNotes?: string;
}
```

### Source-item immutability rule
Never mutate:
- item ID,
- Domain,
- Dimension,
- Facet,
- method family,
- item format,
- response scale,
- keyed answer,
- options,
- loading type,
- bank state,
- use status,
- validation track,
- job-level overlay,
- reverse-scored status,
- or review status.

---

## 6. Question Adaptation

```ts
interface DiffSpan {
  text: string;
  changed: boolean;
}

interface AdaptedQuestionText {
  itemId: string;
  originalText: string;
  adaptedText: string;
  diff: DiffSpan[];
  mode: AdaptationMode;
  adaptationReason: string;
  generatedAt: string;
}

interface SelectedQuestion {
  item: Readonly<ItemBankItem>;
  adaptation?: AdaptedQuestionText;
  jobRequirementCovered: string;
  approved: boolean;
  selectedAt: string;
  selectionReason: string;
}
```

### Adaptation policy
| Method family | Default mode |
|---|---|
| `likert` | `contextual_rephrase_allowed` |
| `contextual_self_report` | `contextual_rephrase_allowed` |
| `forced_choice` | `light_terminology_only` |
| `cognitive_multiple_choice` | `verbatim_default` |
| `sjt` | `approved_equivalence_only` |

---

## 7. AI Discovery and Job Requirements

```ts
interface AgentMessage {
  id: string;
  sender: 'agent' | 'admin';
  kind: 'question' | 'answer' | 'summary' | 'system';
  text: string;
  createdAt: string;
  topic?: string;
}

interface AgentDiscoveryAnswer {
  questionId: string;
  topic: string;
  answer: string | string[];
  answeredAt: string;
  editedAt?: string;
}

interface JobRequirementsProfile {
  id: string;
  participantId: string;
  useCase: UseCase;
  roleTitle: string;
  jobLevel: JobLevel;
  jobFamily?: JobFamily;
  industry?: string;
  rolePurpose?: string;
  responsibilities: string[];
  requiredSkills: string[];
  requiredBehaviors: string[];
  cultureMarkers: string[];
  criticalDimensionIds: string[];
  successIndicators: string[];
  failureRisks: string[];
  nonNegotiables: string[];
  recommendedAssessmentFocus: string[];
  estimatedDurationMinutes: number;
  contextDraft: Partial<ContextProfile>;
}
```

---

## 8. Role Blueprint and Context Profile

```ts
interface DimensionImportance {
  dimensionId: string;
  importance: 'Low' | 'Moderate' | 'Critical';
  rationale?: string;
}

interface VersionEntry {
  version: string;
  date: string;
  summary: string;
  status?: string;
}

interface RoleBlueprint {
  id: string;
  organizationId: string;
  name: string;
  roleTitle: string;
  jobFamily: JobFamily;
  jobLevel: JobLevel;
  purpose: string;
  responsibilities: string[];
  workContext: string;
  successIndicators: string[];
  failureRisks: string[];
  nonNegotiables: string[];
  requiredDimensionIds: string[];
  optionalDimensionIds: string[];
  excludedDimensionIds: string[];
  dimensionImportance: DimensionImportance[];
  evidence: string[];
  version: string;
  status: BlueprintStatus;
  linkedContextProfileId?: string;
  assessmentsUsed: number;
  updatedAt: string;
  versionHistory: VersionEntry[];
  notes?: string;
}

interface ContextProfileValues {
  leadershipScope: 0 | 1 | 2 | 3 | 4;
  ambiguityLevel: 1 | 2 | 3 | 4 | 5;
  decisionStakes: 1 | 2 | 3 | 4 | 5;
  timePressure: 1 | 2 | 3 | 4 | 5;
  regulatoryConstraint: 1 | 2 | 3 | 4 | 5;
  autonomyLevel: 1 | 2 | 3 | 4 | 5;
  stakeholderComplexity: 1 | 2 | 3 | 4 | 5;
  interdependenceLevel: 1 | 2 | 3 | 4 | 5;
  innovationDemand: 1 | 2 | 3 | 4 | 5;
  executionPrecisionDemand: 1 | 2 | 3 | 4 | 5;
  customerExposure: 1 | 2 | 3 | 4 | 5;
  conflictLoad: 1 | 2 | 3 | 4 | 5;
  changeVelocity: 1 | 2 | 3 | 4 | 5;
  failureCost: 1 | 2 | 3 | 4 | 5;
}

interface ContextProfile {
  id: string;
  organizationId: string;
  name: string;
  roleTitle: string;
  jobFamily: JobFamily;
  jobLevel: JobLevel;
  status: ContextStatus;
  values: ContextProfileValues;
  successProfileNotes?: string;
  linkedBlueprintId?: string;
  updatedAt: string;
  version: string;
  versionHistory: VersionEntry[];
}
```

---

## 9. Assessment Draft, Assignment, Invitation, and Reminder

```ts
interface AssessmentDraft {
  id: string;
  participantId: string;
  organizationId: string;
  useCase: UseCase;
  targetRole: string;
  jobLevel: JobLevel;
  jobRequirementsProfileId?: string;
  roleBlueprintId?: string;
  contextProfileId?: string;
  selectedQuestions: SelectedQuestion[];
  estimatedDurationMinutes?: number;
  domainCoverage?: Record<DomainId, number>;
  dimensionCoverage?: Record<string, number>;
  adminApproved: boolean;
  deadline?: string;
  reminderSchedule: string[];
  invitationMessage?: string;
  createdAt: string;
  updatedAt: string;
}

interface AssessmentAssignment {
  id: string;
  draftId: string;
  participantId: string;
  organizationId: string;
  useCase: UseCase;
  targetRole: string;
  jobLevel: JobLevel;
  roleBlueprintId?: string;
  contextProfileId?: string;
  assignedAt: string;
  deadline?: string;
  lifecycleStatus: AssessmentLifecycleStatus;
  validityStatus: AssessmentValidityStatus;
  progressPercent: number;
  reportStatus?: ReportStatus;
}

interface AssessmentInvitation {
  id: string;
  assessmentId: string;
  participantId: string;
  email: string;
  status: InvitationStatus;
  sentAt?: string;
  openedAt?: string;
  expiresAt?: string;
}

interface AssessmentReminder {
  id: string;
  assessmentId: string;
  kind: 'Scheduled' | 'Manual';
  channel: 'In Platform' | 'Email' | 'Both';
  scheduledFor?: string;
  sentAt?: string;
  status: 'Scheduled' | 'Sent' | 'Failed' | 'Cancelled';
}
```

---

## 10. User Runtime and Question-Level Scoring Attribution

```ts
interface QuestionResponse {
  assessmentId: string;
  sourceQuestionId: string;
  value: number | string;
  answeredAt: string;
}

interface RuntimeState {
  assessmentId: string;
  participantId: string;
  questionIndex: number;
  answers: Record<string, number | string>;
  progressPercent: number;
  paused: boolean;
  startedAt?: string;
  lastSavedAt?: string;
  submittedAt?: string;
}

interface ScoringAttribution {
  assessmentId: string;
  sourceQuestionId: string;
  responseValue: number | string;
  immutableItemReference: Readonly<ItemBankItem>;
}
```

Frontend rule:
- capture answers,
- preserve source mapping,
- never perform production scoring in the UI.

---

## 11. Reports and Domain 6

```ts
interface DimensionResult {
  dimensionId: string;
  dimensionName: string;
  score: number;
  confidence: ConfidenceBand;
  scoreBand: ScoreBand;
  standardError?: number;
  visibility: OutputVisibility;
  explanation?: string;
}

interface DomainResult {
  domainId: DomainId;
  label: string;
  colorToken: string;
  dimensions: DimensionResult[];
}

interface SecondaryIndex {
  code: 'AFI' | 'ECFI' | 'SII' | 'DDI' | 'PDRI' | 'ECSI';
  name: string;
  score?: number;
  type: 'fit' | 'risk';
  visibility: OutputVisibility;
  explanation?: string;
}

interface RadarAxis {
  axis: string;
  person: number;
  required: number;
}

interface Domain6Result {
  cai?: number;
  dii?: number;
  caiBand?: string;
  confidence: Domain6Confidence;
  narrative: string;
  secondaryIndices: SecondaryIndex[];
  radar: RadarAxis[];
  contextStrengths: string[];
  contextCautions: string[];
  visibility: OutputVisibility;
  provisionalReasons?: string[];
}

interface ReportInsight {
  dimensionId: string;
  score?: number;
  text: string;
}

interface InterviewPrompt {
  dimensionId: string;
  question: string;
}

interface OmittedSection {
  name: string;
  reason: string;
}

interface Report {
  id: string;
  participantId: string;
  organizationId: string;
  assessmentId: string;
  useCase: UseCase;
  targetRole: string;
  blueprintId?: string;
  contextProfileId?: string;
  completedAt: string;
  status: ReportStatus;
  confidence: ConfidenceBand;
  scoringVersion: string;
  synthesisWeightVersion: string;
  domains: DomainResult[];
  strengths: ReportInsight[];
  areasToExplore: ReportInsight[];
  domain6?: Domain6Result;
  interviewPrompts: InterviewPrompt[];
  limitations: string[];
  omittedSections: OmittedSection[];
}

interface UserSafeDomain6Summary {
  alignmentBand?: string;
  narrative?: string;
}

interface UserSafeReport {
  id: string;
  assessmentId: string;
  useCase: UseCase;
  targetRole: string;
  completedAt: string;
  status: ReportStatus;
  confidence: ConfidenceBand;
  domains: DomainResult[];
  strengths: ReportInsight[];
  areasToExplore: ReportInsight[];
  domain6Summary?: UserSafeDomain6Summary;
  limitations: string[];
}
```

---

## 12. Comparison, Notifications, Exports, Timeline, and Audit

```ts
interface ComparisonParticipant {
  participantId: string;
  displayName: string;
  initials: string;
  confidence: ConfidenceBand;
  contextualBand?: string;
  dimensionScores: Record<string, number>;
  strengths: string[];
  areasToExplore: string[];
  interviewPrompts: string[];
}

interface CandidateComparison {
  roleTitle: string;
  blueprintId: string;
  contextProfileId: string;
  dimensionIds: string[];
  participants: ComparisonParticipant[];
}

type NotificationType =
  | 'invited'
  | 'started'
  | 'completed'
  | 'deadline'
  | 'reminder'
  | 'expired'
  | 'report'
  | 'caution'
  | 'partial'
  | 'blueprint'
  | 'context'
  | 'upload'
  | 'export'
  | 'consent'
  | 'privacy';

interface AppNotification {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  emailDelivery: 'Not Required' | 'Queued' | 'Sent' | 'Failed';
  relatedRoute?: string;
}

type ExportType =
  | 'users'
  | 'assessments'
  | 'history'
  | 'reports'
  | 'comparison'
  | 'blueprints'
  | 'contexts';

interface ExportJob {
  id: string;
  organizationId: string;
  type: ExportType;
  filters?: string;
  dateRange?: string;
  status: ExportStatus;
  progressPercent: number;
  downloadUrl?: string;
  createdAt: string;
}

interface TimelineEvent {
  id: string;
  entityType: 'Participant' | 'Assessment' | 'Blueprint' | 'Context' | 'Report' | 'Export';
  entityId: string;
  label: string;
  detail?: string;
  createdAt: string;
}

interface ActivityLogEvent {
  id: string;
  organizationId: string;
  actorName: string;
  action: string;
  targetType: string;
  targetId?: string;
  detail?: string;
  createdAt: string;
}
```
