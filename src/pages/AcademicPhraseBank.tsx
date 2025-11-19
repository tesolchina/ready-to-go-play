import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BookOpen, Sparkles } from "lucide-react";

const AcademicPhraseBank = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold">Academic Phrasebank</h2>
          </header>
          <div className="p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Academic Phrasebank</h1>
              <p className="text-xl text-muted-foreground">
                Choose your learning path: practice with exercises or get customised AI assistance
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Phrasebank Exercises */}
              <Link to="/academic-phrasebank/exercises">
                <Card className="border-2 border-primary hover:shadow-xl transition-all h-full">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                      <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">
                      Phrasebank Exercises
                    </CardTitle>
                    <CardDescription className="text-base">
                      Practice academic writing with structured exercises
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Work through interactive exercises designed to help you master academic phrases and sentence structures. Perfect for building your academic writing skills step by step.
                      </p>
                      <ul className="text-sm space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Guided practice with academic sentence patterns</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Exercises organized by moves and functions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Build confidence with structured learning</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Customised Phrasebank */}
              <Link to="/academic-phrasebank/custom">
                <Card className="border-2 border-accent hover:shadow-xl transition-all h-full">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-2">
                      <Sparkles className="w-8 h-8 text-accent" />
                    </div>
                    <CardTitle className="text-2xl">
                      Customised Phrasebank
                    </CardTitle>
                    <CardDescription className="text-base">
                      Get AI-powered personalised writing assistance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Chat with an AI assistant that analyses your writing and provides context-aware suggestions from the academic phrasebank. Get instant, personalised help tailored to your needs.
                      </p>
                      <ul className="text-sm space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-1">•</span>
                          <span>AI-powered paragraph analysis</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-1">•</span>
                          <span>Context-aware phrase suggestions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-1">•</span>
                          <span>Interactive chat with instant feedback</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AcademicPhraseBank;
