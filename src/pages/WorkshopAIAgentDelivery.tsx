import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Laptop, Lightbulb, MessageSquare, ArrowLeft, Mail, ChevronDown, Terminal, Zap, ChevronUp, FileText, BookOpen, Key, AlertCircle, Info, Cpu, FolderOpen, GraduationCap, FileEdit, Microscope, PenTool, Sparkles, Monitor, ExternalLink, Play, MessagesSquare } from "lucide-react";
import { WorkshopUseCaseChat } from "@/components/WorkshopUseCaseChat";
import { WorkshopUseCaseBBS } from "@/components/WorkshopUseCaseBBS";
import { WorkshopInterestForm } from "@/components/WorkshopInterestForm";
import wechatGroupQR from "@/assets/wechat-group-qr.jpg";
import wechatSimonQR from "@/assets/wechat-simon-qr.jpg";
import traeIdeInterface from "@/assets/trae-ide-interface.png";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MermaidDiagram } from "@/components/MermaidDiagram";

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
    module7: true,
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
      module7: false,
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
      module7: true,
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
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="flex items-center gap-4">
                <Link to="/workshops/ai-agent-workshop">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Workshop Info
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">
                  Workshop: Leveraging AI Agents in IDEs
                </h1>
                <p className="text-xl text-muted-foreground">
                  Complete guide for participants - preparation, activities, and follow-up
                </p>
              </div>

              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Welcome to the workshop! This page contains all materials and activities for registered participants.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col items-center gap-4">
                <div className="text-center space-y-1">
                  <p className="text-lg font-semibold text-foreground">Date: 3 Dec 2025</p>
                  <p className="text-lg font-semibold text-foreground">Time: 10:30am to 1:30pm</p>
                </div>
                <Button size="lg" className="gap-2" asChild>
                  <a 
                    href="https://teams.microsoft.com/l/meetup-join/19%3ameeting_ZGEwMGEyNzUtNThhMi00NDg3LThlODktNzg3ZWU2MmMyMTg1%40thread.v2/0?context=%7b%22Tid%22%3a%226e261eb4-83bf-4585-8cc2-130d0188e081%22%2c%22Oid%22%3a%2250114aa0-76a5-4a5c-bab5-8aba1f464994%22%7d"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Join Teams Meeting
                  </a>
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preparation">Preparation</TabsTrigger>
                  <TabsTrigger value="activities">Workshop Activities</TabsTrigger>
                  <TabsTrigger value="reflection">Reflection & Follow-up</TabsTrigger>
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
                              <strong>Trae IDE</strong> (Required) - Download and install from:
                              <ul className="mt-2 ml-4 space-y-1">
                                <li>• <strong>Mainland China:</strong> <a href="https://trae.cn" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">trae.cn</a></li>
                                <li>• <strong>Outside Mainland China:</strong> <a href="https://trae.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">trae.ai</a></li>
                              </ul>
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
                            <span>Visit the appropriate Trae website for your location</span>
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
                            <strong>Budget Estimate:</strong> RMB/HKD 20 should be sufficient for workshop activities and experimentation with API-based language models.
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
                        Important Notice for Mainland China Users
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Alert>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription>
                          <p className="font-semibold mb-2">VPN Access Required</p>
                          <p className="text-sm">
                            Accessing <strong>Lovable</strong> and <strong>OpenRouter</strong> from Mainland China may require a VPN connection.
                          </p>
                        </AlertDescription>
                      </Alert>
                      <div className="p-4 bg-muted rounded-lg border-l-4 border-muted-foreground">
                        <p className="text-sm text-muted-foreground">
                          <strong>Important:</strong> Always respect and comply with local laws and regulations on Internet use. Limit legitimate use of VPN for teaching and research purposes only.
                        </p>
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
                          Clone the workshop repository using Trae IDE. Choose the appropriate repository based on your location:
                        </p>
                        <ul className="space-y-3 text-foreground">
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>Mainland China:</strong> <a href="https://gitee.com/simonwanghk/agent3Dec25" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono text-sm">https://gitee.com/simonwanghk/agent3Dec25</a>
                            </div>
                          </li>
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>Outside Mainland China:</strong> <a href="https://github.com/tesolchina/Agent3Dec25" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono text-sm">https://github.com/tesolchina/Agent3Dec25</a>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                        <h4 className="font-semibold mb-2">How to Clone in Trae</h4>
                        <ol className="space-y-2 text-sm">
                          <li className="flex gap-2">
                            <span className="font-semibold">1.</span>
                            <span>Open Trae IDE and log in to your account</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">2.</span>
                            <span>Use the Git clone feature in Trae</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">3.</span>
                            <span>Paste the appropriate repository URL (Gitee or GitHub)</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">4.</span>
                            <span>Wait for the repository to clone and open the project in Trae</span>
                          </li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Laptop className="h-5 w-5" />
                        Remix Lovable Project
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Get Started with Lovable</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Visit the workshop project on Lovable and create your own remix to experiment with:
                        </p>
                        <ul className="space-y-3 text-foreground">
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>Workshop Project:</strong> <a href="https://lovable.dev/projects/6b74967a-bc71-434d-a398-74a0e8c7d669?remixed=true" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono text-sm">Visit and Remix</a>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                        <h4 className="font-semibold mb-2">What is Remixing?</h4>
                        <p className="text-sm">
                          Remixing creates your own copy of the project that you can modify and experiment with. This allows you to follow along with workshop activities in your own Lovable workspace without affecting the original project.
                        </p>
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
                            Module 2: Get Familiar with IDE - Navigating the Trae Interface
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
                                  <li>🤖 AI agent ("Builder")</li>
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
                                src={traeIdeInterface} 
                                alt="Trae IDE interface showing left panel with file explorer, middle panel with code editor, right panel with AI chat, and terminal at the bottom"
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
                                    <p className="font-semibold">Open Trae IDE</p>
                                    <p className="text-sm text-muted-foreground">Launch the Trae application on your computer</p>
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
                                    <p className="font-semibold">Talk with Builder</p>
                                    <p className="text-sm text-muted-foreground">Start a conversation with the AI agent in the right panel. Try asking "Hello, can you help me understand this IDE?"</p>
                                  </div>
                                </div>
                              </div>
                            </AlertDescription>
                          </Alert>

                          {/* Reminder */}
                          <div className="p-4 bg-accent/10 rounded-lg border-l-4 border-accent">
                            <p className="text-sm">
                              <strong>💡 Reminder:</strong> The AI agent in Trae is called <strong>"Builder"</strong>. Don't hesitate to ask Builder questions as you explore the interface!
                            </p>
                          </div>

                          {/* Auto-Save Tip */}
                          <Alert className="border-l-4 border-primary bg-primary/5">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            <AlertDescription className="ml-2">
                              <p className="font-semibold mb-2">💾 Important Tip: Turn On Auto-Save</p>
                              <p className="text-sm text-foreground">
                                Enable auto-save in Trae to automatically save your changes. This prevents losing work and ensures Builder always has access to your latest code. Look for the auto-save setting in Trae's preferences or settings menu.
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
                            <h4 className="text-xl font-bold text-foreground mb-4">🎯 Your First Builder Task</h4>
                            <p className="text-foreground mb-4">
                              Before diving into Lab 1, let's practice asking Builder to do something practical: cloning the workshop repository. 
                              This task demonstrates how AI agents can handle technical operations (like Git commands) that traditionally required 
                              learning command-line syntax.
                            </p>
                            <div className="bg-background p-4 rounded-lg border">
                              <p className="text-sm text-foreground">
                                <strong>What you'll learn:</strong> How to delegate technical tasks to Builder without needing to know the underlying commands
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
                                  <span>Name it something like <code className="bg-muted px-2 py-1 rounded">WorkshopMaterials</code> or <code className="bg-muted px-2 py-1 rounded">Agent3Dec25</code></span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-amber-600">•</span>
                                  <span>Click on the folder to open/select it</span>
                                </li>
                              </ul>
                            </div>

                            {/* Step 2: Ask Builder to Clone */}
                            <div className="bg-background p-5 rounded-lg border-l-4 border-blue-600">
                              <h5 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                                Ask Builder to Clone the Repository
                              </h5>
                              <p className="text-sm text-foreground mb-3 ml-8">
                                In the <strong>Right Panel (AI Agent Chat)</strong>, type a natural language instruction to Builder:
                              </p>
                              <div className="bg-muted p-4 rounded-lg ml-8">
                                <p className="text-sm font-semibold text-foreground mb-2">Example Message to Builder:</p>
                                <div className="bg-background p-3 rounded border">
                                  <p className="text-sm italic text-foreground">
                                    "Please clone the workshop repository to this folder. Use this URL:<br/>
                                    <strong className="text-primary">
                                      [Choose based on your location]
                                    </strong>"
                                  </p>
                                  <div className="mt-3 space-y-2 text-xs">
                                    <div className="p-2 bg-muted rounded">
                                      <strong>🇨🇳 Mainland China:</strong><br/>
                                      <code className="text-primary">https://gitee.com/simonwanghk/agent3Dec25</code>
                                    </div>
                                    <div className="p-2 bg-muted rounded">
                                      <strong>🌍 Outside Mainland China:</strong><br/>
                                      <code className="text-primary">https://github.com/tesolchina/Agent3Dec25</code>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Step 3: Watch Builder Work */}
                            <div className="bg-background p-5 rounded-lg border-l-4 border-green-600">
                              <h5 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                                Watch Builder Execute Git Commands
                              </h5>
                              <p className="text-sm text-foreground mb-3 ml-8">
                                After you send the instruction, Builder will:
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
                                <p className="text-sm font-semibold text-foreground mb-2">✅ AI Agent Approach (With Builder):</p>
                                <ul className="space-y-2 text-sm text-foreground list-none">
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span><strong>Just ask in natural language</strong> - no syntax to memorize</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span><strong>Builder handles the technical details</strong> - executes the correct commands</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span><strong>Automatic error handling</strong> - Builder can troubleshoot and retry if needed</span>
                                  </li>
                                </ul>
                              </div>

                              <blockquote className="border-l-4 border-primary pl-4 italic text-foreground my-4">
                                "You don't need to learn CLI syntax anymore. Just tell Builder what you want, and it will figure out the commands."
                              </blockquote>
                            </div>
                          </div>

                          {/* Behind the Scenes: What Builder Actually Does */}
                          <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 p-6 rounded-xl border-2">
                            <h4 className="text-xl font-bold text-foreground mb-4">🔍 Behind the Scenes: What Builder Actually Does</h4>
                            <p className="text-foreground mb-4">
                              When you ask Builder to clone the repository, here's what happens behind the scenes:
                            </p>
                            <div className="bg-background p-4 rounded-lg border font-mono text-xs">
                              <div className="text-muted-foreground mb-1"># Builder interprets your request and executes:</div>
                              <div className="text-foreground">$ git clone https://github.com/tesolchina/Agent3Dec25</div>
                              <div className="text-green-600 mt-2">Cloning into 'Agent3Dec25'...</div>
                              <div className="text-green-600">remote: Enumerating objects: 150, done.</div>
                              <div className="text-green-600">remote: Counting objects: 100% (150/150), done.</div>
                              <div className="text-green-600">Receiving objects: 100% (150/150), done.</div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-3">
                              You can see this output in the <strong>Bottom Middle Area (Terminal/Console)</strong> in Trae. 
                              Builder is using command-line tools, but you didn't need to know the syntax!
                            </p>
                          </div>

                          {/* Verification */}
                          <Alert className="border-l-4 border-primary bg-primary/5">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            <AlertDescription className="ml-2">
                              <p className="font-semibold mb-2">✅ Verify Success</p>
                              <p className="text-sm text-foreground">
                                After Builder finishes, check the <strong>Left Panel (File Explorer)</strong>. You should see a new folder 
                                with the workshop materials inside (Lab1_Explore_BAWE, Data folder, etc.). This confirms the repository 
                                was successfully cloned!
                              </p>
                            </AlertDescription>
                          </Alert>

                          {/* Key Takeaway */}
                          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-500">
                            <p className="font-semibold text-foreground mb-2">🎯 Key Takeaway</p>
                            <p className="text-sm text-foreground">
                              This simple task demonstrates the core value of AI agents: <strong>you can accomplish technical tasks 
                              using natural language, without needing to learn specialized syntax or commands.</strong> Builder translates 
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
                              Every AI Agent task follows a simple three-step model. Understanding this model helps you communicate effectively with Builder and structure your requests clearly.
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

                          {/* Lab 1: Explore BAWE Corpus */}
                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border-2">
                            <h4 className="text-xl font-bold text-foreground mb-4">🔬 Lab 1: Explore BAWE (British Academic Written English Corpus)</h4>
                            
                            <p className="text-foreground mb-4">
                              In this hands-on lab, you'll use Builder to explore a learner corpus, generate insights, and create visualizations.
                            </p>

                            <Alert className="mb-4 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
                              <FileText className="h-5 w-5 text-amber-600" />
                              <AlertDescription className="ml-2">
                                <p className="font-semibold text-foreground">📁 Locate Your Lab Files</p>
                                <p className="text-sm text-foreground mt-1">
                                  In your Trae workspace, navigate to <code className="bg-muted px-2 py-1 rounded text-xs">Lab1_Explore_BAWE</code> folder. You'll find an <code className="bg-muted px-2 py-1 rounded text-xs">instructions.md</code> file that contains the basic template structure.
                                </p>
                              </AlertDescription>
                            </Alert>

                            <h5 className="font-bold text-foreground mb-3">Step-by-Step Instructions</h5>
                            
                            <div className="space-y-4">
                              {/* Step 1: Set Up Instructions File */}
                              <div className="bg-background p-4 rounded-lg border-l-4 border-purple-600">
                                <h6 className="font-bold text-foreground mb-2">Step 1: Open and Edit instructions.md</h6>
                                <p className="text-sm text-foreground mb-2">
                                  Open <code className="bg-muted px-2 py-1 rounded text-xs">Lab1_Explore_BAWE/instructions.md</code> in Trae. You'll see a simple template:
                                </p>
                                <div className="bg-muted p-3 rounded text-xs font-mono mt-2">
                                  <div>Input:</div>
                                  <div className="text-muted-foreground">(empty for now)</div>
                                  <div className="mt-2">Process:</div>
                                  <div className="text-muted-foreground">(empty for now)</div>
                                  <div className="mt-2">Output:</div>
                                  <div className="text-muted-foreground">(empty for now)</div>
                                </div>
                              </div>

                              {/* Step 2: Define Input */}
                              <div className="bg-background p-4 rounded-lg border-l-4 border-purple-600">
                                <h6 className="font-bold text-foreground mb-2">Step 2: Define Your Input (Source Data)</h6>
                                <ul className="space-y-2 text-sm text-foreground list-none">
                                  <li className="flex items-start gap-2">
                                    <span className="text-purple-600 font-bold">1.</span>
                                    <span>In the Left Panel (File Explorer), navigate to <code className="bg-muted px-2 py-1 rounded text-xs">Data/BAWE/CORPUS_ByDiscipline</code></span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-purple-600 font-bold">2.</span>
                                    <span><strong>Right-click</strong> on the <code className="bg-muted px-2 py-1 rounded text-xs">CORPUS_ByDiscipline</code> folder</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-purple-600 font-bold">3.</span>
                                    <span>Select <strong>"Copy Path"</strong> or <strong>"Copy Relative Path"</strong> from the context menu</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-purple-600 font-bold">4.</span>
                                    <span>Paste the path into the <code className="bg-muted px-2 py-1 rounded text-xs">Input:</code> section of your instructions.md file</span>
                                  </li>
                                </ul>
                                <div className="bg-muted p-3 rounded text-xs font-mono mt-3">
                                  <div>Input:</div>
                                  <div className="text-foreground">Data/BAWE/CORPUS_ByDiscipline</div>
                                </div>
                              </div>

                              {/* Step 3: Write Process Instructions */}
                              <div className="bg-background p-4 rounded-lg border-l-4 border-blue-600">
                                <h6 className="font-bold text-foreground mb-2">Step 3: Write Process Instructions (What to Do)</h6>
                                <p className="text-sm text-foreground mb-2">
                                  In the <code className="bg-muted px-2 py-1 rounded text-xs">Process:</code> section, write natural language instructions describing what you want Builder to do:
                                </p>
                                <div className="bg-muted p-3 rounded text-xs mt-2">
                                  <div className="font-mono text-muted-foreground">Process:</div>
                                  <div className="text-foreground mt-1 italic">
                                    Explore the folders in the CORPUS_ByDiscipline directory and analyze the text files within each discipline folder. Generate:
                                    <ul className="list-disc ml-6 mt-2 space-y-1">
                                      <li>A summary report showing the number of documents per discipline</li>
                                      <li>Basic statistics (word count, file count) for each discipline</li>
                                      <li>A bar chart visualizing document distribution across disciplines</li>
                                      <li>A simple analysis report highlighting the top 3 disciplines by document count</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>

                              {/* Step 4: Define Output */}
                              <div className="bg-background p-4 rounded-lg border-l-4 border-green-600">
                                <h6 className="font-bold text-foreground mb-2">Step 4: Define Your Output (Where to Save Results)</h6>
                                <p className="text-sm text-foreground mb-2">
                                  You can ask Builder to create a new folder for the results:
                                </p>
                                <div className="bg-muted p-3 rounded text-xs font-mono mt-2">
                                  <div>Output:</div>
                                  <div className="text-foreground mt-1">Create a new folder called "Lab1_Results" and save all reports, charts, and analysis files there.</div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  <strong>Tip:</strong> You can also right-click an existing folder and copy its path if you want to save results to a specific location.
                                </p>
                              </div>

                              {/* Step 5: Send to Builder */}
                              <div className="bg-background p-4 rounded-lg border-l-4 border-primary">
                                <h6 className="font-bold text-foreground mb-2">Step 5: Send Instructions to Builder</h6>
                                <ul className="space-y-2 text-sm text-foreground list-none">
                                  <li className="flex items-start gap-2">
                                    <span className="text-primary font-bold">1.</span>
                                    <span>Save your <code className="bg-muted px-2 py-1 rounded text-xs">instructions.md</code> file (auto-save should handle this)</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-primary font-bold">2.</span>
                                    <span><strong>Right-click</strong> on the <code className="bg-muted px-2 py-1 rounded text-xs">instructions.md</code> file in the File Explorer</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-primary font-bold">3.</span>
                                    <span>Select <strong>"Copy Path"</strong></span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-primary font-bold">4.</span>
                                    <span>In the Right Panel (AI Agent Chat), type: <em>"Please follow the instructions in [paste file path here]"</em></span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-primary font-bold">5.</span>
                                    <span>Press <strong>Enter</strong> to send the message to Builder</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-primary font-bold">6.</span>
                                    <span>Watch as Builder reads your instructions, accesses the data, and generates the reports and visualizations!</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Workflow Flowchart */}
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border-2">
                            <h4 className="text-xl font-bold text-foreground mb-4">📊 Complete Workflow Visualization</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              This flowchart shows the complete process from setting up your instructions to getting results from Builder.
                            </p>
                            <MermaidDiagram chart={`
graph LR
    subgraph SETUP["📝 Setup"]
        A[Open instructions.md] --> B[Fill Input/Process/Output sections]
    end
    
    subgraph SEND["💬 Send to Builder"]
        C[Copy instructions.md path] --> D[Paste in AI chat]
    end
    
    subgraph EXECUTE["🤖 Builder Executes"]
        E[Reads & processes] --> F[Creates output files]
    end
    
    SETUP --> SEND --> EXECUTE --> G[🎉 View Results]
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#fff3e0
    style D fill:#fce4ec
    style E fill:#e0f2f1
    style F fill:#f1f8e9
    style G fill:#c8e6c9
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
                                  <span><strong>Right-click is your friend:</strong> Use it to copy file and folder paths quickly</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-primary">✓</span>
                                  <span><strong>Structured instructions work best:</strong> The Input-Process-Output model helps organize your requests</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-primary">✓</span>
                                  <span><strong>Natural language is powerful:</strong> You don't need to know code; just describe what you want clearly</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-primary">✓</span>
                                  <span><strong>Builder does the heavy lifting:</strong> The agent reads, analyzes, generates, and saves results automatically</span>
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
                                  <strong>API (Application Programming Interface)</strong> is a way for computer programs to communicate with services, 
                                  like servers that run Large Language Models (LLMs).
                                </p>
                                <p className="text-sm text-foreground">
                                  Think of it as a <strong>messenger</strong> that takes requests from your program (Builder in Trae) and delivers 
                                  them to the AI service provider, then brings back the response.
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
                            <p className="text-foreground">
                              Understanding APIs is crucial because AI agents like Trae's Builder use API keys to communicate 
                              with LLM providers on your behalf. This automation is what makes AI agents powerful - they can 
                              send multiple requests, process large amounts of data, and integrate AI capabilities into your 
                              workflows without manual intervention.
                            </p>
                          </div>

                          {/* Setting Up API Keys - Next Module Preview */}
                          <Alert className="border-l-4 border-primary bg-primary/5">
                            <Terminal className="h-5 w-5 text-primary" />
                            <AlertDescription className="ml-2">
                              <p className="font-semibold mb-2">⏭️ Next: Hands-On Practice</p>
                              <p className="text-sm text-foreground">
                                Now that you understand what APIs are, in Module 5 we'll guide you through the practical steps 
                                of obtaining API keys from LLM providers and setting them up securely in your local environment.
                              </p>
                            </AlertDescription>
                          </Alert>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Module 5: Hands-On API Key Setup */}
                  <Collapsible 
                    open={moduleStates.module5} 
                    onOpenChange={(open) => setModuleStates({...moduleStates, module5: open})}
                  >
                    <Card className="border-2 border-primary">
                      <CollapsibleTrigger asChild>
                        <button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between hover:from-primary/90 hover:to-primary/70 transition-all">
                          <h3 className="font-semibold text-left flex items-center gap-2 text-xl">
                            <Key className="h-6 w-6" />
                            Module 5: Hands-On - Setting Up Your API Keys
                          </h3>
                          <ChevronDown className="h-5 w-5 flex-shrink-0 transition-transform duration-300 ui-state-open:rotate-180" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-5 bg-card">
                        <div className="space-y-6">
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Important Setup:</strong> In this module, you'll obtain API keys from LLM providers and store them securely in your local project folder.
                            </AlertDescription>
                          </Alert>

                          {/* Step 1: Prepare Your API Keys Folder */}
                          <div className="bg-muted/50 rounded-lg p-6">
                            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                              <FolderOpen className="h-5 w-5" />
                              Step 1: Locate Your API Keys Folder
                            </h4>
                            <div className="space-y-4">
                              <Alert className="border-l-4 border-green-600 bg-green-50 dark:bg-green-900/20">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <AlertDescription className="ml-2">
                                  <p className="font-semibold mb-2">✅ Good News!</p>
                                  <p className="text-sm text-foreground">
                                    The folder structure is already set up in the workshop repository. You don't need to create it manually!
                                  </p>
                                </AlertDescription>
                              </Alert>
                              <p className="text-foreground">
                                In your cloned repository, you'll find the following folder structure ready to use:
                              </p>
                              <div className="bg-background rounded-lg p-4 border font-mono text-sm">
                                <div>Data/</div>
                                <div className="ml-4">└── APIkeys/</div>
                                <div className="ml-8">├── Kimi.md</div>
                                <div className="ml-8">├── DeepSeek.md</div>
                                <div className="ml-8">└── openrouter.md</div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Navigate to this folder in Trae's File Explorer to verify it exists.
                              </p>
                            </div>
                          </div>

                          {/* Step 2: Obtain API Keys */}
                          <div className="bg-muted/50 rounded-lg p-6">
                            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                              <Key className="h-5 w-5" />
                              Step 2: Obtain API Keys from Providers
                            </h4>
                            <div className="space-y-6">
                              <div className="border-l-4 border-primary pl-4">
                                <h5 className="font-semibold mb-2">Kimi (Moonshot AI)</h5>
                                <ul className="list-disc list-inside space-y-2 text-foreground ml-4 text-sm">
                                  <li>Visit: <a href="https://platform.moonshot.cn" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://platform.moonshot.cn</a></li>
                                  <li>Sign up or log in to your account</li>
                                  <li>Navigate to API Keys section</li>
                                  <li>Create a new API key</li>
                                  <li>Copy the key (CNY ¥15 free credits available)</li>
                                </ul>
                              </div>

                              <div className="border-l-4 border-primary pl-4">
                                <h5 className="font-semibold mb-2">DeepSeek</h5>
                                <ul className="list-disc list-inside space-y-2 text-foreground ml-4 text-sm">
                                  <li>Visit: <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://platform.deepseek.com</a></li>
                                  <li>Create an account or sign in</li>
                                  <li>Go to API Keys management</li>
                                  <li>Generate a new API key</li>
                                  <li className="text-amber-600 dark:text-amber-400">⚠️ Free credits not available; may need to add funds (no more than USD 5 for experimentation)</li>
                                </ul>
                              </div>

                              <div className="border-l-4 border-primary pl-4">
                                <h5 className="font-semibold mb-2">OpenRouter</h5>
                                <ul className="list-disc list-inside space-y-2 text-foreground ml-4 text-sm">
                                  <li>Visit: <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://openrouter.ai</a></li>
                                  <li>Sign up with your account</li>
                                  <li>Navigate to Keys section</li>
                                  <li>Create a new API key</li>
                                  <li className="text-amber-600 dark:text-amber-400">⚠️ Free credits not available; may need to add funds (no more than USD 5 for experimentation)</li>
                                </ul>
                              </div>

                              <div className="bg-background rounded-lg p-4 border">
                                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4" />
                                  Cost Estimate:
                                </p>
                                <p className="text-sm text-foreground">
                                  For this workshop, you will need approximately USD 5-10 total for experimentation. 
                                  Kimi offers CNY ¥15 free starting credits. DeepSeek and OpenRouter may require adding funds.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Step 3: Store Your API Keys */}
                          <div className="bg-muted/50 rounded-lg p-6">
                            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                              <FileText className="h-5 w-5" />
                              Step 3: Store Your API Keys in Local Files
                            </h4>
                            <div className="space-y-4">
                              <p className="text-foreground">
                                Once you have obtained your API keys, update the corresponding files in your project:
                              </p>
                              
                              <div className="bg-background rounded-lg p-4 border">
                                <p className="text-sm font-medium mb-2">Data/APIkeys/Kimi.md</p>
                                <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}
                                </pre>
                              </div>

                              <div className="bg-background rounded-lg p-4 border">
                                <p className="text-sm font-medium mb-2">Data/APIkeys/DeepSeek.md</p>
                                <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}
                                </pre>
                              </div>

                              <div className="bg-background rounded-lg p-4 border">
                                <p className="text-sm font-medium mb-2">Data/APIkeys/openrouter.md</p>
                                <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}
                                </pre>
                              </div>

                              <p className="text-sm text-muted-foreground">
                                Simply open each file and paste your API key, replacing the placeholder text.
                              </p>
                            </div>
                          </div>

                          {/* Critical Security Warning */}
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="space-y-3">
                              <div>
                                <p className="font-bold text-lg mb-2">🔐 Critical Security Warning</p>
                                <p className="mb-2">
                                  <strong>Never sync API keys to GitHub or Gitee!</strong> These keys are confidential and should never be shared publicly.
                                </p>
                              </div>
                              <div className="bg-destructive/10 p-3 rounded">
                                <p className="font-semibold mb-2">Protect Your API Keys:</p>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  <li>Add <code className="bg-background/50 px-2 py-0.5 rounded">Data/APIkeys/</code> to your <code className="bg-background/50 px-2 py-0.5 rounded">.gitignore</code> file</li>
                                  <li>Double-check before pushing to remote repositories</li>
                                  <li>If accidentally exposed, regenerate your API keys immediately</li>
                                  <li>Never commit files containing API keys to version control</li>
                                </ul>
                              </div>
                              <p className="text-sm italic">
                                When syncing your project folder with GitHub or Gitee, make sure these files are excluded from being pushed to the remote repository.
                              </p>
                            </AlertDescription>
                          </Alert>

                          {/* Verification */}
                          <div className="bg-primary/10 rounded-lg p-6 border-l-4 border-primary">
                            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5" />
                              Verification
                            </h4>
                            <p className="text-foreground mb-4">
                              After setting up your API keys, you can verify they work by asking Builder to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                              <li>Read the API key files to confirm they're properly stored</li>
                              <li>Make a simple test request to one of the LLM providers</li>
                              <li>Report back on the connection status</li>
                            </ul>
                          </div>

                          {/* Lab 2: Analyze BAWE in Batches */}
                          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl border-2 mt-8">
                            <h4 className="text-2xl font-bold text-foreground mb-4">🧪 Lab 2: Analyze BAWE in Batches</h4>
                            <p className="text-foreground mb-6">
                              Now that you have your API keys set up, let's use them to automate a real analysis task! 
                              In this lab, you'll see the power of API automation - sending multiple files to an LLM and collecting results automatically.
                            </p>

                            {/* The Power of API Automation */}
                            <Alert className="mb-6 border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20">
                              <Zap className="h-5 w-5 text-indigo-600" />
                              <AlertDescription className="ml-2">
                                <p className="font-semibold mb-2">💡 What Makes This Powerful?</p>
                                <p className="text-sm text-foreground mb-2">
                                  With a chatbot, you'd need to manually:
                                </p>
                                <ul className="text-sm text-foreground space-y-1 list-none ml-4">
                                  <li>• Open each file, copy the text</li>
                                  <li>• Switch to browser, paste into chatbot</li>
                                  <li>• Copy the response, switch back</li>
                                  <li>• Paste into a document, repeat 5 times</li>
                                </ul>
                                <p className="text-sm text-foreground mt-2 font-semibold">
                                  With API and AI agents: <span className="text-indigo-600">One instruction, automatic processing!</span>
                                </p>
                              </AlertDescription>
                            </Alert>

                            {/* Lab Instructions */}
                            <div className="space-y-6">
                              {/* Step 1: Create the Prompt File */}
                              <div className="bg-background p-6 rounded-lg border-2">
                                <h5 className="text-xl font-bold text-foreground mb-4">📝 Step 1: Create Your Prompt File</h5>
                                <p className="text-foreground mb-4">
                                  First, update the file <code className="bg-muted px-2 py-1 rounded">Lab2 Analyze BAWE in batches/prompt.md</code> with your analysis instructions.
                                </p>
                                
                                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-500 mb-4">
                                  <h6 className="font-bold text-foreground mb-2">💡 Example Prompts</h6>
                                  <div className="space-y-3">
                                    <div className="bg-background p-3 rounded border">
                                      <p className="text-xs text-muted-foreground mb-1">Summary task:</p>
                                      <code className="text-sm text-foreground block">
                                        You are an experienced reader of academic texts. Please write a summary of no more than 50 words for the essay provided.
                                      </code>
                                    </div>
                                    <div className="bg-background p-3 rounded border">
                                      <p className="text-xs text-muted-foreground mb-1">Structure analysis:</p>
                                      <code className="text-sm text-foreground block">
                                        Identify the main argument, supporting evidence, and conclusion of this academic essay.
                                      </code>
                                    </div>
                                    <div className="bg-background p-3 rounded border">
                                      <p className="text-xs text-muted-foreground mb-1">Vocabulary extraction:</p>
                                      <code className="text-sm text-foreground block">
                                        List the key academic vocabulary used in this essay with their definitions.
                                      </code>
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-3 italic">
                                    You can use any analysis task you find interesting!
                                  </p>
                                </div>
                              </div>

                              {/* Step 2: Update Instructions File */}
                              <div className="bg-background p-6 rounded-lg border-2">
                                <h5 className="text-xl font-bold text-foreground mb-4">📋 Step 2: Update the Instructions File</h5>
                                <p className="text-foreground mb-4">
                                  Edit <code className="bg-muted px-2 py-1 rounded">Lab2 Analyze BAWE in batches/instructions.md</code> with the Input-Process-Output structure:
                                </p>

                                {/* Input Section */}
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-600 mb-4">
                                  <h6 className="font-bold text-foreground mb-2">📥 Input</h6>
                                  <p className="text-sm text-foreground mb-3">Include these three file paths:</p>
                                  <ul className="space-y-2 text-sm text-foreground list-none">
                                    <li className="flex items-start gap-2">
                                      <span className="text-purple-600 font-bold">1.</span>
                                      <div>
                                        <span className="font-semibold">Prompt file:</span>
                                        <code className="bg-background px-2 py-1 rounded block mt-1 text-xs">
                                          Lab2 Analyze BAWE in batches/prompt.md
                                        </code>
                                      </div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-purple-600 font-bold">2.</span>
                                      <div>
                                        <span className="font-semibold">Data folder</span> (pick ONE subfolder):
                                        <code className="bg-background px-2 py-1 rounded block mt-1 text-xs">
                                          Data/BAWE/CORPUS_ByDiscipline/[subfolder name]
                                        </code>
                                      </div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-purple-600 font-bold">3.</span>
                                      <div>
                                        <span className="font-semibold">API key file</span> (pick ONE):
                                        <code className="bg-background px-2 py-1 rounded block mt-1 text-xs">
                                          Data/APIkeys/Kimi.md OR Data/APIkeys/DeepSeek.md OR Data/APIkeys/openrouter.md
                                        </code>
                                      </div>
                                    </li>
                                  </ul>
                                </div>

                                {/* Process Section */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-600 mb-4">
                                  <h6 className="font-bold text-foreground mb-2">⚙️ Process</h6>
                                  <p className="text-sm text-foreground mb-3">
                                    Ask the AI agent to:
                                  </p>
                                  <ul className="space-y-2 text-sm text-foreground list-none ml-4">
                                    <li className="flex items-start gap-2">
                                      <span className="text-blue-600 font-bold">1.</span>
                                      <span>Pick the <strong>first 5 files</strong> from the specified subfolder (or randomly select 5 files)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-blue-600 font-bold">2.</span>
                                      <span>Send each file <strong>one at a time</strong> together with the prompt to the LLM via API</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-blue-600 font-bold">3.</span>
                                      <span>Collect the LLM response for each file</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-blue-600 font-bold">4.</span>
                                      <span>Save the metadata, original essay text, and AI response to a CSV file</span>
                                    </li>
                                  </ul>
                                  
                                  <div className="mt-4 p-3 bg-background rounded border">
                                    <p className="text-xs font-semibold text-foreground mb-2">🔧 API-Specific Notes:</p>
                                    <ul className="text-xs text-muted-foreground space-y-1">
                                      <li>• <strong>Kimi / DeepSeek:</strong> No need to specify model name</li>
                                      <li>• <strong>OpenRouter:</strong> Specify a model, e.g., <code className="bg-muted px-1 rounded">z-ai/glm-4.6</code></li>
                                      <li>• Find OpenRouter models at: <a href="https://openrouter.ai/models" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">openrouter.ai/models</a></li>
                                    </ul>
                                  </div>
                                </div>

                                {/* Output Section */}
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-600">
                                  <h6 className="font-bold text-foreground mb-2">📤 Output</h6>
                                  <p className="text-sm text-foreground mb-2">
                                    Specify the folder path where the CSV should be saved:
                                  </p>
                                  <code className="bg-background px-3 py-2 rounded block text-sm">
                                    Lab2_Results/
                                  </code>
                                  <p className="text-xs text-muted-foreground mt-3">
                                    <strong>CSV should include:</strong>
                                  </p>
                                  <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc list-inside ml-2">
                                    <li>File metadata (filename, discipline, etc.)</li>
                                    <li>Original essay text</li>
                                    <li>AI summary/response</li>
                                  </ul>
                                </div>
                              </div>

                              <div className="bg-background p-6 rounded-lg border-2">
                                <h5 className="text-xl font-bold text-foreground mb-4">📊 Automation Workflow</h5>
                                <p className="text-sm text-muted-foreground mb-4">
                                  This flowchart shows how API enables automation and eliminates the manual copy-paste-switch cycle of chatbots:
                                </p>
                                <MermaidDiagram chart={`
graph LR
    A[📁 Input<br/>CORPUS_ByDiscipline<br/>5 files] --> B{🔄 For Each File}
    B --> C[📖 Read]
    C --> D[📤 API + Prompt]
    D --> E[📥 Response]
    E --> F[💾 Store]
    F --> B
    B --> G[📊 Compile Results]
    G --> H[✅ CSV Output<br/>Lab2_Results]
    
    style A fill:#e3f2fd,stroke:#1976d2,stroke-width:3px
    style B fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style G fill:#fff9c4,stroke:#fbc02d,stroke-width:2px
    style H fill:#c8e6c9,stroke:#388e3c,stroke-width:3px
    style C fill:#f3e5f5
    style D fill:#ffebee
    style E fill:#e8f5e9
    style F fill:#fce4ec
                                `} />
                                
                                <Alert className="mt-4 border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20">
                                  <Zap className="h-5 w-5 text-indigo-600" />
                                  <AlertDescription className="ml-2">
                                    <p className="font-semibold mb-2">🚀 The Power of API Automation</p>
                                    <div className="text-sm text-foreground space-y-2">
                                      <p className="flex items-start gap-2">
                                        <span className="text-indigo-600 font-bold">✓</span>
                                        <span><strong>No context switching:</strong> AI agent handles all file operations and API calls automatically</span>
                                      </p>
                                      <p className="flex items-start gap-2">
                                        <span className="text-indigo-600 font-bold">✓</span>
                                        <span><strong>No manual copy-paste:</strong> Builder reads files, sends to LLM, and stores results - all programmatically</span>
                                      </p>
                                      <p className="flex items-start gap-2">
                                        <span className="text-indigo-600 font-bold">✓</span>
                                        <span><strong>Scalable:</strong> 5 files or 500 files - the same instruction works (just adjust the number)</span>
                                      </p>
                                      <p className="flex items-start gap-2">
                                        <span className="text-indigo-600 font-bold">✓</span>
                                        <span><strong>Repeatable:</strong> Save the instruction, run it anytime with different data</span>
                                      </p>
                                    </div>
                                  </AlertDescription>
                                </Alert>
                              </div>

                              {/* Implementation Steps */}
                              <div className="bg-background p-6 rounded-lg border-2">
                                <h5 className="text-xl font-bold text-foreground mb-4">🛠️ Implementation Steps</h5>
                                <div className="space-y-4">
                                  <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</span>
                                    <div>
                                      <p className="font-semibold text-foreground">Create a prompt.md file</p>
                                      <p className="text-sm text-muted-foreground">Write the analysis instructions for the LLM (e.g., "Summarize and identify discipline")</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</span>
                                    <div>
                                      <p className="font-semibold text-foreground">Create Lab2_instructions.md</p>
                                      <p className="text-sm text-muted-foreground">Use the Input-Process-Output structure to describe the batch analysis task</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</span>
                                    <div>
                                      <p className="font-semibold text-foreground">Send to Builder</p>
                                      <p className="text-sm text-muted-foreground">Right-click Lab2_instructions.md, copy path, and send to Builder</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</span>
                                    <div>
                                      <p className="font-semibold text-foreground">Watch the magic happen!</p>
                                      <p className="text-sm text-muted-foreground">Builder will read files, call the API multiple times, and generate your CSV automatically</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
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
                                    Some studies may have missing abstracts. Instruct Builder to:
                                  </p>
                                  <ul className="text-sm text-foreground space-y-1 list-disc ml-6 mt-2">
                                    <li>Use only the title for categorization when abstract is missing</li>
                                    <li>Flag studies with missing abstracts in the output</li>
                                    <li>Note "Abstract not available" in the relevant columns</li>
                                  </ul>
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

                  {/* Module 7: Learning to Build a GUI using Lovable */}
                  <Collapsible 
                    open={moduleStates.module7} 
                    onOpenChange={(open) => setModuleStates({...moduleStates, module7: open})}
                    className="mt-6"
                  >
                    <Card className="border-2 border-primary">
                      <CollapsibleTrigger asChild>
                        <button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between hover:from-primary/90 hover:to-primary/70 transition-all">
                          <h3 className="font-semibold text-left flex items-center gap-2 text-xl">
                            <Monitor className="h-6 w-6" />
                            Module 7: Learning to Build a GUI using Lovable
                          </h3>
                          <ChevronDown className="h-5 w-5 flex-shrink-0 transition-transform duration-300 ui-state-open:rotate-180" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-5 bg-card">
                        <div className="space-y-6">
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border-2">
                            <h4 className="text-2xl font-bold text-foreground mb-4">🎨 From CLI Automation to Interactive Web Apps</h4>
                            <p className="text-foreground mb-4">
                              So far, we've learned how AI agents in IDEs can automate file operations and batch processing via APIs. 
                              But what if we want to create <strong>interactive web applications</strong> that allow users to interact with AI models 
                              through a graphical interface? This is where <strong>Lovable</strong> comes in.
                            </p>
                            
                            <div className="bg-background p-5 rounded-lg border-2 mb-4">
                              <h5 className="font-bold text-foreground mb-3">🌐 Introducing the LLM Tester App</h5>
                              <p className="text-sm text-foreground mb-3">
                                Before we build our own GUI, let's examine a working example that demonstrates key concepts:
                              </p>
                              <div className="bg-primary/5 p-4 rounded-lg border flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-foreground">LLM Tester by OpenRouter Hub</p>
                                  <p className="text-xs text-muted-foreground mt-1">Test and compare multiple AI models simultaneously</p>
                                </div>
                                <Button asChild variant="default" size="sm" className="ml-4">
                                  <a 
                                    href="https://openrouter-hub.lovable.app" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    Visit App
                                  </a>
                                </Button>
                              </div>
                            </div>

                            <Alert className="border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20">
                              <Info className="h-5 w-5 text-purple-600" />
                              <AlertDescription className="ml-2">
                                <p className="font-semibold mb-2">🎯 Learning Objective</p>
                                <p className="text-sm text-foreground">
                                  Understand how the LLM Tester works and identify UI elements that can be adapted 
                                  to build engaging tools for student learning and assessment.
                                </p>
                              </AlertDescription>
                            </Alert>
                          </div>

                          {/* How the LLM Tester Works */}
                          <div className="bg-background p-6 rounded-lg border-2">
                            <h5 className="text-xl font-bold text-foreground mb-4">⚙️ How the LLM Tester Works</h5>
                            
                            <div className="space-y-4">
                              {/* Step 1: Select Models */}
                              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-600">
                                <h6 className="font-bold text-foreground mb-2 flex items-center gap-2">
                                  <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                                  Select Multiple AI Models
                                </h6>
                                <p className="text-sm text-foreground ml-8">
                                  The app provides a <strong>UI with checkboxes</strong> to select which models from OpenRouter you want to test. 
                                  You can choose 2, 5, or even 10+ models to compare side-by-side.
                                </p>
                                <div className="ml-8 mt-2 text-xs text-muted-foreground">
                                  <p><strong>Example models:</strong> GPT-4, Claude 3, Gemini Pro, Llama 3, Mistral, etc.</p>
                                </div>
                              </div>

                              {/* Step 2: Enter Task */}
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-600">
                                <h6 className="font-bold text-foreground mb-2 flex items-center gap-2">
                                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                                  Enter Your Task/Question
                                </h6>
                                <p className="text-sm text-foreground ml-8 mb-2">
                                  You type a task or question into a <strong>text input field</strong>, and the app sends this same prompt 
                                  to all selected models via the OpenRouter API.
                                </p>
                                <div className="ml-8 bg-background p-3 rounded border">
                                  <p className="text-xs font-semibold text-foreground mb-1">Example Task We'll Use:</p>
                                  <code className="text-xs text-primary">
                                    "Compute 24 out of 5, 5, 5, and 1. Show your work step-by-step."
                                  </code>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    <strong>Correct Answer:</strong> 5 - (1/5) = 4.8, then 4.8 × 5 = 24
                                  </p>
                                </div>
                              </div>

                              {/* Step 3: Get Responses */}
                              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-600">
                                <h6 className="font-bold text-foreground mb-2 flex items-center gap-2">
                                  <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                                  Receive and Display Model Responses
                                </h6>
                                <p className="text-sm text-foreground ml-8">
                                  Each model returns its response, and the app displays them in <strong>separate cards or columns</strong> 
                                  so you can visually compare the quality, accuracy, and reasoning of each model.
                                </p>
                              </div>

                              {/* Step 4: Judge Responses */}
                              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-600">
                                <h6 className="font-bold text-foreground mb-2 flex items-center gap-2">
                                  <span className="bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">4</span>
                                  AI-Powered Evaluation (Meta-Model as Judge)
                                </h6>
                                <p className="text-sm text-foreground ml-8 mb-2">
                                  The app can send all the model responses to <strong>another AI model</strong> (the "judge") to evaluate 
                                  which response is most accurate, well-reasoned, or helpful.
                                </p>
                                <p className="text-xs text-muted-foreground ml-8">
                                  This demonstrates the concept of <strong>"AI evaluating AI"</strong> - a powerful technique for automated assessment.
                                </p>
                              </div>

                              {/* Step 5: Download Results */}
                              <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border-l-4 border-cyan-600">
                                <h6 className="font-bold text-foreground mb-2 flex items-center gap-2">
                                  <span className="bg-cyan-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">5</span>
                                  View and Download Results
                                </h6>
                                <p className="text-sm text-foreground ml-8">
                                  The app provides options to <strong>download the comparison results</strong> as a CSV or JSON file 
                                  for further analysis, record-keeping, or reporting.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Example Task: Compute 24 */}
                          <div className="bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 p-6 rounded-xl border-2">
                            <h5 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                              <Play className="h-5 w-5 text-rose-600" />
                              Let's Test: "Compute 24" Challenge
                            </h5>
                            
                            <div className="bg-background p-5 rounded-lg border mb-4">
                              <h6 className="font-semibold text-foreground mb-3">🧮 The Task</h6>
                              <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg">
                                <p className="text-foreground mb-2">
                                  <strong>Problem:</strong> Using the numbers <code className="bg-background px-2 py-1 rounded">5, 5, 5, 1</code>, 
                                  compute 24. You can use +, -, ×, ÷ and parentheses.
                                </p>
                                <div className="mt-3 p-3 bg-background rounded border">
                                  <p className="text-sm font-semibold text-foreground mb-2">✅ Correct Answer:</p>
                                  <code className="text-sm text-primary block">
                                    5 - (1/5) = 4.8<br/>
                                    4.8 × 5 = 24
                                  </code>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Or written more formally: (5 - 1÷5) × 5 = 24
                                  </p>
                                </div>
                              </div>
                            </div>

                            <Alert className="border-l-4 border-rose-500 bg-rose-50 dark:bg-rose-900/20">
                              <AlertCircle className="h-5 w-5 text-rose-600" />
                              <AlertDescription className="ml-2">
                                <p className="font-semibold mb-2">🎯 Your Task</p>
                                <ol className="text-sm text-foreground space-y-2 list-decimal ml-6">
                                  <li>Visit the <a href="https://openrouter-hub.lovable.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">LLM Tester app</a></li>
                                  <li>Select 3-5 different AI models from OpenRouter</li>
                                  <li>Enter the "Compute 24 out of 5, 5, 5, and 1" task</li>
                                  <li>Compare how each model approaches the problem</li>
                                  <li>Use the judge feature to evaluate which model performed best</li>
                                  <li>Download the results</li>
                                </ol>
                                <p className="text-sm text-foreground mt-3 italic">
                                  <strong>Discussion Point:</strong> Which models got it right? Which made calculation errors? 
                                  What does this tell us about AI's mathematical reasoning abilities?
                                </p>
                              </AlertDescription>
                            </Alert>
                          </div>

                          {/* UI Elements for Student Engagement */}
                          <div className="bg-background p-6 rounded-lg border-2">
                            <h5 className="text-xl font-bold text-foreground mb-4">🎓 Adapting UI Elements for Student Engagement</h5>
                            
                            <p className="text-foreground mb-4">
                              Now that you've explored the LLM Tester, consider how similar UI patterns can be used to create 
                              engaging learning tools for students:
                            </p>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="bg-primary/5 p-4 rounded-lg border">
                                <p className="font-semibold text-primary mb-2 flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Model Selection Interface
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  <strong>Adapt for:</strong> Multiple feedback styles (encouraging, critical, analytical) 
                                  or different rubric criteria for essay grading
                                </p>
                              </div>

                              <div className="bg-primary/5 p-4 rounded-lg border">
                                <p className="font-semibold text-primary mb-2 flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Side-by-Side Comparison
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  <strong>Adapt for:</strong> Showing students multiple revision suggestions for their writing, 
                                  or comparing different approaches to solving a problem
                                </p>
                              </div>

                              <div className="bg-primary/5 p-4 rounded-lg border">
                                <p className="font-semibold text-primary mb-2 flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4" />
                                  AI Judge/Evaluator
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  <strong>Adapt for:</strong> Automated scoring of student responses with detailed feedback, 
                                  or peer review simulation where AI provides evaluation criteria
                                </p>
                              </div>

                              <div className="bg-primary/5 p-4 rounded-lg border">
                                <p className="font-semibold text-primary mb-2 flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Download/Export Results
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  <strong>Adapt for:</strong> Students downloading their progress reports, 
                                  or teachers exporting class analytics and individual feedback
                                </p>
                              </div>
                            </div>

                            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-5 rounded-lg border-2">
                              <h6 className="font-bold text-foreground mb-3">💡 Brainstorm Session</h6>
                              <p className="text-sm text-foreground mb-3">
                                Think about your own teaching context. What kind of interactive GUI could you build using Lovable 
                                that would benefit your students? Consider:
                              </p>
                              <ul className="text-sm text-foreground space-y-2 list-disc ml-6">
                                <li>Automated essay feedback with multiple rubric criteria</li>
                                <li>Grammar practice exercises with instant AI corrections</li>
                                <li>Vocabulary quiz generator from student-uploaded texts</li>
                                <li>Research question validator for literature reviews</li>
                                <li>Citation format checker and corrector</li>
                              </ul>
                              <p className="text-sm text-foreground mt-4 italic">
                                In the next module, we'll explore how to use Lovable to turn these ideas into reality!
                              </p>
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
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>AI Agents vs Chatbots: Understanding the difference</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Setting up Trae IDE and API keys</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Input-Process-Output framework for batch processing</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Lab exercises: BAWE corpus analysis and literature screening</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Vibe Coding: Building apps with natural language</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Real-world applications for teaching and research</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

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

                  {/* Express Your Interest - Full Width Toggle */}
                  <Collapsible defaultOpen className="group">
                    <Card className="border-2 border-primary/50 overflow-hidden">
                      <CollapsibleTrigger className="w-full">
                        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground cursor-pointer hover:opacity-90 transition-opacity">
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                              <Sparkles className="h-5 w-5" />
                              Express Your Interest
                            </CardTitle>
                            <ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
                          </div>
                          <p className="text-sm text-primary-foreground/90 text-left">
                            Join our platform for AI-powered teaching and research
                          </p>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="p-6">
                          <WorkshopInterestForm />
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

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
                                  src={wechatGroupQR} 
                                  alt="Gen AI CoP 2 WeChat Group QR Code" 
                                  className="w-56 h-56 object-contain"
                                />
                              </div>
                              <p className="text-sm text-muted-foreground mt-3">Gen AI CoP 2</p>
                              <p className="text-xs text-amber-600 mt-1">Valid until 12/9</p>
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
