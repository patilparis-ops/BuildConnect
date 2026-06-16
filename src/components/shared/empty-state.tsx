import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionHref,
  onActionClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center p-8 sm:p-12 border border-dashed border-slate-300/80 rounded-xl bg-slate-50/20 max-w-lg mx-auto">
      {/* Icon Wrapper with subtle background rings */}
      <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/50 shadow-xs text-slate-400">
        {icon}
      </div>
      
      <h3 className="text-base font-bold text-slate-900 leading-snug">{title}</h3>
      <p className="mt-1.5 text-xs text-slate-500 leading-relaxed max-w-sm">{description}</p>
      
      {(actionText && (actionHref || onActionClick)) && (
        <div className="mt-6">
          {actionHref ? (
            <Link to={actionHref}>
              <Button size="sm" className="font-semibold px-4.5 py-2 text-xs">
                {actionText}
              </Button>
            </Link>
          ) : (
            <Button size="sm" className="font-semibold px-4.5 py-2 text-xs" onClick={onActionClick}>
              {actionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
