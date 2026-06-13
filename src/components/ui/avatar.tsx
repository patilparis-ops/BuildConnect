import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const Avatar = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: "sm" | "md" | "lg" | "xl";
  }
>(({ className, src, alt, fallback, size = "md", ...props }, ref) => {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
    xl: "h-20 w-20 text-2xl",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-slate-200 font-medium text-slate-600 overflow-hidden",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || ""}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        fallback || <UserIcon className="h-1/2 w-1/2" />
      )}
    </div>
  );
});
Avatar.displayName = "Avatar";

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export { Avatar };
