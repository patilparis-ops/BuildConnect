import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, X } from "lucide-react";

interface ErrorBannerProps {
  isError: boolean;
  message?: string;
  onRetry?: () => void;
  dismissable?: boolean;
  className?: string;
}

export function ErrorBanner({
  isError,
  message = "Something went wrong. Showing cached data while we sort it out.",
  onRetry,
  dismissable = true,
  className = "",
}: ErrorBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!isError || dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -12, height: 0 }}
      className={"rounded-xl border border-danger-200 bg-danger-50 p-4 " + className}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-danger-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-danger-800">Connection issue</p>
          <p className="text-xs text-danger-600 mt-0.5">{message}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 rounded-lg bg-danger-100 px-3 py-1.5 text-xs font-medium text-danger-700 hover:bg-danger-200 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          )}
          {dismissable && (
            <button
              onClick={() => setDismissed(true)}
              className="rounded-lg p-1 text-danger-500 hover:bg-danger-100 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
