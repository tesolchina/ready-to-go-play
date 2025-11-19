import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BookOpen, FileText, CheckCircle, Plus } from "lucide-react";

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
      title: "Lesson Creator",
      description: "Build custom lessons with AI assistance tailored to your teaching objectives and student needs.",
      icon: Plus,
      path: "/lesson-creator",
      category: "Teaching Tools"
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Learning Apps</h1>
              <p className="text-xl text-muted-foreground">
                AI-powered tools to enhance your teaching and students' learning
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </main>
      </div>
    </SidebarProvider>
  );
};

export default LearningApps;
