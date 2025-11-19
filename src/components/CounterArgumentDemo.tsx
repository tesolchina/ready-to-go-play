import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Lightbulb, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const CounterArgumentDemo = () => {
  const [response, setResponse] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);

  const demoArgument = `"Imposing minimum wage is an important way to ensure worker's welfare and prevent exploitation."`;

  const systemPrompt = `This is a student's counter-argument to the claim: ${demoArgument}

Provide constructive feedback on their reasoning, use of evidence, and clarity. Be encouraging and specific. Suggest improvements if needed.

IMPORTANT: Keep your response under 500 characters. Be concise and focus on the most important points.`;

  const handleSubmit = async () => {
    if (!response.trim()) {
      toast.error("Please write your counter-argument first");
      return;
    }

    if (response.length > 1000) {
      toast.error("Response must be less than 1000 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("provide-feedback", {
        body: {
          paragraph: response.trim(),
          context: systemPrompt,
        },
      });

      if (error) throw error;

      setFeedback(data.feedback);
      toast.success("Feedback received!");
    } catch (error) {
      console.error("Error getting feedback:", error);
      toast.error("Failed to get feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setResponse("");
    setFeedback("");
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-base text-foreground ml-2">
          <strong>Demo Exercise:</strong> This is what students will see. Try it yourself!
        </AlertDescription>
      </Alert>

      <Collapsible open={showSystemPrompt} onOpenChange={setShowSystemPrompt}>
        <Card className="p-4 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              AI System Prompt (Click to {showSystemPrompt ? "hide" : "view"})
            </h4>
            {showSystemPrompt ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="bg-muted p-3 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm font-mono text-foreground">
                {systemPrompt}
              </pre>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This is the instruction given to the AI to guide its feedback behavior.
            </p>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Card className="p-6 space-y-4">
        <div>
          <h4 className="text-xl font-semibold text-foreground mb-3">
            Consider this argument:
          </h4>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-lg leading-relaxed italic text-foreground">{demoArgument}</p>
          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-foreground mb-3">
            Your Task: Address a Counter-Argument
          </h4>
          <p className="text-base text-muted-foreground mb-4">
            Think of a potential challenge to this claim and explain why this argument is still valid
            (or propose a different perspective). Use specific examples if possible.
          </p>
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="One might argue that... However, I believe..."
            className="text-base min-h-[150px]"
            maxLength={1000}
            disabled={isSubmitting}
          />
          <p className="text-sm text-muted-foreground mt-2">
            {response.length}/1000 characters
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !response.trim()}
            className="flex-1 text-base"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Getting Feedback...
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4 mr-2" />
                Get AI Feedback
              </>
            )}
          </Button>
          {(response || feedback) && (
            <Button onClick={handleReset} variant="outline" size="lg" className="text-base">
              Reset
            </Button>
          )}
        </div>
      </Card>

      {feedback && (
        <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <h4 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            AI Feedback
          </h4>
          <div className="prose prose-base max-w-none text-foreground">
            <ReactMarkdown>{feedback}</ReactMarkdown>
          </div>
        </Card>
      )}
    </div>
  );
};
