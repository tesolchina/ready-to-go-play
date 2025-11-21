import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BookOpen, FileText, CheckCircle, Plus, BookMarked } from "lucide-react";

const LearningApps = () => {
  const apps = [
    {
      title: "Academic PhraseBank",
      description: "Get AI-powered assistance with academic writing phrases and expressions tailored to your context.",
      icon: BookOpen,
      path: "/academic-phrasebank",
      category: "Writing Support"
    },
    {
      title: "Pattern Analyzer",
      description: "Analyze text patterns and generate structured content based on academic writing conventions.",
      icon: FileText,
      path: "/pattern-analyzer",
      category: "Text Analysis"
    },
    {
      title: "Reference Validator",
      description: "Validate DOI references and ensure your citations meet proper academic standards.",
      icon: CheckCircle,
      path: "/validate-references",
      category: "Citation Tools"
    },
    {
      title: "Wiley AI Guidelines",
      description: "Explore AI guidelines from Wiley and major publishers with an interactive chatbot that answers your questions.",
      icon: BookMarked,
      path: "/wiley-ai-guidelines",
      category: "Research Ethics"
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold">Learning Apps</h2>
          </header>
          <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col items-center justify-center space-y-12">
              <div className="text-center space-y-4">
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                  Specialized AI Learning Apps
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Beyond generic AI chatbots, we develop purpose-built learning applications that integrate AI in specialized ways for academic writing and EAP instruction. Each app is designed to address specific pedagogical needs through structured workflows, targeted feedback systems, and discipline-aware assistance tailored for university teachers and students.
                </p>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mt-12">
              {apps.map((app) => (
                <Link key={app.path} to={app.path} className="group">
                  <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02]">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                          <app.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="mb-2">
                            <span className="px-2 py-1 bg-secondary/10 text-secondary-foreground rounded-md text-xs font-medium">
                              {app.category}
                            </span>
                          </div>
                          <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                            {app.title}
                          </CardTitle>
                          <CardDescription>{app.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>

              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle>More Tools Coming Soon</CardTitle>
                  <CardDescription>
                    We're continuously developing new AI-powered tools to support EAP teaching and learning. 
                    Stay tuned for updates!
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default LearningApps;
