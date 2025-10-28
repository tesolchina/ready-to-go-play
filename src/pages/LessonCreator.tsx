import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LessonData {
  problem: string;
  audience: string;
  undesirableSolutions: string;
  framework: string;
  howItWorks: string;
  practice: string;
  reflection: string;
}

const LessonCreator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inputMethod, setInputMethod] = useState<"manual" | "upload">("manual");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lessonData, setLessonData] = useState<LessonData>({
    problem: "",
    audience: "",
    undesirableSolutions: "",
    framework: "",
    howItWorks: "",
    practice: "",
    reflection: "",
  });

  const handleInputChange = (field: keyof LessonData, value: string) => {
    setLessonData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Call edge function to process document
      const { data, error } = await supabase.functions.invoke("extract-lesson-content", {
        body: formData,
      });

      if (error) throw error;

      setLessonData(data);
      toast({
        title: "Document processed",
        description: "AI has extracted the lesson content. Please review and edit as needed.",
      });
    } catch (error) {
      console.error("Error processing document:", error);
      toast({
        title: "Error",
        description: "Failed to process document. Please try manual input.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    // Validate that all fields are filled
    const emptyFields = Object.entries(lessonData).filter(([_, value]) => !value.trim());
    if (emptyFields.length > 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields before generating the lesson.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Call edge function to generate lesson
      const { data, error } = await supabase.functions.invoke("generate-lesson", {
        body: lessonData,
      });

      if (error) throw error;

      toast({
        title: "Lesson created!",
        description: "Your custom lesson has been generated successfully.",
      });

      // Navigate to the new lesson (you'll need to implement dynamic lesson routing)
      navigate(`/lesson/${data.lessonId}`);
    } catch (error) {
      console.error("Error generating lesson:", error);
      toast({
        title: "Error",
        description: "Failed to generate lesson. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Create Your Lesson</CardTitle>
            <CardDescription>
              Answer the following questions to create a custom educational lesson
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={inputMethod} onValueChange={(v) => setInputMethod(v as "manual" | "upload")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="manual">Manual Input</TabsTrigger>
                <TabsTrigger value="upload">Upload Document</TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="problem">What is the problem to solve and in what context?</Label>
                  <Textarea
                    id="problem"
                    placeholder="Describe the problem and context..."
                    value={lessonData.problem}
                    onChange={(e) => handleInputChange("problem", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">Who are the audience and learners?</Label>
                  <Textarea
                    id="audience"
                    placeholder="Describe your target audience..."
                    value={lessonData.audience}
                    onChange={(e) => handleInputChange("audience", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="undesirableSolutions">What are the common undesirable solutions or behaviors?</Label>
                  <Textarea
                    id="undesirableSolutions"
                    placeholder="Describe common mistakes or ineffective approaches..."
                    value={lessonData.undesirableSolutions}
                    onChange={(e) => handleInputChange("undesirableSolutions", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="framework">What is the framework for the new solution?</Label>
                  <Textarea
                    id="framework"
                    placeholder="Describe the framework or key concepts..."
                    value={lessonData.framework}
                    onChange={(e) => handleInputChange("framework", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="howItWorks">How it works - step by step demo</Label>
                  <Textarea
                    id="howItWorks"
                    placeholder="Provide a step-by-step demonstration..."
                    value={lessonData.howItWorks}
                    onChange={(e) => handleInputChange("howItWorks", e.target.value)}
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="practice">How should students practice?</Label>
                  <Textarea
                    id="practice"
                    placeholder="Describe practice activities or exercises..."
                    value={lessonData.practice}
                    onChange={(e) => handleInputChange("practice", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reflection">How should students reflect?</Label>
                  <Textarea
                    id="reflection"
                    placeholder="Describe reflection prompts or questions..."
                    value={lessonData.reflection}
                    onChange={(e) => handleInputChange("reflection", e.target.value)}
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="upload" className="space-y-6">
                <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-sm text-muted-foreground mb-2">
                      Upload a Word document or PDF containing your lesson content
                    </div>
                    <Button variant="secondary" className="mt-2" asChild>
                      <span>Choose File</span>
                    </Button>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".doc,.docx,.pdf"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isProcessing}
                    />
                  </Label>
                </div>

                {isProcessing && (
                  <div className="text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin mb-2" />
                    Processing document...
                  </div>
                )}

                {Object.values(lessonData).some(v => v) && !isProcessing && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      AI has extracted the following content. Please review and edit as needed:
                    </p>
                    
                    {lessonData.problem && (
                      <div className="space-y-2">
                        <Label htmlFor="problem-edit">Problem & Context</Label>
                        <Textarea
                          id="problem-edit"
                          value={lessonData.problem}
                          onChange={(e) => handleInputChange("problem", e.target.value)}
                          rows={4}
                        />
                      </div>
                    )}

                    {lessonData.audience && (
                      <div className="space-y-2">
                        <Label htmlFor="audience-edit">Audience & Learners</Label>
                        <Textarea
                          id="audience-edit"
                          value={lessonData.audience}
                          onChange={(e) => handleInputChange("audience", e.target.value)}
                          rows={3}
                        />
                      </div>
                    )}

                    {lessonData.undesirableSolutions && (
                      <div className="space-y-2">
                        <Label htmlFor="undesirable-edit">Undesirable Solutions</Label>
                        <Textarea
                          id="undesirable-edit"
                          value={lessonData.undesirableSolutions}
                          onChange={(e) => handleInputChange("undesirableSolutions", e.target.value)}
                          rows={4}
                        />
                      </div>
                    )}

                    {lessonData.framework && (
                      <div className="space-y-2">
                        <Label htmlFor="framework-edit">Framework</Label>
                        <Textarea
                          id="framework-edit"
                          value={lessonData.framework}
                          onChange={(e) => handleInputChange("framework", e.target.value)}
                          rows={4}
                        />
                      </div>
                    )}

                    {lessonData.howItWorks && (
                      <div className="space-y-2">
                        <Label htmlFor="howitworks-edit">How It Works</Label>
                        <Textarea
                          id="howitworks-edit"
                          value={lessonData.howItWorks}
                          onChange={(e) => handleInputChange("howItWorks", e.target.value)}
                          rows={5}
                        />
                      </div>
                    )}

                    {lessonData.practice && (
                      <div className="space-y-2">
                        <Label htmlFor="practice-edit">Practice</Label>
                        <Textarea
                          id="practice-edit"
                          value={lessonData.practice}
                          onChange={(e) => handleInputChange("practice", e.target.value)}
                          rows={4}
                        />
                      </div>
                    )}

                    {lessonData.reflection && (
                      <div className="space-y-2">
                        <Label htmlFor="reflection-edit">Reflection</Label>
                        <Textarea
                          id="reflection-edit"
                          value={lessonData.reflection}
                          onChange={(e) => handleInputChange("reflection", e.target.value)}
                          rows={4}
                        />
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={isProcessing}
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Lesson...
                  </>
                ) : (
                  "Generate Lesson"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LessonCreator;
