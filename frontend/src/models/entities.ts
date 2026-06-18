// Additional domain entities (subset of data-model.md) authored so the foundation can ship
// typed service stubs (FR-FND-013) and a richer fixture set (FR-FND-017). Area specs 002–007
// extend these as their features need.
import type {
  AssessmentLifecycleStatus,
  BlueprintStatus,
  ConfidenceBand,
  ContextStatus,
  DomainId,
  ItemBankItem,
  JobLevel,
  MethodFamily,
  OutputVisibility,
  ReportStatus,
  ResponseScale,
  UseCase,
} from './index';

export type JobFamily =
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

export type ConsentStatus = 'Pending' | 'Granted' | 'Declined' | 'Revoked';
export type AssessmentValidityStatus =
  | 'Pending'
  | 'Valid'
  | 'Pass With Limits'
  | 'Valid but Uninterpretable'
  | 'Incomplete'
  | 'Invalid'
  | 'Deferred';
export type InvitationStatus = 'Draft' | 'Sent' | 'Opened' | 'Expired' | 'Cancelled';
export type ExportStatus = 'Queued' | 'Processing' | 'Ready' | 'Failed';
export type ExportType =
  | 'users'
  | 'assessments'
  | 'history'
  | 'reports'
  | 'comparison'
  | 'blueprints'
  | 'contexts';

export interface VersionEntry {
  version: string;
  date: string;
  summary: string;
  status?: string;
}

export interface DimensionImportance {
  dimensionId: string;
  importance: 'Low' | 'Moderate' | 'Critical';
  rationale?: string;
}

/** A construct dimension derived from the governed item_bank (Spec 004 / FR-BC-003). */
export interface DimensionCatalogEntry {
  dimensionId: string;
  dimensionName: string;
  domainId: string;
}

export interface RoleBlueprint {
  id: string;
  organizationId: string;
  name: string;
  roleTitle: string;
  jobFamily: JobFamily;
  jobLevel: JobLevel;
  status: BlueprintStatus;
  linkedContextProfileId?: string;
  version: string;
  updatedAt: string;
  // --- Full field set (Spec 004); optional to keep existing fixtures valid. ---
  purpose?: string;
  responsibilities?: string[];
  workContext?: string;
  successIndicators?: string[];
  failureRisks?: string[];
  nonNegotiables?: string[];
  requiredDimensionIds?: string[];
  optionalDimensionIds?: string[];
  excludedDimensionIds?: string[];
  dimensionImportance?: DimensionImportance[];
  evidence?: string[];
  notes?: string;
  assessmentsUsed?: number;
  versionHistory?: VersionEntry[];
}

/** Context factors on 1–5 scales (leadership scope 0–4) — shared data-model §8. */
export interface ContextProfileValues {
  leadershipScope: number;
  ambiguityLevel: number;
  decisionStakes: number;
  timePressure: number;
  regulatoryConstraint: number;
  autonomyLevel: number;
  stakeholderComplexity: number;
  interdependenceLevel: number;
  innovationDemand: number;
  executionPrecisionDemand: number;
  customerExposure: number;
  conflictLoad: number;
  changeVelocity: number;
  failureCost: number;
}

export interface ContextProfile {
  id: string;
  organizationId: string;
  name: string;
  roleTitle: string;
  jobFamily: JobFamily;
  jobLevel: JobLevel;
  status: ContextStatus;
  version: string;
  updatedAt: string;
  // --- Full field set (Spec 004); optional to keep existing fixtures valid. ---
  values?: ContextProfileValues;
  successProfileNotes?: string;
  linkedBlueprintId?: string;
  versionHistory?: VersionEntry[];
}

export interface ContextSignatureData {
  axes: { axis: string; value: number }[];
  summary: string;
}

export interface AssessmentAssignment {
  id: string;
  participantId: string;
  organizationId: string;
  useCase: UseCase;
  targetRole: string;
  jobLevel: JobLevel;
  assignedAt: string;
  deadline?: string;
  lifecycleStatus: AssessmentLifecycleStatus;
  validityStatus: AssessmentValidityStatus;
  progressPercent: number;
  reportStatus?: ReportStatus;
}

