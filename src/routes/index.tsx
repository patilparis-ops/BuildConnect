import { createBrowserRouter, Navigate } from "react-router-dom";
import { PublicLayout } from "@/layouts/public-layout";
import { AuthLayout } from "@/layouts/auth-layout";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { AuthGuard, RoleGuard } from "./guards";

// ==================== Lazy Loaded Pages ====================

// Public pages
import HomePage from "@/pages/public/home";
import AboutPage from "@/pages/public/about";
import HowItWorksPage from "@/pages/public/how-it-works";
import ContactPage from "@/pages/public/contact";
import FAQPage from "@/pages/public/faq";
import ContractorsPage from "@/pages/public/contractors";
import ContractorDetailPage from "@/pages/public/contractor-detail";
import PublicProjectsPage from "@/pages/public/projects";
import ProjectDetailPage from "@/pages/public/project-detail";
import LoginPage from "@/pages/public/login";
import RegisterCustomerPage from "@/pages/public/register-customer";
import RegisterContractorPage from "@/pages/public/register-contractor";
import ForgotPasswordPage from "@/pages/public/forgot-password";

// Dashboard Pages
import CustomerDashboardPage from "@/pages/customer/dashboard";
import CustomerProjectsPage from "@/pages/customer/projects";
import CustomerPostProjectPage from "@/pages/customer/post-project";
import CustomerQuotationsPage from "@/pages/customer/quotations";
import CustomerReviewsPage from "@/pages/customer/reviews";
import CustomerHiredContractorsPage from "@/pages/customer/hired-contractors";
import ContractorDashboardPage from "@/pages/contractor/dashboard";
import ContractorProjectsPage from "@/pages/contractor/projects";
import ContractorQuotesPage from "@/pages/contractor/quotes";
import ContractorPortfolioPage from "@/pages/contractor/portfolio";
import ContractorEarningsPage from "@/pages/contractor/earnings";
import ContractorSubmitQuotePage from "@/pages/contractor/submit-quote";
import ContractorReviewsPage from "@/pages/contractor/reviews";
import AdminDashboardPage from "@/pages/admin/dashboard";
import AdminUsersPage from "@/pages/admin/users";
import AdminVerificationPage from "@/pages/admin/verification";
import AdminPaymentsPage from "@/pages/admin/payments";
import AdminAnalyticsPage from "@/pages/admin/analytics";
import AdminAllProjectsPage from "@/pages/admin/all-projects";
import NotificationsPage from "@/pages/shared/notifications";
import SettingsPage from "@/pages/shared/settings";

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
