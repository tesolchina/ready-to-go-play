import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, Terminal, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { ComprehensionCheck } from "@/components/ComprehensionCheck";
import { BulletPoint } from "@/components/BulletPoint";
import { OpenEndedReflection } from "@/components/OpenEndedReflection";
import { supabase } from "@/integrations/supabase/client";

const AIAgents = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    module1: false,
    module2: false,
    module3: false,
    module4: false,
  });

  const lessonSlug = "ai-agents";

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
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                    Lesson 5
                  </span>
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md text-sm font-medium">
                    🔮 Future Tech
                  </span>
                </div>
                <h1 className="text-5xl font-bold">
                  AI Agents: When Code Writes and Executes Itself
                </h1>
                <p className="text-2xl text-muted-foreground">
                  Understanding Autonomous AI Systems That Plan, Act, and Iterate
                </p>
              </div>
            </div>

            {/* Module 1: From Code Generation to Autonomous Action */}
            <CollapsibleSection
              title="From Code Generation to Autonomous Action"
              icon="🤖"
              isOpen={openSections.module1}
              onToggle={() => toggleSection("module1")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">The Evolution of AI Assistance</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    In Lesson 4, you learned <strong>vibe coding</strong>—asking AI to generate code that you then execute. 
                    But what if AI could do more? What if it could <strong>access your files, understand your needs, write the 
                    code, AND execute it automatically</strong>?
                  </p>
                  <p className="text-foreground text-lg leading-relaxed mt-4">
                    This is the world of <strong>AI Agents</strong>—autonomous systems that don't just generate solutions, 
                    they implement them.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border-2">
                  <h5 className="text-xl font-semibold text-foreground mb-4">The Difference</h5>
                  
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded">
                      <p className="font-semibold mb-2">Traditional Vibe Coding:</p>
                      <div className="text-sm space-y-1">
                        <p>1. You ask AI to generate code</p>
                        <p>2. AI provides the code</p>
                        <p>3. You copy and run it</p>
                        <p>4. You check results</p>
                        <p>5. If there's an error, you ask AI again</p>
                      </div>
                    </div>

                    <div className="bg-primary/5 p-4 rounded border-2 border-primary/20">
                      <p className="font-semibold mb-2">✨ AI Agents:</p>
                      <div className="text-sm space-y-1">
                        <p>1. You describe what you need</p>
                        <p>2. Agent accesses your files/environment</p>
                        <p>3. Agent writes code automatically</p>
                        <p>4. Agent executes the code</p>
                        <p>5. Agent checks results, debugs if needed, iterates</p>
                        <p className="mt-2 text-primary font-semibold">→ You get the final result, no manual steps</p>
                      </div>
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 list-none">
                  <BulletPoint icon="🧠">
                    <strong>Autonomous:</strong> Makes decisions without constant human guidance
                  </BulletPoint>
                  <BulletPoint icon="🔄">
                    <strong>Iterative:</strong> Tries multiple approaches, debugs automatically
                  </BulletPoint>
                  <BulletPoint icon="🎯">
                    <strong>Goal-Oriented:</strong> Focuses on achieving the desired outcome
                  </BulletPoint>
                  <BulletPoint icon="🔌">
                    <strong>Tool-Enabled:</strong> Can access files, run code, search web, interact with systems
                  </BulletPoint>
                </ul>

                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
                  "AI Agents are the difference between a helpful assistant and a capable colleague. They don't just advise—they act."
                </blockquote>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module1"
                questionId="agent-definition"
                question="What makes an AI Agent different from standard code generation?"
                options={[
                  "Agents can autonomously plan, execute, and iterate without human intervention",
                  "Agents write better quality code",
                  "Agents work faster than regular AI",
                  "Agents don't need prompts from humans"
                ]}
              />
            </CollapsibleSection>

            {/* Module 2: How AI Agents Work */}
            <CollapsibleSection
              title="How AI Agents Work: The Three Core Capabilities"
              icon="⚙️"
              isOpen={openSections.module2}
              onToggle={() => toggleSection("module2")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground text-lg leading-relaxed">
                    AI Agents combine three fundamental capabilities that, together, create autonomous action:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                    <div className="text-3xl mb-3">🔌</div>
                    <h5 className="font-bold text-lg mb-2">1. Tool Access</h5>
                    <p className="text-sm text-muted-foreground">
                      Can call functions: read files, run Python, search web, execute commands, access APIs
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                    <div className="text-3xl mb-3">🎯</div>
                    <h5 className="font-bold text-lg mb-2">2. Planning</h5>
                    <p className="text-sm text-muted-foreground">
                      Breaks complex requests into steps, decides what tools to use when, sequences actions
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border-2 border-green-200 dark:border-green-800">
                    <div className="text-3xl mb-3">🔁</div>
                    <h5 className="font-bold text-lg mb-2">3. Feedback Loop</h5>
                    <p className="text-sm text-muted-foreground">
                      Checks results, detects errors, tries alternative approaches, learns from failures
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl border-2">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    Example: Organizing Your Teaching Materials
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded">
                      <p className="font-semibold mb-2">Your Request:</p>
                      <p className="italic text-sm">"Look through my TeachingMaterials folder. Organize all lesson plans 
                      by topic and CEFR level. Create subfolders, rename files descriptively, and generate an index."</p>
                    </div>

                    <div className="bg-background p-4 rounded border space-y-3">
                      <p className="font-semibold text-sm mb-2">What the Agent Does:</p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
                            <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">Step 1: Scan & Analyze</p>
                            <p className="text-xs text-muted-foreground">Lists all files, reads content, identifies topics and levels using AI</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded">
                            <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">Step 2: Plan Structure</p>
                            <p className="text-xs text-muted-foreground">Decides folder hierarchy (Grammar/, Vocabulary/, Reading/), naming convention</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 dark:bg-green-900 p-2 rounded">
                            <Terminal className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">Step 3: Execute Actions</p>
                            <p className="text-xs text-muted-foreground">Creates folders, renames files (e.g., "B2_PresentPerfect_Lesson.pdf"), moves files</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded">
                            <Zap className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">Step 4: Generate Index</p>
                            <p className="text-xs text-muted-foreground">Creates searchable document listing all materials with descriptions</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="bg-teal-100 dark:bg-teal-900 p-2 rounded">
                            <Bot className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">Step 5: Verify & Report</p>
                            <p className="text-xs text-muted-foreground">Checks all files moved correctly, reports completion status</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded border-2 border-green-200 dark:border-green-800">
                      <p className="font-semibold mb-2">✅ Result:</p>
                      <p className="text-sm">Chaotic folder → Professionally organized library with descriptive names and searchable index. 
                      <strong> You made one request. The agent handled everything.</strong></p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mt-6 mb-3">The Key Insight</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    Agents don't just execute a single command—they <strong>orchestrate multi-step workflows</strong>. 
                    They perceive the environment, make decisions, take actions, and adapt based on results.
                  </p>
                </div>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module2"
                questionId="agent-capabilities"
                question="Which capability is MOST critical for AI Agents?"
                options={[
                  "The feedback loop that allows iteration and error correction",
                  "Tool access to files and systems",
                  "Planning complex multi-step workflows",
                  "All three capabilities working together"
                ]}
              />
            </CollapsibleSection>

            {/* Module 3: Real AI Agents Today */}
            <CollapsibleSection
              title="Real AI Agents You Can Use Today"
              icon="🚀"
              isOpen={openSections.module3}
              onToggle={() => toggleSection("module3")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground text-lg leading-relaxed">
                    AI Agents aren't science fiction—they're available now. Here are real systems you can try:
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl border-2">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">🤖</div>
                      <div className="flex-1">
                        <h5 className="text-xl font-bold text-foreground mb-2">Claude with Computer Use</h5>
                        <p className="text-foreground mb-3">
                          Anthropic's Claude can control your computer—move mouse, click buttons, type, navigate applications. 
                          It literally sees your screen and interacts with it.
                        </p>
                        <div className="bg-muted/50 p-3 rounded text-sm">
                          <p className="font-semibold mb-1">Example Use:</p>
                          <p className="text-muted-foreground">"Open my browser, go to my teaching blog, create a new post 
                          about today's lesson, and format it with headings."</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-xl border-2">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">💬</div>
                      <div className="flex-1">
                        <h5 className="text-xl font-bold text-foreground mb-2">ChatGPT with Code Interpreter</h5>
                        <p className="text-foreground mb-3">
                          Upload files (CSV, PDF, images), and ChatGPT runs Python code to analyze, visualize, and process 
                          data—all in the chat interface.
                        </p>
                        <div className="bg-muted/50 p-3 rounded text-sm">
                          <p className="font-semibold mb-1">Example Use:</p>
                          <p className="text-muted-foreground">"Here's my class attendance CSV. Create visualizations showing 
                          patterns and identify students with concerning absence rates."</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl border-2">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">⚡</div>
                      <div className="flex-1">
                        <h5 className="text-xl font-bold text-foreground mb-2">Cursor AI Editor</h5>
                        <p className="text-foreground mb-3">
                          A code editor where AI understands your entire project context. It reads all your files, 
                          understands relationships, and writes/edits code across multiple files simultaneously.
                        </p>
                        <div className="bg-muted/50 p-3 rounded text-sm">
                          <p className="font-semibold mb-1">Example Use:</p>
                          <p className="text-muted-foreground">"Add a new feature to my lesson planning app that 
                          calculates reading time for each activity."</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border-2">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">🔧</div>
                      <div className="flex-1">
                        <h5 className="text-xl font-bold text-foreground mb-2">Custom GPTs with Actions</h5>
                        <p className="text-foreground mb-3">
                          Build specialized AI agents connected to your specific tools and workflows. They can access your 
                          databases, APIs, and services.
                        </p>
                        <div className="bg-muted/50 p-3 rounded text-sm">
                          <p className="font-semibold mb-1">Example Use:</p>
                          <p className="text-muted-foreground">"Create a 'Lesson Assistant' that accesses your curriculum 
                          database and automatically generates aligned activities."</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
                  <h5 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    💡 What You Can Do Today
                  </h5>
                  <ul className="space-y-2 list-none">
                    <BulletPoint icon="✓">
                      Try ChatGPT Plus Code Interpreter with a CSV of student data
                    </BulletPoint>
                    <BulletPoint icon="✓">
                      Upload PDFs to Claude and ask it to extract and organize information
                    </BulletPoint>
                    <BulletPoint icon="✓">
                      Explore how Cursor AI navigates codebases (even if you don't code)
                    </BulletPoint>
                    <BulletPoint icon="✓">
                      Watch demos of Claude Computer Use controlling applications
                    </BulletPoint>
                  </ul>
                </div>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module3"
                questionId="agent-tools"
                question="What distinguishes modern AI agents from earlier AI assistants?"
                options={[
                  "They can take actions in your environment, not just provide advice",
                  "They understand natural language better",
                  "They have larger knowledge bases",
                  "They respond faster to queries"
                ]}
              />
            </CollapsibleSection>

            {/* Module 4: The Future & Your Role */}
            <CollapsibleSection
              title="The Trajectory: Where AI Agents Are Going"
              icon="🔮"
              isOpen={openSections.module4}
              onToggle={() => toggleSection("module4")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">The Evolution Timeline</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    We're witnessing a rapid evolution in human-computer interaction:
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-4 bg-muted/50 p-4 rounded-lg">
                    <span className="text-3xl">1️⃣</span>
                    <div>
                      <p className="font-bold text-lg">Chatbots (2022-2023)</p>
                      <p className="text-sm text-muted-foreground">AI answers questions in natural language</p>
                      <p className="text-xs text-muted-foreground mt-1">Status: ✓ Mainstream</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 bg-muted/50 p-4 rounded-lg">
                    <span className="text-3xl">2️⃣</span>
                    <div>
                      <p className="font-bold text-lg">Code Generators (2023-2024)</p>
                      <p className="text-sm text-muted-foreground">AI writes code you execute manually</p>
                      <p className="text-xs text-muted-foreground mt-1">Status: ✓ Widely Available</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 bg-primary/10 p-4 rounded-lg border-2 border-primary/20">
                    <span className="text-3xl">3️⃣</span>
                    <div>
                      <p className="font-bold text-lg">AI Agents (2024-2025)</p>
                      <p className="text-sm text-muted-foreground">AI plans, codes, executes autonomously</p>
                      <p className="text-xs text-primary mt-1">Status: ⚡ Available Now (we are here)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-2 border-purple-300 dark:border-purple-800">
                    <span className="text-3xl">4️⃣</span>
                    <div>
                      <p className="font-bold text-lg">AI Workflows (2025-2026)</p>
                      <p className="text-sm text-muted-foreground">Multiple agents coordinate on complex projects</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Status: 🔮 Near Future</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-lg border-2 border-indigo-300 dark:border-indigo-800">
                    <span className="text-3xl">5️⃣</span>
                    <div>
                      <p className="font-bold text-lg">Persistent AI Colleagues (2026+)</p>
                      <p className="text-sm text-muted-foreground">AI that works continuously, learns your preferences, manages ongoing projects</p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">Status: 🚀 Emerging</p>
                    </div>
                  </div>
                </div>

                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
                  "The best interface isn't making computers more human-like. It's giving humans superpowers to control 
                  computers with intent alone—and AI Agents are that bridge."
                </blockquote>

                <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-xl">
                  <h5 className="text-xl font-semibold text-foreground mb-4">For Language Teachers: What This Means</h5>
                  <p className="text-foreground mb-4">
                    You don't need to become a programmer or AI expert. You need to become fluent in <strong>expressing intent</strong>.
                  </p>
                  <ul className="space-y-3 list-none">
                    <BulletPoint icon="🎯">
                      <strong>Focus on Pedagogy:</strong> Define what students need to learn, not how to implement it
                    </BulletPoint>
                    <BulletPoint icon="💭">
                      <strong>Describe Outcomes:</strong> AI agents figure out the technical "how"
                    </BulletPoint>
                    <BulletPoint icon="⚡">
                      <strong>Iterate Quickly:</strong> Test ideas fast, let agents handle implementation details
                    </BulletPoint>
                    <BulletPoint icon="🤝">
                      <strong>Stay in Control:</strong> You make decisions about learning goals; agents handle execution
                    </BulletPoint>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                  <h5 className="text-xl font-semibold text-foreground mb-3">🎓 Coming Soon: Hands-On AI Agents Workshop</h5>
                  <p className="text-foreground mb-3">
                    This lesson introduced the concepts. In an upcoming hands-on workshop, you'll:
                  </p>
                  <ul className="space-y-2 text-sm list-none">
                    <BulletPoint icon="✓">
                      Actually use ChatGPT Code Interpreter with your own teaching data
                    </BulletPoint>
                    <BulletPoint icon="✓">
                      Build a simple custom GPT for your specific teaching needs
                    </BulletPoint>
                    <BulletPoint icon="✓">
                      See Claude Computer Use demonstrations live
                    </BulletPoint>
                    <BulletPoint icon="✓">
                      Create workflows that agents can execute autonomously
                    </BulletPoint>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-3 italic">
                    Workshop details coming soon. This foundational lesson prepares you to make the most of hands-on practice.
                  </p>
                </div>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module4"
                questionId="future-understanding"
                question="What skill is most important as AI Agents become more capable?"
                options={[
                  "Clearly expressing intent and desired outcomes",
                  "Learning to code in Python and JavaScript",
                  "Understanding AI algorithms deeply",
                  "Memorizing agent commands and syntax"
                ]}
              />
            </CollapsibleSection>

            {/* Summary */}
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
                    <BulletPoint icon="🤖">
                      <strong>AI Agents = Autonomous Action:</strong> They plan, execute, and iterate without constant human guidance
                    </BulletPoint>
                    <BulletPoint icon="⚙️">
                      <strong>Three Capabilities:</strong> Tool access + Planning + Feedback loops enable autonomy
                    </BulletPoint>
                    <BulletPoint icon="🚀">
                      <strong>Available Now:</strong> ChatGPT, Claude, Cursor—real agents you can use today
                    </BulletPoint>
                    <BulletPoint icon="🔮">
                      <strong>Future Skills:</strong> Express intent clearly; let agents handle technical execution
                    </BulletPoint>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg space-y-4">
                  <h4 className="text-2xl font-semibold text-foreground">Quick Feedback</h4>
                  <ComprehensionCheck
                    lessonSlug={lessonSlug}
                    sectionId="summary"
                    questionId="lesson-usefulness"
                    question="How has this lesson changed your understanding of AI capabilities?"
                    options={[
                      "Significantly - I see AI as more than a chatbot",
                      "Somewhat - I understand the potential better",
                      "A little - Need to see more examples",
                      "Not much - Still prefer traditional tools"
                    ]}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg space-y-4">
                  <h4 className="text-2xl font-semibold text-foreground">Final Reflection</h4>
                  <OpenEndedReflection
                    lessonSlug={lessonSlug}
                    sectionId="summary"
                    questionId="agent-application"
                    question="Imagine you had an AI Agent that could autonomously handle teaching tasks. What specific task would you delegate to it first, and why? Describe what you'd want the agent to do and the outcome you're hoping for."
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-bold text-foreground">🎯 Next Steps</h3>
                <p className="text-muted-foreground text-lg">
                  Explore one AI Agent this week: Try ChatGPT Code Interpreter with a simple teaching data file (attendance, 
                  grades, etc.) or upload a PDF to Claude and ask it to extract and organize information. Experience how 
                  agents work autonomously.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <Link to="/lessons">
                    <Button variant="outline">
                      Back to Lessons
                    </Button>
                  </Link>
                  <Link to="/lessons/vibe-coding">
                    <Button variant="outline">
                      ← Review: Vibe Coding
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

export default AIAgents;

