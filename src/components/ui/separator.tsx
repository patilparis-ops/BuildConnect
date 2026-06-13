import { cn } from "@/lib/cn";
import { forwardRef, type HTMLAttributes } from "react";

const Separator = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    orientation?: "horizontal" | "vertical";
  }
>(
  (
    { className, orientation = "horizontal", ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "shrink-0 bg-slate-200",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = "Separator";

export { Separator };
