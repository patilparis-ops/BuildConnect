import { cn } from "@/lib/cn";
import { useState, type ReactNode } from "react";

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  variant?: "underline" | "pills";
  children?: ReactNode;
}

export function Tabs({
  tabs,
  activeTab: controlledTab,
  onChange,
  className,
  variant = "underline",
  children,
}: TabsProps) {
  const [internalTab, setInternalTab] = useState(tabs[0]?.id || "");
  const activeTab = controlledTab ?? internalTab;

  const handleChange = (tabId: string) => {
    if (!controlledTab) setInternalTab(tabId);
    onChange?.(tabId);
  };

  const tabStyles = {
    underline: {
      list: "flex border-b border-slate-200 gap-0",
      tab: (isActive: boolean) =>
        cn(
          "px-4 py-3 text-sm font-medium transition-colors relative",
          "hover:text-slate-900",
          isActive
            ? "text-brand-600"
            : "text-slate-500",
          isActive &&
            "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-600 after:rounded-full"
        ),
    },
    pills: {
      list: "flex gap-1 p-1 bg-slate-100 rounded-xl",
      tab: (isActive: boolean) =>
        cn(
          "px-4 py-2 text-sm font-medium rounded-lg transition-all",
          isActive
            ? "bg-white text-slate-900 shadow-xs"
            : "text-slate-500 hover:text-slate-700"
        ),
    },
  };

  const styles = tabStyles[variant];

  return (
    <div className={className}>
      <div role="tablist" className={styles.list}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={styles.tab(activeTab === tab.id)}
            onClick={() => handleChange(tab.id)}
          >
            <span className="flex items-center gap-2">
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span className="inline-flex items-center justify-center rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
