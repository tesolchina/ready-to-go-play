import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { ComprehensionCheck } from "@/components/ComprehensionCheck";
import { BulletPoint } from "@/components/BulletPoint";
import { OpenEndedReflection } from "@/components/OpenEndedReflection";
import { supabase } from "@/integrations/supabase/client";

const LeverageEducationalResources = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    module1: false,
    module2: false,
    module3: false,
    module4: false,
  });

  const lessonSlug = "leverage-educational-resources";

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
                  Leverage and Enhance Existing Educational Resources with AI
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground break-words">
                  Building on Proven Resources: The Academic Phrasebank Case Study
                </p>
              </div>
            </div>

            {/* Module 1: The Resource Discovery Challenge */}
            <CollapsibleSection
              title="The Resource Discovery Challenge"
              icon="🔍"
              isOpen={openSections.module1}
              onToggle={() => toggleSection("module1")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">Existing Quality Resources</h4>
                  <p className="text-foreground text-lg leading-relaxed mt-4">
                    <strong>AI in education is evolution, not revolution.</strong> Rather than replacing 
                    everything, we enhance proven resources that have stood the test of time, combining 
                    expert knowledge with AI capabilities for personalization and interaction.
                  </p>
                  <p className="text-foreground text-lg leading-relaxed mt-4">
                    The internet is filled with excellent educational resources developed by dedicated educators and researchers. 
                    One such resource is the <strong>Manchester Academic Phrasebank</strong>, created by Dr. John Morley at the University of 
                    of Manchester. Since 2009, it has helped millions of students and researchers write academic English more effectively.
                  </p>
                  <p className="text-foreground text-lg leading-relaxed mt-4">
                    The Academic Phrasebank provides examples of commonly-used phrases in academic writing, organized by function 
                    (e.g., "Introducing Work", "Being Cautious", "Describing Methods"). It's <strong>free, well-organized, and 
                    pedagogically sound</strong>—exactly the kind of resource teachers should leverage.
                  </p>
                  <p className="text-foreground text-lg leading-relaxed mt-4">
                    However, there's a challenge: while the Phrasebank is comprehensive, it's essentially a <strong>static reference 
                    tool</strong>. Students must browse categories, read examples, and figure out how to apply them. There's no 
                    personalization, no feedback, and no way to practice using phrases in context.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <h5 className="text-xl font-semibold text-foreground mb-3">Explore the Original Resource</h5>
                  <p className="text-foreground mb-4">
                    Visit the Manchester Academic Phrasebank to see the structure and content:
                  </p>
                  <a 
                    href="https://www.phrasebank.manchester.ac.uk/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    https://www.phrasebank.manchester.ac.uk/
                  </a>
                  <p className="text-sm text-muted-foreground mt-4">
                    Take 5-10 minutes to explore the site. Notice how phrases are organized by:
                  </p>
                  <ul className="list-disc list-inside text-foreground mt-2 space-y-1">
                    <li>General Functions (Being Cautious, Classifying, Comparing, etc.)</li>
                    <li>Section-Specific Functions (Introducing Work, Describing Methods, etc.)</li>
                    <li>Each with multiple subcategories and example phrases</li>
                  </ul>
                </div>

                <ul className="space-y-3 list-none">
                  <BulletPoint icon="📚">
                    <strong>Quality Resources Exist:</strong> Many excellent educational resources are freely available online, 
                    developed by experts and proven effective over years of use
                  </BulletPoint>
                  <BulletPoint icon="🔒">
                    <strong>But They're Static:</strong> Most are reference tools—students look up information but can't interact, 
                    get personalized feedback, or practice in context
                  </BulletPoint>
                  <BulletPoint icon="⏰">
                    <strong>Teachers Lack Time:</strong> Creating these comprehensive resources from scratch would take years; 
                    it's more efficient to enhance what already exists
                  </BulletPoint>
                  <BulletPoint icon="🤖">
                    <strong>AI as Enhancement Tool:</strong> AI can transform static resources into interactive learning experiences 
                    while preserving the original pedagogical structure. This is evolution, not revolution—building on proven expertise.
                  </BulletPoint>
                  <BulletPoint icon="🎯">
                    <strong>Context Over Chatbot:</strong> Instead of directing students to an AI chatbot, 
                    embed AI directly into the learning context where students already work
                  </BulletPoint>
                </ul>

                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
                  "Good artists copy; great artists steal. Great teachers don't reinvent the wheel—they enhance it."
                  <br />— Adapted from Pablo Picasso
                </blockquote>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module1"
                questionId="resource-awareness"
                question="Do you regularly use existing online educational resources in your teaching?"
                options={[
                  "Yes, I actively search for and use quality resources",
                  "Sometimes, but I'm not sure where to find good ones",
                  "Rarely, I prefer to create my own materials",
                  "I'd like to, but don't know how to evaluate resource quality"
                ]}
              />
            </CollapsibleSection>

            {/* Module 2: The Enhancement Framework */}
            <CollapsibleSection
              title="The AI Enhancement Framework: Don't Recreate, Augment"
              icon="🚀"
              isOpen={openSections.module2}
              onToggle={() => toggleSection("module2")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground text-lg leading-relaxed">
                    <strong>The most effective use of AI in education is enhancement, not recreation.</strong> 
                    Combine proven resources with AI's capabilities for personalization, interaction, and feedback. 
                    This is evolution—amplifying expertise rather than replacing it.
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg space-y-4">
                  <h4 className="text-2xl font-semibold text-foreground mb-3">Reflect First: What Resources Do You Use?</h4>
                  <div className="space-y-3">
                    <p className="text-foreground text-lg leading-relaxed">
                      Before thinking about AI solutions, ask yourself:
                    </p>
                    <ul className="space-y-2 list-none">
                      <BulletPoint icon="📖">
                        <strong>What existing resources do you already recommend to students?</strong> 
                        (Textbooks, websites, reference materials, online tools)
                      </BulletPoint>
                      <BulletPoint icon="🎯">
                        <strong>What do students struggle with when using these resources?</strong> 
                        (Too much information? No feedback? Difficulty applying knowledge?)
                      </BulletPoint>
                      <BulletPoint icon="💡">
                        <strong>If you could add ONE interactive feature, what would it be?</strong> 
                        (Practice exercises? Personalized examples? Instant feedback?)
                      </BulletPoint>
                    </ul>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mt-6 mb-3">The Two-Part Enhancement Approach</h4>
                  <p className="text-foreground text-lg leading-relaxed mb-4">
                    <strong>Move from guidance to independence:</strong> This two-part approach preserves the original 
                    resource's structure while adding interactive capabilities that help students progress from scaffolded 
                    practice to independent application.
                  </p>
                </div>

                <ul className="space-y-4 list-none">
                  <BulletPoint icon="1️⃣">
                    <strong>Part 1: Template Application & Guided Practice</strong><br />
                    Start by helping students understand and use the templates from the original resource. AI generates 
                    discipline-specific example sentences using the Phrasebank templates, showing students how the phrases 
                    work in their field of study. This is followed by <strong>imitation exercises</strong> where students 
                    practice applying the same templates to their own topics, building confidence through structured practice.
                  </BulletPoint>
                  <BulletPoint icon="2️⃣">
                    <strong>Part 2: Pattern Recognition & Application to Student Writing</strong><br />
                    Once students understand the templates, help them identify patterns in real academic writing. Students 
                    submit model texts (from their readings or own drafts), and AI analyzes them using the Phrasebank framework—identifying 
                    which categories and functions appear in the text. The system then generates <strong>targeted exercises</strong> 
                    based on the identified patterns, helping students recognize and apply these structures in context.
                  </BulletPoint>
                </ul>

                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg mt-4 border-2 border-primary/20">
                  <h5 className="text-xl font-bold text-foreground mb-3">🎯 Core Principle: Guidance to Independence</h5>
                  <p className="text-foreground leading-relaxed font-medium mb-3">
                    First, provide scaffolded examples and structured practice (Part 1). Then, help students recognize 
                    and apply patterns in authentic contexts (Part 2). This progression mirrors effective pedagogy while 
                    leveraging AI's ability to personalize content and provide instant feedback.
                  </p>
                  <p className="text-foreground leading-relaxed">
                    <strong>AI augments rather than replaces</strong> the original resource's pedagogical structure. 
                    Expert-crafted frameworks remain the foundation; AI adds interactivity, personalization, and practice 
                    opportunities that static resources cannot provide.
                  </p>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mt-6 mb-3">Academic Phrasebank Enhancement: A Case Study</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    The original Academic Phrasebank is organized into <strong>section-specific functions</strong> (introducing work, 
                    referring to sources, describing methods, etc.) and <strong>general language functions</strong> (being cautious, 
                    comparing, defining terms, etc.). This expert-crafted framework provides the structure; AI adds interactivity 
                    and personalization.
                  </p>
                </div>

                <div className="prose prose-lg max-w-none mt-4">
                  <p className="text-foreground text-lg leading-relaxed mb-4">
                    <strong>How does the AI-enhanced version work?</strong>
                  </p>
                </div>

                <ul className="space-y-3 list-none">
                  <BulletPoint icon="📝">
                    <strong>Part 1 - Template Generation:</strong> Select a category and your discipline. AI generates 
                    discipline-specific examples using Phrasebank templates, then provides imitation exercises.
                  </BulletPoint>
                  <BulletPoint icon="🔍">
                    <strong>Part 2 - Text Analysis:</strong> Paste a model paragraph. AI analyzes it using the Phrasebank 
                    framework and generates targeted exercises based on identified patterns.
                  </BulletPoint>
                  <BulletPoint icon="🎯">
                    <strong>Personalization & Context:</strong> Every interaction is customized with discipline-specific 
                    examples and analysis of your actual texts. AI is embedded in the learning context, not a separate chatbot.
                  </BulletPoint>
                </ul>

                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
                  "Standing on the shoulders of giants means using what experts have built, then reaching even higher. 
                  AI lets us amplify expert knowledge without replacing expert judgment."
                </blockquote>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg mt-6">
                  <h5 className="text-lg font-semibold text-foreground mb-3">
                    ⚠️ Quality Control: Are AI-Generated Sentences Reliable?
                  </h5>
                  <p className="text-foreground leading-relaxed mb-3">
                    This is a valid concern. When using AI-enhanced resources, consider:
                  </p>
                  <ul className="list-disc list-inside text-foreground space-y-2">
                    <li>AI generates examples based on patterns—review and validate outputs</li>
                    <li>Use AI as a starting point, not a final authority</li>
                    <li>Combine AI suggestions with expert judgment and peer review</li>
                    <li>The framework provides structure, but human evaluation is essential</li>
                  </ul>
                </div>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module2"
                questionId="enhancement-understanding"
                question="Which part of the two-part enhancement approach resonates most with your teaching needs?"
                options={[
                  "Part 1 - Students need guided practice with templates and examples",
                  "Part 2 - Students need help recognizing patterns in authentic texts",
                  "Both - Students need structured progression from guidance to independence",
                  "I can see applying this approach to other resources I use"
                ]}
              />

              <div className="mt-6 bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground text-lg mb-2">📚 Further Reading</h4>
                <ul className="space-y-2 text-base text-muted-foreground">
                  <li>
                    • <a href="https://www.phrasebank.manchester.ac.uk/about/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      About the Manchester Academic Phrasebank
                    </a>
                  </li>
                </ul>
              </div>
            </CollapsibleSection>

            {/* Module 3: Try the Enhanced Version */}
            <CollapsibleSection
              title="Try It Yourself: The AI-Enhanced Academic Phrasebank"
              icon="🎨"
              isOpen={openSections.module3}
              onToggle={() => toggleSection("module3")}
            >
              <div className="space-y-8">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground text-lg leading-relaxed">
                    Now experience the difference between the original static resource and an AI-enhanced version. 
                    The <strong>Academic Phrasebank Assistant</strong> demonstrates the two-part enhancement approach while 
                    preserving the original Phrasebank's structure and expert-crafted content.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-xl border-2 border-border/50">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    Step 1: Explore the Original
                  </h4>
                  <p className="text-foreground mb-4">
                    If you haven't already, visit the original Academic Phrasebank and explore a category like 
                    "Introducing Work" or "Being Cautious." Notice:
                  </p>
                  <ul className="space-y-2 list-none mb-4">
                    <BulletPoint icon="📖">
                      How information is organized (categories → subcategories → examples)
                    </BulletPoint>
                    <BulletPoint icon="🔍">
                      The comprehensive coverage of academic functions
                    </BulletPoint>
                    <BulletPoint icon="📋">
                      The static, reference-style presentation
                    </BulletPoint>
                  </ul>
                  <a 
                    href="https://www.phrasebank.manchester.ac.uk/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Original Academic Phrasebank
                    </Button>
                  </a>
                </div>

                <div className="border-t border-border pt-8">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    Step 2: Try the AI-Enhanced Version
                  </h4>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl space-y-4 mb-6">
                    <h5 className="text-xl font-semibold text-foreground">What to Try:</h5>
                    <ul className="space-y-3 list-none">
                      <BulletPoint icon="1️⃣">
                        <strong>Part 1 - Template Generation:</strong> Select a category (e.g., "Introducing Work") 
                        and your discipline. The AI generates discipline-specific example sentences and provides 
                        imitation exercises for you to practice.
                      </BulletPoint>
                      <BulletPoint icon="2️⃣">
                        <strong>Part 2 - Text Analysis:</strong> Paste a paragraph from an academic text in your field. 
                        The AI analyzes it using the Phrasebank framework, identifies patterns, and generates 
                        targeted exercises based on what it finds.
                      </BulletPoint>
                      <BulletPoint icon="3️⃣">
                        <strong>Conversational Exploration:</strong> Ask questions like "How do I introduce a research 
                        gap in Biology?" and get contextual guidance instead of browsing static categories.
                      </BulletPoint>
                      <BulletPoint icon="4️⃣">
                        <strong>Community Learning:</strong> Browse the bulletin board to see how others are using 
                        academic phrases in different disciplines.
                      </BulletPoint>
                    </ul>
                  </div>

                  <Link to="/academic-phrasebank">
                    <Button size="lg" className="w-full">
                      🚀 Open Academic Phrasebank Assistant
                    </Button>
                  </Link>

                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    The app will open in a new tab. Try using it for 5-10 minutes, then return to complete this lesson.
                  </p>

                  <div className="bg-muted/50 p-4 rounded-lg mt-4">
                    <p className="text-sm text-foreground">
                      <strong>Note:</strong> AI responses may occasionally take longer due to API 
                      limitations, and text analysis may not always work perfectly. If you encounter 
                      issues, try refreshing or simplifying your input.
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-8">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    Step 3: Reflection Questions
                  </h4>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg space-y-4">
                    <p className="text-foreground">
                      After trying both versions, consider:
                    </p>
                    <ul className="space-y-3 list-none">
                      <BulletPoint icon="❓">
                        Which version would your students find more useful? Why?
                      </BulletPoint>
                      <BulletPoint icon="🎯">
                        What features of the AI-enhanced version address limitations of the static site?
                      </BulletPoint>
                      <BulletPoint icon="💭">
                        What other educational resources you use could benefit from similar enhancement?
                      </BulletPoint>
                    </ul>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Module 4: Lesson Summary & Reflection */}
            <CollapsibleSection
              title="Lesson Summary & Applying This Framework"
              icon="🎓"
              isOpen={openSections.module4}
              onToggle={() => toggleSection("module4")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">Key Takeaways</h4>
                  <ul className="space-y-3 list-none">
                    <BulletPoint icon="📚">
                      <strong>Leverage Existing Quality:</strong> Excellent educational resources already exist. 
                      Don't recreate from scratch—find, evaluate, and enhance what experts have built. This is 
                      <strong> evolution, not revolution</strong>.
                    </BulletPoint>
                    <BulletPoint icon="🔄">
                      <strong>Two-Part Enhancement Approach:</strong> Move from guidance to independence. First, 
                      help students understand templates through guided examples and imitation. Then, help them 
                      recognize patterns in authentic texts and apply them through targeted practice.
                    </BulletPoint>
                    <BulletPoint icon="🎯">
                      <strong>Context Over Chatbot:</strong> Embed AI directly into the learning context rather than 
                      directing students to separate AI chatbots. Bring AI to where students already work.
                    </BulletPoint>
                    <BulletPoint icon="🔬">
                      <strong>AI as Amplifier:</strong> AI transforms static resources into dynamic learning tools 
                      while maintaining pedagogical soundness. It amplifies expertise, doesn't replace it.
                    </BulletPoint>
                    <BulletPoint icon="🚀">
                      <strong>Practical Application:</strong> The Academic Phrasebank case study shows this framework 
                      in action—same content, dramatically enhanced learning experience.
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
                      "Very useful - I have ideas for resources to enhance",
                      "Useful - I understand the framework",
                      "Somewhat useful - Need more examples from other domains",
                      "Not useful - I prefer creating original materials"
                    ]}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg space-y-4">
                  <h4 className="text-2xl font-semibold text-foreground">Final Reflection</h4>
                  <OpenEndedReflection
                    lessonSlug={lessonSlug}
                    sectionId="module4"
                    questionId="resource-enhancement-plan"
                    question="Identify one existing educational resource you use (textbook, website, reference tool, etc.) and describe how you might enhance it using the two-part approach. How could Part 1 (template application & guided practice) and Part 2 (pattern recognition in authentic contexts) improve student learning with your chosen resource?"
                  />
                </div>

                <div className="bg-muted/50 p-6 rounded-lg">
                  <h4 className="text-xl font-semibold text-foreground mb-3">🎯 Applying This Framework to Other Resources</h4>
                  <p className="text-foreground mb-4">
                    The same approach works for many types of educational resources:
                  </p>
                  <ul className="space-y-3 list-none">
                    <BulletPoint icon="📖">
                      <strong>Textbooks:</strong> Add interactive problem-solving, adaptive practice, real-time feedback
                    </BulletPoint>
                    <BulletPoint icon="📊">
                      <strong>Data Visualizations:</strong> Enable exploration, what-if scenarios, personalized insights
                    </BulletPoint>
                    <BulletPoint icon="🧪">
                      <strong>Lab Protocols:</strong> Add troubleshooting assistance, safety reminders, technique coaching
                    </BulletPoint>
                    <BulletPoint icon="📝">
                      <strong>Writing Guides:</strong> Provide genre-specific examples, analyze student drafts, suggest improvements
                    </BulletPoint>
                    <BulletPoint icon="🗺️">
                      <strong>Reference Materials:</strong> Transform lookup tools into conversational assistants with contextual help
                    </BulletPoint>
                  </ul>
                </div>
              </div>
            </CollapsibleSection>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default LeverageEducationalResources;

