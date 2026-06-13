import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumbs({
  items,
  className,
  showHome = true,
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1 text-sm text-slate-500", className)}
    >
      {showHome && (
        <>
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-slate-700 transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        </>
      )}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1">
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="hover:text-slate-700 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  isLast
                    ? "font-medium text-slate-900"
                    : "text-slate-500"
                )}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            )}
          </span>
        );
      })}
    </nav>
  );
}
