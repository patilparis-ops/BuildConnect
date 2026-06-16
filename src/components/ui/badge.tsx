import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border font-semibold transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-slate-200/60 bg-slate-50 text-slate-700",
        primary: "border-brand-200/50 bg-brand-50 text-brand-700",
        secondary: "border-secondary-200/50 bg-secondary-50 text-secondary-700",
        success: "border-success-200/50 bg-success-50 text-success-700",
        warning: "border-warning-200/50 bg-warning-50 text-warning-700",
        danger: "border-danger-200/50 bg-danger-50 text-danger-700",
        outline: "border-slate-300/70 bg-white text-slate-600",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-3 py-1 text-xs",
        lg: "px-3.5 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
