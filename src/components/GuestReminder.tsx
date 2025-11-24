import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { UserPlus, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const GuestReminder = () => {
  const { isAuthenticated } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("guest-reminder-dismissed");
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("guest-reminder-dismissed", "true");
  };

  if (isAuthenticated || isDismissed) {
    return null;
  }

  return (
    <Alert className="relative bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
      <UserPlus className="h-4 w-4" />
      <AlertDescription className="pr-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <p className="font-medium mb-1">You're browsing as a guest</p>
            <p className="text-sm text-muted-foreground">
              Register for a free account to save your chat history, API keys, and access blog posts
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button asChild size="sm" className="shrink-0">
              <Link to="/auth">Register Free</Link>
            </Button>
          </div>
        </div>
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-6 w-6"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
};