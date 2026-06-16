import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-600 text-white shadow-xs hover:bg-brand-700 hover:shadow-sm active:bg-brand-800 focus-visible:outline-brand-600 hover:-translate-y-0.5",
        secondary:
          "bg-secondary-500 text-white shadow-xs hover:bg-secondary-600 hover:shadow-sm active:bg-secondary-700 focus-visible:outline-secondary-500 hover:-translate-y-0.5",
        outline:
          "border border-slate-300/70 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400 active:bg-slate-100 focus-visible:outline-slate-400 transition-all duration-200",
        ghost:
          "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900 active:bg-slate-200 transition-colors duration-200",
        danger:
          "bg-danger-500 text-white shadow-xs hover:bg-danger-600 hover:shadow-sm active:bg-danger-700 focus-visible:outline-danger-500 hover:-translate-y-0.5",
        success:
          "bg-success-500 text-white shadow-xs hover:bg-success-600 hover:shadow-sm active:bg-success-700 focus-visible:outline-success-500 hover:-translate-y-0.5",
        link: "text-brand-600 underline-offset-4 hover:underline hover:text-brand-700 focus-visible:outline-brand-600",
      },
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-3.5 text-xs font-medium",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg font-bold",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
