import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, BarChart3 } from "lucide-react";

interface ComprehensionCheckProps {
  lessonSlug: string;
  sectionId: string;
  questionId: string;
  question: string;
  options: string[];
}

export const ComprehensionCheck = ({ 
  lessonSlug, 
  sectionId, 
  questionId, 
  question, 
  options 
}: ComprehensionCheckProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [responseCount, setResponseCount] = useState(0);
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchStats();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`lesson-${lessonSlug}-${questionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'lesson_interactions',
          filter: `question_id=eq.${questionId}`
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lessonSlug, questionId]);

  const fetchStats = async () => {
    // Get visitor count
    const { count: visitors } = await supabase
      .from("lesson_visitors")
      .select("*", { count: "exact", head: true })
      .eq("lesson_slug", lessonSlug);

    setVisitorCount(visitors || 0);

    // Get response count for this question
    const { data: responses } = await supabase
      .from("lesson_interactions")
      .select("response_option")
      .eq("lesson_slug", lessonSlug)
      .eq("question_id", questionId);

    setResponseCount(responses?.length || 0);

    // Count responses by option
    const counts: Record<string, number> = {};
    responses?.forEach((r) => {
      counts[r.response_option] = (counts[r.response_option] || 0) + 1;
    });
    setResponseCounts(counts);
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null) return;

    setHasAnswered(true);
    
    // Store response anonymously
    await supabase.from("lesson_interactions").insert({
      lesson_slug: lessonSlug,
      section_id: sectionId,
      question_id: questionId,
      response_option: selectedAnswer,
    });

    fetchStats();
  };

  return (
    <Card className="mt-6 border-2 border-primary/20">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            {question}
          </h4>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {visitorCount} visitors
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              {responseCount} responses
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          {options.map((option, index) => {
            const count = responseCounts[option] || 0;
            const percentage = responseCount > 0 ? Math.round((count / responseCount) * 100) : 0;
            
            return (
              <div key={index} className="relative">
                <Button
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto py-3 relative overflow-hidden"
                  onClick={() => !hasAnswered && setSelectedAnswer(option)}
                  disabled={hasAnswered}
                >
                  {hasAnswered && (
                    <div 
                      className="absolute inset-0 bg-primary/10 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  )}
                  <span className="relative z-10 flex justify-between w-full">
                    <span>{option}</span>
                    {hasAnswered && <span className="font-semibold">{percentage}%</span>}
                  </span>
                </Button>
              </div>
            );
          })}
        </div>
        
        {!hasAnswered && (
          <Button 
            onClick={handleSubmit} 
            disabled={selectedAnswer === null}
            className="mt-4 w-full"
          >
            Submit Response
          </Button>
        )}
        
        {hasAnswered && (
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Thank you for your response! Results are updated in real-time.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
