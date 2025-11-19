import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-8 bg-background">
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
                          className="p-4 bg-muted/50 rounded-lg border hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                              {idx + 1}
                            </span>
                            <p className="text-sm leading-relaxed flex-1">{example}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No examples generated yet
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PhrasebankExercises;
