import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Lesson1 = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("0");
  const [completedTabs, setCompletedTabs] = useState<Set<string>>(new Set());
  const [isSubmittingPrompt, setIsSubmittingPrompt] = useState(false);
  const [promptFeedback, setPromptFeedback] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const tabs = [
    { id: "0", label: "The Problem", completed: completedTabs.has("0") },
    { id: "1", label: "Common Behaviors", completed: completedTabs.has("1") },
    { id: "2", label: "The Framework", completed: completedTabs.has("2") },
    { id: "3", label: "How It Works", completed: completedTabs.has("3") },
    { id: "4", label: "Practice", completed: completedTabs.has("4") },
    { id: "5", label: "Reflection", completed: completedTabs.has("5") },
  ];

  const progress = Math.round((completedTabs.size / tabs.length) * 100);

  const handleTabComplete = (tabId: string) => {
    setCompletedTabs(prev => new Set(prev).add(tabId));
    toast({
      title: "Section Complete! ✅",
      description: "Great progress! Keep going.",
    });
  };

  const handlePromptSubmit = async (userInputs: Record<string, string>, systemPrompt: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('provide-feedback', {
        body: { 
          userInputs,
          systemPrompt
        }
      });

      if (error) throw error;
      
      handleTabComplete("4");
      return data.feedback;
    } catch (error) {
      console.error('Error getting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to get feedback. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleFollowUp = async (message: string, conversationHistory: any[], systemPrompt: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('provide-feedback', {
        body: { 
          userPrompt: message,
          conversationHistory,
          systemPrompt
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
    if (currentIndex < tabs.length - 1) {
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

  return (
    <div className="min-h-screen">
      <div className="container max-w-6xl mx-auto p-4 md:p-6">
        <LessonHeader 
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          progress={progress}
        />

        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        
        {/* Tab 0: The Problem */}
        {activeTab === "0" && (
          <LessonSection title="The Problem">
            <ul className="space-y-4 mb-8">
              <BulletPoint icon="🎯">
                Teachers need to create high-quality educational content quickly
              </BulletPoint>
              <BulletPoint icon="🤖">
                AI tools like ChatGPT can help, but generic prompts produce generic results
              </BulletPoint>
              <BulletPoint icon="📚">
                Educational content requires specific structure, tone, and pedagogical approach
              </BulletPoint>
              <BulletPoint icon="⚡">
                Without proper prompting, AI-generated content may not align with learning objectives
              </BulletPoint>
            </ul>

            <ComprehensionCheck
              lessonSlug="lesson-1"
              sectionId="tab-0"
              questionId="challenge-question"
              question="What is the main challenge teachers face when using AI tools?"
              options={[
                "AI tools are too expensive",
                "Generic prompts produce generic results that don't meet educational needs",
                "AI tools are difficult to access",
              ]}
            />

            <div className="space-y-4 mt-8">
              <CollapsibleSection title="Additional Reading: The AI Revolution in Education" icon="📚">
                <p className="mb-4 leading-relaxed">
                  As AI tools become more prevalent in education, teachers need to understand how to use them effectively. 
                  Generic prompts often produce content that doesn't align with specific learning objectives or student needs.
                </p>
                <p className="font-semibold mb-2">Key Points:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>AI can generate content in seconds, but quality depends on the prompt</li>
                  <li>Educational content requires specific structure, tone, and pedagogical approach</li>
                  <li>Teachers must learn to "speak the language" of AI to get desired results</li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Real-World Examples" icon="💡">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Example 1: Generic Prompt</p>
                    <p className="bg-destructive/10 p-3 rounded-lg my-2 border-l-4 border-destructive">
                      "Create a quiz about photosynthesis"
                    </p>
                    <p className="font-semibold">Result:</p>
                    <p>Too simple or too complex questions, no difficulty level specification</p>
                  </div>

                  <div>
                    <p className="font-semibold">Example 2: Better Prompt</p>
                    <p className="bg-success/10 p-3 rounded-lg my-2 border-l-4 border-success">
                      "Create a 10-question multiple-choice quiz about photosynthesis for undergraduate biology students. 
                      Questions should assess understanding of the light-dependent and light-independent reactions. 
                      Include varying difficulty levels."
                    </p>
                    <p className="font-semibold">Result:</p>
                    <p>Targeted, appropriate questions that match learning objectives</p>
                  </div>
                </div>
              </CollapsibleSection>
            </div>

            <div className="flex justify-between mt-8">
              <Button onClick={previousTab} disabled variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={nextTab} className="bg-gradient-to-r from-primary to-primary/80">
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </LessonSection>
        )}

        {/* Tab 1: Common Behaviors */}
        {activeTab === "1" && (
          <LessonSection title="Common Behaviors of Effective Prompts">
            <p className="leading-relaxed mb-6">
              Effective prompts share common characteristics that significantly improve the quality of AI-generated content.
              Understanding these behaviors can help you craft prompts that align with your educational goals.
            </p>

            <ul className="space-y-4 mb-8">
              <BulletPoint icon="✅">
                Context: Provide background information to guide the AI
              </BulletPoint>
              <BulletPoint icon="✅">
                Task: Clearly define the desired output
              </BulletPoint>
              <BulletPoint icon="✅">
                Constraints: Set boundaries to focus the AI's efforts
              </BulletPoint>
              <BulletPoint icon="✅">
                Examples: Show the AI what you want
              </BulletPoint>
            </ul>

            <ComprehensionCheck
              lessonSlug="lesson-1"
              sectionId="tab-1"
              questionId="effective-prompts-question"
              question="Which of the following is NOT a common behavior of effective prompts?"
              options={[
                "Providing context",
                "Using vague language",
                "Setting constraints",
              ]}
            />

            <div className="space-y-4 mt-8">
              <CollapsibleSection title="Additional Reading: The Power of Context" icon="📚">
                <p className="mb-4 leading-relaxed">
                  Context is the foundation of effective prompts. It provides the AI with the necessary background information
                  to understand your request and generate relevant content.
                </p>
                <p className="font-semibold mb-2">Key Points:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Context helps the AI understand the purpose of the prompt</li>
                  <li>It guides the AI toward the desired output</li>
                  <li>Without context, the AI may produce generic or irrelevant content</li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Real-World Examples" icon="💡">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Example 1: Lacking Context</p>
                    <p className="bg-destructive/10 p-3 rounded-lg my-2 border-l-4 border-destructive">
                      "Write a lesson plan"
                    </p>
                    <p className="font-semibold">Result:</p>
                    <p>Too generic, no specific subject or grade level</p>
                  </div>

                  <div>
                    <p className="font-semibold">Example 2: Providing Context</p>
                    <p className="bg-success/10 p-3 rounded-lg my-2 border-l-4 border-success">
                      "Write a lesson plan for a 5th-grade science class about the solar system"
                    </p>
                    <p className="font-semibold">Result:</p>
                    <p>Targeted, appropriate lesson plan for the specified subject and grade level</p>
                  </div>
                </div>
              </CollapsibleSection>
            </div>

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
        )}

        {/* Tab 2: The Framework */}
        {activeTab === "2" && (
          <LessonSection title="The AI Prompt Engineering Framework">
            <p className="leading-relaxed mb-6">
              The AI Prompt Engineering Framework provides a structured approach to crafting effective prompts.
              By following this framework, you can ensure that your prompts are clear, concise, and aligned with your educational objectives.
            </p>

            <ul className="space-y-4 mb-8">
              <BulletPoint icon="🧱">
                Context: Set the stage with background information
              </BulletPoint>
              <BulletPoint icon="🎯">
                Task: Define the specific action you want the AI to perform
              </BulletPoint>
              <BulletPoint icon="🚧">
                Constraints: Guide the AI with limitations and requirements
              </BulletPoint>
              <BulletPoint icon="🖼️">
                Examples: Provide sample outputs to demonstrate your expectations
              </BulletPoint>
            </ul>

            <ComprehensionCheck
              lessonSlug="lesson-1"
              sectionId="tab-2"
              questionId="framework-purpose-question"
              question="What is the purpose of the AI Prompt Engineering Framework?"
              options={[
                "To confuse the AI",
                "To provide a structured approach to crafting effective prompts",
                "To limit the AI's creativity",
              ]}
            />

            <div className="space-y-4 mt-8">
              <CollapsibleSection title="Additional Reading: The Importance of Structure" icon="📚">
                <p className="mb-4 leading-relaxed">
                  Structure is essential for effective prompts. It helps the AI understand your request and generate
                  content that meets your specific needs.
                </p>
                <p className="font-semibold mb-2">Key Points:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Structure provides clarity and focus</li>
                  <li>It helps the AI understand your expectations</li>
                  <li>Without structure, the AI may produce irrelevant or inconsistent content</li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Real-World Examples" icon="💡">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Example 1: Unstructured Prompt</p>
                    <p className="bg-destructive/10 p-3 rounded-lg my-2 border-l-4 border-destructive">
                      "Create a quiz about the Civil War"
                    </p>
                    <p className="font-semibold">Result:</p>
                    <p>Too broad, no specific grade level or learning objectives</p>
                  </div>

                  <div>
                    <p className="font-semibold">Example 2: Structured Prompt</p>
                    <p className="bg-success/10 p-3 rounded-lg my-2 border-l-4 border-success">
                      "Create a 10-question multiple-choice quiz about the Civil War for 8th-grade students.
                      Questions should assess understanding of the causes, major battles, and key figures of the war."
                    </p>
                    <p className="font-semibold">Result:</p>
                    <p>Targeted, appropriate quiz for the specified grade level and learning objectives</p>
                  </div>
                </div>
              </CollapsibleSection>
            </div>

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
        )}

        {/* Tab 3: How It Works */}
        {activeTab === "3" && (
          <LessonSection title="How the Framework Works">
            <p className="leading-relaxed mb-6">
              The AI Prompt Engineering Framework works by breaking down the prompt creation process into manageable steps.
              Each step focuses on a specific aspect of the prompt, ensuring that all necessary elements are included.
            </p>

            <ul className="space-y-4 mb-8">
              <BulletPoint icon="🔍">
                Analyze: Understand the desired outcome and target audience
              </BulletPoint>
              <BulletPoint icon="✍️">
                Construct: Build the prompt using the framework
              </BulletPoint>
              <BulletPoint icon="🧪">
                Test: Evaluate the AI-generated content
              </BulletPoint>
              <BulletPoint icon="🔄">
                Refine: Adjust the prompt based on the test results
              </BulletPoint>
            </ul>

            <ComprehensionCheck
              lessonSlug="lesson-1"
              sectionId="tab-3"
              questionId="first-step-question"
              question="What is the first step in the AI Prompt Engineering Framework?"
              options={[
                "Constructing the prompt",
                "Analyzing the desired outcome",
                "Testing the AI-generated content",
              ]}
            />

            <div className="space-y-4 mt-8">
              <CollapsibleSection title="Additional Reading: The Importance of Analysis" icon="📚">
                <p className="mb-4 leading-relaxed">
                  Analysis is the foundation of effective prompts. It helps you understand the desired outcome and
                  target audience, ensuring that your prompt is aligned with your educational objectives.
                </p>
                <p className="font-semibold mb-2">Key Points:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Analysis provides direction and focus</li>
                  <li>It helps you understand your audience's needs</li>
                  <li>Without analysis, your prompt may be misaligned with your goals</li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Real-World Examples" icon="💡">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Example 1: Lack of Analysis</p>
                    <p className="bg-destructive/10 p-3 rounded-lg my-2 border-l-4 border-destructive">
                      "Create a lesson about climate change"
                    </p>
                    <p className="font-semibold">Result:</p>
                    <p>Too vague, no specific grade level or learning objectives</p>
                  </div>

                  <div>
                    <p className="font-semibold">Example 2: Proper Analysis</p>
                    <p className="bg-success/10 p-3 rounded-lg my-2 border-l-4 border-success">
                      "Create a lesson about climate change for high school students.
                      The lesson should cover the causes, effects, and potential solutions to climate change."
                    </p>
                    <p className="font-semibold">Result:</p>
                    <p>Targeted, appropriate lesson for the specified grade level and learning objectives</p>
                  </div>
                </div>
              </CollapsibleSection>
            </div>

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
        )}

        {/* Tab 4: Practice */}
        {activeTab === "4" && (
          <LessonSection title="Practice: Build Your Own Prompt">
            <p className="leading-relaxed mb-6">
              Now it's your turn to put the AI Prompt Engineering Framework into practice.
              Use the prompt builder below to create your own prompt for generating educational content.
            </p>

            <PromptBuilder 
              practiceFields={[
                { label: "Context", placeholder: "Define the role and audience...", type: "textarea" },
                { label: "Task", placeholder: "Specify what AI should create...", type: "textarea" },
                { label: "Constraints", placeholder: "Define limitations and requirements...", type: "textarea" },
                { label: "Examples", placeholder: "Show desired format or style...", type: "textarea" }
              ]}
              systemPrompt="You are an expert educator providing feedback on AI prompts for educational content generation. Evaluate the prompt based on: 1) Clarity of context, 2) Specificity of task, 3) Appropriate constraints, 4) Quality of examples. Provide constructive feedback with specific suggestions for improvement."
              onSubmit={handlePromptSubmit}
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
        )}

        {/* Tab 5: Reflection & Feedback */}
        {activeTab === "5" && (
          <LessonSection title="Reflection & Next Steps">
            <div className="space-y-8">
              <div className="bg-accent/50 p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-4">🎓 Congratulations!</h3>
                <p className="leading-relaxed mb-4">
                  You've completed the fundamentals of AI-assisted prompt engineering for educators. 
                  You now have the tools to create effective prompts that generate high-quality educational content.
                </p>
              </div>

              <div className="bg-card p-6 rounded-xl border-2 border-primary/20">
                <h3 className="font-bold text-xl mb-4">📋 What You've Learned</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">1️⃣</span>
                    <div>
                      <p className="font-semibold">The Problem</p>
                      <p className="text-muted-foreground text-sm">Identified why generic prompts produce generic results and the need for structured approaches</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">2️⃣</span>
                    <div>
                      <p className="font-semibold">Common Behaviors</p>
                      <p className="text-muted-foreground text-sm">Discovered the four key elements: Context, Task, Constraints, and Examples</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">3️⃣</span>
                    <div>
                      <p className="font-semibold">The Framework</p>
                      <p className="text-muted-foreground text-sm">Learned the structured approach to building effective AI prompts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">4️⃣</span>
                    <div>
                      <p className="font-semibold">How It Works</p>
                      <p className="text-muted-foreground text-sm">Explored the analyze, construct, test, and refine process</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">5️⃣</span>
                    <div>
                      <p className="font-semibold">Practice</p>
                      <p className="text-muted-foreground text-sm">Applied the framework hands-on with the Prompt Builder tool</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded-xl border-l-4 border-primary">
                <h3 className="font-bold text-lg mb-3">Key Takeaways:</h3>
                <ul className="space-y-2">
                  <BulletPoint icon="✅">Context provides the foundation for quality AI output</BulletPoint>
                  <BulletPoint icon="✅">Specific tasks produce better results than vague requests</BulletPoint>
                  <BulletPoint icon="✅">Constraints guide AI toward your educational goals</BulletPoint>
                  <BulletPoint icon="✅">Examples demonstrate your desired output format</BulletPoint>
                </ul>
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
        )}
      </div>
    </div>
  );
};

export default Lesson1;
