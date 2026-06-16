import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { AlertCircle } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-lg border border-slate-300/70 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200",
              "hover:border-slate-400",
              "focus:border-brand-500 focus:ring-2 focus:ring-brand-600/20 focus:outline-none",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-700",
              icon && "pl-10",
              error &&
                "border-danger-400 focus:border-danger-500 focus:ring-danger-500/20",
              className
            )}
            ref={ref}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="flex items-center gap-1 text-xs text-danger-500"
            role="alert"
          >
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-slate-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
