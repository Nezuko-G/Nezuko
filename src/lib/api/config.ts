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

  assets: {
  base: "/asset", 
  me: "/asset/me", 
  depreciation: "/asset/report", 
  employeeAssets: (userId: string) => `/asset/employee/${userId}`,
  assign: (id: string) => `/asset/${id}/assign`,
  return: (id: string) => `/asset/${id}/return`,
  transfer: (id: string) => `/asset/${id}/transfer`,
  history: (id: string) => `/asset/${id}/history`,
},
};
