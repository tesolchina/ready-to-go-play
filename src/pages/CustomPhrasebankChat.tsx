import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Copy, ArrowLeft, Send, ChevronDown, Info, Loader2, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAIServiceGuard } from "@/hooks/useAIServiceGuard";
import { getAIHeaders } from "@/lib/aiServiceGuard";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [selectedPatternIndex, setSelectedPatternIndex] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [templateAnswers, setTemplateAnswers] = useState<Record<string, string>>({});
  const [templateFeedback, setTemplateFeedback] = useState<Record<string, TemplateFeedback>>({}); 
  const [submittingTemplate, setSubmittingTemplate] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<string>("");
  const [feedbackProgress, setFeedbackProgress] = useState<Record<string, string>>({});
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const { toast } = useToast();
  const { isActivated, checkAndNotify } = useAIServiceGuard();

  const systemPromptText = `You are an expert in academic writing. Analyze the paragraph and identify ALL academic patterns present.

Categories:
MOVES: Introducing work, Referring to sources, Describing methods, Reporting results, Discussing findings, Writing conclusions
GENERAL: Being cautious, Being critical, Classifying and listing, Compare and contrast, Defining terms, Describing trends, Describing quantities, Explaining causality, Giving examples, Signalling transition, Writing about the past

Instructions:
1. Find ALL patterns (typically 2-5)
2. For each pattern:
   - Type: "moves" or "general"
   - Category & subcategory
   - 3-5 templates from the text
   - 3-5 practice exercises`;

  const handleAnalyzeParagraph = async () => {
    if (!checkAndNotify()) return;
    
    if (!paragraphInput.trim() || paragraphInput.length < 50) {
      toast({
        title: "Input required",
        description: "Please enter at least 50 characters of text.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress("🔍 Initializing analysis...");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Check if this is the default paragraph
      if (paragraphInput.trim() === EXAMPLE_PARAGRAPH.trim()) {
        setAnalysisProgress("📊 Checking for cached analysis...");
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Fetch from database
        const { data: cachedData, error: dbError } = await supabase
          .from('paragraph_analyses')
          .select('analysis_result')
          .eq('is_default', true)
          .eq('paragraph_text', paragraphInput.trim())
          .maybeSingle();

        if (cachedData && !dbError) {
          setAnalysisProgress("✅ Loading cached results...");
          setAnalysisResult(cachedData.analysis_result as unknown as AnalysisResult);
          setSelectedPatternIndex(null);
          toast({
            title: "Analysis complete",
            description: `Found ${((cachedData.analysis_result as unknown as AnalysisResult).patterns?.length || 0)} relevant pattern(s) (cached)`,
          });
          setIsAnalyzing(false);
          setAnalysisProgress("");
          return;
        }
      }

      // Call AI function for analysis
      setAnalysisProgress("🤖 Connecting to AI service...");
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setAnalysisProgress("📝 Reading and understanding your paragraph...");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAnalysisProgress("🔎 Identifying academic patterns and categories...");
      
      const { data, error } = await supabase.functions.invoke('analyze-paragraph', {
        body: { paragraph: paragraphInput },
        headers: getAIHeaders()
      });
      
      setAnalysisProgress("✨ Generating templates and exercises...");

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
      setAnalysisProgress("");
    }
  };

  const handleSubmitTemplateAnswer = async (
    patternIdx: number,
    templateIdx: number,
    pattern: Pattern,
    template: Template
  ) => {
    if (!checkAndNotify()) return;
    
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
        },
        headers: getAIHeaders()
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
                  {/* System Prompt Info */}
                  <Collapsible open={showSystemPrompt} onOpenChange={setShowSystemPrompt}>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-between">
                        <span className="flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          How AI Analyzes Your Paragraph
                        </span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${showSystemPrompt ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-4">
                      <Card className="bg-muted/50">
                        <CardHeader>
                          <CardTitle className="text-sm">AI Processing Steps</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-primary">1</span>
                            </div>
                            <div>
                              <p className="font-medium">Text Analysis</p>
                              <p className="text-muted-foreground">AI reads your paragraph and identifies sentence structures, transitions, and academic language patterns.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-primary">2</span>
                            </div>
                            <div>
                              <p className="font-medium">Pattern Matching</p>
                              <p className="text-muted-foreground">Compares your text against academic phrasebank categories (Moves & General Functions) to find matching patterns.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-primary">3</span>
                            </div>
                            <div>
                              <p className="font-medium">Template Extraction</p>
                              <p className="text-muted-foreground">Extracts 3-5 reusable sentence templates from your text with placeholders for key information.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-primary">4</span>
                            </div>
                            <div>
                              <p className="font-medium">Exercise Generation</p>
                              <p className="text-muted-foreground">Creates 3-5 practice exercises with instructions and hints to help you master the patterns.</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            System Prompt
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-xs whitespace-pre-wrap font-mono bg-background p-4 rounded border overflow-x-auto">
                            {systemPromptText}
                          </pre>
                        </CardContent>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Textarea
                    value={paragraphInput}
                    onChange={(e) => setParagraphInput(e.target.value)}
                    placeholder="Paste a paragraph from an academic text here..."
                    className="min-h-[200px] text-base"
                  />
                  
                  {!isActivated && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        AI services not configured. Please{" "}
                        <Link to="/lessons" className="font-medium underline">
                          configure your API key
                        </Link>{" "}
                        to use AI-powered features.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {analysisProgress && (
                    <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
                      <p className="text-sm font-medium">{analysisProgress}</p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleAnalyzeParagraph}
                    disabled={isAnalyzing || !isActivated}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analyze Paragraph
                      </>
                    )}
                  </Button>
                </div>

                {analysisResult && (
                  <div className="mt-8 space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <h3 className="text-lg font-semibold">Analysis Results</h3>
                      <Badge variant="secondary">{analysisResult.patterns.length} pattern{analysisResult.patterns.length !== 1 ? 's' : ''} found</Badge>
                    </div>

                    {selectedPatternIndex === null ? (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Select a pattern below to view details and practice:
                        </p>
                        {analysisResult.patterns.map((pattern, patternIdx) => (
                          <Card 
                            key={patternIdx}
                            className="cursor-pointer hover:bg-accent/50 transition-colors"
                            onClick={() => setSelectedPatternIndex(patternIdx)}
                          >
                            <CardContent className="py-4">
                              <div className="flex items-center gap-3">
                                <Badge variant={pattern.categoryType === "moves" ? "default" : "secondary"}>
                                  {pattern.categoryType === "moves" ? "Move" : "Function"}
                                </Badge>
                                <span className="font-semibold">{pattern.category}</span>
                                {pattern.subcategory && (
                                  <>
                                    <span className="text-muted-foreground">→</span>
                                    <span className="text-sm text-muted-foreground">{pattern.subcategory}</span>
                                  </>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPatternIndex(null)}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to all patterns
                        </Button>

                        {(() => {
                          const pattern = analysisResult.patterns[selectedPatternIndex];
                          return (
                            <Card className="border-2">
                              <CardHeader>
                                <div className="flex items-center gap-3">
                                  <Badge variant={pattern.categoryType === "moves" ? "default" : "secondary"}>
                                    {pattern.categoryType === "moves" ? "Move" : "Function"}
                                  </Badge>
                                  <CardTitle>{pattern.category}</CardTitle>
                                  {pattern.subcategory && (
                                    <>
                                      <span className="text-muted-foreground">→</span>
                                      <span className="text-lg text-muted-foreground">{pattern.subcategory}</span>
                                    </>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-6">
                                {pattern.templates.length > 0 && (
                                  <div className="space-y-3">
                                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                      Templates & Examples
                                    </h4>
                                    {pattern.templates.map((template, idx) => (
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
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                )}

                                {pattern.exercises.length > 0 && (
                                  <div className="space-y-4 pt-4 border-t">
                                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                      Practice Exercises
                                    </h4>
                                    {pattern.exercises.map((exercise, idx) => {
                                      const answerKey = `${selectedPatternIndex}-${idx}`;
                                      const feedback = templateFeedback[answerKey];
                                      const isSubmitting = submittingTemplate === answerKey;
                                      const progressMsg = feedbackProgress[answerKey];

                                      return (
                                        <Card key={idx} className="bg-accent/5">
                                          <CardHeader>
                                            <CardTitle className="text-base">Exercise {idx + 1}</CardTitle>
                                            <CardDescription>{exercise.instruction}</CardDescription>
                                          </CardHeader>
                                          <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                              <p className="text-sm font-medium">Template to practice:</p>
                                              <p className="text-sm font-mono bg-background p-3 rounded border">
                                                {exercise.template}
                                              </p>
                                            </div>

                                            {exercise.hints && exercise.hints.length > 0 && (
                                              <div className="space-y-2">
                                                <p className="text-sm font-medium">Hints:</p>
                                                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                                  {exercise.hints.map((hint, hintIdx) => (
                                                    <li key={hintIdx}>{hint}</li>
                                                  ))}
                                                </ul>
                                              </div>
                                            )}

                                            <div className="space-y-3 pt-2">
                                              <p className="text-sm font-medium">Your answer:</p>
                                              <Textarea
                                                value={templateAnswers[answerKey] || ""}
                                                onChange={(e) => setTemplateAnswers({
                                                  ...templateAnswers,
                                                  [answerKey]: e.target.value
                                                })}
                                                placeholder="Write your sentence using the template..."
                                                className="min-h-[100px]"
                                              />

                                              {progressMsg && (
                                                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                                                  <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                                                  <p className="text-sm text-muted-foreground">{progressMsg}</p>
                                                </div>
                                              )}

                                              <Button
                                                onClick={() => handleSubmitTemplateAnswer(
                                                  selectedPatternIndex,
                                                  idx,
                                                  pattern,
                                                  { original: "", template: exercise.template, explanation: "" }
                                                )}
                                                disabled={!templateAnswers[answerKey]?.trim() || isSubmitting}
                                                size="sm"
                                              >
                                                <Send className="h-4 w-4 mr-2" />
                                                {isSubmitting ? "Getting Feedback..." : "Get AI Feedback"}
                                              </Button>
                                            </div>

                                            {feedback && (
                                              <div className="space-y-3 pt-4 border-t">
                                                <div className="flex items-center justify-between">
                                                  <h5 className="font-medium">AI Feedback</h5>
                                                  <Badge variant={feedback.overall_score >= 80 ? "default" : "secondary"}>
                                                    Score: {feedback.overall_score}/100
                                                  </Badge>
                                                </div>

                                                {feedback.strengths.length > 0 && (
                                                  <div className="space-y-2">
                                                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Strengths:</p>
                                                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                                                      {feedback.strengths.map((strength, i) => (
                                                        <li key={i}>{strength}</li>
                                                      ))}
                                                    </ul>
                                                  </div>
                                                )}

                                                {feedback.improvements.length > 0 && (
                                                  <div className="space-y-2">
                                                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Areas for improvement:</p>
                                                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                                                      {feedback.improvements.map((improvement, i) => (
                                                        <li key={i}>{improvement}</li>
                                                      ))}
                                                    </ul>
                                                  </div>
                                                )}

                                                {feedback.revised_suggestion && (
                                                  <div className="space-y-2">
                                                    <p className="text-sm font-medium">Suggested revision:</p>
                                                    <p className="text-sm bg-background p-3 rounded border italic">
                                                      {feedback.revised_suggestion}
                                                    </p>
                                                  </div>
                                                )}

                                                {feedback.explanation && (
                                                  <div className="space-y-2">
                                                    <p className="text-sm font-medium">Explanation:</p>
                                                    <div className="text-sm text-muted-foreground prose prose-sm max-w-none">
                                                      <ReactMarkdown>{feedback.explanation}</ReactMarkdown>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </CardContent>
                                        </Card>
                                      );
                                    })}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })()}
                      </div>
                    )}
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
