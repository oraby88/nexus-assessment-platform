# Complete Frontend Route Map

## Public and Authentication

| Route | Page | Owner |
|---|---|---|
| `/` | Public Landing | 007 |
| `/login` | Admin Login | 001/002 |
| `/invitation` | User Invitation Access / Login | 006 |
| `/forgot-password` | Forgot Password | 007 |
| `/reset-password` | Reset Password | 007 |
| `/access-denied` | Access Denied | 007 |
| `*` | Not Found | 007 |

## Admin

| Route | Page | Owner |
|---|---|---|
| `/admin/dashboard` | Dashboard | 002 |
| `/admin/users` | Users List | 002 |
| `/admin/users/:participantId` | User Detail | 002 |
| `/admin/assessments` | Assessments List | 002 |
| `/admin/assessments/new` | Create Assessment Wizard | 003 |
| `/admin/assessments/:assessmentId` | Assessment Detail | 002 |
| `/admin/role-blueprints` | Role Blueprints List | 004 |
| `/admin/role-blueprints/new` | Create Role Blueprint | 004 |
| `/admin/role-blueprints/:blueprintId` | Role Blueprint Detail | 004 |
| `/admin/context-profiles` | Context Profiles List | 004 |
| `/admin/context-profiles/new` | Create Context Profile | 004 |
| `/admin/context-profiles/:contextId` | Context Profile Detail | 004 |
| `/admin/reports` | Reports List | 005 |
| `/admin/reports/:reportId` | Admin Report Detail | 005 |
| `/admin/reports/:reportId/user-preview` | User-safe Report Preview | 005 |
| `/admin/comparison` | Candidate Comparison | 005 |
| `/admin/history` | Assessment History | 005 |
| `/admin/exports` | Exports | 002 |
| `/admin/notifications` | Notifications | 002 |
| `/admin/activity-log` | Organization Activity Log | 007 |
| `/admin/settings` | Organization Settings | 002 |
| `/admin/profile` | My Profile | 002 |

## User

| Route | Page | Owner |
|---|---|---|
| `/app/dashboard` | User Dashboard | 006 |
| `/app/assessments` | My Assessments | 006 |
| `/app/assessments/:assessmentId/overview` | Assessment Overview | 006 |
| `/app/assessments/:assessmentId/consent` | Consent | 006 |
| `/app/assessments/:assessmentId/instructions` | Instructions | 006 |
| `/app/assessments/:assessmentId/run` | Runtime | 006 |
| `/app/assessments/:assessmentId/complete` | Completion | 006 |
| `/app/reports` | My Reports | 006 |
| `/app/reports/:reportId` | User-safe Report Detail | 006 |
| `/app/history` | User Assessment History | 006 |
| `/app/notifications` | User Notifications | 006 |
| `/app/help` | Help and Support | 006 |
| `/app/profile` | Profile and Privacy | 006 |

## Overlay States

| Overlay | Parent route |
|---|---|
| Add User drawer | `/admin/users` |
| Bulk Upload modal | `/admin/users` |
| Pause assessment modal/drawer | `/app/assessments/:assessmentId/run` |
| Extend deadline modal | `/admin/assessments/:assessmentId` |
| Send reminder modal | `/admin/assessments/:assessmentId` |
| Cancel assessment confirmation | `/admin/assessments/:assessmentId` |
| PDF preparation toast / export entry | report routes |
| Data deletion request modal | `/app/profile` |
