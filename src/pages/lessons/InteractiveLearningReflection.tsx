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
import { supabase } from "@/integrations/supabase/client";

const InteractiveLearningReflection = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    module1: false,
    module2: false,
    module3: false,
    module4: false,
  });

  const lessonSlug = "interactive-learning-reflection";

  useEffect(() => {
    // Track visitor
    const trackVisitor = async () => {
      await supabase.from("lesson_visitors").insert({
        lesson_slug: lessonSlug,
      });
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
        <main className="flex-1 p-8 bg-background">
          <div className="max-w-4xl mx-auto space-y-8">
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
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                    Lesson 1
                  </span>
                </div>
                <h1 className="text-5xl font-bold">
                  From Traditional Lecturing to Interactive Learning
                </h1>
                <p className="text-2xl text-muted-foreground">
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

              <div className="mt-6 bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground text-lg mb-2">📚 Further Reading</h4>
                <ul className="space-y-2 text-base text-muted-foreground">
                  <li>
                    • <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10159400/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Personalized tutoring and AI (2023)
                    </a>
                  </li>
                  <li>
                    • <a href="https://services.google.com/fh/files/misc/future_of_learning.pdf#page=9.39" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      AI and the Future of Learning (Google, Nov 2025)
                    </a>
                  </li>
                </ul>
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
                      <strong>Simple AI Activities:</strong> Counter-argument exercises demonstrate how focused, 
                      AI-enhanced activities can develop critical thinking without complex technical setup
                    </BulletPoint>
                  </ul>
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
                  <ComprehensionCheck
                    lessonSlug={lessonSlug}
                    sectionId="module4"
                    questionId="main-insight"
                    question="What is one key insight or teaching practice from this lesson that you would like to try in your own classroom?"
                    options={[
                      "Using AI for personalized student feedback",
                      "Creating counter-argument exercises",
                      "Identifying my best teaching practices to scale",
                      "Other approach (please share below)"
                    ]}
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-bold text-foreground">🎯 Next Steps</h3>
                <p className="text-muted-foreground text-lg">
                  After completing this lesson, try implementing one small interactive learning activity in your next class 
                  and observe changes in student response and engagement.
                </p>
                <div className="flex justify-center gap-4">
                  <Link to="/lessons">
                    <Button variant="outline">
                      Back to Lessons
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default InteractiveLearningReflection;
