import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "border-transparent bg-slate-100 text-slate-700",
        primary: "border-transparent bg-brand-100 text-brand-700",
        secondary: "border-transparent bg-secondary-100 text-secondary-700",
        success: "border-transparent bg-success-100 text-success-700",
        warning: "border-transparent bg-warning-100 text-warning-700",
        danger: "border-transparent bg-danger-100 text-danger-700",
        outline: "border-slate-300 text-slate-600",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
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