export interface AssessmentInvitation {
  id: string;
  assessmentId: string;
  participantId: string;
  email: string;
  status: InvitationStatus;
  sentAt?: string;
  expiresAt?: string;
}

export interface AssessmentReminder {
  id: string;
  assessmentId: string;
  kind: 'Scheduled' | 'Manual';
  channel: 'In Platform' | 'Email' | 'Both';
  scheduledFor?: string;
  status: 'Scheduled' | 'Sent' | 'Failed' | 'Cancelled';
}

export interface OmittedSection {
  name: string;
  reason: string;
}

// --- Report detail / Domain 6 / comparison (Spec 005); all new fields optional to keep 002 fixtures valid. ---

export type ScoreBand = 'Strong' | 'Effective' | 'Mixed' | 'Developing';
export type Domain6Confidence = 'High' | 'Moderate' | 'Provisional';

export interface DimensionResult {
  dimensionId: string;
  dimensionName: string;
  score: number;
  confidence: ConfidenceBand;
  scoreBand: ScoreBand;
  standardError?: number;
  explanation?: string;
  blocked?: boolean;
}

export interface DomainResult {
  domainId: DomainId;
  label: string;
  dimensions: DimensionResult[];
}

export interface SecondaryIndex {
  code: 'AFI' | 'ECFI' | 'SII' | 'DDI' | 'PDRI' | 'ECSI';
  name: string;
  score?: number;
  type: 'fit' | 'risk';
  confidence?: ConfidenceBand;
  visibility?: OutputVisibility;
  explanation?: string;
}

export interface ReportRadarAxis {
  axis: string;
  person: number;
  required: number;
}

export interface Domain6Result {
  cai?: number;
  dii?: number;
  caiBand?: string;
  confidence: Domain6Confidence;
  narrative: string;
  secondaryIndices: SecondaryIndex[];
  radar: ReportRadarAxis[];
  contextStrengths: string[];
  contextCautions: string[];
  provisionalReasons?: string[];
  /** Derailment Risk is always blocked and never shown as data (constitution XI). */
  derailmentRiskBlocked: true;
}

export interface ReportInsight {
  dimensionId?: string;
  text: string;
}

export interface InterviewPrompt {
  dimensionId?: string;
  question: string;
}

export interface Report {
  id: string;
  participantId: string;
  organizationId: string;
  assessmentId: string;
  useCase: UseCase;
  targetRole: string;
  completedAt: string;
  status: ReportStatus;
  confidence: ConfidenceBand;
  omittedSections: OmittedSection[];
  // Spec 005 full shape (optional):
  domains?: DomainResult[];
  strengths?: ReportInsight[];
  areasToExplore?: ReportInsight[];
  domain6?: Domain6Result;
  interviewPrompts?: InterviewPrompt[];
  limitations?: string[];
  scoringVersion?: string;
  synthesisWeightVersion?: string;
  blueprintId?: string;
  contextProfileId?: string;
  blueprintVersion?: string;
  contextVersion?: string;
}

export interface UserSafeReport {
  id: string;
  assessmentId: string;
  useCase: UseCase;
  targetRole: string;
  completedAt: string;
  status: ReportStatus;
  confidence: ConfidenceBand;
  strengths: ReportInsight[];
  areasToExplore: ReportInsight[];
  domain6Summary?: { alignmentBand?: string; narrative?: string };
  limitations: string[];
}

export interface ComparisonParticipant {
  participantId: string;
  /** Current released report this column is built from (drives "Open Report"). */
  reportId: string;
  displayName: string;
  initials: string;
  confidence: ConfidenceBand;
  contextualBand?: string;
  /** Domain 6 Contextual Alignment Index (numeric) — surfaced as the comparison CAI ring. */
  cai?: number;
  dimensionScores: Record<string, number>;
  strengths: string[];
  areasToExplore: string[];
  interviewPrompts: string[];
}

