import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Copy, ArrowLeft, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Template {
  original: string;
  template: string;
  explanation: string;
}

interface Exercise {
  instruction: string;
  template: string;
  hints: string[];
}

interface Pattern {
  categoryType: "moves" | "general";
  category: string;
  subcategory: string;
  templates: Template[];
  exercises: Exercise[];
}

interface AnalysisResult {
  patterns: Pattern[];
}

interface TemplateFeedback {
  overall_score: number;
  strengths: string[];
  improvements: string[];
  revised_suggestion: string;
  explanation: string;
}

const EXAMPLE_PARAGRAPH = `Traditionally, teachers have focused on teaching rather than learning. In recent years, however, universities and other institutions have recognised the importance of student-centered learning approaches. It is increasingly common for academic departments and teachers to reconsider their practices and adjust teaching strategies to encourage students to assume more responsibility for their own learning. This shift has been facilitated by AI tools that enable more interactive and personalized learning experiences. AI can help teachers create customized learning materials, provide instant feedback, and facilitate peer-to-peer learning. Nevertheless, the role of the teacher remains critical in guiding students and ensuring that technology enhances rather than replaces human interaction.`;

const CustomPhrasebankChat = () => {
  const [paragraphInput, setParagraphInput] = useState(EXAMPLE_PARAGRAPH);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [templateAnswers, setTemplateAnswers] = useState<Record<string, string>>({});
  const [templateFeedback, setTemplateFeedback] = useState<Record<string, TemplateFeedback>>({}); 
  const [submittingTemplate, setSubmittingTemplate] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<string>("");
  const [feedbackProgress, setFeedbackProgress] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleAnalyzeParagraph = async () => {
    if (!paragraphInput.trim() || paragraphInput.length < 50) {
      toast({
        title: "Input required",
        description: "Please enter at least 50 characters of text.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress("Checking for cached analysis...");
    
    try {
      // Check if this is the default paragraph
      if (paragraphInput.trim() === EXAMPLE_PARAGRAPH.trim()) {
        // Fetch from database
        const { data: cachedData, error: dbError } = await supabase
          .from('paragraph_analyses')
          .select('analysis_result')
          .eq('is_default', true)
          .eq('paragraph_text', paragraphInput.trim())
          .single();

        if (cachedData && !dbError) {
          setAnalysisResult(cachedData.analysis_result as unknown as AnalysisResult);
          toast({
            title: "Analysis complete",
            description: `Found ${((cachedData.analysis_result as unknown as AnalysisResult).patterns?.length || 0)} relevant pattern(s) (cached)`,
          });
          setIsAnalyzing(false);
          return;
        }
      }

      // Call AI function for analysis
      setAnalysisProgress("Connecting to AI service...");
      await new Promise(resolve => setTimeout(resolve, 300));
      setAnalysisProgress("Analyzing paragraph structure...");
      
      const { data, error } = await supabase.functions.invoke('analyze-paragraph', {
        body: { paragraph: paragraphInput }
      });
      
      setAnalysisProgress("Processing patterns and templates...");

      if (error) throw error;

      if (data && data.patterns) {
        setAnalysisResult(data);
        toast({
          title: "Analysis complete",
          description: `Found ${data.patterns.length} relevant pattern(s)`,
        });
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze paragraph.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitTemplateAnswer = async (
    patternIdx: number,
    templateIdx: number,
    pattern: Pattern,
    template: Template
  ) => {
    const answerKey = `${patternIdx}-${templateIdx}`;
    const userAnswer = templateAnswers[answerKey];

    if (!userAnswer || userAnswer.trim().length < 10) {
      toast({
        title: "Answer required",
        description: "Please write at least 10 characters.",
        variant: "destructive",
      });
      return;
    }

    setSubmittingTemplate(answerKey);
    setFeedbackProgress({ ...feedbackProgress, [answerKey]: "Connecting to AI..." });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setFeedbackProgress({ ...feedbackProgress, [answerKey]: "Analyzing your answer..." });
      
      const { data, error } = await supabase.functions.invoke('template-feedback', {
        body: {
          paragraphText: paragraphInput,
          patternCategory: pattern.category,
          patternSubcategory: pattern.subcategory,
          templateText: template.template,
          userAnswer: userAnswer
        }
      });

      if (error) throw error;

      setFeedbackProgress({ ...feedbackProgress, [answerKey]: "Generating feedback..." });
      
      if (data) {
        setTemplateFeedback(prev => ({
          ...prev,
          [answerKey]: data
        }));
        toast({
          title: "Feedback received",
          description: "AI has reviewed your answer!",
        });
      }
    } catch (error: any) {
      console.error('Feedback error:', error);
      toast({
        title: "Feedback failed",
        description: error.message || "Failed to get feedback.",
        variant: "destructive",
      });
    } finally {
      setSubmittingTemplate(null);
      setFeedbackProgress({ ...feedbackProgress, [answerKey]: "" });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Template copied to clipboard",
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold">Custom Phrasebank</h2>
          </header>
          <div className="p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <Link to="/academic-phrasebank">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Academic Phrasebank
              </Button>
            </Link>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Academic Phrasebank Analyzer</h1>
              <p className="text-xl text-muted-foreground">
                Identify Academic Phrasebank patterns in your writing and get relevant templates
              </p>
            </div>

            <Card className="shadow-lg border-2">
              <CardHeader className="border-b bg-gradient-to-r from-accent/5 to-primary/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-xl">
                    <Sparkles className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Analyze Your Paragraph</CardTitle>
                    <CardDescription>
                      Paste a paragraph to identify which Academic Phrasebank categories and moves it uses
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Textarea
                    value={paragraphInput}
                    onChange={(e) => setParagraphInput(e.target.value)}
                    placeholder="Paste a paragraph from an academic text here..."
                    className="min-h-[200px] text-base"
                  />
                  
                  <Button 
                    onClick={handleAnalyzeParagraph}
                    disabled={isAnalyzing}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze Paragraph"}
                  </Button>
                </div>

                {analysisResult && (
                  <div className="mt-8 space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <h3 className="text-lg font-semibold">Analysis Results</h3>
                      <Badge variant="secondary">{analysisResult.patterns.length} patterns found</Badge>
                    </div>

                    {analysisResult.patterns.map((pattern, patternIdx) => (
                      <CollapsibleSection
                        key={patternIdx}
                        title={
                          <div className="flex items-center gap-3">
                            <Badge variant={pattern.categoryType === "moves" ? "default" : "secondary"}>
                              {pattern.categoryType === "moves" ? "Move" : "Function"}
                            </Badge>
                            <span className="font-semibold">{pattern.category}</span>
                            {pattern.subcategory && (
                              <>
                                <span className="text-primary-foreground/80">→</span>
                                <span className="text-sm text-primary-foreground/90">{pattern.subcategory}</span>
                              </>
                            )}
                          </div>
                        }
                        defaultOpen={true}
                      >
                        <div className="space-y-4">
                          {pattern.templates.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                Templates
                              </h4>
                              {pattern.templates.map((template, idx) => {
                                const answerKey = `${patternIdx}-${idx}`;
                                const feedback = templateFeedback[answerKey];
                                const isSubmitting = submittingTemplate === answerKey;

                                return (
                                  <Card key={idx} className="bg-muted/30">
                                    <CardContent className="pt-4">
                                      <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-4">
                                          <div className="space-y-2 flex-1">
                                            <p className="text-sm font-medium">Original:</p>
                                            <p className="text-sm text-muted-foreground italic">
                                              {template.original}
                                            </p>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard(template.template)}
                                            className="shrink-0"
                                          >
                                            <Copy className="h-4 w-4" />
                                          </Button>
                                        </div>

                                        <div className="space-y-2">
                                          <p className="text-sm font-medium">Template:</p>
                                          <p className="text-sm font-mono bg-background p-3 rounded border">
                                            {template.template}
                                          </p>
                                        </div>

                                        {template.explanation && (
                                          <div className="space-y-2 pt-2 border-t">
                                            <p className="text-sm font-medium">Usage:</p>
                                            <p className="text-sm text-muted-foreground">
                                              {template.explanation}
                                            </p>
                                          </div>
                                        )}

                                        {/* Practice Section */}
                                        <div className="space-y-3 pt-4 border-t">
                                          <p className="text-sm font-medium">Practice Using This Template:</p>
                                          <Textarea
                                            value={templateAnswers[answerKey] || ''}
                                            onChange={(e) => setTemplateAnswers(prev => ({
                                              ...prev,
                                              [answerKey]: e.target.value
                                            }))}
                                            placeholder="Write your own sentence using this template..."
                                            className="min-h-[100px]"
                                          />
                                          <Button
                                            onClick={() => handleSubmitTemplateAnswer(patternIdx, idx, pattern, template)}
                                            disabled={submittingTemplate === answerKey || !templateAnswers[answerKey]?.trim()}
                                            className="w-full"
                                          >
                                            {submittingTemplate === answerKey ? (
                                              <>
                                                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                                                Getting Feedback...
                                              </>
                                            ) : (
                                              <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Get AI Feedback
                                              </>
                                            )}
                                          </Button>
                                          
                                          {feedbackProgress[answerKey] && (
                                            <div className="text-sm text-muted-foreground text-center animate-pulse">
                                              {feedbackProgress[answerKey]}
                                            </div>
                                          )}
                                        </div>

                                        {/* Feedback Display */}
                                        {feedback && (
                                          <div className="space-y-4 pt-4 border-t bg-accent/5 p-4 rounded-lg">
                                            <div className="flex items-center gap-2">
                                              <Badge variant="default">Score: {feedback.overall_score}/10</Badge>
                                            </div>

                                            {feedback.strengths && feedback.strengths.length > 0 && (
                                              <div className="space-y-2">
                                                <p className="text-sm font-medium text-green-600 dark:text-green-400">Strengths:</p>
                                                <ul className="list-disc list-inside space-y-1 text-sm">
                                                  {feedback.strengths.map((strength, i) => (
                                                    <li key={i} className="text-muted-foreground">{strength}</li>
                                                  ))}
                                                </ul>
                                              </div>
                                            )}

                                            {feedback.improvements && feedback.improvements.length > 0 && (
                                              <div className="space-y-2">
                                                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Areas for Improvement:</p>
                                                <ul className="list-disc list-inside space-y-1 text-sm">
                                                  {feedback.improvements.map((improvement, i) => (
                                                    <li key={i} className="text-muted-foreground">{improvement}</li>
                                                  ))}
                                                </ul>
                                              </div>
                                            )}

                                            {feedback.revised_suggestion && (
                                              <div className="space-y-2">
                                                <p className="text-sm font-medium">Suggested Revision:</p>
                                                <div className="text-sm bg-background p-3 rounded border">
                                                  <ReactMarkdown>{feedback.revised_suggestion}</ReactMarkdown>
                                                </div>
                                              </div>
                                            )}

                                            {feedback.explanation && (
                                              <div className="space-y-2">
                                                <p className="text-sm font-medium">Explanation:</p>
                                                <div className="text-sm text-muted-foreground">
                                                  <ReactMarkdown>{feedback.explanation}</ReactMarkdown>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                          )}

                          {pattern.exercises.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                Practice Exercises
                              </h4>
                              {pattern.exercises.map((exercise, idx) => (
                                <Card key={idx} className="bg-primary/5">
                                  <CardContent className="pt-4">
                                    <div className="space-y-3">
                                      <div className="space-y-2">
                                        <p className="text-sm font-medium">Instructions:</p>
                                        <p className="text-sm">{exercise.instruction}</p>
                                      </div>

                                      <div className="space-y-2">
                                        <p className="text-sm font-medium">Template:</p>
                                        <p className="text-sm font-mono bg-background p-3 rounded border">
                                          {exercise.template}
                                        </p>
                                      </div>

                                      {exercise.hints && exercise.hints.length > 0 && (
                                        <div className="space-y-2 pt-2 border-t">
                                          <p className="text-sm font-medium">Hints:</p>
                                          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                            {exercise.hints.map((hint, hintIdx) => (
                                              <li key={hintIdx}>{hint}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      </CollapsibleSection>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CustomPhrasebankChat;
