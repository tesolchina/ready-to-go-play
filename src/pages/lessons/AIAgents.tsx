import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, Terminal, Zap, Download, Key, GitFork } from "lucide-react";
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
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md text-sm font-medium">
                    🔮 Future Tech
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold break-words">
                  AI Agents: When Code Writes and Executes Itself
                </h1>
                <p className="text-2xl text-muted-foreground">
                  Understanding Autonomous AI Systems That Plan, Act, and Iterate
                </p>
              </div>
            </div>

            {/* Module 1: Evolution of AI Assistance */}
            <CollapsibleSection
              title="The Evolution of AI Assistance: From Chatbots to AI Agents"
              icon="🤖"
              isOpen={openSections.module1}
              onToggle={() => toggleSection("module1")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">The Journey from Text to Action</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    AI assistance has evolved dramatically. Understanding this evolution helps us see where we are now 
                    and where we're heading.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border-2">
                  <h5 className="text-xl font-semibold text-foreground mb-4">Chatbots: Text-Only Responses</h5>
                  
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded">
                      <p className="font-semibold mb-2">💬 Traditional Chatbots (e.g., ChatGPT, DeepSeek):</p>
                      <div className="text-sm space-y-2">
                        <BulletPoint icon="📝">
                          <strong>Input:</strong> You type a question or request in text
                        </BulletPoint>
                        <BulletPoint icon="💭">
                          <strong>Process:</strong> AI processes your text and generates a text response
                        </BulletPoint>
                        <BulletPoint icon="📄">
                          <strong>Output:</strong> AI responds with text only—you read it and decide what to do next
                        </BulletPoint>
                        <BulletPoint icon="⚠️">
                          <strong>Limitation:</strong> Can only respond in text—cannot directly act on files, folders, or run code
                        </BulletPoint>
                      </div>
                    </div>

                    <div className="bg-primary/5 p-4 rounded border-2 border-primary/20">
                      <p className="font-semibold mb-2">✨ AI Agents:</p>
                      <div className="text-sm space-y-2">
                        <BulletPoint icon="📁">
                          <strong>Input:</strong> You describe what you need (in natural language)
                        </BulletPoint>
                        <BulletPoint icon="🔧">
                          <strong>Process:</strong> AI agent accesses your files and folders, reads content, writes code, executes commands
                        </BulletPoint>
                        <BulletPoint icon="⚡">
                          <strong>Output:</strong> Agent performs actions—creates files, organizes folders, runs code, generates results
                        </BulletPoint>
                        <BulletPoint icon="✅">
                          <strong>Capability:</strong> Can act on files and folders, run code, and execute tasks autonomously
                        </BulletPoint>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-xl border-2">
                  <h5 className="text-xl font-semibold text-foreground mb-4">Key Difference: Action vs. Advice</h5>
                  
                  <div className="space-y-3">
                    <div className="bg-background p-4 rounded border">
                      <p className="font-semibold mb-2">Example: Organizing Teaching Materials</p>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-semibold text-muted-foreground">With a Chatbot:</p>
                          <p className="italic">You: "How should I organize my teaching materials?"</p>
                          <p className="italic">Chatbot: "You could create folders by topic, use descriptive names, organize by CEFR level..."</p>
                          <p className="text-muted-foreground mt-1">→ You read the advice, then manually organize files yourself</p>
                        </div>
                        <div className="border-t pt-3">
                          <p className="font-semibold text-primary">With an AI Agent:</p>
                          <p className="italic">You: "Organize my TeachingMaterials folder by topic and CEFR level"</p>
                          <p className="italic">Agent: *Scans folder → Creates subfolders → Renames files → Generates index*</p>
                          <p className="text-primary font-semibold mt-1">→ Agent does the work automatically; you get organized files</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 list-none">
                  <BulletPoint icon="💬">
                    <strong>Chatbots:</strong> Provide text responses—you act on the advice
                  </BulletPoint>
                  <BulletPoint icon="🤖">
                    <strong>AI Agents:</strong> Take actions directly—they do the work for you
                  </BulletPoint>
                  <BulletPoint icon="📁">
                    <strong>File Operations:</strong> Agents can read, create, modify, and organize files and folders
                  </BulletPoint>
                  <BulletPoint icon="💻">
                    <strong>Code Execution:</strong> Agents can write code and run it automatically
                  </BulletPoint>
                </ul>

                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
                  "The fundamental difference: Chatbots tell you what to do. AI Agents do it for you."
                </blockquote>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module1"
                questionId="agent-vs-chatbot"
                question="What is the key difference between chatbots and AI agents?"
                options={[
                  "Chatbots are faster than AI agents",
                  "Chatbots can only respond in text, while AI agents can act on files, folders, and run code",
                  "AI agents are more expensive to use",
                  "Chatbots understand context better than AI agents"
                ]}
              />
            </CollapsibleSection>

            {/* Module 2: How AI Agents Work */}
            <CollapsibleSection
              title="How AI Agents Work: Understanding the Basic Model"
              icon="⚙️"
              isOpen={openSections.module2}
              onToggle={() => toggleSection("module2")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">A Teacher's Perspective</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    As educators, we don't need to understand every technical detail of how AI agents work internally. 
                    However, understanding the basic model helps us use them effectively. The technical implementation 
                    involves complex systems like <strong>MCP (Model Context Protocol)</strong> and other frameworks, 
                    but we can think of agents in simpler terms.
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500">
                  <p className="text-sm text-foreground">
                    <strong>Note:</strong> The technical details of AI agent architecture are complex and rapidly evolving. 
                    This lesson focuses on the practical model that helps you understand and use agents effectively, 
                    rather than deep technical implementation details.
                    </p>
                  </div>

                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl border-2">
                  <h5 className="text-xl font-semibold text-foreground mb-4">The Basic Model: Three Simple Steps</h5>
                  
                  <div className="space-y-4">
                    <div className="bg-background p-5 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                          <span className="text-2xl">📥</span>
                        </div>
                        <div className="flex-1">
                          <h6 className="font-bold text-lg mb-2">1. Input: File Paths and Folder Paths</h6>
                          <p className="text-sm text-muted-foreground">
                            You provide the agent with access to specific files and folders. The agent can read, 
                            analyze, and understand the content and structure of these files.
                          </p>
                          <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                            <p className="font-semibold">Example:</p>
                            <p className="font-mono">/Users/teacher/Documents/TeachingMaterials/</p>
                            <p className="font-mono">/Users/teacher/Documents/StudentWork/</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background p-5 rounded-lg border-2 border-indigo-200 dark:border-indigo-800">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-lg">
                          <span className="text-2xl">⚙️</span>
                        </div>
                        <div className="flex-1">
                          <h6 className="font-bold text-lg mb-2">2. Process: Natural Language Instructions</h6>
                          <p className="text-sm text-muted-foreground">
                            You write instructions in natural language describing how the files should be handled. 
                            The agent interprets your instructions and determines what actions to take.
                          </p>
                          <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                            <p className="font-semibold">Example:</p>
                            <p className="italic">"Organize all lesson plans by topic. Create subfolders for Grammar, Vocabulary, 
                            and Reading. Rename files to include CEFR level (e.g., B2_PresentPerfect_Lesson.pdf). 
                            Generate an index file listing all materials."</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background p-5 rounded-lg border-2 border-green-200 dark:border-green-800">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                          <span className="text-2xl">📤</span>
                        </div>
                        <div className="flex-1">
                          <h6 className="font-bold text-lg mb-2">3. Output: Designated Folders</h6>
                    <p className="text-sm text-muted-foreground">
                            The agent performs the actions and designates folders where the output will be exported. 
                            You specify where you want the results saved.
                          </p>
                          <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                            <p className="font-semibold">Example:</p>
                            <p className="font-mono">/Users/teacher/Documents/OrganizedMaterials/</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              → All organized files, subfolders, and index are saved here
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border-2">
                  <h5 className="text-xl font-semibold text-foreground mb-4">Trae.cn: An Integrated Development Environment for AI Agents</h5>
                  
                  <p className="text-foreground mb-4">
                    <strong>Trae.cn</strong> is an agent tool that functions as an Integrated Development Environment (IDE) 
                    specifically designed for working with AI agents. It provides a platform where you can:
                  </p>
                  
                  <ul className="space-y-3 list-none mb-4">
                    <BulletPoint icon="🔧">
                      Access and manage files and folders in your workspace
                    </BulletPoint>
                    <BulletPoint icon="💬">
                      Communicate with AI agents using natural language
                    </BulletPoint>
                    <BulletPoint icon="📁">
                      Designate input and output folders for agent operations
                    </BulletPoint>
                    <BulletPoint icon="⚡">
                      Execute code and see results in real-time
                    </BulletPoint>
                    <BulletPoint icon="🔄">
                      Iterate on agent instructions and refine outputs
                    </BulletPoint>
                  </ul>

                  <div className="bg-background p-4 rounded border">
                    <p className="text-sm text-foreground">
                      <strong>Key Feature:</strong> Trae.cn integrates file management, code execution, and AI agent 
                      communication into a single interface, making it easier for educators to work with AI agents 
                      without needing deep technical knowledge.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl border-2">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    Complete Example: Organizing Teaching Materials
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded">
                      <p className="font-semibold mb-2">Step 1: Input (File Paths)</p>
                      <p className="text-sm font-mono bg-background p-2 rounded">
                        /Users/teacher/Documents/TeachingMaterials/
                      </p>
                    </div>

                    <div className="bg-muted/50 p-4 rounded">
                      <p className="font-semibold mb-2">Step 2: Process (Natural Language Instructions)</p>
                      <p className="text-sm italic bg-background p-2 rounded">
                        "Scan all files in this folder. Identify lesson plans, worksheets, and assessments. 
                        Organize them by topic (Grammar, Vocabulary, Reading, Writing). Create subfolders for each topic. 
                        Within each topic, create subfolders by CEFR level (A1, A2, B1, B2, C1, C2). Rename files to 
                        include topic and level (e.g., B2_Grammar_PresentPerfect_Lesson.pdf). Generate a searchable index 
                        file listing all materials with descriptions."
                      </p>
                        </div>
                        
                    <div className="bg-muted/50 p-4 rounded">
                      <p className="font-semibold mb-2">Step 3: Output (Designated Folder)</p>
                      <p className="text-sm font-mono bg-background p-2 rounded">
                        /Users/teacher/Documents/OrganizedMaterials/
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        → Contains: Organized subfolders, renamed files, index file
                      </p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded border-2 border-green-200 dark:border-green-800">
                      <p className="font-semibold mb-2">✅ Result:</p>
                      <p className="text-sm">
                        From a chaotic folder with random file names, you get a professionally organized library 
                        with clear structure, descriptive names, and a searchable index—all done automatically by the agent.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module2"
                questionId="agent-model"
                question="According to the basic model, what are the three main components of how AI agents work?"
                options={[
                  "Input (file paths), Process (natural language instructions), Output (designated folders)",
                  "Input (text questions), Process (AI thinking), Output (text answers)",
                  "Input (code), Process (execution), Output (results)",
                  "Input (images), Process (analysis), Output (descriptions)"
                ]}
              />
            </CollapsibleSection>

            {/* Module 3: Setting Up Your AI Agent */}
            <CollapsibleSection
              title="Setting Up Your AI Agent: Getting Started with Trae.cn"
              icon="🚀"
              isOpen={openSections.module3}
              onToggle={() => toggleSection("module3")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">Step-by-Step Setup Guide</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    Follow these steps to set up your AI agent environment. This will enable you to start working 
                    with AI agents for your teaching tasks.
                  </p>
                </div>

                {/* Step 1: Download and Install Trae.cn */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border-2">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                      <Download className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                      <div className="flex-1">
                      <h5 className="text-xl font-semibold text-foreground mb-2">Step 1: Download and Install Trae.cn</h5>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-foreground">
                        <li>Visit the Trae.cn website</li>
                        <li>Download the application for your operating system (Windows, macOS, or Linux)</li>
                        <li>Install Trae.cn following the installation instructions</li>
                        <li>Launch the application</li>
                      </ol>
                    </div>
                        </div>
                </div>

                {/* Step 2: Sign Up for Trae.cn Account */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border-2">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                      <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-xl font-semibold text-foreground mb-2">Step 2: Sign Up for a Free Trae.cn Account</h5>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-foreground">
                        <li>In the Trae.cn application, click on "Sign Up" or "Create Account"</li>
                        <li>Enter your email address and create a password</li>
                        <li>Verify your email address if required</li>
                        <li>Complete your profile setup</li>
                        <li className="font-semibold text-primary">Note: The free account provides access to basic features, which is sufficient for getting started</li>
                      </ol>
                      </div>
                    </div>
                  </div>

                {/* Step 3: Get API Keys */}
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-xl border-2">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                      <Key className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                      <div className="flex-1">
                      <h5 className="text-xl font-semibold text-foreground mb-2">Step 3: Get API Keys from Kimi and Deepseek</h5>
                      <p className="text-sm text-muted-foreground mb-3">
                        API keys allow Trae.cn to connect to AI models. You'll need keys from at least one service.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="bg-background p-4 rounded border">
                          <h6 className="font-semibold mb-2">Getting Kimi API Key:</h6>
                          <ol className="list-decimal list-inside space-y-1 text-sm">
                            <li>Visit the Kimi website (moonshot.cn or similar)</li>
                            <li>Sign up for an account or log in</li>
                            <li>Navigate to the API section or Developer settings</li>
                            <li>Generate a new API key</li>
                            <li>Copy the API key (you'll need it in Trae.cn)</li>
                          </ol>
                        </div>

                        <div className="bg-background p-4 rounded border">
                          <h6 className="font-semibold mb-2">Getting Deepseek API Key:</h6>
                          <ol className="list-decimal list-inside space-y-1 text-sm">
                            <li>Visit the Deepseek website (deepseek.com)</li>
                            <li>Sign up for an account or log in</li>
                            <li>Go to the API or Developer section</li>
                            <li>Create a new API key</li>
                            <li>Copy the API key (you'll need it in Trae.cn)</li>
                          </ol>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border-l-4 border-yellow-500">
                          <p className="text-xs text-foreground">
                            <strong>Tip:</strong> Keep your API keys secure. Don't share them publicly. You can use either 
                            Kimi or Deepseek, or both. Having multiple options gives you flexibility.
                          </p>
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>

                {/* Step 4: Configure API Keys in Trae.cn */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl border-2">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
                      <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                      <div className="flex-1">
                      <h5 className="text-xl font-semibold text-foreground mb-2">Step 4: Configure API Keys in Trae.cn</h5>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-foreground">
                        <li>Open Trae.cn settings or preferences</li>
                        <li>Navigate to "API Keys" or "AI Model Settings"</li>
                        <li>Paste your Kimi API key in the appropriate field</li>
                        <li>Paste your Deepseek API key in the appropriate field (if using both)</li>
                        <li>Save the settings</li>
                        <li>Test the connection to ensure the API keys are working</li>
                      </ol>
                    </div>
                        </div>
                </div>

                {/* Step 5: Sign Up for Gitee.com */}
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-6 rounded-xl border-2">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-cyan-100 dark:bg-cyan-900 p-3 rounded-lg">
                      <Terminal className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-xl font-semibold text-foreground mb-2">Step 5: Sign Up for Gitee.com Account</h5>
                      <p className="text-sm text-muted-foreground mb-3">
                        Gitee.com is a code hosting platform (similar to GitHub) that we'll use to access agent templates.
                      </p>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-foreground">
                        <li>Visit gitee.com</li>
                        <li>Click "Sign Up" or "注册"</li>
                        <li>Create an account using your email address</li>
                        <li>Verify your email if required</li>
                        <li>Complete your profile</li>
                      </ol>
                      </div>
                    </div>
                  </div>

                {/* Step 6: Fork the Agent Repository */}
                <div className="bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 p-6 rounded-xl border-2">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-teal-100 dark:bg-teal-900 p-3 rounded-lg">
                      <GitFork className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                    </div>
                      <div className="flex-1">
                      <h5 className="text-xl font-semibold text-foreground mb-2">Step 6: Fork the Agent Repository</h5>
                      <p className="text-sm text-muted-foreground mb-3">
                        Forking creates your own copy of the agent template repository that you can customize.
                      </p>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-foreground">
                        <li>Log in to your Gitee.com account</li>
                        <li>Visit: <a href="https://gitee.com/simonwanghk/agent4eap" target="_blank" rel="noopener noreferrer" className="text-primary underline">https://gitee.com/simonwanghk/agent4eap</a></li>
                        <li>Click the "Fork" button (fork按钮) in the top right corner</li>
                        <li>Confirm the fork—this creates your own copy of the repository</li>
                        <li>You now have access to the agent template in your Gitee account</li>
                      </ol>
                      <div className="bg-background p-3 rounded border mt-3">
                        <p className="text-xs text-muted-foreground">
                          <strong>What is agent4eap?</strong> This is a template repository designed for educational 
                          AI agent projects. It provides a starting point for creating AI agents for teaching and learning tasks.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module3"
                questionId="setup-steps"
                question="What is the purpose of forking the agent4eap repository?"
                options={[
                  "To delete the original repository",
                  "To create your own copy of the agent template that you can customize",
                  "To share your API keys with others",
                  "To install Trae.cn automatically"
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
                      <p className="text-sm text-muted-foreground">AI answers questions in natural language (text only)</p>
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
                      <p className="text-sm text-muted-foreground">AI plans, codes, executes autonomously—acts on files and folders</p>
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
                    <BulletPoint icon="💬">
                      <strong>Chatbots vs. AI Agents:</strong> Chatbots respond in text only; AI agents can act on files, folders, and run code
                    </BulletPoint>
                    <BulletPoint icon="⚙️">
                      <strong>Basic Model:</strong> Input (file paths) → Process (natural language instructions) → Output (designated folders)
                    </BulletPoint>
                    <BulletPoint icon="🔧">
                      <strong>Trae.cn:</strong> An IDE for working with AI agents, integrating file management and code execution
                    </BulletPoint>
                    <BulletPoint icon="🚀">
                      <strong>Setup Complete:</strong> With Trae.cn, API keys, and the agent template, you're ready to use AI agents
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
                    question="Now that you understand the difference between chatbots and AI agents, what specific teaching task would you like an AI agent to help you with? Describe the task, what files or folders would be involved, and what outcome you're hoping for."
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

export default AIAgents;
