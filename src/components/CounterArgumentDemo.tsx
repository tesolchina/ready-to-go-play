import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Lightbulb, MessageSquare, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAIServiceGuard } from "@/hooks/useAIServiceGuard";
import { Link } from "react-router-dom";
import { getAIHeaders } from "@/lib/aiServiceGuard";

const LESSON_SLUG = "interactive-learning-reflection";
const SECTION_ID = "counter-argument-exercise";

interface CounterArgumentDemoProps {
  onAnalyticsUpdate?: () => void;
}

export const CounterArgumentDemo = ({ onAnalyticsUpdate }: CounterArgumentDemoProps = {}) => {
  const { isActivated, checkAndNotify } = useAIServiceGuard();
  const [response, setResponse] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [progressMessage, setProgressMessage] = useState<string>("");

  // Track section visit on mount
  useEffect(() => {
    const trackSectionVisit = async () => {
      const storageKey = `visited_${LESSON_SLUG}_${SECTION_ID}`;
      const hasVisited = localStorage.getItem(storageKey);
      
      if (!hasVisited) {
        try {
          await supabase.from("section_visits").insert({
            lesson_slug: LESSON_SLUG,
            section_id: SECTION_ID,
          });
          localStorage.setItem(storageKey, new Date().toISOString());
        } catch (error) {
          console.error('Error tracking section visit:', error);
        }
      }
    };
    trackSectionVisit();
  }, []);

  const demoArgument = `"Imposing minimum wage is an important way to ensure worker's welfare and prevent exploitation."`;

  const systemPrompt = `You are an experienced language teacher. The student is asked to come up with a counterargument and a rebuttal in response to the following claim:

${demoArgument}

Your job is to first check if there is a counterargument and a rebuttal in the student's answer.

Then whether the counterargument is a valid challenge. And whether the rebuttal is relevant and addresses the challenge.

You should also explore other possible challenges and rebuttals in your answer.

Your comments on the student's response should be critical and constructive.  You should offer actionable insights to help the student improve their writing and critical thinking skills.`;

  const handleSubmit = async () => {
    if (!checkAndNotify()) {
      return;
    }

    if (!response.trim()) {
      toast.error("Please write your counter-argument first");
      return;
    }

    if (response.length > 1000) {
      toast.error("Response must be less than 1000 characters");
      return;
    }

    setIsSubmitting(true);
    setProgressMessage("Connecting to AI...");

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgressMessage("Analyzing your argument...");
      
      // Get feedback with AI service headers
      const aiHeaders = getAIHeaders();
      const { data: feedbackData, error: feedbackError } = await supabase.functions.invoke("provide-feedback", {
        body: {
          paragraph: response.trim(),
          context: systemPrompt,
        },
        headers: aiHeaders,
      });

      if (feedbackError) throw feedbackError;

      setProgressMessage("Performing semantic analysis...");
      
      // Perform semantic analysis with AI service headers
      const { data: semanticData, error: semanticError } = await supabase.functions.invoke("semantic-analysis", {
        body: {
          text: response.trim(),
        },
        headers: aiHeaders,
      });

      if (semanticError) {
        console.error("Semantic analysis error:", semanticError);
      } else if (semanticData) {
        // Save response analytics
        await supabase.from("response_analytics").insert({
          lesson_slug: LESSON_SLUG,
          section_id: SECTION_ID,
          response_text: response.trim(),
          sentiment: semanticData.sentiment,
          key_themes: semanticData.key_themes,
          word_count: semanticData.word_count,
        });
        
        // Trigger analytics update
        onAnalyticsUpdate?.();
      }

      setProgressMessage("Generating feedback...");
      setFeedback(feedbackData.feedback);
      toast.success("Feedback received!");
    } catch (error) {
      console.error("Error getting feedback:", error);
      toast.error("Failed to get feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
      setProgressMessage("");
    }
  };

  const handleReset = () => {
    setResponse("");
    setFeedback("");
  };

  return (
    <div className="space-y-6">
      {!isActivated && (
        <Alert className="bg-destructive/10 border-destructive/30">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertDescription className="text-base text-foreground ml-2 flex items-center justify-between">
            <span>
              <strong>AI services not configured.</strong> Please configure your API key to use this feature.
            </span>
            <Link to="/lessons">
              <Button variant="destructive" size="sm" className="ml-4">
                Configure Now
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}
      
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
            disabled={!isActivated || isSubmitting || !response.trim()}
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
          
          {progressMessage && (
            <div className="text-sm text-muted-foreground text-center animate-pulse mt-2">
              {progressMessage}
            </div>
          )}
          
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
