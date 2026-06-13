import { Outlet, Link } from "react-router-dom";
import { Building2 } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 shadow-sm">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            BuildConnect
          </span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} BuildConnect. All rights reserved.
        </p>
      </div>
    </div>
  );
}
