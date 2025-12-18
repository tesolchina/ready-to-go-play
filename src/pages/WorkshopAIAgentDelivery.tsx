import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Laptop, Lightbulb, MessageSquare, ArrowLeft, Mail, ChevronDown, Terminal, Zap, ChevronUp, FileText, BookOpen, Key, AlertCircle, Info, Cpu, FolderOpen, GraduationCap, FileEdit, Microscope, PenTool, Sparkles, Monitor, ExternalLink, Play, MessagesSquare, GitBranch } from "lucide-react";
import { WorkshopUseCaseChat } from "@/components/WorkshopUseCaseChat";
import { WorkshopUseCaseBBS } from "@/components/WorkshopUseCaseBBS";
import { WorkshopInterestForm } from "@/components/WorkshopInterestForm";
import genaiCop2QR from "@/assets/genai-cop2-qr.jpg";
import wechatSimonQR from "@/assets/wechat-simon-qr.jpg";
import vscodeIdeInterface from "@/assets/vscode-ide-interface.png";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { CollapsibleSection } from "@/components/CollapsibleSection";

const WorkshopAIAgentDelivery = () => {
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
  const [bbsRefresh, setBbsRefresh] = useState(0);
  const [moduleStates, setModuleStates] = useState({
    module1: true,
    module2: true,
    workshopNotes1: false,
    module3: false,
    break1: false,
    module4: false,
    module5: false,
    break2: true,
    realWorld: true,
    module6: true,
    adhocNotes: false,
  });

  useEffect(() => {
    setActiveTab(getTabFromHash(location.hash));
  }, [location.hash]);

  const collapseAll = () => {
    setModuleStates({
      module1: false,
      module2: false,
      workshopNotes1: false,
      module3: false,
      break1: false,
      module4: false,
      module5: false,
      break2: false,
      realWorld: false,
      module6: false,
      adhocNotes: false,
    });
  };

  const expandAll = () => {
    setModuleStates({
      module1: true,
      module2: true,
      workshopNotes1: false,
      module3: false,
      break1: false,
      module4: false,
      module5: false,
      break2: true,
      realWorld: true,
      module6: true,
      adhocNotes: false,
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
            <h2 className="text-lg font-semibold lg:hidden">Workshop Delivery</h2>
          </header>
          <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">
                  Leveraging Generative AI to Prepare for Master's Dissertation Writing
                </h1>
                <p className="text-xl text-muted-foreground">
                  Complete guide for participants - preparation, activities, and follow-up
                </p>
              </div>

              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Welcome to the workshop! This page contains all materials and activities for participants.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col items-center gap-4">
                <div className="text-center space-y-1">
                  <p className="text-lg font-semibold text-foreground">Date: 19 Dec 2025 (Fri)</p>
                  <p className="text-lg font-semibold text-foreground">Time: 18:30</p>
                  <p className="text-lg font-semibold text-foreground">Venue: SCT501</p>
                </div>
              </div>

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
                              <strong>VS Code</strong> (Required) - You should already have VS Code installed on your computer
                            </div>
                          </li>
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>GitHub Copilot</strong> (Required) - You should already have GitHub Copilot extension installed and configured in VS Code
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">AI Platform API Key</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Obtain an API key from HKBU GenAI Platform:
                        </p>
                        <ul className="space-y-3 text-foreground">
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>HKBU GenAI Platform</strong> - <a href="https://genai.hkbu.edu.hk/settings/api-docs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">genai.hkbu.edu.hk/settings/api-docs</a>
                              <p className="text-sm text-muted-foreground mt-1">Log in with your HKBU credentials to access the API documentation and obtain your API key</p>
                            </div>
                          </li>
                        </ul>
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
                          Clone the workshop repository using VS Code:
                        </p>
                        <ul className="space-y-3 text-foreground">
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>GitHub Repository:</strong> <a href="https://github.com/tesolchina/math19Dec.git" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono text-sm">https://github.com/tesolchina/math19Dec.git</a>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                        <h4 className="font-semibold mb-2">How to Clone in VS Code</h4>
                        <ol className="space-y-2 text-sm">
                          <li className="flex gap-2">
                            <span className="font-semibold">1.</span>
                            <span>Open VS Code</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">2.</span>
                            <span>Press <code className="bg-muted px-2 py-1 rounded">Ctrl+Shift+P</code> (Windows) or <code className="bg-muted px-2 py-1 rounded">Cmd+Shift+P</code> (Mac) to open Command Palette</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">3.</span>
                            <span>Type "Git: Clone" and select the option</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">4.</span>
                            <span>Paste the repository URL: <code className="bg-muted px-2 py-1 rounded text-xs">https://github.com/tesolchina/math19Dec.git</code></span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">5.</span>
                            <span>Choose a local folder to save the project and open it in VS Code</span>
                          </li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>

                </TabsContent>

                {/* ACTIVITIES TAB */}
                <TabsContent value="activities" className="space-y-6">
                  <div className="flex justify-end mb-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const allClosed = Object.values(moduleStates).every(v => !v);
                        if (allClosed) {
                          expandAll();
                        } else {
                          collapseAll();
                        }
                      }}
                      className="gap-2"
                    >
                      {Object.values(moduleStates).every(v => !v) ? (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Expand All
                        </>
                      ) : (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Collapse All
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {/* Module 1: Conceptual Understanding */}
                  <Collapsible 
                    open={moduleStates.module1} 
                    onOpenChange={(open) => setModuleStates({...moduleStates, module1: open})}
                  >
                    <Card className="border-2 border-primary">
                      <CollapsibleTrigger asChild>
                        <button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between hover:from-primary/90 hover:to-primary/70 transition-all">
                          <h3 className="font-semibold text-left flex items-center gap-2 text-xl">
                            <Lightbulb className="h-6 w-6" />
                            Module 1: Conceptual Understanding - Two Ways to Communicate with AI
                          </h3>
                          <ChevronDown className="h-5 w-5 flex-shrink-0 transition-transform duration-300 ui-state-open:rotate-180" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-5 bg-card">
                        <div className="space-y-6">
                          {/* Comparison Grid */}
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Chatbot Card */}
                            <div className="relative overflow-hidden rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background p-6">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16" />
                              <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="p-3 rounded-lg bg-primary/10">
                                    <MessageSquare className="h-6 w-6 text-primary" />
                                  </div>
                                  <h3 className="text-2xl font-bold">Chatbot</h3>
                                </div>
                                <ul className="space-y-3">
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <span><strong>Browser-based</strong> interface</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <span><strong>More intuitive</strong> to use</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <span><strong>Natural language</strong> interaction</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-muted-foreground">⚠️</span>
                                    <span className="text-muted-foreground">Requires <strong>context switching</strong></span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-muted-foreground">⚠️</span>
                                    <span className="text-muted-foreground">Can be <strong>time-consuming</strong></span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-muted-foreground">⚠️</span>
                                    <span className="text-muted-foreground">AI produces only <strong>textual responses</strong> (multimodal)</span>
                                  </li>
                                </ul>
                              </div>
                            </div>

                            {/* AI Agent Card */}
                            <div className="relative overflow-hidden rounded-lg border-4 border-accent bg-gradient-to-br from-accent/10 to-background p-6 shadow-lg">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full -mr-16 -mt-16" />
                              <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="p-3 rounded-lg bg-accent/20">
                                    <Laptop className="h-6 w-6 text-accent" />
                                  </div>
                                  <h3 className="text-2xl font-bold">AI Agent</h3>
                                </div>
                                <ul className="space-y-3">
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                                    <span><strong>IDE-based</strong> (Integrated Development Environment)</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-muted-foreground">⚠️</span>
                                    <span className="text-muted-foreground">Has a <strong>learning curve</strong></span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-muted-foreground">⚠️</span>
                                    <span className="text-muted-foreground">Requires <strong>some setup</strong></span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                                    <span><strong>Natural language + more</strong></span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                                    <span><strong>AI embedded in context</strong></span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                                    <span><strong>Autonomous actions:</strong> read/edit files, search web, run scripts</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Key Insight */}
                          <Alert className="border-l-4 border-accent">
                            <Lightbulb className="h-5 w-5 text-accent" />
                            <AlertDescription className="ml-2">
                              <p className="font-semibold text-lg mb-2">Key Insight</p>
                              <p className="text-foreground">
                                Large Language Models do not just produce human-like texts or simulate text-based behaviors. 
                                <strong> They can now take actions on our files and folders</strong>, fundamentally changing how we interact with AI.
                              </p>
                            </AlertDescription>
                          </Alert>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Module 2: Get Familiar with IDE */}
                  <Collapsible 
                    open={moduleStates.module2} 
                    onOpenChange={(open) => setModuleStates({...moduleStates, module2: open})}
                  >
                    <Card className="border-2 border-primary">
                      <CollapsibleTrigger asChild>
                        <button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between hover:from-primary/90 hover:to-primary/70 transition-all">
                          <h3 className="font-semibold text-left flex items-center gap-2 text-xl">
                            <Laptop className="h-6 w-6" />
                            Module 2: Get Familiar with IDE - Navigating the VS Code Interface
                          </h3>
                          <ChevronDown className="h-5 w-5 flex-shrink-0 transition-transform duration-300 ui-state-open:rotate-180" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-5 bg-card">
                        <div className="space-y-6">
                          {/* IDE Structure Explanation */}
                          <div className="p-6 bg-muted/30 rounded-lg border-2 border-muted">
                            <h3 className="text-xl font-semibold mb-4">A Typical IDE Has Four Main Areas:</h3>
                            
                            <div className="grid grid-cols-3 gap-4">
                              {/* Left Panel - Full Height */}
                              <div className="row-span-2 p-4 bg-background rounded-lg border-2 border-primary">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-3 h-3 rounded-full bg-primary" />
                                  <h4 className="font-semibold text-primary">Left Panel</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">File Navigator</p>
                                <ul className="space-y-1 text-sm">
                                  <li>📁 Folders</li>
                                  <li>📂 Sub-folders</li>
                                  <li>📄 Files</li>
                                </ul>
                              </div>

                              {/* Middle Panel - Top */}
                              <div className="p-4 bg-background rounded-lg border-4 border-blue-600 shadow-lg">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                                  <h4 className="font-bold text-blue-600">Middle Panel</h4>
                                </div>
                                <p className="text-base font-bold mb-2 text-foreground">Editor Area</p>
                                <ul className="space-y-1 text-sm font-semibold text-foreground">
                                  <li>✏️ Read files</li>
                                  <li>📝 Edit files</li>
                                  <li>💾 Save changes</li>
                                </ul>
                              </div>

                              {/* Right Panel - Full Height */}
                              <div className="row-span-2 p-4 bg-background rounded-lg border-4 border-green-600 shadow-lg">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-3 h-3 rounded-full bg-green-600" />
                                  <h4 className="font-bold text-green-600">Right Panel</h4>
                                </div>
                                <p className="text-base font-bold mb-2 text-foreground">AI Agent Chat</p>
                                <ul className="space-y-1 text-sm font-semibold text-foreground">
                                  <li>💬 Chat interface</li>
                                  <li>🤖 AI agent (GitHub Copilot)</li>
                                  <li>⚡ Commands & prompts</li>
                                </ul>
                              </div>

                              {/* Bottom Middle Area - Aligned with Middle Panel */}
                              <div className="p-4 bg-background rounded-lg border-2 border-muted-foreground">
                                <div className="flex items-center gap-2 mb-3">
                                  <Terminal className="h-4 w-4 text-muted-foreground" />
                                  <h4 className="font-semibold text-muted-foreground">Bottom Middle Area</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">Terminal / Console</p>
                                <ul className="space-y-1 text-sm">
                                  <li>⌨️ Command line interface</li>
                                  <li>🔍 Debug console</li>
                                  <li>📋 Output messages</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* IDE Screenshot with Labels */}
                          <div className="space-y-3">
                            <h3 className="text-lg font-semibold">IDE Interface Reference</h3>
                            <div className="relative rounded-lg overflow-hidden border-2 border-muted">
                              <img 
                                src={vscodeIdeInterface} 
                                alt="VS Code interface showing left panel with file explorer, middle panel with code editor, right panel with AI chat, and terminal at the bottom"
                                className="w-full"
                              />
                              {/* Labels overlay */}
                              <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-md text-sm font-semibold shadow-lg">
                                Left: Files & Folders
                              </div>
                              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-accent/90 text-accent-foreground px-3 py-1 rounded-md text-sm font-semibold shadow-lg">
                                Middle: Editor
                              </div>
                              <div className="absolute top-4 right-4 bg-secondary/90 text-secondary-foreground px-3 py-1 rounded-md text-sm font-semibold shadow-lg">
                                Right: AI Chat
                              </div>
                              <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-muted-foreground/90 text-background px-3 py-1 rounded-md text-sm font-semibold shadow-lg">
                                Bottom: Terminal
                              </div>
                            </div>
                          </div>

                          {/* Hands-on Activity */}
                          <Alert className="border-l-4 border-primary bg-primary/5">
                            <Laptop className="h-5 w-5 text-primary" />
                            <AlertDescription className="ml-2">
                              <p className="font-semibold text-lg mb-3">👉 Hands-on Activity</p>
                              <div className="space-y-3 text-foreground">
                                <div className="flex items-start gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">1</span>
                                  <div>
                                    <p className="font-semibold">Open VS Code</p>
                                    <p className="text-sm text-muted-foreground">Launch VS Code on your computer</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">2</span>
                                  <div>
                                    <p className="font-semibold">Locate the Three Parts</p>
                                    <p className="text-sm text-muted-foreground">Identify the left panel (files), middle panel (editor), and right panel (AI chat)</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">3</span>
                                  <div>
                                    <p className="font-semibold">Talk with GitHub Copilot</p>
                                    <p className="text-sm text-muted-foreground">Start a conversation with the AI agent in the chat panel. Try asking "Hello, can you help me understand this IDE?"</p>
                                  </div>
                                </div>
                              </div>
                            </AlertDescription>
                          </Alert>

                          {/* Reminder */}
                          <div className="p-4 bg-accent/10 rounded-lg border-l-4 border-accent">
                            <p className="text-sm">
                              <strong>💡 Reminder:</strong> The AI agent in VS Code is <strong>GitHub Copilot</strong>. Don't hesitate to ask it questions as you explore the interface!
                            </p>
                          </div>

                          {/* Auto-Save Tip */}
                          <Alert className="border-l-4 border-primary bg-primary/5">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            <AlertDescription className="ml-2">
                              <p className="font-semibold mb-2">💾 Important Tip: Turn On Auto-Save</p>
                              <p className="text-sm text-foreground">
                                Enable auto-save in VS Code to automatically save your changes. This prevents losing work and ensures GitHub Copilot always has access to your latest code. Go to File &gt; Auto Save or set it in VS Code preferences.
                              </p>
                            </AlertDescription>
                          </Alert>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Workshop Notes: Clone Workshop Repository */}
                  <Collapsible 
                    open={moduleStates.workshopNotes1} 
                    onOpenChange={(open) => setModuleStates({...moduleStates, workshopNotes1: open})}
                  >
                    <Card className="border-2 border-amber-500 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
                      <CollapsibleTrigger asChild>
                        <button className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white p-4 flex items-center justify-between hover:from-amber-700 hover:to-amber-600 transition-all">
                          <h3 className="font-semibold text-left flex items-center gap-2 text-xl">
                            <Terminal className="h-6 w-6" />
                            Workshop Notes: First Hands-On Task - Clone the Workshop Repository
                          </h3>
                          <ChevronDown className="h-5 w-5 flex-shrink-0 transition-transform duration-300 ui-state-open:rotate-180" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-5 bg-card">
                        <div className="space-y-6">
                          {/* Introduction */}
                          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-6 rounded-xl border-2">
                            <h4 className="text-xl font-bold text-foreground mb-4">🎯 Your First GitHub Copilot Task</h4>
                            <p className="text-foreground mb-4">
                              Before diving into Lab 1, let's practice asking GitHub Copilot to do something practical: cloning the workshop repository. 
                              This task demonstrates how AI agents can handle technical operations (like Git commands) that traditionally required 
                              learning command-line syntax.
                            </p>
                            <div className="bg-background p-4 rounded-lg border">
                              <p className="text-sm text-foreground">
                                <strong>What you'll learn:</strong> How to delegate technical tasks to GitHub Copilot without needing to know the underlying commands
                              </p>
                            </div>
                          </div>

                          {/* Step-by-Step Instructions */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-bold text-foreground">📝 Step-by-Step Instructions</h4>

                            {/* Step 1: Create a New Folder */}
                            <div className="bg-background p-5 rounded-lg border-l-4 border-amber-600">
                              <h5 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                <span className="bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                                Create a New Folder for Your Work
                              </h5>
                              <ul className="space-y-2 text-sm text-foreground list-none ml-8">
                                <li className="flex items-start gap-2">
                                  <span className="text-amber-600">•</span>
                                  <span>In the <strong>Left Panel (File Explorer)</strong>, right-click in an empty area</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-amber-600">•</span>
                                  <span>Select <strong>"New Folder"</strong> from the context menu</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-amber-600">•</span>
                                  <span>Name it something like <code className="bg-muted px-2 py-1 rounded">WorkshopMaterials</code> or <code className="bg-muted px-2 py-1 rounded">math19Dec</code></span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-amber-600">•</span>
                                  <span>Click on the folder to open/select it</span>
                                </li>
                              </ul>
                            </div>

                            {/* Step 2: Ask GitHub Copilot to Clone */}
                            <div className="bg-background p-5 rounded-lg border-l-4 border-blue-600">
                              <h5 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                                Ask GitHub Copilot to Clone the Repository
                              </h5>
                              <p className="text-sm text-foreground mb-3 ml-8">
                                In the <strong>GitHub Copilot Chat panel</strong>, type a natural language instruction:
                              </p>
                              <div className="bg-muted p-4 rounded-lg ml-8">
                                <p className="text-sm font-semibold text-foreground mb-2">Example Message to GitHub Copilot:</p>
                                <div className="bg-background p-3 rounded border">
                                  <p className="text-sm italic text-foreground">
                                    "Please clone the workshop repository to this folder. Use this URL:<br/>
                                    <strong className="text-primary">https://github.com/tesolchina/math19Dec.git</strong>"
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-background p-5 rounded-lg border-l-4 border-green-600">
                              <h5 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                                Watch GitHub Copilot Execute Git Commands
                              </h5>
                              <p className="text-sm text-foreground mb-3 ml-8">
                                After you send the instruction, GitHub Copilot will:
                              </p>
                              <ul className="space-y-2 text-sm text-foreground list-none ml-8">
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                  <span>Understand that it needs to use Git to clone a repository</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                  <span>Execute the appropriate <code className="bg-muted px-2 py-1 rounded text-xs">git clone</code> command</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                  <span>Display the output in the <strong>Bottom Middle Area (Terminal/Console)</strong></span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                  <span>Confirm when the repository has been successfully cloned</span>
                                </li>
                              </ul>
                            </div>
                          </div>

                          {/* The Power of AI Agents: No CLI Knowledge Required */}
                          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl border-2">
                            <h4 className="text-xl font-bold text-foreground mb-4">💡 The Power of AI Agents: No CLI Knowledge Required</h4>
                            
                            <div className="space-y-4">
                              <p className="text-foreground">
                                In the past, cloning a Git repository required you to:
                              </p>
                              <div className="bg-background p-4 rounded-lg border">
                                <p className="text-sm font-semibold text-foreground mb-2">❌ Traditional Approach (Without AI Agents):</p>
                                <ul className="space-y-2 text-sm text-muted-foreground list-none">
                                  <li className="flex items-start gap-2">
                                    <span>1.</span>
                                    <span>Learn what Git is and how it works</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span>2.</span>
                                    <span>Install Git on your computer</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span>3.</span>
                                    <span>Learn command-line interface (CLI) syntax</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span>4.</span>
                                    <span>Remember the exact syntax: <code className="bg-muted px-2 py-1 rounded">git clone [URL]</code></span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span>5.</span>
                                    <span>Navigate to the correct directory using <code className="bg-muted px-2 py-1 rounded">cd</code> commands</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span>6.</span>
                                    <span>Troubleshoot any errors that occur</span>
                                  </li>
                                </ul>
                              </div>

                              <div className="bg-primary/5 p-4 rounded-lg border-2 border-primary/20">
                                <p className="text-sm font-semibold text-foreground mb-2">✅ AI Agent Approach (With GitHub Copilot):</p>
                                <ul className="space-y-2 text-sm text-foreground list-none">
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span><strong>Just ask in natural language</strong> - no syntax to memorize</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span><strong>GitHub Copilot handles the technical details</strong> - executes the correct commands</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span><strong>Automatic error handling</strong> - GitHub Copilot can troubleshoot and retry if needed</span>
                                  </li>
                                </ul>
                              </div>

                              <blockquote className="border-l-4 border-primary pl-4 italic text-foreground my-4">
                                "You don't need to learn CLI syntax anymore. Just tell GitHub Copilot what you want, and it will figure out the commands."
                              </blockquote>
                            </div>
                          </div>

                          {/* Behind the Scenes: What GitHub Copilot Actually Does */}
                          <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 p-6 rounded-xl border-2">
                            <h4 className="text-xl font-bold text-foreground mb-4">🔍 Behind the Scenes: What GitHub Copilot Actually Does</h4>
                            <p className="text-foreground mb-4">
                              When you ask GitHub Copilot to clone the repository, here's what happens behind the scenes:
                            </p>
                            <div className="bg-background p-4 rounded-lg border font-mono text-xs">
                              <div className="text-muted-foreground mb-1"># GitHub Copilot interprets your request and executes:</div>
                              <div className="text-foreground">$ git clone https://github.com/tesolchina/math19Dec.git</div>
                              <div className="text-green-600 mt-2">Cloning into 'math19Dec'...</div>
                              <div className="text-green-600">remote: Enumerating objects: 150, done.</div>
                              <div className="text-green-600">remote: Counting objects: 100% (150/150), done.</div>
                              <div className="text-green-600">Receiving objects: 100% (150/150), done.</div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-3">
                              You can see this output in the <strong>Terminal panel</strong> in VS Code. 
                              GitHub Copilot is using command-line tools, but you didn't need to know the syntax!
                            </p>
                          </div>

                          {/* Verification */}
                          <Alert className="border-l-4 border-primary bg-primary/5">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            <AlertDescription className="ml-2">
                              <p className="font-semibold mb-2">✅ Verify Success</p>
                              <p className="text-sm text-foreground">
                                After GitHub Copilot finishes, check the <strong>Explorer panel (left side)</strong>. You should see a new folder 
                                with the workshop materials inside. This confirms the repository was successfully cloned!
                              </p>
                            </AlertDescription>
                          </Alert>

                          {/* Key Takeaway */}
                          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-500">
                            <p className="font-semibold text-foreground mb-2">🎯 Key Takeaway</p>
                            <p className="text-sm text-foreground">
                              This simple task demonstrates the core value of AI agents: <strong>you can accomplish technical tasks 
                              using natural language, without needing to learn specialized syntax or commands.</strong> GitHub Copilot translates 
                              your intent into the appropriate technical operations.
                            </p>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Module 3: The Input-Process-Output Model */}
                  <Collapsible 
                    open={moduleStates.module3} 
                    onOpenChange={(open) => setModuleStates({...moduleStates, module3: open})}
                  >
                    <Card className="border-2 border-primary">
                      <CollapsibleTrigger asChild>
                        <button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between hover:from-primary/90 hover:to-primary/70 transition-all">
                          <h3 className="font-semibold text-left flex items-center gap-2 text-xl">
                            <Zap className="h-6 w-6" />
                            Module 3: Hands-On Lab - The Input-Process-Output Model
                          </h3>
                          <ChevronDown className="h-5 w-5 flex-shrink-0 transition-transform duration-300 ui-state-open:rotate-180" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-5 bg-card">
                        <div className="space-y-6">
                          {/* Introduction to the Model */}
                          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl border-2">
                            <h4 className="text-xl font-bold text-foreground mb-4">Understanding the Basic Model</h4>
                            <p className="text-foreground mb-4">
                              Every AI Agent task follows a simple three-step model. Understanding this model helps you communicate effectively with GitHub Copilot and structure your requests clearly.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Input */}
                              <div className="bg-background p-4 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-3 h-3 rounded-full bg-purple-600" />
                                  <h5 className="font-bold text-purple-600">Input</h5>
                                </div>
                                <p className="text-sm text-foreground">
                                  <strong>📥 File/Folder Paths</strong>
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  The source data or files the agent will work with. Right-click to copy paths easily.
                                </p>
                              </div>

                              {/* Process */}
                              <div className="bg-background p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                                  <h5 className="font-bold text-blue-600">Process</h5>
                                </div>
                                <p className="text-sm text-foreground">
                                  <strong>⚙️ Natural Language Instructions</strong>
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  What you want the agent to do with the input. Write clear instructions in plain English.
                                </p>
                              </div>

                              {/* Output */}
                              <div className="bg-background p-4 rounded-lg border-2 border-green-200 dark:border-green-800">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-3 h-3 rounded-full bg-green-600" />
                                  <h5 className="font-bold text-green-600">Output</h5>
                                </div>
                                <p className="text-sm text-foreground">
                                  <strong>📤 Destination Folder</strong>
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Where results will be saved. Can be a new or existing folder. Right-click to get path.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Lab 1: Analyze Walmart Sales Data */}
                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border-2">
                            <h4 className="text-xl font-bold text-foreground mb-4">🔬 Lab 1: Analyze Walmart Sales Data with AI Agent</h4>
                            
                            <p className="text-foreground mb-4">
                              In this hands-on lab, you'll use GitHub Copilot to explore sales data, recommend analytical models, and generate Python-based visualizations through a series of instruction files.
                            </p>

                            <Alert className="mb-4 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
                              <FileText className="h-5 w-5 text-amber-600" />
                              <AlertDescription className="ml-2">
                                <p className="font-semibold text-foreground">📁 Lab Files Location</p>
                                <p className="text-sm text-foreground mt-1">
                                  In your VS Code workspace, navigate to <code className="bg-muted px-2 py-1 rounded text-xs">Lab1_InputProcessOutput</code> folder. You'll create three instruction files to guide the AI agent through a complete data analysis workflow.
                                </p>
                              </AlertDescription>
                            </Alert>

                            {/* Task 1: Explore Data */}
                            <div className="space-y-4 mb-6">
                              <h5 className="font-bold text-foreground text-lg flex items-center gap-2">
                                <span className="bg-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">1</span>
                                Task 1: Explore the Data (exploreData.md)
                              </h5>
                              
                              <div className="bg-background p-4 rounded-lg border-l-4 border-purple-600">
                                <p className="text-sm text-foreground mb-3">
                                  Create a file called <code className="bg-muted px-2 py-1 rounded text-xs">exploreData.md</code> in the Lab1_InputProcessOutput folder with the following content:
                                </p>
                                <div className="bg-muted p-4 rounded text-sm font-mono">
                                  <div className="text-purple-600 font-bold">Input:</div>
                                  <div className="text-foreground ml-4">Data/Walmart2.csv</div>
                                  <div className="text-blue-600 font-bold mt-3">Process:</div>
                                  <div className="text-foreground ml-4">Take stock of what data is available in this CSV file. Analyze the columns, data types, and basic statistics. Generate a visual report that summarizes the dataset structure, including:</div>
                                  <ul className="ml-8 mt-1 text-foreground list-disc">
                                    <li>Column names and their data types</li>
                                    <li>Number of records and missing values</li>
                                    <li>Basic descriptive statistics</li>
                                    <li>Sample data preview</li>
                                  </ul>
                                  <div className="text-green-600 font-bold mt-3">Output:</div>
                                  <div className="text-foreground ml-4">Generate an HTML file in the visual folder:</div>
                                  <div className="text-foreground ml-4 font-mono text-xs mt-1">Lab1_InputProcessOutput/visual/data_exploration.html</div>
                                </div>
                              </div>
                            </div>

                            {/* Task 2: Explore Models */}
                            <div className="space-y-4 mb-6">
                              <h5 className="font-bold text-foreground text-lg flex items-center gap-2">
                                <span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">2</span>
                                Task 2: Recommend Analytical Models (exploreModels.md)
                              </h5>
                              
                              <div className="bg-background p-4 rounded-lg border-l-4 border-blue-600">
                                <p className="text-sm text-foreground mb-3">
                                  Create a file called <code className="bg-muted px-2 py-1 rounded text-xs">exploreModels.md</code> with:
                                </p>
                                <div className="bg-muted p-4 rounded text-sm font-mono">
                                  <div className="text-purple-600 font-bold">Input:</div>
                                  <div className="text-foreground ml-4">Data/Walmart2.csv</div>
                                  <div className="text-foreground ml-4">Lab1_InputProcessOutput/visual/ (data exploration results)</div>
                                  <div className="text-blue-600 font-bold mt-3">Process:</div>
                                  <div className="text-foreground ml-4">Based on the available data, recommend analytical models that can be used to analyze this Walmart sales data with Python scripts. For each recommended model, explain:</div>
                                  <ul className="ml-8 mt-1 text-foreground list-disc">
                                    <li>What the model does</li>
                                    <li>What insights could be gained</li>
                                    <li>Required Python libraries</li>
                                    <li>Expected output format</li>
                                  </ul>
                                  <div className="text-green-600 font-bold mt-3">Output:</div>
                                  <div className="text-foreground ml-4">Generate a markdown file with tables in the report folder:</div>
                                  <div className="text-foreground ml-4 font-mono text-xs mt-1">Lab1_InputProcessOutput/report/model_recommendations.md</div>
                                </div>
                              </div>
                            </div>

                            {/* Task 3: Implement Analysis */}
                            <div className="space-y-4 mb-6">
                              <h5 className="font-bold text-foreground text-lg flex items-center gap-2">
                                <span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">3</span>
                                Task 3: Implement the Analysis (implement.md)
                              </h5>
                              
                              <div className="bg-background p-4 rounded-lg border-l-4 border-green-600">
                                <p className="text-sm text-foreground mb-3">
                                  Create a file called <code className="bg-muted px-2 py-1 rounded text-xs">implement.md</code> with:
                                </p>
                                <div className="bg-muted p-4 rounded text-sm font-mono">
                                  <div className="text-purple-600 font-bold">Input:</div>
                                  <div className="text-foreground ml-4">Data/Walmart2.csv</div>
                                  <div className="text-foreground ml-4">Lab1_InputProcessOutput/report/model_recommendations.md (the plan)</div>
                                  <div className="text-blue-600 font-bold mt-3">Process:</div>
                                  <div className="text-foreground ml-4">Write Python scripts to analyze the Walmart sales data using the recommended models. Execute the scripts to generate:</div>
                                  <ul className="ml-8 mt-1 text-foreground list-disc">
                                    <li>Statistical analysis results</li>
                                    <li>Charts and graphs (bar charts, line graphs, etc.)</li>
                                    <li>Correlation diagrams</li>
                                    <li>Trend visualizations</li>
                                  </ul>
                                  <div className="text-green-600 font-bold mt-3">Output:</div>
                                  <div className="text-foreground ml-4">Generate all graphs, charts, and diagrams in the visual folder, then aggregate them into a comprehensive HTML report:</div>
                                  <div className="text-foreground ml-4 font-mono text-xs mt-1">Lab1_InputProcessOutput/visual/analysis_dashboard.html</div>
                                </div>
                              </div>
                            </div>

                            {/* How to Execute */}
                            <div className="bg-background p-4 rounded-lg border-l-4 border-primary">
                              <h6 className="font-bold text-foreground mb-2">📤 How to Execute Each Task</h6>
                              <ul className="space-y-2 text-sm text-foreground list-none">
                                <li className="flex items-start gap-2">
                                  <span className="text-primary font-bold">1.</span>
                                  <span>Create and save the instruction file (e.g., <code className="bg-muted px-2 py-1 rounded text-xs">exploreData.md</code>)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-primary font-bold">2.</span>
                                  <span><strong>Right-click</strong> on the file and select <strong>"Copy Path"</strong></span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-primary font-bold">3.</span>
                                  <span>In GitHub Copilot Chat, <strong>switch to Agent mode</strong>, then type: <em>"Please follow the instructions in [paste file path]"</em></span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-primary font-bold">4.</span>
                                  <span>Wait for the task to complete before moving to the next instruction file</span>
                                </li>
                              </ul>
                            </div>
                          </div>

                          {/* Workflow Flowchart */}
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border-2">
                            <h4 className="text-xl font-bold text-foreground mb-4">📊 Lab 1 Workflow Visualization</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              This flowchart shows the three-phase workflow for analyzing Walmart sales data.
                            </p>
                            <MermaidDiagram chart={`
graph TD
    subgraph PHASE1["📊 Phase 1: Explore Data"]
        A[Walmart2.csv] --> B[exploreData.md]
        B --> C[data_exploration.html]
    end
    
    subgraph PHASE2["🔍 Phase 2: Recommend Models"]
        C --> D[exploreModels.md]
        D --> E[model_recommendations.md]
    end
    
    subgraph PHASE3["⚙️ Phase 3: Implement Analysis"]
        E --> F[implement.md]
        A --> F
        F --> G[Python Scripts]
        G --> H[Charts & Graphs]
        H --> I[analysis_dashboard.html]
    end
    
    style A fill:#f3e5f5
    style B fill:#e3f2fd
    style C fill:#e8f5e9
    style D fill:#e3f2fd
    style E fill:#fff3e0
    style F fill:#e3f2fd
    style G fill:#fce4ec
    style H fill:#e0f7fa
    style I fill:#c8e6c9
            `} />
                          </div>

                          {/* Key Takeaways */}
                          <Alert className="border-l-4 border-primary bg-primary/5">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            <AlertDescription className="ml-2">
                              <p className="font-semibold mb-2">🎯 Key Takeaways from Lab 1</p>
                              <ul className="space-y-1 text-sm text-foreground list-none">
                                <li className="flex items-start gap-2">
                                  <span className="text-primary">✓</span>
                                  <span><strong>Break complex tasks into phases:</strong> Explore → Plan → Implement</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-primary">✓</span>
                                  <span><strong>Chain outputs to inputs:</strong> Results from one task become inputs for the next</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-primary">✓</span>
                                  <span><strong>AI writes and runs code:</strong> GitHub Copilot generates Python scripts and executes them</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-primary">✓</span>
                                  <span><strong>Visual outputs:</strong> HTML dashboards make results accessible and shareable</span>
                                </li>
                              </ul>
                            </AlertDescription>
                          </Alert>

                          {/* Reference to Detailed Lesson */}
                          <Alert className="border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20">
                            <BookOpen className="h-5 w-5 text-indigo-600" />
                            <AlertDescription className="ml-2">
                              <p className="font-semibold mb-2">📚 Want to Learn More?</p>
                              <p className="text-sm text-foreground mb-2">
                                For a deeper understanding of how AI Agents work and the Input-Process-Output model, check out our comprehensive lesson:
                              </p>
                              <Button variant="outline" size="sm" asChild className="mt-2">
                                <Link to="/lessons/ai-agents">
                                  <BookOpen className="h-4 w-4 mr-2" />
                                  Go to AI Agents Lesson
                                </Link>
                              </Button>
                            </AlertDescription>
                          </Alert>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Break & Reflection Section */}
                  <Collapsible 
                    open={moduleStates.break1} 
                    onOpenChange={(open) => setModuleStates({...moduleStates, break1: open})}
                  >
                    <Card className="border-2 border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                      <CardHeader>
                        <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-80 transition-opacity">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-amber-600" />
                            <CardTitle className="text-amber-900 dark:text-amber-100">☕ Take a Break & Reflect</CardTitle>
                          </div>
                          <ChevronDown className="h-5 w-5 transition-transform duration-200 data-[state=open]:rotate-180 text-amber-900 dark:text-amber-100" />
                        </CollapsibleTrigger>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="space-y-4">
                          <Alert className="border-l-4 border-amber-500 bg-amber-100 dark:bg-amber-900/30">
                            <CheckCircle2 className="h-5 w-5 text-amber-600" />
                            <AlertDescription className="ml-2">
                              <p className="font-semibold mb-2">⏸️ Pause and Catch Up</p>
                              <p className="text-sm text-foreground">
                                This is a good moment to take a short break. Try completing the Lab 1 exercise if you haven't already. 
                                Ask questions, help others, and make sure everyone is following along.
                              </p>
                            </AlertDescription>
                          </Alert>

                          <div className="bg-background p-6 rounded-lg border-2">
                            <h4 className="text-xl font-bold text-foreground mb-4">🎯 What We've Learned So Far</h4>
                            <p className="text-foreground mb-4">
                              Let's reiterate the key differences between chatbots and AI agents:
                            </p>

                            <div className="grid md:grid-cols-2 gap-4">
                              {/* Chatbot Column */}
                              <div className="bg-muted/50 p-4 rounded-lg border">
                                <h5 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                  <MessageSquare className="h-5 w-5 text-blue-600" />
                                  Chatbot (Browser-Based)
                                </h5>
                                <ul className="space-y-2 text-sm text-foreground list-none">
                                  <li className="flex items-start gap-2">
                                    <span className="text-muted-foreground">•</span>
                                    <span>Intuitive, natural language interface</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-muted-foreground">•</span>
                                    <span>Context switching between browser and work environment</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-muted-foreground">•</span>
                                    <span>Produces multimodal <strong>textual responses</strong> only</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-muted-foreground">•</span>
                                    <span>You copy-paste code and results manually</span>
                                  </li>
                                </ul>
                              </div>

                              {/* AI Agent Column */}
                              <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary">
                                <h5 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                  <Zap className="h-5 w-5 text-primary" />
                                  AI Agent (IDE-Based)
                                </h5>
                                <ul className="space-y-2 text-sm text-foreground list-none">
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span>Natural language <strong>plus more</strong> - embedded in context</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span>AI is part of your workflow, no context switching</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span><strong>Can autonomously take actions:</strong> read/edit files, search web, run scripts</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span>Handles technical operations without you learning CLI</span>
                                  </li>
                                </ul>
                              </div>
                            </div>

                            <blockquote className="border-l-4 border-primary pl-4 italic text-foreground mt-4">
                              "The key insight: Large Language Models can now <strong>take actions on files and folders</strong>, not just produce text."
                            </blockquote>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Module 4: Understanding API */}
                  <Collapsible 
                    open={moduleStates.module4} 
                    onOpenChange={(open) => setModuleStates({...moduleStates, module4: open})}
                  >
                    <Card className="border-2 border-primary">
                      <CollapsibleTrigger asChild>
                        <button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between hover:from-primary/90 hover:to-primary/70 transition-all">
                          <h3 className="font-semibold text-left flex items-center gap-2 text-xl">
                            <Info className="h-6 w-6" />
                            Module 4: Understanding API - A Powerful Way to Automate Human-AI Communication
                          </h3>
                          <ChevronDown className="h-5 w-5 flex-shrink-0 transition-transform duration-300 ui-state-open:rotate-180" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-5 bg-card">
                        <div className="space-y-6">
                          {/* Introduction to APIs */}
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border-2">
                            <h4 className="text-xl font-bold text-foreground mb-4">🔌 Understanding APIs: The Bridge Between Programs</h4>
                            
                            <div className="space-y-4">
                              <div className="bg-background p-4 rounded-lg border">
                                <h5 className="font-bold text-foreground mb-2">What is an API?</h5>
                                <p className="text-sm text-foreground mb-3">
                                  <strong>API (Application Programming Interface)</strong> is a way for computer programs to communicate with services 
                                  over the internet. APIs are everywhere - not just for AI!
                                </p>
                                <p className="text-sm text-foreground">
                                  Think of it as a <strong>messenger</strong> that takes requests from your program and delivers 
                                  them to a remote service, then brings back the response - whether that's AI-generated text, 
                                  weather data, stock prices, or government statistics.
                                </p>
                              </div>

                              <div className="grid md:grid-cols-2 gap-4">
                                {/* GUI vs API */}
                                <div className="bg-background p-4 rounded-lg border">
                                  <h5 className="font-bold text-foreground mb-2 flex items-center gap-2">
                                    <span className="text-blue-600">🖱️</span>
                                    GUI (Graphical User Interface)
                                  </h5>
                                  <ul className="space-y-1 text-sm text-foreground list-none">
                                    <li className="flex items-start gap-2">
                                      <span className="text-muted-foreground">•</span>
                                      <span>Visual interface with buttons and menus</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-muted-foreground">•</span>
                                      <span>Designed for <strong>human interaction</strong></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-muted-foreground">•</span>
                                      <span>You click, type, and navigate manually</span>
                                    </li>
                                  </ul>
                                </div>

                                <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary">
                                  <h5 className="font-bold text-foreground mb-2 flex items-center gap-2">
                                    <span className="text-primary">⚡</span>
                                    API (Application Programming Interface)
                                  </h5>
                                  <ul className="space-y-1 text-sm text-foreground list-none">
                                    <li className="flex items-start gap-2">
                                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                      <span>Code-based interface</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                      <span>Designed for <strong>program-to-program communication</strong></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                      <span>Enables automation and scaling</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Real-World API Example: Government Data */}
                          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-6 rounded-xl border-2">
                            <h4 className="text-xl font-bold text-foreground mb-4">📊 Real-World Example: Government Open Data APIs</h4>
                            
                            <div className="space-y-4">
                              <p className="text-foreground">
                                APIs aren't just for AI - they're used to access <strong>all kinds of data</strong>. 
                                Let's look at the Hong Kong Government's Open Data Portal as an example:
                              </p>

                              <div className="bg-background p-4 rounded-lg border">
                                <h5 className="font-bold text-foreground mb-2 flex items-center gap-2">
                                  <ExternalLink className="h-4 w-4 text-amber-600" />
                                  HK Property Market Statistics API
                                </h5>
                                <p className="text-sm text-foreground mb-3">
                                  The Rating and Valuation Department publishes property market data via API:
                                </p>
                                <a 
                                  href="https://data.gov.hk/en-data/dataset/hk-rvd-tsinfo_rvd-property-market-statistics/resource/d8ecc5e6-3721-4d07-a0f2-163f08e39b89" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline text-sm flex items-center gap-1"
                                >
                                  View on data.gov.hk <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>

                              <div className="bg-background p-4 rounded-lg border">
                                <h5 className="font-bold text-foreground mb-2">How This Works:</h5>
                                <ol className="space-y-2 text-sm text-foreground list-none">
                                  <li className="flex items-start gap-2">
                                    <span className="text-amber-600 font-bold">1.</span>
                                    <span>Your program sends a <strong>request</strong> to the API endpoint (a URL)</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-amber-600 font-bold">2.</span>
                                    <span>The server processes the request and returns <strong>structured data</strong> (usually JSON or CSV)</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-amber-600 font-bold">3.</span>
                                    <span>Your program can then <strong>process, analyze, or visualize</strong> this data</span>
                                  </li>
                                </ol>
                              </div>

                              <div className="grid md:grid-cols-3 gap-3">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border text-center">
                                  <p className="text-xs font-bold text-foreground mb-1">🌤️ Weather Data</p>
                                  <p className="text-xs text-muted-foreground">Real-time forecasts</p>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border text-center">
                                  <p className="text-xs font-bold text-foreground mb-1">📈 Financial Data</p>
                                  <p className="text-xs text-muted-foreground">Stock prices, exchange rates</p>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded border text-center">
                                  <p className="text-xs font-bold text-foreground mb-1">🚌 Transport Data</p>
                                  <p className="text-xs text-muted-foreground">Bus arrivals, traffic info</p>
                                </div>
                              </div>

                              <Alert className="border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
                                <Lightbulb className="h-5 w-5 text-amber-600" />
                                <AlertDescription className="ml-2">
                                  <p className="font-semibold mb-2">💡 Key Insight</p>
                                  <p className="text-sm text-foreground">
                                    APIs are the foundation of modern software. Later in this workshop, we'll demonstrate how to 
                                    use AI agents to <strong>fetch and analyze data from government APIs</strong> - no LLM required!
                                  </p>
                                </AlertDescription>
                              </Alert>
                            </div>
                          </div>

                          {/* API Keys Explained */}
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border-2">
                            <h4 className="text-xl font-bold text-foreground mb-4">🔑 What is an API Key?</h4>
                            
                            <div className="space-y-4">
                              <p className="text-foreground">
                                An <strong>API key</strong> is like a password that allows your program (or Builder) to access an AI service provider's servers. 
                                It tells the service "this request is authorized and should be processed."
                              </p>

                              <div className="bg-background p-4 rounded-lg border">
                                <h5 className="font-bold text-foreground mb-2">Why Do We Need API Keys?</h5>
                                <ul className="space-y-2 text-sm text-foreground list-none">
                                  <li className="flex items-start gap-2">
                                    <span className="text-purple-600 font-bold">1.</span>
                                    <span><strong>Authentication:</strong> Proves that you're an authorized user of the service</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-purple-600 font-bold">2.</span>
                                    <span><strong>Usage Tracking:</strong> The service knows how much you've used and can bill accordingly</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-purple-600 font-bold">3.</span>
                                    <span><strong>Rate Limiting:</strong> Prevents abuse by limiting how many requests you can make</span>
                                  </li>
                                </ul>
                              </div>

                              <Alert className="border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20">
                                <Terminal className="h-5 w-5 text-purple-600" />
                                <AlertDescription className="ml-2">
                                  <p className="font-semibold mb-2">🔐 Keep Your API Keys Secure!</p>
                                  <p className="text-sm text-foreground">
                                    API keys are like passwords - never share them publicly or commit them to public repositories. 
                                    Treat them as sensitive credentials.
                                  </p>
                                </AlertDescription>
                              </Alert>
                            </div>
                          </div>

                          {/* Tokens and Computing Power */}
                          <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-xl border-2">
                            <h4 className="text-xl font-bold text-foreground mb-4">🪙 Understanding Tokens and Computing Power</h4>
                            
                            <div className="space-y-4">
                              <div className="bg-background p-4 rounded-lg border">
                                <h5 className="font-bold text-foreground mb-2">What are Tokens?</h5>
                                <p className="text-sm text-foreground mb-3">
                                  <strong>Tokens</strong> are the basic units that LLMs use to process text. Think of them as "chunks" of text:
                                </p>
                                <ul className="space-y-2 text-sm text-foreground list-none ml-4">
                                  <li className="flex items-start gap-2">
                                    <span className="text-green-600">•</span>
                                    <span>1 token ≈ 4 characters or ≈ 0.75 words in English</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-green-600">•</span>
                                    <span>"Hello, world!" ≈ 3-4 tokens</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-green-600">•</span>
                                    <span>A typical paragraph ≈ 100-150 tokens</span>
                                  </li>
                                </ul>
                              </div>

                              <div className="bg-background p-4 rounded-lg border">
                                <h5 className="font-bold text-foreground mb-2">Why Do Tokens Matter?</h5>
                                <p className="text-sm text-foreground mb-3">
                                  AI service providers charge based on the number of tokens processed:
                                </p>
                                <div className="grid md:grid-cols-2 gap-3">
                                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border">
                                    <p className="text-xs font-bold text-foreground mb-1">Input Tokens</p>
                                    <p className="text-xs text-foreground">What you send to the AI (your prompt + context)</p>
                                  </div>
                                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border">
                                    <p className="text-xs font-bold text-foreground mb-1">Output Tokens</p>
                                    <p className="text-xs text-foreground">What the AI generates and sends back</p>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-background p-4 rounded-lg border">
                                <h5 className="font-bold text-foreground mb-2">Computing Power and Cost</h5>
                                <p className="text-sm text-foreground mb-2">
                                  Running Large Language Models requires significant computing resources:
                                </p>
                                <ul className="space-y-2 text-sm text-foreground list-none ml-4">
                                  <li className="flex items-start gap-2">
                                    <span className="text-green-600">•</span>
                                    <span><strong>More tokens = More computation = Higher cost</strong></span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-green-600">•</span>
                                    <span>More powerful models (like GPT-5 or Claude) cost more per token</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-green-600">•</span>
                                    <span>Most providers offer free credits to get started (~$5-20 worth)</span>
                                  </li>
                                </ul>
                              </div>

                              <Alert className="border-l-4 border-green-600 bg-green-50 dark:bg-green-900/20">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <AlertDescription className="ml-2">
                                  <p className="font-semibold mb-2">💡 Practical Tip</p>
                                  <p className="text-sm text-foreground">
                                    For this workshop, Kimi provides CNY ¥15 free credits which should be enough for initial practice. 
                                    DeepSeek and OpenRouter may require adding funds (no more than USD 5). 
                                    You'll typically spend only a few cents per request for most tasks.
                                  </p>
                                </AlertDescription>
                              </Alert>
                            </div>
                          </div>

                          {/* Why This Matters */}
                          <div className="bg-primary/10 rounded-lg p-6 border-l-4 border-primary">
                            <h4 className="font-semibold text-lg mb-3">🎯 Why This Matters for AI Agents</h4>
                            <p className="text-foreground mb-3">
                              Understanding APIs is crucial because AI agents can leverage <strong>both types of APIs</strong>:
                            </p>
                            <ul className="space-y-2 text-foreground list-none">
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                                <span><strong>LLM APIs:</strong> Send text for AI analysis, get intelligent responses (requires API keys)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                                <span><strong>Data APIs:</strong> Fetch real-time data from government portals, weather services, financial systems (often free, no key required)</span>
                              </li>
                            </ul>
                            <p className="text-foreground mt-3">
                              AI agents like GitHub Copilot can write scripts that call <em>any</em> API - combining data retrieval with AI analysis 
                              to create powerful automated workflows.
                            </p>
                          </div>

                          {/* Next Module Preview */}
                          <Alert className="border-l-4 border-primary bg-primary/5">
                            <Terminal className="h-5 w-5 text-primary" />
                            <AlertDescription className="ml-2">
                              <p className="font-semibold mb-2">⏭️ Next: Hands-On Practice with Data APIs</p>
                              <p className="text-sm text-foreground">
                                Now that you understand what APIs are, in Lab 2 we'll put this knowledge into practice by 
                                accessing real government data from data.gov.hk - no LLM required!
                              </p>
                            </AlertDescription>
                          </Alert>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Module 5: Lab 2 - Access Government Data via API */}
                  <Collapsible 
                    open={moduleStates.module5} 
                    onOpenChange={(open) => setModuleStates({...moduleStates, module5: open})}
                  >
                    <Card className="border-2 border-primary">
                      <CollapsibleTrigger asChild>
                        <button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between hover:from-primary/90 hover:to-primary/70 transition-all">
                          <h3 className="font-semibold text-left flex items-center gap-2 text-xl">
                            <Microscope className="h-6 w-6" />
                            Module 5: Lab 2 - Access Government Data via API
                          </h3>
                          <ChevronDown className="h-5 w-5 flex-shrink-0 transition-transform duration-300 ui-state-open:rotate-180" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-5 bg-card">
                        <div className="space-y-6">
                          {/* Introduction */}
                          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-6 rounded-xl border-2">
                            <h4 className="text-xl font-bold text-foreground mb-4">📊 Lab 2: Access Government Data via API</h4>
                            <p className="text-foreground mb-4">
                              In this lab, you'll use AI agents to interact with <strong>real-world data APIs</strong> - no LLM required! 
                              We'll fetch data from Hong Kong's Government Open Data Portal and let the AI agent write Python scripts to test and explore the data.
                            </p>
                            
                            <Alert className="border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
                              <Lightbulb className="h-5 w-5 text-amber-600" />
                              <AlertDescription className="ml-2">
                                <p className="font-semibold mb-2">💡 Why This Matters</p>
                                <p className="text-sm text-foreground">
                                  APIs aren't just for AI chat - they're used everywhere to access <strong>real-time data</strong>: 
                                  weather forecasts, stock prices, government statistics, and more. AI agents can help you 
                                  discover, access, and analyze this data automatically!
                                </p>
                              </AlertDescription>
                            </Alert>
                          </div>

                          {/* Example Data Source */}
                          <div className="bg-background p-6 rounded-lg border-2">
                            <h5 className="text-xl font-bold text-foreground mb-4">📋 Example: HK Property Market Statistics</h5>
                            <p className="text-foreground mb-4">
                              We'll use this government data portal as our example:
                            </p>
                            <div className="bg-muted/50 p-4 rounded-lg border mb-4">
                              <p className="text-sm font-semibold text-foreground mb-2">Data Source:</p>
                              <a 
                                href="https://data.gov.hk/en-data/dataset/hk-rvd-tsinfo_rvd-property-market-statistics/resource/d8ecc5e6-3721-4d07-a0f2-163f08e39b89" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-sm flex items-center gap-1 break-all"
                              >
                                data.gov.hk - Property Market Statistics <ExternalLink className="h-3 w-3 flex-shrink-0" />
                              </a>
                              <p className="text-xs text-muted-foreground mt-2">
                                Rating and Valuation Department - Property market indices, prices, and transaction data
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              You can also explore other datasets at <a href="https://data.gov.hk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">data.gov.hk</a> 
                              {" "}to find data relevant to your research interests.
                            </p>
                          </div>

                          {/* Instruction File */}
                          {/* Trial 1 */}
                          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl border-2">
                            <h5 className="text-xl font-bold text-foreground mb-4">📝 Trial 1: Specific Resource Page</h5>
                            <p className="text-foreground mb-4">
                              Create a file <code className="bg-muted px-2 py-1 rounded">Lab2_GovData/trial1.md</code> with the Input-Process-Output structure:
                            </p>

                            {/* Input Section */}
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-600 mb-4">
                              <h6 className="font-bold text-foreground mb-2">📥 Input</h6>
                              <div className="bg-background p-3 rounded border">
                                <code className="text-xs text-foreground break-all">
                                  https://data.gov.hk/en-data/dataset/hk-rvd-tsinfo_rvd-property-market-statistics/resource/d8ecc5e6-3721-4d07-a0f2-163f08e39b89
                                </code>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                This links to a <strong>specific resource</strong> within the dataset
                              </p>
                            </div>

                            {/* Process Section */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-600 mb-4">
                              <h6 className="font-bold text-foreground mb-2">⚙️ Process</h6>
                              <p className="text-sm text-foreground">
                                Fetch info from the link and write a Python script to test if data can be obtained; then generate an md report on what data is available
                              </p>
                            </div>

                            {/* Output Section */}
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-600">
                              <h6 className="font-bold text-foreground mb-2">📤 Output</h6>
                              <p className="text-sm text-foreground">
                                Export the report to the <strong>same folder</strong> as the instruction file
                              </p>
                            </div>
                          </div>

                          {/* Trial 2 */}
                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border-2">
                            <h5 className="text-xl font-bold text-foreground mb-4">📝 Trial 2: Dataset Overview Page</h5>
                            <p className="text-foreground mb-4">
                              Create a file <code className="bg-muted px-2 py-1 rounded">Lab2_GovData/trial2.md</code> with the Input-Process-Output structure:
                            </p>

                            {/* Input Section */}
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-600 mb-4">
                              <h6 className="font-bold text-foreground mb-2">📥 Input</h6>
                              <div className="bg-background p-3 rounded border">
                                <code className="text-xs text-foreground break-all">
                                  https://data.gov.hk/en-data/dataset/hk-rvd-tsinfo_rvd-property-market-statistics
                                </code>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                This links to the <strong>dataset overview</strong> with multiple resources
                              </p>
                            </div>

                            {/* Process Section */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-600 mb-4">
                              <h6 className="font-bold text-foreground mb-2">⚙️ Process</h6>
                              <p className="text-sm text-foreground">
                                Fetch info from the link and write a Python script to test if data can be obtained; then generate an md report on what data is available
                              </p>
                            </div>

                            {/* Output Section */}
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-600">
                              <h6 className="font-bold text-foreground mb-2">📤 Output</h6>
                              <p className="text-sm text-foreground">
                                Export the report to the <strong>same folder</strong> as the instruction file
                              </p>
                            </div>
                          </div>

                          {/* Agent Clarification Note */}
                          <Alert className="border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
                            <MessageSquare className="h-5 w-5 text-amber-600" />
                            <AlertDescription className="ml-2">
                              <p className="font-semibold mb-2">💬 Expect Agent Clarifications</p>
                              <p className="text-sm text-foreground">
                                The AI agent may <strong>ask for clarification</strong> before proceeding - this is normal and helpful! 
                                For example, it might ask which specific data fields you're interested in, or confirm the output format. 
                                Answer its questions, and it will then complete the task autonomously.
                              </p>
                            </AlertDescription>
                          </Alert>

                          {/* Expected Output Structure */}
                          <div className="bg-muted/50 p-4 rounded-lg border">
                            <h6 className="font-bold text-foreground mb-2">📁 Expected Output Structure</h6>
                            <div className="bg-background p-3 rounded border font-mono text-sm">
                              <div>Lab2_GovData/</div>
                              <div className="ml-4">├── trial1.md <span className="text-muted-foreground">(instruction file)</span></div>
                              <div className="ml-4">├── trial1_test.py <span className="text-muted-foreground">(Python test script)</span></div>
                              <div className="ml-4">├── trial1_report.md <span className="text-muted-foreground">(generated report)</span></div>
                              <div className="ml-4">├── trial2.md <span className="text-muted-foreground">(instruction file)</span></div>
                              <div className="ml-4">├── trial2_test.py <span className="text-muted-foreground">(Python test script)</span></div>
                              <div className="ml-4">└── trial2_report.md <span className="text-muted-foreground">(generated report)</span></div>
                            </div>
                          </div>

                          {/* Workflow Diagram */}
                          <div className="bg-background p-6 rounded-lg border-2">
                            <h5 className="text-xl font-bold text-foreground mb-4">🔄 Lab 2 Workflow</h5>
                            <MermaidDiagram chart={`
graph LR
    A[📝 testAPI.md<br/>Instruction File] --> B[🌐 AI Agent<br/>Fetches Web Page]
    B --> C[🐍 Writes Python<br/>API Test Script]
    C --> D[▶️ Runs Script<br/>Tests Connection]
    D --> E[📊 Generates<br/>Data Report]
    E --> F[📁 Output<br/>data_report.md]
    
    style A fill:#e3f2fd,stroke:#1976d2,stroke-width:3px
    style B fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style C fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style D fill:#ffebee,stroke:#c62828,stroke-width:2px
    style E fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style F fill:#c8e6c9,stroke:#388e3c,stroke-width:3px
                            `} />
                          </div>

                          {/* Implementation Steps */}
                          <div className="bg-muted/50 p-6 rounded-lg">
                            <h5 className="text-xl font-bold text-foreground mb-4">🛠️ Implementation Steps</h5>
                            <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</span>
                                <div>
                                  <p className="font-semibold text-foreground">Create the instruction files</p>
                                  <p className="text-sm text-muted-foreground">Create <code className="bg-background px-1 rounded">Lab2_GovData/trial1.md</code> and <code className="bg-background px-1 rounded">Lab2_GovData/trial2.md</code> with the structures above</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</span>
                                <div>
                                  <p className="font-semibold text-foreground">Copy the file path</p>
                                  <p className="text-sm text-muted-foreground">Right-click on trial1.md → Copy Path (start with Trial 1)</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</span>
                                <div>
                                  <p className="font-semibold text-foreground">Send to AI Agent</p>
                                  <p className="text-sm text-muted-foreground">In GitHub Copilot Chat, <strong>switch to Agent mode</strong>, then type: <em>"Please follow the instructions in [paste file path]"</em></p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</span>
                                <div>
                                  <p className="font-semibold text-foreground">Answer clarifications & review output</p>
                                  <p className="text-sm text-muted-foreground">If the agent asks questions, answer them. Then check the generated scripts and reports in Lab2_GovData folder</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">5</span>
                                <div>
                                  <p className="font-semibold text-foreground">Repeat for Trial 2</p>
                                  <p className="text-sm text-muted-foreground">Run trial2.md and compare how the agent handles the dataset overview page vs. specific resource page</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Key Insight */}
                          <Alert className="border-l-4 border-primary bg-primary/5">
                            <Zap className="h-5 w-5 text-primary" />
                            <AlertDescription className="ml-2">
                              <p className="font-semibold mb-2">🎯 Key Insight: APIs Are Everywhere!</p>
                              <p className="text-sm text-foreground">
                                This lab demonstrates that AI agents can work with <strong>any API</strong>, not just LLM APIs. 
                                Government data, weather services, financial APIs, transport data - the same Input-Process-Output 
                                framework applies. The AI agent writes the code, you provide the direction!
                              </p>
                            </AlertDescription>
                          </Alert>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Break & Reflect */}
                  <Collapsible 
                    open={moduleStates.break2} 
                    onOpenChange={(open) => setModuleStates({...moduleStates, break2: open})}
                  >
                    <Card className="border-2 border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                      <CardHeader>
                        <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-80 transition-opacity">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-amber-600" />
                            <CardTitle className="text-amber-900 dark:text-amber-100">☕ Take a Break & Reflect</CardTitle>
                          </div>
                          <ChevronDown className="h-5 w-5 transition-transform duration-200 data-[state=open]:rotate-180 text-amber-900 dark:text-amber-100" />
                        </CollapsibleTrigger>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="space-y-4">
                          <p className="text-foreground mb-4">
                            Great progress! You've learned how to set up API keys and automate batch processing with AI agents. 
                            Let's pause here to catch up, ask questions, and think about what we've accomplished so far.
                          </p>
                          <div className="space-y-3">
                            <p className="font-semibold text-foreground text-center">What have we learned?</p>
                            <div className="grid md:grid-cols-2 gap-4 text-left max-w-3xl mx-auto">
                              <div className="bg-background p-4 rounded-lg border">
                                <p className="font-semibold text-primary mb-2">✓ API Keys Enable Automation</p>
                                <p className="text-sm text-muted-foreground">
                                  API keys allow your code (or AI agents) to communicate directly with AI services programmatically
                                </p>
                              </div>
                              <div className="bg-background p-4 rounded-lg border">
                                <p className="font-semibold text-primary mb-2">✓ Batch Processing Saves Time</p>
                                <p className="text-sm text-muted-foreground">
                                  Process multiple files automatically instead of manual copy-paste for each one
                                </p>
                              </div>
                              <div className="bg-background p-4 rounded-lg border">
                                <p className="font-semibold text-primary mb-2">✓ No Context Switching</p>
                                <p className="text-sm text-muted-foreground">
                                  AI agents handle file operations, API calls, and result storage - all from one place
                                </p>
                              </div>
                              <div className="bg-background p-4 rounded-lg border">
                                <p className="font-semibold text-primary mb-2">✓ Scalability</p>
                                <p className="text-sm text-muted-foreground">
                                  The same workflow works for 5 files or 500 files - just adjust the instruction
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Real-World Use Cases */}
                  <Collapsible 
                    open={moduleStates.realWorld} 
                    onOpenChange={(open) => setModuleStates({...moduleStates, realWorld: open})}
                    className="mt-6"
                  >
                    <Card className="border-2 border-amber-500 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
                      <CollapsibleTrigger asChild>
                        <button className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white p-4 flex items-center justify-between hover:from-amber-700 hover:to-amber-600 transition-all">
                          <h3 className="font-semibold text-left flex items-center gap-2 text-xl">
                            <Lightbulb className="h-6 w-6" />
                            Real-World Use Cases: File + Prompt + LLM Response Pattern
                          </h3>
                          <ChevronDown className="h-5 w-5 flex-shrink-0 transition-transform duration-300 ui-state-open:rotate-180" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-5 bg-card">
                        <div className="space-y-6">
                          <p className="text-foreground mb-6">
                            Now that you understand the power of automating "send file to LLM with prompt and collect response" workflows, 
                            let's explore how this pattern applies to real academic scenarios:
                          </p>

                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Grading and Feedback */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-600 text-white rounded-lg">
                                  <GraduationCap className="h-6 w-6" />
                                </div>
                                <h4 className="text-xl font-bold text-foreground">Grading & Feedback</h4>
                              </div>
                              <p className="text-sm text-foreground mb-3">
                                <strong>Scenario:</strong> You have 50 student essays to grade and provide feedback on.
                              </p>
                              <div className="bg-background p-4 rounded-lg border space-y-2 text-sm">
                                <p><strong className="text-blue-600">Input:</strong> Folder with 50 essay files</p>
                                <p><strong className="text-blue-600">Prompt:</strong> "Evaluate this essay based on argument clarity, evidence quality, and writing structure. Provide constructive feedback and a grade."</p>
                                <p><strong className="text-blue-600">Output:</strong> CSV with filename, grade, strengths, areas for improvement</p>
                                <p className="text-muted-foreground italic pt-2">
                                  ⏱️ Manual grading: ~15 hours | With AI agent: ~20 minutes
                                </p>
                              </div>
                            </div>

                            {/* Generate Course Materials */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-600 text-white rounded-lg">
                                  <BookOpen className="h-6 w-6" />
                                </div>
                                <h4 className="text-xl font-bold text-foreground">Generate Course Materials</h4>
                              </div>
                              <p className="text-sm text-foreground mb-3">
                                <strong>Scenario:</strong> Create study guides from lecture transcripts for 12 weeks of classes.
                              </p>
                              <div className="bg-background p-4 rounded-lg border space-y-2 text-sm">
                                <p><strong className="text-purple-600">Input:</strong> 12 lecture transcript files</p>
                                <p><strong className="text-purple-600">Prompt:</strong> "Create a student-friendly study guide with key concepts, definitions, and practice questions from this lecture."</p>
                                <p><strong className="text-purple-600">Output:</strong> 12 formatted study guide documents (Markdown or PDF)</p>
                                <p className="text-muted-foreground italic pt-2">
                                  ⏱️ Manual creation: ~24 hours | With AI agent: ~30 minutes
                                </p>
                              </div>
                            </div>

                            {/* Edit Academic Manuscripts */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border-2 border-green-200 dark:border-green-800">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-600 text-white rounded-lg">
                                  <PenTool className="h-6 w-6" />
                                </div>
                                <h4 className="text-xl font-bold text-foreground">Edit Academic Manuscripts</h4>
                              </div>
                              <p className="text-sm text-foreground mb-3">
                                <strong>Scenario:</strong> Review and improve language quality across multiple paper sections.
                              </p>
                              <div className="bg-background p-4 rounded-lg border space-y-2 text-sm">
                                <p><strong className="text-green-600">Input:</strong> Paper sections (Introduction, Methods, Results, Discussion)</p>
                                <p><strong className="text-green-600">Prompt:</strong> "Improve academic writing quality: enhance clarity, fix grammar, suggest better transitions, maintain scholarly tone."</p>
                                <p><strong className="text-green-600">Output:</strong> Edited versions + change logs for each section</p>
                                <p className="text-muted-foreground italic pt-2">
                                  ⏱️ Manual editing: ~8 hours | With AI agent: ~15 minutes
                                </p>
                              </div>
                            </div>

                            {/* Qualitative Data Analysis */}
                            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-6 rounded-xl border-2 border-amber-200 dark:border-amber-800">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-amber-600 text-white rounded-lg">
                                  <Microscope className="h-6 w-6" />
                                </div>
                                <h4 className="text-xl font-bold text-foreground">Qualitative Data Analysis</h4>
                              </div>
                              <p className="text-sm text-foreground mb-3">
                                <strong>Scenario:</strong> Analyze 30 interview transcripts to identify themes and patterns.
                              </p>
                              <div className="bg-background p-4 rounded-lg border space-y-2 text-sm">
                                <p><strong className="text-amber-600">Input:</strong> 30 interview transcript files</p>
                                <p><strong className="text-amber-600">Prompt:</strong> "Identify key themes, recurring concepts, and emotional tones. Extract significant quotes that represent each theme."</p>
                                <p><strong className="text-amber-600">Output:</strong> CSV with interview ID, identified themes, sentiment, key quotes</p>
                                <p className="text-muted-foreground italic pt-2">
                                  ⏱️ Manual coding: ~40 hours | With AI agent: ~45 minutes
                                </p>
                              </div>
                            </div>
                          </div>

                          <Alert className="mt-6 border-l-4 border-primary bg-primary/5">
                            <Info className="h-5 w-5" />
                            <AlertDescription className="ml-2">
                              <p className="font-semibold mb-2">💡 The Common Pattern</p>
                              <p className="text-sm text-foreground">
                                All these use cases follow the same workflow you practiced in Lab 2:
                              </p>
                              <ul className="text-sm text-foreground space-y-1 list-none ml-4 mt-2">
                                <li><strong>1.</strong> You have multiple files to process</li>
                                <li><strong>2.</strong> You have a clear prompt/instruction for the AI</li>
                                <li><strong>3.</strong> You want structured output (CSV, documents, reports)</li>
                                <li><strong>4.</strong> AI agents automate the entire workflow with one instruction</li>
                              </ul>
                            </AlertDescription>
                          </Alert>

                          <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border-2 border-indigo-200 dark:border-indigo-800">
                            <h5 className="font-bold text-foreground mb-3 flex items-center gap-2">
                              <Zap className="h-5 w-5 text-indigo-600" />
                              Your Turn: Think of Your Use Case
                            </h5>
                            <p className="text-sm text-foreground mb-4">
                              What repetitive task in your teaching or research could benefit from this automation pattern?
                            </p>
                            <div className="bg-background p-4 rounded-lg border space-y-3">
                              <div>
                                <p className="text-sm font-semibold text-foreground mb-1">Think about:</p>
                                <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-6">
                                  <li>Tasks where you process multiple similar files</li>
                                  <li>Repetitive analysis or writing work</li>
                                  <li>Time-consuming manual operations that follow a pattern</li>
                                  <li>Places where you currently copy-paste between tools</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Interactive Use Case Chat */}
                          <div className="mt-8">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-indigo-600 text-white rounded-lg">
                                <MessagesSquare className="h-6 w-6" />
                              </div>
                              <div>
                                <h5 className="text-xl font-bold text-foreground">💬 Discuss Your Use Case</h5>
                                <p className="text-sm text-muted-foreground">
                                  Chat with AI to explore how you can leverage API technology for your specific needs
                                </p>
                              </div>
                            </div>
                            <div className="grid lg:grid-cols-2 gap-4">
                              <WorkshopUseCaseChat onConversationShared={() => setBbsRefresh(prev => prev + 1)} />
                              <WorkshopUseCaseBBS refreshTrigger={bbsRefresh} />
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Module 6: Lab 3 - Literature Review Screening */}
                  <Collapsible 
                    open={moduleStates.module6} 
                    onOpenChange={(open) => setModuleStates({...moduleStates, module6: open})}
                    className="mt-6"
                  >
                    <Card className="border-2 border-primary">
                      <CollapsibleTrigger asChild>
                        <button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between hover:from-primary/90 hover:to-primary/70 transition-all">
                          <h3 className="font-semibold text-left flex items-center gap-2 text-xl">
                            <FileText className="h-6 w-6" />
                            Module 6: Lab 3 - Literature Review Screening
                          </h3>
                          <ChevronDown className="h-5 w-5 flex-shrink-0 transition-transform duration-300 ui-state-open:rotate-180" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-5 bg-card">
                        <div className="space-y-6">
                          <div className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 p-6 rounded-xl border-2">
                            <h4 className="text-2xl font-bold text-foreground mb-4">🔍 Screen Studies from CSV Data</h4>
                            <p className="text-foreground mb-4">
                              In this lab, you'll learn how to automate literature review screening - a critical but time-consuming task in academic research. 
                              You'll process a CSV file containing study titles and abstracts, using AI to categorize and analyze each study systematically.
                            </p>
                            
                            <Alert className="mb-6 border-l-4 border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20">
                              <Info className="h-5 w-5 text-cyan-600" />
                              <AlertDescription className="ml-2">
                                <p className="font-semibold mb-2">📚 Real-World Context</p>
                                <p className="text-sm text-foreground">
                                  The CSV file for this lab contains ~200 studies on BAWE (British Academic Written English) and data-driven learning, 
                                  obtained from <a href="https://erpp.hkbu.me/search" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">erpp.hkbu.me/search</a> 
                                  {" "}(a GUI search engine using Semantic Search and Scopus APIs).
                                </p>
                                <p className="text-sm text-foreground mt-2">
                                  Note: Some abstracts may be missing in the data.
                                </p>
                              </AlertDescription>
                            </Alert>

                            <div className="space-y-6">
                              <div className="bg-background p-6 rounded-lg border-2">
                                <h5 className="text-xl font-bold text-foreground mb-4">📋 Lab Task Overview</h5>
                                
                                {/* Input Section */}
                                <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border-l-4 border-cyan-600 mb-4">
                                  <h6 className="font-bold text-foreground mb-2">📥 Input</h6>
                                  <p className="text-sm text-foreground mb-2">
                                    CSV file containing study metadata:
                                  </p>
                                  <code className="bg-background px-3 py-2 rounded block text-sm">
                                    Data/Literature/bawe_ddl_studies.csv
                                  </code>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Contains: Title, Abstract, Authors, Year, Journal (some abstracts may be missing)
                                  </p>
                                </div>

                                {/* Process Section */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-600 mb-4">
                                  <h6 className="font-bold text-foreground mb-2">⚙️ Process</h6>
                                  <p className="text-sm text-foreground mb-3">
                                    For the <strong>first 10 studies</strong> in the CSV, ask Builder to:
                                  </p>
                                  <ul className="space-y-2 text-sm text-foreground list-none ml-4">
                                    <li className="flex items-start gap-2">
                                      <span className="text-blue-600 font-bold">1.</span>
                                      <span>Read the CSV file and extract the first 10 entries (titles + abstracts)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-blue-600 font-bold">2.</span>
                                      <span>For each study, send title + abstract to an LLM via API with categorization prompt</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-blue-600 font-bold">3.</span>
                                      <span>Categorize each study based on:</span>
                                    </li>
                                    <ul className="ml-6 mt-1 space-y-1 text-xs text-muted-foreground list-disc">
                                      <li>Study context (educational setting, participants, location)</li>
                                      <li>Research objective (what question/problem is being addressed)</li>
                                      <li>Data analyzed (corpus type, data sources)</li>
                                      <li>Main findings (key results and discoveries)</li>
                                      <li>Implications (practical applications, recommendations)</li>
                                    </ul>
                                    <li className="flex items-start gap-2 mt-2">
                                      <span className="text-blue-600 font-bold">4.</span>
                                      <span>Maintain a process log file showing progress (which study is being processed)</span>
                                    </li>
                                  </ul>
                                  <div className="mt-3 p-3 bg-background rounded border">
                                    <p className="text-xs text-muted-foreground italic">
                                      <strong>Note:</strong> We're limiting to 10 studies for learning purposes. The same workflow 
                                      can scale to all 200 studies - just adjust the instruction!
                                    </p>
                                  </div>
                                </div>

                                {/* Output Section */}
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-600">
                                  <h6 className="font-bold text-foreground mb-2">📤 Output</h6>
                                  <div className="space-y-3 text-sm">
                                    <div>
                                      <p className="text-foreground font-semibold mb-1">Categorized Results CSV:</p>
                                      <code className="bg-background px-3 py-2 rounded block text-sm">
                                        Lab3_Results/screening_results.csv
                                      </code>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Columns: Title, Authors, Year, Study_Context, Research_Objective, Data_Analyzed, Main_Findings, Implications
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-foreground font-semibold mb-1">Process Log:</p>
                                      <code className="bg-background px-3 py-2 rounded block text-sm">
                                        Lab3_Results/process_log.txt
                                      </code>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Tracks progress: "Processing study 1 of 10: [Title]", timestamps, completion status
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-background p-6 rounded-lg border-2">
                                <h5 className="text-xl font-bold text-foreground mb-4">🎯 Why This Matters</h5>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="bg-primary/5 p-4 rounded-lg border">
                                    <p className="font-semibold text-primary mb-2">⏱️ Time Savings</p>
                                    <p className="text-sm text-muted-foreground">
                                      Manual screening: ~30 minutes per study × 200 = <strong>100 hours</strong><br/>
                                      With AI agent: <strong>~1 hour</strong> for all 200 studies
                                    </p>
                                  </div>
                                  <div className="bg-primary/5 p-4 rounded-lg border">
                                    <p className="font-semibold text-primary mb-2">🎯 Consistency</p>
                                    <p className="text-sm text-muted-foreground">
                                      Same prompt ensures consistent categorization criteria across all studies
                                    </p>
                                  </div>
                                  <div className="bg-primary/5 p-4 rounded-lg border">
                                    <p className="font-semibold text-primary mb-2">📊 Structured Output</p>
                                    <p className="text-sm text-muted-foreground">
                                      CSV format enables easy sorting, filtering, and further analysis in Excel or R
                                    </p>
                                  </div>
                                  <div className="bg-primary/5 p-4 rounded-lg border">
                                    <p className="font-semibold text-primary mb-2">🔄 Scalability</p>
                                    <p className="text-sm text-muted-foreground">
                                      Test with 10, then scale to 200+ studies with the same instruction
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <Alert className="border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
                                <AlertCircle className="h-5 w-5 text-amber-600" />
                                <AlertDescription className="ml-2">
                                  <p className="font-semibold mb-2">💡 Handling Missing Data</p>
                                  <p className="text-sm text-foreground">
                                    Some studies may have missing abstracts. Instruct Builder to skip the studies without abstract.
                                  </p>
                                </AlertDescription>
                              </Alert>

                              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-lg border-2">
                                <h5 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                  <Terminal className="h-5 w-5 text-indigo-600" />
                                  Getting Started
                                </h5>
                                <p className="text-sm text-foreground mb-4">
                                  Reference files have been prepared in your workshop repository:
                                </p>
                                <div className="space-y-2 text-sm">
                                  <div className="bg-background p-3 rounded border">
                                    <code className="text-xs">Data/lab3_instructions.md</code>
                                    <p className="text-xs text-muted-foreground mt-1">Complete step-by-step instructions for Builder</p>
                                  </div>
                                  <div className="bg-background p-3 rounded border">
                                    <code className="text-xs">Data/Prompts/lab3_prompt.md</code>
                                    <p className="text-xs text-muted-foreground mt-1">Categorization prompt to send with each study</p>
                                  </div>
                                  <div className="bg-background p-3 rounded border">
                                    <code className="text-xs">Data/Literature/bawe_ddl_studies.csv</code>
                                    <p className="text-xs text-muted-foreground mt-1">Sample CSV with ~200 studies (10 will be processed)</p>
                                  </div>
                                </div>
                                <p className="text-sm text-foreground mt-4 italic">
                                  Open <code className="bg-background px-2 py-1 rounded text-xs">Data/lab3_instructions.md</code> in Trae, 
                                  then send the file path to Builder to begin!
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>


                  {/* Workshop Ad Hoc Notes */}
                  <Collapsible 
                    open={moduleStates.adhocNotes} 
                    onOpenChange={(open) => setModuleStates({...moduleStates, adhocNotes: open})}
                    className="mt-6"
                  >
                    <Card className="border-2 border-amber-500 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
                      <CollapsibleTrigger asChild>
                        <button className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white p-4 flex items-center justify-between hover:from-amber-700 hover:to-amber-600 transition-all">
                          <h3 className="font-semibold text-left flex items-center gap-2 text-xl">
                            <Lightbulb className="h-6 w-6" />
                            Workshop Ad Hoc Notes
                          </h3>
                          <ChevronDown className="h-5 w-5 flex-shrink-0 transition-transform duration-300 ui-state-open:rotate-180" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-5 bg-card">
                        <div className="space-y-4">
                          <div className="flex justify-end">
                            <Button variant="outline" size="sm" asChild>
                              <a 
                                href="https://www.canva.cn/design/DAG5alUXgk8/H473seyr_viIf66Rs_vyUg/edit?utm_content=DAG5alUXgk8&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton" 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                Edit Presentation (Workshop Leader)
                              </a>
                            </Button>
                          </div>
                          <div className="aspect-video w-full">
                            <iframe
                              loading="lazy"
                              className="w-full h-full border-0 rounded-lg"
                              src="https://www.canva.cn/design/DAG5alUXgk8/E5fFCmHYMgZd3mbNyKAUbg/view?embed"
                              allow="fullscreen"
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Follow along with the presentation during the workshop. Use the navigation controls to move through the slides.
                          </p>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                </TabsContent>

                {/* REFLECTION TAB */}
                <TabsContent value="reflection" className="space-y-4">
                  {/* Workshop Summary - At the top */}
                  <Card className="overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        What We Covered Today
                      </h3>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-muted-foreground italic">To be updated</p>
                    </CardContent>
                  </Card>

                  <CollapsibleSection
                    title="Workshop Reflection Form"
                    icon="📝"
                    defaultOpen={false}
                  >
                    <p className="text-muted-foreground italic">To be updated</p>
                  </CollapsibleSection>

                  {/* Platform Vision Diagram */}

                  <Card className="border-2 border-indigo-300 dark:border-indigo-700 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Cpu className="h-6 w-6" />
                        Integrated Platform for Teaching & Research
                      </CardTitle>
                      <p className="text-sm text-indigo-100">
                        One platform powered by LLMs to support your academic work
                      </p>
                    </CardHeader>
                    <CardContent className="p-6">
                      {/* Central LLM Core */}
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-lg">
                          <Sparkles className="h-5 w-5" />
                          <span className="font-bold">LLM-Powered Core</span>
                          <Sparkles className="h-5 w-5" />
                        </div>
                      </div>

                      {/* Two Module Toggles */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Teaching Module */}
                        <Collapsible defaultOpen className="group">
                          <CollapsibleTrigger className="w-full">
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg border-2 border-blue-300 dark:border-blue-700 hover:shadow-md transition-all">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500 text-white rounded-lg">
                                  <GraduationCap className="h-6 w-6" />
                                </div>
                                <div className="text-left">
                                  <h4 className="font-bold text-foreground">Teaching Module</h4>
                                  <p className="text-xs text-muted-foreground">Student engagement & analytics</p>
                                </div>
                              </div>
                              <ChevronDown className="h-5 w-5 text-blue-600 transition-transform group-data-[state=open]:rotate-180" />
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                                <div>
                                  <p className="font-semibold text-sm text-foreground">Develop Learning Apps</p>
                                  <p className="text-xs text-muted-foreground">Create custom AI-powered learning experiences for your students</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                                <div>
                                  <p className="font-semibold text-sm text-foreground">Student Engagement</p>
                                  <p className="text-xs text-muted-foreground">Interactive content, quizzes, and personalized feedback</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                                <div>
                                  <p className="font-semibold text-sm text-foreground">Learning Analytics</p>
                                  <p className="text-xs text-muted-foreground">Access chat history, track progress, and analyze student data</p>
                                </div>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>

                        {/* Research Module */}
                        <Collapsible defaultOpen className="group">
                          <CollapsibleTrigger className="w-full">
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border-2 border-purple-300 dark:border-purple-700 hover:shadow-md transition-all">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500 text-white rounded-lg">
                                  <Microscope className="h-6 w-6" />
                                </div>
                                <div className="text-left">
                                  <h4 className="font-bold text-foreground">Research Module</h4>
                                  <p className="text-xs text-muted-foreground">Literature & paper assistance</p>
                                </div>
                              </div>
                              <ChevronDown className="h-5 w-5 text-purple-600 transition-transform group-data-[state=open]:rotate-180" />
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="mt-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                                <div>
                                  <p className="font-semibold text-sm text-foreground">Literature Management</p>
                                  <p className="text-xs text-muted-foreground">Upload, organize, and search your research papers</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                                <div>
                                  <p className="font-semibold text-sm text-foreground">Draft Paper Assistance</p>
                                  <p className="text-xs text-muted-foreground">AI-powered writing support for manuscripts</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                                <div>
                                  <p className="font-semibold text-sm text-foreground">Pedagogical Research</p>
                                  <p className="text-xs text-muted-foreground">Use student data for educational research studies</p>
                                </div>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </CardContent>
                  </Card>


                  {/* Connect via WeChat - Full Width Toggle */}
                  <Collapsible defaultOpen className="group">
                    <Card className="border-2 border-green-300 dark:border-green-700 overflow-hidden">
                      <CollapsibleTrigger className="w-full">
                        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-pointer hover:opacity-90 transition-opacity">
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                              <MessageSquare className="h-5 w-5" />
                              Connect via WeChat
                            </CardTitle>
                            <ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
                          </div>
                          <p className="text-sm text-green-100 text-left">
                            Join our community or connect directly with Simon
                          </p>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center gap-6">
                            {/* Group QR - Primary */}
                            <div className="text-center">
                              <h4 className="font-semibold text-foreground mb-3 text-lg">Join WeChat Group</h4>
                              <div className="bg-white p-3 rounded-lg inline-block shadow-md">
                                <img 
                                  src={genaiCop2QR} 
                                  alt="Gen AI CoP 2 WeChat Group QR Code" 
                                  className="w-56 h-56 object-contain"
                                />
                              </div>
                              <p className="text-sm text-muted-foreground mt-3">Gen AI CoP 2</p>
                              <p className="text-xs text-amber-600 mt-1">Valid until 12/20</p>
                            </div>
                            
                            {/* Simon's QR - Hidden by default */}
                            <Collapsible>
                              <CollapsibleTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2">
                                  <ChevronDown className="h-4 w-4 transition-transform ui-state-open:rotate-180" />
                                  Can't scan? Add Simon directly
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="mt-4">
                                <div className="text-center">
                                  <h4 className="font-semibold text-foreground mb-3">Add Simon on WeChat</h4>
                                  <div className="bg-white p-3 rounded-lg inline-block shadow-md">
                                    <img 
                                      src={wechatSimonQR} 
                                      alt="Simon WANG WeChat QR Code" 
                                      className="w-48 h-48 object-contain"
                                    />
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-3">Simon WANG</p>
                                  <p className="text-xs text-muted-foreground">Tai Po, Hong Kong</p>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default WorkshopAIAgentDelivery;
