import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Sparkles } from "lucide-react";
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

  const handleGetExamples = () => {
    if (!selectedCategory) return;

    const categoryData = phrasebankData[selectedCategory as keyof typeof phrasebankData];
    if (!categoryData) return;

    let allExamples: string[] = [];

    if (selectedSubcategory === "__all__") {
      // Get all examples from all subcategories
      Object.values(categoryData).forEach((phrases) => {
        if (Array.isArray(phrases)) {
          allExamples = [...allExamples, ...phrases];
        }
      });
    } else {
      // Get examples from selected subcategory
      const subcategoryData = categoryData[selectedSubcategory as keyof typeof categoryData];
      if (Array.isArray(subcategoryData)) {
        allExamples = subcategoryData;
      }
    }

    setExamples(allExamples);
    setShowExamples(true);
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
                      size="lg"
                      className="w-full"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Get Examples
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {showExamples && examples.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedCategory}
                    {selectedSubcategory !== "__all__" && ` - ${selectedSubcategory}`}
                  </CardTitle>
                  <CardDescription>
                    {examples.length} phrase{examples.length !== 1 ? 's' : ''} found
                    {discipline && discipline !== "none" && ` (${discipline})`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {examples.map((example, idx) => (
                      <div 
                        key={idx}
                        className="p-4 bg-muted/50 rounded-lg border hover:border-primary/50 transition-colors"
                      >
                        <p className="text-sm leading-relaxed">{example}</p>
                      </div>
                    ))}
                  </div>
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
