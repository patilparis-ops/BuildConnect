import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { useUIStore } from "@/store/ui-store";
import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/constants/routes";
import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/types";
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  FileText,
  Users,
  Star,
  Bell,
  Settings,
  HardHat,
  Briefcase,
  Wallet,
  Images,
  Shield,
  BarChart3,
  CreditCard,
  CheckSquare,
  Building2,
  LogOut,
  ChevronLeft,
  X,
} from "lucide-react";

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const customerLinks: SidebarLink[] = [
  { label: "Dashboard", href: ROUTES.CUSTOMER.DASHBOARD, icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "My Projects", href: ROUTES.CUSTOMER.PROJECTS, icon: <FolderKanban className="h-4 w-4" /> },
  { label: "Post Project", href: ROUTES.CUSTOMER.POST_PROJECT, icon: <PlusCircle className="h-4 w-4" /> },
  { label: "Quotations", href: ROUTES.CUSTOMER.QUOTATIONS, icon: <FileText className="h-4 w-4" /> },
  { label: "Hired Contractors", href: ROUTES.CUSTOMER.HIRED_CONTRACTORS, icon: <HardHat className="h-4 w-4" /> },
  { label: "Reviews", href: ROUTES.CUSTOMER.REVIEWS, icon: <Star className="h-4 w-4" /> },
  { label: "Notifications", href: ROUTES.CUSTOMER.NOTIFICATIONS, icon: <Bell className="h-4 w-4" />, badge: 3 },
  { label: "Settings", href: ROUTES.CUSTOMER.SETTINGS, icon: <Settings className="h-4 w-4" /> },
];

const contractorLinks: SidebarLink[] = [
  { label: "Dashboard", href: ROUTES.CONTRACTOR.DASHBOARD, icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Available Projects", href: ROUTES.CONTRACTOR.AVAILABLE_PROJECTS, icon: <Briefcase className="h-4 w-4" /> },
  { label: "My Quotes", href: ROUTES.CONTRACTOR.MY_QUOTES, icon: <FileText className="h-4 w-4" /> },
  { label: "Portfolio", href: ROUTES.CONTRACTOR.PORTFOLIO, icon: <Images className="h-4 w-4" /> },
  { label: "Reviews", href: ROUTES.CONTRACTOR.REVIEWS, icon: <Star className="h-4 w-4" /> },
  { label: "Earnings", href: ROUTES.CONTRACTOR.EARNINGS, icon: <Wallet className="h-4 w-4" /> },
  { label: "Notifications", href: ROUTES.CONTRACTOR.NOTIFICATIONS, icon: <Bell className="h-4 w-4" />, badge: 5 },
  { label: "Settings", href: ROUTES.CONTRACTOR.SETTINGS, icon: <Settings className="h-4 w-4" /> },
];

const adminLinks: SidebarLink[] = [
  { label: "Dashboard", href: ROUTES.ADMIN.DASHBOARD, icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Users", href: ROUTES.ADMIN.USERS, icon: <Users className="h-4 w-4" /> },
  { label: "Contractor Verify", href: ROUTES.ADMIN.VERIFICATION, icon: <CheckSquare className="h-4 w-4" /> },
  { label: "Projects", href: ROUTES.ADMIN.PROJECTS, icon: <FolderKanban className="h-4 w-4" /> },
  { label: "Payments", href: ROUTES.ADMIN.PAYMENTS, icon: <CreditCard className="h-4 w-4" /> },
  { label: "Analytics", href: ROUTES.ADMIN.ANALYTICS, icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Settings", href: ROUTES.ADMIN.SETTINGS, icon: <Settings className="h-4 w-4" /> },
];

const roleLinks: Record<UserRole, SidebarLink[]> = {
  customer: customerLinks,
  contractor: contractorLinks,
  admin: adminLinks,
};

const roleConfig: Record<UserRole, { icon: React.ReactNode; label: string; gradient: string }> = {
  customer: {
    icon: <Users className="h-4 w-4" />,
    label: "Customer Portal",
    gradient: "from-brand-600 to-brand-800",
  },
  contractor: {
    icon: <HardHat className="h-4 w-4" />,
    label: "Contractor Portal",
    gradient: "from-secondary-500 to-secondary-600",
  },
  admin: {
    icon: <Shield className="h-4 w-4" />,
    label: "Admin Panel",
    gradient: "from-slate-700 to-slate-900",
  },
};

export function Sidebar() {
  const { pathname } = useLocation();
  const { sidebarOpen, toggleSidebar, mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const links = roleLinks[user.role as UserRole] || customerLinks;
  const config = roleConfig[user.role as UserRole] || roleConfig.customer;

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed left-0 top-0 h-full bg-white border-r border-slate-200/60 z-30 transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center h-16 border-b border-slate-200/60 px-4",
          sidebarOpen ? "justify-between" : "justify-center"
        )}>
          {sidebarOpen ? (
            <>
              <Link to="/" className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-800">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-bold text-slate-900">BuildConnect</span>
              </Link>
              <button
                onClick={toggleSidebar}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link to="/">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-800">
                <Building2 className="h-4 w-4 text-white" />
              </div>
            </Link>
          )}
        </div>

        {/* Role header */}
        {sidebarOpen && (
          <div className={cn(
            "mx-3 mt-3 mb-1 px-3 py-2 rounded-lg bg-gradient-to-r text-white text-xs font-medium shadow-xs",
            config.gradient
          )}>
            <div className="flex items-center gap-1.5">
              {config.icon}
              {config.label}
            </div>
          </div>
        )}

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {links.map((link) => {
            const isActive = pathname === link.href || 
              (link.href !== "#" && pathname.startsWith(link.href) && link.href.split("/").length > 2);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  sidebarOpen ? "" : "justify-center",
                  isActive
                    ? "bg-brand-50/70 text-brand-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
                title={link.label}
              >
                <span className="shrink-0">{link.icon}</span>
                {sidebarOpen && (
                  <>
                    <span className="flex-1 truncate">{link.label}</span>
                    {link.badge && (
                      <Badge variant="danger" size="sm">
                        {link.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-200">
          <button
            onClick={logout}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-danger-50 hover:text-danger-600 transition-colors w-full",
              !sidebarOpen && "justify-center"
            )}
            title="Sign Out"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile sidebar - overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-72 h-full bg-white shadow-xl"
            >
              <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
                <Link to="/" className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-800">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">BuildConnect</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className={cn(
                "mx-3 mt-3 mb-1 px-3 py-2 rounded-lg bg-gradient-to-r text-white text-xs font-medium",
                config.gradient
              )}>
                <div className="flex items-center gap-1.5">
                  {config.icon}
                  {config.label}
                </div>
              </div>
              <nav className="p-3 space-y-0.5 overflow-y-auto">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-brand-50 text-brand-700"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.icon}
                      <span className="flex-1">{link.label}</span>
                      {link.badge && (
                        <Badge variant="danger" size="sm">{link.badge}</Badge>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
