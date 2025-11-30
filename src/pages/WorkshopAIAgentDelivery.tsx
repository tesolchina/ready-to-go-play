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
                      </div>
                    </CardContent>
                  </Card>

                </TabsContent>

                {/* ACTIVITIES TAB */}
                <TabsContent value="activities" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Workshop Schedule (10:30 - 13:30)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                              1
                            </div>
                            <div className="h-full w-px bg-border mt-2"></div>
                          </div>
                          <div className="flex-1 pb-8">
                            <h3 className="font-semibold text-lg mb-1">Introduction (10:30 - 10:45)</h3>
                            <p className="text-muted-foreground mb-3">Welcome and overview of AI agents in research</p>
                            <ul className="space-y-1 text-sm text-foreground">
                              <li>• Workshop objectives and learning outcomes</li>
                              <li>• Brief introduction to IDE-embedded AI</li>
                              <li>• Setting expectations for hands-on activities</li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                              2
                            </div>
                            <div className="h-full w-px bg-border mt-2"></div>
                          </div>
                          <div className="flex-1 pb-8">
                            <h3 className="font-semibold text-lg mb-1">Setting Up Your AI Agent (10:45 - 11:15)</h3>
                            <p className="text-muted-foreground mb-3">Hands-on: Configure your first AI agent in an IDE</p>
                            <ul className="space-y-1 text-sm text-foreground">
                              <li>• Installing and configuring VS Code/Cursor</li>
                              <li>• Setting up AI extensions (GitHub Copilot, Continue, etc.)</li>
                              <li>• Understanding API keys and authentication</li>
                              <li>• Testing your first AI-assisted task</li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                              3
                            </div>
                            <div className="h-full w-px bg-border mt-2"></div>
                          </div>
                          <div className="flex-1 pb-8">
                            <h3 className="font-semibold text-lg mb-1">Research Applications (11:15 - 12:00)</h3>
                            <p className="text-muted-foreground mb-3">Practical demonstrations of AI agents for academic research</p>
                            <ul className="space-y-1 text-sm text-foreground">
                              <li>• Automating literature reviews and data collection</li>
                              <li>• Generating data analysis scripts</li>
                              <li>• Creating research tools without programming knowledge</li>
                              <li>• Building web scrapers for academic databases</li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                              4
                            </div>
                            <div className="h-full w-px bg-border mt-2"></div>
                          </div>
                          <div className="flex-1 pb-8">
                            <h3 className="font-semibold text-lg mb-1">Break (12:00 - 12:15)</h3>
                            <p className="text-muted-foreground">Refreshments and networking</p>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                              5
                            </div>
                            <div className="h-full w-px bg-border mt-2"></div>
                          </div>
                          <div className="flex-1 pb-8">
                            <h3 className="font-semibold text-lg mb-1">Hands-On Project (12:15 - 13:00)</h3>
                            <p className="text-muted-foreground mb-3">Work on your own research task with AI assistance</p>
                            <ul className="space-y-1 text-sm text-foreground">
                              <li>• Choose a research challenge from your field</li>
                              <li>• Apply AI agent techniques to solve it</li>
                              <li>• Instructor support and troubleshooting</li>
                              <li>• Share results with the group</li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                              6
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">Wrap-Up & Q&A (13:00 - 13:30)</h3>
                            <p className="text-muted-foreground mb-3">Discussion, questions, and next steps</p>
                            <ul className="space-y-1 text-sm text-foreground">
                              <li>• Key takeaways and best practices</li>
                              <li>• Resources for continued learning</li>
                              <li>• Community and support channels</li>
                              <li>• Post-workshop activities</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        Hands-On Exercises
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Exercise 1: Your First AI-Generated Script</h3>
                          <p className="text-muted-foreground mb-2">
                            Use an AI agent to create a simple Python script that extracts data from a CSV file
                          </p>
                          <div className="p-3 bg-muted rounded text-sm">
                            <strong>Task:</strong> Ask the AI to create a script that reads a research dataset and generates summary statistics
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">Exercise 2: Literature Review Automation</h3>
                          <p className="text-muted-foreground mb-2">
                            Build a tool that searches academic databases and organizes results
                          </p>
                          <div className="p-3 bg-muted rounded text-sm">
                            <strong>Task:</strong> Create a web scraper for Google Scholar or similar platform with AI assistance
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">Exercise 3: Personal Research Project</h3>
                          <p className="text-muted-foreground mb-2">
                            Apply AI agents to your own research challenge
                          </p>
                          <div className="p-3 bg-muted rounded text-sm">
                            <strong>Task:</strong> Bring your research problem and work with the AI agent to develop a solution
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* REFLECTION TAB */}
                <TabsContent value="reflection" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Post-Workshop Reflection
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Take a moment to reflect on what you learned and how you can apply it to your research:
                      </p>
                      
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg space-y-2">
                          <h3 className="font-semibold">1. What was your biggest takeaway?</h3>
                          <p className="text-sm text-muted-foreground">
                            Consider the most valuable insight or technique you learned during the workshop
                          </p>
                        </div>

                        <div className="p-4 border rounded-lg space-y-2">
                          <h3 className="font-semibold">2. How will you apply AI agents in your research?</h3>
                          <p className="text-sm text-muted-foreground">
                            Identify specific research tasks where AI agents could save time or improve quality
                          </p>
                        </div>

                        <div className="p-4 border rounded-lg space-y-2">
                          <h3 className="font-semibold">3. What challenges did you encounter?</h3>
                          <p className="text-sm text-muted-foreground">
                            Note any difficulties so you can seek solutions or clarification
                          </p>
                        </div>

                        <div className="p-4 border rounded-lg space-y-2">
                          <h3 className="font-semibold">4. What would you like to learn more about?</h3>
                          <p className="text-sm text-muted-foreground">
                            Identify areas for deeper exploration or advanced techniques
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Next Steps & Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-3">Recommended Actions (Week 1)</h3>
                        <ul className="space-y-2 text-foreground">
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>Practice using AI agents for at least one research task per day</span>
                          </li>
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>Experiment with different prompting techniques</span>
                          </li>
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>Build a simple automation for your workflow</span>
                          </li>
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>Share your experiences with colleagues</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Learning Resources</h3>
                        <div className="space-y-2">
                          <div className="p-3 border rounded-lg">
                            <strong className="block mb-1">Official Documentation</strong>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                              <li>• GitHub Copilot Docs: <a href="https://docs.github.com/copilot" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">docs.github.com/copilot</a></li>
                              <li>• Continue Dev: <a href="https://continue.dev/docs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">continue.dev/docs</a></li>
                              <li>• VS Code AI Extensions: <a href="https://marketplace.visualstudio.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">marketplace.visualstudio.com</a></li>
                            </ul>
                          </div>

                          <div className="p-3 border rounded-lg">
                            <strong className="block mb-1">Community & Support</strong>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                              <li>• Workshop discussion forum (link provided via email)</li>
                              <li>• Monthly follow-up sessions</li>
                              <li>• Peer learning group</li>
                            </ul>
                          </div>

                          <div className="p-3 border rounded-lg">
                            <strong className="block mb-1">Advanced Topics</strong>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                              <li>• Building custom AI agents for specific domains</li>
                              <li>• Integrating AI with research databases</li>
                              <li>• Ethical considerations in AI-assisted research</li>
                              <li>• Reproducibility and documentation best practices</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Stay Connected</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Join our community and stay updated on future workshops and resources:
                      </p>
                      
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Join Discussion Forum
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Mail className="h-4 w-4 mr-2" />
                          Subscribe to Newsletter
                        </Button>
                      </div>

                      <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                        <p className="text-sm font-semibold mb-2">Feedback & Questions</p>
                        <p className="text-sm text-muted-foreground">
                          Contact us at <a href="mailto:qesschatbots@cpce-polyu.edu.hk" className="text-primary hover:underline">qesschatbots@cpce-polyu.edu.hk</a> with any questions or feedback about the workshop.
                        </p>
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

export default WorkshopAIAgentDelivery;
