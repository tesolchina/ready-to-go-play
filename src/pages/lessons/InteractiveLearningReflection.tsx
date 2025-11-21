import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { ComprehensionCheck } from "@/components/ComprehensionCheck";
import { BulletPoint } from "@/components/BulletPoint";
import { CounterArgumentDemo } from "@/components/CounterArgumentDemo";
import { SimpleActivityCreator } from "@/components/SimpleActivityCreator";
import { OpenEndedReflection } from "@/components/OpenEndedReflection";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, ChevronUp, Download, ExternalLink } from "lucide-react";

const InteractiveLearningReflection = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    module1: false,
    module2: false,
    module3: false,
    module4: false,
  });
  const [showBloomPDF, setShowBloomPDF] = useState(false);
  const [showGooglePDF, setShowGooglePDF] = useState(false);

  const lessonSlug = "interactive-learning-reflection";

  useEffect(() => {
    // Track unique visitor using localStorage
    const trackVisitor = async () => {
      const storageKey = `visited_${lessonSlug}`;
      const hasVisited = localStorage.getItem(storageKey);
      
      if (!hasVisited) {
        try {
          await supabase.from("lesson_visitors").insert({
            lesson_slug: lessonSlug,
          });
          // Mark this lesson as visited in localStorage
          localStorage.setItem(storageKey, new Date().toISOString());
        } catch (error) {
          console.error('Error tracking visitor:', error);
        }
      }
    };
    trackVisitor();
  }, []);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-8 bg-background overflow-x-hidden">
          <div className="max-w-4xl mx-auto space-y-8 w-full">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Link to="/lessons">
                  <Button variant="ghost">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Lessons
                  </Button>
                </Link>
                <SidebarTrigger />
              </div>
              
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold break-words">
                  From Traditional Lecturing to Interactive Learning
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground break-words">
                  Reflecting on Teaching Practices with AI-Enhanced Learning
                </p>
              </div>
            </div>

            {/* Module 1: The Problem with Traditional Lecturing */}
            <CollapsibleSection
              title="The Problem with Traditional Lecturing"
              icon="🚨"
              isOpen={openSections.module1}
              onToggle={() => toggleSection("module1")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">The Two Sigma Problem</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    In 1984, educational psychologist Benjamin Bloom discovered what became known as the "Two Sigma Problem": 
                    students receiving one-on-one tutoring performed <strong>two standard deviations better</strong> (98th percentile) 
                    than students in traditional classroom settings (50th percentile).
                  </p>
                  <p className="text-foreground text-lg leading-relaxed mt-4">
                    This research reveals a fundamental challenge in education: <strong>personalized instruction dramatically 
                    outperforms traditional lecturing</strong>, but one-on-one tutoring is impractical for most educational settings 
                    due to resource constraints.
                  </p>
                </div>

                <ul className="space-y-3 list-none">
                  <BulletPoint icon="📊">
                    <strong>The Data:</strong> One-on-one tutoring: 98th percentile vs. Traditional classroom: 50th percentile
                  </BulletPoint>
                  <BulletPoint icon="🎯">
                    <strong>The Challenge:</strong> How can we achieve tutoring-like results in classroom settings?
                  </BulletPoint>
                  <BulletPoint icon="💡">
                    <strong>The Opportunity:</strong> AI technology now makes personalized, interactive learning scalable
                  </BulletPoint>
                </ul>

                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
                  "The tutoring process demonstrates that most students have the potential to reach high levels of learning. 
                  The challenge is to find methods of group instruction as effective as one-to-one tutoring."
                  <br />— Benjamin Bloom (1984)
                </blockquote>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module1"
                questionId="two-sigma-language-learning"
                question="Do you think the Two Sigma Problem is applicable to university English language learning in China?"
                options={[
                  "Yes, personalized feedback is critical for language acquisition",
                  "Partially, it depends on the specific language skill being taught",
                  "No, language learning requires different approaches than other subjects",
                  "Uncertain, I need to explore this concept further"
                ]}
              />
            </CollapsibleSection>

            {/* Module 2: Teaching AI to Teach */}
            <CollapsibleSection
              title="Teaching AI to Teach: Starting with Human Wisdom"
              icon="💡"
              isOpen={openSections.module2}
              onToggle={() => toggleSection("module2")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground text-lg leading-relaxed">
                    <strong>The essence of AI is to simulate human intelligence.</strong> Before we develop any AI technology or 
                    solution for learning, we must first understand what makes teaching truly effective.
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg space-y-4">
                  <h4 className="text-2xl font-semibold text-foreground mb-3">Reflect First: Your Teaching Excellence</h4>
                  <div className="space-y-3">
                    <p className="text-foreground text-lg leading-relaxed">
                      Before thinking about AI solutions, ask yourself:
                    </p>
                    <ul className="space-y-2 list-none">
                      <BulletPoint icon="✨">
                        <strong>What is your proudest moment as a teacher?</strong>
                      </BulletPoint>
                      <BulletPoint icon="🎯">
                        <strong>What is your trick for teaching students effectively?</strong>
                      </BulletPoint>
                      <BulletPoint icon="💭">
                        <strong>When did you see a struggling student finally understand?</strong>
                      </BulletPoint>
                    </ul>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mt-6 mb-3">The Human-First Approach</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    You need to figure out what works in your teaching — then teach AI to do it (assuming it is feasible). 
                    This human-first approach ensures that AI enhances rather than replaces the pedagogical wisdom you have developed 
                    through experience.
                  </p>
                </div>

                <ul className="space-y-3 list-none">
                  <BulletPoint icon="👤">
                    <strong>Identify Your Best Practices:</strong> What specific strategies work when you help students one-on-one? 
                    How do you explain difficult concepts? What questions do you ask?
                  </BulletPoint>
                  <BulletPoint icon="🤖">
                    <strong>Translate to AI Capabilities:</strong> Can AI replicate your feedback style? Your question patterns? 
                    Your way of breaking down complex ideas?
                  </BulletPoint>
                  <BulletPoint icon="🔄">
                    <strong>Scale Your Excellence:</strong> AI allows you to extend your best teaching moments to reach more students, 
                    more often, beyond classroom hours
                  </BulletPoint>
                </ul>

                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
                  "AI doesn't replace great teaching — it scales it. The question is not what AI can do, 
                  but what you do best that AI can help you do more of."
                </blockquote>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module2"
                questionId="teaching-reflection"
                question="Have you identified a specific teaching practice of yours that could be scaled with AI?"
                options={[
                  "Yes, I have a clear practice in mind",
                  "I have some ideas but need to reflect more",
                  "Not yet, this is a new way of thinking for me",
                  "I'm not sure if my practices can be replicated by AI"
                ]}
              />

              <div className="mt-6 bg-muted/50 p-4 rounded-lg space-y-4">
                <h4 className="font-semibold text-foreground text-lg mb-4">📚 Further Reading</h4>
                
                {/* Bloom Two Sigma Problem PDF */}
                <Collapsible open={showBloomPDF} onOpenChange={setShowBloomPDF}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left hover:bg-muted/80 p-2 rounded transition-colors">
                    <span className="font-semibold text-foreground">
                      The 2 Sigma Problem: The Search for Methods of Group Instruction as Effective as One-to-One Tutoring
                    </span>
                    {showBloomPDF ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="space-y-3">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href="https://web.mit.edu/5.95/readings/bloom-two-sigma.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open in New Tab
                          </a>
                        </Button>
                      </div>
                      <div className="border rounded-lg overflow-hidden bg-background">
                        <iframe
                          src="https://web.mit.edu/5.95/readings/bloom-two-sigma.pdf#view=FitH"
                          className="w-full h-[600px] border-0"
                          title="Bloom Two Sigma Problem PDF"
                        />
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Google Future of Learning PDF */}
                <Collapsible open={showGooglePDF} onOpenChange={setShowGooglePDF}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left hover:bg-muted/80 p-2 rounded transition-colors">
                    <span className="font-semibold text-foreground">
                      AI and the Future of Learning
                    </span>
                    {showGooglePDF ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="space-y-3">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href="/future_of_learning.pdf"
                            download="AI_and_the_Future_of_Learning.pdf"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href="/future_of_learning.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open in New Tab
                          </a>
                        </Button>
                      </div>
                      <div className="border rounded-lg overflow-hidden bg-background">
                        <iframe
                          src="/future_of_learning.pdf#view=FitH"
                          className="w-full h-[600px] border-0"
                          title="AI and the Future of Learning PDF"
                        />
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CollapsibleSection>

            {/* Module 3: Design Your Own Interactive Activity */}
            <CollapsibleSection
              title="Try It Yourself: Counter-Argument Exercise"
              icon="🎨"
              isOpen={openSections.module3}
              onToggle={() => toggleSection("module3")}
            >
              <div className="space-y-8">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground text-lg leading-relaxed">
                    One effective AI-enhanced activity is the <strong>counter-argument exercise</strong>. 
                    Students address potential challenges to an argument, and AI provides personalized feedback 
                    on their reasoning and use of evidence.
                  </p>
                  <p className="text-foreground text-lg leading-relaxed mt-4">
                    This approach is simple to implement but powerful for developing critical thinking skills.
                  </p>
                </div>

                <div>
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    Step 1: See the Demo
                  </h4>
                  <CounterArgumentDemo />
                </div>

                <div className="border-t border-border pt-8">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    Step 2: Create Your Own Activity
                  </h4>
                  <SimpleActivityCreator />
                </div>
              </div>
            </CollapsibleSection>

            {/* Module 4: Lesson Summary & Reflection */}
            <CollapsibleSection
              title="Lesson Summary & Reflection"
              icon="🎓"
              isOpen={openSections.module4}
              onToggle={() => toggleSection("module4")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">Key Takeaways</h4>
                  <ul className="space-y-3 list-none">
                    <BulletPoint icon="📊">
                      <strong>The Two Sigma Problem:</strong> One-on-one tutoring dramatically outperforms traditional lectures, 
                      but AI can help scale personalized learning
                    </BulletPoint>
                    <BulletPoint icon="👤">
                      <strong>Human-First Approach:</strong> Start with what makes your teaching excellent, 
                      then teach AI to replicate and scale those practices
                    </BulletPoint>
                    <BulletPoint icon="🎯">
                      <strong>Customizing AI Chatbots:</strong> This lesson demonstrates how writing system prompts 
                      can customize chatbots to offer feedback on specific tasks. By crafting effective prompts, 
                      you can create AI tools that provide personalized, task-specific guidance. <strong>Note:</strong> 
                      There is more work to be done on improving chatbot feedback quality, but this represents 
                      an important step toward scalable personalized learning.
                    </BulletPoint>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg space-y-4">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">Reimagining the Classroom</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    The importance of reimagining our classrooms cannot be overstated. As educators, we have a responsibility 
                    not just to respond to current needs, but to anticipate and shape the future of learning. Technology alone 
                    is not enough—we must fundamentally rethink how we engage with students and how learning happens.
                  </p>
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
                    "Some people say, 'Give the customers what they want.' But that's not my approach. Our job is to figure out 
                    what they're going to want before they do. I think Henry Ford once said, 'If I'd asked customers what they 
                    wanted, they would have told me, "A faster horse!"' People don't know what they want until you show it to 
                    them. That's why I never rely on market research. Our task is to read things that are not yet on the page."
                    <br />— Steve Jobs
                  </blockquote>
                  <p className="text-foreground text-lg leading-relaxed">
                    Just as Steve Jobs envisioned products people didn't know they needed, we must envision educational experiences 
                    that transcend traditional boundaries. Our students may not know to ask for AI-enhanced personalized learning— 
                    but once they experience it, they'll wonder how they ever learned without it.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg space-y-4">
                  <h4 className="text-2xl font-semibold text-foreground">Quick Feedback</h4>
                  <ComprehensionCheck
                    lessonSlug={lessonSlug}
                    sectionId="module4"
                    questionId="lesson-usefulness"
                    question="How useful was this lesson for your teaching practice?"
                    options={[
                      "Very useful - I have concrete ideas to implement",
                      "Useful - I learned new concepts",
                      "Somewhat useful - Need more examples",
                      "Not useful - Too abstract or not relevant"
                    ]}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg space-y-4">
                  <h4 className="text-2xl font-semibold text-foreground">Final Reflection</h4>
                  <OpenEndedReflection
                    lessonSlug={lessonSlug}
                    sectionId="module4"
                    questionId="main-insight"
                    question="What is one key insight or teaching practice from this lesson that you would like to try in your own classroom?"
                  />
                </div>
              </div>
            </CollapsibleSection>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default InteractiveLearningReflection;
