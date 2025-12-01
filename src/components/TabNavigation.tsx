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
    <nav className="bg-card rounded-2xl p-1.5 md:p-2 shadow-[var(--shadow-card)] mb-5 overflow-x-auto scrollbar-hide">
      <div className="flex gap-1.5 md:gap-2 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative px-3 py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl font-semibold text-xs md:text-sm whitespace-nowrap transition-all duration-300",
              activeTab === tab.id
                ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:bg-accent hover:text-primary"
            )}
          >
            {tab.label}
            {tab.completed && (
              <span className="absolute -top-1 -right-1 bg-success text-success-foreground rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};
