import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BookOpen, FileText, CheckCircle } from "lucide-react";

const Home = () => {
  const chatbots = [
    {
      title: "Phrase Bank",
      description: "Get AI-powered suggestions for academic phrases and sentence structures tailored to your writing context.",
      icon: BookOpen,
      path: "/academic-phrasebank",
    },
    {
      title: "Pattern Analyst",
      description: "Analyze text patterns and generate structured content based on your academic writing style.",
      icon: FileText,
      path: "/pattern-analyzer",
    },
    {
      title: "Reference Validator",
      description: "Validate your academic references and ensure they meet proper citation standards.",
      icon: CheckCircle,
      path: "/validate-references",
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col items-center justify-center space-y-12">
              <div className="text-center space-y-4">
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                  AI Learning Hub for EAP Teachers
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Empowering English for Academic Purposes educators with AI-powered tools for lesson creation, writing support, and academic resources.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-12">
                {chatbots.map((chatbot) => (
                  <Link key={chatbot.path} to={chatbot.path} className="group">
                    <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                          <chatbot.icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle>{chatbot.title}</CardTitle>
                        <CardDescription>{chatbot.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Home;
