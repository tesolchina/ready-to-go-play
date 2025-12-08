import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, Mail, Phone, Globe, Monitor, ChevronDown, ExternalLink, BookOpen, Archive } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import workshopPoster from "@/assets/ai-agent-workshop-poster.jpg";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const WorkshopAIAgentArchive3Dec = () => {
  const [registrationOpen, setRegistrationOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold lg:hidden">Workshop Archive</h2>
          </header>
          <div className="p-8">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Archive Notice */}
              <Alert className="border-muted-foreground/50 bg-muted/50">
                <Archive className="h-4 w-4" />
                <AlertDescription>
                  <strong>Archived Workshop</strong> - This workshop was held on December 3, 2025. Materials are preserved for reference.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium">
                    Completed
                  </span>
                  <span className="text-muted-foreground">December 3, 2025</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Leveraging AI Agents in Integrated Development Environments
                </h1>
                <p className="text-xl text-muted-foreground">
                  A New Paradigm for Academic Research and Writing
                </p>
                <div className="inline-block px-4 py-2 bg-muted text-muted-foreground rounded-lg font-semibold">
                  QESS WORKSHOP - PolyU West Kowloon Campus
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
                      {/* Workshop Poster */}
                      <div className="rounded-lg overflow-hidden border">
                        <img 
                          src={workshopPoster} 
                          alt="AI Agent Workshop Poster - December 3, 2025" 
                          className="w-full h-auto"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="grid gap-4">
                          <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                            <div>
                              <p className="font-medium">Date</p>
                              <p className="text-muted-foreground">December 3, 2025</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                            <div>
                              <p className="font-medium">Time</p>
                              <p className="text-muted-foreground">10:30 - 13:30</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                            <div>
                              <p className="font-medium">Location</p>
                              <p className="text-muted-foreground">N1104, 14/F, PolyU West Kowloon Campus</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Monitor className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                            <div>
                              <p className="font-medium">Format</p>
                              <p className="text-muted-foreground">In-person and online via Microsoft Teams</p>
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

                        <div className="pt-4 border-t">
                          <h3 className="font-semibold mb-3">Contact Information</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">3746 0065</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">qesschatbots@cpce-polyu.edu.hk</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <a 
                                href="https://www.cpce-polyu.edu.hk/qess/chatbot" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                www.cpce-polyu.edu.hk/qess/chatbot
                              </a>
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
                    This workshop introduced IDE-embedded AI agents as a powerful alternative to browser-based AI interactions for academic research. Unlike traditional chatbots that require constant context-switching, AI agents within Integrated Development Environments can directly access, read, and edit project files, perform web searches, and generate code to automate research tasks.
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

              {/* Moderator Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Moderator</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-semibold mb-2">Dr Peggy Ng</h3>
                  <p className="text-muted-foreground">
                    Head of Department (Business), Hong Kong Institute of Vocational Education
                  </p>
                </CardContent>
              </Card>

              {/* Workshop Materials */}
              <Card className="border-muted">
                <CardHeader>
                  <CardTitle>Archived Workshop Materials</CardTitle>
                  <CardDescription>Access materials from this completed workshop</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    View the complete participant guide including preparation materials, workshop activities, and resources.
                  </p>
                  <Button asChild variant="outline" className="w-full sm:w-auto">
                    <Link to="/workshops/ai-agent-workshop/archive/3dec/delivery">
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Workshop Materials
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Link to current workshop */}
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle>Upcoming Workshop</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Looking for the next AI Agent workshop? Check out our upcoming session.
                  </p>
                  <Button asChild className="w-full sm:w-auto">
                    <Link to="/workshops/ai-agent-workshop">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Current Workshop
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default WorkshopAIAgentArchive3Dec;
