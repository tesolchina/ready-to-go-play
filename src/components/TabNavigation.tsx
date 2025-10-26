import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  completed: boolean;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabNavigation = ({ tabs, activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <nav className="bg-card rounded-2xl p-2 shadow-[var(--shadow-card)] mb-5 overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-300",
              activeTab === tab.id
                ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:bg-accent hover:text-primary"
            )}
          >
            {tab.label}
            {tab.completed && (
              <span className="absolute -top-1 -right-1 bg-success text-success-foreground rounded-full w-5 h-5 flex items-center justify-center">
                <Check className="w-3 h-3" />
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};
