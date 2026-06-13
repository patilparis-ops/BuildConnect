// ==================== Public Routes ====================
export const PUBLIC_ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  HOW_IT_WORKS: "/how-it-works",
  CONTACT: "/contact",
  FAQ: "/faq",
  CONTRACTORS: "/contractors",
  CONTRACTOR_DETAIL: "/contractors/:id",
  PROJECTS: "/projects",
  PROJECT_DETAIL: "/projects/:id",
  LOGIN: "/login",
  REGISTER_CUSTOMER: "/register/customer",
  REGISTER_CONTRACTOR: "/register/contractor",
  FORGOT_PASSWORD: "/forgot-password",
} as const;

// ==================== Auth Routes ====================
export const AUTH_ROUTES = {
  LOGIN: PUBLIC_ROUTES.LOGIN,
  REGISTER_CUSTOMER: PUBLIC_ROUTES.REGISTER_CUSTOMER,
  REGISTER_CONTRACTOR: PUBLIC_ROUTES.REGISTER_CONTRACTOR,
  FORGOT_PASSWORD: PUBLIC_ROUTES.FORGOT_PASSWORD,
} as const;

// ==================== Customer Routes ====================
export const CUSTOMER_ROUTES = {
  DASHBOARD: "/customer/dashboard",
  PROJECTS: "/customer/projects",
  PROJECT_DETAILS: "/customer/projects/:projectId",
  POST_PROJECT: "/customer/projects/new",
  QUOTATIONS: "/customer/quotations",
  HIRED_CONTRACTORS: "/customer/contractors",
  REVIEWS: "/customer/reviews",
  NOTIFICATIONS: "/customer/notifications",
  SETTINGS: "/customer/settings",
} as const;

// ==================== Contractor Routes ====================
export const CONTRACTOR_ROUTES = {
  DASHBOARD: "/contractor/dashboard",
  AVAILABLE_PROJECTS: "/contractor/projects",
  PROJECT_DETAILS: "/contractor/projects/:projectId",
  SUBMIT_QUOTE: "/contractor/projects/:projectId/quote",
  MY_QUOTES: "/contractor/quotes",
  PORTFOLIO: "/contractor/portfolio",
  REVIEWS: "/contractor/reviews",
  EARNINGS: "/contractor/earnings",
  NOTIFICATIONS: "/contractor/notifications",
  SETTINGS: "/contractor/settings",
} as const;

// ==================== Admin Routes ====================
export const ADMIN_ROUTES = {
  DASHBOARD: "/admin/dashboard",
  USERS: "/admin/users",
  CONTRACTORS: "/admin/contractors",
  VERIFICATION: "/admin/verification",
  PROJECTS: "/admin/projects",
  PAYMENTS: "/admin/payments",
  ANALYTICS: "/admin/analytics",
  SETTINGS: "/admin/settings",
} as const;

// ==================== Route Configuration ====================
export const ROUTES = {
  ...PUBLIC_ROUTES,
  CUSTOMER: { ...CUSTOMER_ROUTES },
  CONTRACTOR: { ...CONTRACTOR_ROUTES },
  ADMIN: { ...ADMIN_ROUTES },
} as const;

export type RoutePath =
  | (typeof PUBLIC_ROUTES)[keyof typeof PUBLIC_ROUTES]
  | (typeof CUSTOMER_ROUTES)[keyof typeof CUSTOMER_ROUTES]
  | (typeof CONTRACTOR_ROUTES)[keyof typeof CONTRACTOR_ROUTES]
  | (typeof ADMIN_ROUTES)[keyof typeof ADMIN_ROUTES];
