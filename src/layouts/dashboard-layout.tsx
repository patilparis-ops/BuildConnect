import { Outlet, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/cn";
import { Sidebar } from "@/components/shared/sidebar";
import { useUIStore } from "@/store/ui-store";
import { useAuthStore } from "@/store/auth-store";
import { Avatar } from "@/components/ui/avatar";
import { Bell, Menu, ChevronDown, Building2 } from "lucide-react";
import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function DashboardLayout() {
  const { sidebarOpen, setMobileMenuOpen } = useUIStore();
  const { user, logout } = useAuthStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      {/* Main area */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        )}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Left */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link to="/" className="lg:hidden flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-800">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
              </Link>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3.5">
              {/* Notifications */}
              <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger-500 animate-pulse" />
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white p-1 pr-3.5 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-xs"
                >
                  <Avatar
                    src={user?.avatar}
                    fallback={user ? `${user.firstName[0]}${user.lastName[0]}` : "U"}
                    size="sm"
                    className="h-7 w-7 rounded-full"
                  />
                  <div className="hidden md:block text-left text-xs">
                    <p className="font-semibold text-slate-900 leading-tight">
                      {user?.firstName} {user?.lastName}
                    </p>
                  </div>
                  <ChevronDown className="hidden md:block h-3.5 w-3.5 text-slate-400 ml-0.5" />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setProfileOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 top-full mt-2 z-20 w-56 rounded-xl border border-slate-200 bg-white shadow-lg"
                      >
                        <div className="p-1.5 space-y-0.5">
                          <Link
                            to={`/${user?.role}/settings`}
                            className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                            onClick={() => setProfileOpen(false)}
                          >
                            Settings
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setProfileOpen(false);
                            }}
                            className="w-full text-left rounded-lg px-3 py-2 text-sm text-danger-600 hover:bg-danger-50"
                          >
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page content with animated transitions */}
        <main className="p-4 lg:p-6">
            <Suspense fallback={
              <div className="flex items-center justify-center py-32">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
              </div>
            }>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </Suspense>
        </main>
      </div>
    </div>
  );
}
