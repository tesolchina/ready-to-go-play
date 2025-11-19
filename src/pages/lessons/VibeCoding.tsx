import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { ComprehensionCheck } from "@/components/ComprehensionCheck";
import { BulletPoint } from "@/components/BulletPoint";
import { OpenEndedReflection } from "@/components/OpenEndedReflection";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const VibeCodingRevised = () => {
  const { toast } = useToast();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    module1: false,
    module2: false,
    module3: false,
    module4: false,
  });
  
  const [userDescription, setUserDescription] = useState("");
  const [mermaidCode, setMermaidCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Python exercise state
  const [wordInput, setWordInput] = useState("strawberry");
  const [letterInput, setLetterInput] = useState("r");
  const [pythonResult, setPythonResult] = useState("");

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
  
  const handleGenerateMermaid = async () => {
    if (!userDescription.trim()) {
      toast({
        title: "Input Required",
        description: "Please describe a process or concept to visualize",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-mermaid', {
        body: { description: userDescription }
      });
      
      if (error) throw error;
      
      if (data?.mermaidCode) {
        setMermaidCode(data.mermaidCode);
        toast({
          title: "Diagram Generated!",
          description: "Your mermaid diagram has been created successfully"
        });
      }
    } catch (error) {
      console.error('Error generating mermaid:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate diagram",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const runPythonExample = () => {
    // Simulate Python execution
    const count = wordInput.toLowerCase().split(letterInput.toLowerCase()).length - 1;
    const code = `word = "${wordInput}"
letter = "${letterInput}"
count = word.lower().count(letter.lower())
print(f"The letter '{letter}' appears {count} times in '{word}'")`;
    
    setPythonResult(`Generated Python Code:

${code}

Output:
The letter '${letterInput}' appears ${count} times in '${wordInput}'`);
    
    toast({
      title: "Code Executed!",
      description: `Found ${count} occurrence(s) of '${letterInput}' in '${wordInput}'`
    });
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
                    Lesson 4
                  </span>
                </div>
                <h1 className="text-5xl font-bold">
                  Vibe Coding: AI Generates Code for You
                </h1>
                <p className="text-2xl text-muted-foreground">
                  From Natural Language to Executable Code: Mermaid & Python in Action
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
                  <h5 className="text-xl font-semibold text-foreground mb-3">Quick Example</h5>
                  <div className="space-y-4">
                    <div>
                      <p className="text-foreground font-semibold mb-2">❌ Describing in Natural Language:</p>
                      <div className="bg-muted p-3 rounded text-sm italic">
                        "Can you create a flowchart showing research steps..."
                      </div>
                      <p className="text-muted-foreground text-sm mt-2">
                        AI describes it → You manually create it → Time consuming
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-foreground font-semibold mb-2">✅ Generating Code:</p>
                      <div className="bg-muted p-3 rounded text-sm italic">
                        "Generate Mermaid code for a research process flowchart"
                      </div>
                      <p className="text-muted-foreground text-sm mt-2">
                        AI generates code → Computer renders instantly → Automatic
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

            {/* Module 2: Hands-On with Mermaid */}
            <CollapsibleSection
              title="Hands-On: Generate Mermaid Diagrams"
              icon="📊"
              isOpen={openSections.module2}
              onToggle={() => toggleSection("module2")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground text-lg leading-relaxed">
                    <strong>Mermaid</strong> is a simple language for creating diagrams using text. Instead of using 
                    drawing tools, you write code and the computer renders beautiful diagrams.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-xl border-2">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    Example: Learning Process Flowchart
                  </h4>
                  
                  <div className="bg-background p-4 rounded border mb-4">
                    <p className="text-sm font-semibold mb-2">Mermaid Code:</p>
                    <pre className="text-xs overflow-x-auto bg-muted p-2 rounded">
{`graph TD
    A[Reading Input] --> B[Comprehension]
    B --> C[Practice]
    C --> D[Feedback]
    D --> E{Mastery?}
    E -->|Yes| F[Next Topic]
    E -->|No| C`}
                    </pre>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-2">Result:</p>
                    <MermaidDiagram
                      chart={`graph TD
    A[Reading Input] --> B[Comprehension]
    B --> C[Practice]
    C --> D[Feedback]
    D --> E{Mastery?}
    E -->|Yes| F[Next Topic]
    E -->|No| C`}
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    🎯 Your Turn: Generate a Diagram
                  </h4>
                  <p className="text-foreground mb-4">
                    Describe a process or concept from your teaching, and AI will generate Mermaid code for you.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">
                        Describe your diagram:
                      </label>
                      <Textarea
                        value={userDescription}
                        onChange={(e) => setUserDescription(e.target.value)}
                        placeholder="Example: A flowchart showing how students prepare for a presentation: choose topic, research, create slides, practice, present, get feedback"
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleGenerateMermaid}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Generate Mermaid Diagram
                    </Button>
                    
                    {mermaidCode && (
                      <div className="space-y-4 mt-6">
                        <div className="bg-background p-4 rounded border">
                          <p className="text-sm font-semibold mb-2">Generated Code:</p>
                          <pre className="text-xs overflow-x-auto bg-muted p-2 rounded whitespace-pre-wrap break-words">
                            {mermaidCode}
                          </pre>
                        </div>
                        <div className="bg-background p-4 rounded border">
                          <p className="text-sm font-semibold mb-2">Your Diagram:</p>
                          <MermaidDiagram chart={mermaidCode} />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    💡 Notice: You described it in English, AI generated code, computer rendered it automatically.
                  </p>
                </div>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module2"
                questionId="mermaid-understanding"
                question="What is the advantage of using Mermaid code over drawing tools?"
                options={[
                  "Code is text-based, easy to edit, version control, and regenerate",
                  "Mermaid creates more beautiful diagrams",
                  "Drawing tools don't work well",
                  "Code is faster to write than using a mouse"
                ]}
              />
            </CollapsibleSection>

            {/* Module 3: Hands-On with Python */}
            <CollapsibleSection
              title="Hands-On: Generate Python Code"
              icon="🐍"
              isOpen={openSections.module3}
              onToggle={() => toggleSection("module3")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">The Strawberry Problem</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    A famous AI test: "How many times does the letter 'r' appear in 'strawberry'?" Many AI models 
                    get this wrong when using natural language reasoning. But with code generation...
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-xl border-2">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    Why Code Works Better
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold mb-2">❌ Natural Language (Often Wrong):</p>
                      <div className="bg-muted p-3 rounded text-sm">
                        <p className="italic">"How many 'r' in 'strawberry'?"</p>
                        <p className="mt-2">AI: "Let me count... s-t-r-a-w-b-e-r-r-y... 2 times."</p>
                        <p className="mt-2 text-red-500 font-semibold">❌ Wrong! (Answer is 3)</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-2">✅ Python Code (Always Correct):</p>
                      <div className="bg-background p-3 rounded border">
                        <pre className="text-xs">{`word = "strawberry"
letter = "r"
count = word.count(letter)
print(f"'{letter}' appears {count} times")`}</pre>
                        <p className="mt-2 text-green-600 font-semibold">✓ Output: 'r' appears 3 times</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mt-4">
                    💡 When AI generates code, it uses precise computational tools, not "thinking."
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    🎯 Your Turn: Count Letters
                  </h4>
                  <p className="text-foreground mb-4">
                    Try different words and letters to see Python code generation in action.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold mb-2 block">Word:</label>
                        <Input
                          value={wordInput}
                          onChange={(e) => setWordInput(e.target.value)}
                          placeholder="e.g., strawberry"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-2 block">Letter to count:</label>
                        <Input
                          value={letterInput}
                          onChange={(e) => setLetterInput(e.target.value)}
                          placeholder="e.g., r"
                          maxLength={1}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={runPythonExample}
                      className="w-full"
                    >
                      <Code className="mr-2 h-4 w-4" />
                      Generate & Run Python Code
                    </Button>
                    
                    {pythonResult && (
                      <div className="bg-background p-4 rounded border">
                        <pre className="text-sm whitespace-pre-wrap font-mono">
                          {pythonResult}
                        </pre>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                    <p className="text-sm font-semibold mb-2">💡 Try These Examples:</p>
                    <ul className="text-sm space-y-1">
                      <li>• Word: "Mississippi", Letter: "s" (should find 4)</li>
                      <li>• Word: "programming", Letter: "m" (should find 2)</li>
                      <li>• Word: "teacher", Letter: "e" (should find 2)</li>
                    </ul>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mt-6 mb-3">Beyond Letter Counting</h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    This same principle applies to complex tasks: text analysis, data processing, pattern recognition. 
                    AI-generated code executes precisely while natural language descriptions remain ambiguous.
                  </p>
                </div>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module3"
                questionId="python-advantage"
                question="Why is AI-generated code more reliable than natural language for counting tasks?"
                options={[
                  "Code uses computational methods that guarantee accuracy",
                  "AI is better at writing code than natural language",
                  "Python is smarter than English",
                  "Natural language is too complex"
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
                      📊 Analyze Student Writing
                    </h5>
                    <p className="text-sm text-foreground mb-2">
                      <strong>Task:</strong> Count passive voice, sentence length, vocabulary frequency in 30 essays.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Vibe Coding:</strong> "Generate Python code to analyze text files for passive voice patterns, 
                      average sentence length, and academic word frequency. Output as CSV."
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-xl border-2">
                    <h5 className="text-xl font-semibold text-foreground mb-3">
                      📚 Reading Level Reports
                    </h5>
                    <p className="text-sm text-foreground mb-2">
                      <strong>Task:</strong> Determine CEFR levels and readability scores for your text collection.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Vibe Coding:</strong> "Generate Python code using textstat to calculate readability metrics 
                      for all .txt files and create an HTML report."
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl border-2">
                    <h5 className="text-xl font-semibold text-foreground mb-3">
                      🎯 Vocabulary Exercises
                    </h5>
                    <p className="text-sm text-foreground mb-2">
                      <strong>Task:</strong> Create 20 fill-in-the-blank exercises with target vocabulary.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Vibe Coding:</strong> "Generate Python code to search a corpus for vocabulary usage, 
                      create cloze exercises, and export to PDF."
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border-2">
                    <h5 className="text-xl font-semibold text-foreground mb-3">
                      🗂️ Organize Materials
                    </h5>
                    <p className="text-sm text-foreground mb-2">
                      <strong>Task:</strong> Sort 200 teaching files by topic, level, and skill.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Vibe Coding:</strong> "Generate Python code to scan documents, categorize by topic/level, 
                      rename files descriptively, and organize into folders."
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-lg">
                  <h5 className="text-xl font-semibold text-foreground mb-3">The Pattern</h5>
                  <p className="text-foreground mb-4">
                    These aren't coding tasks—they're teaching tasks that require time, technical skills, or repetitive work.
                  </p>
                  <ul className="space-y-2 list-none">
                    <BulletPoint icon="⏱️">
                      <strong>Time you don't have</strong> (analyzing hundreds of texts manually)
                    </BulletPoint>
                    <BulletPoint icon="🔧">
                      <strong>Skills you might lack</strong> (text processing, statistics)
                    </BulletPoint>
                    <BulletPoint icon="♻️">
                      <strong>Work you shouldn't do</strong> (repetitive counting, formatting)
                    </BulletPoint>
                  </ul>
                </div>

                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
                  "Vibe coding lets you describe what you need, and AI generates the automation tool. You don't become 
                  a programmer—you learn to describe tasks AI can translate into solutions."
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
                      <strong>Beyond Natural Language:</strong> Programming languages are for machines. AI bridges the gap.
                    </BulletPoint>
                    <BulletPoint icon="📊">
                      <strong>Mermaid Diagrams:</strong> Generate visual diagrams from text descriptions automatically.
                    </BulletPoint>
                    <BulletPoint icon="🐍">
                      <strong>Python Precision:</strong> Code generation ensures accuracy for calculations and analysis.
                    </BulletPoint>
                    <BulletPoint icon="🎓">
                      <strong>Teaching Automation:</strong> Use AI-generated code to handle repetitive tasks.
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
                  Try one experiment: Ask ChatGPT or Claude to "generate Python code to analyze a text file" 
                  for something in your teaching. See what code it creates. You don't need to run it—just observe 
                  how AI translates your intent into executable instructions.
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

