// In-house message catalog (Spec 009 / US2, FR-PVR-006/007, clarify Q1). No runtime i18n dependency.
// Display copy only — never restricted/report content (constitution IX). Keys are namespaced by
// surface (auth.*, runtime.*, dashboard.*, profile.*, common.*). `en` is the default/fallback locale
// (LTR); `ar` is the sample RTL locale. Surfaces beyond the priority set adopt keys incrementally.
export type Locale = 'en' | 'ar';

export const DEFAULT_LOCALE: Locale = 'en';
export const SUPPORTED_LOCALES: Locale[] = ['en', 'ar'];
export const RTL_LOCALES: Locale[] = ['ar'];

/** Human label for each locale (shown in the language selector). */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
};

export type MessageKey = string;

/** Keyed messages per locale. A missing key falls back to the DEFAULT_LOCALE value (FR-PVR-007). */
export const catalog: Record<Locale, Record<MessageKey, string>> = {
  en: {
    // Common
    'common.email': 'Email',
    'common.password': 'Password',
    'common.language': 'Language',
    'common.returnHome': 'Return home',
    'common.backToDashboard': 'Back to dashboard',
    'common.backToSignIn': 'Back to sign in',
    'common.pleaseWait': 'Please wait…',
    'common.retry': 'Retry',
    'common.noData': 'No data',

    // Auth — landing
    'auth.landing.title': 'Step into a new era of human insight',
    'auth.landing.subtitle':
      'Governed, AI-assisted assessment for development and hiring support — explainable, contextual, and human-led.',
    'auth.landing.enter': 'Enter the Platform',
    'auth.landing.haveInvitation': 'I have an invitation',

    // Auth — admin sign in
    'auth.admin.title': 'Admin sign in',
    'auth.signIn': 'Sign in',
    'auth.signingIn': 'Signing in…',
    'auth.candidatePortal': 'Have an invitation? Candidate portal',
    'auth.forgotPassword': 'Forgot password?',

    // Auth — invitation
    'auth.invitation.expiredTitle': 'Invitation expired',
    'auth.invitation.expiredBody':
      'This invitation link is no longer valid. It may have expired or already been used. You can still sign in if you’ve activated your account, or contact your organization for a new invitation.',
    'auth.invitation.goToSignIn': 'Go to sign in',
    'auth.invitation.activateTitle': 'Activate your account',
    'auth.invitation.welcomeBack': 'Welcome back',
    'auth.invitation.intro':
      'You have a permanent account. Activate it from your invitation (set a password), then sign in to return.',
    'auth.invitation.code': 'Invitation code',
    'auth.invitation.setPassword': 'Set a password',
    'auth.invitation.activateContinue': 'Activate & continue',
    'auth.invitation.alreadyActivated': 'Already activated? Sign in',
    'auth.invitation.firstTime': 'First time? Activate from invitation',

    // Auth — recovery
    'auth.reset.title': 'Reset your password',
    'auth.reset.sentBody':
      'If an account exists for that email, a reset link has been sent. Check your inbox and follow the link to set a new password.',
    'auth.reset.openLinkDemo': 'Open reset link (demo)',
    'auth.reset.intro': 'Enter your email and we’ll send a link to reset your password.',
    'auth.reset.send': 'Send reset link',
    'auth.reset.sending': 'Sending…',
    'auth.reset.newTitle': 'Set a new password',
    'auth.reset.checking': 'Checking your reset link…',
    'auth.reset.invalidTitle': 'Reset link invalid',
    'auth.reset.invalidMissing': 'missing or incomplete',
    'auth.reset.invalidExpired': 'expired or already used',
    'auth.reset.invalidBody': 'This password reset link is {state}. Please request a new one.',
    'auth.reset.requestNew': 'Request a new link',
    'auth.reset.newPassword': 'New password',
    'auth.reset.confirmPassword': 'Confirm new password',
    'auth.reset.tooShort': 'Password must be at least 8 characters.',
    'auth.reset.mismatch': 'Passwords do not match.',
    'auth.reset.update': 'Update password',
    'auth.reset.updating': 'Updating…',
    'auth.reset.updated': 'Password updated — please sign in.',
    'auth.signedIn': 'Signed in',

    // Auth — errors
    'auth.accessDenied.title': 'Access denied',
    'auth.accessDenied.body': "You don't have access to that area.",
    'auth.notFound.title': 'Page not found',
    'auth.notFound.body': 'The page you’re looking for doesn’t exist or may have moved.',

    // Dashboards
    'dashboard.admin.title': 'Dashboard',
    'dashboard.admin.sub': 'Organization overview',
    'dashboard.user.title': 'Dashboard',
    'dashboard.user.welcome': 'Welcome back',
    'dashboard.user.sub': 'Your assessments and reports',
    'dashboard.user.activeAssessment': 'Active assessment',
    'dashboard.user.continue': 'Continue assessment',
    'dashboard.user.start': 'Start assessment',
    'dashboard.user.noActive': 'No active assessment',
    'dashboard.user.noActiveSub':
      'When an assessment is assigned to you, it will appear here. You can pause and resume anytime.',
    'dashboard.user.completed': 'Completed',
    'dashboard.user.reports': 'Reports',
    'dashboard.user.notifications': 'Notifications',
    'dashboard.user.viewHistory': 'View history →',
    'dashboard.user.myReports': 'My reports →',
    'dashboard.user.viewAll': 'View all →',
    'dashboard.user.due': 'due {date}',
    'dashboard.user.percentComplete': '{percent}% complete',
    'dashboard.user.notStarted': 'Not started',
    'dashboard.user.completedTitle': 'Completed Assessments',
    'dashboard.user.availableReports': 'Available Reports',
    'dashboard.user.recentNotifications': 'Recent Notifications',
    'dashboard.user.viewReport': 'View Report',
    'dashboard.user.nothingYet': 'Nothing here yet',
    'dashboard.user.needHand': 'Need a hand?',
    'dashboard.user.needHandBody':
      "Questions about your assessment or privacy? We're here to help.",
    'dashboard.user.visitHelp': 'Visit Help & Support →',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.recentUsers': 'Recent Candidates',
    'dashboard.recentAssessments': 'Recent Assessments',
    'dashboard.loadError': 'Failed to load the dashboard.',
    'dashboard.kpi.totalUsers': 'Total Users',
    'dashboard.kpi.activeAssessments': 'Active Assessments',
    'dashboard.kpi.notStarted': 'Not Started',
    'dashboard.kpi.inProgress': 'In Progress',
    'dashboard.kpi.completed': 'Completed',
    'dashboard.kpi.reportsAvailable': 'Reports Available',
    'dashboard.kpi.reportsWithCaution': 'Reports With Caution',
    'dashboard.kpi.validatedBlueprints': 'Validated Blueprints',
    'dashboard.qa.addUser': 'Add User',
    'dashboard.qa.createAssessment': 'Create Assessment',
    'dashboard.qa.createBlueprint': 'Create Role Blueprint',
    'dashboard.qa.createContext': 'Create Context Profile',
    'dashboard.qa.viewReports': 'View Reports',
    'dashboard.qa.compareCandidates': 'Compare Candidates',

    // Runtime
    'runtime.pause': 'Pause',
    'runtime.resume': 'Resume',
    'runtime.back': 'Back',
    'runtime.next': 'Next',
    'runtime.submit': 'Submit',
    'runtime.saved': 'Saved',
    'runtime.saving': 'Saving…',
    'runtime.saveExit': 'Save & exit',
    'runtime.review': 'Review',
    'runtime.reviewTitle': 'Review & submit',
    'runtime.reviewIntro':
      'You can revisit any question before submitting. Once submitted, your responses are sent for processing.',
    'runtime.answered': 'Answered',
    'runtime.skipped': 'Skipped',
    'runtime.submitAssessment': 'Submit assessment',
    'runtime.loadError': 'We couldn’t load this assessment. Your answers are safe.',
    'runtime.retry': 'Retry',
    'runtime.notFound': 'Assessment not found',
    'runtime.hiringSupport': 'Hiring support',
    'runtime.developmental': 'Developmental',
    'runtime.questionOf': 'Question {current} of {total}',
    'runtime.autoSaveOn': 'Auto-save on',
    'runtime.section': 'Assessment',
    'runtime.ofCount': '{current} of {total}',
    'runtime.progressLabel': 'Assessment progress',
    // Question-type pill (design user_assessment.jsx QuestionCard) — method-family label per item.
    'runtime.type.likert': 'Agreement Scale',
    'runtime.type.contextual_self_report': 'Frequency Scale',
    'runtime.type.forced_choice': 'Paired Choice',
    'runtime.type.cognitive_multiple_choice': 'Multiple Choice',
    'runtime.type.sjt': 'Situational Judgement',

    // Profile & Privacy
    'profile.title': 'My Profile',
    'profile.preferences': 'Preferences',
    'profile.privacy': 'Privacy',
    'profile.profile': 'Profile',
    'profile.security': 'Security',
    'profile.name': 'Name',
    'profile.theme': 'Theme',
    'profile.notifications': 'Notifications',
    'profile.theme.light': 'Light',
    'profile.theme.dark': 'Dark',
    'profile.theme.system': 'System',
    'profile.notif.all': 'All',
    'profile.notif.important': 'Important only',
    'profile.notif.none': 'None',
    'profile.changePassword': 'Change password (simulated)',
    'profile.passwordUpdated': 'Password updated',
    'profile.passwordUpdatedBody': 'This is a simulated change (no backend).',
    'profile.signOut': 'Sign out',

    // Profile & Privacy (User)
    'privacy.title': 'Profile & Privacy',
    'privacy.sub': 'Your information and privacy choices',
    'privacy.personalInfo': 'Personal information',
    'privacy.savePreferences': 'Save preferences',
    'privacy.preferencesSaved': 'Preferences saved.',
    'privacy.changePassword': 'Change password',
    'privacy.newPassword': 'New password',
    'privacy.confirmPassword': 'Confirm new password',
    'privacy.updatePassword': 'Update password',
    'privacy.passwordUpdated': 'Password updated.',
    'privacy.consentHistory': 'Consent history',
    'privacy.noConsent': 'No consent records yet',
    'privacy.required': 'Required',
    'privacy.optional': 'Optional',
    'privacy.revoke': 'Revoke',
    'privacy.revoked': 'Consent revoked.',
    'privacy.locked': 'Locked',
    'privacy.requestDeletion': 'Request data deletion',
    'privacy.deletionIntro':
      'You can ask us to delete your assessment data. We’ll review your request — it won’t be actioned automatically.',
    'privacy.requestOn': 'Request {date}',
    'privacy.pendingReview': 'Pending review',
    'privacy.reasonOptional': 'Reason (optional)',
    'privacy.reasonPlaceholder': 'Tell us anything that helps us handle your request…',
    'privacy.submitDeletion': 'Submit deletion request',
    'privacy.deletionSubmitted': 'Deletion request submitted — pending review.',
  },
  ar: {},
};

/** Normalize an arbitrary stored/string value to a supported locale (or null if unrecognized). */
export function toLocale(value: string | null | undefined): Locale | null {
  return value && (SUPPORTED_LOCALES as string[]).includes(value) ? (value as Locale) : null;
}

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}
