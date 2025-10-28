import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, Presentation, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LessonSection } from "@/components/LessonSection";
import { BulletPoint } from "@/components/BulletPoint";
import { ComprehensionCheck } from "@/components/ComprehensionCheck";
import { InteractiveTask } from "@/components/InteractiveTask";
import { DataVisualization } from "@/components/DataVisualization";

interface ComprehensionCheck {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface VisualizationData {
  type: "bar" | "line" | "pie";
  data: Array<{ label: string; value: number }>;
}

interface ProblemSection {
  keyPoints: string[];
  detailedContent: string;
  comprehensionCheck: ComprehensionCheck;
  visualizationData?: VisualizationData;
}

interface BehaviorsSection {
  items: string[];
  comprehensionCheck: ComprehensionCheck;
}

interface FrameworkSection {
  keyPoints: string[];
  detailedContent: string;
  comprehensionCheck: ComprehensionCheck;
  visualizationData?: VisualizationData;
}

interface Step {
  title: string;
  description: string;
}

interface HowItWorksSection {
  keyPoints: string[];
  detailedContent: string;
  steps: Step[];
  comprehensionCheck: ComprehensionCheck;
}

interface Activity {
  title: string;
  instructions: string;
  isInteractive: boolean;
}

interface PracticeSection {
  activities: Activity[];
  comprehensionCheck: ComprehensionCheck;
}

interface ReflectionSection {
  prompts: string[];
  comprehensionCheck: ComprehensionCheck;
}

interface LessonContent {
  problem: ProblemSection;
  commonBehaviors: BehaviorsSection;
  framework: FrameworkSection;
  howItWorks: HowItWorksSection;
  practice: PracticeSection;
  reflection: ReflectionSection;
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
  const [viewMode, setViewMode] = useState<"presentation" | "reading">("presentation");

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
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "presentation" ? "default" : "outline"}
              onClick={() => setViewMode("presentation")}
              size="sm"
            >
              <Presentation className="mr-2 h-4 w-4" />
              Presentation
            </Button>
            <Button
              variant={viewMode === "reading" ? "default" : "outline"}
              onClick={() => setViewMode("reading")}
              size="sm"
            >
              <FileText className="mr-2 h-4 w-4" />
              Reading
            </Button>
          </div>
        </div>

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
              {viewMode === "presentation" && content.problem?.keyPoints && (
                <ul className="space-y-4 mb-6">
                  {content.problem.keyPoints.map((point, index) => (
                    <BulletPoint key={index} icon="🎯">
                      {point}
                    </BulletPoint>
                  ))}
                </ul>
              )}
              {viewMode === "reading" && content.problem?.detailedContent && (
                <div className="prose prose-lg max-w-none mb-6">
                  {content.problem.detailedContent.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
              {content.problem?.visualizationData && (
                <div className="my-6">
                  <DataVisualization data={content.problem.visualizationData} />
                </div>
              )}
              {content.problem?.comprehensionCheck && (
                <ComprehensionCheck
                  question={content.problem.comprehensionCheck.question}
                  options={content.problem.comprehensionCheck.options}
                  correctAnswer={content.problem.comprehensionCheck.correctAnswer}
                />
              )}
            </LessonSection>
          </TabsContent>

          <TabsContent value="behaviors">
            <LessonSection title="Common Undesirable Behaviors">
              {content.commonBehaviors?.items && (
                <ul className="space-y-4 mb-6">
                  {content.commonBehaviors.items.map((behavior, index) => (
                    <BulletPoint key={index} icon="⚠️">
                      {behavior}
                    </BulletPoint>
                  ))}
                </ul>
              )}
              {content.commonBehaviors?.comprehensionCheck && (
                <ComprehensionCheck
                  question={content.commonBehaviors.comprehensionCheck.question}
                  options={content.commonBehaviors.comprehensionCheck.options}
                  correctAnswer={content.commonBehaviors.comprehensionCheck.correctAnswer}
                />
              )}
            </LessonSection>
          </TabsContent>

          <TabsContent value="framework">
            <LessonSection title="Theoretical Framework">
              {viewMode === "presentation" && content.framework?.keyPoints && (
                <ul className="space-y-4 mb-6">
                  {content.framework.keyPoints.map((point, index) => (
                    <BulletPoint key={index} icon="📚">
                      {point}
                    </BulletPoint>
                  ))}
                </ul>
              )}
              {viewMode === "reading" && content.framework?.detailedContent && (
                <div className="prose prose-lg max-w-none mb-6">
                  {content.framework.detailedContent.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
              {content.framework?.visualizationData && (
                <div className="my-6">
                  <DataVisualization data={content.framework.visualizationData} />
                </div>
              )}
              {content.framework?.comprehensionCheck && (
                <ComprehensionCheck
                  question={content.framework.comprehensionCheck.question}
                  options={content.framework.comprehensionCheck.options}
                  correctAnswer={content.framework.comprehensionCheck.correctAnswer}
                />
              )}
            </LessonSection>
          </TabsContent>

          <TabsContent value="demo">
            <LessonSection title="How It Works - Demonstration">
              {viewMode === "presentation" && content.howItWorks?.keyPoints && (
                <ul className="space-y-4 mb-6">
                  {content.howItWorks.keyPoints.map((point, index) => (
                    <BulletPoint key={index} icon="💡">
                      {point}
                    </BulletPoint>
                  ))}
                </ul>
              )}
              {viewMode === "reading" && content.howItWorks?.detailedContent && (
                <div className="prose prose-lg max-w-none mb-6">
                  {content.howItWorks.detailedContent.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
              {content.howItWorks?.steps && content.howItWorks.steps.length > 0 && (
                <div className="space-y-4 mb-6">
                  {content.howItWorks.steps.map((step, index) => (
                    <Card key={index} className="p-5 bg-accent/5">
                      <h4 className="font-bold text-foreground mb-2">
                        Step {index + 1}: {step.title}
                      </h4>
                      <p className="text-muted-foreground">{step.description}</p>
                    </Card>
                  ))}
                </div>
              )}
              {content.howItWorks?.comprehensionCheck && (
                <ComprehensionCheck
                  question={content.howItWorks.comprehensionCheck.question}
                  options={content.howItWorks.comprehensionCheck.options}
                  correctAnswer={content.howItWorks.comprehensionCheck.correctAnswer}
                />
              )}
            </LessonSection>
          </TabsContent>

          <TabsContent value="practice">
            <LessonSection title="Practice Activities">
              {content.practice?.activities && (
                <div className="space-y-6 mb-6">
                  {content.practice.activities.map((activity, index) => (
                    activity.isInteractive ? (
                      <InteractiveTask
                        key={index}
                        title={activity.title}
                        instructions={activity.instructions}
                        taskType="practice"
                      />
                    ) : (
                      <Card key={index} className="p-6 bg-accent/10">
                        <h3 className="text-xl font-bold text-foreground mb-3">
                          {activity.title}
                        </h3>
                        <p className="text-foreground leading-relaxed">{activity.instructions}</p>
                      </Card>
                    )
                  ))}
                </div>
              )}
              {content.practice?.comprehensionCheck && (
                <ComprehensionCheck
                  question={content.practice.comprehensionCheck.question}
                  options={content.practice.comprehensionCheck.options}
                  correctAnswer={content.practice.comprehensionCheck.correctAnswer}
                />
              )}
            </LessonSection>
          </TabsContent>

          <TabsContent value="reflection">
            <LessonSection title="Reflection & Feedback">
              <div className="space-y-8">
                {content.reflection?.prompts && (
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Reflection Prompts</h3>
                    <div className="space-y-4 mb-6">
                      {content.reflection.prompts.map((prompt, index) => (
                        <InteractiveTask
                          key={index}
                          title={`Reflection ${index + 1}`}
                          instructions={prompt}
                          taskType="reflection"
                        />
                      ))}
                    </div>
                  </div>
                )}
                {content.reflection?.comprehensionCheck && (
                  <ComprehensionCheck
                    question={content.reflection.comprehensionCheck.question}
                    options={content.reflection.comprehensionCheck.options}
                    correctAnswer={content.reflection.comprehensionCheck.correctAnswer}
                  />
                )}
                {content.feedback && (
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Teacher Feedback Guide</h3>
                    <Card className="p-6 bg-primary/5">
                      <p className="text-foreground leading-relaxed">{content.feedback}</p>
                    </Card>
                  </div>
                )}
              </div>
            </LessonSection>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LessonView;