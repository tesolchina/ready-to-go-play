import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

interface LessonHeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  progress: number;
}

export const LessonHeader = ({ darkMode, toggleDarkMode, progress }: LessonHeaderProps) => {
  return (
    <header className="bg-card rounded-2xl p-6 md:p-8 shadow-[var(--shadow-elevated)] mb-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            AI Prompt Engineering for Educational Use
          </h1>
          <p className="text-lg text-muted-foreground">
            Master the art of crafting effective AI prompts for teaching
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="shrink-0"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Course Progress</span>
          <span className="font-semibold">{progress}%</span>
        </div>
        <div className="h-5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background: 'var(--gradient-success)'
            }}
          />
        </div>
      </div>
    </header>
  );
};
