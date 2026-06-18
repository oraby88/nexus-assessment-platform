// Service contracts (Spec 009 / FR-PVR-001/003, constitution IV). One typed interface per exported
// service mirroring today's mock signatures — these ARE the de-facto API a future backend must
// satisfy without a UI rewrite. Each mock service asserts conformance via `satisfies <Contract>`
// (compile-time only, no runtime cost). Kept in sync with specs/000-shared/handoff-map.md.
import type {
  AddUserInput,
  AdaptedQuestionText,
  AgentTurn,
  AppNotification,
  AssessmentAssignment,
  AssessmentDraft,
  AssessmentInvitation,
  AssessmentReminder,
  ActivityLogEvent,
  BlueprintStatus,
  BulkUploadResult,
  CandidateComparison,
  ComparisonEligibility,
  ConsentRecord,
  ContextProfile,
  ContextStatus,
  CsvRowResult,
  DataDeletionRequest,
  DiscoveryAnswer,
  ExportJob,
  ExportRegistryEntry,
  ExportType,
  ItemBankItem,
  JobLevel,
  JobRequirementsProfile,
  MethodFamily,
  OrgSettings,
  Participant,
  Report,
  RoleBlueprint,
  RuntimeSession,
  RuntimeState,
  SelectedQuestion,
  Session,
  TimelineEvent,
  UseCase,
  UserAssessmentSummary,
  UserSafeReport,
  VersionEntry,
} from '@/models';
import type { ComparisonSetup } from '@/services/comparison/comparisonService';

// --- Auth (Spec 001/007) ---
export interface AuthServiceContract {
  getSession(): Session | null;
  loginAdmin(email: string): Promise<Session>;
  activateInvitation(code: string, password: string): Promise<Session>;
  loginUser(email: string): Promise<Session>;
  requestReset(email: string): Promise<{ ok: true }>;
  verifyResetToken(token: string): Promise<'valid' | 'expired' | 'missing'>;
  resetPassword(token: string, password: string): Promise<{ ok: true }>;
  logout(): void;
}

// --- Participant roster (Spec 002) ---
export interface ParticipantServiceContract {
  list(query?: { search?: string }): Promise<Participant[]>;
  get(id: string): Promise<Participant | undefined>;
  add(input: AddUserInput): Promise<Participant>;
  bulkUpload(csvText: string): Promise<BulkUploadResult>;
  confirmImport(rows: CsvRowResult[]): Promise<Participant[]>;
  history(participantId: string): Promise<AssessmentAssignment[]>;
}

// --- Governed question bank (Spec 003) ---
export interface QuestionBankServiceContract {
  select(criteria?: {
    domainId?: string;
    dimensionId?: string;
    jobLevel?: JobLevel;
    useCase?: UseCase;
  }): Promise<ItemBankItem[]>;
  propose(
    profile: JobRequirementsProfile,
    jobLevel: JobLevel,
    useCase: UseCase,
  ): Promise<SelectedQuestion[]>;
}

// --- Assessment monitoring/actions (Spec 002/003) ---
export interface AssessmentServiceContract {
  list(): Promise<AssessmentAssignment[]>;
  create(input: {
    participantId: string;
    email?: string;
    useCase: AssessmentAssignment['useCase'];
    targetRole: string;
    jobLevel: AssessmentAssignment['jobLevel'];
    deadline?: string;
  }): Promise<{ assignment: AssessmentAssignment; invitation: AssessmentInvitation }>;
  get(id: string): Promise<AssessmentAssignment | undefined>;
  timeline(id: string): Promise<TimelineEvent[]>;
  remind(id: string): Promise<AssessmentAssignment>;
  resendInvitation(id: string): Promise<AssessmentInvitation>;
  extendDeadline(id: string, deadline: string): Promise<AssessmentAssignment>;
  cancel(id: string): Promise<AssessmentAssignment>;
}