export interface CandidateComparison {
  roleTitle: string;
  blueprintId?: string;
  contextProfileId?: string;
  dimensionIds: string[];
  participants: ComparisonParticipant[];
}

export interface ComparisonEligibility {
  participantId: string;
  eligible: boolean;
  reason?: string;
}

export interface ExportJob {
  id: string;
  organizationId: string;
  type: ExportType;
  status: ExportStatus;
  progressPercent: number;
  downloadUrl?: string;
  createdAt: string;
}

export interface ActivityLogEvent {
  id: string;
  organizationId: string;
  actorName: string;
  action: string;
  targetType: string;
  targetId?: string;
  detail?: string;
  createdAt: string;
}

// --- Admin Core (Spec 002) additions ---

export interface Organization {
  id: string;
  name: string;
  industry?: string;
  country?: string;
}

export interface TimelineEvent {
  id: string;
  entityType: 'Participant' | 'Assessment' | 'Blueprint' | 'Context' | 'Report' | 'Export';
  entityId: string;
  label: string;
  detail?: string;
  createdAt: string;
}

/** Add User drawer payload (FR-ADM-003). */
export interface AddUserInput {
  fullName: string;
  email: string;
  currentJobTitle?: string;
  targetJobTitle?: string;
  jobLevel: JobLevel;
  departmentText?: string;
  notes?: string;
}

/** One classified CSV row from bulk upload (FR-ADM-004). */
export interface CsvRowResult {
  row: number;
  raw: Record<string, string>;
  status: 'valid' | 'invalid' | 'duplicate';
  reasons?: string[];
  participant?: AddUserInput;
}

export interface BulkUploadResult {
  valid: CsvRowResult[];
  invalid: CsvRowResult[];
  duplicate: CsvRowResult[];
}

export type AssessmentAction = 'remind' | 'resendInvitation' | 'extendDeadline' | 'cancel';

/** Drives which export types are active vs pending their owning spec (research D2). */
export interface ExportRegistryEntry {
  type: ExportType;
  label: string;
  available: boolean;
  ownedBy: '002' | '004' | '005';
}

export interface OrgSettings {
  organization: Organization;
  admin: {
    name: string;
    email: string;
    notificationPreference: 'all' | 'important' | 'none';
    language: string;
  };
}

// --- Create Assessment flow (Spec 003) additions ---

export type AdaptationMode =
  | 'contextual_rephrase_allowed'
  | 'light_terminology_only'
  | 'verbatim_default'
  | 'approved_equivalence_only';

export interface DiffSpan {
  text: string;
  changed: boolean;
}

/** Display-only adaptation linked to the immutable source item_id (FR-CA-011). */
export interface AdaptedQuestionText {
  itemId: string;
  originalText: string;
  adaptedText: string;
  diff: DiffSpan[];
  mode: AdaptationMode;
  reason: string;
  generatedAt: string;
}

/** A chosen governed item (read-only) + selection context (FR-CA-010/017). */
export interface SelectedQuestion {
  item: Readonly<ItemBankItem>;
  requirementCovered: string;
  selectionReason: string;
  adaptation?: AdaptedQuestionText;
  approved: boolean;
}

export interface JobRequirementsProfile {
  role: string;
  jobLevel: JobLevel;
  useCase: UseCase;
  responsibilities: string[];
  skills: string[];
  behaviors: string[];
  contextFactors: string[];
  criticalDimensionIds: string[];
  successIndicators: string[];
  failureRisks: string[];
  nonNegotiables: string[];
  recommendedFocus: string[];
  estimatedDurationMinutes: number;
}

export interface AgentTurn {
  id: string;
  sender: 'agent' | 'admin';
  kind: 'question' | 'answer' | 'summary';
  text: string;
  topic?: string;
  createdAt: string;
}

