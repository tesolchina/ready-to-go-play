import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { ComprehensionCheck } from "@/components/ComprehensionCheck";
import { BulletPoint } from "@/components/BulletPoint";
import { OpenEndedReflection } from "@/components/OpenEndedReflection";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { supabase } from "@/integrations/supabase/client";

const VibeCoding = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    module1: false,
    module2: false,
    module3: false,
    module4: false,
  });

  const lessonSlug = "vibe-coding";

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
                    Lesson 4
                  </span>
                </div>
                <h1 className="text-5xl font-bold">
                  Vibe Coding: AI as a Bridge for Human-Machine Conversation
                </h1>
                <p className="text-2xl text-muted-foreground">
                  From Natural Language to Programming Languages: Teaching AI to Speak Machine
                </p>
              </div>
            </div>

            {/* Module 1: Beyond Natural Language */}
            <CollapsibleSection
              title="Beyond Natural Language: The Limits of Chat"
              icon="💬"
              isOpen={openSections.module1}
              onToggle={() => toggleSection("module1")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">Natural Language: For Humans, Not Machines</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    When ChatGPT launched in November 2022, the world marveled at how naturally it conversed. 
                    You could chat with AI in plain English, and it would respond thoughtfully. This <strong>natural 
                    language interaction</strong> felt revolutionary—no programming required, just conversation.
                  </p>
                  <p className="text-foreground text-lg leading-relaxed mt-4">
                    But here's the paradox: <strong>natural language evolved for human-to-human communication, not 
                    for human-to-machine communication.</strong> When we talk to computers, we're actually limiting 
                    their capabilities by forcing them to speak "human."
                  </p>
                  <p className="text-foreground text-lg leading-relaxed mt-4">
                    Think about it: If you want to create a diagram, analyze data, or automate a process, 
                    describing it in English is inefficient. You have to explain step-by-step what you want, 
                    hope the AI understands, and then manually execute the result. What if instead, you could 
                    ask AI to generate the <strong>precise instructions machines understand</strong>—programming code?
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <h5 className="text-xl font-semibold text-foreground mb-3">A Simple Example: Creating a Diagram</h5>
                  <div className="space-y-4">
                    <div>
                      <p className="text-foreground font-semibold mb-2">❌ Traditional Way (Natural Language):</p>
                      <div className="bg-muted p-3 rounded text-sm">
                        <p className="italic">"Can you help me create a flowchart showing the steps of writing a research paper? 
                        It should start with 'Choose topic', then 'Literature review', then 'Collect data', then 'Analysis', 
                        then 'Write draft', and finally 'Revise and submit'."</p>
                      </div>
                      <p className="text-muted-foreground text-sm mt-2">
                        AI gives you a text description... then you manually create the diagram using a tool.
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-foreground font-semibold mb-2">✅ Vibe Coding Way (Programming Language):</p>
                      <div className="bg-muted p-3 rounded text-sm">
                        <p className="italic">"Generate Mermaid code for a flowchart showing the research paper writing process."</p>
                      </div>
                      <p className="text-muted-foreground text-sm mt-2">
                        AI generates executable code → Your computer renders it immediately as a visual diagram.
                      </p>
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 list-none">
                  <BulletPoint icon="🗣️">
                    <strong>Natural Language = Human Interface:</strong> Evolved for human communication—ambiguous, 
                    context-dependent, imprecise but expressive
                  </BulletPoint>
                  <BulletPoint icon="💻">
                    <strong>Programming Language = Machine Interface:</strong> Designed for computers—precise, 
                    unambiguous, executable, but harder for humans to write
                  </BulletPoint>
                  <BulletPoint icon="🌉">
                    <strong>AI as Bridge:</strong> You speak natural language, AI translates to programming language, 
                    machines execute perfectly
                  </BulletPoint>
                  <BulletPoint icon="🚀">
                    <strong>The Insight:</strong> Stop asking AI to *describe* what to do. Ask AI to *generate code* 
                    that does it automatically.
                  </BulletPoint>
                </ul>

                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
                  "The future of human-computer interaction is not making machines talk like humans, 
                  but teaching humans to leverage what machines do best: executing precise instructions at scale."
                </blockquote>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module1"
                questionId="nl-limitation"
                question="Why is natural language limiting when working with AI?"
                options={[
                  "Natural language is ambiguous and forces manual execution of AI's suggestions",
                  "AI doesn't understand natural language well enough",
                  "Programming languages are easier to use than natural language",
                  "Natural language is only useful for simple conversations"
                ]}
              />
            </CollapsibleSection>

            {/* Module 2: Vibe Coding in Action */}
            <CollapsibleSection
              title="Vibe Coding in Action: From Mermaid to Python"
              icon="⚡"
              isOpen={openSections.module2}
              onToggle={() => toggleSection("module2")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground text-lg leading-relaxed">
                    <strong>Vibe Coding</strong> is the practice of using AI to generate programming code that 
                    machines can execute immediately. You provide the intent in natural language; AI provides 
                    executable code. Let's see this in action with progressively complex examples.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-xl border-2 border-border/50">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    Example 1: Mermaid Diagrams
                  </h4>
                  <p className="text-foreground mb-4">
                    Mermaid is a simple language for creating diagrams using text. Instead of describing 
                    a diagram, we ask AI to generate Mermaid code.
                  </p>
                  
                  <div className="bg-muted p-4 rounded mb-4">
                    <p className="text-sm font-semibold mb-2">Prompt to AI:</p>
                    <p className="text-sm italic">"Generate Mermaid code for a flowchart showing how students 
                    progress from reading input → comprehension → practice → feedback → mastery."</p>
                  </div>

                  <div className="bg-background p-4 rounded border">
                    <p className="text-sm font-semibold mb-2">AI Generates This Code:</p>
                    <pre className="text-xs overflow-x-auto bg-muted p-2 rounded">
{`graph TD
    A[Reading Input] --> B[Comprehension]
    B --> C[Practice]
    C --> D[Feedback]
    D --> E{Mastery Achieved?}
    E -->|Yes| F[Move to Next Topic]
    E -->|No| C`}
                    </pre>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-2">Result: Live Diagram</p>
                    <MermaidDiagram
                      chart={`graph TD
    A[Reading Input] --> B[Comprehension]
    B --> C[Practice]
    C --> D[Feedback]
    D --> E{Mastery Achieved?}
    E -->|Yes| F[Move to Next Topic]
    E -->|No| C`}
                    />
                  </div>

                  <p className="text-muted-foreground text-sm mt-4">
                    💡 Notice: You didn't draw anything. You described the concept, AI generated executable code, 
                    and the computer rendered the diagram instantly.
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    Example 2: The Strawberry Problem
                  </h4>
                  <p className="text-foreground mb-4">
                    A famous AI test: "How many times does the letter 'r' appear in the word 'strawberry'?" 
                    Many AI models get this wrong when using natural language reasoning. But with code generation...
                  </p>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold mb-2">❌ Natural Language Approach (Often Fails):</p>
                      <div className="bg-muted p-3 rounded text-sm">
                        <p className="italic">"How many times does 'r' appear in 'strawberry'?"</p>
                        <p className="mt-2">AI Response: "Let me think... s-t-r-a-w-b-e-r-r-y... I count 2 times."</p>
                        <p className="mt-2 text-red-500 font-semibold">Wrong! (Correct answer is 3)</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-2">✅ Vibe Coding Approach (Always Correct):</p>
                      <div className="bg-muted p-3 rounded text-sm">
                        <p className="italic">"Write Python code to count how many times 'r' appears in 'strawberry'."</p>
                        <div className="mt-2 bg-background p-2 rounded">
                          <pre className="text-xs">{`word = "strawberry"
letter = "r"
count = word.count(letter)
print(f"The letter '{letter}' appears {count} times in '{word}'")`}</pre>
                        </div>
                        <p className="mt-2 text-green-600 font-semibold">Output: The letter 'r' appears 3 times in 'strawberry' ✓</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mt-4">
                    💡 Key Insight: When AI generates and executes code, it doesn't "think" or "reason"—it 
                    uses precise computational tools that guarantee accuracy.
                  </p>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mt-6 mb-3">Why This Works</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    Large Language Models (LLMs) are trained on massive amounts of code from GitHub, Stack Overflow, 
                    and documentation. They've learned to translate natural language intent into programming syntax. 
                    When you ask for code generation, you're leveraging their strength—not forcing them to simulate 
                    human reasoning, which is where errors occur.
                  </p>
                </div>

                <ul className="space-y-3 list-none">
                  <BulletPoint icon="📊">
                    <strong>Visualizations:</strong> Mermaid, D3.js, matplotlib—generate code for charts, diagrams, 
                    graphs instead of describing them
                  </BulletPoint>
                  <BulletPoint icon="🔢">
                    <strong>Calculations:</strong> Let Python/JavaScript compute instead of asking AI to "do math" 
                    in natural language
                  </BulletPoint>
                  <BulletPoint icon="📝">
                    <strong>Data Processing:</strong> Generate scripts to analyze text, count patterns, extract 
                    information from documents
                  </BulletPoint>
                  <BulletPoint icon="🤖">
                    <strong>Automation:</strong> Create workflows, batch processes, repetitive tasks—all through 
                    generated code
                  </BulletPoint>
                </ul>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module2"
                questionId="vibe-coding-advantage"
                question="What is the main advantage of having AI generate code instead of natural language responses?"
                options={[
                  "Code is executable and produces precise, automated results",
                  "Code is easier to understand than natural language",
                  "Programming languages are simpler than English",
                  "AI prefers writing code over writing text"
                ]}
              />
            </CollapsibleSection>

            {/* Module 3: Practical Examples for Language Teachers */}
            <CollapsibleSection
              title="Practical Examples for Language Teachers"
              icon="🎓"
              isOpen={openSections.module3}
              onToggle={() => toggleSection("module3")}
            >
              <div className="space-y-8">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground text-lg leading-relaxed">
                    As language teachers, you might think "I don't need programming—I teach English, not computer science." 
                    But vibe coding isn't about becoming a programmer; it's about <strong>using AI to automate teaching tasks</strong> 
                    that would otherwise require manual work or technical expertise.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border-2">
                  <h4 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span>📊</span>
                    Example 1: Analyze Student Writing Patterns
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded">
                      <p className="font-semibold text-sm mb-2">Your Task:</p>
                      <p className="text-sm">You have 30 student essays. You want to know: How often do students 
                      use passive voice? What's their average sentence length? Which academic words appear most frequently?</p>
                    </div>

                    <div className="bg-background p-4 rounded border">
                      <p className="font-semibold text-sm mb-2">Traditional Way:</p>
                      <p className="text-sm text-muted-foreground">Manually read each essay, count instances, 
                      create spreadsheets... Days of work.</p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded border-2 border-primary/20">
                      <p className="font-semibold text-sm mb-2">✨ Vibe Coding Way:</p>
                      <p className="text-sm mb-3">Prompt: <span className="italic">"Generate Python code to analyze 
                      a folder of text files and count: 1) passive voice constructions, 2) average sentence length, 
                      3) frequency of academic word list items. Output results as a CSV."</span></p>
                      <p className="text-xs text-muted-foreground">AI generates a script → You run it → Get complete 
                      analysis in seconds.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-xl border-2">
                  <h4 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span>📚</span>
                    Example 2: Generate Reading Level Reports
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded">
                      <p className="font-semibold text-sm mb-2">Your Task:</p>
                      <p className="text-sm">You want to assign texts to students based on readability. 
                      Which texts are at which CEFR levels? Which have the most complex vocabulary?</p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded border-2 border-primary/20">
                      <p className="font-semibold text-sm mb-2">✨ Vibe Coding Way:</p>
                      <p className="text-sm mb-3">Prompt: <span className="italic">"Generate Python code using 
                      textstat library to calculate Flesch Reading Ease, SMOG index, and lexical diversity for all 
                      .txt files in a directory. Create a sortable HTML report."</span></p>
                      <p className="text-xs text-muted-foreground">Result: Professional-looking report with 
                      readability metrics for all texts, automatically generated.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl border-2">
                  <h4 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span>🎯</span>
                    Example 3: Create Custom Vocabulary Exercises
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded">
                      <p className="font-semibold text-sm mb-2">Your Task:</p>
                      <p className="text-sm">Generate 20 fill-in-the-blank exercises using this week's vocabulary 
                      words, with sentences from real academic contexts.</p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded border-2 border-primary/20">
                      <p className="font-semibold text-sm mb-2">✨ Vibe Coding Way:</p>
                      <p className="text-sm mb-3">Prompt: <span className="italic">"Generate Python code that takes 
                      a vocabulary list, searches through a corpus of academic texts, finds authentic usage examples, 
                      creates cloze exercises by removing the target word, and exports to a formatted PDF."</span></p>
                      <p className="text-xs text-muted-foreground">One prompt → Complete exercise sheet with authentic 
                      examples, ready to print.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border-2">
                  <h4 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span>🗂️</span>
                    Example 4: Organize and Tag Teaching Materials
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded">
                      <p className="font-semibold text-sm mb-2">Your Task:</p>
                      <p className="text-sm">You have 200 teaching materials (PDFs, Word docs, activities) accumulated 
                      over years. You want to organize them by topic, level, and skill focus.</p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded border-2 border-primary/20">
                      <p className="font-semibold text-sm mb-2">✨ Vibe Coding Way:</p>
                      <p className="text-sm mb-3">Prompt: <span className="italic">"Generate Python code to scan 
                      all documents in a folder, extract text content, use AI to categorize by topic/level/skill, 
                      and automatically rename files and organize into subject folders."</span></p>
                      <p className="text-xs text-muted-foreground">Your messy collection → Automatically organized 
                      resource library.</p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none mt-6">
                  <h4 className="text-2xl font-semibold text-foreground mb-3">The Pattern</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    Notice the pattern: These aren't coding tasks. They're teaching tasks that require:
                  </p>
                </div>

                <ul className="space-y-3 list-none">
                  <BulletPoint icon="⏱️">
                    <strong>Time you don't have</strong> (manual analysis of hundreds of texts)
                  </BulletPoint>
                  <BulletPoint icon="🔧">
                    <strong>Technical skills you might lack</strong> (text processing, statistical analysis)
                  </BulletPoint>
                  <BulletPoint icon="♻️">
                    <strong>Repetitive work you shouldn't do</strong> (formatting, organizing, counting)
                  </BulletPoint>
                </ul>

                <p className="text-foreground text-lg leading-relaxed mt-4">
                  Vibe coding lets you describe what you need, and AI generates the automation tool. 
                  You don't need to become a programmer—you need to learn how to describe your tasks 
                  in a way that AI can translate into executable solutions.
                </p>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module3"
                questionId="teaching-applications"
                question="What type of teaching tasks benefit most from vibe coding?"
                options={[
                  "Repetitive, time-consuming tasks requiring technical skills",
                  "Creative lesson planning and student interaction",
                  "Grading subjective essays and providing feedback",
                  "Teaching grammar rules and vocabulary"
                ]}
              />
            </CollapsibleSection>

            {/* Module 4: AI Agents and the Future */}
            <CollapsibleSection
              title="AI Agents: When Code Writes Itself"
              icon="🤖"
              isOpen={openSections.module4}
              onToggle={() => toggleSection("module4")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">From Code Generation to Autonomous Action</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    Vibe coding is powerful: you ask AI to generate code, then you run it. But what if AI could 
                    <strong> access your files, understand your needs, write the code, AND execute it automatically</strong>? 
                    This is the world of <strong>AI Agents</strong>.
                  </p>
                  <p className="text-foreground text-lg leading-relaxed mt-4">
                    An AI Agent is software that can:
                  </p>
                </div>

                <ul className="space-y-3 list-none">
                  <BulletPoint icon="👀">
                    <strong>Perceive:</strong> Read your files, browse your folders, understand your context
                  </BulletPoint>
                  <BulletPoint icon="🧠">
                    <strong>Decide:</strong> Determine what needs to be done based on your request
                  </BulletPoint>
                  <BulletPoint icon="💻">
                    <strong>Act:</strong> Write code, run it, interact with your system, produce results
                  </BulletPoint>
                  <BulletPoint icon="🔄">
                    <strong>Iterate:</strong> Check if the task succeeded, debug if needed, try alternative approaches
                  </BulletPoint>
                </ul>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl border-2">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">Example: AI Agent Organizing Your Lessons</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded">
                      <p className="font-semibold mb-2">Your Request to AI Agent:</p>
                      <p className="italic">"Look through my TeachingMaterials folder. Organize all lesson plans 
                      by topic and CEFR level. Create subfolders, rename files with descriptive names, and generate 
                      an index document listing all materials."</p>
                    </div>

                    <div className="bg-background p-4 rounded border space-y-3">
                      <p className="font-semibold text-sm mb-2">What the AI Agent Does (Autonomously):</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <Code className="h-4 w-4 text-primary mt-0.5" />
                          <div>
                            <p className="font-semibold">Step 1: Scan Files</p>
                            <p className="text-muted-foreground text-xs">Lists all files, reads content of each document</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Code className="h-4 w-4 text-primary mt-0.5" />
                          <div>
                            <p className="font-semibold">Step 2: Analyze & Categorize</p>
                            <p className="text-muted-foreground text-xs">Uses AI to identify topics, determine levels</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Code className="h-4 w-4 text-primary mt-0.5" />
                          <div>
                            <p className="font-semibold">Step 3: Create Structure</p>
                            <p className="text-muted-foreground text-xs">Makes folders (Grammar/, Vocabulary/, Reading/)</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Code className="h-4 w-4 text-primary mt-0.5" />
                          <div>
                            <p className="font-semibold">Step 4: Rename & Move Files</p>
                            <p className="text-muted-foreground text-xs">Gives descriptive names (e.g., "B2_PresentPerfect_Lesson.pdf")</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Code className="h-4 w-4 text-primary mt-0.5" />
                          <div>
                            <p className="font-semibold">Step 5: Generate Index</p>
                            <p className="text-muted-foreground text-xs">Creates a searchable document listing all materials</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                      <p className="font-semibold mb-2">✅ Result:</p>
                      <p className="text-sm">Your chaotic folder → Professionally organized resource library with index. 
                      You did nothing except make one request.</p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mt-6 mb-3">How AI Agents Work</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    AI Agents combine three capabilities:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-2xl mb-2">🔌</div>
                    <h5 className="font-semibold mb-2">1. Tool Access</h5>
                    <p className="text-sm text-muted-foreground">
                      Can call functions: read files, run Python, search web, execute commands
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-2xl mb-2">🎯</div>
                    <h5 className="font-semibold mb-2">2. Planning</h5>
                    <p className="text-sm text-muted-foreground">
                      Breaks complex requests into steps, decides what tools to use when
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-2xl mb-2">🔁</div>
                    <h5 className="font-semibold mb-2">3. Feedback Loop</h5>
                    <p className="text-sm text-muted-foreground">
                      Checks results, fixes errors, tries alternative approaches if needed
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
                  <h5 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    Real AI Agents You Can Use Today
                  </h5>
                  <ul className="space-y-3 list-none">
                    <BulletPoint icon="🤖">
                      <strong>Claude with Computer Use:</strong> Anthropic's AI can control your computer, 
                      click buttons, type, navigate applications
                    </BulletPoint>
                    <BulletPoint icon="💬">
                      <strong>ChatGPT with Code Interpreter:</strong> Uploads files, runs Python, generates 
                      visualizations, analyzes data—all in chat
                    </BulletPoint>
                    <BulletPoint icon="⚡">
                      <strong>Cursor AI Editor:</strong> Works directly in your codebase, understands your 
                      entire project, writes and edits code contextually
                    </BulletPoint>
                    <BulletPoint icon="🔧">
                      <strong>Custom GPTs with Actions:</strong> Build agents that connect to your specific 
                      tools and workflows
                    </BulletPoint>
                  </ul>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mt-6 mb-3">The Trajectory: Where This Is Going</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    We're moving from:
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">1️⃣</span>
                    <div>
                      <p className="font-semibold">Chatbots</p>
                      <p className="text-sm text-muted-foreground">AI answers questions (2022-2023)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">2️⃣</span>
                    <div>
                      <p className="font-semibold">Code Generators</p>
                      <p className="text-sm text-muted-foreground">AI writes code you execute (2023-2024)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">3️⃣</span>
                    <div>
                      <p className="font-semibold">AI Agents</p>
                      <p className="text-sm text-muted-foreground">AI plans, codes, executes autonomously (2024-2025)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">4️⃣</span>
                    <div>
                      <p className="font-semibold">AI Workflows</p>
                      <p className="text-sm text-muted-foreground">AI manages complex multi-step processes (2025+)</p>
                    </div>
                  </div>
                </div>

                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
                  "The best interface between humans and computers isn't making computers more human-like. 
                  It's giving humans superpowers to control computers with intent alone—and AI is that bridge."
                </blockquote>

                <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-lg">
                  <h5 className="text-xl font-semibold text-foreground mb-3">For Language Teachers: What This Means</h5>
                  <p className="text-foreground mb-4">
                    You don't need to become a programmer. You need to become fluent in <strong>expressing intent</strong>. 
                    The better you describe what you want, the better AI agents can automate it.
                  </p>
                  <ul className="space-y-2 list-none">
                    <BulletPoint icon="✅">
                      Focus on pedagogy—what students need to learn
                    </BulletPoint>
                    <BulletPoint icon="✅">
                      Describe desired outcomes—AI figures out the how
                    </BulletPoint>
                    <BulletPoint icon="✅">
                      Let AI handle technical execution—you handle teaching
                    </BulletPoint>
                  </ul>
                </div>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module4"
                questionId="ai-agents-capability"
                question="What distinguishes AI agents from simple code generation?"
                options={[
                  "Agents can autonomously plan, execute, and iterate on tasks with file system access",
                  "Agents write better code than regular AI",
                  "Agents don't need human prompts to work",
                  "Agents are faster at generating responses"
                ]}
              />

              <div className="mt-6 bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground text-lg mb-2">🔮 Recommended Exploration</h4>
                <p className="text-muted-foreground mb-4">
                  Try these AI agents yourself to experience the future of human-computer interaction:
                </p>
                <ul className="space-y-2 text-base text-muted-foreground">
                  <li>
                    • <strong>ChatGPT Plus:</strong> Enable "Code Interpreter" and upload a CSV file to analyze
                  </li>
                  <li>
                    • <strong>Claude:</strong> Try Claude 3.5 with artifacts—generates live interactive content
                  </li>
                  <li>
                    • <strong>Cursor:</strong> If you work with code files, see how AI navigates your entire project
                  </li>
                </ul>
              </div>
            </CollapsibleSection>

            {/* Module 4: Summary */}
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
                      <strong>Natural Language Limits:</strong> NL is for humans; programming languages are for 
                      machines. AI bridges the gap by translating your intent into executable code.
                    </BulletPoint>
                    <BulletPoint icon="⚡">
                      <strong>Vibe Coding:</strong> Ask AI to generate code (Mermaid, Python, etc.) instead of 
                      describing results. Get immediate, accurate execution.
                    </BulletPoint>
                    <BulletPoint icon="🎓">
                      <strong>Teaching Applications:</strong> Automate time-consuming tasks—text analysis, 
                      organization, exercise generation—without learning to code.
                    </BulletPoint>
                    <BulletPoint icon="🤖">
                      <strong>AI Agents:</strong> The future is agents that can access your files, plan tasks, 
                      write and execute code autonomously based on your high-level requests.
                    </BulletPoint>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg space-y-4">
                  <h4 className="text-2xl font-semibold text-foreground">Quick Feedback</h4>
                  <ComprehensionCheck
                    lessonSlug={lessonSlug}
                    sectionId="module4"
                    questionId="lesson-usefulness"
                    question="How likely are you to try vibe coding in your teaching?"
                    options={[
                      "Very likely - I have specific tasks I want to automate",
                      "Somewhat likely - Need to see more examples first",
                      "Unsure - Concerned about the learning curve",
                      "Unlikely - Prefer traditional methods"
                    ]}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg space-y-4">
                  <h4 className="text-2xl font-semibold text-foreground">Final Reflection</h4>
                  <OpenEndedReflection
                    lessonSlug={lessonSlug}
                    sectionId="module4"
                    questionId="vibe-coding-application"
                    question="Identify one repetitive or time-consuming task in your teaching that you could potentially automate using vibe coding. Describe the task and how AI-generated code might help you accomplish it more efficiently."
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-bold text-foreground">🎯 Next Steps</h3>
                <p className="text-muted-foreground text-lg">
                  This week, try one vibe coding experiment: Ask ChatGPT (with Code Interpreter) or Claude to 
                  analyze a set of student texts or generate a visualization of a concept you're teaching. 
                  Don't worry about understanding the code—focus on describing your goal clearly and seeing 
                  what AI can automate for you. Share your experiment with a colleague!
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

export default VibeCoding;

