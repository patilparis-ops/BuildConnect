import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { PublicLayout } from "@/layouts/public-layout";
import { AuthLayout } from "@/layouts/auth-layout";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { AuthGuard, RoleGuard } from "./guards";

// ==================== Lazy Loaded Pages (code-split by route) ====================

// Public pages
const HomePage = lazy(() => import("@/pages/public/home"));
const AboutPage = lazy(() => import("@/pages/public/about"));
const HowItWorksPage = lazy(() => import("@/pages/public/how-it-works"));
const ContactPage = lazy(() => import("@/pages/public/contact"));
const FAQPage = lazy(() => import("@/pages/public/faq"));
const ContractorsPage = lazy(() => import("@/pages/public/contractors"));
const ContractorDetailPage = lazy(() => import("@/pages/public/contractor-detail"));
const PublicProjectsPage = lazy(() => import("@/pages/public/projects"));
const ProjectDetailPage = lazy(() => import("@/pages/public/project-detail"));
const LoginPage = lazy(() => import("@/pages/public/login"));
const RegisterCustomerPage = lazy(() => import("@/pages/public/register-customer"));
const RegisterContractorPage = lazy(() => import("@/pages/public/register-contractor"));
const ForgotPasswordPage = lazy(() => import("@/pages/public/forgot-password"));
const ResetPasswordPage = lazy(() => import("@/pages/public/reset-password"));
const PrivacyPolicyPage = lazy(() => import("@/pages/public/privacy-policy"));
const TermsOfServicePage = lazy(() => import("@/pages/public/terms-of-service"));

// Dashboard Pages
const CustomerDashboardPage = lazy(() => import("@/pages/customer/dashboard"));
const CustomerProjectsPage = lazy(() => import("@/pages/customer/projects"));
const CustomerPostProjectPage = lazy(() => import("@/pages/customer/post-project"));
const CustomerQuotationsPage = lazy(() => import("@/pages/customer/quotations"));
const CustomerReviewsPage = lazy(() => import("@/pages/customer/reviews"));
const CustomerHiredContractorsPage = lazy(() => import("@/pages/customer/hired-contractors"));
const ContractorDashboardPage = lazy(() => import("@/pages/contractor/dashboard"));
const ContractorProjectsPage = lazy(() => import("@/pages/contractor/projects"));
const ContractorQuotesPage = lazy(() => import("@/pages/contractor/quotes"));
const ContractorPortfolioPage = lazy(() => import("@/pages/contractor/portfolio"));
const ContractorEarningsPage = lazy(() => import("@/pages/contractor/earnings"));
const ContractorSubmitQuotePage = lazy(() => import("@/pages/contractor/submit-quote"));
const ContractorReviewsPage = lazy(() => import("@/pages/contractor/reviews"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/dashboard"));
const AdminUsersPage = lazy(() => import("@/pages/admin/users"));
const AdminVerificationPage = lazy(() => import("@/pages/admin/verification"));
const AdminPaymentsPage = lazy(() => import("@/pages/admin/payments"));
const AdminAnalyticsPage = lazy(() => import("@/pages/admin/analytics"));
const AdminAllProjectsPage = lazy(() => import("@/pages/admin/all-projects"));
const NotificationsPage = lazy(() => import("@/pages/shared/notifications"));
const SettingsPage = lazy(() => import("@/pages/shared/settings"));

// ==================== Router ====================
export const router = createBrowserRouter([
  // ==================== Public Routes ====================
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "how-it-works", element: <HowItWorksPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "faq", element: <FAQPage /> },
      { path: "contractors", element: <ContractorsPage /> },
      { path: "contractors/:id", element: <ContractorDetailPage /> },
      { path: "projects", element: <PublicProjectsPage /> },
      { path: "projects/:id", element: <ProjectDetailPage /> },
      { path: "privacy-policy", element: <PrivacyPolicyPage /> },
      { path: "terms-of-service", element: <TermsOfServicePage /> },
    ],
  },

  // ==================== Auth Routes ====================
  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register/customer", element: <RegisterCustomerPage /> },
      { path: "register/contractor", element: <RegisterContractorPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
    ],
  },

  // ==================== Customer Routes ====================
  {
    path: "/customer",
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={["customer"]}>
          <DashboardLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <CustomerDashboardPage /> },
      { path: "projects", element: <CustomerProjectsPage /> },
      { path: "projects/new", element: <CustomerPostProjectPage /> },
      { path: "quotations", element: <CustomerQuotationsPage /> },
      { path: "contractors", element: <CustomerHiredContractorsPage /> },
      { path: "reviews", element: <CustomerReviewsPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },

  // ==================== Contractor Routes ====================
  {
    path: "/contractor",
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={["contractor"]}>
          <DashboardLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <ContractorDashboardPage /> },
      { path: "projects", element: <ContractorProjectsPage /> },
      { path: "projects/:projectId/quote", element: <ContractorSubmitQuotePage /> },
      { path: "quotes", element: <ContractorQuotesPage /> },
      { path: "portfolio", element: <ContractorPortfolioPage /> },
      { path: "reviews", element: <ContractorReviewsPage /> },
      { path: "earnings", element: <ContractorEarningsPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },

  // ==================== Admin Routes ====================
  {
    path: "/admin",
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={["admin"]}>
          <DashboardLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboardPage /> },
      { path: "users", element: <AdminUsersPage /> },
      { path: "verification", element: <AdminVerificationPage /> },
      { path: "projects", element: <AdminAllProjectsPage /> },
      { path: "payments", element: <AdminPaymentsPage /> },
      { path: "analytics", element: <AdminAnalyticsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },

  // ==================== 404 ====================
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-slate-300">404</h1>
          <p className="text-xl text-slate-500">Page not found</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium"
          >
            Go back home
          </a>
        </div>
      </div>
    ),
  },
]);
