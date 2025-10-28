import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

interface FeedbackFormProps {
  onComplete?: () => void;
}

export const FeedbackForm = ({ onComplete }: FeedbackFormProps) => {
  const [openResponse, setOpenResponse] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [usefulness, setUsefulness] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!openResponse || !difficulty || !usefulness) {
      toast({
        title: "Please complete all fields",
        description: "We value your complete feedback",
        variant: "destructive",
      });
      return;
    }

    setSubmitted(true);
    toast({
      title: "Thank you for your feedback! 🙏",
      description: "Your input helps us improve the learning experience",
    });
    
    setTimeout(() => {
      onComplete?.();
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="bg-success/10 p-8 rounded-2xl text-center border-2 border-success">
        <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-foreground mb-2">Feedback Submitted!</h3>
        <p className="text-muted-foreground">Thank you for helping us improve this lesson.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-2xl border-2 border-primary/20">
      <div>
        <Label htmlFor="reflection" className="text-lg font-semibold mb-3 block">
          Reflection Question
        </Label>
        <p className="text-muted-foreground mb-3">
          How do you plan to apply the AI prompt engineering framework in your teaching practice?
          What specific educational task will you tackle first?
        </p>
        <Textarea
          id="reflection"
          value={openResponse}
          onChange={(e) => setOpenResponse(e.target.value)}
          placeholder="Share your thoughts and plans..."
          className="min-h-32 resize-none"
          required
        />
      </div>

      <div>
        <Label className="text-lg font-semibold mb-3 block">
          How would you rate the difficulty of this lesson?
        </Label>
        <RadioGroup value={difficulty} onValueChange={setDifficulty} required>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="too-easy" id="too-easy" />
            <Label htmlFor="too-easy" className="cursor-pointer">Too Easy</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="just-right" id="just-right" />
            <Label htmlFor="just-right" className="cursor-pointer">Just Right</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="too-difficult" id="too-difficult" />
            <Label htmlFor="too-difficult" className="cursor-pointer">Too Difficult</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-lg font-semibold mb-3 block">
          How useful was this lesson for your professional development?
        </Label>
        <RadioGroup value={usefulness} onValueChange={setUsefulness} required>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="very-useful" id="very-useful" />
            <Label htmlFor="very-useful" className="cursor-pointer">Very Useful</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="somewhat-useful" id="somewhat-useful" />
            <Label htmlFor="somewhat-useful" className="cursor-pointer">Somewhat Useful</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="not-useful" id="not-useful" />
            <Label htmlFor="not-useful" className="cursor-pointer">Not Very Useful</Label>
          </div>
        </RadioGroup>
      </div>

      <Button 
        type="submit"
        className="w-full bg-gradient-to-r from-primary to-primary/80 text-lg py-6"
      >
        Submit Feedback
      </Button>
    </form>
  );
};
