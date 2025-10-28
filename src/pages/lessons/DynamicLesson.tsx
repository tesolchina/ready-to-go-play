import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LessonSection {
  title: string;
  content: string;
  type: "content" | "demo" | "practice" | "reflection";
}

interface LessonContent {
  title: string;
  subject: string;
  grade_level: string;
  learning_objectives: string;
  sections: LessonSection[];
}

const DynamicLesson = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) {
        toast({
          title: "Error",
          description: "No lesson ID provided",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      try {
        const supabaseAny = supabase as any;
        const { data, error } = await supabaseAny
          .from('lessons')
          .select('*')
          .eq('id', lessonId)
          .single();

        if (error) throw error;

        if (!data) {
          toast({
            title: "Lesson not found",
            description: "The requested lesson could not be found",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        setLesson(data.generated_content);
      } catch (error) {
        console.error("Error fetching lesson:", error);
        toast({
          title: "Error",
          description: "Failed to load lesson",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return null;
  }

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

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{lesson.title}</h1>
          <div className="flex gap-3 flex-wrap mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {lesson.subject}
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {lesson.grade_level}
            </span>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{lesson.learning_objectives}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {lesson.sections?.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {section.title}
                </CardTitle>
                {section.type && (
                  <CardDescription className="capitalize">{section.type}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="whitespace-pre-wrap">{section.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DynamicLesson;
