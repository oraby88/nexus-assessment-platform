// Shared domain models & enums — see specs/000-shared/data-model.md.
// Governance fields on ItemBankItem are READ-ONLY everywhere (constitution VI).

export type Role = 'admin' | 'user';
export type DomainId = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6';
export type DomainState = 'active' | 'restricted' | 'derived';

export type MethodFamily =
  | 'likert'
  | 'contextual_self_report'
  | 'forced_choice'
  | 'cognitive_multiple_choice'
  | 'sjt';
export type ItemFormat =
  | 'statement'
  | 'paired_statement'
  | 'mcq_single'
  | 'single_best_answer'
  | 'scenario_mcq';
export type ResponseScale =
  | '1-5 Agreement'
  | '1-5 Frequency'
  | 'forced_choice_binary'
  | 'cognitive_mcq'
  | 'sjt_single_best';
export type BankState = 'production' | 'pilot' | 'research';
export type UseStatus =
  | 'operational_allowed'
  | 'operational_allowed_with_restrictions'
  | 'operational_allowed_restricted_by_level'
  | 'operational_blocked';
export type ReviewStatus = 'draft' | 'needs_expert_review' | 'quarantine_pending_dif_review';
export type JobLevelOverlay = 'all_levels' | 'professional_plus' | 'manager_plus' | 'senior_plus';
export type LoadingType = 'primary' | 'adjacent' | 'direct';

export type UseCase = 'developmental' | 'hiring_support';
export type JobLevel =
  | 'Individual Contributor'
  | 'Professional'
  | 'Manager'
  | 'Senior Manager'
  | 'Director'
  | 'Executive';

export type AssessmentLifecycleStatus =
  | 'Draft'
  | 'Not Started'
  | 'In Progress'
  | 'Submitted'
  | 'Processing'
  | 'Completed'
  | 'Expired'
  | 'Cancelled';
export type ReportStatus =
  | 'Processing'
  | 'Released'
  | 'Released with Caution'
  | 'Partial Release'
  | 'Blocked Section'
  | 'Unavailable'
  | 'Deferred';
export type BlueprintStatus =
  | 'Draft'
  | 'Under Review'
  | 'Active'
  | 'Validated'
  | 'Deprecated'
  | 'Archived';
export type ContextStatus = 'Draft' | 'Active' | 'Archived';
export type ConfidenceBand = 'High' | 'Moderate' | 'Low' | 'Unacceptable';
export type OutputVisibility =
  | 'visible'
  | 'visible_with_caution'
  | 'downgraded'
  | 'hidden'
  | 'blocked'
  | 'not_generated';

export const SE_THRESHOLDS = { high: 0.25, moderate: 0.35, low: 0.45 } as const;

export interface Session {
  role: Role;
  userId: string;
  name: string;
  email: string;
  organizationId: string;
  organizationName: string;
}

export interface Participant {
  id: string;
  fullName: string;
  email: string;
  currentJobTitle?: string;
  targetJobTitle?: string;
  jobLevel: JobLevel;
  departmentText?: string;
  organizationId: string;
  dateAdded: string;
  totalAssessments: number;
  latestAssessmentLifecycle?: AssessmentLifecycleStatus;
  latestReportStatus?: ReportStatus;
}

export interface ItemBankItem {
  readonly itemId: string;
  readonly domainId: DomainId;
  readonly domainName: string;
  readonly dimensionId: string;
  readonly dimensionName: string;
  readonly facetId: string;
  readonly facetName: string;
  readonly methodFamily: MethodFamily;
  readonly itemFormat: ItemFormat;
  readonly itemText: string;
  readonly options: Partial<Record<'a' | 'b' | 'c' | 'd' | 'e', string>>;
  readonly keyedAnswer: string | null;
  readonly responseScale: ResponseScale;
  readonly bankState: BankState;
  readonly useStatus: UseStatus;
  readonly reviewStatus: ReviewStatus;
  readonly jobLevelOverlay: JobLevelOverlay;
  readonly reverseScored: boolean;
}

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  email: boolean;
}

// Substrate types (theme/persistence/async/http/nav/governance/toast) and additional domain entities.
export * from './foundation';
export * from './entities';
