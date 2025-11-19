import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ChevronDown, ChevronUp, RefreshCw, BarChart } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface OpenEndedReflectionProps {
  lessonSlug: string;
  sectionId: string;
  questionId: string;
  question: string;
}

export const OpenEndedReflection = ({
  lessonSlug,
  sectionId,
  questionId,
  question,
}: OpenEndedReflectionProps) => {
  const [response, setResponse] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [allResponses, setAllResponses] = useState<string[]>([]);
  const [thematicAnalysis, setThematicAnalysis] = useState("");
  const [responseCount, setResponseCount] = useState(0);

  const handleSubmit = async () => {
    if (!response.trim()) {
      toast.error("Please write your reflection before submitting");
      return;
    }

    if (response.length > 1000) {
      toast.error("Response must be less than 1000 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("lesson_interactions").insert({
        lesson_slug: lessonSlug,
        section_id: sectionId,
        question_id: questionId,
        response_option: response.trim(),
      });

      if (error) throw error;

      setHasSubmitted(true);
      toast.success("Thank you for sharing your reflection!");
      
      // Automatically load results after submission
      loadResults();
    } catch (error) {
      console.error("Error submitting reflection:", error);
      toast.error("Failed to submit reflection. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadResults = async () => {
    setIsLoadingResults(true);

    try {
      // Fetch all responses for this question
      const { data, error } = await supabase
        .from("lesson_interactions")
        .select("response_option")
        .eq("lesson_slug", lessonSlug)
        .eq("section_id", sectionId)
        .eq("question_id", questionId);

      if (error) throw error;

      const responses = data.map((r) => r.response_option);
      setAllResponses(responses);
      setResponseCount(responses.length);

      // Generate thematic analysis
      if (responses.length > 0) {
        const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
          "analyze-reflections",
          {
            body: { responses, question },
          }
        );

        if (analysisError) throw analysisError;

        setThematicAnalysis(analysisData.analysis);
      }

      setShowResults(true);
    } catch (error) {
      console.error("Error loading results:", error);
      toast.error("Failed to load results. Please try again.");
    } finally {
      setIsLoadingResults(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <h4 className="text-xl font-semibold text-foreground">{question}</h4>
        
        {!hasSubmitted ? (
          <>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Share your thoughts here..."
              className="text-base min-h-[150px]"
              maxLength={1000}
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{response.length}/1000 characters</p>
              <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Reflection"
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-foreground text-base">
              ✓ Your reflection has been submitted. Thank you for your participation!
            </p>
          </div>
        )}
      </Card>

      {hasSubmitted && (
        <Collapsible open={showResults} onOpenChange={setShowResults}>
          <Card className="p-6">
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <h4 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                View Aggregated Results ({responseCount} responses)
              </h4>
              <div className="flex items-center gap-2">
                {showResults && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      loadResults();
                    }}
                    variant="ghost"
                    size="sm"
                    disabled={isLoadingResults}
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingResults ? "animate-spin" : ""}`} />
                  </Button>
                )}
                {showResults ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-6 space-y-6">
              {isLoadingResults ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="bg-muted p-4 rounded-lg">
                    <h5 className="font-semibold text-foreground mb-3 text-lg">
                      Total Responses: {responseCount}
                    </h5>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {allResponses.slice(0, 10).map((resp, idx) => (
                        <div key={idx} className="bg-background p-3 rounded text-sm">
                          "{resp}"
                        </div>
                      ))}
                      {responseCount > 10 && (
                        <p className="text-sm text-muted-foreground italic">
                          Showing 10 of {responseCount} responses
                        </p>
                      )}
                    </div>
                  </div>

                  {thematicAnalysis && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h5 className="font-semibold text-foreground mb-3 text-lg">
                        AI Thematic Analysis
                      </h5>
                      <div className="prose prose-base max-w-none text-foreground">
                        <ReactMarkdown>{thematicAnalysis}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </div>
  );
};
