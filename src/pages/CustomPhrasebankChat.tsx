import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Copy } from "lucide-react";

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

const EXAMPLE_PARAGRAPH = `Traditionally, teachers have focused on teaching rather than learning. In recent years, however, universities and other institutions have recognised the importance of student-centered learning approaches. It is increasingly common for academic departments and teachers to reconsider their practices and adjust teaching strategies to encourage students to assume more responsibility for their own learning. This shift has been facilitated by AI tools that enable more interactive and personalized learning experiences. AI can help teachers create customized learning materials, provide instant feedback, and facilitate peer-to-peer learning. Nevertheless, the role of the teacher remains critical in guiding students and ensuring that technology enhances rather than replaces human interaction.`;

const CustomPhrasebankChat = () => {
  const [paragraphInput, setParagraphInput] = useState(EXAMPLE_PARAGRAPH);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyzeParagraph = async () => {
    if (!paragraphInput.trim() || paragraphInput.length < 50) {
      toast({
        title: "Input required",
        description: "Please enter at least 50 characters of text from a journal article.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-paragraph', {
        body: { paragraph: paragraphInput }
      });

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
        description: error.message || "Failed to analyze paragraph. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
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
        <main className="flex-1 p-8 bg-background">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Paragraph Analyzer</h1>
              <p className="text-xl text-muted-foreground">
                Paste a paragraph from a journal article to identify relevant categories and extract sentence templates
              </p>
            </div>

            <Card className="shadow-lg border-2">
              <CardHeader className="border-b bg-gradient-to-r from-accent/5 to-primary/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-xl">
                    <Sparkles className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Analyze Your Text</CardTitle>
                    <CardDescription>
                      An example paragraph is provided below - replace it with your own text
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Textarea
                    value={paragraphInput}
                    onChange={(e) => setParagraphInput(e.target.value)}
                    placeholder="Paste a paragraph from a journal article here..."
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
                                <span className="text-muted-foreground">→</span>
                                <span className="text-sm text-muted-foreground">{pattern.subcategory}</span>
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
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CustomPhrasebankChat;
