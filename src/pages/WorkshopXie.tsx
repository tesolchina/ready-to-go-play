import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, Globe, Monitor, CheckCircle2, Laptop, Lightbulb, MessageSquare, Key, AlertCircle, Cpu, FolderOpen, FileText, BookOpen, Terminal, Zap, ChevronUp, ChevronDown, ExternalLink, GraduationCap, FileEdit, Microscope, PenTool, Sparkles, Play, MessagesSquare, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { WorkshopUseCaseChat } from "@/components/WorkshopUseCaseChat";
import { WorkshopUseCaseBBS } from "@/components/WorkshopUseCaseBBS";
import traeIdeInterface from "@/assets/trae-ide-interface.png";

const WorkshopXie = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getTabFromHash = (hash: string) => {
    switch (hash) {
      case "#prep":
        return "preparation";
      case "#act":
        return "activities";
      case "#ref":
        return "reflection";
      default:
        return "preparation";
    }
  };

  const [activeTab, setActiveTab] = useState(getTabFromHash(location.hash));
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [bbsRefresh, setBbsRefresh] = useState(0);
  const [moduleStates, setModuleStates] = useState({
    module1: true,
    module2: true,
    module3: false,
    module4: false,
    module5: false,
    module6: true,
    module7: true,
    module8: true,
  });

  useEffect(() => {
    setActiveTab(getTabFromHash(location.hash));
  }, [location.hash]);

  const collapseAll = () => {
    setModuleStates({
      module1: false,
      module2: false,
      module3: false,
      module4: false,
      module5: false,
      module6: false,
      module7: false,
      module8: false,
    });
  };

  const expandAll = () => {
    setModuleStates({
      module1: true,
      module2: true,
      module3: true,
      module4: true,
      module5: true,
      module6: true,
      module7: true,
      module8: true,
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const hashMap: Record<string, string> = {
      preparation: "#prep",
      activities: "#act",
      reflection: "#ref",
    };
    navigate(`${location.pathname}${hashMap[value]}`, { replace: true });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold lg:hidden">Workshop - Dr. Xie's Group</h2>
          </header>
          <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    Workshop
                  </span>
                  <span className="text-muted-foreground">Dr. Qin Xie's Research Group</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Leveraging AI Agents in Integrated Development Environments
                </h1>
                <p className="text-xl text-muted-foreground">
                  A New Paradigm for Academic Research and Writing
                </p>
                <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-lg font-semibold">
                  Macau Workshop
                </div>
              </div>

              {/* Event Details */}
              <Card>
                <Collapsible open={registrationOpen} onOpenChange={setRegistrationOpen}>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full flex items-center justify-between p-6 h-auto hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5" />
                        <span className="text-lg font-semibold">Event Details</span>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${registrationOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-6 pt-0">
                      <div className="space-y-4">
                        <div className="grid gap-4">
                          <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                            <div>
                              <p className="font-medium">Date</p>
                              <p className="text-muted-foreground">TBD</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                            <div>
                              <p className="font-medium">Time</p>
                              <p className="text-muted-foreground">TBD</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                            <div>
                              <p className="font-medium">Location</p>
                              <p className="text-muted-foreground">Macau</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Monitor className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                            <div>
                              <p className="font-medium">Format</p>
                              <p className="text-muted-foreground">In-person</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Globe className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                            <div>
                              <p className="font-medium">Language</p>
                              <p className="text-muted-foreground">English</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Abstract */}
              <Card>
                <CardHeader>
                  <CardTitle>Abstract</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed mb-4">
                    This workshop introduces IDE-embedded AI agents as a powerful alternative to browser-based AI interactions for academic research. Unlike traditional chatbots that require constant context-switching, AI agents within Integrated Development Environments can directly access, read, and edit project files, perform web searches, and generate code to automate research tasks.
                  </p>
                  <p className="text-foreground leading-relaxed">
                    Participants will explore the Input-Process-Output model for automated research workflows, including batch processing of literature, systematic analysis of academic texts, and generation of research tools without programming experience.
                  </p>
                </CardContent>
              </Card>

              {/* Speaker Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Speaker</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-semibold mb-2">Dr. Simon Wang</h3>
                  <p className="text-muted-foreground mb-3">
                    Lecturer and Innovation Officer at the Language Centre, Hong Kong Baptist University
                  </p>
                  <p className="text-foreground leading-relaxed">
                    Dr. Simon Wang is a Lecturer in English and Innovation Officer at the Language Centre, Hong Kong Baptist University. With a passion for integrating technology into education, he specializes in harnessing innovative tools like Generative AI to empower educators and enhance learning experiences.
                  </p>
                </CardContent>
              </Card>

              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="w-full h-auto md:h-10 flex flex-col gap-2 md:grid md:grid-cols-3">
                  <TabsTrigger value="preparation" className="w-full justify-start md:justify-center text-xs md:text-sm px-3 py-2">
                    Preparation
                  </TabsTrigger>
                  <TabsTrigger value="activities" className="w-full justify-start md:justify-center text-xs md:text-sm px-3 py-2">
                    Workshop Activities
                  </TabsTrigger>
                  <TabsTrigger value="reflection" className="w-full justify-start md:justify-center text-xs md:text-sm px-3 py-2">
                    Reflection & Follow-up
                  </TabsTrigger>
                </TabsList>

                {/* PREPARATION TAB */}
                <TabsContent value="preparation" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Laptop className="h-5 w-5" />
                        Technical Setup
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Required Software</h3>
                        <ul className="space-y-2 text-foreground">
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>Trae IDE</strong> - Download and install from: <a href="https://trae.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">trae.ai</a>
                            </div>
                          </li>
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>Trae Account</strong> - Sign up for a free account at the website above, then log in from your local computer
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                        <h4 className="font-semibold mb-2">Installation Steps</h4>
                        <ol className="space-y-2 text-sm">
                          <li className="flex gap-2">
                            <span className="font-semibold">1.</span>
                            <span>Visit trae.ai</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">2.</span>
                            <span>Download the installer for your operating system (Windows/Mac/Linux)</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">3.</span>
                            <span>Run the installer and follow the setup instructions</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">4.</span>
                            <span>Create a Trae account or log in with your existing account</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">5.</span>
                            <span>Complete the initial setup and familiarize yourself with the interface</span>
                          </li>
                        </ol>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Lovable Account Setup</h3>
                        <ul className="space-y-2 text-foreground">
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>Create Lovable Account</strong> - Sign up with your university email at: <a href="https://lovable.dev/invite/C2CWJG8" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">lovable.dev/invite/C2CWJG8</a>
                            </div>
                          </li>
                        </ul>
                        <div className="mt-3 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                          <p className="text-sm">
                            <strong>Bonus:</strong> You will receive <strong>10 extra credits</strong> when you sign up through this invitation link with your university email!
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">AI Platform API Keys</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Choose one of the following platforms to obtain an API key for accessing AI language models:
                        </p>
                        <ul className="space-y-3 text-foreground">
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>Kimi (Moonshot AI)</strong> - <a href="https://platform.moonshot.cn/console/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">platform.moonshot.cn/console/api-keys</a>
                              <p className="text-sm text-muted-foreground mt-1">Offers CNY ¥15 in free credits</p>
                            </div>
                          </li>
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>DeepSeek</strong> - <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">platform.deepseek.com/api_keys</a>
                              <p className="text-sm text-muted-foreground mt-1">Free credits not available; may require adding funds (USD 5 max)</p>
                            </div>
                          </li>
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>OpenRouter</strong> - <a href="https://openrouter.ai/settings/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">openrouter.ai/settings/keys</a>
                              <p className="text-sm text-muted-foreground mt-1">Free credits not available; may require adding funds (USD 5 max)</p>
                            </div>
                          </li>
                        </ul>
                        <div className="mt-3 p-4 bg-muted rounded-lg">
                          <p className="text-sm">
                            <strong>Budget Estimate:</strong> USD 5-10 should be sufficient for workshop activities and experimentation with API-based language models.
                          </p>
                        </div>
                        <div className="mt-3 p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
                          <p className="text-sm font-semibold text-destructive">
                            ⚠️ Important: Save your API key immediately after generation! You will not be able to view it again. Store it in a secure location such as a password manager.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Laptop className="h-5 w-5" />
                        Clone Workshop Repository
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Get the Workshop Materials</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Clone the workshop repository using Trae IDE:
                        </p>
                        <ul className="space-y-3 text-foreground">
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>GitHub:</strong> <a href="https://github.com/tesolchina/Agent3Dec25" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono text-sm">https://github.com/tesolchina/Agent3Dec25</a>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                        <h4 className="font-semibold mb-2">How to Clone in Trae</h4>
                        <ol className="space-y-2 text-sm">
                          <li className="flex gap-2">
                            <span className="font-semibold">1.</span>
                            <span>Open Trae IDE</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">2.</span>
                            <span>Create a new folder or open an existing workspace</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">3.</span>
                            <span>Ask the Builder AI to clone the repository by typing: "Clone https://github.com/tesolchina/Agent3Dec25"</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">4.</span>
                            <span>The AI will handle the Git commands automatically</span>
                          </li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ACTIVITIES TAB */}
                <TabsContent value="activities" className="space-y-6">
                  <div className="flex justify-end gap-2 mb-4">
                    <Button variant="outline" size="sm" onClick={collapseAll}>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Collapse All
                    </Button>
                    <Button variant="outline" size="sm" onClick={expandAll}>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Expand All
                    </Button>
                  </div>

                  {/* Module 1 */}
                  <CollapsibleSection
                    title="Module 1: Chatbot vs AI Agent"
                    icon="💬"
                    isOpen={moduleStates.module1}
                    onToggle={() => setModuleStates(prev => ({ ...prev, module1: !prev.module1 }))}
                  >
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-3">Two Approaches to AI Communication</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-3 bg-background rounded border">
                            <h5 className="font-semibold text-primary mb-2">Chatbot (Browser-based)</h5>
                            <ul className="text-sm space-y-1">
                              <li>• Intuitive, natural language</li>
                              <li>• Context-switching consumes time</li>
                              <li>• Multimodal textual responses only</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-background rounded border">
                            <h5 className="font-semibold text-primary mb-2">AI Agent (IDE-based)</h5>
                            <ul className="text-sm space-y-1">
                              <li>• Natural language + more</li>
                              <li>• AI embedded in context</li>
                              <li>• Can read/edit files, search web, run scripts</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                        <h4 className="font-semibold mb-2">Key Insight</h4>
                        <p className="text-sm">
                          Large Language Models can now take <strong>actions</strong> on files and folders, not just produce text. This is the fundamental shift that makes AI agents more powerful for research workflows.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Trae IDE Interface Overview</h4>
                        <div className="rounded-lg overflow-hidden border">
                          <img 
                            src={traeIdeInterface} 
                            alt="Trae IDE Interface showing file explorer, editor, and Builder AI panel" 
                            className="w-full h-auto"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          The Trae IDE interface: File explorer (left), Code editor (center), Builder AI panel (right)
                        </p>
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* Module 2 */}
                  <CollapsibleSection
                    title="Module 2: Input-Process-Output Model"
                    icon="⚙️"
                    isOpen={moduleStates.module2}
                    onToggle={() => setModuleStates(prev => ({ ...prev, module2: !prev.module2 }))}
                  >
                    <div className="space-y-4">
                      <p className="text-foreground">
                        The Input-Process-Output model is the core framework for using AI agents effectively in research workflows.
                      </p>

                      <MermaidDiagram
                        chart={`graph LR
    A[📁 Input] --> B[⚙️ Process]
    B --> C[📄 Output]
    A -.-> D[Data folder path]
    B -.-> E[AI Agent instructions]
    C -.-> F[Results folder path]`}
                      />

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <h5 className="font-semibold text-primary mb-2 flex items-center gap-2">
                            <FolderOpen className="h-4 w-4" />
                            Input
                          </h5>
                          <ul className="text-sm space-y-1">
                            <li>• Select data folder</li>
                            <li>• Right-click to copy path</li>
                            <li>• Contains source files</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <h5 className="font-semibold text-primary mb-2 flex items-center gap-2">
                            <Terminal className="h-4 w-4" />
                            Process
                          </h5>
                          <ul className="text-sm space-y-1">
                            <li>• Write natural language instructions</li>
                            <li>• AI agent executes tasks</li>
                            <li>• Automated workflow</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <h5 className="font-semibold text-primary mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Output
                          </h5>
                          <ul className="text-sm space-y-1">
                            <li>• Specify destination folder</li>
                            <li>• Results saved automatically</li>
                            <li>• Structured data files</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* Module 3: Lab 1 */}
                  <CollapsibleSection
                    title="Lab 1: Explore BAWE Corpus"
                    icon="📁"
                    isOpen={moduleStates.module3}
                    onToggle={() => setModuleStates(prev => ({ ...prev, module3: !prev.module3 }))}
                  >
                    <div className="space-y-4">
                      <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Objective:</strong> Explore the BAWE corpus structure and ask the AI agent to generate a summary report.
                        </AlertDescription>
                      </Alert>

                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-3">Steps</h4>
                        <ol className="space-y-2 text-sm">
                          <li className="flex gap-2">
                            <span className="font-semibold">1.</span>
                            <span>Navigate to the Data/BAWE folder in the repository</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">2.</span>
                            <span>Right-click on the folder and copy the path</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">3.</span>
                            <span>Ask Builder: "Explore the folder at [path] and tell me what's in it"</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">4.</span>
                            <span>Ask Builder to generate a summary report of the corpus structure</span>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* Module 4: Lab 2 */}
                  <CollapsibleSection
                    title="Lab 2: Batch Analysis with API"
                    icon="⚡"
                    isOpen={moduleStates.module4}
                    onToggle={() => setModuleStates(prev => ({ ...prev, module4: !prev.module4 }))}
                  >
                    <div className="space-y-4">
                      <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Objective:</strong> Use AI agent with LLM API to batch-process multiple essays automatically.
                        </AlertDescription>
                      </Alert>

                      <MermaidDiagram
                        chart={`graph TD
    A[📁 BAWE Essays] --> B[🤖 AI Agent]
    B --> C[📡 LLM API]
    C --> D[📊 Analysis Results]
    D --> E[📄 CSV Output]`}
                      />

                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-3">Input-Process-Output</h4>
                        <ul className="space-y-2 text-sm">
                          <li><strong>Input:</strong> Data/BAWE/CORPUS_ByDiscipline folder</li>
                          <li><strong>Process:</strong> Send each file to LLM with analysis prompt</li>
                          <li><strong>Output:</strong> Lab2_Results/analysis_results.csv</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                        <h4 className="font-semibold mb-2">Key Benefit</h4>
                        <p className="text-sm">
                          Eliminates copy-paste workflow. The AI agent handles file reading, API calls, and result compilation automatically.
                        </p>
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* Module 5: Lab 3 */}
                  <CollapsibleSection
                    title="Lab 3: Literature Screening"
                    icon="📚"
                    isOpen={moduleStates.module5}
                    onToggle={() => setModuleStates(prev => ({ ...prev, module5: !prev.module5 }))}
                  >
                    <div className="space-y-4">
                      <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Objective:</strong> Automate literature review screening using batch API processing.
                        </AlertDescription>
                      </Alert>

                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-3">Use Case: Systematic Literature Review</h4>
                        <p className="text-sm mb-3">
                          Screen academic studies from a CSV file, categorizing each by:
                        </p>
                        <ul className="text-sm space-y-1 ml-4">
                          <li>• Study context</li>
                          <li>• Research objective</li>
                          <li>• Data analyzed</li>
                          <li>• Main findings</li>
                          <li>• Implications</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-3">Input-Process-Output</h4>
                        <ul className="space-y-2 text-sm">
                          <li><strong>Input:</strong> Data/Literature/bawe_ddl_studies.csv</li>
                          <li><strong>Process:</strong> Screen first 10 studies using LLM API</li>
                          <li><strong>Output:</strong> Lab3_Results/screening_results.csv</li>
                        </ul>
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* Module 6: Vibe Coding */}
                  <CollapsibleSection
                    title="Lab 4: Vibe Coding with Lovable"
                    icon="✨"
                    isOpen={moduleStates.module6}
                    onToggle={() => setModuleStates(prev => ({ ...prev, module6: !prev.module6 }))}
                  >
                    <div className="space-y-4">
                      <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Objective:</strong> Experience "vibe coding" - building web applications through natural language conversation.
                        </AlertDescription>
                      </Alert>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <h5 className="font-semibold text-primary mb-2">Path 1: Direct Lovable</h5>
                          <ul className="text-sm space-y-1">
                            <li>• Talk directly to Lovable</li>
                            <li>• Modify project in-browser</li>
                            <li>• Instant visual feedback</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <h5 className="font-semibold text-primary mb-2">Path 2: Trae + GitHub</h5>
                          <ul className="text-sm space-y-1">
                            <li>• Clone via GitHub</li>
                            <li>• Use Trae AI to write code</li>
                            <li>• Commit and push changes</li>
                            <li>• Lovable auto-syncs</li>
                          </ul>
                        </div>
                      </div>

                      <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                        <h4 className="font-semibold mb-2">Project: OpenRouter Hub</h4>
                        <p className="text-sm mb-2">
                          Clone and extend the OpenRouter Hub project:
                        </p>
                        <a 
                          href="https://github.com/tesolchina/openrouter-hub" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline font-mono text-sm"
                        >
                          github.com/tesolchina/openrouter-hub
                        </a>
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* Module 7: Use Case Discussion */}
                  <CollapsibleSection
                    title="Module 7: Use Case Discussion"
                    icon="💭"
                    isOpen={moduleStates.module7}
                    onToggle={() => setModuleStates(prev => ({ ...prev, module7: !prev.module7 }))}
                  >
                    <div className="space-y-4">
                      <p className="text-foreground">
                        How might you leverage API technology to send multiple files and texts for automated processing? Discuss your ideas with the AI below.
                      </p>
                      <WorkshopUseCaseChat onConversationShared={() => setBbsRefresh(prev => prev + 1)} />
                    </div>
                  </CollapsibleSection>

                  {/* Module 8: Shared Discussions */}
                  <CollapsibleSection
                    title="Shared Discussions"
                    icon="🎓"
                    isOpen={moduleStates.module8}
                    onToggle={() => setModuleStates(prev => ({ ...prev, module8: !prev.module8 }))}
                  >
                    <div className="space-y-4">
                      <p className="text-foreground">
                        View and learn from other participants' use case ideas:
                      </p>
                      <WorkshopUseCaseBBS refreshTrigger={bbsRefresh} />
                    </div>
                  </CollapsibleSection>
                </TabsContent>

                {/* REFLECTION TAB */}
                <TabsContent value="reflection" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        Key Takeaways
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-foreground">
                        <li className="flex gap-3">
                          <span className="text-primary font-bold">•</span>
                          <span><strong>Eliminate context-switching:</strong> AI agents work directly within your project environment</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-primary font-bold">•</span>
                          <span><strong>Automate literature reviews:</strong> Use AI for systematic literature analysis and data collection</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-primary font-bold">•</span>
                          <span><strong>Generate research tools:</strong> Create web crawlers and analysis scripts without programming experience</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-primary font-bold">•</span>
                          <span><strong>Streamline workflows:</strong> Integrate AI assistance into existing research processes</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-primary font-bold">•</span>
                          <span><strong>Access advanced capabilities:</strong> Leverage code generation for novel research methodologies</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Further Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <a 
                          href="https://trae.ai" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-4 border rounded-lg hover:bg-muted transition-colors"
                        >
                          <h4 className="font-semibold mb-1">Trae IDE</h4>
                          <p className="text-sm text-muted-foreground">AI-powered development environment</p>
                        </a>
                        <a 
                          href="https://lovable.dev" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-4 border rounded-lg hover:bg-muted transition-colors"
                        >
                          <h4 className="font-semibold mb-1">Lovable</h4>
                          <p className="text-sm text-muted-foreground">Build web apps with AI</p>
                        </a>
                        <a 
                          href="https://openrouter.ai" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-4 border rounded-lg hover:bg-muted transition-colors"
                        >
                          <h4 className="font-semibold mb-1">OpenRouter</h4>
                          <p className="text-sm text-muted-foreground">Unified API for multiple LLMs</p>
                        </a>
                        <a 
                          href="https://github.com/tesolchina" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-4 border rounded-lg hover:bg-muted transition-colors"
                        >
                          <h4 className="font-semibold mb-1">Workshop Repository</h4>
                          <p className="text-sm text-muted-foreground">GitHub resources and examples</p>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default WorkshopXie;
