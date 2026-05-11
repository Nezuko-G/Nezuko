export const apis = {
  auth: {
    login: "/auth/login",
    emailSignup: "/auth/email-signup",
    forgetPassword: "/auth/forget-password",
    refresh: "/auth/refresh",
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

  contact: "contact-us",
  FAQ: "/faqs",

  images: {
    upload: "/media/upload",
  },

  support: "/support-tickets",

  daily: "/api/daily",


  book_demo: "/book-demo",

  leaveRequests: {
    base: "/leave-requests",
    me: "/leave-requests/me",
    review: (id: string) => `/leave-requests/${id}/review`,
    cancel: (id: string) => `/leave-requests/${id}/cancel`,
  },
};