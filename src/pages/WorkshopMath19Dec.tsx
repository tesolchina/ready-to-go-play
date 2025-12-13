import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, Globe, Monitor, ChevronDown, ExternalLink, BookOpen, GraduationCap, FolderPlus, Code, QrCode } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";

const WorkshopMath19Dec = () => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [prepOpen, setPrepOpen] = useState(true);
  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  const WORKSHOP_PAGE_URL = "https://eapteacher.smartutor.me/workshops/math-19dec";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold lg:hidden">Workshop</h2>
          </header>
          <div className="p-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    Upcoming
                  </span>
                  <span className="text-muted-foreground">December 19, 2025</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Leveraging AI Agents in Integrated Development Environments
                </h1>
                <p className="text-xl text-muted-foreground">
                  A New Paradigm for Academic Research and Writing
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-lg font-semibold">
                    BNBU Zhuhai
                  </span>
                  <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-lg font-semibold">
                    Math Master Students
                  </span>
                </div>
              </div>

              {/* QR Code Toggle */}
              <div className="flex justify-center">
                <Button 
                  variant="outline"
                  onClick={() => setQrCodeVisible(!qrCodeVisible)}
                  className="gap-2"
                >
                  <QrCode className="h-4 w-4" />
                  {qrCodeVisible ? 'Hide' : 'Show'} QR Code
                </Button>
              </div>

              {/* QR Code Section */}
              {qrCodeVisible && (
                <Card>
                  <CardHeader>
                    <CardTitle>Share this Workshop</CardTitle>
                    <CardDescription>Scan QR code to access this page</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-4">
                    <div className="p-6 bg-white rounded-lg">
                      <QRCode 
                        value={WORKSHOP_PAGE_URL}
                        size={256}
                        level="H"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      {WORKSHOP_PAGE_URL}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Simple Preparation - VS Code + Copilot Already Installed */}
              <Card className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-green-500/10">
                <Collapsible open={prepOpen} onOpenChange={setPrepOpen}>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full flex items-center justify-between p-6 h-auto hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Code className="h-5 w-5 text-green-600" />
                        <span className="text-lg font-semibold">Preparation (Simplified)</span>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${prepOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-6 pt-0">
                      <div className="p-4 bg-green-500/10 rounded-lg border-l-4 border-green-500">
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">
                          ✓ You already have VS Code and GitHub Copilot installed!
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <FolderPlus className="h-4 w-4" />
                          Only Prep: Create Workshop Folder
                        </h4>
                        <ol className="space-y-3 text-sm">
                          <li className="flex gap-2">
                            <span className="font-semibold text-primary">1.</span>
                            <span>Create a new folder on your computer, named "Math19Dec" or similar</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold text-primary">2.</span>
                            <span>Open this folder in VS Code</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold text-primary">3.</span>
                            <span>During the workshop, we'll use GitHub Copilot for "vibe coding" demo</span>
                          </li>
                        </ol>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>Tip:</strong> Since your development environment is already set up, we can jump straight into the core content—using AI agents for research and writing assistance.
                        </p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Event Details */}
              <Card>
                <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full flex items-center justify-between p-6 h-auto hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5" />
                        <span className="text-lg font-semibold">Event Details</span>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${detailsOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-6 pt-0">
                      <div className="grid gap-4">
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                          <div>
                            <p className="font-medium">Date</p>
                            <p className="text-muted-foreground">December 19, 2025 (Friday)</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                          <div>
                            <p className="font-medium">Time</p>
                            <p className="text-muted-foreground">Afternoon (TBA)</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                          <div>
                            <p className="font-medium">Location</p>
                            <p className="text-muted-foreground">Beijing Normal University-Hong Kong Baptist University United International College, Zhuhai</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <GraduationCap className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                          <div>
                            <p className="font-medium">Audience</p>
                            <p className="text-muted-foreground">Math Master Students</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Monitor className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                          <div>
                            <p className="font-medium">Format</p>
                            <p className="text-muted-foreground">In-person workshop with hands-on activities</p>
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
                </CardContent>
              </Card>

              {/* Key Takeaways */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Takeaways</CardTitle>
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
                      <span><strong>Generate research tools:</strong> Create analysis scripts without programming experience</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Vibe coding with Copilot:</strong> Experience coding with natural language using GitHub Copilot</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Streamline workflows:</strong> Integrate AI assistance into existing research processes</span>
                    </li>
                  </ul>
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

              {/* Workshop Materials */}
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle>For Participants</CardTitle>
                  <CardDescription>Access workshop materials and activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Participants can access the complete guide including preparation materials, workshop activities, and follow-up resources.
                  </p>
                  <Button asChild className="w-full sm:w-auto">
                    <Link to="/workshops/math-19dec/delivery">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Access Workshop Materials
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Previous Workshops */}
              <Card className="border-muted">
                <CardHeader>
                  <CardTitle>Previous Workshops</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground mb-4">
                    View materials from previous AI Agent workshops.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/workshops/ai-agent-workshop/archive/11dec">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Dec 11 - BNBU
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/workshops/ai-agent-workshop/archive/3dec">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Dec 3 - PolyU
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default WorkshopMath19Dec;
