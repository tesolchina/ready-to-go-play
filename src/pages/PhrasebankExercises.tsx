import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [discipline, setDiscipline] = useState<string>("");

  const categories = categoryType === "moves" ? MOVES_STEPS : GENERAL_LANGUAGE_FUNCTIONS;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-8 bg-background">
          <div className="max-w-6xl mx-auto space-y-8">
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
                  Choose the type of academic writing, specific category, and your discipline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Category Type Selector */}
                  <div className="space-y-2">
                    <Label htmlFor="category-type">Category Type</Label>
                    <Select
                      value={categoryType}
                      onValueChange={(value) => {
                        setCategoryType(value as "moves" | "general");
                        setSelectedCategory(""); // Reset category when type changes
                      }}
                    >
                      <SelectTrigger id="category-type" className="bg-background">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="moves">Moves/Steps</SelectItem>
                        <SelectItem value="general">General Functions</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      {categoryType === "moves" 
                        ? "Research paper structure and sections"
                        : "General academic language functions"}
                    </p>
                  </div>

                  {/* Specific Category Selector */}
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      {categoryType === "moves" ? "Move/Step" : "Language Function"}
                    </Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
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
                        <SelectItem value="none">All Disciplines</SelectItem>
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
                </div>
              </CardContent>
            </Card>

            {selectedCategory && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {categoryType === "moves" ? "Move: " : "Function: "}
                    {selectedCategory}
                  </CardTitle>
                  <CardDescription>
                    {discipline && discipline !== "none" 
                      ? `Examples and exercises for ${discipline}`
                      : "General academic examples and exercises"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Exercises and examples will be displayed here based on your selections.
                    </p>
                    
                    <div className="bg-muted/50 p-6 rounded-lg border-2 border-dashed">
                      <h3 className="font-semibold mb-3">Selected Configuration:</h3>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <span className="font-medium">Type:</span>{" "}
                          {categoryType === "moves" ? "Moves/Steps" : "General Functions"}
                        </li>
                        <li>
                          <span className="font-medium">Category:</span> {selectedCategory}
                        </li>
                        <li>
                          <span className="font-medium">Discipline:</span>{" "}
                          {discipline && discipline !== "none" ? discipline : "All Disciplines"}
                        </li>
                      </ul>
                    </div>
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
