import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Laptop, Lightbulb, MessageSquare, ArrowLeft, Mail, ChevronDown, Terminal } from "lucide-react";
import traeIdeInterface from "@/assets/trae-ide-interface.png";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
                              <div className="p-4 bg-background rounded-lg border-4 border-accent shadow-lg">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-3 h-3 rounded-full bg-accent" />
                                  <h4 className="font-bold text-accent">Middle Panel</h4>
                                </div>
                                <p className="text-base font-bold mb-2 text-foreground">Editor Area</p>
                                <ul className="space-y-1 text-sm font-semibold text-foreground">
                                  <li>✏️ Read files</li>
                                  <li>📝 Edit files</li>
                                  <li>💾 Save changes</li>
                                </ul>
                              </div>

                              {/* Right Panel - Full Height */}
                              <div className="row-span-2 p-4 bg-background rounded-lg border-4 border-secondary shadow-lg">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-3 h-3 rounded-full bg-secondary" />
                                  <h4 className="font-bold text-secondary">Right Panel</h4>
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
