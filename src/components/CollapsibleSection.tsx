import { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CollapsibleSectionProps {
  title: string | ReactNode;
  icon?: string;
  children: ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  defaultOpen?: boolean;
}

export const CollapsibleSection = ({ title, icon, children, isOpen, onToggle, defaultOpen = false }: CollapsibleSectionProps) => {
  return (
    <Collapsible defaultOpen={defaultOpen} open={isOpen} onOpenChange={onToggle} className="border-2 border-border rounded-xl overflow-hidden mb-4">
      <CollapsibleTrigger asChild>
        <button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between hover:from-primary/90 hover:to-primary/70 transition-all">
          <h4 className="font-semibold text-left flex items-center gap-2 text-base md:text-lg break-words pr-2">
            {icon && <span className="text-xl flex-shrink-0">{icon}</span>}
            <span className="flex-1">{title}</span>
          </h4>
          <ChevronDown
            className={cn(
              "h-5 w-5 flex-shrink-0 transition-transform duration-300",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-5 bg-card">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};
