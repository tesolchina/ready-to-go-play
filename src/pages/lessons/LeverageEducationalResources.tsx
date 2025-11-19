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
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                    Lesson 3
                  </span>
                </div>
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
                  <h4 className="text-2xl font-semibold text-foreground mb-4">Hidden Gems in Education</h4>
                  <p className="text-foreground text-lg leading-relaxed">
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
                    while preserving the original pedagogical structure
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
                    <strong>The most effective use of AI in education is not creating everything from scratch, 
                    but enhancing proven resources.</strong> This approach combines the expertise embedded in existing 
                    materials with AI's capability for personalization, interaction, and feedback.
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
                  <h4 className="text-2xl font-semibold text-foreground mt-6 mb-3">The Three-Layer Enhancement Model</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    When enhancing existing resources with AI, think in three layers:
                  </p>
                </div>

                <ul className="space-y-3 list-none">
                  <BulletPoint icon="1️⃣">
                    <strong>Layer 1: Preserve the Knowledge Structure</strong><br />
                    Keep the original organization, categories, and pedagogical logic. In the Academic Phrasebank 
                    case, we maintain the moves/steps structure and general language functions. The expert knowledge 
                    remains intact.
                  </BulletPoint>
                  <BulletPoint icon="2️⃣">
                    <strong>Layer 2: Add Interactivity</strong><br />
                    Transform passive browsing into active engagement. Instead of reading examples, students can ask 
                    questions, request discipline-specific phrases, and explore connections between categories. 
                    AI handles the conversational interface.
                  </BulletPoint>
                  <BulletPoint icon="3️⃣">
                    <strong>Layer 3: Enable Personalized Practice</strong><br />
                    Create activities that weren't possible before: analyze student writing to identify which phrases 
                    they need, generate custom exercises based on their discipline, provide feedback on phrase usage 
                    in context. AI enables scale and personalization.
                  </BulletPoint>
                </ul>

                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mt-6 mb-3">Academic Phrasebank Enhancement: A Case Study</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    The original Academic Phrasebank is organized into:
                  </p>
                </div>

                <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">📝 Section-Specific Functions (Moves/Steps)</h5>
                    <ul className="text-sm text-foreground space-y-1 ml-6 list-disc">
                      <li>Introducing work</li>
                      <li>Referring to sources</li>
                      <li>Describing methods</li>
                      <li>Reporting results</li>
                      <li>Discussing findings</li>
                      <li>Writing conclusions</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">🔤 General Language Functions</h5>
                    <ul className="text-sm text-foreground space-y-1 ml-6 list-disc">
                      <li>Being cautious (hedging)</li>
                      <li>Being critical</li>
                      <li>Classifying and listing</li>
                      <li>Comparing and contrasting</li>
                      <li>Defining terms</li>
                      <li>Describing trends</li>
                      <li>Explaining causality</li>
                      <li>Giving examples</li>
                      <li>And more...</li>
                    </ul>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground text-lg leading-relaxed">
                    The AI-enhanced version maintains this exact structure but adds:
                  </p>
                </div>

                <ul className="space-y-3 list-none">
                  <BulletPoint icon="💬">
                    <strong>Conversational Interface:</strong> Students can ask "How do I introduce a research gap?" 
                    instead of browsing categories
                  </BulletPoint>
                  <BulletPoint icon="🎓">
                    <strong>Discipline Customization:</strong> Phrases adapted for Biology, Engineering, Education, 
                    etc.—something impossible to pre-create for all fields
                  </BulletPoint>
                  <BulletPoint icon="📊">
                    <strong>Paragraph Analysis:</strong> Students paste their writing, AI identifies which Phrasebank 
                    categories apply and suggests relevant phrases
                  </BulletPoint>
                  <BulletPoint icon="🤝">
                    <strong>Community Learning:</strong> Students share examples and learn from each other's questions, 
                    building a living resource
                  </BulletPoint>
                </ul>

                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
                  "Standing on the shoulders of giants means using what experts have built, then reaching even higher. 
                  AI lets us amplify expert knowledge without replacing expert judgment."
                </blockquote>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module2"
                questionId="enhancement-understanding"
                question="Which layer of enhancement would be most valuable for resources you currently use?"
                options={[
                  "Preserving structure - I need to organize scattered resources",
                  "Adding interactivity - My students need more engagement",
                  "Enabling personalization - Students need customized examples",
                  "All three - I can see applying this framework"
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
                  <li>
                    • <a href="https://er.educause.edu/articles/2023/8/augmenting-not-replacing-the-role-of-ai-in-education" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Augmenting, Not Replacing: The Role of AI in Education (EDUCAUSE, 2023)
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
                    The <strong>Academic Phrasebank Assistant</strong> demonstrates all three enhancement layers while 
                    preserving the original Phrasebank's structure and content.
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
                        <strong>Conversational Query:</strong> Ask "How do I introduce a research gap in Biology?" 
                        Compare the response to browsing the static site.
                      </BulletPoint>
                      <BulletPoint icon="2️⃣">
                        <strong>Discipline Customization:</strong> Select your discipline and get field-specific phrases. 
                        Try switching disciplines to see personalization.
                      </BulletPoint>
                      <BulletPoint icon="3️⃣">
                        <strong>Paragraph Analysis:</strong> Paste a paragraph from a journal article in your field. 
                        The AI will identify which Phrasebank categories are being used.
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
                      Don't recreate from scratch—find, evaluate, and enhance what experts have built.
                    </BulletPoint>
                    <BulletPoint icon="🔄">
                      <strong>Three-Layer Enhancement:</strong> Preserve knowledge structure, add interactivity, 
                      enable personalization. Each layer builds on the previous one.
                    </BulletPoint>
                    <BulletPoint icon="🎯">
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
                    question="Identify one existing educational resource you use (textbook, website, reference tool, etc.) and describe how you might enhance it using the three-layer framework. What would each layer add for your students?"
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

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-bold text-foreground">🎯 Next Steps</h3>
                <p className="text-muted-foreground text-lg">
                  Choose one educational resource you currently recommend to students. This week, spend 30 minutes 
                  brainstorming how each of the three enhancement layers could improve student learning. Start with 
                  Layer 1 (structure), then imagine Layer 2 (interactivity), then dream about Layer 3 (personalization). 
                  Share your ideas with a colleague or in a teaching community.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <Link to="/lessons">
                    <Button variant="outline">
                      Back to Lessons
                    </Button>
                  </Link>
                  <Link to="/academic-phrasebank">
                    <Button>
                      Try the Phrasebank Assistant
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

export default LeverageEducationalResources;

