import { useAIService } from "@/contexts/AIServiceContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useAIServiceGuard = () => {
  const { isActivated } = useAIService();
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkAndNotify = (): boolean => {
    if (!isActivated) {
      toast({
        title: "AI Services Not Configured",
        description: "Please configure your API key to use AI features.",
        variant: "destructive",
        action: {
          label: "Configure Now",
          onClick: () => navigate("/configure-ai"),
        } as any,
      });
      return false;
    }
    return true;
  };

  return { isActivated, checkAndNotify };
};
