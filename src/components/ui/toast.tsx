import { cn } from "@/lib/cn";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { cva } from "class-variance-authority";

const toastVariants = cva(
  "fixed bottom-4 right-4 z-50 flex items-start gap-3 rounded-xl border bg-white p-4 shadow-lg transition-all duration-300 max-w-md",
  {
    variants: {
      variant: {
        default: "border-slate-200",
        success: "border-success-200 bg-success-50",
        error: "border-danger-200 bg-danger-50",
        warning: "border-warning-200 bg-warning-50",
        info: "border-brand-200 bg-brand-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ToastData {
  id: string;
  title: string;
  message?: string;
  variant?: "default" | "success" | "error" | "warning" | "info";
  duration?: number;
}

// Simple toast store outside of React
let toastListeners: ((toast: ToastData) => void)[] = [];

export function toast(data: Omit<ToastData, "id">) {
  const id = Math.random().toString(36).slice(2);
  const newToast: ToastData = { ...data, id };
  toastListeners.forEach((listener) => listener(newToast));
  return id;
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const listener = (newToast: ToastData) => {
      setToasts((prev) => [...prev, newToast]);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({
  toast: t,
  onClose,
}: {
  toast: ToastData;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, t.duration || 4000);
    return () => clearTimeout(timer);
  }, [t.duration, onClose]);

  return (
    <div
      className={cn(toastVariants({ variant: t.variant }))}
      role="alert"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{t.title}</p>
        {t.message && (
          <p className="text-xs text-slate-500 mt-0.5">{t.message}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
