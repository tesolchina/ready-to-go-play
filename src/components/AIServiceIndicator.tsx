import { useAIService } from "@/contexts/AIServiceContext";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Shield, Key } from "lucide-react";
import { Link } from "react-router-dom";

export const AIServiceIndicator = () => {
  const { isActivated, hasPlatformAccess, hasUserKey } = useAIService();

  if (isActivated) {
    return (
      <Badge variant="default" className="gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5" />
        AI Active
        {hasPlatformAccess && <Shield className="h-3 w-3 ml-0.5" />}
        {hasUserKey && <Key className="h-3 w-3 ml-0.5" />}
      </Badge>
    );
  }

  return (
    <Link to="/lessons">
      <Badge variant="secondary" className="gap-1.5 cursor-pointer hover:bg-destructive/20">
        <XCircle className="h-3.5 w-3.5" />
        Configure AI
      </Badge>
    </Link>
  );
};
