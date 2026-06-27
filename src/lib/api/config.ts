export const apis = {
  auth: {
    login: "/auth/login",
    emailSignup: "/auth/email-signup",
    forgetPassword: "/auth/forget-password",
    refresh: "/auth/refresh",
    me: "/auth/me",
    avatar: "/auth/avatar",
  },

  home: {
    stats: "/home/count",
    kickStart: "/home/kickstart",
  },

  aboutUs: "/about-us",

  legal: {
    privacy: "/privacy-policy",
    terms: "/terms-conditions",
  },

  contact: "/contact-us",

  FAQ: "/faqs",

  images: {
    upload: "/media/upload",
  },

  support: "/support-tickets",

  daily: "/api/daily",

  book_demo: "/booking-demo-request",

  assets: {
    base: "/asset",
    me: "/asset/me",
    depreciation: "/asset/report/depreciation",
    employeeAssets: (userId: string) => `/asset/employee/${userId}`,
    assign: (id: string) => `/asset/${id}/assign`,
    return: (id: string) => `/asset/${id}/return`,
    transfer: (id: string) => `/asset/${id}/transfer`,
    history: (id: string) => `/asset/${id}/history`,
  },

  leaveRequests: {
    base: "/leave-requests",
    me: "/leave-requests/me",
    review: (id: string) => `/leave-requests/${id}/review`,
    cancel: (id: string) => `/leave-requests/${id}/cancel`,
  },
  departments: {
    base: "/department",
    byId: (id: string) => `/department/${id}`,
  },
  dashboard: {
    base: "/dashboard/overview",
  },
  employees: {
    base: "/employee",
    byId: (id: string) => `/employee/${id}`,
  },
  insurance: {
    plans: "/insurance-plans",
    planById: (id: string) => `/insurance-plans/${id}`,
    enroll: (id: string) => `/insurance-plans/${id}/enroll`,
    coverageReport: "/insurance-plans/coverage-report",
    enrollments: {
      me: "/insurance-enrollments/me",
      costPreview: (planId: string) =>
        `/insurance-enrollments/${planId}/cost-preview`,
      dependents: (enrollmentId: string) =>
        `/insurance-enrollments/${enrollmentId}/dependents`,
      dependentById: (enrollmentId: string, depId: string) =>
        `/insurance-enrollments/${enrollmentId}/dependents/${depId}`,
    },
  },
  attendance: {
    mark: "/attendance/location/mark",
    timesheets: "/attendance/timesheets",
    me: "/attendance/timesheets/me",
  },
  timesheets: {
    base: "/timesheets",
    me: "/timesheets/me",
    byId: (id: string) => `/timesheets/${id}`,
    status: (id: string) => `/timesheets/${id}/status`,
    overtime: "/timesheets/report/overtime",
  },
  company: {
    info: "/company/info",
    logo: "/company/logo",
    settings: "/company/settings",
    attendance: "/company/attendance-settings",
  },
  reports: {
    types: "/reports/types",
    data: (type: string) => `/reports/${type}`,
    preview: (type: string) => `/reports/${type}/preview`,
    exportCsv: (type: string) => `/reports/${type}/export`,
    exportPdf: (type: string) => `/reports/${type}/export/pdf`,
    history: "/reports/history",
  },
  jobs: {
  list: "/job",
  details: (id: string) => `/job/${id}`,
  create: "/job",
  update: (id: string) => `/job/${id}`,
  delete: (id: string) => `/job/${id}`,
  toggleActivation: (id: string) => `/job/toggle-activation/${id}`,
  login: "/auth/login",
},
  projects: {
    base: "/project",
    byId: (id: string) => `/project/${id}`,
    progress: (id: string) => `/project/${id}/progress`,
    tasks: (id: string) => `/project/${id}/tasks`,
  },
  tasks: {
    base: "/project/tasks",
    byId: (id: string) => `/project/tasks/${id}`,
    myTasks: "/project/tasks/me",
    byUser: (userId: string) => `/project/tasks?assigneeId=${userId}`,
    overdueReport: "/project/tasks/report/overdue",
    subtasks: (parentId: string) => `/project/tasks/subtasks/${parentId}`,
  },
};
