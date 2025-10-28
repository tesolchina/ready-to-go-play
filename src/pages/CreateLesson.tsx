import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateLesson = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    gradeLevel: "",
    learningObjectives: "",
    studentContext: "",
    challenges: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Generate lesson content using AI
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke("generate-lesson", {
        body: formData,
      });

      if (aiError) throw aiError;

      // Save lesson to database
      const { data: lesson, error: dbError } = await supabase
        .from("lessons")
        .insert({
          teacher_id: user.id,
          title: formData.title,
          subject: formData.subject,
          grade_level: formData.gradeLevel,
          learning_objectives: formData.learningObjectives,
          student_context: formData.studentContext,
          challenges: formData.challenges,
          generated_content: aiResponse.generatedContent,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast({
        title: "Success!",
        description: "Your lesson has been generated",
      });

      navigate(`/lesson/${lesson.id}`);
    } catch (error: any) {
      console.error("Error creating lesson:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate lesson",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container max-w-4xl mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              Create New Lesson
            </CardTitle>
            <CardDescription>
              Fill in the details below and AI will generate a comprehensive lesson plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Lesson Title *</Label>
                <Input
                  id="title"
                  required
                  placeholder="e.g., Introduction to Photosynthesis"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    required
                    placeholder="e.g., Biology"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gradeLevel">Grade Level *</Label>
                  <Input
                    id="gradeLevel"
                    required
                    placeholder="e.g., Grade 7"
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="learningObjectives">Learning Objectives *</Label>
                <Textarea
                  id="learningObjectives"
                  required
                  placeholder="What should students learn from this lesson? List key objectives..."
                  className="min-h-24"
                  value={formData.learningObjectives}
                  onChange={(e) => setFormData({ ...formData, learningObjectives: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentContext">Student Context (Optional)</Label>
                <Textarea
                  id="studentContext"
                  placeholder="Describe your students' background, prior knowledge, or special considerations..."
                  className="min-h-24"
                  value={formData.studentContext}
                  onChange={(e) => setFormData({ ...formData, studentContext: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenges">Specific Challenges (Optional)</Label>
                <Textarea
                  id="challenges"
                  placeholder="Any specific challenges or misconceptions you want to address?"
                  className="min-h-24"
                  value={formData.challenges}
                  onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Generating Lesson...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Lesson with AI
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateLesson;