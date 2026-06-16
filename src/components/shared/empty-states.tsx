import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Briefcase,
  Star,
  Search,
  Bell,
  CheckCircle2,
  HardHat,
  Zap,
} from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "default" | "secondary" | "minimal";
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = "default",
}: EmptyStateProps) {
  const containerClass = {
    default: "py-16 px-4 text-center",
    secondary: "py-12 px-4 text-center",
    minimal: "py-8 px-4 text-center",
  }[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={containerClass}
    >
      <div className="flex justify-center mb-4">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 text-slate-400 flex items-center justify-center shadow-xs"
        >
          {icon}
        </motion.div>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mt-4">{title}</h3>
      <p className="text-slate-500 text-sm mt-1.5 max-w-sm mx-auto">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="mt-5 font-semibold"
          size="sm"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}

// Pre-built empty state components
export function NoProjectsEmpty() {
  return (
    <EmptyState
      icon={<Briefcase className="h-6 w-6" />}
      title="No projects yet"
      description="Post a new project to get started and connect with skilled contractors"
      actionLabel="Post a Project"
    />
  );
}

export function NoQuotesEmpty() {
  return (
    <EmptyState
      icon={<FileText className="h-6 w-6" />}
      title="No quotes received"
      description="Contractors will submit quotes once you post your project"
      variant="secondary"
    />
  );
}

export function NoAvailableProjectsEmpty() {
  return (
    <EmptyState
      icon={<Search className="h-6 w-6" />}
      title="No projects available"
      description="Check back soon or adjust your filters to find projects matching your expertise"
      variant="secondary"
    />
  );
}

export function NoReviewsEmpty() {
  return (
    <EmptyState
      icon={<Star className="h-6 w-6" />}
      title="No reviews yet"
      description="Complete projects to receive reviews from clients"
      variant="secondary"
    />
  );
}

export function NoNotificationsEmpty() {
  return (
    <EmptyState
      icon={<Bell className="h-6 w-6" />}
      title="All caught up!"
      description="No new notifications at the moment"
      variant="minimal"
    />
  );
}

export function NoHiredContractorsEmpty() {
  return (
    <EmptyState
      icon={<CheckCircle2 className="h-6 w-6" />}
      title="No hired contractors"
      description="Hire contractors from your pending quotes to get started"
      variant="secondary"
    />
  );
}

export function NoSearchResultsEmpty() {
  return (
    <EmptyState
      icon={<Search className="h-6 w-6" />}
      title="No results found"
      description="Try adjusting your search criteria or filters"
      variant="minimal"
    />
  );
}

export function NoDataEmpty() {
  return (
    <EmptyState
      icon={<Zap className="h-6 w-6" />}
      title="No data available"
      description="This data will be updated once you complete your setup"
      variant="minimal"
    />
  );
}

// Error state components
interface ErrorStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorState({
  title,
  description,
  actionLabel,
  onAction,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-12 px-4 text-center"
    >
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-400 flex items-center justify-center shadow-xs">
          <HardHat className="h-6 w-6" />
        </div>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mt-4">{title}</h3>
      <p className="text-slate-500 text-sm mt-1.5 max-w-sm mx-auto">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="outline"
          className="mt-5 font-semibold"
          size="sm"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}

export function LoadingError() {
  return (
    <ErrorState
      title="Oops! Something went wrong"
      description="We couldn't load this data. Please try again later."
      actionLabel="Retry"
    />
  );
}
