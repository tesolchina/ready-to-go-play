import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Sparkles, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import phrasebankData from "@/lib/phrasebank-data.json";

// Moves/Steps - Research paper structure
const MOVES_STEPS = [
  "Introducing work",
  "Referring to sources",
  "Describing methods",
  "Reporting results",
  "Discussing findings",
  "Writing conclusions",
];

// General Language Functions
const GENERAL_LANGUAGE_FUNCTIONS = [
  "Being cautious",
  "Being critical",
  "Classifying and listing",
  "Compare and contrast",
  "Defining terms",
  "Describing trends",
  "Describing quantities",
  "Explaining causality",
  "Giving examples",
  "Signalling transition",
  "Writing about the past",
];

// Common academic disciplines
const COMMON_DISCIPLINES = [
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Computer Science",
  "Engineering",
  "Medicine",
  "Psychology",
  "Sociology",
  "Economics",
  "Business",
  "Education",
  "Literature",
  "History",
  "Philosophy",
  "Political Science",
  "Other",
];

const PhrasebankExercises = () => {
  const [categoryType, setCategoryType] = useState<"moves" | "general">("moves");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("__all__");
  const [discipline, setDiscipline] = useState<string>("");
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [examples, setExamples] = useState<string[]>([]);
  const [showExamples, setShowExamples] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number | null>(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [templateData, setTemplateData] = useState<any>(null);
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);
  const [studentSentence, setStudentSentence] = useState("");
  const [feedbackData, setFeedbackData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressMessage, setProgressMessage] = useState<string>("");
  const { toast } = useToast();

  const categories = categoryType === "moves" ? MOVES_STEPS : GENERAL_LANGUAGE_FUNCTIONS;

  // Load subcategories when category changes
  useEffect(() => {
    if (selectedCategory && phrasebankData[selectedCategory as keyof typeof phrasebankData]) {
      const categoryData = phrasebankData[selectedCategory as keyof typeof phrasebankData];
      const subs = Object.keys(categoryData);
      setSubcategories(subs);
      setSelectedSubcategory("__all__");
      setShowExamples(false);
    } else {
      setSubcategories([]);
      setSelectedSubcategory("__all__");
      setShowExamples(false);
    }
  }, [selectedCategory]);

  const handleGetExamples = async () => {
    if (!selectedCategory) return;

    const categoryData = phrasebankData[selectedCategory as keyof typeof phrasebankData];
    if (!categoryData) return;

    let allTemplates: string[] = [];

    if (selectedSubcategory === "__all__") {
      Object.values(categoryData).forEach((phrases) => {
        if (Array.isArray(phrases)) {
          allTemplates = [...allTemplates, ...phrases];
        }
      });
    } else {
      const subcategoryData = categoryData[selectedSubcategory as keyof typeof categoryData];
      if (Array.isArray(subcategoryData)) {
        allTemplates = subcategoryData;
      }
    }

    if (allTemplates.length === 0) {
      toast({
        title: "No templates found",
        description: "No templates available for the selected category.",
        variant: "destructive",
      });
      return;
    }

    setShowExamples(true);
    setExamples([]);
    setSelectedExampleIndex(null);
    setStudentSentence("");
    setFeedbackData(null);
    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-phrasebank-examples', {
        body: { 
          category: selectedCategory,
          subcategory: selectedSubcategory !== "__all__" ? selectedSubcategory : null,
          discipline: discipline && discipline !== "none" ? discipline : null,
          templates: allTemplates.slice(0, 15)
        }
      });

      if (error) throw error;

      if (data && data.examples) {
        setExamples(data.examples);
        toast({
          title: "Examples generated",
          description: `Created ${data.examples.length} discipline-specific examples`,
        });
      } else {
        throw new Error('No examples generated');
      }
    } catch (error: any) {
      console.error('Error generating examples:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate examples. Please try again.",
        variant: "destructive",
      });
      setShowExamples(false);
    } finally {
      setIsGenerating(false);
      setProgressMessage("");
    }
  };

  const handleSelectExample = (index: number) => {
    setSelectedExampleIndex(index);
    setIsPracticing(false);
    setTemplateData(null);
    setStudentSentence("");
    setFeedbackData(null);
  };

  const handleStartPractice = async () => {
    if (selectedExampleIndex === null) return;

    setIsGeneratingTemplate(true);
    setTemplateData(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-template-analysis', {
        body: {
          example: examples[selectedExampleIndex],
          discipline: discipline || "General",
          category: selectedCategory,
        }
      });

      if (error) throw error;

      setTemplateData(data);
      setIsPracticing(true);
      toast({
        title: "Template ready",
        description: "Study the template and write your own sentence!",
      });
    } catch (error) {
      console.error('Error generating template:', error);
      toast({
        title: "Error",
        description: "Failed to generate template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTemplate(false);
      setProgressMessage("");
    }
  };

  const handleGetFeedback = async () => {
    if (!studentSentence.trim() || selectedExampleIndex === null) {
      toast({
        title: "Please write a sentence",
        description: "Enter your sentence before getting feedback.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setFeedbackData(null);

    try {
      const { data, error } = await supabase.functions.invoke('provide-student-feedback', {
        body: {
          selectedExample: examples[selectedExampleIndex],
          studentSentence: studentSentence.trim(),
          discipline: discipline || "General",
          category: selectedCategory,
        }
      });

      if (error) throw error;

      setProgressMessage("Generating detailed feedback...");
      setFeedbackData(data);
      toast({
        title: "Feedback ready",
        description: "Review your AI feedback below!",
      });
    } catch (error) {
      console.error('Error getting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to get feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setProgressMessage("");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold">Phrasebank Exercises</h2>
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
              <h1 className="text-4xl font-bold tracking-tight">Phrasebank Exercises</h1>
              <p className="text-xl text-muted-foreground">
                Practice academic writing with structured exercises by discipline
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Select Your Focus Area</CardTitle>
                <CardDescription>
                  Choose the type of academic writing, specific category, subcategory, and your discipline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  {/* Category Type Selector */}
                  <div className="space-y-2">
                    <Label htmlFor="category-type">Category Type *</Label>
                    <Select
                      value={categoryType}
                      onValueChange={(value) => {
                        setCategoryType(value as "moves" | "general");
                        setSelectedCategory("");
                        setShowExamples(false);
                      }}
                    >
                      <SelectTrigger id="category-type" className="bg-background">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="moves">Moves/Steps (Research Paper Structure)</SelectItem>
                        <SelectItem value="general">General Language Functions</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      {categoryType === "moves" 
                        ? "Select phrases for specific sections of a research paper"
                        : "Select phrases for general academic language functions"}
                    </p>
                  </div>

                  {/* Specific Category Selector */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={(value) => {
                        setSelectedCategory(value);
                        setShowExamples(false);
                      }}
                    >
                      <SelectTrigger id="category" className="bg-background">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Choose the specific area you want to practice
                    </p>
                  </div>

                  {/* Subcategory Selector */}
                  {selectedCategory && subcategories.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Subcategory (Optional)</Label>
                      <Select
                        value={selectedSubcategory}
                        onValueChange={(value) => {
                          setSelectedSubcategory(value);
                          setShowExamples(false);
                        }}
                      >
                        <SelectTrigger id="subcategory" className="bg-background">
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-50">
                          <SelectItem value="__all__">All subcategories</SelectItem>
                          {subcategories.map((sub) => (
                            <SelectItem key={sub} value={sub}>
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Narrow down to specific types of phrases
                      </p>
                    </div>
                  )}

                  {/* Discipline Selector */}
                  <div className="space-y-2">
                    <Label htmlFor="discipline">Discipline (Optional)</Label>
                    <Select
                      value={discipline}
                      onValueChange={setDiscipline}
                    >
                      <SelectTrigger id="discipline" className="bg-background">
                        <SelectValue placeholder="Select discipline" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="none">No specific discipline</SelectItem>
                        {COMMON_DISCIPLINES.map((disc) => (
                          <SelectItem key={disc} value={disc}>
                            {disc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Filter examples by your field of study
                    </p>
                  </div>

                  {/* Get Examples Button */}
                  {selectedCategory && (
                    <Button 
                      onClick={handleGetExamples}
                      disabled={isGenerating}
                      size="lg"
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Generating Examples...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Get Examples
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {showExamples && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedCategory}
                    {selectedSubcategory !== "__all__" && ` - ${selectedSubcategory}`}
                  </CardTitle>
                  <CardDescription>
                    {isGenerating 
                      ? "Generating discipline-specific examples..." 
                      : `${examples.length} AI-generated example${examples.length !== 1 ? 's' : ''}`}
                    {discipline && discipline !== "none" && !isGenerating && ` for ${discipline}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isGenerating ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : examples.length > 0 ? (
                    <div className="space-y-3">
                      {examples.map((example, idx) => (
                        <div 
                          key={idx}
                          className={`p-4 rounded-lg border transition-all cursor-pointer ${
                            selectedExampleIndex === idx 
                              ? 'bg-primary/5 border-primary shadow-sm' 
                              : 'bg-muted/50 hover:border-primary/50'
                          }`}
                          onClick={() => handleSelectExample(idx)}
                        >
                          <div className="flex items-start gap-3">
                            <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                              selectedExampleIndex === idx 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-primary/10 text-primary'
                            }`}>
                              {idx + 1}
                            </span>
                            <p className="text-sm leading-relaxed flex-1">{example}</p>
                          </div>
                        </div>
                      ))}
                      <div className="space-y-2 pt-2">
                        {selectedExampleIndex === null ? (
                          <p className="text-sm text-muted-foreground text-center py-2">
                            👆 Click on an example to practice with it
                          </p>
                        ) : !isPracticing ? (
                          <Button
                            onClick={handleStartPractice}
                            disabled={isGeneratingTemplate}
                            size="lg"
                            className="w-full"
                          >
                            {isGeneratingTemplate ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Generating Template...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Practice with this Example
                              </>
                            )}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No examples generated yet
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {isPracticing && templateData && (
              <Card>
                <CardHeader>
                  <CardTitle>Practice Exercise</CardTitle>
                  <CardDescription>
                    Study the template and linguistic patterns, then write your own sentence on a different topic in {discipline || "your field"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Template Analysis Section */}
                  {templateData && (
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Badge variant="secondary">Sentence Template</Badge>
                        </h4>
                        <p className="text-sm font-mono bg-background p-3 rounded border">
                          {templateData.template}
                        </p>
                        {templateData.hint && (
                          <p className="text-sm text-muted-foreground mt-2 italic">
                            💡 {templateData.hint}
                          </p>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Badge variant="secondary">Linguistic Features to Use</Badge>
                        </h4>
                        <ul className="space-y-2">
                          {templateData.linguisticFeatures?.map((feature: string, idx: number) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Badge variant="secondary">Lexicogrammatical Patterns</Badge>
                        </h4>
                        <ul className="space-y-2">
                          {templateData.patterns?.map((pattern: string, idx: number) => (
                            <li key={idx} className="text-sm bg-background p-2 rounded border">
                              <span className="font-mono text-primary">{pattern.split(':')[0]}:</span>
                              <span className="ml-1">{pattern.split(':').slice(1).join(':')}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {templateData.suggestedTopic && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                          <h5 className="font-medium text-sm mb-1 text-blue-800 dark:text-blue-400">Suggested Topic</h5>
                          <p className="text-sm">{templateData.suggestedTopic}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Student Input Section */}
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground">Template to Follow</Label>
                      <p className="text-sm font-mono mt-1">{templateData.template}</p>
                    </div>
                    <Label htmlFor="student-sentence">
                      Your Sentence {discipline && discipline !== "none" && `(${discipline} context)`}
                    </Label>
                    <Textarea
                      id="student-sentence"
                      value={studentSentence}
                      onChange={(e) => setStudentSentence(e.target.value)}
                      placeholder="Write your own sentence following the template and patterns above..."
                      className="min-h-[100px]"
                    />
                    <Button 
                      onClick={handleGetFeedback}
                      disabled={isAnalyzing || !studentSentence.trim()}
                      className="w-full"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Get AI Feedback
                        </>
                      )}
                    </Button>
                    
                    {progressMessage && (
                      <div className="text-sm text-muted-foreground text-center animate-pulse">
                        {progressMessage}
                      </div>
                    )}
                  </div>

                  {/* Feedback Section */}
                  {feedbackData && (
                    <div className="space-y-4 p-4 bg-card rounded-lg border-2 border-primary/20">
                      <h4 className="font-semibold text-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-primary" />
                        AI Feedback
                      </h4>

                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                          <h5 className="font-medium text-sm mb-1 text-green-800 dark:text-green-400">Strengths</h5>
                          <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown>{feedbackData.strengths}</ReactMarkdown>
                          </div>
                        </div>

                        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                          <h5 className="font-medium text-sm mb-1 text-blue-800 dark:text-blue-400">Areas for Improvement</h5>
                          <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown>{feedbackData.improvements}</ReactMarkdown>
                          </div>
                        </div>

                        {feedbackData.revisedVersion && (
                          <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded border border-purple-200 dark:border-purple-800">
                            <h5 className="font-medium text-sm mb-1 text-purple-800 dark:text-purple-400">Suggested Revision</h5>
                            <div className="text-sm italic prose prose-sm max-w-none dark:prose-invert">
                              <ReactMarkdown>{feedbackData.revisedVersion}</ReactMarkdown>
                            </div>
                          </div>
                        )}

                        <div className="p-3 bg-muted/50 rounded border">
                          <h5 className="font-medium text-sm mb-1">Academic Register</h5>
                          <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown>{feedbackData.registerComment}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PhrasebankExercises;
