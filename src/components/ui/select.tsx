import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { AlertCircle, ChevronDown } from "lucide-react";

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, error, options, placeholder, id, ...props },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            className={cn(
              "flex h-10 w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 transition-colors duration-200",
              "hover:border-slate-400",
              "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
              error &&
                "border-danger-400 focus:border-danger-500 focus:ring-danger-500/20",
              className
            )}
            ref={ref}
            aria-invalid={error ? "true" : "false"}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
        {error && (
          <p className="flex items-center gap-1 text-xs text-danger-500" role="alert">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
