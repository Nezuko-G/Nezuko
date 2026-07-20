# Graph Report - .  (2026-07-19)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1276 nodes · 2841 edges · 67 communities (51 shown, 16 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 41 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ca18f819`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- page.tsx
- payroll.api.ts
- useToast
- assets.ts
- attendance.ts
- useAuthStore
- insurance.ts
- leave.ts
- page.tsx
- useDepartments.ts
- company.api.ts
- instance.ts
- reports.ts
- compilerOptions
- toast.tsx
- useTimesheets.ts
- useJobs.ts
- notifications.ts
- timesheet.dto.ts
- cn
- dashboard.dto.ts
- user.dto.ts
- navigation.ts
- TimesheetTable.tsx
- SubmitTimesheetForm.tsx
- page.tsx
- useCompany.ts
- pricing.utils.ts
- dependencies
- devDependencies
- AttendanceSettingsForm.tsx
- dashboard.mapper.ts
- dashboard.tsx
- button.tsx
- dashboard.api.ts
- package.json
- GeneralSettingsForm.tsx
- page.tsx
- ProfileSections.tsx
- TimesheetStatus
- JobTable.tsx
- globals.d.ts
- error.tsx
- next.config.ts
- graphify.js
- eslint.config.mjs
- @hookform/resolvers
- lucide-react
- next
- next-intl
- react-dom
- react-hook-form
- react-hot-toast
- swiper
- tailwind-merge
- use-debounce
- zod
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `useAuthStore` - 49 edges
2. `useToast()` - 36 edges
3. `cn()` - 36 edges
4. `Task` - 20 edges
5. `api` - 20 edges
6. `apis` - 19 edges
7. `throwIfError()` - 19 edges
8. `useAssetMutations()` - 18 edges
9. `useAssetUIStore` - 17 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Field()` --calls--> `cn()`  [EXTRACTED]
  src/app/(hr-system)/employees/[id]/components/ProfileSections.tsx → src/lib/utils.ts
- `Field()` --calls--> `cn()`  [EXTRACTED]
  src/app/(hr-system)/employees/components/AddEmployeeModal.tsx → src/lib/utils.ts
- `NotificationTable()` --calls--> `cn()`  [EXTRACTED]
  src/app/(hr-system)/notifications/_components/NotificationTable.tsx → src/lib/utils.ts
- `useUnreadCount()` --indirect_call--> `getUnreadCount()`  [INFERRED]
  src/app/(hr-system)/notifications/hooks/useNotifications.ts → src/app/(hr-system)/notifications/api/notifications.ts
- `login()` --calls--> `throwIfError()`  [EXTRACTED]
  src/app/(auth)/login/api/auth.api.ts → src/lib/api/utils.ts

## Import Cycles
- None detected.

## Communities (67 total, 16 thin omitted)

### Community 0 - "page.tsx"
Cohesion: 0.05
Nodes (87): EmployeeProfilePage(), MANAGE_ROLES, normalizeProject(), normalizeTask(), normalizeUser(), projectsApi, tasksApi, PRIORITY_DOTS (+79 more)

### Community 1 - "payroll.api.ts"
Cohesion: 0.08
Nodes (63): approvePayrollRun(), createIncentive(), createPayrollRun(), deleteIncentive(), getPayrollRunById(), getPayrollSummaryReport(), getPayslip(), listIncentives() (+55 more)

### Community 2 - "useToast"
Cohesion: 0.06
Nodes (60): createEmployee(), deleteEmployee(), getAllEmployees(), getEmployee(), updateEmployee(), AddEmployeeModal(), Field(), Props (+52 more)

### Community 3 - "assets.ts"
Cohesion: 0.08
Nodes (52): ApiResponse, assignAsset(), createAsset(), deleteAsset(), getAsset(), getAssetHistory(), getAssets(), getDepreciationReport() (+44 more)

### Community 4 - "attendance.ts"
Cohesion: 0.06
Nodes (48): ApiResponse, AttendanceError, getMyTimesheets(), markAttendance(), PaginatedTimesheets, TimesheetFilters, AttendanceWidget(), getTodayRange() (+40 more)

### Community 5 - "useAuthStore"
Cohesion: 0.07
Nodes (35): login(), LoginForm(), useLogin(), Sidebar(), getMe(), ProfileData, updateAvatar(), ACCEPTED_TYPES (+27 more)

### Community 6 - "insurance.ts"
Cohesion: 0.09
Nodes (44): addDependent(), ApiResponse, createInsurancePlan(), deleteInsurancePlan(), enrollEmployee(), getCostPreview(), getCoverageReport(), getInsurancePlans() (+36 more)

### Community 7 - "leave.ts"
Cohesion: 0.08
Nodes (41): apiRequest(), buildQueryString(), cancelLeaveRequest(), CreateLeaveInput, createLeaveRequest(), getAllLeaveRequests(), getMyLeaveRequests(), LeaveRequestsResponse (+33 more)

### Community 8 - "page.tsx"
Cohesion: 0.06
Nodes (25): BlogPost, BlogsPage(), CATEGORIES, Category, POSTS, PostData, PostMeta, Props (+17 more)

### Community 9 - "useDepartments.ts"
Cohesion: 0.13
Nodes (29): ApiResponse, createDepartment(), deleteDepartment(), getDepartment(), getDepartments(), updateDepartment(), DepartmentTable(), DepartmentTableProps (+21 more)

### Community 10 - "company.api.ts"
Cohesion: 0.11
Nodes (32): getAttendanceSettings(), getCompanyInfo(), getGeneralSettings(), updateCompanyInfo(), uploadLogo(), AttendanceSettingsResponseDTOType, CompanyInfoResponseDTOType, GeneralSettingsResponseDTOType (+24 more)

### Community 11 - "instance.ts"
Cohesion: 0.11
Nodes (18): QuickActions(), MessageBubble(), BotIcon(), markdownComponents, TypingIndicator(), useChatbot(), ChatbotPage(), ChatbotConfig (+10 more)

### Community 12 - "reports.ts"
Cohesion: 0.12
Nodes (22): ApiResponse, downloadReportCsv(), downloadReportPdf(), getReportHistory(), getReportPreview(), getReportTypes(), ReportPreviewTableProps, reportColumnsConfig (+14 more)

### Community 13 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 14 - "toast.tsx"
Cohesion: 0.12
Nodes (13): metadata, RootLayout(), LocaleProvider(), Providers(), Toast, ToastContext, ToastContextValue, ToastProvider() (+5 more)

### Community 15 - "useTimesheets.ts"
Cohesion: 0.21
Nodes (19): editTimesheet(), getMyTimesheets(), getOvertimeReport(), getTimesheets(), OvertimeReportFilters, PaginatedTimesheets, reviewTimesheet(), submitTimesheet() (+11 more)

### Community 16 - "useJobs.ts"
Cohesion: 0.11
Nodes (22): jobsClient, JobAuthPopup(), Props, defaultData, JobFormProps, CreateJobPage(), useCreateJob(), useJobBilingual() (+14 more)

### Community 17 - "notifications.ts"
Cohesion: 0.18
Nodes (16): ApiResponse, getNotifications(), getUnreadCount(), markAllSeen(), markSeen(), NotificationFilter, NotificationItem, NotificationTable() (+8 more)

### Community 18 - "timesheet.dto.ts"
Cohesion: 0.12
Nodes (19): mapOvertimeReportFromDTO(), mapOvertimeReportItemFromDTO(), mapUserFromDTO(), TimesheetDTOType, UserSummaryDTOType, EditTimesheetDTO, OvertimeReport, OvertimeReportDTO (+11 more)

### Community 19 - "cn"
Cohesion: 0.17
Nodes (14): BridgeSection(), Asset, AssetTable(), AssetTableProps, Pagination(), PaginationProps, EmployeeTable(), InsurancePlanTable() (+6 more)

### Community 20 - "dashboard.dto.ts"
Cohesion: 0.10
Nodes (19): AttendanceByDepartmentRawDTO, AttendanceHistogramDTO, ChartsDTO, HistogramChartDTO, InsightsDTO, KeyMetricsDTO, LabelPresentAbsentDTO, LabelValueDTO (+11 more)

### Community 21 - "user.dto.ts"
Cohesion: 0.15
Nodes (14): login(), mapUserFromDTO(), mapUsersFromDTO(), UserDTOType, AuthResponse, AuthResponseDTO, CreateUserDTO, CreateUserInput (+6 more)

### Community 22 - "navigation.ts"
Cohesion: 0.15
Nodes (7): LangSwitcher(), Navbar(), useUnreadCount(), LanguageSwitcher(), LanguageSwitcherProps, { Link, useRouter, usePathname, redirect }, setLocaleCookie()

### Community 23 - "TimesheetTable.tsx"
Cohesion: 0.19
Nodes (15): ApproveRejectModal(), Props, OvertimeChip(), Props, Props, TimesheetEditDrawer(), toTimeInput(), formatDate() (+7 more)

### Community 24 - "SubmitTimesheetForm.tsx"
Cohesion: 0.16
Nodes (13): buildPayload(), emptyEntry(), Props, SubmitTimesheetForm(), calcHours(), EntryForm, Props, TimesheetEntryRow() (+5 more)

### Community 25 - "page.tsx"
Cohesion: 0.23
Nodes (14): TimesheetTable(), canManageTimesheets(), canSubmitTimesheets(), useMyTimesheets(), useTimesheets(), MyTimesheetsPage(), TimesheetsPage(), formatDate() (+6 more)

### Community 26 - "useCompany.ts"
Cohesion: 0.17
Nodes (16): deleteLogo(), CompanyInfoForm(), EDIT_ROLES, FieldConfig, generalFields, legalFields, locationFields, sections (+8 more)

### Community 27 - "pricing.utils.ts"
Cohesion: 0.16
Nodes (13): FaqItem, FeatureItem, FEATURES, HOW_IT_WORKS, ICON_MAP, IconName, INCLUDED_KEYS, PAYMENT_FEATURES_KEYS (+5 more)

### Community 28 - "dependencies"
Cohesion: 0.12
Nodes (17): axios, clsx, framer-motion, dependencies, axios, clsx, framer-motion, react (+9 more)

### Community 29 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 30 - "AttendanceSettingsForm.tsx"
Cohesion: 0.16
Nodes (14): updateAttendanceSettings(), AttendanceSettingsForm(), DEFAULTS, EDIT_ROLES, FormKey, FormState, geofenceFields, GeoField (+6 more)

### Community 31 - "dashboard.mapper.ts"
Cohesion: 0.17
Nodes (14): ChartsDTOType, DashboardResponseDTOType, InsightsDTOType, KeyMetricsDTOType, mapChartsFromDTO(), mapDashboardFromDTO(), mapInsightsFromDTO(), mapKeyMetricsFromDTO() (+6 more)

### Community 32 - "dashboard.tsx"
Cohesion: 0.19
Nodes (9): BADGE_STYLES, BAR_COLORS, ChartCard(), DashboardClient(), fadeUp(), METRIC_ACCENT, MetricCard(), PIE_COLORS (+1 more)

### Community 34 - "button.tsx"
Cohesion: 0.24
Nodes (7): ACCEPTED_TYPES, CompanyLogoSection(), getInitials(), Props, Button, ButtonProps, sizeClasses

### Community 36 - "dashboard.api.ts"
Cohesion: 0.31
Nodes (7): getDashboard(), ApiErrorType, useDashboard(), Page(), DashboardResponse, DashboardResponseDTO, DashboardResponseDTOType

### Community 37 - "package.json"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 38 - "GeneralSettingsForm.tsx"
Cohesion: 0.28
Nodes (7): updateGeneralSettings(), EDIT_ROLES, GeneralSettingsForm(), SegmentedProps, useGeneralSettings(), useUpdateGeneralSettings(), UpdateGeneralSettingsRequest

### Community 39 - "page.tsx"
Cohesion: 0.25
Nodes (4): Tab, TAB_KEYS, Tab, TAB_KEYS

### Community 40 - "ProfileSections.tsx"
Cohesion: 0.32
Nodes (4): formatDate(), formatRole(), ProfileSections(), Props

### Community 41 - "TimesheetStatus"
Cohesion: 0.38
Nodes (5): Props, TimesheetFilters(), Props, TimesheetStatusBadge(), TimesheetStatus

### Community 42 - "JobTable.tsx"
Cohesion: 0.53
Nodes (5): JobTable(), JobTableProps, useDeleteJob(), useToggleJobStatus(), JobResponse

### Community 43 - "globals.d.ts"
Cohesion: 0.40
Nodes (4): *.css, *.module.css, *.sass, *.scss

## Knowledge Gaps
- **323 isolated node(s):** `eslintConfig`, `withNextIntl`, `nextConfig`, `name`, `version` (+318 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuthStore` connect `useAuthStore` to `page.tsx`, `dashboard.api.ts`, `GeneralSettingsForm.tsx`, `leave.ts`, `useDepartments.ts`, `useTimesheets.ts`, `cn`, `navigation.ts`, `page.tsx`, `useCompany.ts`, `AttendanceSettingsForm.tsx`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `apis` connect `useAuthStore` to `page.tsx`, `useToast`, `assets.ts`, `attendance.ts`, `dashboard.api.ts`, `insurance.ts`, `leave.ts`, `page.tsx`, `useDepartments.ts`, `company.api.ts`, `instance.ts`, `reports.ts`, `useTimesheets.ts`, `notifications.ts`, `user.dto.ts`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `api` connect `instance.ts` to `page.tsx`, `payroll.api.ts`, `useToast`, `assets.ts`, `attendance.ts`, `dashboard.api.ts`, `insurance.ts`, `useAuthStore`, `useDepartments.ts`, `reports.ts`, `notifications.ts`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `withNextIntl`, `nextConfig` to the rest of the system?**
  _323 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05217391304347826 - nodes in this community are weakly interconnected._
- **Should `payroll.api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07603603603603604 - nodes in this community are weakly interconnected._
- **Should `useToast` be split into smaller, more focused modules?**
  _Cohesion score 0.05879917184265011 - nodes in this community are weakly interconnected._