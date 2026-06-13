import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/constants/routes";
import type { UserRole } from "@/types";
import type { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          <span className="text-sm text-slate-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallbackPath = ROUTES.HOME,
}: RoleGuardProps) {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role as UserRole)) {
    // Redirect to their appropriate dashboard
    switch (user?.role) {
      case "customer":
        return <Navigate to={ROUTES.CUSTOMER.DASHBOARD} replace />;
      case "contractor":
        return <Navigate to={ROUTES.CONTRACTOR.DASHBOARD} replace />;
      case "admin":
        return <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />;
      default:
        return <Navigate to={fallbackPath} replace />;
    }
  }

  return <>{children}</>;
}
