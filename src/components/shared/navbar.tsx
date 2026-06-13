import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { ROUTES } from "@/constants/routes";
import { APP_CONFIG } from "@/constants";
import {
  Menu,
  X,
  Bell,
  ChevronDown,
  Building2,
  LogOut,
  Settings,
  LayoutDashboard,
  HardHat,
} from "lucide-react";

const publicNavLinks = [
  { label: "Home", href: ROUTES.HOME },
  { label: "Find Contractors", href: ROUTES.CONTRACTORS },
  { label: "Projects", href: ROUTES.PROJECTS },
  { label: "About", href: ROUTES.ABOUT },
  { label: "How It Works", href: ROUTES.HOW_IT_WORKS },
  { label: "Contact", href: ROUTES.CONTACT },
  { label: "FAQ", href: ROUTES.FAQ },
];

export function Navbar() {
  const { pathname } = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { mobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useUIStore();
  const [profileOpen, setProfileOpen] = useState(false);

  const isDashboard = pathname.startsWith("/customer") || 
    pathname.startsWith("/contractor") || 
    pathname.startsWith("/admin");

  if (isDashboard) return null;

  const getDashboardLink = () => {
    if (!user) return ROUTES.LOGIN;
    switch (user.role) {
      case "customer": return ROUTES.CUSTOMER.DASHBOARD;
      case "contractor": return ROUTES.CONTRACTOR.DASHBOARD;
      case "admin": return ROUTES.ADMIN.DASHBOARD;
      default: return ROUTES.LOGIN;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 shadow-sm">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            {APP_CONFIG.NAME}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {publicNavLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-3.5 py-2 text-sm font-medium rounded-lg transition-colors",
                pathname === link.href
                  ? "text-brand-600 bg-brand-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* Notifications */}
              <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <Bell className="h-5 w-5" />
                <Badge
                  variant="danger"
                  size="sm"
                  className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center"
                >
                  3
                </Badge>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
                >
                  <Avatar
                    src={user.avatar}
                    fallback={`${user.firstName[0]}${user.lastName[0]}`}
                    size="sm"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-slate-900 leading-tight">
                      {user.firstName}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className="hidden lg:block h-4 w-4 text-slate-400" />
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
                        className="absolute right-0 top-full mt-2 z-20 w-64 rounded-xl border border-slate-200 bg-white shadow-lg"
                      >
                        <div className="p-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={user.avatar}
                              fallback={`${user.firstName[0]}${user.lastName[0]}`}
                              size="md"
                            />
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-1.5">
                          <Link
                            to={getDashboardLink()}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            onClick={() => setProfileOpen(false)}
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>
                          <Link
                            to={`/${user.role}/settings`}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            onClick={() => setProfileOpen(false)}
                          >
                            <Settings className="h-4 w-4" />
                            Settings
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setProfileOpen(false);
                            }}
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN}>
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to={ROUTES.REGISTER_CONTRACTOR} className="hidden sm:block">
                <Button variant="primary" size="sm">
                  Join as Contractor
                </Button>
              </Link>
              <Link to={ROUTES.REGISTER_CUSTOMER}>
                <Button variant="secondary" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-200 bg-white lg:hidden overflow-hidden"
          >
            <nav className="container-page py-4 space-y-1">
              {publicNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-brand-600 bg-brand-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-slate-100" />
              {!isAuthenticated && (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign In
                  </Link>
                  <Link
                    to={ROUTES.REGISTER_CONTRACTOR}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-secondary-600 hover:bg-secondary-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <HardHat className="h-4 w-4" />
                    Join as Contractor
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