export interface DiscoveryAnswer {
  questionId: string;
  topic: string;
  answer: string | string[];
  answeredAt: string;
  editedAt?: string;
}

export interface AssessmentDraft {
  id: string;
  participantId: string;
  useCase: UseCase;
  targetRole: string;
  jobLevel: JobLevel;
  sector?: string;
  description?: string;
  requirements?: JobRequirementsProfile;
  blueprintId?: string;
  contextProfileId?: string;
  selected: SelectedQuestion[];
  deadline?: string;
  reminderSchedule: string[];
  invitationMessage?: string;
  approved: boolean;
  currentStep: number;
  createdAt: string;
  updatedAt: string;
}

export interface CoverageWarning {
  dimensionId: string;
  level: 'warning' | 'note';
  message: string;
}

export interface CoverageReport {
  totalQuestions: number;
  estimatedDurationMinutes: number;
  byDomain: Record<string, number>;
  byDimension: Record<string, number>;
  methodDistribution: Record<string, number>;
  warnings: CoverageWarning[];
}

// --- User Portal & Assessment Runtime (Spec 006) ---
// Canonical shapes from specs/000-shared/data-model.md §3 (Consent & Privacy) and §10 (Runtime).
// All NEW exports (no edits to existing required fields). `ConsentStatus` is defined above.

export type ConsentUseCase =
  | 'pre_hire_screening'
  | 'developmental_feedback'
  | 'research'
  | 'third_party_sharing';

/** Per-use-case consent (granted/declined/revoked). Read by the User portal + Admin Consent tab. */
export interface ConsentRecord {
  id: string;
  participantId: string;
  assessmentId?: string;
  useCase: ConsentUseCase;
  label: string;
  informedText: string;
  status: ConsentStatus;
  required: boolean;
  /** optional consents: always true; required consent: true until the report is released, then false. */
  revocable: boolean;
  grantedAt?: string;
  declinedAt?: string;
  revokedAt?: string;
  organizationId: string;
}

/** Privacy deletion request — created pending ('Submitted'); resolved by the Spec 007 Admin inbox. */
export interface DataDeletionRequest {
  id: string;
  participantId: string;
  submittedAt: string;
  status: 'Submitted' | 'In Review' | 'Completed' | 'Rejected';
  note?: string;
  // --- Spec 007 resolution (optional; status-only — no real data removed) ---
  reason?: string; // Admin's reason; REQUIRED when status === 'Rejected'
  resolvedAt?: string; // set on a terminal state (Completed/Rejected)
}

/** A captured response, keyed by the immutable source Question ID (constitution VIII). No scoring. */
export interface QuestionResponse {
  assessmentId: string;
  sourceQuestionId: string;
  value: number | string;
  answeredAt: string;
}

/** In-progress runtime, persisted locally for pause/resume/reload. Answers keyed by source Question ID. */
export interface RuntimeState {
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

/** A pre-resolved item rendered verbatim to the User (display fields only; no governance metadata). */
export interface RuntimeItem {
  sourceQuestionId: string;
  methodFamily: MethodFamily;
  itemText: string;
  options: Partial<Record<'a' | 'b' | 'c' | 'd' | 'e', string>>;
  responseScale: ResponseScale;
  sectionId?: string;
  sectionName?: string;
}

/** What runtimeService.load returns: the fixed item set + rehydrated progress + display meta. */
export interface RuntimeSession {
  assessmentId: string;
  items: RuntimeItem[];
  state: RuntimeState;
  meta: {
    targetRole: string;
    useCase: UseCase;
    organizationName: string;
    estimatedMinutes?: number;
    deadline?: string;
  };
}

/** Own-data assessment summary for the dashboard hero / My Assessments / History. */
export interface UserAssessmentSummary {
  assessmentId: string;
  targetRole: string;
  useCase: UseCase;
  organizationName: string;
  deadline?: string;
  progressPercent: number;
  lifecycle: 'active' | 'in_progress' | 'submitted' | 'completed' | 'expired';
  reportId?: string;
}
