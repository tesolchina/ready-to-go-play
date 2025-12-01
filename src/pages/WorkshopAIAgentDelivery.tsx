import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Laptop, Lightbulb, MessageSquare, ArrowLeft, Mail, ChevronDown, Terminal, Zap, ChevronUp, FileText, BookOpen } from "lucide-react";
import traeIdeInterface from "@/assets/trae-ide-interface.png";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

  useEffect(() => {
    setActiveTab(getTabFromHash(location.hash));
  }, [location.hash]);

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
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold">Workshop Delivery</h2>
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
                              <p className="text-sm text-muted-foreground mt-1">May require payment</p>
                            </div>
                          </li>
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>OpenRouter</strong> - <a href="https://openrouter.ai/settings/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">openrouter.ai/settings/keys</a>
                              <p className="text-sm text-muted-foreground mt-1">May require payment</p>
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
                  {/* Module 1: Conceptual Understanding */}
                  <Collapsible defaultOpen>
                    <Card>
                      <CardHeader>
                        <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-80 transition-opacity">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5" />
                            <CardTitle>Module 1: Conceptual Understanding</CardTitle>
                          </div>
                          <ChevronDown className="h-5 w-5 transition-transform duration-200 data-[state=open]:rotate-180" />
                        </CollapsibleTrigger>
                        <p className="text-lg text-muted-foreground mt-2">
                          Two Ways to Communicate with AI
                        </p>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="space-y-6">
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
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Module 2: Get Familiar with IDE */}
                  <Collapsible defaultOpen>
                    <Card>
                      <CardHeader>
                        <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-80 transition-opacity">
                          <div className="flex items-center gap-2">
                            <Laptop className="h-5 w-5" />
                            <CardTitle>Module 2: Get Familiar with IDE</CardTitle>
                          </div>
                          <ChevronDown className="h-5 w-5 transition-transform duration-200 data-[state=open]:rotate-180" />
                        </CollapsibleTrigger>
                        <p className="text-lg text-muted-foreground mt-2">
                          Understanding the IDE Interface
                        </p>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="space-y-6">
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
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Transitional Task: Clone Workshop Repository */}
                  <Collapsible defaultOpen={false}>
                    <Card className="border-2 border-amber-200 dark:border-amber-800">
                      <CardHeader>
                        <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-80 transition-opacity">
                          <div className="flex items-center gap-2">
                            <Terminal className="h-5 w-5 text-amber-600" />
                            <CardTitle>First Hands-On Task: Clone the Workshop Repository</CardTitle>
                          </div>
                          <ChevronDown className="h-5 w-5 transition-transform duration-200 data-[state=open]:rotate-180" />
                        </CollapsibleTrigger>
                        <p className="text-lg text-muted-foreground mt-2">
                          Let Builder handle Git commands for you
                        </p>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="space-y-6">
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
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Module 3: The Input-Process-Output Model */}
                  <Collapsible defaultOpen={false}>
                    <Card>
                      <CardHeader>
                        <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-80 transition-opacity">
                          <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            <CardTitle>Module 3: Hands-On Lab - The Input-Process-Output Model</CardTitle>
                          </div>
                          <ChevronDown className="h-5 w-5 transition-transform duration-200 data-[state=open]:rotate-180" />
                        </CollapsibleTrigger>
                        <p className="text-lg text-muted-foreground mt-2">
                          Apply the Input-Process-Output model with real data
                        </p>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="space-y-6">
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
graph TD
    A[📁 Locate Lab1_Explore_BAWE Folder] --> B[📝 Open instructions.md File]
    B --> C[📥 Define Input: Right-click CORPUS_ByDiscipline folder]
    C --> D[📋 Copy Folder Path]
    D --> E[✏️ Paste Path in Input Section]
    E --> F[⚙️ Write Process Instructions in Natural Language]
    F --> G[📤 Define Output Destination]
    G --> H[💾 Save instructions.md File]
    H --> I[📄 Right-click instructions.md File]
    I --> J[📋 Copy File Path]
    J --> K[💬 Open Right Panel - AI Agent Chat]
    K --> L["🤖 Type: 'Please follow the instructions in [file path]'"]
    L --> M[⏎ Send Message to Builder]
    M --> N[🔍 Builder Reads Instructions]
    N --> O[📊 Builder Accesses Input Data]
    O --> P[⚡ Builder Processes & Analyzes]
    P --> Q[✅ Builder Creates Output Folder & Files]
    Q --> R[🎉 View Results in Lab1_Results Folder]
    
    style A fill:#e3f2fd
    style B fill:#e3f2fd
    style C fill:#f3e5f5
    style D fill:#f3e5f5
    style E fill:#f3e5f5
    style F fill:#e1f5fe
    style G fill:#e8f5e9
    style H fill:#fff3e0
    style I fill:#fff3e0
    style J fill:#fff3e0
    style K fill:#fce4ec
    style L fill:#fce4ec
    style M fill:#fce4ec
    style N fill:#e0f2f1
    style O fill:#e0f2f1
    style P fill:#e0f2f1
    style Q fill:#f1f8e9
    style R fill:#c8e6c9
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
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Break & Reflection Section */}
                  <Card className="border-2 border-amber-500 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
                        <ChevronUp className="h-5 w-5" />
                        Take a Break - Let's Reflect
                      </CardTitle>
                    </CardHeader>
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
                  </Card>

                  {/* Module 4: API Keys and Multiple Files */}
                  <Collapsible defaultOpen={false}>
                    <Card>
                      <CardHeader>
                        <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-80 transition-opacity">
                          <div className="flex items-center gap-2">
                            <Terminal className="h-5 w-5" />
                            <CardTitle>Module 4: Setting Up API Keys & Sending Multiple Files</CardTitle>
                          </div>
                          <ChevronDown className="h-5 w-5 transition-transform duration-200 data-[state=open]:rotate-180" />
                        </CollapsibleTrigger>
                        <p className="text-lg text-muted-foreground mt-2">
                          Connect to LLM services and scale up your AI agent capabilities
                        </p>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="space-y-6">
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
                                    For this workshop, the free API credits from providers like Kimi (CNY 15) or DeepSeek are more than enough. 
                                    You'll typically spend only a few cents per request for most tasks.
                                  </p>
                                </AlertDescription>
                              </Alert>
                            </div>
                          </div>

                          {/* Setting Up API Keys - Coming in hands-on activity */}
                          <Alert className="border-l-4 border-primary bg-primary/5">
                            <Terminal className="h-5 w-5 text-primary" />
                            <AlertDescription className="ml-2">
                              <p className="font-semibold mb-2">⏭️ Next Steps</p>
                              <p className="text-sm text-foreground">
                                In the next hands-on activity, we'll guide you through setting up your API keys in Trae and 
                                using Builder to work with multiple files simultaneously. This will unlock more powerful workflows!
                              </p>
                            </AlertDescription>
                          </Alert>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Workshop Presentation */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5" />
                          Workshop Presentation
                        </span>
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href="https://www.canva.cn/design/DAG5alUXgk8/H473seyr_viIf66Rs_vyUg/edit?utm_content=DAG5alUXgk8&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            Edit (Workshop Leader)
                          </a>
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video w-full">
                        <iframe
                          loading="lazy"
                          className="w-full h-full border-0 rounded-lg"
                          src="https://www.canva.cn/design/DAG5alUXgk8/E5fFCmHYMgZd3mbNyKAUbg/view?embed"
                          allow="fullscreen"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">
                        Follow along with the presentation during the workshop. Use the navigation controls to move through the slides.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* REFLECTION TAB */}
                <TabsContent value="reflection" className="space-y-6">
                  <Alert>
                    <MessageSquare className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Work in Progress:</strong> Post-workshop reflection materials are being prepared. Please check back soon for updates!
                    </AlertDescription>
                  </Alert>
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
