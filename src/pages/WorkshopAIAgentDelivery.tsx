import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Laptop, Lightbulb, MessageSquare, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const WorkshopAIAgentDelivery = () => {
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

              <Tabs defaultValue="preparation" className="w-full">
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

                </TabsContent>

                {/* ACTIVITIES TAB */}
                <TabsContent value="activities" className="space-y-6">
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Work in Progress:</strong> Workshop activities are being finalized. Please check back soon for updates!
                    </AlertDescription>
                  </Alert>
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
