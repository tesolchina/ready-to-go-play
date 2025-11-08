import { Moon, Sun, Home } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface LessonHeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  progress: number;
  title?: string;
  subtitle?: string;
}

export const LessonHeader = ({ darkMode, toggleDarkMode, progress, title, subtitle }: LessonHeaderProps) => {
  return (
    <header className="bg-card rounded-2xl p-6 md:p-8 shadow-[var(--shadow-elevated)] mb-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {title || "AI Prompt Engineering for Educational Use"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {subtitle || "Master the art of crafting effective AI prompts for teaching"}
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