// --- Create-assessment draft orchestration (Spec 003) ---
export interface AssessmentDraftServiceContract {
  create(participantId: string): Promise<AssessmentDraft>;
  save(draft: AssessmentDraft): Promise<AssessmentDraft>;
  get(id: string): Promise<AssessmentDraft | undefined>;
  approve(id: string): Promise<AssessmentDraft>;
  send(
    draft: AssessmentDraft,
  ): Promise<{ assignment: AssessmentAssignment; invitation: AssessmentInvitation }>;
}

// --- Scripted discovery agent (Spec 003) ---
export interface AgentDiscoveryServiceContract {
  start(useCase: UseCase): Promise<AgentTurn>;
  next(
    answers: DiscoveryAnswer[],
    useCase: UseCase,
  ): Promise<{ turn: AgentTurn | null; requirements: JobRequirementsProfile }>;
  summary(answers: DiscoveryAnswer[], useCase: UseCase): Promise<JobRequirementsProfile>;
}

// --- Controlled adaptation/rephrase (Spec 003) ---
export interface AdaptationServiceContract {
  canAdapt(methodFamily: MethodFamily): boolean;
  adapt(input: {
    itemId: string;
    adaptedText: string;
    item: Readonly<ItemBankItem>;
  }): Promise<AdaptedQuestionText>;
}

type BlueprintInput = Omit<
  RoleBlueprint,
  'id' | 'version' | 'versionHistory' | 'updatedAt' | 'assessmentsUsed'
>;

// --- Role blueprints (Spec 004) ---
export interface RoleBlueprintServiceContract {
  list(): Promise<RoleBlueprint[]>;
  get(id: string): Promise<RoleBlueprint | undefined>;
  create(input: BlueprintInput): Promise<RoleBlueprint>;
  update(bp: RoleBlueprint): Promise<RoleBlueprint>;
  duplicate(id: string): Promise<RoleBlueprint>;
  setStatus(id: string, status: BlueprintStatus): Promise<RoleBlueprint>;
  versions(id: string): Promise<VersionEntry[]>;
  link(blueprintId: string, contextId: string): Promise<RoleBlueprint>;
  isEligible(b: RoleBlueprint, opts?: { useCase?: UseCase }): boolean;
}

type ContextInput = Omit<ContextProfile, 'id' | 'version' | 'versionHistory' | 'updatedAt'>;

// --- Context profiles (Spec 004) ---
export interface ContextProfileServiceContract {
  list(): Promise<ContextProfile[]>;
  get(id: string): Promise<ContextProfile | undefined>;
  create(input: ContextInput): Promise<ContextProfile>;
  update(cx: ContextProfile): Promise<ContextProfile>;
  duplicate(id: string): Promise<ContextProfile>;
  setStatus(id: string, status: ContextStatus): Promise<ContextProfile>;
  versions(id: string): Promise<VersionEntry[]>;
  link(contextId: string, blueprintId: string): Promise<ContextProfile>;
}

// --- Reports (Spec 005) ---
export interface ReportServiceContract {
  list(): Promise<Report[]>;
  getAdmin(id: string): Promise<Report | undefined>;
  getUserSafe(id: string): Promise<UserSafeReport | undefined>;
  downloadPdf(id: string): Promise<{ ok: true }>;
}

// --- Candidate comparison (Spec 005) ---
export interface ComparisonServiceContract {
  build(setup: ComparisonSetup): Promise<{
    comparison: CandidateComparison;
    eligibility: ComparisonEligibility[];
  }>;
}

// --- Assessment runtime (Spec 006) ---
export interface RuntimeServiceContract {
  load(assessmentId: string): Promise<RuntimeSession>;
  answer(
    assessmentId: string,
    sourceQuestionId: string,
    value: number | string,
  ): Promise<RuntimeState>;
  next(assessmentId: string): Promise<RuntimeState>;
  back(assessmentId: string): Promise<RuntimeState>;
  goTo(assessmentId: string, index: number): Promise<RuntimeState>;
  pause(assessmentId: string): Promise<RuntimeState>;
  resume(assessmentId: string): Promise<RuntimeState>;
  submit(assessmentId: string): Promise<{ ok: true; submittedAt: string }>;
  getProgress(assessmentId: string): Promise<RuntimeState | null>;
  myAssessments(): Promise<UserAssessmentSummary[]>;
}

