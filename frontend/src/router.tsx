import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import {
  AdminShell,
  UserShell,
  FullBleedShell,
  PublicShell,
  RequireRole,
} from '@/components/layout';
import { Placeholder } from '@/features/placeholder';

// The auth/public screens (split-screen login, candidate card, recovery) are presentation-heavy and
// not needed for the first eager paint — code-split the whole auth module into one lazy chunk so the
// rich login markup stays out of the ≤260 KB eager bundle (FR-PVR-012). All render under a Suspense.
const Landing = lazy(() => import('@/features/auth').then((m) => ({ default: m.Landing })));
const AdminLogin = lazy(() => import('@/features/auth').then((m) => ({ default: m.AdminLogin })));
const InvitationAccess = lazy(() =>
  import('@/features/auth').then((m) => ({ default: m.InvitationAccess })),
);
const ForgotPassword = lazy(() =>
  import('@/features/auth').then((m) => ({ default: m.ForgotPassword })),
);
const ResetPassword = lazy(() =>
  import('@/features/auth').then((m) => ({ default: m.ResetPassword })),
);
const AccessDenied = lazy(() =>
  import('@/features/auth').then((m) => ({ default: m.AccessDenied })),
);
const NotFound = lazy(() => import('@/features/auth').then((m) => ({ default: m.NotFound })));

// Route-level lazy loading (FR-FND-014): heavier route content is code-split and loaded on demand
// with the shell's Suspense/Skeleton fallback.
const AdminDashboard = lazy(() =>
  import('@/features/dashboard/AdminDashboard').then((m) => ({ default: m.AdminDashboard })),
);
const UserDashboard = lazy(() =>
  import('@/features/pages').then((m) => ({ default: m.UserDashboard })),
);
const SampleServiceView = lazy(() =>
  import('@/components/SampleServiceView').then((m) => ({ default: m.SampleServiceView })),
);
const UsersList = lazy(() =>
  import('@/features/users/UsersList').then((m) => ({ default: m.UsersList })),
);
const UserDetail = lazy(() =>
  import('@/features/users/UserDetail').then((m) => ({ default: m.UserDetail })),
);
const AssessmentsList = lazy(() =>
  import('@/features/assessments/AssessmentsList').then((m) => ({ default: m.AssessmentsList })),
);
const AssessmentDetail = lazy(() =>
  import('@/features/assessments/AssessmentDetail').then((m) => ({ default: m.AssessmentDetail })),
);
const CreateAssessmentWizard = lazy(() =>
  import('@/features/create-assessment/CreateAssessmentWizard').then((m) => ({
    default: m.CreateAssessmentWizard,
  })),
);
const NotificationsInbox = lazy(() =>
  import('@/features/notifications/NotificationsInbox').then((m) => ({
    default: m.NotificationsInbox,
  })),
);
const ExportsCenter = lazy(() =>
  import('@/features/exports/ExportsCenter').then((m) => ({ default: m.ExportsCenter })),
);
const OrgSettings = lazy(() =>
  import('@/features/settings/OrgSettings').then((m) => ({ default: m.OrgSettings })),
);
const MyProfile = lazy(() =>
  import('@/features/profile/MyProfile').then((m) => ({ default: m.MyProfile })),
);
const BlueprintsList = lazy(() =>
  import('@/features/blueprints/BlueprintsList').then((m) => ({ default: m.BlueprintsList })),
);
const BlueprintBuilder = lazy(() =>
  import('@/features/blueprints/BlueprintBuilder').then((m) => ({ default: m.BlueprintBuilder })),
);
const BlueprintDetail = lazy(() =>
  import('@/features/blueprints/BlueprintDetail').then((m) => ({ default: m.BlueprintDetail })),
);
const ContextsList = lazy(() =>
  import('@/features/contexts/ContextsList').then((m) => ({ default: m.ContextsList })),
);
const ContextBuilder = lazy(() =>
  import('@/features/contexts/ContextBuilder').then((m) => ({ default: m.ContextBuilder })),
);
const ContextDetail = lazy(() =>
  import('@/features/contexts/ContextDetail').then((m) => ({ default: m.ContextDetail })),
);
const ReportsList = lazy(() =>
  import('@/features/reports/ReportsList').then((m) => ({ default: m.ReportsList })),
);
const AdminReport = lazy(() =>
  import('@/features/reports/AdminReport').then((m) => ({ default: m.AdminReport })),
);
const UserSafePreview = lazy(() =>
  import('@/features/reports/UserSafePreview').then((m) => ({ default: m.UserSafePreview })),
);
const Comparison = lazy(() =>
  import('@/features/comparison/Comparison').then((m) => ({ default: m.Comparison })),
);
const AssessmentHistory = lazy(() =>
  import('@/features/history/AssessmentHistory').then((m) => ({ default: m.AssessmentHistory })),
);

