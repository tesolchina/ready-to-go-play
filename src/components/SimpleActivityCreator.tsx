import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Clock, Users, Copy, Check } from "lucide-react";
import { requestQueue } from "@/lib/requestQueue";

export const SimpleActivityCreator = () => {
  const [nickname, setNickname] = useState("");
  const [argument, setArgument] = useState("");
  const [feedbackGuidance, setFeedbackGuidance] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queuePosition, setQueuePosition] = useState<{ position: number; total: number } | null>(null);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const requestIdRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (requestIdRef.current) {
        requestQueue.removeListener(requestIdRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim() || !argument.trim()) {
      toast.error("Please fill in your nickname and the argument");
      return;
    }

    if (nickname.length > 50) {
      toast.error("Nickname must be less than 50 characters");
      return;
    }

    if (argument.length > 1000) {
      toast.error("Argument must be less than 1000 characters");
      return;
    }

    setIsSubmitting(true);
    setQueuePosition(null);

    try {
      const data = await requestQueue.add(async () => {
        requestIdRef.current = crypto.randomUUID();

        requestQueue.onQueueChange(requestIdRef.current, (position, total) => {
          if (position > 0) {
            setQueuePosition({ position, total });
          } else {
            setQueuePosition(null);
          }
        });

        const { data, error } = await supabase.functions.invoke("generate-simple-activity", {
          body: {
            nickname: nickname.trim(),
            argument: argument.trim(),
            feedbackGuidance: feedbackGuidance.trim() || "Be encouraging and specific",
          },
        });

        if (error) throw error;
        return data;
      });

      setSystemPrompt(data.systemPrompt);
      toast.success("System prompt generated successfully!");
    } catch (error: any) {
      console.error("Error generating system prompt:", error);

      if (error?.status === 429) {
        toast.error("System is currently busy. Your request has been queued.");
      } else {
        toast.error("Failed to generate system prompt. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
      setQueuePosition(null);
      if (requestIdRef.current) {
        requestQueue.removeListener(requestIdRef.current);
        requestIdRef.current = null;
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(systemPrompt);
    setCopied(true);
    toast.success("System prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <AlertDescription className="text-base text-foreground">
          <strong>Now it's your turn!</strong> Create a similar counter-argument exercise for your students.
          The system will generate an AI feedback prompt tailored to your activity.
        </AlertDescription>
      </Alert>

      {isSubmitting && queuePosition && queuePosition.position > 0 && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-base">
              You are <strong>#{queuePosition.position}</strong> in queue. {queuePosition.total} total requests being processed.
              Estimated wait time: <strong>{Math.ceil(queuePosition.position * 20)} seconds</strong>
            </span>
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="nickname" className="text-lg font-semibold">
              Your Nickname *
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Your name as the activity creator
            </p>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g., Professor Zhang"
              className="text-base"
              maxLength={50}
              required
            />
          </div>

          <div>
            <Label htmlFor="argument" className="text-lg font-semibold">
              The Argument/Claim *
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              What statement should students address a counter-argument to?
            </p>
            <Textarea
              id="argument"
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              placeholder='e.g., "Traditional teaching methods are more effective than AI-enhanced learning for developing critical thinking skills."'
              className="text-base min-h-[120px]"
              maxLength={1000}
              required
            />
            <p className="text-sm text-muted-foreground mt-2">{argument.length}/1000 characters</p>
          </div>

          <div>
            <Label htmlFor="feedback" className="text-lg font-semibold">
              Feedback Guidance (Optional)
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              How should AI provide feedback? What aspects should it focus on?
            </p>
            <Textarea
              id="feedback"
              value={feedbackGuidance}
              onChange={(e) => setFeedbackGuidance(e.target.value)}
              placeholder="e.g., Focus on logic and evidence. Encourage balanced perspectives. Suggest areas for deeper analysis."
              className="text-base min-h-[100px]"
              maxLength={500}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} size="lg" className="w-full text-base">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {queuePosition && queuePosition.position > 0
                  ? `In Queue (${queuePosition.position}/${queuePosition.total})...`
                  : "Generating System Prompt..."}
              </>
            ) : (
              "Generate AI Feedback Prompt"
            )}
          </Button>
        </form>
      </Card>

      {systemPrompt && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Your AI System Prompt</h3>
            <Button onClick={handleCopy} variant="outline" size="sm">
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-base font-mono">{systemPrompt}</pre>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Use this prompt in your AI chatbot or teaching assistant tool to provide consistent, helpful feedback to students.
          </p>
        </Card>
      )}
    </div>
  );
};