// --- Consent & data deletion (Spec 006/007) ---
export interface ConsentServiceContract {
  forAssessment(assessmentId: string): Promise<ConsentRecord[]>;
  forParticipant(participantId: string): Promise<ConsentRecord[]>;
  history(): Promise<ConsentRecord[]>;
  accept(consentId: string): Promise<ConsentRecord>;
  decline(consentId: string): Promise<ConsentRecord>;
  revoke(consentId: string): Promise<ConsentRecord>;
  requestDeletion(note?: string): Promise<DataDeletionRequest>;
  deletionRequests(): Promise<DataDeletionRequest[]>;
  allDeletionRequests(): Promise<DataDeletionRequest[]>;
  resolveDeletion(
    id: string,
    status: 'In Review' | 'Completed' | 'Rejected',
    reason?: string,
  ): Promise<DataDeletionRequest>;
}

// --- Notifications (Spec 002) ---
export interface NotificationServiceContract {
  list(): Promise<AppNotification[]>;
  unreadCount(): Promise<number>;
  markRead(id: string): Promise<void>;
  markAllRead(): Promise<void>;
}

// --- Exports (Spec 002/005) ---
export interface ExportServiceContract {
  registry(): Promise<ExportRegistryEntry[]>;
  history(): Promise<ExportJob[]>;
  request(type: ExportType): Promise<ExportJob>;
  getCsv(jobId: string): Promise<string>;
  recordPdf(type: ExportType): Promise<ExportJob>;
}

// --- Organization settings (Spec 002) ---
export interface SettingsServiceContract {
  get(): Promise<OrgSettings>;
  update(patch: Partial<OrgSettings>): Promise<OrgSettings>;
}

// --- Read-only list services defined on the aggregator (Spec 002/007) ---
export interface ActivityLogServiceContract {
  list(): Promise<ActivityLogEvent[]>;
}
export interface AssessmentReminderServiceContract {
  list(): Promise<AssessmentReminder[]>;
}
export interface InvitationServiceContract {
  list(): Promise<AssessmentInvitation[]>;
}

/**
 * The full set of swappable service contracts — the de-facto API surface a future `live` backend
 * must implement. Keyed by the aggregator export name (drift guard in tests/integration-seam).
 */
export interface ServiceContracts {
  authService: AuthServiceContract;
  participantService: ParticipantServiceContract;
  questionBankService: QuestionBankServiceContract;
  assessmentService: AssessmentServiceContract;
  assessmentDraftService: AssessmentDraftServiceContract;
  agentDiscoveryService: AgentDiscoveryServiceContract;
  adaptationService: AdaptationServiceContract;
  roleBlueprintService: RoleBlueprintServiceContract;
  contextProfileService: ContextProfileServiceContract;
  reportService: ReportServiceContract;
  comparisonService: ComparisonServiceContract;
  runtimeService: RuntimeServiceContract;
  consentService: ConsentServiceContract;
  notificationService: NotificationServiceContract;
  exportService: ExportServiceContract;
  settingsService: SettingsServiceContract;
  activityLogService: ActivityLogServiceContract;
  assessmentReminderService: AssessmentReminderServiceContract;
  invitationService: InvitationServiceContract;
}

/** The data-source contract names a future backend must satisfy (used by the drift test). */
export const CONTRACT_SERVICE_NAMES = [
  'authService',
  'participantService',
  'questionBankService',
  'assessmentService',
  'assessmentDraftService',
  'agentDiscoveryService',
  'adaptationService',
  'roleBlueprintService',
  'contextProfileService',
  'reportService',
  'comparisonService',
  'runtimeService',
  'consentService',
  'notificationService',
  'exportService',
  'settingsService',
  'activityLogService',
  'assessmentReminderService',
  'invitationService',
] as const;

export type ContractServiceName = (typeof CONTRACT_SERVICE_NAMES)[number];
