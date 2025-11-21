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

const Lesson6 = () => {
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
    { id: "1", label: "Undesirable Behaviors", completed: completedTabs.has("1") },
    { id: "2", label: "Publisher Policies", completed: completedTabs.has("2") },
    { id: "3", label: "Best Practices", completed: completedTabs.has("3") },
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
          <LessonSection title="The Problem: Ambiguous GenAI Policies in Academic Publishing">
            <ul className="space-y-4 mb-8">
              <BulletPoint icon="🎯">
                Journal editors face ambiguous and inconsistent GenAI policies from publishers
              </BulletPoint>
              <BulletPoint icon="📊">
                Increased submission pressures combined with unclear guidelines create confusion
              </BulletPoint>
              <BulletPoint icon="🤔">
                Editors struggle to interpret policies for their specific journals and editorial roles
              </BulletPoint>
              <BulletPoint icon="⚡">
                The rapid development of GenAI tools outpaces policy development
              </BulletPoint>
              <BulletPoint icon="🌐">
                Lack of discipline-specific guidance for applied linguistics and other fields
              </BulletPoint>
            </ul>

            <ComprehensionCheck
              lessonSlug="lesson-6"
              sectionId="tab-0"
              questionId="genai-challenge-question"
              question="According to Moorhouse et al. (2025), what is the primary challenge editors face regarding GenAI policies?"
              options={[
                "GenAI tools are too expensive for journals",
                "Ambiguous and inconsistent policies create confusion about acceptable use",
                "GenAI tools are not sophisticated enough yet",
              ]}
            />

            <div className="space-y-4 mt-8">
              <CollapsibleSection title="Additional Reading: The Publishing Context" icon="📚">
                <p className="mb-4 leading-relaxed">
                  The academic publishing landscape is experiencing unprecedented pressures. The "publish or perish" culture 
                  drives increased submissions, often at the expense of quality. GenAI tools can generate content quickly, 
                  but this speed risks overwhelming the peer review process and potentially contaminating the knowledge base.
                </p>
                <p className="font-semibold mb-2">Key Points:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Systemic pressures drive quantity over quality in submissions</li>
                  <li>GenAI can exacerbate existing challenges in academic publishing</li>
                  <li>Editors need clear, discipline-specific guidance on GenAI use</li>
                  <li>Transparency and trust are foundational to academic publishing</li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Real-World Examples" icon="💡">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Example 1: Ambiguous Policy</p>
                    <p className="bg-destructive/10 p-3 rounded-lg my-2 border-l-4 border-destructive">
                      A publisher states "GenAI use must be declared" but provides no guidance on what constitutes 
                      acceptable use, how to declare it, or what happens if use is undeclared.
                    </p>
                    <p className="font-semibold">Result:</p>
                    <p>Editors and authors are uncertain about compliance, leading to inconsistent practices and potential ethical issues</p>
                  </div>

                  <div>
                    <p className="font-semibold">Example 2: Clear Policy</p>
                    <p className="bg-success/10 p-3 rounded-lg my-2 border-l-4 border-success">
                      A publisher provides detailed guidelines specifying: acceptable uses (language editing, brainstorming), 
                      required disclosure format, location of disclosure in manuscript, and consequences of non-compliance.
                    </p>
                    <p className="font-semibold">Result:</p>
                    <p>Editors and authors have clear expectations, enabling transparent and ethical GenAI use</p>
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

        {/* Tab 1: Undesirable Behaviors */}
        {activeTab === "1" && (
          <LessonSection title="Undesirable Behaviors: Questionable Research Practices">
            <p className="leading-relaxed mb-6">
              Research shows that unclear policies and fear of consequences lead to problematic behaviors in academic publishing. 
              Understanding these undesirable patterns helps us recognize why clear guidelines and transparent practices are essential.
            </p>

            <ul className="space-y-4 mb-8">
              <BulletPoint icon="🚫">
                Unreported GenAI use: Authors fail to disclose AI assistance due to fear of bias or rejection
              </BulletPoint>
              <BulletPoint icon="⚠️">
                Over-reliance on AI: Authors use GenAI for tasks requiring human critical thinking and expertise
              </BulletPoint>
              <BulletPoint icon="📝">
                Generic content: AI-generated text lacks originality and fails to contribute new knowledge
              </BulletPoint>
              <BulletPoint icon="🔍">
                Undetectable use: In qualitative research, GenAI use in thematic analysis or ethnography may be invisible
              </BulletPoint>
              <BulletPoint icon="📚">
                Fabricated citations: AI tools generate plausible-sounding but non-existent references
              </BulletPoint>
              <BulletPoint icon="🎭">
                Cultural nudging: AI subtly influences decisions toward specific worldviews, contaminating knowledge
              </BulletPoint>
            </ul>

            <ComprehensionCheck
              lessonSlug="lesson-6"
              sectionId="tab-1"
              questionId="disclosure-question"
              question="What is a primary reason authors fail to disclose GenAI use according to research?"
              options={[
                "They don't know how to disclose it",
                "Fear of bias affecting peer review outcomes",
                "GenAI tools don't require disclosure",
              ]}
            />

            <div className="space-y-4 mt-8">
              <CollapsibleSection title="Additional Reading: The Impact of Undesirable Behaviors" icon="📚">
                <p className="mb-4 leading-relaxed">
                  When authors engage in questionable research practices with GenAI, it erodes trust between authors, editors, 
                  and readers. The inability to detect AI use in qualitative research methods like thematic analysis creates 
                  particular challenges. Editors express concern about whether authors truly understand their data when AI 
                  has been heavily involved in analysis.
                </p>
                <p className="font-semibold mb-2">Key Points:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Undisclosed GenAI use undermines academic integrity and trust</li>
                  <li>Over-reliance on AI can lead to disengagement from the research process</li>
                  <li>Generic AI-generated content fails to advance knowledge</li>
                  <li>Fabricated citations and hallucinations pose serious risks to research quality</li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Real-World Examples" icon="💡">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Example 1: Undisclosed Use</p>
                    <p className="bg-destructive/10 p-3 rounded-lg my-2 border-l-4 border-destructive">
                      An author uses ChatGPT to generate the entire literature review section but does not disclose this use. 
                      The review contains fabricated citations that appear plausible but don't exist.
                    </p>
                    <p className="font-semibold">Result:</p>
                    <p>Editor discovers non-existent citations during review, manuscript is rejected, and trust is damaged</p>
                  </div>

                  <div>
                    <p className="font-semibold">Example 2: Transparent Use</p>
                    <p className="bg-success/10 p-3 rounded-lg my-2 border-l-4 border-success">
                      An author uses ChatGPT for brainstorming research questions and improving language quality. They clearly 
                      declare this in the methods section, specify which tool and version was used, and verify all citations.
                    </p>
                    <p className="font-semibold">Result:</p>
                    <p>Editor can assess appropriateness of AI use, trust is maintained, and the manuscript is evaluated fairly</p>
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

        {/* Tab 2: Publisher Policies */}
        {activeTab === "2" && (
          <LessonSection title="Publisher Policies: Understanding the Landscape">
            <p className="leading-relaxed mb-6">
              Major academic publishers have developed policies on GenAI use, but they vary significantly in their approach. 
              Understanding these policies helps authors and editors navigate the complex landscape of acceptable AI use.
            </p>

            <ul className="space-y-4 mb-8">
              <BulletPoint icon="📋">
                COPE Guidelines: Emphasize transparency and author accountability for AI-generated content
              </BulletPoint>
              <BulletPoint icon="🔍">
                Disclosure Requirements: Most publishers require declaration of GenAI use, but formats vary
              </BulletPoint>
              <BulletPoint icon="✍️">
                Authorship: AI tools cannot be listed as authors or co-authors
              </BulletPoint>
              <BulletPoint icon="✅">
                Acceptable Uses: Language editing, brainstorming, and improving writing quality are generally accepted
              </BulletPoint>
              <BulletPoint icon="🚫">
                Prohibited Uses: Generating core research data, creating images without disclosure, using AI in peer review
              </BulletPoint>
              <BulletPoint icon="🔒">
                Confidentiality: Reviewers and editors must not upload manuscripts to public AI tools
              </BulletPoint>
            </ul>

            <ComprehensionCheck
              lessonSlug="lesson-6"
              sectionId="tab-2"
              questionId="cope-guidelines-question"
              question="According to COPE guidelines and most publisher policies, what is required when using GenAI tools?"
              options={[
                "Listing AI as a co-author",
                "Transparent disclosure of AI use and author accountability",
                "Using AI only for data analysis",
              ]}
            />

            <div className="space-y-4 mt-8">
              <CollapsibleSection title="Publisher Policy Comparison" icon="📚">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold mb-2">Oxford University Press (OUP)</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Requires written permission for GenAI-created content</li>
                      <li>Emphasizes three principles: Authorship, Accountability, Disclosure</li>
                      <li>Authors must protect intellectual property when using AI tools</li>
                      <li>Prohibits uploading manuscripts to tools without content protection</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Elsevier</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Requires disclosure statement upon submission</li>
                      <li>Prohibits AI-generated images except in research methods</li>
                      <li>Emphasizes human oversight and accountability</li>
                      <li>Authors must verify accuracy of all AI-generated content</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Sage</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Distinguishes between Assistive AI (no disclosure) and Generative AI (requires disclosure)</li>
                      <li>Prohibits AI-generated core research data</li>
                      <li>Reviewers cannot use AI to generate review reports</li>
                      <li>Provides detailed disclosure template</li>
                    </ul>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Key Policy Principles" icon="💡">
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold">1. Transparency</p>
                    <p className="text-sm text-muted-foreground">
                      All GenAI use must be clearly disclosed, including which tool, version, and purpose
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">2. Accountability</p>
                    <p className="text-sm text-muted-foreground">
                      Authors remain fully responsible for accuracy, integrity, and originality of their work
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">3. Human Oversight</p>
                    <p className="text-sm text-muted-foreground">
                      AI cannot replace human critical thinking, expertise, and evaluation
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">4. Confidentiality</p>
                    <p className="text-sm text-muted-foreground">
                      Manuscripts and peer review materials must not be uploaded to public AI tools
                    </p>
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

        {/* Tab 3: Best Practices */}
        {activeTab === "3" && (
          <LessonSection title="Best Practices: Transparent and Ethical GenAI Use">
            <p className="leading-relaxed mb-6">
              Based on research findings and publisher policies, here are evidence-based best practices for using GenAI 
              tools responsibly in academic writing and publishing.
            </p>

            <ul className="space-y-4 mb-8">
              <BulletPoint icon="📝">
                Document AI use in methods section: Specify tool, version, purpose, and validation steps
              </BulletPoint>
              <BulletPoint icon="✅">
                Verify all AI outputs: Check citations, facts, and claims for accuracy and bias
              </BulletPoint>
              <BulletPoint icon="🔍">
                Maintain human oversight: Use AI as a tool, not a replacement for critical thinking
              </BulletPoint>
              <BulletPoint icon="📋">
                Follow publisher-specific guidelines: Check journal or publisher policies before submission
              </BulletPoint>
              <BulletPoint icon="🔒">
                Protect intellectual property: Use enterprise versions with content protection when available
              </BulletPoint>
              <BulletPoint icon="🤝">
                Engage in transparent dialogue: Discuss AI use with editors early in the process
              </BulletPoint>
            </ul>

            <ComprehensionCheck
              lessonSlug="lesson-6"
              sectionId="tab-3"
              questionId="best-practice-question"
              question="What is the most important practice when using GenAI in academic writing?"
              options={[
                "Using the latest AI tool version",
                "Maintaining human oversight and verifying all outputs",
                "Using AI for all writing tasks",
              ]}
            />

            <div className="space-y-4 mt-8">
              <CollapsibleSection title="Additional Reading: Moving from Deficit to Strategic View" icon="📚">
                <p className="mb-4 leading-relaxed">
                  Research suggests moving from a deficit view of AI use (seeing it as problematic) to a strategic view 
                  (using it to enhance quality and rigor). This requires developing methodological models and protocols that 
                  detail how GenAI can be appropriately integrated into research and writing processes.
                </p>
                <p className="font-semibold mb-2">Key Points:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Strategic AI use can enhance research quality when used appropriately</li>
                  <li>Clear protocols help authors document their process transparently</li>
                  <li>Discipline-specific guidance is needed for different research traditions</li>
                  <li>Transparency enables editors and reviewers to assess appropriateness</li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Real-World Examples" icon="💡">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Example 1: Poor Practice</p>
                    <p className="bg-destructive/10 p-3 rounded-lg my-2 border-l-4 border-destructive">
                      An author uses ChatGPT to generate a literature review, accepts all citations without verification, 
                      and does not disclose AI use. The review contains fabricated references and generic content.
                    </p>
                    <p className="font-semibold">Result:</p>
                    <p>Manuscript is rejected, author's credibility is damaged, and trust in the research process is undermined</p>
                  </div>

                  <div>
                    <p className="font-semibold">Example 2: Best Practice</p>
                    <p className="bg-success/10 p-3 rounded-lg my-2 border-l-4 border-success">
                      An author uses ChatGPT for brainstorming research questions and improving language quality. They document 
                      this in the methods section, verify all citations, check for bias, and declare AI use according to 
                      publisher guidelines. The AI-assisted content is thoroughly reviewed and refined.
                    </p>
                    <p className="font-semibold">Result:</p>
                    <p>Manuscript is evaluated fairly, transparency builds trust, and AI use enhances rather than compromises quality</p>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Disclosure Template" icon="📋">
                <div className="bg-accent/30 p-4 rounded-lg text-sm space-y-2">
                  <p className="font-semibold">When disclosing GenAI use, include:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Name and version of the AI tool used</li>
                    <li>Purpose of AI use (e.g., language editing, brainstorming, data analysis)</li>
                    <li>Location in manuscript where AI was used</li>
                    <li>Steps taken to verify and validate AI outputs</li>
                    <li>Extent of human oversight and editing</li>
                    <li>Rationale for using AI in this context</li>
                  </ul>
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
          <LessonSection title="Practice: Developing Ethical GenAI Disclosure">
            <p className="leading-relaxed mb-6">
              Practice creating a transparent disclosure statement for GenAI use in academic writing. 
              Use the prompt builder to develop a comprehensive disclosure that follows best practices and publisher guidelines.
            </p>

            <PromptBuilder 
              practiceFields={[
                { label: "AI Tool Used", placeholder: "e.g., ChatGPT 4.0, Claude 3.5...", type: "text" },
                { label: "Purpose of Use", placeholder: "Describe how you used AI (language editing, brainstorming, data analysis, etc.)...", type: "textarea" },
                { label: "Location in Manuscript", placeholder: "Specify where AI was used (methods section, literature review, etc.)...", type: "textarea" },
                { label: "Validation Steps", placeholder: "Describe how you verified AI outputs (checked citations, reviewed for bias, etc.)...", type: "textarea" }
              ]}
              systemPrompt="You are an expert academic editor reviewing a GenAI disclosure statement. Evaluate the disclosure based on: 1) Clarity and completeness of information, 2) Transparency about AI tool and version, 3) Specificity about purpose and location of use, 4) Evidence of validation and human oversight. Provide constructive feedback with specific suggestions for improvement to ensure the disclosure meets publisher guidelines and best practices."
              onSubmit={handlePromptSubmit}
              onFollowUp={handleFollowUp}
            />

            <div className="mt-6 p-4 bg-accent/30 rounded-lg">
              <p className="font-semibold mb-2">💡 Tips for Effective Disclosure:</p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li>Be specific about which AI tool and version you used</li>
                <li>Clearly explain the purpose and scope of AI assistance</li>
                <li>Document your validation and verification processes</li>
                <li>Show evidence of human oversight and critical evaluation</li>
                <li>Follow the specific format required by your target journal or publisher</li>
              </ul>
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

        {/* Tab 5: Reflection & Feedback */}
        {activeTab === "5" && (
          <LessonSection title="Reflection & Next Steps">
            <div className="space-y-8">
              <div className="bg-accent/50 p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-4">🎓 Congratulations!</h3>
                <p className="leading-relaxed mb-4">
                  You've completed the lesson on GenAI policies and ethical use in academic publishing. 
                  You now understand the challenges editors face, the importance of transparency, and how to navigate 
                  publisher policies responsibly.
                </p>
              </div>

              <div className="bg-card p-6 rounded-xl border-2 border-primary/20">
                <h3 className="font-bold text-xl mb-4">📋 What You've Learned</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">1️⃣</span>
                    <div>
                      <p className="font-semibold">The Problem</p>
                      <p className="text-muted-foreground text-sm">Identified ambiguous GenAI policies and the challenges editors face in academic publishing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">2️⃣</span>
                    <div>
                      <p className="font-semibold">Undesirable Behaviors</p>
                      <p className="text-muted-foreground text-sm">Understood questionable research practices and why transparency matters</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">3️⃣</span>
                    <div>
                      <p className="font-semibold">Publisher Policies</p>
                      <p className="text-muted-foreground text-sm">Explored policies from major publishers and COPE guidelines</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">4️⃣</span>
                    <div>
                      <p className="font-semibold">Best Practices</p>
                      <p className="text-muted-foreground text-sm">Learned how to use GenAI transparently and ethically in academic writing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">5️⃣</span>
                    <div>
                      <p className="font-semibold">Practice</p>
                      <p className="text-muted-foreground text-sm">Developed skills in creating comprehensive GenAI disclosure statements</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded-xl border-l-4 border-primary">
                <h3 className="font-bold text-lg mb-3">Key Takeaways:</h3>
                <ul className="space-y-2">
                  <BulletPoint icon="✅">Transparency is foundational to academic integrity</BulletPoint>
                  <BulletPoint icon="✅">Human oversight and verification are essential when using AI</BulletPoint>
                  <BulletPoint icon="✅">Publisher policies vary, so check specific guidelines</BulletPoint>
                  <BulletPoint icon="✅">Strategic AI use can enhance quality when used appropriately</BulletPoint>
                  <BulletPoint icon="✅">Clear disclosure builds trust between authors, editors, and readers</BulletPoint>
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

export default Lesson6;

