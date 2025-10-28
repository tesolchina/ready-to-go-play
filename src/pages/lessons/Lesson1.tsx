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
import { QuizSection } from "@/components/QuizSection";
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
    { id: "5", label: "Final Quiz", completed: completedTabs.has("5") },
    { id: "6", label: "Reflection", completed: completedTabs.has("6") },
  ];

  const progress = Math.round((completedTabs.size / tabs.length) * 100);

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
              question="What is the main challenge teachers face when using AI tools?"
              options={[
                { text: "AI tools are too expensive", correct: false },
                { text: "Generic prompts produce generic results that don't meet educational needs", correct: true },
                { text: "AI tools are difficult to access", correct: false },
              ]}
              onComplete={() => handleTabComplete("0")}
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
              question="Which of the following is NOT a common behavior of effective prompts?"
              options={[
                { text: "Providing context", correct: false },
                { text: "Using vague language", correct: true },
                { text: "Setting constraints", correct: false },
              ]}
              onComplete={() => handleTabComplete("1")}
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
              question="What is the purpose of the AI Prompt Engineering Framework?"
              options={[
                { text: "To confuse the AI", correct: false },
                { text: "To provide a structured approach to crafting effective prompts", correct: true },
                { text: "To limit the AI's creativity", correct: false },
              ]}
              onComplete={() => handleTabComplete("2")}
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
              question="What is the first step in the AI Prompt Engineering Framework?"
              options={[
                { text: "Constructing the prompt", correct: false },
                { text: "Analyzing the desired outcome", correct: true },
                { text: "Testing the AI-generated content", correct: false },
              ]}
              onComplete={() => handleTabComplete("3")}
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

            <PromptBuilder onSubmit={handlePromptSubmit} isSubmitting={isSubmittingPrompt} feedback={promptFeedback} onFollowUp={handleFollowUp} />

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

        {/* Tab 5: Final Quiz */}
        {activeTab === "5" && (
          <LessonSection title="Final Quiz: Test Your Knowledge">
            <p className="leading-relaxed mb-6">
              Test your knowledge of the AI Prompt Engineering Framework with this final quiz.
              Answer the questions below to assess your understanding of the key concepts and principles.
            </p>

            <QuizSection
              questions={[
                {
                  question: "What is the first step in the AI Prompt Engineering Framework?",
                  options: [
                    "Constructing the prompt",
                    "Analyzing the desired outcome",
                    "Testing the AI-generated content",
                  ],
                  correctIndex: 1,
                },
                {
                  question: "Which of the following is NOT a common behavior of effective prompts?",
                  options: [
                    "Providing context",
                    "Using vague language",
                    "Setting constraints",
                  ],
                  correctIndex: 1,
                },
                {
                  question: "What is the purpose of the AI Prompt Engineering Framework?",
                  options: [
                    "To confuse the AI",
                    "To provide a structured approach to crafting effective prompts",
                    "To limit the AI's creativity",
                  ],
                  correctIndex: 1,
                },
              ]}
              onComplete={() => handleTabComplete("5")}
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

        {/* Tab 6: Reflection */}
        {activeTab === "6" && (
          <LessonSection title="Reflection & Next Steps">
            <div className="space-y-6">
              <div className="bg-accent/50 p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-4">🎓 Congratulations!</h3>
                <p className="leading-relaxed mb-4">
                  You've completed the fundamentals of AI-assisted prompt engineering for educators. 
                  You now have the tools to create effective prompts that generate high-quality educational content.
                </p>
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

              <div className="bg-accent/30 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3">Next Steps:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-xl mt-1">📝</span>
                    <div>
                      <span className="font-semibold">Practice regularly:</span> Apply these techniques to your daily teaching tasks
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl mt-1">🔄</span>
                    <div>
                      <span className="font-semibold">Iterate and refine:</span> Don't accept the first output—refine your prompts
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl mt-1">🤝</span>
                    <div>
                      <span className="font-semibold">Share with colleagues:</span> Build a community of practice
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl mt-1">📚</span>
                    <div>
                      <span className="font-semibold">Keep learning:</span> AI tools are constantly evolving
                    </div>
                  </li>
                </ul>
              </div>

              <Button 
                onClick={() => handleTabComplete("6")}
                className="w-full bg-gradient-to-r from-primary to-primary/80 text-lg py-6"
              >
                Complete Lesson 🎉
              </Button>
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
