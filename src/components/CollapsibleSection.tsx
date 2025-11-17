import { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  icon: string;
  children: ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const CollapsibleSection = ({ title, icon, children, isOpen = false, onToggle }: CollapsibleSectionProps) => {

  return (
    <div className="border-2 border-border rounded-xl overflow-hidden mb-4">
      <button
        onClick={onToggle}
        className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between hover:from-primary/90 hover:to-primary/70 transition-all"
      >
        <h4 className="font-semibold text-left flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          {title}
        </h4>
        <ChevronDown
          className={cn(
            "h-5 w-5 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="p-5 bg-card animate-slide-down">
          {children}
        </div>
      )}
    </div>
  );
};
