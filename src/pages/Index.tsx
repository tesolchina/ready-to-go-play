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

const Index = () => {
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
      
      // Mark practice as complete after receiving feedback
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
          <LessonSection title="Common (Undesirable) Behaviors">
            <ul className="space-y-4 mb-8">
              <BulletPoint icon="📝">Using generic prompts without customization</BulletPoint>
              <BulletPoint icon="❌">Not specifying target audience or learning objectives</BulletPoint>
              <BulletPoint icon="🔄">Accepting first AI output without refinement</BulletPoint>
              <BulletPoint icon="🎯">Ignoring subject-specific requirements</BulletPoint>
              <BulletPoint icon="🧪">Not testing prompts before classroom use</BulletPoint>
            </ul>

            <ComprehensionCheck
              question="What is one of the most common mistakes teachers make with AI prompts?"
              options={[
                { text: "Using generic prompts without customization", correct: true },
                { text: "Using too many technical terms", correct: false },
                { text: "Making prompts too short", correct: false },
              ]}
              onComplete={() => handleTabComplete("1")}
            />

            <div className="space-y-4 mt-8">
              <CollapsibleSection title="Why Generic Prompts Fail" icon="📚">
                <p className="mb-4">
                  Generic prompts often produce content that doesn't meet educational standards. 
                  They may be too simplistic, too complex, or completely off-topic for the specific subject area.
                </p>
                <p className="font-semibold mb-2">Common Issues:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Inappropriate Level:</strong> Content may be too advanced or too basic for your students</li>
                  <li><strong>Missing Context:</strong> AI doesn't know your curriculum, prerequisites, or teaching style</li>
                  <li><strong>No Assessment Alignment:</strong> Generated content may not match your evaluation criteria</li>
                  <li><strong>Cultural Insensitivity:</strong> Examples may not be relevant to your student population</li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Case Studies: What Went Wrong" icon="⚠️">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Case Study 1: The Chemistry Professor</p>
                    <p className="mt-2">
                      Dr. Smith asked AI to "create lab exercises." The AI generated generic experiments without 
                      safety considerations, required equipment lists, or alignment with the course curriculum.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">Case Study 2: The Literature Teacher</p>
                    <p className="mt-2">
                      Prof. Johnson requested "discussion questions about Shakespeare." The AI produced surface-level 
                      questions that didn't encourage critical thinking or connect to the specific themes being studied in class.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">Lesson Learned:</p>
                    <p className="mt-2">
                      Both educators needed to provide more context, specify learning objectives, and indicate the desired depth of analysis.
                    </p>
                  </div>
                </div>
              </CollapsibleSection>
            </div>

            <div className="flex justify-between mt-8">
              <Button onClick={previousTab} variant="outline">
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
          <LessonSection title="The Four-Component Framework">
            <ul className="space-y-4 mb-8">
              <BulletPoint icon="📋">Context: Clear background and role definition</BulletPoint>
              <BulletPoint icon="✏️">Task: Specific instructions for what AI should do</BulletPoint>
              <BulletPoint icon="🔒">Constraints: Limitations and requirements</BulletPoint>
              <BulletPoint icon="💡">Examples: Desired format or style demonstration</BulletPoint>
            </ul>

            <ComprehensionCheck
              question="Which component helps the AI understand who the content is for and the background?"
              options={[
                { text: "Context", correct: true },
                { text: "Task", correct: false },
                { text: "Constraints", correct: false },
              ]}
              onComplete={() => handleTabComplete("2")}
            />

            <div className="space-y-4 mt-8">
              <CollapsibleSection title="Framework Deep Dive" icon="📚">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-lg mb-2">1. Context (The "Who" and "Why")</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Define the role: "You are an experienced biology professor..."</li>
                      <li>Specify the audience: "Creating content for first-year undergraduates..."</li>
                      <li>Provide background: "Students have completed basic chemistry..."</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-lg mb-2">2. Task (The "What")</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Be specific: "Create a 10-question quiz..." not "Make a quiz..."</li>
                      <li>Define the output: "Generate multiple-choice questions with 4 options each..."</li>
                      <li>Specify structure: "Include an introduction, 5 sections, and a summary..."</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-lg mb-2">3. Constraints (The "Rules")</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Length: "Each question should be 50-100 words..."</li>
                      <li>Tone: "Use formal academic language..."</li>
                      <li>Format: "Provide answers in JSON format..."</li>
                      <li>Scope: "Focus only on chapters 1-3..."</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-lg mb-2">4. Examples (The "Show, Don't Tell")</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Sample format: "Question format should be: Q1. [Question text]..."</li>
                      <li>Style demonstration: "Use a conversational yet professional tone like this example..."</li>
                      <li>Output structure: "Organize like this: Section A, Section B, etc."</li>
                    </ul>
                  </div>
                </div>
              </CollapsibleSection>
            </div>

            <div className="flex justify-between mt-8">
              <Button onClick={previousTab} variant="outline">
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
          <LessonSection title="How It Works: Step-by-Step">
            <div className="space-y-6 mb-8">
              <div className="bg-accent/50 p-6 rounded-xl border-l-4 border-primary">
                <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <span className="text-2xl">1️⃣</span>
                  Start with Context
                </h3>
                <p className="leading-relaxed">
                  Define your role, your audience, and the educational setting. This helps AI understand 
                  the pedagogical framework you're working within.
                </p>
              </div>

              <div className="bg-accent/50 p-6 rounded-xl border-l-4 border-primary">
                <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <span className="text-2xl">2️⃣</span>
                  Specify the Task
                </h3>
                <p className="leading-relaxed">
                  Be precise about what you want. Include numbers, formats, and specific requirements. 
                  "Create 10 questions" is better than "create some questions."
                </p>
              </div>

              <div className="bg-accent/50 p-6 rounded-xl border-l-4 border-primary">
                <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <span className="text-2xl">3️⃣</span>
                  Add Constraints
                </h3>
                <p className="leading-relaxed">
                  Set boundaries. Define length limits, tone, difficulty level, and any specific requirements 
                  or restrictions that apply to your content.
                </p>
              </div>

              <div className="bg-accent/50 p-6 rounded-xl border-l-4 border-primary">
                <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <span className="text-2xl">4️⃣</span>
                  Provide Examples
                </h3>
                <p className="leading-relaxed">
                  Show the AI what you want by providing examples or demonstrating the desired format. 
                  This dramatically improves output quality.
                </p>
              </div>
            </div>

            <ComprehensionCheck
              question="What is the first step in creating an effective AI prompt?"
              options={[
                { text: "Start with Context", correct: true },
                { text: "Provide Examples", correct: false },
                { text: "Add Constraints", correct: false },
              ]}
              onComplete={() => handleTabComplete("3")}
            />

            <div className="flex justify-between mt-8">
              <Button onClick={previousTab} variant="outline">
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
            <div className="mb-6 space-y-4">
              <p className="text-foreground/80">
                Now it's your turn! Create a comprehensive educational prompt following these guidelines:
              </p>
              
              <div className="bg-accent/30 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <span>📋</span> Before You Start
                </h4>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <BulletPoint icon="🎯">
                    Choose a specific subject and grade level (e.g., "5th grade mathematics - fractions")
                  </BulletPoint>
                  <BulletPoint icon="📝">
                    Include learning objectives and desired outcomes
                  </BulletPoint>
                  <BulletPoint icon="⏱️">
                    Specify time constraints and content length
                  </BulletPoint>
                  <BulletPoint icon="🎨">
                    Define the teaching style and engagement level
                  </BulletPoint>
                </ul>
              </div>
            </div>
            
            <PromptBuilder 
              onSubmit={handlePromptSubmit} 
              isSubmitting={isSubmittingPrompt} 
              feedback={promptFeedback}
              onFollowUp={handleFollowUp}
            />
            
            <div className="mt-8 flex gap-4">
              <Button
                onClick={previousTab}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Previous
              </Button>
            </div>
          </LessonSection>
        )}

        {/* Tab 5: Final Quiz */}
        {/* Tab 5: Final Quiz */}
        {activeTab === "5" && (
          <LessonSection title="Final Assessment Quiz">
            <p className="text-lg mb-8 leading-relaxed">
              Test your understanding of AI prompt engineering for education. Answer all questions to complete the course.
            </p>

            <QuizSection
              questions={[
                {
                  question: "Which component of the framework defines who the AI is and who the content is for?",
                  options: ["Task", "Context", "Constraints", "Examples"],
                  correctIndex: 1,
                },
                {
                  question: "What makes a prompt specific and actionable?",
                  options: [
                    "Using complicated vocabulary",
                    "Making it as short as possible",
                    "Including clear instructions, numbers, and format requirements",
                    "Avoiding examples",
                  ],
                  correctIndex: 2,
                },
                {
                  question: "Why are constraints important in educational prompts?",
                  options: [
                    "They make the prompt longer",
                    "They set boundaries and ensure content meets specific requirements",
                    "They are optional and not really necessary",
                    "They confuse the AI",
                  ],
                  correctIndex: 1,
                },
                {
                  question: "What is the purpose of providing examples in your prompt?",
                  options: [
                    "To fill space",
                    "To demonstrate the desired format and style",
                    "To make the prompt more complex",
                    "Examples should never be included",
                  ],
                  correctIndex: 1,
                },
                {
                  question: "What should you do if the AI's first output doesn't meet your needs?",
                  options: [
                    "Give up and write the content manually",
                    "Use it anyway",
                    "Refine your prompt with more specific details and try again",
                    "Switch to a different AI tool",
                  ],
                  correctIndex: 2,
                },
              ]}
              onComplete={() => handleTabComplete("5")}
            />

            <div className="flex justify-between mt-8">
              <Button onClick={previousTab} variant="outline">
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
              <div className="bg-gradient-to-r from-success/10 to-success/5 p-6 rounded-xl border-2 border-success">
                <h3 className="text-2xl font-bold mb-4 text-success-foreground">
                  🎉 Congratulations!
                </h3>
                <p className="text-lg leading-relaxed">
                  You've completed the AI Prompt Engineering for Educational Use course. 
                  You now have the skills to create effective, targeted prompts that will help you 
                  generate high-quality educational content.
                </p>
              </div>

              <div className="bg-accent/50 p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-4">📝 Key Takeaways:</h3>
                <ul className="space-y-3">
                  <BulletPoint icon="✅">
                    Use the Four-Component Framework: Context, Task, Constraints, Examples
                  </BulletPoint>
                  <BulletPoint icon="✅">
                    Be specific and detailed in your prompts
                  </BulletPoint>
                  <BulletPoint icon="✅">
                    Always specify your audience and learning objectives
                  </BulletPoint>
                  <BulletPoint icon="✅">
                    Iterate and refine based on results
                  </BulletPoint>
                  <BulletPoint icon="✅">
                    Test prompts before using content in the classroom
                  </BulletPoint>
                </ul>
              </div>

              <div className="bg-primary/10 p-6 rounded-xl border-2 border-primary">
                <h3 className="font-bold text-xl mb-4">🚀 Next Steps:</h3>
                <ol className="list-decimal list-inside space-y-3 ml-4">
                  <li className="leading-relaxed">
                    <strong>Practice regularly:</strong> Start with simple prompts and gradually increase complexity
                  </li>
                  <li className="leading-relaxed">
                    <strong>Build a prompt library:</strong> Save successful prompts for future use
                  </li>
                  <li className="leading-relaxed">
                    <strong>Share with colleagues:</strong> Collaborate and learn from each other
                  </li>
                  <li className="leading-relaxed">
                    <strong>Stay updated:</strong> AI tools evolve quickly - keep learning
                  </li>
                  <li className="leading-relaxed">
                    <strong>Experiment:</strong> Try different approaches and find what works best for your teaching style
                  </li>
                </ol>
              </div>

              <div className="text-center mt-8">
                <Button 
                  onClick={() => {
                    handleTabComplete("6");
                    toast({
                      title: "Course Complete! 🎓",
                      description: "You've successfully completed all sections!",
                      duration: 5000,
                    });
                  }}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  Complete Course
                </Button>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button onClick={previousTab} variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={() => setActiveTab("0")} variant="outline">
                Start Over
              </Button>
            </div>
          </LessonSection>
        )}
      </div>
    </div>
  );
};

export default Index;
