import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { ComprehensionCheck } from "@/components/ComprehensionCheck";
import { BulletPoint } from "@/components/BulletPoint";
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
    <SidebarProvider>
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
                <h1 className="text-4xl font-bold">
                  From Traditional Lecturing to Interactive Learning
                </h1>
                <p className="text-xl text-muted-foreground">
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
                  <h4 className="text-xl font-semibold text-foreground mb-4">The Two Sigma Problem</h4>
                  <p className="text-foreground leading-relaxed">
                    In 1984, educational psychologist Benjamin Bloom discovered what became known as the "Two Sigma Problem": 
                    students receiving one-on-one tutoring performed <strong>two standard deviations better</strong> (98th percentile) 
                    than students in traditional classroom settings (50th percentile).
                  </p>
                  <p className="text-foreground leading-relaxed mt-4">
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

              <div className="mt-6 bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">📚 Further Reading</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • Prince, M. (2004). Does active learning work? A review of the research. 
                    <em className="text-primary"> Journal of Engineering Education</em>
                  </li>
                </ul>
              </div>
            </CollapsibleSection>

            {/* Module 2: AI-Enhanced Interactive Learning */}
            <CollapsibleSection
              title="AI-Enhanced Interactive Learning"
              icon="💡"
              isOpen={openSections.module2}
              onToggle={() => toggleSection("module2")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground leading-relaxed">
                    Interactive learning emphasizes "student-centered" approaches, and AI technology provides unprecedented possibilities 
                    to realize this vision in university English teaching.
                  </p>

                  <h4 className="text-xl font-semibold text-foreground mt-6 mb-3">Core Principles</h4>
                </div>

                <ul className="space-y-3 list-none">
                  <BulletPoint icon="🔍">
                    <strong>From Teacher-Centered to Student-Centered:</strong> Teachers shift from "knowledge transmitters" to "learning facilitators," 
                    with students actively constructing knowledge through problem-based exploration
                  </BulletPoint>
                  <BulletPoint icon="🎯">
                    <strong>From Uniform Pace to Personalized Learning:</strong> AI can provide customized content and instant feedback 
                    based on each student's proficiency level and needs
                  </BulletPoint>
                  <BulletPoint icon="🌐">
                    <strong>From Classroom-Only to Anytime, Anywhere Learning:</strong> Students can engage with AI for writing advice, 
                    grammar explanations, and language optimization at any time
                  </BulletPoint>
                  <BulletPoint icon="📊">
                    <strong>From Teacher Supervision to Intelligent Tracking:</strong> The system tracks student progress and identifies 
                    challenges, helping teachers adjust strategies more precisely
                  </BulletPoint>
                </ul>

                <div className="prose prose-lg max-w-none mt-6">
                  <h4 className="text-xl font-semibold text-foreground mb-3">Implementation Framework</h4>
                </div>

                <div className="space-y-4">
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h5 className="font-semibold text-foreground mb-2">Before Class: Flipped Classroom</h5>
                    <p className="text-muted-foreground">
                      Students preview content through videos and reading materials; AI assistants answer questions during self-study
                    </p>
                  </div>

                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h5 className="font-semibold text-foreground mb-2">During Class: Interactive Practice</h5>
                    <p className="text-muted-foreground">
                      Teachers organize discussions and project activities; AI supports group collaboration and provides instant feedback
                    </p>
                  </div>

                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h5 className="font-semibold text-foreground mb-2">After Class: Continuous Practice</h5>
                    <p className="text-muted-foreground">
                      Students practice writing and speaking with AI, receiving personalized improvement suggestions
                    </p>
                  </div>
                </div>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module2"
                questionId="implementation-phase"
                question="Which phase of the AI-enhanced framework do you think would be easiest to implement first in your context?"
                options={[
                  "Before class: Flipped classroom approach",
                  "During class: Interactive practice",
                  "After class: Continuous practice",
                  "All phases simultaneously"
                ]}
              />

              <div className="mt-6 bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">📚 Further Reading</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • Freeman, S. et al. (2014). Active learning increases student performance in science, engineering, and mathematics. 
                    <em className="text-primary"> PNAS, 111(23)</em>
                  </li>
                  <li>
                    • Bergmann, J., & Sams, A. (2012). Flip Your Classroom: Reach Every Student in Every Class Every Day. 
                    <em className="text-primary"> ISTE</em>
                  </li>
                </ul>
              </div>
            </CollapsibleSection>

            {/* Module 3: Design Your Own Interactive Activity */}
            <CollapsibleSection
              title="Design Your Own Interactive Activity"
              icon="🎨"
              isOpen={openSections.module3}
              onToggle={() => toggleSection("module3")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground leading-relaxed">
                    Now it's time to apply these concepts. Design an AI-enhanced interactive learning activity based on your current teaching content.
                  </p>

                  <h4 className="text-xl font-semibold text-foreground mt-6 mb-3">Design Guidelines</h4>
                </div>

                <ul className="space-y-3 list-none">
                  <BulletPoint icon="🎯">
                    <strong>Define Learning Objectives:</strong> What should students be able to do by the end?
                  </BulletPoint>
                  <BulletPoint icon="🔍">
                    <strong>Design Active Exploration:</strong> How will you engage students and stimulate participation?
                  </BulletPoint>
                  <BulletPoint icon="🤖">
                    <strong>Specify AI Support:</strong> Where and how will AI provide assistance in the learning process?
                  </BulletPoint>
                  <BulletPoint icon="📊">
                    <strong>Set Feedback Mechanisms:</strong> How will students know they're making progress?
                  </BulletPoint>
                  <BulletPoint icon="👥">
                    <strong>Address Diverse Needs:</strong> How will you personalize for different proficiency levels?
                  </BulletPoint>
                </ul>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <p className="text-muted-foreground text-sm">
                    💡 <strong>Tip:</strong> Start small. Choose one class session and one specific skill (e.g., academic writing, critical reading) 
                    to design your first AI-enhanced interactive activity.
                  </p>
                </div>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module3"
                questionId="design-readiness"
                question="Do you feel ready to design an AI-enhanced activity for your next class?"
                options={[
                  "Yes, I have a clear idea",
                  "Somewhat, but need more examples",
                  "Not yet, need more guidance",
                  "I'd like to collaborate with colleagues first"
                ]}
              />

              <div className="mt-6 bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">📚 Further Reading</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • Bower, M. (2019). Technology-mediated learning theory. 
                    <em className="text-primary"> British Journal of Educational Technology, 50(3)</em>
                  </li>
                </ul>
              </div>
            </CollapsibleSection>

            {/* Module 4: Deep Reflection on Teaching Transformation */}
            <CollapsibleSection
              title="Deep Reflection on Teaching Transformation"
              icon="🤔"
              isOpen={openSections.module4}
              onToggle={() => toggleSection("module4")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground leading-relaxed">
                    The shift from lecture-based teaching to interactive learning is not merely a change in methods, 
                    but a fundamental transformation in teaching philosophy.
                  </p>

                  <h4 className="text-xl font-semibold text-foreground mt-6 mb-3">Reflection Questions</h4>
                </div>

                <ul className="space-y-4 list-none">
                  <li className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <BulletPoint icon="👤">
                      <strong>Role Transformation:</strong> Moving from "knowledge authority" to "learning partner" — what does this mean for you? 
                      Are you ready for this shift?
                    </BulletPoint>
                  </li>

                  <li className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <BulletPoint icon="🎮">
                      <strong>Trust and Control:</strong> Allowing students more autonomous exploration — do you worry about losing classroom control?
                    </BulletPoint>
                  </li>

                  <li className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <BulletPoint icon="❤️">
                      <strong>Technology and Humanity:</strong> AI can provide feedback, but what is the unique value that human teachers bring?
                    </BulletPoint>
                  </li>

                  <li className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <BulletPoint icon="🚀">
                      <strong>Challenges and Preparation:</strong> What do you see as the biggest obstacle to implementing this model? 
                      What support do you need?
                    </BulletPoint>
                  </li>
                </ul>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module4"
                questionId="transformation-readiness"
                question="After this lesson, how confident do you feel about integrating AI into your teaching practice?"
                options={[
                  "Very confident - ready to start immediately",
                  "Confident - will start with small experiments",
                  "Somewhat confident - need more training",
                  "Not confident - need significant support"
                ]}
              />

              <div className="mt-6 bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">📚 Further Reading</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • Holmes, W., Bialik, M., & Fadel, C. (2019). Artificial Intelligence in Education: Promises and Implications. 
                    <em className="text-primary"> Center for Curriculum Redesign</em>
                  </li>
                  <li>
                    • Luckin, R. (2018). Machine Learning and Human Intelligence: The future of education for the 21st century. 
                    <em className="text-primary"> UCL IOE Press</em>
                  </li>
                </ul>
              </div>
            </CollapsibleSection>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-foreground">🎯 Next Steps</h3>
                <p className="text-muted-foreground">
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
