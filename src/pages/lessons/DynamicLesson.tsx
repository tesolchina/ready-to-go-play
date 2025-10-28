import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LessonHeader } from "@/components/LessonHeader";
import { TabNavigation } from "@/components/TabNavigation";
import { LessonSection } from "@/components/LessonSection";
import { BulletPoint } from "@/components/BulletPoint";
import { ComprehensionCheck } from "@/components/ComprehensionCheck";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { PromptBuilder } from "@/components/PromptBuilder";
import { FeedbackForm } from "@/components/FeedbackForm";

interface BulletPoint {
  icon: string;
  text: string;
}

interface ComprehensionCheckData {
  question: string;
  options: { text: string; correct: boolean }[];
}

interface AdditionalSection {
  title: string;
  icon: string;
  content: string;
}

interface LessonTab {
  id: string;
  label: string;
  title: string;
  intro?: string;
  bulletPoints?: BulletPoint[];
  comprehensionCheck?: ComprehensionCheckData;
  additionalSections?: AdditionalSection[];
}

interface LessonContent {
  title: string;
  subject: string;
  grade_level: string;
  learning_objectives: string;
  tabs: LessonTab[];
}

const DynamicLesson = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("0");
  const [completedTabs, setCompletedTabs] = useState<Set<string>>(new Set());
  const [isSubmittingPrompt, setIsSubmittingPrompt] = useState(false);
  const [promptFeedback, setPromptFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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

  const handleTabComplete = (tabId: string) => {
    setCompletedTabs(prev => new Set(prev).add(tabId));
    toast({
      title: "Section Complete! ✅",
      description: "Great progress! Keep going.",
    });
  };

  const handlePromptSubmit = async (prompt: string) => {
    setIsSubmittingPrompt(true);
    setPromptFeedback(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('provide-feedback', {
        body: { userPrompt: prompt }
      });

      if (error) throw error;

      setPromptFeedback(data.feedback);
      toast({
        title: "Feedback Received!",
        description: "AI has analyzed your prompt and provided feedback below.",
      });
      
      handleTabComplete("4");
    } catch (error) {
      console.error('Error getting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to get AI feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingPrompt(false);
    }
  };

  const handleFollowUp = async (message: string, conversationHistory: any[]) => {
    try {
      const { data, error } = await supabase.functions.invoke('provide-feedback', {
        body: { 
          userPrompt: message,
          conversationHistory 
        }
      });

      if (error) throw error;
      return data.feedback;
    } catch (error) {
      console.error('Error in follow-up:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response",
        variant: "destructive",
      });
      throw error;
    }
  };

  const nextTab = () => {
    const currentIndex = parseInt(activeTab);
    if (lesson && currentIndex < lesson.tabs.length - 1) {
      setActiveTab(String(currentIndex + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const previousTab = () => {
    const currentIndex = parseInt(activeTab);
    if (currentIndex > 0) {
      setActiveTab(String(currentIndex - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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

  // Handle legacy lesson format (with sections instead of tabs)
  if (!lesson.tabs || !Array.isArray(lesson.tabs)) {
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

          <div className="bg-card rounded-2xl p-8 shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Legacy Lesson Format</h2>
            <p className="text-muted-foreground mb-6">
              This lesson was created with an older format. Please create a new lesson using the Lesson Creator to experience the full interactive features including:
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span>6 structured tabs with guided learning</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span>Interactive comprehension checks</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span>AI-powered practice exercises</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span>Reflection and feedback tools</span>
              </li>
            </ul>
            <Button onClick={() => navigate("/lesson-creator")} className="bg-gradient-to-r from-primary to-primary/80">
              Create New Lesson
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = lesson.tabs.map(tab => ({
    id: tab.id,
    label: tab.label,
    completed: completedTabs.has(tab.id)
  }));

  const progress = Math.round((completedTabs.size / tabs.length) * 100);

  return (
    <div className="min-h-screen">
      <div className="container max-w-6xl mx-auto p-4 md:p-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <LessonHeader 
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          progress={progress}
          title={lesson.title}
          subtitle={`${lesson.subject} • ${lesson.grade_level}`}
        />

        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {lesson.tabs.map((tab, index) => {
          if (activeTab !== tab.id) return null;

          // Tabs 0-3: Standard content tabs
          if (parseInt(tab.id) <= 3) {
            return (
              <LessonSection key={tab.id} title={tab.title}>
                {tab.intro && (
                  <p className="leading-relaxed mb-6">{tab.intro}</p>
                )}

                {tab.bulletPoints && tab.bulletPoints.length > 0 && (
                  <ul className="space-y-4 mb-8">
                    {tab.bulletPoints.map((bullet, i) => (
                      <BulletPoint key={i} icon={bullet.icon}>
                        {bullet.text}
                      </BulletPoint>
                    ))}
                  </ul>
                )}

                {tab.comprehensionCheck && (
                  <ComprehensionCheck
                    question={tab.comprehensionCheck.question}
                    options={tab.comprehensionCheck.options}
                    onComplete={() => handleTabComplete(tab.id)}
                  />
                )}

                {tab.additionalSections && tab.additionalSections.length > 0 && (
                  <div className="space-y-4 mt-8">
                    {tab.additionalSections.map((section, i) => (
                      <CollapsibleSection key={i} title={section.title} icon={section.icon}>
                        <div className="whitespace-pre-wrap">{section.content}</div>
                      </CollapsibleSection>
                    ))}
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <Button 
                    onClick={previousTab} 
                    disabled={parseInt(tab.id) === 0}
                    variant={parseInt(tab.id) === 0 ? "outline" : "default"}
                    className={parseInt(tab.id) > 0 ? "bg-gradient-to-r from-primary to-primary/80" : ""}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button 
                    onClick={nextTab} 
                    className="bg-gradient-to-r from-primary to-primary/80"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </LessonSection>
            );
          }

          // Tab 4: Practice
          if (parseInt(tab.id) === 4) {
            return (
              <LessonSection key={tab.id} title={tab.title}>
                {tab.intro && (
                  <p className="leading-relaxed mb-6">{tab.intro}</p>
                )}

                <PromptBuilder 
                  onSubmit={handlePromptSubmit} 
                  isSubmitting={isSubmittingPrompt} 
                  feedback={promptFeedback} 
                  onFollowUp={handleFollowUp} 
                />

                <div className="flex justify-between mt-8">
                  <Button onClick={previousTab} className="bg-gradient-to-r from-primary to-primary/80">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button onClick={nextTab} className="bg-gradient-to-r from-primary to-primary/80">
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </LessonSection>
            );
          }

          // Tab 5: Reflection
          if (parseInt(tab.id) === 5) {
            return (
              <LessonSection key={tab.id} title={tab.title}>
                <div className="space-y-8">
                  {tab.intro && (
                    <div className="bg-accent/50 p-6 rounded-xl">
                      <h3 className="font-bold text-xl mb-4">🎓 Congratulations!</h3>
                      <p className="leading-relaxed">{tab.intro}</p>
                    </div>
                  )}

                  <div className="bg-card p-6 rounded-xl border-2 border-primary/20">
                    <h3 className="font-bold text-xl mb-4">📋 What You've Learned</h3>
                    <div className="space-y-3">
                      {lesson.tabs.slice(0, 5).map((t, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-2xl">{['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'][i]}</span>
                          <div>
                            <p className="font-semibold">{t.label}</p>
                            <p className="text-muted-foreground text-sm">{t.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl mb-4">💭 Your Feedback Matters</h3>
                    <FeedbackForm onComplete={() => handleTabComplete("5")} />
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button onClick={previousTab} variant="outline">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button onClick={nextTab} disabled variant="outline">
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </LessonSection>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default DynamicLesson;
