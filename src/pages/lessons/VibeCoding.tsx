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
import { useAIServiceGuard } from "@/hooks/useAIServiceGuard";
import { getAIHeaders } from "@/lib/aiServiceGuard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const VibeCodingRevised = () => {
  const { toast } = useToast();
  const { isActivated, checkAndNotify } = useAIServiceGuard();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    module1: false,
    module2: false,
    module3: false,
    module4: false,
    module5: false,
  });
  
  const [userDescription, setUserDescription] = useState("Data driven learning: students learn usage of a specific word by examining concordance lines from an expert corpus");
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
    if (!checkAndNotify()) return;
    
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
        body: { description: userDescription },
        headers: getAIHeaders()
      });
      
      if (error) {
        throw new Error(data?.error || error.message || "Failed to generate diagram");
      }
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
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
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold break-words">
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
                    <strong>natural language evolved for human-to-human communication, not for human-to-machine communication.</strong>
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
                {!isActivated && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      AI services are not configured. Please{" "}
                      <Link to="/lessons" className="underline font-semibold">
                        configure your API key
                      </Link>{" "}
                      to use diagram generation features.
                    </AlertDescription>
                  </Alert>
                )}
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
                      <p className="text-sm text-muted-foreground mb-2 italic">
                        💡 Try the example below or edit it to create your own Mermaid diagram!
                      </p>
                      <Textarea
                        value={userDescription}
                        onChange={(e) => setUserDescription(e.target.value)}
                        placeholder="Example: A flowchart showing how students prepare for a presentation: choose topic, research, create slides, practice, present, get feedback"
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleGenerateMermaid}
                      disabled={isGenerating || !isActivated}
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

            {/* Module 4: Advanced Case Study - Reference Validator */}
            <CollapsibleSection
              title="Advanced Case Study: Reference Validator"
              icon="📚"
              isOpen={openSections.module4}
              onToggle={() => toggleSection("module4")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground text-lg leading-relaxed">
                    Now let's explore a real-world application that demonstrates the power of vibe coding: 
                    <strong>the Academic Reference Validator</strong>. This tool shows how AI-generated code can 
                    automate complex, repetitive tasks and leverage external computing resources at scale.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-xl border-2">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">The Challenge</h4>
                  <p className="text-foreground mb-4">
                    Teachers often need to verify student references: checking if DOIs work, if URLs are valid, 
                    and if the citations can be found in academic databases. Doing this manually for even 10 
                    references is tedious. For 100 references? Nearly impossible.
                  </p>
                  
                  <div className="bg-muted p-4 rounded">
                    <p className="text-sm font-semibold mb-2">Manual Process (Traditional):</p>
                    <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                      <li>Copy each reference one by one</li>
                      <li>Manually check if DOI links work</li>
                      <li>Visit multiple databases to search for citations</li>
                      <li>Record results in a spreadsheet</li>
                      <li>Time: ~5 minutes per reference × 20 references = <strong>100 minutes</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border-2">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">The Vibe Coding Solution</h4>
                  
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
                        Automation of Repetitive Tasks
                      </h5>
                      <p className="text-foreground mb-2">
                        AI-generated code automatically parses the entire reference section and identifies each 
                        reference line—no manual copy-paste needed.
                      </p>
                      <div className="bg-muted p-3 rounded text-sm">
                        <p className="font-semibold mb-1">What the code does:</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>Detects reference formatting patterns</li>
                          <li>Separates individual references</li>
                          <li>Extracts DOIs and URLs automatically</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
                        Introducing APIs: Connecting to External Services
                      </h5>
                      <p className="text-foreground mb-2">
                        <strong>API (Application Programming Interface)</strong> is how programs communicate with 
                        external services. Instead of visiting websites manually, code sends requests to APIs.
                      </p>
                      <div className="bg-background p-4 rounded border space-y-3">
                        <div>
                          <p className="font-semibold text-sm mb-1">Example: CrossRef API for DOI Validation</p>
                          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
{`// AI-generated code sends DOI to CrossRef API
fetch('https://api.crossref.org/works/' + doi)
  .then(response => response.json())
  .then(data => {
    // Validates if DOI exists and retrieves metadata
    console.log('Valid DOI:', data.title);
  });`}
                          </pre>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          💡 The code sends the DOI to CrossRef's servers, which check millions of academic 
                          records instantly and return validation results.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
                        Searching Databases at Scale
                      </h5>
                      <p className="text-foreground mb-2">
                        The validator doesn't stop at DOI checking—it also searches academic databases like 
                        Europe PMC to find references that might be missing DOIs.
                      </p>
                      <div className="bg-muted p-3 rounded text-sm space-y-2">
                        <p className="font-semibold">For each reference, the code:</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>Extracts author names and publication year</li>
                          <li>Constructs search queries automatically</li>
                          <li>Sends queries to Europe PMC API</li>
                          <li>Retrieves matching papers with metadata</li>
                          <li>All done in parallel for 20+ references simultaneously</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-xl border-2">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    ⚡ The Power of Computing Resources at Scale
                  </h4>
                  
                  <div className="space-y-4">
                    <p className="text-foreground">
                      <strong>Key Insight:</strong> Once you start using vibe coding, you're not just writing code—you're 
                      leveraging massive computing infrastructure:
                    </p>
                    
                    <ul className="space-y-3 list-none">
                      <BulletPoint icon="🌐">
                        <strong>CrossRef Database:</strong> 150+ million DOI records checked instantly
                      </BulletPoint>
                      <BulletPoint icon="📚">
                        <strong>Europe PMC:</strong> 40+ million abstracts and full-text papers searchable
                      </BulletPoint>
                      <BulletPoint icon="⚡">
                        <strong>Parallel Processing:</strong> Code checks 20 references simultaneously, not sequentially
                      </BulletPoint>
                      <BulletPoint icon="🔄">
                        <strong>Automated Retry Logic:</strong> Handles errors and rate limits automatically
                      </BulletPoint>
                    </ul>
                    
                    <div className="bg-background p-4 rounded border mt-4">
                      <p className="text-sm font-semibold mb-2">Result:</p>
                      <p className="text-foreground">
                        <strong>Manual checking: ~100 minutes</strong> for 20 references<br />
                        <strong>AI-generated validator: ~30 seconds</strong> for 20 references<br />
                        <span className="text-primary font-bold">200× faster with more comprehensive results</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    🎯 Try It Yourself
                  </h4>
                  <p className="text-foreground mb-3">
                    Experience the Reference Validator in our Learning Apps section:
                  </p>
                  <Link to="/validate-references">
                    <Button className="w-full" size="lg">
                      Open Reference Validator →
                    </Button>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-3">
                    💡 Notice how the tool automates parsing, API calls, and database searches—all from 
                    AI-generated code that would take hours to write manually.
                  </p>
                </div>

                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
                  "Vibe coding isn't just about generating code—it's about accessing computing resources at scale. 
                  You describe the task, AI generates code that taps into global databases and APIs, performing 
                  in seconds what would take hours manually."
                </blockquote>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module4"
                questionId="api-understanding"
                question="What is the main advantage of using APIs in the Reference Validator?"
                options={[
                  "APIs enable code to access external databases and computing resources at scale",
                  "APIs make the code run faster on your computer",
                  "APIs are easier to write than regular code",
                  "APIs eliminate the need for validation"
                ]}
              />
            </CollapsibleSection>

            {/* Module 5: Teaching Applications */}
            <CollapsibleSection
              title="Apply to Your Teaching"
              icon="🎓"
              isOpen={openSections.module5}
              onToggle={() => toggleSection("module5")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground text-lg leading-relaxed">
                    Vibe coding isn't about becoming a programmer—it's about <strong>using AI to automate teaching tasks</strong>. 
                    Here are two powerful approaches that unlock new possibilities for your teaching:
                  </p>
                </div>

                {/* Batch File Processing via API */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border-2">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    📦 Idea 1: Send Files to LLMs in Batches Through API
                  </h4>
                  
                  <div className="space-y-4">
                    <p className="text-foreground mb-3">
                      <strong>The Challenge:</strong> You have 50 student essays, 100 reading passages, or 200 assignment files 
                      that need analysis. Copy-pasting each one into ChatGPT is impractical. How do you process them all at scale?
                    </p>
                    
                    <div className="bg-muted p-4 rounded">
                      <p className="text-sm font-semibold mb-2">❌ Manual Approach (Traditional):</p>
                      <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                        <li>Open each file one by one</li>
                        <li>Copy content into ChatGPT</li>
                        <li>Wait for response</li>
                        <li>Copy results to a spreadsheet</li>
                        <li>Time: ~3 minutes per file × 50 files = <strong>150 minutes</strong></li>
                      </ul>
                    </div>

                    <div className="bg-background p-4 rounded border">
                      <p className="text-sm font-semibold mb-2">✅ Batch API Approach (Vibe Coding):</p>
                      <p className="text-foreground text-sm mb-3">
                        <strong>API (Application Programming Interface)</strong> allows your code to send multiple files 
                        to LLMs programmatically—not through a web interface, but through code that communicates directly 
                        with AI services.
                      </p>
                      <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`# AI-generated code sends files to LLM API in batches
import openai

files = ['essay1.txt', 'essay2.txt', ..., 'essay50.txt']

for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{
            "role": "user",
            "content": f"Analyze this essay: {content}"
        }]
    )
    # Save results automatically
    save_analysis(file, response.choices[0].message.content)`}
                      </pre>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                      <h5 className="text-lg font-semibold text-foreground mb-2">🎯 Teaching Applications:</h5>
                      <ul className="space-y-2 list-none">
                        <BulletPoint icon="📝">
                          <strong>Batch Essay Analysis:</strong> "Generate Python code to send 50 student essays to OpenAI API 
                          in batches, analyze for grammar patterns, vocabulary complexity, and coherence. Save results to CSV."
                        </BulletPoint>
                        <BulletPoint icon="📚">
                          <strong>Reading Passage Processing:</strong> "Generate code to process 100 reading passages through 
                          Claude API, extract key vocabulary, generate comprehension questions, and create teaching materials."
                        </BulletPoint>
                        <BulletPoint icon="✅">
                          <strong>Assignment Feedback:</strong> "Generate code to batch-send assignment files to LLM API, 
                          generate personalized feedback, and email results to students automatically."
                        </BulletPoint>
                      </ul>
                    </div>

                    <div className="bg-background p-4 rounded border mt-4">
                      <p className="text-sm font-semibold mb-2">⚡ The Power:</p>
                      <p className="text-foreground">
                        <strong>Manual processing: ~150 minutes</strong> for 50 files<br />
                        <strong>Batch API processing: ~5 minutes</strong> for 50 files<br />
                        <span className="text-primary font-bold">30× faster with consistent quality</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Leveraging GitHub Projects */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-xl border-2">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    🐙 Idea 2: Leverage GitHub Projects (e.g., WordNet)
                  </h4>
                  
                  <div className="space-y-4">
                    <p className="text-foreground mb-3">
                      <strong>The Challenge:</strong> You need advanced language tools—word relationships, synonyms, semantic 
                      networks, corpus data—but building these from scratch would take months. How do you access professional-grade 
                      resources instantly?
                    </p>
                    
                    <div className="bg-muted p-4 rounded">
                      <p className="text-sm font-semibold mb-2">❌ Building from Scratch (Impossible):</p>
                      <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                        <li>Create word relationship databases</li>
                        <li>Collect millions of text samples</li>
                        <li>Develop semantic analysis algorithms</li>
                        <li>Time: <strong>Months or years of development</strong></li>
                      </ul>
                    </div>

                    <div className="bg-background p-4 rounded border">
                      <p className="text-sm font-semibold mb-2">✅ Leveraging GitHub Projects (Vibe Coding):</p>
                      <p className="text-foreground text-sm mb-3">
                        <strong>GitHub</strong> hosts thousands of open-source projects—complete tools, datasets, and libraries 
                        built by researchers and developers worldwide. Instead of building tools, you <strong>leverage existing ones</strong> 
                        through code.
                      </p>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold mb-1">Example: WordNet (Word Relationship Database)</p>
                          <p className="text-xs text-muted-foreground mb-2">
                            WordNet is a lexical database with 155,000+ words and their relationships. 
                            <a href="https://github.com/wordnet/wordnet" target="_blank" rel="noopener noreferrer" 
                               className="text-primary underline ml-1">
                              https://github.com/wordnet/wordnet
                            </a>
                          </p>
                          <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`# AI-generated code uses WordNet from GitHub
from nltk.corpus import wordnet as wn

# Find synonyms for "happy"
synonyms = wn.synsets('happy')
for syn in synonyms:
    print(f"Meaning: {syn.definition()}")
    print(f"Synonyms: {syn.lemma_names()}")

# Find word relationships
word = wn.synset('teacher.n.01')
print(f"Hypernyms (more general): {word.hypernyms()}")
print(f"Hyponyms (more specific): {word.hyponyms()}")`}
                          </pre>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                      <h5 className="text-lg font-semibold text-foreground mb-2">🎯 Teaching Applications:</h5>
                      <ul className="space-y-2 list-none">
                        <BulletPoint icon="📖">
                          <strong>Vocabulary Expansion Tools:</strong> "Generate Python code using WordNet to create synonym 
                          exercises, word relationship maps, and semantic vocabulary lists for your teaching materials."
                        </BulletPoint>
                        <BulletPoint icon="🔍">
                          <strong>Corpus Analysis:</strong> "Generate code to use NLTK (Natural Language Toolkit from GitHub) 
                          to analyze your text collection, extract collocations, and identify key phrases automatically."
                        </BulletPoint>
                        <BulletPoint icon="🌐">
                          <strong>Language Datasets:</strong> "Generate code to access large text corpora from GitHub projects, 
                          filter by topic/level, and create customized reading materials for your students."
                        </BulletPoint>
                      </ul>
                    </div>

                    <div className="bg-background p-4 rounded border mt-4">
                      <p className="text-sm font-semibold mb-2">⚡ The Power:</p>
                      <p className="text-foreground text-sm">
                        Instead of months of development, you <strong>leverage existing GitHub projects</strong>—professional-grade 
                        tools built by experts—through simple code that AI can generate. You get access to:
                      </p>
                      <ul className="text-sm space-y-1 mt-2 list-disc list-inside text-muted-foreground">
                        <li>155,000+ word relationships (WordNet)</li>
                        <li>Millions of text samples (various corpus projects)</li>
                        <li>State-of-the-art NLP tools (NLTK, spaCy, etc.)</li>
                        <li>All accessible through AI-generated code</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* AI Agents Integration */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border-2">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">
                    🤖 Write Code with AI Assistance: AI Agents
                  </h4>
                  <p className="text-foreground mb-3">
                    You've learned how to ask AI to generate code. But what if AI could automatically plan tasks, 
                    access your files, write code, AND execute it autonomously—all while you provide guidance?
                  </p>
                  <p className="text-muted-foreground text-sm mb-4">
                    In our <strong>AI Agents</strong> lesson, discover how AI assistants can write code interactively, 
                    access your local files, run code, and iterate based on your feedback—making vibe coding even more powerful.
                  </p>
                  <Link to="/lessons/ai-agents">
                    <Button className="w-full" size="lg" variant="outline">
                      <Code className="mr-2 h-4 w-4" />
                      Learn: AI Agents for Interactive Code Writing →
                    </Button>
                  </Link>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-lg">
                  <h5 className="text-xl font-semibold text-foreground mb-3">The Pattern</h5>
                  <p className="text-foreground mb-4">
                    These aren't coding tasks—they're teaching tasks that require time, technical skills, or access to resources 
                    beyond manual capability.
                  </p>
                  <ul className="space-y-2 list-none">
                    <BulletPoint icon="⏱️">
                      <strong>Time you don't have</strong> (processing hundreds of files manually)
                    </BulletPoint>
                    <BulletPoint icon="🔧">
                      <strong>Resources you can't build</strong> (massive databases, complex tools)
                    </BulletPoint>
                    <BulletPoint icon="🌐">
                      <strong>Scale you need</strong> (batch processing, API access, leveraging existing projects)
                    </BulletPoint>
                    <BulletPoint icon="🤖">
                      <strong>AI assistance</strong> (code generation, interactive development, autonomous execution)
                    </BulletPoint>
                  </ul>
                </div>

                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
                  "Vibe coding lets you describe what you need, and AI generates the automation tool. You don't become 
                  a programmer—you learn to leverage APIs, GitHub projects, and AI agents to access resources at scale."
                </blockquote>
              </div>

              <ComprehensionCheck
                lessonSlug={lessonSlug}
                sectionId="module5"
                questionId="teaching-applications"
                question="What are the two main ideas for applying vibe coding to teaching?"
                options={[
                  "Batch file processing via API and leveraging GitHub projects",
                  "Writing code from scratch and manual file processing",
                  "Using ChatGPT web interface and building custom tools",
                  "Learning programming languages and software development"
                ]}
              />
            </CollapsibleSection>

            {/* Summary */}
            <CollapsibleSection
              title="Lesson Summary"
              icon="🎓"
              isOpen={openSections.module5}
              onToggle={() => toggleSection("module5")}
            >
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">Key Takeaways</h4>
                  <ul className="space-y-3 list-none">
                    <BulletPoint icon="💬">
                      <strong>Beyond Natural Language:</strong> Programming languages are for machines. AI bridges the gap.
                    </BulletPoint>
                    <BulletPoint icon="📊">
                      <strong>Basic Examples:</strong> Mermaid for diagrams, Python for calculations—simple introductions to code generation.
                    </BulletPoint>
                    <BulletPoint icon="📚">
                      <strong>Advanced Case Study:</strong> Reference Validator demonstrates automation, APIs, and computing at scale.
                    </BulletPoint>
                    <BulletPoint icon="🌐">
                      <strong>Leverage Resources:</strong> Vibe coding connects you to global databases and computing infrastructure.
                    </BulletPoint>
                    <BulletPoint icon="🎓">
                      <strong>Teaching Applications:</strong> Automate repetitive tasks and access resources beyond manual capability.
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default VibeCodingRevised;



