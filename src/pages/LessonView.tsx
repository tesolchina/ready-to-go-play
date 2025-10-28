import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LessonSection } from "@/components/LessonSection";
import { BulletPoint } from "@/components/BulletPoint";

interface PracticeActivity {
  title?: string;
  instructions?: string;
}

interface LessonContent {
  problem: string;
  commonBehaviors: string[];
  framework: string;
  howItWorks: string;
  practice: (string | PracticeActivity)[];
  reflection: string[];
  feedback: string;
}

interface Lesson {
  id: string;
  title: string;
  subject: string;
  grade_level: string;
  generated_content: LessonContent;
}

const LessonView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLesson();
  }, [id]);

  const fetchLesson = async () => {
    try {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setLesson(data as unknown as Lesson);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      toast({
        title: "Error",
        description: "Failed to load lesson",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lesson) return null;

  const content = lesson.generated_content;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container max-w-6xl mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="p-8 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{lesson.title}</h1>
              <p className="text-lg text-muted-foreground">
                {lesson.subject} • {lesson.grade_level}
              </p>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="problem" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="problem">Problem</TabsTrigger>
            <TabsTrigger value="behaviors">Behaviors</TabsTrigger>
            <TabsTrigger value="framework">Framework</TabsTrigger>
            <TabsTrigger value="demo">Demo</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
            <TabsTrigger value="reflection">Reflection</TabsTrigger>
          </TabsList>

          <TabsContent value="problem">
            <LessonSection title="The Problem">
              <p className="text-lg text-foreground leading-relaxed">{content.problem}</p>
            </LessonSection>
          </TabsContent>

          <TabsContent value="behaviors">
            <LessonSection title="Common Undesirable Behaviors">
              <ul className="space-y-4">
                {content.commonBehaviors.map((behavior, index) => (
                  <BulletPoint key={index} icon="⚠️">
                    {behavior}
                  </BulletPoint>
                ))}
              </ul>
            </LessonSection>
          </TabsContent>

          <TabsContent value="framework">
            <LessonSection title="Theoretical Framework">
              <div className="prose prose-lg max-w-none">
                {content.framework.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </LessonSection>
          </TabsContent>

          <TabsContent value="demo">
            <LessonSection title="How It Works - Demonstration">
              <div className="prose prose-lg max-w-none">
                {content.howItWorks.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </LessonSection>
          </TabsContent>

          <TabsContent value="practice">
            <LessonSection title="Practice Activities">
              <div className="space-y-6">
                {content.practice.map((activity, index) => {
                  const isObject = typeof activity === 'object' && activity !== null;
                  const title = isObject && 'title' in activity ? activity.title : `Activity ${index + 1}`;
                  const instructions = isObject && 'instructions' in activity ? activity.instructions : String(activity);
                  
                  return (
                    <Card key={index} className="p-6 bg-accent/10">
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        {title}
                      </h3>
                      <p className="text-foreground leading-relaxed">{instructions}</p>
                    </Card>
                  );
                })}
              </div>
            </LessonSection>
          </TabsContent>

          <TabsContent value="reflection">
            <LessonSection title="Reflection & Feedback">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Reflection Prompts</h3>
                  <ul className="space-y-4">
                    {content.reflection.map((prompt, index) => (
                      <BulletPoint key={index} icon="💭">
                        {prompt}
                      </BulletPoint>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Teacher Feedback Guide</h3>
                  <Card className="p-6 bg-primary/5">
                    <p className="text-foreground leading-relaxed">{content.feedback}</p>
                  </Card>
                </div>
              </div>
            </LessonSection>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LessonView;