// User portal & runtime (Spec 006).
const AssessmentRuntime = lazy(() =>
  import('@/features/runtime/AssessmentRuntime').then((m) => ({ default: m.AssessmentRuntime })),
);
const MyAssessments = lazy(() =>
  import('@/features/assessments/user/MyAssessments').then((m) => ({ default: m.MyAssessments })),
);
const AssessmentOverview = lazy(() =>
  import('@/features/assessments/user/AssessmentOverview').then((m) => ({
    default: m.AssessmentOverview,
  })),
);
const Consent = lazy(() =>
  import('@/features/assessments/user/Consent').then((m) => ({ default: m.Consent })),
);
const Instructions = lazy(() =>
  import('@/features/assessments/user/Instructions').then((m) => ({ default: m.Instructions })),
);
const Completion = lazy(() =>
  import('@/features/assessments/user/Completion').then((m) => ({ default: m.Completion })),
);
const MyReports = lazy(() =>
  import('@/features/reports/user/MyReports').then((m) => ({ default: m.MyReports })),
);
const UserReport = lazy(() =>
  import('@/features/reports/user/UserReport').then((m) => ({ default: m.UserReport })),
);
const UserAssessmentHistory = lazy(() =>
  import('@/features/history/user/UserAssessmentHistory').then((m) => ({
    default: m.UserAssessmentHistory,
  })),
);
const UserNotifications = lazy(() =>
  import('@/features/notifications/UserNotifications').then((m) => ({
    default: m.UserNotifications,
  })),
);
const HelpAndSupport = lazy(() =>
  import('@/features/help/HelpAndSupport').then((m) => ({ default: m.HelpAndSupport })),
);
const UserProfilePrivacy = lazy(() =>
  import('@/features/profile/UserProfilePrivacy').then((m) => ({ default: m.UserProfilePrivacy })),
);

// Public/auth recovery, activity log & privacy inbox (Spec 007).
const PrivacyInbox = lazy(() =>
  import('@/features/privacy/PrivacyInbox').then((m) => ({ default: m.PrivacyInbox })),
);
const ActivityLog = lazy(() =>
  import('@/features/activity/ActivityLog').then((m) => ({ default: m.ActivityLog })),
);

// No reserved Admin placeholders remain — all routes are explicitly wired below.
const adminPlaceholders: [string, string][] = [];

const adminGuard = (el: JSX.Element) => <RequireRole role="admin">{el}</RequireRole>;
const userGuard = (el: JSX.Element) => <RequireRole role="user">{el}</RequireRole>;

export const router = createBrowserRouter([
  {
    element: <PublicShell />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/login', element: <AdminLogin /> },
      { path: '/invitation', element: <InvitationAccess /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> },
      { path: '/access-denied', element: <AccessDenied /> },
    ],
  },
  // Full-bleed (immersive) guarded routes — signature creation + assessment runtime.
  {
    path: '/admin/assessments/new',
    element: adminGuard(<FullBleedShell />),
    children: [{ index: true, element: <CreateAssessmentWizard /> }],
  },
  {
    path: '/app/assessments/:assessmentId/run',
    element: userGuard(<FullBleedShell />),
    children: [{ index: true, element: <AssessmentRuntime /> }],
  },
  {
    path: '/app/assessments/:assessmentId/complete',
    element: userGuard(<FullBleedShell />),
    children: [{ index: true, element: <Completion /> }],
  },
  // Immersive pre-assessment flow (design FocusFrame) — Overview → Consent → Instructions.
  {
    path: '/app/assessments/:assessmentId/overview',
    element: userGuard(<FullBleedShell />),
    children: [{ index: true, element: <AssessmentOverview /> }],
  },
  {
    path: '/app/assessments/:assessmentId/consent',
    element: userGuard(<FullBleedShell />),
    children: [{ index: true, element: <Consent /> }],
  },
  {
    path: '/app/assessments/:assessmentId/instructions',
    element: userGuard(<FullBleedShell />),
    children: [{ index: true, element: <Instructions /> }],
  },
  // Full-bleed builders (design Create* takeovers) — own top bar, no admin shell.
  {
    path: '/admin/role-blueprints/new',
    element: adminGuard(<FullBleedShell />),
    children: [{ index: true, element: <BlueprintBuilder /> }],
  },
  {
    path: '/admin/context-profiles/new',
    element: adminGuard(<FullBleedShell />),
    children: [{ index: true, element: <ContextBuilder /> }],
  },
  {
    path: '/admin',
    element: adminGuard(<AdminShell />),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'users', element: <UsersList /> },
      { path: 'users/:participantId', element: <UserDetail /> },
      { path: 'assessments', element: <AssessmentsList /> },
      { path: 'assessments/:assessmentId', element: <AssessmentDetail /> },
      { path: 'role-blueprints', element: <BlueprintsList /> },
      { path: 'role-blueprints/:blueprintId', element: <BlueprintDetail /> },
      { path: 'context-profiles', element: <ContextsList /> },
      { path: 'context-profiles/:contextId', element: <ContextDetail /> },
      { path: 'reports', element: <ReportsList /> },
      { path: 'reports/:reportId', element: <AdminReport /> },
      { path: 'reports/:reportId/user-preview', element: <UserSafePreview /> },
      { path: 'comparison', element: <Comparison /> },
      { path: 'history', element: <AssessmentHistory /> },
      { path: 'notifications', element: <NotificationsInbox /> },
      { path: 'privacy', element: <PrivacyInbox /> },
      { path: 'activity-log', element: <ActivityLog /> },
      { path: 'exports', element: <ExportsCenter /> },
      { path: 'settings', element: <OrgSettings /> },
      { path: 'profile', element: <MyProfile /> },
      { path: 'sample', element: <SampleServiceView /> },
      ...adminPlaceholders.map(([path, title]) => ({
        path,
        element: <Placeholder title={title} />,
      })),
    ],
  },
  {
    path: '/app',
    element: userGuard(<UserShell />),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <UserDashboard /> },
      { path: 'assessments', element: <MyAssessments /> },
      { path: 'reports', element: <MyReports /> },
      { path: 'reports/:reportId', element: <UserReport /> },
      { path: 'history', element: <UserAssessmentHistory /> },
      { path: 'notifications', element: <UserNotifications /> },
      { path: 'help', element: <HelpAndSupport /> },
      { path: 'profile', element: <UserProfilePrivacy /> },
    ],
  },
  {
    path: '*',
    element: (
      <Suspense fallback={null}>
        <NotFound />
      </Suspense>
    ),
  },
]);
