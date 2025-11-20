import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { ComprehensionCheck } from "@/components/ComprehensionCheck";
import { BulletPoint } from "@/components/BulletPoint";
import { OpenEndedReflection } from "@/components/OpenEndedReflection";
import { supabase } from "@/integrations/supabase/client";

const VibeCodingRevised = () => {
  const { toast } = useToast();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    module1: false,
    module2: false,
    module3: false,
    module4: false,
  });

  const lessonSlug = "vibe-coding";

  useEffect(() => {
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
                <h1 className="text-5xl font-bold">
                  Vibe Coding: AI Generates Code for You
                </h1>
                <p className="text-2xl text-muted-foreground">
                  Automating Repetitive Tasks and Leveraging Computing Resources at Scale
                </p>
              </div>
            </div>

            {/* Module 1: Beyond Natural Language */}
            <CollapsibleSection
              title="Beyond Natural Language: Why Code Matters"
              icon="💬"
              isOpen={openSections.module1}
              onToggle={() => toggleSection("module1")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">Natural Language: For Humans, Not Machines</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    When ChatGPT launched, the world marveled at how naturally it conversed. But here's the paradox: 
                    <strong> natural language evolved for human-to-human communication, not for human-to-machine communication.</strong>
                  </p>
                  <p className="text-foreground text-lg leading-relaxed mt-4">
                    When you want AI to create a diagram, analyze data, or automate a process, describing it in English 
                    is inefficient. What if instead, you could ask AI to generate the <strong>precise instructions machines 
                    understand</strong>—programming code?
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <h5 className="text-xl font-semibold text-foreground mb-3">Quick Example: Reference Validation</h5>
                  <div className="space-y-4">
                    <div>
                      <p className="text-foreground font-semibold mb-2">❌ Manual Process:</p>
                      <div className="bg-muted p-3 rounded text-sm italic">
                        Checking 20 references manually: copy each DOI, visit Crossref website, search, verify, repeat...
                      </div>
                      <p className="text-muted-foreground text-sm mt-2">
                        20+ minutes of repetitive clicking and copying
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-foreground font-semibold mb-2">✅ With Code Automation:</p>
                      <div className="bg-muted p-3 rounded text-sm italic">
                        Code parses references, sends each DOI to Crossref API automatically, validates all 20 references
                      </div>
                      <p className="text-muted-foreground text-sm mt-2">
                        10 seconds of automated processing
                      </p>
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 list-none">
                  <BulletPoint icon="🗣️">
                    <strong>Natural Language = Human Interface:</strong> Ambiguous, context-dependent, imprecise
                  </BulletPoint>
                  <BulletPoint icon="💻">
                    <strong>Programming Language = Machine Interface:</strong> Precise, unambiguous, executable
                  </BulletPoint>
                  <BulletPoint icon="🌉">
                    <strong>AI as Bridge:</strong> You speak natural language, AI translates to code, machines execute
                  </BulletPoint>
                  <BulletPoint icon="🚀">
                    <strong>The Insight:</strong> Stop asking AI to *describe* what to do. Ask AI to *generate code* that does it.
                  </BulletPoint>
                </ul>

                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
                  "The future isn't making machines talk like humans, but teaching humans to leverage what machines do best: 
                  executing precise instructions at scale."
                </blockquote>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module1"
                questionId="nl-limitation"
                question="Why is natural language limiting when working with AI?"
                options={[
                  "Natural language is ambiguous and forces manual execution",
                  "AI doesn't understand natural language well enough",
                  "Programming languages are easier to use",
                  "Natural language is only for simple conversations"
                ]}
              />
            </CollapsibleSection>

            {/* Module 2: Automating Repetitive Tasks */}
            <CollapsibleSection
              title="Automation: Parsing Multiple References"
              icon="🔄"
              isOpen={openSections.module2}
              onToggle={() => toggleSection("module2")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">The Power of Automation</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    Imagine you need to validate 20 academic references. Manually checking each one means copying DOIs, 
                    visiting websites, searching databases—repetitive work that takes 20+ minutes. <strong>With code, 
                    this becomes automated.</strong>
                  </p>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-xl border-2">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    Example: Reference Validator Workflow
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="bg-background p-4 rounded border">
                      <p className="text-sm font-semibold mb-2">Step 1: Parse the Input</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Code reads a reference list and splits it into individual lines automatically:
                      </p>
                      <pre className="text-xs overflow-x-auto bg-muted p-2 rounded">
{`Input: "Russell, B. (1970). Autobiography.
Smith, J. (2020). AI in Education. DOI: 10.1234/abc"

Code splits by newline → creates array:
["Russell, B. (1970). Autobiography.",
 "Smith, J. (2020). AI in Education. DOI: 10.1234/abc"]`}
                      </pre>
                    </div>

                    <div className="bg-background p-4 rounded border">
                      <p className="text-sm font-semibold mb-2">Step 2: Extract Key Information</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Code identifies patterns like DOIs, URLs, author names:
                      </p>
                      <pre className="text-xs overflow-x-auto bg-muted p-2 rounded">
{`Reference 1: No DOI found → needs database search
Reference 2: DOI found → "10.1234/abc"`}
                      </pre>
                    </div>

                    <div className="bg-background p-4 rounded border">
                      <p className="text-sm font-semibold mb-2">Step 3: Process Each Reference</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Code loops through all references automatically:
                      </p>
                      <pre className="text-xs overflow-x-auto bg-muted p-2 rounded">
{`for each reference in references:
    if DOI found:
        validate_via_crossref(DOI)
    else:
        search_database(reference)
    save_result()`}
                      </pre>
                    </div>
                  </div>

                  <div className="mt-4 bg-green-50 dark:bg-green-900/20 p-4 rounded">
                    <p className="text-sm font-semibold text-foreground mb-2">💡 The Key Insight:</p>
                    <p className="text-sm text-muted-foreground">
                      What takes you 20+ minutes of manual clicking now happens in seconds. Code handles the repetitive work—
                      splitting text, extracting patterns, processing each item—automatically.
                    </p>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">Why This Matters for Teachers</h4>
                  <ul className="space-y-3 list-none">
                    <BulletPoint icon="🔄">
                      <strong>Automation of Repetitive Tasks:</strong> Instead of manually checking references one by one, 
                      code processes all of them simultaneously
                    </BulletPoint>
                    <BulletPoint icon="📊">
                      <strong>Scalability:</strong> Validating 5 references or 500 references takes the same effort—just change the input
                    </BulletPoint>
                    <BulletPoint icon="⚡">
                      <strong>Speed:</strong> What takes humans minutes takes code seconds
                    </BulletPoint>
                    <BulletPoint icon="🎯">
                      <strong>Consistency:</strong> Code follows the same logic for every reference, no human error
                    </BulletPoint>
                  </ul>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    🎯 Try It Yourself
                  </h4>
                  <p className="text-foreground mb-4">
                    Visit our <Link to="/learning-apps/validate-references" className="text-primary hover:underline font-semibold">
                    Reference Validator app</Link> to see automation in action. Paste multiple references and watch 
                    how code processes them automatically.
                  </p>
                  <Link to="/learning-apps/validate-references">
                    <Button className="w-full">
                      Try Reference Validator →
                    </Button>
                  </Link>
                </div>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module2"
                questionId="automation-understanding"
                question="What is the main advantage of using code to parse and process multiple references?"
                options={[
                  "It automates repetitive tasks and scales easily to handle many items",
                  "Code is more accurate at reading text than humans",
                  "It creates better-looking output",
                  "It's easier to learn than manual checking"
                ]}
              />
            </CollapsibleSection>

            {/* Module 3: API Integration */}
            <CollapsibleSection
              title="Leveraging External Resources: APIs"
              icon="🌐"
              isOpen={openSections.module3}
              onToggle={() => toggleSection("module3")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">What is an API?</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    An <strong>API (Application Programming Interface)</strong> is how programs talk to each other. 
                    When you use code, you can access vast external resources—databases, computational tools, research 
                    repositories—that would be impossible to access manually at scale.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border-2">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    Example: Validating a DOI via Crossref API
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold mb-2">Manual Process:</p>
                      <div className="bg-muted p-3 rounded text-sm">
                        <p className="mb-2">1. Copy DOI: "10.1234/abc"</p>
                        <p className="mb-2">2. Open browser → go to crossref.org</p>
                        <p className="mb-2">3. Find search box → paste DOI → click search</p>
                        <p className="mb-2">4. Review results → verify title and authors match</p>
                        <p className="text-muted-foreground mt-2">⏱️ Time: 1-2 minutes per reference</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-2">✅ With API (Automated via Code):</p>
                      <div className="bg-background p-3 rounded border">
                        <pre className="text-xs">{`# Send DOI to Crossref API
response = fetch("https://api.crossref.org/works/10.1234/abc")
data = response.json()

# Extract information
title = data['title']
authors = data['author']
verified = compare(title, authors, original_reference)

# Result: Verified ✓ in 0.5 seconds`}</pre>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-green-50 dark:bg-green-900/20 p-4 rounded">
                    <p className="text-sm font-semibold text-foreground mb-2">🔑 The API Advantage:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>Direct access:</strong> No browser, no clicking, just data</li>
                      <li>• <strong>Machine-readable format:</strong> Data comes structured (JSON), ready to process</li>
                      <li>• <strong>Scalable:</strong> Send 100 DOIs? Same code, same speed</li>
                      <li>• <strong>Free computing resources:</strong> Crossref's servers do the work</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-xl border-2">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    Multiple APIs: Searching Research Databases
                  </h4>
                  
                  <p className="text-sm text-foreground mb-4">
                    What if a reference has no DOI? The Reference Validator uses multiple APIs:
                  </p>

                  <div className="space-y-3">
                    <div className="bg-background p-3 rounded border">
                      <p className="text-sm font-semibold mb-1">1. Semantic Scholar API</p>
                      <p className="text-xs text-muted-foreground">
                        Search 200+ million academic papers by title, author, keyword
                      </p>
                    </div>

                    <div className="bg-background p-3 rounded border">
                      <p className="text-sm font-semibold mb-1">2. PubMed API</p>
                      <p className="text-xs text-muted-foreground">
                        Access 35+ million biomedical research citations
                      </p>
                    </div>

                    <div className="bg-background p-3 rounded border">
                      <p className="text-sm font-semibold mb-1">3. Google Scholar (via web search)</p>
                      <p className="text-xs text-muted-foreground">
                        Broader academic search as a fallback
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                    <p className="text-sm text-muted-foreground">
                      💡 Code automatically tries each API until it finds a match—what would take you 5-10 minutes 
                      manually happens in 2 seconds automatically.
                    </p>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mt-6 mb-3">The Scale Advantage</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    Once you start using APIs, you're no longer limited by your own time or computing power. You're 
                    <strong> leveraging massive computing resources and databases</strong>—resources that would be 
                    impossible to access manually at scale.
                  </p>
                  
                  <ul className="space-y-3 list-none mt-4">
                    <BulletPoint icon="🌐">
                      <strong>Global databases:</strong> Access millions of research papers instantly
                    </BulletPoint>
                    <BulletPoint icon="⚡">
                      <strong>Distributed computing:</strong> External servers do the heavy computational work
                    </BulletPoint>
                    <BulletPoint icon="🔄">
                      <strong>Real-time updates:</strong> Always accessing the latest data
                    </BulletPoint>
                    <BulletPoint icon="💰">
                      <strong>Free resources:</strong> Most academic APIs are free for educational use
                    </BulletPoint>
                  </ul>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    🎯 See It in Action
                  </h4>
                  <p className="text-foreground mb-4">
                    Try validating references with and without DOIs in our Reference Validator. Notice how it 
                    automatically uses different APIs depending on what information is available.
                  </p>
                  <Link to="/learning-apps/validate-references">
                    <Button className="w-full">
                      Test API Integration →
                    </Button>
                  </Link>
                </div>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module3"
                questionId="api-advantage"
                question="What is the main advantage of using APIs for reference validation?"
                options={[
                  "Access to vast external databases and computing resources at scale",
                  "APIs are easier to understand than websites",
                  "APIs make prettier output",
                  "APIs are more accurate than manual checking"
                ]}
              />
            </CollapsibleSection>

            {/* Module 4: Teaching Applications */}
            <CollapsibleSection
              title="Apply to Your Teaching"
              icon="🎓"
              isOpen={openSections.module4}
              onToggle={() => toggleSection("module4")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground text-lg leading-relaxed">
                    Vibe coding isn't about becoming a programmer—it's about <strong>using AI to automate teaching tasks</strong>. 
                    Here are practical examples:
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border-2">
                    <h5 className="text-xl font-semibold text-foreground mb-3">
                      ✅ Validate Student References
                    </h5>
                    <p className="text-sm text-foreground mb-2">
                      <strong>Task:</strong> Check if 100 student references are accurate and properly cited.
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Vibe Coding + APIs:</strong> Code parses each reference, extracts DOIs, sends them to 
                      Crossref API, searches Semantic Scholar for non-DOI refs, generates validation report.
                    </p>
                    <p className="text-xs text-primary font-semibold">
                      💡 Manual: 2+ hours → With code: 2 minutes
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-xl border-2">
                    <h5 className="text-xl font-semibold text-foreground mb-3">
                      📊 Analyze Academic Patterns
                    </h5>
                    <p className="text-sm text-foreground mb-2">
                      <strong>Task:</strong> Find common phrase patterns in 50 model essays for teaching writing.
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Vibe Coding + APIs:</strong> Code analyzes text, identifies linguistic patterns, 
                      uses NLP APIs for semantic analysis, generates categorized phrase templates.
                    </p>
                    <p className="text-xs text-primary font-semibold">
                      💡 Leverages external NLP computing resources you don't own
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl border-2">
                    <h5 className="text-xl font-semibold text-foreground mb-3">
                      🔍 Research Literature Review
                    </h5>
                    <p className="text-sm text-foreground mb-2">
                      <strong>Task:</strong> Find and summarize recent research on a topic across multiple databases.
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Vibe Coding + APIs:</strong> Code queries Semantic Scholar, PubMed, and arXiv APIs 
                      simultaneously, downloads metadata, extracts abstracts, creates comparative summary.
                    </p>
                    <p className="text-xs text-primary font-semibold">
                      💡 Access to 250+ million papers you couldn't manually search
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border-2">
                    <h5 className="text-xl font-semibold text-foreground mb-3">
                      📚 Build Custom Corpora
                    </h5>
                    <p className="text-sm text-foreground mb-2">
                      <strong>Task:</strong> Collect 1000 discipline-specific academic texts for analysis.
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Vibe Coding + APIs:</strong> Code uses web APIs to search academic repositories, 
                      filters by discipline and date, downloads open-access papers, organizes into corpus.
                    </p>
                    <p className="text-xs text-primary font-semibold">
                      💡 Impossible to do manually at this scale
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-lg">
                  <h5 className="text-xl font-semibold text-foreground mb-3">The Pattern: Scale and Resources</h5>
                  <p className="text-foreground mb-4">
                    These tasks share a common theme: <strong>they require computing resources and scale beyond what 
                    you can do manually.</strong>
                  </p>
                  <ul className="space-y-2 list-none">
                    <BulletPoint icon="🌐">
                      <strong>External databases</strong> (millions of academic papers you can't manually search)
                    </BulletPoint>
                    <BulletPoint icon="⚡">
                      <strong>Computing power</strong> (processing thousands of items in seconds)
                    </BulletPoint>
                    <BulletPoint icon="🔄">
                      <strong>Automation</strong> (repetitive tasks that don't require human judgment)
                    </BulletPoint>
                    <BulletPoint icon="📊">
                      <strong>Data at scale</strong> (analyzing patterns across hundreds of documents)
                    </BulletPoint>
                  </ul>
                </div>

                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
                  "Vibe coding + APIs = Access to computing resources at scale. You're not just automating tasks—you're 
                  leveraging databases, servers, and computational tools that would be impossible to use manually."
                </blockquote>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module4"
                questionId="teaching-applications"
                question="What type of teaching tasks benefit most from vibe coding?"
                options={[
                  "Repetitive, time-consuming tasks requiring technical skills",
                  "Creative lesson planning and interaction",
                  "Grading subjective essays with feedback",
                  "Teaching grammar rules to students"
                ]}
              />
            </CollapsibleSection>

            {/* Summary */}
            <CollapsibleSection
              title="Lesson Summary & Next Steps"
              icon="🎓"
              isOpen={openSections.module4}
              onToggle={() => toggleSection("module4")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">Key Takeaways</h4>
                  <ul className="space-y-3 list-none">
                    <BulletPoint icon="💬">
                      <strong>Beyond Natural Language:</strong> Code automates what natural language only describes.
                    </BulletPoint>
                    <BulletPoint icon="🔄">
                      <strong>Automation:</strong> Parse and process multiple items simultaneously—code handles repetitive work.
                    </BulletPoint>
                    <BulletPoint icon="🌐">
                      <strong>API Integration:</strong> Access external databases and computing resources at scale.
                    </BulletPoint>
                    <BulletPoint icon="⚡">
                      <strong>Scale Advantage:</strong> Leverage resources you don't own—millions of papers, distributed computing, real-time data.
                    </BulletPoint>
                    <BulletPoint icon="🎓">
                      <strong>Teaching Empowerment:</strong> Vibe coding enables tasks that are impossible manually—validating hundreds of references, analyzing massive corpora, building custom datasets.
                    </BulletPoint>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg space-y-4">
                  <h4 className="text-2xl font-semibold text-foreground">Quick Feedback</h4>
                  <ComprehensionCheck
                    lessonSlug={lessonSlug}
                    sectionId="summary"
                    questionId="lesson-usefulness"
                    question="How likely are you to try vibe coding in your teaching?"
                    options={[
                      "Very likely - I have specific tasks to automate",
                      "Somewhat likely - Need more examples first",
                      "Unsure - Concerned about learning curve",
                      "Unlikely - Prefer traditional methods"
                    ]}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg space-y-4">
                  <h4 className="text-2xl font-semibold text-foreground">Final Reflection</h4>
                  <OpenEndedReflection
                    lessonSlug={lessonSlug}
                    sectionId="summary"
                    questionId="vibe-coding-application"
                    question="Identify one repetitive or time-consuming task in your teaching that you could automate using AI-generated code. Describe the task and what type of code might help."
                  />
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
                  <h5 className="text-xl font-semibold text-foreground mb-3">🚀 Coming Next: AI Agents</h5>
                  <p className="text-foreground mb-2">
                    You've learned how to ask AI to generate code. But what if AI could automatically plan tasks, 
                    access your files, write code, AND execute it autonomously?
                  </p>
                  <p className="text-muted-foreground text-sm">
                    In Lesson 5, discover how AI Agents take vibe coding to the next level with autonomous task execution.
                  </p>
                  <Link to="/lessons/ai-agents">
                    <Button className="mt-4" variant="outline">
                      Preview: AI Agents Lesson →
                    </Button>
                  </Link>
                </div>
              </div>
            </CollapsibleSection>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-bold text-foreground">🎯 Next Steps</h3>
                <p className="text-muted-foreground text-lg">
                  Try our <Link to="/learning-apps/validate-references" className="text-primary hover:underline font-semibold">
                  Reference Validator</Link> to see vibe coding + API integration in action. Notice how code automates 
                  parsing, sends requests to external databases, and processes results at scale—tasks that would be 
                  impossible to do manually with the same speed and accuracy.
                </p>
                <div className="flex justify-center gap-4">
                  <Link to="/lessons">
                    <Button variant="outline">
                      Back to Lessons
                    </Button>
                  </Link>
                  <Link to="/lessons/ai-agents">
                    <Button>
                      Next: AI Agents →
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

export default VibeCodingRevised;



